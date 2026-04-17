/**
 * AI 对话面板组件
 * 包含消息列表、输入框、欢迎消息、加载动画和建议追问
 * 移动端友好设计（375px 宽度可用）
 *
 * 设计优化：
 * - 用户消息：珊瑚橙渐变背景 + 白色文字
 * - AI 消息：白色卡片 + 左侧品牌色竖线装饰
 * - 输入框：更大尺寸 + 品牌色发送按钮
 * - 欢迎消息：品牌色装饰 + 卡片式示例问题
 */
import { useState, useRef, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useTripStore } from '@/stores/tripStore'
import type { ChatMessage, DebateResult } from '@/types'

/** 示例问题（欢迎页展示） */
const exampleQuestions = [
  { text: '帮我规划一个5天的日本东京之旅', icon: '🇯🇵' },
  { text: '推荐一个3天的泰国曼谷行程', icon: '🇹🇭' },
  { text: '预算5000元，去哪里玩比较好？', icon: '💰' },
  { text: '我想去海边度假，有什么推荐？', icon: '🏖️' },
]

/** 欢迎消息组件 - 品牌化设计 */
function WelcomeMessage({ onSelect }: { onSelect: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center gap-8 py-10 px-4">
      {/* Logo 和欢迎语 */}
      <div className="flex flex-col items-center gap-3 animate-fade-in-up">
        {/* 品牌色圆形 Logo */}
        <div
          className="flex items-center justify-center w-20 h-20 rounded-full text-white font-bold text-3xl shadow-lg"
          style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8F65)' }}
        >
          G
        </div>
        <h2
          className="text-2xl font-extrabold"
          style={{ color: 'var(--gonow-text)' }}
        >
          你好，我是 GoNow AI
        </h2>
        <p
          className="text-sm text-center max-w-xs leading-relaxed"
          style={{ color: 'var(--gonow-text-secondary)' }}
        >
          告诉我你的旅行需求，我会帮你规划完美的行程方案
        </p>
      </div>

      {/* 品牌色装饰线 */}
      <div
        className="w-12 h-1 rounded-full animate-fade-in-up stagger-1"
        style={{ background: 'linear-gradient(90deg, #FF6B35, #FFD166)' }}
      />

      {/* 示例问题 - 卡片样式 */}
      <div className="flex flex-col gap-3 w-full max-w-sm animate-fade-in-up stagger-2">
        <p
          className="text-xs text-center"
          style={{ color: 'var(--gonow-text-muted)' }}
        >
          试试这些问题：
        </p>
        {exampleQuestions.map((q) => (
          <button
            key={q.text}
            onClick={() => onSelect(q.text)}
            className="text-left text-sm px-4 py-3.5 rounded-2xl transition-all duration-200 flex items-center gap-3 group"
            style={{
              background: 'var(--gonow-card)',
              boxShadow: 'var(--gonow-shadow-sm)',
              color: 'var(--gonow-text)',
              border: '1px solid rgba(0,0,0,0.04)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = 'var(--gonow-shadow)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'var(--gonow-shadow-sm)'
            }}
          >
            <span className="text-xl shrink-0">{q.icon}</span>
            <span className="leading-relaxed">{q.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/** 加载动画 - 品牌色跳动点 */
function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div
        className="flex items-center gap-1.5 rounded-2xl px-4 py-3"
        style={{ backgroundColor: 'var(--gonow-primary-light)' }}
      >
        <span className="text-xs mr-1" style={{ color: 'var(--gonow-primary)' }}>
          正在思考
        </span>
        <span
          className="inline-block w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0ms]"
          style={{ backgroundColor: 'var(--gonow-primary)' }}
        />
        <span
          className="inline-block w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:150ms]"
          style={{ backgroundColor: 'var(--gonow-primary)' }}
        />
        <span
          className="inline-block w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:300ms]"
          style={{ backgroundColor: 'var(--gonow-primary)' }}
        />
      </div>
    </div>
  )
}

/** 单条消息气泡 - 品牌色设计 */
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-4 py-1.5`}>
      <div
        className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
          isUser ? 'message-user' : 'message-ai'
        }`}
      >
        {/* 简单的 Markdown 粗体渲染 */}
        {message.content.split('\n').map((line, i) => (
          <p key={i} className={line === '' ? 'h-2' : ''}>
            {renderInlineBold(line)}
          </p>
        ))}
      </div>
    </div>
  )
}

