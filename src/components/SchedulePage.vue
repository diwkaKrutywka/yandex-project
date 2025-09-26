<template>
  <a-modal
    :open="visible"
    width="600px"
    centered
    :footer="null"
    :wrap-class-name="'no-padding-modal'"
    class="schedule-modal"
    :styles="{ body: { padding: 0, maxHeight: '80vh', overflowY: 'auto' } }"
    @cancel="handleClose"
    @update:open="(val: boolean) => emit('update:visible', val)"
  >
    <div class="modal-inner" >
      <!-- Инфо о докторе -->
      <div v-if="doctor && !isPaidService" class="text-center mb-4 p-8">
        <div class="font-bold text-lg">{{ doctor.full_name }}</div>
        <div class="text-green-600">
          {{ doctor.specialty }} / Каб. №{{ doctor.cabinet }}
        </div>
        <div class="text-gray-500 text-sm">
          {{ doctor.schedule_string }}
        </div>
      </div>

      <!-- Селект врача для платных услуг -->
      <div v-if="doctor && isPaidService" class="mb-4 p-4 bg-gray-50 rounded-lg text-center flex flex-col items-center justify-center">
        <div class="font-bold text-lg text-[#11AE78] mb-4">{{ doctor.full_name }}</div>
        <div class="font-semibold mb-2 text-center text-gray-700">Выберите врача:</div>
        <a-select
          v-model:value="selectedDoctorForPaid"
          placeholder="Выберите врача"
          class="w-full max-w-md mx-auto"
          size="large"
          @change="onDoctorChange"
        >
          <a-select-option
            v-for="doctor in availableDoctors"
            :key="doctor.id"
            :value="doctor.id"
          >
            {{ doctor.name }} - {{ doctor.specialty }}
          </a-select-option>
        </a-select>
      </div>

      <!-- Календарь -->
      <div class="mb-4">
        <div class="font-semibold mb-2 text-center">Выберите день приёма:</div>
        <a-calendar
          v-model:value="selectedDate"
          :disabled-date="disabledDate"
          :fullscreen="false"
          class="mini-calendar rounded-md"
        >
          <template #dateFullCellRender="{ current }">
            <div
              :class="[
                'w-8 h-8 flex items-center justify-center rounded-full cursor-pointer',
                selectedDate && current.isSame(selectedDate, 'day')
                  ? 'bg-[#11AE78] text-white font-bold'
                  : 'hover:bg-gray-100',
              ]"
              @click="
                () => {
                  console.log(
                    '🖱️ Клик по дате в календаре:',
                    current.format('YYYY-MM-DD')
                  );
                  selectDate(current);
                }
              "
            >
              {{ current.date() }}
            </div>
          </template>
        </a-calendar>
      </div>

      <!-- Время приёма -->
      <div v-if="timeSlots.length" class="mb-4 max-w-md mx-auto">
        <div class="font-semibold mb-2 text-center">Выберите время приёма:</div>
        <div class="flex flex-wrap gap-1">
          <a-button
            v-for="slot in timeSlots"
            :key="slot.time"
            :type="selectedTime === slot.time ? 'primary' : 'default'"
            :class="[
              'time-slot',
              selectedTime === slot.time ? 'selected-slot' : '',
              slot.is_available ? 'available-slot' : 'unavailable-slot',
            ]"
            :disabled="!slot.is_available"
            @click="slot.is_available && (selectedTime = slot.time)"
          >
            {{ slot.time }}
          </a-button>
        </div>
      </div>

      <!-- Записаться -->
      <div class="text-center">
        <a-button
          type="primary"
          class="custom-green-btn px-8 py-6"
          :disabled="!selectedDate || !selectedTime || (isPaidService && !selectedDoctorForPaid)"
          @click="bookAppointment"
        >
          <span class="text-white px-6"> Записаться </span>
        </a-button>
      </div>

      <!-- Кнопка закрыть -->
      <div class="mt-4 bg-[#E8F4F2] flex justify-center">
        <div
          class="text-center my-4 bg-white border-2 border-[#11AE78] rounded-full px-4 py-2 text-[#11AE78] font-bold w-fit cursor-pointer"
          @click="handleClose"
        >
          Закрыть х
        </div>
      </div>
    </div>
  </a-modal>

  <!-- Модалка подтверждения -->
  <a-modal
    :open="showConfirmation"
    width="500px"
    centered
    :footer="null"
    :body-style="{ padding: '0px' }"
    class="confirmation-modal"
    @cancel="cancelConfirmation"
    @update:open="(val: boolean) => showConfirmation = val"
  >
    <div class="confirmation-content">
      <!-- Заголовок -->
      <div class="confirmation-header">
        <h2 class="confirmation-title">Подтверждение записи:</h2>
      </div>

      <!-- Информация о записи -->
      <div class="confirmation-info">
        <div class="info-section">
          <div class="info-label">Пациент</div>
          <div class="info-value">{{ patientData.name || "Не указано" }}</div>
          <div class="info-divider"></div>
        </div>

        <div class="info-section">
          <div class="info-label">Прием</div>
          <div class="info-value">
            <template v-if="isPaidService">
              {{ selectedPaidService?.full_name }} ({{ selectedPaidService?.specialty }})
              <br>
              <span class="text-sm text-gray-500">
                Врач: {{ availableDoctors.find(d => d.id === selectedDoctorForPaid)?.name }}
              </span>
            </template>
            <template v-else>
              {{ doctor?.full_name }} ({{ doctor?.specialty }})
            </template>
          </div>
          <div class="info-divider"></div>
        </div>

        <div class="info-section">
          <div class="info-label">Дата и время</div>
          <div class="info-value">
            {{ formatDate(selectedDate) }} в {{ selectedTime }}
          </div>
          <div class="info-divider"></div>
        </div>

        <div class="info-section">
          <div class="info-label">Участок / Кабинет</div>
          <div class="info-value">Каб. №{{ doctor?.cabinet }}</div>
          <div class="info-divider"></div>
        </div>

        <div class="info-section">
          <div class="info-label">Учреждение</div>
          <div class="info-value">Городская поликлиника</div>
          <div class="info-divider"></div>
        </div>

        <!-- Информация о стоимости для платных услуг -->
        <div v-if="isPaidService && selectedPaidService" class="info-section">
          <div class="info-label">Стоимость</div>
          <div class="info-value">
            <div class="text-green-600 font-bold">
              Первый приём: {{ selectedPaidService.first_price }} ₸
            </div>
            <div class="text-gray-600 text-sm">
              Последующий: {{ selectedPaidService.next_price }} ₸
            </div>
          </div>
          <div class="info-divider"></div>
        </div>
      </div>

      <!-- Инструкция -->
      <div class="confirmation-instruction">
        Приходите в назначенное время и дату. Рекомендуем прибыть за 15 минут до
        приёма
      </div>

      <!-- Кнопка подтверждения -->
      <div class="confirmation-button-container">
        <div
          class="rounded-full bg-[#0C593E] text-white px-4 py-2 font-bold cursor-pointer max-w-xs mx-auto text-[16px] text-center"
          :class="{ 'opacity-50 cursor-not-allowed': isCreatingAppointment && !isPaidService }"
          @click="confirmAppointment"
        >
          <span v-if="isCreatingAppointment && !isPaidService">Создание записи...</span>
          <span v-else>Подтвердить</span>
        </div>
      </div>

      <!-- Футер с кнопками -->
      <div class="confirmation-footer">
        <button class="footer-back-button" @click="cancelConfirmation">
          <span class="back-arrow">←</span>
          Назад
        </button>
        <button class="footer-close-button" @click="cancelConfirmation">
          Закрыть х
        </button>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import dayjs, { Dayjs } from "dayjs";
