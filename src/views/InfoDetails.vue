<template>
    <div class="h-screen bg-gradient-to-b from-[#E8F4F2] to-white flex flex-col w-full">
      <!-- Верхняя навигация -->
      <nav class="bg-[#E8F4F2] h-16 sm:h-20 lg:h-24 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm w-full flex-shrink-0">
        <!-- Дата и время -->
        <div class="text-[#11AE78] font-bold text-lg sm:text-xl lg:text-2xl leading-tight">
          <div>{{ currentTime }}</div>
          <div class="text-[#14865E] text-sm sm:text-base lg:text-lg font-bold">{{ currentDate }}</div>
        </div>
      
      </nav>
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
      <!-- Основной контент -->
      <main class="flex-1 flex flex-col bg-white px-2 sm:px-4 py-4 sm:py-6 overflow-y-auto">
        <!-- Иконка помощи -->
        <div class="flex justify-center my-6 sm:my-8 lg:my-10">
         <img src="../assets/clinic.svg" alt="info-service" class="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32"></img>
        </div>
  
        <!-- Заголовок -->
        <p class="text-[#11AE78] font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-center mb-6 sm:mb-8 lg:mb-10 px-2">
          {{ $t('general_services') }}
        </p>
        <a-collapse
  v-model:activeKey="activeKey"
  accordion
  ghost
  expand-icon-position="end"
  class="custom-collapse"
>
  <a-collapse-panel
    v-for="(item, index) in faqList"
    :key="item.id"
    :header="item.question"
    :class="index % 2 === 0 ? 'bg-white' : 'bg-[#E8F4F2]'"
  >
    <ul class="list-disc pl-5 space-y-1 text-gray-700 text-left">
      <li v-for="(ans, idx) in item.answer" :key="idx">
        {{ ans }}
      </li>
    </ul>
  </a-collapse-panel>
</a-collapse>

       </main>
  
  
  
        <FooterNav :showHomeButton="true" />
 
    </div>
  </template>
  
<script setup lang="ts">
import { useDateTime } from "../composables/useDateTime";
// import { useRouter } from "vue-router";
import FooterNav from "../components/FooterNav.vue";
import { useI18n } from "vue-i18n";

const { currentDate, currentTime } = useDateTime();
// const router = useRouter();
const { t: $t, locale } = useI18n();
  import { ref, computed } from "vue";
  // Данные услуг
  // const services = [
  //   { id: 'general', name: 'Общие услуги' },
  //   { id: 'appointment', name: 'Запись на приём' },
  //   { id: 'documents', name: 'Документы и данные' },
  //   { id: 'payment', name: 'Оплата и страховка' },
  //   { id: 'results', name: 'Результаты и информация' }
  // ];
  interface FaqItem {
  id: number;
  question: string;
  answer: string[];
}

const activeKey = ref<number | string>("1");

