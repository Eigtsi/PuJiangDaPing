<template>
  <div :class="[isLargeScreen ? 'space-y-2' : 'space-y-3']">
    <!-- Header with compliance overview -->
    <div :class="['flex justify-between items-center border-b border-[#06b6d4]/20 font-sans font-bold bg-[#0b245c]/20 px-1.5 rounded', isLargeScreen ? 'text-[13px] pb-1' : 'text-sm pb-2']">
      <span>主要流域：<b class="text-cyan-300">金华浦江段</b></span>
      <span class="text-emerald-400">断面达标: {{ complianceRate }}%</span>
    </div>

    <!-- Monitoring status summary -->
    <div class="grid grid-cols-4 gap-1 text-center">
      <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-1">
        <span class="text-[13px] text-slate-400 block font-sans">排口总数</span>
        <span class="text-base font-bold text-cyan-300 font-mono">{{ dischargeOutlets.length }}</span>
      </div>
      <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-1">
        <span class="text-[13px] text-slate-400 block font-sans">在线</span>
        <span class="text-base font-bold text-emerald-400 font-mono">{{ onlineCount }}</span>
      </div>
      <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-1">
        <span class="text-[13px] text-slate-400 block font-sans">达标</span>
        <span class="text-base font-bold text-emerald-400 font-mono">{{ normalCount }}</span>
      </div>
      <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-1">
        <span class="text-[13px] text-slate-400 block font-sans">异常</span>
        <span class="text-base font-bold text-rose-400 font-mono">{{ alertCount }}</span>
      </div>
    </div>

    <!-- Discharge outlets detail list -->
    <div :class="['bg-[#051330]/40 rounded border border-cyan-500/10', isLargeScreen ? 'p-1.5' : 'p-2.5']">
      <div class="text-[13px] text-cyan-300 font-bold mb-1 font-sans">📍 排污口实时监测</div>
      <div class="space-y-0.5">
        <div v-for="outlet in dischargeOutlets" :key="outlet.id"
          :class="['p-1 rounded border', getOutletBorderStyle(outlet.status)]">
          <div class="flex justify-between items-center">
            <span class="text-slate-300 font-bold text-[13px] font-sans">{{ outlet.name }}</span>
            <span :class="['px-1 py-0.5 rounded text-xs font-bold', getOutletStatusClass(outlet)]">
              {{ getOutletStatusText(outlet) }}
            </span>
          </div>
          <div v-if="outlet.online" class="grid grid-cols-5 gap-0.5 text-[13px] font-mono mt-0.5">
            <div class="text-center">
              <span class="text-slate-500">COD</span>
              <span :class="getValueColor(outlet.latestData.cod, outlet.standard.cod)"> {{ outlet.latestData.cod }}</span>
            </div>
            <div class="text-center">
              <span class="text-slate-500">NH₃</span>
              <span :class="getValueColor(outlet.latestData.ammoniaNitrogen, outlet.standard.ammoniaNitrogen)"> {{ outlet.latestData.ammoniaNitrogen }}</span>
            </div>
            <div class="text-center">
              <span class="text-slate-500">F⁻</span>
              <span :class="getValueColor(outlet.latestData.fluoride, outlet.standard.fluoride)"> {{ outlet.latestData.fluoride }}</span>
            </div>
            <div class="text-center">
              <span class="text-slate-500">TN</span>
              <span class="text-cyan-300">{{ outlet.latestData.totalNitrogen }}</span>
            </div>
            <div class="text-center">
              <span class="text-slate-500">pH</span>
              <span :class="getPhColor(outlet.latestData.ph, outlet.standard.ph)">{{ outlet.latestData.ph }}</span>
            </div>
          </div>
          <div v-else class="text-xs text-slate-500 italic mt-0.5">设备离线</div>
        </div>
      </div>
    </div>

    <!-- Average indicators -->
    <div :class="['bg-[#0d2a63]/30 rounded border border-cyan-500/10', isLargeScreen ? 'p-1.5' : 'p-2.5']">
      <div class="text-[13px] text-cyan-300 font-bold mb-1 font-sans">📊 园区排口均值指标</div>
      <div class="grid grid-cols-3 gap-1 text-center">
        <div class="bg-[#051330]/80 rounded p-1 border border-cyan-500/5">
          <span class="text-[13px] text-slate-400 block font-sans">COD 均值</span>
          <span class="text-[13px] font-bold text-cyan-300 font-mono">{{ avgCod }} <span class="text-xs text-slate-500">mg/L</span></span>
        </div>
        <div class="bg-[#051330]/80 rounded p-1 border border-cyan-500/5">
          <span class="text-[13px] text-slate-400 block font-sans">NH₃-N 均值</span>
          <span class="text-[13px] font-bold text-cyan-300 font-mono">{{ avgNh3n }} <span class="text-xs text-slate-500">mg/L</span></span>
        </div>
        <div class="bg-[#051330]/80 rounded p-1 border border-cyan-500/5">
          <span class="text-[13px] text-slate-400 block font-sans">氟化物均值</span>
          <span class="text-[13px] font-bold text-cyan-300 font-mono">{{ avgFluoride }} <span class="text-xs text-slate-500">mg/L</span></span>
        </div>
      </div>
    </div>

    <!-- Rain outlets video monitoring -->
    <div :class="['bg-[#051330]/40 rounded border border-blue-500/10', isLargeScreen ? 'p-1.5' : 'p-2.5']">
      <div class="text-[13px] text-blue-300 font-bold mb-1 font-sans">🌊 雨排口视频监控</div>
      <div class="space-y-1">
        <button v-for="rain in rainOutlets" :key="rain.id" @click="openVideo(rain)"
          class="w-full flex items-center justify-between p-1.5 rounded border border-blue-500/15 bg-[#0b255c]/30 hover:border-cyan-400/60 hover:bg-[#0b255c]/60 transition cursor-pointer">
          <span class="flex items-center gap-1.5 text-slate-200 font-bold text-[13px] font-sans">
            <Video class="w-3.5 h-3.5 text-cyan-400" />
            {{ rain.name }}
          </span>
          <span class="flex items-center gap-1 text-[11px] text-cyan-300">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            实时监控
          </span>
        </button>
      </div>
    </div>

    <!-- Video monitor modal（原型占位） -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="selectedRain" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70" @click="closeVideo">
          <div class="relative w-[520px] max-w-[90vw] bg-[#071a47] border border-cyan-400/60 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.35)] overflow-hidden" @click.stop>
            <div class="flex items-center justify-between px-4 py-2.5 border-b border-cyan-500/20 bg-[#0b255c]/50">
              <div class="flex items-center gap-2 text-cyan-300 font-bold">
                <Video class="w-4 h-4" />
                <span>{{ selectedRain.name }} · 视频监控</span>
              </div>
              <button @click="closeVideo" class="text-slate-400 hover:text-rose-400 transition"><X class="w-4 h-4" /></button>
            </div>
            <div class="aspect-video bg-[#041235] flex flex-col items-center justify-center gap-2 text-cyan-400/60">
              <Video class="w-12 h-12" />
              <span class="text-sm tracking-widest">视频监控（占位）</span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Video, X } from 'lucide-vue-next'
