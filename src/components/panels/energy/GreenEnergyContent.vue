<template>
  <div :class="[isLargeScreen ? 'space-y-2' : 'space-y-3']">
    <!-- Top stats row -->
    <div :class="['flex justify-between items-center bg-[#0d2a63]/30 rounded', isLargeScreen ? 'p-1.5 px-2' : 'p-2.5']">
      <div>
        <span class="text-[13px] text-slate-350 block mb-0.5 font-bold">当月绿色代收代缴</span>
        <div class="flex items-baseline gap-1.5">
          <span :class="[isLargeScreen ? 'text-2xl' : 'text-3xl', 'font-black font-mono text-cyan-300 digital-glow']">¥928450</span>
        </div>
      </div>
      <div class="text-right text-[13px] text-slate-350 font-medium font-sans">
        <span>代缴成功率: </span>
        <span class="text-emerald-400 font-extrabold font-mono text-sm">100%</span>
        <span class="block text-xs text-slate-400 mt-0.5">无逾期滞纳</span>
      </div>
    </div>

    <!-- Energy breakdown table -->
    <div :class="['bg-[#051330]/40 rounded border border-cyan-500/10 font-sans space-y-1', isLargeScreen ? 'p-1.5 text-[13px]' : 'p-2.5 text-sm']">
      <div class="flex justify-between border-b border-cyan-500/10 pb-1 text-slate-400 font-bold text-xs">
        <span>能源类目</span>
        <span class="text-center">用电负荷</span>
        <span class="text-right">代缴总额</span>
      </div>
      <div class="flex justify-between text-slate-200">
        <span>水晶高负荷生产电费</span>
        <span class="text-center font-mono text-emerald-400 font-bold">78%</span>
        <span class="text-right font-mono text-cyan-300">76.4万</span>
      </div>
      <div class="flex justify-between text-slate-200">
        <span>循环中水及净化水费</span>
        <span class="text-center font-mono text-[#2dd4bf] font-bold">常规</span>
        <span class="text-right font-mono text-cyan-300">12.5万</span>
      </div>
      <div class="flex justify-between text-slate-200">
        <span>公共废气净化能耗摊销</span>
        <span class="text-center font-mono text-emerald-400 font-bold">低碳</span>
        <span class="text-right font-mono text-cyan-300 font-bold">3.9万</span>
      </div>
    </div>

    <!-- Green energy statistics -->
    <div class="grid grid-cols-3 gap-1 text-center">
      <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-1">
        <span class="text-xs text-slate-400 block font-sans">光伏发电</span>
        <span class="text-sm font-bold text-emerald-400 font-mono">12.6 <span class="text-xs text-slate-500">万kWh</span></span>
      </div>
      <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-1">
        <span class="text-xs text-slate-400 block font-sans">碳减排量</span>
        <span class="text-sm font-bold text-emerald-400 font-mono">86.3 <span class="text-xs text-slate-500">吨</span></span>
      </div>
      <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-1">
        <span class="text-xs text-slate-400 block font-sans">节能率</span>
        <span class="text-sm font-bold text-emerald-400 font-mono">18.5<span class="text-xs text-slate-500">%</span></span>
      </div>
    </div>

    <!-- Energy saving trend -->
    <div :class="['bg-[#0d2a63]/30 rounded border border-cyan-500/10', isLargeScreen ? 'p-1.5' : 'p-2.5']">
      <div class="text-[13px] text-cyan-300 font-bold mb-1 font-sans">🌱 绿色低碳推进</div>
      <div class="space-y-1">
        <div>
          <div class="flex justify-between text-xs text-slate-300 mb-0.5">
            <span>屋顶光伏覆盖率</span>
            <span class="text-emerald-400 font-mono">65%</span>
          </div>
          <div class="w-full h-1.5 bg-[#051330] rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style="width: 65%" />
          </div>
        </div>
        <div>
          <div class="flex justify-between text-xs text-slate-300 mb-0.5">
            <span>中水回用率</span>
            <span class="text-cyan-400 font-mono">92%</span>
          </div>
          <div class="w-full h-1.5 bg-[#051330] rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full" style="width: 92%" />
          </div>
        </div>
        <div>
          <div class="flex justify-between text-xs text-slate-300 mb-0.5">
            <span>零碳工厂认证进度</span>
            <span class="text-amber-400 font-mono">48%</span>
          </div>
          <div class="w-full h-1.5 bg-[#051330] rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" style="width: 48%" />
          </div>
        </div>
      </div>
    </div>

    <!-- Recent green events -->
    <div :class="['bg-emerald-950/15 rounded border border-emerald-500/10', isLargeScreen ? 'p-1.5' : 'p-2.5']">
      <div class="text-[13px] text-emerald-300 font-bold mb-1 font-sans">📋 绿色能源动态</div>
      <div class="space-y-0.5 text-[13px]">
        <div class="flex justify-between text-slate-300">
          <span class="font-sans">A区屋顶光伏二期并网</span>
          <span class="text-emerald-400">已完成</span>
        </div>
        <div class="flex justify-between text-slate-300">
          <span class="font-sans">储能电站设备调试中</span>
          <span class="text-amber-400">进行中</span>
        </div>
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
