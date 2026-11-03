<template>
  <div :class="['font-sans text-sm', isLargeScreen ? 'space-y-1.5' : 'space-y-3']">
    <!-- 年度筛选 + 导出 -->
    <div class="flex items-center justify-end gap-1.5">
      <el-select v-model="selectedYear" size="small" class="residue-year-select shrink-0" popper-class="residue-year-popper">
        <el-option v-for="y in residueYears" :key="y" :label="`${y}年度`" :value="y" />
      </el-select>
      <button
        type="button"
        @click="handleExport"
        class="flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium text-cyan-300 border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/25 hover:text-cyan-200 transition cursor-pointer shrink-0"
      >
        <Download class="w-3 h-3" />
        导出
      </button>
    </div>

    <!-- 年度汇总 KPI：核定企业数 / 核定设备数 / 缴费金额 -->
    <div class="grid grid-cols-3 gap-1.5 text-center">
      <div class="bg-[#051330]/40 rounded p-1.5 border border-cyan-500/10">
        <span class="block text-xs text-slate-400 font-semibold tracking-wide">核定企业数</span>
        <span :class="[isLargeScreen ? 'text-lg' : 'text-xl', 'block mt-0.5 font-mono font-black text-cyan-300 tabular-nums']">{{ totalEnterprises }}<span class="ml-0.5 text-xs text-slate-400 font-sans font-medium">家</span></span>
      </div>
      <div class="bg-[#051330]/40 rounded p-1.5 border border-emerald-500/10">
        <span class="block text-xs text-slate-400 font-semibold tracking-wide">核定设备数</span>
        <span :class="[isLargeScreen ? 'text-lg' : 'text-xl', 'block mt-0.5 font-mono font-black text-emerald-400 tabular-nums']">{{ totalDevices }}<span class="ml-0.5 text-xs text-slate-400 font-sans font-medium">台</span></span>
      </div>
      <div class="bg-[#051330]/40 rounded p-1.5 border border-amber-500/10">
        <span class="block text-xs text-slate-400 font-semibold tracking-wide">缴费金额</span>
        <span :class="[isLargeScreen ? 'text-lg' : 'text-xl', 'block mt-0.5 font-mono font-black text-amber-300 tabular-nums']">{{ totalAmountText }}<span class="ml-0.5 text-xs text-slate-400 font-sans font-medium">元</span></span>
      </div>
    </div>

    <!-- 分档征管明细（档位 / 对应价格 / 核定企业数 / 核定设备数 / 缴费金额） -->
    <div>
      <div class="flex items-center gap-1.5 mb-1">
        <span class="w-[3px] h-3.5 rounded-full bg-cyan-400/80"></span>
        <span class="text-sm text-slate-300 font-semibold tracking-wide">分档征管明细</span>
      </div>
      <div class="space-y-1.5">
        <div v-for="t in tiers" :key="t.tier" class="bg-[#06183d]/45 border border-cyan-500/10 rounded p-2">
          <div class="flex items-center justify-center gap-3">
            <span class="text-slate-200 font-bold text-xs">{{ t.tier }}</span>
            <span class="font-mono text-amber-300 text-xs font-bold">
              {{ t.price }}<span class="text-slate-400 ml-0.5 font-normal">元/年/台</span>
            </span>
          </div>
          <div class="grid grid-cols-3 mt-1 text-[11px] text-slate-400 text-center">
            <span>核定企业 <span class="font-mono text-slate-200">{{ t.enterpriseCount }}</span> 家</span>
            <span>核定设备 <span class="font-mono text-slate-200">{{ t.deviceCount }}</span> 台</span>
            <span>缴费 <span class="font-mono text-cyan-200 font-bold">{{ t.amount }}</span> 元</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Download } from 'lucide-vue-next'
import { residueYears, residueYearTiers } from '../../../data/environmental'
import { downloadExcel } from '../../../utils/exportExcel'

defineProps<{
  isLargeScreen?: boolean
}>()

const selectedYear = ref(residueYears[0] ?? '2025')
const tiers = computed(() => residueYearTiers[selectedYear.value] ?? [])

// 年度汇总：核定企业数 / 核定设备数 / 缴费金额
const totalEnterprises = computed(() => tiers.value.reduce((s, t) => s + t.enterpriseCount, 0))
const totalDevices = computed(() => tiers.value.reduce((s, t) => s + t.deviceCount, 0))
const totalAmount = computed(() => tiers.value.reduce((s, t) => s + t.amount, 0))
const totalAmountText = computed(() => totalAmount.value.toLocaleString('zh-CN'))

// 导出当前所选年度分档数据
function handleExport() {
  const headers = ['档位', '对应价格（元/年/台）', '核定企业数', '核定设备数（台）', '缴费金额（元）']
  const rows = tiers.value.map((t) => [t.tier, t.price, t.enterpriseCount, t.deviceCount, t.amount])
  rows.push(['合计', '', totalEnterprises.value, totalDevices.value, totalAmount.value])
  downloadExcel(`废渣处置_${selectedYear.value}年度`, headers, rows)
}
</script>

<style scoped>
:deep(.residue-year-select) {
  width: 96px;
}
:deep(.residue-year-select .el-select__wrapper) {
  background-color: #0b2152 !important;
  border: 1px solid rgba(6, 182, 212, 0.35) !important;
  box-shadow: none !important;
  border-radius: 4px;
  height: 26px !important;
  min-height: 26px !important;
}
:deep(.residue-year-select .el-select__selected-item) {
  color: #22d3ee !important;
  font-family: monospace;
  font-size: 12px;
}
:deep(.residue-year-select .el-select__caret) {
  color: #22d3ee !important;
}
</style>

<style>
/* 年度下拉面板深色主题（teleport 到 body） */
.residue-year-popper {
  background-color: #0b2152 !important;
  border: 1px solid rgba(6, 182, 212, 0.45) !important;
}
.residue-year-popper .el-select-dropdown__item {
  color: #cbd5e1;
}
.residue-year-popper .el-select-dropdown__item.is-hovering {
  background-color: rgba(0, 242, 255, 0.12);
  color: #00f2ff;
}
.residue-year-popper .el-select-dropdown__item.is-selected {
  color: #00f2ff;
  font-weight: 700;
}
</style>
