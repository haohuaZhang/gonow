/**
 * 目的地推荐页面
 * 根据用户偏好智能推荐目的地
 * 支持搜索、筛选、排序、详情查看
 */
import { useState, useEffect } from 'react'
import DestinationGrid from '@/components/destination/DestinationGrid'
import DestinationDetail from '@/components/destination/DestinationDetail'
import { mockDestinations } from '@/lib/mock-destination-data'
import type { Destination } from '@/types'

export default function DestinationPage() {
  // 动态数据 + mock 回退：优先从 API 加载数据，失败时使用 mock 数据
  const [destinations, setDestinations] = useState<Destination[]>(mockDestinations)
  const [loading, setLoading] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    fetch('/.netlify/functions/fetch-trending', { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const { destinationRank, trendingDestinations } = json.data
          if (destinationRank && trendingDestinations) {
            const sorted = [...mockDestinations]
              .map((dest) => ({
                ...dest,
                trendingReason: trendingDestinations[dest.id] || dest.trendingReason,
              }))
              .sort((a, b) => (destinationRank[a.id] ?? 999) - (destinationRank[b.id] ?? 999))
            setDestinations(sorted)
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
    <div className="flex flex-col gap-6">
      {/* 页面标题 */}
      <div className="page-title-bar">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--gonow-text)' }}
        >
          目的地推荐
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: 'var(--gonow-text-secondary)' }}
        >
          根据你的旅行风格，发现最适合你的目的地
        </p>
      </div>

      {/* 内容区域 - 列表或详情切换 */}
      {selectedDestination ? (
        <DestinationDetail
          destination={selectedDestination}
          onBack={() => setSelectedDestination(null)}
        />
      ) : (
        <>
          {loading && (
            <div className="text-center text-sm py-2" style={{ color: 'var(--gonow-text-secondary)' }}>
              加载中...
            </div>
          )}
          <DestinationGrid
            destinations={destinations}
            onSelect={(dest) => setSelectedDestination(dest)}
          />
        </>
      )}
    </div>
  )
}
