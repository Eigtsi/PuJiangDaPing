/**
 * 财务/营收数据 — 浦江水晶园区综合管理平台
 * 涵盖租金、物业费、水电费、固废处置费、停车费等收入构成与收缴统计
 *
 * 基准数据来源:
 *   租金 ~1245.8万/年 | 物业 ~312.4万/年 | 水电 ~568.2万/年
 *   固废处置费 ~120万/年 | 停车费 ~45万/年
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RevenueItem {
  type: string // '租金' | '物业费' | '水电费' | '固废处置费' | '停车费' | '其他'
  currentMonth: {
    receivable: number   // 应收 (万元)
    received: number     // 实收 (万元)
    outstanding: number  // 欠费 (万元)
    collectionRate: number // 收缴率 %
  }
  lastMonth: {
    receivable: number
    received: number
    outstanding: number
    collectionRate: number
  }
  yearToDate: {
    receivable: number
    received: number
    outstanding: number
    collectionRate: number
  }
  monthOnMonthGrowth: number // 环比增长率 %
}

export interface ZoneRevenue {
  zone: 'east' | 'center' | 'west' | 'total'
  rent: number       // 万元
  property: number   // 万元
  utility: number    // 万元
  solidWaste: number // 万元
  parking: number    // 万元
  total: number      // 万元
  collectionRate: number // %
}

export interface ArrearsRecord {
  enterpriseId: string
  enterpriseName: string
  zone: 'east' | 'center' | 'west'
  feeType: string
  amount: number      // 欠费金额 (万元)
  duration: string    // 欠费时长 e.g. '15天', '2个月'
  status: '催收中' | '已发函' | '诉讼中'
}

export interface MonthlyRevenue {
  month: string // '2025-01' format
  rent: number
  property: number
  utility: number
  solidWaste: number
  parking: number
  total: number
}

// ---------------------------------------------------------------------------
// Revenue items — 6 categories (当月 / 上月 / 年累计)
// 年度基准: 租金1245.8万 物业312.4万 水电568.2万 固废120万 停车45万 其他18万
// ---------------------------------------------------------------------------

export const revenueItems: RevenueItem[] = [
  {
    type: '租金',
    currentMonth: { receivable: 108.5, received: 107.6, outstanding: 0.9, collectionRate: 99.2 },
    lastMonth:    { receivable: 106.8, received: 105.4, outstanding: 1.4, collectionRate: 98.7 },
    yearToDate:   { receivable: 542.0, received: 538.1, outstanding: 3.9, collectionRate: 99.3 },
    monthOnMonthGrowth: 1.6
  },
  {
    type: '物业费',
    currentMonth: { receivable: 27.2, received: 26.8, outstanding: 0.4, collectionRate: 98.5 },
    lastMonth:    { receivable: 26.8, received: 26.2, outstanding: 0.6, collectionRate: 97.8 },
    yearToDate:   { receivable: 135.8, received: 133.5, outstanding: 2.3, collectionRate: 98.3 },
    monthOnMonthGrowth: 1.5
  },
  {
    type: '水电费',
    currentMonth: { receivable: 49.6, received: 49.6, outstanding: 0.0, collectionRate: 100.0 },
    lastMonth:    { receivable: 47.8, received: 47.8, outstanding: 0.0, collectionRate: 100.0 },
    yearToDate:   { receivable: 248.2, received: 248.2, outstanding: 0.0, collectionRate: 100.0 },
    monthOnMonthGrowth: 3.8
  },
  {
    type: '固废处置费',
    currentMonth: { receivable: 10.8, received: 10.5, outstanding: 0.3, collectionRate: 97.2 },
    lastMonth:    { receivable: 10.2, received: 9.8, outstanding: 0.4, collectionRate: 96.1 },
    yearToDate:   { receivable: 54.0, received: 52.6, outstanding: 1.4, collectionRate: 97.4 },
    monthOnMonthGrowth: 5.9
  },
  {
    type: '停车费',
    currentMonth: { receivable: 4.0, received: 3.9, outstanding: 0.1, collectionRate: 97.5 },
    lastMonth:    { receivable: 3.8, received: 3.7, outstanding: 0.1, collectionRate: 97.4 },
    yearToDate:   { receivable: 19.8, received: 19.3, outstanding: 0.5, collectionRate: 97.5 },
    monthOnMonthGrowth: 5.3
  },
  {
    type: '其他',
    currentMonth: { receivable: 1.6, received: 1.5, outstanding: 0.1, collectionRate: 93.8 },
    lastMonth:    { receivable: 1.5, received: 1.4, outstanding: 0.1, collectionRate: 93.3 },
    yearToDate:   { receivable: 7.8, received: 7.3, outstanding: 0.5, collectionRate: 93.6 },
    monthOnMonthGrowth: 6.7
  }
]

// ---------------------------------------------------------------------------
// Zone revenues — 3 zones + total
// ---------------------------------------------------------------------------

export const zoneRevenues: ZoneRevenue[] = [
  {
    zone: 'east',
    rent: 412.6,
    property: 103.8,
    utility: 188.4,
    solidWaste: 42.5,
    parking: 18.2,
    total: 765.5,
    collectionRate: 98.9
  },
  {
    zone: 'center',
    rent: 502.3,
    property: 126.5,
    utility: 228.6,
    solidWaste: 48.2,
    parking: 15.6,
    total: 921.2,
    collectionRate: 99.4
  },
  {
    zone: 'west',
    rent: 330.9,
    property: 82.1,
    utility: 151.2,
    solidWaste: 29.3,
    parking: 11.2,
    total: 604.7,
    collectionRate: 98.1
  },
  {
    zone: 'total',
    rent: 1245.8,
    property: 312.4,
    utility: 568.2,
    solidWaste: 120.0,
    parking: 45.0,
    total: 2291.4,
    collectionRate: 99.0
  }
]

// ---------------------------------------------------------------------------
// Arrears records — ~10 records
// ---------------------------------------------------------------------------

export const arrearsRecords: ArrearsRecord[] = [
  {
    enterpriseId: 'ENT-001',
    enterpriseName: '浦江晶彩光学制品厂',
    zone: 'east',
    feeType: '租金',
    amount: 2.4,
    duration: '2个月',
    status: '催收中'
  },
  {
    enterpriseId: 'ENT-012',
    enterpriseName: '金辉水晶灯饰有限公司',
    zone: 'center',
    feeType: '物业费',
    amount: 1.8,
    duration: '1个月',
    status: '催收中'
  },
  {
    enterpriseId: 'ENT-023',
    enterpriseName: '华艺水晶工艺品厂',
    zone: 'west',
    feeType: '租金',
    amount: 3.6,
    duration: '3个月',
    status: '已发函'
  },
  {
    enterpriseId: 'ENT-034',
    enterpriseName: '浦江星光磨料磨具厂',
    zone: 'east',
    feeType: '固废处置费',
    amount: 0.8,
    duration: '15天',
    status: '催收中'
  },
  {
    enterpriseId: 'ENT-045',
    enterpriseName: '千叶高精度雕刻厂',
    zone: 'center',
    feeType: '物业费',
    amount: 1.2,
    duration: '1个月',
    status: '催收中'
  },
  {
    enterpriseId: 'ENT-056',
    enterpriseName: '恒盛水晶原料加工厂',
    zone: 'west',
    feeType: '租金',
    amount: 5.2,
    duration: '4个月',
    status: '诉讼中'
  },
  {
    enterpriseId: 'ENT-067',
    enterpriseName: '浦江明达水晶玻璃厂',
    zone: 'east',
    feeType: '停车费',
    amount: 0.3,
    duration: '20天',
    status: '催收中'
  },
  {
    enterpriseId: 'ENT-078',
    enterpriseName: '永盛水晶抛光材料公司',
    zone: 'center',
    feeType: '水电费',
    amount: 0.0,
    duration: '-',
    status: '催收中'
  },
  {
    enterpriseId: 'ENT-089',
    enterpriseName: '浦江博源水晶科技有限公司',
    zone: 'west',
    feeType: '租金',
    amount: 1.5,
    duration: '1个月',
    status: '已发函'
  },
  {
    enterpriseId: 'ENT-095',
    enterpriseName: '利达水晶切割加工厂',
    zone: 'east',
    feeType: '固废处置费',
    amount: 0.6,
    duration: '10天',
    status: '催收中'
  }
]

// ---------------------------------------------------------------------------
// Monthly revenues — 12 months (2025-01 ~ 2025-12)
// Monthly split based on annual totals, with seasonal variation
// ---------------------------------------------------------------------------

export const monthlyRevenues: MonthlyRevenue[] = [
  { month: '2025-01', rent: 98.2,  property: 24.8, utility: 42.5, solidWaste: 8.6,  parking: 3.2, total: 177.3 },
  { month: '2025-02', rent: 98.2,  property: 24.8, utility: 38.2, solidWaste: 7.8,  parking: 2.8, total: 171.8 },
  { month: '2025-03', rent: 105.6, property: 26.5, utility: 45.8, solidWaste: 9.2,  parking: 3.5, total: 190.6 },
  { month: '2025-04', rent: 105.6, property: 26.5, utility: 47.3, solidWaste: 9.8,  parking: 3.8, total: 193.0 },
  { month: '2025-05', rent: 108.3, property: 27.2, utility: 49.6, solidWaste: 10.2, parking: 4.0, total: 199.3 },
  { month: '2025-06', rent: 108.3, property: 27.2, utility: 52.8, solidWaste: 10.8, parking: 4.2, total: 203.3 },
  { month: '2025-07', rent: 108.3, property: 27.2, utility: 56.4, solidWaste: 11.5, parking: 4.5, total: 207.9 },
  { month: '2025-08', rent: 108.3, property: 27.2, utility: 55.8, solidWaste: 11.2, parking: 4.3, total: 206.8 },
  { month: '2025-09', rent: 105.6, property: 26.5, utility: 50.2, solidWaste: 10.5, parking: 3.9, total: 196.7 },
  { month: '2025-10', rent: 105.6, property: 26.5, utility: 48.6, solidWaste: 10.0, parking: 3.7, total: 194.4 },
  { month: '2025-11', rent: 98.2,  property: 24.8, utility: 44.3, solidWaste: 9.0,  parking: 3.4, total: 179.7 },
  { month: '2025-12', rent: 89.6,  property: 25.2, utility: 36.7, solidWaste: 11.2, parking: 3.7, total: 166.4 }
]

// ---------------------------------------------------------------------------
// 年租金按标的物类型构成（年度口径，合计 = 1245.8万，与 zoneRevenues.total.rent 一致）
// 来源：智能租金计费引擎 5 类标的物（厂房/仓库/综合楼/宿舍楼/营业房）年租金汇总
// ---------------------------------------------------------------------------

export interface AssetTypeRent {
  type: string  // '厂房' | '仓库' | '综合楼' | '宿舍楼' | '营业房'
  rent: number  // 万元/年
}

export const rentByAssetType: AssetTypeRent[] = [
  { type: '厂房', rent: 560.0 },
  { type: '仓库', rent: 210.0 },
  { type: '综合楼', rent: 260.0 },
  { type: '宿舍楼', rent: 120.0 },
  { type: '营业房', rent: 95.8 }
]

// ---------------------------------------------------------------------------
// 物业费单价标准（元/年/㎡，年度口径，依据《2025年〔9〕号关于2026年度租金等费用收缴方案的通知》）
// 厂房 15 / 综合楼 8 / 宿舍楼 12 / 营业房 8 / 仓库 8
// ---------------------------------------------------------------------------

export interface PropertyFeeStandard {
  type: string   // 标的物类型
  price: number  // 物业费单价（元/年/㎡）
}

export const propertyFeeStandards: PropertyFeeStandard[] = [
  { type: '厂房', price: 15 },
  { type: '综合楼', price: 8 },
  { type: '宿舍楼', price: 12 },
  { type: '营业房', price: 8 },
  { type: '仓库', price: 8 }
]

// ---------------------------------------------------------------------------
// 年度财务画像（租金/物业费/停车费按「年度」计费）
// 2025 为实际基准，2026 依据《2025年〔9〕号关于2026年度租金等费用收缴方案的通知》估算
// ---------------------------------------------------------------------------

export type FiscalYear = '2025' | '2026'

export interface YearZoneRevenue {
  zone: 'east' | 'center' | 'west' | 'total'
  rent: number       // 万元/年
  property: number   // 万元/年
  parking: number    // 万元/年
  collectionRate: number // 综合收缴率 %
}

export interface YearFinancialProfile {
  year: FiscalYear
  label: string
  zones: YearZoneRevenue[]
  rentByType: AssetTypeRent[]                    // 年租金按标的物类型构成
  parking: { totalSpaces: number; occupiedSpaces: number }
  monthlyParking: number[]                       // 12 个月停车费（万元）
}

export const yearFinancialProfiles: Record<FiscalYear, YearFinancialProfile> = {
  '2025': {
    year: '2025',
    label: '2025年',
    zones: [
      { zone: 'east',   rent: 412.6, property: 103.8, parking: 18.2, collectionRate: 98.9 },
      { zone: 'center', rent: 502.3, property: 126.5, parking: 15.6, collectionRate: 99.4 },
      { zone: 'west',   rent: 330.9, property: 82.1,  parking: 11.2, collectionRate: 98.1 },
      { zone: 'total',  rent: 1245.8, property: 312.4, parking: 45.0, collectionRate: 99.0 }
    ],
    rentByType: [
      { type: '厂房', rent: 560.0 },
      { type: '仓库', rent: 210.0 },
      { type: '综合楼', rent: 260.0 },
      { type: '宿舍楼', rent: 120.0 },
      { type: '营业房', rent: 95.8 }
    ],
    parking: { totalSpaces: 1260, occupiedSpaces: 897 },
    monthlyParking: [3.2, 2.8, 3.5, 3.8, 4.0, 4.2, 4.5, 4.3, 3.9, 3.7, 3.4, 3.7]
  },
  '2026': {
    year: '2026',
    label: '2026年',
    zones: [
      { zone: 'east',   rent: 433.2, property: 108.0, parking: 19.1, collectionRate: 98.2 },
      { zone: 'center', rent: 527.4, property: 131.6, parking: 16.4, collectionRate: 99.0 },
      { zone: 'west',   rent: 347.5, property: 85.3,  parking: 11.8, collectionRate: 97.5 },
      { zone: 'total',  rent: 1308.1, property: 324.9, parking: 47.3, collectionRate: 98.5 }
    ],
    rentByType: [
      { type: '厂房', rent: 588.0 },
      { type: '仓库', rent: 220.5 },
      { type: '综合楼', rent: 273.0 },
      { type: '宿舍楼', rent: 126.0 },
      { type: '营业房', rent: 100.6 }
    ],
    parking: { totalSpaces: 1380, occupiedSpaces: 1010 },
    monthlyParking: [3.4, 3.0, 3.7, 4.0, 4.2, 4.4, 4.7, 4.5, 4.1, 3.9, 3.6, 3.9]
  }
}

export const yearOptions: { key: FiscalYear; label: string }[] = [
  { key: '2025', label: '2025年' },
  { key: '2026', label: '2026年' }
]
