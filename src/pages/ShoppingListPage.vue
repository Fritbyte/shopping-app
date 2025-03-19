<script setup lang="ts">
import { ref, onMounted, onActivated, onUnmounted, watch } from "vue";
import Header from "@/components/Header.vue";
import ShoppingListForm from "@/components/ShoppingListForm.vue";
import ShoppingListCard from "@/components/ShoppingListCard.vue";
import PurchaseElementsDialog from "@/components/PurchaseElementsDialog.vue";
import { token, user } from "@/store/storeUser";
import { createShoppingListApi } from "@/services/shoppingListService";
import type { ShoppingList } from "@/types/shoppingList";

const isOpen = ref(false);
const isEditMode = ref(false);
const currentShoppingList = ref<ShoppingList | null>(null);
const shoppingLists = ref<ShoppingList[]>([]);
const errorMessage = ref("");

const isElementsDialogOpen = ref(false);
const selectedShoppingListId = ref<number | null>(null);

const fetchShoppingLists = async () => {
  if (!token.value || !user.value?.id) {
    errorMessage.value = "Токен или id пользователя отсутствуют";
    shoppingLists.value = [];
    return;
  }
  const api = createShoppingListApi(token.value);
  if (!api) {
    errorMessage.value = "Ошибка инициализации API";
    shoppingLists.value = [];
    return;
  }
  try {
    shoppingLists.value = await api.getAll(user.value.id);
  } catch (err: any) {
    errorMessage.value = "Ошибка загрузки списков покупок: " + err.message;
  }
};

onMounted(() => {
  fetchShoppingLists();
});

onActivated(() => {
  fetchShoppingLists();
});

let intervalId: number;
onMounted(() => {
  intervalId = window.setInterval(fetchShoppingLists, 30000);
});
onUnmounted(() => {
  clearInterval(intervalId);
});

watch(isOpen, (newVal, oldVal) => {
  if (!newVal && oldVal === true) {
    isEditMode.value = false;
    currentShoppingList.value = null;
    fetchShoppingLists();
  }
});

watch(
  () => `${token.value}_${user.value?.id || ""}`,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      shoppingLists.value = [];
      fetchShoppingLists();
    }
  }
);

const viewShoppingList = (listId: number) => {
  selectedShoppingListId.value = listId;
  isElementsDialogOpen.value = true;
};

const deleteShoppingList = async (listId: number) => {
  if (!token.value) {
    errorMessage.value = "Токен отсутствует";
    return;
  }
  const api = createShoppingListApi(token.value);
  if (!api) {
    errorMessage.value = "Ошибка инициализации API";
    return;
  }
  try {
    await api.delete(listId);
    await fetchShoppingLists();
  } catch (err: any) {
    errorMessage.value = "Ошибка при удалении: " + err.message;
  }
};

const editShoppingList = (listId: number) => {
  const list = shoppingLists.value.find(item => item.id === listId);
  if (list) {
    currentShoppingList.value = { ...list };
    isEditMode.value = true;
    isOpen.value = true;
  }
};
</script>

<template>
  <div class="h-screen flex flex-col bg-[#2C2F33] text-white">
    <Header/>
    <div class="flex flex-1">
      <div class="flex flex-1 flex-col mt-10 px-6 sm:px-12 lg:px-16">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-200 mb-4">Список покупок</h1>
          <button
              @click="() => { isOpen = true; isEditMode = false; currentShoppingList = null }"
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition cursor-pointer"
          >
            Создать список покупок
          </button>
        </div>
        <main class="mt-6 w-full">
          <div v-if="errorMessage" class="text-red-500 mb-4">
            {{ errorMessage }}
          </div>
          <div v-if="shoppingLists.length === 0" class="text-gray-400">
            Списков покупок нет
          </div>
          <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ShoppingListCard
                v-for="list in shoppingLists"
                :key="list.id"
                :shoppingList="list"
                @view="viewShoppingList"
                @edit="editShoppingList"
                @delete="deleteShoppingList"
            />
          </ul>
        </main>
      </div>
    </div>
    <ShoppingListForm
        v-model:isOpen="isOpen"
        :isEditMode="isEditMode"
        :shoppingListData="currentShoppingList"
    />
    <PurchaseElementsDialog
        v-if="selectedShoppingListId !== null"
        :visible="isElementsDialogOpen"
        :shoppingListId="selectedShoppingListId"
        @close="isElementsDialogOpen = false"
    />
  </div>
</template>
