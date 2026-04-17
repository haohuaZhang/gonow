/**
 * 本地存储工具函数
 * 封装 localStorage 操作，提供统一的存储键管理和容量查询
 */

/** GoNow 使用的所有 localStorage 键名 */
const STORAGE_KEYS = {
  TRIP_STORE: 'gonow-trip-storage',
  USER_PREFERENCES: 'gonow-user-preferences',
} as const

/** localStorage 估计总容量（通常为 5MB） */
const STORAGE_QUOTA = 5 * 1024 * 1024

/** 清除所有 GoNow 相关的本地存储 */
export function clearAllStorage(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key)
  })
}

/** 获取存储大小（字节） */
export function getStorageSize(): number {
  let total = 0
  for (const key of Object.values(STORAGE_KEYS)) {
    const item = localStorage.getItem(key)
    if (item) {
      // UTF-16 每字符占 2 字节
      total += item.length * 2
    }
  }
  return total
}

/** 格式化存储大小为可读字符串 */
export function formatStorageSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * 获取当前 localStorage 已用大小（字节）
 * 遍历所有 localStorage 键名计算总用量
 */
export function getStorageUsage(): number {
  let total = 0
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      const item = localStorage.getItem(key)
      if (item) {
        total += key.length * 2 + item.length * 2
      }
    }
  }
  return total
}

/**
 * 检查 localStorage 是否接近满
 * @param threshold - 警告阈值（字节），默认 4MB
 * @returns 是否接近满
 */
export function isStorageNearFull(threshold: number = 4 * 1024 * 1024): boolean {
  return getStorageUsage() >= threshold
}

/**
 * 安全写入 localStorage
 * 写入前检查容量，满时自动清理旧数据或返回 false
 * @param key - 存储键名
 * @param value - 存储值
 * @returns 是否写入成功
 */
export function safeSetItem(key: string, value: string): boolean {
  // 计算新数据大小
  const newItemSize = (key.length + value.length) * 2

  // 如果当前已用量 + 新数据大小超过配额，尝试清理
  if (getStorageUsage() + newItemSize > STORAGE_QUOTA) {
    // 尝试清理非 GoNow 的旧数据
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && !Object.values(STORAGE_KEYS).includes(k as any)) {
        keysToRemove.push(k)
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k))

    // 清理后仍然不够，返回 false
    if (getStorageUsage() + newItemSize > STORAGE_QUOTA) {
      console.warn('[storage] localStorage 容量不足，写入失败:', key)
      return false
    }
  }

  try {
    localStorage.setItem(key, value)
    return true
  } catch (e) {
    // Safari 无痕模式下 setItem 可能抛出 QuotaExceededError
    console.warn('[storage] localStorage.setItem 失败:', key, e)
    return false
  }
}

/**
 * 创建带容量保护的 StateStorage
 * 用于配合 Zustand 的 createJSONStorage 使用
 */
export function createProtectedStateStorage() {
  return {
    getItem: (name: string): string | null => {
      try {
        return localStorage.getItem(name)
      } catch {
        return null
      }
    },
    setItem: (name: string, value: string): void => {
      const result = safeSetItem(name, value)
      if (!result) {
        console.warn('[storage] persist 写入失败，可能需要清理数据')
      }
    },
    removeItem: (name: string): void => {
      try {
        localStorage.removeItem(name)
      } catch {
        // ignore
      }
    },
  }
}
