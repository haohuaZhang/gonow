import { useState, useRef, useEffect, lazy, Suspense } from 'react'
import type { Activity } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ActivityIcon } from './ActivityIcon'
import { useTripStore } from '@/stores/tripStore'
import { useReviewStore } from '@/stores/reviewStore'
import { cn } from '@/lib/utils'

const ReplaceActivityDialog = lazy(() =>
  import('./ReplaceActivityDialog').then((m) => ({ default: m.ReplaceActivityDialog }))
)

interface ActivityCardProps {
  /** 活动数据 */
  activity: Activity
  /** 所在天索引（用于编辑操作） */
  dayIndex: number
  /** 点击卡片回调 */
  onClick?: () => void
}

/**
 * 活动卡片组件
 *
 * 设计优化：
 * - 更大圆角（16px）
 * - 左侧类型图标使用品牌色渐变背景
 * - 红旗标签使用更柔和的橙色
 * - hover 时卡片轻微上浮
 * - 柔和阴影替代硬边框
 */

/** 将评分（0-5）转换为星星显示 */
function StarRating({ rating }: { rating: number }) {
  if (rating <= 0) return null

  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.3
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0)

  return (
    <span className="inline-flex items-center gap-px text-amber-500" aria-label={`评分 ${rating} 分`}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <span key={`full-${i}`}>★</span>
      ))}
      {hasHalf && <span>★</span>}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <span key={`empty-${i}`} className="text-gray-300">★</span>
      ))}
      <span className="ml-1 text-xs font-normal" style={{ color: 'var(--gonow-text-muted)' }}>
        {rating.toFixed(1)}
      </span>
    </span>
  )
}

/** 将可信度评分（0-100）转换为 5 星显示 */
function CredibilityStars({ score }: { score: number }) {
  const stars = Math.round((score / 100) * 5 * 2) / 2
  const fullStars = Math.floor(stars)
  const hasHalf = stars - fullStars >= 0.25
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0)

  return (
    <span
      className="inline-flex items-center gap-px text-xs"
      style={{ color: 'var(--gonow-primary)' }}
      title={`可信度 ${score}%`}
    >
      {Array.from({ length: fullStars }).map((_, i) => (
        <span key={`cfull-${i}`}>★</span>
      ))}
      {hasHalf && <span>★</span>}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <span key={`cempty-${i}`} style={{ color: '#FFD4B8' }}>★</span>
      ))}
    </span>
  )
}

/** 更多操作图标（三点） */
function MoreHorizontalIcon() {
  return (
    <svg
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6h.01M12 12h.01M12 18h.01"
      />
    </svg>
  )
}