// Многоязычные ответы для FAQ
const answers = {
  ru: {
    available_services: [
      "Приём врачей-специалистов (терапевт, педиатр, хирург и др.)",
      "Запись на диагностику и анализы", 
      "Получение справок и медицинских документов",
      "Платные услуги (консультации, обследования, процедуры)",
      "Проверка и обновление данных прикрепления"
    ],
    how_to_attach: ["При наличии ЭЦП прикрепиться к поликлинике можно на портале электронного правительства www.e.gov.kz. Для этого в разделе «здравоохранение» необходимо выбрать услугу «Прикрепление к медицинской организации, оказывающей первичную медико-санитарную помощь». Как только все поля будут заполнены, информация о пациенте автоматически поступит в поликлинику. Если все манипуляции были проделаны верны, обратившемуся придет уведомление о прикреплении, подтверждённое электронно-цифровой подписью медицинского учреждения."],
    call_doctor_home: ["Вызвать врача на дом можно позвонив в регистратуру, а также при подаче электронной заявки на получение государственной услуги «Вызов врача на дом» через портал электронного правительства www.egov.kz при наличии электронной цифровой подписи, либо через мобильное приложение «Damumed»."],
    get_tests_referral: ["Чтобы получить направление на анализы в поликлинике по месту жительства (по ОМС или ОСМС в Казахстане), вам необходимо записаться на прием к врачу (терапевту или узкому специалисту). Во время приема врач оценит состояние вашего здоровья и, при необходимости, выпишет направление на нужные анализы. Затем вы сможете пройти обследование в поликлинике или в лаборатории, заключившей договор с вашей поликлиникой."],
    screening_research: ["Скрининг в поликлинике — это профилактический медицинский осмотр здоровых людей определённого возраста, направленный на выявление заболеваний (особенно онкологических, сердечно-сосудистых, диабета) и факторов риска на ранней стадии, когда они еще не проявляют себя симптомами. Такие обследования проводятся в рамках Гарантированного объема бесплатной медицинской помощи, позволяют подобрать своевременное лечение и профилактические меры, а также формируют и укрепляют здоровье населения"]
  },
  kk: {
    available_services: [
      "Маман дәрігерлердің қабылдауы (терапевт, педиатр, хирург және т.б.)",
      "Диагностика және талдауға жазылу", 
      "Анықтамалар мен медициналық құжаттарды алу",
      "Ақылы қызметтер (консультациялар, тексерулер, процедуралар)",
      "Тіркелу деректерін тексеру және жаңарту"
    ],
    how_to_attach: ["ЭЦП болған жағдайда поликлиникаға тіркелу электрондық үкімет порталы www.e.gov.kz арқылы мүмкін. Ол үшін «денсаулық сақтау» бөлімінде «Бірінші медицина-санитарлық көмек көрсететін медициналық ұйымға тіркелу» қызметін таңдау керек. Барлық өрістер толтырылғаннан кейін, науқас туралы ақпарат автоматты түрде поликлиникаға жіберіледі. Егер барлық әрекеттер дұрыс орындалса, тіркелген адамға медициналық мекеменің электронды-цифрлық қолтаңбасымен расталған тіркелу туралы хабарлама келеді."],
    call_doctor_home: ["Дәрігерді үйге шақыру үшін тіркеу бөліміне телефон соғып, сондай-ақ электрондық үкімет порталы www.egov.kz арқылы «Дәрігерді үйге шақыру» мемлекеттік қызметін алуға электрондық заявка беруге болады, электрондық цифрлық қолтаңба болған жағдайда, немесе «Damumed» мобильді қосымшасы арқылы."],
    get_tests_referral: ["Тұрған жері бойынша поликлиникада (Қазақстанда ОМС немесе ОСМС бойынша) талдауға бағыттама алу үшін дәрігерге (терапевтке немесе тар маманға) қабылдауға жазылу керек. Қабылдау кезінде дәрігер сіздің денсаулық жағдайыңызды бағалап, қажет болса, қажетті талдауларға бағыттама жазады. Содан кейін сіз поликлиникада немесе поликлиникамен келісімшарт жасасқан зертханада тексерулерден өте аласыз."],
    screening_research: ["Поликлиникадағы скрининг - бұл белгілі бір жастағы дені сау адамдардың профилактикалық медициналық тексерісі, ауруларды (әсіресе онкологиялық, жүрек-қан тамыр, диабет) және қауіп факторларын ерте кезеңде, олар әлі симптомдармен көрінбейтін кезде анықтауға бағытталған. Мұндай тексерулер Кепілдік берілген медициналық көмек көлемі шеңберінде жүргізіледі, уақтылы емдеу және профилактикалық шараларды таңдауға мүмкіндік береді, сондай-ақ халықтың денсаулығын қалыптастыру және нығайтуға ықпал етеді"]
  },
  en: {
    available_services: [
      "Specialist doctor consultations (therapist, pediatrician, surgeon, etc.)",
      "Registration for diagnostics and tests", 
      "Obtaining certificates and medical documents",
      "Paid services (consultations, examinations, procedures)",
      "Checking and updating attachment data"
    ],
    how_to_attach: ["With an EDS, you can attach to a polyclinic through the e-government portal www.e.gov.kz. To do this, in the 'healthcare' section, you need to select the service 'Attachment to a medical organization providing primary health care'. As soon as all fields are filled in, information about the patient will automatically be sent to the polyclinic. If all manipulations were performed correctly, the applicant will receive a notification about the attachment, confirmed by the electronic digital signature of the medical institution."],
    call_doctor_home: ["You can call a doctor to your home by calling the registry, as well as by submitting an electronic application for the state service 'Call a doctor to your home' through the e-government portal www.egov.kz if you have an electronic digital signature, or through the mobile application 'Damumed'."],
    get_tests_referral: ["To get a referral for tests at a polyclinic at your place of residence (under CHI or CHI in Kazakhstan), you need to make an appointment with a doctor (therapist or narrow specialist). During the appointment, the doctor will assess your health condition and, if necessary, write a referral for the necessary tests. Then you can undergo an examination at a polyclinic or in a laboratory that has entered into an agreement with your polyclinic."],
    screening_research: ["Screening in a polyclinic is a preventive medical examination of healthy people of a certain age, aimed at identifying diseases (especially oncological, cardiovascular, diabetes) and risk factors at an early stage, when they do not yet manifest themselves with symptoms. Such examinations are carried out within the framework of the Guaranteed volume of free medical care, allow you to choose timely treatment and preventive measures, and also form and strengthen the health of the population"]
  }
};

