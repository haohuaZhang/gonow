/**
 * 行程与对话状态管理 Store
 * 使用 Zustand 管理全局的对话消息、行程数据和生成状态
 * 通过 persist 中间件自动将关键状态持久化到 localStorage
 */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Activity, ChatMessage, DebateResult, Trip } from '@/types'
import { createProtectedStateStorage } from '@/lib/storage'

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

/** 模拟 AI 回复内容 */
function getMockAIReply(userContent: string): string {
  const lower = userContent.toLowerCase()

  if (lower.includes('日本') || lower.includes('东京') || lower.includes('大阪')) {
    return '日本是个很棒的旅行目的地！我为你推荐以下行程安排：\n\n**Day 1 - 东京探索**\n- 上午：浅草寺、雷门\n- 下午：秋叶原、银座购物\n- 晚上：涩谷十字路口、新宿歌舞伎町\n\n**Day 2 - 文化体验**\n- 上午：明治神宫、原宿\n- 下午：上野公园、博物馆\n- 晚上：东京塔夜景\n\n需要我帮你细化每天的行程，或者调整预算吗？'
  }

  if (lower.includes('泰国') || lower.includes('曼谷') || lower.includes('清迈')) {
    return '泰国之旅听起来很棒！这是我的推荐方案：\n\n**Day 1 - 曼谷经典**\n- 大皇宫、玉佛寺\n- 卧佛寺泰式按摩\n- 考山路夜市\n\n**Day 2 - 美食之旅**\n- 水上市场早餐\n- 暹罗商圈购物\n- 唐人街美食探索\n\n需要我帮你安排住宿和交通吗？'
  }

  if (lower.includes('预算') || lower.includes('花费') || lower.includes('费用')) {
    return '关于预算规划，我有以下建议：\n\n1. **住宿**：建议占总预算的 30-40%\n2. **餐饮**：建议占总预算的 20-30%\n3. **交通**：建议占总预算的 15-20%\n4. **景点门票**：建议占总预算的 10-15%\n5. **购物及其他**：预留 10% 弹性空间\n\n你可以告诉我你的总预算和目的地，我来帮你做更详细的分配。'
  }

  return '收到你的旅行需求！让我来帮你规划一下。\n\n为了给你更好的建议，你可以告诉我：\n- 你想去哪里？\n- 计划玩几天？\n- 大概的预算是多少？\n- 有什么特别的偏好？（美食、文化、冒险等）\n\n我会根据你的需求生成一份完整的行程方案。'
}

/** AI 回复后的建议追问 */
function getSuggestions(userContent: string): string[] {
  const lower = userContent.toLowerCase()

  if (lower.includes('日本') || lower.includes('东京')) {
    return ['帮我安排住宿', '推荐当地美食', '预算控制在5000以内', '增加京都行程']
  }
  if (lower.includes('泰国') || lower.includes('曼谷')) {
    return ['推荐当地美食', '安排交通方案', '增加清迈行程', '预算控制在3000以内']
  }
  if (lower.includes('预算') || lower.includes('花费')) {
    return ['推荐经济型住宿', '如何省钱', '帮我规划5天行程', '推荐自由行还是跟团']
  }

  return ['推荐去日本旅行', '推荐去泰国旅行', '帮我规划5天行程', '预算控制在5000以内']
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
            const res = await fetch('/api/debate', {
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

            const aiContent = getMockAIReply(trimmedContent)
            const aiMsg: ChatMessage = {
              id: generateId(),
              role: 'assistant',
              content: aiContent,
              timestamp: now(),
            }

            set((state) => ({
              messages: [...state.messages, aiMsg],
              isGenerating: false,
              suggestions: getSuggestions(trimmedContent),
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

/** 导出建议追问获取函数，供组件使用 */
export { getSuggestions }
