<template>
    <!-- Модальное окно с маской фокуса -->
    <div 
      v-if="isVisible" 
      class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      @click="closeModal"
    >
      <!-- Содержимое модального окна -->
      <div 
        class="bg-white rounded-2xl shadow-2xl max-w-md w-full pt-8"
        style="box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);"
        @click.stop
      >
        <div class="flex flex-col items-center justify-center gap-4 h-full">
   
          
          <img src="../assets/med-icon.svg" alt="med-icon" class="w-40 sm:w-52 lg:w-60 h-12 sm:h-14 lg:h-16" />
          <img src="../assets/yandex.svg" alt="dost" class="w-40 sm:w-52 lg:w-60 h-12 sm:h-14 lg:h-16 my-2" />

          <nav class="flex flex-col justify-between items-center bg-[#E8F4F2] w-full py-6 rounded-2xl" >
          <div class="text-center text-md sm:text-base lg:text-lg font-bold  leading-tight my-3 sm:my-4 mb-8">
            Чтобы узнать как заказать <br/> такой терминал, <br/> отсканируйте QR-код
          </div>
          
         
          
          <img src="../assets/qr.svg" alt="qr" class="w-24 sm:w-28 lg:w-32 h-24 sm:h-28 lg:h-32" />
          
          <a 
            href="http://medcontact.ai" 
            target="_blank"
            class="text-green-700 font-bold text-md hover:text-green-800 transition-colors mb-6 mt-10"
          >
          <span class="text-green-700 font-bold text-md sm:text-base lg:text-lg hover:text-green-800 transition-colors">
            http://medcontact.ai
          </span>
          </a>
          
      
          <!-- Кнопка закрытия -->
          <div 
            @click="closeModal" 
            class=" m-auto px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-white border-2 border-[#11AE78] text-[#11AE78] font-medium hover:bg-green-50 transition-all duration-300 transform hover:scale-105 cursor-pointer text-sm sm:text-base"
          >
            Закрыть ×
          </div>
          </nav>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // Props
  defineProps<{
    isVisible: boolean
  }>()
  
  // Emits
  const emit = defineEmits<{
    close: []
  }>()

  const closeModal = () => {
    emit('close')
  }


  </script>