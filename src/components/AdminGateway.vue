<script setup lang="ts">
import {ref, onMounted} from "vue";
import {createGatewayApi} from "../services/gatewayService";
import {token} from "../store/storeUser";
import type {Gateway} from "../types/gateway";

const gateways = ref<Gateway[]>([]);
const loading = ref(true);
const errorMessage = ref("");

const newGateway = ref<Omit<Gateway, "id">>({name: "", description: ""});
const editingGateway = ref<Gateway | null>(null);

const fetchGateways = async () => {
  if (!token.value) {
    errorMessage.value = "Токен отсутствует";
    return;
  }
  try {
    const gatewayApi = createGatewayApi(token.value);
    gateways.value = await gatewayApi.getAll();
  } catch (error) {
    console.error("Ошибка при загрузке категорий:", error);
    errorMessage.value = "Ошибка загрузки данных";
  } finally {
    loading.value = false;
  }
};

const addGateway = async () => {
  if (!newGateway.value.name.trim()) return;
  try {
    const gatewayApi = createGatewayApi(token.value);
    const created = await gatewayApi.create(newGateway.value);
    gateways.value.push(created);
    newGateway.value = {name: "", description: ""};
  } catch (error) {
    console.error("Ошибка при добавлении категорий:", error);
    errorMessage.value = "Ошибка при добавлении";
  }
};

const deleteGateway = async (id: number) => {
  try {
    const gatewayApi = createGatewayApi(token.value);
    await gatewayApi.delete(id);
    gateways.value = gateways.value.filter((g) => g.id !== id);
  } catch (error) {
    console.error("Ошибка при удалении категории:", error);
    errorMessage.value = "Ошибка при удалении";
  }
};

const startEdit = (gateway: Gateway) => {
  editingGateway.value = {...gateway};
};

const updateGateway = async () => {
  if (!editingGateway.value) return;
  try {
    const gatewayApi = createGatewayApi(token.value);
    const updated = await gatewayApi.update(editingGateway.value);
    const index = gateways.value.findIndex((g) => g.id === updated.id);
    if (index !== -1) gateways.value[index] = updated;
    editingGateway.value = null;
  } catch (error) {
    console.error("Ошибка при обновлении категории:", error);
    errorMessage.value = "Ошибка при обновлении";
  }
};

onMounted(fetchGateways);
</script>

<template>
  <div class="w-full bg-[#23272A] p-6 rounded-xl shadow-lg">
    <h2 class="text-3xl font-bold text-gray-200 mb-6 text-center">Управление категориями</h2>

    <p v-if="errorMessage" class="text-red-500 text-center">{{ errorMessage }}</p>
    <p v-if="loading" class="text-gray-400 text-center">Загрузка...</p>

    <div class="bg-[#2C2F33] p-5 rounded-lg mb-6 shadow-md">
      <h3 class="text-xl font-semibold text-gray-200 mb-3">Добавить новую категорию</h3>
      <div class="flex space-x-3">
        <input
            v-model="newGateway.name"
            placeholder="Название"
            class="flex-1 px-4 py-2 bg-[#40444B] text-white rounded-lg border border-[#50555C] focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
            v-model="newGateway.description"
            placeholder="Описание"
            class="flex-1 px-4 py-2 bg-[#40444B] text-white rounded-lg border border-[#50555C] focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
            @click="addGateway"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition">
          Добавить
        </button>
      </div>
    </div>

    <div v-if="!loading" class="overflow-hidden rounded-lg shadow-md border border-[#2C2F33]">
      <table class="w-full border-collapse">
        <thead class="bg-[#2C2F33] text-gray-300 uppercase text-sm">
        <tr>
          <th class="p-4 text-left border-b border-[#50555C]">ID</th>
          <th class="p-4 text-left border-b border-[#50555C]">Название</th>
          <th class="p-4 text-left border-b border-[#50555C]">Описание</th>
          <th class="p-4 text-left border-b border-[#50555C]">Действия</th>
        </tr>
        </thead>
        <tbody class="text-white">
        <tr v-for="gateway in gateways" :key="gateway.id"
            class="hover:bg-[#50555C] transition-colors ease-in-out border-b border-[#2C2F33]">
          <td class="p-4 text-gray-300">{{ gateway.id }}</td>
          <td class="p-4 font-semibold">{{ gateway.name }}</td>
          <td class="p-4 text-gray-300">{{ gateway.description }}</td>
          <td class="p-4 flex space-x-2">
            <button @click="startEdit(gateway)"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow transition">Изменить
            </button>
            <button @click="deleteGateway(gateway.id)"
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow transition">Удалить
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-if="editingGateway" class="bg-[#2C2F33] p-5 rounded-lg mt-6 shadow-md">
      <h3 class="text-xl font-semibold text-gray-200 mb-3">Редактировать категорию</h3>
      <div class="flex space-x-3">
        <input
            v-model="editingGateway.name"
            placeholder="Название"
            class="flex-1 px-4 py-2 bg-[#40444B] text-white rounded-lg border border-[#50555C] focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
            v-model="editingGateway.description"
            placeholder="Описание"
            class="flex-1 px-4 py-2 bg-[#40444B] text-white rounded-lg border border-[#50555C] focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
            @click="updateGateway"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition">Сохранить
        </button>
        <button
            @click="editingGateway = null"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow transition">Отмена
        </button>
      </div>
    </div>
  </div>
</template>
