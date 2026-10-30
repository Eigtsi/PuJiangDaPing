<template>
  <div :class="[isLargeScreen ? 'space-y-2' : 'space-y-3.5']">
    <!-- 时间筛选（月/年切换） -->
    <div class="flex items-center justify-between">
      <div class="flex items-center rounded border border-cyan-500/30 p-0.5 shrink-0">
        <button type="button" @click="setGranularity('month')" :class="['px-2 py-0.5 rounded-sm text-xs font-medium transition cursor-pointer', granularity === 'month' ? 'bg-cyan-500/25 text-cyan-300' : 'text-slate-400 hover:text-slate-200']">月</button>
        <button type="button" @click="setGranularity('year')" :class="['px-2 py-0.5 rounded-sm text-xs font-medium transition cursor-pointer', granularity === 'year' ? 'bg-cyan-500/25 text-cyan-300' : 'text-slate-400 hover:text-slate-200']">年</button>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="text-xs text-slate-300 whitespace-nowrap shrink-0">{{ granularity === 'month' ? '统计月份' : '统计年份' }}</span>
        <el-select v-model="selectedPeriod" size="small" class="custom-el-select shrink-0" popper-class="custom-el-select-popper">
          <el-option v-for="opt in periodOptions" :key="opt.key" :label="opt.label" :value="opt.key" />
        </el-select>
      </div>
    </div>

    <!-- KPI 3 项 -->
    <div class="grid grid-cols-3 gap-1.5">
      <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10 text-center', isLargeScreen ? 'p-1.5 py-2' : 'p-2.5']">
        <span :class="['block mb-0.5 font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">{{ granularity === 'month' ? '储能放电量' : '年储能放电量' }}</span>
        <span :class="['block font-mono text-emerald-400 font-black', isLargeScreen ? 'text-lg' : 'text-xl']">{{ fmtNum(storageKwh) }} <span :class="['text-slate-300', isLargeScreen ? 'text-xs' : 'text-sm']">kWh</span></span>
      </div>
      <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10 text-center', isLargeScreen ? 'p-1.5 py-2' : 'p-2.5']">
        <span :class="['block mb-0.5 font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">储能充电量</span>
        <span :class="['block font-mono text-yellow-300 font-black', isLargeScreen ? 'text-lg' : 'text-xl']">{{ fmtNum(chargeKwh) }} <span :class="['text-slate-300', isLargeScreen ? 'text-xs' : 'text-sm']">kWh</span></span>
      </div>
      <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10 text-center', isLargeScreen ? 'p-1.5 py-2' : 'p-2.5']">
        <span :class="['block mb-0.5 font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">充放电效率</span>
        <span :class="['block font-mono text-cyan-300 font-black', isLargeScreen ? 'text-lg' : 'text-xl']">{{ storageOverview.roundTripEfficiency }}<span :class="['text-slate-300', isLargeScreen ? 'text-xs' : 'text-sm']">%</span></span>
      </div>
    </div>

    <!-- 储能充放电趋势 / 年度对比 -->
    <div class="flex items-center gap-1.5 mb-1">
      <span class="w-[3px] h-3.5 rounded-full bg-emerald-400/80"></span>
      <span :class="['text-slate-300 font-semibold tracking-wide', isLargeScreen ? 'text-sm' : 'text-base']">{{ granularity === 'month' ? '储能充放电趋势' : '年度储能充放电量对比' }}</span>
    </div>
    <TechLineChart v-if="granularity === 'month'" :xData="trendX" :series="trendSeries" :height="isLargeScreen ? 100 : 160" y-name="万kWh" :show-legend="true" />
    <TechBarChart v-else :xData="trendX" :series="trendSeries" :height="isLargeScreen ? 100 : 160" y-name="万kWh" :y-min="0" :y-interval="50" :show-legend="true" />

    <!-- 储能系统概况 -->
    <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10', isLargeScreen ? 'p-2' : 'p-2.5']">
      <div class="mb-1">
        <span :class="['font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">储能系统概况</span>
      </div>
      <div class="grid grid-cols-2 gap-x-3 gap-y-0.5">
        <div :class="['flex items-center gap-1.5', isLargeScreen ? 'text-xs' : 'text-sm']">
          <span class="text-slate-300 whitespace-nowrap">储能容量</span>
          <span class="ml-auto font-mono text-emerald-400 font-black">{{ storageOverview.capacity }} <span class="text-slate-300">kWh</span></span>
        </div>
        <div :class="['flex items-center gap-1.5', isLargeScreen ? 'text-xs' : 'text-sm']">
          <span class="text-slate-300 whitespace-nowrap">综合效率</span>
          <span class="ml-auto font-mono text-cyan-300 font-black">{{ storageOverview.roundTripEfficiency }}%</span>
        </div>
        <div :class="['flex items-center gap-1.5', isLargeScreen ? 'text-xs' : 'text-sm']">
          <span class="text-slate-300 whitespace-nowrap">日均充放</span>
          <span class="ml-auto font-mono text-cyan-300 font-black">{{ storageOverview.dailyCycles }} <span class="text-slate-300">次</span></span>
        </div>
        <div :class="['flex items-center gap-1.5', isLargeScreen ? 'text-xs' : 'text-sm']">
          <span class="text-slate-300 whitespace-nowrap">峰谷价差</span>
          <span class="ml-auto font-mono text-amber-300 font-black">{{ storageOverview.peakValleyPrice.toFixed(1) }} <span class="text-slate-300">元/kWh</span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TechLineChart from '../../charts/TechLineChart.vue'
