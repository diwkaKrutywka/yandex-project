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
          {{ $t('auth_title') }}
        </span>

        <p class="text-gray-700 font-semibold mb-4 text-center text-sm sm:text-base" v-html="$t('auth_description')">
        </p>

        <!-- Поле для ИИН -->
        <div class="w-full mb-4">
          <input
            v-model="iin"
            type="text"
            :class="[
              'w-full text-center text-base sm:text-lg rounded-2xl py-3 font-bold text-black',
              iinError ? 'bg-red-100 border-2 border-red-400' : 'bg-[#E0E0E0]'
            ]"
            readonly
          />
          <!-- Сообщение об ошибке -->
          <div v-if="iinError" class="text-red-500 text-sm mt-2 text-center">
            {{ iinError }}
          </div>
        </div>

        <!-- Клавиатура -->
        <div class="grid grid-cols-3 gap-3 w-full mb-4 mt-6">
          <div
            v-for="n in numbers"
            :key="n"
            @click="addDigit(n)"
            class="bg-[#E8F4F2] hover:bg-green-200 py-3 rounded-xl text-lg text-center cursor-pointer text-black font-bold"
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
            class="bg-[#E8F4F2] hover:bg-green-200 py-3 rounded-xl text-lg text-center cursor-pointer text-black font-bold"
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
          class="bg-[#0C593E] text-white font-bold my-4 px-20 sm:px-18 py-4 rounded-3xl shadow-lg hover:bg-[#0A4A32] text-center cursor-pointer text-base sm:text-lg max-w-md mx-auto transition-all duration-200"
          @click="authorize"
        >
          {{ $t('authorize_button') }}
        </div>

        <span class="text-xs text-gray-500 mt-3 text-center" v-html="$t('data_protection')">
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
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { currentDate, currentTime } = useDateTime();
const { t: $t } = useI18n();
const router = useRouter();

// Состояние глобальной анимации
const isGlobalAnimating = ref(true); // Начинаем со скрытого состояния

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
const iinError = ref("");
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

const addDigit = (digit: string) => {
  if (iin.value.length < 12) {
    iin.value += digit;
    // Очищаем ошибку при вводе
    if (iinError.value) {
      iinError.value = "";
    }
  }
};

const backspace = () => {
  iin.value = iin.value.slice(0, -1);
  // Очищаем ошибку при удалении
  if (iinError.value) {
    iinError.value = "";
  }
};

const validateIin = () => {
  if (iin.value.length === 0) {
    iinError.value = "Введите ИИН";
    return false;
  } else if (iin.value.length < 12) {
    iinError.value = "ИИН должен содержать 12 цифр";
    return false;
  } else if (iin.value.length > 12) {
    iinError.value = "ИИН не должен содержать более 12 цифр";
    return false;
  } else if (!/^\d{12}$/.test(iin.value)) {
    iinError.value = "ИИН должен содержать только цифры";
    return false;
  }
  return true;
};

const authorize = () => {
  if (validateIin()) {
    userStore.setIin(iin.value);
    console.log(`${$t('auth_success')} ${iin.value}`);
    router.back();
  }
  // Если валидация не прошла, ошибка уже показана в validateIin()
};
</script>

<style scoped>
/* Улучшенная видимость для поля ввода ИИН */
input[type="text"] {
  color: #000000 !important;
  font-weight: bold !important;
  font-size: 1.5rem !important;
  letter-spacing: 0.1em !important;
  background-color: #E5E7EB !important;
  border: none !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
}

/* Дополнительные стили для лучшей видимости */
input:focus {
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(17, 174, 120, 0.2) !important;
}

/* Улучшенная видимость цифр на клавиатуре */
.grid > div {
  font-weight: bold !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
}
</style>
