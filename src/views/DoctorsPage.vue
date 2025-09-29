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
          {{ isSearchMode ? `${$t('search')} ${$t('results')}: "${searchQuery}"` : (doctors[0]?.specialty || $t('doctors')) }}
        </div>
        
       

        <!-- Таб меню -->
<<<<<<< HEAD
        <a-tabs v-model:activeKey="activeTab" class="custom-tabs bg-white p-3 rounded shadow mt-4 flex-1">
          <!-- ОСМС -->
          <a-tab-pane key="osms" tab=" Услуга по ОСМС ">
            <div class="table-container">
              <a-table
                :columns="isSearchMode ? columnsSearchOSMS : columnsOSMS"
                :data-source="isSearchMode ? searchResults : doctors"
                :loading="loading"
                :row-key="isSearchMode ? 'doctor_id' : 'id'"
                bordered
                :pagination="false"
                :rowClassName="rowClassName"
              >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                  <div>
                  
                    <!-- Для обычных врачей показываем расписание -->
                    <!-- <div v-if="record.schedule_string" class="schedule-text">
                      <div v-for="(schedule, index) in record.schedule_string.split(';')" :key="index" class="schedule-item">
                        {{ schedule.trim() }}
                      </div>
                    </div> -->
                    <span>пн. ср, пт 14:00-20:00 вт,<br/> чт 8:00-14:00</span>
                    <div class="border-2 border-[#11AE78] rounded-full px-4 py-2 text-[#11AE78] font-bold w-fit cursor-pointer" @click="openScheduleModal(record)">
                      Записаться
=======
        <div class="bg-white rounded shadow mt-4 flex-1 flex flex-col">
          <!-- Табы -->
          <div class="flex border-b">
            <button 
              @click="activeTab = 'osms'"
              :class="[
                'flex-1 py-4 px-6 text-center font-semibold transition-colors rounded-tl-lg rounded-tr-lg',
                activeTab === 'osms' 
                  ? 'bg-[#11AE78] text-white' 
                  : 'bg-[#0E9A6A] text-white hover:bg-[#11AE78]'
              ]"
            >
              {{ $t('osms_service_tab') }}
            </button>
            <button 
              @click="activeTab = 'paid'"
              :class="[
                'flex-1 py-4 px-6 text-center font-semibold transition-colors rounded-tl-lg rounded-tr-lg',
                activeTab === 'paid' 
                  ? 'bg-[#11AE78] text-white' 
                  : 'bg-[#0E9A6A] text-white hover:bg-[#11AE78]'
              ]"
            >
              {{ $t('paid_service_tab') }}
            </button>
          </div>

          <!-- Контент табов -->
          <div class="flex-1 p-4">
            <!-- ОСМС таб -->
            <div v-if="activeTab === 'osms'" class="h-full flex flex-col">
              <div class="bg-[#f9f9f9] rounded-lg overflow-hidden flex-1 flex flex-col">
                <!-- Заголовки таблицы -->
                <div class="bg-[#E8F4F2] px-4 py-3 grid grid-cols-4 gap-4 text-sm font-semibold text-[#11AE78]">
                  <div>{{ $t('doctors_table_headers.full_name') }}</div>
                  <div>{{ $t('doctors_table_headers.specialty') }}</div>
                  <div>{{ $t('doctors_table_headers.cabinet') }}</div>
                  <div>{{ $t('doctors_table_headers.working_hours') }}</div>
                </div>
                
                <!-- Данные таблицы -->
                <div class="table-scroll">
                  <div 
                    v-for="(doctor, index) in (isSearchMode ? searchResults : doctors)" 
                    :key="isSearchMode ? doctor.doctor_id : (doctor as any).id"
                    :class="[
                      'px-4 py-4 grid grid-cols-4 gap-4 text-sm border-b border-[#e0e0e0] hover:bg-[#f0f0f0]',
                      index % 2 === 0 ? 'bg-white' : 'bg-[#E8F4F2]'
                    ]"
                  >
                    <div class="font-medium text-[#333333]">{{ doctor.full_name }}</div>
                    <div class="text-[#666666]">{{ doctor.specialty }}</div>
                    <div class="text-[#666666]">{{ doctor.cabinet }}</div>
                    <div class="flex flex-col">
                      <div class="text-[#666666]">
                        <div v-if="doctor.schedule_string" class="space-y-1">
                          <div v-for="(schedule, idx) in doctor.schedule_string.split(';')" :key="idx" class="text-xs">
                        {{ schedule.trim() }}
                      </div>
                    </div>
