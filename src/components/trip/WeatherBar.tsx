import { useMemo, useState, useEffect } from 'react'
import type { WeatherInfo } from '@/types'
import { Card, CardContent } from '@/components/ui/card'

interface WeatherBarProps {
  destination: string
  startDate: string
  endDate: string
}

/** 天气图标映射 */
function getWeatherIcon(description: string): string {
  switch (description) {
    case '晴':
      return '\u2600\uFE0F'
    case '多云':
      return '\u26C5'
    case '阴':
      return '\u2601\uFE0F'
    case '小雨':
      return '\uD83C\uDF27\uFE0F'
    case '中雨':
      return '\uD83C\uDF27\uFE0F'
    case '大雨':
      return '\uD83C\uDF27\uFE0F'
    case '雷阵雨':
      return '\u26C8\uFE0F'
    default:
      return '\uD83C\uDF24\uFE0F'
  }
}

/** 穿衣建议映射 */
function getClothingAdvice(temperature: number): string {
  if (temperature >= 30) {
    return '炎热，建议穿短袖短裤，注意防晒'
  } else if (temperature >= 25) {
    return '温暖，建议穿轻薄衣物，可备薄外套'
  } else if (temperature >= 20) {
    return '舒适，建议穿长袖或薄外套'
  } else if (temperature >= 15) {
    return '微凉，建议穿外套或薄毛衣'
  } else if (temperature >= 10) {
    return '较冷，建议穿厚外套或毛衣'
  } else {
    return '寒冷，建议穿羽绒服，注意保暖'
  }
}

/** 根据目的地和日期生成 Mock 天气数据 */
function getMockWeather(destination: string, date: string): WeatherInfo {
  const month = new Date(date).getMonth() + 1

  // 根据目的地和月份生成合理的基准温度
  let baseTemp: number
  const dest = destination.toLowerCase()

  if (dest.includes('三亚') || dest.includes('海南') || dest.includes('海口')) {
    // 热带地区
    baseTemp = month >= 5 && month <= 9 ? 32 : 25
  } else if (dest.includes('哈尔滨') || dest.includes('长春') || dest.includes('冰雪')) {
    // 东北
    baseTemp = month >= 6 && month <= 8 ? 26 : month >= 12 || month <= 2 ? -10 : 10
  } else if (dest.includes('拉萨') || dest.includes('昆明') || dest.includes('大理')) {
    // 高原
    baseTemp = month >= 5 && month <= 9 ? 22 : 10
  } else if (dest.includes('北京') || dest.includes('天津') || dest.includes('河北')) {
    // 华北
    baseTemp = month >= 6 && month <= 8 ? 30 : month >= 12 || month <= 2 ? -2 : 15
  } else if (dest.includes('广州') || dest.includes('深圳') || dest.includes('汕头') || dest.includes('潮汕')) {
    // 华南
    baseTemp = month >= 5 && month <= 9 ? 30 : 18
  } else if (dest.includes('成都') || dest.includes('重庆') || dest.includes('长沙')) {
    // 西南/华中
    baseTemp = month >= 6 && month <= 8 ? 32 : month >= 12 || month <= 2 ? 8 : 18
  } else {
    // 默认
    baseTemp = month >= 5 && month <= 9 ? 28 : 18
  }

  const tempRange = 5
  const descriptions = ['晴', '多云', '阴', '小雨']
  // 用日期字符串作为简单种子，保证同一天天气一致
  const dateSeed = date.split('-').reduce((a, b) => a + parseInt(b), 0)

  return {
    description: descriptions[dateSeed % descriptions.length],
    temperature: baseTemp + (dateSeed % tempRange) - 2,
    humidity: 60 + (dateSeed % 30),
    wind: '东南风 3-4级',
  }
}

