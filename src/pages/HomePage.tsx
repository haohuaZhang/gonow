import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

/**
 * 首页 - 产品介绍 + 核心卖点 + 使用流程 + 数据展示 + CTA
 * 设计风格：旅行感 + 温暖 + 现代感
 * 主色调：珊瑚橙 #FF6B35
 */

/** 核心卖点列表 */
const features = [
  {
    icon: '🛡️',
    title: '红黑榜验证',
    description: '多源交叉验证，标注可信度评分，拒绝虚假推荐',
    color: '#FF6B35',
    bg: '#FFF0EB',
  },
  {
    icon: '📖',
    title: '故事化美食',
    description: '不只是餐厅列表，讲述美食背后的文化故事',
    color: '#06D6A0',
    bg: '#E8FBF5',
  },
  {
    icon: '🗺️',
    title: '多方案对比',
    description: '同一景点提供主流/经济/深度/特殊多种方案',
    color: '#4ECDC4',
    bg: '#E8F8F7',
  },
]

/** 使用流程步骤 */
const steps = [
  {
    icon: '🗣️',
    title: '告诉 AI 你的旅行需求',
    description: '说出目的地、时间、偏好，AI 理解你的一切想法',
  },
  {
    icon: '🤖',
    title: 'AI 智能生成专属行程',
    description: '30 秒内生成包含交通、住宿、美食、景点的完整方案',
  },
  {
    icon: '✏️',
    title: '自由编辑调整行程',
    description: '不满意随时修改，拖拽调整顺序，替换活动',
  },
  {
    icon: '🎒',
    title: '轻松出发享受旅行',
    description: '导出行程，按图索骥，享受完美旅程',
  },
]

/** 数据展示 */
const stats = [
  { value: '12,580+', label: '位旅行者已规划行程' },
  { value: '200+', label: '个城市覆盖' },
  { value: '30', label: '秒平均规划时间' },
]