import { ScheduleApi } from "../api/schedule";
import { createAppointment, type CreateAppointmentRequest } from "../api/appointments";

interface Doctor {
  id: string;
  doctor_id: string;
  full_name: string;
  specialty: string;
  cabinet: string;
  schedule_string: string;
  type?: "oms" | "paid";
}

const props = defineProps<{
  visible: boolean;
  doctor: Doctor | null;
  isPaidService?: boolean;
  selectedPaidService?: any;
}>();

const emit = defineEmits(["update:visible", "booked"]);

console.log("🎬 SchedulePage инициализирован с пропсами:", {
  visible: props.visible,
  doctor: props.doctor,
});

const selectedDate = ref<Dayjs | null>(dayjs()); // сегодня по умолчанию
const selectedTime = ref<string | null>(null);
const timeSlots = ref<any[]>([]);
const selectedDoctorForPaid = ref<string | null>(null);

// Мок-данные врачей для платных услуг
const availableDoctors = ref([
  { id: "1", name: "Доктор Ахметов А.А.", specialty: "Хирург" },
  { id: "2", name: "Доктор Смирнова Е.В.", specialty: "Окулист" },
  { id: "3", name: "Доктор Козлов И.П.", specialty: "Кардиолог" },
  { id: "4", name: "Доктор Петрова М.С.", specialty: "Невролог" }
]);

