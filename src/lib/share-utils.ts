/**
 * GoNow 社交分享工具函数
 * 包含分享链接生成、社交平台分享、Canvas 分享卡片生成等功能
 */

import type { Trip } from '@/types'

/** 生成分享链接 */
export function generateShareUrl(tripId: string): string {
  return `${window.location.origin}/shared/${tripId}`
}

/** 打开微博分享页面 */
export function shareToWeibo(url: string, title: string): void {
  const shareUrl = new URL('https://service.weibo.com/share/share.php')
  shareUrl.searchParams.set('url', url)
  shareUrl.searchParams.set('title', title)
  window.open(shareUrl.toString(), '_blank', 'width=600,height=500')
}

/** 打开 QQ 分享页面 */
export function shareToQQ(url: string, title: string, summary: string): void {
  const shareUrl = new URL('https://connect.qq.com/widget/shareqq/index.html')
  shareUrl.searchParams.set('url', url)
  shareUrl.searchParams.set('title', title)
  shareUrl.searchParams.set('summary', summary)
  window.open(shareUrl.toString(), '_blank', 'width=600,height=500')
}

/** 计算行程天数 */
function calcTripDays(trip: Trip): number {
  const start = new Date(trip.startDate)
  const end = new Date(trip.endDate)
  const diffMs = end.getTime() - start.getTime()
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1)
}

/** 获取行程前 N 个活动名称作为亮点 */
function getTripHighlights(trip: Trip, count: number = 3): string[] {
  const highlights: string[] = []
  for (const day of trip.days) {
    for (const activity of day.activities) {
      if (highlights.length >= count) return highlights
      highlights.push(activity.name)
    }
  }
  return highlights
}

/** 格式化日期为中文友好格式 */
function formatDateCN(dateStr: string): string {
  const d = new Date(dateStr)
  const month = d.getMonth() + 1
  const day = d.getDate()
  return `${month}月${day}日`
}

/**
 * 使用 Canvas API 生成分享卡片图片
 * 尺寸：750 x 1000 px（适合手机屏幕）
 */
export function generateShareCard(trip: Trip): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      reject(new Error('Canvas 上下文创建失败'))
      return
    }

    const W = 750
    const H = 1000
    canvas.width = W
    canvas.height = H

    // ---- 顶部区域：珊瑚橙渐变背景 ----
    const headerH = 320
    const gradient = ctx.createLinearGradient(0, 0, W, headerH)
    gradient.addColorStop(0, '#FF6B35')
    gradient.addColorStop(0.5, '#FF8F65')
    gradient.addColorStop(1, '#FFD166')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.roundRect(0, 0, W, headerH, [0, 0, 40, 40])
    ctx.fill()

    // ---- 顶部装饰圆 ----
    ctx.globalAlpha = 0.1
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(W - 80, 60, 120, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(60, headerH - 40, 80, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1

    // ---- GoNow Logo 文字 ----
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 36px "Geist Variable", sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('GoNow', 50, 70)

    // ---- 副标题 ----
    ctx.font = '20px "Geist Variable", sans-serif'
    ctx.globalAlpha = 0.9
    ctx.fillText('AI 智能旅行规划', 50, 105)
    ctx.globalAlpha = 1

    // ---- 目的地名称（大字）----
    ctx.font = 'bold 52px "Geist Variable", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(trip.destination, W / 2, 200)

    // ---- 日期 + 天数 ----
    const days = calcTripDays(trip)
    const dateRange = `${formatDateCN(trip.startDate)} - ${formatDateCN(trip.endDate)}`
    ctx.font = '24px "Geist Variable", sans-serif'
    ctx.globalAlpha = 0.9
    ctx.fillText(`${dateRange}  |  ${days}天行程`, W / 2, 260)
    ctx.globalAlpha = 1

    // ---- 中部区域：行程亮点 ----
    const highlights = getTripHighlights(trip, 3)
    const contentY = headerH + 50

    // 亮点标题
    ctx.fillStyle = '#1A1A2E'
    ctx.font = 'bold 28px "Geist Variable", sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('行程亮点', 50, contentY)

    // 品牌色小装饰线
    ctx.fillStyle = '#FF6B35'
    ctx.fillRect(50, contentY + 12, 40, 4)

    // 亮点列表
    ctx.font = '22px "Geist Variable", sans-serif'
    ctx.fillStyle = '#6B7280'
    highlights.forEach((name, i) => {
      const y = contentY + 55 + i * 45
      // 小圆点
      ctx.fillStyle = '#FF6B35'
      ctx.beginPath()
      ctx.arc(68, y - 6, 5, 0, Math.PI * 2)
      ctx.fill()
      // 文字
      ctx.fillStyle = '#1A1A2E'
      ctx.font = '22px "Geist Variable", sans-serif'
      ctx.fillText(name, 88, y)
    })

    // ---- 底部区域 ----
    // 品牌色分割线
    const dividerY = H - 180
    const dividerGrad = ctx.createLinearGradient(50, 0, W - 50, 0)
    dividerGrad.addColorStop(0, '#FF6B35')
    dividerGrad.addColorStop(1, '#FFD166')
    ctx.fillStyle = dividerGrad
    ctx.fillRect(50, dividerY, W - 100, 3)

    // 提示文字
    ctx.fillStyle = '#9CA3AF'
    ctx.font = '18px "Geist Variable", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('扫码查看完整行程', W / 2, dividerY + 40)

    // 分享链接
    const shareUrl = generateShareUrl(trip.id)
    ctx.fillStyle = '#D1D5DB'
    ctx.font = '16px "Geist Variable", sans-serif'
    ctx.fillText(shareUrl, W / 2, dividerY + 70)

    // GoNow 品牌标识
    ctx.fillStyle = '#FF6B35'
    ctx.font = 'bold 18px "Geist Variable", sans-serif'
    ctx.fillText('GoNow', W / 2, dividerY + 110)

    // 转为图片 URL
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas 转换 Blob 失败'))
          return
        }
        const url = URL.createObjectURL(blob)
        resolve(url)
      },
      'image/png',
      1,
    )
  })
}

/** 下载分享卡片图片 */
export function downloadShareCard(imageUrl: string, filename: string): void {
  const link = document.createElement('a')
  link.href = imageUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
