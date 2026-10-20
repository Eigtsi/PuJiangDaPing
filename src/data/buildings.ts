/**
 * 浦江水晶产业园 - 楼栋建筑模拟数据
 * 共 15 栋建筑：西区 3 栋厂房，中区 4 栋厂房，东区 5 栋厂房，3 栋配套建筑
 * 所有 enterprise ID 与 enterprises.ts 中的数据对应
 */

export interface Building {
  id: string
  name: string
  zone: 'west' | 'center' | 'west'
  x: number
  y: number
  width: number
  height: number
  totalArea: number
  rentedArea: number
  floors: number
  rentalRate: number
  rentalStatus: 'full' | 'mostly' | 'partial' | 'vacant'
  enterprises: string[]
}

export const buildings: Building[] = [
  // ===================== 西区 =====================
  {
    id: 'bld-a',
    name: 'A栋智能厂房',
    zone: 'west',
    x: 23,
    y: 28,
    width: 8,
    height: 12,
    totalArea: 8000,
    rentedArea: 7700,
    floors: 7,
    rentalRate: 96.3,
    rentalStatus: 'mostly',
    enterprises: ['ent-001', 'ent-002', 'ent-007', 'ent-010']
  },
  {
    id: 'bld-b',
    name: 'B栋精工厂房',
    zone: 'west',
    x: 18,
    y: 43,
    width: 8,
    height: 12,
    totalArea: 7200,
    rentedArea: 5900,
    floors: 5,
    rentalRate: 81.9,
    rentalStatus: 'mostly',
    enterprises: ['ent-003', 'ent-004', 'ent-008', 'ent-011']
  },
  {
    id: 'bld-c',
    name: 'C栋综合厂房',
    zone: 'west',
    x: 28,
    y: 53,
    width: 8,
    height: 12,
    totalArea: 7500,
    rentedArea: 6370,
    floors: 5,
    rentalRate: 84.9,
    rentalStatus: 'mostly',
    enterprises: ['ent-005', 'ent-006', 'ent-009', 'ent-012']
  },

  // ===================== 中区 =====================
  {
    id: 'bld-d',
    name: 'D栋科创厂房',
    zone: 'center',
    x: 43,
    y: 23,
    width: 9,
    height: 14,
    totalArea: 9500,
    rentedArea: 8600,
    floors: 6,
    rentalRate: 90.5,
    rentalStatus: 'mostly',
    enterprises: ['ent-013', 'ent-014', 'ent-020']
  },
  {
    id: 'bld-e',
    name: 'E栋工艺厂房',
    zone: 'center',
    x: 48,
    y: 38,
    width: 9,
    height: 14,
    totalArea: 8800,
    rentedArea: 6180,
    floors: 6,
    rentalRate: 70.2,
    rentalStatus: 'partial',
    enterprises: ['ent-015', 'ent-016', 'ent-021', 'ent-026']
  },
  {
    id: 'bld-f',
    name: 'F栋精密厂房',
    zone: 'center',
    x: 43,
    y: 53,
    width: 9,
    height: 14,
    totalArea: 8200,
    rentedArea: 5600,
    floors: 5,
    rentalRate: 68.3,
    rentalStatus: 'partial',
    enterprises: ['ent-017', 'ent-018', 'ent-022', 'ent-024']
  },
  {
    id: 'bld-g',
    name: 'G栋商务厂房',
    zone: 'center',
    x: 53,
    y: 63,
    width: 9,
    height: 12,
    totalArea: 7000,
    rentedArea: 5930,
    floors: 4,
    rentalRate: 84.7,
    rentalStatus: 'mostly',
    enterprises: ['ent-019', 'ent-023', 'ent-025']
  },

  // ===================== 东区 =====================
  {
    id: 'bld-h',
    name: 'H栋高端厂房',
    zone: 'east',
    x: 68,
    y: 28,
    width: 8,
    height: 14,
    totalArea: 9000,
    rentedArea: 8200,
    floors: 5,
    rentalRate: 91.1,
    rentalStatus: 'mostly',
    enterprises: ['ent-027', 'ent-028']
  },
  {
    id: 'bld-i',
    name: 'I栋热加工厂房',
    zone: 'east',
    x: 73,
    y: 43,
    width: 8,
    height: 12,
    totalArea: 7200,
    rentedArea: 4530,
    floors: 4,
    rentalRate: 62.9,
    rentalStatus: 'partial',
    enterprises: ['ent-029', 'ent-030', 'ent-035']
  },
  {
    id: 'bld-j',
    name: 'J栋精密部件厂房',
    zone: 'east',
    x: 63,
    y: 53,
    width: 8,
    height: 10,
    totalArea: 5500,
    rentedArea: 4120,
    floors: 3,
    rentalRate: 74.9,
    rentalStatus: 'partial',
    enterprises: ['ent-031', 'ent-033']
  },
  {
    id: 'bld-k',
    name: 'K栋服务配套楼',
    zone: 'east',
    x: 78,
    y: 58,
    width: 8,
    height: 10,
    totalArea: 5000,
    rentedArea: 3600,
    floors: 3,
    rentalRate: 72.0,
    rentalStatus: 'partial',
    enterprises: ['ent-032', 'ent-034', 'ent-036']
  },
  {
    id: 'bld-l',
    name: 'L栋仓储物流楼',
    zone: 'east',
    x: 72,
    y: 70,
    width: 8,
    height: 8,
    totalArea: 4000,
    rentedArea: 3200,
    floors: 2,
    rentalRate: 80.0,
    rentalStatus: 'mostly',
    enterprises: []
  },

  // ===================== 配套建筑 =====================
  {
    id: 'bld-dorm',
    name: '蓝领公寓',
    zone: 'center',
    x: 33,
    y: 68,
    width: 10,
    height: 8,
    totalArea: 6800,
    rentedArea: 5440,
    floors: 8,
    rentalRate: 80.0,
    rentalStatus: 'mostly',
    enterprises: []
  },
  {
    id: 'bld-commerce',
    name: '商业配套中心',
    zone: 'center',
    x: 58,
    y: 73,
    width: 10,
    height: 6,
    totalArea: 4500,
    rentedArea: 4275,
    floors: 3,
    rentalRate: 95.0,
    rentalStatus: 'full',
    enterprises: []
  },
  {
    id: 'bld-rd',
    name: '研发大楼',
    zone: 'center',
    x: 38,
    y: 13,
    width: 10,
    height: 8,
    totalArea: 5200,
    rentedArea: 3900,
    floors: 6,
    rentalRate: 75.0,
    rentalStatus: 'partial',
    enterprises: []
  }
]

