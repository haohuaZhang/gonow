/**
 * 目的地详情面板
 * 在当前页面展开，展示目的地的完整信息
 * 包含封面、评分、5维度评分、亮点、操作按钮
 */
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { travelStyleConfig } from './DestinationCard'
import type { Destination } from '@/types'

interface DestinationDetailProps {
  destination: Destination
  onBack: () => void
}

/** 5 维度评分配置 */
const dimensions = [
  { key: 'foodScore' as const, label: '美食', icon: '🍜' },
  { key: 'scenicScore' as const, label: '景色', icon: '🏞️' },
  { key: 'cultureScore' as const, label: '文化', icon: '🏛️' },
  { key: 'transportScore' as const, label: '交通', icon: '🚄' },
  { key: 'costScore' as const, label: '性价比', icon: '💰' },
]

/** 评分进度条组件 */
function ScoreBar({ label, icon, score }: { label: string; icon: string; score: number }) {
  const percentage = (score / 5) * 100

  return (
    <div className="flex items-center gap-3">
      <span className="text-base w-6 text-center shrink-0">{icon}</span>
      <span className="text-sm font-medium w-12 shrink-0" style={{ color: 'var(--gonow-text)' }}>
        {label}
      </span>
      <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F3F4F6' }}>
        <div
          className="h-full rounded-full progress-gonow transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-semibold w-8 text-right" style={{ color: '#FF6B35' }}>
        {score.toFixed(1)}
      </span>
    </div>
  )
}

export default function DestinationDetail({ destination, onBack }: DestinationDetailProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      {/* 返回按钮 */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 w-fit"
        style={{ color: 'var(--gonow-text-secondary)' }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        返回列表
      </button>

      {/* 大封面 */}
      <div
        className="relative h-56 md:h-72 rounded-2xl overflow-hidden"
        style={{ background: destination.coverImage }}
      >
        {/* 封面叠加暗层 */}
        <div className="absolute inset-0 bg-black/20" />

        {/* 封面内容 */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">
                {destination.name}
              </h1>
              <span className="inline-block mt-2 text-sm text-white/80 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                {destination.province}
              </span>
            </div>
            {/* 综合评分 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 text-center shadow-sm">
              <div className="text-2xl font-bold" style={{ color: '#FF6B35' }}>
                {destination.rating.toFixed(1)}
              </div>
              <div className="flex gap-0.5 mt-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-3 h-3"
                    viewBox="0 0 20 20"
                    fill={star <= Math.round(destination.rating) ? '#FF6B35' : '#E5E7EB'}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 描述 */}
      <p className="text-sm leading-relaxed" style={{ color: 'var(--gonow-text-secondary)' }}>
        {destination.description}
      </p>

      {/* 旅行风格标签 */}
      <div className="flex flex-wrap gap-2">
        {destination.tags.map((tag) => {
          const config = travelStyleConfig[tag]
          return (
            <span
              key={tag}
              className="text-sm font-medium px-3 py-1 rounded-full"
              style={{
                color: config.color,
                backgroundColor: config.bg,
              }}
            >
              {config.label}
            </span>
          )
        })}
      </div>

      {/* 5 维度评分 */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: 'var(--gonow-card)',
          boxShadow: 'var(--gonow-shadow)',
        }}
      >
        <h3 className="text-base font-bold mb-4" style={{ color: 'var(--gonow-text)' }}>
          多维度评分
        </h3>
        <div className="flex flex-col gap-3.5">
          {dimensions.map((dim) => (
            <ScoreBar
              key={dim.key}
              label={dim.label}
              icon={dim.icon}
              score={destination[dim.key]}
            />
          ))}
        </div>
      </div>

      {/* 亮点列表 */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: 'var(--gonow-card)',
          boxShadow: 'var(--gonow-shadow)',
        }}
      >
        <h3 className="text-base font-bold mb-4" style={{ color: 'var(--gonow-text)' }}>
          必去亮点
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {destination.highlights.map((highlight, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-colors duration-200"
              style={{
                backgroundColor: 'var(--gonow-primary-light)',
              }}
            >
              <span className="text-sm" style={{ color: '#FF6B35' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-sm font-medium" style={{ color: 'var(--gonow-text)' }}>
                {highlight}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 旅行信息卡片 */}
      <div className="grid grid-cols-3 gap-3">
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: 'var(--gonow-card)',
            boxShadow: 'var(--gonow-shadow-sm)',
          }}
        >
          <div className="text-2xl mb-1">🌤️</div>
          <div className="text-xs mb-0.5" style={{ color: 'var(--gonow-text-muted)' }}>最佳季节</div>
          <div className="text-sm font-bold" style={{ color: 'var(--gonow-text)' }}>
            {destination.bestSeason}
          </div>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: 'var(--gonow-card)',
            boxShadow: 'var(--gonow-shadow-sm)',
          }}
        >
          <div className="text-2xl mb-1">💰</div>
          <div className="text-xs mb-0.5" style={{ color: 'var(--gonow-text-muted)' }}>人均预算</div>
          <div className="text-sm font-bold" style={{ color: 'var(--gonow-text)' }}>
            {destination.avgBudget}元/天
          </div>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: 'var(--gonow-card)',
            boxShadow: 'var(--gonow-shadow-sm)',
          }}
        >
          <div className="text-2xl mb-1">📅</div>
          <div className="text-xs mb-0.5" style={{ color: 'var(--gonow-text-muted)' }}>建议天数</div>
          <div className="text-sm font-bold" style={{ color: 'var(--gonow-text)' }}>
            {destination.avgDays}天
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3 mt-2">
        <Button
          size="lg"
          className="flex-1 h-12 text-base font-semibold rounded-2xl"
          style={{
            backgroundColor: 'var(--gonow-primary)',
            color: '#FFFFFF',
          }}
          onClick={() => navigate('/chat')}
        >
          开始规划
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1 h-12 text-base font-semibold rounded-2xl"
          style={{
            borderColor: 'var(--gonow-primary)',
            color: 'var(--gonow-primary)',
          }}
          onClick={onBack}
        >
          返回列表
        </Button>
      </div>
    </div>
  )
}
