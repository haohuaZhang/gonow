import { useParams, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import type { Trip } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DayCard } from '@/components/trip/DayCard'

/** Mock 行程数据（开发期使用） */
const MOCK_TRIPS: Record<string, Trip> = {
  'shared-trip-001': {
    id: 'shared-trip-001',
    destination: '东京',
    startDate: '2025-04-15',
    endDate: '2025-04-18',
    travelers: 2,
    budget: 15000,
    days: [
      {
        dayNumber: 1,
        theme: '东京经典探索',
        date: '2025-04-15',
        totalCost: 1200,
        actualCost: 0,
        activities: [
          {
            id: 'act-1',
            type: 'scenic',
            name: '浅草寺',
            location: { name: '浅草寺', lat: 35.7148, lng: 139.7967, address: '东京都台东区浅草2-3-1' },
            cost: 0,
            rating: 4.5,
            description: '东京最古老的寺庙，雷门大灯笼是必拍地标',
            duration: 90,
            startTime: '09:00',
            endTime: '10:30',
          },
          {
            id: 'act-2',
            type: 'food',
            name: '一兰拉面 浅草店',
            location: { name: '一兰拉面', lat: 35.7118, lng: 139.7985, address: '东京都台东区西浅草3-28-5' },
            cost: 100,
            rating: 4.3,
            description: '日本知名连锁拉面店，浓郁豚骨汤底',
            duration: 45,
            startTime: '11:00',
            endTime: '11:45',
          },
          {
            id: 'act-3',
            type: 'scenic',
            name: '东京晴空塔',
            location: { name: '东京晴空塔', lat: 35.7101, lng: 139.8107, address: '东京都墨田区押上1-1-2' },
            cost: 200,
            rating: 4.6,
            description: '634米高的电波塔，可俯瞰整个东京',
            duration: 120,
            startTime: '13:00',
            endTime: '15:00',
          },
          {
            id: 'act-4',
            type: 'culture',
            name: '秋叶原电器街',
            location: { name: '秋叶原', lat: 35.7023, lng: 139.7745, address: '东京都千代田区外神田1丁目' },
            cost: 500,
            rating: 4.2,
            description: '动漫、电子产品天堂',
            duration: 120,
            startTime: '15:30',
            endTime: '17:30',
          },
          {
            id: 'act-5',
            type: 'food',
            name: '居酒屋晚餐',
            location: { name: '新宿思い出横丁', lat: 35.6938, lng: 139.6989, address: '东京都新宿区西新宿1-1' },
            cost: 400,
            rating: 4.4,
            description: '体验正宗日式居酒屋文化',
            duration: 90,
            startTime: '18:30',
            endTime: '20:00',
          },
        ],
        weather: { description: '晴', temperature: 20, humidity: 55 },
      },
      {
        dayNumber: 2,
        theme: '文化深度体验',
        date: '2025-04-16',
        totalCost: 800,
        actualCost: 0,
        activities: [
          {
            id: 'act-6',
            type: 'culture',
            name: '明治神宫',
            location: { name: '明治神宫', lat: 35.6764, lng: 139.6993, address: '东京都涩谷区代代木神园町1-1' },
            cost: 0,
            rating: 4.7,
            description: '供奉明治天皇的神社，被森林环绕',
            duration: 90,
            startTime: '09:00',
            endTime: '10:30',
          },
          {
            id: 'act-7',
            type: 'scenic',
            name: '原宿竹下通',
            location: { name: '竹下通', lat: 35.6702, lng: 139.7026, address: '东京都涩谷区神宫前1丁目' },
            cost: 300,
            rating: 4.0,
            description: '日本年轻人的潮流圣地',
            duration: 120,
            startTime: '11:00',
            endTime: '13:00',
          },
          {
            id: 'act-8',
            type: 'food',
            name: '表参道咖啡甜点',
            location: { name: '表参道', lat: 35.6645, lng: 139.7129, address: '东京都港区北青山3丁目' },
            cost: 150,
            rating: 4.5,
            description: '高端甜品店聚集地',
            duration: 60,
            startTime: '14:00',
            endTime: '15:00',
          },
          {
            id: 'act-9',
            type: 'scenic',
            name: '涩谷十字路口',
            location: { name: '涩谷十字路口', lat: 35.6595, lng: 139.7004, address: '东京都涩谷区涩谷2丁目' },
            cost: 0,
            rating: 4.3,
            description: '世界最繁忙的十字路口',
            duration: 60,
            startTime: '16:00',
            endTime: '17:00',
          },
          {
            id: 'act-10',
            type: 'food',
            name: '涩谷烤肉晚餐',
            location: { name: '焼肉ライク 涩谷店', lat: 35.6612, lng: 139.6987, address: '东京都涩谷区' },
            cost: 350,
            rating: 4.1,
            description: '高性价比和牛烤肉',
            duration: 90,
            startTime: '18:00',
            endTime: '19:30',
          },
        ],
        weather: { description: '多云', temperature: 18, humidity: 60 },
      },
      {
        dayNumber: 3,
        theme: '自然与购物',
        date: '2025-04-17',
        totalCost: 1500,
        actualCost: 0,
        activities: [
          {
            id: 'act-11',
            type: 'scenic',
            name: '上野公园',
            location: { name: '上野公园', lat: 35.7146, lng: 139.7732, address: '东京都台东区上野公园' },
            cost: 0,
            rating: 4.4,
            description: '东京最大的公园，春季赏樱胜地',
            duration: 90,
            startTime: '09:00',
            endTime: '10:30',
          },
          {
            id: 'act-12',
            type: 'culture',
            name: '东京国立博物馆',
            location: { name: '东京国立博物馆', lat: 35.7189, lng: 139.7765, address: '东京都台东区上野公园13-9' },
            cost: 50,
            rating: 4.6,
            description: '日本最大的博物馆，收藏丰富',
            duration: 120,
            startTime: '10:30',
            endTime: '12:30',
          },
          {
            id: 'act-13',
            type: 'food',
            name: '阿美横丁午餐',
            location: { name: '阿美横丁', lat: 35.7125, lng: 139.7768, address: '东京都台东区上野4-7-7' },
            cost: 80,
            rating: 4.0,
            description: '热闹的市场街，各种平价美食',
            duration: 60,
            startTime: '12:30',
            endTime: '13:30',
          },
          {
            id: 'act-14',
            type: 'scenic',
            name: '银座购物',
            location: { name: '银座', lat: 35.6717, lng: 139.7649, address: '东京都中央区银座' },
            cost: 1000,
            rating: 4.2,
            description: '日本最高端的购物区',
            duration: 180,
            startTime: '14:00',
            endTime: '17:00',
          },
          {
            id: 'act-15',
            type: 'food',
            name: '银座寿司 Omakase',
            location: { name: '银座寿司', lat: 35.6694, lng: 139.7631, address: '东京都中央区银座6丁目' },
            cost: 370,
            rating: 4.8,
            description: '顶级寿司体验',
            duration: 90,
            startTime: '18:00',
            endTime: '19:30',
          },
        ],
        weather: { description: '晴', temperature: 22, humidity: 50 },
      },
    ],
    status: 'confirmed',
    coverImage: '',
    description: '东京三日深度游，涵盖经典景点、美食与文化体验',
    createdAt: '2025-04-10T08:00:00.000Z',
    updatedAt: '2025-04-10T08:00:00.000Z',
  },
}

