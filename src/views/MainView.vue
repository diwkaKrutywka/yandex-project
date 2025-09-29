<template>
  <div class="h-screen bg-gradient-to-b from-[#E8F4F2] to-white flex flex-col overflow-hidden w-[100%]">
    <!-- Верхняя навигация -->
    <nav class="bg-[#E8F4F2] h-16 sm:h-20 lg:h-24 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm w-full">
      <!-- Дата и время -->
      <div class="text-[#11AE78] font-bold text-lg sm:text-xl lg:text-2xl leading-tight">
        <div>{{ currentTime }}</div>
        <div class="text-[#14865E] text-sm sm:text-base lg:text-lg font-bold">{{ currentDate }}</div>
      </div>

      <div class="w-20 sm:w-24 lg:w-28"></div>
    </nav>

    <!-- Основной контент -->
    <main class="flex-1 flex flex-col items-center justify-center px-4 py-2 sm:py-4 bg-white">
      <!-- Заголовки -->
      <div class="text-center mb-4 sm:mb-6">
        <div class="text-[#11AE78] font-bold text-base sm:text-lg lg:text-xl xl:text-2xl mb-1 sm:mb-2" v-html="$t('self_service_terminal_kz')">
        </div>
        <div class="text-green-700 font-bold text-base sm:text-lg lg:text-xl xl:text-2xl mb-1 sm:mb-2" v-html="$t('self_service_terminal_ru')">
        </div>
      </div>

      <!-- Видео контейнер -->
      <div class="mb-4 sm:mb-6">
        <div
          class="w-40 h-40 sm:w-54 sm:h-54 lg:w-64 lg:h-64 xl:w-76 xl:h-76 rounded-full border-2 sm:border-4 border-[#E8F4F2] overflow-hidden shadow-lg bg-white video-glow">
          <video
            src="../assets/idle.mp4"
            autoplay
            muted
            loop
            class="w-full h-full object-cover"
          ></video>
        </div>
      </div>

      <!-- Кнопка запуска -->
      <div
        @click="startService"
        class="bg-[#0C593E] hover:bg-[#0A4A33] text-white font-bold py-2 sm:py-3 lg:py-4 px-8 sm:px-14 lg:px-16 xl:px-20 rounded-full mt-4 text-sm sm:text-base lg:text-lg xl:text-xl cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
     Бастау |  Начать 
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
import { useDateTime } from '../composables/useDateTime'

const router = useRouter()

// Используем единый composable для времени и даты
const { currentDate, currentTime } = useDateTime()

const startService = () => {
  router.push('/language-selection')
}
</script>
