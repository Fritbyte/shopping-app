<script setup lang="ts">
import {useRouter} from "vue-router";
import {ShoppingCart, PartyPopper, Coffee, Leaf, Utensils, Apple, Carrot, Cake} from "lucide-vue-next";

const router = useRouter();

const goToLists = () => {
  router.push("/lists");
};

const cards = [
  {icon: ShoppingCart, color: "text-blue-400", title: "Список покупок", items: ["Молоко", "Хлеб", "Яйца"]},
  {icon: PartyPopper, color: "text-purple-400", title: "Для вечеринки", items: ["Чипсы", "Кола", "Пицца"]},
  {icon: Coffee, color: "text-yellow-400", title: "Завтрак", items: ["Йогурт", "Фрукты", "Кофе"]},
  {icon: Leaf, color: "text-green-400", title: "Полезные перекусы", items: ["Орехи", "Батончики", "Чай"]},
  {icon: Utensils, color: "text-red-400", title: "На обед", items: ["Паста", "Томатный соус", "Сыр"]},
  {icon: Apple, color: "text-pink-400", title: "Фрукты", items: ["Яблоки", "Бананы", "Апельсины"]},
  {icon: Carrot, color: "text-orange-400", title: "Овощи", items: ["Морковь", "Картофель", "Лук"]},
  {icon: Cake, color: "text-indigo-400", title: "Десерты", items: ["Шоколад", "Печенье", "Торт"]}
];
</script>

<template>
  <div
      class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#23272A] via-[#2C2F33] to-[#1E2124] text-white relative overflow-hidden">
    <div class="absolute -top-32 left-10 w-72 h-72 bg-blue-500 rounded-full opacity-20 blur-3xl animate-blob"></div>
    <div
        class="absolute bottom-10 right-10 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000"></div>

    <div
        class="relative z-10 text-center px-8 py-10 bg-[#2C2F33] shadow-2xl rounded-2xl w-[90%] max-w-lg border border-[#40444B]">
      <h1 class="text-4xl font-bold text-gray-200 mb-4">Добро пожаловать!</h1>
      <p class="text-gray-400 mb-6">Создавайте и управляйте списками покупок легко и удобно.</p>
      <button @click="goToLists"
              class="px-6 py-3 bg-[#7289DA] hover:bg-[#5B6EAE] transition rounded-lg font-semibold text-white shadow-md cursor-pointer">
        Создать список
      </button>
    </div>

    <div class="absolute top-1/4 left-5 grid grid-cols-2 gap-6 animate-container">
      <div v-for="(card, index) in cards.slice(0, 4)" :key="index"
           class="bg-[#2C2F33] p-5 rounded-lg shadow-lg border border-[#40444B] w-64 flex items-center space-x-3 animate-floating"
           :style="{ animationDelay: `${index * 0.5}s` }">
        <component :is="card.icon" :class="card.color" size="24"/>
        <div>
          <h3 class="font-semibold text-gray-300">{{ card.title }}</h3>
          <ul class="text-gray-400 text-sm">
            <li v-for="item in card.items" :key="item">✔ {{ item }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="absolute bottom-1/4 right-5 grid grid-cols-2 gap-6 animate-container">
      <div v-for="(card, index) in cards.slice(4, 8)" :key="index"
           class="bg-[#2C2F33] p-5 rounded-lg shadow-lg border border-[#40444B] w-64 flex items-center space-x-3 animate-floating"
           :style="{ animationDelay: `${index * 0.5}s` }">
        <component :is="card.icon" :class="card.color" size="24"/>
        <div>
          <h3 class="font-semibold text-gray-300">{{ card.title }}</h3>
          <ul class="text-gray-400 text-sm">
            <li v-for="item in card.items" :key="item">✔ {{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(20px, -10px) scale(1.1);
  }
  66% {
    transform: translate(-15px, 15px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes floating {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-blob {
  animation: blob 6s infinite ease-in-out;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animate-floating {
  animation: floating 3s infinite ease-in-out;
}

.animate-container {
  animation: fadeIn 1s ease-out;
}
</style>
