/**
 * 环保数据 — 浦江水晶园区综合管理平台
 * 涵盖总量管理、储备库月度数据、环保KPI、预警事件
 */

// ========== 接口定义 ==========

/** 总量管理指标 */
export interface PollutantCap {
  name: string
  unit: string
  totalReserved: number
  allocated: number
  remaining: number
  usageRate: number
  warningThreshold: number
  isWarning: boolean
}

/** 总量变动记录 */
export interface QuotaChangeRecord {
  id: string
  enterpriseName: string
  changeType: '内部替代平衡' | '总量削减替代' | '总量统一管理'
  pollutant: string
  amount: number
  unit: string
  status: '已审批' | '审批中' | '待提交'
  date: string
}

/** 总量储备库月度数据 */
export interface ReserveMonthlyData {
  month: string
  inbound: number[]   // [COD, NH3N, NOx, SO2]
  outbound: number[]
}

/** 环保KPI */
export interface EnvironmentalKPI {
  fluorideComplianceRate: number
  wastewaterComplianceRate: number
  dailyAlertTotal: number
  unresolvedAlerts: number
  airQualityIndex: number
  airQualityLevel: string
}

/** 预警事件 */
export interface AlertEvent {
  id: string
  type: '氟化物超标' | '用电异常' | '废气超标' | '总量超限' | 'pH异常' | 'PM2.5超标'
  pointName: string
  enterpriseName: string
  monitorValue: number
  limitValue: number
  unit: string
  time: string
  status: '未处置' | '处置中' | '已闭环'
  suggestion: string
}

// ========== 总量管理指标 ==========

export const pollutantCaps: PollutantCap[] = [
  {
    name: '化学需氧量(COD)',
    unit: '吨',
    totalReserved: 49.68,
    allocated: 38.42,
    remaining: 11.26,
    usageRate: 77.3,
    warningThreshold: 80,
    isWarning: false
  },
  {
    name: '氨氮(NH₃-N)',
    unit: '吨',
    totalReserved: 2.48,
    allocated: 2.14,
    remaining: 0.34,
    usageRate: 86.3,
    warningThreshold: 80,
    isWarning: true
  },
  {
    name: '氮氧化物(NOx)',
    unit: '吨',
    totalReserved: 23.76,
    allocated: 16.58,
    remaining: 7.18,
    usageRate: 69.8,
    warningThreshold: 80,
    isWarning: false
  },
  {
    name: '二氧化硫(SO₂)',
    unit: '吨',
    totalReserved: 2.376,
    allocated: 1.842,
    remaining: 0.534,
    usageRate: 77.5,
    warningThreshold: 80,
    isWarning: false
  }
]

// ========== 总量变动记录 ==========

export const quotaChangeRecords: QuotaChangeRecord[] = [
  {
    id: 'qr-001',
    enterpriseName: '浦江县华泰水晶有限公司',
    changeType: '内部替代平衡',
    pollutant: 'COD',
    amount: 0.85,
    unit: '吨',
    status: '已审批',
    date: '2025-11-28'
  },
  {
    id: 'qr-002',
    enterpriseName: '金华市晶盛水晶加工厂',
    changeType: '总量削减替代',
    pollutant: 'NH₃-N',
    amount: 0.12,
    unit: '吨',
    status: '审批中',
    date: '2025-12-02'
  },
  {
    id: 'qr-003',
    enterpriseName: '浦江县恒达水晶制品厂',
    changeType: '总量统一管理',
    pollutant: 'NOx',
    amount: 1.50,
    unit: '吨',
    status: '已审批',
    date: '2025-11-20'
  },
  {
    id: 'qr-004',
    enterpriseName: '浙江星宝水晶有限公司',
    changeType: '内部替代平衡',
    pollutant: 'SO₂',
    amount: 0.08,
    unit: '吨',
    status: '已审批',
    date: '2025-11-15'
  },
  {
    id: 'qr-005',
    enterpriseName: '浦江县光明水晶工艺品厂',
    changeType: '总量削减替代',
    pollutant: 'COD',
    amount: 1.20,
    unit: '吨',
    status: '审批中',
    date: '2025-12-05'
  },
  {
    id: 'qr-006',
    enterpriseName: '金华市永昌水晶加工有限公司',
    changeType: '总量统一管理',
    pollutant: 'NH₃-N',
    amount: 0.06,
    unit: '吨',
    status: '待提交',
    date: '2025-12-08'
  },
  {
    id: 'qr-007',
    enterpriseName: '浦江县天宇水晶有限公司',
    changeType: '内部替代平衡',
    pollutant: 'NOx',
    amount: 0.95,
    unit: '吨',
    status: '已审批',
    date: '2025-11-10'
  },
  {
    id: 'qr-008',
    enterpriseName: '浙江晶美水晶股份有限公司',
    changeType: '总量削减替代',
    pollutant: 'COD',
    amount: 0.68,
    unit: '吨',
    status: '待提交',
    date: '2025-12-10'
  }
]

