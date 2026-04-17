/**
 * 美食故事卡片组件
 * 展示一道菜的完整故事，包含图片区域、评分、故事描述、必点菜品、红黑榜和实用信息
 */
import { useState, lazy, Suspense } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { FoodRecommendation } from '@/types'
import { useReviewStore } from '@/stores/reviewStore'

const ReviewList = lazy(() =>
  import('@/components/review/ReviewList').then((m) => ({ default: m.ReviewList }))
)

interface FoodStoryCardProps {
  food: FoodRecommendation
}

/** 食物类型对应的渐变色和 emoji */
const cuisineConfig: Record<string, { gradient: string; emoji: string }> = {
  '潮汕菜': { gradient: 'from-orange-400 to-red-500', emoji: '🥘' },
  '潮汕小吃': { gradient: 'from-amber-400 to-orange-500', emoji: '🍜' },
}

/** 获取菜系配置，默认使用通用配置 */
function getCuisineConfig(cuisine: string) {
  return cuisineConfig[cuisine] ?? { gradient: 'from-gray-400 to-gray-500', emoji: '🍽️' }
}

/** 渲染评分星星 */
function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.5
  const stars = []

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <span key={`full-${i}`} className="text-amber-400">
        ★
      </span>
    )
  }
  if (hasHalf) {
    stars.push(
      <span key="half" className="text-amber-400">
        ★
      </span>
    )
  }
  const emptyStars = 5 - stars.length
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <span key={`empty-${i}`} className="text-gray-300">
        ★
      </span>
    )
  }

  return <span className="inline-flex gap-0.5 text-sm">{stars}</span>
}

/** 可信度评分颜色 */
function credibilityColor(score: number): string {
  if (score >= 90) return 'text-green-600'
  if (score >= 80) return 'text-amber-600'
  return 'text-red-600'
}

export default function FoodStoryCard({ food }: FoodStoryCardProps) {
  const { gradient, emoji } = getCuisineConfig(food.cuisine)
  const paragraphs = food.story.split('\n\n').filter(Boolean)
  const [showReviews, setShowReviews] = useState(false)
  const getReviewStats = useReviewStore((s) => s.getReviewStats)
  const reviewStats = getReviewStats('food', food.id)

  return (
    <div className="w-full max-w-[480px] rounded-xl bg-card text-card-foreground shadow-sm ring-1 ring-foreground/10 overflow-hidden">
      {/* 顶部图片区域：渐变色背景 + emoji + 菜系标签 */}
      <div className={`relative bg-gradient-to-br ${gradient} px-5 pt-6 pb-5`}>
        <span className="text-5xl block mb-2">{emoji}</span>
        <Badge
          variant="secondary"
          className="absolute top-3 right-3 bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs"
        >
          {food.cuisine}
        </Badge>
      </div>

      {/* 菜名和评分 */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold leading-tight">{food.name}</h3>
          <div className="flex items-center gap-1.5 shrink-0 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">¥{food.avgCost}</span>
            <span>/人</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <RatingStars rating={food.rating} />
          <span className="text-sm font-medium">{food.rating}</span>
        </div>
      </div>

      {/* 故事描述：引用样式（左侧竖线 + 浅色背景） */}
      <div className="px-5 pb-3">
        <div className="border-l-3 border-primary/30 bg-muted/50 rounded-r-lg px-4 py-3 space-y-3">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-sm leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* 必点菜品列表 */}
      {food.signatureDishes.length > 0 && (
        <div className="px-5 pb-3">
          <h4 className="text-sm font-semibold mb-2">必点菜品</h4>
          <div className="flex flex-wrap gap-2">
            {food.signatureDishes.map((dish, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs font-normal py-1 px-2.5"
              >
                {dish}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 红黑榜标记 */}
      {food.redBlackFlags && (
        <div className="px-5 pb-3">
          <h4 className="text-sm font-semibold mb-2">注意事项</h4>
          <div className="space-y-1.5">
            {/* 红旗 */}
            {food.redBlackFlags.redFlags.map((flag, index) => (
              <div key={`red-${index}`} className="flex items-start gap-2 text-sm">
                <span className="text-red-500 shrink-0 mt-0.5">🚩</span>
                <span className="text-muted-foreground">{flag}</span>
              </div>
            ))}
            {/* 黑旗 */}
            {food.redBlackFlags.blackFlags.map((flag, index) => (
              <div key={`black-${index}`} className="flex items-start gap-2 text-sm">
                <span className="text-black shrink-0 mt-0.5">⚠️</span>
                <span className="text-destructive font-medium">{flag}</span>
              </div>
            ))}
          </div>
          {/* 可信度评分 */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>可信度</span>
            <span className={`font-bold ${credibilityColor(food.redBlackFlags.credibilityScore)}`}>
              {food.redBlackFlags.credibilityScore}分
            </span>
          </div>
        </div>
      )}

      {/* 实用信息 */}
      <div className="px-5 pb-3 space-y-1.5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="truncate">{food.location.name} · {food.location.address}</span>
        </div>
      </div>

      {/* 底部操作 */}
      <div className="flex items-center gap-3 border-t bg-muted/50 px-5 py-3">
        <Button size="sm" className="flex-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          加入行程
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => setShowReviews(!showReviews)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          评价{reviewStats.totalCount > 0 ? ` (${reviewStats.totalCount})` : ''}
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          了解更多
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Button>
      </div>

      {/* 评价列表（展开时显示） */}
      {showReviews && (
        <div className="border-t px-5 py-4 bg-muted/30">
          <Suspense fallback={
            <div className="flex items-center justify-center py-8">
              <span className="text-sm" style={{ color: 'var(--gonow-text-muted)' }}>加载评价中...</span>
            </div>
          }>
            <ReviewList
              targetType="food"
              targetId={food.id}
              targetName={food.name}
            />
          </Suspense>
        </div>
      )}
    </div>
  )
}
