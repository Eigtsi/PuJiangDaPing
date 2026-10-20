<template>
  <div class="relative w-full h-full overflow-hidden bg-[#040e29]">
    <!-- 高德地图容器（z-0 隔离，避免地图内部高层级元素外溢覆盖悬浮层） -->
    <div ref="mapEl" class="absolute inset-0 w-full h-full z-0"></div>

    <!-- 底部暗色过渡（与主题融合，降低透明度避免遮挡地图） -->
    <div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#040e29]/45 via-[#040e29]/15 to-transparent pointer-events-none z-10"></div>

    <!-- 左上角：地图说明 -->
    <div class="absolute top-3 left-3 z-20 pointer-events-none">
      <div class="bg-black/85 border border-neon-blue/40 px-3 py-1.5 rounded-md backdrop-blur-md text-xs text-white/80 font-mono shadow-[0_8px_24px_rgba(0,242,255,0.15)] flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-[#00ff99] animate-pulse shadow-[0_0_6px_rgba(0,255,153,0.8)]" />
        <span>中部产业园 · 高德卫星影像</span>
      </div>
    </div>

    <!-- 右下角：监控图例（可收缩/展开，参照总览驾驶舱 LegendPanel「分级图例」样式） -->
    <div class="absolute bottom-[90px] right-[450px] z-30 font-sans">
      <div class="relative tech-panel rounded-lg w-[240px]">
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
          <!-- 状态分级 — 渐变色带（正常→预警→报警） -->
          <div class="mb-2">
            <div class="h-2 rounded-full bg-gradient-to-r from-[#00ff99] via-[#fdad43] to-[#ff4a4a] shadow-[0_0_10px_rgba(0,255,153,0.25)]" />
            <div class="flex justify-between text-[10px] mt-1.5 font-mono">
              <span class="flex items-center gap-1 text-[#00ff99]"><span class="w-1.5 h-1.5 rounded-full bg-[#00ff99] shadow-[0_0_5px_rgba(0,255,153,0.8)]" />正常</span>
              <span class="flex items-center gap-1 text-[#fdad43]"><span class="w-1.5 h-1.5 rounded-full bg-[#fdad43] shadow-[0_0_5px_rgba(253,173,67,0.8)]" />预警</span>
              <span class="flex items-center gap-1 text-[#ff4a4a]"><span class="w-1.5 h-1.5 rounded-full bg-[#ff4a4a] shadow-[0_0_5px_rgba(255,74,74,0.8)]" />报警</span>
            </div>
          </div>

          <!-- 类型图例 — 两列网格 -->
          <div class="grid grid-cols-2 gap-x-1.5 gap-y-0.5">
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

    <!-- 居中详情弹窗 -->
    <Transition name="pop">
      <div
        v-if="selectedMarker"
        class="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
      >
        <div
          :class="['pointer-events-auto relative bg-[#09224f]/95 border border-cyan-400 p-4 rounded-xl shadow-[0_8px_40px_rgba(6,182,212,0.5)] backdrop-blur-md', showMonitorDetail ? 'w-[460px] max-h-[80vh] overflow-y-auto' : 'w-[360px]']"
        >
          <div class="flex justify-between items-start border-b border-cyan-500/20 pb-2 mb-2.5">
            <div class="text-cyan-300 font-bold flex items-center gap-2 text-sm">
              <MapPin class="w-4 h-4" :class="selectedMarker.status === 'normal' ? 'text-emerald-400' : selectedMarker.status === 'warning' ? 'text-amber-400' : 'text-rose-400'" />
              <span>{{ selectedMarker.name }}</span>
            </div>
            <button @click="selectedMarker = null" class="text-slate-400 hover:text-cyan-400 transition p-1"><X class="w-4 h-4" /></button>
          </div>
          <div class="text-xs text-slate-400 mb-2">
            类型：<span class="text-cyan-300">{{ typeLabel }}</span> &nbsp;｜&nbsp;
            区块：<span class="text-cyan-300">{{ zoneLabel }}</span> &nbsp;｜&nbsp;
            状态：<span :class="statusClass">{{ statusText }}</span>
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
            <div v-else class="mt-2 bg-[#051330] p-3 rounded border border-cyan-500/15">
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
                <div class="text-xs text-cyan-400 font-bold mb-1.5">24小时趋势</div>
                <TechLineChart
                  :xData="trendXData"
                  :series="trendSeries"
                  :height="150"
                  :showArea="false"
                  :showLegend="true"
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
import { MapPin, X, BarChart3, ChevronDown, ChevronUp } from 'lucide-vue-next'
import TechLineChart from '../charts/TechLineChart.vue'
import { mapMarkers, markerToLngLat, parkCenter, statusColors } from '../../data/mapData'
import { monitoringPoints } from '../../data/monitoringPoints'
import { centerParkPolygon, centerParkBuildings } from '../../data/parkKml'
import type { MapMarker as MapMarkerData, MarkerType } from '../../data/mapData'

// ===== 高德地图配置 =====
const AMAP_KEY = '257fac0c1fa2489de0bdb41ccd9d2c9a'
const AMAP_SECURITY_CODE = '802734539e7ee46162776a47a7416c04'
;(window as any)._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY_CODE }

interface Props {
  bgImage?: string // 兼容旧接口；使用高德地图后不再依赖静态背景图
  activeZone: 'all' | 'east' | 'center' | 'west'
}

