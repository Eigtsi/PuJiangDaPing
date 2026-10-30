<template>
  <!-- 展开面板（居中弹窗，由悬浮面板内的入口按钮唤起，仅点 X 关闭） -->
  <Transition name="pop">
    <div
      v-if="open"
      class="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
    >
      <div class="pointer-events-auto w-[420px] max-w-[90%] max-h-[82vh] flex flex-col overflow-hidden rounded-xl border border-cyan-400 bg-[#09224f]/60 shadow-[0_8px_40px_rgba(6,182,212,0.5)] backdrop-blur-md">
        <!-- 头部 -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 bg-[#0a1e4a]/60 shrink-0">
          <span class="text-sm font-bold text-cyan-300 flex items-center gap-2">
            <Search class="w-4 h-4" />
            企业检索
          </span>
          <button @click="close" class="text-slate-400 hover:text-cyan-300 transition p-1 shrink-0 cursor-pointer"><X class="w-4 h-4" /></button>
        </div>

        <!-- 搜索输入 -->
        <div class="p-3 pb-2 shrink-0">
          <input
            ref="inputEl"
            v-model="query"
            type="text"
            placeholder="输入企业名称检索…"
            class="w-full h-9 px-3 rounded-md bg-[#051330]/80 border border-cyan-400/30 text-cyan-200 text-sm placeholder:text-slate-500 outline-none focus:border-cyan-400"
          />
        </div>

        <!-- 内容区 -->
        <div class="px-3 pb-3 flex-1 min-h-0 overflow-y-auto no-scrollbar">
          <!-- 详情视图 -->
          <template v-if="selected">
            <button @click="back" class="flex items-center gap-1 text-xs text-cyan-300 hover:text-cyan-200 transition mb-2 cursor-pointer">
              <ChevronLeft class="w-3.5 h-3.5" /> 返回检索结果
            </button>

            <div class="flex items-start justify-between px-2.5 py-2 mb-2 rounded bg-[#0a1e4a]/60 border border-cyan-500/20">
              <div class="min-w-0">
                <div class="text-sm font-bold text-cyan-300 leading-snug break-all">{{ selected.name }}</div>
                <div v-if="selected.industry" class="text-[11px] text-slate-400 mt-0.5">{{ selected.industry }}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-1.5 mb-2.5">
              <div class="bg-[#051330]/60 rounded px-2 py-1.5">
                <span class="block text-[11px] text-slate-400">房间数</span>
                <span class="block mt-0.5 font-mono font-black text-cyan-300 text-base tabular-nums">{{ selected.rooms.length }}</span>
              </div>
              <div class="bg-[#051330]/60 rounded px-2 py-1.5">
                <span class="block text-[11px] text-slate-400">总面积 (㎡)</span>
                <span class="block mt-0.5 font-mono font-black text-cyan-300 text-base tabular-nums">{{ fmt(selected.totalArea) }}</span>
              </div>
              <div class="bg-[#051330]/60 rounded px-2 py-1.5">
                <span class="block text-[11px] text-slate-400">年总租金 (元)</span>
                <span class="block mt-0.5 font-mono font-black text-amber-300 text-base tabular-nums">{{ fmt(selected.annualRent) }}</span>
              </div>
              <div class="bg-[#051330]/60 rounded px-2 py-1.5">
                <span class="block text-[11px] text-slate-400">年物业费 (元)</span>
                <span class="block mt-0.5 font-mono font-black text-emerald-400 text-base tabular-nums">{{ fmt(selected.annualProperty) }}</span>
              </div>
            </div>

            <div class="text-[11px] text-slate-400 mb-1.5">房间明细（{{ selected.rooms.length }} 间）</div>
            <div class="space-y-1.5">
              <div v-for="(room, i) in selected.rooms" :key="i" class="bg-[#051330]/50 rounded px-2.5 py-1.5 border border-cyan-500/10">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-200 font-medium">{{ roomLabel(room) }}</span>
                  <span class="text-[10px] text-cyan-300/80 whitespace-nowrap shrink-0">{{ room.resourceType }}</span>
                </div>
                <div class="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[11px] text-slate-400">
                  <span>面积 <span class="text-slate-200 font-mono">{{ room.totalArea != null ? fmt(room.totalArea) + '㎡' : '—' }}</span></span>
                  <span v-if="room.baseRent != null">基础租金 <span class="text-slate-200 font-mono">{{ fmt(room.baseRent) }}</span></span>
                  <span v-if="room.floorCoeff != null">楼层系数 <span class="text-slate-200 font-mono">{{ room.floorCoeff }}</span></span>
                  <span v-if="room.leaseStart || room.leaseEnd">租期 <span class="text-slate-200 font-mono">{{ room.leaseStart ?? '—' }} ~ {{ room.leaseEnd ?? '—' }}</span></span>
                  <span v-if="room.annualRent != null">年租金 <span class="text-amber-300/90 font-mono">{{ fmt(room.annualRent) }}</span></span>
                  <span v-if="room.annualProperty != null">年物业费 <span class="text-emerald-400/90 font-mono">{{ fmt(room.annualProperty) }}</span></span>
                </div>
              </div>
            </div>
          </template>

          <!-- 结果列表 -->
          <template v-else-if="query.trim()">
            <div v-if="results.length" class="space-y-0.5">
              <div
                v-for="r in results"
                :key="r.name"
                @click="select(r)"
                class="px-2.5 py-2 rounded cursor-pointer hover:bg-cyan-500/15 transition flex items-center justify-between gap-2"
              >
                <span class="text-xs text-slate-200 truncate">{{ r.name }}</span>
                <span class="text-[10px] text-slate-400 font-mono whitespace-nowrap shrink-0">{{ r.rooms.length }} 间</span>
              </div>
            </div>
            <div v-else class="px-3 py-6 text-center text-xs text-slate-500">无匹配企业</div>
          </template>

          <!-- 空态提示 -->
          <template v-else>
            <div class="px-3 py-8 text-center text-xs text-slate-500 leading-relaxed">
              输入企业名称，检索园区内入住企业<br />
              <span class="text-slate-600">（覆盖综合楼、厂房、宿舍楼、营业房、仓库）</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { Search, X, ChevronLeft } from 'lucide-vue-next'
import { propertyRooms, type PropertyRoom } from '../../data/propertyResources'

interface EnterpriseResult {
  name: string
  industry: string | null
  rooms: PropertyRoom[]
  totalArea: number
  annualRent: number
  annualProperty: number
}

const props = defineProps<{ open: boolean; initialEnterprise?: string | null }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const query = ref('')
const selected = ref<EnterpriseResult | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)