/**
 * 分享行程页面
 * 公开访问，无需登录
 * 从 URL 参数获取 tripId，展示行程详情
 */
export default function SharedTripPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()

  // 查找行程数据：优先从 localStorage 读取，找不到则使用 Mock 数据
  const trip = useMemo<Trip | null>(() => {
    if (!tripId) return null

    // 尝试从 localStorage 读取
    try {
      const stored = localStorage.getItem('gonow-trip-storage')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.state?.currentTrip?.id === tripId) {
          return parsed.state.currentTrip as Trip
        }
      }
    } catch {
      // localStorage 读取失败，继续使用 Mock 数据
    }

    // 使用 Mock 数据
    return MOCK_TRIPS[tripId] ?? null
  }, [tripId])

  // 计算行程天数
  const totalDays = trip?.days.length ?? 0

  // 未找到行程
  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-4xl opacity-50">
          {/* 行李箱图标 */}
          <svg
            className="size-16 mx-auto text-muted-foreground/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25V6.75a1.5 1.5 0 011.5-1.5h13.5a1.5 1.5 0 011.5 1.5v7.5m-16.5 0h16.5"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-medium text-lg">行程不存在或已过期</p>
          <p className="text-sm text-muted-foreground mt-1">
            该分享链接可能已失效，请联系分享者获取新链接
          </p>
        </div>
        <Button onClick={() => navigate('/')}>返回首页</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 行程概览 */}
      <Card>
        <CardContent className="py-5">
          <div className="flex flex-col gap-3">
            {/* 目的地 */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {trip.destination}
              </h1>
              {trip.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {trip.description}
                </p>
              )}
            </div>

            {/* 基本信息 */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <svg
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {trip.startDate} ~ {trip.endDate}
              </span>
              <span className="inline-flex items-center gap-1">
                <svg
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {trip.travelers} 人
              </span>
              <span className="inline-flex items-center gap-1">
                <svg
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {totalDays} 天
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 每日行程 */}
      <div className="flex flex-col gap-4">
        {trip.days.map((day, index) => (
          <Card key={day.dayNumber}>
            <CardContent className="py-4">
              <DayCard day={day} dayIndex={index} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* 底部水印 */}
      <div className="flex flex-col items-center gap-4 py-4">
        <p className="text-sm text-muted-foreground">
          由 GoNow 智能旅行规划助手生成
        </p>
        <Button onClick={() => navigate('/')}>
          {/* 火箭图标 */}
          <svg
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
            />
          </svg>
          打开 GoNow 开始规划
        </Button>
      </div>
    </div>
  )
}