/** Hero 区域浮动装饰元素 */
const floatingIcons = [
  { emoji: '✈️', top: '15%', left: '8%', className: 'animate-float' },
  { emoji: '🌍', top: '25%', right: '10%', className: 'animate-float-slow' },
  { emoji: '🗺️', bottom: '30%', left: '12%', className: 'animate-float-fast' },
  { emoji: '📸', bottom: '20%', right: '8%', className: 'animate-float' },
  { emoji: '🏖️', top: '40%', left: '5%', className: 'animate-float-slow' },
  { emoji: '🏔️', top: '20%', right: '18%', className: 'animate-float-fast' },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col">
      {/* ==================== Hero 区域 ==================== */}
      <section className="relative overflow-hidden gonow-gradient flex flex-col items-center text-center gap-5 py-16 md:py-24 px-4">
        {/* 光晕装饰 - 增加层次感 */}
        <div className="glow-orb glow-orb-accent" style={{ top: '-20%', right: '-10%', width: '300px', height: '300px', opacity: 0.3 }} />
        <div className="glow-orb glow-orb-primary" style={{ bottom: '-15%', left: '-5%', width: '250px', height: '250px', opacity: 0.25 }} />
        <div className="glow-orb" style={{ top: '30%', left: '50%', width: '200px', height: '200px', background: 'rgba(255,255,255,0.08)', opacity: 0.5 }} />

        {/* 浮动装饰元素 - 仅桌面端显示 */}
        {floatingIcons.map((item, i) => (
          <span
            key={i}
            className={`hidden md:block absolute text-3xl opacity-40 pointer-events-none select-none ${item.className}`}
            style={{ top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
          >
            {item.emoji}
          </span>
        ))}

        {/* 主标题 */}
        <h1
          className="animate-fade-in-up relative z-10 text-white font-extrabold tracking-tight leading-tight"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
        >
          AI 帮你规划
          <br />
          完美旅行
        </h1>

        {/* 副标题 */}
        <p className="animate-fade-in-up stagger-1 relative z-10 text-white/80 max-w-lg text-base md:text-lg leading-relaxed">
          红黑榜多源验证 · 故事化美食推荐 · 景点多方案对比
        </p>

        {/* CTA 按钮组 */}
        <div className="animate-fade-in-up stagger-2 flex flex-col sm:flex-row gap-3 mt-4 w-full max-w-sm relative z-10">
          <Button
            size="lg"
            className="flex-1 h-12 text-base font-semibold rounded-2xl bg-white text-[#FF6B35] hover:bg-white/90 border-none shadow-lg animate-pulse-soft"
            onClick={() => navigate('/chat')}
          >
            开始规划
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1 h-12 text-base font-semibold rounded-2xl bg-white/15 text-white border-white/30 hover:bg-white/25 backdrop-blur-sm"
            onClick={() => navigate('/destination')}
          >
            发现目的地
          </Button>
        </div>

        {/* Hero 底部波浪分割线 */}
        <div className="wave-divider absolute -bottom-px left-0 right-0">
          <svg viewBox="0 0 1200 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,20 C150,50 350,0 600,20 C850,40 1050,5 1200,25 L1200,60 L0,60 Z"
              fill="#FAFAF8"
            />
          </svg>
        </div>
      </section>

      {/* ==================== 核心卖点区域 ==================== */}
      <section className="px-4 py-14 md:py-20 relative">
        {/* 背景装饰光晕 */}
        <div className="glow-orb glow-orb-primary" style={{ top: '10%', right: '-15%', width: '250px', height: '250px', opacity: 0.15 }} />

        <div className="animate-fade-in-up relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3" style={{ color: 'var(--gonow-text)' }}>
            为什么选择 GoNow
          </h2>
          <p className="text-center text-sm mb-10" style={{ color: 'var(--gonow-text-secondary)' }}>
            让旅行规划变得简单、可靠、有趣
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-3xl mx-auto relative z-10">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className={`animate-fade-in-up stagger-${index + 1} card-hover border-none text-center`}
              style={{
                boxShadow: 'var(--gonow-shadow)',
                borderRadius: 'var(--gonow-radius)',
                background: 'var(--gonow-card)',
              }}
            >
              <CardHeader className="pb-2 pt-7 px-5">
                {/* 图标区域 - 增加视觉层次 */}
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl"
                    style={{ backgroundColor: feature.bg }}
                  >
                    {/* 图标阴影装饰 */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-30"
                      style={{
                        background: feature.color,
                        filter: 'blur(8px)',
                        transform: 'scale(0.8)',
                      }}
                    />
                    <span className="relative text-3xl">{feature.icon}</span>
                  </div>
                  <CardTitle className="text-base font-bold" style={{ color: 'var(--gonow-text)' }}>
                    {feature.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-7">
                <CardDescription className="text-sm leading-relaxed" style={{ color: 'var(--gonow-text-secondary)' }}>
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ==================== 使用流程区域 ==================== */}
      <section className="px-4 py-14 md:py-20 relative overflow-hidden" style={{ backgroundColor: '#F5F3EF' }}>
        {/* 背景装饰 */}
        <div className="glow-orb glow-orb-accent" style={{ top: '-10%', left: '-10%', width: '200px', height: '200px', opacity: 0.12 }} />
        <div className="glow-orb glow-orb-success" style={{ bottom: '-10%', right: '-10%', width: '200px', height: '200px', opacity: 0.1 }} />

        <div className="animate-fade-in-up relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3" style={{ color: 'var(--gonow-text)' }}>
            四步开启你的旅行
          </h2>
          <p className="text-center text-sm mb-12" style={{ color: 'var(--gonow-text-secondary)' }}>
            简单几步，AI 为你量身定制完美行程
          </p>
        </div>

        {/* 桌面端：水平时间线 */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 max-w-4xl mx-auto relative z-10">
          {/* 连接线 - 渐变 + 虚线效果 */}
          <div
            className="absolute top-10 left-[12.5%] right-[12.5%] h-0.5"
            style={{
              background: 'linear-gradient(90deg, #FF6B35 0%, #FFD166 50%, #FF6B35 100%)',
              opacity: 0.25,
            }}
          />

          {steps.map((step, index) => (
            <div key={step.title} className={`animate-fade-in-up stagger-${index + 1} flex flex-col items-center text-center gap-3 relative`}>
              {/* 步骤圆圈 - 内含小图标 */}
              <div
                className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full text-white text-xl font-bold shadow-lg"
                style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8F65)' }}
              >
                <span className="text-2xl">{step.icon}</span>
                {/* 步骤编号角标 */}
                <span
                  className="absolute -top-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #FFD166, #FFB347)' }}
                >
                  {index + 1}
                </span>
              </div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--gonow-text)' }}>
                {step.title}
              </h3>
              <p className="text-xs leading-relaxed max-w-[200px]" style={{ color: 'var(--gonow-text-secondary)' }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* 移动端：竖向时间线 */}
        <div className="md:hidden flex flex-col gap-0 max-w-sm mx-auto relative z-10">
          {/* 竖向连接线 */}
          <div
            className="absolute top-10 bottom-10 left-5 w-0.5"
            style={{
              background: 'linear-gradient(180deg, #FF6B35, #FFD166, #FF6B35)',
              opacity: 0.25,
            }}
          />

          {steps.map((step, index) => (
            <div key={step.title} className={`animate-fade-in-up stagger-${index + 1} flex gap-4 items-start py-5 relative`}>
              {/* 步骤圆圈 - 内含小图标 */}
              <div
                className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full text-white text-sm shrink-0 shadow-md"
                style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8F65)' }}
              >
                <span className="text-base">{step.icon}</span>
              </div>
              {/* 内容 */}
              <div className="flex-1 pt-0.5">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #FFD166, #FFB347)' }}
                  >
                    {index + 1}
                  </span>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--gonow-text)' }}>
                    {step.title}
                  </h3>
                </div>
                <p className="text-xs leading-relaxed pl-7" style={{ color: 'var(--gonow-text-secondary)' }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 数据展示区域 ==================== */}
      <section className="px-4 py-14 md:py-20 relative overflow-hidden">
        {/* 背景装饰元素 */}
        <div className="glow-orb glow-orb-primary" style={{ top: '20%', left: '-10%', width: '200px', height: '200px', opacity: 0.1 }} />
        <div className="glow-orb glow-orb-accent" style={{ bottom: '10%', right: '-10%', width: '180px', height: '180px', opacity: 0.1 }} />

        {/* 装饰圆点 */}
        <div className="absolute top-8 right-8 w-2 h-2 rounded-full opacity-20" style={{ background: 'var(--gonow-primary)' }} />
        <div className="absolute top-12 right-16 w-1.5 h-1.5 rounded-full opacity-15" style={{ background: 'var(--gonow-accent)' }} />
        <div className="absolute bottom-10 left-12 w-2.5 h-2.5 rounded-full opacity-15" style={{ background: 'var(--gonow-primary)' }} />

        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-center relative z-10">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`animate-fade-in-up stagger-${index + 1} flex flex-col gap-2 py-4`}
            >
              <span className="text-3xl md:text-4xl font-extrabold gradient-number">
                {stat.value}
              </span>
              <span
                className="text-xs leading-tight"
                style={{ color: 'var(--gonow-text-secondary)' }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 底部 CTA ==================== */}
      <section className="relative overflow-hidden">
        {/* 顶部波浪分割线 */}
        <div className="wave-divider">
          <svg viewBox="0 0 1200 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,25 C200,5 400,45 600,25 C800,5 1000,40 1200,20 L1200,0 L0,0 Z"
              fill="#FAFAF8"
            />
            <path
              d="M0,25 C200,5 400,45 600,25 C800,5 1000,40 1200,20 L1200,60 L0,60 Z"
              fill="url(#ctaGradient)"
            />
            <defs>
              <linearGradient id="ctaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="40%" stopColor="#FF8F65" />
                <stop offset="100%" stopColor="#FFD166" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="gonow-gradient flex flex-col items-center text-center gap-5 py-14 md:py-20 px-4 relative">
          {/* 装饰光晕 */}
          <div className="glow-orb" style={{ top: '-20%', left: '20%', width: '200px', height: '200px', background: 'rgba(255,255,255,0.06)', opacity: 0.6 }} />
          <div className="glow-orb" style={{ bottom: '-10%', right: '15%', width: '180px', height: '180px', background: 'rgba(255,255,255,0.05)', opacity: 0.5 }} />

          {/* 装饰元素 */}
          <span className="absolute top-8 left-8 text-2xl opacity-20 select-none animate-float">✈️</span>
          <span className="absolute bottom-8 right-10 text-2xl opacity-20 select-none animate-float-slow">🌍</span>
          <span className="absolute top-1/2 left-4 text-xl opacity-10 select-none animate-float-fast">🗺️</span>

          <h2 className="animate-fade-in-up relative z-10 text-2xl md:text-3xl font-bold text-white">
            准备好开始你的旅行了吗？
          </h2>
          <p className="animate-fade-in-up stagger-1 relative z-10 text-white/80 text-sm md:text-base max-w-md">
            告诉 AI 你的旅行梦想，30 秒获得专属行程方案
          </p>
          <Button
            size="lg"
            className="animate-fade-in-up stagger-2 relative z-10 h-12 px-10 text-base font-semibold rounded-2xl bg-white text-[#FF6B35] hover:bg-white/90 border-none shadow-lg"
            onClick={() => navigate('/chat')}
          >
            立即开始规划
          </Button>
        </div>
      </section>
    </div>
  )
}
