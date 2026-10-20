<template>
  <div :class="[isLargeScreen ? 'space-y-2' : 'space-y-3']">
    <!-- 事件闭环指标 -->
    <div class="grid grid-cols-2 gap-2">
      <StatCard label="事件总数" :value="`${total} 起`" statusDot="green" />
      <StatCard label="事件闭环率" :value="`${closedRate}%`" statusDot="green" />
      <StatCard label="处置中" :value="`${processing} 起`" statusDot="yellow" />
      <StatCard label="未处置" :value="`${pending} 起`" statusDot="red" />
    </div>

    <!-- 实时事件列表 -->
    <div class="bg-[#051330]/40 rounded p-1.5 border border-cyan-500/10">
      <div class="text-xs text-cyan-300 font-bold mb-1 border-b border-cyan-500/10 pb-1">📡 实时协同事件</div>
      <div v-for="a in latestAlerts" :key="a.id" class="flex justify-between items-center py-1 border-b border-cyan-500/5 last:border-0">
        <div class="flex items-center gap-1.5 min-w-0">
          <span :class="['w-1.5 h-1.5 rounded-full shrink-0', levelDotClass(a.level)]" />
          <span class="text-xs text-slate-200 truncate">{{ a.title }}</span>
        </div>
        <StatusBadge :text="a.status" :type="statusBadgeType(a.status)" />
      </div>
    </div>

    <div class="text-[10px] text-slate-500 italic text-center">
      * 协同管控中心 · 事件发现—派单—处置—闭环 全流程联动
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StatCard from '../../shared/StatCard.vue'
import StatusBadge from '../../shared/StatusBadge.vue'
import { systemAlerts } from '../../../data/alerts'

withDefaults(defineProps<{
  isLargeScreen?: boolean
}>(), {
  isLargeScreen: true
})

const total = computed(() => systemAlerts.length)
const closed = computed(() => systemAlerts.filter(a => a.status === '已闭环').length)
const processing = computed(() => systemAlerts.filter(a => a.status === '处置中').length)
const pending = computed(() => systemAlerts.filter(a => a.status === '未处置').length)
const closedRate = computed(() => (total.value ? Math.round((closed.value / total.value) * 100) : 0))

const latestAlerts = computed(() => systemAlerts.slice(0, 5))

function levelDotClass(level: string): string {
  const map: Record<string, string> = { 严重: 'bg-rose-500', 重要: 'bg-amber-500', 一般: 'bg-sky-500' }
  return map[level] || 'bg-sky-500'
}

function statusBadgeType(status: string): 'success' | 'warning' | 'danger' | 'info' | 'processing' {
  const map: Record<string, any> = { 已闭环: 'success', 处置中: 'processing', 未处置: 'danger' }
  return map[status] || 'info'
}
</script>