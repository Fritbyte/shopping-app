<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import {registerUser} from "@/services/authService.ts";
import PasswordInput from "@/components/PasswordInput.vue";

const router = useRouter();
const credentials = ref({username: "", email: "", password: "", confirmPassword: ""});
const errorMessage = ref("");

async function handleRegister() {
  if (credentials.value.password !== credentials.value.confirmPassword) {
    errorMessage.value = "Пароли не совпадают!";
    return;
  }

  try {
    await registerUser(credentials.value);
    await router.push("/auth/login");
  } catch (error) {
    errorMessage.value = "Ошибка регистрации. Попробуйте снова.";
  }
}
</script>

<template>
  <div class="bg-[#1e1f22] bg-opacity-90 p-8 rounded-lg shadow-lg w-[440px]">
    <h2 class="text-2xl font-semibold mb-2 text-white">Создать аккаунт</h2>
    <p class="mb-6 text-gray-400">Введите свои данные для регистрации</p>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-400 mb-1">Имя пользователя</label>
        <input v-model="credentials.username" type="text"
               class="w-full px-4 py-2 rounded bg-[#2b2d31] text-gray-200 focus:ring-2 focus:ring-blue-500"/>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
        <input v-model="credentials.email" type="email"
               class="w-full px-4 py-2 rounded bg-[#2b2d31] text-gray-200 focus:ring-2 focus:ring-blue-500"/>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-400 mb-1">Пароль</label>
        <PasswordInput v-model="credentials.password"/>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-400 mb-1">Подтвердите пароль</label>
        <PasswordInput v-model="credentials.confirmPassword"/>
      </div>
      <p v-if="errorMessage" class="text-red-400 text-sm">{{ errorMessage }}</p>
      <button @click="handleRegister" class="w-full py-2 bg-[#5865f2] hover:bg-[#4752c4] rounded text-white transition">
        Зарегистрироваться
      </button>
      <p class="text-gray-400 text-sm text-center mt-2">
        Уже есть аккаунт?
        <button @click="router.push('/auth/login')" class="text-blue-400 hover:underline">Войти</button>
      </p>
    </div>
  </div>
</template>
