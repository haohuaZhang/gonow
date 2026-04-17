/**
 * GoNow 核心数据类型定义
 * 参考数据模型：User, Trip, Day, Activity, Expense
 */

// ============ 用户相关 ============

/** 用户偏好设置 */
export interface UserPreferences {
  /** 旅行风格：休闲/冒险/文化/美食/购物 */
  travelStyle: string[];
  /** 饮食限制 */
  dietaryRestrictions: string[];
  /** 过敏原 */
  allergies: string[];
  /** 预算偏好：经济/舒适/豪华 */
  budgetLevel: 'economy' | 'comfort' | 'luxury';
  /** 交通偏好 */
  transportPreference: string[];
}

/** 用户信息 */
export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: string;
}

// ============ 行程相关 ============

/** 活动类型 */
export type ActivityType = 'scenic' | 'food' | 'hotel' | 'transport' | 'culture';

/** 地理位置信息 */
export interface Location {
  /** 地点名称 */
  name: string;
  /** 纬度 */
  lat: number;
  /** 经度 */
  lng: number;
  /** 详细地址 */
  address?: string;
}

/** 红黑榜标记 */
export interface RedBlackFlags {
  /** 红旗（负面评价） */
  redFlags: string[];
  /** 黑旗（严重警告） */
  blackFlags: string[];
  /** 可信度评分 0-100 */
  credibilityScore: number;
}

/** 活动项目 */
export interface Activity {
  id: string;
  /** 活动类型 */
  type: ActivityType;
  /** 活动名称 */
  name: string;
  /** 地理位置信息 */
  location: Location;
  /** 预计花费 */
  cost: number;
  /** 评分 1-5 */
  rating: number;
  /** 红黑榜标记 */
  redBlackFlags?: RedBlackFlags;
  /** 活动描述 */
  description?: string;
  /** 建议游玩时长（分钟） */
  duration?: number;
  /** 开始时间 HH:mm */
  startTime?: string;
  /** 结束时间 HH:mm */
  endTime?: string;
  /** 图片URL */
  imageUrl?: string;
  /** 预订链接 */
  bookingUrl?: string;
  /** 备注 */
  notes?: string;
}

/** 天气信息 */
export interface WeatherInfo {
  /** 天气描述 */
  description: string;
  /** 温度（摄氏度） */
  temperature: number;
  /** 天气图标代码 */
  iconCode?: string;
  /** 湿度百分比 */
  humidity?: number;
  /** 风速描述 */
  wind?: string;
}

/** 单日行程 */
export interface Day {
  /** 天数（第几天） */
  dayNumber: number;
  /** 当日主题 */
  theme: string;
  /** 活动列表 */
  activities: Activity[];
  /** 预计总花费 */
  totalCost: number;
  /** 实际花费 */
  actualCost: number;
  /** 当日天气 */
  weather?: WeatherInfo;
  /** 日期 YYYY-MM-DD */
  date: string;
  /** 备注 */
  notes?: string;
}

/** 行程状态 */
export type TripStatus = 'planning' | 'confirmed' | 'completed' | 'archived';

/** 旅行行程 */
export interface Trip {
  id: string;
  /** 目的地 */
  destination: string;
  /** 开始日期 YYYY-MM-DD */
  startDate: string;
  /** 结束日期 YYYY-MM-DD */
  endDate: string;
  /** 旅行人数 */
  travelers: number;
  /** 总预算 */
  budget: number;
  /** 每日行程 */
  days: Day[];
  /** 行程整体天气 */
  weather?: WeatherInfo[];
  /** 行程状态 */
  status: TripStatus;
  /** 行程封面图 */
  coverImage?: string;
  /** 行程描述 */
  description?: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

// ============ 费用相关 ============

/** 费用类别 */
export type ExpenseCategory =
  | 'transport'
  | 'hotel'
  | 'food'
  | 'scenic'
  | 'shopping'
  | 'other';

/** 费用记录 */
export interface Expense {
  id: string;
  /** 关联行程ID */
  tripId: string;
  /** 第几天 */
  dayNumber: number;
  /** 费用类别 */
  category: ExpenseCategory;
  /** 金额 */
  amount: number;
  /** 费用描述 */
  description: string;
  /** 记录时间 */
  createdAt: string;
}

// ============ AI 对话相关 ============

/** 消息角色 */
export type MessageRole = 'user' | 'assistant' | 'system';

/** 聊天消息 */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  /** 关联的行程ID（如果有） */
  tripId?: string;
  /** 消息时间 */
  timestamp: string;
  /** 是否正在生成 */
  isGenerating?: boolean;
}

/** 对话会话 */
export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  /** 关联行程ID */
  tripId?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ 美食推荐相关 ============

/** 美食推荐 */
export interface FoodRecommendation {
  id: string;
  /** 餐厅名称 */
  name: string;
  /** 菜系类型 */
  cuisine: string;
  /** 人均消费 */
  avgCost: number;
  /** 评分 1-5 */
  rating: number;
  /** 推荐理由（故事化描述） */
  story: string;
  /** 红黑榜标记 */
  redBlackFlags?: RedBlackFlags;
  /** 位置信息 */
  location: Location;
  /** 推荐菜品 */
  signatureDishes: string[];
  /** 图片URL */
  imageUrl?: string;
}

// ============ 通用类型 ============

/** API 响应格式 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/** 分页参数 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============ 用户评价相关 ============

/** 评价目标类型 */
export type ReviewTargetType = 'scenic' | 'food' | 'trip'

/** 用户评价 */
export interface Review {
  id: string
  targetType: ReviewTargetType
  targetId: string
  targetName: string
  userId: string
  userName: string
  rating: number        // 1-5 星
  content: string       // 评价内容
  images?: string[]     // 图片 URL（预留）
  tags?: string[]       // 标签（如"值得推荐"、"环境一般"）
  likes: number         // 点赞数
  liked: boolean        // 当前用户是否已点赞
  createdAt: string     // ISO 日期字符串
}

/** 评价统计 */
export interface ReviewStats {
  averageRating: number
  totalCount: number
  ratingDistribution: { [key: number]: number }  // 1-5 星各多少条
  tags: { name: string; count: number }[]
}

// ============ 多 LLM 辩论验证相关 ============

/** 多 LLM 辩论验证结果 */
export interface DebateResult {
  /** 参与辩论的模型列表 */
  models: string[]
  /** 各模型的回答摘要 */
  answers: string[]
  /** 担任审核员的模型 */
  debater: string
  /** 综合置信度 0-1 */
  confidence: number
  /** 是否达成共识 */
  consensus: boolean
}

// ============ 目的地推荐相关 ============

/** 旅行风格标签 */
export type TravelStyle = 'food' | 'culture' | 'nature' | 'family' | 'adventure' | 'romantic' | 'budget' | 'luxury'

/** 目的地推荐 */
export interface Destination {
  id: string
  name: string
  province: string
  coverImage: string     // 使用渐变色 CSS 代替真实图片
  description: string
  tags: TravelStyle[]
  bestSeason: string     // 最佳季节（如"3-5月"）
  avgBudget: number      // 人均预算（元/天）
  avgDays: number        // 建议天数
  rating: number         // 综合评分 1-5
  highlights: string[]   // 亮点（3-5个）
  foodScore: number      // 美食评分 1-5
  scenicScore: number    // 景色评分 1-5
  cultureScore: number   // 文化评分 1-5
  transportScore: number // 交通评分 1-5
  costScore: number      // 性价比评分 1-5
}
