import { useCallback } from 'react'
import type { Trip, ActivityType } from '@/types'
import { injectPrintStyles } from './PrintStyles'

interface TripPDFExportProps {
  /** 行程数据 */
  trip: Trip
}

/** 活动类型 emoji 映射 */
const typeEmojiMap: Record<ActivityType, string> = {
  scenic: '🏛️',
  food: '🍜',
  hotel: '🏨',
  transport: '🚗',
  culture: '🎭',
}

/** 活动类型中文名映射 */
const typeLabelMap: Record<ActivityType, string> = {
  scenic: '景点',
  food: '美食',
  hotel: '住宿',
  transport: '交通',
  culture: '文化',
}

/**
 * 行程导出 PDF 组件
 *
 * 使用 window.print() + @media print CSS 实现高质量 PDF 导出。
 * 点击按钮后打开新窗口渲染格式化行程内容，并自动触发打印。
 */
export function TripPDFExport({ trip }: TripPDFExportProps) {
  const { destination, startDate, endDate, travelers, budget, days, weather } = trip

  const totalDays = days.length
  const totalCost = days.reduce((sum, day) => sum + day.totalCost, 0)

  /** 生成打印用的 HTML 内容 */
  const generatePrintHTML = useCallback(() => {
    // 按类别统计花费
    const costByType: Partial<Record<ActivityType, number>> = {}
    for (const day of days) {
      for (const activity of day.activities) {
        if (activity.cost > 0) {
          costByType[activity.type] = (costByType[activity.type] || 0) + activity.cost
        }
      }
    }

    // 收集所有红旗
    const allRedFlags: string[] = []
    const allBlackFlags: string[] = []
    for (const day of days) {
      for (const activity of day.activities) {
        if (activity.redBlackFlags?.redFlags) {
          allRedFlags.push(...activity.redBlackFlags.redFlags)
        }
        if (activity.redBlackFlags?.blackFlags) {
          allBlackFlags.push(...activity.redBlackFlags.blackFlags)
        }
      }
    }

    // 天气建议
    const weatherTips: string[] = []
    if (weather && weather.length > 0) {
      const avgTemp = Math.round(
        weather.reduce((sum, w) => sum + w.temperature, 0) / weather.length,
      )
      weatherTips.push(`行程期间平均气温约 ${avgTemp}°C，请根据天气准备合适的衣物。`)
      const hasRain = weather.some((w) =>
        w.description.includes('雨') || w.description.includes('Rain'),
      )
      if (hasRain) {
        weatherTips.push('部分日期可能有雨，建议携带雨具。')
      }
    }

    // 生成每日行程 HTML
    const daysHTML = days
      .map((day) => {
        const activitiesHTML = day.activities
          .map((activity) => {
            const emoji = typeEmojiMap[activity.type] || '📍'
            const timeStr =
              activity.startTime && activity.endTime
                ? `${activity.startTime} - ${activity.endTime}`
                : ''

            const flagsHTML = [
              ...(activity.redBlackFlags?.redFlags?.map(
                (f) => `<span class="print-red-flag">⚠ ${f}</span>`,
              ) || []),
              ...(activity.redBlackFlags?.blackFlags?.map(
                (f) => `<span class="print-black-flag">🚫 ${f}</span>`,
              ) || []),
            ].join('\n              ')

            return `
              <div class="print-activity-item">
                <div class="print-activity-name">${emoji} ${activity.name}</div>
                <div class="print-activity-meta">
                  ${timeStr ? `<span>🕐 ${timeStr}</span>` : ''}
                  ${activity.cost > 0 ? `<span class="print-activity-cost">¥${activity.cost}</span>` : ''}
                  ${activity.rating > 0 ? `<span>★ ${activity.rating.toFixed(1)}</span>` : ''}
                </div>
                ${activity.description ? `<div class="print-activity-desc">${activity.description}</div>` : ''}
                ${flagsHTML ? `\n              <div>${flagsHTML}</div>` : ''}
              </div>`
          })
          .join('\n')

        return `
          <div class="print-day-section">
            <div class="print-day-header">
              <span class="print-day-number">${day.dayNumber}</span>
              <span class="print-day-title">${day.theme}</span>
              <span class="print-day-date">${day.date}</span>
            </div>
            <div class="print-activity-list">
              ${activitiesHTML}
            </div>
            <div class="print-day-subtotal">
              当日小计：<strong>¥${day.totalCost}</strong>
            </div>
          </div>`
      })
      .join('\n')

    // 生成预算汇总表格 HTML
    const budgetRows = (Object.entries(costByType) as [ActivityType, number][])
      .filter(([, cost]) => cost > 0)
      .map(([type, cost]) => {
        const percent = totalCost > 0 ? Math.round((cost / totalCost) * 100) : 0
        return `
          <tr>
            <td>${typeEmojiMap[type]} ${typeLabelMap[type]}</td>
            <td>¥${cost}</td>
            <td>${percent}%</td>
          </tr>`
      })
      .join('\n')

    // 生成温馨提示 HTML
    const tipsHTML: string[] = []
    if (weatherTips.length > 0) {
      tipsHTML.push(...weatherTips.map((t) => `<div class="print-tip-item">🌤️ ${t}</div>`))
    }
    if (allRedFlags.length > 0) {
      tipsHTML.push(
        `<div class="print-tip-item">⚠️ 行程中有 ${allRedFlags.length} 项需要注意的红旗提醒，请提前了解详情并做好备选方案。</div>`,
      )
    }
    if (allBlackFlags.length > 0) {
      tipsHTML.push(
        `<div class="print-tip-item">🚫 行程中有 ${allBlackFlags.length} 项严重警告，请务必确认后再前往。</div>`,
      )
    }
    if (tipsHTML.length === 0) {
      tipsHTML.push(
        `<div class="print-tip-item">✨ 祝您旅途愉快！建议提前预订热门景点门票。</div>`,
      )
    }

    return `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GoNow 旅行行程单 - ${destination}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #1A1A2E;
            background: #FFFFFF;
            padding: 0;
          }
          .print-container {
            max-width: 180mm;
            margin: 0 auto;
            padding: 10mm 0;
          }
          .no-print {
            display: none;
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <!-- 标题区域 -->
          <div class="print-header">
            <h1>GoNow 旅行行程单</h1>
            <p class="subtitle">${destination} | ${startDate} ~ ${endDate}</p>
          </div>

          <!-- 行程概览 -->
          <div class="print-overview">
            <div class="print-overview-item">
              <div class="value">${totalDays}</div>
              <div class="label">行程天数</div>
            </div>
            <div class="print-overview-item">
              <div class="value">${travelers}</div>
              <div class="label">旅行人数</div>
            </div>
            <div class="print-overview-item">
              <div class="value">¥${budget}</div>
              <div class="label">总预算</div>
            </div>
            <div class="print-overview-item">
              <div class="value">¥${totalCost}</div>
              <div class="label">预计花费</div>
            </div>
          </div>

          <!-- 每日行程 -->
          ${daysHTML}

          <!-- 预算汇总 -->
          <div class="print-budget-section">
            <div class="print-budget-title">预算汇总</div>
            <table class="print-budget-table">
              <thead>
                <tr>
                  <th>类别</th>
                  <th>花费</th>
                  <th>占比</th>
                </tr>
              </thead>
              <tbody>
                ${budgetRows}
                <tr class="total-row">
                  <td>合计</td>
                  <td>¥${totalCost}</td>
                  <td>100%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 温馨提示 -->
          <div class="print-tips-section">
            <div class="print-tips-title">温馨提示</div>
            ${tipsHTML.join('\n')}
          </div>

          <!-- 页脚 -->
          <div class="print-footer">
            <span class="brand">GoNow</span> 智能旅行规划 · 由 AI 智能规划生成
          </div>
        </div>

        <!-- 打印控制按钮（不打印） -->
        <div class="no-print" style="
          position: fixed;
          top: 20px;
          right: 20px;
          display: flex;
          gap: 10px;
          z-index: 9999;
        ">
          <button onclick="window.print()" style="
            padding: 10px 24px;
            background: linear-gradient(135deg, #FF6B35, #FF8F65);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
          ">
            🖨️ 打印 / 保存 PDF
          </button>
          <button onclick="window.close()" style="
            padding: 10px 24px;
            background: #F0F0F0;
            color: #666;
            border: none;
            border-radius: 10px;
            font-size: 14px;
            cursor: pointer;
          ">
            关闭
          </button>
        </div>
      </body>
      </html>`
  }, [trip, destination, startDate, endDate, travelers, budget, days, weather, totalCost])

  /** 处理导出 */
  const handleExport = useCallback(() => {
    const html = generatePrintHTML()
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('无法打开打印窗口，请检查浏览器是否阻止了弹出窗口。')
      return
    }

    printWindow.document.write(html)
    printWindow.document.close()

    // 等待内容加载完成后注入打印样式
    printWindow.onload = () => {
      injectPrintStyles(printWindow.document)
    }

    // 备用：直接注入（某些浏览器 onload 不触发）
    setTimeout(() => {
      injectPrintStyles(printWindow.document)
    }, 500)
  }, [generatePrintHTML])

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:-translate-y-px"
      style={{
        background: 'linear-gradient(135deg, #FF6B35, #FF8F65)',
        boxShadow: '0 2px 8px rgba(255, 107, 53, 0.25)',
      }}
      title="导出行程为 PDF"
    >
      {/* 下载图标 */}
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
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      导出 PDF
    </button>
  )
}
