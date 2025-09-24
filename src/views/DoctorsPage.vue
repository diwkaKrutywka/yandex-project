<template>
  <div
    class="h-screen bg-gradient-to-b from-[#E8F4F2] to-white flex flex-col w-full"
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

    <main class="flex-1 flex flex-col bg-white pb-20">
      <CheckIin />
      <div class="flex-1 bg-[#E8F4F2] flex flex-col mt-2 rounded-t-xl">
        <div class="text-black font-bold text-xl my-4">
          {{ doctors[0]?.specialty }}
        </div>

        <!-- Таб меню -->
        <a-tabs v-model:activeKey="activeTab" class="custom-tabs bg-white p-3 rounded shadow mt-4 flex-1">
          <!-- ОСМС -->
          <a-tab-pane key="osms" tab=" Услуга по ОСМС ">
            <div class="table-container">
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
            </div>
          </a-tab-pane>

          <!-- Платная услуга -->
          <a-tab-pane key="paid" tab="Платная услуга">
            <div class="table-container">
              <a-table
                :columns="columnsPaid"
                :data-source="paidDoctors"
                row-key="id"
                bordered
                :pagination="false"
                :rowClassName="rowClassName"
              >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                  <div class="flex items-center">
                    <div  class="border-2 border-[#11AE78] rounded-full px-4 py-2 text-[#11AE78] font-bold w-fit">
                      Записаться
                    </div>
                    <div  class="ml-2 custom-green-btn rounded-full w-8 h-8 flex items-center justify-center text-white cursor-pointer" @click="openDescriptionModal(record)">?</div>
                  </div>
                </template>
              </template>
              </a-table>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </main>

    <!-- Фиксированный футер -->
    <div class="fixed bottom-0 left-0 right-0 z-40">
      <FooterNav :showHomeButton="true" />
    </div>
    
    <SchedulePage v-model:visible="visible" :doctor="doctor" @booked="handleAppointmentBooked" />
    
    <!-- Модалка подтверждения записи -->
    <a-modal
      v-model:open="showApprovePage"
      width="500px"
      centered
      :footer="null"
      :body-style="{ padding: '0px' }"
      :mask-style="{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }"
      class="approve-modal"
      :closable="false"
      :mask-closable="false"
    >
      <ApprovePage 
        v-if="appointmentResult"
        :appointment-result="appointmentResult"
        @close="closeApprovePage"
      />
    </a-modal>

    <!-- Модалка с описанием услуги -->
    <a-modal
      v-model:open="showDescriptionModal"
      width="500px"
      centered
      :footer="null"
      :body-style="{ padding: '0px' }"
      :mask-style="{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }"
      class="description-modal"
      :closable="false"
      :mask-closable="false"
    >
      <div v-if="selectedService" class="description-content">
        <!-- Заголовок -->
        <div class="description-header">
          <h2 class="service-title">{{ selectedService.full_name }}</h2>
        </div>

        <!-- Описание услуги -->
        <div class="description-section">
          <h3 class="section-title">Описание услуги</h3>
          <p class="section-text">{{ selectedService.description }}</p>
        </div>

        <!-- Для чего нужна -->
        <div class="description-section">
          <h3 class="section-title">Для чего нужна</h3>
          <ul class="section-list">
            <li v-for="item in selectedService.why_needed" :key="item" class="list-item">
              {{ item }}
            </li>
          </ul>
        </div>

        <!-- Что входит в услугу -->
        <div class="description-section">
          <h3 class="section-title">Что входит в услугу</h3>
          <ul class="section-list">
            <li v-for="item in selectedService.what_included" :key="item" class="list-item">
              {{ item }}
            </li>
          </ul>
        </div>

        <!-- Длительность -->
        <div class="duration-info">
          <span class="duration-text">Длительность приема: {{ selectedService.duration }}</span>
        </div>

        <!-- Кнопка закрытия -->
        <div class="description-footer">
          <button @click="closeDescriptionModal" class="close-button">
            Закрыть
          </button>
        </div>
      </div>
    </a-modal>
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
import ApprovePage from "../components/ApprovePage.vue";
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
const showApprovePage = ref(false);
const appointmentResult = ref<any>(null);
const showDescriptionModal = ref(false);
const selectedService = ref<any>(null);
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
  { 
    id: 201, 
    full_name: "Хирург", 
    specialty: "Консультация", 
    first_price: 8000, 
    next_price: 6000,
    description: "Консультация хирурга включает в себя осмотр пациента, сбор анамнеза (жалобы и история болезни), оценку состояния и назначение необходимых обследований. Хирург может дать рекомендации по лечению, назначить дополнительную диагностику или принять решение о необходимости хирургического вмешательства.",
    why_needed: [
      "При болях или травмах мягких тканей, суставов, костей",
      "При подозрении на грыжи, опухоли, воспалительные процессы",
      "Для оценки послеоперационного состояния и заживления ран",
      "Для планирования операции или получения второго мнения о её необходимости"
    ],
    what_included: [
      "Первичная или повторная консультация хирурга",
      "Консультация по результатам анализов и обследований",
      "Назначение лечения или направление к дополнительным специалистам"
    ],
    duration: "20-30 минут"
  },
  { 
    id: 202, 
    full_name: "Окулист", 
    specialty: "Консультация", 
    first_price: 6000, 
    next_price: 5000,
    description: "Консультация окулиста включает в себя полное обследование зрения, диагностику заболеваний глаз, проверку остроты зрения и подбор коррекции. Врач может выявить различные патологии глаз и назначить соответствующее лечение.",
    why_needed: [
      "При снижении остроты зрения",
      "При болях в глазах, покраснении, слезотечении",
      "Для профилактического осмотра зрения",
      "При головных болях, связанных с напряжением глаз"
    ],
    what_included: [
      "Проверка остроты зрения",
      "Осмотр глазного дна",
      "Измерение внутриглазного давления",
      "Подбор очков или контактных линз"
    ],
    duration: "15-25 минут"
  },
  { 
    id: 203, 
    full_name: "Кардиолог", 
    specialty: "Консультация", 
    first_price: 7000, 
    next_price: 5500,
    description: "Консультация кардиолога включает в себя осмотр сердечно-сосудистой системы, анализ жалоб пациента, оценку факторов риска и назначение необходимых обследований для диагностики заболеваний сердца и сосудов.",
    why_needed: [
      "При болях в области сердца",
      "При одышке, сердцебиении, аритмии",
      "При повышенном артериальном давлении",
      "Для профилактики сердечно-сосудистых заболеваний"
    ],
    what_included: [
      "Осмотр и аускультация сердца",
      "Анализ ЭКГ и других исследований",
      "Назначение дополнительных обследований",
      "Рекомендации по образу жизни и лечению"
    ],
    duration: "25-35 минут"
  },
  { 
    id: 204, 
    full_name: "Невролог", 
    specialty: "Консультация", 
    first_price: 7500, 
    next_price: 6000,
    description: "Консультация невролога включает в себя неврологический осмотр, оценку состояния нервной системы, диагностику неврологических заболеваний и назначение соответствующего лечения.",
    why_needed: [
      "При головных болях, мигренях",
      "При головокружении, нарушении координации",
      "При болях в спине, шее",
      "При нарушениях сна, памяти, внимания"
    ],
    what_included: [
      "Неврологический осмотр",
      "Проверка рефлексов и чувствительности",
      "Анализ неврологических симптомов",
      "Назначение лечения и реабилитации"
    ],
    duration: "30-40 минут"
  }
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

