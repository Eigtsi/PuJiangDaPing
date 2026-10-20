<template>
  <div :class="[isLargeScreen ? 'space-y-1.5' : 'space-y-3']">
    <!-- 数据更新时间（每小时更新） -->
    <div class="flex items-center justify-between text-[11px] text-slate-400">
      <span>数据每小时更新</span>
      <span class="font-mono text-cyan-300">更新时间 {{ updateTime }}</span>
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
        v-for="ind in profile.water.indicators"
        :key="ind.name"
        :class="['rounded bg-cyan-950/20 border border-cyan-500/10 flex justify-between items-center', isLargeScreen ? 'px-2 py-0.5' : 'px-2.5 py-1']"
      >
        <span :class="['font-bold text-slate-200', isLargeScreen ? 'text-xs' : 'text-sm']">{{ ind.name }}</span>
        <span :class="['font-mono font-black', isLargeScreen ? 'text-base' : 'text-lg', levelColor(ind.level)]">
          {{ ind.value }}<span v-if="ind.unit" :class="['text-slate-300 ml-1', isLargeScreen ? 'text-xs' : 'text-sm']">{{ ind.unit }}</span>
        </span>
      </div>
      <div :class="['rounded bg-cyan-950/20 border border-cyan-500/10 flex justify-between items-center', isLargeScreen ? 'px-2 py-0.5' : 'px-2.5 py-1']">
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

const now = ref(new Date())
let clockTimer: number | undefined

onMounted(() => {
  // 仅在整点刷新更新时间
  clockTimer = window.setInterval(() => {
    const next = new Date()
    if (next.getHours() !== now.value.getHours()) {
      now.value = next
    }
  }, 1000)
})

onUnmounted(() => {
  if (clockTimer) window.clearInterval(clockTimer)
})

const updateTime = computed(() => {
  const d = now.value
  return `${String(d.getHours()).padStart(2, '0')}:00`
})

function levelColor(level: IndicatorLevel): string {
  if (level === 'red') return 'text-rose-400'
  if (level === 'yellow') return 'text-amber-300'
  return 'text-cyan-300'
}
</script>
