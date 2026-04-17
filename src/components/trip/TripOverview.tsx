import { useState, useMemo, useCallback } from 'react'
import type { Trip, ActivityType } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { DayCard } from './DayCard'
import { ShareTripDialog } from './ShareTripDialog'
import { TripPDFExport } from './TripPDFExport'
import { TripMap } from '@/components/map/TripMap'
import { WeatherBar } from './WeatherBar'
import { BudgetBreakdown } from './BudgetBreakdown'

interface TripOverviewProps {
  /** 行程数据 */
  trip: Trip
}

/** 活动类型中文名映射 */
const typeLabelMap: Record<ActivityType, string> = {
  scenic: '景点',
  food: '美食',
  hotel: '住宿',
  transport: '交通',
  culture: '文化',
}

/** 预算类别颜色 */
const typeColorMap: Record<ActivityType, string> = {
  scenic: 'bg-blue-500',
  food: 'bg-orange-500',
  hotel: 'bg-purple-500',
  transport: 'bg-gray-400',
  culture: 'bg-pink-500',
}

/** 行程总览组件 */
export function TripOverview({ trip }: TripOverviewProps) {
  const { destination, startDate, endDate, travelers, budget, days, description } =
    trip

  // 计算行程天数
  const totalDays = days.length

  // 计算总花费
  const totalCost = useMemo(
    () => days.reduce((sum, day) => sum + day.totalCost, 0),
    [days],
  )

  // 按类别统计花费
  const costByType = useMemo(() => {
    const map: Partial<Record<ActivityType, number>> = {}
    for (const day of days) {
      for (const activity of day.activities) {
        if (activity.cost > 0) {
          map[activity.type] = (map[activity.type] || 0) + activity.cost
        }
      }
    }
    return map
  }, [days])

  // 默认选中第一天
  const [activeDay, setActiveDay] = useState(0)

  // 分享弹窗状态
  const [shareOpen, setShareOpen] = useState(false)

  // 当前选中的活动索引（用于地图高亮）
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)

  // 获取当前选中天的活动列表
  const currentActivities = days[activeDay]?.activities ?? []

  // 切换 Day 时重置活动选中状态
  const handleDayChange = useCallback((val: string) => {
    setActiveDay(Number(val))
    setActiveIndex(undefined)
  }, [])

  return (
    <div className="flex flex-col gap-5">
      {/* 行程头部信息 - 带品牌色左边框装饰 */}
      <Card
        className="card-accent-left border-none"
        style={{
          boxShadow: 'var(--gonow-shadow)',
          borderRadius: 'var(--gonow-radius)',
          background: 'var(--gonow-card)',
        }}
      >
        <CardContent className="py-4 pl-6">
          <div className="flex flex-col gap-3">
            {/* 目的地 + 描述 + 分享按钮 */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--gonow-text)' }}>
                  {destination}
                </h2>
                {description && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <TripPDFExport trip={trip} />
                <Button
                size="sm"
                onClick={() => setShareOpen(true)}
                className="shrink-0 gap-1.5"
                style={{
                  backgroundColor: 'var(--gonow-primary)',
                  color: '#fff',
                  border: 'none',
                }}
              >
                {/* 分享图标 */}
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
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                分享
              </Button>
              </div>
            </div>

            {/* 基本信息 */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {startDate} ~ {endDate}
              </span>
              <span className="inline-flex items-center gap-1">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {travelers} 人
              </span>
              <span className="inline-flex items-center gap-1">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {totalDays} 天
              </span>
            </div>

            <Separator />

            {/* 预算概览 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--gonow-text)' }}>预算概览</span>
                <span className="text-sm text-muted-foreground">
                  已规划 <span className="font-semibold" style={{ color: 'var(--gonow-primary)' }}>¥{totalCost}</span> / 总预算 ¥{budget}
                </span>
              </div>

              {/* 预算进度条 - 品牌色渐变 */}
              <div className="h-2.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--gonow-primary-light)' }}>
                <div
                  className="h-full progress-gonow"
                  style={{
                    width: `${Math.min((totalCost / budget) * 100, 100)}%`,
                  }}
                />
              </div>

              {/* 各类别花费占比 */}
              <div className="flex flex-wrap gap-3 mt-3">
                {(Object.entries(costByType) as [ActivityType, number][]).map(
                  ([type, cost]) => {
                    const percent =
                      totalCost > 0 ? Math.round((cost / totalCost) * 100) : 0
                    return (
                      <div
                        key={type}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground"
                      >
                        <span
                          className={`inline-block h-2.5 w-2.5 rounded-sm ${typeColorMap[type]}`}
                        />
                        <span>
                          {typeLabelMap[type]} ¥{cost}
                        </span>
                        <span className="text-[10px]">({percent}%)</span>
                      </div>
                    )
                  },
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 天气栏 */}
      <WeatherBar
        destination={destination}
        startDate={startDate}
        endDate={endDate}
      />

      {/* 行程地图 */}
      <TripMap activities={currentActivities} activeIndex={activeIndex} />

      {/* 预算分解 */}
      <BudgetBreakdown trip={trip} />

      {/* Day 切换标签 + 当日行程 */}
      <Tabs
        value={String(activeDay)}
        onValueChange={handleDayChange}
      >
        <TabsList variant="line" className="w-full overflow-x-auto">
          {days.map((day) => (
            <TabsTrigger key={day.dayNumber} value={String(day.dayNumber - 1)}>
              Day {day.dayNumber}
            </TabsTrigger>
          ))}
        </TabsList>

        {days.map((day, index) => (
          <TabsContent key={day.dayNumber} value={String(index)}>
            <Card
              className="border-none"
              style={{
                boxShadow: 'var(--gonow-shadow-sm)',
                borderRadius: 'var(--gonow-radius)',
                background: 'var(--gonow-card)',
              }}
            >
              <CardContent className="py-4">
                <DayCard day={day} dayIndex={index} onActivityClick={setActiveIndex} />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* 分享弹窗 */}
      <ShareTripDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        trip={trip}
      />
    </div>
  )
}
