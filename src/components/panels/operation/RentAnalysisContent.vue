<template>
  <div :class="[isLargeScreen ? 'space-y-1.5' : 'space-y-3']">
    <div class="flex items-center justify-between">
      <span class="text-xs text-slate-300 font-semibold tracking-wide">统计年度</span>
      <el-select v-model="selectedYear" size="small" class="custom-el-select shrink-0" popper-class="custom-el-select-popper">
        <el-option v-for="y in yearOptions" :key="y.key" :label="y.label" :value="y.key" />
      </el-select>
    </div>

    <div
      @click="emit('toast', `当前展示 ${profile.label} 本园区年租金收入与年度收缴概况...`)"
      :class="['flex justify-between items-center bg-[#0d2a63]/30 rounded cursor-pointer hover:border-cyan-400 transition', isLargeScreen ? 'p-1.5 px-2' : 'p-2.5']"
    >
      <div>
        <span class="block mb-1 text-xs font-bold text-slate-300 tracking-wide">年租金收入</span>
        <div class="flex items-baseline gap-1.5">
          <span :class="[isLargeScreen ? 'text-2xl' : 'text-3xl', 'font-mono font-black text-cyan-300 digital-glow tabular-nums tracking-tight']">{{ totalRent }}</span>
          <span class="text-xs text-slate-400 font-mono font-medium">万元</span>
        </div>
      </div>
      <div class="text-right text-xs text-slate-400 font-medium font-sans">
        <span>收缴率</span>
        <span class="ml-1 font-mono font-black text-emerald-400 digital-glow-green text-base tabular-nums">{{ collectionRate }}%</span>
        <span class="block mt-1 text-xs text-slate-500 tracking-wider">按年计费</span>
      </div>
    </div>

    <div class="flex items-center gap-1.5 mb-1">
      <span class="w-[3px] h-3.5 rounded-full bg-cyan-400/80"></span>
      <span class="text-sm text-slate-300 font-semibold tracking-wide">年租金构成</span>
    </div>
    <TechBarChart :xData="typeLabels" :series="typeSeries" :height="84" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import TechBarChart from '../../charts/TechBarChart.vue'
import { yearFinancialProfiles, yearOptions, type FiscalYear } from '../../../data/financials'

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

// 与右上方「所属园区」联动：只取当前所选园区的口径
const zone = computed(() => profile.value.zones.find(z => z.zone === activePark.value) ?? profile.value.zones.find(z => z.zone === 'total')!)
const totalRent = computed(() => zone.value.rent)
const collectionRate = computed(() => zone.value.collectionRate)

const typeLabels = computed(() => profile.value.rentByType.map(t => t.type))
const typeSeries = computed(() => [{
  name: '年租金',
  data: profile.value.rentByType.map(t => t.rent),
  colors: ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
}])
</script>
