/**
 * 各园区（中部/东部/西部）综合画像数据
 * 供「综合管理」页 6 个面板随「所属园区」切换展示
 *
 * 指标口径对齐 Vue2 综合管理平台：
 *  - 大气监测：environment/air（PM2.5/PM10/SO2/NO2/O3/TVOC/噪音，无 AQI）
 *  - 水环境监测：environment/water（pH/COD/氨氮/总氮/总磷/氟化物，污水口径）
 *  - 用水/用电/供气：park-operation/water|electricity|gas
 */

export type ParkKey = 'center' | 'east' | 'west'
export type IndicatorLevel = 'normal' | 'yellow' | 'red'

/** 单项监测指标（值为当前值，level 为预计算状态：正常/黄色预警/红色预警） */
export interface MonitorIndicator {
  name: string
  unit: string
  value: number
  level: IndicatorLevel
}

/** 单个监测点位（大气监测站：点位1/点位2） */
export interface MonitorStation {
  name: string              // 点位名称：点位1 / 点位2
  indicators: MonitorIndicator[]
}

/** 构成占比（饼图用） */
export interface SourceSplit {
  name: string
  value: number   // 百分比
  color?: string
  price?: number  // 单价（元/吨，水费构成用）
}

/** 用水量构成（吨，展开详情用） */
export interface WaterVolumeSplit {
  name: string   // '厂自来水量' | '卫自来水量' | '中水量'
  value: number  // 吨
  color?: string
}

export interface ParkProfile {
  key: ParkKey
  name: string       // 全称：水晶产业园（中部）
  shortName: string  // 中部园区
  overview: {
    intro: string
    area: string           // 规划面积 km²
    enterpriseCount: number
    buildingCount: number
    totalArea: string      // 总建筑面积 万m²
    rentalRate: number     // 综合出租率 %
  }
  air: {
    complianceRate: number // 综合达标率 %
    alertCount: number     // 超标预警 次
    riskFactor: string     // 重点风险因子
    stations: MonitorStation[] // 各监测点位
  }
  water: {
    complianceRate: number
    alertCount: number
    outletCount: number    // 监测排污口 个
    riskFactor: string
    indicators: MonitorIndicator[]
  }
  waterUsage: {
    monthUsage: number     // 本月用水量 吨
    receivable: number     // 应收金额 万元
    collectionRate: number // 收缴率 %
    price: number          // 基础水价 元/吨
    sourceSplit: SourceSplit[] // 水源构成
    volumeSplit: WaterVolumeSplit[] // 用水量构成（吨）
  }
  electricity: {
    monthUsage: number     // 本月用电量 kWh
    receivable: number     // 万元
    collectionRate: number
    price: number          // 平段电价 元/kWh
    sourceSplit: SourceSplit[] // 电费基数（尖峰平谷 单价）
    feeTotals: SourceSplit[]   // 电费总量（尖峰平谷 总额/万元）
  }
  gas: {
    receivable: number     // 应收总额 万元
    received: number       // 实收总额 万元
    collectionRate: number // 综合收缴率 %
    overdue: number        // 逾期未缴 台
    monthUsage: number     // 月用气总量 万m³
    dayRatio: number       // 日间占比 %
    dayPrice: number       // 日单价 元/m³
    nightPrice: number     // 夜单价 元/m³
  }
}