/** 使用本地日期格式化，避免 toISOString() 的 UTC 时区偏移 */
function toLocalDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** 生成日期范围内的所有日期 */
function getDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  const current = new Date(start)

  while (current <= end) {
    dates.push(toLocalDateString(current))
    current.setDate(current.getDate() + 1)
  }

  return dates
}

/** 格式化日期为 MM/DD */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}/${day}`
}

/** 获取星期几 */
function getWeekday(dateStr: string): string {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekdays[new Date(dateStr).getDay()]
}

/** 调用天气 API 获取真实天气数据 */
async function fetchWeatherData(city: string, date: string): Promise<WeatherInfo | null> {
  try {
    const params = new URLSearchParams({ city, date })
    const res = await fetch(`/api/weather?${params}`)

    if (!res.ok) {
      console.warn(`天气 API 请求失败: ${res.status}`)
      return null
    }

    const json = await res.json()

    if (!json.success || !json.data) {
      console.warn('天气 API 返回数据无效')
      return null
    }

    return json.data as WeatherInfo
  } catch (error) {
    console.warn('天气 API 调用异常:', error)
    return null
  }
}

/** 天气栏组件 */
export function WeatherBar({ destination, startDate, endDate }: WeatherBarProps) {
  // 生成日期范围
  const dates = useMemo(() => getDateRange(startDate, endDate), [startDate, endDate])

  // 天气数据状态
  const [weatherList, setWeatherList] = useState<WeatherInfo[]>([])
  const [loading, setLoading] = useState(false)

  // 尝试从 API 获取天气数据，失败时降级到 Mock
  useEffect(() => {
    if (!destination || dates.length === 0) return

    let cancelled = false
    setLoading(true)

    // 并行请求所有日期的天气
    const fetchAllWeather = async () => {
      const results = await Promise.all(
        dates.map(async (date) => {
          const data = await fetchWeatherData(destination, date)
          // API 失败时降级到 Mock
          return data || getMockWeather(destination, date)
        })
      )

      if (!cancelled) {
        setWeatherList(results)
        setLoading(false)
      }
    }

    fetchAllWeather()

    return () => {
      cancelled = true
    }
  }, [dates, destination])

  // 计算温度范围
  const temps = weatherList.map((w) => w.temperature)
  const minTemp = temps.length > 0 ? Math.min(...temps) : 0
  const maxTemp = temps.length > 0 ? Math.max(...temps) : 0

  // 穿衣建议（基于平均温度）
  const avgTemp = temps.length > 0
    ? Math.round(temps.reduce((a, b) => a + b, 0) / temps.length)
    : 20
  const clothingAdvice = getClothingAdvice(avgTemp)

  return (
    <Card>
      <CardContent className="py-3">
        <div className="flex flex-col gap-3">
          {/* 目的地 + 日期范围 + 温度概览 */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">
                {destination} 天气预报
              </div>
              <div className="text-xs text-muted-foreground">
                {startDate} ~ {endDate} | {minTemp}°C ~ {maxTemp}°C
              </div>
            </div>
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-md px-2 py-1">
              {clothingAdvice}
            </div>
          </div>

          {/* 加载状态 */}
          {loading && weatherList.length === 0 ? (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                加载天气数据中...
              </div>
            </div>
          ) : (
            /* 每日天气卡片（水平滚动） */
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {weatherList.map((weather, index) => (
                <div
                  key={dates[index]}
                  className="flex-shrink-0 flex flex-col items-center gap-1 bg-muted/40 rounded-lg px-3 py-2 min-w-[72px]"
                >
                  <span className="text-[10px] text-muted-foreground">
                    {getWeekday(dates[index])}
                  </span>
                  <span className="text-xs font-medium">
                    {formatDate(dates[index])}
                  </span>
                  <span className="text-xl leading-none">
                    {getWeatherIcon(weather.description)}
                  </span>
                  <span className="text-xs font-medium">{weather.temperature}°C</span>
                  <span className="text-[10px] text-muted-foreground">
                    {weather.description}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
