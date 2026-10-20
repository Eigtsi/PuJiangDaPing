/**
 * 能源消耗数据 — 浦江水晶园区综合管理平台
 * 涵盖用电(市政/光伏/储能)、用水(市政/回用)、压缩空气等
 *
 * 基准数据来源:
 *   工业用水 3000吨/月 | 生活用水 10000吨/月 | 回收水 5000吨/月
 *   总用电量 ~450000 kWh/月
 *   华兴第一水晶 145 kWh/h | 恒泰高精磨砂 350 kWh/h | 浦江智感环境 95 kWh/h
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EnergyConsumption {
  month: string
  electricity: {
    municipal: number // 市政用电 kWh
    solar: number     // 光伏 kWh
    storage: number   // 储能 kWh
    total: number     // 合计 kWh
  }
  water: {
    municipal: number  // 市政取水 吨
    reclaimed: number  // 回用水 吨
    total: number      // 合计 吨
  }
  gas: {
    compressedAir: number // 压缩空气 m³
  }
}

export interface EnergyTarget {
  name: string     // e.g. '单位产值能耗下降'
  target: number   // 目标值 %
  current: number  // 当前完成率 %
  year: string
}

export interface EnergySourceSplit {
  source: string     // '市政用电' | '光伏发电' | '储能放电'
  percentage: number // %
  color: string      // hex color
}

// ---------------------------------------------------------------------------
// Monthly energy data — 12 months (2025-01 ~ 2025-12)
// Seasonal variation: summer higher electricity, winter higher gas
// ---------------------------------------------------------------------------

export const energyMonthly: EnergyConsumption[] = [
  {
    month: '2025-01',
    electricity: { municipal: 338000, solar: 67500, storage: 22500, total: 428000 },
    water: { municipal: 11500, reclaimed: 4200, total: 15700 },
    gas: { compressedAir: 85000 }
  },
  {
    month: '2025-02',
    electricity: { municipal: 315000, solar: 54000, storage: 18000, total: 387000 },
    water: { municipal: 10800, reclaimed: 3900, total: 14700 },
    gas: { compressedAir: 78000 }
  },
  {
    month: '2025-03',
    electricity: { municipal: 345000, solar: 78000, storage: 27000, total: 450000 },
    water: { municipal: 12500, reclaimed: 4800, total: 17300 },
    gas: { compressedAir: 82000 }
  },
  {
    month: '2025-04',
    electricity: { municipal: 352000, solar: 85500, storage: 28500, total: 466000 },
    water: { municipal: 13000, reclaimed: 5000, total: 18000 },
    gas: { compressedAir: 88000 }
  },
  {
    month: '2025-05',
    electricity: { municipal: 368000, solar: 94500, storage: 31500, total: 494000 },
    water: { municipal: 13200, reclaimed: 5100, total: 18300 },
    gas: { compressedAir: 92000 }
  },
  {
    month: '2025-06',
    electricity: { municipal: 392000, solar: 102000, storage: 34000, total: 528000 },
    water: { municipal: 13500, reclaimed: 5200, total: 18700 },
    gas: { compressedAir: 95000 }
  },
  {
    month: '2025-07',
    electricity: { municipal: 420000, solar: 108000, storage: 36000, total: 564000 },
    water: { municipal: 14000, reclaimed: 5500, total: 19500 },
    gas: { compressedAir: 90000 }
  },
  {
    month: '2025-08',
    electricity: { municipal: 415000, solar: 105000, storage: 35000, total: 555000 },
    water: { municipal: 13800, reclaimed: 5400, total: 19200 },
    gas: { compressedAir: 88000 }
  },
  {
    month: '2025-09',
    electricity: { municipal: 380000, solar: 90000, storage: 30000, total: 500000 },
    water: { municipal: 13000, reclaimed: 5000, total: 18000 },
    gas: { compressedAir: 92000 }
  },
  {
    month: '2025-10',
    electricity: { municipal: 358000, solar: 82500, storage: 27500, total: 468000 },
    water: { municipal: 12800, reclaimed: 4900, total: 17700 },
    gas: { compressedAir: 90000 }
  },
  {
    month: '2025-11',
    electricity: { municipal: 342000, solar: 72000, storage: 24000, total: 438000 },
    water: { municipal: 12200, reclaimed: 4600, total: 16800 },
    gas: { compressedAir: 86000 }
  },
  {
    month: '2025-12',
    electricity: { municipal: 335000, solar: 63000, storage: 21000, total: 419000 },
    water: { municipal: 11800, reclaimed: 4400, total: 16200 },
    gas: { compressedAir: 84000 }
  }
]

// ---------------------------------------------------------------------------
// Energy targets — 3 items
// ---------------------------------------------------------------------------

export const energyTargets: EnergyTarget[] = [
  {
    name: '单位产值能耗下降',
    target: 15.0,
    current: 12.8,
    year: '2025'
  },
  {
    name: '光伏发电占比提升',
    target: 25.0,
    current: 20.5,
    year: '2025'
  },
  {
    name: '工业用水回用率',
    target: 40.0,
    current: 38.0,
    year: '2025'
  }
]

// ---------------------------------------------------------------------------
// Electricity source split — 3 sources
// ---------------------------------------------------------------------------

export const electricitySourceSplit: EnergySourceSplit[] = [
  {
    source: '市政用电',
    percentage: 73.6,
    color: '#0ea5e9'   // sky-500
  },
  {
    source: '光伏发电',
    percentage: 18.7,
    color: '#facc15'   // yellow-400
  },
  {
    source: '储能放电',
    percentage: 7.7,
    color: '#22c55e'   // green-500
  }
]

// ---------------------------------------------------------------------------
// Current month summary (June 2025)
// ---------------------------------------------------------------------------

export const currentMonthEnergy: {
  totalElectricity: number // kWh
  totalWater: number       // 吨
  totalGas: number         // m³
  monthOnMonthChange: number // % (vs last month)
} = {
  totalElectricity: 528000,
  totalWater: 18700,
  totalGas: 95000,
  monthOnMonthChange: 6.9
}
