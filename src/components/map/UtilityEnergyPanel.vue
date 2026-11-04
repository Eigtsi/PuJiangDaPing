<template>
  <div class="sticky top-0 z-10 -mx-3 px-3 py-1.5 bg-[#09224f]/60 backdrop-blur-xl rounded-md">
    <!-- 标题 + 月/年切换 + 周期筛选 + 导出 -->
    <div class="flex items-center justify-between mb-1.5">
      <span class="text-sm text-cyan-300 font-bold">用能详情</span>
      <div class="flex items-center gap-1">
        <div class="flex items-center rounded border border-cyan-500/30 p-0.5 shrink-0">
          <button
            type="button"
            @click="setGranularity('month')"
            :class="['px-1.5 py-0.5 rounded-sm text-xs font-medium transition cursor-pointer', granularity === 'month' ? 'bg-cyan-500/25 text-cyan-300' : 'text-slate-400 hover:text-slate-200']"
          >月</button>
          <button
            type="button"
            @click="setGranularity('year')"
            :class="['px-1.5 py-0.5 rounded-sm text-xs font-medium transition cursor-pointer', granularity === 'year' ? 'bg-cyan-500/25 text-cyan-300' : 'text-slate-400 hover:text-slate-200']"
          >年</button>
        </div>
        <el-select v-model="periodModel" size="small" class="energy-period-select">
          <el-option v-for="o in periodOptions" :key="o.key" :label="o.label" :value="o.key" />
        </el-select>
        <button
          type="button"
          @click="handleExport"
          class="flex items-center gap-0.5 text-xs text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 rounded px-1.5 py-0.5 cursor-pointer transition"
        >
          <Download class="w-3.5 h-3.5" /> 导出
        </button>
      </div>
    </div>

    <!-- 电 -->
    <div class="mb-1.5">
      <div class="grid grid-cols-3 items-center gap-2 text-xs mb-1">
        <div class="text-center text-amber-300 font-bold">⚡ 电</div>
        <div class="text-center font-mono text-slate-300 tabular-nums">总 {{ fmt(energy.electricity.total) }} kWh</div>
        <div class="text-center font-mono text-slate-300 tabular-nums">总 {{ fmt(energy.electricity.cost) }} 元</div>
      </div>
      <div class="space-y-1">
        <div v-for="d in energy.electricity.details" :key="d.name" class="grid grid-cols-3 items-center gap-2 text-xs">
          <div class="flex items-center justify-center gap-1 text-slate-300 min-w-0">
            <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :style="{ backgroundColor: d.color }" />
            <span class="truncate">{{ d.name }}</span>
          </div>
          <div class="text-center font-mono text-slate-200 tabular-nums">{{ fmt(d.usage) }}<span class="text-slate-500"> kWh</span></div>
          <div class="text-center font-mono text-slate-400 tabular-nums">{{ fmt(d.cost) }}<span class="text-slate-500"> 元</span></div>
        </div>
      </div>
    </div>

    <!-- 水 -->
    <div class="mb-1.5">
      <div class="grid grid-cols-3 items-center gap-2 text-xs mb-1">
        <div class="text-center text-cyan-300 font-bold">💧 水</div>
        <div class="text-center font-mono text-slate-300 tabular-nums">总 {{ fmt(energy.water.total) }} 吨</div>
        <div class="text-center font-mono text-slate-300 tabular-nums">总 {{ fmt(energy.water.cost) }} 元</div>
      </div>
      <div class="space-y-1">
        <div v-for="d in energy.water.details" :key="d.name" class="grid grid-cols-3 items-center gap-2 text-xs">
          <div class="flex items-center justify-center gap-1 text-slate-300 min-w-0">
            <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :style="{ backgroundColor: d.color }" />
            <span class="truncate">{{ d.name }}</span>
          </div>
          <div class="text-center font-mono text-slate-200 tabular-nums">{{ fmt(d.usage) }}<span class="text-slate-500"> 吨</span></div>
          <div class="text-center font-mono text-slate-400 tabular-nums">{{ fmt(d.cost) }}<span class="text-slate-500"> 元</span></div>
        </div>
      </div>
    </div>

    <!-- 气 -->
    <div>
      <div class="grid grid-cols-3 items-center gap-2 text-xs mb-1">
        <div class="text-center text-emerald-400 font-bold">🔥 气</div>
        <div class="text-center font-mono text-slate-300 tabular-nums">总 {{ fmt(energy.gas.total) }} m³</div>
        <div class="text-center font-mono text-slate-300 tabular-nums">总 {{ fmt(energy.gas.cost) }} 元</div>
      </div>
      <div class="space-y-1">
        <div v-for="d in energy.gas.details" :key="d.name" class="grid grid-cols-3 items-center gap-2 text-xs">
          <div class="flex items-center justify-center gap-1 text-slate-300 min-w-0">
            <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :style="{ backgroundColor: d.color }" />
            <span class="truncate">{{ d.name }}</span>
          </div>
          <div class="text-center font-mono text-slate-200 tabular-nums">{{ fmt(d.usage) }}<span class="text-slate-500"> m³</span></div>
          <div class="text-center font-mono text-slate-400 tabular-nums">{{ fmt(d.cost) }}<span class="text-slate-500"> 元</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Download } from 'lucide-vue-next'
