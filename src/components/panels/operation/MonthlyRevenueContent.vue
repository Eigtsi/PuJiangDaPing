<template>
  <div :class="[isLargeScreen ? 'space-y-1.5' : 'space-y-3']">
    <!-- 年度营收 -->
    <div class="flex justify-between items-center bg-[#0d2a63]/30 rounded p-1.5 px-2">
      <div>
        <span class="text-xs text-slate-350 block mb-0.5 font-bold">年度营收总额</span>
        <div class="flex items-baseline gap-1.5">
          <span :class="[isLargeScreen ? 'text-2xl' : 'text-3xl', 'font-black font-mono text-cyan-300 digital-glow']">{{ totalYear }}万</span>
        </div>
      </div>
      <span class="text-xs text-emerald-400 font-bold font-sans">12 个月趋势</span>
    </div>

    <!-- 月度收入构成堆叠柱状图 -->
    <div class="bg-[#06183d]/45 border border-cyan-500/10 rounded overflow-hidden">
      <div class="p-1 px-2 text-sm text-[#cbd5e1] border-b border-cyan-500/10 font-bold">📊 月度收入构成</div>
      <TechBarChart :xData="barLabels" :series="barSeries" :height="120" :stacked="true" :showLegend="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TechBarChart from '../../charts/TechBarChart.vue'
import { monthlyRevenues, zoneRevenues } from '../../../data/financials'

withDefaults(defineProps<{
  isLargeScreen?: boolean
}>(), {
  isLargeScreen: true
})

const totalYear = computed(() => zoneRevenues.find(z => z.zone === 'total')?.total || 0)

const barLabels = computed(() => monthlyRevenues.map(m => m.month.replace('2025-', '') + '月'))

const barSeries = computed(() => [
  { name: '租金', data: monthlyRevenues.map(m => m.rent), color: '#06b6d4' },
  { name: '物业', data: monthlyRevenues.map(m => m.property), color: '#10b981' },
  { name: '水电', data: monthlyRevenues.map(m => m.utility), color: '#f59e0b' },
  { name: '其他', data: monthlyRevenues.map(m => m.solidWaste + m.parking), color: '#8b5cf6' }
])
</script>