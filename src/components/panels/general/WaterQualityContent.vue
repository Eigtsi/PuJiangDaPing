<template>
  <div :class="['font-sans', isLargeScreen ? 'space-y-2' : 'space-y-4']">
    <!-- River selector tabs -->
    <div class="grid grid-cols-2 gap-1.5 text-center">
      <button
        @click="$emit('setWaterRiver', 'tongcungang')"
        :class="['rounded border cursor-pointer transition',
          isLargeScreen ? 'p-1.5 text-xs font-bold' : 'p-2.5 text-sm md:text-base font-bold',
          activeWaterRiver === 'tongcungang'
            ? 'bg-gradient-to-r from-blue-900/60 to-cyan-900/60 text-cyan-300 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)] font-black'
            : 'bg-[#0b2152]/40 text-slate-400 border-cyan-500/10']"
      >
        汤村港 III类
      </button>
      <button
        @click="$emit('setWaterRiver', 'xinjinghe')"
        :class="['rounded border cursor-pointer transition',
          isLargeScreen ? 'p-1.5 text-xs font-bold' : 'p-2.5 text-sm md:text-base font-bold',
          activeWaterRiver === 'xinjinghe'
            ? 'bg-gradient-to-r from-blue-900/60 to-cyan-900/60 text-cyan-300 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)] font-black'
            : 'bg-[#0b2152]/40 text-slate-400 border-cyan-500/10']"
      >
        新泾河 III类
      </button>
    </div>

    <!-- Monitoring status overview -->
    <div :class="['font-mono text-slate-300', isLargeScreen ? 'space-y-1' : 'space-y-2.5']">
      <div :class="['bg-[#051330] rounded border border-cyan-500/10 flex justify-between items-center bg-opacity-70', isLargeScreen ? 'p-1.5 px-2' : 'p-2.5 px-3.5']">
        <span class="text-slate-200 font-bold font-sans text-xs">管道水质监测</span>
        <div class="space-x-1.5 text-right text-[11px]">
          <span class="text-cyan-300">总 {{ pipePoints.length }}</span>
          <span class="text-emerald-400">在 {{ pipeOnline }}</span>
          <span class="text-orange-400">离 {{ pipePoints.length - pipeOnline }}</span>
          <span class="text-rose-450 font-bold">警 {{ pipeWarning }}</span>
        </div>
      </div>
      <div :class="['bg-[#051330] rounded border border-cyan-500/10 flex justify-between items-center bg-opacity-70', isLargeScreen ? 'p-1.5 px-2' : 'p-2.5 px-3.5']">
        <span class="text-slate-200 font-bold font-sans text-xs">河道水质监测</span>
        <div class="space-x-1.5 text-right text-[11px]">
          <span class="text-cyan-300">总 {{ riverPoints.length }}</span>
          <span class="text-emerald-400">在 {{ riverOnline }}</span>
          <span class="text-orange-400">离 {{ riverPoints.length - riverOnline }}</span>
          <span class="text-rose-450 font-bold">警 {{ riverWarning }}</span>
        </div>
      </div>
      <div :class="['bg-[#051330] rounded border border-cyan-500/10 flex justify-between items-center bg-opacity-70', isLargeScreen ? 'p-1.5 px-2' : 'p-2.5 px-3.5']">
        <span class="text-slate-200 font-bold font-sans text-xs">入河排口监测</span>
        <div class="space-x-1.5 text-right text-[11px]">
          <span class="text-cyan-300">总 {{ outletPoints.length }}</span>
          <span class="text-emerald-400">在 {{ outletOnline }}</span>
          <span class="text-orange-400">离 {{ outletPoints.length - outletOnline }}</span>
          <span class="text-rose-450 font-bold">警 {{ outletWarning }}</span>
        </div>
      </div>
    </div>

    <!-- Key Water Quality Indicators -->
    <div v-if="mainOutlet" :class="[isLargeScreen ? 'space-y-1.5' : 'space-y-2']">
      <div class="flex items-center gap-1 text-[11px] text-cyan-300 font-bold">
        <span>📊 园区总排污口实时指标</span>
      </div>
      <div :class="['grid grid-cols-2 gap-1.5']">
        <div :class="['rounded bg-cyan-950/20 border border-cyan-500/10 flex justify-between items-center', isLargeScreen ? 'p-1 px-2' : 'p-1.5 px-3']">
          <span class="text-slate-400 font-bold text-xs">COD:</span>
          <span class="font-mono font-bold text-cyan-300 text-xs">{{ mainOutlet.latestData.cod }} mg/L</span>
        </div>
        <div :class="['rounded bg-cyan-950/20 border border-cyan-500/10 flex justify-between items-center', isLargeScreen ? 'p-1 px-2' : 'p-1.5 px-3']">
          <span class="text-slate-400 font-bold text-xs">氨氮:</span>
          <span class="font-mono font-bold text-cyan-300 text-xs">{{ mainOutlet.latestData.ammoniaNitrogen }} mg/L</span>
        </div>
        <div :class="['rounded bg-cyan-950/20 border border-cyan-500/10 flex justify-between items-center', isLargeScreen ? 'p-1 px-2' : 'p-1.5 px-3']">
          <span class="text-slate-400 font-bold text-xs">氟化物:</span>
          <span class="font-mono font-bold text-emerald-400 text-xs">{{ mainOutlet.latestData.fluoride }} mg/L</span>
        </div>
        <div :class="['rounded bg-cyan-950/20 border border-cyan-500/10 flex justify-between items-center', isLargeScreen ? 'p-1 px-2' : 'p-1.5 px-3']">
          <span class="text-slate-400 font-bold text-xs">pH:</span>
          <span class="font-mono font-bold text-cyan-300 text-xs">{{ mainOutlet.latestData.ph }}</span>
        </div>
      </div>
    </div>

    <!-- Water quality standard compliance -->
    <div :class="['bg-[#0d2a63]/30 rounded border border-cyan-500/10', isLargeScreen ? 'p-1.5' : 'p-2.5']">
      <div class="text-[11px] text-cyan-300 font-bold mb-1">📋 排污达标率统计</div>
      <div class="grid grid-cols-3 gap-1 text-center">
        <div class="bg-[#051330]/80 rounded p-1 border border-emerald-500/10">
          <span class="text-[10px] text-slate-400 block font-sans">COD达标率</span>
          <span class="text-xs font-bold text-emerald-400 font-mono">98.5%</span>
        </div>
        <div class="bg-[#051330]/80 rounded p-1 border border-emerald-500/10">
          <span class="text-[10px] text-slate-400 block font-sans">氨氮达标率</span>
          <span class="text-xs font-bold text-emerald-400 font-mono">97.2%</span>
        </div>
        <div class="bg-[#051330]/80 rounded p-1 border border-emerald-500/10">
          <span class="text-[10px] text-slate-400 block font-sans">氟化物达标</span>
          <span class="text-xs font-bold text-amber-400 font-mono">94.8%</span>
        </div>
      </div>
    </div>

    <!-- Recent water quality events -->
    <div :class="['bg-amber-950/15 rounded border border-amber-500/10', isLargeScreen ? 'p-1.5' : 'p-2.5']">
      <div class="text-[11px] text-amber-300 font-bold mb-1 font-sans">⚠ 水质异常提醒</div>
      <div class="space-y-0.5 text-[10px]">
        <div class="flex justify-between text-amber-200">
          <span class="font-sans">西部1号排口 氟化物波动</span>
          <span class="text-slate-400">11:20</span>
        </div>
        <div class="flex justify-between text-amber-200">
          <span class="font-sans">东部排口 COD临近阈值</span>
          <span class="text-slate-400">09:45</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { monitoringPoints, getStatusSummary } from '../../../data/monitoringPoints'