const props = withDefaults(defineProps<Props>(), { bgImage: '' })

const emit = defineEmits<{
  (e: 'selectEnterprise', id: string): void
  (e: 'selectMarker', marker: MapMarkerData): void
}>()

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

function toggleLayer(type: string) {
  if (type === 'building') {
    buildingsVisible.value = !buildingsVisible.value
    return
  }
  const s = new Set(visibleLayers.value)
  if (s.has(type as MarkerType)) s.delete(type as MarkerType); else s.add(type as MarkerType)
  visibleLayers.value = s
}

function isLayerVisible(type: string): boolean {
  if (type === 'building') return buildingsVisible.value
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
      center: parkCenter,
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
  boundaryPolygon.value = new AMap.Polygon({
    path: centerParkPolygon,
    strokeColor: '#22d3ee',
    strokeWeight: 2,
    strokeOpacity: 0.95,
    strokeStyle: 'solid',
    fillColor: '#06b6d4',
    fillOpacity: 0.06,
    zIndex: 5,
  })
  map.value.add(boundaryPolygon.value)
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

  centerParkBuildings.forEach(b => {
    const mk = new AMap.Marker({
      position: [b.lng, b.lat],
      content: buildingMarkerContent(b.name),
      offset: new AMap.Pixel(-9, -9),
      zIndex: 90,
      title: b.name,
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
    const [lng, lat] = markerToLngLat(m.x, m.y)
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

onBeforeUnmount(() => {
  try { map.value?.destroy() } catch (e) {}
})

// ===== 标记点击 =====
function handleMarkerClick(marker: MapMarkerData) {
  selectedMarker.value = marker
  dataTimestamp.value = formatNow()
  // 大气监测站、排污口直接展开实时数据与趋势曲线，跳过“查看详细监测数据”按钮
  showMonitorDetail.value = marker.type === 'air_station' || marker.type === 'discharge_outlet'
  emit('selectMarker', marker)
}

function formatNow(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
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

// 趋势图数据
const trendXData = Array.from({ length: 24 }, (_, i) => `${i}:00`)
const trendColors = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#38bdf8', '#f472b6', '#a78bfa', '#facc15']

// 为每个指标生成 24 小时趋势（围绕当前值波动）
function genTrendSeries(base: number): number[] {
  const variance = Math.max(base * 0.15, 0.5)
  return Array.from({ length: 24 }, () => {
    const v = base + (Math.random() - 0.5) * variance
    return Math.round(v * 100) / 100
  })
}

const trendSeries = computed(() => {
  if (!monitorPoint.value) return []
  const mp = monitorPoint.value
  return Object.entries(mp.latestData)
    .filter(([, v]) => v !== 0 && v !== undefined)
    .map(([key, val], i) => ({
      name: metricLabels[key]?.label || key,
      data: genTrendSeries(val as number),
      color: trendColors[i % trendColors.length],
    }))
})

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

// ===== 图例数据（带 SVG 图标） =====
const legendLayers: { type: string; label: string; svg: string }[] = [
  { type: 'building', label: '楼栋', svg: '<svg width="16" height="14" viewBox="0 0 16 14"><rect x="2" y="1.5" width="12" height="11" rx="1" fill="#67e8f9" fill-opacity="0.25" stroke="#67e8f9" stroke-width="0.9"/><path d="M2,6.5 H14" stroke="#67e8f9" stroke-width="0.7"/><path d="M6,1.5 V6.5 M10,1.5 V6.5" stroke="#67e8f9" stroke-width="0.7"/><rect x="4" y="8" width="2.2" height="2" fill="#67e8f9" fill-opacity="0.7"/><rect x="9.8" y="8" width="2.2" height="2" fill="#67e8f9" fill-opacity="0.7"/></svg>' },
  { type: 'discharge_outlet', label: '排污口', svg: '<svg width="16" height="14" viewBox="0 0 16 14"><rect x="1" y="4.5" width="8" height="4" rx="1" fill="#06b6d4" fill-opacity="0.3" stroke="#06b6d4" stroke-width="0.6"/><path d="M9,4.5 L12,2 L12,11 L9,8.5 Z" fill="#06b6d4" fill-opacity="0.3" stroke="#06b6d4" stroke-width="0.6"/><ellipse cx="13.5" cy="6.5" rx="1.2" ry="1.8" fill="#06b6d4" fill-opacity="0.5"/></svg>' },
  { type: 'air_station', label: '大气监测站', svg: '<svg width="16" height="16" viewBox="0 0 16 16"><rect x="7" y="5" width="2" height="8" rx="0.5" fill="#06b6d4" fill-opacity="0.6"/><circle cx="8" cy="4.5" r="1.2" fill="#06b6d4" fill-opacity="0.5"/><path d="M8,4.5 Q3.5,0 5,0.5 Q8,3 8,4.5" fill="#06b6d4" fill-opacity="0.4"/><path d="M8,4.5 Q13,3.5 13,6 Q10,5 8,4.5" fill="#06b6d4" fill-opacity="0.4"/><rect x="5" y="13" width="6" height="1.5" rx="0.5" fill="#06b6d4" fill-opacity="0.3"/></svg>' },
]
</script>

<style scoped>
.pop-enter-active, .pop-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.92); }
.drop-enter-active, .drop-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-4px) scale(0.98); }
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
  cursor: default;
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