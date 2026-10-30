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
        <span :class="['block mb-0.5 font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">{{ granularity === 'month' ? '光伏发电量' : '年光伏发电量' }}</span>
        <span :class="['block font-mono text-yellow-300 font-black', isLargeScreen ? 'text-lg' : 'text-xl']">{{ fmtNum(solarKwh) }} <span :class="['text-slate-300', isLargeScreen ? 'text-xs' : 'text-sm']">kWh</span></span>
      </div>
      <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10 text-center', isLargeScreen ? 'p-1.5 py-2' : 'p-2.5']">
        <span :class="['block mb-0.5 font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">光伏用电电量</span>
        <span :class="['block font-mono text-cyan-300 font-black', isLargeScreen ? 'text-lg' : 'text-xl']">{{ fmtNum(selfUseKwh) }} <span :class="['text-slate-300', isLargeScreen ? 'text-xs' : 'text-sm']">kWh</span></span>
      </div>
      <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10 text-center', isLargeScreen ? 'p-1.5 py-2' : 'p-2.5']">
        <span :class="['block mb-0.5 font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">CO₂减排量</span>
        <span :class="['block font-mono text-emerald-400 font-black', isLargeScreen ? 'text-lg' : 'text-xl']">{{ co2 }} <span :class="['text-slate-300', isLargeScreen ? 'text-xs' : 'text-sm']">吨</span></span>
      </div>
    </div>

    <!-- 光伏发电量趋势 / 年度对比 -->
    <div class="flex items-center gap-1.5 mb-1">
      <span class="w-[3px] h-3.5 rounded-full bg-yellow-400/80"></span>
      <span :class="['text-slate-300 font-semibold tracking-wide', isLargeScreen ? 'text-sm' : 'text-base']">{{ granularity === 'month' ? '光伏发用电趋势' : '年度光伏发用电量对比' }}</span>
    </div>
    <TechLineChart v-if="granularity === 'month'" :xData="trendX" :series="trendSeries" :height="isLargeScreen ? 100 : 160" y-name="万kWh" :y-min="0" :y-interval="5" :show-legend="true" />
    <TechBarChart v-else :xData="trendX" :series="trendSeries" :height="isLargeScreen ? 100 : 160" :show-legend="true" y-name="万kWh" :y-min="0" :y-interval="50" />

    <!-- 光伏电站概况 -->
    <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10', isLargeScreen ? 'p-2' : 'p-2.5']">
      <div class="mb-1">
        <span :class="['font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">光伏电站概况</span>
      </div>
      <div class="grid grid-cols-2 gap-x-3 gap-y-0.5">
        <div :class="['flex items-center gap-1.5', isLargeScreen ? 'text-xs' : 'text-sm']">
          <span class="text-slate-300 whitespace-nowrap">装机容量</span>
          <span class="ml-auto font-mono text-yellow-300 font-black">{{ solarOverview.capacity }} <span class="text-slate-300">kWp</span></span>
        </div>
        <div :class="['flex items-center gap-1.5', isLargeScreen ? 'text-xs' : 'text-sm']">
          <span class="text-slate-300 whitespace-nowrap">自发自用率</span>
          <span class="ml-auto font-mono text-cyan-300 font-black">{{ solarOverview.selfUseRate }}%</span>
        </div>
        <div :class="['flex items-center gap-1.5', isLargeScreen ? 'text-xs' : 'text-sm']">
          <span class="text-slate-300 whitespace-nowrap">年发电量</span>
          <span class="ml-auto font-mono text-yellow-300 font-black">{{ (annualOutput / 10000).toFixed(1) }} <span class="text-slate-300">万kWh</span></span>
        </div>
        <div :class="['flex items-center gap-1.5', isLargeScreen ? 'text-xs' : 'text-sm']">
          <span class="text-slate-300 whitespace-nowrap">余电上网电价</span>
          <span class="ml-auto font-mono text-amber-300 font-black">{{ solarOverview.gridPrice.toFixed(2) }} <span class="text-slate-300">元/kWh</span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TechLineChart from '../../charts/TechLineChart.vue'
import TechBarChart from '../../charts/TechBarChart.vue'
import { energyMonthly, solarOverview, energyYearOptions } from '../../../data/energy'

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
  // 切到年时默认选中数据基准年份 2025
  if (g === 'year') selectedYear.value = '2025'
}

const current = computed(() => energyMonthly.find(m => m.month === selectedMonth.value) ?? energyMonthly[5])
const annualSolar = computed(() => energyMonthly.reduce((sum, m) => sum + m.electricity.solar, 0))
const yearFactor = computed(() => energyYearOptions.find(o => o.key === selectedYear.value)?.factor ?? 1)

const solarKwh = computed(() =>
  granularity.value === 'month' ? current.value.electricity.solar : Math.round(annualSolar.value * yearFactor.value)
)
// 光伏用电电量（自发自用电量，kWh）= 光伏发电量 × 自发自用率
const selfUseKwh = computed(() => Math.round(solarKwh.value * solarOverview.selfUseRate / 100))
// CO₂减排量（吨）= 发电量(kWh) × 度电碳减排(kg) / 1000
const co2 = computed(() => +(solarKwh.value * solarOverview.co2Factor / 1000).toFixed(1))

// 趋势图仅展示到当前已有月份（如现在是10月，就只到10月；年度对比仍按全年12个月基准）
const visibleMonths = computed(() => {
  const currentMonth = new Date().getMonth() + 1
  return energyMonthly.slice(0, Math.min(currentMonth, 12))
})

const trendX = computed(() =>
  granularity.value === 'month'
    ? visibleMonths.value.map(m => `${parseInt(m.month.slice(5), 10)}月`)
    : energyYearOptions.map(o => o.label)
)
// 曲线两条：光伏发电量 / 光伏用电量（自发自用），单位 万kWh
const toWan = (kwh: number) => +(kwh / 10000).toFixed(2)
const trendSeries = computed(() => {
  if (granularity.value === 'year') {
    return [
      { name: '光伏发电量', data: energyYearOptions.map(o => toWan(annualSolar.value * o.factor)), color: '#facc15' },
      { name: '光伏用电量', data: energyYearOptions.map(o => toWan(annualSolar.value * o.factor * solarOverview.selfUseRate / 100)), color: '#22d3ee' },
    ]
  }
  return [
    { name: '光伏发电量', data: visibleMonths.value.map(m => toWan(m.electricity.solar)), color: '#facc15' },
    { name: '光伏用电量', data: visibleMonths.value.map(m => toWan(m.electricity.solar * solarOverview.selfUseRate / 100)), color: '#22d3ee' },
  ]
})

// 电站概况中的「年发电量」固定展示 2025 实际基准
const annualOutput = computed(() => annualSolar.value)

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