// ========== 总量储备库月度数据 (12个月) ==========

export const reserveMonthlyData: ReserveMonthlyData[] = [
  { month: '2025-01', inbound: [3.2, 0.18, 1.5, 0.15], outbound: [2.8, 0.15, 1.2, 0.12] },
  { month: '2025-02', inbound: [2.8, 0.15, 1.3, 0.12], outbound: [3.1, 0.17, 1.4, 0.14] },
  { month: '2025-03', inbound: [4.1, 0.22, 1.8, 0.18], outbound: [3.5, 0.19, 1.6, 0.15] },
  { month: '2025-04', inbound: [3.6, 0.20, 1.6, 0.16], outbound: [3.8, 0.21, 1.7, 0.17] },
  { month: '2025-05', inbound: [4.5, 0.25, 2.0, 0.20], outbound: [4.2, 0.23, 1.9, 0.18] },
  { month: '2025-06', inbound: [5.0, 0.28, 2.3, 0.22], outbound: [4.6, 0.26, 2.1, 0.20] },
  { month: '2025-07', inbound: [5.2, 0.30, 2.4, 0.24], outbound: [4.8, 0.27, 2.2, 0.21] },
  { month: '2025-08', inbound: [4.8, 0.26, 2.2, 0.21], outbound: [5.0, 0.28, 2.3, 0.22] },
  { month: '2025-09', inbound: [4.3, 0.24, 1.9, 0.19], outbound: [4.1, 0.22, 1.8, 0.17] },
  { month: '2025-10', inbound: [3.9, 0.21, 1.7, 0.17], outbound: [3.6, 0.20, 1.5, 0.15] },
  { month: '2025-11', inbound: [4.0, 0.23, 1.8, 0.18], outbound: [3.7, 0.20, 1.6, 0.16] },
  { month: '2025-12', inbound: [3.5, 0.19, 1.5, 0.15], outbound: [3.2, 0.18, 1.4, 0.14] }
]

// ========== 环保KPI ==========

export const environmentalKPI: EnvironmentalKPI = {
  fluorideComplianceRate: 91.7,
  wastewaterComplianceRate: 94.2,
  dailyAlertTotal: 14,
  unresolvedAlerts: 5,
  airQualityIndex: 68,
  airQualityLevel: '良'
}

// ========== 预警事件 ==========

