/**
 * 评价列表组件
 * 包含评价统计头部、评分分布条形图、筛选、评价列表、写评价按钮
 */
import { useState, useMemo, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { StarRating } from './StarRating'
import { ReviewCard } from './ReviewCard'
import { WriteReviewDialog } from './WriteReviewDialog'
import { useReviewStore } from '@/stores/reviewStore'
import type { ReviewTargetType } from '@/types'

interface ReviewListProps {
  targetType: ReviewTargetType
  targetId: string
  targetName: string
  className?: string
}

/** 评分分布条形图 */
function RatingDistribution({
  distribution,
  total,
}: {
  distribution: { [key: number]: number }
  total: number
}) {
  return (
    <div className="space-y-1.5">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = distribution[star] || 0
        const percentage = total > 0 ? (count / total) * 100 : 0

        return (
          <div key={star} className="flex items-center gap-2 text-xs">
            <span className="w-3 text-right font-medium" style={{ color: 'var(--gonow-text-muted)' }}>
              {star}
            </span>
            <span style={{ color: '#FF6B35' }}>★</span>
            <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: '#FF6B35',
                }}
              />
            </div>
            <span className="w-6 text-right" style={{ color: 'var(--gonow-text-muted)' }}>
              {count}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function ReviewList({ targetType, targetId, targetName, className }: ReviewListProps) {
  const [writeDialogOpen, setWriteDialogOpen] = useState(false)
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(5)

  const reviews = useReviewStore((s) => s.reviews)
  const getReviewStats = useReviewStore((s) => s.getReviewStats)
  const toggleLike = useReviewStore((s) => s.toggleLike)
  const addReview = useReviewStore((s) => s.addReview)

  const stats = useMemo(
    () => getReviewStats(targetType, targetId),
    [getReviewStats, targetType, targetId, reviews]
  )

  const filteredReviews = useMemo(() => {
    let result = reviews.filter(
      (r) => r.targetType === targetType && r.targetId === targetId
    )

    if (filterRating !== null) {
      result = result.filter((r) => r.rating === filterRating)
    }

    if (filterTag !== null) {
      result = result.filter((r) => r.tags?.includes(filterTag))
    }

    // 按时间倒序
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return result
  }, [reviews, targetType, targetId, filterRating, filterTag])

  const visibleReviews = filteredReviews.slice(0, visibleCount)
  const hasMore = visibleCount < filteredReviews.length

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 5)
  }, [])

  const handleFilterClick = useCallback((rating: number | null) => {
    setFilterRating(rating)
    setFilterTag(null)
    setVisibleCount(5)
  }, [])

  const handleTagClick = useCallback((tag: string | null) => {
    setFilterTag(tag)
    setFilterRating(null)
    setVisibleCount(5)
  }, [])

  const handleReviewAdded = useCallback(() => {
    setWriteDialogOpen(false)
    setVisibleCount(5)
  }, [])

  return (
    <div className={cn('space-y-4', className)}>
      {/* 评价统计头部 */}
      {stats.totalCount > 0 && (
        <div
          className="rounded-2xl bg-white p-5"
          style={{ boxShadow: 'var(--gonow-shadow-sm)' }}
        >
          <div className="flex gap-6">
            {/* 左侧：平均分 */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <span
                className="text-4xl font-bold"
                style={{ color: '#FF6B35' }}
              >
                {stats.averageRating.toFixed(1)}
              </span>
              <StarRating rating={stats.averageRating} size="sm" />
              <span className="text-xs mt-1" style={{ color: 'var(--gonow-text-muted)' }}>
                {stats.totalCount} 条评价
              </span>
            </div>

            {/* 右侧：评分分布 */}
            <div className="flex-1 min-w-0">
              <RatingDistribution
                distribution={stats.ratingDistribution}
                total={stats.totalCount}
              />
            </div>
          </div>

          {/* 热门标签 */}
          {stats.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-gray-100">
              {stats.tags.slice(0, 6).map((tag) => (
                <button
                  key={tag.name}
                  type="button"
                  onClick={() => handleTagClick(filterTag === tag.name ? null : tag.name)}
                  className={cn(
                    'text-xs px-2.5 py-1 rounded-full transition-all duration-200',
                    filterTag === tag.name
                      ? 'font-semibold ring-1'
                      : 'hover:opacity-80'
                  )}
                  style={{
                    backgroundColor: filterTag === tag.name ? '#FF6B35' : 'var(--gonow-primary-light)',
                    color: filterTag === tag.name ? '#FFFFFF' : 'var(--gonow-primary)',
                  }}
                >
                  {tag.name} ({tag.count})
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 筛选栏 */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium" style={{ color: 'var(--gonow-text-muted)' }}>
          筛选：
        </span>
        <button
          type="button"
          onClick={() => handleFilterClick(null)}
          className={cn(
            'text-xs px-2.5 py-1 rounded-full transition-all duration-200',
            filterRating === null && filterTag === null && 'font-semibold'
          )}
          style={{
            backgroundColor: filterRating === null && filterTag === null ? '#FF6B35' : '#F3F4F6',
            color: filterRating === null && filterTag === null ? '#FFFFFF' : 'var(--gonow-text-muted)',
          }}
        >
          全部
        </button>
        {[5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleFilterClick(filterRating === star ? null : star)}
            className={cn(
              'text-xs px-2.5 py-1 rounded-full transition-all duration-200 inline-flex items-center gap-1',
              filterRating === star && 'font-semibold'
            )}
            style={{
              backgroundColor: filterRating === star ? '#FF6B35' : '#F3F4F6',
              color: filterRating === star ? '#FFFFFF' : 'var(--gonow-text-muted)',
            }}
          >
            {star} ★
          </button>
        ))}
      </div>

      {/* 评价列表 */}
      {visibleReviews.length > 0 ? (
        <div className="space-y-3">
          {visibleReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onToggleLike={toggleLike}
            />
          ))}

          {/* 加载更多 */}
          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadMore}
                className="rounded-xl"
              >
                查看更多评价 ({filteredReviews.length - visibleCount} 条)
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* 空状态 */
        <div
          className="rounded-2xl bg-white py-12 flex flex-col items-center justify-center text-center"
          style={{ boxShadow: 'var(--gonow-shadow-sm)' }}
        >
          <div className="text-4xl mb-3">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--gonow-text-muted)' }}>
            {filterRating || filterTag ? '没有符合条件的评价' : '暂无评价，快来写第一条吧'}
          </p>
        </div>
      )}

      {/* 写评价按钮 */}
      <Button
        onClick={() => setWriteDialogOpen(true)}
        className="w-full rounded-xl h-11 text-sm font-semibold"
        style={{
          backgroundColor: '#FF6B35',
          color: '#FFFFFF',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
        写评价
      </Button>

      {/* 写评价弹窗 */}
      {writeDialogOpen && (
        <WriteReviewDialog
          open={writeDialogOpen}
          onOpenChange={setWriteDialogOpen}
          targetType={targetType}
          targetId={targetId}
          targetName={targetName}
          onSubmit={addReview}
          onSuccess={handleReviewAdded}
        />
      )}
    </div>
  )
}
