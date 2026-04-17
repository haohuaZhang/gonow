import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ScenicPlanCard from '@/components/trip/ScenicPlanCard'
import type { ScenicPlan, ScenicPlanType } from '@/lib/mock-scenic-data'
import { planTypeConfig } from '@/lib/mock-scenic-data'

/**
 * 景点多方案对比组件属性
 */
interface ScenicPlanCompareProps {
  /** 景点名称 */
  scenicName: string
  /** 该景点的所有游览方案 */
  plans: ScenicPlan[]
}

/**
 * 景点多方案对比组件
 * 提供方案切换标签、方案卡片展示和底部对比表格
 */
export default function ScenicPlanCompare({ scenicName, plans }: ScenicPlanCompareProps) {
  const [activeTab, setActiveTab] = useState<ScenicPlanType>('mainstream')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{scenicName} 游览方案对比</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 方案切换标签 */}
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as ScenicPlanType)}>
          <TabsList className="w-full">
            {plans.map((plan) => {
              const config = planTypeConfig[plan.planType]
              return (
                <TabsTrigger key={plan.planType} value={plan.planType}>
                  <span className={`text-xs font-medium ${config.color}`}>
                    {config.label}
                  </span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* 各方案内容面板 */}
          {plans.map((plan) => (
            <TabsContent key={plan.planType} value={plan.planType}>
              <ScenicPlanCard
                plan={plan}
                isSelected={activeTab === plan.planType}
                onSelect={() => setActiveTab(plan.planType)}
              />
            </TabsContent>
          ))}
        </Tabs>

        {/* 底部对比表格 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">方案对比</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-3 font-medium text-muted-foreground">方案</th>
                  {plans.map((plan) => (
                    <th
                      key={plan.planType}
                      className={`text-center py-2 px-2 font-medium min-w-[60px] ${
                        planTypeConfig[plan.planType].color
                      }`}
                    >
                      {planTypeConfig[plan.planType].label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-3 text-muted-foreground">费用</td>
                  {plans.map((plan) => (
                    <td key={plan.planType} className="text-center py-2 px-2">
                      {plan.cost === 0 ? '免费' : `¥${plan.cost}`}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 pr-3 text-muted-foreground">时长</td>
                  {plans.map((plan) => (
                    <td key={plan.planType} className="text-center py-2 px-2 text-xs">
                      {plan.duration}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
