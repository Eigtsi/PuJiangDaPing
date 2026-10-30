<template>
  <div :class="[isLargeScreen ? 'space-y-1.5' : 'space-y-3']">
    <div class="flex items-center justify-between">
      <div class="flex items-center rounded border border-cyan-500/30 p-0.5 shrink-0">
        <button type="button" @click="setGranularity('month')" :class="['px-2 py-0.5 rounded-sm text-xs font-medium transition cursor-pointer', granularity === 'month' ? 'bg-cyan-500/25 text-cyan-300' : 'text-slate-400 hover:text-slate-200']">月</button>
        <button type="button" @click="setGranularity('year')" :class="['px-2 py-0.5 rounded-sm text-xs font-medium transition cursor-pointer', granularity === 'year' ? 'bg-cyan-500/25 text-cyan-300' : 'text-slate-400 hover:text-slate-200']">年</button>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="text-xs text-slate-300 whitespace-nowrap shrink-0">{{ granularity === 'month' ? '统计月份' : '统计年度' }}</span>
        <el-select v-model="selectedPeriod" size="small" class="custom-el-select shrink-0" popper-class="custom-el-select-popper">
          <el-option v-for="opt in periodOptions" :key="opt.key" :label="opt.label" :value="opt.key" />
        </el-select>
      </div>
    </div>

    <div
      @click="emit('toast', `当前展示 ${profile.label} 园区停车费收入与车位使用概况...`)"
      :class="['flex justify-between items-center bg-[#0d2a63]/30 rounded cursor-pointer hover:border-cyan-400 transition', isLargeScreen ? 'p-1.5 px-2' : 'p-2.5']"
    >
      <div>
        <span class="block mb-1 text-xs font-bold text-slate-300 tracking-wide">{{ granularity === 'month' ? '本月停车费收入' : '年停车费收入' }}</span>
        <div class="flex items-baseline gap-1.5">
          <span :class="[isLargeScreen ? 'text-2xl' : 'text-3xl', 'font-mono font-black text-cyan-300 digital-glow tabular-nums tracking-tight']">{{ parkingRevenue }}</span>
          <span class="text-xs text-slate-400 font-mono font-medium">万元</span>
        </div>
      </div>
      <div class="text-right text-xs text-slate-400 font-medium font-sans">
        <span>收缴率</span>
        <span class="ml-1 font-mono font-black text-emerald-400 digital-glow-green text-base tabular-nums">{{ collectionRate }}%</span>
        <span class="block mt-1 text-xs text-slate-500 tracking-wider">{{ granularity === 'month' ? currentMonthLabel : profile.label }}</span>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-1.5 text-center">
      <div class="bg-[#051330]/40 rounded p-1.5 border border-cyan-500/10">
        <span class="block text-xs text-slate-400 font-semibold tracking-wide">规划车位</span>
        <span :class="[isLargeScreen ? 'text-lg' : 'text-xl', 'block mt-1 font-mono font-black text-cyan-300 tabular-nums']">{{ totalSpaces }}<span class="ml-0.5 text-xs text-slate-400 font-sans font-medium">个</span></span>
      </div>
      <div class="bg-[#051330]/40 rounded p-1.5 border border-cyan-500/10">
        <span class="block text-xs text-slate-400 font-semibold tracking-wide">已占用车位</span>
        <span :class="[isLargeScreen ? 'text-lg' : 'text-xl', 'block mt-1 font-mono font-black text-cyan-300 tabular-nums']">{{ occupiedSpaces }}<span class="ml-0.5 text-xs text-slate-400 font-sans font-medium">个</span></span>
      </div>
      <div class="bg-[#051330]/40 rounded p-1.5 border border-cyan-500/10">
        <span class="block text-xs text-slate-400 font-semibold tracking-wide">平均占用率</span>
        <span :class="[isLargeScreen ? 'text-lg' : 'text-xl', 'block mt-1 font-mono font-black text-emerald-400 tabular-nums']">{{ occupancyRate }}<span class="ml-0.5 text-xs text-slate-400 font-sans font-medium">%</span></span>
      </div>
    </div>

    <div class="flex items-center gap-1.5 mb-1">
      <span class="w-[3px] h-3.5 rounded-full bg-cyan-400/80"></span>
      <span class="text-sm text-slate-300 font-semibold tracking-wide">{{ chartTitle }}</span>
    </div>
    <TechLineChart v-if="granularity === 'month'" :xData="chartXData" :series="parkingTrendSeries" :height="72" :yMin="yAxis.min" :yMax="yAxis.max" :yInterval="yAxis.interval" />
    <TechBarChart v-else :xData="chartXData" :series="parkingBarSeries" :height="72" :yMin="yAxis.min" :yInterval="yAxis.interval" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import TechLineChart from '../../charts/TechLineChart.vue'
