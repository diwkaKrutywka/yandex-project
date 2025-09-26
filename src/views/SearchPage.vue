<template>
  <div
    class="h-screen bg-gradient-to-b from-[#E8F4F2] to-white flex flex-col w-full"
  >
    <nav
      class="bg-[#E8F4F2] h-16 sm:h-20 lg:h-24 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm w-full flex-shrink-0"
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

      <!-- Пустое место для баланса -->
      <div class="w-20 sm:w-24 lg:w-28"></div>
    </nav>

    <!-- Видео в правом верху (скрыто во время глобальной анимации) -->
    <div
      class="search-video-container fixed z-50"
      :class="{ 'hidden-during-animation': isGlobalAnimating }"
      :style="{ top: '0.5rem', right: '1rem' }"
    >
      <AnimatedVideo position="top-right" />
    </div>

    <main class="flex-1 flex flex-col bg-white">
      <!-- Иконка календаря с лупой -->
      

      <!-- Текст поиска -->
      <div class="flex flex-col items-center justify-center pb-6 min-h-200px">
        <img src="../assets/search.svg" alt="search" class="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44" />
        <p class="text-2xl sm:text-2xl lg:text-2xl xl:text-2xl font-bold">{{ searchQuery || '' }}</p>
        <p v-if="!searchQuery" class="text-md sm:text-lg lg:text-xl xl:text-2xl font-bold ">Введите фамилию <br/> врача или название услуги...</p>
      </div>

      <!-- Поле поиска -->
     

      <!-- Виртуальная клавиатура (всегда открыта) -->
      <div class="bg-[#E8F4F2] p-2 pb-safe space-y-2 flex-1 mt-26">
        <div class=" my-6">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Введите фамилию врача или название услуги..."
            :disabled="isLoading"
            class="w-full px-4 py-3 pl-12 pr-12 text-sm sm:text-base border-2 border-[#11AE78] bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            @focus="openKeyboard"
          />
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <div class="absolute inset-y-0 right-0 pr-4 flex items-center">
            <!-- Loading spinner -->
            <div v-if="isLoading" class="animate-spin">
              <svg class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <!-- Clear button -->
            <button
              v-else-if="searchQuery"
              @click="clearSearch"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
        <!-- Виртуальная клавиатура -->
        <div class="keyboard-container">
          <div class="simple-keyboard" role="application" aria-label="Виртуальная клавиатура">
            <div
              v-for="(row, rIndex) in keyboardLayout"
              :key="rIndex"
              class="kbd-row"
            >
              <button
                v-for="(key, kIndex) in row"
                :key="kIndex"
                class="kbd-btn"
                :class="{
                  'kbd-fn': ['⌫','123','ҚАЗ'].includes(key),
                  'kbd-enter': key === '↵' || key === 'Enter',
                  'kbd-space': key === ' ',
                  'kbd-disabled': isLoading
                }"
                :style="{ gridColumn: `span ${getSpan(key)}` }"
                :disabled="isLoading"
                @click="onKey(key)"
              >
                <span v-if="key === ' '">&nbsp;</span>
                <span v-else-if="key === '↵'">Enter</span>
                <span v-else>{{ key }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
    <FooterNav :showQR="false" :showBackButton="true" :key="'search-footer'" />
  </div>
</template>
<script setup lang="ts">
import FooterNav from "../components/FooterNav.vue";
import AnimatedVideo from "../components/AnimatedVideo.vue";
import { useDateTime } from "../composables/useDateTime";
import { ref, computed, nextTick, onMounted } from "vue";
import { useRouter } from "vue-router";
import { searchDoctors, type SearchDoctor } from "../api/search";

const { currentTime, currentDate } = useDateTime();
const router = useRouter();

// Состояние поиска
const searchQuery = ref('');
const showKeyboard = ref(true); // Клавиатура открыта по умолчанию
const isLoading = ref(false);
const searchResults = ref<SearchDoctor[]>([]);

// Состояние глобальной анимации
const isGlobalAnimating = ref(true); // Начинаем со скрытого состояния

// Layouts клавиатуры (как в ChatView)
const layouts = {
  kazakh: {
    rows: [
      ['й','ц','у','к','е','н','г','ш','щ', 'х'],
      ['ф','ы','в','а','п','р','о','л','д', 'з'],
      ['я','ч','с','м','и','т','ь','ң','⌫'],
      ['ү','қ','і','ғ','123',' ','↵']
    ],
    numbers: [
      ['1','2','3','4','5','6','7','8','9'],
      ['0','@','#','$','%','^','&','*','⌫'],
      ['(',' )','-','+','=','/',';',':','ҚАЗ'],
      ['"',"'",' ', '↵']
    ]
  }
};

const isNumbersMode = ref(false);
const keyboardLayout = computed(() => isNumbersMode.value ? layouts.kazakh.numbers : layouts.kazakh.rows);

const getSpan = (key: string) => {
  if (key === ' ') return 4;        // space wide
  if (key === '↵' || key === 'Enter') return 3; // enter wider
  if (key === '123' || key === 'ҚАЗ' || key === '⌫') return 2; // special buttons a bit wider
  return 1;
};

// Функции клавиатуры
const openKeyboard = async () => {
  showKeyboard.value = true;
  await nextTick();
};

// В SearchPage клавиатура всегда открыта, функция closeKeyboard не нужна

const onKey = (key: string) => {
  if (key === '⌫') {
    searchQuery.value = searchQuery.value.slice(0, -1);
  } else if (key === '↵' || key === 'Enter') {
    performSearch();
  } else if (key === ' ') {
    searchQuery.value += ' ';
  } else if (key === '123') {
    isNumbersMode.value = true;
  } else if (key === 'ҚАЗ') {
    isNumbersMode.value = false;
  } else {
    searchQuery.value += key;
  }
};

// Функции поиска
const clearSearch = () => {
  searchQuery.value = '';
};

const performSearch = async () => {
  if (searchQuery.value.trim()) {
    try {
      isLoading.value = true;
      console.log('🔍 Начинаем поиск:', searchQuery.value);
      
      // Выполняем поиск
      const results = await searchDoctors(searchQuery.value.trim());
      searchResults.value = results;
      
      console.log('✅ Результаты поиска получены:', results);
      console.log('📊 Количество результатов:', results.length);
      
      // Переходим на страницу врачей с результатами поиска
      console.log('🚀 Переходим на DoctorsPage с результатами');
      await router.push({
        name: 'DoctorsPage',
        query: {
          search: searchQuery.value.trim(),
          results: JSON.stringify(results)
        }
      });
      
    } catch (error) {
      console.error('❌ Ошибка при поиске:', error);
      // Можно показать уведомление об ошибке
    } finally {
      isLoading.value = false;
    }
  }
};

// Показываем локальное видео после исчезновения глобального
onMounted(() => {
  setTimeout(() => {
    isGlobalAnimating.value = false;
  }, 1200); // Появляется почти одновременно с исчезновением глобального

  // Дополнительная гарантия скрытия глобального видео
  setTimeout(() => {
    (window as any).forceHideGlobalVideo?.();
  }, 1400); // Двойная гарантия
});
</script>
<style scoped>
.hidden-during-animation {
  opacity: 0;
  visibility: hidden;
}

.search-video-container {
  transition: opacity 0.1s ease-in-out, visibility 0.1s ease-in-out;
}

.search-video-container:not(.hidden-during-animation) {
  opacity: 1;
  visibility: visible;
}

.video-glow {
  box-shadow: 0 0 20px rgba(17, 174, 120, 0.3);
}

/* Контейнер клавиатуры */
.keyboard-container {
  margin-top: 4px;
  width: 100%;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  box-sizing: border-box;
}

/* Основная панель клавиатуры */
.simple-keyboard {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  background: linear-gradient(135deg,#f6fbfa 0%, #e8f4f2 100%);
  border-radius: 14px;
  border: 1px solid rgba(17, 174, 120, 0.06);
  box-shadow: 0 8px 24px rgba(17,174,120,0.06);
}

/* Каждая строка — grid с автоматическими колонками */
.kbd-row {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(36px, 1fr);
  gap: 8px;
  align-items: center;
  justify-content: center;
  width: 100%;
}

/* Кнопки */
.kbd-btn {
  min-height: 44px;
  padding: 8px 6px;
  border-radius: 10px;
  background: linear-gradient(180deg,#ffffff 0%, #f8fffe 100%);
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: 0 2px 6px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7);
  font-weight: 600;
  font-size: 15px;
  color: #21343a;
  cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease, background .12s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

/* Hover / active */
.kbd-btn:hover { 
  transform: translateY(-3px); 
  box-shadow: 0 8px 18px rgba(0,0,0,0.08);
  background: linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%);
}
.kbd-btn:active { 
  transform: translateY(-1px) scale(.99);
  background: linear-gradient(180deg, #e5e7eb 0%, #d1d5db 100%) !important;
  color: #374151 !important;
}

/* Функциональные кнопки */
.kbd-fn {
  background: linear-gradient(180deg,#ffffff 0%, #f8fffe 100%);
  color: #21343a;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7);
}

.kbd-fn:hover {
  background: linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%);
}

.kbd-fn:active {
  background: linear-gradient(180deg, #e5e7eb 0%, #d1d5db 100%) !important;
  color: #374151 !important;
}

/* Enter */
.kbd-enter {
  background: linear-gradient(180deg,#ffffff 0%, #f8fffe 100%);
  color: #21343a;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7);
}

.kbd-enter:hover {
  background: linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%);
}

.kbd-enter:active {
  background: linear-gradient(180deg, #e5e7eb 0%, #d1d5db 100%) !important;
  color: #374151 !important;
}

/* Space */
.kbd-space {
  background: linear-gradient(180deg,#ffffff 0%, #f8fffe 100%);
  border: 1px solid rgba(0,0,0,0.04);
}

.kbd-space:hover {
  background: linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%);
}

.kbd-space:active {
  background: linear-gradient(180deg, #e5e7eb 0%, #d1d5db 100%) !important;
}

/* Адаптив: уменьшаем минимальную ширину и высоту на маленьких экранах */
@media (max-width: 640px) {
  .kbd-row { grid-auto-columns: minmax(32px, 1fr); gap: 6px; }
  .kbd-btn { min-height: 38px; font-size: 13px; padding: 6px 4px; border-radius: 8px; }
  .kbd-enter { font-size: 13px; }
}

@media (max-width: 480px) {
  .kbd-row { grid-auto-columns: minmax(28px, 1fr); gap: 4px; }
  .kbd-btn { min-height: 36px; font-size: 12px; padding: 5px 3px; border-radius: 6px; }
  .kbd-enter { font-size: 12px; }
}

@media (max-width: 360px) {
  .kbd-row { grid-auto-columns: minmax(24px, 1fr); gap: 3px; }
  .kbd-btn { min-height: 32px; font-size: 11px; padding: 4px 2px; border-radius: 4px; }
  .kbd-space { flex: 3; }
}

/* Disabled state */
.kbd-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Оптимизация для тачскринов */
@media (hover: none) and (pointer: coarse) {
  .kbd-btn:hover { 
    transform: none; 
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    background: linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%);
  }
}
</style>
