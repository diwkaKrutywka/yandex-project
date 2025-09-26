<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import Advertisement from './components/Advertisement.vue'

// Управление модальным окном рекламы
const showAdvertisement = ref(false)

// Состояние глобального видео
const route = useRoute()
const isVideoTransitioning = ref(false)
const showGlobalVideo = ref(false)

// Глобальные функции для управления модалкой из компонентов
;(window as any).showInactivityModal = () => {
  showAdvertisement.value = true
}

;(window as any).hideInactivityModal = () => {
  showAdvertisement.value = false
}

// Закрытие модального окна рекламы
const closeAdvertisement = () => {
  console.log('❌ Закрываем рекламу')
  showAdvertisement.value = false
  // Уведомляем ChatView о закрытии модалки
  ;(window as any).onInactivityModalClosed?.()
}

// Глобальные функции для управления видео анимацией
;(window as any).startVideoTransition = () => {
  showGlobalVideo.value = true
  isVideoTransitioning.value = true
  
  // Аварийное скрытие через максимальное время
  setTimeout(() => {
    if (showGlobalVideo.value) {
      console.log('🚨 Аварийное скрытие глобального видео')
      showGlobalVideo.value = false
      isVideoTransitioning.value = false
    }
  }, 2000) // Максимум 2 секунды
}

// Функция для принудительного скрытия глобального видео
;(window as any).forceHideGlobalVideo = () => {
  showGlobalVideo.value = false
  isVideoTransitioning.value = false
}

// Дополнительная защита - скрываем видео при любом взаимодействии
const hideVideoOnInteraction = () => {
  if (showGlobalVideo.value && route.name === 'ServiceView') {
    showGlobalVideo.value = false
    isVideoTransitioning.value = false
  }
}

// Добавляем обработчики событий для принудительного скрытия
onMounted(() => {
  document.addEventListener('click', hideVideoOnInteraction)
  document.addEventListener('touchstart', hideVideoOnInteraction)
})

onUnmounted(() => {
  document.removeEventListener('click', hideVideoOnInteraction)
  document.removeEventListener('touchstart', hideVideoOnInteraction)
})

// Отслеживаем изменения маршрута
watch(route, (newRoute) => {
  if ((newRoute.name === 'ServiceView' || newRoute.name === 'SearchPage' || newRoute.name === 'InfoService') && isVideoTransitioning.value) {
    // ПРИНУДИТЕЛЬНО скрываем глобальное видео сразу после анимации
    setTimeout(() => {
      showGlobalVideo.value = false
      isVideoTransitioning.value = false
    }, 1250) // Убираем сразу после анимации (1.2s + 50ms)
  }
})
</script>

<template>
  <div class="w-screen h-screen overflow-hidden flex justify-center">
    <div class="w-full h-full">
      <router-view />
    </div>
    
    <!-- Глобальное анимированное видео -->
    <div 
      v-if="showGlobalVideo"
      class="global-video-container"
      :class="{ 'animate-to-service': isVideoTransitioning }"
    >
      <div class="global-video-wrapper">
        <video
          autoplay
          muted
          loop
          class="object-cover"
          style="width: 105%; height: 105%; margin: -2.5% 0 0 -2.5%; object-fit: cover; object-position: center; filter: contrast(1.1) brightness(1.05) saturate(1.1) sharpen(0.5);"
        >
          <source src="/src/assets/idle.mp4" type="video/mp4">
        </video>
      </div>
    </div>

    <!-- Модальное окно рекламы -->
    <Advertisement 
      :isVisible="showAdvertisement"
      @close="closeAdvertisement"
    />
  </div>
</template>

<style scoped>

</style>

<style>
/* Глобальные стили для полноэкранного режима */
html, body {
  margin: 0;
  font-family: 'Onest', system-ui, -apple-system, sans-serif;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #E8F4F2; /* Фон для навигации и футера */
}

#app {
  overflow: hidden;
  padding: 0;
  display: flex;
  justify-content: center;
  background: #E8F4F2; /* Фон для навигации и футера */
}

/* Контейнер для контента */
.content-container {
  width: 100%;
 
  height: 100vh;

  background: white; /* Белый фон для контента */
}

/* Предотвращаем скролл на мобильных устройствах */
* {
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}

/* Убираем стандартные отступы браузера */
body {
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
}

/* Адаптивность для разных экранов */
@media (max-width: 448px) {
  .content-container {
    max-width: 100%;
  }
}