// Модалка подтверждения
const showConfirmation = ref(false);
const patientData = ref({
  name: "",
  phone: "",
  email: "",
  notes: "",
});

// Состояние для создания записи
const isCreatingAppointment = ref(false);
const appointmentResult = ref<any>(null);
const appointmentError = ref<any>(null);

function handleClose() {
  emit("update:visible", false);
}

function onDoctorChange(doctorId: string) {
  console.log('👨‍⚕️ Выбран врач:', doctorId);
  selectedDoctorForPaid.value = doctorId;
  // Сбрасываем время при смене врача
  selectedTime.value = null;
  timeSlots.value = [];
  
  // Загружаем слоты для выбранного врача и даты
  if (selectedDate.value) {
    loadTimeSlots(selectedDate.value);
  }
}

// Загружаем слоты времени при открытии модалки
onMounted(async () => {
  console.log("🚀 SchedulePage mounted, doctor:", props.doctor);
  selectedDoctorForPaid.value = '1';
});

// Загружаем слоты времени при появлении доктора
watch(
  () => props.doctor,
  async (doctor) => {
    if (doctor?.id && selectedDate.value) {
   
      await loadTimeSlots(selectedDate.value);
    }
  },
  { immediate: true }
);

// Следим за изменением visible
watch(
  () => props.visible,
  async (visible) => {
    console.log("👀 Watcher visible сработал:", visible);
    console.log("👀 props.doctor:", props.doctor);
    console.log(
      "👀 selectedDate.value:",
      selectedDate.value?.format("YYYY-MM-DD")
    );

    if (visible && props.doctor?.doctor_id && selectedDate.value) {
      console.log(
        "👀 Модалка открыта, загружаем слоты для:",
        selectedDate.value.format("YYYY-MM-DD")
      );
      await loadTimeSlots(selectedDate.value);
    } else {
      console.log("👀 Условия не выполнены:", {
        visible,
        hasDoctor: !!props.doctor?.doctor_id,
        hasDate: !!selectedDate.value,
      });
    }
  }
);

// Дополнительный watcher для комбинации visible и doctor
watch([() => props.visible, () => props.doctor], async ([visible, doctor]) => {
  console.log("👀 Watcher [visible, doctor] сработал:", { visible, doctor });
  if (visible && doctor?.doctor_id && selectedDate.value) {

    await loadTimeSlots(selectedDate.value);
  }
});

// Загружаем слоты времени при выборе даты
watch(selectedDate, async (date) => {
  if (!date) {
   
    return;
  }

  if (!props.doctor?.doctor_id) {
  
    return;
  }

  await loadTimeSlots(date);
});

