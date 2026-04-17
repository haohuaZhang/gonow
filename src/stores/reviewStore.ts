/**
 * 用户评价 Store
 * 使用 Zustand + persist 中间件，数据存储在 localStorage
 */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Review, ReviewStats, ReviewTargetType } from '@/types'
import { mockReviews } from '@/lib/mock-review-data'
import { createProtectedStateStorage } from '@/lib/storage'

/** 生成唯一 ID */
function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9)
}

interface ReviewStore {
  /** 所有评价数据 */
  reviews: Review[]
  /** 加载状态 */
  isLoading: boolean

  /** 添加评价 */
  addReview: (review: Omit<Review, 'id' | 'likes' | 'liked' | 'createdAt'>) => void
  /** 切换点赞 */
  toggleLike: (reviewId: string) => void
  /** 获取某目标的评价列表 */
  getReviewsByTarget: (targetType: ReviewTargetType, targetId: string) => Review[]
  /** 获取某目标的评价统计 */
  getReviewStats: (targetType: ReviewTargetType, targetId: string) => ReviewStats
}

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviews: mockReviews,
      isLoading: false,

      addReview: (reviewData) => {
        const newReview: Review = {
          ...reviewData,
          id: generateId(),
          likes: 0,
          liked: false,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          reviews: [newReview, ...state.reviews],
        }))
      },

      toggleLike: (reviewId: string) => {
        set((state) => ({
          reviews: state.reviews.map((r) => {
            if (r.id !== reviewId) return r
            return {
              ...r,
              liked: !r.liked,
              likes: r.liked ? r.likes - 1 : r.likes + 1,
            }
          }),
        }))
      },

      getReviewsByTarget: (targetType: ReviewTargetType, targetId: string) => {
        return get().reviews.filter(
          (r) => r.targetType === targetType && r.targetId === targetId
        )
      },

      getReviewStats: (targetType: ReviewTargetType, targetId: string) => {
        const reviews = get().reviews.filter(
          (r) => r.targetType === targetType && r.targetId === targetId
        )

        if (reviews.length === 0) {
          return {
            averageRating: 0,
            totalCount: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            tags: [],
          }
        }

        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
        const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

        reviews.forEach((r) => {
          ratingDistribution[r.rating] = (ratingDistribution[r.rating] || 0) + 1
        })

        // 统计标签
        const tagMap = new Map<string, number>()
        reviews.forEach((r) => {
          r.tags?.forEach((tag) => {
            tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
          })
        })

        const tags = Array.from(tagMap.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)

        return {
          averageRating: Math.round((totalRating / reviews.length) * 10) / 10,
          totalCount: reviews.length,
          ratingDistribution,
          tags,
        }
      },
    }),
    {
      name: 'gonow-review-storage',
      storage: createJSONStorage(() => createProtectedStateStorage()),
      partialize: (state) => ({
        reviews: state.reviews,
      }),
    }
  )
)