export const parkProfiles: Record<ParkKey, ParkProfile> = {
  center: {
    key: 'center',
    name: '水晶产业园（中部）',
    shortName: '中部园区',
    overview: {
      intro: '水晶产业园（中部）为园区核心片区，集中布局高精水晶加工与研发型企业，配套完善的污水集中处理、能源供应与固危废暂存设施，是园区产值与税收的主要承载区。',
      area: '0.26 km²',
      enterpriseCount: 14,
      buildingCount: 6,
      totalArea: '16.8',
      rentalRate: 99.4
    },
    air: {
      complianceRate: 87.5,
      alertCount: 18,
      riskFactor: 'TVOC',
      stations: [
        {
          name: '点位1',
          indicators: [
            { name: 'PM2.5', unit: 'μg/m³', value: 58, level: 'normal' },
            { name: 'PM10', unit: 'μg/m³', value: 104, level: 'normal' },
            { name: 'SO2', unit: 'μg/m³', value: 74, level: 'normal' },
            { name: 'NO2', unit: 'μg/m³', value: 50, level: 'normal' },
            { name: 'O3', unit: 'μg/m³', value: 136, level: 'normal' },
            { name: 'TVOC', unit: 'mg/m³', value: 0.72, level: 'normal' },
            { name: '噪音', unit: 'dB', value: 53, level: 'normal' }
          ]
        },
        {
          name: '点位2',
          indicators: [
            { name: 'PM2.5', unit: 'μg/m³', value: 66, level: 'normal' },
            { name: 'PM10', unit: 'μg/m³', value: 132, level: 'normal' },
            { name: 'SO2', unit: 'μg/m³', value: 98, level: 'normal' },
            { name: 'NO2', unit: 'μg/m³', value: 66, level: 'normal' },
            { name: 'O3', unit: 'μg/m³', value: 148, level: 'normal' },
            { name: 'TVOC', unit: 'mg/m³', value: 0.98, level: 'yellow' },
            { name: '噪音', unit: 'dB', value: 57, level: 'normal' }
          ]
        }
      ]
    },
    water: {
      complianceRate: 86.4,
      alertCount: 4,
      outletCount: 1,
      riskFactor: '氟化物',
      indicators: [
        { name: 'pH', unit: '', value: 7.2, level: 'normal' },
        { name: 'COD', unit: 'mg/L', value: 38.6, level: 'normal' },
        { name: '氨氮', unit: 'mg/L', value: 3.2, level: 'normal' },
        { name: '总氮', unit: 'mg/L', value: 11.8, level: 'normal' },
        { name: '总磷', unit: 'mg/L', value: 0.38, level: 'normal' },
        { name: '氟化物', unit: 'mg/L', value: 8.6, level: 'yellow' },
        { name: '流量', unit: 'm³/h', value: 120, level: 'normal' }
      ]
    },
    waterUsage: {
      monthUsage: 8200,
      receivable: 32.5,
      collectionRate: 100.0,
      price: 4.2,
      sourceSplit: [
        { name: '厂自来水费', value: 26, color: '#0ea5e9', price: 1.28 },
        { name: '厂自来水处理费', value: 18, color: '#6366f1', price: 0.86 },
        { name: '卫自来水费', value: 12, color: '#14b8a6', price: 0.60 },
        { name: '卫自来水处理费', value: 8, color: '#10b981', price: 0.38 },
        { name: '中水费', value: 22, color: '#f59e0b', price: 0.68 },
        { name: '中水处理费', value: 14, color: '#8b5cf6', price: 0.40 }
      ],
      volumeSplit: [
        { name: '厂自来水量', value: 4100, color: '#0ea5e9' },
        { name: '卫自来水量', value: 1950, color: '#14b8a6' },
        { name: '中水量', value: 2150, color: '#f59e0b' }
      ]
    },
    electricity: {
      monthUsage: 228000,
      receivable: 68.4,
      collectionRate: 100.0,
      price: 0.85,
      sourceSplit: [
        { name: '尖电费基数', value: 15, color: '#ff4a4a', price: 1.42 },
        { name: '峰电费基数', value: 25, color: '#fdad43', price: 1.13 },
        { name: '平电费基数', value: 40, color: '#0ea5e9', price: 0.85 },
        { name: '谷电费基数', value: 20, color: '#10b981', price: 0.425 }
      ],
      feeTotals: [
        { name: '尖电费总量', value: 10.3, color: '#ff4a4a' },
        { name: '峰电费总量', value: 17.1, color: '#fdad43' },
        { name: '平电费总量', value: 27.3, color: '#0ea5e9' },
        { name: '谷电费总量', value: 13.7, color: '#10b981' }
      ]
    },
    gas: {
      receivable: 82.6,
      received: 82.0,
      collectionRate: 99.3,
      overdue: 2,
      monthUsage: 900,
      dayRatio: 55,
      dayPrice: 0.129,
      nightPrice: 0.0774
    }
  },
  east: {
    key: 'east',
    name: '水晶产业园（东部）',
    shortName: '东部园区',
    overview: {
      intro: '水晶产业园（东部）为大规模制造与用能集中片区，企业单体体量较大，用气量与用电负荷居三园区之首，配套集中供热与分布式光伏，是园区能耗与减排的重点片区。',
      area: '0.23 km²',
      enterpriseCount: 10,
      buildingCount: 5,
      totalArea: '14.2',
      rentalRate: 98.9
    },
    air: {
      complianceRate: 90.2,
      alertCount: 12,
      riskFactor: 'PM2.5',
      stations: [
        {
          name: '点位1',
          indicators: [
            { name: 'PM2.5', unit: 'μg/m³', value: 72, level: 'yellow' },
            { name: 'PM10', unit: 'μg/m³', value: 88, level: 'normal' },
            { name: 'SO2', unit: 'μg/m³', value: 58, level: 'normal' },
            { name: 'NO2', unit: 'μg/m³', value: 38, level: 'normal' },
            { name: 'O3', unit: 'μg/m³', value: 112, level: 'normal' },
            { name: 'TVOC', unit: 'mg/m³', value: 0.42, level: 'normal' },
            { name: '噪音', unit: 'dB', value: 50, level: 'normal' }
          ]
        },
        {
          name: '点位2',
          indicators: [
            { name: 'PM2.5', unit: 'μg/m³', value: 84, level: 'yellow' },
            { name: 'PM10', unit: 'μg/m³', value: 104, level: 'normal' },
            { name: 'SO2', unit: 'μg/m³', value: 70, level: 'normal' },
            { name: 'NO2', unit: 'μg/m³', value: 46, level: 'normal' },
            { name: 'O3', unit: 'μg/m³', value: 124, level: 'normal' },
            { name: 'TVOC', unit: 'mg/m³', value: 0.54, level: 'normal' },
            { name: '噪音', unit: 'dB', value: 54, level: 'normal' }
          ]
        }
      ]
    },
    water: {
      complianceRate: 91.2,
      alertCount: 2,
      outletCount: 1,
      riskFactor: '氨氮',
      indicators: [
        { name: 'pH', unit: '', value: 7.5, level: 'normal' },
        { name: 'COD', unit: 'mg/L', value: 32.1, level: 'normal' },
        { name: '氨氮', unit: 'mg/L', value: 2.8, level: 'normal' },
        { name: '总氮', unit: 'mg/L', value: 10.2, level: 'normal' },
        { name: '总磷', unit: 'mg/L', value: 0.35, level: 'normal' },
        { name: '氟化物', unit: 'mg/L', value: 6.8, level: 'normal' },
        { name: '流量', unit: 'm³/h', value: 98, level: 'normal' }
      ]
    },
    waterUsage: {
      monthUsage: 6100,
      receivable: 24.8,
      collectionRate: 99.6,
      price: 4.5,
      sourceSplit: [
        { name: '厂自来水费', value: 30, color: '#0ea5e9', price: 1.40 },
        { name: '厂自来水处理费', value: 20, color: '#6366f1', price: 0.90 },
        { name: '卫自来水费', value: 10, color: '#14b8a6', price: 0.55 },
        { name: '卫自来水处理费', value: 7, color: '#10b981', price: 0.35 },
        { name: '中水费', value: 21, color: '#f59e0b', price: 0.80 },
        { name: '中水处理费', value: 12, color: '#8b5cf6', price: 0.50 }
      ],
      volumeSplit: [
        { name: '厂自来水量', value: 3050, color: '#0ea5e9' },
        { name: '卫自来水量', value: 1450, color: '#14b8a6' },
        { name: '中水量', value: 1600, color: '#f59e0b' }
      ]
    },
    electricity: {
      monthUsage: 182000,
      receivable: 54.6,
      collectionRate: 99.8,
      price: 0.88,
      sourceSplit: [
        { name: '尖电费基数', value: 18, color: '#ff4a4a', price: 1.47 },
        { name: '峰电费基数', value: 27, color: '#fdad43', price: 1.17 },
        { name: '平电费基数', value: 38, color: '#0ea5e9', price: 0.88 },
        { name: '谷电费基数', value: 17, color: '#10b981', price: 0.44 }
      ],
      feeTotals: [
        { name: '尖电费总量', value: 9.8, color: '#ff4a4a' },
        { name: '峰电费总量', value: 14.8, color: '#fdad43' },
        { name: '平电费总量', value: 20.7, color: '#0ea5e9' },
        { name: '谷电费总量', value: 9.3, color: '#10b981' }
      ]
    },
    gas: {
      receivable: 156.8,
      received: 154.2,
      collectionRate: 98.3,
      overdue: 5,
      monthUsage: 1800,
      dayRatio: 60,
      dayPrice: 0.129,
      nightPrice: 0.0774
    }
  },
  west: {
    key: 'west',
    name: '水晶产业园（西部）',
    shortName: '西部园区',
    overview: {
      intro: '水晶产业园（西部）以中小型水晶加工企业为主，企业数量多、单体规模小，重点推进老旧厂房改造、废水回用与废气治理设施升级，是园区绿色转型的重点片区。',
      area: '0.20 km²',
      enterpriseCount: 12,
      buildingCount: 4,
      totalArea: '12.6',
      rentalRate: 98.1
    },
    air: {
      complianceRate: 84.6,
      alertCount: 22,
      riskFactor: 'TVOC',
      stations: [
        {
          name: '点位1',
          indicators: [
            { name: 'PM2.5', unit: 'μg/m³', value: 66, level: 'normal' },
            { name: 'PM10', unit: 'μg/m³', value: 132, level: 'normal' },
            { name: 'SO2', unit: 'μg/m³', value: 146, level: 'yellow' },
            { name: 'NO2', unit: 'μg/m³', value: 60, level: 'normal' },
            { name: 'O3', unit: 'μg/m³', value: 144, level: 'normal' },
            { name: 'TVOC', unit: 'mg/m³', value: 0.86, level: 'yellow' },
            { name: '噪音', unit: 'dB', value: 58, level: 'normal' }
          ]
        },
        {
          name: '点位2',
          indicators: [
            { name: 'PM2.5', unit: 'μg/m³', value: 74, level: 'normal' },
            { name: 'PM10', unit: 'μg/m³', value: 152, level: 'yellow' },
            { name: 'SO2', unit: 'μg/m³', value: 170, level: 'yellow' },
            { name: 'NO2', unit: 'μg/m³', value: 72, level: 'normal' },
            { name: 'O3', unit: 'μg/m³', value: 160, level: 'yellow' },
            { name: 'TVOC', unit: 'mg/m³', value: 0.98, level: 'yellow' },
            { name: '噪音', unit: 'dB', value: 64, level: 'yellow' }
          ]
        }
      ]
    },
    water: {
      complianceRate: 84.1,
      alertCount: 5,
      outletCount: 0,
      riskFactor: '氟化物',
      indicators: [
        { name: 'pH', unit: '', value: 7.0, level: 'normal' },
        { name: 'COD', unit: 'mg/L', value: 42.0, level: 'yellow' },
        { name: '氨氮', unit: 'mg/L', value: 3.6, level: 'normal' },
        { name: '总氮', unit: 'mg/L', value: 11.0, level: 'normal' },
        { name: '总磷', unit: 'mg/L', value: 0.36, level: 'normal' },
        { name: '氟化物', unit: 'mg/L', value: 9.2, level: 'yellow' },
        { name: '流量', unit: 'm³/h', value: 80, level: 'normal' }
      ]
    },
    waterUsage: {
      monthUsage: 5400,
      receivable: 21.2,
      collectionRate: 98.9,
      price: 4.0,
      sourceSplit: [
        { name: '厂自来水费', value: 24, color: '#0ea5e9', price: 1.20 },
        { name: '厂自来水处理费', value: 16, color: '#6366f1', price: 0.80 },
        { name: '卫自来水费', value: 14, color: '#14b8a6', price: 0.55 },
        { name: '卫自来水处理费', value: 9, color: '#10b981', price: 0.35 },
        { name: '中水费', value: 23, color: '#f59e0b', price: 0.65 },
        { name: '中水处理费', value: 14, color: '#8b5cf6', price: 0.45 }
      ],
      volumeSplit: [
        { name: '厂自来水量', value: 2700, color: '#0ea5e9' },
        { name: '卫自来水量', value: 1300, color: '#14b8a6' },
        { name: '中水量', value: 1400, color: '#f59e0b' }
      ]
    },
    electricity: {
      monthUsage: 118000,
      receivable: 35.4,
      collectionRate: 99.1,
      price: 0.82,
      sourceSplit: [
        { name: '尖电费基数', value: 12, color: '#ff4a4a', price: 1.37 },
        { name: '峰电费基数', value: 22, color: '#fdad43', price: 1.09 },
        { name: '平电费基数', value: 42, color: '#0ea5e9', price: 0.82 },
        { name: '谷电费基数', value: 24, color: '#10b981', price: 0.41 }
      ],
      feeTotals: [
        { name: '尖电费总量', value: 4.2, color: '#ff4a4a' },
        { name: '峰电费总量', value: 7.8, color: '#fdad43' },
        { name: '平电费总量', value: 14.9, color: '#0ea5e9' },
        { name: '谷电费总量', value: 8.5, color: '#10b981' }
      ]
    },
    gas: {
      receivable: 28.4,
      received: 27.6,
      collectionRate: 97.2,
      overdue: 1,
      monthUsage: 320,
      dayRatio: 58,
      dayPrice: 0.129,
      nightPrice: 0.0774
    }
  }
}

