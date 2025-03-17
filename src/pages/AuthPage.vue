<script setup lang="ts">
import {computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";
import Particles from "@/components/Particles.vue";

const route = useRoute();
const router = useRouter();

const isLogin = computed(() => route.params.authType === "login");

const toggleAuth = () => {
  router.push(isLogin.value ? "/auth/register" : "/auth/login");
};
</script>

<template>
  <div class="relative h-screen flex items-center justify-center">
    <Particles class="absolute inset-0 z-0"/>
    <div class="z-10">
      <Transition name="fade" mode="out-in">
        <component :is="isLogin ? LoginForm : RegisterForm" @toggle="toggleAuth" :key="route.params.authType"/>
      </Transition>
    </div>
  </div>
</template>