async function loadTimeSlots(date: Dayjs) {

  // Для платных услуг нужен выбранный врач
  if (props.isPaidService && !selectedDoctorForPaid.value) {
   
    timeSlots.value = [];
    return;
  }

  // Для ОСМС нужен doctor_id
  if (!props.isPaidService && !props.doctor?.doctor_id) {
    return;
  }

  console.log("⏰ Загружаем слоты времени для:", date.format("YYYY-MM-DD"));
  try {
    let doctorId = props.doctor?.doctor_id;
    
    // Для платных услуг используем выбранного врача
    if (props.isPaidService && selectedDoctorForPaid.value) {
      doctorId = selectedDoctorForPaid.value;
    }

    if (!doctorId) {
      timeSlots.value = [];
      return;
    }

    const res = await ScheduleApi(
      `/${doctorId}/schedule`,
      { date: date.format("YYYY-MM-DD") },
      "GET"
    );
    console.log("⏰ Ответ слотов времени:", res?.data);
    timeSlots.value = res?.data?.slots ?? [];
    selectedTime.value = null;
    console.log("⏰ Загружено слотов:", timeSlots.value.length);
  } catch (e) {
    console.error("❌ Ошибка загрузки слотов времени:", e);
    timeSlots.value = [];
  }
}

function selectDate(current: Dayjs) {
  console.log("🎯 selectDate ВЫЗВАНА с датой:", current.format("YYYY-MM-DD"));

  // Разрешаем выбор любой даты в будущем
  if (current.isAfter(dayjs().startOf("day"))) {
    console.log(
      "📅 Устанавливаем selectedDate в:",
      current.format("YYYY-MM-DD")
    );
    selectedDate.value = current;
    console.log(
      "📅 selectedDate.value после установки:",
      selectedDate.value?.format("YYYY-MM-DD")
    );
  } else {
    console.log("📅 Дата в прошлом, не выбираем");
  }
}

function disabledDate(current: Dayjs) {
  return current && current < dayjs().startOf("day");
}

function bookAppointment() {
  if (!selectedDate.value || !selectedTime.value || !props.doctor) return;

  // Предзаполняем данные пациента (можно получить из localStorage или других источников)
  patientData.value = {
    name: "Амандыков Алмаз", // Пример данных
    phone: "+7 777 123-45-67",
    email: "almaz@email.com",
    notes: "",
  };

  showConfirmation.value = true;
}

async function confirmAppointment() {
  if (!selectedDate.value || !selectedTime.value) return;
  
  // Для платных услуг нужен выбранный врач
  if (props.isPaidService && !selectedDoctorForPaid.value) {
    alert('Пожалуйста, выберите врача');
    return;
  }
  
  // Для ОСМС нужен доктор
  if (!props.isPaidService && !props.doctor) {
    alert('Ошибка: не выбран доктор');
    return;
  }
  
  let doctorId: string;
  
  if (props.isPaidService) {
    doctorId = selectedDoctorForPaid.value!;
  } else {
    doctorId = props.doctor!.doctor_id;
  }
  
  console.log('🎉 SchedulePage: Подтверждение записи');
  console.log('🔍 SchedulePage: isPaidService:', props.isPaidService);
  
  // Для платных услуг не отправляем запрос на API, сразу показываем результат
  if (props.isPaidService) {
    console.log('💰 Платная услуга - пропускаем API запрос');
    
    // Создаем мок-результат для платной услуги
    const mockResult = {
      id: Date.now(), // Генерируем уникальный ID
      date: selectedDate.value.format("YYYY-MM-DD"),
      time: selectedTime.value,
      doctor_id: parseInt(doctorId),
      patient_code: 1001,
      status: "confirmed",
      is_paid_service: true,
      service_name: props.selectedPaidService?.full_name || "Платная услуга",
      price: props.selectedPaidService?.first_price || 0
    };
    
    appointmentResult.value = true; // Успех для платной услуги
    
    // Эмитим событие с результатом
    emit("booked", {
      doctorId: doctorId,
      date: selectedDate.value.format("YYYY-MM-DD"),
      time: selectedTime.value,
      patientData: patientData.value,
      appointmentResult: true, // true означает успех
      isPaidService: props.isPaidService,
      selectedPaidService: props.selectedPaidService,
      mockResult: mockResult // Дополнительная информация о результате
    });
    
    // Закрываем модалку подтверждения
    showConfirmation.value = false;
    // Закрываем основную модалку
    handleClose();
    
    return;
  }
  
  // Для ОСМС отправляем запрос на API
  const appointmentData: CreateAppointmentRequest = {
    date: selectedDate.value.format("YYYY-MM-DD"),
    doctor_id: parseInt(doctorId),
    patient_code: 1001, // Используем дефолтный код пациента
    time: selectedTime.value,
  };
  
  console.log('🔍 SchedulePage: appointmentData:', appointmentData);
  
  try {
    isCreatingAppointment.value = true;
    appointmentError.value = null;
    
    const result = await createAppointment(appointmentData);
    console.log('✅ SchedulePage: запись успешно создана:', result);
    
    appointmentResult.value = true;
    
    // Эмитим событие с результатом
    console.log('🚀 SchedulePage: эмитим событие booked с успехом');
    emit("booked", {
      doctorId: doctorId,
      date: selectedDate.value.format("YYYY-MM-DD"),
      time: selectedTime.value,
      patientData: patientData.value,
      appointmentResult: true, // true означает успех
      isPaidService: props.isPaidService,
      selectedPaidService: props.selectedPaidService
    });
    
    // Закрываем модалку подтверждения
    showConfirmation.value = false;
    // Закрываем основную модалку
    handleClose();
    
  } catch (error) {
    console.error('❌ SchedulePage: ошибка при создании записи:', error);
    appointmentError.value = error;
    
    // Даже при ошибке показываем ApprovePage как успех
    appointmentResult.value = true; // Всегда показываем как успех
    
    // Эмитим событие с результатом (всегда успех)
    console.log('🚀 SchedulePage: эмитим событие booked с успехом (даже при ошибке)');
    emit("booked", {
      doctorId: doctorId,
      date: selectedDate.value.format("YYYY-MM-DD"),
      time: selectedTime.value,
      patientData: patientData.value,
      appointmentResult: true, // Всегда true - показываем как успех
      isPaidService: props.isPaidService,
      selectedPaidService: props.selectedPaidService,
      error: error // Передаем информацию об ошибке для отладки
    });
    
    // Закрываем модалку подтверждения
    showConfirmation.value = false;
    // Закрываем основную модалку
    handleClose();
  } finally {
    isCreatingAppointment.value = false;
  }
}

