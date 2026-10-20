<template>
  <div :class="[isLargeScreen ? 'flex-1 flex flex-col justify-between gap-2 min-h-0' : 'space-y-3']">
    <!-- Environmental Source Header -->
    <div class="bg-[#0b245c]/50 p-2 rounded border border-cyan-500/20 flex justify-between items-center bg-opacity-75">
      <div>
        <span class="text-slate-400 block text-sm">污染源在线率</span>
        <span class="font-extrabold font-mono text-cyan-300 text-lg">{{ onlineRate }}%</span>
      </div>
      <div class="text-right">
        <span class="text-slate-400 block text-sm">净化处理运转中</span>
        <span class="text-emerald-400 font-bold text-sm">{{ fluorideEntCount }}家涉氟企业达标</span>
      </div>
    </div>

    <!-- Exhaust Emissions Real-time Monitor -->
    <div class="bg-[#0b245c]/30 p-2 rounded border border-cyan-500/10">
      <div class="flex justify-between items-center text-sm text-cyan-300 font-bold mb-1">
        <span>💨 烟尘与废气在线监测</span>
        <span class="text-emerald-400">达标率 100%</span>
      </div>
      <div class="grid grid-cols-2 gap-1.5 text-sm">
        <div class="bg-cyan-950/20 p-1.5 rounded flex justify-between items-center">
          <span class="text-slate-400">颗粒物：</span>
          <span class="font-mono text-cyan-200 font-bold">{{ airData.pm10 }} µg/m³</span>
        </div>
        <div class="bg-cyan-950/20 p-1.5 rounded flex justify-between items-center">
          <span class="text-slate-400">二氧化硫：</span>
          <span class="font-mono text-cyan-200 font-bold">{{ airData.so2 }} µg/m³</span>
        </div>
      </div>
    </div>

    <!-- Wastewater Discharge Real-time Monitor -->
    <div class="bg-[#0b245c]/30 p-2 rounded border border-cyan-500/10">
      <div class="flex justify-between items-center text-sm text-sky-300 font-bold mb-1">
        <span>💧 重点企业废水排口监控</span>
        <span class="text-emerald-400">达标率 {{ wastewaterRate }}%</span>
      </div>
      <div class="grid grid-cols-2 gap-1.5 text-sm">
        <div class="bg-cyan-950/20 p-1.5 rounded flex justify-between items-center">
          <span class="text-slate-400">pH核心值：</span>
          <span class="font-mono text-cyan-300 font-bold">{{ mainOutlet.ph }} (均值)</span>
        </div>
        <div class="bg-cyan-950/20 p-1.5 rounded flex justify-between items-center">
          <span class="text-slate-400">化学需氧：</span>
          <span class="font-mono text-cyan-300 font-bold">{{ mainOutlet.cod }} mg/L</span>
        </div>
      </div>
    </div>

    <!-- Electricity Monitoring from alert events -->
    <div v-if="electricityAlerts.length" class="bg-[#0b245c]/30 p-2 rounded border border-amber-500/15">
      <div class="flex justify-between items-center text-sm text-amber-300 font-bold mb-1">
        <span>⚡ 用电异常监测</span>
        <span class="text-rose-400">{{ electricityAlerts.length }}条异常</span>
      </div>
      <div class="space-y-0.5 text-sm">
        <div v-for="alt in electricityAlerts.slice(0, 3)" :key="alt.id" class="bg-amber-950/20 p-1 px-1.5 rounded flex justify-between items-center">
          <span class="text-slate-300 truncate max-w-[55%]">{{ alt.enterpriseName }}</span>
          <span class="font-mono text-amber-300 font-bold">{{ alt.monitorValue }}/{{ alt.limitValue }} {{ alt.unit }}</span>
        </div>
      </div>
    </div>

    <!-- Monitoring Point Online/Offline -->
    <div class="bg-[#051330]/60 p-2 rounded border border-cyan-500/10 text-sm flex justify-between items-center">
      <span class="text-slate-400">
        监测点位在线：<span class="text-emerald-400 font-bold">{{ statusOnline }} 在线</span> / <span class="text-amber-400">{{ statusOffline }} 离线</span>
      </span>
      <span class="text-sm text-[#cbd5e1] font-mono">{{ statusNormal }}正常 / {{ statusWarning }}预警 / {{ statusAlert }}报警</span>
    </div>

    <!-- Live Alert State -->
    <div class="border border-dashed border-cyan-500/30 p-2 rounded text-sm text-cyan-200 flex justify-between items-center bg-[#071638]/50">
      <span class="flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>污染源排重控制一切正常</span>
      </span>
      <span class="font-mono text-sm text-[#cbd5e1]">盾级安全防范</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { monitoringPoints, getStatusSummary, getPointsByType } from '../../../data/monitoringPoints'
import { enterprises, fluorideEnterprises } from '../../../data/enterprises'
import { alertEvents } from '../../../data/environmental'

defineProps<{
  isLargeScreen?: boolean
}>()

const statusSummary = getStatusSummary()
const statusNormal = statusSummary.normal
const statusWarning = statusSummary.warning
const statusAlert = statusSummary.alert

const totalPoints = monitoringPoints.length
const onlinePoints = monitoringPoints.filter(p => p.online).length
const offlinePoints = totalPoints - onlinePoints
const onlineRate = ((onlinePoints / totalPoints) * 100).toFixed(1)

const statusOnline = onlinePoints
const statusOffline = offlinePoints

const fluorideEntCount = fluorideEnterprises.length

const mainOutlet = computed(() => {
  const outlet = getPointsByType('discharge_outlet').find(p => p.id === 'do-001')
  return outlet?.latestData || { ph: 7.2, cod: 45 }
})

const airData = computed(() => {
  const station = getPointsByType('air_station').find(p => p.id === 'as-001')
  return station?.latestData || { pm10: 68, so2: 15 }
})

const wastewaterRate = computed(() => {
  const outlets = getPointsByType('discharge_outlet')
  const online = outlets.filter(p => p.online && p.status === 'normal')
  return outlets.length > 0 ? ((online.length / outlets.length) * 100).toFixed(1) : '99.2'
})

const electricityAlerts = computed(() => {
  return alertEvents.filter(e => e.type === '用电异常')
})
</script>