import { getPointsByType } from '../../../data/monitoringPoints'
import type { MonitoringPoint } from '../../../data/monitoringPoints'

withDefaults(defineProps<{
  isLargeScreen?: boolean
}>(), {
  isLargeScreen: true
})

const dischargeOutlets = getPointsByType('discharge_outlet').slice(0, 2)
const rainOutlets = getPointsByType('rain_outlet')

// 雨排口视频监控弹窗（原型占位）
const selectedRain = ref<MonitoringPoint | null>(null)
function openVideo(rain: MonitoringPoint) {
  selectedRain.value = rain
}
function closeVideo() {
  selectedRain.value = null
}

const onlineCount = computed(() => dischargeOutlets.filter(p => p.online).length)
const normalCount = computed(() => dischargeOutlets.filter(p => p.status === 'normal' && p.online).length)
const alertCount = computed(() => dischargeOutlets.filter(p => p.status !== 'normal').length)

const complianceRate = computed(() => {
  const normal = dischargeOutlets.filter(p => p.status === 'normal' && p.online).length
  const total = dischargeOutlets.length
  return total > 0 ? ((normal / total) * 100).toFixed(0) : '100'
})

const avgCod = computed(() => {
  const online = dischargeOutlets.filter(p => p.online && p.latestData.cod)
  if (!online.length) return '0'
  return (online.reduce((s, p) => s + (p.latestData.cod || 0), 0) / online.length).toFixed(1)
})

const avgNh3n = computed(() => {
  const online = dischargeOutlets.filter(p => p.online && p.latestData.ammoniaNitrogen)
  if (!online.length) return '0'
  return (online.reduce((s, p) => s + (p.latestData.ammoniaNitrogen || 0), 0) / online.length).toFixed(1)
})

const avgFluoride = computed(() => {
  const online = dischargeOutlets.filter(p => p.online && p.latestData.fluoride)
  if (!online.length) return '0'
  return (online.reduce((s, p) => s + (p.latestData.fluoride || 0), 0) / online.length).toFixed(1)
})

function getOutletBorderStyle(status: string) {
  if (status === 'alert') return 'border-rose-500/30 bg-rose-950/15'
  if (status === 'warning') return 'border-amber-500/20 bg-amber-950/10'
  return 'border-cyan-500/10 bg-cyan-950/20'
}

function getOutletStatusClass(pt: typeof dischargeOutlets[0]) {
  if (!pt.online) return 'bg-slate-500/20 text-slate-400'
  if (pt.status === 'alert') return 'bg-rose-500/20 text-rose-400'
  if (pt.status === 'warning') return 'bg-amber-500/20 text-amber-400'
  return 'bg-emerald-500/20 text-emerald-400'
}

function getOutletStatusText(pt: typeof dischargeOutlets[0]) {
  if (!pt.online) return '离线'
  if (pt.status === 'alert') return '超标'
  if (pt.status === 'warning') return '预警'
  return '达标'
}

function getValueColor(value: number | undefined, limit: number | undefined) {
  if (value === undefined || limit === undefined || value === 0) return 'text-slate-400'
  if (value > limit) return 'text-rose-400 font-bold'
  if (value > limit * 0.8) return 'text-amber-300'
  return 'text-cyan-300'
}

function getPhColor(value: number | undefined, range: [number, number] | undefined) {
  if (value === undefined || range === undefined || value === 0) return 'text-slate-400'
  if (value < range[0] || value > range[1]) return 'text-rose-400 font-bold'
  return 'text-cyan-300'
}
</script>
