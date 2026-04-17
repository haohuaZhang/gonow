import { useEffect, useRef, useState, useCallback } from 'react'
import type { Activity, ActivityType } from '@/types'

// @ts-ignore - 高德地图全局类型声明
declare const AMap: any

interface TripMapProps {
  /** 当日活动列表 */
  activities: Activity[]
  /** 当前选中的活动索引 */
  activeIndex?: number
}

/** 活动类型颜色映射（与 ActivityIcon 一致） */
const typeColorMap: Record<ActivityType, string> = {
  scenic: '#3b82f6',   // blue-500
  food: '#f97316',     // orange-500
  hotel: '#a855f7',    // purple-500
  transport: '#9ca3af', // gray-400
  culture: '#ec4899',  // pink-500
}

/** 活动类型图标映射（与 ActivityIcon 一致） */
const typeIconMap: Record<ActivityType, string> = {
  scenic: '🏛️',
  food: '🍜',
  hotel: '🏨',
  transport: '🚗',
  culture: '🎭',
}

/** 品牌色 */
const BRAND_COLOR = '#000000'

/** 动态加载高德地图 JS API v2.0 */
function loadAMapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // 如果已经加载过，直接返回
    if ((window as any).AMap) {
      resolve()
      return
    }

    const key = import.meta.env.VITE_AMAP_KEY
    if (!key || key === 'your_amap_js_key_here') {
      reject(new Error('未配置高德地图 API Key'))
      return
    }

    // 检查是否已有加载中的 script 标签
    const existingScript = document.querySelector(
      `script[src*="webapi.amap.com/maps"]`
    )
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve())
      existingScript.addEventListener('error', () =>
        reject(new Error('高德地图 JS API 加载失败'))
      )
      return
    }

    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${key}`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('高德地图 JS API 加载失败'))
    document.head.appendChild(script)
  })
}

/** 骨架屏加载动画 */
function MapSkeleton() {
  return (
    <div className="relative w-full animate-pulse" style={{ height: 'clamp(300px, 40vw, 400px)' }}>
      {/* 模拟地图区域的骨架 */}
      <div className="absolute inset-0 rounded-2xl bg-muted/50">
        {/* 网格骨架线 */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute left-0 right-0 border-t border-muted-foreground/10"
              style={{ top: `${(i + 1) * 12}%` }}
            />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute top-0 bottom-0 border-l border-muted-foreground/10"
              style={{ left: `${(i + 1) * 10}%` }}
            />
          ))}
        </div>
        {/* 中心加载提示 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-muted-foreground/20 border-t-muted-foreground/60 animate-spin" />
          <span className="text-sm text-muted-foreground">地图加载中...</span>
        </div>
      </div>
    </div>
  )
}

/** 加载失败提示 */
function MapErrorFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      className="relative w-full flex flex-col items-center justify-center gap-4 bg-muted/30"
      style={{ height: 'clamp(300px, 40vw, 400px)' }}
    >
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <svg
          className="size-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
          />
        </svg>
        <p className="text-sm font-medium">地图加载失败</p>
        <p className="text-xs text-muted-foreground/70">请检查网络连接后重试</p>
      </div>
      <button
        onClick={onRetry}
        className="rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-background transition-colors hover:bg-foreground/80"
      >
        重新加载
      </button>
    </div>
  )
}

/** 无活动空状态 */
function MapEmptyState() {
  return (
    <div
      className="relative w-full flex items-center justify-center bg-muted/20"
      style={{ height: 'clamp(300px, 40vw, 400px)' }}
    >
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <svg
          className="size-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
        <p className="text-sm">暂无行程点位</p>
      </div>
    </div>
  )
}

/** 行程地图组件 - 真实高德地图实现 */
export function TripMap({ activities, activeIndex }: TripMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const polylineRef = useRef<any>(null)
  const infoWindowRef = useRef<any>(null)
  const [mapStatus, setMapStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  // 过滤出有经纬度的活动
  const validActivities = activities.filter(
    (a) => a.location?.lat && a.location?.lng
  )

  /** 初始化地图 */
  const initMap = useCallback(() => {
    if (!mapContainerRef.current) return

    setMapStatus('loading')

    loadAMapScript()
      .then(() => {
        if (!mapContainerRef.current) return

        // 确定地图中心点：使用第一个有效活动的坐标，否则默认北京
        const center =
          validActivities.length > 0
            ? [validActivities[0].location.lng, validActivities[0].location.lat]
            : [116.397428, 39.90923]

        const map = new AMap.Map(mapContainerRef.current, {
          zoom: 12,
          center,
          mapStyle: 'amap://styles/normal',
          resizeEnable: true,
          viewMode: '2D',
        })

        // 添加控件
        map.addControl(new AMap.Scale())
        map.addControl(new AMap.Zoom({
          position: 'RB',
        }))

        mapInstanceRef.current = map
        setMapStatus('ready')
      })
      .catch(() => {
        setMapStatus('error')
      })
  }, [validActivities])

  // 初始化地图
  useEffect(() => {
    initMap()

    return () => {
      // 销毁地图实例
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy()
        mapInstanceRef.current = null
      }
      markersRef.current = []
      polylineRef.current = null
      infoWindowRef.current = null
    }
  }, [initMap])

  // 使用 ResizeObserver 适配容器大小变化
  useEffect(() => {
    if (!mapContainerRef.current || mapStatus !== 'ready') return

    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.resize()
      }
    })

    resizeObserver.observe(mapContainerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [mapStatus])

  // 更新标记点和折线
  useEffect(() => {
    if (mapStatus !== 'ready' || !mapInstanceRef.current) return

    const map = mapInstanceRef.current

    // 清除旧标记
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    // 清除旧折线
    if (polylineRef.current) {
      polylineRef.current.setMap(null)
      polylineRef.current = null
    }

    // 清除旧信息窗口
    if (infoWindowRef.current) {
      infoWindowRef.current.close()
      infoWindowRef.current = null
    }

    if (validActivities.length === 0) return

    // 创建信息窗口实例（复用）
    const infoWindow = new AMap.InfoWindow({
      isCustom: true,
      offset: new AMap.Pixel(0, -40),
      autoMove: true,
    })
    infoWindowRef.current = infoWindow

    // 创建标记
    const newMarkers = validActivities.map((activity, index) => {
      const isActive = index === activeIndex
      const color = typeColorMap[activity.type]
      const icon = typeIconMap[activity.type]

      const marker = new AMap.Marker({
        position: [activity.location.lng, activity.location.lat],
        title: activity.name,
        zIndex: isActive ? 200 : 100,
        content: `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            transform: translate(-50%, -50%);
            cursor: pointer;
          ">
            ${isActive ? `<div style="
              background: ${BRAND_COLOR};
              color: #fff;
              padding: 3px 10px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 500;
              white-space: nowrap;
              margin-bottom: 4px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.25);
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            ">${activity.name}</div>` : ''}
            <div style="
              width: ${isActive ? 42 : 34}px;
              height: ${isActive ? 42 : 34}px;
              border-radius: 50%;
              background-color: ${color};
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: ${isActive ? 18 : 15}px;
              box-shadow: ${isActive ? `0 0 0 4px ${color}33, 0 4px 14px rgba(0,0,0,0.25)` : '0 2px 8px rgba(0,0,0,0.18)'};
              transition: all 0.3s ease;
              border: 2px solid rgba(255,255,255,0.8);
            ">
              ${icon}
            </div>
            <div style="
              margin-top: 3px;
              background: rgba(255,255,255,0.95);
              border: 1px solid rgba(0,0,0,0.08);
              border-radius: 9999px;
              padding: 1px 7px;
              font-size: 10px;
              font-weight: 700;
              line-height: 1.4;
              color: ${isActive ? BRAND_COLOR : '#666'};
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            ">${index + 1}</div>
          </div>
        `,
        offset: new AMap.Pixel(0, 0),
      })

      // 点击标记显示信息窗口
      marker.on('click', () => {
        const content = `
          <div style="
            padding: 14px 16px;
            min-width: 200px;
            max-width: 280px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            position: relative;
          ">
            <div style="
              position: absolute;
              bottom: -6px;
              left: 50%;
              transform: translateX(-50%) rotate(45deg);
              width: 12px;
              height: 12px;
              background: #fff;
              box-shadow: 2px 2px 4px rgba(0,0,0,0.08);
            "></div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="font-size: 20px;">${icon}</span>
              <h3 style="
                margin: 0;
                font-size: 14px;
                font-weight: 600;
                color: ${BRAND_COLOR};
                line-height: 1.3;
              ">${activity.name}</h3>
            </div>
            ${activity.description ? `<p style="
              margin: 0 0 8px 0;
              font-size: 12px;
              color: #666;
              line-height: 1.5;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
            ">${activity.description}</p>` : ''}
            <div style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-top: 8px;
              border-top: 1px solid #f0f0f0;
            ">
              <span style="
                font-size: 16px;
                font-weight: 700;
                color: ${color};
              ">¥${activity.cost}</span>
              ${activity.rating ? `<span style="
                font-size: 11px;
                color: #999;
              ">${'★'.repeat(Math.round(activity.rating))}${'☆'.repeat(5 - Math.round(activity.rating))} ${activity.rating}</span>` : ''}
            </div>
          </div>
        `

        infoWindow.setContent(content)
        infoWindow.open(map, marker.getPosition())
      })

      return marker
    })

    markersRef.current = newMarkers
    map.add(newMarkers)

    // 如果有多个活动，用折线连接
    if (validActivities.length >= 2) {
      const path = validActivities.map(
        (a) => [a.location.lng, a.location.lat]
      )

      const polyline = new AMap.Polyline({
        path,
        strokeColor: BRAND_COLOR,
        strokeWeight: 3,
        strokeOpacity: 0.4,
        strokeStyle: 'solid',
        lineJoin: 'round',
        lineCap: 'round',
        showDir: true,
      })

      polylineRef.current = polyline
      map.add(polyline)
    }

    // 自动调整视野以包含所有标记
    if (newMarkers.length > 0) {
      map.setFitView(newMarkers, false, [60, 60, 60, 60])
    }
  }, [mapStatus, validActivities, activeIndex])

  // 渲染
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {/* 地图容器 */}
      {mapStatus === 'loading' && <MapSkeleton />}

      {mapStatus === 'error' && <MapErrorFallback onRetry={initMap} />}

      {mapStatus === 'ready' && (
        <>
          {validActivities.length === 0 ? (
            <MapEmptyState />
          ) : (
            <div
              ref={mapContainerRef}
              className="relative w-full"
              style={{
                height: 'clamp(300px, 40vw, 400px)',
                borderRadius: '16px',
                overflow: 'hidden',
              }}
            />
          )}
        </>
      )}
    </div>
  )
}
