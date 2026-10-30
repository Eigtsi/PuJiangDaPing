<template>
  <div :class="[isLargeScreen ? 'flex-1 flex flex-col justify-between gap-1 min-h-0' : 'space-y-4']">
    <!-- Energy KPI row -->
    <div :class="['grid grid-cols-3 gap-1.5', isLargeScreen ? 'mb-1.5' : 'mb-3']">
      <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10 text-center', isLargeScreen ? 'p-0.5 py-1' : 'p-2.5']">
        <span class="block text-[8px] text-slate-400 mb-0.5 scale-90">总用电量</span>
        <span :class="['font-mono text-cyan-300 font-black', isLargeScreen ? 'text-[11px]' : 'text-sm md:text-base']">{{ fmtNum(currentMonthEnergy.totalElectricity) }} kWh</span>
      </div>
      <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10 text-center', isLargeScreen ? 'p-0.5 py-1' : 'p-2.5']">
        <span class="block text-[8px] text-slate-400 mb-0.5 scale-90">总用水量</span>
        <span :class="['font-mono text-sky-400 font-black', isLargeScreen ? 'text-[11px]' : 'text-sm md:text-base']">{{ fmtNum(currentMonthEnergy.totalWater) }} 吨</span>
      </div>
      <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10 text-center', isLargeScreen ? 'p-0.5 py-1' : 'p-2.5']">
        <span class="block text-[8px] text-slate-400 mb-0.5 scale-90">月环比</span>
        <span :class="['font-mono font-black', currentMonthEnergy.monthOnMonthChange >= 0 ? 'text-rose-400' : 'text-emerald-400', isLargeScreen ? 'text-[11px]' : 'text-sm md:text-base']">{{ currentMonthEnergy.monthOnMonthChange >= 0 ? '+' : '' }}{{ currentMonthEnergy.monthOnMonthChange }}%</span>
      </div>
    </div>

    <!-- Electricity Source Split -->
    <div :class="[isLargeScreen ? 'mb-1.5' : 'mb-3']">
      <div class="flex items-center justify-between mb-0.5 text-xs text-amber-300 font-bold">
        <span class="flex items-center gap-1 text-[11px]">⚡ 用电来源构成</span>
      </div>
      <div :class="['flex items-center gap-2', isLargeScreen ? '' : 'gap-4']">
        <!-- Left: Pie chart + legend -->
        <div class="flex items-center gap-1.5 flex-shrink-0">
          <div :class="[isLargeScreen ? 'w-16 h-16' : 'w-28 h-28']">
            <TechPieChart :data="pieData" :height="isLargeScreen ? 64 : 112" innerRadius="50%" outerRadius="80%" :showLabel="false" />
          </div>
          <div :class="['flex flex-col gap-0.5', isLargeScreen ? 'text-[9px]' : 'text-xs']">
            <div v-for="s in electricitySourceSplit" :key="s.source" class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :style="{ backgroundColor: s.color }" />
              <span class="text-slate-300">{{ s.source }}</span>
              <span class="font-mono font-black" :style="{ color: s.color }">{{ s.percentage }}%</span>
            </div>
          </div>
        </div>
        <!-- Right: Stacked bar chart - monthly electricity trend -->
        <div :class="[isLargeScreen ? 'flex-1 h-20' : 'flex-1 h-32']">
          <TechBarChart
            :xData="barXData"
            :series="barSeries"
            :height="isLargeScreen ? 80 : 128"
            :stacked="true"
            :showLegend="true"
          />
        </div>
      </div>
    </div>

    <!-- Water Intake -->
    <div>
      <div class="flex items-center justify-between mb-0.5 text-xs text-cyan-300 font-bold">
        <span class="flex items-center gap-1 text-[11px]">🔹 用水设计与能效</span>
        <span class="text-slate-350 font-semibold text-[9px]">回用率: 38%</span>
      </div>
      <div class="grid grid-cols-3 gap-1.5">
        <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10 text-center', isLargeScreen ? 'p-0.5 py-1' : 'p-2.5']">
          <span class="block text-[8px] text-slate-400 mb-0.5 scale-90">工业用水</span>
          <span :class="['font-mono text-cyan-300 font-black', isLargeScreen ? 'text-[11px]' : 'text-sm md:text-base']">3000 吨</span>
        </div>
        <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10 text-center', isLargeScreen ? 'p-0.5 py-1' : 'p-2.5']">
          <span class="block text-[8px] text-slate-400 mb-0.5 scale-90">生活用水</span>
          <span :class="['font-mono text-sky-400 font-black', isLargeScreen ? 'text-[11px]' : 'text-sm md:text-base']">10000 吨</span>
        </div>
        <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10 text-center', isLargeScreen ? 'p-0.5 py-1' : 'p-2.5']">
          <span class="block text-[8px] text-slate-400 mb-0.5 scale-90">低品回收</span>
          <span :class="['font-mono text-emerald-400 font-black', isLargeScreen ? 'text-[11px]' : 'text-sm md:text-base']">5000 吨</span>
        </div>
      </div>
      <div :class="['w-full bg-[#06183d] rounded-full mt-1 overflow-hidden border border-cyan-500/10', isLargeScreen ? 'h-1.5' : 'h-2.5']">
        <div :class="['bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full', isLargeScreen ? 'h-1.5' : 'h-2.5']" style="width: 38%" />
      </div>
      <div :class="[isLargeScreen ? 'hidden' : '', 'text-[9px] text-[#cbd5e1] leading-relaxed mt-1.5 bg-cyan-950/20 px-1.5 py-1 rounded']">
        ※ 采用金华浦江支流回收再生水，高效节约常规工业水耗。
      </div>
    </div>

    <!-- Outflow -->
    <div>
      <div class="flex items-center justify-between mb-0.5 text-xs text-rose-300 font-bold">
        <span class="flex items-center gap-1 text-[11px]">🔸 排水设计及回收</span>
        <span class="text-slate-350 font-semibold text-[9px]">当前排水率: 40%</span>
      </div>
      <div class="grid grid-cols-3 gap-1.5">
        <div :class="['bg-[#4a1c29]/30 rounded border border-rose-500/10 text-center', isLargeScreen ? 'p-0.5 py-1' : 'p-2.5']">
          <span class="block text-[8px] text-slate-400 mb-0.5 scale-90">排水总量</span>
          <span :class="['font-mono text-rose-300 font-black', isLargeScreen ? 'text-[11px]' : 'text-sm md:text-base']">8000 吨</span>
        </div>
        <div :class="['bg-[#4a1c29]/30 rounded border border-rose-500/10 text-center', isLargeScreen ? 'p-0.5 py-1' : 'p-2.5']">
          <span class="block text-[8px] text-slate-400 mb-0.5 scale-90">排水温度</span>
          <span :class="['font-mono text-orange-300 font-black', isLargeScreen ? 'text-[11px]' : 'text-sm md:text-base']">28 ℃</span>
        </div>
        <div :class="['bg-[#4a1c29]/30 rounded border border-rose-500/10 text-center', isLargeScreen ? 'p-0.5 py-1' : 'p-2.5']">
          <span class="block text-[8px] text-slate-400 mb-0.5 scale-90">净化率</span>
          <span :class="['font-mono text-emerald-400 font-black', isLargeScreen ? 'text-[11px]' : 'text-sm md:text-base']">100%</span>
        </div>
      </div>
      <div :class="['w-full bg-[#06183d] rounded-full mt-1 overflow-hidden border border-rose-500/10', isLargeScreen ? 'h-1.5' : 'h-2.5']">
        <div :class="['bg-gradient-to-r from-rose-400 to-orange-400 rounded-full', isLargeScreen ? 'h-1.5' : 'h-2.5']" style="width: 40%" />
      </div>
      <div :class="[isLargeScreen ? 'hidden' : '', 'text-[9px] text-[#ffa3a3] leading-relaxed mt-1.5 bg-rose-950/20 px-1.5 py-1 rounded']">
        ※ 废水经多级 physical 沉淀及中水回收系统过滤后接轨入网。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TechBarChart from '../../charts/TechBarChart.vue'
import TechPieChart from '../../charts/TechPieChart.vue'
import { currentMonthEnergy, electricitySourceSplit, energyMonthly } from '../../../data/energy'

withDefaults(defineProps<{
  isLargeScreen?: boolean
}>(), {
  isLargeScreen: true
})

const pieData = computed(() =>
  electricitySourceSplit.map(s => ({ name: s.source, value: s.percentage, color: s.color }))
)

// Last 6 months electricity source stacked bar chart
const last6 = energyMonthly.slice(-6)
const barXData = last6.map(m => m.month.slice(5) + '月')
const barSeries = computed(() => [
  { name: '市政用电', data: last6.map(m => Math.round(m.electricity.municipal / 1000)), color: '#0ea5e9' },
  { name: '光伏发电', data: last6.map(m => Math.round(m.electricity.solar / 1000)), color: '#facc15' },
  { name: '储能放电', data: last6.map(m => Math.round(m.electricity.storage / 1000)), color: '#22c55e' },
])

function fmtNum(n: number): string {
  return String(n)
}
</script>
