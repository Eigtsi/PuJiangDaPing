<template>
  <div :class="[isLargeScreen ? 'space-y-2' : 'space-y-3']">
    <!-- 待办指标 -->
    <div class="grid grid-cols-2 gap-2">
      <StatCard label="待处理提醒" :value="`${pendingCount} 条`" statusDot="yellow" />
      <StatCard label="紧急事项" :value="`${urgentCount} 条`" statusDot="red" />
    </div>

    <!-- 提醒列表 -->
    <div class="bg-[#051330]/40 rounded p-1.5 border border-cyan-500/10 space-y-1">
      <div class="text-xs text-cyan-300 font-bold border-b border-cyan-500/10 pb-1">⏰ 业务提醒</div>
      <div v-for="r in list" :key="r.id" class="flex items-center justify-between py-1 border-b border-cyan-500/5 last:border-0">
        <div class="min-w-0 pr-2">
          <div class="flex items-center gap-1.5">
            <StatusBadge :text="r.type" :type="typeBadge(r.level)" />
            <span class="text-xs text-slate-200 font-bold truncate">{{ r.enterpriseName }}</span>
          </div>
          <div class="text-[10px] text-slate-400 truncate mt-0.5">{{ r.description }}</div>
        </div>
        <div class="text-right shrink-0">
          <div :class="['text-xs font-mono font-bold', r.daysLeft <= 7 ? 'text-rose-400' : 'text-amber-300']">{{ r.daysLeft }} 天</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StatCard from '../../shared/StatCard.vue'
import StatusBadge from '../../shared/StatusBadge.vue'
import { businessReminders } from '../../../data/reminders'

withDefaults(defineProps<{
  isLargeScreen?: boolean
}>(), {
  isLargeScreen: true
})

const list = computed(() => businessReminders.slice(0, 6))
const pendingCount = computed(() => businessReminders.filter(r => r.status === '待处理').length)
const urgentCount = computed(() => businessReminders.filter(r => r.level === '紧急' && r.status === '待处理').length)

function typeBadge(level: string): 'success' | 'warning' | 'danger' | 'info' | 'processing' {
  const map: Record<string, any> = { 紧急: 'danger', 重要: 'warning', 一般: 'info' }
  return map[level] || 'info'
}
</script>