<template>
  <div :class="[isLargeScreen ? 'flex-1 flex flex-col justify-between h-full min-h-0' : 'space-y-3']">
    <!-- 筛选：状态 + 时间 -->
    <div class="flex items-center gap-1.5 mb-1.5 shrink-0">
      <el-select v-model="statusFilter" size="small" class="alert-status-select shrink-0" popper-class="alert-status-popper">
        <el-option label="全部状态" value="all" />
        <el-option label="未处置" value="未处置" />
        <el-option label="处置中" value="处置中" />
        <el-option label="已闭环" value="已闭环" />
      </el-select>
      <el-date-picker
        v-model="timeRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        size="small"
        :clearable="false"
        class="alert-time-picker"
        popper-class="export-range-popper"
      />
    </div>

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
import { computed, ref } from 'vue'
import { alertEvents, getActiveAlerts } from '../../../data/environmental'
import { environmentalKPI } from '../../../data/environmental'

defineProps<{
  isLargeScreen?: boolean
}>()

const totalAlerts = environmentalKPI.dailyAlertTotal
const unresolvedCount = environmentalKPI.unresolvedAlerts

// 预警记录筛选：状态 + 时间范围
const statusFilter = ref<'all' | '未处置' | '处置中' | '已闭环'>('all')
const timeRange = ref<[string, string]>(['2025-12-09', '2025-12-10'])

const displayedAlerts = computed(() => {
  const [start, end] = timeRange.value
  return alertEvents.filter((a) => {
    const d = a.time.slice(0, 10)
    const timeOk = (!start || d >= start) && (!end || d <= end)
    const statusOk = statusFilter.value === 'all' || a.status === statusFilter.value
    return timeOk && statusOk
  })
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

<style scoped>
/* 预警筛选：状态下拉 + 日期范围输入框深色主题 */
:deep(.alert-status-select) {
  width: 92px;
}
:deep(.alert-status-select .el-select__wrapper) {
  background-color: #0b2152 !important;
  border: 1px solid rgba(6, 182, 212, 0.35) !important;
  box-shadow: none !important;
  color: #22d3ee !important;
  border-radius: 4px;
  height: 26px !important;
  min-height: 26px !important;
}
:deep(.alert-status-select .el-select__selected-item) {
  color: #22d3ee !important;
  font-family: monospace;
  font-size: 12px;
}
:deep(.alert-status-select .el-select__caret) {
  color: #22d3ee !important;
}
:deep(.alert-time-picker) {
  flex: 1 1 0%;
  width: auto !important;
  min-width: 0;
}
:deep(.alert-time-picker .el-input__wrapper) {
  background-color: #0b2152 !important;
  box-shadow: 0 0 0 1px rgba(6, 182, 212, 0.35) inset !important;
  border-radius: 4px;
}
:deep(.alert-time-picker .el-range-input) {
  color: #22d3ee !important;
  font-family: monospace;
  font-size: 12px;
}
:deep(.alert-time-picker .el-range-separator) {
  color: #64748b !important;
  font-size: 12px;
}
:deep(.alert-time-picker .el-range__icon),
:deep(.alert-time-picker .el-range__close-icon) {
  color: #22d3ee !important;
}
</style>

<style>
/* 预警状态下拉面板深色主题（teleport 到 body） */
.alert-status-popper {
  background-color: #0b2152 !important;
  border: 1px solid rgba(6, 182, 212, 0.45) !important;
}
.alert-status-popper .el-select-dropdown__item {
  color: #cbd5e1;
}
.alert-status-popper .el-select-dropdown__item.is-hovering {
  background-color: rgba(0, 242, 255, 0.12);
  color: #00f2ff;
}
.alert-status-popper .el-select-dropdown__item.is-selected {
  color: #00f2ff;
  font-weight: 700;
}
</style>
