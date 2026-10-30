/**
 * 地图标记点数据
 * 坐标基于园区全景背景图的百分比位置 (0-100)
 * 西部(x:10-35) | 中部(x:38-62) | 东部(x:65-90)
 */

import { centerParkCenter, centerParkBounds, centerParkPolygon, eastParkBounds, westParkBounds } from './parkKml'

export type MarkerType = 'enterprise' | 'fluoride_pool' | 'discharge_outlet' | 'air_station' | 'rain_outlet' | 'voc' | 'odor' | 'waste_storage' | 'weigh_station'
export type MarkerStatus = 'normal' | 'warning' | 'alert'

export interface MapMarker {
  id: string
  type: MarkerType
  name: string
  x: number
  y: number
  zone: 'west' | 'center' | 'east'
  status: MarkerStatus
  enterpriseId?: string        // 关联企业ID
  buildingId?: string          // 关联楼栋ID
  monitoringPointId?: string   // 关联监测点位ID
}

// SVG 形状映射
export const markerShapes: Record<MarkerType, 'circle' | 'diamond' | 'square' | 'triangle' | 'hexagon'> = {
  enterprise: 'circle',
  fluoride_pool: 'diamond',
  discharge_outlet: 'circle',
  air_station: 'hexagon',
  rain_outlet: 'circle',
  voc: 'triangle',
  odor: 'triangle',
  waste_storage: 'square',
  weigh_station: 'square',
}

// 颜色映射（参照「总览驾驶舱0325终版」状态色：绿 #00ff99 / 橙 #fdad43 / 红 #ff4a4a）
export const statusColors: Record<MarkerStatus, string> = {
  normal: '#00ff99',
  warning: '#fdad43',
  alert: '#ff4a4a',
}

