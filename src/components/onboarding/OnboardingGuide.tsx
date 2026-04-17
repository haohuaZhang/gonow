import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

/** localStorage 存储键 */
const ONBOARDING_DONE_KEY = 'gonow-onboarding-done'

/** 引导步骤总数 */
const TOTAL_STEPS = 4

/**
 * 新手引导组件
 * 首次访问时显示 4 步引导流程，完成后通过 localStorage 记录不再显示
 * 品牌色：珊瑚橙 #FF6B35
 */
export default function OnboardingGuide() {
  const [currentStep, setCurrentStep] = useState(0)
  const [visible, setVisible] = useState(false)

  // 检查是否已完成引导
  useEffect(() => {
    const done = localStorage.getItem(ONBOARDING_DONE_KEY)
    if (!done) {
      setVisible(true)
    }
  }, [])

  /** 完成引导，标记 localStorage */
  const finishOnboarding = () => {
    localStorage.setItem(ONBOARDING_DONE_KEY, 'true')
    setVisible(false)
  }

  /** 下一步 */
  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      finishOnboarding()
    }
  }

  /** 跳过引导 */
  const handleSkip = () => {
    finishOnboarding()
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #FFF0EB 0%, #FFE8D6 50%, #FFF5F0 100%)',
      }}
    >
      {/* 跳过按钮 */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 text-sm hover:opacity-70 transition-opacity z-10"
        style={{ color: 'var(--gonow-text-muted)' }}
      >
        跳过
      </button>

      {/* 引导卡片 */}
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 text-center animate-in fade-in zoom-in-95 duration-300">
        {currentStep === 0 && <WelcomeStep />}
        {currentStep === 1 && <ChatGuideStep />}
        {currentStep === 2 && <FeatureStep />}
        {currentStep === 3 && <StartStep />}

        {/* 步骤指示器 */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={`block rounded-full transition-all duration-300 ${
                i === currentStep
                  ? 'w-6 h-2'
                  : 'w-2 h-2'
              }`}
              style={{
                backgroundColor: i === currentStep ? 'var(--gonow-primary)' : '#E5E7EB',
              }}
            />
          ))}
        </div>

        {/* 操作按钮 */}
        <div className="mt-6">
          <Button
            onClick={handleNext}
            className="w-full h-11 text-base font-semibold rounded-xl text-white border-none"
            style={{
              background: 'linear-gradient(135deg, #FF6B35, #FF8F65)',
            }}
          >
            {currentStep === TOTAL_STEPS - 1 ? '开始使用' : '下一步'}
          </Button>
        </div>
      </div>
    </div>
  )
}

/** Step 1: 欢迎页 */
function WelcomeStep() {
  return (
    <div className="space-y-4">
      {/* Logo */}
      <div
        className="mx-auto w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8F65)' }}
      >
        <span className="text-white text-3xl font-bold">G</span>
      </div>

      <h2 className="text-2xl font-bold" style={{ color: 'var(--gonow-text)' }}>
        欢迎使用 GoNow
      </h2>
      <p className="text-base" style={{ color: 'var(--gonow-text-secondary)' }}>
        AI 帮你规划完美旅行
      </p>

      {/* 3 个核心卖点 */}
      <div className="flex justify-center gap-6 pt-2">
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFF0EB' }}>
            <svg className="w-6 h-6" style={{ color: 'var(--gonow-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <span className="text-xs" style={{ color: 'var(--gonow-text-secondary)' }}>智能规划</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8FBF5' }}>
            <svg className="w-6 h-6" style={{ color: '#06D6A0' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <span className="text-xs" style={{ color: 'var(--gonow-text-secondary)' }}>真实评价</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFF8E1' }}>
            <svg className="w-6 h-6" style={{ color: '#FFD166' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xs" style={{ color: 'var(--gonow-text-secondary)' }}>省钱省心</span>
        </div>
      </div>
    </div>
  )
}

/** Step 2: 对话引导 */
function ChatGuideStep() {
  return (
    <div className="space-y-4">
      <div
        className="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'var(--gonow-primary-light)' }}
      >
        <svg className="w-8 h-8" style={{ color: 'var(--gonow-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold" style={{ color: 'var(--gonow-text)' }}>
        告诉我你想去哪里
      </h2>
      <p className="text-base" style={{ color: 'var(--gonow-text-secondary)' }}>
        AI 会根据你的需求生成专属行程
      </p>

      {/* 对话界面截图占位 */}
      <div className="rounded-xl p-4 space-y-3 text-left" style={{ backgroundColor: '#FAFAF8' }}>
        <div className="flex gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8F65)' }}
          >
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 text-sm shadow-sm" style={{ color: 'var(--gonow-text)' }}>
            你好！我是 GoNow 旅行助手，告诉我你想去哪里旅行？
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <div
            className="text-white rounded-lg rounded-tr-none px-3 py-2 text-sm"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8F65)' }}
          >
            我想下周去成都玩 3 天
          </div>
        </div>
        <div className="flex gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8F65)' }}
          >
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 text-sm shadow-sm" style={{ color: 'var(--gonow-text)' }}>
            好的！正在为你规划成都 3 日游...
          </div>
        </div>
      </div>
    </div>
  )
}

/** Step 3: 功能介绍 */
function FeatureStep() {
  const features = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: '#FF6B35',
      bg: '#FFF0EB',
      title: '红黑榜验证',
      desc: '多源真实评价，避免踩坑',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: '#06D6A0',
      bg: '#E8FBF5',
      title: '故事化美食',
      desc: '每道菜背后都有故事',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: '#4ECDC4',
      bg: '#E8F8F7',
      title: '多方案对比',
      desc: '不同风格行程一键对比',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: '#FFD166',
      bg: '#FFF8E1',
      title: '行程编辑',
      desc: '自由拖拽调整，随心定制',
    },
  ]

  return (
    <div className="space-y-4">
      <div
        className="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'var(--gonow-primary-light)' }}
      >
        <svg className="w-8 h-8" style={{ color: 'var(--gonow-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold" style={{ color: 'var(--gonow-text)' }}>
        强大的功能
      </h2>
      <p className="text-base" style={{ color: 'var(--gonow-text-secondary)' }}>
        为你的旅行保驾护航
      </p>

      {/* 功能亮点列表 */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {features.map((f) => (
          <div
            key={f.title}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl"
            style={{ backgroundColor: '#FAFAF8' }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: f.bg, color: f.color }}
            >
              {f.icon}
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--gonow-text)' }}>{f.title}</span>
            <span className="text-xs" style={{ color: 'var(--gonow-text-muted)' }}>{f.desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Step 4: 开始使用 */
function StartStep() {
  return (
    <div className="space-y-4">
      <div
        className="mx-auto w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8F65)' }}
      >
        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold" style={{ color: 'var(--gonow-text)' }}>
        准备好了吗？
      </h2>
      <p className="text-base" style={{ color: 'var(--gonow-text-secondary)' }}>
        开始规划你的第一次旅行
      </p>

      {/* 装饰元素 */}
      <div className="flex justify-center gap-3 pt-2">
        <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#FFF0EB', color: 'var(--gonow-primary)' }}>成都</span>
        <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#E8FBF5', color: '#06D6A0' }}>杭州</span>
        <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#E8F8F7', color: '#4ECDC4' }}>大理</span>
        <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#FFF8E1', color: '#E5A800' }}>西安</span>
      </div>
    </div>
  )
}
