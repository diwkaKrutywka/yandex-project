<template>
  <div
    class="bg-[#E8F4F2] h-16 sm:h-18 lg:h-20 flex items-center justify-between shadow-sm w-full m-0 p-0"
  >
    <div class="flex items-center">
      <div
        @click="goBack"
        class="border-2 border-[#11AE78] bg-gradient-to-r from-[#14865E] to-[#11AE78] hover:from-[#117A52] hover:to-[#0E9A6A] flex items-center justify-center text-white px-4 py-2.5 rounded-full ml-4 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="white"
          class="size-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        <span
          class="flex text-white items-center justify-center ml-2 my-auto mb-0 font-semibold text-xs sm:text-sm lg:text-base"
          >{{ $t('back_button') }}</span
        >
      </div>

      <!-- Кнопка Главная (видна только когда showHomeButton = true) -->
      <div
        v-if="showHomeButton"
        @click="goHome"
        class="flex bg-white items-center ml-6 justify-center px-4 py-2.5 rounded-full cursor-pointer text-[#11AE78] font-semibold text-xs sm:text-sm lg:text-base border-2 border-[#11AE78] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
      >
        <span
          class="flex items-center items-center justify-center ml-2 my-auto mb-0 font-semibold text-xs sm:text-sm lg:text-base"
          >{{ $t('home_button') }}</span
        >
      </div>
    </div>
    <!-- Индикатор языка -->
    <div
      @click="toggleLanguage"
      class="w-[120px] bg-gradient-to-r from-[#14865E] to-[#11AE78] h-full rounded-tl-[40px] flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
    >
      <div
        class="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md"
      >
        <span
          class="text-[#14865E] text-sm font-bold"
        >
          {{ currentLanguage === "kk" ? $t('language_kaz') : $t('language_rus') }}
        </span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

// Пропсы
interface Props {
  showHomeButton?: boolean;
}

withDefaults(defineProps<Props>(), {
  showHomeButton: false,
});

const router = useRouter();
const { locale } = useI18n();

const currentLanguage = ref(locale.value);

onMounted(() => {
  // Загружаем сохраненный язык из localStorage (используем currentLang как в конфигурации i18n)
  const savedLanguage = localStorage.getItem("currentLang");
  if (savedLanguage && (savedLanguage === "ru" || savedLanguage === "kk")) {
    currentLanguage.value = savedLanguage;
    locale.value = savedLanguage;
  }
});

onUnmounted(() => {});

const goBack = () => {
  console.log("🔙 Нажата кнопка Назад");
  console.log("📍 Текущий маршрут:", router.currentRoute.value.name);
  console.log("📍 Текущий путь:", router.currentRoute.value.path);

  // Если мы на ServiceView и возвращаемся на HomeView, запускаем анимацию
  if (router.currentRoute.value.name === "ServiceView") {
    console.log("🏥 Возвращаемся из ServiceView на HomeView");

    // Устанавливаем флаг для анимации возврата
    sessionStorage.setItem("shouldReturnAnimate", "true");

    // Переходим на HomeView и запускаем анимацию
    router.push("/home").then(() => {
      console.log("✅ Перешли на HomeView, запускаем анимацию");
      setTimeout(() => {
        console.log(
          "🔍 Проверяем наличие startReturnAnimation:",
          !!(window as any).startReturnAnimation
        );
        if ((window as any).startReturnAnimation) {
          console.log("🎬 Вызываем startReturnAnimation");
          (window as any).startReturnAnimation();
        } else {
          console.error("❌ startReturnAnimation не найдена в window");
        }
      }, 200); // Увеличили задержку для загрузки DOM
    });
  } else {
    // Обычный возврат для других страниц
    console.log(
      "📱 Обычный возврат назад, текущая страница:",
      router.currentRoute.value.name
    );
    router.back();
  }
};

const goHome = () => {
  console.log("🏠 Нажата кнопка Главная");
  router.push("/home");
};

const toggleLanguage = () => {
  console.log("🌐 Переключение языка");
  const newLocale = currentLanguage.value === "ru" ? "kk" : "ru";
  currentLanguage.value = newLocale;
  locale.value = newLocale;
  
  // Сохраняем выбранный язык в localStorage (используем currentLang как в конфигурации i18n)
  localStorage.setItem("currentLang", newLocale);
  
  console.log("✅ Язык изменен на:", newLocale);
};
</script>