export const mapMarkers: MapMarker[] = [
  // ===== 西部区块 (x: 10-35) =====
  // 企业标记 - 西部
  { id: 'mk-e-01', type: 'enterprise', name: '华兴第一水晶工坊', x: 28, y: 32, zone: 'west', status: 'normal', enterpriseId: 'ent-001', buildingId: 'bld-a' },
  { id: 'mk-e-02', type: 'enterprise', name: '恒泰水晶高精磨砂', x: 22, y: 44, zone: 'west', status: 'alert', enterpriseId: 'ent-002', buildingId: 'bld-b' },
  { id: 'mk-e-03', type: 'enterprise', name: '浦江晶彩光学科技', x: 30, y: 52, zone: 'west', status: 'normal', enterpriseId: 'ent-003', buildingId: 'bld-c' },
  { id: 'mk-e-04', type: 'enterprise', name: '金华锦程水晶灯饰', x: 18, y: 36, zone: 'west', status: 'normal', enterpriseId: 'ent-004', buildingId: 'bld-a' },
  { id: 'mk-e-05', type: 'enterprise', name: '恒瑞水晶饰品厂', x: 26, y: 48, zone: 'west', status: 'normal', enterpriseId: 'ent-005', buildingId: 'bld-b' },
  { id: 'mk-e-06', type: 'enterprise', name: '浦江耀达水晶工艺', x: 15, y: 28, zone: 'west', status: 'normal', enterpriseId: 'ent-006', buildingId: 'bld-a' },
  { id: 'mk-e-07', type: 'enterprise', name: '恒锐水晶研磨材料', x: 32, y: 58, zone: 'west', status: 'warning', enterpriseId: 'ent-007', buildingId: 'bld-c' },
  { id: 'mk-e-08', type: 'enterprise', name: '浦江恒盛水晶配件', x: 20, y: 55, zone: 'west', status: 'normal', enterpriseId: 'ent-008', buildingId: 'bld-c' },
  { id: 'mk-e-09', type: 'enterprise', name: '金华明辉水晶制品', x: 25, y: 38, zone: 'west', status: 'normal', enterpriseId: 'ent-009', buildingId: 'bld-b' },
  { id: 'mk-e-10', type: 'enterprise', name: '浦江永达水晶加工', x: 12, y: 42, zone: 'west', status: 'normal', enterpriseId: 'ent-010', buildingId: 'bld-b' },
  { id: 'mk-e-11', type: 'enterprise', name: '浦江鑫达物流服务', x: 16, y: 50, zone: 'west', status: 'normal', enterpriseId: 'ent-011', buildingId: 'bld-c' },
  { id: 'mk-e-12', type: 'enterprise', name: '恒信环保设备服务', x: 28, y: 62, zone: 'west', status: 'normal', enterpriseId: 'ent-012', buildingId: 'bld-c' },

  // 西部监测点
  { id: 'mk-f-01', type: 'fluoride_pool', name: '华兴氟化物预处理池', x: 27, y: 35, zone: 'west', status: 'normal', monitoringPointId: 'fp-001' },
  { id: 'mk-f-02', type: 'fluoride_pool', name: '恒泰氟化物预处理池', x: 23, y: 47, zone: 'west', status: 'alert', monitoringPointId: 'fp-002' },
  { id: 'mk-f-03', type: 'fluoride_pool', name: '恒锐氟化物预处理池', x: 31, y: 56, zone: 'west', status: 'warning', monitoringPointId: 'fp-007' },
  { id: 'mk-v-01', type: 'voc', name: '西部VOCs监测站', x: 24, y: 30, zone: 'west', status: 'normal', monitoringPointId: 'voc-001' },
  { id: 'mk-r-01', type: 'rain_outlet', name: '西部雨排口', x: 34, y: 55, zone: 'west', status: 'normal', monitoringPointId: 'ro-001' },

  // ===== 中部区块 (x: 38-62) =====
  // 企业标记 - 中部
  { id: 'mk-c-01', type: 'enterprise', name: '浦江智感环境净化中心', x: 50, y: 42, zone: 'center', status: 'normal', enterpriseId: 'ent-013', buildingId: 'bld-e' },
  { id: 'mk-c-02', type: 'enterprise', name: '千叶高精度雕刻厂', x: 46, y: 28, zone: 'center', status: 'normal', enterpriseId: 'ent-014', buildingId: 'bld-d' },
  { id: 'mk-c-03', type: 'enterprise', name: '浦江晶智激光科技', x: 54, y: 36, zone: 'center', status: 'normal', enterpriseId: 'ent-015', buildingId: 'bld-e' },
  { id: 'mk-c-04', type: 'enterprise', name: '浦江恒丰水晶原料', x: 42, y: 52, zone: 'center', status: 'normal', enterpriseId: 'ent-016', buildingId: 'bld-f' },
  { id: 'mk-c-05', type: 'enterprise', name: '智美激光水晶工艺', x: 56, y: 48, zone: 'center', status: 'normal', enterpriseId: 'ent-017', buildingId: 'bld-g' },
  { id: 'mk-c-06', type: 'enterprise', name: '浦江天晶光电科技', x: 48, y: 60, zone: 'center', status: 'normal', enterpriseId: 'ent-018', buildingId: 'bld-f' },
  { id: 'mk-c-07', type: 'enterprise', name: '浦江永盛水晶贸易', x: 40, y: 34, zone: 'center', status: 'normal', enterpriseId: 'ent-019', buildingId: 'bld-d' },
  { id: 'mk-c-08', type: 'enterprise', name: '浦江欣达水晶加工', x: 52, y: 55, zone: 'center', status: 'normal', enterpriseId: 'ent-020', buildingId: 'bld-g' },
  { id: 'mk-c-09', type: 'enterprise', name: '金华润泽水晶制造', x: 58, y: 62, zone: 'center', status: 'warning', enterpriseId: 'ent-021', buildingId: 'bld-g' },
  { id: 'mk-c-10', type: 'enterprise', name: '浦江恒达水晶模具', x: 44, y: 44, zone: 'center', status: 'normal', enterpriseId: 'ent-022', buildingId: 'bld-e' },
  { id: 'mk-c-11', type: 'enterprise', name: '浦江园区物业管理', x: 50, y: 68, zone: 'center', status: 'normal', enterpriseId: 'ent-023', buildingId: 'bld-support-1' },
  { id: 'mk-c-12', type: 'enterprise', name: '浦江水晶检验检测', x: 55, y: 28, zone: 'center', status: 'normal', enterpriseId: 'ent-024', buildingId: 'bld-rd' },
  { id: 'mk-c-13', type: 'enterprise', name: '浦江创业服务中心', x: 42, y: 65, zone: 'center', status: 'normal', enterpriseId: 'ent-025', buildingId: 'bld-support-1' },
  { id: 'mk-c-14', type: 'enterprise', name: '金华诚信水晶清洗', x: 60, y: 45, zone: 'center', status: 'normal', enterpriseId: 'ent-026', buildingId: 'bld-g' },

  // 中部监测点（仅 1 个排污口 + 2 个厂界废气监测站）
  // 按楼栋定位：排污口在 22#/8# 中间空地；废气监测站1在综合楼A、2在G号楼
  { id: 'mk-d-03', type: 'discharge_outlet', name: '中部排污口', x: 16.8, y: 64.82, zone: 'center', status: 'normal', monitoringPointId: 'do-003' },
  { id: 'mk-a-01', type: 'air_station', name: '厂界废气监测站1', x: 72.45, y: 54.83, zone: 'center', status: 'normal', monitoringPointId: 'as-001' },
  { id: 'mk-a-02', type: 'air_station', name: '厂界废气监测站2', x: 9.73, y: 89.26, zone: 'center', status: 'normal', monitoringPointId: 'as-002' },

  // ===== 东部区块 (x: 65-90) =====
  // 企业标记 - 东部
  { id: 'mk-w-01', type: 'enterprise', name: '浦江晨光水晶玻璃', x: 72, y: 32, zone: 'east', status: 'normal', enterpriseId: 'ent-027', buildingId: 'bld-h' },
  { id: 'mk-w-02', type: 'enterprise', name: '金华恒信水晶磨片', x: 78, y: 44, zone: 'east', status: 'normal', enterpriseId: 'ent-028', buildingId: 'bld-i' },
  { id: 'mk-w-03', type: 'enterprise', name: '浦江金鑫水晶制品', x: 68, y: 52, zone: 'east', status: 'normal', enterpriseId: 'ent-029', buildingId: 'bld-j' },
  { id: 'mk-w-04', type: 'enterprise', name: '浦江利达水晶切割', x: 82, y: 55, zone: 'east', status: 'alert', enterpriseId: 'ent-030', buildingId: 'bld-k' },
  { id: 'mk-w-05', type: 'enterprise', name: '浦江宇通水晶设备', x: 75, y: 38, zone: 'east', status: 'normal', enterpriseId: 'ent-031', buildingId: 'bld-i' },
  { id: 'mk-w-06', type: 'enterprise', name: '金华嘉诚水晶镀膜', x: 70, y: 48, zone: 'east', status: 'normal', enterpriseId: 'ent-032', buildingId: 'bld-j' },
  { id: 'mk-w-07', type: 'enterprise', name: '浦江恒久水晶抛光', x: 85, y: 40, zone: 'east', status: 'normal', enterpriseId: 'ent-033', buildingId: 'bld-k' },
  { id: 'mk-w-08', type: 'enterprise', name: '浦江光大水晶表面处理', x: 66, y: 42, zone: 'east', status: 'normal', enterpriseId: 'ent-034', buildingId: 'bld-h' },
  { id: 'mk-w-09', type: 'enterprise', name: '浦江安泰环保科技', x: 80, y: 60, zone: 'east', status: 'normal', enterpriseId: 'ent-035', buildingId: 'bld-k' },
  { id: 'mk-w-10', type: 'enterprise', name: '浦江通达运输服务', x: 74, y: 62, zone: 'east', status: 'normal', enterpriseId: 'ent-036', buildingId: 'bld-support-2' },

  // 东部监测点
  { id: 'mk-f-07', type: 'fluoride_pool', name: '晨光氟化物预处理池', x: 73, y: 35, zone: 'east', status: 'normal', monitoringPointId: 'fp-005' },
  { id: 'mk-f-08', type: 'fluoride_pool', name: '利达氟化物预处理池', x: 83, y: 53, zone: 'east', status: 'alert', monitoringPointId: 'fp-006' },
  { id: 'mk-f-09', type: 'fluoride_pool', name: '光大氟化物预处理池', x: 67, y: 45, zone: 'east', status: 'normal', monitoringPointId: 'fp-009' },
  { id: 'mk-f-10', type: 'fluoride_pool', name: '嘉诚氟化物预处理池', x: 71, y: 50, zone: 'east', status: 'normal', monitoringPointId: 'fp-010' },
  // 东部排污口：位于 35# 正下方（园区内）
  { id: 'mk-d-05', type: 'discharge_outlet', name: '东部排口', x: 58.2, y: 70, zone: 'east', status: 'normal', monitoringPointId: 'do-004' },
  { id: 'mk-v-03', type: 'voc', name: '东部VOCs监测站', x: 78, y: 35, zone: 'east', status: 'normal', monitoringPointId: 'voc-003' },
  { id: 'mk-o-02', type: 'odor', name: '西北恶臭监测点', x: 84, y: 45, zone: 'east', status: 'warning', monitoringPointId: 'od-002' },
  { id: 'mk-o-03', type: 'odor', name: '西南恶臭监测点', x: 70, y: 60, zone: 'east', status: 'normal', monitoringPointId: 'od-003' },
  { id: 'mk-v-04', type: 'voc', name: '西北VOCs监测站', x: 86, y: 50, zone: 'east', status: 'normal', monitoringPointId: 'voc-004' },
  { id: 'mk-v-05', type: 'voc', name: '西南VOCs监测站', x: 72, y: 55, zone: 'east', status: 'normal', monitoringPointId: 'voc-005' },
  { id: 'mk-r-04', type: 'rain_outlet', name: '东部雨排口', x: 65, y: 50, zone: 'east', status: 'normal', monitoringPointId: 'ro-003' },

  // ===== 固废存储 =====
  { id: 'mk-ws-03', type: 'waste_storage', name: '西部固废中转站', x: 10, y: 60, zone: 'west', status: 'normal' },
]

