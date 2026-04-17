import { useState, useCallback, useRef, useEffect } from 'react'
import type { Trip } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  generateShareUrl,
  shareToWeibo,
  shareToQQ,
  generateShareCard,
  downloadShareCard,
} from '@/lib/share-utils'

interface ShareTripDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trip: Trip
}

/** 分享方式定义 */
interface ShareMethod {
  id: string
  name: string
  description: string
  icon: React.ReactNode
}

/** 勾选图标 */
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}

/** 复制图标 */
function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  )
}

/** 微信图标 */
function WeChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05a6.127 6.127 0 01-.253-1.72c0-3.571 3.354-6.467 7.503-6.467.256 0 .507.013.756.033C16.708 4.882 13.07 2.188 8.691 2.188zm-2.35 4.477a1.06 1.06 0 110 2.12 1.06 1.06 0 010-2.12zm4.7 0a1.06 1.06 0 110 2.12 1.06 1.06 0 010-2.12zM16.835 9.43c-3.59 0-6.503 2.524-6.503 5.635 0 3.11 2.913 5.635 6.503 5.635a7.76 7.76 0 002.272-.337.693.693 0 01.572.079l1.527.89a.262.262 0 00.134.044.236.236 0 00.233-.237c0-.058-.023-.114-.038-.17l-.313-1.188a.473.473 0 01.17-.532C23.024 18.48 24 16.855 24 15.065c0-3.11-2.913-5.635-6.503-5.635h-.662zm-2.6 3.578a.882.882 0 110 1.764.882.882 0 010-1.764zm3.823 0a.882.882 0 110 1.764.882.882 0 010-1.764z" />
    </svg>
  )
}

/** 微博图标 */
function WeiboIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.583.631.283.822.991.442 1.574zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.307-.361-.164-.585.14-.227.436-.346.672-.24.239.09.318.36.181.572zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.642 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zM17.014 2.575c.085-.075.253-.049.373.057.123.108.153.259.068.338-.086.078-.256.052-.377-.057-.121-.107-.151-.259-.064-.338zm-.747-.677c.424-.376 1.17-.336 1.666.089.498.427.543 1.093.119 1.469-.424.376-1.168.336-1.664-.089-.498-.427-.545-1.093-.121-1.469zm2.857 4.958c-.729-1.858-2.857-2.879-4.766-2.287-.322.104-.5.446-.396.768.104.322.446.5.768.396 1.267-.403 2.697.278 3.197 1.527.502 1.248.056 2.632-1.021 3.257-.289.168-.389.539-.221.828.168.289.539.389.828.221 1.59-.925 2.339-2.858 1.611-4.71z" />
    </svg>
  )
}

/** QQ 图标 */
function QQIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 13.2c-.18.53-.5 1.05-.97 1.53.04.15.06.3.06.45 0 .97-.71 1.82-1.73 1.82-.46 0-.88-.18-1.2-.48-.26.06-.54.1-.83.1s-.57-.04-.83-.1c-.32.3-.74.48-1.2.48-1.02 0-1.73-.85-1.73-1.82 0-.15.02-.3.06-.45-.47-.48-.79-1-.97-1.53-.2-.58-.2-1.08-.04-1.48.12-.3.32-.53.58-.68-.02-.18-.03-.36-.03-.54 0-2.76 2.24-5 5-5s5 2.24 5 5c0 .18-.01.36-.03.54.26.15.46.38.58.68.16.4.16.9-.04 1.48h-.08z" />
    </svg>
  )
}

/** 分享图标 */
function ShareIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={className}
      style={style}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      />
    </svg>
  )
}

/** 下载图标 */
function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  )
}