>>>>>>> ba214e81d58755787c177c086352a6adbab028bf
                    </div>
                      <div class="mt-2">
                        <button 
                          @click="openScheduleModal(doctor)"
                          class="book-appointment-btn border-2 border-[#11AE78] rounded-full px-4 py-2 text-[#11AE78] font-bold text-sm hover:bg-[#11AE78] hover:text-white transition-colors"
                          style="border: 2px solid #11AE78 !important; color: #11AE78 !important; background-color: transparent !important;"
                        >
                          {{ $t('book_appointment') }}
                        </button>
                  </div>
            </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Платная услуга таб -->
            <div v-if="activeTab === 'paid'" class="h-full flex flex-col">
              <div class="bg-[#f9f9f9] rounded-lg overflow-hidden flex-1 flex flex-col">
                <!-- Заголовки таблицы -->
                <div class="bg-[#E8F4F2] px-4 py-3 grid grid-cols-5 gap-4 text-sm font-semibold text-[#11AE78]">
                  <div>{{ $t('doctors_table_headers.service_name') }}</div>
                  <div>{{ $t('doctors_table_headers.service_type') }}</div>
                  <div>{{ $t('doctors_table_headers.first_visit_price') }}</div>
                  <div>{{ $t('doctors_table_headers.follow_up_price') }}</div>
                  <div></div>
                </div>
                
                <!-- Данные таблицы -->
                <div class="table-scroll">
                  <div 
                    v-for="(service, index) in paidDoctors" 
                    :key="service.id"
                    :class="[
                      'px-4 py-4 grid grid-cols-5 gap-4 text-sm border-b border-[#e0e0e0] hover:bg-[#f0f0f0]',
                      index % 2 === 0 ? 'bg-white' : 'bg-[#E8F4F2]'
                    ]"
                  >
                    <div class="font-medium text-[#333333]">{{ service.full_name }}</div>
                    <div class="text-[#666666]">{{ service.specialty }}</div>
                    <div class="text-[#666666]">{{ service.first_price }} ₸</div>
                    <div class="text-[#666666]">{{ service.next_price }} ₸</div>
                    <div class="flex items-center justify-end">
                      <button 
                        @click="openScheduleModalForPaid(service)"
                        class="border-2 border-[#11AE78] px-6 py-2 text-[#11AE78] font-bold text-sm hover:bg-[#11AE78] hover:text-white transition-colors"
                        style="border: 2px solid #11AE78 !important; color: #11AE78 !important; background-color: transparent !important; margin-right: 20px !important; border-radius: 20px !important;"
                      >
                        {{ $t('book_appointment') }}
                      </button>
                      <button 
                        @click="openDescriptionModal(service)"
                        class="bg-[#11AE78] w-10 h-10 flex items-center justify-center text-white text-sm hover:bg-[#0E9A6A] transition-colors"
                        style="background-color: #11AE78 !important; color: white !important; border-radius: 20px !important;"
                      >
                        ?
                      </button>
                    </div>
                  </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Фиксированный футер -->
    <div class="fixed bottom-0 left-0 right-0 z-40">
      <FooterNav :showHomeButton="true" />
    </div>
    
    <SchedulePage 
      v-model:visible="visible" 
      :doctor="doctor" 
      :is-paid-service="isPaidService"
      :selected-paid-service="selectedPaidService"
      @booked="handleAppointmentBooked" 
    />
    
    <!-- Модалка подтверждения записи -->
    <a-modal
      v-model:open="showApprovePage"
      width="500px"
      rounded-lg
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
          <h3 class="section-title">{{ $t('service_description') }}</h3>
          <p class="section-text">{{ selectedService.description }}</p>
        </div>

        <!-- Для чего нужна -->
        <div class="description-section">
          <h3 class="section-title">{{ $t('why_needed') }}</h3>
          <ul class="section-list">
            <li v-for="item in selectedService.why_needed" :key="item" class="list-item">
              {{ item }}
            </li>
          </ul>
        </div>

        <!-- Что входит в услугу -->
        <div class="description-section">
          <h3 class="section-title">{{ $t('what_included') }}</h3>
          <ul class="section-list">
            <li v-for="item in selectedService.what_included" :key="item" class="list-item">
              {{ item }}
            </li>
          </ul>
        </div>

        <!-- Длительность -->
        <div class="duration-info">
          <span class="duration-text">{{ $t('duration') }} {{ selectedService.duration }}</span>
        </div>

        <!-- Кнопка закрытия -->
        <div class="description-footer">
          <button @click="closeDescriptionModal" class="close-button">
            {{ $t('close') }}
          </button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDateTime } from "../composables/useDateTime";