/* Убираем все возможные отступы и устанавливаем Onest для всех элементов */
* {
  box-sizing: border-box;
  font-family: 'Onest', system-ui, -apple-system, sans-serif;
}

/* Глобальное анимированное видео */
.global-video-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  pointer-events: none;
  /* Анимация будет переопределять эти значения */
}

.global-video-wrapper {
  width: 12.625rem; /* 202px */
  height: 12.625rem; /* 202px */
  border: 4px solid #E8F4F2;
  border-radius: 50%;
  overflow: hidden;
  background: transparent;
  box-shadow: 0 4px 20px rgba(17, 174, 120, 0.3);
  animation: pulse-glow 2s infinite;
}

/* Анимация перемещения в ServiceView */
.animate-to-service {
  animation: moveToServiceView 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-fill-mode: forwards; /* Остается в финальной позиции */
}

.animate-to-service .global-video-wrapper {
  animation: shrinkToService 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards, pulse-glow 2s infinite;
  animation-fill-mode: forwards; /* Остается в финальном размере */
}

@keyframes moveToServiceView {
  0% {
    transform: translate(-50%, -50%);
  }
  100% {
    /* Точная настройка: -33px по X и Y для идеального совпадения */
    transform: translate(calc(50vw - 3rem - 37px), calc(-50vh + 2.5rem - 37px));
  }
}

@keyframes shrinkToService {
  0% {
    width: 12.625rem; /* 202px */
    height: 12.625rem; /* 202px */
    border: 4px solid #E8F4F2;
  }
  100% {
    width: calc(5rem + 10px); /* увеличенный размер */
    height: calc(5rem + 10px); /* увеличенный размер */
    border: 2px solid #C5E6DC;
  }
}

/* Адаптивность для глобального видео */
@media (min-width: 637px) {
  .global-video-wrapper {
    width: 11.625rem; /* 186px */
    height: 11.625rem; /* 186px */
  }
  
  @keyframes shrinkToService {
    0% {
      width: 11.625rem; /* 186px */
      height: 11.625rem; /* 186px */
      border: 4px solid #E8F4F2;
    }
    100% {
      width: calc(6rem + 10px); /* увеличенный размер для SM */
      height: calc(6rem + 10px); /* увеличенный размер для SM */
      border: 2px solid #C5E6DC;
    }
  }
  
  @keyframes moveToServiceView {
    0% {
      transform: translate(-50%, -50%);
    }
    100% {
      /* SM: Точная настройка: -37px по X и Y */
      transform: translate(calc(50vw - 3.5rem - 37px), calc(-50vh + 3rem - 37px));
    }
  }
}

@media (min-width: 1024px) {
  .global-video-wrapper {
    width: 15.625rem; /* 250px */
    height: 15.625rem; /* 250px */
  }
  
  @keyframes shrinkToService {
    0% {
      width: 15.625rem; /* 250px */
      height: 15.625rem; /* 250px */
      border: 4px solid #E8F4F2;
    }
    100% {
      width: calc(7rem + 10px); /* увеличенный размер для LG */
      height: calc(7rem + 10px); /* увеличенный размер для LG */
      border: 2px solid #C5E6DC;
    }
  }
  
  @keyframes moveToServiceView {
    0% {
      transform: translate(-50%, -50%);
    }
    100% {
      /* LG: Точная настройка: -37px по X и Y */
      transform: translate(calc(50vw - 4rem - 37px), calc(-50vh + 3.5rem - 37px));
    }
  }
}

@media (min-width: 1280px) {
  .global-video-wrapper {
    width: 17.125rem; /* 274px */
    height: 17.125rem; /* 274px */
  }
  
  @keyframes shrinkToService {
    0% {
      width: 17.125rem; /* 274px */
      height: 17.125rem; /* 274px */
      border: 4px solid #E8F4F2;
    }
    100% {
      width: calc(7rem + 10px); /* увеличенный размер для XL */
      height: calc(7rem + 10px); /* увеличенный размер для XL */
      border: 2px solid #C5E6DC;
    }
  }
  
  @keyframes moveToServiceView {
    0% {
      transform: translate(-50%, -50%);
    }
    100% {
      /* XL: Точная настройка: -35px по X и Y */
      transform: translate(calc(50vw - 4rem - 40px), calc(-50vh + 3.5rem - 40px));
    }
  }
}

/* Анимация для видео */
.video-glow {
  box-shadow: 0 0 20px rgba(17, 174, 120, 0.3);
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(17, 174, 120, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(17, 174, 120, 0.5);
  }
}
</style>
