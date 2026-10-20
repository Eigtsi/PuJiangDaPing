<template>
  <div :class="[isLargeScreen ? 'space-y-2' : 'space-y-3']">
    <!-- 绿色低碳核心指标 -->
    <div class="grid grid-cols-2 gap-2">
      <StatCard label="光伏发电占比" :value="`${solarPct}%`" statusDot="green" />
      <StatCard label="工业用水回用率" :value="`${reclaimPct}%`" statusDot="green" />
    </div>

    <!-- 目标达成进度 -->
    <div class="bg-[#0d2a63]/30 rounded border border-cyan-500/10 p-1.5">
      <div class="text-xs text-cyan-300 font-bold mb-1.5 font-sans">🎯 绿色低碳目标达成</div>
      <div v-for="t in targetRows" :key="t.name" class="mb-1.5 last:mb-0">
        <div class="flex justify-between text-xs text-slate-300 mb-0.5">
          <span>{{ t.name }}</span>
          <span class="font-mono text-emerald-400">{{ t.current }}% / {{ t.target }}%</span>
        </div>
        <ProgressBar :percentage="t.percent" colorScheme="emerald" />
      </div>
    </div>

    <!-- 碳减排 -->
    <div class="bg-emerald-950/15 rounded border border-emerald-500/10 p-1.5 px-2 flex justify-between items-center text-xs">
      <span class="text-slate-400">年度碳减排量</span>
      <span class="text-emerald-400 font-mono font-bold">86.3 吨</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StatCard from '../../shared/StatCard.vue'
import ProgressBar from '../../shared/ProgressBar.vue'
import { energyTargets, electricitySourceSplit } from '../../../data/energy'

withDefaults(defineProps<{
  isLargeScreen?: boolean
}>(), {
  isLargeScreen: true
})

const solarPct = computed(() => electricitySourceSplit.find(s => s.source === '光伏发电')?.percentage || 0)
const reclaimPct = computed(() => energyTargets.find(t => t.name === '工业用水回用率')?.current || 0)

const targetRows = computed(() =>
  energyTargets.map(t => ({
    name: t.name,
    current: t.current,
    target: t.target,
    percent: Math.round((t.current / t.target) * 100)
  }))
)
</script>