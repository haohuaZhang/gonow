/**
 * 美食推荐页面
 * 展示汕头美食推荐列表，使用 mock 数据
 */
import FoodRecommendList from '@/components/food/FoodRecommendList'
import { mockFoods } from '@/lib/mock-food-data'

export default function FoodPage() {
  return (
    <div className="mx-auto max-w-[480px] flex flex-col gap-6">
      {/* 页面标题 - 与其他页面风格统一 */}
      <div className="page-title-bar">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--gonow-text)' }}
        >
          美食推荐
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: 'var(--gonow-text-secondary)' }}
        >
          精选当地特色美食，红黑榜帮你避坑
        </p>
      </div>

      {/* 美食推荐列表（含搜索和筛选） */}
      <FoodRecommendList foods={mockFoods} title="美食推荐" />
    </div>
  )
}
