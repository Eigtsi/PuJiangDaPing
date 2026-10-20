/**
 * 环境监测点位数据 — 浦江水晶园区综合管理平台
 * 涵盖氟化物池、排污口、空气站、雨排口、VOC、臭气等类型
 */

export interface MonitoringPoint {
  id: string
  name: string
  type: 'fluoride_pool' | 'discharge_outlet' | 'air_station' | 'rain_outlet' | 'voc' | 'odor'
  x: number
  y: number
  zone: 'east' | 'center' | 'west'
  online: boolean
  latestData: {
    cod?: number
    ammoniaNitrogen?: number
    fluoride?: number
    totalNitrogen?: number
    totalPhosphorus?: number
    ph?: number
    flow?: number
    pm25?: number
    pm10?: number
    so2?: number
    nox?: number
    ozone?: number
    tvoc?: number
    noise?: number
    temperature?: number
  }
  standard: {
    cod?: number
    ammoniaNitrogen?: number
    fluoride?: number
    totalPhosphorus?: number
    ph?: [number, number]
    pm25?: number
    pm10?: number
  }
  status: 'normal' | 'warning' | 'alert'
  trendData: number[]
}

function genTrend(base: number, variance: number, alertPos?: number): number[] {
  const arr: number[] = []
  for (let i = 0; i < 24; i++) {
    let v = base + (Math.random() - 0.5) * variance
    v = Math.round(v * 100) / 100
    arr.push(v)
  }
  if (alertPos !== undefined && alertPos >= 0 && alertPos < 24) {
    arr[alertPos] = base + variance * 0.8
  }
  return arr
}