import { DoctorsApi, type Doctor } from "../api/doctors";
import { type SearchDoctor } from "../api/search";
import FooterNav from "../components/FooterNav.vue";
import CheckIin from "./CheckIin.vue";
import SchedulePage from "../components/SchedulePage.vue";
import ApprovePage from "../components/ApprovePage.vue";
import { useUserStore } from "../store/index";
import { useI18n } from "vue-i18n";
const route = useRoute();
const router = useRouter();
const { currentDate, currentTime } = useDateTime();
const userStore = useUserStore();
const { t, locale } = useI18n();
// const isLoading = ref(false); // Удалено - больше не используется
const error = ref<string | null>(null);
const doctors = ref<Doctor[]>([]);
const activeTab = ref<"osms" | "paid">("osms");
const specialityId = ref<string | null>(
  (route.query.speciality_id as string) || null
);

// Search results handling
const searchQuery = ref<string | null>(
  (route.query.search as string) || null
);
const searchResults = ref<SearchDoctor[]>([]);
const isSearchMode = ref(false);

// const loading = ref(false); // Удалено - больше не используется
const visible = ref(false);
const doctor = ref<Doctor | null>(null);
const showApprovePage = ref(false);
const appointmentResult = ref<any>(null);
const showDescriptionModal = ref(false);
const selectedService = ref<any>(null);
const isPaidService = ref(false);
const selectedPaidService = ref<any>(null);
// Удалены колонки Ant Design - теперь используем кастомные таблицы

