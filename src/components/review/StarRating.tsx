/**
 * 星级评分组件
 * 支持显示模式（只读）和交互模式（可点击选择评分）
 * 星星颜色使用品牌色 #FF6B35
 */
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  /** 当前评分值 */
  rating: number
  /** 最大星数 */
  max?: number
  /** 是否为交互模式（可点击） */
  interactive?: boolean
  /** 评分变化回调 */
  onRatingChange?: (rating: number) => void
  /** 是否显示平均分数字 */
  showValue?: boolean
  /** 自定义类名 */
  className?: string
  /** 星星大小 */
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
}

export function StarRating({
  rating,
  max = 5,
  interactive = false,
  onRatingChange,
  showValue = false,
  className,
  size = 'md',
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const displayRating = interactive ? hoverRating || rating : rating

  const handleClick = (starIndex: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starIndex)
    }
  }

  return (
    <div className={cn('inline-flex items-center gap-0.5', className)}>
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1
        const isFilled = starValue <= Math.floor(displayRating)
        const isHalf =
          !isFilled &&
          starValue === Math.ceil(displayRating) &&
          displayRating % 1 >= 0.3

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={cn(
              'relative transition-transform duration-150 select-none',
              interactive && 'cursor-pointer hover:scale-110 active:scale-95',
              !interactive && 'cursor-default',
              sizeMap[size]
            )}
            aria-label={`${starValue} 星`}
          >
            {/* 空心星 */}
            <span
              className="text-gray-300"
              aria-hidden="true"
            >
              ★
            </span>
            {/* 实心星（覆盖在空心星上） */}
            {(isFilled || isHalf) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ color: '#FF6B35' }}
                aria-hidden="true"
              >
                {isHalf ? (
                  <span
                    className="block"
                    style={{ width: '50%', overflow: 'hidden' }}
                  >
                    ★
                  </span>
                ) : (
                  <span>★</span>
                )}
              </span>
            )}
          </button>
        )
      })}
      {showValue && (
        <span
          className="ml-1.5 font-semibold text-sm"
          style={{ color: '#FF6B35' }}
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
