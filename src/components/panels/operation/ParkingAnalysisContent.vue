<template>
  <div :class="[isLargeScreen ? 'space-y-1.5' : 'space-y-3']">
    <div class="flex items-center justify-between">
      <span class="text-xs text-slate-300 font-semibold tracking-wide">统计年度</span>
      <el-select v-model="selectedYear" size="small" class="custom-el-select shrink-0" popper-class="custom-el-select-popper">
        <el-option v-for="y in yearOptions" :key="y.key" :label="y.label" :value="y.key" />
      </el-select>
    </div>

    <div
      @click="emit('toast', `当前展示 ${profile.label} 园区停车费收入与车位使用概况...`)"
      :class="['flex justify-between items-center bg-[#0d2a63]/30 rounded cursor-pointer hover:border-cyan-400 transition', isLargeScreen ? 'p-1.5 px-2' : 'p-2.5']"
    >
      <div>
        <span class="block mb-1 text-xs font-bold text-slate-300 tracking-wide">年停车费收入</span>
        <div class="flex items-baseline gap-1.5">
          <span :class="[isLargeScreen ? 'text-2xl' : 'text-3xl', 'font-mono font-black text-cyan-300 digital-glow tabular-nums tracking-tight']">{{ totalParking }}</span>
          <span class="text-xs text-slate-400 font-mono font-medium">万元</span>
        </div>
      </div>
      <div class="text-right text-xs text-slate-400 font-medium font-sans">
        <span>收缴率</span>
        <span class="ml-1 font-mono font-black text-emerald-400 digital-glow-green text-base tabular-nums">{{ collectionRate }}%</span>
        <span class="block mt-1 text-xs text-slate-500 tracking-wider">{{ profile.label }}</span>
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
      <span class="text-sm text-slate-300 font-semibold tracking-wide">停车费月度趋势</span>
    </div>
    <TechLineChart :xData="monthLabels" :series="parkingTrendSeries" :height="72" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import TechLineChart from '../../charts/TechLineChart.vue'
import { yearFinancialProfiles, yearOptions, type FiscalYear } from '../../../data/financials'

defineProps<{
  isLargeScreen?: boolean
}>()

const emit = defineEmits<{
  (e: 'toast', msg: string): void
}>()

const selectedYear = ref<FiscalYear>('2025')
const profile = computed(() => yearFinancialProfiles[selectedYear.value])

// 停车费为全园合计口径（车位/占用率为模拟数据，数据源暂未提供停车场容量明细）
const totalParking = computed(() => profile.value.zones.find(z => z.zone === 'total')!.parking)
const collectionRate = computed(() => profile.value.zones.find(z => z.zone === 'total')!.collectionRate)
const totalSpaces = computed(() => profile.value.parking.totalSpaces)
const occupiedSpaces = computed(() => profile.value.parking.occupiedSpaces)
const occupancyRate = computed(() => ((occupiedSpaces.value / totalSpaces.value) * 100).toFixed(1))

const monthLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
const parkingTrendSeries = computed(() => [{
  name: '停车费',
  data: profile.value.monthlyParking,
  color: '#f59e0b'
}])
</script>
