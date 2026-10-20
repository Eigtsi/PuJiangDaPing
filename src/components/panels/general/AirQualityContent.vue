<template>
  <div :class="[isLargeScreen ? 'space-y-1.5' : 'space-y-3.5']">
    <!-- Top stats row -->
    <div :class="['flex justify-between items-center bg-[#0d2a63]/30 rounded', isLargeScreen ? 'p-1.5 px-2' : 'p-2.5']">
      <div>
        <span class="text-xs text-slate-350 block mb-0.5 font-bold">空气质量指数 AQI</span>
        <div class="flex items-baseline gap-1.5">
          <span :class="[isLargeScreen ? 'text-2xl' : 'text-4xl', 'font-black font-mono text-cyan-300 digital-glow']">{{ kpi.airQualityIndex }}</span>
          <span class="text-xs bg-emerald-950/85 px-1.5 py-0.5 rounded font-bold" :class="kpi.airQualityLevel === '优' ? 'text-emerald-300' : 'text-amber-300'">{{ kpi.airQualityLevel }}</span>
        </div>
      </div>
      <div class="text-right text-xs text-slate-350 font-medium font-sans">
        <span>主控因子: </span>
        <span class="text-cyan-300 font-extrabold font-mono text-xs">PM2.5</span>
        <span class="block text-xs text-emerald-400 font-bold mt-0.5">当前符合标准</span>
      </div>
    </div>

    <!-- ECharts Chart -->
    <div class="relative bg-[#06183d]/45 border border-cyan-500/10 rounded overflow-hidden">
      <div class="p-1 px-2 flex justify-between items-center text-sm text-[#cbd5e1] border-b border-cyan-500/10 font-bold">
        <span>📊 水晶大楼近7日AQI趋势 (ECharts)</span>
        <span class="text-cyan-400">时段自研</span>
      </div>
      <TechLineChart
        :xData="['周一','周二','周三','周四','周五','周六','周日']"
        :series="[{ name: 'AQI', data: [35,42,38,50,41,38,36] }]"
        :height="150"
        :yMin="20"
        :yMax="60"
      />
    </div>

    <!-- Bottom parameters grid -->
    <div :class="['grid grid-cols-2', isLargeScreen ? 'gap-1.5' : 'gap-2.5', 'font-sans']">
      <div :class="['rounded bg-cyan-950/20 border border-cyan-500/10 flex justify-between items-center', isLargeScreen ? 'p-1 px-2' : 'p-1.5 px-3']">
        <span class="text-xs text-slate-400 font-bold">PM2.5:</span>
        <span class="text-xs font-mono font-bold text-cyan-300">23 µg/m³</span>
      </div>
      <div :class="['rounded bg-cyan-950/20 border border-cyan-500/10 flex justify-between items-center', isLargeScreen ? 'p-1 px-2' : 'p-1.5 px-3']">
        <span class="text-xs text-slate-400 font-bold">PM10:</span>
        <span class="text-xs font-mono font-bold text-cyan-300">38 µg/m³</span>
      </div>
      <div :class="['rounded bg-cyan-950/20 border border-cyan-500/10 flex justify-between items-center', isLargeScreen ? 'p-1 px-2' : 'p-1.5 px-3']">
        <span class="text-xs text-slate-400 font-bold">SO2:</span>
        <span class="text-xs font-mono font-bold text-[#2dd4bf]">20 µg/m³</span>
      </div>
      <div :class="['rounded bg-cyan-950/20 border border-cyan-500/10 flex justify-between items-center', isLargeScreen ? 'p-1 px-2' : 'p-1.5 px-3']">
        <span class="text-xs text-slate-400 font-bold">NOx:</span>
        <span class="text-xs font-mono font-bold text-[#2dd4bf]">45 µg/m³</span>
      </div>
    </div>

    <!-- Compliance Summary Row -->
    <div :class="['grid grid-cols-3 gap-1.5', isLargeScreen ? '' : 'mt-1']">
      <div :class="['rounded bg-emerald-950/20 border border-emerald-500/10 text-center', isLargeScreen ? 'p-1 py-0.5' : 'p-2']">
        <span class="block text-[11px] text-slate-400 mb-0.5 font-bold">氟化物达标率</span>
        <span :class="['font-mono font-black text-emerald-400', isLargeScreen ? 'text-sm' : 'text-base']">{{ kpi.fluorideComplianceRate }}%</span>
      </div>
      <div :class="['rounded bg-emerald-950/20 border border-emerald-500/10 text-center', isLargeScreen ? 'p-1 py-0.5' : 'p-2']">
        <span class="block text-[11px] text-slate-400 mb-0.5 font-bold">废水达标率</span>
        <span :class="['font-mono font-black text-emerald-400', isLargeScreen ? 'text-sm' : 'text-base']">{{ kpi.wastewaterComplianceRate }}%</span>
      </div>
      <div :class="['rounded bg-rose-950/20 border border-rose-500/10 text-center', isLargeScreen ? 'p-1 py-0.5' : 'p-2']">
        <span class="block text-[11px] text-slate-400 mb-0.5 font-bold">未闭环预警</span>
        <span :class="['font-mono font-black text-rose-400', isLargeScreen ? 'text-[11px]' : 'text-sm']">{{ unresolvedCount }} 条</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TechLineChart from '../../charts/TechLineChart.vue'
import { environmentalKPI, alertEvents } from '../../../data/environmental'

withDefaults(defineProps<{
  isLargeScreen?: boolean
}>(), {
  isLargeScreen: true
})

const kpi = computed(() => environmentalKPI)

const unresolvedCount = computed(() =>
  alertEvents.filter(e => e.status !== '已闭环').length
)
</script>
