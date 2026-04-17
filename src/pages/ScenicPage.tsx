import { useState, useMemo } from 'react'
import ScenicPlanCompare from '@/components/trip/ScenicPlanCompare'
import { mockScenicPlans } from '@/lib/mock-scenic-data'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

/**
 * 景点方案页面
 * 展示多个景点的多方案规划对比，支持城市和方案类型筛选
 */
export default function ScenicPage() {
  const [cityFilter, setCityFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // 综合过滤：城市 + 方案类型
  const filteredScenicPlans = useMemo(() => {
    let result = mockScenicPlans

    // 城市筛选
    if (cityFilter !== 'all') {
      result = result.filter((scenic) => scenic.city === cityFilter)
    }

    // 方案类型筛选：只保留包含该类型方案的景点，且只展示匹配的方案
    if (typeFilter !== 'all') {
      result = result
        .map((scenic) => ({
          ...scenic,
          plans: scenic.plans.filter((plan) => plan.planType === typeFilter),
        }))
        .filter((scenic) => scenic.plans.length > 0)
    }

    return result
  }, [cityFilter, typeFilter])

  return (
    <div className="space-y-8">
      {/* 页面标题 - 带品牌色装饰 */}
      <div className="page-title-bar">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--gonow-text)' }}
        >
          景点方案
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: 'var(--gonow-text-secondary)' }}
        >
          同一景点，多种游览方案，根据你的时间和预算自由选择
        </p>
      </div>

      {/* 筛选栏 */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <Select value={cityFilter} onValueChange={setCityFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="全部城市" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部城市</SelectItem>
            <SelectItem value="汕头">汕头</SelectItem>
            <SelectItem value="成都">成都</SelectItem>
            <SelectItem value="西安">西安</SelectItem>
            <SelectItem value="厦门">厦门</SelectItem>
            <SelectItem value="杭州">杭州</SelectItem>
            <SelectItem value="重庆">重庆</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="全部类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            <SelectItem value="mainstream">主流路线</SelectItem>
            <SelectItem value="budget">经济实惠</SelectItem>
            <SelectItem value="indepth">深度体验</SelectItem>
            <SelectItem value="special">特色玩法</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 景点方案列表 */}
      <div className="space-y-6">
        {filteredScenicPlans.length > 0 ? (
          filteredScenicPlans.map((scenic) => (
            <ScenicPlanCompare
              key={scenic.scenicName}
              scenicName={scenic.scenicName}
              plans={scenic.plans}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <span className="text-4xl mb-3">🏔️</span>
            <p className="text-sm">暂无匹配的景点方案</p>
          </div>
        )}
      </div>
    </div>
  )
}
