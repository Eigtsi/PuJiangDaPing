<template>
  <div :class="['font-sans text-sm', isLargeScreen ? 'space-y-1.5' : 'space-y-3.5']">
    <!-- Outer shipping statistics & flow chart conforming to '实现污染源监控、环境质量监测、固废流程监管的"三合一"可视化' -->
    <div class="flex justify-between items-center text-xs text-cyan-300 font-bold bg-[#0b245c]/30 p-1 rounded">
      <span>🚚 固危废外运与转运实时通报</span>
      <span class="text-[#cbd5e1] font-mono">当日车次: {{ todayTrips }}</span>
    </div>

    <div class="border border-cyan-500/15 bg-gradient-to-r from-[#0d2a63]/25 to-[#0b2152]/10 p-1.5 rounded space-y-1 bg-opacity-30">
      <div class="flex justify-between text-slate-300 font-bold text-xs">
        <span>正在运输中：{{ activeVehicle.plate }} ({{ activeVehicle.wasteType }})</span>
        <span class="text-amber-400">{{ activeVehicle.progress }}</span>
      </div>
      <div class="flex justify-between text-[11px] text-slate-400">
        <span>出库点：{{ activeVehicle.from }}</span>
        <span>目的地：{{ activeVehicle.to }}</span>
      </div>

      <!-- Simple flow timeline to visualize "三合一" closed-loop regulatory mechanism '固废流程监管' -->
      <div class="grid grid-cols-4 gap-1 mt-1 text-[11px] text-center font-sans">
        <div class="bg-emerald-950/80 text-emerald-400 p-0.5 border border-emerald-500/20 rounded font-bold">1.装载申报</div>
        <div class="bg-emerald-950/80 text-emerald-400 p-0.5 border border-emerald-500/20 rounded font-bold">2.出库留影</div>
        <div class="bg-cyan-950/80 text-cyan-300 p-0.5 border border-cyan-550/20 rounded font-bold animate-pulse">3.GPS转运</div>
        <div class="bg-slate-900/60 text-slate-400 p-0.5 rounded">4.接收销库</div>
      </div>
    </div>

    <!-- Transport vehicle list -->
    <div class="space-y-1.5">
      <div class="text-xs text-cyan-300 font-bold">今日运输车辆明细</div>
      <div v-for="v in vehicles" :key="v.plate" class="bg-[#0b245c]/30 p-2 px-2.5 rounded flex justify-between items-center text-sm border border-cyan-500/10">
        <div class="flex items-center gap-2">
          <span :class="['w-2 h-2 rounded-full', v.status === '运输中' ? 'bg-amber-400 animate-pulse' : v.status === '已完成' ? 'bg-emerald-400' : 'bg-sky-400']" />
          <span class="text-slate-200 font-bold">{{ v.plate }}</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-slate-400">{{ v.wasteType }}</span>
          <span :class="['font-mono font-bold', v.status === '运输中' ? 'text-amber-300' : v.status === '已完成' ? 'text-emerald-300' : 'text-sky-300']">{{ v.status }}</span>
        </div>
      </div>
    </div>

    <!-- Monthly transport statistics -->
    <div class="bg-[#051330]/40 p-1.5 rounded border border-cyan-500/10">
      <div class="text-xs text-cyan-300 font-bold mb-1">月度运输统计</div>
      <div class="grid grid-cols-3 gap-1.5 text-xs">
        <div class="bg-cyan-950/20 p-1 rounded text-center">
          <span class="block text-slate-400 text-[11px]">一般固废</span>
          <span class="font-mono text-cyan-300 font-bold">{{ monthlyStats.generalWaste }}吨</span>
        </div>
        <div class="bg-cyan-950/20 p-1 rounded text-center">
          <span class="block text-slate-400 text-[11px]">危险废物</span>
          <span class="font-mono text-rose-400 font-bold">{{ monthlyStats.hazardousWaste }}吨</span>
        </div>
        <div class="bg-cyan-950/20 p-1 rounded text-center">
          <span class="block text-slate-400 text-[11px]">闭环率</span>
          <span class="font-mono text-emerald-400 font-bold">{{ monthlyStats.closeRate }}%</span>
        </div>
      </div>
    </div>

    <div class="bg-[#051330]/40 p-1.5 rounded border border-cyan-500/10 flex justify-between items-center bg-opacity-70">
      <span class="text-slate-400">月度累计安全外移：</span>
      <span class="text-cyan-250 font-bold font-mono text-xs">一般{{ monthlyStats.generalWaste }}吨 | 危险{{ monthlyStats.hazardousWaste }}吨 | 闭环率{{ monthlyStats.closeRate }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isLargeScreen?: boolean
}>()

const todayTrips = 3

const activeVehicle = {
  plate: '浙G·89X23',
  wasteType: '特重泥危废',
  from: '园区一号中转站',
  to: '金华特种固废处置中心',
  progress: '转运中 65%',
}

const vehicles = [
  { plate: '浙G·89X23', wasteType: '危险废物', status: '运输中' },
  { plate: '浙G·55K18', wasteType: '一般固废', status: '已完成' },
  { plate: '浙G·72M09', wasteType: '一般固废', status: '已完成' },
]

const monthlyStats = {
  generalWaste: 245,
  hazardousWaste: 74,
  closeRate: 100,
}
</script>
