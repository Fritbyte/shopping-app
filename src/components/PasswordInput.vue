<script setup lang="ts">
import {ref} from "vue";
import {Eye, EyeOff} from "lucide-vue-next";

defineProps<{ modelValue: string }>();
const emit = defineEmits(["update:modelValue"]);
const isPasswordVisible = ref(false);

const toggleVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};
</script>

<template>
  <div class="relative">
    <input
        :type="isPasswordVisible ? 'text' : 'password'"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="w-full px-4 py-2 rounded bg-[#2b2d31] text-gray-200 focus:ring-2 focus:ring-blue-500 pr-10"
    />
    <button
        type="button"
        @click="toggleVisibility"
        class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
    >
      <Eye v-if="!isPasswordVisible" class="w-5 h-5"/>
      <EyeOff v-else class="w-5 h-5"/>
    </button>
  </div>
</template>