/** 按区域分组 */
export const buildingsByZone = {
  east: buildings.filter(b => b.zone === 'east'),
  center: buildings.filter(b => b.zone === 'center'),
  west: buildings.filter(b => b.zone === 'west')
}

/** 根据 ID 获取楼栋 */
export function getBuildingById(id: string): Building | undefined {
  return buildings.find(b => b.id === id)
}

/** 根据楼栋名称获取楼栋 */
export function getBuildingByName(name: string): Building | undefined {
  return buildings.find(b => b.name === name)
}

/** 根据企业 ID 查找所在楼栋 */
export function getBuildingByEnterpriseId(enterpriseId: string): Building | undefined {
  return buildings.find(b => b.enterprises.includes(enterpriseId))
}

/** 厂房建筑（不含配套） */
export const factoryBuildings = buildings.filter(
  b => !['bld-dorm', 'bld-commerce', 'bld-rd'].includes(b.id)
)

/** 配套建筑 */
export const supportBuildings = buildings.filter(
  b => ['bld-dorm', 'bld-commerce', 'bld-rd'].includes(b.id)
)

/** 园区总出租率 */
export function overallRentalRate(): number {
  const total = buildings.reduce((sum, b) => sum + b.totalArea, 0)
  const rented = buildings.reduce((sum, b) => sum + b.rentedArea, 0)
  return Math.round((rented / total) * 1000) / 10
}

/** 按出租状态统计 */
export const buildingsByRentalStatus = {
  full: buildings.filter(b => b.rentalStatus === 'full'),
  mostly: buildings.filter(b => b.rentalStatus === 'mostly'),
  partial: buildings.filter(b => b.rentalStatus === 'partial'),
  vacant: buildings.filter(b => b.rentalStatus === 'vacant')
}
