<template>
  <div :class="[isLargeScreen ? 'flex-1 flex flex-col justify-between gap-3 min-h-0' : 'space-y-4']">
    <!-- Asset rental status -->
    <div class="space-y-2">
      <div class="flex items-center justify-between text-xs text-cyan-300 font-bold">
        <span>各厂房租赁状态概览</span>
        <span class="text-slate-350 font-semibold text-[10px]">综合出租率: {{ overallRate }}%</span>
      </div>

      <div class="grid grid-cols-2 gap-2 text-[10px]">
        <div v-for="b in displayBuildings" :key="b.id"
          class="bg-[#0b2152]/50 p-1.5 px-2 py-2 rounded border border-cyan-500/10 flex flex-col justify-between h-14">
          <div class="flex justify-between items-center">
            <span class="text-slate-200 font-bold">{{ b.name }}</span>
            <span class="px-1 py-0.5 rounded text-[8px]"
              :class="statusBadge(b.rentalStatus)">
              {{ statusLabel(b.rentalStatus) }}
            </span>
          </div>
          <div class="flex justify-between items-center text-[9px] text-slate-400 mt-1">
            <span class="font-mono font-bold" :class="rateColor(b.rentalRate)">{{ b.rentalRate }}% 已租</span>
            <span>{{ b.enterprises.length }} 家承租</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Lease duration stats -->
    <div class="bg-cyan-950/25 rounded border border-cyan-500/20 p-2.5 mt-2">
      <div class="flex justify-between items-center text-[10px] text-cyan-200 mb-1.5">
        <span class="font-bold">园区资产出租率统计</span>
        <span class="text-emerald-400 font-bold text-xs">续租率: 92.4%</span>
      </div>
      <div :class="['w-full bg-[#06183d] rounded-full overflow-hidden border border-cyan-500/10', isLargeScreen ? 'h-2' : 'h-1.5']">
        <div :class="['bg-gradient-to-r from-[#2dd4bf] to-emerald-400 rounded-full', isLargeScreen ? 'h-2' : 'h-1.5']" :style="{ width: overallRate + '%' }" />
      </div>
      <div class="text-[9px] text-[#cbd5e1] mt-2 leading-relaxed bg-[#0b245c]/30 p-1 rounded">
        * 楼栋总数: <span class="text-white font-bold">{{ totalBuildings }} 栋</span>
        | 厂房总面积: <span class="text-white font-bold">{{ totalArea }} m2</span>
        | 已租面积: <span class="text-white font-bold">{{ rentedArea }} m2</span>
        | 平均合同年限: <span class="text-white font-bold">2.45 年</span>
        | 本季到期预警: <span class="text-amber-300 font-bold">2 家</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { buildings, overallRentalRate } from '../../../data/buildings'

defineProps<{
  isLargeScreen?: boolean
}>()

const emit = defineEmits<{
  (e: 'toast', msg: string): void
}>()

// Show top 4 buildings by relevance (factory buildings with enterprises)
const displayBuildings = computed(() =>
  buildings.filter(b => b.enterprises.length > 0).slice(0, 4)
)

const overallRate = computed(() => overallRentalRate())

const totalBuildings = computed(() => buildings.length)

const totalArea = computed(() =>
  buildings.reduce((s, b) => s + b.totalArea, 0).toLocaleString()
)

const rentedArea = computed(() =>
  buildings.reduce((s, b) => s + b.rentedArea, 0).toLocaleString()
)

function statusBadge(status: string): string {
  if (status === 'full') return 'bg-emerald-500/20 text-emerald-400'
  if (status === 'mostly') return 'bg-teal-500/20 text-teal-300'
  if (status === 'partial') return 'bg-amber-500/20 text-amber-300'
  return 'bg-slate-500/20 text-slate-400'
}

function statusLabel(status: string): string {
  const map: Record<string, string> = { full: '满租', mostly: '稳定', partial: '部分', vacant: '空置' }
  return map[status] || status
}

function rateColor(rate: number): string {
  if (rate >= 95) return 'text-emerald-400'
  if (rate >= 80) return 'text-cyan-300'
  if (rate >= 60) return 'text-amber-300'
  return 'text-rose-400'
}
</script>
