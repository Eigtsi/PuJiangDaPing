<template>
  <span :class="['px-1 py-0.5 rounded font-bold whitespace-nowrap text-[8px]', badgeClass]">
    {{ text }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  text: string
  type?: 'success' | 'warning' | 'danger' | 'info' | 'processing'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
})

const badgeClass = computed(() => {
  const map: Record<string, string> = {
    success: 'text-emerald-400 bg-emerald-950/50',
    warning: 'text-amber-400 bg-amber-950/70',
    danger: 'text-rose-400 bg-rose-950/70',
    info: 'text-cyan-300 bg-cyan-950/50',
    processing: 'text-sky-400 bg-sky-950/50',
  }
  return map[props.type] || map.info
})
</script>
