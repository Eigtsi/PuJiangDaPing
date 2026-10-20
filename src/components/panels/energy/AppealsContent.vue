<template>
  <div :class="[isLargeScreen ? 'flex-1 flex flex-col gap-2 min-h-0' : 'space-y-3']">
    <!-- Header stats -->
    <div class="grid grid-cols-3 gap-1 text-center">
      <div class="bg-[#051330]/60 rounded border border-emerald-500/10 p-1">
        <span class="text-xs text-slate-400 block font-sans">已办结</span>
        <span class="text-base font-bold text-emerald-400 font-mono">{{ completedCount }}<span class="text-xs text-slate-500">件</span></span>
      </div>
      <div class="bg-[#051330]/60 rounded border border-amber-500/10 p-1">
        <span class="text-xs text-slate-400 block font-sans">办理中</span>
        <span class="text-base font-bold text-amber-400 font-mono">{{ processingCount }}<span class="text-xs text-slate-500">件</span></span>
      </div>
      <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-1">
        <span class="text-xs text-slate-400 block font-sans">待受理</span>
        <span class="text-base font-bold text-cyan-400 font-mono">{{ pendingCount }}<span class="text-xs text-slate-500">件</span></span>
      </div>
    </div>

    <!-- Appeals list -->
    <div class="overflow-y-auto pr-1 space-y-1 flex-1 min-h-0">
      <div v-for="appeal in displayAppeals" :key="appeal.id"
        :class="appealCardClass(appeal.status)"
        class="rounded p-1.5 flex justify-between items-start gap-1.5">
        <div class="space-y-0.5 flex-1 min-w-0">
          <div class="flex items-center gap-1">
            <span class="font-bold truncate text-[13px]" :class="appeal.status === '已办结' ? 'text-[#2dd4bf]' : 'text-cyan-300'">
              {{ appeal.enterpriseName }}
            </span>
            <span class="text-slate-400 text-xs font-sans">{{ appeal.type }}</span>
          </div>
          <span class="text-slate-350 text-xs block truncate">{{ appeal.description }}</span>
          <!-- Progress bar -->
          <div class="flex items-center gap-1.5 mt-0.5">
            <div class="flex-1 bg-[#06183d] rounded-full h-1.5 overflow-hidden">
              <div class="h-full rounded-full transition-all" :class="progressColor(appeal.progress)" :style="{ width: appeal.progress + '%' }" />
            </div>
            <span class="text-xs font-mono text-slate-400">{{ appeal.progress }}%</span>
          </div>
          <span class="text-slate-400 text-xs block font-mono">
            经办: {{ appeal.handler }} | {{ appeal.createTime }}
          </span>
        </div>
        <span :class="statusBadge(appeal.status)" class="p-0.5 px-1.5 rounded text-xs font-bold whitespace-nowrap flex-shrink-0">
          {{ appeal.status }}
        </span>
      </div>
    </div>

    <!-- Bottom summary -->
    <div class="bg-[#051330]/90 p-1.5 px-2 rounded border border-cyan-500/20 space-y-1">
      <div class="flex justify-between items-center text-[13px]">
        <span class="text-slate-400 font-sans font-bold">诉求综合接办指数：</span>
        <span class="text-cyan-300 font-mono font-bold text-xs">累计 {{ totalCount }} 件 | 评分 5.0</span>
      </div>
      <div>
        <div class="flex justify-between text-xs text-slate-300 mb-0.5">
          <span>接单派单率</span>
          <span class="text-emerald-400 font-mono">100%</span>
        </div>
        <div class="w-full h-1.5 bg-[#06183d] rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style="width: 100%" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { appealRecords } from '../../../data/alerts'

defineProps<{
  isLargeScreen?: boolean
}>()

const emit = defineEmits<{
  (e: 'toast', msg: string): void
}>()

// Show first 5 appeal records
const displayAppeals = computed(() => appealRecords.slice(0, 5))

const totalCount = computed(() => 42)
const completedCount = computed(() => appealRecords.filter(a => a.status === '已办结').length)
const processingCount = computed(() => appealRecords.filter(a => a.status === '加急代办中').length)
const pendingCount = computed(() => appealRecords.filter(a => a.status === '待受理').length)

function appealCardClass(status: string): string {
  if (status === '已办结') return 'border border-teal-500/35 bg-[#052d3a]/30'
  return 'border border-cyan-500/35 bg-[#071a47]/50'
}

function statusBadge(status: string): string {
  if (status === '已办结') return 'text-[#2dd4bf] bg-teal-950/70'
  if (status === '加急代办中') return 'text-emerald-400 bg-emerald-950/70'
  return 'text-amber-400 bg-amber-950/70'
}

function progressColor(progress: number): string {
  if (progress >= 100) return 'bg-[#2dd4bf]'
  if (progress >= 50) return 'bg-emerald-400'
  return 'bg-amber-400'
}
</script>
