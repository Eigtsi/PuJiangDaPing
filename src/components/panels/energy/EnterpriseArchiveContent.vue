<template>
  <div :class="['font-sans text-sm', isLargeScreen ? 'space-y-2.5' : 'space-y-4']">
    <div class="flex justify-between items-center text-sm text-cyan-300 font-bold bg-[#0b245c]/30 p-1.5 rounded">
      <span>企业全景档案</span>
      <span class="text-[#2dd4bf] font-mono text-sm">一企一档</span>
    </div>

    <!-- Summary stats -->
    <div class="grid grid-cols-3 gap-2 text-center">
      <div :class="['bg-gradient-to-b from-[#0a235c] to-[#041235] border border-cyan-500/20 rounded', isLargeScreen ? 'py-2' : 'p-3']">
        <span class="block text-xs text-slate-350 font-bold">在册企业</span>
        <span :class="['block font-black text-cyan-300 font-mono', isLargeScreen ? 'text-xl mt-1' : 'text-2xl mt-1']">{{ allEnterprises.length }}家</span>
      </div>
      <div :class="['bg-gradient-to-b from-[#0a235c] to-[#041235] border border-cyan-500/20 rounded', isLargeScreen ? 'py-2' : 'p-3']">
        <span class="block text-xs text-slate-350 font-bold">水晶加工</span>
        <span :class="['block font-black text-emerald-400 font-mono', isLargeScreen ? 'text-xl mt-1' : 'text-2xl mt-1']">{{ crystalCount }}家</span>
      </div>
      <div :class="['bg-gradient-to-b from-[#0a235c] to-[#041235] border border-cyan-500/20 rounded', isLargeScreen ? 'py-2' : 'p-3']">
        <span class="block text-xs text-slate-350 font-bold">配套服务</span>
        <span :class="['block font-black text-[#2dd4bf] font-mono', isLargeScreen ? 'text-xl mt-1' : 'text-2xl mt-1']">{{ supportCount }}家</span>
      </div>
    </div>

    <!-- Zone distribution table -->
    <div class="bg-[#051330]/40 rounded p-2 border border-cyan-500/10 font-mono text-xs">
      <div class="grid grid-cols-4 text-slate-450 font-bold border-b border-cyan-500/15 pb-1 mb-1.5 text-sm">
        <span>区域</span>
        <span class="text-center">企业数</span>
        <span class="text-center">水晶加工</span>
        <span class="text-right">配套服务</span>
      </div>
      <div v-for="z in zoneDistribution" :key="z.zone" class="grid grid-cols-4 mt-1 text-sm">
        <span class="text-cyan-300 font-bold font-sans">{{ z.zoneLabel }}</span>
        <span class="text-center text-cyan-300 font-mono">{{ z.total }}家</span>
        <span class="text-center text-emerald-400 font-mono">{{ z.crystal }}家</span>
        <span class="text-right text-slate-400 font-mono">{{ z.support }}家</span>
      </div>
      <div class="grid grid-cols-4 mt-1 border-t border-cyan-500/10 pt-1 text-sm">
        <span class="text-amber-300 font-bold font-sans">合计</span>
        <span class="text-center text-amber-300 font-mono font-bold">{{ allEnterprises.length }}家</span>
        <span class="text-center text-amber-300 font-mono font-bold">{{ crystalCount }}家</span>
        <span class="text-right text-amber-300 font-mono font-bold">{{ supportCount }}家</span>
      </div>
    </div>

    <!-- Scale distribution -->
    <div class="bg-[#051330]/40 rounded p-2 border border-cyan-500/10">
      <div class="text-slate-450 font-bold border-b border-cyan-500/15 pb-1 mb-1.5 font-mono text-sm">企业规模分布</div>
      <div class="grid grid-cols-3 gap-2 text-center text-sm">
        <div class="bg-[#0b245c]/30 rounded py-1.5">
          <span class="block text-slate-400 text-xs">大型</span>
          <span class="block text-cyan-300 font-bold font-mono text-base">{{ scaleStats.large }}家</span>
        </div>
        <div class="bg-[#0b245c]/30 rounded py-1.5">
          <span class="block text-slate-400 text-xs">中型</span>
          <span class="block text-emerald-400 font-bold font-mono text-base">{{ scaleStats.medium }}家</span>
        </div>
        <div class="bg-[#0b245c]/30 rounded py-1.5">
          <span class="block text-slate-400 text-xs">小型</span>
          <span class="block text-amber-400 font-bold font-mono text-base">{{ scaleStats.small }}家</span>
        </div>
      </div>
    </div>

    <div class="bg-[#051330]/40 p-2 rounded border border-cyan-500/10 flex justify-between items-center bg-opacity-70">
      <span class="text-slate-400 text-sm">档案数字化率：</span>
      <span class="text-cyan-250 font-bold font-mono text-sm">证照 100% | 合同 100% | 环评 98.6%</span>
    </div>

    <div class="text-xs text-slate-500 italic text-center mt-1">
      * 点击地图标记可查看企业完整档案详情
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { enterprises, enterprisesByZone, enterprisesByIndustry, enterprisesByScale } from '../../../data/enterprises'

defineProps<{
  isLargeScreen?: boolean
}>()

defineEmits<{
  (e: 'toast', msg: string): void
}>()

const allEnterprises = enterprises

const crystalCount = computed(() => enterprisesByIndustry.crystal_processing.length)
const supportCount = computed(() => enterprisesByIndustry.support_services.length)

const scaleStats = computed(() => ({
  large: enterprisesByScale.large.length,
  medium: enterprisesByScale.medium.length,
  small: enterprisesByScale.small.length
}))

const zoneDistribution = computed(() => [
  { zone: 'east', zoneLabel: '东区', total: enterprisesByZone.east.length, crystal: enterprisesByZone.east.filter(e => e.industry === 'crystal_processing').length, support: enterprisesByZone.east.filter(e => e.industry === 'support_services').length },
  { zone: 'center', zoneLabel: '中区', total: enterprisesByZone.center.length, crystal: enterprisesByZone.center.filter(e => e.industry === 'crystal_processing').length, support: enterprisesByZone.center.filter(e => e.industry === 'support_services').length },
  { zone: 'west', zoneLabel: '西区', total: enterprisesByZone.west.length, crystal: enterprisesByZone.west.filter(e => e.industry === 'crystal_processing').length, support: enterprisesByZone.west.filter(e => e.industry === 'support_services').length }
])
</script>
