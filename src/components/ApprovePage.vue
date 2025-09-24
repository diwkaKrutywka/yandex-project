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

    <!-- Фиксированный футер -->
    <div class="flex justify-center bg-[#E8F4F2] mt-6">
      <div
        class="border-2 border-[#11AE78] rounded-full px-4 py-2 text-[#11AE78] font-bold w-fit cursor-pointer text-center my-4 bg-white"
        @click="handleConfirm"
      >
        Закрыть х
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  appointmentResult?: any;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const handleConfirm = () => {
  console.log("🔍 ApprovePage: закрываем модальное окно");
  emit("close");
};
</script>

<style scoped></style>
