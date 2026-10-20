<template>
  <div :class="[
    'rounded border border-cyan-500/25 bg-[#071942]/65 hover:border-cyan-400/50 transition flex flex-col justify-between min-h-0',
    isLargeScreen ? 'p-1 px-2' : 'p-3',
    className
  ]">
    <div class="flex justify-between items-center">
      <span :class="[isLargeScreen ? 'text-[11px]' : 'text-sm md:text-base', 'font-bold text-white/80']">
        {{ label }}
      </span>
      <span v-if="statusDot" :class="['rounded-full animate-pulse', statusDotClass]" />
      <span v-if="badge" class="px-1 py-0.5 rounded text-[10px] font-bold font-mono" :class="badgeClass">{{ badge }}</span>
    </div>
    <div :class="['flex justify-between items-baseline', isLargeScreen ? 'mt-0.5 mb-0.5' : 'mt-2.5 mb-1']">
      <span v-if="subLabel" class="text-[10px] text-slate-400 font-bold scale-90 origin-left">{{ subLabel }}</span>
      <span :class="[isLargeScreen ? 'text-sm' : 'text-xl md:text-2xl', 'font-black', valueGlowClass]">{{ value }}</span>
    </div>
    <div v-if="detail" class="flex justify-between text-[10px] text-slate-300 border-t border-cyan-500/10 pt-0.5 mt-0.5 font-mono scale-90 origin-left">
      <span v-for="(item, idx) in detail" :key="idx">
        {{ item.label }} <span :class="item.class">{{ item.value }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface DetailItem {
  label: string
  value: string | number
  class?: string
}

interface Props {
  label: string
  value: string | number
  subLabel?: string
  badge?: string
  badgeType?: 'success' | 'warning' | 'danger' | 'info'
  statusDot?: 'green' | 'yellow' | 'red'
  detail?: DetailItem[]
  isLargeScreen?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  isLargeScreen: true,
  className: '',
  badgeType: 'info',
})

const statusDotClass = computed(() => {
  const map: Record<string, string> = {
    green: 'w-1.5 h-1.5 bg-emerald-500',
    yellow: 'w-1.5 h-1.5 bg-yellow-500',
    red: 'w-1 h-1 bg-rose-500',
  }
  return map[props.statusDot || 'green'] || map.green
})

const badgeClass = computed(() => {
  const map: Record<string, string> = {
    success: 'bg-emerald-500/20 text-emerald-400',
    warning: 'bg-amber-500/20 text-amber-300',
    danger: 'bg-rose-500/20 text-rose-400',
    info: 'bg-cyan-500/20 text-cyan-300',
  }
  return map[props.badgeType] || map.info
})

const valueGlowClass = computed(() => {
  if (props.statusDot === 'red') return 'text-rose-400 digital-glow-red'
  if (props.statusDot === 'yellow') return 'text-yellow-400 digital-glow-yellow'
  return 'text-cyan-300 digital-glow'
})
</script>