export const alertEvents: AlertEvent[] = [
  {
    id: 'ae-001',
    type: '氟化物超标',
    pointName: 'A区2号氟化池',
    enterpriseName: '浦江县华泰水晶有限公司',
    monitorValue: 9.6,
    limitValue: 8.0,
    unit: 'mg/L',
    time: '2025-12-10 14:32:00',
    status: '处置中',
    suggestion: '建议立即检查废水处理设施运行状态，增加石灰投加量，启动应急调节池'
  },
  {
    id: 'ae-002',
    type: '氟化物超标',
    pointName: 'A区3号氟化池',
    enterpriseName: '金华市晶盛水晶加工厂',
    monitorValue: 10.3,
    limitValue: 8.0,
    unit: 'mg/L',
    time: '2025-12-10 13:18:00',
    status: '未处置',
    suggestion: '氟化物严重超标，建议停产检修污水处理系统，排查管路泄漏点'
  },
  {
    id: 'ae-003',
    type: '用电异常',
    pointName: 'B区抛光车间',
    enterpriseName: '浦江县恒达水晶制品厂',
    monitorValue: 385,
    limitValue: 280,
    unit: 'kWh',
    time: '2025-12-10 11:45:00',
    status: '已闭环',
    suggestion: '用电量异常偏高，已确认系加班赶工导致，企业已报备'
  },
  {
    id: 'ae-004',
    type: '废气超标',
    pointName: 'B区涂装车间VOC',
    enterpriseName: '浙江星宝水晶有限公司',
    monitorValue: 230,
    limitValue: 200,
    unit: 'ppb',
    time: '2025-12-10 10:22:00',
    status: '处置中',
    suggestion: 'VOC排放超标，建议检查废气处理设备活性炭更换情况，暂停高排放工序'
  },
  {
    id: 'ae-005',
    type: 'pH异常',
    pointName: 'A区2号氟化池',
    enterpriseName: '浦江县华泰水晶有限公司',
    monitorValue: 5.8,
    limitValue: 6.0,
    unit: '',
    time: '2025-12-10 09:56:00',
    status: '已闭环',
    suggestion: 'pH偏低已通过加碱调节恢复正常，持续关注'
  },
  {
    id: 'ae-006',
    type: '总量超限',
    pointName: '园区总排污口',
    enterpriseName: '园区综合',
    monitorValue: 46.8,
    limitValue: 49.68,
    unit: '吨',
    time: '2025-12-10 08:00:00',
    status: '处置中',
    suggestion: 'COD总量使用率已达94.1%，建议启动总量削减方案，控制高排放企业产能'
  },
  {
    id: 'ae-007',
    type: 'PM2.5超标',
    pointName: '园区南侧空气站',
    enterpriseName: '园区综合',
    monitorValue: 92,
    limitValue: 75,
    unit: 'µg/m³',
    time: '2025-12-09 22:15:00',
    status: '已闭环',
    suggestion: '夜间PM2.5超标，系区域传输影响，已启动洒水降尘措施'
  },
  {
    id: 'ae-008',
    type: '用电异常',
    pointName: 'C区雕刻车间',
    enterpriseName: '浙江晶美水晶股份有限公司',
    monitorValue: 0,
    limitValue: 50,
    unit: 'kWh',
    time: '2025-12-10 06:30:00',
    status: '未处置',
    suggestion: '用电量为零但未报备停工，建议现场核查是否存在偷排行为'
  },
  {
    id: 'ae-009',
    type: '氟化物超标',
    pointName: 'B区2号氟化池',
    enterpriseName: '浦江县天宇水晶有限公司',
    monitorValue: 7.6,
    limitValue: 8.0,
    unit: 'mg/L',
    time: '2025-12-10 12:05:00',
    status: '已闭环',
    suggestion: '接近超标限值但未超限，已提醒企业加强污水处理设施维护'
  },
  {
    id: 'ae-010',
    type: '废气超标',
    pointName: 'B区固废堆场臭气',
    enterpriseName: '浦江县恒达水晶制品厂',
    monitorValue: 130,
    limitValue: 100,
    unit: 'ppb',
    time: '2025-12-10 15:40:00',
    status: '未处置',
    suggestion: '臭气浓度超标，建议增加喷洒除臭剂频次，加快固废清运'
  },
  {
    id: 'ae-011',
    type: '用电异常',
    pointName: 'A区打磨车间',
    enterpriseName: '浦江县光明水晶工艺品厂',
    monitorValue: 520,
    limitValue: 350,
    unit: 'kWh',
    time: '2025-12-10 07:20:00',
    status: '处置中',
    suggestion: '凌晨用电异常偏高，可能存在未申报的夜间生产，建议现场核查'
  },
  {
    id: 'ae-012',
    type: '总量超限',
    pointName: '园区总排污口',
    enterpriseName: '园区综合',
    monitorValue: 2.14,
    limitValue: 2.48,
    unit: '吨',
    time: '2025-12-10 08:00:00',
    status: '处置中',
    suggestion: '氨氮总量使用率已达86.3%，超过预警阈值80%，建议启动内部替代平衡方案'
  },
  {
    id: 'ae-013',
    type: 'pH异常',
    pointName: 'B区3号氟化池',
    enterpriseName: '金华市永昌水晶加工有限公司',
    monitorValue: 9.3,
    limitValue: 9.0,
    unit: '',
    time: '2025-12-09 16:45:00',
    status: '已闭环',
    suggestion: 'pH偏高，已通过加酸回调至正常范围，排查碱性原料泄漏'
  },
  {
    id: 'ae-014',
    type: 'PM2.5超标',
    pointName: '园区中心空气站',
    enterpriseName: '园区综合',
    monitorValue: 78,
    limitValue: 75,
    unit: 'µg/m³',
    time: '2025-12-10 16:10:00',
    status: '未处置',
    suggestion: 'PM2.5轻度超标，建议加强园区道路洒水，检查各企业除尘设备运行情况'
  },
  {
    id: 'ae-015',
    type: '用电异常',
    pointName: 'C区1号氟化池配套',
    enterpriseName: '浦江县光明水晶工艺品厂',
    monitorValue: 18,
    limitValue: 50,
    unit: 'kWh',
    time: '2025-12-10 05:10:00',
    status: '处置中',
    suggestion: '污水处理设施用电量明显偏低，疑似设施未正常运行，建议立即现场检查'
  }
]

// ========== 工具函数 ==========

/** 按预警类型筛选 */
export function getAlertsByType(type: AlertEvent['type']): AlertEvent[] {
  return alertEvents.filter(e => e.type === type)
}

/** 按处置状态筛选 */
export function getAlertsByStatus(status: AlertEvent['status']): AlertEvent[] {
  return alertEvents.filter(e => e.status === status)
}

/** 获取未处置+处置中的预警（活跃预警） */
export function getActiveAlerts(): AlertEvent[] {
  return alertEvents.filter(e => e.status !== '已闭环')
}

/** 获取预警统计 */
export function getAlertSummary(): { byType: Record<string, number>; byStatus: Record<string, number> } {
  const byType: Record<string, number> = {}
  const byStatus: Record<string, number> = {}
  for (const e of alertEvents) {
    byType[e.type] = (byType[e.type] || 0) + 1
    byStatus[e.status] = (byStatus[e.status] || 0) + 1
  }
  return { byType, byStatus }
}

/** 获取某污染物总量使用率排名 */
export function getCapUsageRateSorted(): PollutantCap[] {
  return [...pollutantCaps].sort((a, b) => b.usageRate - a.usageRate)
}
