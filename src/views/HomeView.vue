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
            <video v-if="locale === 'ru'"
              src="../assets/video/home_ru.mp4"
              autoplay
              :muted="!isSoundEnabled"
              loop
              class="w-[105%] h-[105%]"
              style="margin: -2.5% 0 0 -2.5%; object-fit: cover; object-position: center; filter: contrast(1.1) brightness(1.05) saturate(1.1) sharpen(0.5);"
            ></video>
            <video v-if="locale === 'kk'"
              src="../assets/video/home_kz.mp4"
              autoplay
              :muted="!isSoundEnabled"
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

        <!-- Вторая строка - кнопки поиска и Айгерим -->
        <div class="flex gap-4">
         
          <div
            @click="selectService('aigerim')"
            class="flex-1 bg-gradient-to-r from-[#0C593E] to-[#14865E] hover:from-[#0A4A33] hover:to-[#117A52] text-white font-bold py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 rounded-xl sm:rounded-2xl text-sm sm:text-base lg:text-lg cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
      </div>
    </main>

    <!-- Нижняя навигация -->
    <FooterNav :show-search="true" :show-back-button="false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDateTime } from "../composables/useDateTime";
import FooterNav from "../components/FooterNav.vue";
import { useI18n } from "vue-i18n";
import { useSoundControl } from '../composables/useSoundControl'
const { isSoundEnabled } = useSoundControl()
const { locale } = useI18n()
const router = useRouter();
const route = useRoute();

// Используем единый composable для времени и даты
const { currentDate, currentTime } = useDateTime();


// Состояние анимации видео - скрываем видео если есть флаг анимации
const isAnimating = ref(false);

console.log('🏠 HomeView инициализация - видео скрыто если есть анимация:', {
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
      
      // Добавляем класс анимации к видео контейнеру
      videoContainer.classList.add('return-animation');
      
      console.log('🎬 Анимация добавлена к контейнеру');
      
      // Убираем класс анимации после завершения
      setTimeout(() => {
        videoContainer.classList.remove('return-animation');
        isAnimating.value = false; // Показываем видео в центре
        console.log('🏁 Анимация завершена, класс убран');
      }, 1500);
    } else if (attempts < 10) {
      // Повторяем попытку через 100ms, максимум 10 попыток
      setTimeout(() => findAndAnimateContainer(attempts + 1), 100);
    } else {
      console.error('❌ Не удалось найти video-container после 10 попыток');
    }
  };
  
  // Начинаем поиск сразу
  findAndAnimateContainer();
};

// Глобальная функция для запуска анимации возврата
(window as any).startReturnAnimation = startReturnAnimation;

// Отслеживаем возврат на HomeView для анимации
watch(route, (newRoute) => {
  console.log('🔄 Route change to:', newRoute.name, 'isAnimating:', isAnimating.value);
  if (newRoute.name === 'HomeView') {
    // Проверяем, нужно ли запустить анимацию возврата
    if (sessionStorage.getItem('shouldReturnAnimate') === 'true') {
      console.log('🎬 Запускаем анимацию возврата');
      sessionStorage.removeItem('shouldReturnAnimate');
      // Скрываем видео перед анимацией
      isAnimating.value = true;
      // Запускаем анимацию сразу
      startReturnAnimation();
    } else {
      // Если анимации нет, показываем видео сразу
      isAnimating.value = false;
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
    // Переходим на страницу справочной информации
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
  animation: returnFromService 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* Начальное состояние для анимации возврата */
.video-container.return-animation {
  opacity: 0;
}

@keyframes returnFromService {
  0% {
    transform: translate(400px, -400px) scale(0.05);
    opacity: 0;
  }
  100% {
    transform: translate(0, 0) scale(1);
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
