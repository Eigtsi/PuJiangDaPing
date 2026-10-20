<template>
  <div :class="[isLargeScreen ? 'space-y-2' : 'space-y-3']">
    <!-- Header -->
    <div :class="['flex justify-between items-center text-slate-200 border-b border-[#06b6d4]/20 font-sans font-bold', isLargeScreen ? 'text-[13px] pb-1' : 'text-sm md:text-base pb-2']">
      <span>企业合同到期预警</span>
      <div class="flex items-center gap-2">
        <span class="text-slate-400 text-xs">共 {{ contracts.length }} 份</span>
        <span class="text-amber-300 text-xs">预警 {{ expiringCount }} 家</span>
      </div>
    </div>

    <!-- ACTIVE spinner + table -->
    <div class="flex items-center gap-2">
      <div :class="['relative rounded-full border border-[#2dd4bf]/40 bg-[#071940] flex items-center justify-center flex-shrink-0 overflow-hidden', isLargeScreen ? 'w-14 h-14' : 'w-20 h-20']">
        <span class="absolute w-full h-0.5 bg-emerald-400/40 animate-spin" style="transform-origin: center; animation-duration: 4s" />
        <div class="absolute inset-2.5 rounded-full border border-dashed border-emerald-400/20" />
        <span class="text-[8px] font-mono text-emerald-200 font-bold tracking-wider">ACTIVE</span>
      </div>

      <div :class="['flex-1 bg-[#051330]/40 rounded border border-cyan-500/10 font-mono', isLargeScreen ? 'p-1.5 text-xs' : 'p-2.5 text-xs']">
        <div class="grid grid-cols-4 text-slate-450 font-bold border-b border-cyan-500/15 pb-0.5 text-[13px]">
          <span>承租企业</span>
          <span class="text-center">剩余天数</span>
          <span class="text-center font-sans">状态</span>
          <span class="text-right">操作</span>
        </div>
        <div v-for="(c, idx) in contracts" :key="c.enterpriseId" class="grid grid-cols-4 items-center mt-0.5 text-[13px]">
          <span class="font-sans truncate text-cyan-300">{{ shortName(c.enterpriseName) }}</span>
          <span class="text-center font-bold" :class="daysColor(c.remainingDays)">{{ c.remainingDays }}天</span>
          <span class="text-center font-sans" :class="statusColor(c.status)">{{ c.status }}</span>
          <span class="text-right">
            <button
              v-if="c.remainingDays <= 90"
              @click="emit('toast', '已向 ' + c.enterpriseName + ' 发送续签提醒通知')"
              class="text-xs px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 transition cursor-pointer"
            >提醒</button>
            <span v-else class="text-slate-500">-</span>
          </span>
        </div>
        <div class="text-xs text-slate-450 flex justify-between pt-1 border-t border-cyan-500/10 font-sans font-bold mt-1">
          <span>总承租: 36家</span>
          <span>到期预警: <span class="text-amber-300">{{ expiringCount }}家</span></span>
          <span>续租率: <span class="text-emerald-400">92.4%</span></span>
        </div>
      </div>
    </div>

    <!-- Contract statistics summary -->
    <div class="grid grid-cols-3 gap-1 text-center">
      <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-1">
        <span class="text-xs text-slate-400 block font-sans">本年签约</span>
        <span class="text-base font-bold text-cyan-300 font-mono">158 <span class="text-xs text-slate-500">份</span></span>
      </div>
      <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-1">
        <span class="text-xs text-slate-400 block font-sans">执行中</span>
        <span class="text-base font-bold text-emerald-400 font-mono">142 <span class="text-xs text-slate-500">份</span></span>
      </div>
      <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-1">
        <span class="text-xs text-slate-400 block font-sans">满意度</span>
        <span class="text-base font-bold text-emerald-400 font-mono">99.8<span class="text-xs text-slate-500">%</span></span>
      </div>
    </div>

    <!-- Recent contract events -->
    <div :class="['bg-[#0d2a63]/30 rounded border border-cyan-500/10', isLargeScreen ? 'p-1.5' : 'p-2.5']">
      <div class="text-[13px] text-cyan-300 font-bold mb-1 font-sans">📋 近期合同动态</div>
      <div class="space-y-0.5 text-[13px] font-mono">
        <div class="flex justify-between text-slate-300">
          <span class="font-sans">浦江晶智激光科技 扩租签约</span>
          <span class="text-emerald-400">已生效</span>
        </div>
        <div class="flex justify-between text-slate-300">
          <span class="font-sans">恒锐水晶研磨材料 续约3年</span>
          <span class="text-amber-400">审批中</span>
        </div>
        <div class="flex justify-between text-slate-300">
          <span class="font-sans">浦江鑫达物流服务 退园办理</span>
          <span class="text-rose-400">办理中</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { contractExpiries } from '../../../data/alerts'

defineProps<{
  isLargeScreen?: boolean
}>()

const emit = defineEmits<{
  (e: 'toast', msg: string): void
}>()

const contracts = contractExpiries

const expiringCount = computed(() =>
  contracts.filter(c => c.remainingDays <= 90).length
)

function shortName(name: string): string {
  if (name.length <= 6) return name
  return name.slice(0, 4) + '..'
}

function daysColor(days: number): string {
  if (days < 30) return 'text-rose-400'
  if (days < 90) return 'text-amber-300'
  return 'text-emerald-400'
}

function statusColor(status: string): string {
  if (status === '到期') return 'text-rose-400 font-bold'
  if (status === '即将到期') return 'text-amber-300 font-bold'
  return 'text-emerald-400'
}
</script>
