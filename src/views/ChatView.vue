<template>
  <div class="flex flex-col w-full h-full bg-white overflow-hidden m-0 p-0">
    <!-- Заголовок -->
    <nav
      class="bg-[#E8F4F2] h-16 sm:h-20 lg:h-24 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm w-full m-0 p-0"
    >
        <div class="text-[#11AE78] font-bold text-lg sm:text-xl lg:text-2xl leading-tight">
          <div>{{ currentTime }}</div>
          <div class="text-[#14865E] text-sm sm:text-base lg:text-lg font-bold">{{ currentDate }}</div>
        </div>
        <div class="flex items-center gap-2">
          <!-- Кнопка для тестирования эффекта печатания -->
        
          <div class="w-30 h-30 sm:w-30 lg:w-30"></div>
          <img src="../assets/chat-icon.svg" alt="arrow" class="w-12 h-12" />
        </div>
      </nav>

    <!-- Инфо о боте -->
    <div class="p-4 font-semibold flex items-center">
<div class="flex justify-between w-full mx-4">
      <div class="flex ">
        <div class="border-2 border-[#E8F4F2] rounded-full mr-2 video-glow w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center overflow-hidden">
        <video
          src="../assets/idle.mp4"
          autoplay
          muted
          loop
          class="w-[110%] h-[110%] rounded-full"
          style="margin: -5% 0 0 -5%; object-fit: cover; object-position: center; filter: contrast(1.2) brightness(1.15) saturate(1.2) sharpen(1.0); image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;"
        ></video>
      </div>
        <div>
        <div class="text-sm flex align-start">Алия</div>
        <div class="text-sm opacity-80 flex items-center gap-1">
          <div
            :class="[ 'w-2 h-2 rounded-full',
              connectionStatus === 'connected' ? 'bg-green-700' :
              connectionStatus === 'connecting' ? 'bg-yellow-500' :
              connectionStatus === 'error' ? 'bg-red-500' : 'bg-gray-400' ]"
          ></div>
          <span class="text-xs text-green-700">
            {{
              connectionStatus === 'connected' ? 'Готова помочь' :
             connectionStatus === 'connecting' ? 'Подключение...' : 
              connectionStatus === 'error' ? 'Ошибка подключения' : 'Отключено'
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
      <!-- <div class="flex items-center gap-2 mr-4">
        <img src="../assets/broom.png" alt="broom" class="w-4 h-4" />
        <img src="../assets/refresh.png" alt="refresh" class="w-4 h-4" />
      </div> -->
    </div>
    <hr class="w-full text-gray-200" />

    <!-- Сообщения -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 bg-white">
      <div v-for="msg in messages" :key="msg.id">
        <div
          :class="[
            'mb-3 p-3 rounded-lg w-fit max-w-[80%] text-sm',
            msg.isBot ? 'bg-white shadow-lg ml-0 mr-auto text-left' : 'bg-[#E8F4F2] ml-auto mr-0 shadow-lg text-left'
          ]"
          :style="{
            color: '#000000 !important'
          }"
        >
          <div>{{ msg.text }}</div>
          <div class="text-xs opacity-60 mt-1" :class="msg.isBot ? 'text-left' : 'text-right'">
            {{ msg.timestamp || getCurrentTimeString() }}
          </div>
        </div>

      </div>

      <!-- Быстрые кнопки (показываются только для первого bot_text) -->
      <div v-if="showQuickReplies" class="ml-0 mr-auto mb-3 max-w-[80%]">
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="(option, index) in quickReplyOptions"
            :key="index"
            @click="sendQuickReply(option)"
            class="px-3 py-2 bg-[#11AE78] text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-[#0E9A6A] transition-all duration-300 transform hover:scale-105 shadow-sm cursor-pointer"
          >
            {{ option }}
          </div>
        </div>
      </div>

      <!-- Анимированные точки "бот печатает" -->
      <div 
        v-if="showTypingDots && !isTyping"
        class="mb-3 p-3 rounded-lg w-fit max-w-[80%] bg-white shadow-lg ml-0 mr-auto text-sm text-left"
        style="color: #000000 !important;"
      >
        <div class="flex items-center">
          <span class="typing-dots">
            <span class="dot">.</span>
            <span class="dot">.</span>
            <span class="dot">.</span>
          </span>
        </div>
      </div>

      <!-- Сообщение в процессе печати (бот) -->
      <div 
        v-if="isTyping && displayedTypingMessage"
        class="mb-3 p-3 rounded-lg w-fit max-w-[80%] bg-white shadow-lg ml-0 mr-auto text-sm text-left"
        style="color: #000000 !important;"
      >
        <div class="flex items-center justify-between">
          <span>{{ displayedTypingMessage }}<span class="typing-cursor">|</span></span>
          <!-- Кнопка паузы/возобновления -->
          <button 
            v-if="canPauseTyping"
            @click="toggleTypingPause"
            class="ml-2 px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200 transition-colors"
            :title="isTypingPaused ? 'Возобновить печатание' : 'Приостановить печатание'"
          >
            {{ isTypingPaused ? '' : '' }}
          </button>
        </div>
    </div>

      <!-- Сообщение в процессе ввода/записи (пользователь) -->
      <div
        v-if="isUserTyping && currentUserMessage"
        class="mb-3 p-3 rounded-lg w-fit max-w-[80%] bg-[#E8F4F2] ml-auto mr-0 shadow-lg text-sm text-left"
        style="color: #000000 !important;"
      >
        <div class="flex items-center gap-2">
          <span>{{ currentUserMessage }}</span>
          
          <!-- Простой индикатор печати -->
          <div class="flex gap-1">
            <div class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 0ms"></div>
            <div class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 150ms"></div>
            <div class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 300ms"></div>
          </div>
        </div>
        </div>
      </div>


    <!-- Разделительная линия между сообщениями и нижней панелью -->
    <div class="border-t border-gray-300"></div>

    <!-- Нижняя панель -->
    <div class="bg-[#E8F4F2] flex-shrink-0 m-0 w-full">
      <!-- Если клавиатура открыта -->
      <div v-if="showKeyboard" class="p-2 pb-safe space-y-2">
        <!-- Поле ввода -->
        <div class="flex gap-2 items-center">
        <input
          v-model="textInput"
          type="text"
          placeholder="Введите сообщение..."
            class="border rounded px-2 sm:px-3 py-1 sm:py-1.5 flex-1 text-xs sm:text-sm hover:bg-gray-100 focus:bg-white transition-colors duration-200"
          @keyup.enter="sendText"
        />
          <div @click="sendText" class="bg-gray-200 hover:bg-gray-300 text-white p-1.5 sm:p-2 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-105">
            <img src="../assets/paper.svg" alt="send" class="w-5 h-5" />
          </div>
        </div>

        <!-- Убираем дублирующую маленькую кнопку микрофона -->

        <!-- Виртуальная клавиатура (rendered by Vue) -->
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
                  'kbd-space': key === ' '
                }"
                :style="{ gridColumn: `span ${getSpan(key)}` }"
                @click="onKey(key)"
              >
                <span v-if="key === ' '">&nbsp;</span>
                <span v-else-if="key === '↵'">Enter</span>
                <span v-else>{{ key }}</span>
              </button>
            </div>
          </div>
           </div>

        <!-- Футер с кнопками: Закрыть и Спросить голосом (большая кнопка) -->
        <div class="flex justify-between items-center px-1 pt-1">
          <div @click="goToHome" class="px-2 sm:px-3 py-1 sm:py-1.5 rounded-[12px] sm:rounded-[15px] bg-white border-2 border-[#11AE78] text-[#11AE78] font-medium cursor-pointer text-xs sm:text-sm hover:bg-green-50 transition-all duration-300">Закрыть х</div>

          <div class="flex flex-col items-end">
           <div
             @click="toggleRecording"
             :class="[
                'px-2 sm:px-3 py-1 sm:py-1.5 rounded-[12px] sm:rounded-[15px] font-medium cursor-pointer flex items-center gap-1 sm:gap-2 text-xs sm:text-sm transition-all duration-300',
               isRecording ? 'bg-red-500 border-2 border-red-500 text-white hover:bg-red-600' : 'bg-white border-2 border-[#11AE78] text-[#11AE78] hover:bg-green-50'
             ]"
           >
              <img v-if="!isRecording" src="../assets/micro.svg" alt="microphone" class="w-2.5 sm:w-3 h-2.5 sm:h-3" />
             <span v-if="isRecording" class="text-white">⏹</span>
             <img v-if="!isRecording" src="../assets/green-micro.svg" alt="micro" class="w-2.5 sm:w-3 h-2.5 sm:h-3" />
              <span>{{ isRecording ? 'Остановить' : 'Спросить голосом' }}</span>
            </div>
           </div>
         </div>
      </div>

      <!-- Если клавиатура скрыта -->
      <div v-else class="">
        <!-- Разделительная линия сверху -->
      
        
        <!-- Большая кнопка "Спросить голосом" по центру -->
        <div class="flex justify-center mb-4 bg-white">
          <div
            @click="toggleRecording"
            :class="[
              'px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 my-2 rounded-full font-medium flex items-center justify-center gap-2 sm:gap-3 max-w-fit cursor-pointer transition-all duration-200 ',
              isRecording 
                ? 'bg-red-500 border-2 border-red-500 text-white hover:bg-red-600' 
                : 'bg-green-900 text-white hover:bg-green-800'
            ]"
          >
            <img
              v-if="!isRecording"
              src="../assets/micro.svg"
              alt="microphone"
              class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
            />
            <span v-if="isRecording" class="text-lg text-white">⏹</span>
            <span v-if="!isRecording" class="text-base sm:text-lg lg:text-xl font-semibold">Спросить голосом</span>
          </div>
        </div>
        
        <!-- Разделительная линия снизу -->
      
        
        <!-- Кнопки управления внизу -->
        <div class="flex justify-between items-center mb-3 mx-2">
          <div @click="goToHome" class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-[16px] sm:rounded-[20px] bg-white border-2 border-[#11AE78] text-[#11AE78] font-medium cursor-pointer text-sm sm:text-base hover:bg-green-50 transition-all duration-300">Закрыть х</div>
          <div @click="openKeyboard" class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-[16px] sm:rounded-[20px] bg-white border-2 border-[#11AE78] text-[#11AE78] font-medium cursor-pointer text-sm sm:text-base hover:bg-green-50 transition-all duration-300">Открыть клавиатуру</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, onBeforeUnmount, nextTick, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useInactivityTimer } from "../composables/useInactivityTimer";
import { useDateTime } from "../composables/useDateTime";

// Ref для контейнера сообщений
const messagesContainer = ref<HTMLElement | null>(null);

// Функция автоскролла вниз
const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const router = useRouter();

// Таймер бездействия для чата (30 секунд)
const { isInactive, resetTimer, markActivity } = useInactivityTimer(30000);

// Следим за изменением состояния бездействия
watch(isInactive, (inactive) => {
  if (inactive) {
    console.log('🕐 Показываем рекламу после 30 секунд бездействия в чате')
    ;(window as any).showInactivityModal?.()
  }
})

// Обработчик закрытия модалки неактивности
;(window as any).onInactivityModalClosed = () => {
  resetTimer() // Сбрасываем таймер после закрытия
}

const ws = ref<WebSocket | null>(null);
const messages = ref<{ id: string; text: string; isBot: boolean; timestamp?: string }[]>([]);
const connectionStatus = ref<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
const isTyping = ref(false);

// Состояние для быстрых кнопок ответа
const showQuickReplies = ref(false);
const botTextCount = ref(0); // Простой счетчик bot_text сообщений
const quickReplyOptions = [
  'Изменить запись',
  'Пройти чекап', 
  'Выбрать врача',
  'Записаться к терапевту'
];

// Переменные для эффекта печатания
const displayedTypingMessage = ref('');
const accumulatedMessage = ref(''); // Накопленное сообщение из всех partials
let typingInterval: number | null = null;

// Переменные для анимированных точек
const showTypingDots = ref(false);
const isWaitingForResponse = ref(false);

// Переменные для управления печатанием
const isTypingPaused = ref(false); // Пауза печатания
const canPauseTyping = ref(false); // Можно ли поставить на паузу
const isBotInterrupted = ref(false); // Флаг прерывания бота
const hasAnimatedExistingMessages = ref(false); // Флаг того, что анимация уже была показана


// Очередь для анимации сообщений бота
const botMessageQueue = ref<{ id: string; text: string; isBot: boolean; timestamp: string }[]>([]);
const isProcessingQueue = ref(false);

// Функция для показа анимированных точек
const showTypingIndicator = () => {
  console.log('⏳ Показываем индикатор печатания (точки)');
  showTypingDots.value = true;
  isWaitingForResponse.value = true;
  scrollToBottom();
};

// Функция для скрытия анимированных точек
const hideTypingIndicator = () => {
  console.log('✅ Скрываем индикатор печатания (точки)');
  showTypingDots.value = false;
  isWaitingForResponse.value = false;
};

// Функция для добавления новой части к накопленному сообщению
const addPartialToMessage = (partialText: string) => {
  console.log('📥 Добавляем часть:', partialText);
  
  // Скрываем точки, так как начинаем показывать реальный текст
  hideTypingIndicator();
  
  // Добавляем новую часть к накопленному сообщению
  accumulatedMessage.value += partialText;
  
  console.log('📝 Накопленное сообщение теперь:', accumulatedMessage.value);
  
  // НЕ показываем быстрые кнопки в partial - только после финальной bot_text
  
  // Запускаем анимацию печатания
  startTypingAnimation(accumulatedMessage.value);
};

// Функция для анимации печатания накопленного сообщения
const startTypingAnimation = (targetText: string) => {
  console.log('🔄 Запуск анимации печатания для текста:', targetText);
  
  // Останавливаем предыдущую анимацию
  if (typingInterval) {
    clearTimeout(typingInterval);
    typingInterval = null;
  }
  
  // Если текст пустой, не запускаем анимацию
  if (!targetText || targetText.trim() === '') {
    console.log('⚠️ Пустой текст - не запускаем анимацию');
    return;
  }
  
  isTyping.value = true;
  canPauseTyping.value = true;
  isTypingPaused.value = false;
  let currentLength = displayedTypingMessage.value.length;
  
  // Автоскролл при начале печатания
  scrollToBottom();
  
  console.log('🔄 Анимация печатания от:', currentLength, 'до:', targetText.length);
  
  // Если новый текст короче или равен текущему, показываем сразу
  if (targetText.length <= currentLength) {
    displayedTypingMessage.value = targetText;
    scrollToBottom();
    console.log('✅ Показан сразу (короче или равен):', targetText);
    return;
  }
  
  // Ускоренная и более реалистичная скорость печатания
  const getTypingSpeed = (charIndex: number) => {
    const baseSpeed = 45; // Быстрее для более динамичного эффекта
    const randomVariation = Math.random() * 25 - 12; // Меньше вариативности (от -12 до +12)
    const currentChar = targetText[charIndex];
    
    // Уменьшенные паузы для разных типов символов
    let pauseForPunctuation = 0;
    if (['.', '!', '?'].includes(currentChar)) {
      pauseForPunctuation = 200; // Короче пауза после предложений
    } else if ([',', ';', ':'].includes(currentChar)) {
      pauseForPunctuation = 100; // Короче средняя пауза
    } else if ([' '].includes(currentChar)) {
      pauseForPunctuation = 30; // Короче пауза после пробелов
    } else if (['а', 'о', 'е', 'и', 'у', 'ы', 'э', 'ю', 'я'].includes(currentChar.toLowerCase())) {
      pauseForPunctuation = -5; // Быстрее для гласных
    } else if (['б', 'в', 'г', 'д', 'ж', 'з', 'к', 'л', 'м', 'н', 'п', 'р', 'с', 'т', 'ф', 'х', 'ц', 'ч', 'ш', 'щ'].includes(currentChar.toLowerCase())) {
      pauseForPunctuation = 5; // Немного медленнее для согласных
    }
    
    // Меньше случайных пауз для "задумчивости"
    const thinkingPause = Math.random() < 0.05 ? Math.random() * 100 + 50 : 0; // 5% шанс на паузу
    
    return Math.max(20, baseSpeed + randomVariation + pauseForPunctuation + thinkingPause);
  };
  
  let charIndex = currentLength;
  
  const typeNextChar = () => {
    // Проверяем паузу
    if (isTypingPaused.value) {
      typingInterval = window.setTimeout(typeNextChar, 100);
      return;
    }
    
    if (charIndex < targetText.length) {
      charIndex++;
      displayedTypingMessage.value = targetText.substring(0, charIndex);
      scrollToBottom();
      
      // Логируем каждые 10 символов
      if (charIndex % 10 === 0 || charIndex === targetText.length) {
        console.log(`📝 Печатаем: "${displayedTypingMessage.value}" (${charIndex}/${targetText.length})`);
      }
      
      // Имитация "ошибки" и исправления (очень редко)
      if (Math.random() < 0.02 && charIndex > 3 && charIndex < targetText.length - 2) { // 2% шанс
        const wrongChar = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // случайная буква
        displayedTypingMessage.value = targetText.substring(0, charIndex - 1) + wrongChar;
        scrollToBottom();
        
        // Пауза перед исправлением
        setTimeout(() => {
          displayedTypingMessage.value = targetText.substring(0, charIndex);
          scrollToBottom();
          const nextSpeed = getTypingSpeed(charIndex);
          typingInterval = window.setTimeout(typeNextChar, nextSpeed);
        }, 200);
        return;
      }
      
      const nextSpeed = getTypingSpeed(charIndex);
      typingInterval = window.setTimeout(typeNextChar, nextSpeed);
    } else {
      // Анимация завершена
      typingInterval = null;
      canPauseTyping.value = false;
      console.log('✅ Анимация печатания завершена для текста:', targetText);
      isTyping.value = false;
    }
  };
  
  // Начинаем печатание с задержкой, которая зависит от длины сообщения
  const initialDelay = targetText.length > 50 ? 300 : 150; // Быстрее начальные паузы
  typingInterval = window.setTimeout(typeNextChar, initialDelay);
};

// Функция для анимации печатания существующих сообщений бота
const animateExistingBotMessages = async () => {
  console.log('🎬 Запуск анимации существующих сообщений бота');
  
  // Проверяем, не была ли анимация уже показана
  if (hasAnimatedExistingMessages.value) {
    console.log('⏭️ Анимация уже была показана, пропускаем');
    return;
  }
  
  // Получаем все сообщения бота
  const botMessages = messages.value.filter(msg => msg.isBot);
  
  if (botMessages.length === 0) {
    console.log('📭 Нет сообщений бота для анимации');
    hasAnimatedExistingMessages.value = true; // Отмечаем, что анимация была попытка
    return;
  }
  
  console.log(`📝 Найдено ${botMessages.length} сообщений бота для анимации`);
  console.log('📋 Сообщения для анимации:', botMessages.map(msg => msg.text.substring(0, 30) + '...'));
  
  // Быстрые кнопки уже должны быть показаны при получении bot_text
  
  // Отмечаем, что анимация началась
  hasAnimatedExistingMessages.value = true;
  
  // Временно скрываем все сообщения бота
  messages.value = messages.value.filter(msg => !msg.isBot);
  console.log('🔄 Сообщения бота временно скрыты, осталось сообщений:', messages.value.length);
  
  // Анимируем каждое сообщение бота по очереди
  for (let i = 0; i < botMessages.length; i++) {
    const botMessage = botMessages[i];
    console.log(`🎭 Анимируем сообщение ${i + 1}/${botMessages.length}:`, botMessage.text.substring(0, 50) + '...');
    
    // Очищаем состояние печатания
    displayedTypingMessage.value = '';
    accumulatedMessage.value = '';
    
    // Запускаем анимацию печатания
    startTypingAnimation(botMessage.text);
    
    // Ждем завершения анимации
    await new Promise<void>((resolve) => {
      const checkCompletion = () => {
        if (!isTyping.value) {
          // Анимация завершена, добавляем сообщение в чат
          messages.value.push(botMessage);
          scrollToBottom();
          console.log(`✅ Сообщение ${i + 1} добавлено в чат:`, botMessage.text.substring(0, 30) + '...');
          resolve();
        } else {
          setTimeout(checkCompletion, 100);
        }
      };
      checkCompletion();
    });
    
    // Пауза между сообщениями (кроме последнего)
    if (i < botMessages.length - 1) {
      const pauseBetweenMessages = Math.random() * 400 + 200; // 200-600ms - быстрее
      console.log(`⏸️ Пауза между сообщениями: ${Math.round(pauseBetweenMessages)}ms`);
      await new Promise(resolve => setTimeout(resolve, pauseBetweenMessages));
    }
  }
  
  console.log('🎉 Анимация всех сообщений бота завершена');
};


// Функция для добавления сообщения в очередь анимации
const addMessageToQueue = (message: { id: string; text: string; isBot: boolean; timestamp: string }) => {
  console.log('📥 Добавляем сообщение в очередь:', message.text.substring(0, 30) + '...');
  console.log('📊 Текущее состояние:', {
    queueLength: botMessageQueue.value.length,
    isProcessing: isProcessingQueue.value,
    showQuickReplies: showQuickReplies.value
  });
  
  botMessageQueue.value.push(message);
  
  // Запускаем обработку очереди, если она еще не обрабатывается
  if (!isProcessingQueue.value) {
    console.log('🚀 Запускаем обработку очереди сообщений');
    processMessageQueue();
  } else {
    console.log('⏳ Очередь уже обрабатывается, сообщение добавлено в очередь');
  }
};

// Функция для обработки очереди сообщений
const processMessageQueue = async () => {
  console.log('🔍 Проверка условий для обработки очереди:', {
    isProcessing: isProcessingQueue.value,
    queueLength: botMessageQueue.value.length,
    shouldProcess: !isProcessingQueue.value && botMessageQueue.value.length > 0
  });
  
  if (isProcessingQueue.value || botMessageQueue.value.length === 0) {
    console.log('⏭️ Пропускаем обработку очереди - уже обрабатывается или пуста');
    return;
  }
  
  isProcessingQueue.value = true;
  console.log(`🔄 Начинаем обработку очереди сообщений. В очереди: ${botMessageQueue.value.length} сообщений`);
  
  while (botMessageQueue.value.length > 0) {
    const message = botMessageQueue.value.shift()!;
    console.log(`🎭 Анимируем сообщение из очереди:`, message.text.substring(0, 50) + '...');
    
    // Очищаем состояние печатания
    displayedTypingMessage.value = '';
    accumulatedMessage.value = '';
    
    // Запускаем анимацию печатания
    startTypingAnimation(message.text);
    
    // Ждем завершения анимации
    await new Promise<void>((resolve) => {
      const checkCompletion = () => {
        if (!isTyping.value) {
          // Анимация завершена, добавляем сообщение в чат
          messages.value.push(message);
          scrollToBottom();
          console.log(`✅ Сообщение из очереди добавлено в чат:`, message.text.substring(0, 30) + '...');
          
          // Показываем быстрые кнопки только для первого bot_text (счетчик = 1)
          if (botTextCount.value === 1) {
            showQuickReplies.value = true;
            console.log('✅ Показаны быстрые кнопки для первого bot_text (счетчик = 1)');
            setTimeout(() => scrollToBottom(), 200);
          } else {
            console.log('⏭️ Быстрые кнопки не показываем, счетчик bot_text:', botTextCount.value);
          }
          
          resolve();
        } else {
          setTimeout(checkCompletion, 100);
        }
      };
      checkCompletion();
    });
    
    // Пауза между сообщениями (кроме последнего в очереди)
    if (botMessageQueue.value.length > 0) {
      const pauseBetweenMessages = Math.random() * 400 + 200; // 200-600ms - быстрее
      console.log(`⏸️ Пауза между сообщениями: ${Math.round(pauseBetweenMessages)}ms`);
      await new Promise(resolve => setTimeout(resolve, pauseBetweenMessages));
    }
  }
  
  isProcessingQueue.value = false;
  console.log('🎉 Обработка очереди сообщений завершена');
};



// Функция для остановки эффекта печатания и сброса
const stopTypingEffect = () => {
  console.log('🛑 Останавливаем эффект печатания');
  
  if (typingInterval) {
    clearTimeout(typingInterval);
    typingInterval = null;
  }
  
  // Очищаем состояние печатания
  displayedTypingMessage.value = '';
  accumulatedMessage.value = '';
  isTyping.value = false;
  canPauseTyping.value = false;
  isTypingPaused.value = false;
  
  // Скрываем анимированные точки
  hideTypingIndicator();
  
  console.log('🧹 Эффект печатания остановлен и очищен');
};

// Функция для очистки очереди сообщений (при прерывании бота)
const clearMessageQueue = () => {
  console.log('🗑️ Очищаем очередь сообщений бота');
  botMessageQueue.value = [];
  isProcessingQueue.value = false;
};

// Удалена сложная функция processFinalMessagesQueue - больше не нужна

// Удалены сложные функции startTypingAnimationAndWait и forceCompleteTyping - больше не нужны

// Функции для управления паузой печатания
const toggleTypingPause = () => {
  if (canPauseTyping.value && isTyping.value) {
    isTypingPaused.value = !isTypingPaused.value;
    console.log(isTypingPaused.value ? '⏸️ Печатание приостановлено' : '▶️ Печатание возобновлено');
  }
};


// Используем единый composable для времени и даты
const { currentDate, currentTime, getCurrentTimeString } = useDateTime();

// Функция для генерации уникального ID сообщения
const generateMessageId = () => {
  return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Функция для скрытия быстрых кнопок
const hideQuickReplies = () => {
  if (showQuickReplies.value) {
    showQuickReplies.value = false;
    console.log('✅ Быстрые кнопки скрыты');
  }
};


// Интервал для поддержания постоянного аудио потока
let audioStreamInterval: number | null = null;

// Функция для поддержания постоянного аудио потока
const requestContinuousAudio = () => {
  if (ws.value && ws.value.readyState === WebSocket.OPEN) {
    const keepAliveRequest = {
      type: 'keep_audio_stream',
      timestamp: Date.now()
    };
    
    console.group('📤 ПОДДЕРЖАНИЕ АУДИО ПОТОКА');
    console.log('Тип сообщения:', keepAliveRequest.type);
    console.log('Время:', new Date().toLocaleTimeString());
    console.groupEnd();
    
    ws.value.send(JSON.stringify(keepAliveRequest));
  }
};
onMounted(async () => {
  // Запускаем интервал для поддержания постоянного аудио потока (каждые 30 секунд)
  audioStreamInterval = window.setInterval(requestContinuousAudio, 30000);
  
  // Инициализируем аудио контекст для автовоспроизведения
  initializeAudioContext();
  
  connectWebSocket();
  
  // Запускаем анимацию существующих сообщений бота после небольшой задержки (если есть)
  setTimeout(async () => {
    console.log('🚀 Проверка существующих сообщений бота через 1 секунду после монтирования');
    console.log('📊 Текущие сообщения:', messages.value);
    console.log('📊 Сообщения бота:', messages.value.filter(msg => msg.isBot));
    await animateExistingBotMessages();
  }, 1000); // 1 секунда задержки для полной загрузки компонента
});

// Функция для инициализации аудио контекста
const initializeAudioContext = () => {
  console.log('🎵 Инициализируем аудио контекст для автовоспроизведения');
  
  // Создаем тихий аудио элемент для разблокировки автовоспроизведения
  const silentAudio = new Audio();
  silentAudio.volume = 0;
  silentAudio.muted = true;
  
  // Попытка воспроизвести тишину при первом взаимодействии пользователя
  const enableAudio = async () => {
    try {
      await silentAudio.play();
      console.log('✅ Аудио контекст разблокирован');
      
      // Убираем обработчики после успешной разблокировки
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
      document.removeEventListener('keydown', enableAudio);
    } catch (e) {
      console.log('⚠️ Не удалось разблокировать аудио контекст:', e);
    }
  };
  
  // Добавляем обработчики для первого взаимодействия
  document.addEventListener('click', enableAudio);
  document.addEventListener('touchstart', enableAudio);
  document.addEventListener('keydown', enableAudio);
};
onUnmounted(() => {
  if (audioStreamInterval) clearInterval(audioStreamInterval);
  ws.value?.close();
});

 // WebSocket
const connectWebSocket = () => {
  try {
    connectionStatus.value = 'connecting';
    const sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
    console.log('🔗 Подключаемся с session ID:', sessionId);
    ws.value = new WebSocket(`wss://genai.bpcontact.kz/ws/${sessionId}`);
    ws.value.onopen = () => {
      connectionStatus.value = 'connected';
      
      // Сразу после подключения запрашиваем постоянный аудио поток
      const continuousAudioRequest = {
        type: 'start_continuous_audio',
        message: 'Начинаем постоянный аудио поток'
      };
      
      console.group('📤 ЗАПРОС ПОСТОЯННОГО АУДИО ПОТОКА');
      console.log('Тип сообщения:', continuousAudioRequest.type);
      console.log('Сообщение:', continuousAudioRequest.message);
      console.log('Время:', new Date().toLocaleTimeString());
      console.groupEnd();
      
      ws.value!.send(JSON.stringify(continuousAudioRequest));
    };
    ws.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
         
         // ПОДРОБНОЕ ЛОГИРОВАНИЕ ВСЕХ СООБЩЕНИЙ
         console.group('📩 WebSocket сообщение получено');
         console.log('Тип:', data.type);
         console.log('Полные данные:', data);
         console.log('Текст:', data.text || data.audio?.substring(0, 50) + '...' || 'нет текста');
         console.log('Время:', new Date().toLocaleTimeString());
         console.groupEnd();
         
         // Обработка сообщений от бота
        if (data.type === 'bot_text') {
           console.log('🤖 Финальное сообщение бота:', data.text);
           
           // Сбрасываем флаг прерывания при получении финального текста
           isBotInterrupted.value = false;
           
           // Завершаем текущую анимацию печатания принудительно
           if (typingInterval) {
             clearTimeout(typingInterval);
             typingInterval = null;
           }
           isTyping.value = false;
           canPauseTyping.value = false;
           displayedTypingMessage.value = '';
           accumulatedMessage.value = '';
           
           console.log('🛑 Завершена текущая анимация печатания при получении bot_text');
           
           // Увеличиваем счетчик bot_text сообщений
           botTextCount.value++;
           console.log('📊 Счетчик bot_text:', botTextCount.value);
           
           // Проверяем, есть ли текст для добавления
           if (data.text && data.text.trim()) {
             const cleanText = data.text.trim();
             
             // Простая проверка - добавляем только если такого сообщения нет в чате
             const messageExists = messages.value.some(msg => msg.isBot && msg.text === cleanText);
             
             if (!messageExists) {
               console.log('🎬 Добавляем новое сообщение бота в очередь анимации');
               console.log('📝 Текст сообщения:', cleanText);
               console.log('📊 Состояние ДО добавления:', {
                 messagesCount: messages.value.length,
                 botMessagesCount: messages.value.filter(msg => msg.isBot).length,
                 queueLength: botMessageQueue.value.length,
                 showQuickReplies: showQuickReplies.value
               });
               
               // Создаем сообщение для анимации
               const message = { id: generateMessageId(), text: cleanText, isBot: true, timestamp: getCurrentTimeString() };
               
               // НЕ показываем быстрые кнопки сразу - они появятся после завершения анимации
               console.log('📝 Получен bot_text, быстрые кнопки появятся после завершения анимации');
               
               // Добавляем в очередь для последовательной анимации
               addMessageToQueue(message);
               
             } else {
               console.log('🚫 Сообщение уже существует в чате, пропускаем:', cleanText);
             }
           } else {
             console.warn('⚠️ Получен bot_text с пустым текстом');
             
             // Если есть что-то в печатании, добавляем это как финальное сообщение
             const typingText = displayedTypingMessage.value || accumulatedMessage.value;
             if (typingText && typingText.trim()) {
               const cleanTypingText = typingText.trim();
               const messageExists = messages.value.some(msg => msg.isBot && msg.text === cleanTypingText);
               
               if (!messageExists) {
                 console.log('🎬 Добавляем сообщение из печатания в очередь анимации');
                 
                 // НЕ показываем быстрые кнопки сразу - они появятся после завершения анимации
                 console.log('📝 Получен bot_text из печатания, быстрые кнопки появятся после завершения анимации');
                 
                 // Создаем сообщение для анимации
                 const message = { id: generateMessageId(), text: cleanTypingText, isBot: true, timestamp: getCurrentTimeString() };
                 
                 // Добавляем в очередь для последовательной анимации
                 addMessageToQueue(message);
               }
               
               // Очищаем накопленное сообщение после использования
               displayedTypingMessage.value = '';
               accumulatedMessage.value = '';
               console.log('🧹 Очищено накопленное сообщение после добавления в очередь');
             }
           }
          
          // Сбрасываем таймер бездействия при получении сообщения от бота
          markActivity();
        } else if (data.type === 'bot_text_partial') {
           console.log('🤖📝 BOT_TEXT_PARTIAL:', data.text);
           
          // Игнорируем partial тексты после прерывания бота
          if (isBotInterrupted.value) {
            console.log('🚫 Игнорируем partial текст - бот был прерван');
            return;
          }
           
          // Только добавляем часть, если есть текст
          if (data.text) {
            // Добавляем новую часть к накопленному сообщению
            addPartialToMessage(data.text);
            console.log('✅ Часть добавлена к накопленному сообщению');
          } else {
            console.warn('⚠️ Получен bot_text_partial с пустым текстом');
          }
          
          // Сбрасываем таймер бездействия при частичном сообщении
          markActivity();
        }
         
         // Обработка частичного распознанного текста (во время записи)
         else if (data.type === 'user_text_partial') {
           console.group('👤📝 USER_TEXT_PARTIAL - ПОЛУЧЕН!');
           console.log('✅ Частичный текст получен от сервера');
           console.log('Текст:', data.text);
           console.log('Длина:', data.text?.length || 0);
           console.log('isTranscribing:', isTranscribing.value);
           console.log('isRecording:', isRecording.value);
           console.log('Текущее сообщение было:', currentUserMessage.value);
           
           // Показываем частичный текст ВСЕГДА, когда идет запись
           if (isRecording.value && data.text) {
             // Обновляем текущее сообщение моментально
             currentUserMessage.value = data.text;
             transcribedText.value = data.text;
             isUserTyping.value = true;
             console.log('✅ Обновили моментально (isRecording):', data.text);
             
             // Скроллим вниз при обновлении
             scrollToBottom();
           } else {
             console.log('❌ Не обновили - условие не выполнено');
             console.log('  - isRecording:', isRecording.value);
             console.log('  - data.text:', !!data.text);
           }
           console.groupEnd();
         }
         
         // Обработка финального распознанного текста пользователя
         else if (data.type === 'user_text_final') {
           console.group('👤✅ USER_TEXT_FINAL - ПОДРОБНАЯ ДИАГНОСТИКА');
           console.log('Получен user_text_final!');
           console.log('Текст:', data.text);
           console.log('Тип текста:', typeof data.text);
           console.log('Длина текста:', data.text?.length || 0);
           console.log('Текст после trim:', data.text?.trim());
           console.log('isTranscribing:', isTranscribing.value);
           console.log('Текущее сообщение было:', currentUserMessage.value);
           console.log('Все данные сообщения:', data);
           
           // Проверим все условия по отдельности
           console.log('🔍 Проверка условий:');
           console.log('  - isTranscribing.value =', isTranscribing.value);
           console.log('  - data.text =', !!data.text);
           console.log('  - data.text.trim() =', !!(data.text && data.text.trim()));
           
           // Фильтруем и проверяем качество текста перед добавлением в чат
           if (data.text && data.text.trim()) {
             const cleanText = data.text.trim();
             
             // Фильтры для исключения ложных срабатываний
             const isValidText = cleanText.length >= 2 && // минимум 2 символа
                                !cleanText.match(/^[.,!?;:\s]+$/) && // не только знаки препинания
                                !cleanText.match(/^[а-я]{1}$/i) && // не одна буква
                                !cleanText.match(/^(а|и|о|у|э|ы|я|е|ё|ю)$/i) && // не отдельные гласные
                                !cleanText.match(/^(хм|эм|ах|ох|эх|ух|тс|пс)$/i); // не междометия
             
             console.log('🔍 ФИЛЬТРАЦИЯ ТЕКСТА:');
             console.log('Исходный текст:', data.text);
             console.log('Очищенный текст:', cleanText);
             console.log('Длина:', cleanText.length);
             console.log('Прошел фильтры:', isValidText);
             
             if (isValidText) {
               console.log('✅ Текст прошел фильтрацию - добавляем в чат');
               
               // НЕМЕДЛЕННО добавляем в чат без задержки
               isUserTyping.value = false;
               currentUserMessage.value = '';
               messages.value.push({ id: generateMessageId(), text: cleanText, isBot: false, timestamp: getCurrentTimeString() });
               
               // Скрываем быстрые кнопки при получении первого сообщения от пользователя
               hideQuickReplies();
               
               scrollToBottom();
               console.log('📝 Добавили в чат:', cleanText);
             } else {
               console.log('🚫 Текст не прошел фильтрацию - игнорируем');
               isUserTyping.value = false;
               currentUserMessage.value = '';
             }
             
             // Завершаем транскрипцию если была активна
             if (isTranscribing.value) {
               isTranscribing.value = false;
               transcribedText.value = '';
               console.log('🏁 Транскрипция завершена');
             }
           } else {
             console.log('❌ Пустой или некорректный текст');
             console.log('❌ data.text:', data.text);
             isUserTyping.value = false;
             currentUserMessage.value = '';
           }
           console.groupEnd();
         }
         
         // Обработка аудио ответов бота (универсальная функция для bot_audio и bot_audio_chunk)
         else if (data.type === 'bot_audio_chunk' || data.type === 'bot_audio') {
           console.group(`🤖🎵 ${data.type.toUpperCase()}`);
           console.log('Размер hex данных:', data.audio?.length || 0);
           console.log('Hex (первые 20 символов):', data.audio?.substring(0, 20) + '...' || 'пусто');
           console.log('isBotInterrupted:', isBotInterrupted.value);
           
           // Игнорируем аудио после прерывания бота
           if (isBotInterrupted.value) {
             console.log('🚫 Игнорируем аудио - бот был прерван');
             console.groupEnd();
             return;
           }
           
           if (data.audio && data.audio.length > 0) {
             try {
               // Конвертируем hex в Blob
               const hexString = data.audio;
               const bytes = new Uint8Array(hexString.length / 2);
               for (let i = 0; i < hexString.length; i += 2) {
                 bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
               }
               
               // Пробуем разные MIME типы для совместимости
               const mimeTypes = ['audio/webm', 'audio/ogg', 'audio/wav', 'audio/mp3', 'audio/mpeg'];
               let audioBlob: Blob | null = null;
               
               // Используем первый поддерживаемый формат
               for (const mimeType of mimeTypes) {
                 audioBlob = new Blob([bytes], { type: mimeType });
                 break; // Берем первый, можно улучшить определением формата по заголовкам
               }
               
               if (audioBlob) {
                 // Добавляем в очередь с небольшой задержкой для синхронизации с печатанием
                 // Если идет печатание, добавляем небольшую задержку перед воспроизведением
                 if (isTyping.value) {
                   setTimeout(() => {
                     addAudioToQueue(audioBlob);
                     console.log('✅ Конвертировали и добавили в очередь с задержкой для синхронизации');
                   }, 300); // Небольшая задержка для синхронизации с печатанием
                 } else {
                   addAudioToQueue(audioBlob);
                   console.log('✅ Конвертировали и добавили в очередь (нон-стоп режим)');
                 }
               }
               
               // Сбрасываем таймер бездействия при получении аудио от бота
               markActivity();
             } catch (error) {
               console.error('❌ Ошибка конвертации bot_audio:', error);
             }
           } else {
             console.log('⚠️ Пустые аудио данные');
           }
           console.groupEnd();
         }
         
         // Обработка прерывания бота
         else if (data.type === 'interrupt_bot') {
           console.log('🛑 INTERRUPT_BOT - прерываем бота');
           
           // Устанавливаем флаг прерывания
           isBotInterrupted.value = true;
           
           // Останавливаем воспроизведение аудио
           if (currentAudio) {
             currentAudio.pause();
             currentAudio = null;
           }
           audioQueue.value = [];
           isPlayingAudio.value = false;
           
           // Останавливаем эффект печатания
           stopTypingEffect();
           
           // Очищаем очередь сообщений
           clearMessageQueue();
           
           console.log('✅ Аудио остановлено, печатание прервано, очередь очищена');
         }
         
         // Обработка других аудио статусов
         else if (data.type === 'audio_processing') {
           console.log('🎤 Сервер обрабатывает аудио');
         }
         
         // Логирование неизвестных типов сообщений
         else {
           console.group('❓ НЕИЗВЕСТНЫЙ ТИП СООБЩЕНИЯ');
           console.log('Тип:', data.type);
           console.log('Полные данные:', data);
           console.log('Возможно, нужно добавить обработчик для этого типа');
           console.groupEnd();
         }
         
       } catch (e) {
         console.error('❌ Ошибка парсинга WebSocket сообщения:', e);
         console.log('Сырые данные:', event.data);
       }
    };
    ws.value.onclose = () => connectionStatus.value = 'disconnected';
    ws.value.onerror = () => connectionStatus.value = 'error';
   } catch (e) {
    connectionStatus.value = 'error';
  }
};

// Клавиатура (Vue-driven)
const showKeyboard = ref(false);
const textInput = ref('');
const isRecording = ref(false);

// Layouts
const layouts = {
  kazakh: {
    rows: [
      ['й','ц','у','к','е','н','г','ш','щ'],
      ['ф','ы','в','а','п','р','о','л','д'],
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
  // desktop default grid auto columns are flexible; spans are small ints
  if (key === ' ') return 4;        // space wide
  if (key === '↵' || key === 'Enter') return 3; // enter wider
  if (key === '123' || key === 'ҚАЗ' || key === '⌫') return 2; // special buttons a bit wider
  return 1;
};

const openKeyboard = async () => {
  showKeyboard.value = true;
  await nextTick();
};

const sendText = () => {
   if (!textInput.value.trim()) return;
   
   // Скрываем быстрые кнопки при отправке любого сообщения
   hideQuickReplies();
   
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
     const message = { type: 'text', text: textInput.value };
     const messageStr = JSON.stringify(message);
     
     console.group('📤 ОТПРАВКА ТЕКСТА В WEBSOCKET');
     console.log('Тип сообщения:', message.type);
     console.log('Текст:', textInput.value);
     console.log('Размер JSON:', messageStr.length, 'символов');
     console.log('Полное JSON сообщение:', messageStr);
     console.log('Время:', new Date().toLocaleTimeString());
     console.groupEnd();
     
     ws.value.send(messageStr);
      messages.value.push({ id: generateMessageId(), text: textInput.value, isBot: false, timestamp: getCurrentTimeString() });
      scrollToBottom();
     textInput.value = '';
     
     // Показываем анимированные точки, ожидая ответа от бота
     setTimeout(() => {
       showTypingIndicator();
     }, 200); // Небольшая задержка перед показом точек
    } else {
     console.error('❌ WebSocket не подключен для отправки текста');
     messages.value.push({ id: generateMessageId(), text: '❌ Нет соединения', isBot: false, timestamp: getCurrentTimeString() });
     scrollToBottom();
  }
};

const goToHome = () => router.push('/home');

// Функция для отправки быстрого ответа
const sendQuickReply = (option: string) => {
  // Скрываем быстрые кнопки после выбора
  hideQuickReplies();
  
  // Отправляем выбранный вариант как обычное сообщение
  if (ws.value && ws.value.readyState === WebSocket.OPEN) {
    const message = { type: 'text', text: option };
    const messageStr = JSON.stringify(message);
    
    console.group('📤 ОТПРАВКА БЫСТРОГО ОТВЕТА');
    console.log('Тип сообщения:', message.type);
    console.log('Текст:', option);
    console.log('Время:', new Date().toLocaleTimeString());
    console.groupEnd();
    
    ws.value.send(messageStr);
    messages.value.push({ id: generateMessageId(), text: option, isBot: false, timestamp: getCurrentTimeString() });
    scrollToBottom();
    
    // Показываем анимированные точки, ожидая ответа от бота
    setTimeout(() => {
      showTypingIndicator();
    }, 200);
  } else {
    console.error('❌ WebSocket не подключен для отправки быстрого ответа');
    messages.value.push({ id: generateMessageId(), text: '❌ Нет соединения', isBot: false, timestamp: getCurrentTimeString() });
    scrollToBottom();
  }
};

// обработчик нажатия клавиши
const onKey = (key: string) => {
  if (key === '⌫') {
    textInput.value = textInput.value.slice(0, -1);
  } else if (key === '↵' || key === 'Enter') {
    sendText();
  } else if (key === ' ') {
    textInput.value += ' ';
  } else if (key === '123') {
    isNumbersMode.value = true;
  } else if (key === 'ҚАЗ') {
    isNumbersMode.value = false;
  } else {
    textInput.value += key;
  }
};

 // Голос
 const currentUserMessage = ref('');
 const isUserTyping = ref(false);
 const audioLevel = ref(0);
 const transcribedText = ref('');
 const isTranscribing = ref(false);

 // Аудио очередь для воспроизведения ответов бота
 const audioQueue = ref<Blob[]>([]);
 const isPlayingAudio = ref(false);
 let currentAudio: HTMLAudioElement | null = null;
 
 const startRecording = async () => {
   try {
     console.log('🎤 Начинаем запись PCM - аудио от бота продолжает играть');
     
     // Скрываем быстрые кнопки при начале записи
     hideQuickReplies();
     
     // Сбрасываем флаг прерывания при начале новой записи
     isBotInterrupted.value = false;
     
     // Показываем анимированные точки, ожидая обработки аудио
     setTimeout(() => {
       showTypingIndicator();
     }, 500); // Задержка после начала записи
     
     const stream = await navigator.mediaDevices.getUserMedia({ 
       audio: {
         sampleRate: 8000,
         channelCount: 1,
         echoCancellation: true,
         noiseSuppression: true
       }
     });
     
     // Инициализируем транскрипцию
     transcribedText.value = '';
     isTranscribing.value = true;
     currentUserMessage.value = '';
     isUserTyping.value = false;

     console.groupEnd();
     
     // Устанавливаем isRecording ДО создания AudioContext
     isRecording.value = true;
     
     // Создаем AudioContext с частотой 8000 Гц
     audioContext = new AudioContext({ sampleRate: 8000 });
     audioSource = audioContext.createMediaStreamSource(stream);
     
     // Создаем ScriptProcessorNode для обработки аудио в реальном времени
     // 512 - минимальный размер буфера для максимальной скорости отправки
     audioProcessor = audioContext.createScriptProcessor(512, 1, 1);
  
     console.groupEnd();
     
    // Обработчик аудио данных
    audioProcessor.onaudioprocess = (event) => {
      if (!isRecording.value) return;
      
      const inputBuffer = event.inputBuffer;
      const inputData = inputBuffer.getChannelData(0); // моно канал
      
      // Вычисляем уровень звука для визуализации
      const sum = inputData.reduce((acc, val) => acc + Math.abs(val), 0);
      const average = sum / inputData.length;
      
      // Обновляем уровень звука для визуализации
      audioLevel.value = Math.round(average * 100);
       
       // Конвертируем Float32 в Int16 (16-битный PCM)
       const pcmData = new Int16Array(inputData.length);
       for (let i = 0; i < inputData.length; i++) {
         // Ограничиваем значения от -1 до 1 и конвертируем в 16-битный integer
         const sample = Math.max(-1, Math.min(1, inputData[i]));
         pcmData[i] = Math.round(sample * 32767);
       }
       
       // PCM данные готовы для отправки
       
       // Отправляем PCM данные
       sendAudioPCMData(pcmData);
     };
     
     // Подключаем источник к процессору и к выходу
     audioSource.connect(audioProcessor);
     audioProcessor.connect(audioContext.destination);
     
     console.log('🎤 PCM запись запущена, isRecording уже установлен в:', isRecording.value);
     
   } catch (e) {
     console.error('❌ Ошибка доступа к микрофону', e);
     
     // Сбрасываем состояние при ошибке
     isTranscribing.value = false;
     isUserTyping.value = false;
     currentUserMessage.value = '';
     
     // Показываем ошибку в чате
     messages.value.push({ id: generateMessageId(), text: '❌ Ошибка доступа к микрофону', isBot: false, timestamp: getCurrentTimeString() });
     scrollToBottom();
   }
 };
 
 // Переменные для Web Audio API
 let audioContext: AudioContext | null = null;
 let audioProcessor: ScriptProcessorNode | null = null;
 let audioSource: MediaStreamAudioSourceNode | null = null;

 const sendAudioPCMData = (pcmData: Int16Array) => {
   if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
     console.error('❌ WebSocket не подключен для отправки аудио');
     return;
   }
   
   if (pcmData.length === 0) {
     console.warn('⚠️ Получены пустые PCM данные, пропускаем отправку');
     return;
   }
   
  // Отправляем ВСЁ аудио без фильтрации для максимальной скорости
   
   try {
     // Конвертируем Int16Array в hex
     const uint8Array = new Uint8Array(pcmData.buffer);
     const hexString = Array.from(uint8Array)
       .map(byte => byte.toString(16).padStart(2, '0'))
       .join('');
    
     
     // Отправляем согласно API документации
     const message = {
       type: 'audio',
       audio: hexString
     };
     
     const messageStr = JSON.stringify(message);
     ws.value.send(messageStr);
     
     // Отправляем без дополнительного логирования для скорости
     
   } catch (error) {
     console.error('❌ Ошибка конвертации PCM в hex:', error);
   }
 };
 
 const stopRecording = () => {
   console.log('🎤 Останавливаем PCM запись');
   
   isRecording.value = false;
   audioLevel.value = 0;
   
   // Скрываем точки при остановке записи
   hideTypingIndicator();
   
   // Останавливаем Web Audio API
   if (audioProcessor) {
     audioProcessor.disconnect();
     audioProcessor = null;
   }
   
   if (audioSource) {
     audioSource.disconnect();
     audioSource = null;
   }
   
   if (audioContext) {
     audioContext.close();
     audioContext = null;
   }
   
   setTimeout(() => {
     if (isTranscribing.value) {
       console.groupEnd();
     }
   }, 10000);
   
   // isTranscribing остается true до получения финального результата
 };
 
 const toggleRecording = () => {
   if (isRecording.value) {
     stopRecording();
   } else {
     // Если клавиатура открыта, скрываем её перед началом записи
     if (showKeyboard.value) {
       showKeyboard.value = false;
     }
     startRecording();
   }
 };

 // Функции для работы с аудио очередью
 const addAudioToQueue = (audioBlob: Blob) => {
   audioQueue.value.push(audioBlob);
   console.log('🎵 Добавили аудио в очередь, размер очереди:', audioQueue.value.length);
   
   // Если не воспроизводим, начинаем
   if (!isPlayingAudio.value) {
     playNextAudio();
   }
 };

 const playNextAudio = async () => {
   if (audioQueue.value.length === 0) {
     isPlayingAudio.value = false;
     console.log('🎵 Очередь пуста, воспроизведение завершено');
     return;
   }

   isPlayingAudio.value = true;
   const audioBlob = audioQueue.value.shift()!;
   
   try {
     const audioUrl = URL.createObjectURL(audioBlob);
     currentAudio = new Audio(audioUrl);
     
     currentAudio.onended = () => {
     console.log('✅ Аудио чанк завершен');
       URL.revokeObjectURL(audioUrl);
       currentAudio = null;
       // Воспроизводим следующий чанк
       playNextAudio();
     };
     
     currentAudio.onerror = () => {
       console.groupEnd();
       
       URL.revokeObjectURL(audioUrl);
       currentAudio = null;
       // Пробуем следующий чанк
       playNextAudio();
     };
     
     currentAudio.onloadstart = () => console.log('🎵 Начинаем загрузку аудио');
     currentAudio.oncanplay = () => console.log('🎵 Аудио готово к воспроизведению');
     currentAudio.onplay = () => console.log('▶️ Аудио начало играть');
     
     await currentAudio.play();
     console.log('✅ Команда play() выполнена успешно');
     console.groupEnd();
     
   } catch (error) {
    
     
     // Дополнительная диагностика
     if (error instanceof DOMException) {

       
       if (error.name === 'NotAllowedError') {
         console.log('🚫 Браузер блокирует автовоспроизведение - нужно взаимодействие пользователя');
       }
     }
     console.groupEnd();
     
     // Пробуем следующий чанк
     playNextAudio();
   }
 };



onBeforeUnmount(() => {
  // Останавливаем запись если активна
  if (isRecording.value) {
    stopRecording();
  }
  
  // Останавливаем эффект печатания
  if (typingInterval) {
    clearTimeout(typingInterval);
    typingInterval = null;
  }
  stopTypingEffect();
  
  // Очищаем Web Audio API ресурсы
  if (audioProcessor) {
    audioProcessor.disconnect();
  }
  if (audioSource) {
    audioSource.disconnect();
  }
  if (audioContext) {
    audioContext.close();
  }
  
  // Очищаем интервалы
  if (audioStreamInterval) {
    clearInterval(audioStreamInterval);
    audioStreamInterval = null;
  }
});
</script>

<style scoped>
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

/* Каждая строка — grid с автоматическими колонками (по количеству кнопок).
   grid-auto-columns позволяет каждой кнопке иметь равную ширину;
   gridColumn: span N управляет шириной специальных клавиш. */
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

/* Функциональные кнопки - теперь такие же как обычные */
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

/* Enter - теперь такая же как обычные */
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

/* Маленькая микрофон-кнопка над футером */
.small-mic {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 2px solid rgba(17,174,120,0.14);
  background: white;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  transition: transform .12s ease, box-shadow .12s ease;
}
.small-mic:active { transform: scale(.98); }

/* keyboard actions (между клавиатурой и футером) */
.keyboard-actions { padding: 0 4px; }

/* Адаптив: уменьшаем минимальную ширину и высоту на маленьких экранах */
@media (max-width: 480px) {
  .kbd-row { grid-auto-columns: minmax(30px, 1fr); gap: 6px; }
  .kbd-btn { min-height: 40px; font-size: 14px; padding: 6px 4px; border-radius: 8px; }
  .kbd-enter { font-size: 14px; }
  .small-mic { width: 34px; height: 34px; }
}

@media (max-width: 360px) {
  .kbd-row { grid-auto-columns: minmax(26px, 1fr); gap: 5px; }
  .kbd-btn { min-height: 36px; font-size: 13px; padding: 5px 3px; border-radius: 6px; }
  .kbd-space { flex: 3; }
}

/* Стили для инпута - убираем желтый цвет автозаполнения и фокуса */
input[type="text"] {
  background-color: white !important;
  transition: background-color 0.2s ease;
}

input[type="text"]:focus {
  background-color: white !important;
  outline: 2px solid #e5e7eb !important;
  outline-offset: -2px;
}

input[type="text"]:hover {
  background-color: #f9fafb !important;
}

/* Убираем желтый цвет автозаполнения */
input[type="text"]:-webkit-autofill,
input[type="text"]:-webkit-autofill:hover,
input[type="text"]:-webkit-autofill:focus,
input[type="text"]:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  -webkit-text-fill-color: #000 !important;
  background-color: white !important;
}

