<template>
  <div
    class="h-screen bg-gradient-to-b from-[#E8F4F2] to-white flex flex-col overflow-hidden w-full"
  >
    <nav
      class="bg-[#E8F4F2] h-16 sm:h-20 lg:h-24 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm w-full flex-shrink-0"
    >
      <!-- Дата и время -->
      <div class="text-[#11AE78] font-bold text-lg sm:text-xl lg:text-2xl leading-tight">
        <div>{{ currentTime }}</div>
        <div class="text-[#14865E] text-sm sm:text-base lg:text-lg font-bold">
          {{ currentDate }}
        </div>
      </div>
      
      <!-- Пустое место для баланса -->
      <div class="w-20 sm:w-24 lg:w-28"></div>
    </nav>

    <!-- Видео в правом верху (как в ServiceView) -->
    <div
      class="fixed z-50"
      :style="{ top: '0.5rem', right: '1rem' }"
    >
      <div class="w-[calc(5rem+10px)] h-[calc(5rem+10px)] sm:w-[calc(6rem+10px)] sm:h-[calc(6rem+10px)] lg:w-[calc(7rem+10px)] lg:h-[calc(7rem+10px)] rounded-full border-2 border-[#C5E6DC] overflow-hidden shadow-lg bg-white video-glow">
        <video 
          autoplay 
          muted 
          loop 
          class="object-cover"
          style="width: 105%; height: 105%; margin: -2.5% 0 0 -2.5%; object-fit: cover; object-position: center; filter: contrast(1.1) brightness(1.05) saturate(1.1) sharpen(0.5);"
        >
          <source src="/src/assets/idle.mp4" type="video/mp4">
        </video>
      </div>
    </div>

    <main class="flex-1 flex flex-col bg-white overflow-hidden">
      <CheckIin />
      <div class="flex-1 bg-[#E8F4F2] flex flex-col overflow-hidden mt-2 rounded-t-xl">
        <div class="text-black font-bold text-xl my-4">
          {{ doctors[0]?.specialty }}
        </div>

        <!-- Таб меню -->
        <a-tabs v-model:activeKey="activeTab" class="custom-tabs bg-white p-3 rounded shadow mt-4">
          <!-- ОСМС -->
          <a-tab-pane key="osms" tab=" Услуга по ОСМС ">
            <a-table
              :columns="columnsOSMS"
              :data-source="doctors"
              :loading="loading"
              row-key="id"
              bordered
              :pagination="false"
              :rowClassName="rowClassName"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                  <div>
                    <div>{{ record.schedule_string }}</div>
                    <div  class="border-2 border-[#11AE78] rounded-full px-4 py-2 text-[#11AE78] font-bold w-fit" @click="openScheduleModal(record)">
                      Записаться
                    </div>
                  </div>
                </template>
              </template>
            </a-table>
          </a-tab-pane>

          <!-- Платная услуга -->
          <a-tab-pane key="paid" tab="Платная услуга">
            <a-table
              :columns="columnsPaid"
              :data-source="paidDoctors"
              row-key="id"
              bordered
              :pagination="false"
              :rowClassName="rowClassName"
            >
              <template #bodyCell="{ column }">
                <template v-if="column.key === 'action'">
                  <div class="flex items-center">
                    <div  class="border-2 border-[#11AE78] rounded-full px-4 py-2 text-[#11AE78] font-bold w-fit">
                      Записаться
                    </div>
                  <div  class="ml-2 custom-green-btn rounded-full w-8 h-8 flex items-center justify-center text-white">?</div>
                  </div>
                </template>
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </div>
    </main>

    <FooterNav :showHomeButton="true" />
    <SchedulePage v-model:visible="visible" :doctor="doctor" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDateTime } from "../composables/useDateTime";
import { DoctorsApi, type Doctor } from "../api/doctors";
import FooterNav from "../components/FooterNav.vue";
import CheckIin from "./CheckIin.vue";
import SchedulePage from "../components/SchedulePage.vue";
const route = useRoute();
const { currentDate, currentTime } = useDateTime();
const isLoading = ref(false);
const error = ref<string | null>(null);
const doctors = ref<Doctor[]>([]);
const activeTab = ref<"osms" | "paid">("osms");
const specialityId = ref<string | null>(
  (route.query.speciality_id as string) || null
);

