<template>
  <div class="relative min-h-screen w-screen bg-gradient-to-b from-[#051230] via-[#040c24] to-[#020718] overflow-hidden">
    <!-- 1920×1080 设计稿，按视口宽/高各自缩放填满（横向满宽、纵向压到视口高度）——即「昨天版本」的填满效果。
         关键：不再加 will-change / backface-visibility。这两个属性会强制 GPU 合成层，
         是 Intel 核显“关闭控制台整屏黑”的元凶；只保留 transform:scale 本身即可。 -->
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

const isLargeScreen = ref(true);
const scaleX = ref(1);
const scaleY = ref(1);

const handleResize = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w < 1024) {
    isLargeScreen.value = false;
  } else {
    isLargeScreen.value = true;
    scaleX.value = w / 1920;
    scaleY.value = h / 1080;
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
