<template>
  <div class="flex flex-col h-full">
    <!-- Основной контент -->
    <div class="flex flex-col items-center justify-center text-center p-10 flex-1">
      <!-- Иконка -->
      <div class="mb-6">
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

    <!-- Таймер -->
    <div class="flex justify-center mb-4">
      <div class="timer-circle">
        <div class="timer-progress" :style="{ '--progress': ((10 - timeLeft) / 10) * 100 + '%' }"></div>
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
import { ref, onMounted, onUnmounted } from 'vue';
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
let timer: number | null = null;

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
      router.push('/main-view');
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
.timer-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #E8F4F2;
  border: 3px solid #11AE78;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.timer-progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: conic-gradient(from 0deg, #11AE78 0deg, #11AE78 calc(360deg - var(--progress) * 3.6deg), transparent calc(360deg - var(--progress) * 3.6deg));
  border-radius: 50%;
  transition: background 0.1s ease;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 15px rgba(17, 174, 120, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(17, 174, 120, 0.4);
  }
}

/* Адаптивность для мобильных */
@media (max-width: 640px) {
  .timer-circle {
    width: 50px;
    height: 50px;
  }
}
</style>
