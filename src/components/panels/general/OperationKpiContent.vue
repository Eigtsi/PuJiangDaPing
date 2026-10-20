<template>
  <div :class="[isLargeScreen ? 'space-y-2' : 'space-y-3']">
    <!-- 年度营收 -->
    <div class="flex justify-between items-center bg-[#0d2a63]/30 rounded p-1.5 px-2">
      <div>
        <span class="text-xs text-slate-350 block mb-0.5 font-bold">年度营收总额</span>
        <div class="flex items-baseline gap-1.5">
          <span :class="[isLargeScreen ? 'text-2xl' : 'text-3xl', 'font-black font-mono text-cyan-300 digital-glow']">{{ totalZone.total }}万</span>
        </div>
      </div>
      <div class="text-right text-xs text-slate-350 font-medium font-sans">
        <span>综合收缴率: </span>
        <span class="text-emerald-400 font-extrabold font-mono text-sm">{{ totalZone.collectionRate }}%</span>
        <span class="block text-xs text-slate-400 mt-0.5">年度汇总</span>
      </div>
    </div>

    <!-- 租金 / 欠费 -->
    <div class="grid grid-cols-2 gap-2">
      <StatCard label="租金收入" :value="`${totalZone.rent}万`" statusDot="green" />
      <StatCard label="欠费笔数" :value="`${arrearsCount} 笔`" statusDot="red" />
    </div>

    <!-- 绿色低碳推进 -->
    <div class="bg-[#0d2a63]/30 rounded border border-cyan-500/10 p-1.5">
      <div class="text-xs text-cyan-300 font-bold mb-1.5 font-sans">🌱 绿色低碳推进</div>
      <div v-for="t in targetRows" :key="t.name" class="mb-1.5 last:mb-0">
        <div class="flex justify-between text-xs text-slate-300 mb-0.5">
          <span>{{ t.name }}</span>
          <span class="font-mono text-emerald-400">{{ t.current }}% / 目标 {{ t.target }}%</span>
        </div>
        <ProgressBar :percentage="t.percent" colorScheme="emerald" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StatCard from '../../shared/StatCard.vue'
import ProgressBar from '../../shared/ProgressBar.vue'
import { zoneRevenues, arrearsRecords } from '../../../data/financials'
import { energyTargets } from '../../../data/energy'

withDefaults(defineProps<{
  isLargeScreen?: boolean
}>(), {
  isLargeScreen: true
})

const totalZone = computed(() => zoneRevenues.find(z => z.zone === 'total')!)
const arrearsCount = computed(() => arrearsRecords.length)

const targetRows = computed(() =>
  energyTargets.map(t => ({
    name: t.name,
    current: t.current,
    target: t.target,
    percent: Math.round((t.current / t.target) * 100)
  }))
)
</script>