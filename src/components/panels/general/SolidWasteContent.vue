<template>
  <div :class="['font-sans', isLargeScreen ? 'space-y-2.5' : 'space-y-3.5']">
    <!-- 标题 + 按年/按月 -->
    <div class="space-y-1.5">
      <div class="flex justify-between items-center">
        <span class="text-sm text-slate-200 font-bold">固废 · 危废 · 废水量</span>
        <div class="flex items-center text-xs rounded border border-cyan-500/30 overflow-hidden shrink-0">
          <button type="button" @click="viewMode = 'year'" :class="['px-2.5 py-0.5 cursor-pointer transition', viewMode === 'year' ? 'bg-cyan-500/25 text-cyan-300' : 'text-slate-400 hover:text-cyan-300']">按年</button>
          <button type="button" @click="viewMode = 'month'" :class="['px-2.5 py-0.5 cursor-pointer transition border-l border-cyan-500/30', viewMode === 'month' ? 'bg-cyan-500/25 text-cyan-300' : 'text-slate-400 hover:text-cyan-300']">按月</button>
        </div>
      </div>
      <div class="flex items-center gap-1.5">
        <el-select
          v-model="selectedYear"
          size="small"
          class="w-24 custom-el-select"
          popper-class="custom-el-select-popper"
        >
          <el-option label="2025年" value="2025" />
          <el-option label="2026年" value="2026" />
        </el-select>
        <el-select
          v-if="viewMode === 'month'"
          v-model="selectedMonth"
          size="small"
          class="w-20 custom-el-select"
        >
          <el-option v-for="m in 12" :key="m" :label="`${m}月`" :value="m" />
        </el-select>
      </div>
    </div>

    <!-- 三废量（固废 / 危废 / 废水） -->
    <div class="grid grid-cols-3 gap-2 text-center">
      <div class="bg-gradient-to-b from-[#0a235c] to-[#041235] border border-cyan-500/20 rounded p-2.5">
        <span class="block text-sm text-slate-300 font-sans">固废量</span>
        <span class="block font-black text-cyan-300 font-mono text-2xl mt-1">{{ wastes.solid }}</span>
      </div>
      <div class="bg-gradient-to-b from-[#3b0d2a] to-[#1a0a18] border border-rose-500/20 rounded p-2.5">
        <span class="block text-sm text-slate-300 font-sans">危废量</span>
        <span class="block font-black text-rose-300 font-mono text-2xl mt-1">{{ wastes.hazardous }}</span>
      </div>
      <div class="bg-gradient-to-b from-[#08283f] to-[#04172a] border border-sky-500/20 rounded p-2.5">
        <span class="block text-sm text-slate-300 font-sans">废水量</span>
        <span class="block font-black text-sky-300 font-mono text-2xl mt-1">{{ wastes.wastewater }}</span>
      </div>
    </div>

    <!-- 收运中转记录（近7天，点击车辆查询过磅详情） -->
    <div :class="['bg-[#051330]/40 rounded border border-cyan-500/10', isLargeScreen ? 'p-2' : 'p-2.5']">
      <div class="flex justify-between items-center mb-1.5">
        <span class="text-sm text-cyan-300 font-bold">🚛 收运中转记录</span>
        <span class="text-xs text-slate-500">近7天</span>
      </div>

      <!-- 搜索框 -->
      <div class="relative mb-1.5">
        <Search class="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索车牌号 / 流水号"
          class="w-full bg-[#051330]/80 border border-cyan-500/20 rounded pl-7 pr-2 py-1.5 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400/50 font-mono"
        />
      </div>

      <!-- 记录列表（可滚动） -->
      <div class="space-y-0.5 text-sm max-h-[320px] overflow-y-auto transfer-list pr-1">
        <div v-if="!filteredRecords.length" class="text-xs text-slate-500 text-center py-2">未查询到匹配车辆</div>
        <div v-for="r in filteredRecords" :key="r.serial" class="border-b border-cyan-500/5 last:border-0">
          <div
            @click="toggleRecord(r.serial)"
            class="flex items-center gap-2 py-1 cursor-pointer hover:bg-cyan-500/5 rounded px-0.5 transition"
          >
            <span class="font-mono text-white whitespace-nowrap">{{ r.plate }}</span>
            <span :class="['px-1 py-0.5 rounded text-xs font-sans whitespace-nowrap', catClass(r.category)]">{{ r.category }}</span>
            <span class="font-mono text-slate-200 whitespace-nowrap ml-auto text-xs">{{ r.time }}</span>
            <ChevronDown :class="['w-3.5 h-3.5 text-slate-500 transition-transform shrink-0', expandedSerial === r.serial ? 'rotate-180' : '']" />
          </div>
          <!-- 过磅详情 -->
          <div v-if="expandedSerial === r.serial" class="mb-1 ml-1 pl-2.5 border-l border-cyan-500/30 text-sm font-mono space-y-1 py-1">
            <div class="flex justify-between gap-2"><span class="text-slate-300 font-sans text-xs shrink-0">流水号</span><span class="text-white text-right">{{ r.serial }}</span></div>
            <div class="flex justify-between gap-2"><span class="text-slate-300 font-sans text-xs shrink-0">车牌号</span><span class="text-white text-right">{{ r.plate }}</span></div>
            <div class="flex justify-between gap-2"><span class="text-slate-300 font-sans text-xs shrink-0">毛重</span><span class="text-white text-right">{{ r.gross }} 吨</span></div>
            <div class="flex justify-between gap-2"><span class="text-slate-300 font-sans text-xs shrink-0">皮重</span><span class="text-white text-right">{{ r.tare }} 吨</span></div>
            <div class="flex justify-between gap-2"><span class="text-slate-300 font-sans text-xs shrink-0">净重</span><span class="text-cyan-200 font-bold text-right">{{ r.net }} 吨</span></div>
            <div class="flex justify-between gap-2"><span class="text-slate-300 font-sans text-xs shrink-0">皮重时间</span><span class="text-white text-right">{{ r.tareTime }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown, Search } from 'lucide-vue-next'

