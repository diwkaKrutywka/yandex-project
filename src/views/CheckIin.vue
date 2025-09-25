<template>
    <div class="text-center mb-6 p-4 flex-shrink-0 mt-12">
      <!-- Если ИИН нет -->
      <div v-if="!iin">
        <span class="text-[#11AE78] font-bold text-[20px] lg:text-lg mb-6">
          {{ $t('appointment_title') }} <br />
        </span>

        <span class="text-black text-sm lg:text-base mb-4 font-semibold my-6" v-html="$t('appointment_description')">
        </span>

        <!-- Поле перехода на авторизацию -->
        <div
          class="w-full max-w-xs mx-auto py-2 px-8 bg-[#E0E0E0] rounded-xl mt-4 cursor-pointer"
          @click="openAuthPage"
        >
          <span class="text-black text-md lg:text-base mb-2 font-bold">
            {{ $t('iin_label') }}
          </span>
        </div>
      </div>
  
      <!-- Если ИИН уже есть -->
      <div v-else>
        <span class="text-[#11AE78] font-bold text-[20px] lg:text-lg mb-6">
          {{ $t('appointment_title') }} <br />
        </span>

        <span class="text-black text-sm lg:text-base mb-4 font-semibold my-6">
          {{ $t('iin_value') }} {{ iin }}
        </span>

        <!-- В реальном приложении эти данные можно будет грузить по API -->
        <div class="mt-2 text-gray-800">
          <div class="font-medium">{{ $t('patient_name') }}</div>
          <div class="text-sm text-gray-600">{{ $t('patient_section') }}</div>
        </div>

        <div
          class="mt-4 bg-[#0C593E] text-white px-6 py-2 rounded-3xl shadow hover:bg-green-900 max-w-xs mx-auto"
        >
          {{ $t('book_therapist') }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from "vue-router";
  import { storeToRefs } from "pinia";
  import { useUserStore } from "../store/index";
  import { useI18n } from "vue-i18n";
  
  const { t: $t } = useI18n();
  
  const router = useRouter();
  const userStore = useUserStore();
  const { iin } = storeToRefs(userStore); // реактивный доступ к iin
  
  const openAuthPage = () => {
    router.push("/auth-page");
  };
  </script>
  