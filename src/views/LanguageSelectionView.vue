<template>
  <div class="h-screen bg-gradient-to-b from-[#E8F4F2] to-white flex flex-col overflow-hidden">
    <!-- Верхняя навигация -->
    <nav class="bg-[#E8F4F2] h-16 sm:h-20 lg:h-24 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm w-full">
      <!-- Дата и время -->
      <div class="text-[#11AE78] font-bold text-lg sm:text-xl lg:text-2xl leading-tight">
        <div>{{ currentTime }}</div>
        <div class="text-[#14865E] text-sm sm:text-base lg:text-lg font-bold">{{ currentDate }}</div>
      </div>
      
      <!-- Пустое место для баланса -->
      <div class="w-20 sm:w-24 lg:w-28"></div>
    </nav>

    <!-- Основной контент -->
    <main class="flex-1 flex flex-col items-center justify-center px-4 py-2 sm:py-4 bg-white">
      <!-- Заголовки -->
      <div class="text-center mb-4 sm:mb-6">
        <div class="text-[#11AE78] font-bold text-base sm:text-lg lg:text-xl xl:text-2xl mb-1 sm:mb-2">
          №3 емханаға қош <br />келдіңіздер
        </div>
        <div class="text-green-700 font-bold text-base sm:text-lg lg:text-xl xl:text-2xl mb-1 sm:mb-2">
          Добро пожаловать  <br /> в поликлинику
        </div>
      </div>

      <!-- Видео контейнер -->
      <div class="mb-4 sm:mb-6">
        <div class="w-40 h-40 sm:w-54 sm:h-54 lg:w-64 lg:h-64 xl:w-76 xl:h-76 rounded-full border-2 sm:border-4 border-[#E8F4F2] overflow-hidden shadow-lg bg-white video-glow">
          <video 
            src="../assets/idle.mp4" 
            autoplay 
            muted 
            loop 
            class="w-full h-full object-cover"
          ></video>
        </div>
      </div>

      <!-- Кнопки выбора языка -->
      <div class="font-semibold mb-3 sm:mb-4 text-xs sm:text-sm lg:text-base flex items-center"> 
        Тілді таңдаңыз 
        <div class="mx-1 sm:mx-2 flex items-center justify-center">•</div> 
        Выберите язык
      </div>
      <div class="flex  sm:flex-row gap-4 sm:gap-6">
       
        <div 
          @click="selectLanguage('kk')"
          class="bg-[#0C593E] hover:bg-[#0A4A33] text-white w-28 sm:w-32 lg:w-36 xl:w-40 font-bold py-2 sm:py-3 lg:py-4 px-4 sm:px-6 lg:px-8 xl:px-10 rounded-full text-sm sm:text-base lg:text-lg xl:text-xl cursor-pointer flex items-center justify-center text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Қазақ
        </div>
        <div 
          @click="selectLanguage('ru')"
          class="bg-[#0C593E] hover:bg-[#0A4A33] text-white w-28 sm:w-32 lg:w-36 xl:w-40 font-bold py-2 sm:py-3 lg:py-4 px-4 sm:px-6 lg:px-8 xl:px-10 rounded-full text-sm sm:text-base lg:text-lg xl:text-xl cursor-pointer flex items-center justify-center text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Русский
        </div>
      </div>
    </main>

    <!-- Нижняя навигация -->
    <nav class="bg-[#E8F4F2] h-16 sm:h-16 lg:h-20 flex items-center justify-center shadow-sm w-full">
      <div class="text-green-600 text-[10px] sm:text-xs lg:text-sm xl:text-base">
       
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDateTime } from '../composables/useDateTime'

const router = useRouter()
const { locale } = useI18n()

// Используем единый composable для времени и даты
const { currentDate, currentTime } = useDateTime()

const selectLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('currentLang', lang)
  console.log(`Выбран язык: ${lang}`)
  // Переход на главную страницу с выбранным языком
  router.push('/home')
}
</script>
