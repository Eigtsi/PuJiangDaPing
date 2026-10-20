/**
 * 业务提醒数据 — 浦江水晶园区综合管理平台（企业一站式服务·业务提醒）
 * 涵盖合同到期、缴费提醒、证照到期、年检提醒等
 */

export interface BusinessReminder {
  id: string
  enterpriseName: string
  type: '合同到期' | '缴费提醒' | '证照到期' | '年检提醒'
  description: string
  deadline: string
  daysLeft: number
  level: '紧急' | '重要' | '一般'
  status: '待处理' | '已处理'
}

export const businessReminders: BusinessReminder[] = [
  {
    id: 'RMD-001',
    enterpriseName: '浦江东方物流仓储服务部',
    type: '合同到期',
    description: '租赁合同将于月底到期，需确认续租意向',
    deadline: '2025-06-30',
    daysLeft: 3,
    level: '紧急',
    status: '待处理'
  },
  {
    id: 'RMD-002',
    enterpriseName: '恒盛水晶原料加工厂',
    type: '缴费提醒',
    description: '租金连续 4 个月未缴，已进入诉讼程序',
    deadline: '2025-06-29',
    daysLeft: 2,
    level: '紧急',
    status: '待处理'
  },
  {
    id: 'RMD-003',
    enterpriseName: '华艺水晶工艺品厂',
    type: '缴费提醒',
    description: '物业费欠缴超 1 个月，已发送催缴通知函',
    deadline: '2025-07-04',
    daysLeft: 7,
    level: '重要',
    status: '待处理'
  },
  {
    id: 'RMD-004',
    enterpriseName: '浦江晶彩光学制品厂',
    type: '证照到期',
    description: '排污许可证需年审换发，环保台账待补录',
    deadline: '2025-07-07',
    daysLeft: 10,
    level: '重要',
    status: '待处理'
  },
  {
    id: 'RMD-005',
    enterpriseName: '华兴第一水晶工坊',
    type: '合同到期',
    description: '租赁合同续签中，待补签纸质协议',
    deadline: '2025-07-12',
    daysLeft: 15,
    level: '重要',
    status: '待处理'
  },
  {
    id: 'RMD-006',
    enterpriseName: '千叶高精度雕刻厂',
    type: '年检提醒',
    description: '工商年报信息待提交，逾期将影响信用',
    deadline: '2025-07-17',
    daysLeft: 20,
    level: '一般',
    status: '待处理'
  },
  {
    id: 'RMD-007',
    enterpriseName: '金辉水晶灯饰有限公司',
    type: '证照到期',
    description: '营业执照换发材料待补充',
    deadline: '2025-07-22',
    daysLeft: 25,
    level: '一般',
    status: '待处理'
  },
  {
    id: 'RMD-008',
    enterpriseName: '永盛水晶抛光材料公司',
    type: '缴费提醒',
    description: '水电费代缴对账已完成，待确认划扣',
    deadline: '2025-07-27',
    daysLeft: 30,
    level: '一般',
    status: '待处理'
  }
]

/** 待处理提醒 */
export function getPendingReminders(): BusinessReminder[] {
  return businessReminders.filter(r => r.status === '待处理')
}

/** 紧急提醒 */
export function getUrgentReminders(): BusinessReminder[] {
  return businessReminders.filter(r => r.level === '紧急' && r.status === '待处理')
}