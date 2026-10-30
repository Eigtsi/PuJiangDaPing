<template>
  <div :class="['font-sans text-sm', isLargeScreen ? 'space-y-1' : 'space-y-3.5']">
    <!-- Solid & Hazardous storage tracking conforming to '固废暂存、外运等数据统计' -->
    <div class="flex items-center justify-between text-xs text-sky-300 font-bold bg-[#0b245c]/35 p-1 rounded">
      <span>📦 固废中心集中库房 (实时容量)</span>
      <span class="text-amber-400 font-mono">容量使用率: 62.4%</span>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div class="bg-cyan-950/20 p-1 rounded border border-cyan-500/10 text-center">
        <span class="text-slate-400 block font-bold text-xs">一般固废</span>
        <span class="text-cyan-300 font-mono font-extrabold text-xs">1240 吨</span>
      </div>
      <div class="bg-cyan-950/20 p-1 rounded border border-cyan-500/10 text-center">
        <span class="text-slate-400 block font-bold text-xs">危险废物</span>
        <span class="text-rose-400 font-mono font-extrabold text-xs">180 吨</span>
      </div>
    </div>

    <!-- Capacity progress bar -->
    <div class="bg-[#051330]/40 p-1 rounded border border-cyan-500/10">
      <div class="flex justify-between items-center mb-0.5">
        <span class="text-slate-400">库房容量使用</span>
        <span class="text-amber-400 font-mono font-bold text-xs">62.4%</span>
      </div>
      <ProgressBar :percentage="62.4" colorScheme="amber" :isLargeScreen="isLargeScreen" />
    </div>

    <!-- Safety monitoring indicators（紧凑单行） -->
    <div class="flex gap-2 text-center">
      <div class="flex-1 bg-[#0b245c]/30 py-0.5 rounded border border-cyan-500/10 flex items-center justify-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
        <span class="text-emerald-400 text-xs">负压排风</span>
      </div>
      <div class="flex-1 bg-[#0b245c]/30 py-0.5 rounded border border-cyan-500/10 flex items-center justify-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
        <span class="text-emerald-400 text-xs">防泄漏</span>
      </div>
      <div class="flex-1 bg-[#0b245c]/30 py-0.5 rounded border border-cyan-500/10 flex items-center justify-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
        <span class="text-emerald-400 text-xs">温感报警</span>
      </div>
    </div>

    <!-- 总量管理 Section -->
    <div class="border-t border-cyan-500/15 pt-1.5 mt-1">
      <div class="flex items-center justify-between text-xs text-cyan-300 font-bold bg-[#0b245c]/35 p-1 rounded mb-1">
        <span>📊 总量管理指标</span>
        <span class="text-xs text-slate-400">年度总量控制</span>
      </div>
      <div class="space-y-1">
        <div v-for="cap in pollutantCaps" :key="cap.name" class="bg-cyan-950/20 p-1 px-1.5 rounded border border-cyan-500/10">
          <div class="flex justify-between items-center">
            <span class="text-slate-300 font-bold text-xs">{{ cap.name }}</span>
            <div class="flex items-center gap-1">
              <span v-if="cap.isWarning" class="text-[7px] px-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">超80%</span>
              <span :class="['font-mono font-bold text-xs', cap.isWarning ? 'text-amber-400' : 'text-cyan-300']">
                {{ cap.allocated }}/{{ cap.totalReserved }} {{ cap.unit }}
              </span>
            </div>
          </div>
          <div class="mt-0.5">
            <ProgressBar
              :percentage="cap.usageRate"
              :colorScheme="cap.isWarning ? 'amber' : 'cyan'"
              :isLargeScreen="isLargeScreen"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Reserve monthly trend chart -->
    <div class="bg-[#06183d]/45 border border-cyan-500/10 rounded overflow-hidden">
      <div class="p-1 px-1.5 flex justify-between items-center text-sm text-[#cbd5e1] border-b border-cyan-500/10 font-bold">
        <span>总量储备库月度趋势</span>
      </div>
      <TechBarChart
        :xData="months"
        :series="[
          { name: 'COD入', data: codInbound, color: '#06b6d4' },
          { name: 'COD出', data: codOutbound, color: '#10b981' }
        ]"
        :height="80"
      />
    </div>

    <!-- Safe details with progress tracking -->
    <div class="bg-[#051330]/40 px-2 py-0.5 rounded border border-cyan-500/10 flex justify-between items-center">
      <span class="text-slate-400 text-xs">库房安监防线：</span>
      <span class="text-emerald-400 font-bold text-xs">防泄漏负压排风系统运行良好</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProgressBar from '../../shared/ProgressBar.vue'
import TechBarChart from '../../charts/TechBarChart.vue'
import { pollutantCaps, reserveMonthlyData } from '../../../data/environmental'

defineProps<{
  isLargeScreen?: boolean
}>()

const months = computed(() => reserveMonthlyData.map(d => d.month.slice(5)))
const codInbound = computed(() => reserveMonthlyData.map(d => d.inbound[0]))
const codOutbound = computed(() => reserveMonthlyData.map(d => d.outbound[0]))
</script>
