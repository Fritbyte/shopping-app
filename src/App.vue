<script setup lang="ts">
import "./assets/main.css";
import Particles from "@/components/Particles.vue";
</script>

<template>
  <div class="h-screen w-screen flex flex-col bg-[#1E1F22]">
    <div class="flex-1 flex justify-center items-center relative overflow-hidden">
      <Particles class="absolute inset-0 z-0"/>
      <div class="absolute inset-0 bg-black/50 backdrop-blur-md"></div>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" class="relative z-10 w-full h-full"/>
        </transition>
      </router-view>
    </div>
  </div>
</template>
