/**
 * 美食推荐列表组件
 * 展示多个美食推荐卡片，支持分类筛选
 */
import { useState } from 'react'
import FoodStoryCard from '@/components/food/FoodStoryCard'
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

  // 根据筛选标签过滤美食列表
  const filteredFoods = activeTag === '全部'
    ? foods
    : foods.filter((food) => {
        if (activeTag === '特色小吃') return food.cuisine.includes('小吃')
        if (activeTag === '必吃榜') return food.rating >= 4.6
        if (activeTag === '苍蝇馆') return food.avgCost <= 60
        if (activeTag === '本地人推荐') return (food.redBlackFlags?.credibilityScore ?? 0) >= 85
        return true
      })

  return (
    <div className="w-full">
      {/* 标题区域 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <span className="text-sm text-muted-foreground">{filteredFoods.length} 个推荐</span>
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
