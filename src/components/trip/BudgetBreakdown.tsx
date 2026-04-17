import { useMemo } from 'react'
import type { Trip, ActivityType } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BudgetBreakdownProps {
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

/** 活动类型 emoji 映射 */
const typeEmojiMap: Record<ActivityType, string> = {
  food: '\uD83C\uDF5C',
  scenic: '\uD83C\uDFDB\uFE0F',
  transport: '\uD83D\uDE97',
  hotel: '\uD83C\uDFE8',
  culture: '\uD83C\uDFAD',
}

/** 预算类别颜色（Tailwind 类名） */
const typeColorMap: Record<ActivityType, string> = {
  scenic: 'bg-blue-500',
  food: 'bg-orange-500',
  hotel: 'bg-purple-500',
  transport: 'bg-gray-400',
  culture: 'bg-pink-500',
}

/** "其他"类别（非 ActivityType 的花费） */
const OTHER_KEY = 'other' as const
const OTHER_LABEL = '其他'
const OTHER_EMOJI = '\uD83D\uDED2'
const OTHER_COLOR = 'bg-emerald-500'

/** 所有展示类别（含"其他"） */
type DisplayCategory = ActivityType | typeof OTHER_KEY

/** 省钱建议规则 */
function getSavingTips(
  costByType: Partial<Record<DisplayCategory, number>>,
  totalCost: number,
  budget: number,
): string[] {
  const tips: string[] = []

  if (totalCost === 0) return tips

  // 美食占比过高
  const foodPercent = ((costByType.food || 0) / totalCost) * 100
  if (foodPercent > 50) {
    tips.push(
      '\uD83D\uDCB0 美食占比超过 50%，可以尝试当地小吃街或平价餐厅，人均 30 元也能吃到地道美食。',
    )
  }

  // 交通占比过高
  const transportPercent = ((costByType.transport || 0) / totalCost) * 100
  if (transportPercent > 30) {
    tips.push(
      '\uD83D\uDE97 交通花费偏高，建议使用公共交通或拼车出行，能节省不少费用。',
    )
  }

  // 预算紧张
  const remaining = budget - totalCost
  if (remaining < budget * 0.2 && remaining > 0) {
    tips.push(
      '\u26A0\uFE0F 预算剩余不足 20%，建议优先保留核心景点，适当减少非必要消费。',
    )
  }

  // 超支
  if (remaining < 0) {
    tips.push(
      '\uD83D\uDD34 当前已超出预算，建议砍掉部分低评分活动或寻找免费替代景点。',
    )
  }

  // 没有住宿花费的提示
  if (!costByType.hotel || costByType.hotel === 0) {
    tips.push(
      '\uD83C\uDFE8 当前行程未包含住宿费用，记得提前预订酒店并纳入预算哦。',
    )
  }

  // 最多返回 2 条
  return tips.slice(0, 2)
}

/** 预算分解组件 */
export function BudgetBreakdown({ trip }: BudgetBreakdownProps) {
  const { budget, days } = trip

  // 计算总花费
  const totalCost = useMemo(
    () => days.reduce((sum, day) => sum + day.totalCost, 0),
    [days],
  )

  // 剩余预算
  const remaining = budget - totalCost

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
    return map as Partial<Record<DisplayCategory, number>>
  }, [days])

  // 每日花费
  const dailyCosts = useMemo(
    () => days.map((day) => day.totalCost),
    [days],
  )

  // 最大日花费（用于柱状图高度计算）
  const maxDailyCost = Math.max(...dailyCosts, 1)

  // 省钱建议
  const tips = useMemo(
    () => getSavingTips(costByType, totalCost, budget),
    [costByType, totalCost, budget],
  )

  // 构建展示类别列表（只显示有花费的类别）
  const displayCategories = useMemo(() => {
    const categories: DisplayCategory[] = []
    for (const type of Object.keys(typeLabelMap) as ActivityType[]) {
      if ((costByType[type] || 0) > 0) {
        categories.push(type)
      }
    }
    // 如果存在"其他"类别也加上
    if ((costByType[OTHER_KEY] || 0) > 0) {
      categories.push(OTHER_KEY)
    }
    return categories
  }, [costByType])

  // 预算使用百分比
  const usagePercent = budget > 0 ? Math.min((totalCost / budget) * 100, 100) : 0

  // 进度条颜色：绿色（<60%）-> 黄色（60-85%）-> 红色（>85%）
  const progressColor =
    usagePercent > 85
      ? 'bg-red-500'
      : usagePercent > 60
        ? 'bg-yellow-500'
        : 'bg-green-500'

  return (
    <Card>
      <CardHeader>
        <CardTitle>预算分解</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* 总预算 vs 实际花费 */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-xs text-muted-foreground">总预算</div>
            <div className="text-lg font-bold">¥{budget}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">已花费</div>
            <div className="text-lg font-bold text-orange-500">
              ¥{totalCost}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">
              {remaining >= 0 ? '剩余' : '超支'}
            </div>
            <div
              className={`text-lg font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-500'}`}
            >
              {remaining >= 0 ? '¥' : '-¥'}
              {Math.abs(remaining)}
            </div>
          </div>
        </div>

        {/* 花费进度条 */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">预算使用率</span>
            <span className="text-xs font-medium">
              {Math.round(usagePercent)}%
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>

        {/* 分类花费列表 */}
        <div>
          <div className="text-sm font-medium mb-2">分类花费</div>
          <div className="flex flex-col gap-2">
            {displayCategories.map((category) => {
              const cost = costByType[category] || 0
              const percent =
                totalCost > 0 ? Math.round((cost / totalCost) * 100) : 0
              const isActivityType = category in typeLabelMap
              const label = isActivityType
                ? typeLabelMap[category as ActivityType]
                : OTHER_LABEL
              const emoji = isActivityType
                ? typeEmojiMap[category as ActivityType]
                : OTHER_EMOJI
              const colorClass = isActivityType
                ? typeColorMap[category as ActivityType]
                : OTHER_COLOR

              return (
                <div key={category} className="flex items-center gap-2">
                  <span className="text-base w-6 text-center shrink-0">
                    {emoji}
                  </span>
                  <span className="text-sm w-10 shrink-0">{label}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colorClass} transition-all duration-300`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap w-16 text-right">
                    ¥{cost}
                  </span>
                  <span className="text-[10px] text-muted-foreground w-8 text-right">
                    ({percent}%)
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* 每日花费趋势（CSS 柱状图） */}
        <div>
          <div className="text-sm font-medium mb-2">每日花费趋势</div>
          <div className="flex items-end gap-2 h-28">
            {dailyCosts.map((cost, index) => {
              const heightPercent =
                maxDailyCost > 0 ? (cost / maxDailyCost) * 100 : 0
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="text-[10px] text-muted-foreground">
                    ¥{cost}
                  </span>
                  <div className="w-full flex items-end" style={{ height: '80px' }}>
                    <div
                      className="w-full rounded-t-sm bg-primary/80 transition-all duration-300"
                      style={{ height: `${Math.max(heightPercent, 4)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Day {index + 1}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* 省钱建议 */}
        {tips.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">省钱建议</div>
            <div className="flex flex-col gap-1.5">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2"
                >
                  {tip}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