/** 取某园区的画像数据 */
export function getParkProfile(park: ParkKey): ParkProfile {
  return parkProfiles[park]
}

/** 月份筛选选项（仅到月份，不到具体日期） */
export interface MonthFilterOption {
  key: string
  label: string
  factor: number   // 相对当前月（2026-10）基准的用量/金额波动系数
}

export const monthOptions: MonthFilterOption[] = [
  { key: '2025-11', label: '2025年11月', factor: 0.85 },
  { key: '2025-12', label: '2025年12月', factor: 0.91 },
  { key: '2026-01', label: '2026年1月', factor: 0.76 },
  { key: '2026-02', label: '2026年2月', factor: 0.70 },
  { key: '2026-03', label: '2026年3月', factor: 0.94 },
  { key: '2026-04', label: '2026年4月', factor: 1.03 },
  { key: '2026-05', label: '2026年5月', factor: 1.09 },
  { key: '2026-06', label: '2026年6月', factor: 1.18 },
  { key: '2026-07', label: '2026年7月', factor: 1.27 },
  { key: '2026-08', label: '2026年8月', factor: 1.22 },
  { key: '2026-09', label: '2026年9月', factor: 1.07 },
  { key: '2026-10', label: '2026年10月', factor: 1.0 },
]

/** 年份筛选选项（统计年份用，全年倍数） */
export interface YearFilterOption {
  key: string
  label: string
  factor: number   // 相对当前月（2026-10）基准的全年用量/金额倍数
}

export const yearOptions: YearFilterOption[] = [
  { key: '2024', label: '2024年', factor: 10.6 },
  { key: '2025', label: '2025年', factor: 11.4 },
  { key: '2026', label: '2026年', factor: 12.2 },
]
