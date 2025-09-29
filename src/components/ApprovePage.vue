<template>
  <div class="flex flex-col h-full rounded-2xl">
    <!-- Основной контент -->
    <div class="flex flex-col items-center justify-center text-center p-10 flex-1">
      <!-- Иконка -->
      <div class="mb-6">
         <!-- Круговой таймер -->
    <div class="flex justify-center mb-8">
      <div class="relative w-10 h-10">
        <svg class="w-10 h-10 transform -rotate-90" viewBox="0 0 40 40">
          <!-- Фоновый круг -->
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="#E5E7EB"
            stroke-width="3"
            fill="none"
          />
          <!-- Прогресс круг -->
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="#11AE78"
            stroke-width="3"
            fill="none"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
            stroke-linecap="round"
            class="transition-all duration-1000 ease-linear"
          />
        </svg>
        <!-- Текст таймера в центре -->
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-sm font-bold text-[#11AE78]">{{ timeLeft }}</span>
        </div>
      </div>
    </div>


        <img
          src="../assets/clinic.svg"
          alt="clinic"
          class="w-40 sm:w-48 lg:w-64 h-40 sm:h-48 lg:h-64"
        />
      </div>
      
      <!-- Текст подтверждения -->
      <div class="mt-6">
        <p class="font-bold text-md sm:text-lg">
          Вы успешно<br />
          записались на прием
        </p>
        <p class="font-bold text-md sm:text-lg">Не забудьте взять талон</p>
      </div>
    </div>

   

    <!-- Фиксированный футер -->
    <div class="flex justify-center bg-[#E8F4F2] mt-6">
      <div
        class="border-2 border-[#11AE78] text-[#11AE78] rounded-full px-4 py-2 font-bold w-fit cursor-pointer text-center my-4 bg-white"
        @click="handleConfirm"
      >
        Закрыть х
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/index';

interface Props {
  appointmentResult?: any;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const router = useRouter();
const userStore = useUserStore();

// Таймер
const timeLeft = ref(10);
const totalTime = 10;
let timer: number | null = null;

// Вычисляемые свойства для кругового прогресса
const circumference = computed(() => 2 * Math.PI * 18) // радиус 18
const strokeDashoffset = computed(() => {
  const progress = (totalTime - timeLeft.value) / totalTime
  return circumference.value * (1 - progress)
})

// Отладочные логи
console.log("🔍 ApprovePage: получен appointmentResult:", props.appointmentResult);

const handleConfirm = () => {
  console.log("🔍 ApprovePage: закрываем модальное окно");
  if (timer) {
    clearInterval(timer);
  }
  emit("close");
};

const startTimer = () => {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    }
    if (timeLeft.value <= 0) {
      // Время истекло - очищаем ИИН и перенаправляем на MainView
      console.log("🔍 ApprovePage: время истекло, очищаем ИИН и перенаправляем");
      userStore.clearIin();
      if (timer) {
        clearInterval(timer);
      }
      router.push('/');
    }
  }, 1000);
};

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
/* Стили для кругового таймера уже встроены в template */
</style>
