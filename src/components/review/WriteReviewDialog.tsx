/**
 * 写评价弹窗
 * 包含星级评分选择、评价内容输入、标签选择、表单验证
 */
import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { StarRating } from './StarRating'
import type { Review, ReviewTargetType } from '@/types'

/** 预设标签 */
const PRESET_TAGS: Record<ReviewTargetType, string[]> = {
  scenic: ['值得推荐', '风景绝美', '适合拍照', '文化底蕴', '适合亲子', '注意防风', '交通便利'],
  food: ['值得推荐', '味道惊艳', '性价比高', '地道小吃', '环境一般', '服务热情', '深夜美食', '早餐首选'],
  trip: ['值得推荐', '安排合理', '预算友好', '注意交通', '适合慢游', '文化底蕴'],
}

interface WriteReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  targetType: ReviewTargetType
  targetId: string
  targetName: string
  onSubmit: (review: Omit<Review, 'id' | 'likes' | 'liked' | 'createdAt'>) => void
  onSuccess?: () => void
}

export function WriteReviewDialog({
  open,
  onOpenChange,
  targetType,
  targetId,
  targetName,
  onSubmit,
  onSuccess,
}: WriteReviewDialogProps) {
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [customTag, setCustomTag] = useState('')
  const [showCustomTagInput, setShowCustomTagInput] = useState(false)
  const [errors, setErrors] = useState<{ rating?: string; content?: string }>({})

  const presetTags = PRESET_TAGS[targetType] || []

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }, [])

  const handleAddCustomTag = useCallback(() => {
    const trimmed = customTag.trim()
    if (trimmed && !selectedTags.includes(trimmed) && trimmed.length <= 8) {
      setSelectedTags((prev) => [...prev, trimmed])
      setCustomTag('')
      setShowCustomTagInput(false)
    }
  }, [customTag, selectedTags])

  const handleValidate = useCallback((): boolean => {
    const newErrors: { rating?: string; content?: string } = {}

    if (rating === 0) {
      newErrors.rating = '请选择评分'
    }

    if (!content.trim()) {
      newErrors.content = '请输入评价内容'
    } else if (content.trim().length < 10) {
      newErrors.content = '评价内容至少10个字'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [rating, content])

  const handleSubmit = useCallback(() => {
    if (!handleValidate()) return

    onSubmit({
      targetType,
      targetId,
      targetName,
      userId: 'current-user',
      userName: '我',
      rating,
      content: content.trim(),
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    })

    // 重置表单
    setRating(0)
    setContent('')
    setSelectedTags([])
    setCustomTag('')
    setShowCustomTagInput(false)
    setErrors({})

    onSuccess?.()
  }, [handleValidate, onSubmit, targetType, targetId, targetName, rating, content, selectedTags, onSuccess])

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= 500) {
      setContent(value)
      if (errors.content) {
        setErrors((prev) => ({ ...prev, content: undefined }))
      }
    }
  }, [errors.content])

  const handleRatingChange = useCallback((newRating: number) => {
    setRating(newRating)
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: undefined }))
    }
  }, [errors.rating])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>写评价</DialogTitle>
          <DialogDescription>
            为「{targetName}」写下你的真实体验
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* 星级评分 */}
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: 'var(--gonow-text)' }}>
              评分 <span style={{ color: '#EF476F' }}>*</span>
            </label>
            <div className="flex items-center gap-3">
              <StarRating
                rating={rating}
                interactive
                onRatingChange={handleRatingChange}
                size="lg"
              />
              {rating > 0 && (
                <span className="text-sm font-medium" style={{ color: '#FF6B35' }}>
                  {rating} 分
                </span>
              )}
            </div>
            {errors.rating && (
              <p className="text-xs" style={{ color: '#EF476F' }}>{errors.rating}</p>
            )}
          </div>

          {/* 评价内容 */}
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: 'var(--gonow-text)' }}>
              评价内容 <span style={{ color: '#EF476F' }}>*</span>
            </label>
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="分享你的真实体验，帮助其他旅行者..."
              rows={4}
              maxLength={500}
              className={cn(
                'w-full rounded-xl border bg-transparent px-3.5 py-2.5 text-sm transition-colors outline-none resize-none',
                'placeholder:text-muted-foreground',
                'focus:ring-2',
                errors.content ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-orange-300 focus:ring-orange-100'
              )}
            />
            <div className="flex items-center justify-between">
              {errors.content && (
                <p className="text-xs" style={{ color: '#EF476F' }}>{errors.content}</p>
              )}
              <span
                className="text-xs ml-auto"
                style={{
                  color: content.length > 450 ? '#EF476F' : 'var(--gonow-text-muted)',
                }}
              >
                {content.length}/500
              </span>
            </div>
          </div>

          {/* 标签选择 */}
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: 'var(--gonow-text)' }}>
              标签（可选）
            </label>
            <div className="flex flex-wrap gap-1.5">
              {presetTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={cn(
                    'text-xs px-2.5 py-1 rounded-full transition-all duration-200',
                    selectedTags.includes(tag) ? 'font-semibold' : 'hover:opacity-80'
                  )}
                  style={{
                    backgroundColor: selectedTags.includes(tag) ? '#FF6B35' : 'var(--gonow-primary-light)',
                    color: selectedTags.includes(tag) ? '#FFFFFF' : 'var(--gonow-primary)',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* 自定义标签 */}
            {showCustomTagInput ? (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTag()}
                  placeholder="输入自定义标签（最多8字）"
                  maxLength={8}
                  className="flex-1 rounded-lg border border-gray-200 bg-transparent px-3 py-1.5 text-xs outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-100"
                  autoFocus
                />
                <Button
                  size="xs"
                  variant="outline"
                  onClick={handleAddCustomTag}
                  className="shrink-0 rounded-lg"
                >
                  添加
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => { setShowCustomTagInput(false); setCustomTag('') }}
                  className="shrink-0"
                >
                  取消
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowCustomTagInput(true)}
                className="text-xs mt-2 inline-flex items-center gap-1 transition-opacity hover:opacity-70"
                style={{ color: 'var(--gonow-text-muted)' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                自定义标签
              </button>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl"
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            className="rounded-xl"
            style={{
              backgroundColor: '#FF6B35',
              color: '#FFFFFF',
            }}
          >
            提交评价
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
