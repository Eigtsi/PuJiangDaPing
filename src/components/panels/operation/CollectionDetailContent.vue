<template>
  <div :class="['font-sans', isLargeScreen ? 'space-y-2' : 'space-y-4']">
    <div class="grid grid-cols-2 gap-2 text-center">
      <button
        @click="emit('toast', '正在展示：2025年度已收回款总明细 (应收尽收)')"
        class="rounded border cursor-pointer transition p-1.5 text-[13px] font-bold bg-gradient-to-r from-blue-900/60 to-cyan-900/60 text-cyan-300 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)] font-black"
      >
        2025已收回款
      </button>
      <button
        @click="emit('toast', '正在展示：2026年本季度季度应收及预收明细（回账健康度极高）')"
        class="rounded border cursor-pointer transition p-1.5 text-[13px] font-bold bg-[#0b2152]/40 text-slate-400 border-cyan-500/10 hover:border-cyan-550/30"
      >
        2026按季应收
      </button>
    </div>

    <!-- Summary by fee type from revenueItems -->
    <div :class="['font-mono text-slate-300', isLargeScreen ? 'space-y-1 text-[13px]' : 'space-y-2.5 text-xs md:text-sm']">
      <div v-for="item in topItems" :key="item.type"
        :class="['bg-[#051330] rounded border border-cyan-500/10 flex justify-between items-center bg-opacity-70', isLargeScreen ? 'p-1.5 px-2' : 'p-2.5 px-3.5']">
        <span class="text-slate-200 font-bold font-sans">{{ item.type }}:</span>
        <div class="space-x-1.5 text-right">
          <span class="text-cyan-300">应收 {{ item.yearToDate.receivable }}万</span>
          <span class="text-emerald-400">实收 {{ item.yearToDate.received }}万</span>
          <span :class="item.yearToDate.outstanding > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'">
            {{ item.yearToDate.outstanding > 0 ? '欠费 ' + item.yearToDate.outstanding + '万' : '结清' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Arrears mini table -->
    <div class="bg-[#051330]/40 rounded border border-cyan-500/10 p-1.5">
      <div class="flex justify-between items-center text-[13px] text-cyan-300 font-bold mb-1">
        <span>欠费企业明细 ({{ arrearsRecords.length }}条)</span>
        <span class="text-rose-400 font-mono">总欠费 {{ totalArrears }}万</span>
      </div>
      <div class="grid grid-cols-5 text-xs text-slate-450 font-bold border-b border-cyan-500/10 pb-0.5 font-mono">
        <span>企业</span>
        <span class="text-center">费种</span>
        <span class="text-center">金额</span>
        <span class="text-center">时长</span>
        <span class="text-right">状态</span>
      </div>
      <div v-for="r in arrearsRecords" :key="r.enterpriseId" class="grid grid-cols-5 text-xs mt-0.5 font-mono">
        <span class="text-cyan-300 font-sans truncate">{{ shortName(r.enterpriseName) }}</span>
        <span class="text-center text-slate-400">{{ r.feeType }}</span>
        <span class="text-center text-rose-400 font-bold">{{ r.amount }}万</span>
        <span class="text-center text-slate-400">{{ r.duration }}</span>
        <span class="text-right" :class="statusClass(r.status)">{{ r.status }}</span>
      </div>
    </div>

    <!-- Collection progress -->
    <div class="bg-cyan-950/25 rounded border border-cyan-500/20 p-1.5">
      <div class="flex justify-between items-center text-[13px] text-cyan-200 mb-1">
        <span class="font-bold">年度综合收缴率</span>
        <span class="text-emerald-400 font-bold font-mono">{{ overallRate }}%</span>
      </div>
      <div :class="['w-full bg-[#06183d] rounded-full overflow-hidden border border-cyan-500/10', isLargeScreen ? 'h-2' : 'h-3']">
        <div class="bg-gradient-to-r from-[#2dd4bf] to-emerald-400 rounded-full h-full" :style="{ width: overallRate + '%' }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { revenueItems, arrearsRecords } from '../../../data/financials'

defineProps<{
  isLargeScreen?: boolean
}>()

const emit = defineEmits<{
  (e: 'toast', msg: string): void
}>()

// Top 3 fee types for summary cards
const topItems = revenueItems.slice(0, 3)

const totalArrears = computed(() =>
  arrearsRecords.reduce((sum, r) => sum + r.amount, 0).toFixed(1)
)

const overallRate = computed(() => {
  const totalReceivable = revenueItems.reduce((s, i) => s + i.yearToDate.receivable, 0)
  const totalReceived = revenueItems.reduce((s, i) => s + i.yearToDate.received, 0)
  return (totalReceived / totalReceivable * 100).toFixed(1)
})

function shortName(name: string): string {
  if (name.length <= 6) return name
  return name.slice(0, 5) + '..'
}

function statusClass(status: string): string {
  if (status === '诉讼中') return 'text-rose-400 font-bold'
  if (status === '已发函') return 'text-amber-400'
  return 'text-cyan-300'
}
</script>
