<template>
  <div :class="['w-full rounded-full overflow-hidden border', isLargeScreen ? 'h-1.5' : 'h-2.5', trackClass]">
    <div
      :class="['rounded-full transition-all duration-500', isLargeScreen ? 'h-1.5' : 'h-2.5', barClass]"
      :style="{ width: `${percentage}%` }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  percentage: number           // 0-100
  colorScheme?: 'cyan' | 'emerald' | 'rose' | 'amber' | 'teal'
  isLargeScreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  colorScheme: 'cyan',
  isLargeScreen: true,
})

const trackClass = computed(() => 'bg-[#06183d] border-cyan-500/10')

const barClass = computed(() => {
  const map: Record<string, string> = {
    cyan: 'bg-gradient-to-r from-cyan-400 to-cyan-500',
    emerald: 'bg-gradient-to-r from-cyan-400 to-emerald-400',
    rose: 'bg-gradient-to-r from-rose-400 to-orange-400',
    amber: 'bg-gradient-to-r from-amber-400 to-yellow-400',
    teal: 'bg-gradient-to-r from-[#2dd4bf] to-emerald-400',
  }
  return map[props.colorScheme] || map.cyan
})
</script>
