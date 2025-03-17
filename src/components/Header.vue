<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";

const router = useRouter();
const user = ref<{ username: string; role: string } | null>(null);
const showMenu = ref(false);
const menuRef = ref(null);

onMounted(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }
});

const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !(menuRef.value as HTMLElement).contains(event.target as Node)) {
    showMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
})

const toggleMenu = (event: Event) => {
  event.stopPropagation();
  showMenu.value = !showMenu.value;
}

const logout = () => {
  localStorage.clear();
  router.push("/auth/login");
};
</script>

<template>
  <header class="bg-[#1E1F22] px-6 py-3 flex justify-between items-center shadow-md relative">
    <h1 class="text-2xl font-bold text-white tracking-wide ml-10 mb-0.5 mr-20">Shopping List</h1>
    <nav>
      <ul class="flex space-x-6">
        <li>
          <router-link to="/home"
                       class="relative text-white text-base font-medium transition-colors duration-200
          after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-white
          after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100">
            Главная
          </router-link>
          <router-link to="/list"
                       class="relative text-white text-base font-medium transition-colors duration-200 ml-6
          after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-white
          after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100">
            Список покупок
          </router-link>
          <router-link v-if="user?.role === 'ADMIN'" to="/admin"
                       class="relative text-white text-base font-medium transition-colors duration-200 ml-6
          after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-white
          after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100">
            Админ панель
          </router-link>
        </li>
      </ul>
    </nav>

    <div v-if="user" class="relative ml-auto mr-20">
      <div @click="toggleMenu" class="flex items-center space-x-3 cursor-pointer select-none">
        <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
          {{ user.username.charAt(0).toUpperCase() }}
        </div>
        <div class="text-sm text-gray-300">
          <span class="block font-semibold text-white">{{ user.username }}</span>
          <span class="text-xs text-gray-400">
            {{ user.role === "ADMIN" ? "Администратор" : "Пользователь" }}
          </span>
        </div>
      </div>
      <transition name="fade">
        <div v-if="showMenu" ref="menuRef"
             class="absolute left-1/2 transform -translate-x-1/2 mt-2 w-40 bg-[#2b2d31] rounded-md shadow-lg py-1 z-50 border border-gray-700">
          <button @click="logout"
                  class="block w-full text-left px-4 py-2 text-white hover:bg-[#5865F2] transition text-sm">Выйти
          </button>
        </div>
      </transition>
    </div>
  </header>
</template>