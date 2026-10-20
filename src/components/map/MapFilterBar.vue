<template>
  <div class="flex flex-col gap-1">
    <!-- 区块筛选 — 两列网格 -->
    <div class="flex flex-col gap-0.5">
      <span class="text-[11px] text-cyan-400 font-bold px-0.5">区块</span>
      <div class="grid grid-cols-2 gap-0.5">
        <button
          v-for="z in zones"
          :key="z.key"
          @click="setZone(z.key)"
          :class="[
            'flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold transition-all duration-300 border cursor-pointer text-left',
            activeZone === z.key
              ? z.activeClass
              : 'bg-[#0f2c69]/60 text-slate-400 border-cyan-500/10 hover:border-cyan-400/30 hover:text-cyan-200'
          ]"
        >
          <span class="w-2 h-2 rounded-full flex-shrink-0" :class="z.dotClass" />
          <span>{{ z.label }}</span>
        </button>
      </div>
    </div>

    <!-- 行业筛选 -->
    <div class="flex flex-col gap-0.5 mt-0.5">
      <span class="text-[11px] text-cyan-400 font-bold px-0.5">行业</span>
      <div class="flex flex-wrap gap-1">
        <button
          v-for="ind in industries"
          :key="ind.key"
          @click="setIndustry(ind.key)"
          :class="[
            'px-2 py-0.5 rounded text-xs font-bold transition-all duration-200 border cursor-pointer',
            activeIndustry === ind.key
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50'
              : 'bg-[#0f2c69]/30 text-slate-500 border-cyan-500/10 hover:border-cyan-500/20 hover:text-slate-300'
          ]"
        >
          {{ ind.label }}
        </button>
      </div>
    </div>

    <!-- 规模筛选 -->
    <div class="flex flex-col gap-0.5 mt-0.5">
      <span class="text-[11px] text-cyan-400 font-bold px-0.5">规模</span>
      <div class="flex flex-wrap gap-1">
        <button
          v-for="s in scales"
          :key="s.key"
          @click="setScale(s.key)"
          :class="[
            'px-2 py-0.5 rounded text-xs font-bold transition-all duration-200 border cursor-pointer',
            activeScale === s.key
              ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
              : 'bg-[#0f2c69]/30 text-slate-500 border-cyan-500/10 hover:border-cyan-500/20 hover:text-slate-300'
          ]"
        >
          {{ s.label }}
        </button>
      </div>
    </div>

    <!-- 统计摘要 -->
    <div class="mt-0.5 px-0.5 pt-1 border-t border-cyan-500/15 text-[11px] text-slate-500">
      显示 <b class="text-cyan-400 font-bold">{{ visibleCount }}</b> / {{ totalCount }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  activeZone: 'all' | 'east' | 'center' | 'west'
  activeIndustry: 'all' | 'crystal' | 'support'
  activeScale: 'all' | 'large' | 'medium' | 'small'
  visibleCount: number
  totalCount: number
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'setZone', zone: 'all' | 'east' | 'center' | 'west'): void
  (e: 'setIndustry', industry: 'all' | 'crystal' | 'support'): void
  (e: 'setScale', scale: 'all' | 'large' | 'medium' | 'small'): void
}>()

const zones = [
  { key: 'all' as const, label: '全部', dotClass: 'bg-gradient-to-r from-cyan-400 via-blue-400 to-amber-400', activeClass: 'bg-[#0d4094] text-cyan-200 border-cyan-400/80' },
  { key: 'east' as const, label: '东部', dotClass: 'bg-cyan-400', activeClass: 'bg-cyan-900/50 text-cyan-200 border-cyan-400/80' },
  { key: 'center' as const, label: '中部', dotClass: 'bg-blue-400', activeClass: 'bg-blue-900/50 text-blue-200 border-blue-400/80' },
  { key: 'west' as const, label: '西部', dotClass: 'bg-amber-400', activeClass: 'bg-amber-900/50 text-amber-200 border-amber-400/80' },
]

const industries = [
  { key: 'all' as const, label: '全部' },
  { key: 'crystal' as const, label: '水晶加工' },
  { key: 'support' as const, label: '配套服务' },
]

const scales = [
  { key: 'all' as const, label: '全部' },
  { key: 'large' as const, label: '大型' },
  { key: 'medium' as const, label: '中型' },
  { key: 'small' as const, label: '小型' },
]

const setZone = (z: 'all' | 'east' | 'center' | 'west') => emit('setZone', z)
const setIndustry = (i: 'all' | 'crystal' | 'support') => emit('setIndustry', i)
const setScale = (s: 'all' | 'large' | 'medium' | 'small') => emit('setScale', s)
</script>
