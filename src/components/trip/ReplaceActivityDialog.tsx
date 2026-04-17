/**
 * 替换活动弹窗组件
 * 当用户想替换某个活动时，弹出推荐替代选项供选择
 */
import type { Activity, ActivityType } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ActivityIcon } from './ActivityIcon'

/** 替换活动弹窗 Props */
interface ReplaceActivityDialogProps {
  /** 弹窗是否打开 */
  open: boolean
  /** 弹窗开关回调 */
  onOpenChange: (open: boolean) => void
  /** 当前要替换的活动 */
  currentActivity: Activity
  /** 所在天索引 */
  dayIndex: number
  /** 替换回调：传入天索引、原活动 ID、新活动 */
  onReplace: (dayIndex: number, activityId: string, newActivity: Activity) => void
}

/** 活动类型中文标签映射 */
const typeLabels: Record<ActivityType, string> = {
  food: '美食',
  scenic: '景点',
  transport: '交通',
  culture: '文化',
  hotel: '住宿',
}

/** Mock 替换数据：根据活动类型提供 3 个推荐替代选项 */
const replacements: Record<ActivityType, Activity[]> = {
  food: [
    { id: 'r1', type: 'food', name: '老胡牛肉丸', cost: 35, rating: 4.5, description: '汕头老字号牛肉丸店', location: { name: '老胡牛肉丸', lat: 23.354, lng: 116.681, address: '汕头市金平区' }, redBlackFlags: { redFlags: ['饭点排队较长'], blackFlags: [], credibilityScore: 83 } },
    { id: 'r2', type: 'food', name: '广场豆花甜汤', cost: 10, rating: 4.3, description: '三十年老店，豆花细腻', location: { name: '广场豆花甜汤', lat: 23.355, lng: 116.680, address: '汕头市金平区' }, redBlackFlags: { redFlags: [], blackFlags: [], credibilityScore: 86 } },
    { id: 'r3', type: 'food', name: '飘香小吃店', cost: 25, rating: 4.4, description: '本地人推荐的潮汕小吃', location: { name: '飘香小吃店', lat: 23.352, lng: 116.683, address: '汕头市金平区' }, redBlackFlags: { redFlags: ['环境一般'], blackFlags: [], credibilityScore: 80 } },
  ],
  scenic: [
    { id: 'r4', type: 'scenic', name: '汕头开埠文化陈列馆', cost: 0, rating: 4.4, description: '了解汕头开埠历史', location: { name: '汕头开埠文化陈列馆', lat: 23.356, lng: 116.679, address: '汕头市金平区' }, redBlackFlags: { redFlags: ['周一闭馆'], blackFlags: [], credibilityScore: 88 } },
    { id: 'r5', type: 'scenic', name: '石炮台公园', cost: 0, rating: 4.2, description: '清代海防炮台遗址', location: { name: '石炮台公园', lat: 23.358, lng: 116.685, address: '汕头市金平区' }, redBlackFlags: { redFlags: [], blackFlags: [], credibilityScore: 85 } },
    { id: 'r6', type: 'scenic', name: '中信海滨花园', cost: 0, rating: 4.1, description: '海滨栈道散步好去处', location: { name: '中信海滨花园', lat: 23.360, lng: 116.690, address: '汕头市金平区' }, redBlackFlags: { redFlags: ['傍晚风大注意保暖'], blackFlags: [], credibilityScore: 78 } },
  ],
  transport: [
    { id: 'r7', type: 'transport', name: '步行前往', cost: 0, rating: 0, description: '步行约15分钟', location: { name: '', lat: 0, lng: 0 }, redBlackFlags: { redFlags: ['距离较远时不太建议'], blackFlags: [], credibilityScore: 70 } },
    { id: 'r8', type: 'transport', name: '公交前往', cost: 2, rating: 0, description: '乘坐公交约20分钟', location: { name: '', lat: 0, lng: 0 }, redBlackFlags: { redFlags: ['高峰期可能拥堵'], blackFlags: [], credibilityScore: 75 } },
    { id: 'r9', type: 'transport', name: '共享单车', cost: 5, rating: 0, description: '骑行约10分钟', location: { name: '', lat: 0, lng: 0 }, redBlackFlags: { redFlags: ['注意防晒'], blackFlags: [], credibilityScore: 72 } },
  ],
  culture: [
    { id: 'r10', type: 'culture', name: '汕头市博物馆', cost: 0, rating: 4.3, description: '了解汕头历史文化', location: { name: '汕头市博物馆', lat: 23.353, lng: 116.682, address: '汕头市金平区' }, redBlackFlags: { redFlags: ['周一闭馆'], blackFlags: [], credibilityScore: 87 } },
    { id: 'r11', type: 'culture', name: '老妈宫戏台', cost: 0, rating: 4.0, description: '潮剧表演场所', location: { name: '老妈宫戏台', lat: 23.354, lng: 116.680, address: '汕头市金平区' }, redBlackFlags: { redFlags: ['演出时间不固定'], blackFlags: [], credibilityScore: 76 } },
    { id: 'r12', type: 'culture', name: '汕头侨批文物馆', cost: 0, rating: 4.2, description: '世界记忆遗产侨批档案', location: { name: '汕头侨批文物馆', lat: 23.355, lng: 116.681, address: '汕头市金平区' }, redBlackFlags: { redFlags: [], blackFlags: [], credibilityScore: 84 } },
  ],
  hotel: [
    { id: 'r13', type: 'hotel', name: '汕头帝豪酒店', cost: 300, rating: 4.5, description: '市中心四星级酒店', location: { name: '汕头帝豪酒店', lat: 23.355, lng: 116.682, address: '汕头市金平区' }, redBlackFlags: { redFlags: ['节假日价格翻倍'], blackFlags: [], credibilityScore: 90 } },
    { id: 'r14', type: 'hotel', name: '如家快捷酒店', cost: 150, rating: 3.8, description: '经济型连锁酒店', location: { name: '如家快捷酒店', lat: 23.353, lng: 116.680, address: '汕头市金平区' }, redBlackFlags: { redFlags: ['隔音一般'], blackFlags: [], credibilityScore: 78 } },
    { id: 'r15', type: 'hotel', name: '汕头青旅民宿', cost: 100, rating: 4.2, description: '青年旅舍，氛围好', location: { name: '汕头青旅民宿', lat: 23.356, lng: 116.683, address: '汕头市金平区' }, redBlackFlags: { redFlags: ['需提前预订'], blackFlags: [], credibilityScore: 82 } },
  ],
}

