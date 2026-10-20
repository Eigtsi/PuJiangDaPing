<template>
  <div :class="[isLargeScreen ? 'space-y-1.5' : 'space-y-3']">
    <div :class="['flex justify-between items-center bg-[#0d2a63]/30 rounded', isLargeScreen ? 'p-1.5 px-2' : 'p-2.5']">
      <div>
        <span class="text-xs text-slate-350 block mb-0.5 font-bold">年累计营收总额</span>
        <div class="flex items-baseline gap-1.5">
          <span :class="[isLargeScreen ? 'text-2xl' : 'text-3xl', 'font-black font-mono text-cyan-300 digital-glow']">{{ totalZone.zone === 'total' ? totalZone.total + '万' : '' }}</span>
        </div>
      </div>
      <div class="text-right text-xs text-slate-350 font-medium font-sans">
        <span>综合收缴率: </span>
        <span class="text-emerald-400 font-extrabold font-mono text-sm">{{ totalZone.collectionRate }}%</span>
        <span class="block text-xs text-slate-400 mt-0.5">年度汇总</span>
      </div>
    </div>
    <div class="bg-[#051330]/40 rounded p-1.5 border border-cyan-500/10 text-xs font-sans space-y-1.5">
      <div class="flex justify-between border-b border-cyan-500/10 pb-1 text-slate-400 font-bold">
        <span>分区板块</span>
        <span class="text-center">收缴率</span>
        <span class="text-right">年度营收</span>
      </div>
      <div v-for="z in zoneRows" :key="z.zone" class="flex justify-between text-slate-200">
        <span>{{ z.zoneLabel }}</span>
        <span class="text-center font-mono font-bold" :class="z.collectionRate >= 99 ? 'text-emerald-400' : 'text-cyan-300'">{{ z.collectionRate }}%</span>
        <span class="text-right font-mono text-cyan-300">{{ z.total }}万</span>
      </div>
      <div class="flex justify-between text-slate-200 border-t border-cyan-500/10 pt-1 mt-1">
        <span class="font-bold text-amber-300">年度合计</span>
        <span class="text-center font-mono text-amber-300 font-bold">{{ totalZone.collectionRate }}%</span>
        <span class="text-right font-mono text-amber-300 font-bold">{{ totalZone.total }}万</span>
      </div>
    </div>
    <TechBarChart
      :xData="barLabels"
      :series="barSeries"
      :height="96"
      :stacked="true"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TechBarChart from '../../charts/TechBarChart.vue'
import { zoneRevenues, monthlyRevenues } from '../../../data/financials'

defineProps<{
  isLargeScreen?: boolean
}>()

const emit = defineEmits<{
  (e: 'toast', msg: string): void
}>()

const zoneLabelMap: Record<string, string> = { east: '东区', center: '中区', west: '西区' }

const zoneRows = computed(() =>
  zoneRevenues.filter(z => z.zone !== 'total').map(z => ({
    ...z,
    zoneLabel: zoneLabelMap[z.zone] || z.zone
  }))
)

const totalZone = computed(() => zoneRevenues.find(z => z.zone === 'total')!)

const barLabels = computed(() => monthlyRevenues.map(m => m.month.replace('2025-', '') + '月'))

const barSeries = computed(() => [
  { name: '租金', data: monthlyRevenues.map(m => m.rent), color: '#06b6d4' },
  { name: '物业', data: monthlyRevenues.map(m => m.property), color: '#10b981' },
  { name: '水电', data: monthlyRevenues.map(m => m.utility), color: '#f59e0b' },
  { name: '其他', data: monthlyRevenues.map(m => m.solidWaste + m.parking), color: '#8b5cf6' }
])
</script>
