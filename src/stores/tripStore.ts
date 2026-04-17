/**
 * 行程与对话状态管理 Store
 * 使用 Zustand 管理全局的对话消息、行程数据和生成状态
 * 通过 persist 中间件自动将关键状态持久化到 localStorage
 */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Activity, ChatMessage, DebateResult, Trip } from '@/types'
import { createProtectedStateStorage } from '@/lib/storage'
import { mockTrip } from '@/lib/mock-data'

/** Store 状态接口 */
interface TripStore {
  // 对话相关
  messages: ChatMessage[]
  sessionId: string | null
  isGenerating: boolean

  // 行程相关
  currentTrip: Trip | null

  // 建议追问列表
  suggestions: string[]

  // 多 LLM 辩论验证结果
  debateResult: DebateResult | null

  // 操作方法
  /** 发送用户消息（调用 API，失败时降级到本地 Mock） */
  sendMessage: (content: string) => void
  /** 设置 AI 生成状态 */
  setGenerating: (v: boolean) => void
  /** 设置当前行程 */
  setTrip: (trip: Trip) => void
  /** 添加一条消息 */
  addMessage: (msg: ChatMessage) => void
  /** 清空所有消息 */
  clearMessages: () => void

  // 行程编辑方法
  /** 替换指定天中的某个活动 */
  replaceActivity: (dayIndex: number, activityId: string, newActivity: Activity) => void
  /** 删除指定天中的某个活动，并重新计算该天总花费 */
  removeActivity: (dayIndex: number, activityId: string) => void
}

/** 生成唯一 ID（兼容非 HTTPS 环境） */
function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9)
}

/** 获取当前时间 ISO 字符串 */
function now(): string {
  return new Date().toISOString()
}

/** 城市描述映射 */
const CITY_DESCRIPTIONS: Record<string, string> = {
  '汕头': '潮汕美食之都，牛肉火锅、卤鹅、肠粉...吃货的天堂！',
  '潮州': '潮州古城，广济桥、牌坊街、工夫茶文化！',
  '揭阳': '揭阳古邑，进贤门、揭阳楼、潮汕文化发源地！',
  '成都': '天府之国，火锅、熊猫、宽窄巷子，巴适得很！',
  '杭州': '人间天堂，西湖美景、龙井茶香、丝绸之府！',
  '重庆': '山城重庆，火锅之都、洪崖洞、穿楼轻轨！',
  '西安': '十三朝古都，兵马俑、回民街、大唐不夜城！',
  '厦门': '海上花园，鼓浪屿、沙茶面、文艺小清新的好去处！',
  '长沙': '星城长沙，臭豆腐、茶颜悦色、橘子洲头！',
  '广州': '花城广州，早茶文化、粤式美食、珠江夜景！',
  '深圳': '创新之城，世界之窗、欢乐谷、海滨风光！',
  '北京': '首都北京，故宫长城、胡同文化、烤鸭飘香！',
  '上海': '魔都上海，外滩夜景、东方明珠、海派文化！',
  '三亚': '东方夏威夷，碧海蓝天、椰林沙滩、热带天堂！',
  '丽江': '艳遇之城，古城韵味、玉龙雪山、纳西风情！',
  '桂林': '山水甲天下，漓江竹筏、阳朔西街、龙脊梯田！',
  '青岛': '帆船之都，红瓦绿树、碧海蓝天、啤酒飘香！',
  '大理': '风花雪月，苍山洱海、古城漫步、白族风情！',
  '苏州': '上有天堂下有苏杭，园林之城、昆曲评弹、江南水乡！',
  '南京': '六朝古都，中山陵、夫子庙、秦淮河畔！',
  '武汉': '江城武汉，热干面、黄鹤楼、东湖樱花！',
  '昆明': '春城昆明，四季如春、石林奇观、鲜花之城！',
  '贵阳': '避暑之都，酸汤鱼、甲秀楼、黄果树瀑布！',
  '拉萨': '日光之城，布达拉宫、大昭寺、藏式风情！',
  '哈尔滨': '冰城哈尔滨，冰雪大世界、中央大街、欧式建筑！',
  '东京': '日本首都，动漫天堂、美食圣地、购物天堂！',
  '首尔': '韩流之都，景福宫、明洞、韩式烤肉！',
  '曼谷': '天使之城，大皇宫、水上市场、泰式按摩！',
  '巴黎': '浪漫之都，埃菲尔铁塔、卢浮宫、塞纳河畔！',
  '伦敦': '雾都伦敦，大本钟、白金汉宫、大英博物馆！',
  '纽约': '不夜城，自由女神、时代广场、百老汇！',
}