export const monitoringPoints: MonitoringPoint[] = [
  // ========== 氟化物池 (10) ==========
  {
    id: 'fp-001',
    name: 'A区1号氟化池',
    type: 'fluoride_pool',
    x: 22,
    y: 28,
    zone: 'east',
    online: true,
    latestData: { cod: 38.2, ammoniaNitrogen: 1.6, fluoride: 5.4, totalNitrogen: 8.1, ph: 7.2 },
    standard: { cod: 60, ammoniaNitrogen: 5, fluoride: 8, ph: [6, 9] },
    status: 'normal',
    trendData: genTrend(5.2, 2.5)
  },
  {
    id: 'fp-002',
    name: 'A区2号氟化池',
    type: 'fluoride_pool',
    x: 18,
    y: 38,
    zone: 'east',
    online: true,
    latestData: { cod: 42.7, ammoniaNitrogen: 2.1, fluoride: 9.6, totalNitrogen: 10.3, ph: 6.8 },
    standard: { cod: 60, ammoniaNitrogen: 5, fluoride: 8, ph: [6, 9] },
    status: 'alert',
    trendData: genTrend(7.8, 3.2, 20)
  },
  {
    id: 'fp-003',
    name: 'B区1号氟化池',
    type: 'fluoride_pool',
    x: 48,
    y: 25,
    zone: 'center',
    online: true,
    latestData: { cod: 35.6, ammoniaNitrogen: 1.3, fluoride: 4.8, totalNitrogen: 7.5, ph: 7.4 },
    standard: { cod: 60, ammoniaNitrogen: 5, fluoride: 8, ph: [6, 9] },
    status: 'normal',
    trendData: genTrend(4.6, 2.0)
  },
  {
    id: 'fp-004',
    name: 'B区2号氟化池',
    type: 'fluoride_pool',
    x: 52,
    y: 35,
    zone: 'center',
    online: true,
    latestData: { cod: 51.3, ammoniaNitrogen: 3.8, fluoride: 7.6, totalNitrogen: 12.1, ph: 7.0 },
    standard: { cod: 60, ammoniaNitrogen: 5, fluoride: 8, ph: [6, 9] },
    status: 'warning',
    trendData: genTrend(6.9, 2.8)
  },
  {
    id: 'fp-005',
    name: 'C区1号氟化池',
    type: 'fluoride_pool',
    x: 75,
    y: 22,
    zone: 'west',
    online: true,
    latestData: { cod: 29.8, ammoniaNitrogen: 1.1, fluoride: 3.9, totalNitrogen: 6.4, ph: 7.5 },
    standard: { cod: 60, ammoniaNitrogen: 5, fluoride: 8, ph: [6, 9] },
    status: 'normal',
    trendData: genTrend(3.8, 1.8)
  },
  {
    id: 'fp-006',
    name: 'C区2号氟化池',
    type: 'fluoride_pool',
    x: 78,
    y: 32,
    zone: 'west',
    online: true,
    latestData: { cod: 44.5, ammoniaNitrogen: 2.4, fluoride: 6.2, totalNitrogen: 9.3, ph: 7.1 },
    standard: { cod: 60, ammoniaNitrogen: 5, fluoride: 8, ph: [6, 9] },
    status: 'normal',
    trendData: genTrend(5.9, 2.2)
  },
  {
    id: 'fp-007',
    name: 'A区3号氟化池',
    type: 'fluoride_pool',
    x: 26,
    y: 48,
    zone: 'east',
    online: true,
    latestData: { cod: 56.8, ammoniaNitrogen: 4.2, fluoride: 10.3, totalNitrogen: 14.7, ph: 5.8 },
    standard: { cod: 60, ammoniaNitrogen: 5, fluoride: 8, ph: [6, 9] },
    status: 'alert',
    trendData: genTrend(8.5, 3.5, 22)
  },
  {
    id: 'fp-008',
    name: 'B区3号氟化池',
    type: 'fluoride_pool',
    x: 45,
    y: 42,
    zone: 'center',
    online: false,
    latestData: { cod: 0, ammoniaNitrogen: 0, fluoride: 0, totalNitrogen: 0, ph: 0 },
    standard: { cod: 60, ammoniaNitrogen: 5, fluoride: 8, ph: [6, 9] },
    status: 'warning',
    trendData: genTrend(5.5, 0)
  },
  {
    id: 'fp-009',
    name: 'C区3号氟化池',
    type: 'fluoride_pool',
    x: 72,
    y: 45,
    zone: 'west',
    online: true,
    latestData: { cod: 33.1, ammoniaNitrogen: 1.5, fluoride: 4.2, totalNitrogen: 7.0, ph: 7.3 },
    standard: { cod: 60, ammoniaNitrogen: 5, fluoride: 8, ph: [6, 9] },
    status: 'normal',
    trendData: genTrend(4.1, 1.9)
  },
  {
    id: 'fp-010',
    name: 'A区4号氟化池',
    type: 'fluoride_pool',
    x: 30,
    y: 55,
    zone: 'east',
    online: true,
    latestData: { cod: 40.9, ammoniaNitrogen: 1.9, fluoride: 5.8, totalNitrogen: 8.8, ph: 7.0 },
    standard: { cod: 60, ammoniaNitrogen: 5, fluoride: 8, ph: [6, 9] },
    status: 'normal',
    trendData: genTrend(5.6, 2.4)
  },

  // ========== 排污口 (6) ==========
  {
    id: 'do-001',
    name: '园区总排污口',
    type: 'discharge_outlet',
    x: 50,
    y: 68,
    zone: 'center',
    online: true,
    latestData: { ph: 7.4, cod: 28.3, ammoniaNitrogen: 0.8, totalNitrogen: 5.4, totalPhosphorus: 0.42, fluoride: 2.1, flow: 186 },
    standard: { cod: 50, ammoniaNitrogen: 3, fluoride: 5, totalPhosphorus: 0.5, ph: [6, 9] },
    status: 'normal',
    trendData: genTrend(2.0, 1.5)
  },
  {
    id: 'do-002',
    name: 'A区排污口',
    type: 'discharge_outlet',
    x: 20,
    y: 62,
    zone: 'east',
    online: true,
    latestData: { ph: 7.1, cod: 45.6, ammoniaNitrogen: 2.9, totalNitrogen: 9.8, totalPhosphorus: 0.58, fluoride: 4.3, flow: 124 },
    standard: { cod: 50, ammoniaNitrogen: 3, fluoride: 5, totalPhosphorus: 0.5, ph: [6, 9] },
    status: 'warning',
    trendData: genTrend(4.1, 2.0)
  },
  {
    id: 'do-003',
    name: 'B区排污口',
    type: 'discharge_outlet',
    x: 55,
    y: 60,
    zone: 'center',
    online: true,
    latestData: { ph: 7.3, cod: 32.4, ammoniaNitrogen: 1.5, totalNitrogen: 6.7, totalPhosphorus: 0.35, fluoride: 2.8, flow: 142 },
    standard: { cod: 50, ammoniaNitrogen: 3, fluoride: 5, totalPhosphorus: 0.5, ph: [6, 9] },
    status: 'normal',
    trendData: genTrend(2.7, 1.6)
  },
  {
    id: 'do-004',
    name: 'C区排污口',
    type: 'discharge_outlet',
    x: 80,
    y: 55,
    zone: 'west',
    online: true,
    latestData: { ph: 7.0, cod: 38.7, ammoniaNitrogen: 2.2, totalNitrogen: 7.9, totalPhosphorus: 0.47, fluoride: 3.5, flow: 168 },
    standard: { cod: 50, ammoniaNitrogen: 3, fluoride: 5, totalPhosphorus: 0.5, ph: [6, 9] },
    status: 'normal',
    trendData: genTrend(3.3, 1.8)
  },
  {
    id: 'do-005',
    name: '污水处理厂排口',
    type: 'discharge_outlet',
    x: 42,
    y: 75,
    zone: 'center',
    online: true,
    latestData: { ph: 7.5, cod: 22.1, ammoniaNitrogen: 0.5, totalNitrogen: 4.2, totalPhosphorus: 0.28, fluoride: 1.6, flow: 210 },
    standard: { cod: 50, ammoniaNitrogen: 3, fluoride: 5, totalPhosphorus: 0.5, ph: [6, 9] },
    status: 'normal',
    trendData: genTrend(1.5, 1.0)
  },
  {
    id: 'do-006',
    name: '应急排污口',
    type: 'discharge_outlet',
    x: 62,
    y: 72,
    zone: 'center',
    online: false,
    latestData: { ph: 0, cod: 0, ammoniaNitrogen: 0, totalNitrogen: 0, totalPhosphorus: 0, fluoride: 0, flow: 0 },
    standard: { cod: 50, ammoniaNitrogen: 3, fluoride: 5, totalPhosphorus: 0.5, ph: [6, 9] },
    status: 'warning',
    trendData: genTrend(0, 0)
  },

  // ========== 空气质量站 (2) ==========
  {
    id: 'as-001',
    name: '厂界废气监测站1',
    type: 'air_station',
    x: 50,
    y: 15,
    zone: 'center',
    online: true,
    latestData: {
      pm25: 35,
      pm10: 68,
      so2: 12,
      nox: 28,
      ozone: 95,
      tvoc: 120,
      noise: 58.3,
      temperature: 24.6
    },
    standard: { pm25: 75, pm10: 150 },
    status: 'normal',
    trendData: genTrend(33, 18)
  },
  {
    id: 'as-002',
    name: '厂界废气监测站2',
    type: 'air_station',
    x: 65,
    y: 50,
    zone: 'west',
    online: true,
    latestData: {
      pm25: 52,
      pm10: 89,
      so2: 18,
      nox: 42,
      ozone: 128,
      tvoc: 210,
      noise: 63.7,
      temperature: 25.1
    },
    standard: { pm25: 75, pm10: 150 },
    status: 'warning',
    trendData: genTrend(48, 22)
  },

  // ========== 雨排口 (4) ==========
  {
    id: 'ro-001',
    name: 'A区雨排口',
    type: 'rain_outlet',
    x: 12,
    y: 50,
    zone: 'east',
    online: true,
    latestData: { cod: 15.2, ammoniaNitrogen: 0.6, ph: 7.1, fluoride: 0.8 },
    standard: { cod: 30, ammoniaNitrogen: 2, fluoride: 2, ph: [6, 9] },
    status: 'normal',
    trendData: genTrend(0.7, 0.8)
  },
  {
    id: 'ro-002',
    name: 'B区雨排口',
    type: 'rain_outlet',
    x: 40,
    y: 52,
    zone: 'center',
    online: true,
    latestData: { cod: 18.6, ammoniaNitrogen: 0.9, ph: 6.9, fluoride: 1.2 },
    standard: { cod: 30, ammoniaNitrogen: 2, fluoride: 2, ph: [6, 9] },
    status: 'normal',
    trendData: genTrend(1.1, 0.9)
  },
  {
    id: 'ro-003',
    name: 'C区雨排口',
    type: 'rain_outlet',
    x: 85,
    y: 42,
    zone: 'west',
    online: true,
    latestData: { cod: 21.4, ammoniaNitrogen: 1.3, ph: 7.2, fluoride: 1.7 },
    standard: { cod: 30, ammoniaNitrogen: 2, fluoride: 2, ph: [6, 9] },
    status: 'normal',
    trendData: genTrend(1.5, 1.0)
  },
  {
    id: 'ro-004',
    name: '南侧主干雨排口',
    type: 'rain_outlet',
    x: 55,
    y: 82,
    zone: 'center',
    online: false,
    latestData: { cod: 0, ammoniaNitrogen: 0, ph: 0, fluoride: 0 },
    standard: { cod: 30, ammoniaNitrogen: 2, fluoride: 2, ph: [6, 9] },
    status: 'warning',
    trendData: genTrend(0, 0)
  },

  // ========== VOC监测点 (5) ==========
  {
    id: 'voc-001',
    name: 'A区打磨车间VOC',
    type: 'voc',
    x: 25,
    y: 20,
    zone: 'east',
    online: true,
    latestData: { tvoc: 85, temperature: 26.3 },
    standard: {},
    status: 'normal',
    trendData: genTrend(82, 30)
  },
  {
    id: 'voc-002',
    name: 'B区抛光车间VOC',
    type: 'voc',
    x: 48,
    y: 30,
    zone: 'center',
    online: true,
    latestData: { tvoc: 165, temperature: 27.8 },
    standard: {},
    status: 'warning',
    trendData: genTrend(155, 40)
  },
  {
    id: 'voc-003',
    name: 'C区雕刻车间VOC',
    type: 'voc',
    x: 70,
    y: 28,
    zone: 'west',
    online: true,
    latestData: { tvoc: 72, temperature: 25.5 },
    standard: {},
    status: 'normal',
    trendData: genTrend(70, 25)
  },
  {
    id: 'voc-004',
    name: '仓储区VOC',
    type: 'voc',
    x: 35,
    y: 65,
    zone: 'center',
    online: true,
    latestData: { tvoc: 45, temperature: 23.1 },
    standard: {},
    status: 'normal',
    trendData: genTrend(43, 18)
  },
  {
    id: 'voc-005',
    name: 'B区涂装车间VOC',
    type: 'voc',
    x: 53,
    y: 22,
    zone: 'center',
    online: true,
    latestData: { tvoc: 230, temperature: 28.5 },
    standard: {},
    status: 'alert',
    trendData: genTrend(200, 60, 18)
  },

  // ========== 臭气监测点 (3) ==========
  {
    id: 'od-001',
    name: 'A区污水处理站臭气',
    type: 'odor',
    x: 15,
    y: 70,
    zone: 'east',
    online: true,
    latestData: { tvoc: 55, noise: 52.4, temperature: 24.8 },
    standard: {},
    status: 'normal',
    trendData: genTrend(52, 20)
  },
  {
    id: 'od-002',
    name: 'B区固废堆场臭气',
    type: 'odor',
    x: 58,
    y: 48,
    zone: 'center',
    online: true,
    latestData: { tvoc: 130, noise: 56.8, temperature: 26.1 },
    standard: {},
    status: 'warning',
    trendData: genTrend(120, 35)
  },
  {
    id: 'od-003',
    name: 'C区垃圾收集点臭气',
    type: 'odor',
    x: 82,
    y: 60,
    zone: 'west',
    online: true,
    latestData: { tvoc: 68, noise: 48.2, temperature: 23.9 },
    standard: {},
    status: 'normal',
    trendData: genTrend(65, 22)
  }
]

/** 按类型筛选 */
export function getPointsByType(type: MonitoringPoint['type']): MonitoringPoint[] {
  return monitoringPoints.filter(p => p.type === type)
}

/** 按状态筛选 */
export function getPointsByStatus(status: MonitoringPoint['status']): MonitoringPoint[] {
  return monitoringPoints.filter(p => p.status === status)
}

/** 按区域筛选 */
export function getPointsByZone(zone: MonitoringPoint['zone']): MonitoringPoint[] {
  return monitoringPoints.filter(p => p.zone === zone)
}

/** 获取离线点位 */
export function getOfflinePoints(): MonitoringPoint[] {
  return monitoringPoints.filter(p => !p.online)
}

/** 获取预警/报警统计 */
export function getStatusSummary(): Record<MonitoringPoint['status'], number> {
  return monitoringPoints.reduce(
    (acc, p) => {
      acc[p.status]++
      return acc
    },
    { normal: 0, warning: 0, alert: 0 } as Record<MonitoringPoint['status'], number>
  )
}