import { monthOptions, yearOptions } from '../../data/parkMonitor'
import { getRoomEnergy, type BuildingEnergy } from '../../data/buildingEnergy'
import type { PropertyRoom } from '../../data/propertyResources'
import { downloadExcel } from '../../utils/exportExcel'

interface Props {
  energy: BuildingEnergy
  period: string
  granularity: 'month' | 'year'
  entityName: string
  /** 导出时按「每个厂房房间」逐行明细；不传则导出当前汇总 */
  rooms?: PropertyRoom[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:period', period: string): void
  (e: 'update:granularity', g: 'month' | 'year'): void
  (e: 'toast', msg: string): void
}>()

const periodOptions = computed(() => (props.granularity === 'month' ? monthOptions : yearOptions))

const periodModel = computed({
  get: () => props.period,
  set: (v: string) => emit('update:period', v),
})

function setGranularity(g: 'month' | 'year') {
  if (g === props.granularity) return
  emit('update:granularity', g)
  const opts = g === 'month' ? monthOptions : yearOptions
  emit('update:period', opts[opts.length - 1].key)
}

const periodLabel = computed(
  () => periodOptions.value.find(o => o.key === props.period)?.label ?? props.period,
)

function fmt(n: number): string {
  if (!Number.isFinite(n)) return String(n)
  return Number.isInteger(n) ? String(n) : String(+n.toFixed(2))
}

function roomName(r: PropertyRoom): string {
  return (r.zoneFloorNo ?? [r.buildingNo, r.floor, r.roomNo].filter(Boolean).join(' ')) || '—'
}

function handleExport() {
  const filename = `${props.entityName}_用能详情_${periodLabel.value}`
  const rooms = props.rooms && props.rooms.length ? props.rooms : null

  if (rooms) {
    // 按每个厂房房间逐行导出明细
    const rows: (string | number)[][] = []
    for (const room of rooms) {
      const e = getRoomEnergy(room, props.period)
      const name = roomName(room)
      const push = (cat: string, item: string, usage: number, unit: string, cost: number) =>
        rows.push([name, cat, item, usage, unit, cost])
      for (const d of e.water.details) push('水', d.name, d.usage, '吨', d.cost)
      push('水', '合计', e.water.total, '吨', e.water.cost)
      for (const d of e.electricity.details) push('电', d.name, d.usage, 'kWh', d.cost)
      push('电', '合计', e.electricity.total, 'kWh', e.electricity.cost)
      for (const d of e.gas.details) push('气', d.name, d.usage, 'm³', d.cost)
      push('气', '合计', e.gas.total, 'm³', e.gas.cost)
    }
    downloadExcel(filename, ['房间', '类别', '明细项', '用量', '单位', '费用（元）'], rows)
    return
  }

  const rows: (string | number)[][] = []
  const push = (cat: string, name: string, usage: number, unit: string, cost: number) =>
    rows.push([cat, name, usage, unit, cost])
  for (const d of props.energy.water.details) push('水', d.name, d.usage, '吨', d.cost)
  push('水', '合计', props.energy.water.total, '吨', props.energy.water.cost)
  for (const d of props.energy.electricity.details) push('电', d.name, d.usage, 'kWh', d.cost)
  push('电', '合计', props.energy.electricity.total, 'kWh', props.energy.electricity.cost)
  for (const d of props.energy.gas.details) push('气', d.name, d.usage, 'm³', d.cost)
  push('气', '合计', props.energy.gas.total, 'm³', props.energy.gas.cost)
  downloadExcel(filename, ['类别', '明细项', '用量', '单位', '费用（元）'], rows)
}
</script>

<style scoped>
:deep(.energy-period-select) {
  width: 104px !important;
}
:deep(.energy-period-select .el-select__wrapper) {
  background-color: #0b2152 !important;
  border: 1px solid rgba(6, 182, 212, 0.35) !important;
  box-shadow: none !important;
  border-radius: 4px;
  height: 24px !important;
  min-height: 24px !important;
}
:deep(.energy-period-select .el-select__selected-item),
:deep(.energy-period-select .el-select__placeholder) {
  color: #22d3ee !important;
  font-family: monospace;
  font-size: 12px;
}
:deep(.energy-period-select .el-select__caret) {
  color: #22d3ee !important;
}
</style>