withDefaults(defineProps<{
  isLargeScreen?: boolean
  activeWaterRiver?: string
}>(), {
  isLargeScreen: true,
  activeWaterRiver: 'tongcungang'
})

defineEmits<{
  (e: 'setWaterRiver', river: 'tongcungang' | 'xinjinghe'): void
}>()

// Count by type for water-related monitoring
const pipePoints = computed(() => monitoringPoints.filter(p => p.type === 'fluoride_pool'))
const riverPoints = computed(() => monitoringPoints.filter(p => p.type === 'rain_outlet'))
const outletPoints = computed(() => monitoringPoints.filter(p => p.type === 'discharge_outlet'))

const pipeOnline = computed(() => pipePoints.value.filter(p => p.online).length)
const riverOnline = computed(() => riverPoints.value.filter(p => p.online).length)
const outletOnline = computed(() => outletPoints.value.filter(p => p.online).length)

const pipeWarning = computed(() => pipePoints.value.filter(p => p.status !== 'normal').length)
const riverWarning = computed(() => riverPoints.value.filter(p => p.status !== 'normal').length)
const outletWarning = computed(() => outletPoints.value.filter(p => p.status !== 'normal').length)

const statusSummary = computed(() => getStatusSummary())

// Key water quality indicators from the total discharge outlet
const mainOutlet = computed(() => monitoringPoints.find(p => p.id === 'do-001'))
</script>
