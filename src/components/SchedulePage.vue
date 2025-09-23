<template>
    <a-modal
      :open="visible"
      width="600px"
      centered
      :footer="null"
      :body-style="{ padding: '0px' }"
      class="schedule-modal"
      @cancel="handleClose"
      @update:open="(val: boolean) => emit('update:visible', val)"
    >
      <div class="modal-inner">
        <!-- Инфо о докторе -->
        <div v-if="doctor" class="text-center mb-4">
        <div class="font-bold text-lg">{{ doctor.full_name }}</div>
        <div class="text-green-600">
          {{ doctor.specialty }} / Каб. №{{ doctor.cabinet }}
        </div>
        <div class="text-gray-500 text-sm">
          {{ doctor.schedule_string }}
        </div>
      </div>
  
      <!-- Календарь -->
      <div class="mb-4">
        <div class="font-semibold mb-2 text-center">Выберите день приёма:</div>
        <a-calendar
          v-model:value="selectedDate"
          :disabled-date="disabledDate"
          fullscreen="false"
          class="mini-calendar rounded-md"
        >
          <template #dateFullCellRender="{ current }">
            <div
              :class="[
                'w-8 h-8 flex items-center justify-center rounded-full cursor-pointer',
                selectedDate && current.isSame(selectedDate, 'day')
                  ? 'bg-[#11AE78] text-white font-bold'
                  : 'hover:bg-gray-100'
              ]"
              @click="() => { console.log('🖱️ Клик по дате в календаре:', current.format('YYYY-MM-DD')); selectDate(current); }"
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
              slot.is_available ? 'available-slot' : 'unavailable-slot'
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
          :disabled="!selectedDate || !selectedTime"
          @click="bookAppointment"
        >
        <span class="text-white px-6">
          Записаться
          </span>
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
            <div class="info-value">{{ patientData.name || 'Не указано' }}</div>
            <div class="info-divider"></div>
          </div>
          
          <div class="info-section">
            <div class="info-label">Прием</div>
            <div class="info-value">{{ doctor?.full_name }} ({{ doctor?.specialty }})</div>
            <div class="info-divider"></div>
          </div>
          
          <div class="info-section">
            <div class="info-label">Дата и время</div>
            <div class="info-value">{{ formatDate(selectedDate) }} в {{ selectedTime }}</div>
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
        </div>
        
        <!-- Инструкция -->
        <div class="confirmation-instruction">
          Приходите в назначенное время и дату. Рекомендуем прибыть за 15 минут до приёма
        </div>
        
        <!-- Кнопка подтверждения -->
        <div class="confirmation-button-container">
          <div class="rounded-full bg-[#0C593E] text-white px-4 py-2 font-bold cursor-pointer max-w-xs mx-auto text-[16px] text-center" @click="confirmAppointment">
            Подтвердить
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
  
  interface Doctor {
    doctor_id: string;
    full_name: string;
    specialty: string;
    cabinet: string;
    schedule_string: string;
  }
  
  const props = defineProps<{
    visible: boolean;
    doctor: Doctor | null;
  }>();
  
  const emit = defineEmits(["update:visible", "booked"]);
  
  console.log('🎬 SchedulePage инициализирован с пропсами:', { visible: props.visible, doctor: props.doctor });
  
  const selectedDate = ref<Dayjs | null>(dayjs()); // сегодня по умолчанию
  const selectedTime = ref<string | null>(null);
  const timeSlots = ref<any[]>([]);
  
  // Модалка подтверждения
  const showConfirmation = ref(false);
  const patientData = ref({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  
  function handleClose() {
    emit("update:visible", false);
  }
  
  // Загружаем слоты времени при открытии модалки
  onMounted(async () => {
    console.log('🚀 SchedulePage mounted, doctor:', props.doctor);
    if (props.doctor?.doctor_id && selectedDate.value) {
      console.log('🚀 Загружаем слоты для выбранной даты:', selectedDate.value.format('YYYY-MM-DD'));
      await loadTimeSlots(selectedDate.value);
    } else {
      console.log('❌ Нет доктора или даты для загрузки расписания');
    }
  });

  // Загружаем слоты времени при появлении доктора
  watch(() => props.doctor, async (doctor) => {
    if (doctor?.doctor_id && selectedDate.value) {
      console.log('👀 Загружаем слоты для выбранной даты:', selectedDate.value.format('YYYY-MM-DD'));
      await loadTimeSlots(selectedDate.value);
    }
  }, { immediate: true });

  // Следим за изменением visible
  watch(() => props.visible, (visible) => {
    console.log('👀 Watcher visible сработал:', visible);
    if (visible && props.doctor) {
      console.log('👀 Модалка открыта, доктор:', props.doctor);
    }
  });

  // Загружаем слоты времени при выборе даты
  watch(selectedDate, async (date) => {

    
    if (!date) {
      console.log('👀 Watcher: пропускаем - нет даты');
      return;
    }
    
    if (!props.doctor?.doctor_id) {
      console.log('👀 Watcher: пропускаем - нет доктора');
      return;
    }
    
    console.log('👀 Watcher: загружаем слоты времени');
    await loadTimeSlots(date);
  });


  async function loadTimeSlots(date: Dayjs) {
    if (!props.doctor?.doctor_id) return;
    console.log('⏰ Загружаем слоты времени для:', date.format("YYYY-MM-DD"));
    try {
      const res = await ScheduleApi(
        `/${props.doctor.doctor_id}/schedule`,
        { date: date.format("YYYY-MM-DD") },
        "GET"
      );
      console.log('⏰ Ответ слотов времени:', res?.data);
      timeSlots.value = res?.data?.slots ?? [];
      selectedTime.value = null;
      console.log('⏰ Загружено слотов:', timeSlots.value.length);
    } catch (e) {
      console.error('❌ Ошибка загрузки слотов времени:', e);
      timeSlots.value = [];
    }
  }

  function selectDate(current: Dayjs) {
    console.log('🎯 selectDate ВЫЗВАНА с датой:', current.format('YYYY-MM-DD'));
    
    // Разрешаем выбор любой даты в будущем
    if (current.isAfter(dayjs().startOf('day'))) {
      console.log('📅 Устанавливаем selectedDate в:', current.format('YYYY-MM-DD'));
      selectedDate.value = current;
      console.log('📅 selectedDate.value после установки:', selectedDate.value?.format('YYYY-MM-DD'));
    } else {
      console.log('📅 Дата в прошлом, не выбираем');
    }
  }
  
  function disabledDate(current: Dayjs) {
    return current && current < dayjs().startOf("day");
  }
  

  function bookAppointment() {
    if (!selectedDate.value || !selectedTime.value || !props.doctor) return;
    
    // Предзаполняем данные пациента (можно получить из localStorage или других источников)
    patientData.value = {
      name: 'Амандыков Алмаз', // Пример данных
      phone: '+7 777 123-45-67',
      email: 'almaz@email.com',
      notes: ''
    };
    
    showConfirmation.value = true;
  }
  
  function confirmAppointment() {
    if (!selectedDate.value || !selectedTime.value || !props.doctor) return;
    emit("booked", {
      doctorId: props.doctor.doctor_id,
      date: selectedDate.value.format("YYYY-MM-DD"),
      time: selectedTime.value,
      patientData: patientData.value
    });
    handleClose();
  }
  
  function cancelConfirmation() {
    showConfirmation.value = false;
  }
  
  function formatDate(date: Dayjs | null) {
    if (!date) return '';
    
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
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
}
:deep(.ant-modal-content) {
  border-radius: 12px;
  overflow: hidden;
}

/* Внутренняя обёртка — тут ты сама задаёшь нужный padding */
.modal-inner {
  padding: 16px; /* если хочешь полностью убрать — поставь 0 */
  background: transparent;
}
  .custom-green-btn {
    background-color: #0C593E !important;
    border-color: #0C593E !important;
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
    max-width: 300px;
    margin: 0 auto;
    border-radius: 12px;
    overflow: hidden;
  }
  
  /* фон календаря */
  :deep(.ant-picker-panel) {
    background-color: #E8F4F2 !important;
    border-radius: 12px;
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
  
  /* Стили для модалки подтверждения */
  .confirmation-content {
    background: white;
    border-radius: 12px;
    overflow: hidden;
  }
  
  .confirmation-header {
    padding: 24px 24px 16px 24px;
  }
  
  .confirmation-title {
    font-size: 24px;
    font-weight: bold;
    color: #11ae78;
    margin: 0;
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
    background-color: #0C593E;
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
    background-color: #E8F4F2;
    padding: 16px 24px;
    display: flex;
    gap: 12px;
  }
  
  .footer-back-button {
    background: linear-gradient(135deg, #0C593E 0%, #11AE78 100%);
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
  
  .footer-close-button:hover {
    background-color: #f0fdf4;
  }
  </style>
  