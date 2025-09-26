<template>
  <div 
    class="video-wrapper"
    :class="{
      'video-center': position === 'center',
      'video-top-right': position === 'top-right'
    }"
  >
    <div
      class="video-container rounded-full border overflow-hidden shadow-lg bg-white"
      :class="{
        'w-48 h-48 sm:w-44 sm:h-44 lg:w-60 lg:h-60 xl:w-66 xl:h-66 border-4 border-[#E8F4F2]': position === 'center',
        'w-[calc(5rem+10px)] h-[calc(5rem+10px)] sm:w-[calc(6rem+10px)] sm:h-[calc(6rem+10px)] lg:w-[calc(7rem+10px)] lg:h-[calc(7rem+10px)] border-2 border-[#C5E6DC]': position === 'top-right'
      }"
    >
      <video
        ref="videoElement"
        src="../assets/idle.mp4"
        autoplay
        :muted="!isSoundEnabled"
        loop
        :class="position === 'top-right' ? 'object-cover' : 'w-full h-full object-cover'"
        :style="position === 'top-right' ? 'width: 105%; height: 105%; margin: -2.5% 0 0 -2.5%; object-fit: cover; object-position: center; filter: contrast(1.1) brightness(1.05) saturate(1.1) sharpen(0.5);' : 'object-fit: cover; object-position: center; filter: contrast(1.1) brightness(1.05) saturate(1.1) sharpen(0.5);'"
      ></video>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useSoundControl } from '../composables/useSoundControl'

interface Props {
  position: 'center' | 'top-right'
}

defineProps<Props>()

const { isSoundEnabled } = useSoundControl()
const videoElement = ref<HTMLVideoElement>()

// Следим за изменениями состояния звука и обновляем видео
watch(isSoundEnabled, (newValue) => {
  if (videoElement.value) {
    videoElement.value.muted = !newValue
    console.log('🎥 Видео звук обновлен:', newValue ? 'включен' : 'выключен')
  }
})

onMounted(() => {
  if (videoElement.value) {
    videoElement.value.muted = !isSoundEnabled.value
    console.log('🎥 Видео инициализировано с звуком:', isSoundEnabled.value ? 'включен' : 'выключен')
  }
})
</script>

<style scoped>
.video-wrapper {
  transition: all 0.3s ease-in-out;
}

.video-container {
  animation: pulse-glow 2s infinite;
}

/* Тень для центрального видео */
.video-wrapper.video-center .video-container {
  box-shadow: 0 4px 20px rgba(17, 174, 120, 0.3);
}

/* Тень для видео в навбаре - более мягкая с цветом навбара */
.video-wrapper.video-top-right .video-container {
  box-shadow: 0 4px 15px rgba(197, 230, 220, 0.6), 0 2px 8px rgba(17, 174, 120, 0.1);
}

/* Убираем анимацию появления, чтобы не было двойного движения */

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 4px 20px rgba(17, 174, 120, 0.3);
  }
  50% {
    box-shadow: 0 4px 30px rgba(17, 174, 120, 0.5);
  }
}
</style>