// 由企业名直接构造详情（供悬浮面板点击某企业时直接展示）
function buildResult(name: string): EnterpriseResult | null {
  const rooms = propertyRooms.filter(r => r.enterprise === name)
  if (!rooms.length) return null
  return {
    name,
    industry: rooms.find(r => r.industry)?.industry ?? null,
    rooms,
    totalArea: rooms.reduce((s, r) => s + (r.totalArea ?? 0), 0),
    annualRent: rooms.reduce((s, r) => s + (r.annualRent ?? 0), 0),
    annualProperty: rooms.reduce((s, r) => s + (r.annualProperty ?? 0), 0),
  }
}

watch(() => props.open, v => {
  if (v) {
    if (props.initialEnterprise) {
      query.value = props.initialEnterprise
      selected.value = buildResult(props.initialEnterprise)
    }
    nextTick(() => inputEl.value?.focus())
  } else {
    selected.value = null
    query.value = ''
  }
})

function close() {
  emit('close')
}

function back() {
  selected.value = null
}

const results = computed<EnterpriseResult[]>(() => {
  const q = query.value.trim()
  if (!q) return []
  const map = new Map<string, PropertyRoom[]>()
  for (const r of propertyRooms) {
    if (r.enterprise && r.enterprise.includes(q)) {
      if (!map.has(r.enterprise)) map.set(r.enterprise, [])
      map.get(r.enterprise)!.push(r)
    }
  }
  return Array.from(map.entries())
    .map(([name, rooms]) => ({
      name,
      industry: rooms.find(r => r.industry)?.industry ?? null,
      rooms,
      totalArea: rooms.reduce((s, r) => s + (r.totalArea ?? 0), 0),
      annualRent: rooms.reduce((s, r) => s + (r.annualRent ?? 0), 0),
      annualProperty: rooms.reduce((s, r) => s + (r.annualProperty ?? 0), 0),
    }))
    .sort((a, b) => b.rooms.length - a.rooms.length)
})

function select(r: EnterpriseResult) {
  selected.value = r
}

// 数字显示：整数不带小数，小数保留至多 2 位
function fmt(n: number): string {
  if (!Number.isFinite(n)) return String(n)
  return Number.isInteger(n) ? String(n) : String(+n.toFixed(2))
}

function roomLabel(r: PropertyRoom): string {
  return [r.buildingNo, r.floor, r.roomNo].filter(Boolean).join(' · ') || '—'
}
</script>
