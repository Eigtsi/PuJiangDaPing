/**
 * 欠费提醒数据 — 浦江水晶园区（用水分析 / 用电分析面板铃铛）
 * 字段：企业名称、房产资源、欠费种类、欠费月份、欠费金额、已读/未读
 */

export type ArrearsFeeType = '水费' | '电费' | '气费'

export interface ArrearsRecord {
  id: string
  enterpriseName: string
  property: string        // 房产资源（楼栋 + 楼层）
  feeType: ArrearsFeeType // 欠费种类
  month: string           // 欠费月份 YYYY-MM
  amount: number          // 欠费金额（元）
  read: boolean           // 是否已读
}

export const arrearsRecords: ArrearsRecord[] = [
  // 水费欠费
  { id: 'AR-001', enterpriseName: '华兴第一水晶工坊', property: 'A栋 1F-3F', feeType: '水费', month: '2025-11', amount: 12800, read: false },
  { id: 'AR-002', enterpriseName: '恒泰水晶高精磨砂切片厂', property: 'A栋 4F-5F', feeType: '水费', month: '2025-10', amount: 8600, read: false },
  { id: 'AR-003', enterpriseName: '千叶高精度雕刻厂', property: 'B栋 1F-2F', feeType: '水费', month: '2025-11', amount: 5200, read: true },
  { id: 'AR-004', enterpriseName: '金华锦程水晶灯饰制造', property: 'C栋 2F-3F', feeType: '水费', month: '2025-09', amount: 15600, read: false },
  // 电费欠费
  { id: 'AR-005', enterpriseName: '浦江智感环境净化与水晶涂层中心', property: 'D栋 1F-3F', feeType: '电费', month: '2025-11', amount: 42000, read: false },
  { id: 'AR-006', enterpriseName: '恒通水晶原料精炼厂', property: 'D栋 4F-5F', feeType: '电费', month: '2025-10', amount: 28600, read: false },
  { id: 'AR-007', enterpriseName: '华光水晶建材有限公司', property: 'G栋 3F-4F', feeType: '电费', month: '2025-11', amount: 31800, read: true },
  { id: 'AR-008', enterpriseName: '浦江盛世水晶高档制品有限公司', property: 'H栋 1F-3F', feeType: '电费', month: '2025-10', amount: 39600, read: false },
  // 气费欠费
  { id: 'AR-009', enterpriseName: '华兴第一水晶工坊', property: 'A栋 2F', feeType: '气费', month: '2025-11', amount: 6800, read: false },
  { id: 'AR-010', enterpriseName: '金华锦程水晶灯饰制造', property: 'C栋 2F-3F', feeType: '气费', month: '2025-10', amount: 5300, read: false },
  { id: 'AR-011', enterpriseName: '华光水晶建材有限公司', property: 'G栋 3F-4F', feeType: '气费', month: '2025-11', amount: 9200, read: true },
  { id: 'AR-012', enterpriseName: '浦江盛世水晶高档制品有限公司', property: 'H栋 1F-2F', feeType: '气费', month: '2025-09', amount: 7400, read: false },
]

/** 按欠费种类筛选 */
export function getArrearsByType(feeType: ArrearsFeeType): ArrearsRecord[] {
  return arrearsRecords.filter((r) => r.feeType === feeType)
}