withDefaults(defineProps<{
  isLargeScreen?: boolean
}>(), {
  isLargeScreen: true
})

const selectedYear = ref('2025')
const viewMode = ref<'year' | 'month'>('year')
const selectedMonth = ref(1)

// 实际可查数据：固废量 / 危废量 / 废水量
const wasteYearData: Record<string, { solid: string; hazardous: string; wastewater: string }> = {
  '2025': { solid: '3000 吨', hazardous: '800 吨', wastewater: '12500 吨' },
  '2026': { solid: '3450 吨', hazardous: '920 吨', wastewater: '13800 吨' },
}

// 按月统计：把年度总量按各月权重分摊（演示数据，真实月度数据可直接替换）
function monthlyFromYear(key: string) {
  const y = wasteYearData[key]
  const num = (s: string) => parseInt(s, 10)
  const base = { solid: num(y.solid), hazardous: num(y.hazardous), wastewater: num(y.wastewater) }
  const weights = [6, 7, 8, 8, 9, 9, 10, 10, 9, 9, 8, 7]
  const sum = weights.reduce((a, b) => a + b, 0)
  return weights.map((w) => {
    const r = w / sum
    return {
      solid: `${Math.round(base.solid * r)} 吨`,
      hazardous: `${Math.round(base.hazardous * r)} 吨`,
      wastewater: `${Math.round(base.wastewater * r)} 吨`,
    }
  })
}

const monthlyData = computed<Record<string, ReturnType<typeof monthlyFromYear>>>(() => ({
  '2025': monthlyFromYear('2025'),
  '2026': monthlyFromYear('2026'),
}))

const wastes = computed(() => {
  if (viewMode.value === 'month') {
    const list = monthlyData.value[selectedYear.value] || []
    return list[selectedMonth.value - 1] || list[0] || wasteYearData['2025']
  }
  return wasteYearData[selectedYear.value] || wasteYearData['2025']
})

