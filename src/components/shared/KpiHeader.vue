<template>
  <div :class="['flex justify-between items-center rounded', isLargeScreen ? 'p-1.5 px-2' : 'p-2.5', 'bg-[#0d2a63]/30']">
    <div>
      <span class="text-xs text-slate-350 block mb-0.5 font-bold">{{ label }}</span>
      <div class="flex items-baseline gap-1.5">
        <span :class="[isLargeScreen ? 'text-2xl' : 'text-3xl', 'font-black font-mono text-cyan-300 digital-glow']">{{ value }}</span>
        <span v-if="unit" class="text-xs text-slate-400">{{ unit }}</span>
        <slot name="badge" />
      </div>
    </div>
    <div v-if="$slots.right" class="text-right text-xs text-slate-350 font-medium font-sans">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  value: string | number
  unit?: string
  isLargeScreen?: boolean
}

withDefaults(defineProps<Props>(), {
  isLargeScreen: true,
})
</script>
