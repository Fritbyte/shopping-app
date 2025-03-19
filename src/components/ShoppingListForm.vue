<script setup lang="ts">
import {ref, computed, watch} from "vue";
import {token, user} from "@/store/storeUser";
import {createShoppingListApi} from "@/services/shoppingListService";
import type {ShoppingList} from "@/types/shoppingList";

const props = defineProps<{
  isOpen: boolean,
  isEditMode: boolean,
  shoppingListData: ShoppingList | null
}>();
const emit = defineEmits(["update:isOpen", "listCreated"]);

const listName = ref("");
const listDescription = ref("");
const errorMessage = ref("");

const api = computed(() => token.value ? createShoppingListApi(token.value) : null);

watch(() => props.shoppingListData, (newVal) => {
  if (newVal) {
    listName.value = newVal.name;
    listDescription.value = newVal.description;
  } else {
    listName.value = "";
    listDescription.value = "";
  }
}, {immediate: true});

const createShoppingList = async () => {
  errorMessage.value = "";
  if (!listName.value || !listDescription.value) {
    errorMessage.value = "Пожалуйста, заполните все поля";
    return;
  }
  if (!api.value) {
    errorMessage.value = "Ошибка: токен отсутствует или некорректный.";
    return;
  }
  try {
    await api.value.create({
      user_id: user.value?.id || 0,
      name: listName.value,
      description: listDescription.value
    });
    emit("listCreated");
    emit("update:isOpen", false);
    listName.value = "";
    listDescription.value = "";
  } catch (error: any) {
    errorMessage.value = `Ошибка при создании списка покупок: ${error.message}`;
  }
};

const updateShoppingList = async () => {
  errorMessage.value = "";
  if (!listName.value || !listDescription.value) {
    errorMessage.value = "Пожалуйста, заполните все поля";
    return;
  }
  if (!api.value) {
    errorMessage.value = "Ошибка: токен отсутствует или некорректный.";
    return;
  }
  if (!props.shoppingListData?.id) {
    errorMessage.value = "Нет данных для обновления";
    return;
  }
  try {
    await api.value.update(props.shoppingListData.id, {
      name: listName.value,
      description: listDescription.value
    });
    emit("listCreated");
    emit("update:isOpen", false);
    listName.value = "";
    listDescription.value = "";
  } catch (error: any) {
    errorMessage.value = `Ошибка при обновлении списка покупок: ${error.message}`;
  }
};

const handleSubmit = () => {
  if (props.isEditMode) {
    updateShoppingList();
  } else {
    createShoppingList();
  }
};
</script>

<template>
  <div v-if="props.isOpen" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="bg-[#2f3136] p-6 rounded-lg shadow-lg max-w-md w-full relative">
      <h2 class="text-lg font-semibold text-white">
        {{ props.isEditMode ? "Редактировать список покупок" : "Добавить покупку" }}
      </h2>
      <div v-if="errorMessage" class="mt-2 text-red-500 text-sm">{{ errorMessage }}</div>
      <input
          v-model="listName"
          type="text"
          placeholder="Название списка"
          class="mt-4 w-full px-4 py-2 bg-[#444654] text-white border border-[#4f545c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7289da] focus:border-[#7289da] transition duration-200"
      />
      <input
          v-model="listDescription"
          type="text"
          placeholder="Краткое описание списка"
          class="mt-4 w-full px-4 py-2 bg-[#444654] text-white border border-[#4f545c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7289da] focus:border-[#7289da] transition duration-200"
      />
      <div class="flex justify-end mt-4">
        <button
            @click="emit('update:isOpen', false)"
            class="px-4 py-2 bg-[#4f545c] text-white rounded-lg hover:bg-[#72767d] transition duration-200 cursor-pointer"
        >
          Отмена
        </button>
        <button
            @click="handleSubmit"
            class="px-4 py-2 bg-[#7289da] text-white rounded-lg hover:bg-[#5b6e8e] transition duration-200 cursor-pointer ml-2"
        >
          Сохранить
        </button>
      </div>
      <button
          @click="emit('update:isOpen', false)"
          class="absolute top-2 right-2 text-gray-500 hover:text-white transition cursor-pointer"
      >
        ✖
      </button>
    </div>
  </div>
</template>