/** 渲染行内粗体文本 */
function renderInlineBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <span key={i}>{part}</span>
  })
}

/** 建议追问组件 - 品牌色标签 */
function SuggestionChips({ onSelect }: { onSelect: (q: string) => void }) {
  const suggestions = useTripStore((s) => s.suggestions)

  if (suggestions.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 px-4 py-2">
      {suggestions.map((s) => (
        <Badge
          key={s}
          variant="outline"
          className="cursor-pointer text-xs py-1.5 px-3 rounded-full transition-all duration-200 hover:shadow-sm"
          style={{
            borderColor: 'var(--gonow-primary)',
            color: 'var(--gonow-primary)',
            backgroundColor: 'var(--gonow-primary-light)',
          }}
          onClick={() => onSelect(s)}
        >
          {s}
        </Badge>
      ))}
    </div>
  )
}

/** 多模型辩论验证标签组件 */
function DebateVerificationBadge({ debate }: { debate: DebateResult }) {
  const [expanded, setExpanded] = useState(false)

  if (!debate) return null

  const confidencePercent = Math.round(debate.confidence * 100)

  return (
    <div className="px-4 py-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left rounded-xl px-3 py-2.5 transition-all duration-200"
        style={{
          backgroundColor: 'var(--gonow-primary-light)',
          border: '1px solid rgba(255, 107, 53, 0.15)',
        }}
      >
        {/* 主标签行 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* 多模型图标 */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--gonow-primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span
              className="text-xs font-semibold"
              style={{ color: 'var(--gonow-primary)' }}
            >
              多模型验证
            </span>
            <span
              className="text-xs"
              style={{ color: 'var(--gonow-text-secondary)' }}
            >
              {debate.models.length} 个模型参与
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* 共识状态 */}
            <span className="text-xs">
              {debate.consensus ? (
                <span style={{ color: '#16a34a' }}>&#10003; 共识</span>
              ) : (
                <span style={{ color: '#d97706' }}>&#9888; 存在分歧</span>
              )}
            </span>

            {/* 置信度进度条 */}
            <div className="flex items-center gap-1.5">
              <div
                className="w-12 h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: 'rgba(255, 107, 53, 0.15)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${confidencePercent}%`,
                    backgroundColor: confidencePercent >= 70 ? '#16a34a' : confidencePercent >= 50 ? '#d97706' : '#dc2626',
                  }}
                />
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: 'var(--gonow-text-secondary)' }}
              >
                {confidencePercent}%
              </span>
            </div>

            {/* 展开/收起箭头 */}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--gonow-text-muted)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* 展开详情 */}
        {expanded && (
          <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(255, 107, 53, 0.1)' }}>
            {debate.models.map((model, i) => (
              <div key={model} className="mb-2 last:mb-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--gonow-primary)' }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: 'var(--gonow-text)' }}
                  >
                    {model}
                  </span>
                  {model === debate.debater && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: 'rgba(255, 107, 53, 0.1)',
                        color: 'var(--gonow-primary)',
                        fontSize: '10px',
                      }}
                    >
                      审核员
                    </span>
                  )}
                </div>
                <p
                  className="text-xs leading-relaxed pl-3"
                  style={{ color: 'var(--gonow-text-secondary)' }}
                >
                  {debate.answers[i] || '无回答'}
                </p>
              </div>
            ))}
          </div>
        )}
      </button>
    </div>
  )
}

