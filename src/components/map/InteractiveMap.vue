<template>
  <div class="relative w-full h-full overflow-hidden bg-[#040e29]">
    <!-- 高德地图容器（z-0 隔离，避免地图内部高层级元素外溢覆盖悬浮层） -->
    <div ref="mapEl" class="absolute inset-0 w-full h-full z-0"></div>

    <!-- 底部暗色过渡（与主题融合，降低透明度避免遮挡地图） -->
    <div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#040e29]/45 via-[#040e29]/15 to-transparent pointer-events-none z-10"></div>

    <!-- 右下角：监控图例（可收缩/展开，参照总览驾驶舱 LegendPanel「分级图例」样式） -->
    <div class="absolute bottom-[90px] right-[450px] z-30 font-sans">
      <div class="relative tech-panel rounded-lg w-fit">
        <span class="hud-corner hud-corner-tr" />
        <span class="hud-corner hud-corner-bl" />

        <!-- 标题栏（点击收缩/展开） -->
        <div class="flex items-center justify-between px-3 py-2 cursor-pointer select-none" @click="toggleLegend">
          <span class="text-sm font-bold text-cyan-300 tracking-wider flex items-center gap-2 drop-shadow-[0_0_6px_rgba(0,242,255,0.35)]">
            <span class="w-1 h-4 rounded-full bg-gradient-to-b from-cyan-300 to-cyan-600 inline-block shadow-[0_0_6px_rgba(0,242,255,0.6)]" />
            综合图例
          </span>
          <ChevronUp v-if="!legendCollapsed" class="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <ChevronDown v-else class="w-4 h-4 text-cyan-400 flex-shrink-0" />
        </div>

        <!-- 内容（展开时显示） -->
        <div v-show="!legendCollapsed" class="px-3 pb-3">
          <!-- 状态分级（正常→黄色预警→红色预警；无监测标记的园区不显示） -->
          <div v-if="hasStatusMarkers" class="mb-2">
            <div class="flex flex-col gap-1 text-[10px] font-mono">
              <span class="flex items-center gap-1.5 text-[#00ff99]"><span class="w-1.5 h-1.5 rounded-full bg-[#00ff99] shadow-[0_0_5px_rgba(0,255,153,0.8)]" />正常</span>
              <span class="flex items-center gap-1.5 text-[#fdad43]"><span class="w-1.5 h-1.5 rounded-full bg-[#fdad43] shadow-[0_0_5px_rgba(253,173,67,0.8)]" />黄色预警</span>
              <span class="flex items-center gap-1.5 text-[#ff4a4a]"><span class="w-1.5 h-1.5 rounded-full bg-[#ff4a4a] shadow-[0_0_5px_rgba(255,74,74,0.8)]" />红色预警</span>
            </div>
          </div>

          <!-- 类型图例 — 单列（每项一行） -->
          <div class="flex flex-col gap-0.5">
            <div
              v-for="layer in legendLayers" :key="layer.type"
              @click="toggleLayer(layer.type)"
              :class="['flex items-center gap-1.5 text-xs rounded px-1 py-0.5 cursor-pointer transition select-none', isLayerVisible(layer.type) ? 'text-white/80 hover:bg-neon-blue/10' : 'text-white/30 hover:bg-white/5']"
            >
              <div :class="['transition-opacity', isLayerVisible(layer.type) ? 'opacity-100' : 'opacity-30']" v-html="layer.svg" />
              <span :class="['transition-all truncate', isLayerVisible(layer.type) ? '' : 'line-through']">{{ layer.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 楼栋悬浮面板（仅点 X 关闭；检索/详情均在此面板内，不另弹窗） -->
    <Transition name="pop">
      <div v-if="hoveredBuilding" class="absolute left-[450px] top-16 z-40 pointer-events-auto">
        <div class="bg-[#09224f]/60 border border-cyan-400 rounded-lg shadow-[0_8px_32px_rgba(6,182,212,0.4)] backdrop-blur-md w-[320px] max-h-[78vh] flex flex-col overflow-hidden">
          <!-- 标题栏 + 关闭 -->
          <div class="flex items-center justify-between px-3 pt-2.5 pb-1.5 border-b border-cyan-500/20 shrink-0">
            <div class="flex items-baseline gap-2 min-w-0">
              <span class="text-sm font-bold text-cyan-300 whitespace-nowrap">{{ hoveredBuilding.mapName }}</span>
              <span class="text-xs text-slate-400 whitespace-nowrap">{{ hoveredBuilding.type }}</span>
            </div>
            <button @click="closeHoverPanel" class="text-slate-400 hover:text-cyan-300 transition p-0.5 shrink-0 cursor-pointer"><X class="w-4 h-4" /></button>
          </div>

          <!-- 检索输入（始终在面板内） -->
          <div class="px-3 pt-2.5 shrink-0">
            <div class="flex items-center gap-1.5 h-8 px-2.5 rounded-md bg-[#051330]/80 border border-cyan-400/30 focus-within:border-cyan-400">
              <Search class="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="检索园区企业…"
                class="flex-1 min-w-0 bg-transparent text-cyan-200 text-xs placeholder:text-slate-500 outline-none"
              />
            </div>
          </div>

          <!-- 内容区 -->
          <div class="px-3 py-2.5 flex-1 min-h-0 overflow-y-auto no-scrollbar">
            <!-- 企业详情 -->
            <template v-if="panelEnterprise">
              <button @click="backToList" class="flex items-center gap-1 text-xs text-cyan-300 hover:text-cyan-200 transition mb-2 cursor-pointer">
                <ChevronLeft class="w-3.5 h-3.5" /> 返回列表
              </button>

              <div class="px-2.5 py-2 mb-2 rounded bg-[#0a1e4a]/60 border border-cyan-500/20">
                <div class="text-sm font-bold text-cyan-300 leading-snug break-all">{{ panelEnterprise.name }}</div>
                <div v-if="panelEnterprise.industry" class="text-[11px] text-slate-400 mt-0.5">{{ panelEnterprise.industry }}</div>
                <div class="mt-1.5 pt-1.5 border-t border-cyan-500/15 space-y-1 text-xs">
                  <div class="flex justify-between"><span class="text-slate-400">联系人</span><span class="text-slate-200">{{ panelEnterprise.contact }}</span></div>
                  <div class="flex justify-between"><span class="text-slate-400">联系电话</span><span class="text-cyan-300 font-mono">{{ panelEnterprise.phone }}</span></div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-1.5 mb-2.5">
                <div class="bg-[#051330]/60 rounded px-2 py-1.5 text-center">
                  <span class="block text-[11px] text-slate-400">房间数</span>
                  <span class="block mt-0.5 font-mono font-black text-cyan-300 text-base tabular-nums">{{ panelEnterprise.rooms.length }}</span>
                </div>
                <div class="bg-[#051330]/60 rounded px-2 py-1.5 text-center">
                  <span class="block text-[11px] text-slate-400">总面积 (㎡)</span>
                  <span class="block mt-0.5 font-mono font-black text-cyan-300 text-base tabular-nums">{{ fmt(panelEnterprise.totalArea) }}</span>
                </div>
                <div class="bg-[#051330]/60 rounded px-2 py-1.5 text-center">
                  <span class="block text-[11px] text-slate-400">年总租金 (元)</span>
                  <span class="block mt-0.5 font-mono font-black text-amber-300 text-base tabular-nums">{{ fmt(panelEnterprise.annualRent) }}</span>
                </div>
                <div class="bg-[#051330]/60 rounded px-2 py-1.5 text-center">
                  <span class="block text-[11px] text-slate-400">年物业费 (元)</span>
                  <span class="block mt-0.5 font-mono font-black text-emerald-400 text-base tabular-nums">{{ fmt(panelEnterprise.annualProperty) }}</span>
                </div>
              </div>

              <div class="text-[11px] text-slate-400 mb-1.5">房间明细（{{ panelEnterprise.rooms.length }} 间）</div>
              <div class="space-y-1.5">
                <div v-for="(room, i) in panelEnterprise.rooms" :key="i" class="bg-[#051330]/50 rounded px-2.5 py-1.5 border border-cyan-500/10">
                  <div class="flex items-center justify-between text-xs">
                    <div class="flex items-center gap-1.5 min-w-0">
                      <span v-if="room.zone" class="text-[10px] px-1 py-0.5 rounded bg-cyan-500/10 text-cyan-300 whitespace-nowrap shrink-0">{{ shortZone(room.zone) }}</span>
                      <span class="text-slate-200 font-medium truncate">{{ roomLabel(room) }}</span>
                    </div>
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

            <!-- 检索结果（输入关键字时） -->
            <template v-else-if="searchQuery.trim()">
              <div class="text-xs text-slate-400 mb-1">检索结果（{{ searchResults.length }}）</div>
              <div v-if="searchResults.length" class="space-y-1">
                <button
                  v-for="r in searchResults"
                  :key="r.name"
                  @click="openEnterprise(r.name)"
                  class="w-full text-left text-xs text-slate-200 bg-[#051330]/40 rounded px-2 py-1.5 leading-snug cursor-pointer hover:bg-cyan-500/15 hover:text-cyan-200 transition flex items-center justify-between gap-1.5"
                >
                  <span class="truncate">{{ r.name }}</span>
                  <span class="text-[10px] text-slate-400 font-mono whitespace-nowrap shrink-0">{{ r.rooms.length }} 间</span>
                </button>
              </div>
              <div v-else class="text-xs text-slate-500 text-center py-6">无匹配企业</div>
            </template>

            <!-- 默认：本楼统计 + 入住企业 -->
            <template v-else>
              <div class="grid grid-cols-2 gap-1.5 mb-2">
                <div class="bg-[#051330]/60 rounded px-2 py-1.5 text-center">
                  <span class="block text-xs text-slate-400">在租数量</span>
                  <span class="block mt-0.5 font-mono font-black text-cyan-300 text-lg tabular-nums">{{ hoveredBuilding.rented }}</span>
                </div>
                <div class="bg-[#051330]/60 rounded px-2 py-1.5 text-center">
                  <span class="block text-xs text-slate-400">空闲数量</span>
                  <span class="block mt-0.5 font-mono font-black text-emerald-400 text-lg tabular-nums">{{ hoveredBuilding.vacant }}</span>
                </div>
              </div>
              <div class="text-xs text-slate-400 mb-1">入住企业（{{ hoveredBuilding.enterprises.length }}）<span class="text-slate-500">· 点击查看详情</span></div>
              <div v-if="hoveredBuilding.enterprises.length" class="space-y-1">
                <button
                  v-for="e in hoveredBuilding.enterprises"
                  :key="e"
                  @click="openEnterprise(e)"
                  class="w-full text-left text-xs text-slate-200 bg-[#051330]/40 rounded px-2 py-1.5 leading-snug cursor-pointer hover:bg-cyan-500/15 hover:text-cyan-200 transition flex items-center justify-between gap-1.5"
                >
                  <span class="truncate">{{ e }}</span>
                  <ChevronRight class="w-3.5 h-3.5 text-slate-500 shrink-0" />
                </button>
              </div>
              <div v-else class="text-xs text-slate-500 text-center py-2">暂无入住企业</div>
            </template>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 居中详情弹窗 -->
    <Transition name="pop">
      <div
        v-if="selectedMarker"
        class="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
      >
        <div
          :class="['pointer-events-auto relative bg-[#09224f]/60 border border-cyan-400 p-4 rounded-xl shadow-[0_8px_40px_rgba(6,182,212,0.5)] backdrop-blur-md', showMonitorDetail ? 'w-[460px] max-h-[80vh] overflow-y-auto' : 'w-[360px]']"
        >
          <div class="flex justify-between items-start border-b border-cyan-500/20 pb-2 mb-2.5">
            <div class="text-cyan-300 font-bold flex items-center gap-2 text-sm">
              <MapPin class="w-4 h-4" :class="selectedMarker.status === 'normal' ? 'text-emerald-400' : selectedMarker.status === 'warning' ? 'text-amber-400' : 'text-rose-400'" />
              <span>{{ selectedMarker.name }}</span>
            </div>
            <button @click="selectedMarker = null" class="text-slate-400 hover:text-cyan-400 transition p-1"><X class="w-4 h-4" /></button>
          </div>
          <div class="flex items-center justify-between text-xs text-slate-400 mb-2 px-3">
            <span>类型：<span class="text-cyan-300">{{ typeLabel }}</span></span>
            <span>园区：<span class="text-cyan-300">{{ zoneLabel }}</span></span>
            <span>状态：<span :class="statusClass">{{ statusText }}</span></span>
          </div>

          <!-- 企业类型：显示更多操作 -->
          <div v-if="selectedMarker.type === 'enterprise' && selectedMarker.enterpriseId" class="flex gap-2 mt-3">
            <button
              @click="$emit('selectEnterprise', selectedMarker.enterpriseId!)"
              class="flex-1 text-center py-1.5 rounded bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-400/30 cursor-pointer hover:bg-cyan-500/30 transition"
            >
              📋 查看一企一档
            </button>
            <button
              @click="selectedMarker = null"
              class="flex-1 text-center py-1.5 rounded bg-slate-800/40 text-slate-400 text-xs border border-slate-500/20 cursor-pointer hover:text-cyan-300 transition"
            >
              关闭
            </button>
          </div>

          <!-- 监测类型：显示数据 -->
          <div v-else-if="selectedMarker.monitoringPointId">
            <!-- 未展开：点击按钮 -->
            <button
              v-if="!showMonitorDetail"
              @click="showMonitorDetail = true"
              class="w-full mt-2 text-center py-2 rounded bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-400/30 cursor-pointer hover:bg-cyan-500/30 transition flex items-center justify-center gap-1.5"
            >
              <BarChart3 class="w-4 h-4" />
              查看该点位详细监测数据与历史趋势
            </button>

            <!-- 展开后：详细数据 -->
            <div v-else class="mt-2 bg-[#051330]/60 p-3 rounded border border-cyan-500/15">
              <div class="flex justify-between items-center mb-1">
                <span class="text-xs text-cyan-400 font-bold">实时监测数据</span>
                <span class="text-xs text-slate-200">{{ monitorPoint?.online ? '🟢 在线' : '🔴 离线' }}</span>
              </div>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs text-slate-400">采集时间</span>
                <span class="text-xs font-mono text-cyan-300">{{ dataTimestamp }}</span>
              </div>

              <!-- 指标列表 -->
              <div v-if="monitorPoint" class="grid grid-cols-2 gap-1.5 text-xs mb-3">
                <div v-for="item in monitorMetrics" :key="item.label" class="flex justify-between items-center bg-[#0a1e4a]/60 rounded px-2.5 py-1.5">
                  <span class="text-slate-400">{{ item.label }}</span>
                  <span :class="['font-mono font-bold', item.exceed ? 'text-rose-400' : 'text-cyan-300']">{{ item.value }}<span class="text-slate-500 text-[10px] ml-0.5">{{ item.unit }}</span></span>
                </div>
              </div>
              <div v-else class="text-xs text-slate-500 text-center py-3">暂无数据</div>

              <!-- 趋势图 -->
              <div v-if="monitorPoint" class="border-t border-cyan-500/10 pt-2">
                <!-- 模式切换 + 导出 -->
                <div class="flex items-center justify-between mb-1.5">
                  <div class="flex items-center rounded border border-cyan-500/30 p-0.5 shrink-0">
                    <button type="button" @click="trendMode = 'day'" :class="['px-2 py-0.5 rounded-sm text-xs font-medium transition cursor-pointer', trendMode === 'day' ? 'bg-cyan-500/25 text-cyan-300' : 'text-slate-400 hover:text-slate-200']">近24小时</button>
                    <button type="button" @click="trendMode = 'history'" :class="['px-2 py-0.5 rounded-sm text-xs font-medium transition cursor-pointer', trendMode === 'history' ? 'bg-cyan-500/25 text-cyan-300' : 'text-slate-400 hover:text-slate-200']">历史趋势</button>
                  </div>
                  <button
                    @click="exportTrend"
                    class="flex items-center gap-1 text-xs text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 rounded px-1.5 py-0.5 cursor-pointer transition"
                  >
                    <Download class="w-3 h-3" /> 导出
                  </button>
                </div>

                <!-- 历史趋势：日期筛选（近3个月） -->
                <div v-if="trendMode === 'history'" class="flex items-center gap-1.5 mb-2 text-xs">
                  <span class="text-slate-400 shrink-0">筛选</span>
                  <el-select v-model="trendStartDate" size="small" class="trend-date-select shrink-0">
                    <el-option v-for="d in trendDates" :key="'s' + d" :label="dateLabel(d)" :value="d" />
                  </el-select>
                  <span class="text-slate-500">—</span>
                  <el-select v-model="trendEndDate" size="small" class="trend-date-select shrink-0">
                    <el-option v-for="d in trendDates" :key="'e' + d" :label="dateLabel(d)" :value="d" />
                  </el-select>
                  <span class="text-slate-500 ml-auto shrink-0">{{ activeTrendPoints.length }} 天</span>
                </div>

                <!-- 平均值统计 -->
                <div v-if="avgStats.length" class="grid grid-cols-2 gap-1 mb-2">
                  <div v-for="s in avgStats" :key="s.label" class="flex justify-between items-center bg-[#0a1e4a]/60 rounded px-2 py-1">
                    <span class="text-slate-400 text-[11px]">{{ s.label }}</span>
                    <span class="font-mono font-bold text-cyan-300 text-[11px]">{{ s.value }}<span class="text-slate-500 text-[10px] ml-0.5">{{ s.unit }}</span></span>
                  </div>
                </div>

                <TechLineChart
                  :xData="trendXData"
                  :series="trendSeries"
                  :height="200"
                  :showArea="false"
                  :showLegend="true"
                  :yInterval="trendYAxis.interval"
                  :yName="trendYAxis.name"
                  :y2Name="trendY2Name"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { MapPin, X, BarChart3, ChevronDown, ChevronUp, Search, ChevronRight, ChevronLeft, Download } from 'lucide-vue-next'
import TechLineChart from '../charts/TechLineChart.vue'
import { mapMarkers, markerToLngLat, statusColors } from '../../data/mapData'
import { monitoringPoints } from '../../data/monitoringPoints'
import { parks } from '../../data/parkKml'
import { propertyRooms, type PropertyRoom } from '../../data/propertyResources'
import { getEnterpriseContact } from '../../data/enterpriseContacts'
import type { MapMarker as MapMarkerData, MarkerType } from '../../data/mapData'

// ===== 楼栋房产资源统计（数据来源：房产资源导入模板_已填写.xlsx 清洗后） =====
interface BuildingStats {
  mapName: string
  buildingNo: string | null
  type: string
  total: number
  rented: number
  vacant: number
  enterprises: string[]
}

// 所属园区 key -> Excel 园区名称
function propertyZoneFor(zone: 'all' | 'east' | 'center' | 'west'): string {
  if (zone === 'east') return '东部园区'
  if (zone === 'west') return '西部园区'
  return '中部园区'
}

// 地图楼栋名 -> Excel 楼号
function mapBuildingNameToNo(name: string, zone: 'all' | 'east' | 'center' | 'west'): string | null {
  // 厂房/楼栋：N# -> NN号楼（中部、东部通用）
  const m = name.match(/^(\d+)#$/)
  if (m) return String(parseInt(m[1], 10)).padStart(2, '0') + '号楼'
  if (zone === 'east') {
    // 东部：综合楼A/B -> A/B；C楼/D楼 保持原名
    const z = name.match(/^综合楼([AB])$/)
    if (z) return z[1]
    if (name === 'C楼' || name === 'D楼') return name
    return null
  }
  // 中部：综合楼A-D -> A-D；营业房 E/F/G；宿舍楼
  const z = name.match(/^综合楼([A-D])$/)
  if (z) return z[1]
  if (/^[EFG]$/.test(name)) return name
  if (name === '宿舍楼') return '宿舍楼'
  return null
}

function getBuildingStats(mapName: string): BuildingStats | null {
  const zone = propertyZoneFor(props.activeZone)
  const buildingNo = mapBuildingNameToNo(mapName, props.activeZone)
  if (!buildingNo) return null
  const rooms = propertyRooms.filter(r => r.zone === zone && r.buildingNo === buildingNo)
  if (rooms.length === 0) return null

  const rented = rooms.filter(r => r.enterprise).length
  const enterprises = Array.from(new Set(rooms.filter(r => r.enterprise).map(r => r.enterprise!)))
  const types = Array.from(new Set(rooms.map(r => r.resourceType).filter((t): t is string => !!t)))
  return {
    mapName,
    buildingNo,
    type: types.join('/') || '未知',
    total: rooms.length,
    rented,
    vacant: rooms.length - rented,
    enterprises,
  }
}

// ===== 高德地图配置 =====
const AMAP_KEY = '257fac0c1fa2489de0bdb41ccd9d2c9a'
const AMAP_SECURITY_CODE = '802734539e7ee46162776a47a7416c04'
;(window as any)._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY_CODE }

interface Props {
  bgImage?: string // 兼容旧接口；使用高德地图后不再依赖静态背景图
  activeZone: 'all' | 'east' | 'center' | 'west'
  blockFloating?: boolean // 放大面板打开时屏蔽楼栋悬浮/标记点击，关闭后恢复
}

const props = withDefaults(defineProps<Props>(), { bgImage: '', blockFloating: false })

const emit = defineEmits<{
  (e: 'selectEnterprise', id: string): void
  (e: 'selectMarker', marker: MapMarkerData): void
}>()

// 当前所属园区的 KML 地理数据
const activeParkData = computed(() => {
  const z = props.activeZone === 'all' ? 'center' : props.activeZone
  return parks[z] ?? parks.center!
})

// ===== 地图实例 =====
const mapEl = ref<HTMLDivElement | null>(null)
const map = ref<any>(null)
const markerMap = ref<Map<string, any>>(new Map())
const mapReady = ref(false)

// 园区边界 & 楼栋（来自 中部产业园.kml）
const boundaryPolygon = ref<any>(null)
const buildingMarkerList = ref<any[]>([])

// ===== 图层可见性 =====
const visibleLayers = ref<Set<MarkerType>>(new Set([
  'discharge_outlet', 'air_station'
]))

// 楼栋图层（真实 KML 楼栋号）单独控制显隐
const buildingsVisible = ref(true)

// 四至范围（园区最外层边界线）显隐
const boundaryVisible = ref(true)

function toggleLayer(type: string) {
  if (type === 'building') {
    buildingsVisible.value = !buildingsVisible.value
    return
  }
  if (type === 'boundary') {
    boundaryVisible.value = !boundaryVisible.value
    return
  }
  const s = new Set(visibleLayers.value)
  if (s.has(type as MarkerType)) s.delete(type as MarkerType); else s.add(type as MarkerType)
  visibleLayers.value = s
}

function isLayerVisible(type: string): boolean {
  if (type === 'building') return buildingsVisible.value
  if (type === 'boundary') return boundaryVisible.value
  return visibleLayers.value.has(type as MarkerType)
}

// 收缩状态
const legendCollapsed = ref(false)

const toggleLegend = () => {
  legendCollapsed.value = !legendCollapsed.value
}

// ===== 筛选逻辑 =====
const filteredMarkers = computed(() => {
  return mapMarkers.filter(m => {
    if (!visibleLayers.value.has(m.type)) return false
    if (props.activeZone !== 'all' && m.zone !== props.activeZone) return false
    return true
  })
})

// ===== 选中标记 =====
const selectedMarker = ref<MapMarkerData | null>(null)
const showMonitorDetail = ref(false)
const dataTimestamp = ref('')

// ===== 楼栋悬停统计 + 企业检索/详情（全部整合在悬浮面板内，不另弹窗） =====
const hoveredBuilding = ref<BuildingStats | null>(null)
// 悬浮面板内：检索关键字
const searchQuery = ref('')
// 悬浮面板内：当前查看的企业详情（null = 列表视图）
const panelEnterprise = ref<EnterpriseResult | null>(null)

interface EnterpriseResult {
  name: string
  industry: string | null
  contact: string
  phone: string
  rooms: PropertyRoom[]
  totalArea: number
  annualRent: number
  annualProperty: number
}

function buildEnterpriseResult(name: string): EnterpriseResult | null {
  const rooms = propertyRooms.filter(r => r.enterprise === name)
  if (!rooms.length) return null
  const { contact, phone } = getEnterpriseContact(name)
  return {
    name,
    industry: rooms.find(r => r.industry)?.industry ?? null,
    contact,
    phone,
    rooms,
    totalArea: rooms.reduce((s, r) => s + (r.totalArea ?? 0), 0),
    annualRent: rooms.reduce((s, r) => s + (r.annualRent ?? 0), 0),
    annualProperty: rooms.reduce((s, r) => s + (r.annualProperty ?? 0), 0),
  }
}

// 面板内检索结果（全园区范围，按房间数降序）
const searchResults = computed<EnterpriseResult[]>(() => {
  const q = searchQuery.value.trim()
  if (!q) return []
  const names = new Set<string>()
  for (const r of propertyRooms) {
    if (r.enterprise && r.enterprise.includes(q)) names.add(r.enterprise)
  }
  return Array.from(names)
    .map(n => buildEnterpriseResult(n))
    .filter((r): r is EnterpriseResult => r !== null)
    .sort((a, b) => b.rooms.length - a.rooms.length)
})

function openEnterprise(name: string) {
  panelEnterprise.value = buildEnterpriseResult(name)
}

function backToList() {
  panelEnterprise.value = null
}

function closeHoverPanel() {
  hoveredBuilding.value = null
  searchQuery.value = ''
  panelEnterprise.value = null
}

// 供父组件在展开侧边面板（放大弹框）时调用：关闭地图上的楼栋悬浮面板与标记面板，避免两个图框同时显示
function closeFloatingPanels() {
  closeHoverPanel()
  selectedMarker.value = null
  showMonitorDetail.value = false
}

defineExpose({ closeFloatingPanels })

// 数字显示：整数不带小数，小数保留至多 2 位
function fmt(n: number): string {
  if (!Number.isFinite(n)) return String(n)
  return Number.isInteger(n) ? String(n) : String(+n.toFixed(2))
}

function roomLabel(r: PropertyRoom): string {
  return [r.buildingNo, r.floor, r.roomNo].filter(Boolean).join(' · ') || '—'
}

// 园区短名：东部园区 -> 东部
function shortZone(zone: string | null): string {
  return (zone || '').replace('园区', '')
}

// ===== 初始化高德地图 =====
onMounted(() => { initAmap() })

async function initAmap() {
  try {
    const loaderModule: any = await import('@amap/amap-jsapi-loader')
    const AMapLoader = loaderModule.default || loaderModule
    const AMap = await AMapLoader.load({
      key: AMAP_KEY,
      version: '2.0',
      plugins: ['AMap.Scale'],
    })
    ;(window as any).AMap = AMap
    if (!mapEl.value) return

    map.value = new AMap.Map(mapEl.value, {
      viewMode: '2D',
      center: activeParkData.value.center,
      zoom: 16,
      layers: [new AMap.TileLayer.Satellite()],
      resizeEnable: true,
      animateEnable: false,
      jogEnable: false,
      pitchEnable: false,
      rotateEnable: false,
      buildingAnimation: false,
      showIndoorMap: false,
    })
    mapReady.value = true

    drawBoundary()
    buildBuildings()
    buildMarkers()
    fitParkView()
  } catch (err) {
    console.warn('高德地图加载失败:', err)
  }
}

// ===== 园区边界 & 楼栋（真实 KML 数据） =====
function drawBoundary() {
  if (!map.value) return
  const AMap = (window as any).AMap
  if (boundaryPolygon.value) {
    try { map.value.remove(boundaryPolygon.value) } catch (e) {}
    boundaryPolygon.value = null
  }
  boundaryPolygon.value = new AMap.Polygon({
    path: activeParkData.value.polygon,
    strokeColor: '#22d3ee',
    strokeWeight: 2,
    strokeOpacity: 0.95,
    strokeStyle: 'solid',
    fillColor: '#06b6d4',
    fillOpacity: 0.06,
    zIndex: 5,
  })
  map.value.add(boundaryPolygon.value)
  if (!boundaryVisible.value) {
    try { boundaryPolygon.value.hide() } catch (e) {}
  }
}

function buildingMarkerContent(name: string): string {
  const icon = '<svg width="18" height="18" viewBox="0 0 18 18"><rect x="2" y="2" width="14" height="14" rx="1.5" fill="#67e8f9" fill-opacity="0.22" stroke="#67e8f9" stroke-width="1.1"/><path d="M2,8 H16" stroke="#67e8f9" stroke-width="0.9"/><path d="M7,2 V8 M11,2 V8" stroke="#67e8f9" stroke-width="0.9"/><rect x="4.5" y="10" width="3" height="2.6" fill="#67e8f9" fill-opacity="0.85"/><rect x="10.5" y="10" width="3" height="2.6" fill="#67e8f9" fill-opacity="0.85"/></svg>'
  return `<div class="park-building">` +
    `<span class="park-building-icon">${icon}</span>` +
    `<span class="park-building-name">${name}</span>` +
    `</div>`
}

function buildBuildings() {
  if (!map.value) return
  const AMap = (window as any).AMap
  buildingMarkerList.value.forEach(mk => { try { mk.setMap(null) } catch (e) {} })
  buildingMarkerList.value = []

  activeParkData.value.buildings.forEach(b => {
    const mk = new AMap.Marker({
      position: [b.lng, b.lat],
      content: buildingMarkerContent(b.name),
      offset: new AMap.Pixel(-9, -9),
      zIndex: 90,
      title: b.name,
    })
    // 悬停显示统计；面板仅点 X 关闭，不随鼠标移出自消失；切换楼栋时回到默认视图
    mk.on('mouseover', () => {
      if (props.blockFloating) return
      hoveredBuilding.value = getBuildingStats(b.name)
      searchQuery.value = ''
      panelEnterprise.value = null
    })
    mk.setMap(map.value)
    buildingMarkerList.value.push(mk)
  })
}

function fitParkView() {
  if (!map.value || !boundaryPolygon.value) return
  map.value.setFitView([boundaryPolygon.value], false, [60, 60, 60, 60], 17)
}

// ===== 标记点图标 =====
const TYPE_GLYPHS: Record<string, string> = {
  enterprise: '企',
  fluoride_pool: '氟',
  discharge_outlet: '排',
  air_station: '气',
  rain_outlet: '雨',
  voc: 'V',
  odor: '臭',
  waste_storage: '废',
  weigh_station: '磅',
}

const TYPE_COLORS: Record<string, string> = {
  enterprise: '#00ff99',       // 企业 - 绿
  discharge_outlet: '#fb923c', // 排污口 - 橙
  air_station: '#38bdf8',      // 大气监测站 - 天蓝
  fluoride_pool: '#f472b6',    // 氟化物 - 粉
  rain_outlet: '#60a5fa',      // 雨排口 - 蓝
  voc: '#a78bfa',              // VOCs - 紫
  odor: '#f87171',             // 恶臭 - 红
  waste_storage: '#facc15',    // 固废 - 黄
  weigh_station: '#94a3b8',    // 地磅 - 灰
}

function markerIconSvg(marker: MapMarkerData): string {
  const color = TYPE_COLORS[marker.type] || statusColors[marker.status] || '#10b981'
  const glyph = TYPE_GLYPHS[marker.type] || '●'
  return `<svg width="34" height="34" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">` +
    `<circle cx="17" cy="17" r="14" fill="${color}" fill-opacity="0.25"/>` +
    `<circle cx="17" cy="17" r="10" fill="${color}" stroke="#0a1428" stroke-width="2"/>` +
    `<text x="17" y="21" text-anchor="middle" font-size="12" font-weight="700" fill="#06233a" font-family="PingFang SC, Microsoft YaHei, sans-serif">${glyph}</text>` +
    `</svg>`
}

// 创建标记点
function buildMarkers() {
  if (!map.value) return
  const AMap = (window as any).AMap
  // 清空旧标记
  markerMap.value.forEach(mk => { try { mk.setMap(null) } catch (e) {} })
  markerMap.value.clear()

  mapMarkers.forEach(m => {
    const [lng, lat] = markerToLngLat(m.x, m.y, m.zone)
    const mk = new AMap.Marker({
      position: [lng, lat],
      content: `<div class="park-marker">${markerIconSvg(m)}<div class="park-marker-name">${m.name}</div></div>`,
      offset: new AMap.Pixel(-17, -17),
      zIndex: 100,
    })
    mk.on('click', () => handleMarkerClick(m))
    mk.setMap(map.value)
    markerMap.value.set(m.id, mk)
  })
  applyVisibility()
}

// 根据筛选结果控制标记显隐
function applyVisibility() {
  if (!map.value) return
  const visibleIds = new Set(filteredMarkers.value.map(m => m.id))
  markerMap.value.forEach((mk, id) => {
    if (visibleIds.has(id)) mk.show()
    else mk.hide()
  })
}

watch(filteredMarkers, () => { if (mapReady.value) applyVisibility() })

// 楼栋图层显隐
function applyBuildingVisibility() {
  if (!map.value) return
  buildingMarkerList.value.forEach(mk => {
    try { buildingsVisible.value ? mk.show() : mk.hide() } catch (e) {}
  })
}

watch(buildingsVisible, () => { if (mapReady.value) applyBuildingVisibility() })

// 四至范围（园区边界线）显隐
function applyBoundaryVisibility() {
  if (!map.value || !boundaryPolygon.value) return
  try { boundaryVisible.value ? boundaryPolygon.value.show() : boundaryPolygon.value.hide() } catch (e) {}
}

watch(boundaryVisible, () => { if (mapReady.value) applyBoundaryVisibility() })

// 切换所属园区：重绘边界/楼栋/标记，复位悬停面板与选中态
watch(() => props.activeZone, () => {
  if (!mapReady.value) return
  hoveredBuilding.value = null
  searchQuery.value = ''
  panelEnterprise.value = null
  selectedMarker.value = null
  showMonitorDetail.value = false
  drawBoundary()
  buildBuildings()
  buildMarkers()
  fitParkView()
})

onBeforeUnmount(() => {
  try { map.value?.destroy() } catch (e) {}
})

// ===== 标记点击 =====
function handleMarkerClick(marker: MapMarkerData) {
  if (props.blockFloating) return
  selectedMarker.value = marker
  dataTimestamp.value = formatNow()
  // 打开标记面板时，自动关闭楼栋悬浮面板，避免同时出现两个面板
  hoveredBuilding.value = null
  searchQuery.value = ''
  panelEnterprise.value = null
  // 大气监测站、排污口直接展开实时数据与趋势曲线，跳过“查看详细监测数据”按钮
  showMonitorDetail.value = marker.type === 'air_station' || marker.type === 'discharge_outlet'
  emit('selectMarker', marker)
}

function formatNow(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  // 采集时间为整点，如 2026-10-29 11:00:00
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:00:00`
}

// 查找对应的监测点位数据
const monitorPoint = computed(() => {
  if (!selectedMarker.value?.monitoringPointId) return null
  return monitoringPoints.find(p => p.id === selectedMarker.value!.monitoringPointId) || null
})

// 指标列表（从 latestData 提取）
const metricLabels: Record<string, { label: string; unit: string }> = {
  cod: { label: 'COD', unit: ' mg/L' },
  ammoniaNitrogen: { label: '氨氮', unit: ' mg/L' },
  fluoride: { label: '氟化物', unit: ' mg/L' },
  totalNitrogen: { label: '总氮', unit: ' mg/L' },
  totalPhosphorus: { label: '总磷', unit: ' mg/L' },
  ph: { label: 'pH', unit: '' },
  flow: { label: '流量', unit: ' m³/h' },
  pm25: { label: 'PM2.5', unit: ' µg/m³' },
  pm10: { label: 'PM10', unit: ' µg/m³' },
  so2: { label: 'SO₂', unit: ' µg/m³' },
  nox: { label: 'NOx', unit: ' µg/m³' },
  ozone: { label: 'O₃', unit: ' µg/m³' },
  tvoc: { label: 'TVOC', unit: ' ppb' },
  noise: { label: '噪声', unit: ' dB' },
  temperature: { label: '温度', unit: ' ℃' },
}

const monitorMetrics = computed(() => {
  if (!monitorPoint.value) return []
  const d = monitorPoint.value.latestData
  const std = monitorPoint.value.standard
  return Object.entries(d)
    .filter(([, v]) => v !== 0 && v !== undefined)
    .map(([key, val]) => {
      const meta = metricLabels[key] || { label: key, unit: '' }
      const stdVal = std[key as keyof typeof std]
      const exceed = typeof stdVal === 'number' ? (val as number) > stdVal : false
      return { label: meta.label, value: (val as number).toFixed(1), unit: meta.unit, exceed }
    })
})

// ===== 趋势图：24 小时整点数据（默认）+ 历史趋势（近 3 个月逐日数据） =====
const TREND_DAYS = 90
const trendColors = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#38bdf8', '#f472b6', '#a78bfa', '#facc15']

// 趋势模式：24小时（默认）/ 历史趋势
const trendMode = ref<'day' | 'history'>('day')

function fmtDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function dateLabel(dateStr: string): string {
  const [, m, d] = dateStr.split('-')
  return `${Number(m)}月${Number(d)}日`
}

// 近 90 天日期列表（升序）
const trendDates: string[] = Array.from({ length: TREND_DAYS }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - (TREND_DAYS - 1 - i))
  return fmtDate(d)
})

// 24 小时整点数据（默认展示）
const hourPoints = ref<{ hour: number; values: Record<string, number> }[]>([])
const trendStartHour = ref(0)
const trendEndHour = ref(23)

// 历史趋势：近 3 个月逐日数据，默认展示近 7 天
const datePoints = ref<{ date: string; values: Record<string, number> }[]>([])
const trendStartDate = ref(trendDates[TREND_DAYS - 7])
const trendEndDate = ref(trendDates[TREND_DAYS - 1])

const metricKeys = computed(() => {
  if (!monitorPoint.value) return []
  const data = monitorPoint.value.latestData as Record<string, number | undefined>
  return Object.keys(data).filter(k => data[k] !== 0 && data[k] !== undefined)
})

// 选定点位后生成 24 小时整点 + 近 90 天逐日两组趋势数据
function buildTrend() {
  const mp = monitorPoint.value
  if (!mp) { hourPoints.value = []; datePoints.value = []; return }
  const data = mp.latestData as Record<string, number | undefined>
  const keys = Object.keys(data).filter(k => data[k] !== 0 && data[k] !== undefined)

  hourPoints.value = Array.from({ length: 24 }, (_, hour) => {
    const values: Record<string, number> = {}
    for (const key of keys) {
      const base = data[key] as number
      const variance = Math.max(base * 0.15, 0.5)
      values[key] = Math.round((base + (Math.random() - 0.5) * variance) * 100) / 100
    }
    return { hour, values }
  })

  datePoints.value = trendDates.map((date, idx) => {
    const values: Record<string, number> = {}
    for (const key of keys) {
      const base = data[key] as number
      const variance = Math.max(base * 0.12, 0.3)
      const wave = Math.sin(idx / 6) * base * 0.06
      values[key] = Math.round((base + wave + (Math.random() - 0.5) * variance) * 100) / 100
    }
    return { date, values }
  })
}

// 切换点位时重置筛选并重新生成趋势
watch(monitorPoint, () => {
  trendStartHour.value = 0
  trendEndHour.value = 23
  trendStartDate.value = trendDates[TREND_DAYS - 7]
  trendEndDate.value = trendDates[TREND_DAYS - 1]
  buildTrend()
})

// 当前模式下的筛选数据（统一为 label / raw / values 供图表与导出使用）
const activeTrendPoints = computed(() => {
  if (trendMode.value === 'day') {
    const start = Math.min(trendStartHour.value, trendEndHour.value)
    const end = Math.max(trendStartHour.value, trendEndHour.value)
    return hourPoints.value
      .filter(p => p.hour >= start && p.hour <= end)
      .map(p => ({ label: `${p.hour}:00`, raw: `${p.hour}:00`, values: p.values }))
  }
  const a = trendStartDate.value
  const b = trendEndDate.value
  const start = a <= b ? a : b
  const end = a <= b ? b : a
  return datePoints.value
    .filter(p => p.date >= start && p.date <= end)
    .map(p => ({ label: dateLabel(p.date), raw: p.date, values: p.values }))
})

const trendXData = computed(() => activeTrendPoints.value.map(p => p.label))

const trendSeries = computed(() => {
  if (!monitorPoint.value || !metricKeys.value.length) return []
  return metricKeys.value.map((key, i) => ({
    name: metricLabels[key]?.label || key,
    data: activeTrendPoints.value.map(p => p.values[key] ?? 0),
    color: trendColors[i % trendColors.length],
    yAxisIndex: key === 'flow' || key === 'noise' ? 1 : 0,
  }))
})

// 纵坐标轴：按点位类型给出刻度间隔与单位
const trendYAxis = computed(() => {
  const type = selectedMarker.value?.type
  if (type === 'air_station') return { interval: 50, name: 'µg/m³' }
  if (type === 'discharge_outlet') return { interval: 50, name: 'mg/L' }
  return { interval: undefined, name: '' }
})

// 右轴：流量 / 噪声单独成轴，单位分别为 m³/h、dB
const trendY2Name = computed(() => {
  const type = selectedMarker.value?.type
  if (type === 'discharge_outlet') return 'm³/h'
  if (type === 'air_station' || type === 'odor') return 'dB'
  return ''
})

// 各指标在筛选时段内的平均值
const avgStats = computed(() => {
  if (!activeTrendPoints.value.length || !monitorPoint.value) return []
  const data = monitorPoint.value.latestData as Record<string, number | undefined>
  return metricKeys.value.map(key => {
    const sum = activeTrendPoints.value.reduce((s, p) => s + (p.values[key] ?? 0), 0)
    const avg = sum / activeTrendPoints.value.length
    const bv = data[key] ?? avg
    const decimals = Number.isInteger(bv) ? 0 : Math.min((String(bv).split('.')[1] || '').length, 2)
    return {
      label: metricLabels[key]?.label || key,
      value: avg.toFixed(decimals),
      unit: metricLabels[key]?.unit || '',
    }
  })
})

// 导出筛选时段的趋势数据为 CSV（带 BOM，便于 Excel 打开中文）
function exportTrend() {
  if (!activeTrendPoints.value.length || !metricKeys.value.length) return
  const keys = metricKeys.value
  const isDay = trendMode.value === 'day'
  const header = [isDay ? '时间' : '日期', ...keys.map(k => metricLabels[k]?.label || k)].join(',')
  const rows = activeTrendPoints.value.map(p =>
    [p.raw, ...keys.map(k => p.values[k] ?? '')].join(',')
  )
  const csv = '﻿' + [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${monitorPoint.value?.name || '监测点位'}_${isDay ? '24小时' : '近3个月'}趋势.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ===== 辅助标签 =====
const typeLabels: Record<string, string> = {
  enterprise: '企业',
  fluoride_pool: '氟化物预处理池',
  discharge_outlet: '排污口',
  air_station: '大气监测站',
  rain_outlet: '雨排口',
  voc: 'VOCs监测点',
  odor: '恶臭监测点',
  waste_storage: '固废暂存站',
  weigh_station: '地磅称重点',
}
const typeLabel = computed(() => selectedMarker.value ? (typeLabels[selectedMarker.value.type] || selectedMarker.value.type) : '')
const zoneLabels: Record<string, string> = { east: '东部', center: '中部', west: '西部' }
const zoneLabel = computed(() => selectedMarker.value ? (zoneLabels[selectedMarker.value.zone] || selectedMarker.value.zone) : '')
const statusText = computed(() => {
  if (!selectedMarker.value) return ''
  const s = selectedMarker.value.status
  if (s === 'normal') return '正常'
  if (s === 'warning') return '预警'
  return '报警'
})
const statusClass = computed(() => {
  if (!selectedMarker.value) return ''
  const s = selectedMarker.value.status
  if (s === 'normal') return 'text-emerald-400'
  if (s === 'warning') return 'text-amber-400'
  return 'text-rose-400'
})

// ===== 图例数据（带 SVG 图标，按当前园区实际设施动态裁剪） =====
const allLegendLayers: { type: string; label: string; svg: string }[] = [
  { type: 'boundary', label: '四至范围', svg: '<svg width="16" height="14" viewBox="0 0 16 14"><rect x="2" y="2" width="12" height="10" rx="1" fill="#06b6d4" fill-opacity="0.06" stroke="#22d3ee" stroke-width="1.2"/></svg>' },
  { type: 'building', label: '楼栋', svg: '<svg width="16" height="14" viewBox="0 0 16 14"><rect x="2" y="1.5" width="12" height="11" rx="1" fill="#67e8f9" fill-opacity="0.25" stroke="#67e8f9" stroke-width="0.9"/><path d="M2,6.5 H14" stroke="#67e8f9" stroke-width="0.7"/><path d="M6,1.5 V6.5 M10,1.5 V6.5" stroke="#67e8f9" stroke-width="0.7"/><rect x="4" y="8" width="2.2" height="2" fill="#67e8f9" fill-opacity="0.7"/><rect x="9.8" y="8" width="2.2" height="2" fill="#67e8f9" fill-opacity="0.7"/></svg>' },
  { type: 'discharge_outlet', label: '排污口', svg: '<svg width="16" height="14" viewBox="0 0 16 14"><rect x="1" y="4.5" width="8" height="4" rx="1" fill="#06b6d4" fill-opacity="0.3" stroke="#06b6d4" stroke-width="0.6"/><path d="M9,4.5 L12,2 L12,11 L9,8.5 Z" fill="#06b6d4" fill-opacity="0.3" stroke="#06b6d4" stroke-width="0.6"/><ellipse cx="13.5" cy="6.5" rx="1.2" ry="1.8" fill="#06b6d4" fill-opacity="0.5"/></svg>' },
  { type: 'air_station', label: '大气监测站', svg: '<svg width="16" height="16" viewBox="0 0 16 16"><rect x="7" y="5" width="2" height="8" rx="0.5" fill="#06b6d4" fill-opacity="0.6"/><circle cx="8" cy="4.5" r="1.2" fill="#06b6d4" fill-opacity="0.5"/><path d="M8,4.5 Q3.5,0 5,0.5 Q8,3 8,4.5" fill="#06b6d4" fill-opacity="0.4"/><path d="M8,4.5 Q13,3.5 13,6 Q10,5 8,4.5" fill="#06b6d4" fill-opacity="0.4"/><rect x="5" y="13" width="6" height="1.5" rx="0.5" fill="#06b6d4" fill-opacity="0.3"/></svg>' },
]

// 当前园区存在哪些标记类型（'all' 时取全部）
const zoneMarkerTypes = computed(() => {
  const z = props.activeZone
  const markers = z === 'all' ? mapMarkers : mapMarkers.filter(m => m.zone === z)
  return new Set(markers.map(m => m.type))
})

// 当前园区是否有带状态的监测标记（排污口/大气监测站），没有则不显示状态分级图例
const hasStatusMarkers = computed(() =>
  zoneMarkerTypes.value.has('discharge_outlet') || zoneMarkerTypes.value.has('air_station')
)

// 楼栋始终显示；排污口/大气监测站仅当当前园区有对应标记时显示
const legendLayers = computed(() =>
  allLegendLayers.filter(l => l.type === 'building' || l.type === 'boundary' || zoneMarkerTypes.value.has(l.type))
)
</script>

<style scoped>
.pop-enter-active, .pop-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.92); }
.drop-enter-active, .drop-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-4px) scale(0.98); }

/* 趋势图时间筛选下拉 */
.trend-hour-select {
  width: 64px !important;
}
.trend-date-select {
  width: 96px !important;
}
.trend-hour-select :deep(.el-select__wrapper),
.trend-date-select :deep(.el-select__wrapper) {
  background-color: #0b2152 !important;
  border: 1px solid rgba(6, 182, 212, 0.35) !important;
  box-shadow: none !important;
  border-radius: 4px;
  height: 22px !important;
  min-height: 22px !important;
}
.trend-hour-select :deep(.el-select__selected-item),
.trend-hour-select :deep(.el-select__placeholder),
.trend-date-select :deep(.el-select__selected-item),
.trend-date-select :deep(.el-select__placeholder) {
  color: #22d3ee !important;
  font-family: monospace;
  font-size: 11px;
}
.trend-hour-select :deep(.el-select__caret),
.trend-date-select :deep(.el-select__caret) {
  color: #22d3ee !important;
}
</style>

<style>
/* 高德地图标记点样式（非 scoped，供 AMap 注入的 DOM 使用） */
.park-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  pointer-events: auto;
  cursor: pointer;
}
.park-marker-name {
  font-size: 12px;
  line-height: 1;
  color: #dbeafe;
  background: rgba(4, 14, 41, 0.8);
  border: 1px solid rgba(34, 211, 238, 0.3);
  border-radius: 4px;
  padding: 3px 6px;
  white-space: nowrap;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

/* 楼栋标记（真实 KML 楼栋号） */
.park-building {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  pointer-events: auto;
  cursor: pointer;
}
.park-building-icon {
  display: block;
  line-height: 0;
  filter: drop-shadow(0 0 5px rgba(103, 232, 249, 0.9));
}
.park-building-name {
  font-size: 10px;
  line-height: 1;
  color: #cffafe;
  white-space: nowrap;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.9);
}
</style>