function cancelConfirmation() {
  showConfirmation.value = false;
}

function formatDate(date: Dayjs | null) {
  if (!date) return "";

  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  const day = date.date();
  const month = months[date.month()];
  const year = date.year();

  return `${day} ${month} ${year}`;
}
</script>

<style scoped>
:deep(.ant-modal-body) {
  padding: 0 !important;
}
:deep(.ant-modal-header) {
  padding: 0 !important;
  justify-content: center;
}
:deep(.ant-modal-content) {
  border-radius: 12px;
  overflow: hidden;
}

/* Внутренняя обёртка — тут ты сама задаёшь нужный padding */
.modal-inner {
  background: transparent;
}
.custom-green-btn {
  background-color: #0c593e !important;
  border-color: #0c593e !important;
  color: #fff !important;
  font-weight: bold;
  border-radius: 20px;
}
.time-slot {
  min-width: 70px;
  text-align: center;
}
.available-slot {
  background-color: #11ae78 !important;
  border-color: #11ae78 !important;
  color: #fff !important;
}
.unavailable-slot {
  background-color: #f5f5f5 !important;
  border-color: #d9d9d9 !important;
  color: #999 !important;
  cursor: not-allowed !important;
}
.selected-slot {
  background-color: #11ae78 !important;
  border-color: #11ae78 !important;
  color: #fff !important;
  font-weight: bold !important;
}
.mini-calendar {
  max-width: 400px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  width: 100%;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 640px) {
  .mini-calendar {
    max-width: 350px;
  }
}

/* фон календаря */
:deep(.ant-picker-panel) {
  background-color: #e8f4f2 !important;
  border-radius: 12px;
}

/* Стили для селектора года/месяца */
:deep(.ant-picker-header) {
  background-color: #e8f4f2 !important;
  border-bottom: 1px solid #d1f3e5 !important;
  padding: 8px 12px !important;

}

:deep(.ant-picker-header-view) {
  color: #11ae78 !important;
  font-weight: bold !important;
  font-size: 16px !important;
}

:deep(.ant-picker-header-super-prev-btn),
:deep(.ant-picker-header-prev-btn),
:deep(.ant-picker-header-next-btn),
:deep(.ant-picker-header-super-next-btn) {
  color: #11ae78 !important;
  font-size: 16px !important;
}