/** 替换图标 */
function RefreshCwIcon() {
  return (
    <svg
      className="size-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  )
}

/** 删除图标 */
function TrashIcon() {
  return (
    <svg
      className="size-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  )
}

/** 活动卡片组件 */
export function ActivityCard({ activity, dayIndex, onClick }: ActivityCardProps) {
  const { name, description, type, cost, rating, redBlackFlags, startTime, endTime } =
    activity

  // 替换弹窗状态
  const [replaceOpen, setReplaceOpen] = useState(false)
  // 删除确认状态
  const [confirmDelete, setConfirmDelete] = useState(false)
  // 保存删除确认的定时器 ID，用于组件卸载时清理
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Store 方法
  const replaceActivity = useTripStore((s) => s.replaceActivity)
  const removeActivity = useTripStore((s) => s.removeActivity)
  const getReviewStats = useReviewStore((s) => s.getReviewStats)

  // 获取用户评价统计（仅 scenic 和 food 类型）
  const showReviewStats = type === 'scenic' || type === 'food'
  const reviewStats = showReviewStats ? getReviewStats(type, activity.id) : null

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) {
        clearTimeout(deleteTimerRef.current)
      }
    }
  }, [])

  /** 处理删除：需要二次确认 */
  const handleDelete = () => {
    if (!confirmDelete) {
      // 第一次点击：进入确认状态
      setConfirmDelete(true)
      // 清理之前的定时器
      if (deleteTimerRef.current) {
        clearTimeout(deleteTimerRef.current)
      }
      // 3 秒后自动取消确认状态
      deleteTimerRef.current = setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    // 第二次点击：执行删除
    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current)
      deleteTimerRef.current = null
    }
    removeActivity(dayIndex, activity.id)
    setConfirmDelete(false)
  }

  return (
    <>
      <Card
        size="sm"
        className={cn(
          'card-hover',
          'border-none',
          onClick && 'cursor-pointer',
        )}
        style={{
          boxShadow: 'var(--gonow-shadow-sm)',
          borderRadius: 'var(--gonow-radius)',
          background: 'var(--gonow-card)',
        }}
        onClick={onClick}
      >
        <CardContent className="flex gap-3 py-3.5">
          {/* 左侧：类型图标 - 品牌色渐变背景 */}
          <div
            className="flex flex-col items-center justify-center gap-1 shrink-0 w-10 h-10 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8F65)' }}
          >
            <ActivityIcon type={type} size="sm" />
          </div>

          {/* 中间：活动信息 */}
          <div className="flex-1 min-w-0">
            {/* 名称行 */}
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm truncate" style={{ color: 'var(--gonow-text)' }}>
                {name}
              </h4>
            </div>

            {/* 描述：最多2行截断 */}
            {description && (
              <p className="text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: 'var(--gonow-text-secondary)' }}>
                {description}
              </p>
            )}

            {/* 时间 + 费用 + 评分 */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs" style={{ color: 'var(--gonow-text-muted)' }}>
              {/* 时间范围 */}
              {startTime && endTime && (
                <span className="inline-flex items-center gap-1">
                  <svg
                    className="size-3 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
                    />
                  </svg>
                  {startTime} - {endTime}
                </span>
              )}

              {/* 费用 - 品牌色 */}
              {cost > 0 && (
                <span
                  className="inline-flex items-center gap-1 font-semibold"
                  style={{ color: 'var(--gonow-primary)' }}
                >
                  ¥{cost}
                </span>
              )}

              {/* 评分 */}
              <StarRating rating={rating} />

              {/* 用户评价统计（scenic/food 类型） */}
              {showReviewStats && reviewStats && reviewStats.totalCount > 0 && (
                <span
                  className="inline-flex items-center gap-1 text-xs"
                  style={{ color: 'var(--gonow-primary)' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {reviewStats.averageRating.toFixed(1)} ({reviewStats.totalCount})
                </span>
              )}
            </div>

            {/* 红旗标记 + 可信度 - 柔和橙色 */}
            {(redBlackFlags?.redFlags?.length || redBlackFlags) && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {redBlackFlags?.redFlags?.map((flag, i) => (
                  <Badge
                    key={`red-${i}`}
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 rounded-full"
                    style={{
                      borderColor: '#FFB899',
                      color: '#E55A25',
                      backgroundColor: '#FFF5F0',
                    }}
                  >
                    ⚠ {flag}
                  </Badge>
                ))}
                {redBlackFlags?.blackFlags?.map((flag, i) => (
                  <Badge
                    key={`black-${i}`}
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 rounded-full"
                    style={{
                      borderColor: '#FFB8B8',
                      color: '#EF476F',
                      backgroundColor: '#FFF0F2',
                    }}
                  >
                    🚫 {flag}
                  </Badge>
                ))}
                {redBlackFlags?.credibilityScore != null && (
                  <span className="inline-flex items-center gap-1 text-[10px] ml-1" style={{ color: 'var(--gonow-text-muted)' }}>
                    可信度
                    <CredibilityStars score={redBlackFlags.credibilityScore} />
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 右侧：操作菜单（桌面端显示在右上角） */}
          <div className="hidden sm:flex shrink-0 self-start">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon-xs" />}
                aria-label="更多操作"
              >
                <MoreHorizontalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setReplaceOpen(true)}>
                  <RefreshCwIcon />
                  替换活动
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleDelete}
                >
                  <TrashIcon />
                  {confirmDelete ? '确认删除？' : '删除活动'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>

        {/* 移动端：操作按钮在卡片底部 */}
        <div className="flex sm:hidden gap-2 px-3 pb-3">
          <Button
            variant="outline"
            size="xs"
            className="flex-1 rounded-xl"
            onClick={() => setReplaceOpen(true)}
          >
            <RefreshCwIcon />
            替换
          </Button>
          <Button
            variant={confirmDelete ? 'destructive' : 'outline'}
            size="xs"
            className="flex-1 rounded-xl"
            onClick={handleDelete}
          >
            <TrashIcon />
            {confirmDelete ? '确认删除？' : '删除'}
          </Button>
        </div>
      </Card>

      {/* 替换活动弹窗 */}
      {replaceOpen && (
        <Suspense fallback={null}>
          <ReplaceActivityDialog
            open={replaceOpen}
            onOpenChange={setReplaceOpen}
            currentActivity={activity}
            dayIndex={dayIndex}
            onReplace={replaceActivity}
          />
        </Suspense>
      )}
    </>
  )
}