/** 地区别名映射 */
const REGION_ALIASES: Record<string, string> = {
  '潮汕': '汕头',
  '长三角': '杭州',
  '珠三角': '广州',
  '京津冀': '北京',
  '闽南': '厦门',
  '胶东': '青岛',
  '川西': '成都',
}

/** 城市列表（用于识别） */
const CITY_LIST = Object.keys(CITY_DESCRIPTIONS)

/** 识别用户输入中的城市/地区 */
function detectCity(text: string): string | null {
  // 先检查地区别名
  for (const [alias, city] of Object.entries(REGION_ALIASES)) {
    if (text.includes(alias)) return city
  }
  // 再检查城市名
  for (const city of CITY_LIST) {
    if (text.includes(city)) return city
  }
  return null
}

/** 识别用户输入中的日期/时长信息 */
function detectDateInfo(text: string): boolean {
  const patterns = [
    /周末/, /\d+天/, /\d+日/, /\d+晚/,
    /五一/, /国庆/, /春节/, /清明/, /端午/, /中秋/,
    /\d+月\d+日/, /\d+月/, /假期/, /休假/,
  ]
  return patterns.some((p) => p.test(text))
}

/** 识别用户输入中的人数信息 */
function detectPeopleInfo(text: string): boolean {
  const patterns = [
    /\d+[个人]/, /一个人/, /情侣/, /老婆/, /老公/, /夫妻/,
    /家庭/, /朋友/, /亲子/, /带娃/, /全家/, /俩人/,
  ]
  return patterns.some((p) => p.test(text))
}

/** 识别用户输入中的预算信息 */
function detectBudgetInfo(text: string): boolean {
  const patterns = [
    /\d+千/, /\d+万/, /\d+块/, /预算/, /花费/, /费用/, /花多少/,
    /多少钱/, /大概.*元/,
  ]
  return patterns.some((p) => p.test(text))
}

/** 智能推荐目的地（当用户没有指定目的地时） */
function recommendDestinations(text: string): string[] {
  // 根据关键词推荐
  if (text.includes('美食') || text.includes('吃') || text.includes('吃货')) {
    return [
      '汕头 - 潮汕美食之都，牛肉火锅、卤鹅、肠粉，人均50吃到撑',
      '成都 - 火锅、串串、小吃一条街，巴适得很',
      '广州 - 早茶文化、粤式美食、珠江夜景',
    ]
  }
  if (text.includes('海') || text.includes('沙滩') || text.includes('海边') || text.includes('度假')) {
    return [
      '三亚 - 东方夏威夷，碧海蓝天、椰林沙滩',
      '厦门 - 海上花园，鼓浪屿、文艺小清新',
      '青岛 - 帆船之都，红瓦绿树、碧海蓝天',
    ]
  }
  if (text.includes('文化') || text.includes('历史') || text.includes('古城') || text.includes('古都')) {
    return [
      '西安 - 十三朝古都，兵马俑、大唐不夜城',
      '南京 - 六朝古都，中山陵、秦淮河畔',
      '北京 - 故宫长城、胡同文化、烤鸭飘香',
    ]
  }
  if (text.includes('情侣') || text.includes('浪漫') || text.includes('约会')) {
    return [
      '丽江 - 古城韵味、玉龙雪山、纳西风情',
      '大理 - 风花雪月、苍山洱海、白族风情',
      '厦门 - 海上花园、文艺小清新、鼓浪屿',
    ]
  }
  // 默认推荐
  return [
    '汕头 - 潮汕美食之都，吃货必去',
    '成都 - 天府之国，火锅熊猫巴适得很',
    '三亚 - 东方夏威夷，碧海蓝天度假胜地',
  ]
}

