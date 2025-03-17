<script setup>
import {ref, onMounted} from "vue";

const particles = ref([]);

function createParticle() {
  return {
    id: Math.random(),
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 4 + 2,
    opacity: Math.random() * 0.5 + 0.3,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5
  };
}

function updateParticles() {
  particles.value.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0 || p.x > window.innerWidth) p.speedX *= -1;
    if (p.y < 0 || p.y > window.innerHeight) p.speedY *= -1;
  });

  requestAnimationFrame(updateParticles);
}

onMounted(() => {
  for (let i = 0; i < 150; i++) {
    particles.value.push(createParticle());
  }
  updateParticles();
});
</script>

<template>
  <div class="fixed inset-0 overflow-hidden pointer-events-none">
    <div
        v-for="p in particles"
        :key="p.id"
        class="absolute bg-white rounded-full transition-transform duration-100"
        :style="{
        width: `${p.size}px`,
        height: `${p.size}px`,
        top: `${p.y}px`,
        left: `${p.x}px`,
        opacity: p.opacity,
      }"
    ></div>
  </div>
</template>
