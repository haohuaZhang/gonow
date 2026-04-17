/**
 * 美食推荐页面
 * 展示汕头美食推荐列表，优先从 API 加载，失败时回退到 mock 数据
 */
import { useState, useEffect } from 'react'
import FoodRecommendList from '@/components/food/FoodRecommendList'
import { mockFoods } from '@/lib/mock-food-data'
import type { FoodRecommendation } from '@/types'

export default function FoodPage() {
  // 动态数据 + mock 回退：优先从 API 加载数据，失败时使用 mock 数据
  const [foods, setFoods] = useState<FoodRecommendation[]>(mockFoods)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    fetch('/.netlify/functions/fetch-trending', { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const { foodCityRank, trendingFoodCities } = json.data
          if (foodCityRank && trendingFoodCities) {
            const sorted = [...mockFoods]
              .map((food) => ({
                ...food,
                trendingReason: trendingFoodCities[food.city || ''] || food.trendingReason,
              }))
              .sort((a, b) => (foodCityRank[a.city || ''] ?? 999) - (foodCityRank[b.city || ''] ?? 999))
            setFoods(sorted)
          }
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.warn('Failed to fetch trending data, using mock data:', err)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

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

      {/* 加载提示 */}
      {loading && (
        <div className="text-center text-sm py-2" style={{ color: 'var(--gonow-text-secondary)' }}>
          加载中...
        </div>
      )}

      {/* 美食推荐列表（含搜索和筛选） */}
      <FoodRecommendList foods={foods} title="美食推荐" />
    </div>
  )
}
