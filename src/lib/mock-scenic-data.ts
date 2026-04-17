/**
 * 景点多方案规划 - Mock 数据
 * 包含南澳岛和汕头小公园两个景点的多种游览方案
 */

/** 方案类型 */
export type ScenicPlanType = 'mainstream' | 'economy' | 'deep' | 'special'

/** 景点游览方案 */
export interface ScenicPlan {
  /** 方案名称（如"主流游览方案"） */
  planName: string
  /** 方案类型 */
  planType: ScenicPlanType
  /** 预计时长（如"3-4小时"） */
  duration: string
  /** 预计花费 */
  cost: number
  /** 方案描述 */
  description: string
  /** 亮点列表 */
  highlights: string[]
  /** 实用贴士 */
  tips: string[]
}

/** 景点方案数据 */
export interface ScenicPlanData {
  /** 景点名称 */
  scenicName: string
  /** 该景点的所有游览方案 */
  plans: ScenicPlan[]
}

/** 方案类型配置映射 */
export const planTypeConfig: Record<ScenicPlanType, { label: string; color: string; bgColor: string }> = {
  mainstream: {
    label: '主流',
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  economy: {
    label: '经济',
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  deep: {
    label: '深度',
    color: 'text-purple-700 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  special: {
    label: '特殊',
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
}

/** Mock 景点方案数据 */
export const mockScenicPlans: ScenicPlanData[] = [
  {
    scenicName: '南澳岛',
    plans: [
      {
        planName: '主流游览方案',
        planType: 'mainstream',
        duration: '4-5小时',
        cost: 200,
        description: '经典南澳岛一日游路线，覆盖主要景点，适合第一次来的游客。',
        highlights: ['南澳大桥观景', '青澳湾沙滩漫步', '总兵府参观', '风电场观景台拍照', '海鲜大排档午餐'],
        tips: ['建议自驾或包车', '防晒必备', '带上泳衣可以下水', '周末人多建议早出发'],
      },
      {
        planName: '经济实惠方案',
        planType: 'economy',
        duration: '3-4小时',
        cost: 80,
        description: '用最少的钱体验南澳岛的魅力，公共交通可达。',
        highlights: ['公交车上岛', '青澳湾免费沙滩', '渔民码头看日落', '路边摊吃海鲜'],
        tips: ['公交班次少，注意末班车时间', '自带水和零食', '路边摊海鲜注意新鲜度'],
      },
      {
        planName: '深度探索方案',
        planType: 'deep',
        duration: '全天（8-10小时）',
        cost: 350,
        description: '深入探索南澳岛的每一个角落，发现隐藏的美景。',
        highlights: ['南澳大桥日出', '三囱崖灯塔', '后花园湾野生沙滩', '宋井探秘', '黄花山森林公园徒步', '渔排体验（乘船出海）', '青澳湾日落'],
        tips: ['需要自驾', '穿运动鞋', '带足饮用水', '充电宝必备', '部分路段信号弱'],
      },
      {
        planName: '浪漫情侣方案',
        planType: 'special',
        duration: '5-6小时',
        cost: 300,
        description: '专为情侣设计的浪漫海岛之旅，包含多个网红打卡点。',
        highlights: ['南澳大桥情侣合影', '青澳湾沙滩漫步', '网红咖啡厅下午茶', '海边日落晚餐', '星空观测（天气好时）'],
        tips: ['提前预订海边餐厅', '带一件薄外套（海风大）', '日落时间提前查好'],
      },
    ],
  },
  {
    scenicName: '汕头小公园',
    plans: [
      {
        planName: '主流游览方案',
        planType: 'mainstream',
        duration: '2-3小时',
        cost: 0,
        description: '经典骑楼街区游览路线，打卡必去景点。',
        highlights: ['中山纪念亭拍照', '百货大楼外观', '老妈宫参观', '骑楼街巷漫步', '周边小吃打卡'],
        tips: ['建议下午4-6点去，光线好', '穿舒适的鞋子', '周边有很多小吃可以边走边吃'],
      },
      {
        planName: '经济实惠方案',
        planType: 'economy',
        duration: '1-2小时',
        cost: 30,
        description: '快速游览核心区域，预算极低。',
        highlights: ['中山纪念亭', '骑楼外观欣赏', '一个蛋挞+一杯奶茶', '免费拍照打卡'],
        tips: ['不需要门票', '自带水', '周末人多注意保管财物'],
      },
      {
        planName: '深度文化方案',
        planType: 'deep',
        duration: '4-5小时',
        cost: 50,
        description: '深入了解汕头开埠历史和骑楼建筑文化。',
        highlights: ['开埠文化陈列馆', '侨批文物馆', '非遗展示馆', '镇邦路骑楼群', '汕头旅社旧址', '老妈宫戏台（周末有潮剧）'],
        tips: ['部分展馆周一闭馆', '建议请个讲解员（50元）', '带笔记本记录有趣的历史故事'],
      },
      {
        planName: '美食探索方案',
        planType: 'special',
        duration: '3-4小时',
        cost: 80,
        description: '以小公园为中心的美食探店路线。',
        highlights: ['老妈宫粽球', '飘香小吃', '广场豆花', '爱西干面', '榕香蚝烙', '十二中草莓冰'],
        tips: ['空腹前往', '每样少吃点留肚子给下一家', '带现金（部分老店不支持扫码）'],
      },
    ],
  },
]
