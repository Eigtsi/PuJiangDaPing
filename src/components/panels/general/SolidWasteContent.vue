<template>
  <div :class="['font-sans', isLargeScreen ? 'space-y-2.5' : 'space-y-3.5']">
    <!-- 标题 + 按年/按月 -->
    <div class="space-y-1.5">
      <div class="flex justify-between items-center">
        <span class="text-sm text-slate-200 font-bold">固废 · 危废 · 废水量</span>
        <div class="flex items-center gap-1.5 shrink-0">
          <ExportRangeButton title="固废处置监控" granularity="date" :default-range="exportRange" @export="handleExport" />
          <div class="flex items-center text-xs rounded border border-cyan-500/30 overflow-hidden shrink-0">
            <button type="button" @click="viewMode = 'year'" :class="['px-2.5 py-0.5 cursor-pointer transition', viewMode === 'year' ? 'bg-cyan-500/25 text-cyan-300' : 'text-slate-400 hover:text-cyan-300']">按年</button>
            <button type="button" @click="viewMode = 'month'" :class="['px-2.5 py-0.5 cursor-pointer transition border-l border-cyan-500/30', viewMode === 'month' ? 'bg-cyan-500/25 text-cyan-300' : 'text-slate-400 hover:text-cyan-300']">按月</button>
          </div>
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

    <!-- 三废量（固废 / 危废 / 废水）：名称、数量、单位三行 -->
    <div class="grid grid-cols-3 gap-2 text-center">
      <div class="bg-gradient-to-b from-[#0a235c] to-[#041235] border border-cyan-500/20 rounded p-2.5">
        <span class="block text-sm text-slate-300 font-sans">固废量</span>
        <span class="block font-black text-cyan-300 font-mono text-2xl mt-1 leading-none">{{ wasteDisplay.solid.value }}</span>
        <span class="block text-sm text-slate-300 mt-1">{{ wasteDisplay.solid.unit }}</span>
      </div>
      <div class="bg-gradient-to-b from-[#3b0d2a] to-[#1a0a18] border border-rose-500/20 rounded p-2.5">
        <span class="block text-sm text-slate-300 font-sans">危废量</span>
        <span class="block font-black text-rose-300 font-mono text-2xl mt-1 leading-none">{{ wasteDisplay.hazardous.value }}</span>
        <span class="block text-sm text-slate-300 mt-1">{{ wasteDisplay.hazardous.unit }}</span>
      </div>
      <div class="bg-gradient-to-b from-[#08283f] to-[#04172a] border border-sky-500/20 rounded p-2.5">
        <span class="block text-sm text-slate-300 font-sans">废水量</span>
        <span class="block font-black text-sky-300 font-mono text-2xl mt-1 leading-none">{{ wasteDisplay.wastewater.value }}</span>
        <span class="block text-sm text-slate-300 mt-1">{{ wasteDisplay.wastewater.unit }}</span>
      </div>
    </div>

    <!-- 收运中转记录（近7天，点击车辆查询过磅详情） -->
    <div :class="['bg-[#051330]/40 rounded border border-cyan-500/10', isLargeScreen ? 'p-2' : 'p-2.5']">
      <div class="mb-1.5">
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm text-cyan-300 font-bold">🚛 收运中转记录</span>
          <div class="flex items-center text-xs rounded border border-cyan-500/30 overflow-hidden shrink-0">
            <button type="button" @click="timeMode = 'recent'" :class="['px-2.5 py-0.5 cursor-pointer transition', timeMode === 'recent' ? 'bg-cyan-500/25 text-cyan-300' : 'text-slate-400 hover:text-cyan-300']">近7天</button>
            <button type="button" @click="timeMode = 'custom'" :class="['px-2.5 py-0.5 cursor-pointer transition border-l border-cyan-500/30', timeMode === 'custom' ? 'bg-cyan-500/25 text-cyan-300' : 'text-slate-400 hover:text-cyan-300']">时间</button>
          </div>
        </div>
        <el-date-picker
          v-if="timeMode === 'custom'"
          v-model="recordRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          size="small"
          :clearable="false"
          class="record-range-picker"
          popper-class="export-range-popper"
        />
      </div>

      <!-- 总量统计（固废/废水按运输净重合计，危废按平台手动导入合计） -->
      <div class="grid grid-cols-3 gap-2 mb-1.5 text-center">
        <div class="bg-cyan-500/5 border border-cyan-500/15 rounded px-1 py-1">
          <span class="block text-[11px] text-slate-400">固废总量</span>
          <span class="block font-mono text-sm text-cyan-300 tabular-nums">{{ wasteTotals.solid.toFixed(2) }} 吨</span>
        </div>
        <div class="bg-rose-500/5 border border-rose-500/15 rounded px-1 py-1">
          <span class="block text-[11px] text-slate-400">危废总量</span>
          <span class="block font-mono text-sm text-rose-300 tabular-nums">{{ wasteTotals.hazardous.toFixed(2) }} 吨</span>
        </div>
        <div class="bg-sky-500/5 border border-sky-500/15 rounded px-1 py-1">
          <span class="block text-[11px] text-slate-400">废水总量</span>
          <span class="block font-mono text-sm text-sky-300 tabular-nums">{{ wasteTotals.wastewater.toFixed(2) }} 吨</span>
        </div>
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
import ExportRangeButton from '../../shared/ExportRangeButton.vue'
import { downloadExcel } from '../../../utils/exportExcel'

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

