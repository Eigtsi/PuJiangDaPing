<template>
  <div :class="[isLargeScreen ? 'space-y-2' : 'space-y-3']">
    <!-- 统一核算总额 -->
    <div class="flex justify-between items-center bg-[#0d2a63]/30 rounded p-1.5 px-2">
      <div>
        <span class="text-xs text-slate-350 block mb-0.5 font-bold">本月统一代缴核算</span>
        <div class="flex items-baseline gap-1.5">
          <span :class="[isLargeScreen ? 'text-2xl' : 'text-3xl', 'font-black font-mono text-cyan-300 digital-glow']">¥{{ monthReceived }}万</span>
        </div>
      </div>
      <span class="text-xs text-emerald-400 font-bold font-sans">一站式专办</span>
    </div>

    <!-- 代缴明细表 -->
    <div class="bg-[#051330]/40 rounded border border-cyan-500/10 p-1.5 text-xs font-sans space-y-1">
      <div class="flex justify-between border-b border-cyan-500/10 pb-1 text-slate-400 font-bold">
        <span>类目</span>
        <span class="text-center">应收</span>
        <span class="text-center">实收</span>
        <span class="text-right">收缴率</span>
      </div>
      <div v-for="item in items" :key="item.type" class="flex justify-between text-slate-200">
        <span>{{ item.type }}</span>
        <span class="text-center font-mono text-cyan-300">{{ item.currentMonth.receivable }}万</span>
        <span class="text-center font-mono text-emerald-400">{{ item.currentMonth.received }}万</span>
        <span class="text-right font-mono font-bold" :class="item.currentMonth.collectionRate >= 99 ? 'text-emerald-400' : 'text-amber-400'">{{ item.currentMonth.collectionRate }}%</span>
      </div>
    </div>

    <div class="text-[10px] text-slate-500 italic text-center">
      * 统一核算 · 租金 / 物业 / 水电 / 固废 / 停车 代收代缴
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { revenueItems } from '../../../data/financials'

withDefaults(defineProps<{
  isLargeScreen?: boolean
}>(), {
  isLargeScreen: true
})

const items = revenueItems

const monthReceived = computed(() =>
  revenueItems.reduce((sum, item) => sum + item.currentMonth.received, 0).toFixed(1)
)
</script>