/**
 * 目的地推荐页面
 * 根据用户偏好智能推荐目的地
 * 支持搜索、筛选、排序、详情查看
 */
import { useState } from 'react'
import DestinationGrid from '@/components/destination/DestinationGrid'
import DestinationDetail from '@/components/destination/DestinationDetail'
import { mockDestinations } from '@/lib/mock-destination-data'
import type { Destination } from '@/types'

export default function DestinationPage() {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)

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
        <DestinationGrid
          destinations={mockDestinations}
          onSelect={(dest) => setSelectedDestination(dest)}
        />
      )}
    </div>
  )
}
