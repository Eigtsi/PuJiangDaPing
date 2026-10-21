<template>
  <div :class="[isLargeScreen ? 'space-y-1.5' : 'space-y-3']">
    <div class="flex items-center justify-between">
      <span class="text-xs text-slate-300 font-semibold tracking-wide">统计年度</span>
      <el-select v-model="selectedYear" size="small" class="custom-el-select shrink-0" popper-class="custom-el-select-popper">
        <el-option v-for="y in yearOptions" :key="y.key" :label="y.label" :value="y.key" />
      </el-select>
    </div>

    <div
      @click="emit('toast', `当前展示 ${profile.label} 本园区物业费收缴与楼宇资产概况...`)"
      :class="['flex justify-between items-center bg-[#0d2a63]/30 rounded cursor-pointer hover:border-cyan-400 transition', isLargeScreen ? 'p-1.5 px-2' : 'p-2.5']"
    >
      <div>
        <span class="block mb-1 text-xs font-bold text-slate-300 tracking-wide">年物业费收入</span>
        <div class="flex items-baseline gap-1.5">
          <span :class="[isLargeScreen ? 'text-2xl' : 'text-3xl', 'font-mono font-black text-cyan-300 digital-glow tabular-nums tracking-tight']">{{ totalProperty }}</span>
          <span class="text-xs text-slate-400 font-mono font-medium">万元</span>
        </div>
      </div>
      <div class="text-right text-xs text-slate-400 font-medium font-sans">
        <span>收缴率</span>
        <span class="ml-1 font-mono font-black text-emerald-400 digital-glow-green text-base tabular-nums">{{ collectionRate }}%</span>
        <span class="block mt-1 text-xs text-slate-500 tracking-wider">按年计费</span>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-1.5 text-center">
      <div class="bg-[#051330]/40 rounded p-1 border border-cyan-500/10">
        <span class="block text-xs text-slate-400 font-semibold tracking-wide">楼宇建筑</span>
        <span :class="[isLargeScreen ? 'text-lg' : 'text-xl', 'block mt-0.5 font-mono font-black text-cyan-300 tabular-nums']">{{ buildingCount }}<span class="ml-0.5 text-xs text-slate-400 font-sans font-medium">栋</span></span>
      </div>
      <div class="bg-[#051330]/40 rounded p-1 border border-cyan-500/10">
        <span class="block text-xs text-slate-400 font-semibold tracking-wide">总建筑面积</span>
        <span :class="[isLargeScreen ? 'text-lg' : 'text-xl', 'block mt-0.5 font-mono font-black text-cyan-300 tabular-nums']">{{ totalArea }}<span class="ml-0.5 text-xs text-slate-400 font-sans font-medium">万㎡</span></span>
      </div>
      <div class="bg-[#051330]/40 rounded p-1 border border-cyan-500/10">
        <span class="block text-xs text-slate-400 font-semibold tracking-wide">整体出租率</span>
        <span :class="[isLargeScreen ? 'text-lg' : 'text-xl', 'block mt-0.5 font-mono font-black text-emerald-400 tabular-nums']">{{ rentalRate }}<span class="ml-0.5 text-xs text-slate-400 font-sans font-medium">%</span></span>
      </div>
    </div>

    <div class="bg-[#051330]/40 rounded p-1.5 border border-cyan-500/10">
      <div class="flex items-center gap-1.5 mb-1">
        <span class="w-[3px] h-3 rounded-full bg-cyan-400/80"></span>
        <span class="text-sm text-slate-300 font-semibold tracking-wide">物业费单价标准（元/年/㎡）</span>
      </div>
      <div class="flex items-center gap-1 text-center">
        <div v-for="s in feeStandards" :key="s.type" class="flex-1 bg-[#0d2a63]/40 rounded py-1">
          <span class="text-xs text-slate-400">{{ s.type }}</span>
          <span class="ml-1 text-base font-mono font-black text-cyan-300 tabular-nums">{{ s.price }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { yearFinancialProfiles, yearOptions, propertyFeeStandards, type FiscalYear } from '../../../data/financials'
import { buildingsByZone } from '../../../data/buildings'

type ParkZone = 'center' | 'east' | 'west'

defineProps<{
  isLargeScreen?: boolean
}>()

const emit = defineEmits<{
  (e: 'toast', msg: string): void
}>()

const store = useStore()
const activePark = computed(() => store.state.activePark as ParkZone)

const selectedYear = ref<FiscalYear>('2025')
const profile = computed(() => yearFinancialProfiles[selectedYear.value])

// 与右上方「所属园区」联动：只取当前所选园区的口径（金额随年度变化）
const zone = computed(() => profile.value.zones.find(z => z.zone === activePark.value) ?? profile.value.zones.find(z => z.zone === 'total')!)
const totalProperty = computed(() => zone.value.property)
const collectionRate = computed(() => zone.value.collectionRate)

// 楼宇资产为物理台账，不随年度变化
const zoneBuildings = computed(() => buildingsByZone[activePark.value] || [])
const buildingCount = computed(() => zoneBuildings.value.length)
const totalArea = computed(() => (zoneBuildings.value.reduce((s, b) => s + b.totalArea, 0) / 10000).toFixed(2))
const rentalRate = computed(() => {
  const total = zoneBuildings.value.reduce((s, b) => s + b.totalArea, 0)
  const rented = zoneBuildings.value.reduce((s, b) => s + b.rentedArea, 0)
  return total ? ((rented / total) * 100).toFixed(1) : '0.0'
})

const feeStandards = propertyFeeStandards
</script>
