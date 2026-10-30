// 房产资源企业联系人/联系电话（模拟数据）
// 说明：房产资源表（propertyResources.ts）清洗时按规范剔除了联系电话/法人等个人敏感字段，
//       此处为楼栋悬浮面板提供「联系人/联系电话」的展示数据。
// 注意：以下均为按企业名确定性生成的模拟数据，非真实个人信息。

export interface EnterpriseContact {
  contact: string  // 联系人
  phone: string    // 联系电话
}

const SURNAMES = [
  '王', '李', '张', '陈', '刘', '杨', '黄', '周', '吴', '徐',
  '孙', '马', '朱', '胡', '郭', '何', '林', '罗', '郑', '梁',
  '谢', '宋', '唐', '许', '韩', '冯', '邓', '曹', '彭', '曾',
]

const GIVEN_NAMES = [
  '伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋',
  '勇', '艳', '杰', '娟', '涛', '明', '超', '霞', '平', '刚',
  '华', '红', '玉兰', '建平', '晓东', '秀英', '志强', '丽华', '永强', '美玲',
  '雅琴', '光明', '小芳', '大伟', '秀兰', '建军', '志华', '晓红', '桂英', '淑珍',
  '国栋', '文博', '雨桐', '子涵', '浩然', '欣怡', '嘉诚', '若曦', '俊峰', '文静',
]

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0
  }
  return h
}

export function getEnterpriseContact(name: string): EnterpriseContact {
  const h = hashString(name)
  const surname = SURNAMES[h % SURNAMES.length]
  const given = GIVEN_NAMES[(h >> 5) % GIVEN_NAMES.length]
  const contact = surname + given
  // 0579-84 开头，后接 6 位（与 enterprises.ts 的电话风格一致）
  const a = h % 1000
  const b = (h >> 10) % 1000
  const phone = '0579-84' + String(a).padStart(3, '0') + String(b).padStart(3, '0')
  return { contact, phone }
}
