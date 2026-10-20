<template>
  <div :class="['font-sans', isLargeScreen ? 'space-y-2.5' : 'space-y-4']">
    <div class="flex justify-between items-center text-sm text-cyan-300 font-bold bg-[#0b245c]/30 p-1.5 rounded">
      <span>用工需求态势</span>
      <span class="text-[#2dd4bf] font-mono text-sm">实时对接</span>
    </div>

    <!-- Stats row: 4 KPIs -->
    <div class="grid grid-cols-4 gap-2 text-center">
      <div :class="['bg-gradient-to-b from-[#0a235c] to-[#041235] border border-cyan-500/20 rounded', isLargeScreen ? 'py-2' : 'p-3']">
        <span class="block text-xs text-slate-350 font-bold">本周有效岗位</span>
        <span :class="['block font-black text-cyan-300 font-mono', isLargeScreen ? 'text-lg mt-1' : 'text-xl mt-1']">{{ weeklyPositions }}</span>
      </div>
      <div :class="['bg-gradient-to-b from-[#0a235c] to-[#041235] border border-cyan-500/20 rounded', isLargeScreen ? 'py-2' : 'p-3']">
        <span class="block text-xs text-slate-350 font-bold">本月累计岗位</span>
        <span :class="['block font-black text-emerald-400 font-mono', isLargeScreen ? 'text-lg mt-1' : 'text-xl mt-1']">{{ monthlyPositions }}</span>
      </div>
      <div :class="['bg-gradient-to-b from-[#0a235c] to-[#041235] border border-cyan-500/20 rounded', isLargeScreen ? 'py-2' : 'p-3']">
        <span class="block text-xs text-slate-350 font-bold">协助对接人数</span>
        <span :class="['block font-black text-amber-400 font-mono', isLargeScreen ? 'text-lg mt-1' : 'text-xl mt-1']">{{ matchedPeople }}人</span>
      </div>
      <div :class="['bg-gradient-to-b from-[#0a235c] to-[#041235] border border-cyan-500/20 rounded', isLargeScreen ? 'py-2' : 'p-3']">
        <span class="block text-xs text-slate-350 font-bold">成功入职</span>
        <span :class="['block font-black text-[#2dd4bf] font-mono', isLargeScreen ? 'text-lg mt-1' : 'text-xl mt-1']">{{ onboardPeople }}人</span>
      </div>
    </div>

    <!-- Enterprise mobility section -->
    <div class="bg-[#0b245c]/30 rounded border border-cyan-500/10 p-2">
      <div class="flex justify-between items-center text-sm text-cyan-300 font-bold mb-1.5">
        <span>企业变动态势</span>
        <span class="text-emerald-400 text-xs">动态更新</span>
      </div>
      <div class="grid grid-cols-4 gap-2 text-center text-xs">
        <div class="bg-[#051330] rounded py-1.5">
          <span class="block text-slate-400">入驻总数</span>
          <span class="block text-cyan-300 font-bold font-mono text-base">{{ enterpriseStats.total }}</span>
        </div>
        <div class="bg-[#051330] rounded py-1.5">
          <span class="block text-slate-400">本月新入驻</span>
          <span class="block text-emerald-400 font-bold font-mono text-base">{{ enterpriseStats.newEntry }}</span>
        </div>
        <div class="bg-[#051330] rounded py-1.5">
          <span class="block text-slate-400">本月退园</span>
          <span class="block text-rose-400 font-bold font-mono text-base">{{ enterpriseStats.exited }}</span>
        </div>
        <div class="bg-[#051330] rounded py-1.5">
          <span class="block text-slate-400">办理中</span>
          <span class="block text-amber-400 font-bold font-mono text-base">{{ enterpriseStats.processing }}</span>
        </div>
      </div>
    </div>

    <!-- Detail list -->
    <div :class="['font-mono text-slate-300', isLargeScreen ? 'space-y-1.5 text-xs' : 'space-y-3 text-sm md:text-base']">
      <div :class="['bg-[#051330] rounded border border-cyan-500/10 flex justify-between items-center bg-opacity-70', isLargeScreen ? 'p-2 px-3' : 'p-3 px-4']">
        <span class="text-slate-200 font-bold font-sans text-sm">求职对接：</span>
        <div class="space-x-2 text-right">
          <span class="text-cyan-300 text-sm">在招 {{ totalPositions }} 岗</span>
          <span class="text-emerald-400 font-bold text-sm">已匹配 {{ matchedPeople }} 人</span>
        </div>
      </div>
      <div :class="['bg-[#051330] rounded border border-cyan-500/10 flex justify-between items-center bg-opacity-70', isLargeScreen ? 'p-2 px-3' : 'p-3 px-4']">
        <span class="text-slate-200 font-bold font-sans text-sm">急聘通道：</span>
        <div class="space-x-2 text-right">
          <span class="text-cyan-300 text-sm">急配 {{ urgentEnterprises }} 家</span>
          <span class="text-amber-400 font-bold text-sm">待到岗 {{ urgentPositions }} 人</span>
        </div>
      </div>
      <div :class="['bg-[#051330] rounded border border-cyan-500/10 flex justify-between items-center bg-opacity-70', isLargeScreen ? 'p-2 px-3' : 'p-3 px-4']">
        <span class="text-slate-200 font-bold font-sans text-sm">技能培训：</span>
        <div class="space-x-2 text-right">
          <span class="text-cyan-300 text-sm">本月 3 期</span>
          <span class="text-emerald-400 font-bold text-sm">结业 156 人</span>
        </div>
      </div>
    </div>

    <!-- Recent enterprise changes -->
    <div class="bg-[#051330]/40 rounded border border-cyan-500/10 p-2 text-xs font-mono">
      <div class="text-slate-450 font-bold border-b border-cyan-500/15 pb-1 mb-1.5 font-sans text-sm">近期企业变动</div>
      <div v-for="change in recentChanges" :key="change.name" class="flex justify-between mt-1">
        <span class="text-cyan-300 font-sans truncate text-sm">{{ change.name }}</span>
        <span :class="change.type === '入驻' ? 'text-emerald-400' : change.type === '退园' ? 'text-rose-400' : 'text-amber-400'" class="font-bold text-sm">{{ change.type }}</span>
        <span class="text-slate-400 text-sm">{{ change.date }}</span>
      </div>
    </div>

    <div class="bg-[#051330]/40 p-2 rounded border border-cyan-500/10 flex justify-between items-center bg-opacity-70 text-xs">
      <span class="text-slate-400 text-sm">累计用工服务：</span>
      <span class="text-cyan-250 font-bold font-mono text-sm">年度对接 1,280 人 | 满意度 99.6%</span>
    </div>

    <div :class="['mt-2', isLargeScreen ? 'mt-2' : 'mt-4']">
      <div class="flex items-center justify-between text-sm text-cyan-300 font-bold mb-1 px-1">
        <span>月度用工需求趋势</span>
        <span class="text-emerald-400 text-xs">持续上升</span>
      </div>
      <TechLineChart
        :xData="['1月','2月','3月','4月','5月','6月']"
        :series="[
          { name: '招工岗位', data: [32,28,45,52,48,65], color: '#06b6d4' },
          { name: '求职对接', data: [25,22,38,42,40,58], color: '#10b981' }
        ]"
        :height="100"
        :yMin="0"
        :yMax="80"
        :showArea="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TechLineChart from '../../charts/TechLineChart.vue'
