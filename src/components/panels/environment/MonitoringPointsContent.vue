<template>
  <div :class="[isLargeScreen ? 'flex-1 flex flex-col justify-between gap-3 min-h-0' : 'space-y-4']">
    <!-- Monitoring point metrics conforming to '实现企业、园区监测点位分布、实时数据与达标情况可视化展示' -->
    <div class="space-y-2">
      <div class="flex items-center justify-between text-xs text-cyan-300 font-bold">
        <span>👁️ 园区多元监测点分布</span>
        <span class="text-slate-350 font-semibold text-sm">整体在线率: {{ onlineRate }}%</span>
      </div>

      <div class="grid grid-cols-2 gap-2 text-sm">
        <div class="bg-[#0b2152]/50 p-1.5 px-2 py-2 rounded border border-cyan-500/10 flex flex-col justify-between h-14">
          <div class="flex justify-between items-center">
            <span class="text-slate-200 font-bold">🏭 企业排口监测</span>
            <span :class="['px-1 py-0.5 rounded text-[11px]', outletStatusBadge.class]">{{ outletStatusBadge.text }}</span>
          </div>
          <div class="flex justify-between items-center text-xs text-slate-400 mt-1">
            <span class="font-mono text-cyan-300 font-bold">{{ dischargeOutlets.length }} 个点位</span>
            <span>{{ outletComplianceRate }}% 达标</span>
          </div>
        </div>
        <div class="bg-[#0b2152]/50 p-1.5 px-2 py-2 rounded border border-cyan-500/10 flex flex-col justify-between h-14">
          <div class="flex justify-between items-center">
            <span class="text-slate-200 font-bold">🌀 区域VOCs监测</span>
            <span :class="['px-1 py-0.5 rounded text-[11px]', vocStatusBadge.class]">{{ vocStatusBadge.text }}</span>
          </div>
          <div class="flex justify-between items-center text-xs text-slate-400 mt-1">
            <span class="font-mono text-sky-450 font-bold">{{ vocPoints.length }} 个点位</span>
            <span>{{ avgVoc }} ppb</span>
          </div>
        </div>
        <div class="bg-[#0b2152]/50 p-1.5 px-2 py-2 rounded border border-cyan-500/10 flex flex-col justify-between h-14">
          <div class="flex justify-between items-center">
            <span class="text-slate-200 font-bold">🌊 雨排口断面</span>
            <span :class="['px-1 py-0.5 rounded text-[11px]', rainStatusBadge.class]">{{ rainStatusBadge.text }}</span>
          </div>
          <div class="flex justify-between items-center text-xs text-slate-400 mt-1">
            <span class="font-mono text-[#2dd4bf] font-bold">{{ rainOutlets.length }} 个点位</span>
            <span>指标正常</span>
          </div>
        </div>
        <div class="bg-[#0b2152]/50 p-1.5 px-2 py-2 rounded border border-cyan-500/10 flex flex-col justify-between h-14">
          <div class="flex justify-between items-center">
            <span class="text-slate-200 font-bold">🦻 恶臭监测仪</span>
            <span :class="['px-1 py-0.5 rounded text-[11px]', odorStatusBadge.class]">{{ odorStatusBadge.text }}</span>
          </div>
          <div class="flex justify-between items-center text-xs text-slate-400 mt-1">
            <span class="font-mono text-emerald-400 font-bold">{{ odorPoints.length }} 个点位</span>
            <span>智能联动</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Multi-point compliance state -->
    <div class="bg-cyan-950/25 rounded border border-cyan-500/20 p-2.5 mt-2">
      <div class="flex justify-between items-center text-sm text-cyan-200 mb-1.5">
        <span class="font-bold">实时达标合规状态评估</span>
        <span class="text-emerald-400 font-bold text-xs">合格率: {{ complianceRate }}%</span>
      </div>
      <div :class="['w-full bg-[#06183d] rounded-full overflow-hidden border border-cyan-500/10', isLargeScreen ? 'h-2' : 'h-1.5']">
        <div :class="['bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full', isLargeScreen ? 'h-2' : 'h-1.5']" :style="{ width: complianceRate + '%' }" />
      </div>
      <div class="text-sm text-[#cbd5e1] mt-2 leading-relaxed bg-[#0b245c]/30 p-1 rounded">
        * 监测到园区企业达标情况整体优质，无严重水、气超标泄漏风险。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { monitoringPoints, getPointsByType, getStatusSummary } from '../../../data/monitoringPoints'

defineProps<{
  isLargeScreen?: boolean
}>()

const totalCount = monitoringPoints.length
const onlineCount = monitoringPoints.filter(p => p.online).length
const onlineRate = ((onlineCount / totalCount) * 100).toFixed(1)

const statusSummary = getStatusSummary()
const complianceRate = ((statusSummary.normal / totalCount) * 100).toFixed(1)

const dischargeOutlets = getPointsByType('discharge_outlet')
const vocPoints = getPointsByType('voc')
const rainOutlets = getPointsByType('rain_outlet')
const odorPoints = getPointsByType('odor')

const outletComplianceRate = computed(() => {
  const normal = dischargeOutlets.filter(p => p.status === 'normal').length
  return dischargeOutlets.length > 0 ? ((normal / dischargeOutlets.length) * 100).toFixed(0) : '100'
})

const avgVoc = computed(() => {
  const onlineVoc = vocPoints.filter(p => p.online)
  if (onlineVoc.length === 0) return '0'
  const sum = onlineVoc.reduce((acc, p) => acc + (p.latestData.tvoc || 0), 0)
  return (sum / onlineVoc.length).toFixed(1)
})

function getStatusBadge(points: typeof monitoringPoints) {
  const hasAlert = points.some(p => p.status === 'alert')
  const hasWarning = points.some(p => p.status === 'warning')
  if (hasAlert) return { text: '报警', class: 'bg-rose-500/20 text-rose-400' }
  if (hasWarning) return { text: '预警', class: 'bg-amber-500/20 text-amber-400' }
  return { text: '稳定', class: 'bg-emerald-500/20 text-emerald-400' }
}

const outletStatusBadge = computed(() => getStatusBadge(dischargeOutlets))
const vocStatusBadge = computed(() => getStatusBadge(vocPoints))
const rainStatusBadge = computed(() => getStatusBadge(rainOutlets))
const odorStatusBadge = computed(() => getStatusBadge(odorPoints))
</script>