import TechBarChart from '../../charts/TechBarChart.vue'
import { energyMonthly, storageOverview, energyYearOptions } from '../../../data/energy'

withDefaults(defineProps<{
  isLargeScreen?: boolean
}>(), {
  isLargeScreen: true
})

defineEmits<{
  (e: 'toast', msg: string): void
}>()

// 月份选项（2025-01 ~ 2025-12，label 带年份）
const monthOptions = energyMonthly.map(m => {
  const [year, month] = m.month.split('-')
  return { key: m.month, label: `${year}年${parseInt(month, 10)}月` }
})

const granularity = ref<'month' | 'year'>('month')
const selectedMonth = ref('2025-06')
const selectedYear = ref('2025')

const periodOptions = computed(() => (granularity.value === 'month' ? monthOptions : energyYearOptions))
const selectedPeriod = computed({
  get: () => (granularity.value === 'month' ? selectedMonth.value : selectedYear.value),
  set: (v: string) => {
    if (granularity.value === 'month') selectedMonth.value = v
    else selectedYear.value = v
  }
})

function setGranularity(g: 'month' | 'year') {
  granularity.value = g
  if (g === 'year') selectedYear.value = '2025'
}

const current = computed(() => energyMonthly.find(m => m.month === selectedMonth.value) ?? energyMonthly[5])
const annualStorage = computed(() => energyMonthly.reduce((sum, m) => sum + m.electricity.storage, 0))
const yearFactor = computed(() => energyYearOptions.find(o => o.key === selectedYear.value)?.factor ?? 1)

const storageKwh = computed(() =>
  granularity.value === 'month' ? current.value.electricity.storage : Math.round(annualStorage.value * yearFactor.value)
)
// 储能充电量（充入，kWh）= 放电量 ÷ 效率 × 100（因损耗，充入更多）
const chargeKwh = computed(() => Math.round(storageKwh.value / storageOverview.roundTripEfficiency * 100))

const trendX = computed(() =>
  granularity.value === 'month'
    ? energyMonthly.map(m => `${parseInt(m.month.slice(5), 10)}月`)
    : energyYearOptions.map(o => o.label)
)
const toWan = (kwh: number) => +(kwh / 10000).toFixed(2)
const trendSeries = computed(() => {
  if (granularity.value === 'year') {
    return [
      { name: '储能放电量', data: energyYearOptions.map(o => toWan(annualStorage.value * o.factor)), color: '#22c55e' },
      { name: '储能充电量', data: energyYearOptions.map(o => toWan(annualStorage.value * o.factor / storageOverview.roundTripEfficiency * 100)), color: '#facc15' },
    ]
  }
  // 两条线：储能放电量（放出）/ 储能充电量（充入 = 放电量 ÷ 效率，因损耗充入更多），单位 万kWh
  return [
    { name: '储能放电量', data: energyMonthly.map(m => toWan(m.electricity.storage)), color: '#22c55e' },
    { name: '储能充电量', data: energyMonthly.map(m => toWan(m.electricity.storage / storageOverview.roundTripEfficiency * 100)), color: '#facc15' },
  ]
})

function fmtNum(n: number): string {
  return String(n)
}
</script>

<style scoped>
:deep(.custom-el-select) {
  width: 120px !important;
}
:deep(.custom-el-select .el-select__wrapper) {
  background-color: #0b2152 !important;
  border: 1px solid rgba(6, 182, 212, 0.35) !important;
  box-shadow: none !important;
  color: #22d3ee !important;
  border-radius: 4px;
  height: 28px !important;
}
:deep(.custom-el-select .el-select__placeholder) {
  color: #22d3ee !important;
  font-family: monospace;
  font-size: 11px;
}
:deep(.custom-el-select .el-select__caret) {
  color: #22d3ee !important;
}
:deep(.custom-el-select .el-select__selected-item) {
  color: #22d3ee !important;
  font-family: monospace;
  font-size: 11px;
}
</style>