/** 统一 Mock AI 回复函数，返回回复内容、建议追问和行程数据 */
function getMockAIResult(userContent: string): { reply: string; suggestions: string[]; tripData: Trip | null } {
  const city = detectCity(userContent)
  const hasDate = detectDateInfo(userContent)
  const hasPeople = detectPeopleInfo(userContent)
  const hasBudget = detectBudgetInfo(userContent)

  // 场景 a：完整信息（目的地 + 日期 + 人数）→ 生成行程概要
  if (city && hasDate && hasPeople) {
    const reply = `太好了！我已经为你收集到足够的信息，正在为你生成${city}的专属行程...

✅ 行程已生成！你可以查看详细的每日安排，包括：
• 精选景点和活动推荐
• 当地特色美食探店
• 红黑榜避坑指南
• 费用预算参考

如果需要调整，随时告诉我！`

    const suggestions = [
      `${city}有什么必去的地方？`,
      `帮我调整行程安排`,
      `推荐${city}的住宿`,
      `${city}有什么特色美食？`,
    ]

    const tripData: Trip = {
      ...mockTrip,
      id: generateId(),
      destination: city,
      description: `${city}旅行行程`,
      createdAt: now(),
      updatedAt: now(),
    }

    return { reply, suggestions, tripData }
  }

  // 场景 b：有目的地但缺信息 → 确认目的地 + 问缺失信息
  if (city) {
    const cityDesc = CITY_DESCRIPTIONS[city] || `${city}是个很棒的选择！`
    const missing: string[] = []
    if (!hasDate) missing.push('• 计划什么时候去？玩几天？')
    if (!hasPeople) missing.push('• 一共几个人去？')
    if (!hasBudget) missing.push('• 大概的预算是多少？')

    const reply = `好的！${city}是个很棒的选择！${cityDesc}

为了给你规划最合适的行程，我还需要了解：
${missing.join('\n')}

你可以一次性告诉我，也可以慢慢聊～`

    const suggestions = [
      `${city}2天1夜，2个人，预算2000`,
      `五一去${city}，3个人，喜欢美食`,
      `${city}有什么必去的地方？`,
      `帮我调整行程安排`,
    ]

    return { reply, suggestions, tripData: null }
  }

  // 场景 c：只有偏好没有目的地 → 推荐目的地
  if (hasDate || hasPeople || hasBudget || userContent.length > 2) {
    const destinations = recommendDestinations(userContent)
    const reply = `根据你的偏好，我为你推荐以下目的地：
${destinations.map((d) => `• ${d}`).join('\n')}

你对哪个感兴趣？告诉我，我帮你详细规划！`

    const suggestions = [
      '我想去汕头玩2天',
      '五一假期有什么推荐？',
      '推荐一个适合情侣的周末旅行',
      '两个人去成都大概要花多少钱？',
    ]

    return { reply, suggestions, tripData: null }
  }

  // 场景 d：完全无法理解 → 通用引导
  const reply = `我理解你的意思！不过为了给你更好的推荐，你可以试试这样告诉我：
• "我想去 [城市] 玩 [几天]"
• "[城市] [几月] 去，[几] 个人"
• "帮我规划一个 [城市] 的 [天数] 日游"

当然，你也可以直接问我任何旅行相关的问题！`

  const suggestions = [
    '我想去汕头玩2天',
    '五一假期有什么推荐？',
    '推荐一个适合情侣的周末旅行',
    '两个人去成都大概要花多少钱？',
  ]

  return { reply, suggestions, tripData: null }
}