// Мок-данные платных услуг - используем computed для реактивности
const paidDoctors = computed(() => {
  const currentLocale = locale.value || 'ru';
  
  const surgeonData = {
    ru: {
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
      ]
    },
    kk: {
      why_needed: [
        "Жұмсақ тіндер, буындар, сүйектер аурулары немесе жарақаттары кезінде",
        "Грыжалар, ісіктер, қабыну процестерінен күдіктенген кезде", 
        "Операциядан кейінгі жағдайды және жаралардың жазылуын бағалау үшін",
        "Операцияны жоспарлау немесе оның қажеттілігі туралы екінші пікір алу үшін"
      ],
      what_included: [
        "Хирургтың бірінші немесе қайталама консультациясы",
        "Талдау және тексеру нәтижелері бойынша консультация",
        "Емдеу тағайындау немесе қосымша мамандарға бағыттау"
      ]
    }
  };

  const ophthalmologistData = {
    ru: {
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
      ]
    },
    kk: {
      why_needed: [
        "Көру өткірлігі төмендеген кезде",
        "Көзде ауру, қызару, жас ағу кезінде",
        "Көруді профилактикалық тексеру үшін", 
        "Көз кернеуімен байланысты бас аурулары кезінде"
      ],
      what_included: [
        "Көру өткірлігін тексеру",
        "Көз түбін тексеру",
        "Көз ішкі қысымын өлшеу",
        "Көзілдірік немесе контактілі линзаларды таңдау"
      ]
    }
  };

  const cardiologistData = {
    ru: {
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
      ]
    },
    kk: {
      why_needed: [
        "Жүрек аймағында ауру кезінде",
        "Тыныс алу қиындығы, жүрек соғысы, аритмия кезінде",
        "Артериялық қысым жоғарылаған кезде",
        "Жүрек-қан тамыр ауруларын профилактикалау үшін"
      ],
      what_included: [
        "Жүректі тексеру және тыңдау",
        "ЭКГ және басқа зерттеулерді талдау",
        "Қосымша тексерулерді тағайындау", 
        "Өмір салты және емдеу бойынша ұсыныстар"
      ]
    }
  };

  const neurologistData = {
    ru: {
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
      ]
    },
    kk: {
      why_needed: [
        "Бас аурулары, мигрень кезінде",
        "Бастың айналуы, координация бұзылуы кезінде",
        "Арқа, мойын аурулары кезінде",
        "Ұйқы, жад, назар бұзылулары кезінде"
      ],
      what_included: [
        "Неврологиялық тексеру",
        "Рефлекстер мен сезімталдықты тексеру",
        "Неврологиялық симптомдарды талдау",
        "Емдеу және реабилитация тағайындау"
      ]
    }
  };

  return [
    { 
      id: 201, 
      full_name: t('paid_services.surgeon.name'), 
      specialty: t('paid_services.surgeon.specialty'), 
      first_price: 8000, 
      next_price: 6000,
      description: t('paid_services.surgeon.description'),
      why_needed: currentLocale === 'kk' ? surgeonData.kk.why_needed : surgeonData.ru.why_needed,
      what_included: currentLocale === 'kk' ? surgeonData.kk.what_included : surgeonData.ru.what_included,
      duration: t('paid_services.surgeon.duration')
    },
    { 
      id: 202, 
      full_name: t('paid_services.ophthalmologist.name'), 
      specialty: t('paid_services.ophthalmologist.specialty'), 
      first_price: 6000, 
      next_price: 5000,
      description: t('paid_services.ophthalmologist.description'),
      why_needed: currentLocale === 'kk' ? ophthalmologistData.kk.why_needed : ophthalmologistData.ru.why_needed,
      what_included: currentLocale === 'kk' ? ophthalmologistData.kk.what_included : ophthalmologistData.ru.what_included,
      duration: t('paid_services.ophthalmologist.duration')
    },
    { 
      id: 203, 
      full_name: t('paid_services.cardiologist.name'), 
      specialty: t('paid_services.cardiologist.specialty'), 
      first_price: 7000, 
      next_price: 5500,
      description: t('paid_services.cardiologist.description'),
      why_needed: currentLocale === 'kk' ? cardiologistData.kk.why_needed : cardiologistData.ru.why_needed,
      what_included: currentLocale === 'kk' ? cardiologistData.kk.what_included : cardiologistData.ru.what_included,
      duration: t('paid_services.cardiologist.duration')
    },
    { 
      id: 204, 
      full_name: t('paid_services.neurologist.name'), 
      specialty: t('paid_services.neurologist.specialty'), 
      first_price: 7500, 
      next_price: 6000,
      description: t('paid_services.neurologist.description'),
      why_needed: currentLocale === 'kk' ? neurologistData.kk.why_needed : neurologistData.ru.why_needed,
      what_included: currentLocale === 'kk' ? neurologistData.kk.what_included : neurologistData.ru.what_included,
      duration: t('paid_services.neurologist.duration')
    }
  ];
});

// Удалена функция rowClassName - теперь используем CSS классы напрямую