/** AI 对话面板主组件 */
export default function ChatPanel() {
  const messages = useTripStore((s) => s.messages)
  const isGenerating = useTripStore((s) => s.isGenerating)
  const currentTrip = useTripStore((s) => s.currentTrip)
  const debateResult = useTripStore((s) => s.debateResult)
  const sendMessage = useTripStore((s) => s.sendMessage)
  const navigate = useNavigate()

  const [inputValue, setInputValue] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 消息列表变化时自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }, [messages, isGenerating])

  /** 提交消息 */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const content = inputValue.trim()
    if (!content || isGenerating) return

    sendMessage(content)
    setInputValue('')
  }

  /** 选择示例问题或建议追问 */
  const handleSelectQuestion = (q: string) => {
    if (isGenerating) return
    sendMessage(q)
  }

  const hasMessages = messages.length > 0

  return (
    <div
      className="flex flex-col h-full max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-10rem)] overflow-hidden"
      style={{
        background: 'var(--gonow-card)',
        borderRadius: 'var(--gonow-radius)',
        boxShadow: 'var(--gonow-shadow)',
        border: 'none',
      }}
    >
      {/* 消息列表区域 */}
      <ScrollArea ref={scrollRef} className="flex-1 min-h-0">
        {!hasMessages ? (
          <WelcomeMessage onSelect={handleSelectQuestion} />
        ) : (
          <div className="py-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isGenerating && <ThinkingDots />}
            {/* AI 回复后显示辩论验证标签 */}
            {!isGenerating && debateResult && messages[messages.length - 1]?.role === 'assistant' && (
              <DebateVerificationBadge debate={debateResult} />
            )}
            {/* AI 回复后显示建议追问 */}
            {!isGenerating && messages[messages.length - 1]?.role === 'assistant' && (
              <SuggestionChips onSelect={handleSelectQuestion} />
            )}
            {/* AI 回复后，如果有 currentTrip，显示查看行程按钮 */}
            {!isGenerating && currentTrip && messages[messages.length - 1]?.role === 'assistant' && (
              <div className="px-4 py-2">
                <Button
                  onClick={() => navigate('/trip')}
                  variant="outline"
                  className="w-full rounded-2xl h-11 font-semibold"
                  style={{
                    borderColor: 'var(--gonow-primary)',
                    color: 'var(--gonow-primary)',
                    backgroundColor: 'var(--gonow-primary-light)',
                  }}
                >
                  ✈️ 查看完整行程
                </Button>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* 输入框区域 - 固定在底部，品牌色设计 */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-3"
        style={{
          borderTop: '1px solid rgba(0,0,0,0.06)',
          background: 'var(--gonow-card)',
        }}
      >
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="输入你的旅行需求..."
          disabled={isGenerating}
          maxLength={500}
          className="flex-1 text-sm rounded-2xl"
          style={{
            minHeight: '48px',
            height: '48px',
            border: '1px solid rgba(0,0,0,0.08)',
            backgroundColor: 'var(--gonow-bg)',
          }}
          onKeyDown={(e) => {
            // 仅在非 Shift+Enter 时提交，避免与 onSubmit 重复触发
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              e.stopPropagation()
              // 直接调用提交逻辑，避免通过 handleSubmit 触发表单重复提交
              const content = inputValue.trim()
              if (content && !isGenerating) {
                sendMessage(content)
                setInputValue('')
              }
            }
          }}
        />
        <Button
          type="submit"
          disabled={!inputValue.trim() || isGenerating}
          className="h-12 px-5 rounded-2xl shrink-0 font-semibold"
          style={{
            background: 'linear-gradient(135deg, #FF6B35, #FF8F65)',
            border: 'none',
            color: 'white',
          }}
        >
          {/* 发送图标 */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 2 11 13" />
            <path d="M22 2 15 22 11 13 2 9z" />
          </svg>
          <span className="sr-only">发送</span>
        </Button>
      </form>
    </div>
  )
}