// 收运中转记录：点击车辆查询过磅详情（流水号/车牌号/毛重/皮重/净重/皮重时间）
const transferRecords = [
  { serial: 'PF20261028001', plate: '浙G·D3852', category: '固废', time: '10-28 09:12', gross: '18.60', tare: '6.10', net: '12.50', tareTime: '10-28 08:55' },
  { serial: 'PF20261028002', plate: '浙G·A1176', category: '危废', time: '10-28 10:40', gross: '11.20', tare: '6.40', net: '4.80', tareTime: '10-28 10:22' },
  { serial: 'PF20261028003', plate: '浙G·E8821', category: '固废', time: '10-28 14:20', gross: '19.40', tare: '6.20', net: '13.20', tareTime: '10-28 14:02' },
  { serial: 'PF20261028004', plate: '浙G·G4519', category: '废水', time: '10-28 16:55', gross: '28.50', tare: '6.00', net: '22.50', tareTime: '10-28 16:40' },
  { serial: 'PF20261027001', plate: '浙G·B2093', category: '废水', time: '10-27 16:05', gross: '36.00', tare: '6.00', net: '30.00', tareTime: '10-27 15:48' },
  { serial: 'PF20261027002', plate: '浙G·F7310', category: '固废', time: '10-27 08:30', gross: '15.30', tare: '6.10', net: '9.20', tareTime: '10-27 08:12' },
  { serial: 'PF20261027003', plate: '浙G·H6037', category: '危废', time: '10-27 11:15', gross: '12.90', tare: '6.30', net: '6.60', tareTime: '10-27 10:58' },
  { serial: 'PF20261027004', plate: '浙G·D3852', category: '固废', time: '10-27 18:30', gross: '16.80', tare: '6.10', net: '10.70', tareTime: '10-27 18:12' },
  { serial: 'PF20261026001', plate: '浙G·C5568', category: '危废', time: '10-26 14:22', gross: '13.80', tare: '6.50', net: '7.30', tareTime: '10-26 14:05' },
  { serial: 'PF20261026002', plate: '浙G·A1176', category: '废水', time: '10-26 09:40', gross: '32.60', tare: '6.00', net: '26.60', tareTime: '10-26 09:25' },
  { serial: 'PF20261026003', plate: '浙G·F7310', category: '危废', time: '10-26 15:10', gross: '14.50', tare: '6.50', net: '8.00', tareTime: '10-26 14:52' },
  { serial: 'PF20261025001', plate: '浙G·B2093', category: '固废', time: '10-25 08:50', gross: '17.20', tare: '6.10', net: '11.10', tareTime: '10-25 08:35' },
  { serial: 'PF20261025002', plate: '浙G·C5568', category: '废水', time: '10-25 13:45', gross: '30.10', tare: '6.00', net: '24.10', tareTime: '10-25 13:30' },
  { serial: 'PF20261024001', plate: '浙G·H6037', category: '固废', time: '10-24 10:05', gross: '16.40', tare: '6.20', net: '10.20', tareTime: '10-24 09:48' },
  { serial: 'PF20261023001', plate: '浙G·E8821', category: '危废', time: '10-23 14:30', gross: '11.80', tare: '6.40', net: '5.40', tareTime: '10-23 14:12' },
  { serial: 'PF20261022001', plate: '浙G·G4519', category: '固废', time: '10-22 09:15', gross: '18.90', tare: '6.10', net: '12.80', tareTime: '10-22 08:58' },
]

// 按车牌号 / 流水号搜索
const searchQuery = ref('')
const filteredRecords = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return transferRecords
  return transferRecords.filter(
    (r) => r.plate.toLowerCase().includes(q) || r.serial.toLowerCase().includes(q)
  )
})

const expandedSerial = ref<string | null>(null)
function toggleRecord(serial: string) {
  expandedSerial.value = expandedSerial.value === serial ? null : serial
}

function catClass(cat: string) {
  if (cat === '固废') return 'bg-cyan-500/15 text-cyan-300'
  if (cat === '危废') return 'bg-rose-500/15 text-rose-300'
  return 'bg-sky-500/15 text-sky-300'
}
</script>

<style scoped>
:deep(.custom-el-select .el-select__wrapper) {
  background-color: #0b2152 !important;
  border: 1px solid rgba(6, 182, 212, 0.35) !important;
  box-shadow: none !important;
  color: #22d3ee !important;
  border-radius: 4px;
  height: 28px !important;
}

:deep(.custom-el-select .el-select__placeholder) {
  color: #22d3ee !important;
  font-family: monospace;
  font-size: 11px;
}

:deep(.custom-el-select .el-select__caret) {
  color: #22d3ee !important;
}

/* 收运中转记录列表滚动条 */
.transfer-list::-webkit-scrollbar {
  width: 6px;
}

.transfer-list::-webkit-scrollbar-track {
  background: rgba(5, 19, 48, 0.4);
  border-radius: 3px;
}

.transfer-list::-webkit-scrollbar-thumb {
  background: rgba(6, 182, 212, 0.4);
  border-radius: 3px;
}

.transfer-list::-webkit-scrollbar-thumb:hover {
  background: rgba(6, 182, 212, 0.7);
}
</style>
