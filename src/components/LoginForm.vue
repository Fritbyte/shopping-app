<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import {loginUser} from "@/services/authService.ts";
import PasswordInput from "@/components/PasswordInput.vue";

const credentials = ref({username: "", password: ""});
const errorMessage = ref<string | null>(null);
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await loginUser(credentials.value);
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    errorMessage.value = null;
    await router.push("/dashboard");
  } catch (error) {
    errorMessage.value = "Ошибка входа. Проверьте данные и попробуйте снова.";
  }
};
</script>

<template>
  <div class="bg-[#1e1f22] bg-opacity-90 p-8 rounded-lg shadow-lg w-[440px]">
    <h2 class="text-2xl font-semibold mb-2 text-white">Войти</h2>
    <p class="mb-6 text-gray-400">Введите свои данные для входа</p>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-400 mb-1">Имя пользователя</label>
        <input v-model="credentials.username" type="text"
               class="w-full px-4 py-2 rounded bg-[#2b2d31] text-gray-200 focus:ring-2 focus:ring-blue-500"/>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-400 mb-1">Пароль</label>
        <PasswordInput v-model="credentials.password"/>
      </div>
      <button @click="handleLogin" class="w-full py-2 bg-[#5865f2] hover:bg-[#4752c4] rounded text-white transition">
        Войти
      </button>
      <p v-if="errorMessage" class="text-red-400 text-sm mt-2">{{ errorMessage }}</p>
      <p class="text-gray-400 text-sm text-center mt-2">
        Нет аккаунта?
        <button @click="$emit('toggle')" class="text-blue-400 hover:underline">Зарегистрироваться</button>
      </p>
    </div>
  </div>
</template>
