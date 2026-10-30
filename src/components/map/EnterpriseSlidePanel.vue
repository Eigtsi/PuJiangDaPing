<template>
  <Transition name="slide-panel">
    <div
      v-if="visible && enterprise"
      class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
    >
      <div class="pointer-events-auto w-[580px] max-w-[90vw] max-h-[85vh] flex flex-col overflow-hidden rounded-xl border border-cyan-400 bg-[#09224f]/60 shadow-[0_8px_40px_rgba(6,182,212,0.5)] backdrop-blur-md">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-[#0c224f]/80 to-[#091a3d]/80">
        <div class="flex items-center gap-2.5">
          <Building class="w-5 h-5 text-cyan-400" />
          <span class="text-cyan-300 font-bold text-base tracking-wider">一企一档</span>
          <span class="text-slate-400 text-sm">/ {{ enterprise.name }}</span>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-cyan-400 transition p-1.5 cursor-pointer"><X class="w-5 h-5" /></button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-3">

        <!-- Section 1: 企业基础信息 -->
        <div class="rounded-lg border border-cyan-500/20 p-3 bg-gradient-to-b from-[#0b245c]/40 to-[#071a3f]/40">
          <div class="text-cyan-300 font-bold text-sm mb-2 flex items-center gap-2"><Briefcase class="w-4 h-4" />企业基础信息</div>
          <div class="space-y-1.5 text-sm">
            <div class="flex justify-between"><span class="text-slate-400">企业名称</span><span class="text-white font-bold">{{ enterprise.name }}</span></div>
            <div class="flex justify-between"><span class="text-slate-400">统一社会信用代码</span><span class="text-cyan-300 font-mono">{{ enterprise.unifiedSocialCode }}</span></div>
            <div class="flex justify-between"><span class="text-slate-400">法人代表</span><span class="text-slate-200">{{ enterprise.legalPerson }}</span></div>
            <div class="flex justify-between"><span class="text-slate-400">联系人</span><span class="text-slate-200">{{ enterprise.environmentalContact }}</span></div>
            <div class="flex justify-between"><span class="text-slate-400">联系电话</span><span class="text-cyan-300 font-mono">{{ enterprise.phone }}</span></div>
            <div class="flex justify-between"><span class="text-slate-400">所属行业</span><span class="text-cyan-300">{{ enterprise.industryDetail }}</span></div>
            <div class="flex justify-between"><span class="text-slate-400">入驻时间</span><span class="text-slate-200">{{ enterprise.entryDate }}</span></div>
            <div class="flex justify-between"><span class="text-slate-400">所在位置</span><span class="text-slate-200">{{ enterprise.building }} {{ enterprise.floor }}</span></div>
            <div class="flex justify-between">
              <span class="text-slate-400">租赁状态</span>
              <span :class="leaseStatusClass" class="font-bold">{{ leaseStatusLabel }}</span>
            </div>
            <div class="flex justify-between"><span class="text-slate-400">租赁面积</span><span class="text-cyan-300 font-mono font-bold">{{ enterprise.leaseArea }} m²</span></div>
            <div class="flex justify-between"><span class="text-slate-400">合同期限</span><span class="text-slate-200">{{ enterprise.leaseStart }} ~ {{ enterprise.leaseEnd }}</span></div>
          </div>
        </div>

        <!-- Section 2: 环保数据看板 -->
        <div class="rounded-lg border border-cyan-500/20 p-4 bg-gradient-to-b from-[#0b245c]/40 to-[#071a3f]/40">
          <div class="text-cyan-300 font-bold text-sm mb-3 flex items-center gap-2"><Shield class="w-4 h-4" />环保数据看板</div>
          <div class="space-y-2.5 text-sm">
            <div class="flex justify-between"><span class="text-slate-400">主要产品</span><span class="text-slate-200">{{ enterprise.mainProducts }}</span></div>
            <div class="flex justify-between"><span class="text-slate-400">原辅材料</span><span class="text-slate-200">{{ enterprise.rawMaterials }}</span></div>
            <div class="flex justify-between"><span class="text-slate-400">环评纳入管理</span><span :class="enterprise.hasEIA ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'">{{ enterprise.hasEIA ? '已纳入' : '待办理' }}</span></div>
          </div>
          <div class="mt-3 rounded-lg p-3 bg-[#040e29]/60 border border-cyan-500/10">
            <div class="text-xs text-slate-400 font-bold mb-2">排污总量指标</div>
            <div class="grid grid-cols-3 gap-2 text-center text-sm">
              <div class="bg-[#0a1e4a]/60 rounded-lg p-2.5">
                <span class="text-slate-400 block text-xs">COD</span>
                <span class="text-cyan-300 font-mono font-bold text-base">{{ enterprise.emissionQuota.cod }}</span>
                <span class="text-slate-500 text-xs"> t/年</span>
              </div>
              <div class="bg-[#0a1e4a]/60 rounded-lg p-2.5">
                <span class="text-slate-400 block text-xs">氨氮</span>
                <span class="text-cyan-300 font-mono font-bold text-base">{{ enterprise.emissionQuota.ammoniaNitrogen }}</span>
                <span class="text-slate-500 text-xs"> t/年</span>
              </div>
              <div class="bg-[#0a1e4a]/60 rounded-lg p-2.5">
                <span class="text-slate-400 block text-xs">氟化物</span>
                <span :class="enterprise.emissionQuota.fluoride > 0 ? 'text-amber-400' : 'text-slate-500'" class="font-mono font-bold text-base">{{ enterprise.emissionQuota.fluoride }}</span>
                <span class="text-slate-500 text-xs"> t/年</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: 运营数据看板（紧凑单行） -->
        <div class="rounded-lg border border-cyan-500/20 p-3 bg-gradient-to-b from-[#0b245c]/40 to-[#071a3f]/40">
          <div class="text-cyan-300 font-bold text-sm mb-2 flex items-center gap-2"><TrendingUp class="w-4 h-4" />运营数据</div>
          <div class="flex gap-3 text-sm">
            <div class="flex-1 rounded-lg px-3 py-1.5 text-center bg-[#040e29]/60 border border-cyan-500/10">
              <span class="text-slate-400">月用水量</span>
              <span class="text-cyan-300 font-mono font-bold ml-1">{{ enterprise.waterUsage }}</span>
              <span class="text-slate-400"> 吨</span>
            </div>
            <div class="flex-1 rounded-lg px-3 py-1.5 text-center bg-[#040e29]/60 border border-amber-500/10">
              <span class="text-slate-400">月用电量</span>
              <span class="text-amber-400 font-mono font-bold ml-1">{{ enterprise.electricityUsage }}</span>
              <span class="text-slate-400"> kWh</span>
            </div>
          </div>
        </div>

        <!-- Section 4: 预警与事件（紧凑） -->
        <div class="rounded-lg border border-cyan-500/20 p-3 bg-gradient-to-b from-[#0b245c]/40 to-[#071a3f]/40">
          <div class="text-cyan-300 font-bold text-sm mb-2 flex items-center gap-2"><Activity class="w-4 h-4" />预警与事件记录</div>
          <div v-if="enterpriseAlerts.length === 0" class="text-sm text-emerald-400 text-center py-1.5">
            ✅ 暂无未处理预警事件
          </div>
          <div v-else class="space-y-1">
            <div v-for="alert in enterpriseAlerts" :key="alert.id" class="border border-cyan-500/15 bg-[#040e29]/60 rounded px-2.5 py-1.5 flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <span :class="alert.status === '未处置' ? 'text-rose-400' : 'text-cyan-300'" class="font-bold">{{ alert.type }}</span>
                <span class="text-slate-500 text-xs">{{ alert.pointName }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-slate-500 text-xs">{{ alert.time.slice(5) }}</span>
                <span class="px-1.5 py-0.5 rounded text-xs font-bold" :class="alert.status === '未处置' ? 'bg-rose-950/50 text-rose-400' : alert.status === '处置中' ? 'bg-amber-950/50 text-amber-400' : 'bg-emerald-950/50 text-emerald-400'">{{ alert.status }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 5: 招工信息 -->
        <div v-if="enterprise.recruitmentPositions && enterprise.recruitmentPositions.length > 0" class="rounded-lg border border-cyan-500/20 p-4 bg-gradient-to-b from-[#0b245c]/40 to-[#071a3f]/40">
          <div class="text-cyan-300 font-bold text-sm mb-3 flex items-center gap-2"><Users class="w-4 h-4" />招工信息</div>
          <div class="space-y-2">
            <div v-for="(pos, idx) in enterprise.recruitmentPositions" :key="idx" class="bg-[#040e29]/60 rounded-lg p-3 border border-cyan-500/10">
              <div class="flex justify-between items-center text-sm">
                <span class="text-cyan-300 font-bold">{{ pos.title }}</span>
                <span class="text-emerald-400 font-mono font-bold">{{ pos.count }}人</span>
              </div>
              <div class="text-slate-400 mt-1 text-xs">{{ pos.salaryRange }} · 联系：{{ pos.contact }}</div>
            </div>
          </div>
        </div>
        <div v-else class="rounded-lg border border-cyan-500/20 p-4 bg-gradient-to-b from-[#0b245c]/40 to-[#071a3f]/40 text-sm text-slate-400 text-center">
          暂无招工需求
        </div>

      </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Building, X, Briefcase, Shield, TrendingUp, Activity, Users } from 'lucide-vue-next'
import { getEnterpriseById } from '../../data/enterprises'
import { alertEvents } from '../../data/environmental'

interface Props {
  enterpriseId: string | null
  visible: boolean
}

const props = defineProps<Props>()
defineEmits<{ (e: 'close'): void }>()

const enterprise = computed(() => props.enterpriseId ? getEnterpriseById(props.enterpriseId) || null : null)

const leaseStatusLabel = computed(() => {
  if (!enterprise.value) return ''
  const map: Record<string, string> = { active: '正常履约中', expiring: '即将到期', vacant: '已退租' }
  return map[enterprise.value.leaseStatus] || enterprise.value.leaseStatus
})
const leaseStatusClass = computed(() => {
  if (!enterprise.value) return ''
  const map: Record<string, string> = { active: 'text-emerald-400', expiring: 'text-amber-400', vacant: 'text-slate-400' }
  return map[enterprise.value.leaseStatus] || 'text-slate-200'
})

const enterpriseAlerts = computed(() => {
  if (!enterprise.value) return []
  return alertEvents.filter(e => e.enterpriseName === enterprise.value?.name).slice(0, 5)
})
</script>

<style scoped>
.slide-panel-enter-active, .slide-panel-leave-active { transition: transform 0.25s ease, opacity 0.25s ease; }
.slide-panel-enter-from, .slide-panel-leave-to { transform: scale(0.95); opacity: 0; }
</style>
