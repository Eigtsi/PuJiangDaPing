<template>
  <div :class="[isLargeScreen ? 'space-y-2' : 'space-y-3.5']">
    <!-- 时间筛选（仅到月份） -->
    <div class="flex items-center justify-between">
      <span class="text-xs text-slate-300 whitespace-nowrap shrink-0">统计月份</span>
      <el-select v-model="selectedMonth" size="small" class="custom-el-select shrink-0" popper-class="custom-el-select-popper">
        <el-option v-for="m in monthOptions" :key="m.key" :label="m.label" :value="m.key" />
      </el-select>
    </div>

    <!-- KPI 3 项 -->
    <div class="grid grid-cols-3 gap-1.5">
      <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10 text-center', isLargeScreen ? 'p-1.5 py-2' : 'p-2.5']">
        <span :class="['block mb-0.5 font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">应收总额</span>
        <span :class="['block font-mono text-cyan-300 font-black', isLargeScreen ? 'text-lg' : 'text-xl']">{{ d.receivable }} <span :class="['text-slate-300', isLargeScreen ? 'text-xs' : 'text-sm']">万元</span></span>
      </div>
      <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10 text-center', isLargeScreen ? 'p-1.5 py-2' : 'p-2.5']">
        <span :class="['block mb-0.5 font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">实收总额</span>
        <span :class="['block font-mono text-sky-400 font-black', isLargeScreen ? 'text-lg' : 'text-xl']">{{ d.received }} <span :class="['text-slate-300', isLargeScreen ? 'text-xs' : 'text-sm']">万元</span></span>
      </div>
      <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10 text-center', isLargeScreen ? 'p-1.5 py-2' : 'p-2.5']">
        <span :class="['block mb-0.5 font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">收缴率</span>
        <span :class="['block font-mono text-emerald-400 font-black', isLargeScreen ? 'text-lg' : 'text-xl']">{{ d.collectionRate }}%</span>
      </div>
    </div>

    <!-- 用气结构 -->
    <div :class="[isLargeScreen ? '' : 'mt-1']">
      <div class="flex items-center justify-between mb-1 text-amber-300 font-bold">
        <span :class="[isLargeScreen ? 'text-sm' : 'text-base']">🔥 用气结构</span>
        <span :class="['text-slate-300 font-semibold', isLargeScreen ? 'text-xs' : 'text-sm']">月用气量 {{ d.monthUsage }} 万m³</span>
      </div>
      <div class="flex items-center gap-[52px]">
        <div :class="[isLargeScreen ? 'w-24 h-24' : 'w-28 h-28', 'flex-shrink-0']">
          <TechPieChart :data="splitData" :height="isLargeScreen ? 96 : 112" innerRadius="50%" outerRadius="80%" :showLabel="false" />
        </div>
        <div :class="['flex-1 flex flex-col gap-1 min-w-0', isLargeScreen ? 'text-xs' : 'text-sm']">
          <div v-for="s in splitData" :key="s.name" class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full flex-shrink-0" :style="{ backgroundColor: s.color }" />
            <span class="text-slate-200 whitespace-nowrap">{{ s.name }}</span>
            <span class="ml-auto font-mono font-black flex-shrink-0" :style="{ color: s.color }">{{ s.value }}万m³</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 用气构成（日间/夜间） -->
    <div :class="['bg-[#0b2152]/50 rounded border border-cyan-500/10', isLargeScreen ? 'p-2' : 'p-2.5']">
      <div class="mb-1">
        <span :class="['font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">用气构成</span>
      </div>
      <div class="grid grid-cols-2 gap-x-3 gap-y-1">
        <div :class="['flex items-center gap-1.5', isLargeScreen ? 'text-xs' : 'text-sm']">
          <span class="text-slate-300 whitespace-nowrap">日间用气量</span>
          <span class="ml-auto font-mono text-cyan-300 font-black">{{ dayUsage }} <span class="text-slate-300">万m³</span></span>
        </div>
        <div :class="['flex items-center gap-1.5', isLargeScreen ? 'text-xs' : 'text-sm']">
          <span class="text-slate-300 whitespace-nowrap">夜间用气量</span>
          <span class="ml-auto font-mono text-indigo-300 font-black">{{ nightUsage }} <span class="text-slate-300">万m³</span></span>
        </div>
        <div :class="['flex items-center gap-1.5', isLargeScreen ? 'text-xs' : 'text-sm']">
          <span class="text-slate-300 whitespace-nowrap">日单价</span>
          <span class="ml-auto font-mono text-amber-300 font-black">{{ p.gas.dayPrice }} <span class="text-slate-300">元/m³</span></span>
        </div>
        <div :class="['flex items-center gap-1.5', isLargeScreen ? 'text-xs' : 'text-sm']">
          <span class="text-slate-300 whitespace-nowrap">夜单价</span>
          <span class="ml-auto font-mono text-amber-300 font-black">{{ p.gas.nightPrice }} <span class="text-slate-300">元/m³</span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import TechPieChart from '../../charts/TechPieChart.vue'
import { parkProfiles, monthOptions, type ParkKey } from '../../../data/parkMonitor'

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

const selectedMonth = ref(monthOptions[monthOptions.length - 1].key)
const monthFactor = computed(() => monthOptions.find(m => m.key === selectedMonth.value)?.factor ?? 1)

const d = computed(() => {
  const g = p.value.gas
  const f = monthFactor.value
  return {
    receivable: +(g.receivable * f).toFixed(1),
    received: +(g.received * f).toFixed(1),
    collectionRate: g.collectionRate,
    monthUsage: Math.round(g.monthUsage * f),
  }
})

const dayUsage = computed(() => {
  const v = d.value.monthUsage * p.value.gas.dayRatio / 100
  return Math.round(v * 10) / 10
})
const nightUsage = computed(() => {
  const v = d.value.monthUsage * (100 - p.value.gas.dayRatio) / 100
  return Math.round(v * 10) / 10
})

const splitData = computed(() => [
  { name: '日间', value: dayUsage.value, color: '#0ea5e9' },
  { name: '夜间', value: nightUsage.value, color: '#6366f1' }
])
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
