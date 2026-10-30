<template>
  <div :class="[isLargeScreen ? 'space-y-1.5' : 'space-y-3']">
    <!-- 数据更新时间（实时 / 历史均值切换） -->
    <div class="flex items-center justify-between">
      <div class="flex items-center rounded border border-cyan-500/30 p-0.5 shrink-0">
        <button type="button" @click="mode = 'realtime'" :class="['px-2 py-0.5 rounded-sm text-xs font-medium transition cursor-pointer', mode === 'realtime' ? 'bg-cyan-500/25 text-cyan-300' : 'text-slate-400 hover:text-slate-200']">实时数据</button>
        <button type="button" @click="mode = 'avg'" :class="['px-2 py-0.5 rounded-sm text-xs font-medium transition cursor-pointer', mode === 'avg' ? 'bg-cyan-500/25 text-cyan-300' : 'text-slate-400 hover:text-slate-200']">历史均值</button>
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <span v-if="mode === 'realtime'" class="font-mono text-cyan-300 text-[11px]">更新时间 {{ updateTime }}</span>
        <el-select v-else v-model="avgGranularity" size="small" class="custom-el-select shrink-0" popper-class="custom-el-select-popper">
          <el-option label="日均值" value="day" />
          <el-option label="月均值" value="month" />
          <el-option label="年均值" value="year" />
        </el-select>
      </div>
    </div>

    <!-- KPI 头部 -->
    <div :class="['flex justify-between items-center bg-[#0d2a63]/30 rounded', isLargeScreen ? 'p-1.5 px-2' : 'p-2.5']">
      <div>
        <span :class="['block mb-0.5 font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">水环境综合达标率</span>
        <div class="flex items-baseline gap-1.5">
          <span :class="[isLargeScreen ? 'text-xl' : 'text-2xl', 'font-black font-mono text-cyan-300 digital-glow']">{{ profile.water.complianceRate }}</span>
          <span :class="['text-slate-300', isLargeScreen ? 'text-xs' : 'text-sm']">%</span>
        </div>
      </div>
      <div :class="['text-right font-medium text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">
        <span class="block">超标预警 <span class="text-rose-400 font-extrabold font-mono">{{ profile.water.alertCount }}</span> 次</span>
        <span class="block mt-1">风险因子 <span class="text-amber-300 font-bold">{{ profile.water.riskFactor }}</span></span>
      </div>
    </div>

    <!-- 监测指标 2 列 -->
    <div :class="['grid grid-cols-2', isLargeScreen ? 'gap-1' : 'gap-2']">
      <div
        v-for="ind in displayIndicators"
        :key="ind.name"
        :class="['rounded bg-cyan-950/20 border border-cyan-500/10 flex justify-between items-center', isLargeScreen ? 'px-2 py-0.5' : 'px-2.5 py-1']"
      >
        <span :class="['font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">{{ ind.name }}</span>
        <span :class="['font-mono font-black', isLargeScreen ? 'text-base' : 'text-lg', levelColor(ind.level)]">
          {{ ind.value }}<span v-if="ind.unit" :class="['text-slate-300 ml-1', isLargeScreen ? 'text-xs' : 'text-sm']">{{ ind.unit }}</span>
        </span>
      </div>
      <div v-if="profile.water.outletCount > 0" :class="['rounded bg-cyan-950/20 border border-cyan-500/10 flex justify-between items-center', isLargeScreen ? 'px-2 py-0.5' : 'px-2.5 py-1']">
        <span :class="['font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">排污口</span>
        <span :class="['font-mono font-black text-cyan-300', isLargeScreen ? 'text-base' : 'text-lg']">{{ profile.water.outletCount }} 个</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { parkProfiles, type ParkKey, type IndicatorLevel } from '../../../data/parkMonitor'

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
const profile = computed(() => parkProfiles[activePark.value])

// 显示模式：实时数据 / 历史均值
const mode = ref<'realtime' | 'avg'>('realtime')
const avgGranularity = ref<'day' | 'month' | 'year'>('day')

const avgFactor = computed(() => {
  if (avgGranularity.value === 'day') return 0.98
  if (avgGranularity.value === 'month') return 0.93
  return 0.88
})

// 实时值：整点采集，基准值附近小幅波动（引用 collectTick，仅跨整点时刷新一次）
const collectTick = ref(0)
function liveValue(base: number): number {
  const mag = Math.abs(base)
  const jitter = (Math.random() - 0.5) * Math.max(mag * 0.06, 0.05)
  const v = base + jitter
  if (Number.isInteger(base)) return Math.round(v)
  const decimals = (String(base).split('.')[1] || '').length
  return Number(v.toFixed(Math.min(decimals, 2)))
}

// 历史均值：实时值 × 均值系数，保留 1 位小数
const displayIndicators = computed(() => {
  void collectTick.value
  return profile.value.water.indicators.map(ind => ({
    ...ind,
    value: mode.value === 'realtime' ? liveValue(ind.value) : Math.round(ind.value * avgFactor.value * 10) / 10
  }))
})

const now = ref(new Date())
let lastHour = new Date().getHours()
let clockTimer: number | undefined

onMounted(() => {
  clockTimer = window.setInterval(() => {
    const d = new Date()
    now.value = d
    // 跨整点时触发一次新采集
    if (d.getHours() !== lastHour) {
      lastHour = d.getHours()
      collectTick.value++
    }
  }, 1000)
})

onUnmounted(() => {
  if (clockTimer) window.clearInterval(clockTimer)
})

const updateTime = computed(() => {
  const hh = String(now.value.getHours()).padStart(2, '0')
  return `${hh}:00:00`
})

function levelColor(level: IndicatorLevel): string {
  if (level === 'red') return 'text-rose-400'
  if (level === 'yellow') return 'text-amber-300'
  return 'text-cyan-300'
}
</script>

<style scoped>
:deep(.custom-el-select) {
  width: 84px !important;
}
:deep(.custom-el-select .el-select__wrapper) {
  background-color: #0b2152 !important;
  border: 1px solid rgba(6, 182, 212, 0.35) !important;
  box-shadow: none !important;
  color: #22d3ee !important;
  border-radius: 4px;
  height: 24px !important;
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
