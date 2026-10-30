<template>
  <div class="flex min-h-full flex-col justify-between" :class="[isLargeScreen ? 'gap-2' : 'gap-3.5']">
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
        <span :class="['block mb-0.5 font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">{{ granularity === 'month' ? '本月用水量' : '本年用水量' }}</span>
        <span :class="['block font-mono text-cyan-300 font-black', isLargeScreen ? 'text-lg' : 'text-xl']">{{ fmtNum(d.monthUsage) }} <span :class="['text-slate-300', isLargeScreen ? 'text-xs' : 'text-sm']">吨</span></span>
      </div>
      <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10 text-center', isLargeScreen ? 'p-1.5 py-2' : 'p-2.5']">
        <span :class="['block mb-0.5 font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">应收金额</span>
        <span :class="['block font-mono text-sky-400 font-black', isLargeScreen ? 'text-lg' : 'text-xl']">{{ d.receivable }} <span :class="['text-slate-300', isLargeScreen ? 'text-xs' : 'text-sm']">万元</span></span>
      </div>
      <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10 text-center', isLargeScreen ? 'p-1.5 py-2' : 'p-2.5']">
        <span :class="['block mb-0.5 font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">收缴率</span>
        <span :class="['block font-mono text-emerald-400 font-black', isLargeScreen ? 'text-lg' : 'text-xl']">{{ d.collectionRate }}%</span>
      </div>
    </div>

    <!-- 水源构成 -->
    <div :class="[isLargeScreen ? '' : 'mt-1']">
      <div class="flex items-center justify-between mb-1 text-cyan-300 font-bold">
        <span :class="[isLargeScreen ? 'text-sm' : 'text-base']">🔹 水费构成</span>
      </div>
      <div class="flex items-center gap-[52px]">
        <div :class="[isLargeScreen ? 'w-24 h-24' : 'w-28 h-28', 'flex-shrink-0']">
          <TechPieChart :data="pieData" :height="isLargeScreen ? 96 : 112" innerRadius="50%" outerRadius="80%" :showLabel="false" />
        </div>
        <div :class="['flex-1 flex flex-col gap-1 min-w-0', isLargeScreen ? 'text-xs' : 'text-sm']">
          <div v-for="s in sourceSplit" :key="s.name" class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full flex-shrink-0" :style="{ backgroundColor: s.color }" />
            <span class="text-slate-200 whitespace-nowrap">{{ s.name }}</span>
            <span class="ml-auto font-mono font-black flex-shrink-0" :style="{ color: s.color }">{{ s.amount }}万元</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 用水量构成（仅展开详情展示，吨） -->
    <div v-if="!isLargeScreen" class="rounded border border-cyan-500/15 bg-[#0b2152]/40 p-3">
      <div class="mb-2 flex items-center justify-between">
        <span class="text-sm font-bold text-slate-200">用水量构成</span>
        <span class="font-mono text-xs text-cyan-300">合计 <span class="text-sm font-black">{{ fmtNum(volumeTotal) }}</span> 吨</span>
      </div>
      <div class="mb-3 flex h-2.5 w-full overflow-hidden rounded-full">
        <div
          v-for="v in volumeSplit"
          :key="v.name"
          class="h-full"
          :style="{ width: volumeTotal ? `${(v.value / volumeTotal) * 100}%` : '0%', backgroundColor: v.color }"
        />
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div
          v-for="v in volumeSplit"
          :key="v.name"
          class="flex flex-col items-center gap-1 rounded border border-cyan-500/10 bg-cyan-950/25 py-2"
        >
          <span class="flex items-center gap-1.5 text-xs text-slate-300">
            <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: v.color }"></span>
            <span class="whitespace-nowrap">{{ v.name }}</span>
          </span>
          <span class="font-mono text-base font-black" :style="{ color: v.color }">
            {{ fmtNum(v.value) }} <span class="text-xs font-normal text-slate-300">吨</span>
          </span>
        </div>
      </div>
    </div>

    <!-- 基础水价构成（六类） -->
    <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10', isLargeScreen ? 'p-2' : 'p-2.5']">
      <div class="mb-1">
        <span :class="['font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">基础水价构成（元/吨）</span>
      </div>
      <div class="grid grid-cols-2 gap-x-3 gap-y-0.5">
        <div v-for="s in p.waterUsage.sourceSplit" :key="s.name" :class="['flex items-center gap-1.5', isLargeScreen ? 'text-xs' : 'text-sm']">
          <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :style="{ backgroundColor: s.color }" />
          <span class="text-slate-300 whitespace-nowrap">{{ s.name }}</span>
          <span class="ml-auto font-mono text-cyan-300 font-black">{{ s.price?.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import TechPieChart from '../../charts/TechPieChart.vue'
import { parkProfiles, monthOptions, yearOptions, type ParkKey } from '../../../data/parkMonitor'

withDefaults(defineProps<{
  isLargeScreen?: boolean
}>(), {
  isLargeScreen: true
})

defineEmits<{
  (e: 'toast', msg: string): void
}>()

const store = useStore()
const activePark = computed(() => store.state.activePark as ParkKey)
const p = computed(() => parkProfiles[activePark.value])

const granularity = ref<'month' | 'year'>('month')
const selectedPeriod = ref(monthOptions[monthOptions.length - 1].key)

const periodOptions = computed(() => (granularity.value === 'month' ? monthOptions : yearOptions))
const factor = computed(() => periodOptions.value.find(o => o.key === selectedPeriod.value)?.factor ?? 1)

function setGranularity(g: 'month' | 'year') {
  granularity.value = g
  const opts = g === 'month' ? monthOptions : yearOptions
  selectedPeriod.value = opts[opts.length - 1].key
}

const d = computed(() => {
  const w = p.value.waterUsage
  const f = factor.value
  return {
    monthUsage: Math.round(w.monthUsage * f),
    receivable: +(w.receivable * f).toFixed(1),
    collectionRate: w.collectionRate,
  }
})

// 各类水费构成金额（万元）= 应收金额 × 构成占比
const sourceSplit = computed(() =>
  p.value.waterUsage.sourceSplit.map(s => ({
    ...s,
    amount: +(d.value.receivable * s.value / 100).toFixed(2),
  }))
)

const pieData = computed(() =>
  sourceSplit.value.map(s => ({ name: s.name, value: s.amount, color: s.color }))
)

// 用水量构成（吨）＝ 基准用量 × 时间筛选倍数（仅展开详情展示）
const volumeSplit = computed(() =>
  p.value.waterUsage.volumeSplit.map(v => ({
    ...v,
    value: Math.round(v.value * factor.value),
  }))
)

const volumeTotal = computed(() => volumeSplit.value.reduce((sum, v) => sum + v.value, 0))

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
