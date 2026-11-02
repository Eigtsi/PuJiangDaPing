/**
 * 楼栋 / 企业 水电气明细（用量 + 费用）— 模拟数据
 * 供地图楼栋悬浮面板使用：默认展示整栋楼上月明细，点击企业后展示该企业上月明细
 *
 * 口径：
 *  - 从房产资源(propertyRooms)按「面积 × 单位强度 × 确定性抖动」生成总量；
 *  - 按固定占比拆成明细（电：尖/峰/平/谷，水：厂自来水/卫自来水/中水，气：日/夜），
 *    保证同一楼栋/企业数值稳定，且各明细之和 == 总量；
 *  - 单价对齐 parkMonitor.ts 右侧面板（水/电/气 单价见下方 SPLIT）。
 */

import { propertyRooms, type PropertyRoom } from './propertyResources'
import { monthOptions, yearOptions } from './parkMonitor'

export interface UtilityDetail {
  name: string   // 明细项名称
  usage: number  // 用量（吨/kWh/m³）
  cost: number   // 费用（元）
  color?: string
}

export interface UtilityEnergy {
  total: number           // 总量
  cost: number            // 总费用（元）
  details: UtilityDetail[]
}

export interface BuildingEnergy {
  month: string
  water: UtilityEnergy
  electricity: UtilityEnergy
  gas: UtilityEnergy
}

// 明细拆分：占比（用量）+ 单价（元）+ 颜色（对齐右侧面板用水/用电/供气分析）
const SPLIT = {
  water: [
    { name: '厂自来水', ratio: 0.5, price: 2.14, color: '#0ea5e9' },
    { name: '卫自来水', ratio: 0.24, price: 0.98, color: '#14b8a6' },
    { name: '中水', ratio: 0.26, price: 1.08, color: '#f59e0b' },
  ],
  electricity: [
    { name: '尖电量', ratio: 0.15, price: 1.42, color: '#ff4a4a' },
    { name: '峰电量', ratio: 0.25, price: 1.13, color: '#fdad43' },
    { name: '平电量', ratio: 0.4, price: 0.85, color: '#0ea5e9' },
    { name: '谷电量', ratio: 0.2, price: 0.425, color: '#10b981' },
  ],
  gas: [
    { name: '日间', ratio: 0.55, price: 3.9, color: '#f59e0b' },
    { name: '夜间', ratio: 0.45, price: 2.5, color: '#6366f1' },
  ],
} as const

// 单位面积月用量基准（吨/m²、kWh/m²、m³/m²）
const BASE = { water: 0.12, electricity: 12, gas: 0.3 }

// 确定性伪随机（0.75 ~ 1.25），同一 key 每次结果一致
function jitter(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return 0.75 + ((h % 1000) / 1000) * 0.5
}

function factorFor(key: string): number {
  const m = monthOptions.find(o => o.key === key)
  if (m) return m.factor
  const y = yearOptions.find(o => o.key === key)
  return y?.factor ?? 1
}

function split(totalUsage: number, spec: readonly { name: string; ratio: number; price: number; color: string }[]): UtilityEnergy {
  const details: UtilityDetail[] = spec.map(s => {
    const usage = Math.round(totalUsage * s.ratio)
    return { name: s.name, usage, cost: Math.round(usage * s.price), color: s.color }
  })
  return {
    total: details.reduce((sum, d) => sum + d.usage, 0),
    cost: details.reduce((sum, d) => sum + d.cost, 0),
    details,
  }
}

function baseUsage(rooms: PropertyRoom[]): { water: number; electricity: number; gas: number } {
  let water = 0
  let electricity = 0
  let gas = 0
  for (const r of rooms) {
    const area = r.totalArea ?? 0
    if (area <= 0) continue
    const j = jitter(`${r.serialNo ?? 0}-${r.buildingNo ?? ''}-${r.enterprise ?? ''}`)
    water += area * BASE.water * j
    electricity += area * BASE.electricity * j
    gas += area * BASE.gas * j
  }
  return { water, electricity, gas }
}

/** 某楼栋（Excel 园区名 + 楼号）指定月份水电气明细 */
export function getBuildingEnergy(zone: string, buildingNo: string, month: string): BuildingEnergy {
  const f = factorFor(month)
  const u = baseUsage(propertyRooms.filter(r => r.zone === zone && r.buildingNo === buildingNo))
  return {
    month,
    water: split(u.water * f, SPLIT.water),
    electricity: split(u.electricity * f, SPLIT.electricity),
    gas: split(u.gas * f, SPLIT.gas),
  }
}

/** 某企业指定月份水电气明细（跨楼栋汇总） */
export function getEnterpriseEnergy(name: string, month: string): BuildingEnergy {
  const f = factorFor(month)
  const u = baseUsage(propertyRooms.filter(r => r.enterprise === name))
  return {
    month,
    water: split(u.water * f, SPLIT.water),
    electricity: split(u.electricity * f, SPLIT.electricity),
    gas: split(u.gas * f, SPLIT.gas),
  }
}

/** 单个房间（某楼某层某室）指定周期水电气明细 */
export function getRoomEnergy(room: PropertyRoom, period: string): BuildingEnergy {
  const f = factorFor(period)
  const u = baseUsage([room])
  return {
    month: period,
    water: split(u.water * f, SPLIT.water),
    electricity: split(u.electricity * f, SPLIT.electricity),
    gas: split(u.gas * f, SPLIT.gas),
  }
}

/** 默认统计周期：最新月份（上月）；年份由面板侧在 yearOptions 中切换 */
export const latestEnergyMonth = monthOptions[monthOptions.length - 1]?.key ?? ''
