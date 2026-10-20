/**
 * 预警与事件数据 — 浦江水晶园区综合管理平台
 * 涵盖环境预警、运营异常、能耗告警、企业诉求、合同到期等
 *
 * 硬编码数据来源 (AppDashboard.vue):
 *   - 恒泰高精磨砂厂 pH预警 (二级响应)
 *   - 浦江智感环境 PM2.5限值预警 (自查排障)
 *   - 华兴第一水晶 异常恢复 (已闭环)
 *   - 诉求累计42件, 接单派单率100%, 评分5.0
 *   - 续租率92.4%, 本季到期预警2家
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SystemAlert {
  id: string
  type: 'environment' | 'operation' | 'energy'
  level: '严重' | '重要' | '一般'
  title: string
  description: string
  pointName: string             // related monitoring point or enterprise
  enterpriseName?: string
  value: string                 // current value
  threshold: string             // limit value
  time: string                  // occurrence time
  status: '未处置' | '处置中' | '已闭环'
  handler?: string              // 处置人
  closedTime?: string           // 闭环时间
}

export interface AppealRecord {
  id: string
  enterpriseName: string
  type: string                  // 诉求类型
  description: string
  progress: number              // 0-100
  status: '加急代办中' | '已办结' | '待受理'
  handler: string
  createTime: string
  closeTime?: string
}

export interface ContractExpiry {
  enterpriseId: string
  enterpriseName: string
  building: string
  leaseEnd: string
  remainingDays: number
  status: '即将到期' | '到期' | '续签中'
  hasReminder: boolean
}

// ---------------------------------------------------------------------------
// System alerts — ~15 items
// Includes the 3 hardcoded alerts from AppDashboard.vue plus additional realistic ones
// ---------------------------------------------------------------------------

export const systemAlerts: SystemAlert[] = [
  // ----- From hardcoded dashboard data -----
  {
    id: 'ALT-001',
    type: 'environment',
    level: '严重',
    title: '恒泰高精磨砂厂 pH预警',
    description: '排口废水pH过酸 偏离目标区（当前值：5.8）',
    pointName: '研磨一车间2号排口',
    enterpriseName: '恒泰水晶高精磨砂切片厂',
    value: 'pH 5.8',
    threshold: 'pH 6.0~9.0',
    time: '2025-06-02 10:24',
    status: '处置中',
    handler: '盛工'
  },
  {
    id: 'ALT-002',
    type: 'environment',
    level: '重要',
    title: '浦江智感环境 PM2.5限值预警',
    description: '二号水晶抛光线粉尘过滤负荷偏高（当前值：45）',
    pointName: '打磨加工段除尘器',
    enterpriseName: '浦江智感环境净化与水晶涂层中心',
    value: 'PM2.5 45 µg/m³',
    threshold: 'PM2.5 ≤ 35 µg/m³',
    time: '2025-06-02 09:12',
    status: '处置中',
    handler: '包工'
  },
  {
    id: 'ALT-003',
    type: 'environment',
    level: '一般',
    title: '华兴第一水晶 异常恢复',
    description: '烟气余热排放脱硫段恢复至安全阈值',
    pointName: '余热除硫反应釜温度已重置',
    enterpriseName: '华兴第一水晶工坊',
    value: '温度 24.5℃',
    threshold: '温度 ≤ 60℃',
    time: '2025-06-02 08:35',
    status: '已闭环',
    handler: '张工',
    closedTime: '2025-06-02 08:35'
  },

  // ----- Additional environment alerts -----
  {
    id: 'ALT-004',
    type: 'environment',
    level: '重要',
    title: 'A区3号氟化池氟化物超标',
    description: '氟化物浓度持续偏高，超过排放标准限值',
    pointName: 'A区3号氟化池',
    enterpriseName: '浦江晶彩光学制品厂',
    value: '氟化物 10.3 mg/L',
    threshold: '氟化物 ≤ 8 mg/L',
    time: '2025-06-01 22:18',
    status: '处置中',
    handler: '李工'
  },
  {
    id: 'ALT-005',
    type: 'environment',
    level: '一般',
    title: 'B区抛光车间VOC浓度偏高',
    description: '抛光生产线VOC排放接近预警阈值',
    pointName: 'B区抛光车间VOC监测点',
    enterpriseName: '金辉水晶灯饰有限公司',
    value: 'TVOC 165 mg/m³',
    threshold: 'TVOC ≤ 200 mg/m³',
    time: '2025-06-01 16:45',
    status: '处置中',
    handler: '王工'
  },
  {
    id: 'ALT-006',
    type: 'environment',
    level: '严重',
    title: 'B区涂装车间VOC严重超标',
    description: '涂装生产线VOC排放大幅超过标准限值，需立即处置',
    pointName: 'B区涂装车间VOC监测点',
    enterpriseName: '华艺水晶工艺品厂',
    value: 'TVOC 230 mg/m³',
    threshold: 'TVOC ≤ 200 mg/m³',
    time: '2025-06-02 07:32',
    status: '未处置'
  },
  {
    id: 'ALT-007',
    type: 'environment',
    level: '一般',
    title: 'A区排污口COD浓度偏高',
    description: 'A区排污口化学需氧量接近排放限值',
    pointName: 'A区排污口',
    value: 'COD 45.6 mg/L',
    threshold: 'COD ≤ 50 mg/L',
    time: '2025-05-31 14:20',
    status: '已闭环',
    handler: '赵工',
    closedTime: '2025-05-31 18:00'
  },
  {
    id: 'ALT-008',
    type: 'environment',
    level: '重要',
    title: '园区南侧空气站臭氧预警',
    description: '南侧空气质量站臭氧浓度偏高，需关注天气影响',
    pointName: '园区南侧空气站',
    value: 'O₃ 128 µg/m³',
    threshold: 'O₃ ≤ 160 µg/m³',
    time: '2025-06-01 12:00',
    status: '处置中',
    handler: '陈工'
  },

  // ----- Operation alerts -----
  {
    id: 'ALT-009',
    type: 'operation',
    level: '重要',
    title: '恒盛水晶原料加工厂租金欠缴',
    description: '连续4个月未缴纳租金，已进入诉讼程序',
    pointName: '资产管理中心',
    enterpriseName: '恒盛水晶原料加工厂',
    value: '欠缴 5.2万元',
    threshold: '合同约定按月缴付',
    time: '2025-05-28 09:00',
    status: '处置中',
    handler: '刘经理'
  },
  {
    id: 'ALT-010',
    type: 'operation',
    level: '一般',
    title: '华艺水晶工艺品厂物业费逾期',
    description: '物业费欠缴已超1个月，已发送催缴通知函',
    pointName: '物业服务中心',
    enterpriseName: '华艺水晶工艺品厂',
    value: '欠缴 1.8万元',
    threshold: '合同约定按月缴付',
    time: '2025-05-25 10:30',
    status: '处置中',
    handler: '吴主管'
  },
  {
    id: 'ALT-011',
    type: 'operation',
    level: '重要',
    title: '浦江晶智科技扩租合同审批超时',
    description: 'A栋3F扩租合同审批已超5个工作日，需加急处理',
    pointName: '合同管理中心',
    enterpriseName: '浦江晶智科技有限公司',
    value: '审批进度 80%',
    threshold: '3个工作日内完成',
    time: '2025-06-01 08:00',
    status: '处置中',
    handler: '周专员'
  },

  // ----- Energy alerts -----
  {
    id: 'ALT-012',
    type: 'energy',
    level: '重要',
    title: '恒泰高精磨砂厂用电负荷异常',
    description: '实时用电负荷持续偏高，超过额定功率80%',
    pointName: '配电室A3',
    enterpriseName: '恒泰水晶高精磨砂切片厂',
    value: '350 kWh/h',
    threshold: '额定 ≤ 280 kWh/h',
    time: '2025-06-02 06:15',
    status: '处置中',
    handler: '郑工'
  },
  {
    id: 'ALT-013',
    type: 'energy',
    level: '一般',
    title: 'C区储能电站放电效率下降',
    description: '储能系统放电效率较上月下降3.5%，需排查电池组',
    pointName: 'C区储能电站',
    value: '效率 89.2%',
    threshold: '效率 ≥ 92%',
    time: '2025-06-01 20:00',
    status: '未处置'
  },
  {
    id: 'ALT-014',
    type: 'energy',
    level: '一般',
    title: 'B区光伏电站发电量偏低',
    description: '本月光伏发电量较预期偏低12%，疑似组件积灰',
    pointName: 'B区屋顶光伏电站',
    value: '日均 2,800 kWh',
    threshold: '日均 ≥ 3,200 kWh',
    time: '2025-06-02 08:00',
    status: '处置中',
    handler: '孙工'
  },
  {
    id: 'ALT-015',
    type: 'energy',
    level: '重要',
    title: '园区总用水量超月度预算',
    description: '6月上半月用水已达月度预算的65%，需关注是否存在管网泄漏',
    pointName: '园区总水表',
    value: '已用 12,200 吨',
    threshold: '月预算 ≤ 18,700 吨',
    time: '2025-06-02 07:00',
    status: '未处置'
  }
]

// ---------------------------------------------------------------------------
// Appeal records — ~8 items
// 基准: 累计42件, 接单派单率100%, 评分5.0
// ---------------------------------------------------------------------------

export const appealRecords: AppealRecord[] = [
  {
    id: 'APL-001',
    enterpriseName: '华兴第一水晶工坊',
    type: '电力增容申请',
    description: '向园区申报并开通120kW特殊水晶抛磨高压备用线',
    progress: 100,
    status: '已办结',
    handler: '管委会电力组',
    createTime: '2025-05-28 09:30',
    closeTime: '2025-06-01 15:30'
  },
  {
    id: 'APL-002',
    enterpriseName: '恒泰水晶高精磨砂切片厂',
    type: '环保整改协助',
    description: '请求园区环保专家协助排查pH异常原因并提供整改方案',
    progress: 65,
    status: '加急代办中',
    handler: '环保服务组 盛工',
    createTime: '2025-06-02 10:30'
  },
  {
    id: 'APL-003',
    enterpriseName: '浦江晶彩光学制品厂',
    type: '固废清运申请',
    description: '车间积压水晶副产废料约8吨，申请加急清运',
    progress: 40,
    status: '加急代办中',
    handler: '固废管理组 李工',
    createTime: '2025-06-01 14:00'
  },
  {
    id: 'APL-004',
    enterpriseName: '千叶高精度雕刻厂',
    type: '厂房维修',
    description: 'B栋2F车间屋顶渗水，影响雕刻设备正常运行',
    progress: 100,
    status: '已办结',
    handler: '物业维修组 张师傅',
    createTime: '2025-05-25 08:15',
    closeTime: '2025-05-27 16:00'
  },
  {
    id: 'APL-005',
    enterpriseName: '金辉水晶灯饰有限公司',
    type: '招工需求',
    description: '下半年订单增加，需招聘熟练抛光工15名、质检员5名',
    progress: 80,
    status: '加急代办中',
    handler: '企业服务组 王专员',
    createTime: '2025-05-30 10:00'
  },
  {
    id: 'APL-006',
    enterpriseName: '浦江智感环境净化与水晶涂层中心',
    type: '政策咨询',
    description: '咨询绿色零碳工厂特别奖励申报条件与流程',
    progress: 100,
    status: '已办结',
    handler: '政策服务组 林主管',
    createTime: '2025-05-20 09:00',
    closeTime: '2025-05-22 11:30'
  },
  {
    id: 'APL-007',
    enterpriseName: '华艺水晶工艺品厂',
    type: '扩租申请',
    description: '因新增3条水晶灯饰生产线，申请租赁相邻空置厂房200㎡',
    progress: 0,
    status: '待受理',
    handler: '资产管理组',
    createTime: '2025-06-02 11:00'
  },
  {
    id: 'APL-008',
    enterpriseName: '浦江博源水晶科技有限公司',
    type: '消防设施改造',
    description: '新上马激光切割设备需改造车间消防喷淋系统',
    progress: 20,
    status: '加急代办中',
    handler: '安全管理组 赵工',
    createTime: '2025-05-29 13:45'
  }
]

// ---------------------------------------------------------------------------
// Contract expiries — ~6 records
// 基准: 续租率92.4%, 平均合同年限2.45年, 本季到期预警2家
// ---------------------------------------------------------------------------

export const contractExpiries: ContractExpiry[] = [
  {
    enterpriseId: 'ENT-002',
    enterpriseName: '恒泰水晶高精磨砂切片厂',
    building: 'A栋研磨车间',
    leaseEnd: '2025-09-02',
    remainingDays: 92,
    status: '即将到期',
    hasReminder: true
  },
  {
    enterpriseId: 'ENT-023',
    enterpriseName: '华艺水晶工艺品厂',
    building: 'C栋3F',
    leaseEnd: '2025-07-15',
    remainingDays: 43,
    status: '即将到期',
    hasReminder: true
  },
  {
    enterpriseId: 'ENT-001',
    enterpriseName: '华兴第一水晶工坊',
    building: '水晶产业大楼',
    leaseEnd: '2026-12-01',
    remainingDays: 548,
    status: '续签中',
    hasReminder: false
  },
  {
    enterpriseId: 'ENT-003',
    enterpriseName: '千叶高精度雕刻厂',
    building: 'B栋雕刻车间',
    leaseEnd: '2027-10-15',
    remainingDays: 866,
    status: '续签中',
    hasReminder: false
  },
  {
    enterpriseId: 'ENT-056',
    enterpriseName: '恒盛水晶原料加工厂',
    building: 'A栋4F仓储区',
    leaseEnd: '2025-06-15',
    remainingDays: 13,
    status: '到期',
    hasReminder: true
  },
  {
    enterpriseId: 'ENT-078',
    enterpriseName: '永盛水晶抛光材料公司',
    building: 'B栋1F',
    leaseEnd: '2025-08-30',
    remainingDays: 89,
    status: '即将到期',
    hasReminder: true
  }
]
