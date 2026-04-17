/**
 * 目的地网格列表组件
 * 包含搜索栏、旅行风格筛选、排序方式、响应式网格
 */
import { useState, useMemo } from 'react'
import DestinationCard from './DestinationCard'
import { travelStyleConfig } from './DestinationCard'
import type { Destination, TravelStyle } from '@/types'

interface DestinationGridProps {
  destinations: Destination[]
  onSelect: (destination: Destination) => void
}

/** 筛选标签 */
type FilterTag = 'all' | TravelStyle

const filterOptions: { key: FilterTag; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'food', label: '美食' },
  { key: 'culture', label: '文化' },
  { key: 'nature', label: '自然' },
  { key: 'family', label: '亲子' },
  { key: 'adventure', label: '冒险' },
  { key: 'romantic', label: '浪漫' },
  { key: 'budget', label: '穷游' },
  { key: 'luxury', label: '奢华' },
]

/** 排序方式 */
type SortOption = 'recommend' | 'rating' | 'cost' | 'food' | 'scenic'

const sortOptions: { key: SortOption; label: string }[] = [
  { key: 'recommend', label: '推荐' },
  { key: 'rating', label: '评分' },
  { key: 'cost', label: '性价比' },
  { key: 'food', label: '美食' },
  { key: 'scenic', label: '景色' },
]

export default function DestinationGrid({ destinations, onSelect }: DestinationGridProps) {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterTag>('all')
  const [activeSort, setActiveSort] = useState<SortOption>('recommend')

  const filteredDestinations = useMemo(() => {
    let result = [...destinations]

    // 搜索过滤
    if (search.trim()) {
      const keyword = search.trim().toLowerCase()
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(keyword) ||
          d.province.toLowerCase().includes(keyword) ||
          d.description.toLowerCase().includes(keyword)
      )
    }

    // 标签过滤
    if (activeFilter !== 'all') {
      result = result.filter((d) => d.tags.includes(activeFilter as TravelStyle))
    }

    // 排序
    switch (activeSort) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'cost':
        result.sort((a, b) => b.costScore - a.costScore)
        break
      case 'food':
        result.sort((a, b) => b.foodScore - a.foodScore)
        break
      case 'scenic':
        result.sort((a, b) => b.scenicScore - a.scenicScore)
        break
      case 'recommend':
      default:
        // 默认按综合评分排序
        result.sort((a, b) => b.rating - a.rating)
        break
    }

    return result
  }, [destinations, search, activeFilter, activeSort])

  return (
    <div className="flex flex-col gap-5">
      {/* 搜索栏 */}
      <div
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200"
        style={{
          background: 'var(--gonow-card)',
          border: '1.5px solid var(--gonow-border, #E5E7EB)',
          boxShadow: 'var(--gonow-shadow-sm)',
        }}
      >
        <svg
          className="w-4 h-4 shrink-0"
          style={{ color: 'var(--gonow-text-muted)' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="搜索目的地、城市..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          style={{ color: 'var(--gonow-text)' }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 旅行风格筛选标签 */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {filterOptions.map((option) => {
          const isActive = activeFilter === option.key
          const isAll = option.key === 'all'
          return (
            <button
              key={option.key}
              onClick={() => setActiveFilter(option.key)}
              className="shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200"
              style={{
                color: isActive
                  ? isAll
                    ? '#FFFFFF'
                    : travelStyleConfig[option.key as TravelStyle]?.color || '#FFFFFF'
                  : 'var(--gonow-text-secondary)',
                backgroundColor: isActive
                  ? isAll
                    ? 'var(--gonow-primary)'
                    : travelStyleConfig[option.key as TravelStyle]?.bg || 'var(--gonow-primary)'
                  : 'transparent',
                border: isActive
                  ? '1.5px solid transparent'
                  : '1.5px solid var(--gonow-border, #E5E7EB)',
              }}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      {/* 排序方式 */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--gonow-text-muted)' }}>
          共 {filteredDestinations.length} 个目的地
        </span>
        <div className="flex gap-1">
          {sortOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setActiveSort(option.key)}
              className="text-xs px-2.5 py-1 rounded-lg transition-all duration-200"
              style={{
                color: activeSort === option.key ? 'var(--gonow-primary)' : 'var(--gonow-text-muted)',
                backgroundColor: activeSort === option.key ? 'var(--gonow-primary-light)' : 'transparent',
                fontWeight: activeSort === option.key ? 600 : 400,
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 响应式网格 */}
      {filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDestinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onClick={onSelect}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="empty-state-illustration flex flex-col items-center gap-3">
            <span className="text-5xl mb-2">🌍</span>
            <p className="text-sm font-medium" style={{ color: 'var(--gonow-text-secondary)' }}>
              没有找到匹配的目的地
            </p>
            <p className="text-xs" style={{ color: 'var(--gonow-text-muted)' }}>
              试试调整筛选条件或搜索关键词
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
