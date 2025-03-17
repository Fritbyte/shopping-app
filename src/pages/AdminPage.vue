<script setup lang="ts">
import Header from "@/components/Header.vue";
import {useRoute} from "vue-router";

const route = useRoute();
</script>

<template>
  <div class="h-screen flex flex-col bg-[#2C2F33] text-white">
    <Header/>
    <div class="flex flex-1">
      <aside class="w-60 bg-[#1E2124] pt-4 pr-4 border-r border-[#202225] shadow-lg">
        <nav class="flex flex-col space-y-2">
          <router-link to="/admin/users"
                       class="relative flex items-center px-4 py-2 rounded-md text-gray-300 transition-all duration-150"
                       :class="{'bg-[#5865F2] text-white shadow-md': route.path === '/admin/users', 'hover:bg-[#34373C] hover:text-white': route.path !== '/admin/users'}">
            <div class="absolute left-0 top-0 h-full w-1 bg-[#5865F2] transition-all"
                 :class="{'opacity-100': route.path === '/admin/users', 'opacity-0': route.path !== '/admin/users'}"></div>
            <span class="ml-3">Пользователи</span></router-link>

          <router-link to="/admin/gateway"
                       class="relative flex items-center px-4 py-2 rounded-md text-gray-300 transition-all duration-150"
                       :class="{'bg-[#5865F2] text-white shadow-md': route.path === '/admin/gateway','hover:bg-[#34373C] hover:text-white': route.path !== '/admin/gateway'}">
            <div class="absolute left-0 top-0 h-full w-1 bg-[#5865F2] transition-all"
                 :class="{'opacity-100': route.path === '/admin/gateway', 'opacity-0': route.path !== '/admin/gateway'}"></div>
            <span class="ml-3">Категории</span></router-link>
        </nav>
      </aside>
      <main class="flex-1 p-6 overflow-auto bg-[#2C2F33]">
        <router-view/>
      </main>
    </div>
  </div>
</template>