// Загрузка данных ОСМС
onMounted(async () => {
  console.log('🔍 DoctorsPage onMounted - route.query:', route.query);
  
  // Проверяем, есть ли результаты поиска
  if (route.query.results) {
    try {
      searchResults.value = JSON.parse(route.query.results as string);
      isSearchMode.value = true;
      console.log('✅ Загружены результаты поиска:', searchResults.value);
      console.log('✅ Количество результатов:', searchResults.value.length);
    } catch (error) {
      console.error('❌ Ошибка при парсинге результатов поиска:', error);
      // Если не удалось распарсить результаты, загружаем обычных врачей
      fetchDoctors();
    }
  } else {
    console.log('📋 Нет результатов поиска, загружаем обычных врачей');
    fetchDoctors();
  }
});
async function fetchDoctors() {
  if (!specialityId.value) return;
  // isLoading.value = true; // Удалено - больше не используется
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
    // isLoading.value = false; // Удалено - больше не используется
  }
}
function openScheduleModal(selectedDoctor: Doctor | SearchDoctor) {
  console.log('🎯 openScheduleModal вызван с доктором:', selectedDoctor);
  
  // Проверяем наличие ИИН
  if (!userStore.iin || userStore.iin.length !== 12) {
    router.push("/auth-page");
    return;
  }
  
  // Если это результат поиска, преобразуем его в формат Doctor
  if (isSearchMode.value && 'clinic_name' in selectedDoctor) {
    const searchDoctor = selectedDoctor as SearchDoctor;
    doctor.value = {
      id: searchDoctor.doctor_id.toString(),
      doctor_id: searchDoctor.doctor_id.toString(),
      full_name: searchDoctor.full_name,
      specialty: searchDoctor.specialty,
      cabinet: searchDoctor.cabinet,
      schedule_string: searchDoctor.schedule_string || t('by_appointment'),
      type: 'oms' as const
    };
  } else {
    doctor.value = selectedDoctor as Doctor;
  }
  
  isPaidService.value = false;
  selectedPaidService.value = null;
  visible.value = true;
  console.log('🎯 visible.value установлен в:', visible.value);
  console.log('🎯 doctor.value установлен в:', doctor.value);
}

function openScheduleModalForPaid(service: any) {
  console.log('🎯 openScheduleModalForPaid вызван с услугой:', service);
  
  // Проверяем наличие ИИН
  if (!userStore.iin || userStore.iin.length !== 12) {
    router.push("/auth-page");
    return;
  }
  
  selectedPaidService.value = service;
  isPaidService.value = true;
  // Создаем фиктивного доктора для платной услуги
  doctor.value = {
    id: service.id.toString(),
    doctor_id: service.id.toString(),
    full_name: service.full_name,
    specialty: service.specialty,
    cabinet: t('paid_cabinet'),
    schedule_string: t('by_appointment'),
    type: "paid"
  };
  visible.value = true;
  console.log('🎯 visible.value установлен в:', visible.value);
  console.log('🎯 doctor.value установлен в:', doctor.value);
}

function handleAppointmentBooked(appointmentInfo: any) {
  console.log('🎉 Запись подтверждена, показываем ApprovePage', appointmentInfo);
  console.log('🔍 DoctorsPage: appointmentResult из события:', appointmentInfo.appointmentResult);
  appointmentResult.value = appointmentInfo.appointmentResult;
  console.log('🔍 DoctorsPage: appointmentResult установлен:', appointmentResult.value);
  console.log('🔍 DoctorsPage: showApprovePage будет установлен в true');
  showApprovePage.value = true;
  console.log('🔍 DoctorsPage: showApprovePage установлен:', showApprovePage.value);
}

