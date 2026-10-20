<template>
  <div class="relative min-h-screen w-screen bg-gradient-to-b from-[#051230] via-[#040c24] to-[#020718] overflow-hidden">
    <!-- If screen is large, wrap inside a fixed 16:9 container, scaling to fit the resolution -->
    <div 
      :style="isLargeScreen ? {
        width: '1920px',
        height: '1080px',
        transform: `scale(${scaleX}, ${scaleY})`,
        transformOrigin: 'top left',
        position: 'absolute',
        left: '0',
        top: '0',
        flexShrink: 0
      } : undefined"
      :class="[
        isLargeScreen 
          ? 'w-[1920px] h-[1080px] p-4 pb-3' 
          : 'relative w-full h-full min-h-screen p-4 md:p-6',
        'text-slate-100 font-sans select-none tech-grid-bg flex flex-col justify-between overflow-hidden'
      ]"
    >
      <router-view v-slot="{ Component }">
        <transition name="route-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const scaleX = ref(1);
const scaleY = ref(1);
const isLargeScreen = ref(true);

const handleResize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  // Below 1024px we render dynamic scrolling layout for mobile usability
  if (width < 1024) {
    isLargeScreen.value = false;
  } else {
    isLargeScreen.value = true;
    scaleX.value = width / 1920;
    scaleY.value = height / 1080;
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style>
/* Global Router transition */
.route-fade-enter-active,
.route-fade-leave-active {
  transition: opacity 0.3s ease;
}

.route-fade-enter-from,
.route-fade-leave-to {
  opacity: 0;
}
</style>
