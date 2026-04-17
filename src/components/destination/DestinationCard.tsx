/**
 * 目的地卡片组件
 * 展示目的地封面、名称、评分、标签、预算等信息
 * 支持 hover 上浮 + 封面放大效果
 */
import type { Destination, TravelStyle } from '@/types'

/** 旅行风格标签配置 */
const travelStyleConfig: Record<TravelStyle, { label: string; color: string; bg: string }> = {
  food: { label: '美食', color: '#FF6B35', bg: '#FFF0EB' },
  culture: { label: '文化', color: '#8B5CF6', bg: '#F3F0FF' },
  nature: { label: '自然', color: '#06D6A0', bg: '#E8FBF5' },
  family: { label: '亲子', color: '#FFD166', bg: '#FFF8E1' },
  adventure: { label: '冒险', color: '#EF476F', bg: '#FFE8EE' },
  romantic: { label: '浪漫', color: '#EC4899', bg: '#FDF2F8' },
  budget: { label: '穷游', color: '#4ECDC4', bg: '#E8F8F7' },
  luxury: { label: '奢华', color: '#F59E0B', bg: '#FFF8E1' },
}

interface DestinationCardProps {
  destination: Destination
  onClick: (destination: Destination) => void
}

/** 星星评分组件 */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className="w-3.5 h-3.5"
          viewBox="0 0 20 20"
          fill={star <= Math.round(rating) ? '#FF6B35' : '#E5E7EB'}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs font-semibold ml-1" style={{ color: '#FF6B35' }}>
        {rating.toFixed(1)}
      </span>
    </div>
  )
}

export default function DestinationCard({ destination, onClick }: DestinationCardProps) {
  return (
    <div
      className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
      style={{
        boxShadow: 'var(--gonow-shadow)',
        background: 'var(--gonow-card)',
      }}
      onClick={() => onClick(destination)}
    >
      {/* 渐变色封面 */}
      <div
        className="relative h-44 overflow-hidden"
        style={{ background: destination.coverImage }}
      >
        {/* 封面 hover 放大效果 */}
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
          style={{ background: destination.coverImage }}
        />

        {/* 封面叠加暗层 */}
        <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/10" />

        {/* 目的地名称 - 叠加在封面上 */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white drop-shadow-md">
            {destination.name}
          </h3>
          <span className="inline-block mt-1 text-xs text-white/80 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-0.5">
            {destination.province}
          </span>
        </div>

        {/* 右上角评分 */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
          <StarRating rating={destination.rating} />
        </div>
      </div>

      {/* 卡片内容 */}
      <div className="p-4 flex flex-col gap-3">
        {/* 旅行风格标签 */}
        <div className="flex flex-wrap gap-1.5">
          {destination.tags.map((tag) => {
            const config = travelStyleConfig[tag]
            return (
              <span
                key={tag}
                className="text-xs font-medium px-2 py-0.5 rounded-full"
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

        {/* 预算 + 天数 + 季节 */}
        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--gonow-text-secondary)' }}>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {destination.avgBudget}元/天
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            建议{destination.avgDays}天
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {destination.bestSeason}
          </span>
        </div>
      </div>
    </div>
  )
}

export { travelStyleConfig }
