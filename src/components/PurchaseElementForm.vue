<script setup lang="ts">
import {ref, watch, defineProps, defineEmits} from "vue";
import {token} from "@/store/storeUser";
import {createShoppingElementApi} from "@/services/shoppingElementService";
import {createGatewayApi} from "@/services/gatewayService";
import type {Gateway} from "@/types/gateway";
import type {ShoppingElement} from "@/types/shoppingElement";

const props = defineProps<{
  visible: boolean;
  shoppingListId: number;
  elementToEdit?: ShoppingElement;
}>();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved"): void;
}>();

const newElementName = ref("");
const newElementQuantity = ref(1);
const newElementGatewayId = ref<number | null>(null);
const newElementStatus = ref<"PURCHASED" | "DELIVERED">("PURCHASED");
const addErrorMessage = ref("");
const adding = ref(false);
const gateways = ref<Gateway[]>([]);
const gatewayError = ref("");
const gatewayLoading = ref(false);

const fetchGateways = async () => {
  if (!token.value) {
    gatewayError.value = "Токен отсутствует";
    return;
  }
  const gatewayApi = createGatewayApi(token.value);
  if (!gatewayApi) {
    gatewayError.value = "Ошибка инициализации API";
    return;
  }
  gatewayLoading.value = true;
  try {
    gateways.value = await gatewayApi.getAll();
  } catch (err: any) {
    gatewayError.value = "Ошибка загрузки категорий: " + err.message;
  } finally {
    gatewayLoading.value = false;
  }
};

watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        fetchGateways();
        if (props.elementToEdit) {
          newElementName.value = props.elementToEdit.name;
          newElementQuantity.value = props.elementToEdit.quantity;
          newElementGatewayId.value = props.elementToEdit.gatewayId;
          newElementStatus.value = props.elementToEdit.elementStatus;
        } else {
          newElementName.value = "";
          newElementQuantity.value = 1;
          newElementGatewayId.value = null;
          newElementStatus.value = "PURCHASED";
        }
      }
    },
    {immediate: true}
);

const closeDialog = () => {
  emit("close");
};

const savePurchaseElement = async () => {
  addErrorMessage.value = "";
  if (!newElementName.value || !newElementQuantity.value || newElementGatewayId.value === null) {
    addErrorMessage.value = "Заполните все поля";
    return;
  }
  if (!token.value) {
    addErrorMessage.value = "Токен отсутствует";
    return;
  }
  const api = createShoppingElementApi(token.value);
  if (!api) {
    addErrorMessage.value = "Ошибка инициализации API";
    return;
  }
  adding.value = true;
  try {
    if (props.elementToEdit) {
      await api.update(props.elementToEdit.id, {
        shoppingListId: props.shoppingListId,
        gatewayId: newElementGatewayId.value,
        name: newElementName.value,
        quantity: newElementQuantity.value,
        elementStatus: newElementStatus.value,
      });
    } else {
      await api.create({
        shoppingListId: props.shoppingListId,
        gatewayId: newElementGatewayId.value,
        name: newElementName.value,
        quantity: newElementQuantity.value,
        elementStatus: newElementStatus.value,
      });
    }
    emit("saved");
    closeDialog();
    newElementName.value = "";
    newElementQuantity.value = 1;
    newElementGatewayId.value = null;
    newElementStatus.value = "PURCHASED";
  } catch (err: any) {
    addErrorMessage.value = "Ошибка сохранения: " + err.message;
  } finally {
    adding.value = false;
  }
};
</script>

<template>
  <div v-if="props.visible" class="fixed inset-0 flex items-center justify-center z-50">
    <div
        class="bg-[#2f3136] p-6 rounded-lg shadow-xl max-w-md w-full relative transform transition duration-300 ease-in-out">
      <h3 class="text-lg font-semibold text-white mb-4">
        {{ props.elementToEdit ? 'Редактировать элемент' : 'Добавить новый элемент' }}
      </h3>
      <button @click="closeDialog"
              class="absolute top-2 right-2 text-[#72767d] hover:text-white transition cursor-pointer text-xl">
        &times;
      </button>
      <div v-if="gatewayError" class="text-red-500 mb-2">{{ gatewayError }}</div>
      <div v-if="gatewayLoading" class="text-gray-400 mb-2">Загрузка категорий...</div>
      <div class="space-y-3">
        <input v-model="newElementName" type="text" placeholder="Название"
               class="w-full px-3 py-2 bg-[#36393f] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7289da] transition"/>
        <input v-model.number="newElementQuantity" type="number" placeholder="Количество" min="1"
               class="w-full px-3 py-2 bg-[#36393f] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7289da] transition"/>
        <select v-model.number="newElementGatewayId"
                class="w-full px-3 py-2 bg-[#36393f] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7289da] transition">
          <option disabled value="">Выберите категорию</option>
          <option v-for="gateway in gateways" :key="gateway.id" :value="gateway.id">
            {{ gateway.name }}
          </option>
        </select>
        <select v-model="newElementStatus"
                class="w-full px-3 py-2 bg-[#36393f] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7289da] transition">
          <option value="PURCHASED">Куплено</option>
          <option value="DELIVERED">Доставлено</option>
        </select>
        <div v-if="addErrorMessage" class="text-red-500 text-sm">{{ addErrorMessage }}</div>
        <button @click="savePurchaseElement" :disabled="adding"
                class="w-full bg-[#7289da] text-white py-2 rounded-lg hover:bg-[#5a6c8c] transition">
          {{
            adding ? (props.elementToEdit ? "Сохранение..." : "Добавление...") : (props.elementToEdit ? "Сохранить изменения" : "Добавить элемент")
          }}
        </button>
      </div>
    </div>
  </div>
</template>
