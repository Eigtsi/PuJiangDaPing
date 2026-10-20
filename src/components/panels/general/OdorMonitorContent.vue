<template>
  <div :class="[isLargeScreen ? 'space-y-2' : 'space-y-3']">
    <!-- Header with status -->
    <div :class="['flex justify-between items-center text-slate-200 border-b border-[#06b6d4]/20 font-sans font-bold', isLargeScreen ? 'text-xs pb-1' : 'text-sm md:text-base pb-2']">
      <span>范围: <b class="text-cyan-300">东北、西南精细区</b></span>
      <span class="text-emerald-400 text-[11px]">● 运行正常</span>
    </div>

    <!-- Radar + Stats summary -->
    <div class="flex items-center gap-2">
      <!-- Radar sweep dynamic spinner -->
      <div :class="['relative rounded-full border border-cyan-500/30 bg-[#071940] flex items-center justify-center flex-shrink-0 overflow-hidden', isLargeScreen ? 'w-14 h-14' : 'w-20 h-20']">
        <span class="absolute w-full h-0.5 bg-cyan-400/40 animate-spin" style="transform-origin: center; animation-duration: 3s" />
        <div class="absolute inset-2.5 rounded-full border border-dashed border-cyan-400/20" />
        <span class="text-[8px] font-mono text-cyan-200 font-bold tracking-wider">RADAR</span>
      </div>

      <!-- Stats summary grid -->
      <div class="flex-1 grid grid-cols-2 gap-1">
        <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-1 text-center">
          <span class="text-[10px] text-slate-400 block">监测点位</span>
          <span class="text-sm font-bold text-cyan-300">5</span>
        </div>
        <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-1 text-center">
          <span class="text-[10px] text-slate-400 block">在线率</span>
          <span class="text-sm font-bold text-emerald-400">100%</span>
        </div>
        <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-1 text-center">
          <span class="text-[10px] text-slate-400 block">正常</span>
          <span class="text-sm font-bold text-emerald-400">3</span>
        </div>
        <div class="bg-[#051330]/60 rounded border border-cyan-500/10 p-1 text-center">
          <span class="text-[10px] text-slate-400 block">预警</span>
          <span class="text-sm font-bold text-rose-400">2</span>
        </div>
      </div>
    </div>

    <!-- Monitoring points table -->
    <div :class="['bg-[#051330]/40 rounded border border-cyan-500/10 font-mono', isLargeScreen ? 'p-1.5 text-[10px]' : 'p-2.5 text-xs']">
      <div class="grid grid-cols-4 text-slate-450 font-bold border-b border-cyan-500/15 pb-0.5 mb-0.5">
        <span>点位</span>
        <span class="text-center">臭气浓度</span>
        <span class="text-center">状态</span>
        <span class="text-right">更新</span>
      </div>
      <div class="space-y-0.5">
        <div class="grid grid-cols-4 text-cyan-300 hover:text-white cursor-pointer transition font-medium py-0.5">
          <span class="font-sans">东北监测点</span>
          <span class="text-center text-rose-400 font-bold">35</span>
          <span class="text-center"><span class="text-rose-400 text-[9px]">⚠ 超标</span></span>
          <span class="text-right text-slate-400">12:38</span>
        </div>
        <div class="grid grid-cols-4 text-cyan-300 hover:text-white cursor-pointer transition font-medium py-0.5">
          <span class="font-sans">西北监测点</span>
          <span class="text-center text-rose-400 font-bold">42</span>
          <span class="text-center"><span class="text-rose-400 text-[9px]">⚠ 超标</span></span>
          <span class="text-right text-slate-400">10:30</span>
        </div>
        <div class="grid grid-cols-4 text-cyan-300 hover:text-white cursor-pointer transition font-medium py-0.5">
          <span class="font-sans">西南监测点</span>
          <span class="text-center text-emerald-400 font-bold">18</span>
          <span class="text-center"><span class="text-emerald-400 text-[9px]">● 正常</span></span>
          <span class="text-right text-slate-400">12:35</span>
        </div>
        <div class="grid grid-cols-4 text-cyan-300 hover:text-white cursor-pointer transition font-medium py-0.5">
          <span class="font-sans">中部监测点</span>
          <span class="text-center text-emerald-400 font-bold">15</span>
          <span class="text-center"><span class="text-emerald-400 text-[9px]">● 正常</span></span>
          <span class="text-right text-slate-400">12:40</span>
        </div>
        <div class="grid grid-cols-4 text-cyan-300 hover:text-white cursor-pointer transition font-medium py-0.5">
          <span class="font-sans">东南监测点</span>
          <span class="text-center text-emerald-400 font-bold">12</span>
          <span class="text-center"><span class="text-emerald-400 text-[9px]">● 正常</span></span>
          <span class="text-right text-slate-400">12:32</span>
        </div>
      </div>
    </div>

    <!-- Odor factor analysis -->
    <div :class="['bg-[#0d2a63]/30 rounded border border-cyan-500/10', isLargeScreen ? 'p-1.5' : 'p-2.5']">
      <div class="text-[11px] text-cyan-300 font-bold mb-1 font-sans">📊 实时恶臭因子分析</div>
      <div class="grid grid-cols-3 gap-1 text-center">
        <div class="bg-[#051330]/80 rounded p-1 border border-cyan-500/5">
          <span class="text-[10px] text-slate-400 block font-sans">H₂S 硫化氢</span>
          <span class="text-xs font-bold text-emerald-400 font-mono">0.003 ppm</span>
          <span class="text-[9px] text-emerald-500 block">达标 ✓</span>
        </div>
        <div class="bg-[#051330]/80 rounded p-1 border border-cyan-500/5">
          <span class="text-[10px] text-slate-400 block font-sans">NH₃ 氨气</span>
          <span class="text-xs font-bold text-amber-400 font-mono">0.08 ppm</span>
          <span class="text-[9px] text-amber-500 block">临近 ⚠</span>
        </div>
        <div class="bg-[#051330]/80 rounded p-1 border border-cyan-500/5">
          <span class="text-[10px] text-slate-400 block font-sans">VOCs 挥发物</span>
          <span class="text-xs font-bold text-emerald-400 font-mono">0.12 mg/m³</span>
          <span class="text-[9px] text-emerald-500 block">达标 ✓</span>
        </div>
      </div>
    </div>

    <!-- Recent alerts -->
    <div :class="['bg-rose-950/15 rounded border border-rose-500/10', isLargeScreen ? 'p-1.5' : 'p-2.5']">
      <div class="text-[11px] text-rose-300 font-bold mb-1 font-sans">⚠ 最新预警事件</div>
      <div class="space-y-0.5 text-[10px]">
        <div class="flex justify-between text-rose-200">
          <span class="font-sans">西北监测点 臭气超标</span>
          <span class="text-slate-400">10:30</span>
        </div>
        <div class="flex justify-between text-rose-200">
          <span class="font-sans">东北监测点 浓度波动</span>
          <span class="text-slate-400">12:38</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  isLargeScreen?: boolean
}>(), {
  isLargeScreen: true
})
</script>