/** 分享行程弹窗组件 - 完整社交分享面板 */
export function ShareTripDialog({
  open,
  onOpenChange,
  trip,
}: ShareTripDialogProps) {
  // 复制链接状态
  const [copied, setCopied] = useState(false)
  // 是否隐藏费用信息
  const [hideCost, setHideCost] = useState(false)
  // 是否隐藏红黑榜信息
  const [hideRedBlack, setHideRedBlack] = useState(false)
  // 是否仅显示基本信息
  const [basicOnly, setBasicOnly] = useState(false)
  // 分享卡片图片 URL
  const [cardImageUrl, setCardImageUrl] = useState<string | null>(null)
  // 是否正在生成卡片
  const [generatingCard, setGeneratingCard] = useState(false)
  // 保存定时器引用
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // 保存卡片 URL 用于清理
  const cardUrlRef = useRef<string | null>(null)

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      if (cardUrlRef.current) URL.revokeObjectURL(cardUrlRef.current)
    }
  }, [])

  // 生成分享链接
  const shareUrl = generateShareUrl(trip.id)

  // 分享标题
  const shareTitle = `${trip.destination} - GoNow AI 智能旅行规划`

  // 分享摘要
  const shareSummary = `我正在使用 GoNow 规划${trip.destination}之旅，${trip.days.length}天精彩行程等你来看！`

  // 4 种分享方式
  const shareMethods: ShareMethod[] = [
    {
      id: 'copy',
      name: '复制链接',
      description: '复制行程链接发送给好友',
      icon: <CopyIcon className="size-6" />,
    },
    {
      id: 'wechat',
      name: '微信分享',
      description: '生成卡片，长按保存后分享',
      icon: <WeChatIcon className="size-6" />,
    },
    {
      id: 'weibo',
      name: '微博分享',
      description: '一键分享到新浪微博',
      icon: <WeiboIcon className="size-6" />,
    },
    {
      id: 'qq',
      name: 'QQ 分享',
      description: '一键分享给 QQ 好友',
      icon: <QQIcon className="size-6" />,
    },
  ]

  // 复制链接到剪贴板
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = shareUrl
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000)
    }
  }, [shareUrl])

  // 生成分享卡片
  const handleGenerateCard = useCallback(async () => {
    setGeneratingCard(true)
    try {
      // 清理之前的 URL
      if (cardUrlRef.current) {
        URL.revokeObjectURL(cardUrlRef.current)
        cardUrlRef.current = null
      }
      const url = await generateShareCard(trip)
      cardUrlRef.current = url
      setCardImageUrl(url)
    } catch (err) {
      console.error('生成分享卡片失败:', err)
    } finally {
      setGeneratingCard(false)
    }
  }, [trip])

  // 下载分享卡片
  const handleDownloadCard = useCallback(() => {
    if (!cardImageUrl) return
    const filename = `GoNow-${trip.destination}-行程分享.png`
    downloadShareCard(cardImageUrl, filename)
  }, [cardImageUrl, trip.destination])

  // 处理分享方式点击
  const handleShareMethodClick = useCallback(
    (methodId: string) => {
      switch (methodId) {
        case 'copy':
          handleCopyLink()
          break
        case 'wechat':
          handleGenerateCard()
          break
        case 'weibo':
          shareToWeibo(shareUrl, shareTitle)
          break
        case 'qq':
          shareToQQ(shareUrl, shareTitle, shareSummary)
          break
      }
    },
    [handleCopyLink, handleGenerateCard, shareUrl, shareTitle, shareSummary],
  )

  // 仅显示基本信息时自动勾选其他隐私选项
  const handleBasicOnlyChange = useCallback(
    (checked: boolean) => {
      setBasicOnly(checked)
      if (checked) {
        setHideCost(true)
        setHideRedBlack(true)
      }
    },
    [],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShareIcon className="size-5" style={{ color: 'var(--gonow-primary)' }} />
            分享行程
          </DialogTitle>
          <DialogDescription>
            将「{trip.destination}」的行程分享给朋友
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* 分享方式 2x2 网格 */}
          <div className="grid grid-cols-2 gap-3">
            {shareMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => handleShareMethodClick(method.id)}
                className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 transition-all hover:border-[var(--gonow-primary)] hover:shadow-md active:scale-[0.97]"
              >
                <div
                  className="flex size-12 items-center justify-center rounded-full"
                  style={{
                    backgroundColor:
                      method.id === 'copy'
                        ? 'var(--gonow-primary-light)'
                        : method.id === 'wechat'
                          ? '#E8F5E9'
                          : method.id === 'weibo'
                            ? '#FFF3E0'
                            : '#E3F2FD',
                    color:
                      method.id === 'copy'
                        ? 'var(--gonow-primary)'
                        : method.id === 'wechat'
                          ? '#07C160'
                          : method.id === 'weibo'
                            ? '#E6162D'
                            : '#12B7F5',
                  }}
                >
                  {method.icon}
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--gonow-text)' }}>
                  {method.name}
                </span>
                <span className="text-xs text-muted-foreground text-center leading-tight">
                  {method.description}
                </span>
              </button>
            ))}
          </div>

          {/* 复制成功提示 */}
          {copied && (
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
              style={{
                backgroundColor: 'var(--gonow-primary-light)',
                color: 'var(--gonow-primary)',
              }}
            >
              <CheckIcon className="size-4" />
              链接已复制到剪贴板
            </div>
          )}

          {/* 分享卡片预览区域 */}
          {cardImageUrl && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium" style={{ color: 'var(--gonow-text)' }}>
                分享卡片预览
              </span>
              <div className="overflow-hidden rounded-xl border">
                <img
                  src={cardImageUrl}
                  alt="分享卡片"
                  className="w-full"
                  style={{ aspectRatio: '750 / 1000' }}
                />
              </div>
              <Button
                onClick={handleDownloadCard}
                className="w-full gap-2"
                style={{
                  backgroundColor: 'var(--gonow-primary)',
                  color: '#fff',
                }}
              >
                <DownloadIcon className="size-4" />
                保存图片
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                长按保存图片后，在微信中发送给好友
              </p>
            </div>
          )}

          {/* 生成卡片加载中 */}
          {generatingCard && (
            <div className="flex items-center justify-center gap-2 rounded-lg border p-4">
              <div
                className="size-4 animate-spin rounded-full border-2 border-t-transparent"
                style={{ borderColor: 'var(--gonow-primary)', borderTopColor: 'transparent' }}
              />
              <span className="text-sm text-muted-foreground">正在生成分享卡片...</span>
            </div>
          )}

          <Separator />

          {/* 隐私设置 */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium" style={{ color: 'var(--gonow-text)' }}>
              隐私设置
            </span>

            {/* 仅显示基本信息 */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <button
                type="button"
                role="checkbox"
                aria-checked={basicOnly}
                onClick={() => handleBasicOnlyChange(!basicOnly)}
                className="relative inline-flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors"
                style={{
                  borderColor: basicOnly ? 'var(--gonow-primary)' : undefined,
                  backgroundColor: basicOnly ? 'var(--gonow-primary)' : 'transparent',
                }}
              >
                {basicOnly && <CheckIcon className="size-3 text-white" />}
              </button>
              <span className="text-sm text-muted-foreground">仅显示基本信息</span>
            </label>
            {basicOnly && (
              <p className="text-xs text-muted-foreground/70 ml-6">
                仅展示目的地和日期，不包含任何行程详情
              </p>
            )}

            {/* 隐藏费用信息 */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <button
                type="button"
                role="checkbox"
                aria-checked={hideCost}
                onClick={() => setHideCost(!hideCost)}
                className="relative inline-flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors"
                style={{
                  borderColor: hideCost ? 'var(--gonow-primary)' : undefined,
                  backgroundColor: hideCost ? 'var(--gonow-primary)' : 'transparent',
                }}
              >
                {hideCost && <CheckIcon className="size-3 text-white" />}
              </button>
              <span className="text-sm text-muted-foreground">隐藏费用信息</span>
            </label>
            {hideCost && !basicOnly && (
              <p className="text-xs text-muted-foreground/70 ml-6">
                分享链接中将不显示任何费用相关内容
              </p>
            )}

            {/* 隐藏红黑榜信息 */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <button
                type="button"
                role="checkbox"
                aria-checked={hideRedBlack}
                onClick={() => setHideRedBlack(!hideRedBlack)}
                className="relative inline-flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors"
                style={{
                  borderColor: hideRedBlack ? 'var(--gonow-primary)' : undefined,
                  backgroundColor: hideRedBlack ? 'var(--gonow-primary)' : 'transparent',
                }}
              >
                {hideRedBlack && <CheckIcon className="size-3 text-white" />}
              </button>
              <span className="text-sm text-muted-foreground">隐藏红黑榜信息</span>
            </label>
            {hideRedBlack && !basicOnly && (
              <p className="text-xs text-muted-foreground/70 ml-6">
                分享链接中将不显示景点的红黑榜评价
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
