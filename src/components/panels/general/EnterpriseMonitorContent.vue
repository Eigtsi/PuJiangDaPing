<template>
  <div :class="['flex flex-col flex-grow gap-2', isLargeScreen ? '' : 'gap-3']">
    <!-- Row 1: 废气排放 + 废水排放 -->
    <div class="grid grid-cols-2 gap-2">
      <!-- 废气排放 -->
      <div :class="['rounded border bg-[#071942]/65 hover:border-cyan-400/50 transition', isLargeScreen ? 'p-2 border-cyan-500/25' : 'p-3 border-cyan-500/25']">
        <div class="flex justify-between items-center mb-1.5">
          <span :class="['font-bold text-cyan-100', isLargeScreen ? 'text-xs' : 'text-base']">废气排放</span>
          <span :class="['w-2 h-2 rounded-full animate-pulse', exhaustAbnormal > 0 ? 'bg-rose-500 shadow-[0_0_6px_#ef4444]' : 'bg-emerald-500']" />
        </div>
        <div class="flex items-baseline gap-1 mb-1">
          <span :class="['font-black font-mono text-cyan-300 digital-glow', isLargeScreen ? 'text-xl' : 'text-3xl']">{{ exhaustTotal }}</span>
          <span :class="['text-slate-400', isLargeScreen ? 'text-[10px]' : 'text-xs']">监测点</span>
        </div>
        <!-- Progress bar -->
        <div class="w-full h-1.5 bg-[#0a1e4a] rounded-full overflow-hidden mb-1.5">
          <div class="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all" :style="{ width: exhaustTotal > 0 ? (exhaustNormal / exhaustTotal * 100) + '%' : '100%' }" />
        </div>
        <div class="flex justify-between" :class="[isLargeScreen ? 'text-[10px]' : 'text-xs']">
          <span class="text-slate-300">正常 <span class="text-emerald-400 font-bold font-mono">{{ exhaustNormal }}</span></span>
          <span class="text-slate-300">异常 <span :class="['font-bold font-mono', exhaustAbnormal > 0 ? 'text-rose-400' : 'text-slate-400']">{{ exhaustAbnormal }}</span></span>
        </div>
      </div>

      <!-- 废水排放 -->
      <div :class="['rounded border bg-[#071942]/65 hover:border-cyan-400/50 transition', isLargeScreen ? 'p-2 border-cyan-500/25' : 'p-3 border-cyan-500/25']">
        <div class="flex justify-between items-center mb-1.5">
          <span :class="['font-bold text-cyan-100', isLargeScreen ? 'text-xs' : 'text-base']">废水排放</span>
          <span :class="['w-2 h-2 rounded-full animate-pulse', waterAbnormal > 0 ? 'bg-rose-500 shadow-[0_0_6px_#ef4444]' : 'bg-emerald-500']" />
        </div>
        <div class="flex items-baseline gap-1 mb-1">
          <span :class="['font-black font-mono text-cyan-300 digital-glow', isLargeScreen ? 'text-xl' : 'text-3xl']">{{ waterTotal }}</span>
          <span :class="['text-slate-400', isLargeScreen ? 'text-[10px]' : 'text-xs']">监测点</span>
        </div>
        <div class="w-full h-1.5 bg-[#0a1e4a] rounded-full overflow-hidden mb-1.5">
          <div class="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all" :style="{ width: waterTotal > 0 ? (waterNormal / waterTotal * 100) + '%' : '100%' }" />
        </div>
        <div class="flex justify-between" :class="[isLargeScreen ? 'text-[10px]' : 'text-xs']">
          <span class="text-slate-300">正常 <span class="text-emerald-400 font-bold font-mono">{{ waterNormal }}</span></span>
          <span class="text-slate-300">异常 <span :class="['font-bold font-mono', waterAbnormal > 0 ? 'text-rose-400' : 'text-slate-400']">{{ waterAbnormal }}</span></span>
        </div>
      </div>
    </div>

    <!-- Row 2: 用电监控 + 固危监控 -->
    <div class="grid grid-cols-2 gap-2">
      <!-- 用电监控 -->
      <div :class="['rounded border bg-[#071942]/65 hover:border-cyan-400/50 transition', isLargeScreen ? 'p-2 border-cyan-500/25' : 'p-3 border-cyan-500/25']">
        <div class="flex justify-between items-center mb-1.5">
          <span :class="['font-bold text-cyan-100', isLargeScreen ? 'text-xs' : 'text-base']">用电监控</span>
          <span class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
        </div>
        <div class="flex items-baseline gap-1 mb-1">
          <span :class="['font-black font-mono text-cyan-300 digital-glow', isLargeScreen ? 'text-xl' : 'text-3xl']">{{ enterpriseCount }}</span>
          <span :class="['text-slate-400', isLargeScreen ? 'text-[10px]' : 'text-xs']">企业</span>
        </div>
        <div class="w-full h-1.5 bg-[#0a1e4a] rounded-full overflow-hidden mb-1.5">
          <div class="h-full bg-gradient-to-r from-emerald-500 to-yellow-400 rounded-full transition-all" :style="{ width: (enterpriseNormal / enterpriseCount * 100) + '%' }" />
        </div>
        <div class="flex justify-between" :class="[isLargeScreen ? 'text-[10px]' : 'text-xs']">
          <span class="text-slate-300">正常 <span class="text-emerald-400 font-bold font-mono">{{ enterpriseNormal }}</span></span>
          <span class="text-slate-300">轻载 <span class="text-yellow-400 font-bold font-mono">{{ enterpriseLight }}</span></span>
        </div>
      </div>

      <!-- 固危监控 -->
      <div :class="['rounded border bg-[#071942]/65 hover:border-cyan-400/50 transition', isLargeScreen ? 'p-2 border-cyan-500/25' : 'p-3 border-cyan-500/25']">
        <div class="flex justify-between items-center mb-1.5">
          <span :class="['font-bold text-cyan-100', isLargeScreen ? 'text-xs' : 'text-base']">固危监控</span>
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div class="flex items-baseline gap-1 mb-1">
          <span :class="['font-black font-mono text-cyan-300 digital-glow', isLargeScreen ? 'text-xl' : 'text-3xl']">{{ solidTotal }}</span>
          <span :class="['text-slate-400', isLargeScreen ? 'text-[10px]' : 'text-xs']">监测点</span>
        </div>
        <div class="w-full h-1.5 bg-[#0a1e4a] rounded-full overflow-hidden mb-1.5">
          <div class="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style="width: 100%" />
        </div>
        <div class="flex justify-between" :class="[isLargeScreen ? 'text-[10px]' : 'text-xs']">
          <span class="text-slate-300">正常 <span class="text-emerald-400 font-bold font-mono">{{ solidNormal }}</span></span>
          <span class="text-slate-300">对接 <span class="text-cyan-400 font-bold">100%</span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { monitoringPoints } from '../../../data/monitoringPoints'

