<template>
  <div class="h-screen bg-gradient-to-b from-[#E8F4F2] to-white flex flex-col overflow-hidden w-full">
    <!-- Верхняя навигация -->
    <nav class="bg-[#E8F4F2] h-16 sm:h-20 lg:h-24 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm w-full flex-shrink-0">
      <!-- Дата и время -->
      <div class="text-[#11AE78] font-bold text-lg sm:text-xl lg:text-2xl leading-tight">
        <div>{{ currentTime }}</div>
        <div class="text-[#14865E] text-sm sm:text-base lg:text-lg font-bold">
          {{ currentDate }}
        </div>
      </div>

      <!-- Пустое место для баланса -->
      <div class="w-20 sm:w-24 lg:w-28"></div>
    </nav>
    
    <!-- Видео в правом верху (скрыто во время глобальной анимации) -->
    <div class="service-video-container fixed z-50" 
         :class="{ 'hidden-during-animation': isGlobalAnimating }"
         :style="{ top: '0.5rem', right: '1rem' }">
      <AnimatedVideo position="top-right" />
    </div>
    <main class="flex-1 flex flex-col bg-white overflow-hidden">
      <div class="text-center mb-6 p-4 flex-shrink-0 mt-12">
        <span class="text-[#11AE78] font-bold text-[20px] lg:text-lg mb-6">Запись на прием  <br /></span>
      
        <span class="text-black text-sm lg:text-base mb-4 font-semibold my-6">
          Чтобы записаться на прием<br />
          введите ваш ИИН
        </span>
        
        <!-- Поле ввода ИИН -->
        <div class="w-full max-w-xs mx-auto py-2 px-8 bg-[#E0E0E0] rounded-xl mt-4">
        <span class="text-black text-md lg:text-base mb-2 font-bold"> ИИН</span>
           
         
        
        </div>
      </div>

       <!-- Секция отделений с фиксированным заголовком и скроллящимся списком -->
       <div class="flex-1 bg-[#E8F4F2] flex flex-col overflow-hidden mt-2 rounded-t-xl">
         <!-- Заголовок отделений - фиксированный -->
         <div class="p-4 flex-shrink-0">
           <p class="text-black font-bold text-xl mb-4">Отделения</p>
         </div>
         
         <!-- Контент с прокруткой -->
         <div class="flex-1 px-4 pb-4 overflow-y-auto">
           <!-- Лоадер -->
           <div v-if="isLoading" class="flex justify-center py-8">
             <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#11AE78]"></div>
           </div>
           
           <!-- Ошибка загрузки -->
           <div v-else-if="error" class="text-red-500 text-center py-4">
             <p>{{ error }}</p>
             <button 
               @click="loadSpecialties" 
               class="mt-2 px-4 py-2 bg-[#11AE78] text-white rounded-lg hover:bg-[#0E9A6A] transition-colors"
             >
               Попробовать снова
             </button>
           </div>
           
           <!-- Список специальностей -->
           <div v-else class="grid gap-3 pb-4">
             <div
               v-for="(specialty, index) in specialties"
               :key="specialty.id"
               @click="selectSpecialty(specialty)"
               class="specialty-button w-full flex justify-between items-center bg-gradient-to-r from-[#14865E] to-[#11AE78] hover:from-[#117A52] hover:to-[#0E9A6A] text-white font-medium py-4 px-6 rounded-2xl text-sm transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
               :class="{ 'animate-specialty': showSpecialties }"
               :style="{ animationDelay: showSpecialties ? `${index * 150}ms` : '0ms' }"
             >
               <span class="text-white font-medium">{{ specialty.name }}</span>
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke-width="1.5"
                 stroke="white"
                 class="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex-shrink-0"
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
    <FooterNav />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { SpecialtiesApi } from "../api/specialties";
import FooterNav from "../components/FooterNav.vue";
import AnimatedVideo from "../components/AnimatedVideo.vue";
import { useDateTime } from "../composables/useDateTime";

// Интерфейс для специальности
interface Specialty {
  id: number;
  name: string;
  description?: string;
}

// Используем единый composable для времени и даты
const { currentDate, currentTime } = useDateTime();

