<template>
  <div
    class="bg-[#E8F4F2] h-16 sm:h-18 lg:h-20 flex items-center justify-between shadow-sm w-full m-0 p-0"
  >
    <div 
      @click="goBack"
      class="bg-gradient-to-r from-[#14865E] to-[#11AE78] hover:from-[#117A52] hover:to-[#0E9A6A] flex items-center justify-center text-white px-3 py-2 rounded-full ml-4 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
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
      <span class="flex text-white items-center justify-center ml-2 my-auto mb-0 font-semibold text-xs sm:text-sm lg:text-base">Назад</span>
    </div>

    <!-- Индикатор языка -->
    <div
      class="w-[100px] bg-gradient-to-r from-[#14865E] to-[#11AE78] h-full rounded-tl-[40%] ml-6 mr-0 flex items-center justify-center"
    >
      <div
        class="w-10 h-10 rounded-full bg-white flex items-center justify-center"
      >
        <span
          class="text-[#14865E] text-[10px] sm:text-xs lg:text-sm font-bold"
        >
          {{ currentLanguage === "kk" ? "Қаз" : "Рус" }}
        </span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
const router = useRouter();
const { locale } = useI18n();

const currentLanguage = ref(locale.value);

onMounted(() => {});

onUnmounted(() => {});

const goBack = () => {
  console.log('🔙 Нажата кнопка Назад');
  console.log('📍 Текущий маршрут:', router.currentRoute.value.name);
  console.log('📍 Текущий путь:', router.currentRoute.value.path);
  
  // Если мы на ServiceView и возвращаемся на HomeView, запускаем анимацию
  if (router.currentRoute.value.name === 'ServiceView') {
    console.log('🏥 Возвращаемся из ServiceView на HomeView');
    
    // Устанавливаем флаг для анимации возврата
    sessionStorage.setItem('shouldReturnAnimate', 'true');
    
    // Переходим на HomeView и запускаем анимацию
    router.push('/home').then(() => {
      console.log('✅ Перешли на HomeView, запускаем анимацию');
      setTimeout(() => {
        console.log('🔍 Проверяем наличие startReturnAnimation:', !!(window as any).startReturnAnimation);
        if ((window as any).startReturnAnimation) {
          console.log('🎬 Вызываем startReturnAnimation');
          (window as any).startReturnAnimation();
        } else {
          console.error('❌ startReturnAnimation не найдена в window');
        }
      }, 200); // Увеличили задержку для загрузки DOM
    });
  } else {
    // Обычный возврат для других страниц
    console.log('📱 Обычный возврат назад, текущая страница:', router.currentRoute.value.name);
    router.back();
  }
};

</script>