import { enterprises } from '../../../data/enterprises'

defineProps<{
  isLargeScreen?: boolean
}>()

defineEmits<{
  (e: 'toast', msg: string): void
}>()

const allPositions = computed(() =>
  enterprises.flatMap(e => e.recruitmentPositions)
)

const totalPositions = computed(() =>
  allPositions.value.reduce((sum, p) => sum + p.count, 0)
)

const weeklyPositions = computed(() => totalPositions.value)
const monthlyPositions = computed(() => totalPositions.value * 4)
const matchedPeople = computed(() => Math.round(totalPositions.value * 0.83))
const onboardPeople = computed(() => Math.round(totalPositions.value * 0.62))

const urgentEnterprises = computed(() =>
  enterprises.filter(e => e.recruitmentPositions.length >= 2).length
)

const urgentPositions = computed(() =>
  enterprises.filter(e => e.recruitmentPositions.length >= 2)
    .reduce((sum, e) => sum + e.recruitmentPositions.reduce((s, p) => s + p.count, 0), 0)
)

const enterpriseStats = computed(() => ({
  total: enterprises.length,
  newEntry: enterprises.filter(e => e.leaseStatus === 'active' && e.entryDate >= '2024-01').length,
  exited: enterprises.filter(e => e.leaseStatus === 'vacant').length,
  processing: enterprises.filter(e => e.leaseStatus === 'expiring').length
}))

const recentChanges = computed(() => [
  { name: '华兴第一水晶工坊', type: '增岗', date: '06-01' },
  { name: '金辉水晶灯饰有限公司', type: '入驻', date: '05-28' },
  { name: '浦江东方物流仓储服务部', type: '退园', date: '05-25' },
  { name: '浦江水晶之韵文化创意', type: '退园', date: '05-20' },
  { name: '恒泰水晶高精磨砂切片厂', type: '增岗', date: '05-18' }
])
</script>
