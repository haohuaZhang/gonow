import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Wallet } from 'lucide-react'
import type { ScenicPlan } from '@/lib/mock-scenic-data'
import { planTypeConfig } from '@/lib/mock-scenic-data'

/**
 * 景点方案卡片属性
 */
interface ScenicPlanCardProps {
  /** 游览方案数据 */
  plan: ScenicPlan
  /** 是否选中 */
  isSelected?: boolean
  /** 选中回调 */
  onSelect?: () => void
}

/**
 * 景点方案卡片组件
 * 展示单个景点的游览方案，包含时长、费用、描述、亮点和贴士
 */
export default function ScenicPlanCard({ plan, isSelected = false, onSelect }: ScenicPlanCardProps) {
  const typeConfig = planTypeConfig[plan.planType]

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'ring-2 ring-primary shadow-md'
          : 'hover:shadow-sm'
      }`}
      onClick={onSelect}
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{plan.planName}</CardTitle>
          <Badge className={`${typeConfig.bgColor} ${typeConfig.color} border-transparent`}>
            {typeConfig.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 时长和费用 */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-4" />
            {plan.duration}
          </span>
          <span className="inline-flex items-center gap-1">
            <Wallet className="size-4" />
            {plan.cost === 0 ? '免费' : `约 ¥${plan.cost}`}
          </span>
        </div>

        {/* 方案描述 */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {plan.description}
        </p>

        {/* 亮点列表 */}
        <div className="space-y-1.5">
          <h4 className="text-sm font-medium">行程亮点</h4>
          <ul className="space-y-1">
            {plan.highlights.map((highlight, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-1.5">
                <span className="shrink-0 mt-0.5">✅</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 实用贴士 */}
        <div className="space-y-1.5">
          <h4 className="text-sm font-medium">实用贴士</h4>
          <ul className="space-y-1">
            {plan.tips.map((tip, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-1.5">
                <span className="shrink-0 mt-0.5">💡</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