/* Оптимизация для тачскринов (где hover нет) */
@media (hover: none) and (pointer: coarse) {
  .kbd-btn:hover { 
    transform: none; 
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    background: linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%);
  }
}

/* Улучшенный курсор печатания */
.typing-cursor {
  color: #11AE78;
  font-weight: bold;
  animation: typing-cursor-blink 1s infinite;
  margin-left: 1px;
}

@keyframes typing-cursor-blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

/* Дополнительная анимация для плавности */
.typing-cursor {
  display: inline-block;
  animation: typing-cursor-blink 1.2s ease-in-out infinite;
}

/* Эффект мерцания для более естественного вида */
@keyframes typing-cursor-blink {
  0% {
    opacity: 1;
    transform: scaleY(1);
  }
  25% {
    opacity: 0.8;
    transform: scaleY(0.8);
  }
  50% {
    opacity: 0;
    transform: scaleY(0.6);
  }
  75% {
    opacity: 0.8;
    transform: scaleY(0.8);
  }
  100% {
    opacity: 1;
    transform: scaleY(1);
  }
}

/* Анимированные точки "бот печатает" */
.typing-dots {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.typing-dots .dot {
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #11AE78;
  animation: typing-dots-bounce 1.4s ease-in-out infinite both;
}

.typing-dots .dot:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-dots .dot:nth-child(2) {
  animation-delay: -0.16s;
}

.typing-dots .dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes typing-dots-bounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

/* Альтернативная анимация - волна */
.typing-dots.wave .dot {
  animation: typing-dots-wave 1.2s ease-in-out infinite;
}

@keyframes typing-dots-wave {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-8px);
    opacity: 1;
  }
}
</style>