const loading = ref(false);
const visible = ref(false);
const doctor = ref<Doctor | null>(null);
// Колонки для ОСМС
const columnsOSMS = [
  { title: "ФИО врача", dataIndex: "full_name", key: "full_name", width: "20%" },
  { title: "Специальность", dataIndex: "specialty", key: "specialty" , width: "20%" },
  { title: "Кабинет", dataIndex: "cabinet", key: "cabinet" , width: "20%" },
  { title: "Часы работы", key: "action" },
];

// Колонки для платных услуг
const columnsPaid = [
  { title: "Название", dataIndex: "full_name", key: "full_name" },
  { title: "Услуга", dataIndex: "specialty", key: "specialty" },
  { title: "Стоимость (1-ый приём)", dataIndex: "first_price", key: "first_price" },
  { title: "Стоимость (последующий)", dataIndex: "next_price", key: "next_price" },
  { title: "", key: "action" },
];

// Мок-данные платных услуг
const paidDoctors = ref([
  { id: 201, full_name: "Окулист", specialty: "Консультация", first_price: 6000, next_price: 5000 },
  { id: 202, full_name: "Детский окулист", specialty: "Консультация", first_price: 6000, next_price: 5000 },
]);

// Функция для зебры строк
function rowClassName(_: any, index: number) {
  return index % 2 === 0 ? "row-light" : "row-white";
}

// Загрузка данных ОСМС
onMounted(async () => {
  fetchDoctors();
});
async function fetchDoctors() {
  if (!specialityId.value) return;
  isLoading.value = true;
  error.value = null;

  try {
    const params = { specialty_id: specialityId.value, clinic_id: "3" };
    const res = await DoctorsApi("", params, "GET");
    const payload = res?.data ?? res;

    doctors.value = Array.isArray(payload)
      ? payload
      : Array.isArray(payload.doctors)
      ? payload.doctors
      : payload.items ?? [];
  } catch (err: any) {
    error.value = err?.response?.data?.message ?? err.message ?? String(err);
  } finally {
    isLoading.value = false;
  }
}
function openScheduleModal(selectedDoctor: Doctor) {
  console.log('🎯 openScheduleModal вызван с доктором:', selectedDoctor);
  doctor.value = selectedDoctor;
  visible.value = true;
  console.log('🎯 visible.value установлен в:', visible.value);
  console.log('🎯 doctor.value установлен в:', doctor.value);
}
</script>

<style>
/* Зеленые табы */
.custom-tabs .ant-tabs-nav .ant-tabs-tab-active {
  background-color: #11ae78 !important;
  border-radius: 6px;
}
.custom-tabs .ant-tabs-nav .ant-tabs-tab-active .ant-tabs-tab-btn {
  color: #fff !important;
  font-weight: bold;
}
.custom-tabs .ant-tabs-nav .ant-tabs-tab {
  background-color: #f5f5f5;
  border-radius: 6px;
  margin-right: 8px;
  padding: 10px 20px;

}
.custom-tabs .ant-tabs-nav .ant-tabs-tab-btn {
  color: #333;
}

/* Заголовки таблицы */
.ant-table-thead > tr > th {
  
  color: #11ae78  !important;
  font-weight: bold;
}

/* Зебра-строки */
.row-light {
  background-color: #f2fdf9 !important;
}
.row-white {
  background-color: #ffffff !important;
}

/* Кнопки */
.custom-green-btn {
  background-color: #11ae78 !important;
  border-color: #11ae78 !important;
  color: #fff !important;
}
.question-btn {
  border: 1px solid #11ae78 !important;
  color: #11ae78 !important;
  font-weight: bold;
}

/* Анимация свечения видео */
.video-glow {
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(197, 230, 220, 0.6), 0 2px 8px rgba(17, 174, 120, 0.1);
  }
  50% {
    box-shadow: 0 4px 25px rgba(197, 230, 220, 0.8), 0 2px 12px rgba(17, 174, 120, 0.2);
  }
}
</style>

