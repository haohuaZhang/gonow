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

      {/* 搜索栏占位区域 */}
      <div className="search-bar-placeholder">
        <svg
          className="w-4 h-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span>搜索美食、餐厅、菜系...</span>
      </div>

      {/* 美食推荐列表 */}
      <FoodRecommendList foods={mockFoods} title="美食推荐" />
    </div>
  )
}
