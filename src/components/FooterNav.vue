<template>
  <div class="relative w-full m-0 p-0">
    <!-- QR-кнопка (относительно всей страницы, а не футера) -->
    <div
      v-if="props.showQR"
      class="fixed bottom-[60px] right-6 z-10 bg-[#005F62] rounded-t-[40px] px-4 py-4 cursor-pointer transition-all duration-300 shadow-lg qr-animate"
      @click="handleQRClick"
    >
      <div class="flex flex-col items-center text-white">
        <span
          class="text-xs sm:text-xs font-semibold mb-1 leading-tight text-center"
        >
          Подробнее<br />о терминале
        </span>
        <img
          src="../assets/bx_qr.svg"
          alt="QR code"
          class="w-8 h-8 sm:w-10 sm:h-10"
        />
      </div>
    </div>

    <!-- Основной футер -->
    <div
      class="fixed bottom-0 left-0 bg-[#E8F4F2] h-16 sm:h-18 lg:h-20 flex items-center justify-between shadow-sm w-full z-20"
      style="border-top-left-radius: 0; border-top-right-radius: 40px;"
    >
      <!-- Левая часть футера -->
      <div class="flex items-center flex-1">
        <!-- Поиск -->
        <div v-if="props.showSearch" class="flex-1 max-w-md ml-4 my-4">
          <div class="relative">
            <input
              type="text"
              :placeholder="$t('search_placeholder')"
              @click="goToSearch"
              class="w-full px-3 sm:px-4 py-1.5 sm:py-2 pl-8 sm:pl-10 pr-8 sm:pr-10 text-xs sm:text-sm lg:text-base border-2 border-[#11AE78] bg-white rounded-xl sm:rounded-[14px] focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
              readonly
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
        <!-- Кнопка Назад -->
        <div
          v-if="props.showBackButton"
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
            >{{ $t("back_button") }}</span
          >
        </div>

        <!-- Кнопка Главная -->
        <div
          v-if="props.showHomeButton"
          @click="goHome"
          class="flex bg-white items-center ml-6 justify-center px-4 py-2.5 rounded-full cursor-pointer text-[#11AE78] font-semibold text-xs sm:text-sm lg:text-base border-2 border-[#11AE78] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          <span
            class="flex items-center justify-center ml-2 my-auto mb-0 font-semibold text-xs sm:text-sm lg:text-base"
            >{{ $t("home_button") }}</span
          >
        </div>

        <!-- Кнопка Чат -->
        <div
          v-if="props.showChat"
          @click="goToChat"
          class="flex bg-white items-center ml-6 justify-center px-4 py-2.5 rounded-full cursor-pointer text-[#11AE78] font-semibold text-xs sm:text-sm lg:text-base border-2 border-[#11AE78] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          <img src="../assets/chat.svg" alt="chat" class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2" />
          <span
            class="flex items-center justify-center my-auto mb-0 font-semibold text-xs sm:text-sm lg:text-base"
            >{{ $t("ask_aigerim") }}</span
          >
        </div>
      </div>

      <!-- Правая часть футера -->
      <div
        class="w-[200px] bg-gradient-to-r from-[#14865E] to-[#11AE78] h-full rounded-tl-[40px] flex items-center justify-center gap-3 px-4"
      >
        <!-- Кнопка языка -->
        <div
          v-if="props.showLanguageButton"
          class="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md cursor-pointer transition-all duration-300 transform hover:scale-105"
          @click="toggleLanguage"
        >
          <span class="text-[#14865E] text-sm font-bold">
            {{ currentLanguage === "kk" ? $t("language_rus") : $t("language_kaz") }}
          </span>
        </div>

        <!-- Кнопка звука -->
        <div
          class="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md cursor-pointer transition-all duration-300 transform hover:scale-105"
          @click="toggleSound"
        >
          <img :src="soundIcon" alt="sound" :class="soundIconClass" />
        </div>
      </div>
    </div>
    
    <!-- Модалка StaticAd -->
    <StaticAd 
      v-if="showStaticAd"
      :isVisible="showStaticAd" 
      @close="closeStaticAd" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useSoundControl } from "../composables/useSoundControl";
import StaticAd from "./StaticAd.vue";

interface Props {
  showHomeButton?: boolean;
  showQR?: boolean;
  showChat?: boolean;
  showSearch?: boolean;
  showBackButton?: boolean;
  showLanguageButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showHomeButton: false,
  showQR: true,
  showChat: false,
  showSearch: false,
  showBackButton: true,
  showLanguageButton: true,
});

const router = useRouter();
const { locale } = useI18n();
const { toggleSound, soundIcon, soundIconClass } = useSoundControl();

// Состояние для модалки StaticAd
const showStaticAd = ref(false);

const currentLanguage = ref(locale.value);

onMounted(() => {
  const savedLanguage = localStorage.getItem("currentLang");
  if (savedLanguage && (savedLanguage === "ru" || savedLanguage === "kk")) {
    currentLanguage.value = savedLanguage;
    locale.value = savedLanguage;
  }
});

const goBack = () => {
  console.log('🔙 goBack вызван, текущий маршрут:', router.currentRoute.value.name);
  
  if (router.currentRoute.value.name === "ServiceView" || router.currentRoute.value.name === "SearchPage" || router.currentRoute.value.name === "InfoService") {
    console.log('🎬 Устанавливаем флаг анимации для:', router.currentRoute.value.name);
    sessionStorage.setItem("shouldReturnAnimate", "true");
    router.push("/home").then(() => {
      setTimeout(() => {
        if ((window as any).startReturnAnimation) {
          (window as any).startReturnAnimation();
        }
      }, 200);
    });
  } else {
    console.log('⬅️ Обычный возврат для:', router.currentRoute.value.name);
    router.back();
  }
};

const goHome = () => {
  router.push("/home");
};

const goToChat = () => {
  router.push("/chat");
};

const goToSearch = () => {
  // Запускаем глобальную анимацию для перехода на SearchPage
  (window as any).startVideoTransition();
  
  // Переходим на страницу через небольшую задержку
  setTimeout(() => {
    router.push("/search");
  }, 100);
};

const toggleLanguage = () => {
  const newLocale = currentLanguage.value === "ru" ? "kk" : "ru";
  currentLanguage.value = newLocale;
  locale.value = newLocale;
  localStorage.setItem("currentLang", newLocale);
};

const handleQRClick = () => {
 console.log('🔍 QR клик - открываем модалку StaticAd');
 showStaticAd.value = true;
 console.log('🔍 showStaticAd.value:', showStaticAd.value);
};

const closeStaticAd = () => {
 showStaticAd.value = false;
};
</script>

<style scoped>
@keyframes pulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(17,174,120,0.9); }
  70% { transform: scale(1.05); box-shadow: 0 0 18px 6px rgba(17,174,120,0.6); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(17,174,120,0); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-4px); }
  60% { transform: translateY(-2px); }
}

.qr-animate {
  animation: pulse 2s infinite, bounce 3s infinite;
  border-radius: 16px 16px 0 0;
}
</style>