// Реактивный FAQ список
const faqList = computed(() => [
  {
    id: 1,
    question: $t('faq_questions.available_services'),
    answer: answers[locale.value as keyof typeof answers]?.available_services || answers.ru.available_services
  },
  {
    id: 2,
    question: $t('faq_questions.how_to_attach'),
    answer: answers[locale.value as keyof typeof answers]?.how_to_attach || answers.ru.how_to_attach
  },
  {
    id: 3,
    question: $t('faq_questions.call_doctor_home'),
    answer: answers[locale.value as keyof typeof answers]?.call_doctor_home || answers.ru.call_doctor_home
  },
  {
    id: 4,
    question: $t('faq_questions.get_tests_referral'),
    answer: answers[locale.value as keyof typeof answers]?.get_tests_referral || answers.ru.get_tests_referral
  },
  {
    id: 5,
    question: $t('faq_questions.screening_research'),
    answer: answers[locale.value as keyof typeof answers]?.screening_research || answers.ru.screening_research
  }
]);
  // Функции навигации
  // const selectService = (serviceId: string) => {
  //   console.log(`Выбрана услуга: ${serviceId}`);
  //   // Здесь можно добавить логику для каждой услуги
  //   // Например, переход на соответствующие страницы
  //   switch(serviceId) {
  //     case 'appointment':
  //       router.push('/service');
  //       break;
  //     case 'aigerim':
  //       router.push('/chat');
  //       break;
  //     case 'general':
  //     case 'documents':
  //     case 'payment':
  //     case 'results':
  //       // Показываем демо-сообщение
  //       alert(`Информация о разделе "${services.find(s => s.id === serviceId)?.name}" будет доступна в полной версии приложения`);
  //       break;
  //   }
  // };
  
  </script>
  
  <style scoped>
  .custom-collapse :deep(.ant-collapse-item) {
    border: none !important; /* убираем границы */
  }
  
  .custom-collapse :deep(.ant-collapse-header) {
    padding-left: 0.75rem !important; /* текст ближе к левому краю */
    font-weight: 600;
    font-size: 16px;
    color: black;
    text-align: left;
  }
  
  .custom-collapse :deep(.ant-collapse-content-box) {
    padding-left: 1rem; /* чтобы списки были чуть смещены */
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  /* Адаптивные стили для мобильных устройств */
  @media (min-width: 640px) {
    .custom-collapse :deep(.ant-collapse-header) {
      padding-left: 1rem !important;
      font-size: 15px;
    }
    
    .custom-collapse :deep(.ant-collapse-content-box) {
      padding-left: 1.5rem;
    }
  }

  @media (min-width: 1024px) {
    .custom-collapse :deep(.ant-collapse-header) {
      font-size: 16px;
    }
  }
  </style>
  