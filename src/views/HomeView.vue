<template>
  <div class="w-full h-full bg-[#E8F4F2] flex flex-col overflow-hidden m-0 p-0">
    <!-- Верхняя навигация -->
    <nav
      class="bg-[#E8F4F2] h-16 sm:h-20 lg:h-24 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm w-full m-0 p-0"
    >
      <!-- Дата и время -->
      <div class="text-[#11AE78] font-bold text-lg sm:text-xl lg:text-2xl leading-tight">
        <div>{{ currentTime }}</div>
        <div class="text-[#14865E] text-sm sm:text-base lg:text-lg font-bold">{{ currentDate }}</div>
      </div>

      <!-- Пустое место для баланса -->
      <div class="w-20 sm:w-24 lg:w-28"></div>
    </nav>

    <!-- Основной контент -->
    <main
      class="flex-1 flex flex-col items-center justify-center px-4 py-2 sm:py-4 bg-white"
    >
      <!-- Заголовки -->
      <div class="text-center mb-4 sm:mb-6">
        <div
          class="text-[#11AE78] font-bold text-lg sm:text-xl lg:text-2xl mb-1 sm:mb-2 leading-tight"
          v-html="$t('choose_service')"
        ></div>
      </div>

      <!-- Видео контейнер -->
      <div class="mb-4 sm:mb-6">
        <div 
          class="video-container"
          :class="{ 'hide-video': isAnimating }"
        >
          <div
            class="w-[202px] h-[202px] sm:w-[186px] sm:h-[186px] lg:w-[250px] lg:h-[250px] xl:w-[274px] xl:h-[274px] rounded-full overflow-hidden shadow-lg bg-white video-glow gradient-border"
          >
            <video
              src="../assets/idle.mp4"
              autoplay
              muted
              loop
              class="w-[105%] h-[105%]"
              style="margin: -2.5% 0 0 -2.5%; object-fit: cover; object-position: center; filter: contrast(1.1) brightness(1.05) saturate(1.1) sharpen(0.5);"
            ></video>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2 w-full max-w-md">
        <!-- Первая строка кнопок -->
        <div class="flex gap-4">
          <div
            @click="selectService('appointment')"
            class="flex-1 bg-gradient-to-r from-[#0C593E] to-[#14865E] hover:from-[#0A4A33] hover:to-[#117A52] text-white font-bold py-2 sm:py-3 lg:py-4 px-2 sm:px-4 lg:px-6 rounded-xl sm:rounded-2xl text-xs sm:text-base lg:text-lg cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div class="flex flex-col items-start gap-1">
              <img
                src="../assets/appointment.svg"
                alt="appointment"
                class="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7"
              />
              <p class="text-start text-xs sm:text-sm lg:text-base mb-0" v-html="$t('make_appointment')"></p>
            </div>
          </div>
          <div
            @click="selectService('help')"
            class="flex-1 bg-gradient-to-r from-[#14865E] to-[#11AE78] hover:from-[#117A52] hover:to-[#0E9A6A] text-white font-bold py-2 sm:py-3 lg:py-4 px-2 sm:px-4 lg:px-6 rounded-xl sm:rounded-2xl text-xs sm:text-base lg:text-lg cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div class="flex flex-col items-start gap-1">
              <img src="../assets/help.svg" alt="help" class="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
              <p class="text-start text-xs sm:text-sm lg:text-base mb-0"  v-html="$t('help_center')"></p>
            </div>
          </div>
        </div>

        <!-- Вторая строка - кнопка Айгерим -->
        <div
          @click="selectService('aigerim')"
          class="w-full bg-gradient-to-r from-[#0C593E] to-[#14865E] hover:from-[#0A4A33] hover:to-[#117A52] text-white font-bold py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 rounded-xl sm:rounded-2xl text-sm sm:text-base lg:text-lg cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div class="flex items-center justify-between gap-3">
            <img src="../assets/chat.svg" alt="chat" class="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
            <div class="margin-auto">{{ $t("ask_aigerim") }}</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="white"
              class="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
              />
            </svg>
          </div>
        </div>
      </div>
    </main>

    <!-- Нижняя навигация -->
    <nav
      class="bg-[#E8F4F2] h-16 sm:h-18 lg:h-20 flex items-center justify-between shadow-sm w-full m-0 p-0"
    >
      <!-- Поиск -->
      <div class="flex-1 max-w-md ml-4 my-4">
        <div class="relative">
          <input
            type="text"
            :placeholder="$t('search_placeholder')"
            class="w-full px-3 sm:px-4 py-1.5 sm:py-2 pl-8 sm:pl-10 pr-8 sm:pr-10 text-xs sm:text-sm lg:text-base border-2 border-[#11AE78] bg-white rounded-xl sm:rounded-[14px] focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <div
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
          >
            <svg
              class="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-green-700 font-extrabold"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Индикатор языка -->
      <div
        class="w-[100px] bg-gradient-to-r from-[#14865E] to-[#11AE78] h-full rounded-tl-[30%] ml-6 mr-0 flex items-center justify-center"
      >
        <div
          class="w-10 h-10 rounded-full bg-white flex items-center justify-center"
        >
          <span class="text-[#14865E] text-[10px] sm:text-xs lg:text-sm font-bold">
            {{ currentLanguage === "kk" ? "Қаз" : "Рус" }}
          </span>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useDateTime } from "../composables/useDateTime";

