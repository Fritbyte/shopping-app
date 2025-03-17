<script setup lang="ts">
import {ref, onMounted} from "vue";
import {createUserApi} from "../services/userService";
import {token, user as currentUser} from "../store/storeUser";
import type {User} from "../types/auth";

const users = ref<User[]>([]);
const loading = ref(true);
const errorMessage = ref("");

const fetchUsers = async () => {
  if (!token.value) {
    errorMessage.value = "Токен отсутствует";
    return;
  }
  try {
    const userApi = createUserApi(token.value);
    users.value = await userApi?.getAll();
  } catch (error) {
    console.error("Ошибка при загрузке пользователей:", error);
    errorMessage.value = "Ошибка загрузки данных";
  } finally {
    loading.value = false;
  }
};

const deleteUser = async (id: number) => {
  try {
    const userApi = createUserApi(token.value);
    await userApi?.delete(id);
    users.value = users.value.filter((u) => u.id !== id);
  } catch (error) {
    console.error("Ошибка при удалении пользователя:", error);
    errorMessage.value = "Ошибка при удалении";
  }
};

onMounted(fetchUsers);
</script>

<template>
  <div class="w-full bg-[#23272A] p-6 rounded-xl shadow-lg">
    <h2 class="text-2xl font-semibold mb-4">Управление пользователями</h2>

    <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
    <p v-if="loading" class="text-gray-400">Загрузка...</p>

    <div v-if="!loading" class="overflow-hidden rounded-lg border border-[#2C2F33]">
      <table class="w-full border-collapse">
        <thead class="bg-[#2C2F33] text-gray-300 uppercase text-sm">
        <tr>
          <th class="p-4 text-left border-b border-[#40444B]">ID</th>
          <th class="p-4 text-left border-b border-[#40444B]">Имя</th>
          <th class="p-4 text-left border-b border-[#40444B]">Email</th>
          <th class="p-4 text-left border-b border-[#40444B]">Роль</th>
          <th class="p-4 text-left border-b border-[#40444B]">Действия</th>
        </tr>
        </thead>
        <tbody class="text-white">
        <tr
            v-for="item in users"
            :key="item.id"
            class="hover:bg-[#40444B] transition-colors ease-in-out border-b border-[#2C2F33]"
        >
          <td class="p-4 text-gray-300">{{ item.id }}</td>
          <td class="p-4 font-semibold">{{ item.username }}</td>
          <td class="p-4 text-gray-300">{{ item.email }}</td>
          <td class="p-4">
              <span
                  class="px-3 py-1 rounded-md text-xs font-medium"
                  :class="{
                  'bg-[#5865F2] text-white': item.role === 'ADMIN',
                  'bg-gray-700 text-gray-300': item.role !== 'ADMIN'
                }"
              >
                {{ item.role === "ADMIN" ? "Администратор" : "Пользователь" }}
              </span>
          </td>
          <td class="p-4">
            <button
                v-if="item.id !== currentUser?.id"
                @click="deleteUser(item.id)"
                class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition-colors shadow-sm"
            >
              Удалить
            </button>
            <span v-else class="text-gray-400 italic">Нельзя удалить себя</span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
