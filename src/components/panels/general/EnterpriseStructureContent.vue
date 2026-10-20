<template>
  <div :class="[isLargeScreen ? 'space-y-2' : 'space-y-3']">
    <!-- 行业结构指标卡 -->
    <div class="grid grid-cols-2 gap-2">
      <StatCard label="水晶加工企业" :value="`${crystalCount} 家`" statusDot="green" />
      <StatCard label="配套服务企业" :value="`${supportCount} 家`" statusDot="yellow" />
    </div>

    <!-- 行业结构占比环形图 -->
    <div class="bg-[#06183d]/45 border border-cyan-500/10 rounded overflow-hidden">
      <div class="p-1 px-2 flex justify-between items-center text-sm text-[#cbd5e1] border-b border-cyan-500/10 font-bold">
        <span>📊 行业结构占比</span>
        <span class="text-cyan-400 font-mono">水晶 / 配套</span>
      </div>
      <TechPieChart :data="industryPie" :height="110" :innerRadius="'45%'" :outerRadius="'70%'" />
    </div>

    <!-- 企业规模分布 -->
    <div class="bg-[#06183d]/45 border border-cyan-500/10 rounded overflow-hidden">
      <div class="p-1 px-2 flex justify-between items-center text-sm text-[#cbd5e1] border-b border-cyan-500/10 font-bold">
        <span>🏭 企业规模分布</span>
        <span class="text-[10px] text-slate-400 font-mono">共 {{ total }} 家</span>
      </div>
      <!-- 三档规模计数 -->
      <div class="grid grid-cols-3 gap-1.5 p-1.5">
        <div class="bg-white/5 border border-cyan-500/10 rounded text-center py-1.5">
          <span class="block text-lg font-black text-cyan-300 leading-none">{{ scaleStats.large }}</span>
          <span class="text-[10px] text-white/70 mt-0.5 block">大型</span>
        </div>
        <div class="bg-white/5 border border-cyan-500/10 rounded text-center py-1.5">
          <span class="block text-lg font-black text-emerald-400 leading-none">{{ scaleStats.medium }}</span>
          <span class="text-[10px] text-white/70 mt-0.5 block">中型</span>
        </div>
        <div class="bg-white/5 border border-cyan-500/10 rounded text-center py-1.5">
          <span class="block text-lg font-black text-amber-400 leading-none">{{ scaleStats.small }}</span>
          <span class="text-[10px] text-white/70 mt-0.5 block">小型</span>
        </div>
      </div>
      <!-- 占比条 -->
      <div class="px-1.5 pb-1.5">
        <div class="flex h-1.5 rounded-full overflow-hidden bg-[#051330]">
          <div class="bg-cyan-400" :style="{ width: largePct + '%' }" />
          <div class="bg-emerald-400" :style="{ width: mediumPct + '%' }" />
          <div class="bg-amber-400" :style="{ width: smallPct + '%' }" />
        </div>
        <div class="flex justify-between text-[9px] text-slate-400 font-mono mt-0.5 px-0.5">
          <span class="text-cyan-400">{{ largePct }}%</span>
          <span class="text-emerald-400">{{ mediumPct }}%</span>
          <span class="text-amber-400">{{ smallPct }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StatCard from '../../shared/StatCard.vue'
import TechPieChart from '../../charts/TechPieChart.vue'
import { enterprisesByIndustry, enterprisesByScale } from '../../../data/enterprises'

withDefaults(defineProps<{
  isLargeScreen?: boolean
}>(), {
  isLargeScreen: true
})

const crystalCount = computed(() => enterprisesByIndustry.crystal_processing.length)
const supportCount = computed(() => enterprisesByIndustry.support_services.length)

const scaleStats = computed(() => ({
  large: enterprisesByScale.large.length,
  medium: enterprisesByScale.medium.length,
  small: enterprisesByScale.small.length
}))

const total = computed(() => scaleStats.value.large + scaleStats.value.medium + scaleStats.value.small)

const largePct = computed(() => Math.round((scaleStats.value.large / total.value) * 100))
const mediumPct = computed(() => Math.round((scaleStats.value.medium / total.value) * 100))
const smallPct = computed(() => Math.round((scaleStats.value.small / total.value) * 100))

const industryPie = computed(() => [
  { name: '水晶加工', value: crystalCount.value, color: '#00f2ff' },
  { name: '配套服务', value: supportCount.value, color: '#10b981' }
])
</script>