/** 替换活动弹窗组件 */
export function ReplaceActivityDialog({
  open,
  onOpenChange,
  currentActivity,
  dayIndex,
  onReplace,
}: ReplaceActivityDialogProps) {
  const { name, type, cost } = currentActivity

  // 根据当前活动类型获取替代选项
  const options = replacements[type] ?? []

  /** 选择替代选项并执行替换 */
  const handleSelect = (newActivity: Activity) => {
    onReplace(dayIndex, currentActivity.id, newActivity)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>替换活动</DialogTitle>
          <DialogDescription>
            为当前活动选择一个替代方案
          </DialogDescription>
        </DialogHeader>

        {/* 当前活动信息 */}
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <ActivityIcon type={type} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{name}</p>
            <p className="text-xs text-muted-foreground">
              {typeLabels[type]} {cost > 0 && `· ¥${cost}`}
            </p>
          </div>
        </div>

        {/* 替代选项列表 */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground">
            推荐替代（{options.length} 个）
          </p>
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option)}
              className="flex items-center gap-3 rounded-lg border border-border/60 p-3 text-left transition-colors hover:bg-muted/50 active:bg-muted"
            >
              {/* 类型图标 */}
              <ActivityIcon type={option.type} size="sm" />

              {/* 活动信息 */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{option.name}</p>
                {option.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {option.description}
                  </p>
                )}
              </div>

              {/* 费用 + 评分 */}
              <div className="flex flex-col items-end shrink-0 gap-0.5">
                {option.cost > 0 && (
                  <span className="text-sm font-medium text-orange-600">
                    ¥{option.cost}
                  </span>
                )}
                {option.rating > 0 && (
                  <span className="text-xs text-amber-500">
                    ★ {option.rating.toFixed(1)}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