import TechBarChart from '../../charts/TechBarChart.vue'
import { yearFinancialProfiles, yearOptions, type FiscalYear } from '../../../data/financials'

defineProps<{
  isLargeScreen?: boolean
}>()

const emit = defineEmits<{
  (e: 'toast', msg: string): void
}>()

const granularity = ref<'month' | 'year'>('month')
const selectedYear = ref<FiscalYear>('2025')
const selectedMonth = ref('5')

const profile = computed(() => yearFinancialProfiles[selectedYear.value])

// 月份选项：基于当前年份的 12 个月停车费
const monthOptions = computed(() =>
  profile.value.monthlyParking.map((_, i) => ({
    key: String(i),
    label: `${selectedYear.value}年${i + 1}月`
  }))
)

const periodOptions = computed(() => (granularity.value === 'month' ? monthOptions.value : yearOptions))
const selectedPeriod = computed({
  get: () => (granularity.value === 'month' ? selectedMonth.value : selectedYear.value),
  set: (v: string) => {
    if (granularity.value === 'month') selectedMonth.value = v
    else selectedYear.value = v as FiscalYear
  }
})

function setGranularity(g: 'month' | 'year') {
  granularity.value = g
}

// 停车费为全园合计口径（车位/占用率为模拟数据，数据源暂未提供停车场容量明细）
const totalParking = computed(() => profile.value.zones.find(z => z.zone === 'total')!.parking)
const collectionRate = computed(() => profile.value.zones.find(z => z.zone === 'total')!.collectionRate)
const totalSpaces = computed(() => profile.value.parking.totalSpaces)
const occupiedSpaces = computed(() => profile.value.parking.occupiedSpaces)
const occupancyRate = computed(() => ((occupiedSpaces.value / totalSpaces.value) * 100).toFixed(1))

// 本月停车费收入（万元）/ 年停车费收入
const monthParking = computed(() => profile.value.monthlyParking[Number(selectedMonth.value)] ?? 0)
const parkingRevenue = computed(() => granularity.value === 'month' ? monthParking.value : totalParking.value)
const currentMonthLabel = computed(() => `${selectedYear.value}年${Number(selectedMonth.value) + 1}月`)

const monthLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

// 年度趋势：跨年度停车费收入（万元）
const yearTrendLabels = computed(() => yearOptions.map(o => o.label))
const yearTrendData = computed(() => yearOptions.map(o =>
  yearFinancialProfiles[o.key].zones.find(z => z.zone === 'total')!.parking
))

const chartTitle = computed(() => granularity.value === 'month' ? '停车费月度趋势' : '停车费年度对比')
const chartXData = computed(() => granularity.value === 'month' ? monthLabels : yearTrendLabels.value)
const parkingTrendSeries = computed(() => [{
  name: '停车费',
  data: granularity.value === 'month' ? profile.value.monthlyParking : yearTrendData.value,
  color: '#f59e0b'
}])

// 年度对比（柱状图）：逐柱配色，区分不同年份
const parkingBarSeries = computed(() => [{
  name: '停车费',
  data: yearTrendData.value,
  colors: ['#f59e0b', '#06b6d4', '#10b981']
}])

// Y 轴刻度：月度/年度量级不同，控制刻度线密度
const yAxis = computed(() => granularity.value === 'month'
  ? { min: 0, max: 5, interval: 2.5 }
  : { min: 0, max: 50, interval: 25 }
)
</script>
