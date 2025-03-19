<script setup lang="ts">
import {ref, watch} from "vue";
import {token} from "@/store/storeUser";
import {createShoppingElementApi} from "@/services/shoppingElementService";
import type {ShoppingElement} from "@/types/shoppingElement";
import PurchaseElementForm from "@/components/PurchaseElementForm.vue";

const props = defineProps<{ visible: boolean; shoppingListId: number }>();
const emit = defineEmits<{ (e: "close"): void }>();

const purchaseElements = ref<ShoppingElement[]>([]);
const errorMessage = ref("");
const loading = ref(false);
const isAddDialogOpen = ref(false);
const isEditDialogOpen = ref(false);
const elementToEdit = ref<ShoppingElement | null>(null);

const fetchPurchaseElements = async () => {
  if (!token.value) {
    errorMessage.value = "Токен отсутствует";
    return;
  }
  const api = createShoppingElementApi(token.value);
  if (!api) {
    errorMessage.value = "Ошибка инициализации API";
    return;
  }
  loading.value = true;
  try {
    purchaseElements.value = await api.getAll(props.shoppingListId);
  } catch (err: any) {
    errorMessage.value = "Ошибка загрузки элементов: " + err.message;
  } finally {
    loading.value = false;
  }
};

watch(
    () => props.visible,
    (newVal) => {
      if (newVal) fetchPurchaseElements();
    },
    {immediate: true}
);

const closeDialog = () => {
  emit("close");
};

const openAddDialog = () => {
  isAddDialogOpen.value = true;
};

const openEditDialog = (element: ShoppingElement) => {
  elementToEdit.value = element;
  isEditDialogOpen.value = true;
};

const onElementSaved = () => {
  isAddDialogOpen.value = false;
  isEditDialogOpen.value = false;
  elementToEdit.value = null;
  fetchPurchaseElements();
};

const deleteElement = async (elementId: number) => {
  if (!token.value) {
    errorMessage.value = "Токен отсутствует";
    return;
  }
  const api = createShoppingElementApi(token.value);
  if (!api) {
    errorMessage.value = "Ошибка инициализации API";
    return;
  }
  try {
    await api.delete(elementId);
    await fetchPurchaseElements();
  } catch (err: any) {
    errorMessage.value = "Ошибка удаления: " + err.message;
  }
};

const translateStatus = (status: string): string => {
  if (status === "PURCHASED") return "Куплено";
  if (status === "DELIVERED") return "Доставлено";
  return status;
};
</script>

<template>
  <transition name="dialog" appear>
    <div v-if="props.visible" class="fixed inset-0 flex items-center justify-center z-50">
      <div
          class="bg-[#2f3136] p-6 rounded-lg shadow-xl max-w-xl w-full relative transform transition duration-300 ease-in-out">
        <h2 class="text-xl font-semibold text-white mb-4">Элементы покупок</h2>
        <button @click="closeDialog"
                class="absolute top-3 right-3 text-gray-500 hover:text-white transition cursor-pointer text-2xl">
          &times;
        </button>
        <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>
        <div v-if="loading" class="text-gray-400 mb-4">Загрузка...</div>
        <ul v-if="!loading && purchaseElements.length > 0" class="space-y-3 mb-6">
          <li v-for="element in purchaseElements" :key="element.id"
              class="p-3 bg-[#36393f] rounded-md flex justify-between items-center shadow transition transform hover:scale-105">
            <div>
              <div class="font-medium text-white">{{ element.name }}</div>
              <div class="text-sm text-gray-400">Количество: {{ element.quantity }}</div>
              <div class="text-sm text-gray-400">Статус: {{ translateStatus(element.elementStatus) }}</div>
            </div>
            <div class="flex space-x-2">
              <button @click="openEditDialog(element)"
                      class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition">
                Редактировать
              </button>
              <button @click="deleteElement(element.id)"
                      class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                Удалить
              </button>
            </div>
          </li>
        </ul>
        <div v-if="!loading && purchaseElements.length === 0" class="text-gray-400 mb-6">
          Элементов покупок нет
        </div>
        <button @click="openAddDialog"
                class="w-full bg-[#7289da] text-white py-2 rounded-lg hover:bg-[#5a6c8c] transition">
          Добавить элемент
        </button>
      </div>
    </div>
  </transition>

  <transition name="dialog" appear>
    <PurchaseElementForm
        v-if="isAddDialogOpen"
        :visible="isAddDialogOpen"
        :shoppingListId="props.shoppingListId"
        @close="isAddDialogOpen = false"
        @saved="onElementSaved"
    />
  </transition>

  <transition name="dialog" appear>
    <PurchaseElementForm
        v-if="isEditDialogOpen"
        :visible="isEditDialogOpen"
        :shoppingListId="props.shoppingListId"
        :elementToEdit="elementToEdit"
        @close="isEditDialogOpen = false"
        @saved="onElementSaved"
    />
  </transition>
</template>