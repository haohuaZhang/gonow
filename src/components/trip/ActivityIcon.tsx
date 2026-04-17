import type { ActivityType } from '@/types'
import { cn } from '@/lib/utils'

/** 活动类型图标映射 */
const iconMap: Record<
  ActivityType,
  { icon: string; color: string; label: string }
> = {
  scenic: { icon: '🏛️', color: 'bg-blue-100 text-blue-700', label: '景点' },
  food: { icon: '🍜', color: 'bg-orange-100 text-orange-700', label: '美食' },
  hotel: { icon: '🏨', color: 'bg-purple-100 text-purple-700', label: '住宿' },
  transport: {
    icon: '🚗',
    color: 'bg-gray-100 text-gray-700',
    label: '交通',
  },
  culture: { icon: '🎭', color: 'bg-pink-100 text-pink-700', label: '文化' },
}

interface ActivityIconProps {
  /** 活动类型 */
  type: ActivityType
  /** 尺寸：sm（小）或 md（中，默认） */
  size?: 'sm' | 'md'
}

/** 活动类型图标组件 */
export function ActivityIcon({ type, size = 'md' }: ActivityIconProps) {
  const { icon, color, label } = iconMap[type]

  const sizeClass =
    size === 'sm' ? 'h-7 w-7 text-sm' : 'h-9 w-9 text-base'

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full shrink-0',
        color,
        sizeClass,
      )}
      title={label}
      role="img"
      aria-label={label}
    >
      {icon}
    </div>
  )
}
