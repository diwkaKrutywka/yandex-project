<template>
  <div
    class="h-screen bg-gradient-to-b from-[#E8F4F2] to-white flex flex-col overflow-hidden"
  >
    <!-- Заголовок -->
    <nav
      class="bg-[#E8F4F2] h-16 sm:h-20 lg:h-24 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm flex-shrink-0"
    >
      <!-- Дата и время -->
      <div
        class="text-[#11AE78] font-bold text-lg sm:text-xl lg:text-2xl leading-tight"
      >
        <div>{{ currentTime }}</div>
        <div class="text-[#14865E] text-sm sm:text-base lg:text-lg font-bold">
          {{ currentDate }}
        </div>
      </div>

      <!-- Пустое место -->
      <div class="w-16 sm:w-20 lg:w-28"></div>
    </nav>

    <!-- Контент -->
    <main class="flex-1 flex flex-col bg-white overflow-hidden">
      <div
        class="flex flex-col bg-white m-auto w-full max-w-sm sm:max-w-md lg:max-w-lg px-4"
      >
        <span class="text-[#11AE78] text-xl sm:text-2xl font-bold mb-2 text-center">
          Запись на прием
        </span>

        <p class="text-gray-700 font-semibold mb-4 text-center text-sm sm:text-base">
          Чтобы записаться на прием <br />
          введите ваш ИИН
        </p>

        <!-- Поле для ИИН -->
        <input
          v-model="iin"
          type="text"
          class="w-full text-center text-base sm:text-lg rounded-2xl py-3 mb-4 bg-[#E0E0E0] font-bold text-black"
          readonly
        />

        <!-- Клавиатура -->
        <div class="grid grid-cols-3 gap-3 w-full mb-4 mt-6">
          <div
            v-for="n in numbers"
            :key="n"
            @click="addDigit(n)"
            class="bg-[#E8F4F2] hover:bg-green-200 py-3 rounded-xl text-lg text-center cursor-pointer"
          >
            {{ n }}
          </div>

          <div
            class="bg-gray-200 py-3 rounded-xl text-lg flex items-center justify-center cursor-pointer"
            @click="backspace"
          >
            <img src="../assets/remove.svg" alt="backspace" class="w-5 sm:w-6 h-5 sm:h-6" />
          </div>

          <div
            class="bg-[#E8F4F2] hover:bg-green-200 py-3 rounded-xl text-lg text-center cursor-pointer"
            @click="addDigit('0')"
          >
            0
          </div>

          <div
            class="bg-[#11AE78] text-white py-3 rounded-xl text-lg flex items-center justify-center cursor-pointer"
            @click="authorize"
          >
            <img src="../assets/approve.svg" alt="check" class="w-5 sm:w-6 h-5 sm:h-6" />
          </div>
        </div>

        <!-- Кнопка авторизации -->
        <div
          class="bg-[#0C593E] text-white font-bold my-4 px-20 sm:px-18 py-3 rounded-3xl shadow hover:bg-green-700 text-center cursor-pointer text-sm sm:text-base max-w-md mx-auto"
          @click="authorize"
        >
          Авторизоваться
        </div>

        <span class="text-xs text-gray-500 mt-3 text-center">
          Ваши данные защищены и используются <br />
          только для проверки в поликлинике
        </span>
      </div>
    </main>

    <FooterNav />
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "../store/index";
import FooterNav from "../components/FooterNav.vue";
import { useDateTime } from "../composables/useDateTime";
const { currentDate, currentTime } = useDateTime();
import { useRouter } from "vue-router";
const router = useRouter();
const isLoading = ref(false);
const error = ref<string | null>(null);

// Состояние глобальной анимации
const isGlobalAnimating = ref(true); // Начинаем со скрытого состояния

// Состояние анимации специальностей
const showSpecialties = ref(false);

onMounted(() => {
  setTimeout(() => {
    isGlobalAnimating.value = false;
  }, 1200); // Появляется почти одновременно с исчезновением глобального

  // Дополнительная гарантия скрытия глобального видео
  setTimeout(() => {
    (window as any).forceHideGlobalVideo?.();
  }, 1400); // Двойная гарантия
});

const userStore = useUserStore();

const iin = ref("");
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

const addDigit = (digit: string) => {
  if (iin.value.length < 12) {
    iin.value += digit;
  }
};

const backspace = () => {
  iin.value = iin.value.slice(0, -1);
};

const authorize = () => {
  if (iin.value.length === 12) {
    userStore.setIin(iin.value);
    alert(`Вы авторизованы с ИИН: ${iin.value}`);
    router.back()
    // здесь можно сделать router.push('/home') например
  } else {
    alert("Введите корректный ИИН (12 цифр)");
  }
};
</script>