export const useTripStore = create<TripStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      messages: [],
      sessionId: null,
      isGenerating: false,
      currentTrip: null,
      suggestions: [],
      debateResult: null,

      /** 发送用户消息，调用 API，失败时降级到本地 Mock */
      sendMessage: (content: string) => {
        // 空消息校验（Store 层防御）
        const trimmed = content.trim()
        if (!trimmed) return

        // 截断超过 500 字符的消息
        const trimmedContent = trimmed.length > 500 ? trimmed.slice(0, 500) : trimmed

        const userMsg: ChatMessage = {
          id: generateId(),
          role: 'user',
          content: trimmedContent,
          timestamp: now(),
        }

        // 设置 session ID（首次对话时）
        const sessionId = get().sessionId ?? generateId()

        set((state) => ({
          messages: [...state.messages, userMsg],
          sessionId,
          isGenerating: true,
          suggestions: [],
          debateResult: null,
        }))

        // 异步调用 API，优先 /api/debate，失败时降级到 /api/chat，再失败降级到本地 Mock
        const doSend = async () => {
          let timeoutId: ReturnType<typeof setTimeout> | null = null
          try {
            // 添加 15 秒超时控制（辩论系统需要更长时间）
            const controller = new AbortController()
            timeoutId = setTimeout(() => controller.abort(), 15000)

            // 优先调用辩论 API
            const res = await fetch('/.netlify/functions/debate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: trimmedContent, sessionId: get().sessionId }),
              signal: controller.signal,
            })

            if (timeoutId) { clearTimeout(timeoutId); timeoutId = null }

            if (!res.ok) {
              throw new Error(`API 请求失败: ${res.status}`)
            }

            const json = await res.json()

            if (json.success && json.data) {
              const aiMsg: ChatMessage = {
                id: generateId(),
                role: 'assistant',
                content: json.data.reply || '',
                timestamp: now(),
              }

              set((state) => ({
                messages: [...state.messages, aiMsg],
                isGenerating: false,
                // 如果 API 返回了 sessionId，更新它
                sessionId: json.data.sessionId || state.sessionId,
                // 如果 API 返回了建议追问，存储到 store
                suggestions: json.data.suggestions || [],
                // 如果 API 返回了行程数据，设置 currentTrip
                currentTrip: json.data.tripData || state.currentTrip,
                // 如果 API 返回了辩论结果，存储到 store
                debateResult: json.data.debate || null,
              }))
              return
            }

            // API 返回了非成功状态，降级到 Mock
            throw new Error('API 返回数据格式异常')
          } catch {
            // 确保清理超时定时器
            if (timeoutId) { clearTimeout(timeoutId); timeoutId = null }

            // 降级到本地 Mock 回复（1.5-2.5 秒延迟，让用户看到思考动画）
            const delay = 1500 + Math.random() * 1000
            await new Promise((r) => setTimeout(r, delay))

            const mockResult = getMockAIResult(trimmedContent)
            const aiMsg: ChatMessage = {
              id: generateId(),
              role: 'assistant',
              content: mockResult.reply,
              timestamp: now(),
            }

            set((state) => ({
              messages: [...state.messages, aiMsg],
              isGenerating: false,
              suggestions: mockResult.suggestions,
              currentTrip: mockResult.tripData || state.currentTrip,
              debateResult: null,
            }))
          }
        }

        doSend()
      },

      /** 设置生成状态 */
      setGenerating: (v: boolean) => {
        set({ isGenerating: v })
      },

      /** 设置当前行程 */
      setTrip: (trip: Trip) => {
        set({ currentTrip: trip })
      },

      /** 添加一条消息 */
      addMessage: (msg: ChatMessage) => {
        set((state) => ({
          messages: [...state.messages, msg],
        }))
      },

      /** 清空所有消息 */
      clearMessages: () => {
        set({ messages: [], sessionId: null, suggestions: [], currentTrip: null, debateResult: null })
      },

      /** 替换指定天中的某个活动，并重新计算该天总花费 */
      replaceActivity: (dayIndex: number, activityId: string, newActivity: Activity) => {
        const { currentTrip } = get()
        if (!currentTrip) return

        // 深拷贝行程数据
        const updatedTrip = JSON.parse(JSON.stringify(currentTrip)) as Trip
        const day = updatedTrip.days[dayIndex]
        if (!day) return

        // 找到并替换活动
        const actIdx = day.activities.findIndex((a) => a.id === activityId)
        if (actIdx === -1) return

        day.activities[actIdx] = newActivity

        // 重新计算该天总花费
        day.totalCost = day.activities.reduce((sum, a) => sum + a.cost, 0)

        set({ currentTrip: updatedTrip })
      },

      /** 删除指定天中的某个活动，并重新计算该天总花费 */
      removeActivity: (dayIndex: number, activityId: string) => {
        const { currentTrip } = get()
        if (!currentTrip) return

        // 深拷贝行程数据
        const updatedTrip = JSON.parse(JSON.stringify(currentTrip)) as Trip
        const day = updatedTrip.days[dayIndex]
        if (!day) return

        // 过滤掉目标活动
        day.activities = day.activities.filter((a) => a.id !== activityId)

        // 重新计算该天总花费
        day.totalCost = day.activities.reduce((sum, a) => sum + a.cost, 0)

        set({ currentTrip: updatedTrip })
      },
    }),
    {
      name: 'gonow-trip-storage', // localStorage 键名
      storage: createJSONStorage(() => createProtectedStateStorage()),
      // 只持久化关键字段，不持久化 isGenerating 等临时状态
      partialize: (state) => ({
        messages: state.messages,
        sessionId: state.sessionId,
        currentTrip: state.currentTrip,
        suggestions: state.suggestions,
        debateResult: state.debateResult,
      }),
    }
  )
)

/** 导出 getMockAIResult 供外部使用（如测试） */
export { getMockAIResult }
