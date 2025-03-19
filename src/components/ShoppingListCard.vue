<script setup lang="ts">
import {defineProps, defineEmits} from "vue";
import type {ShoppingList} from "@/types/shoppingList";

const props = defineProps<{
  shoppingList: ShoppingList;
}>();

const emit = defineEmits<{
  (e: "view", id: number): void;
  (e: "edit", id: number): void;
  (e: "delete", id: number): void;
}>();

const viewList = () => {
  emit("view", props.shoppingList.id as number);
};

const editList = () => {
  emit("edit", props.shoppingList.id as number);
};

const deleteList = () => {
  emit("delete", props.shoppingList.id as number);
};
</script>

<template>
  <li class="bg-[#36393f] p-4 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:bg-[#4f545c]">
    <div class="font-semibold text-white mb-2">{{ shoppingList.name }}</div>
    <div class="text-sm text-gray-400 mb-4">{{ shoppingList.description }}</div>
    <div class="flex justify-between items-center">
      <button
          @click="viewList"
          class="bg-[#7289da] text-white py-1 px-3 rounded-md text-xs transition transform duration-300 ease-in-out hover:scale-110 hover:bg-[#5a6c8c] cursor-pointer"
      >
        Просмотреть
      </button>
      <div class="space-x-2">
        <button
            @click="editList"
            class="bg-[#43b581] text-white py-1 px-3 rounded-md text-xs transition transform duration-300 ease-in-out hover:scale-110 hover:bg-[#37a672] cursor-pointer"
        >
          Изменить
        </button>
        <button
            @click="deleteList"
            class="bg-[#f04747] text-white py-1 px-3 rounded-md text-xs transition transform duration-300 ease-in-out hover:scale-110 hover:bg-[#e03e3e] cursor-pointer"
        >
          Удалить
        </button>
      </div>
    </div>
  </li>
</template>