// 按类型筛选的辅助函数
export const getMarkersByType = (type: MarkerType): MapMarker[] =>
  mapMarkers.filter(m => m.type === type)

// 按区块筛选
export const getMarkersByZone = (zone: 'west' | 'center' | 'east' | 'all'): MapMarker[] =>
  zone === 'all' ? mapMarkers : mapMarkers.filter(m => m.zone === zone)

// 获取企业标记
export const enterpriseMarkers = getMarkersByType('enterprise')

// 获取监测标记（非企业）
export const monitoringMarkers = mapMarkers.filter(m => m.type !== 'enterprise')

// ==================== 高德地图 · 中部产业园 真实地理坐标（来自 中部产业园.kml） ====================
// 园区中心 / 包围盒 / 边界多边形均取自 KML 实际坐标（已转换为高德 GCJ-02）
export const parkCenter: [number, number] = centerParkCenter

export const parkBounds = centerParkBounds

export const parkBoundaryPath: [number, number][] = centerParkPolygon

// 百分比坐标 (x, y ∈ 0-100) → 高德经纬度 [lng, lat]
// x 从左(西)到右(东)递增；y 从上(北)到下(南)递增
// zone 决定使用哪个园区的 KML 包围盒
export function markerToLngLat(x: number, y: number, zone: 'west' | 'center' | 'east' = 'center'): [number, number] {
  const b = zone === 'east' ? eastParkBounds : zone === 'west' ? westParkBounds : centerParkBounds
  const lng = b.west + (x / 100) * (b.east - b.west)
  const lat = b.north - (y / 100) * (b.north - b.south)
  return [lng, lat]
}