const router = useRouter();
const route = useRoute();
const { locale } = useI18n();

// Используем единый composable для времени и даты
const { currentDate, currentTime } = useDateTime();

const currentLanguage = ref(locale.value);

// Состояние анимации видео - ВСЕГДА показываем видео по умолчанию
const isAnimating = ref(false);

console.log('🏠 HomeView инициализация - видео ВСЕГДА показано по умолчанию:', {
  isAnimating: isAnimating.value,
  sessionStorage: sessionStorage.getItem('shouldReturnAnimate')
});

// Функция для запуска анимации возврата
const startReturnAnimation = () => {
  console.log('🎬 Запускаем анимацию возврата видео');
  
  // Функция для поиска контейнера с повторными попытками
  const findAndAnimateContainer = (attempts = 0) => {
    const videoContainer = document.querySelector('.video-container');
    console.log(`🎯 Попытка ${attempts + 1}: Video container found:`, !!videoContainer);
    
    if (videoContainer) {
      console.log('✨ Запускаем простую анимацию');
      
      // Просто добавляем класс анимации к видео контейнеру
      videoContainer.classList.add('return-animation');
      
      console.log('🎬 Анимация добавлена к контейнеру');
      
      // Убираем класс анимации после завершения
      setTimeout(() => {
        videoContainer.classList.remove('return-animation');
        console.log('🏁 Анимация завершена, класс убран');
      }, 1600);
    } else if (attempts < 10) {
      // Повторяем попытку через 100ms, максимум 10 попыток
      setTimeout(() => findAndAnimateContainer(attempts + 1), 100);
    } else {
      console.error('❌ Не удалось найти video-container после 10 попыток');
    }
  };
  
  // Начинаем поиск через 100ms
  setTimeout(() => findAndAnimateContainer(), 100);
};

// Глобальная функция для запуска анимации возврата
(window as any).startReturnAnimation = startReturnAnimation;

// Отслеживаем возврат на HomeView для анимации
watch(route, (newRoute) => {
  console.log('🔄 Route change to:', newRoute.name, 'isAnimating:', isAnimating.value);
  if (newRoute.name === 'HomeView') {
    // Просто убираем флаг если он есть, больше ничего не делаем
    if (sessionStorage.getItem('shouldReturnAnimate') === 'true') {
      console.log('🎬 Убираем флаг анимации');
      sessionStorage.removeItem('shouldReturnAnimate');
    }
    console.log('📺 Видео должно быть видимо, isAnimating:', isAnimating.value);
  }
});

onUnmounted(() => {
  // Очистка интервала теперь происходит в useDateTime composable
});

const selectService = (service: string) => {
  console.log(`Выбрана услуга: ${service}`);
  if (service === "aigerim") {
    router.push("/chat");
  } else if (service === "appointment") {
    // Скрываем локальное видео и запускаем глобальную анимацию
    isAnimating.value = true;
    (window as any).startVideoTransition();
    
    // Переходим на страницу через небольшую задержку
    setTimeout(() => {
      router.push("/service");
    }, 100);
  }
  else if (service === "help") {
    router.push("/info-service");
  }
};
</script>

<style scoped>
/* Скрытие локального видео при анимации */
.hide-video {
  opacity: 0;
  transition: opacity 0.1s ease-out;
}

/* Простая анимация возврата видео */
.return-animation {
  animation: returnFromService 1.6s ease-out forwards;
}

@keyframes returnFromService {
  0% {
    transform: translate(200px, -200px) scale(0.5) rotate(45deg);
    opacity: 0.5;
  }
  50% {
    transform: translate(100px, -100px) scale(0.75) rotate(22deg);
    opacity: 0.8;
  }
  100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 1;
  }
}

/* Градиентный бордер */
.gradient-border {
  position: relative;
}

.gradient-border::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  background: linear-gradient(45deg, #11AE78, #E8F4F2, #11AE78);
  border-radius: 50%;
  z-index: -1;
}
</style>