// Состояние для специальностей
const specialties = ref<Specialty[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

// ИИН пользователя
const iin = ref('');

// Состояние глобальной анимации
const isGlobalAnimating = ref(true); // Начинаем со скрытого состояния

// Состояние анимации специальностей
const showSpecialties = ref(false);

onMounted(() => {
  loadSpecialties(); // Загружаем специальности при монтировании
  
  // Больше не нужно сохранять информацию в sessionStorage
  
  // Показываем локальное видео сразу после исчезновения глобального
      setTimeout(() => {
        isGlobalAnimating.value = false;
      }, 1200); // Появляется почти одновременно с исчезновением глобального
  
  // Дополнительная гарантия скрытия глобального видео
  setTimeout(() => {
    (window as any).forceHideGlobalVideo?.();
  }, 1400); // Двойная гарантия
});

onUnmounted(() => {
  // Очистка интервала времени теперь происходит в useDateTime composable
});

// Загрузка специальностей
const loadSpecialties = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    console.log('🏥 Загружаем специальности...');
    const response = await SpecialtiesApi('', {}, 'GET');
    
    if (response.data && Array.isArray(response.data)) {
      specialties.value = response.data;
      console.log('✅ Специальности загружены:', specialties.value);
      
      // Запускаем анимацию появления кнопок с небольшой задержкой
      setTimeout(() => {
        showSpecialties.value = true;
      }, 300);
    } else {
      throw new Error('Неверный формат данных');
    }
  } catch (err: any) {
    console.error('❌ Ошибка загрузки специальностей:', err);
    
    // Для демонстрации добавляем тестовые данные при ошибке
    console.log('📝 Загружаем тестовые специальности...');
    specialties.value = [
      { id: 1, name: 'Терапия', description: 'Общие терапевтические услуги' },
      { id: 2, name: 'Кардиология', description: 'Лечение сердечно-сосудистых заболеваний' },
      { id: 3, name: 'Неврология', description: 'Лечение заболеваний нервной системы' },
      { id: 4, name: 'Педиатрия', description: 'Детская медицина' },
      { id: 5, name: 'Хирургия', description: 'Хирургические операции' },
      { id: 6, name: 'Гинекология', description: 'Женское здоровье' },
      { id: 7, name: 'Офтальмология', description: 'Лечение заболеваний глаз' },
      { id: 8, name: 'Отоларингология', description: 'ЛОР-заболевания' },
      { id: 9, name: 'Дерматология', description: 'Кожные заболевания' },
      { id: 10, name: 'Эндокринология', description: 'Гормональные нарушения' },
      { id: 11, name: 'Ортопедия', description: 'Заболевания опорно-двигательного аппарата' },
      { id: 12, name: 'Урология', description: 'Заболевания мочеполовой системы' },
    ];
    console.log('✅ Тестовые специальности загружены');
    
    // Запускаем анимацию появления кнопок с небольшой задержкой
    setTimeout(() => {
      showSpecialties.value = true;
    }, 300);
  } finally {
    isLoading.value = false;
  }
};


// Выбор специальности
const selectSpecialty = (specialty: Specialty) => {
  if (!iin.value || iin.value.length !== 12) {
    alert('Пожалуйста, введите корректный ИИН (12 цифр)');
    return;
  }
  
  console.log('🏥 Выбрана специальность:', specialty);
  console.log('👤 ИИН пользователя:', iin.value);
  // Здесь можно добавить логику перехода на следующий шаг
  // Например, сохранить выбранную специальность и ИИН, перейти к выбору врача
};


// const startService = () => {
//   router.push("/language-selection");
// };
</script>

<style scoped>
.hidden-during-animation {
  opacity: 0;
  visibility: hidden;
}

.service-video-container {
  transition: opacity 0.1s ease-in-out, visibility 0.1s ease-in-out;
}

.service-video-container:not(.hidden-during-animation) {
  opacity: 1;
  visibility: visible;
}


/* Анимация появления кнопок специальностей */
.specialty-button {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.specialty-button.animate-specialty {
  animation: slideInUp 0.6s ease-out forwards;
}

@keyframes slideInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