// 拆分「数量 + 单位」字符串（如 "3000 吨"）用于三行展示
function splitValueUnit(s: string): { value: string; unit: string } {
  const m = s.trim().match(/^([\d.]+)\s*(.*)$/)
  return m ? { value: m[1], unit: m[2] } : { value: s, unit: '' }
}

const wasteDisplay = computed(() => ({
  solid: splitValueUnit(wastes.value.solid),
  hazardous: splitValueUnit(wastes.value.hazardous),
  wastewater: splitValueUnit(wastes.value.wastewater),
}))

// ===== 导出（自由选择具体日期范围，导出收运中转记录明细） =====
const exportRange: [string, string] = ['2026-10-22', '2026-10-28']

// 从流水号提取收运日期（PF20261028001 -> 2026-10-28）
function recordDate(r: { serial: string }): string {
  const s = r.serial.slice(2, 10)
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`
}

function handleExport(start: string, end: string) {
  const records = transferRecords.filter((r) => {
    const d = recordDate(r)
    return d >= start && d <= end
  })
  const sumNet = (cat: string) =>
    records
      .filter((r) => r.category === cat)
      .reduce((s, r) => s + (parseFloat(r.net) || 0), 0)

  const headers = ['收运日期', '流水号', '车牌号', '类别', '收运时间', '毛重（吨）', '皮重（吨）', '净重（吨）', '皮重时间']
  const rows = records.map((r) => [
    recordDate(r),
    r.serial,
    r.plate,
    r.category,
    r.time,
    r.gross,
    r.tare,
    r.net,
    r.tareTime,
  ])
  // 危废总量：平台手动导入数据（非车辆运输），按日期范围合计
  const hazardous = hazardousImports
    .filter((i) => i.date >= start && i.date <= end)
    .reduce((s, i) => s + i.amount, 0)
  // 末尾追加总量统计行（固废/废水净重合计，危废为手动导入合计）
  rows.push(['', '', '', '固废总量', '', '', '', round2(sumNet('固废')), ''])
  rows.push(['', '', '', '危废总量', '', '', '', round2(hazardous), ''])
  rows.push(['', '', '', '废水总量', '', '', '', round2(sumNet('废水')), ''])
  downloadExcel(`固废处置监控_${start}_${end}`, headers, rows)
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

// 收运中转记录：点击车辆查询过磅详情（流水号/车牌号/毛重/皮重/净重/皮重时间）
// 生成近 3 个月演示数据（2026-08-01 ~ 2026-10-28，每天固废/废水各 1 条；危废为平台手动导入，不走收运）
interface TransferRecord {
  serial: string
  plate: string
  category: string
  time: string
  gross: string
  tare: string
  net: string
  tareTime: string
}

const transferPlates = ['浙G·D3852', '浙G·A1176', '浙G·E8821', '浙G·G4519', '浙G·B2093', '浙G·F7310', '浙G·H6037', '浙G·C5568']

const transferRecords: TransferRecord[] = (() => {
  const pads = (n: number, len = 2) => String(n).padStart(len, '0')
  const dayMs = 24 * 60 * 60 * 1000
  const startDay = new Date(2026, 7, 1) // 2026-08-01
  const endDay = new Date(2026, 9, 28) // 2026-10-28
  const catDefs = [
    { cat: '固废', hour: 9, netBase: 9, span: 5 },
    { cat: '废水', hour: 15, netBase: 22, span: 9 },
  ]
  const list: TransferRecord[] = []
  for (let t = startDay.getTime(); t <= endDay.getTime(); t += dayMs) {
    const d = new Date(t)
    const dayIdx = Math.round((t - startDay.getTime()) / dayMs)
    const ymd = `${d.getFullYear()}${pads(d.getMonth() + 1)}${pads(d.getDate())}`
    catDefs.forEach((c, ci) => {
      const net = c.netBase + (dayIdx % c.span) + ((dayIdx + ci) % 10) * 0.1
      const tare = 6.0 + (dayIdx % 5) * 0.1
      const minute = 10 + ((dayIdx * 7 + ci * 13) % 45)
      const dt = new Date(d)
      dt.setHours(c.hour, minute, 0, 0)
      const tareDt = new Date(dt.getTime() - 18 * 60 * 1000)
      const fmtHM = (x: Date) => `${pads(x.getHours())}:${pads(x.getMinutes())}`
      const fmtFull = (x: Date) => `${pads(x.getMonth() + 1)}-${pads(x.getDate())} ${fmtHM(x)}`
      list.push({
        serial: `PF${ymd}${pads(ci + 1, 3)}`,
        plate: transferPlates[(dayIdx + ci) % transferPlates.length],
        category: c.cat,
        time: fmtFull(dt),
        gross: (net + tare).toFixed(2),
        tare: tare.toFixed(1),
        net: net.toFixed(2),
        tareTime: fmtFull(tareDt),
      })
    })
  }
  return list
})()

// 收运中转记录：时间筛选模式（默认近7天，可切换自定义时间段）+ 车牌号 / 流水号搜索
const searchQuery = ref('')
const timeMode = ref<'recent' | 'custom'>('recent')
const recordRange = ref<[string, string]>(['2026-10-22', '2026-10-28'])

// 近7天固定范围
const RECENT_RANGE: [string, string] = ['2026-10-22', '2026-10-28']

// 当前生效的日期范围（近7天或自定义时间段）
const activeRange = computed<[string, string]>(() =>
  timeMode.value === 'recent' ? RECENT_RANGE : recordRange.value
)

const filteredRecords = computed(() => {
  const [start, end] = activeRange.value
  const list = transferRecords.filter((r) => {
    const d = recordDate(r)
    return (!start || d >= start) && (!end || d <= end)
  })
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return list
  return list.filter((r) => r.plate.toLowerCase().includes(q) || r.serial.toLowerCase().includes(q))
})

// 危废手动导入数据（平台录入，非车辆运输）：生成近 3 个月每天一条
const hazardousImports: { date: string; amount: number }[] = (() => {
  const pads = (n: number) => String(n).padStart(2, '0')
  const dayMs = 24 * 60 * 60 * 1000
  const startDay = new Date(2026, 7, 1)
  const endDay = new Date(2026, 9, 28)
  const list: { date: string; amount: number }[] = []
  for (let t = startDay.getTime(); t <= endDay.getTime(); t += dayMs) {
    const d = new Date(t)
    const dayIdx = Math.round((t - startDay.getTime()) / dayMs)
    const date = `${d.getFullYear()}-${pads(d.getMonth() + 1)}-${pads(d.getDate())}`
    list.push({ date, amount: +(1.5 + (dayIdx % 6) * 0.2).toFixed(2) })
  }
  return list
})()

// 固废/危废/废水总量：固废、废水按运输记录净重合计；危废按平台手动导入数据合计
const wasteTotals = computed(() => {
  const [start, end] = activeRange.value
  const sumNet = (cat: string) =>
    filteredRecords.value
      .filter((r) => r.category === cat)
      .reduce((s, r) => s + (parseFloat(r.net) || 0), 0)
  const hazardous = hazardousImports
    .filter((i) => i.date >= start && i.date <= end)
    .reduce((s, i) => s + i.amount, 0)
  return { solid: sumNet('固废'), hazardous, wastewater: sumNet('废水') }
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

/* 收运中转记录日期范围输入框深色主题 */
:deep(.record-range-picker) {
  width: 100%;
}
:deep(.record-range-picker .el-input__wrapper) {
  background-color: #0b2152 !important;
  box-shadow: 0 0 0 1px rgba(6, 182, 212, 0.35) inset !important;
  border-radius: 4px;
}
:deep(.record-range-picker .el-range-input) {
  color: #22d3ee !important;
  font-family: monospace;
  font-size: 12px;
}
:deep(.record-range-picker .el-range-separator) {
  color: #64748b !important;
  font-size: 12px;
}
:deep(.record-range-picker .el-range__icon),
:deep(.record-range-picker .el-range__close-icon) {
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

<style>
/* daterange 下拉面板深色主题补充（teleport 到 body，复用 export-range-popper 容器背景） */
.export-range-popper .el-date-table td .cell { color: #cbd5e1; }
.export-range-popper .el-date-table td .cell:hover { color: #00f2ff; }
.export-range-popper .el-date-table td.today .cell { color: #00f2ff; }
.export-range-popper .el-date-table td.in-range .cell { background-color: rgba(0, 242, 255, 0.18); color: #00f2ff; }
.export-range-popper .el-date-table td.start-date .cell,
.export-range-popper .el-date-table td.end-date .cell { background-color: #00f2ff; color: #04101f; font-weight: 700; }
.export-range-popper .el-date-table td.disabled .cell { color: #334155; }
.export-range-popper .el-date-table th { color: #64748b; }
</style>
