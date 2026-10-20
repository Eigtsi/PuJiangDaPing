<template>
  <div :class="[isLargeScreen ? 'flex flex-col gap-2 h-full' : 'flex flex-col gap-3']">
    <!-- 2x2 card grid -->
    <div class="grid grid-cols-2 gap-2 flex-1 min-h-0">
      <!-- Card 1: 租金 -->
      <div :class="['relative rounded border border-cyan-500/25 bg-[#071942]/65 hover:border-cyan-400/50 transition flex flex-col justify-between', isLargeScreen ? 'p-2 px-2.5' : 'p-3']">
        <div class="flex justify-between items-center">
          <span :class="[isLargeScreen ? 'text-sm' : 'text-sm md:text-base', 'font-bold text-cyan-100']">租金收益</span>
          <div class="flex items-center gap-1">
            <span class="px-1 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400 font-bold font-mono">{{ items[0].currentMonth.collectionRate }}%</span>
            <span :class="['text-xs font-bold font-mono', items[0].monthOnMonthGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400']">
              {{ items[0].monthOnMonthGrowth >= 0 ? '&#9650;' : '&#9660;' }} {{ Math.abs(items[0].monthOnMonthGrowth) }}%
            </span>
          </div>
        </div>
        <div class="flex justify-between items-baseline mt-1 mb-0.5">
          <span class="text-xs text-slate-400 font-bold">年累计</span>
          <span :class="[isLargeScreen ? 'text-lg' : 'text-xl', 'font-black font-mono text-cyan-300 digital-glow']">{{ items[0].yearToDate.received }}万</span>
        </div>
        <div class="flex justify-between text-xs text-slate-300 border-t border-cyan-500/10 pt-1 font-mono">
          <span>本月实收 <span class="text-emerald-400 font-bold">{{ items[0].currentMonth.received }}万</span></span>
          <span>欠费 <span class="text-rose-400 font-bold">{{ items[0].currentMonth.outstanding }}万</span></span>
        </div>
      </div>

      <!-- Card 2: 物业费 -->
      <div :class="['relative rounded border border-cyan-500/25 bg-[#071942]/65 hover:border-cyan-400/50 transition flex flex-col justify-between', isLargeScreen ? 'p-2 px-2.5' : 'p-3']">
        <div class="flex justify-between items-center">
          <span :class="[isLargeScreen ? 'text-sm' : 'text-sm md:text-base', 'font-bold text-cyan-100']">物业服务</span>
          <div class="flex items-center gap-1">
            <span class="px-1 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400 font-bold font-mono">{{ items[1].currentMonth.collectionRate }}%</span>
            <span :class="['text-xs font-bold font-mono', items[1].monthOnMonthGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400']">
              {{ items[1].monthOnMonthGrowth >= 0 ? '&#9650;' : '&#9660;' }} {{ Math.abs(items[1].monthOnMonthGrowth) }}%
            </span>
          </div>
        </div>
        <div class="flex justify-between items-baseline mt-1 mb-0.5">
          <span class="text-xs text-slate-400 font-bold">年累计</span>
          <span :class="[isLargeScreen ? 'text-lg' : 'text-xl', 'font-black font-mono text-cyan-300 digital-glow']">{{ items[1].yearToDate.received }}万</span>
        </div>
        <div class="flex justify-between text-xs text-slate-300 border-t border-cyan-500/10 pt-1 font-mono">
          <span>本月实收 <span class="text-emerald-400 font-bold">{{ items[1].currentMonth.received }}万</span></span>
          <span>欠费 <span class="text-rose-400 font-bold">{{ items[1].currentMonth.outstanding }}万</span></span>
        </div>
      </div>

      <!-- Card 3: 水电费 -->
      <div :class="['relative rounded border border-cyan-500/25 bg-[#071942]/65 hover:border-cyan-400/50 transition flex flex-col justify-between', isLargeScreen ? 'p-2 px-2.5' : 'p-3']">
        <div class="flex justify-between items-center">
          <span :class="[isLargeScreen ? 'text-sm' : 'text-sm md:text-base', 'font-bold text-cyan-100']">能耗水电</span>
          <div class="flex items-center gap-1">
            <span class="px-1 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400 font-bold font-mono">{{ items[2].currentMonth.collectionRate }}%</span>
            <span :class="['text-xs font-bold font-mono', items[2].monthOnMonthGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400']">
              {{ items[2].monthOnMonthGrowth >= 0 ? '&#9650;' : '&#9660;' }} {{ Math.abs(items[2].monthOnMonthGrowth) }}%
            </span>
          </div>
        </div>
        <div class="flex justify-between items-baseline mt-1 mb-0.5">
          <span class="text-xs text-slate-400 font-bold">年累计</span>
          <span :class="[isLargeScreen ? 'text-lg' : 'text-xl', 'font-black font-mono text-cyan-300 digital-glow']">{{ items[2].yearToDate.received }}万</span>
        </div>
        <div class="flex justify-between text-xs text-slate-300 border-t border-cyan-500/10 pt-1 font-mono">
          <span>本月实收 <span class="text-emerald-400 font-bold">{{ items[2].currentMonth.received }}万</span></span>
          <span>欠费 <span class="text-emerald-400 font-bold">{{ items[2].currentMonth.outstanding }}万</span></span>
        </div>
      </div>

      <!-- Card 4: 固废+停车+其他汇总 -->
      <div :class="['relative rounded border border-cyan-500/25 bg-[#071942]/65 hover:border-cyan-400/50 transition flex flex-col justify-between', isLargeScreen ? 'p-2 px-2.5' : 'p-3']">
        <div class="flex justify-between items-center">
          <span :class="[isLargeScreen ? 'text-sm' : 'text-sm md:text-base', 'font-bold text-cyan-100']">固废/停车/其他</span>
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div class="flex justify-between items-baseline mt-1 mb-0.5">
          <span class="text-xs text-slate-400 font-bold">年累计</span>
          <span :class="[isLargeScreen ? 'text-lg' : 'text-xl', 'font-black font-mono text-emerald-400 digital-glow']">{{ otherTotal }}万</span>
        </div>
        <div class="flex justify-between text-xs text-slate-300 border-t border-cyan-500/10 pt-1 font-mono">
          <span>固废 <span class="text-cyan-400 font-bold">{{ items[3].yearToDate.received }}万</span></span>
          <span>停车 <span class="text-cyan-400 font-bold">{{ items[4].yearToDate.received }}万</span></span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { revenueItems } from '../../../data/financials'

defineProps<{
  isLargeScreen?: boolean
}>()

const emit = defineEmits<{
  (e: 'toast', msg: string): void
}>()

const items = revenueItems

const otherTotal = computed(() =>
  (items[3].yearToDate.received + items[4].yearToDate.received + items[5].yearToDate.received).toFixed(1)
)
</script>