function closeApprovePage() {
  showApprovePage.value = false;
  appointmentResult.value = null;
  // Если ИИН очищен (автоматическое перенаправление), закрываем модалку расписания
  if (!userStore.iin || userStore.iin.length !== 12) {
    visible.value = false;
    doctor.value = null;
    isPaidService.value = false;
    selectedPaidService.value = null;
  }
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
/* Адаптивные стили для терминала 1440x2560 */
@media (min-width: 1440px) and (min-height: 2560px) {
  .bg-white {
    font-size: 18px;
  }
  
  .grid {
    gap: 1.5rem;
  }
  
  .px-4 {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  
  .py-4 {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
  
  .text-sm {
    font-size: 16px;
  }
  
  .text-xs {
    font-size: 14px;
  }
  
  
  /* Улучшенная прокрутка */
  .overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: #11AE78 #f0f0f0;
  }
  
  .overflow-y-auto::-webkit-scrollbar {
    width: 8px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 4px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #11AE78;
    border-radius: 4px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #0E9A6A;
  }
  
  
  .py-3 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  
  .px-6 {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  
  .py-4 {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
}

/* Стили для кастомных таблиц */
.grid {
  display: grid;
}

.grid-cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

.grid-cols-5 {
  grid-template-columns: repeat(5, 1fr);
}

/* Явные цвета для предотвращения черных цветов */
.bg-\[#f5f5f5\] {
  background-color: #f5f5f5 !important;
}

.text-\[#666666\] {
  color: #666666 !important;
}

.bg-\[#e5e5e5\] {
  background-color: #e5e5e5 !important;
}

.text-\[#333333\] {
  color: #333333 !important;
}

.bg-\[#f9f9f9\] {
  background-color: #f9f9f9 !important;
}

.border-\[#e0e0e0\] {
  border-color: #e0e0e0 !important;
}

.hover\:bg-\[#f0f0f0\]:hover {
  background-color: #f0f0f0 !important;
}

.hover\:bg-\[#e5e5e5\]:hover {
  background-color: #e5e5e5 !important;
}

/* Зеленые цвета для активных элементов */
.bg-\[#11AE78\] {
  background-color: #11AE78 !important;
}

.text-\[#11AE78\] {
  color: #11AE78 !important;
}

.border-\[#11AE78\] {
  border-color: #11AE78 !important;
}

.hover\:bg-\[#11AE78\]:hover {
  background-color: #11AE78 !important;
}

.hover\:text-white:hover {
  color: white !important;
}

.bg-\[#0E9A6A\] {
  background-color: #0E9A6A !important;
}

.hover\:bg-\[#0E9A6A\]:hover {
  background-color: #0E9A6A !important;
}

/* Принудительные стили для кнопок "Записаться" */
button[class*="border-2"][class*="border-[#11AE78]"] {
  border: 2px solid #11AE78 !important;
  color: #11AE78 !important;
  background-color: transparent !important;
}

button[class*="border-2"][class*="border-[#11AE78]"]:hover {
  background-color: #11AE78 !important;
  color: white !important;
}

/* Универсальные стили для всех кнопок "Записаться" */
button:has-text("Записаться"),
button[class*="book_appointment"],
button[class*="ml-2"][class*="border-2"] {
  border: 2px solid #11AE78 !important;
  color: #11AE78 !important;
  background-color: transparent !important;
}

button:has-text("Записаться"):hover,
button[class*="book_appointment"]:hover,
button[class*="ml-2"][class*="border-2"]:hover {
  background-color: #11AE78 !important;
  color: white !important;
}

/* Стили для кнопок "?" */
button[class*="bg-[#11AE78]"] {
  background-color: #11AE78 !important;
  color: white !important;
}

button[class*="bg-[#11AE78]"]:hover {
  background-color: #0E9A6A !important;
}

/* Hover эффекты для кнопок */
button[class*="border-2"][class*="border-[#11AE78]"]:hover {
  background-color: #11AE78 !important;
  color: white !important;
}

/* Принудительные стили для всех кнопок с зеленой рамкой */
button[style*="border: 2px solid #11AE78"]:hover {
  background-color: #11AE78 !important;
  color: white !important;
}

button[style*="background-color: #11AE78"]:hover {
  background-color: #0E9A6A !important;
}

/* Стили для кнопок */
button {
  transition: all 0.3s ease;
}

/* Максимально специфичные стили для кнопок "Записаться" */
div[class*="flex items-center justify-between"] button,
div[class*="flex items-center justify-end"] button[class*="border-2"] {
  border: 2px solid #11AE78 !important;
  color: #11AE78 !important;
  background-color: transparent !important;
}

div[class*="flex items-center justify-between"] button:hover,
div[class*="flex items-center justify-end"] button[class*="border-2"]:hover {
  background-color: #11AE78 !important;
  color: white !important;
}

/* Принудительные стили для всех кнопок с текстом "Записаться" */
button:contains("Записаться") {
  border: 2px solid #11AE78 !important;
  color: #11AE78 !important;
  background-color: transparent !important;
}

button:contains("Записаться"):hover {
  background-color: #11AE78 !important;
  color: white !important;
}

/* Принудительные стили для табов */
button[class*="flex-1"][class*="py-4"] {
  color: white !important;
}

button[class*="flex-1"][class*="py-4"]:not([class*="bg-[#11AE78]"]) {
  background-color: #0E9A6A !important;
}

button[class*="flex-1"][class*="py-4"]:hover {
  background-color: #11AE78 !important;
}

/* Скругления для табов */
button[class*="rounded-tl-lg"] {
  border-top-left-radius: 0.5rem !important;
}

button[class*="rounded-tr-lg"] {
  border-top-right-radius: 0.5rem !important;
}

/* Скругления для всех углов табов */
button[class*="flex-1"][class*="py-4"] {
  border-top-left-radius: 0.5rem !important;
  border-top-right-radius: 0.5rem !important;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Стили для скролла */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #11AE78 #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #11AE78;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #0E9A6A;
}

/* Фиксированная высота для прокрутки */
.table-scroll {
  max-height: 350px !important;
  min-height: 200px !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  scrollbar-gutter: stable;
}

/* Принудительная прокрутка - одинаковый размер для всех скроллбаров */
.table-scroll::-webkit-scrollbar {
  width: 8px !important;
  height: 8px !important;
  display: block !important;
  -webkit-appearance: none;
}

.table-scroll::-webkit-scrollbar-track {
  background: #f0f0f0 !important;
  border-radius: 4px !important;
}

.table-scroll::-webkit-scrollbar-thumb {
  background: #11AE78 !important;
  border-radius: 4px !important;
}

.table-scroll::-webkit-scrollbar-thumb:hover {
  background: #0E9A6A !important;
}

/* Вертикальный скроллбар */
.table-scroll::-webkit-scrollbar:vertical {
  width: 8px !important;
}

/* Горизонтальный скроллбар */
.table-scroll::-webkit-scrollbar:horizontal {
  height: 8px !important;
}

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

/* Стили для расписания */
.schedule-text {
  margin-bottom: 8px;
  max-width: 200px;
}

.schedule-item {
  font-size: 13px;
  color: #333;
  line-height: 1.4;
  margin-bottom: 4px;
  word-wrap: break-word;
}

.schedule-item:last-child {
  margin-bottom: 0;
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
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}

.custom-tabs .ant-tabs-nav {
  flex-shrink: 0;
}

.custom-tabs .ant-tabs-content-holder {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.custom-tabs .ant-tabs-tabpane {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Прокрутка для div контейнера таблиц */
.table-container {
  max-height: 40vh;
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

  /* Адаптивные стили для расписания на мобильных */
  .schedule-text {
    max-width: 150px;
  }

  .schedule-item {
    font-size: 12px;
    line-height: 1.3;
  }

  /* Адаптивная высота для мобильных */
  .custom-tabs {
    height: calc(100vh - 150px);
  }

  .table-container {
    height: calc(100vh - 250px);
    max-height: 400px;
  }
}
</style>

