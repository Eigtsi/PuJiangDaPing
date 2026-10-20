<template>
  <div :class="[isLargeScreen ? 'flex-1 flex flex-col justify-between h-full min-h-0' : 'space-y-3']">
    <!-- Alerts console supporting '支持异常数据集成展示' -->
    <div class="flex-grow overflow-y-auto pr-1 space-y-2 max-h-[195px] text-sm">
      <div
        v-for="alert in displayedAlerts"
        :key="alert.id"
        :class="['rounded p-2 flex justify-between items-start gap-1', getAlertStyle(alert.status).container]"
      >
        <div class="space-y-0.5">
          <span :class="['font-bold block', getAlertStyle(alert.status).title]">
            {{ getTypeIcon(alert.type) }} {{ alert.enterpriseName }} {{ alert.type }}
          </span>
          <span class="text-slate-300 text-xs block">
            {{ alert.pointName }}：监测 {{ alert.monitorValue }} / 限值 {{ alert.limitValue }} {{ alert.unit }}
          </span>
          <span class="text-slate-400 text-[11px] block italic font-mono">
            {{ alert.time }} | {{ alert.suggestion }}
          </span>
        </div>
        <span :class="['px-1 py-0.5 rounded font-bold whitespace-nowrap text-[11px]', getAlertStyle(alert.status).badge]">
          {{ alert.status }}
        </span>
      </div>
    </div>

    <div class="bg-[#051330]/90 p-2 px-3 rounded border border-cyan-500/20 flex justify-between items-center text-xs mt-2">
      <span class="text-slate-400">今日安全预警系统吞吐：</span>
      <span class="text-[#cbd5e1] font-mono font-bold">
        当日 {{ totalAlerts }}条异常 | {{ unresolvedCount }}条未处置
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { alertEvents, getActiveAlerts } from '../../../data/environmental'
import { environmentalKPI } from '../../../data/environmental'

defineProps<{
  isLargeScreen?: boolean
}>()

const totalAlerts = environmentalKPI.dailyAlertTotal
const unresolvedCount = environmentalKPI.unresolvedAlerts

const displayedAlerts = computed(() => {
  return alertEvents.slice(0, 6)
})

function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    '氟化物超标': '⚠️',
    '用电异常': '⚡',
    '废气超标': '💨',
    '总量超限': '🔴',
    'pH异常': '🧪',
    'PM2.5超标': '🌫️',
  }
  return icons[type] || '⚠️'
}

function getAlertStyle(status: string) {
  if (status === '未处置') return {
    container: 'border border-rose-500/35 bg-[#4a1c29]/25',
    title: 'text-rose-400',
    badge: 'text-rose-400 bg-rose-950/70',
  }
  if (status === '处置中') return {
    container: 'border border-amber-500/25 bg-[#3d2a10]/20',
    title: 'text-amber-400',
    badge: 'text-amber-400 bg-amber-950/70',
  }
  return {
    container: 'border border-cyan-500/20 bg-[#071638]/60',
    title: 'text-sky-300',
    badge: 'text-emerald-400 bg-emerald-950/50',
  }
}
</script>