function handleAppointmentBooked(appointmentInfo: any) {
  console.log('🎉 Запись подтверждена, показываем ApprovePage', appointmentInfo);
  appointmentResult.value = appointmentInfo.appointmentResult;
  console.log('🔍 DoctorsPage: appointmentResult установлен:', appointmentResult.value);
  showApprovePage.value = true;
}

function closeApprovePage() {
  showApprovePage.value = false;
  appointmentResult.value = null;
}

function openDescriptionModal(service: any) {
  selectedService.value = service;
  showDescriptionModal.value = true;
}

function closeDescriptionModal() {
  showDescriptionModal.value = false;
  selectedService.value = null;
}

</script>

<style>
/* Стили для модального окна подтверждения */
.approve-modal .ant-modal {
  max-width: 500px !important;
  margin: 0 auto !important;
}

.approve-modal .ant-modal-content {
  border-radius: 12px !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
  overflow: hidden !important;
}

.approve-modal .ant-modal-body {
  padding: 0 !important;
  height: auto !important;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 640px) {
  .approve-modal .ant-modal {
    max-width: 100vw !important;
    margin: 0 !important;
  }
  
  .approve-modal .ant-modal-content {
    border-radius: 0 !important;
    box-shadow: none !important;
  }
}

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

/* Прокрутка для таблиц */
.custom-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.custom-tabs .ant-tabs-nav {
  flex-shrink: 0;
}

.custom-tabs .ant-tabs-content-holder {
  flex: 1;
  overflow: hidden;
}

.custom-tabs .ant-tabs-tabpane {
  height: 100%;
}

/* Прокрутка для div контейнера таблиц */
.table-container {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: auto;
}

.table-container .ant-table {
  margin-bottom: 0;
}

/* Стили для модального окна с описанием */
.description-modal .ant-modal {
  max-width: 500px !important;
  margin: 0 auto !important;
}

.description-modal .ant-modal-content {
  border-radius: 12px !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
  overflow: hidden !important;
}

.description-modal .ant-modal-body {
  padding: 0 !important;
  height: auto !important;
}

.description-content {
  background: white;
  color: black;
  font-family: sans-serif;
}

.description-header {
  background: white;
  padding: 20px;
  text-align: center;
}

.service-title {
  color: #11AE78;
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.description-section {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  color: black;
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 12px 0;
}

.section-text {
  color: black;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.section-list {
  margin: 0;
  padding-left: 0;
  list-style: none;
}

.list-item {
  color: black;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 8px;
  position: relative;
  padding-left: 20px;
}

.list-item::before {
  content: "•";
  color: black;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.duration-info {
  padding: 15px 20px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.duration-text {
  color: black;
  font-size: 14px;
  font-weight: 500;
}

.description-footer {
  padding: 20px;
  background: #E8F4F2;
  text-align: center;
}

.close-button {
  background: white;
  border: 2px solid #11AE78;
  color: #11AE78;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: #11AE78;
  color: white;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 640px) {
  .description-modal .ant-modal {
    max-width: 100vw !important;
    margin: 0 !important;
  }
  
  .description-modal .ant-modal-content {
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  .description-header {
    padding: 15px;
  }

  .service-title {
    font-size: 18px;
  }

  .description-section {
    padding: 15px;
  }

  .section-title {
    font-size: 15px;
  }

  .section-text,
  .list-item {
    font-size: 13px;
  }

  .duration-info {
    padding: 12px 15px;
  }

  .description-footer {
    padding: 15px;
  }

  .close-button {
    padding: 10px 20px;
    font-size: 13px;
  }
}
</style>

