import ScenicPlanCompare from '@/components/trip/ScenicPlanCompare'
import { mockScenicPlans } from '@/lib/mock-scenic-data'

/**
 * 景点方案页面
 * 展示多个景点的多方案规划对比
 */
export default function ScenicPage() {
  return (
    <div className="space-y-8">
      {/* 页面标题 - 带品牌色装饰 */}
      <div className="page-title-bar">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--gonow-text)' }}
        >
          景点方案
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: 'var(--gonow-text-secondary)' }}
        >
          同一景点，多种游览方案，根据你的时间和预算自由选择
        </p>
      </div>

      {/* 景点方案列表 */}
      <div className="space-y-6">
        {mockScenicPlans.map((scenic) => (
          <ScenicPlanCompare
            key={scenic.scenicName}
            scenicName={scenic.scenicName}
            plans={scenic.plans}
          />
        ))}
      </div>
    </div>
  )
}
