<script setup lang="ts">
import {ref, watch, defineProps, defineEmits} from "vue";
import {token} from "@/store/storeUser";
import {createGatewayApi} from "@/services/gatewayService";
import type {Gateway} from "@/types/gateway";

const props = defineProps<{ visible: boolean }>();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved", gateway?: Gateway): void;
}>();

const newGateway = ref<Omit<Gateway, "id">>({name: "", description: ""});
const errorMessage = ref("");
const loading = ref(false);

const addGateway = async () => {
  if (!newGateway.value.name.trim()) {
    errorMessage.value = "Название обязательно";
    return;
  }
  if (!token.value) {
    errorMessage.value = "Токен отсутствует";
    return;
  }
  loading.value = true;
  try {
    const gatewayApi = createGatewayApi(token.value);
    const created = await gatewayApi.create(newGateway.value);
    emit("saved", created);
    newGateway.value = {name: "", description: ""};
    emit("close");
  } catch (error: any) {
    console.error("Ошибка при добавлении категории:", error);
    errorMessage.value = "Ошибка при добавлении";
  } finally {
    loading.value = false;
  }
};

watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        newGateway.value = {name: "", description: ""};
        errorMessage.value = "";
      }
    },
    {immediate: true}
);

const closeDialog = () => {
  emit("close");
};
</script>

<template>
  <transition name="dialog" appear>
    <div v-if="props.visible" class="fixed inset-0 flex items-center justify-center z-50">
      <div
          class="bg-[#2f3136] p-6 rounded-lg shadow-xl max-w-md w-full relative transform transition duration-300 ease-in-out">
        <h3 class="text-lg font-semibold text-white mb-4">Добавить новую категорию</h3>
        <button @click="closeDialog"
                class="absolute top-2 right-2 text-[#72767d] hover:text-white transition cursor-pointer text-xl">
          &times;
        </button>
        <div v-if="errorMessage" class="text-red-500 mb-2">{{ errorMessage }}</div>
        <div class="space-y-3">
          <input v-model="newGateway.name" type="text" placeholder="Название"
                 class="w-full px-4 py-2 bg-[#36393f] text-white rounded-lg border border-[#50555C] focus:outline-none focus:ring-2 focus:ring-[#7289da] transition"/>
          <input v-model="newGateway.description" type="text" placeholder="Описание"
                 class="w-full px-4 py-2 bg-[#36393f] text-white rounded-lg border border-[#50555C] focus:outline-none focus:ring-2 focus:ring-[#7289da] transition"/>
          <button @click="addGateway" :disabled="loading"
                  class="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
            {{ loading ? "Добавление..." : "Добавить" }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
