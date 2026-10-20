<template>
  <div :class="[isLargeScreen ? 'flex-1 flex flex-col gap-2 min-h-0' : 'space-y-4']">
    <!-- Header -->
    <div class="flex items-center justify-between text-[13px] text-cyan-300 font-bold">
      <span>🏆 年度惠企扶持资金与红利</span>
      <span class="text-[#2dd4bf] font-semibold">已拨付: 2,450万</span>
    </div>

    <!-- Policy cards -->
    <div class="space-y-1.5 font-sans">
      <div class="bg-[#0b2152]/40 p-1.5 px-2 rounded border border-cyan-500/10 flex justify-between items-center gap-2">
        <div>
          <span class="text-cyan-200 font-bold text-[13px] block">专精特新水晶示范点贴补</span>
          <span class="text-slate-400 text-xs block">支持研发设计数字化，单家一次性奖励 50 万元</span>
        </div>
        <span class="text-emerald-400 font-bold text-[13px] font-mono shrink-0">12 家已拨</span>
      </div>

      <div class="bg-[#0b2152]/40 p-1.5 px-2 rounded border border-cyan-500/10 flex justify-between items-center gap-2">
        <div>
          <span class="text-cyan-200 font-bold text-[13px] block">绿色零碳工厂特别奖励</span>
          <span class="text-slate-400 text-xs block">年度能耗下降超 15% 即可申报，一次性下拨 100 万元</span>
        </div>
        <span class="text-amber-400 font-bold text-[13px] shrink-0">2 家在审</span>
      </div>

      <div class="bg-[#0b2152]/40 p-1.5 px-2 rounded border border-cyan-500/10 flex justify-between items-center gap-2">
        <div>
          <span class="text-cyan-200 font-bold text-[13px] block">水晶出口贸易退税加速</span>
          <span class="text-slate-400 text-xs block">出口型企业增值税即征即退，办理周期缩短至 5 个工作日</span>
        </div>
        <span class="text-emerald-400 font-bold text-[13px] font-mono shrink-0">8 家已享</span>
      </div>

      <div class="bg-[#0b2152]/40 p-1.5 px-2 rounded border border-cyan-500/10 flex justify-between items-center gap-2">
        <div>
          <span class="text-cyan-200 font-bold text-[13px] block">人才引进安居补贴</span>
          <span class="text-slate-400 text-xs block">高级技工及以上人才，给予租房补贴 1,500 元/月，连续 3 年</span>
        </div>
        <span class="text-cyan-300 font-bold text-[13px] shrink-0">申报中</span>
      </div>
    </div>

    <!-- Fund disbursement progress -->
    <div class="bg-cyan-950/25 rounded border border-cyan-500/20 p-1.5">
      <div class="flex justify-between items-center text-[13px] text-cyan-200 mb-1">
        <span class="font-bold font-sans">2026年度涉企财政补助下拨率</span>
        <span class="text-[#2dd4bf] font-bold font-mono">72.4%</span>
      </div>
      <div :class="['w-full bg-[#06183d] rounded-full overflow-hidden border border-cyan-500/10', isLargeScreen ? 'h-2' : 'h-3']">
        <div class="bg-gradient-to-r from-cyan-400 to-[#2dd4bf] rounded-full h-full" style="width: 72.4%" />
      </div>
    </div>

    <!-- Statistics -->
    <div class="grid grid-cols-3 gap-1 text-center">
      <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-1">
        <span class="text-xs text-slate-400 block font-sans">惠企政策</span>
        <span class="text-sm font-bold text-cyan-300 font-mono">12 <span class="text-xs text-slate-500">项</span></span>
      </div>
      <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-1">
        <span class="text-xs text-slate-400 block font-sans">受益企业</span>
        <span class="text-sm font-bold text-emerald-400 font-mono">28 <span class="text-xs text-slate-500">家</span></span>
      </div>
      <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-1">
        <span class="text-xs text-slate-400 block font-sans">资金到位率</span>
        <span class="text-sm font-bold text-emerald-400 font-mono">95.6<span class="text-xs text-slate-500">%</span></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isLargeScreen?: boolean
}>()

const emit = defineEmits<{
  (e: 'toast', msg: string): void
}>()
</script>
