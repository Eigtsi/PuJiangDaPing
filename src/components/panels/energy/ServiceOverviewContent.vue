<template>
  <div :class="[isLargeScreen ? 'flex-1 flex flex-col justify-between gap-3 min-h-0' : 'space-y-4']">
    <!-- Service KPI Header -->
    <div class="bg-[#0b245c]/50 p-3 rounded border border-cyan-500/20 flex justify-between items-center bg-opacity-70">
      <div>
        <span class="text-slate-400 block text-sm">服务综合满意度</span>
        <span class="font-extrabold font-mono text-cyan-300 text-2xl digital-glow">99.8%</span>
      </div>
      <div class="text-right">
        <span class="text-slate-400 block text-sm">政企服务中心</span>
        <span class="text-[#2dd4bf] font-bold text-base">本月办结率 100%</span>
      </div>
    </div>

    <!-- Services Grid Overview -->
    <div class="bg-[#0b245c]/30 p-3 rounded border border-cyan-500/10">
      <div class="flex justify-between items-center text-base text-cyan-300 font-bold mb-2">
        <span>🏢 智慧政企服务矩阵</span>
        <span class="text-emerald-400 text-sm">一站式专办</span>
      </div>
      <div class="grid grid-cols-2 gap-2 text-sm font-sans">
        <div class="bg-cyan-950/20 p-2 px-3 rounded flex justify-between items-center">
          <span class="text-slate-400">政策申报：</span>
          <span class="font-mono text-cyan-300 font-bold text-base">21项发布</span>
        </div>
        <div class="bg-cyan-950/20 p-2 px-3 rounded flex justify-between items-center">
          <span class="text-slate-400">资金扶持：</span>
          <span class="font-mono text-[#2dd4bf] font-bold text-base">1.2亿元</span>
        </div>
        <div class="bg-cyan-950/20 p-2 px-3 rounded flex justify-between items-center">
          <span class="text-slate-400">急配引才：</span>
          <span class="font-mono text-cyan-300 font-bold text-base">本月+240人</span>
        </div>
        <div class="bg-cyan-950/20 p-2 px-3 rounded flex justify-between items-center">
          <span class="text-slate-400">法律援助：</span>
          <span class="font-mono text-[#2dd4bf] font-bold text-base">每日在岗</span>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div :class="['text-slate-100 leading-relaxed overflow-y-auto pr-1 bg-[#071638]/40 border border-[#06b6d4]/10 rounded font-sans', isLargeScreen ? 'text-sm p-3' : 'text-base p-3 rounded max-h-32']">
      打造一站式数字化企业服务大厅。结合在线政策库、产业扶持池等多元服务资源，为入驻水晶企业提供金融信贷对接、政策红利一键申报、重大人才急聘保障等全方位的全生命周期支持。
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isLargeScreen?: boolean
}>()

defineEmits<{
  (e: 'toast', msg: string): void
}>()
</script>