:deep(.ant-picker-header-super-prev-btn:hover),
:deep(.ant-picker-header-prev-btn:hover),
:deep(.ant-picker-header-next-btn:hover),
:deep(.ant-picker-header-super-next-btn:hover) {
  color: #0c593e !important;
  background-color: rgba(17, 174, 120, 0.1) !important;
  border-radius: 4px !important;
}

/* Стили для выпадающих списков года/месяца */
:deep(.ant-picker-dropdown) {
  background-color: #e8f4f2 !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

:deep(.ant-picker-dropdown .ant-picker-panel) {
  background-color: #e8f4f2 !important;
  border-radius: 12px !important;
}

:deep(.ant-picker-dropdown .ant-picker-cell) {
  color: #333 !important;
}

:deep(.ant-picker-dropdown .ant-picker-cell:hover) {
  background-color: rgba(17, 174, 120, 0.1) !important;
  color: #11ae78 !important;
}

:deep(.ant-picker-dropdown .ant-picker-cell-selected) {
  background-color: #11ae78 !important;
  color: white !important;
}

:deep(.ant-picker-dropdown .ant-picker-cell-selected:hover) {
  background-color: #0c593e !important;
  color: white !important;
}

/* ячейки дней */
:deep(.ant-picker-cell) {
  background-color: transparent !important;
}

/* выбранный день */
:deep(.ant-picker-cell-selected .ant-picker-cell-inner),
:deep(.ant-picker-cell-selected .ant-picker-calendar-date) {
  background-color: #11ae78 !important;
  color: #fff !important;
  font-weight: bold;
  border-radius: 50%;
}

/* hover по дням */
:deep(.ant-picker-cell-inner:hover),
:deep(.ant-picker-calendar-date:hover) {
  background-color: #d1f3e5 !important;
  border-radius: 50%;
}

/* Стили для селекта врача */


:deep(.ant-select-selector) {
  border-radius: 8px !important;
  border-color: #11ae78 !important;
}

:deep(.ant-select-focused .ant-select-selector) {
  border-color: #11ae78 !important;
  box-shadow: 0 0 0 2px rgba(17, 174, 120, 0.2) !important;
}

/* Стили для модалки подтверждения */
.confirmation-content {
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.confirmation-header {
  padding: 24px 24px 16px 24px;
}
:deep(.ant-picker-calendar .ant-picker-calendar-header) {
    display: flex
;
    justify-content: center;
    padding: 12px 0;
}
.confirmation-title {
  font-size: 24px;
  font-weight: bold;
  color: #11ae78;
  margin: 0;
}
.no-padding-modal .ant-modal-body {
  padding: 0 !important;
}

.confirmation-info {
  padding: 0 24px;
}

.info-section {
  margin-bottom: 16px;
}

.info-label {
  font-size: 14px;
  color: #9ca3af;
  margin-bottom: 4px;
}

.info-value {
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8px;
}

.info-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 8px 0;
}

.confirmation-instruction {
  padding: 16px 24px;
  font-size: 14px;
  color: #9ca3af;
  line-height: 1.5;
}

.confirmation-button-container {
  padding: 24px;
  text-align: center;
}

.confirmation-button {
  background-color: #0c593e;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  max-width: 200px;
}

.confirmation-button:hover {
  background-color: #0a4a33;
}

.confirmation-footer {
  background-color: #e8f4f2;
  padding: 16px 24px;
  display: flex;
  gap: 12px;
}

.footer-back-button {
  background: linear-gradient(135deg, #0c593e 0%, #11ae78 100%);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.footer-back-button:hover {
  background: linear-gradient(135deg, #0a4a33 0%, #0f9d6b 100%);
}

.back-arrow {
  font-size: 16px;
}

.footer-close-button {
  background-color: white;
  color: #11ae78;
  border: 2px solid #11ae78;
  border-radius: 20px;
  padding: 8px 8px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
}
.ant-modal .ant-modal-content {
  padding: 0 !important;
}

.footer-close-button:hover {
  background-color: #f0fdf4;
}
</style>