withDefaults(defineProps<{
  isLargeScreen?: boolean
}>(), {
  isLargeScreen: true
})

// 废气排放: air stations + VOC + odor
const airStationPoints = computed(() => monitoringPoints.filter(p => p.type === 'air_station'))
const vocPoints = computed(() => monitoringPoints.filter(p => p.type === 'voc'))
const odorPoints = computed(() => monitoringPoints.filter(p => p.type === 'odor'))

const exhaustTotal = computed(() => airStationPoints.value.length + vocPoints.value.length + odorPoints.value.length)
const exhaustNormal = computed(() => [...airStationPoints.value, ...vocPoints.value, ...odorPoints.value].filter(p => p.status === 'normal').length)
const exhaustAbnormal = computed(() => exhaustTotal.value - exhaustNormal.value)

// 用电监控
const enterpriseCount = 36
const enterpriseNormal = 33
const enterpriseLight = 3

// 废水排放: discharge_outlet + fluoride_pool + rain_outlet
const waterPoints = computed(() => monitoringPoints.filter(p => ['discharge_outlet', 'fluoride_pool', 'rain_outlet'].includes(p.type)))
const waterTotal = computed(() => waterPoints.value.length)
const waterNormal = computed(() => waterPoints.value.filter(p => p.status === 'normal').length)
const waterAbnormal = computed(() => waterTotal.value - waterNormal.value)

// 固危监控
const solidTotal = 5
const solidNormal = 5
</script>
