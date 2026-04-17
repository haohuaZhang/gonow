/**
 * 评价卡片组件
 * 展示单条用户评价，包含头像、评分、内容、标签、点赞
 */
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { Review } from '@/types'
import { StarRating } from './StarRating'

interface ReviewCardProps {
  review: Review
  onToggleLike?: (reviewId: string) => void
  className?: string
}

/** 格式化日期为相对时间 */
function formatRelativeDate(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays} 天前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周前`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} 个月前`
  return `${Math.floor(diffDays / 365)} 年前`
}

/** 用户头像（首字母圆形） */
function UserAvatar({ name }: { name: string }) {
  const firstChar = name.charAt(0)
  // 根据用户名生成稳定的颜色
  const colors = ['#FF6B35', '#06D6A0', '#FFD166', '#118AB2', '#EF476F', '#8338EC']
  const colorIndex = name.charCodeAt(0) % colors.length
  const bgColor = colors[colorIndex]

  return (
    <div
      className="flex items-center justify-center w-9 h-9 rounded-full text-white text-sm font-bold shrink-0"
      style={{ backgroundColor: bgColor }}
    >
      {firstChar}
    </div>
  )
}

export function ReviewCard({ review, onToggleLike, className }: ReviewCardProps) {
  const [likeAnimating, setLikeAnimating] = useState(false)
  const likeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 清理点赞动画定时器
  useEffect(() => {
    return () => {
      if (likeTimerRef.current) clearTimeout(likeTimerRef.current)
    }
  }, [])

  const handleLike = () => {
    if (onToggleLike) {
      setLikeAnimating(true)
      onToggleLike(review.id)
      if (likeTimerRef.current) clearTimeout(likeTimerRef.current)
      likeTimerRef.current = setTimeout(() => setLikeAnimating(false), 400)
    }
  }

  return (
    <div
      className={cn(
        'rounded-2xl bg-white p-4',
        'transition-shadow duration-300',
        className
      )}
      style={{
        boxShadow: 'var(--gonow-shadow-sm)',
      }}
    >
      {/* 用户信息行 */}
      <div className="flex items-center gap-3">
        <UserAvatar name={review.userName} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-sm truncate" style={{ color: 'var(--gonow-text)' }}>
              {review.userName}
            </span>
            <span className="text-xs shrink-0" style={{ color: 'var(--gonow-text-muted)' }}>
              {formatRelativeDate(review.createdAt)}
            </span>
          </div>
          <div className="mt-0.5">
            <StarRating rating={review.rating} size="sm" />
          </div>
        </div>
      </div>

      {/* 评价内容 */}
      <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--gonow-text-secondary)' }}>
        {review.content}
      </p>

      {/* 标签 */}
      {review.tags && review.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {review.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: 'var(--gonow-primary-light)',
                color: 'var(--gonow-primary)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 点赞按钮 */}
      <div className="flex items-center mt-3 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={handleLike}
          className={cn(
            'inline-flex items-center gap-1.5 text-xs transition-all duration-200',
            review.liked
              ? 'font-semibold'
              : 'hover:opacity-80'
          )}
          style={{ color: review.liked ? '#EF476F' : 'var(--gonow-text-muted)' }}
        >
          <span
            className={cn(
              'inline-block transition-transform duration-300',
              likeAnimating && 'animate-like-bounce'
            )}
          >
            {review.liked ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            )}
          </span>
          {review.likes > 0 && <span>{review.likes}</span>}
        </button>
      </div>
    </div>
  )
}
