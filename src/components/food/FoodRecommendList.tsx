/**
 * 美食推荐列表组件
 * 展示多个美食推荐卡片，支持搜索、城市筛选和分类筛选
 */
import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import FoodStoryCard from '@/components/food/FoodStoryCard'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import type { FoodRecommendation } from '@/types'

interface FoodRecommendListProps {
  foods: FoodRecommendation[]
  title?: string
}

/** 筛选标签类型 */
type FilterTag = '全部' | '苍蝇馆' | '必吃榜' | '本地人推荐' | '特色小吃'

const filterTags: FilterTag[] = ['全部', '苍蝇馆', '必吃榜', '本地人推荐', '特色小吃']

export default function FoodRecommendList({ foods, title = '美食推荐' }: FoodRecommendListProps) {
  const [activeTag, setActiveTag] = useState<FilterTag>('全部')
  const [searchQuery, setSearchQuery] = useState('')
  const [cityFilter, setCityFilter] = useState('all')

  // 综合过滤：搜索 + 城市 + 标签
  const filteredFoods = useMemo(() => {
    let result = foods

    // 城市筛选
    if (cityFilter !== 'all') {
      result = result.filter((food) => food.city === cityFilter)
    }

    // 标签筛选
    if (activeTag !== '全部') {
      result = result.filter((food) => {
        if (activeTag === '特色小吃') return food.cuisine.includes('小吃')
        if (activeTag === '必吃榜') return food.rating >= 4.6
        if (activeTag === '苍蝇馆') return food.avgCost <= 60
        if (activeTag === '本地人推荐') return (food.redBlackFlags?.credibilityScore ?? 0) >= 85
        return true
      })
    }

    // 搜索过滤：模糊匹配 name、description(story)、cuisine 字段
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      result = result.filter((food) => {
        return (
          food.name.toLowerCase().includes(query) ||
          food.story.toLowerCase().includes(query) ||
          food.cuisine.toLowerCase().includes(query)
        )
      })
    }

    return result
  }, [foods, activeTag, searchQuery, cityFilter])

  return (
    <div className="w-full">
      {/* 标题区域 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <span className="text-sm text-muted-foreground">{filteredFoods.length} 个推荐</span>
      </div>

      {/* 搜索栏和城市筛选 */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索美食名称、描述..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={cityFilter} onValueChange={setCityFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="全部城市" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部城市</SelectItem>
            <SelectItem value="汕头">汕头</SelectItem>
            <SelectItem value="成都">成都</SelectItem>
            <SelectItem value="长沙">长沙</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 筛选标签 */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        {filterTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              activeTag === tag
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 卡片列表 */}
      {filteredFoods.length > 0 ? (
        <div className="flex flex-col gap-6">
          {filteredFoods.map((food) => (
            <FoodStoryCard key={food.id} food={food} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <span className="text-4xl mb-3">🍽️</span>
          <p className="text-sm">暂无推荐</p>
        </div>
      )}
    </div>
  )
}
