import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TripOverview } from '@/components/trip/TripOverview'
import { useTripStore } from '@/stores/tripStore'
import { getStorageSize, formatStorageSize } from '@/lib/storage'
import { useEffect, useState } from 'react'

/**
 * 行程页面
 * 从 tripStore 读取当前行程数据，展示行程或空状态
 */
export default function TripPage() {
  const currentTrip = useTripStore((s) => s.currentTrip)
  const trip = currentTrip
  const navigate = useNavigate()

  // 存储大小状态
  const [storageSizeText, setStorageSizeText] = useState('')

  useEffect(() => {
    // 定时刷新存储大小（每 2 秒）
    const updateSize = () => {
      const size = getStorageSize()
      setStorageSizeText(formatStorageSize(size))
    }
    updateSize()
    const timer = setInterval(updateSize, 10000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* 页面标题 - 带品牌色装饰 */}
      <div className="page-title-bar">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--gonow-text)' }}
        >
          我的行程
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: 'var(--gonow-text-secondary)' }}
        >
          通过 AI 对话生成你的专属旅行计划
        </p>
      </div>

      {/* 有行程时展示 TripOverview */}
      {trip ? (
        <TripOverview trip={trip} />
      ) : (
        /* 空状态 - 精致引导设计 */
        <Card
          className="border-none overflow-hidden"
          style={{
            boxShadow: 'var(--gonow-shadow)',
            borderRadius: 'var(--gonow-radius)',
            background: 'var(--gonow-card)',
          }}
        >
          <CardContent className="flex flex-col items-center justify-center py-16 gap-5 relative">
            {/* 插画风格背景装饰 */}
            <div className="empty-state-illustration flex flex-col items-center gap-4">
              {/* 主图标 - 带装饰圆环 */}
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full animate-pulse-soft"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)',
                    transform: 'scale(1.5)',
                  }}
                />
                <div
                  className="relative flex items-center justify-center w-20 h-20 rounded-full"
                  style={{ backgroundColor: 'var(--gonow-primary-light)' }}
                >
                  <span className="text-4xl">✈️</span>
                </div>
              </div>

              {/* 装饰小元素 */}
              <div className="flex items-center gap-3 opacity-40">
                <span className="text-lg animate-float">🗺️</span>
                <span className="text-sm animate-float-slow">📍</span>
                <span className="text-lg animate-float-fast">🎒</span>
              </div>
            </div>

            <div className="text-center relative z-10">
              <p
                className="font-semibold text-base mb-1"
                style={{ color: 'var(--gonow-text)' }}
              >
                还没有行程
              </p>
              <p
                className="text-sm mb-5"
                style={{ color: 'var(--gonow-text-secondary)' }}
              >
                回到首页开始规划你的第一次旅行吧
              </p>
              <Button
                onClick={() => navigate('/chat')}
                className="rounded-xl px-6 h-10 font-semibold"
                style={{
                  backgroundColor: 'var(--gonow-primary)',
                  color: 'white',
                }}
              >
                去规划旅行
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 底部存储信息提示 - 更优雅的设计 */}
      <div className="flex items-center justify-center gap-2 pt-2 pb-4">
        <svg
          className="w-3.5 h-3.5 shrink-0"
          style={{ color: 'var(--gonow-success)' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        <span className="text-xs" style={{ color: 'var(--gonow-text-muted)' }}>
          数据已自动保存到本地
          {storageSizeText && (
            <span className="ml-1 opacity-70">({storageSizeText})</span>
          )}
        </span>
      </div>
    </div>
  )
}
