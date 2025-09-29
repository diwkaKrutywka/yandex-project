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
    <!-- Видео в правом верху (скрыто во время глобальной анимации) -->
    <div
      class="info-video-container fixed z-50"
      :class="{ 'hidden-during-animation': isGlobalAnimating }"
      :style="{ top: '0.5rem', right: '1rem' }"
    >
      <AnimatedVideo position="top-right" />
    </div>
    <!-- Основной контент -->
    <main class="flex-1 flex flex-col bg-white px-2 sm:px-4 py-4 sm:py-6 overflow-y-auto">
      <!-- Иконка помощи -->
      <div class="flex justify-center my-6 sm:my-8 lg:my-10">
       <img src="../assets/ask.svg" alt="info-service" class="w-25 h-25 sm:w-28 sm:h-28 lg:w-28 lg:h-28 xl:w-32 xl:h-32"></img>
      </div>

      <!-- Заголовок -->
      <p class="text-[#11AE78] font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-center mb-6 sm:mb-8 px-2">
        {{ $t('service_info') }}
      </p>

      <!-- Список услуг -->
      <div class="space-y-2 sm:space-y-3 mb-6 sm:mb-8 mx-2 sm:mx-4 lg:mx-6">
        <div 
          v-for="service in services" 
          :key="service.id"
          @click="selectService('info-details')"
          class="bg-gradient-to-r from-[#11AE78] to-[#14865E] hover:from-[#0E9A6A] hover:to-[#0C593E] text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-[16px] sm:rounded-[20px] cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-between"
        >
          <span class="text-xs sm:text-xs md:text-sm lg:text-md">{{ service.name }}</span>
          <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
      </div>
    </main>

      <!-- Фиксированный футер -->
     
      <div class="fixed bottom-0 left-0 right-0 z-40 bg-[#E8F4F2]">
  <div
    @click="selectService('aigerim')"
    class="relative py-2 sm:py-3 mb-4 sm:mb-6 mt-4 sm:mt-6 max-w-xs sm:max-w-sm mx-auto bg-gradient-to-r from-[#0C593E] to-[#14865E] hover:from-[#0A4A33] hover:to-[#117A52] text-white font-bold pl-12 sm:pl-16 pr-4 sm:pr-6 rounded-xl sm:rounded-2xl text-md sm:text-base md:text-md lg:text-lg cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-between"
  >
    <!-- Фото Айгерим -->
    <div class="absolute left-0 -top-1 sm:-top-2">
      <img
        src="../assets/assel.svg"
        alt="chat"
        class="w-10 h-10 sm:w-12 sm:h-14 lg:w-16 lg:h-14 ml-2 sm:ml-4"
      />
    </div>

    <!-- Текст -->
    <div class="flex-1 text-center text-sm sm:text-md md:text-base">{{ $t("ask_aigerim") }}</div>

    <!-- Стрелка -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="white"
      class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
      />
    </svg>
  </div>




      <FooterNav :showHomeButton="true" :showBackButton="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDateTime } from "../composables/useDateTime";
import { useRouter } from "vue-router";
import FooterNav from "../components/FooterNav.vue";
import AnimatedVideo from "../components/AnimatedVideo.vue";
import { useI18n } from "vue-i18n";
import { ref, onMounted } from "vue";

const { currentDate, currentTime } = useDateTime();
const router = useRouter();
const { t: $t } = useI18n();

// Состояние глобальной анимации
const isGlobalAnimating = ref(true); // Начинаем со скрытого состояния

// Данные услуг
const services = [
  { id: 'general', name: 'Общие услуги' },
  { id: 'appointment', name: 'Запись на приём' },
  { id: 'documents', name: 'Документы и данные' },
  { id: 'payment', name: 'Оплата и страховка' },
  { id: 'results', name: 'Результаты и информация' }
];

// Функции навигации
const selectService = (serviceId: string) => {
  console.log(`Выбрана услуга: ${serviceId}`);
  // Здесь можно добавить логику для каждой услуги
  // Например, переход на соответствующие страницы
  switch(serviceId) {
    case 'info-details':
      router.push('/info-details');
      break;
    case 'aigerim':
      router.push('/chat');
      break;
    case 'general':
    case 'documents':
    case 'payment':
    case 'results':
      // Показываем демо-сообщение
      console.log(`Информация о разделе "${services.find(s => s.id === serviceId)?.name}" будет доступна в полной версии приложения`);
      break;
  }
};

// Показываем локальное видео после исчезновения глобального
onMounted(() => {
  setTimeout(() => {
    isGlobalAnimating.value = false;
  }, 1200); // Появляется почти одновременно с исчезновением глобального

  // Дополнительная гарантия скрытия глобального видео
  setTimeout(() => {
    (window as any).forceHideGlobalVideo?.();
  }, 1400); // Двойная гарантия
});

</script>

<style scoped>
.hidden-during-animation {
  opacity: 0;
  visibility: hidden;
}

.info-video-container {
  transition: opacity 0.1s ease-in-out, visibility 0.1s ease-in-out;
}

.info-video-container:not(.hidden-during-animation) {
  opacity: 1;
  visibility: visible;
}
</style>