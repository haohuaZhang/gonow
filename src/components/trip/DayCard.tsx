import { lazy, Suspense } from 'react'
import type { Day } from '@/types'

const ActivityCard = lazy(() => import('./ActivityCard').then((m) => ({ default: m.ActivityCard })))

interface DayCardProps {
  /** 单日行程数据 */
  day: Day
  /** 天索引（在 Trip.days 中的位置，从 0 开始） */
  dayIndex: number
  /** 点击活动卡片时的回调 */
  onActivityClick?: (index: number) => void
}

/** 单日行程卡片组件 */
export function DayCard({ day, dayIndex, onActivityClick }: DayCardProps) {
  const { dayNumber, theme, date, totalCost, activities } = day

  return (
    <div className="flex flex-col gap-0">
      {/* 日期头部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {dayNumber}
          </span>
          <div>
            <h3 className="font-semibold text-sm">{theme}</h3>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-orange-600">
            ¥{totalCost}
          </p>
          <p className="text-[10px] text-muted-foreground">预估花费</p>
        </div>
      </div>

      {/* 活动列表（带时间线） */}
      <div className="relative pl-5">
        {/* 时间线竖线 */}
        {activities.length > 1 && (
          <div className="absolute left-[9px] top-3 bottom-3 w-px bg-border" />
        )}

        {/* 活动卡片列表 */}
        <div className="flex flex-col gap-3">
          {activities.map((activity, index) => (
            <div key={activity.id} className="relative">
              {/* 时间线节点圆点 */}
              {activities.length > 1 && (
                <div
                  className="absolute -left-5 top-4 h-[18px] w-[18px] rounded-full border-2 border-background bg-border z-10"
                  aria-hidden="true"
                />
              )}
              <Suspense fallback={<div className="h-20 rounded-xl bg-muted/50 animate-pulse" />}>
                <ActivityCard
                  activity={activity}
                  dayIndex={dayIndex}
                  onClick={() => onActivityClick?.(index)}
                />
              </Suspense>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
