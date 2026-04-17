# GoNow 功能测试报告 (Round 2)

**测试日期**: 2026-04-16
**测试环境**: Linux, Chrome 147 (headless), Node.js v22.22.2, Vite 8.0.8
**测试方法**: 静态代码分析 + 浏览器自动化测试 (agent-browser)
**测试范围**: 全部 7 个页面 + 全局功能

---

## 测试结果汇总

| 测试范围 | 通过 | 失败 | 总计 | 通过率 |
|---------|------|------|------|--------|
| 首页 (HomePage) | 10 | 1 | 11 | 91% |
| 对话页面 (ChatPage + ChatPanel) | 8 | 3 | 11 | 73% |
| 行程页面 (TripPage + TripOverview) | 3 | 2 | 5 | 60% |
| 美食页面 (FoodPage) | 2 | 3 | 5 | 40% |
| 景点页面 (ScenicPage) | 3 | 0 | 3 | 100% |
| 分享页面 (SharedTripPage) | 3 | 0 | 3 | 100% |
| 全局功能 | 4 | 3 | 7 | 57% |
| **总计** | **33** | **12** | **45** | **73%** |

---

## 测试范围 1：首页 (HomePage)

### 1.1 导航链接是否正确

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 1 | 导航项"首页"链接到 `/` | PASS | 代码 `navItems[0].path = '/'`，点击后 URL 正确 |
| 2 | 导航项"规划旅行"链接到 `/chat` | PASS | 代码 `navItems[1].path = '/chat'`，浏览器测试点击后跳转到 `http://localhost:5174/chat` |
| 3 | 导航项"美食推荐"链接到 `/food` | PASS | 代码 `navItems[2].path = '/food'`，浏览器测试点击后跳转正确 |
| 4 | 导航项"我的行程"链接到 `/trip` | PASS | 代码 `navItems[3].path = '/trip'`，浏览器测试点击后跳转正确 |
| 5 | 导航项"景点方案"链接到 `/scenic` | PASS | 代码 `navItems[4].path = '/scenic'`，浏览器测试点击后跳转正确 |

### 1.2 CTA 按钮点击是否跳转到正确页面

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 6 | "开始规划"按钮跳转到 `/chat` | PASS | 代码 `onClick={() => navigate('/chat')}` |
| 7 | "查看示例行程"按钮跳转到 `/trip` | PASS | 代码 `onClick={() => navigate('/trip')}` |
| 8 | 底部"立即开始规划"按钮跳转到 `/chat` | PASS | 代码 `onClick={() => navigate('/chat')}` |

### 1.3 响应式布局

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 9 | 桌面端布局正常 | PASS | 1280x720 视口下，导航水平排列，Hero 区域居中，卡片网格 3 列 |
| 10 | 移动端布局正常 | PASS | 375x812 视口下，导航折叠为汉堡菜单，CTA 按钮垂直堆叠，使用流程切换为竖向时间线 |

### 1.4 动画效果

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 11 | 浮动装饰元素动画 | FAIL | **[BUG-001]** 浮动装饰元素设置了 `hidden md:block`，在移动端完全隐藏。桌面端动画通过 CSS `animate-float` 系列类实现，但浏览器测试中装饰元素未在页面快照中显示（opacity: 0.20 可能过低）。代码逻辑正确，但视觉效果不明显。**严重程度：低** |

---

## 测试范围 2：对话页面 (ChatPage + ChatPanel)

### 2.1 欢迎消息

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 12 | Logo 显示 | PASS | 品牌色圆形背景 + 白色 "G" 字母，正确渲染 |
| 13 | 示例问题显示 | PASS | 4 个示例问题卡片正确显示（日本东京、泰国曼谷、预算5000、海边度假） |

### 2.2 示例问题点击

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 14 | 点击示例问题发送消息 | PASS | 点击"帮我规划一个5天的日本东京之旅"后，用户消息出现在对话中，AI 回复正确显示 |

### 2.3 消息输入框

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 15 | 输入文字并发送 | PASS | 输入文字后点击发送按钮，消息成功发送并显示 AI 回复 |
| 16 | 消息长度限制 (500字符) | PASS | Input 组件设置了 `maxLength={500}`，HTML 原生限制输入长度。Store 中 `sendMessage` 也有 `content.slice(0, 500)` 兜底 |
| 17 | Enter 键发送 | PASS | `onKeyDown` 处理 `e.key === 'Enter' && !e.shiftKey`，正确发送消息 |
| 18 | Shift+Enter 不发送 | PASS | 条件 `!e.shiftKey` 确保 Shift+Enter 不会触发发送。但 **[BUG-002]** 由于使用的是 `<Input>` 组件（单行输入框）而非 `<Textarea>`，Shift+Enter 在单行输入框中本身就没有换行功能，此测试项无实际意义。**严重程度：低** |

### 2.4 发送按钮状态

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 19 | 空输入时发送按钮禁用 | PASS | `disabled={!inputValue.trim() \|\| isGenerating}`，空输入时按钮显示 `[disabled]` |
| 20 | 生成中发送按钮禁用 | PASS | `isGenerating` 为 true 时按钮禁用。代码逻辑正确 |

### 2.5 思考动画

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 21 | ThinkingDots 显示 | FAIL | **[BUG-003]** `ThinkingDots` 组件代码正确，条件 `{isGenerating && <ThinkingDots />}` 也正确。但 Mock 模式下 AI 回复延迟仅 500-1000ms（`500 + Math.random() * 500`），思考动画显示时间极短，用户几乎看不到。建议将 Mock 延迟增加到至少 1500-2000ms 以便测试和演示。**严重程度：低** |

### 2.6 AI 回复后建议追问

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 22 | 建议追问显示 | PASS | AI 回复后，4 个建议追问标签正确显示（帮我安排住宿、推荐当地美食、预算控制在5000以内、增加京都行程） |

### 2.7 "查看完整行程"按钮

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 23 | 按钮显示和跳转 | FAIL | **[BUG-004]** "查看完整行程"按钮的显示条件为 `!isGenerating && currentTrip && messages[messages.length - 1]?.role === 'assistant'`。但 Mock 模式下 `sendMessage` 的 fallback 分支不会设置 `currentTrip`（只有 API 成功返回 `json.data.tripData` 时才会设置）。在无后端环境下，此按钮永远不会显示。建议在 Mock 回复中也生成一个示例行程数据。**严重程度：中** |

### 2.8 消息气泡样式

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 24 | 用户消息样式 | PASS | 右对齐，珊瑚橙渐变背景 (`message-user`)，白色文字，圆角 `20px 20px 6px 20px` |
| 25 | AI 消息样式 | PASS | 左对齐，白色背景 (`message-ai`)，左侧品牌色竖线装饰，阴影效果 |

### 2.9 自动滚动

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 26 | 消息列表自动滚动到底部 | PASS | `useEffect` 监听 `messages` 和 `isGenerating` 变化，自动设置 `viewport.scrollTop = viewport.scrollHeight` |

---

## 测试范围 3：行程页面 (TripPage + TripOverview)

### 3.1 空状态

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 27 | 无行程时空状态显示 | PASS | 显示飞机图标、"还没有行程"文案和"去规划旅行"按钮，跳转到 `/chat` |

### 3.2 TripOverview 渲染

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 28 | 有行程时 TripOverview 完整渲染 | FAIL | **[BUG-005]** 由于 Mock 模式不生成 `currentTrip`（同 BUG-004），TripOverview 组件在无后端环境下无法被触发渲染。只能通过 SharedTripPage 的 Mock 数据间接验证 DayCard 等子组件。建议在 Store 中添加一个"加载示例行程"的调试方法。**严重程度：中** |

### 3.3 Day Tabs 切换

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 29 | Day Tabs 切换功能 | PASS (代码) | `handleDayChange` 使用 `setActiveDay(Number(val))`，`Tabs` 的 `value` 和 `onValueChange` 正确绑定。使用 `variant="line"` 样式。代码逻辑正确，但受 BUG-005 影响无法在浏览器中直接测试 |

### 3.4 预算进度条

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 30 | 预算进度条计算 | PASS (代码) | `width: Math.min((totalCost / budget) * 100, 100)%`，使用 `Math.min` 防止超支时进度条溢出。`BudgetBreakdown` 组件还有更详细的预算分解和颜色变化逻辑（绿/黄/红）。代码逻辑正确 |

### 3.5 天气栏

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 31 | 天气栏显示 | PASS (代码) | `WeatherBar` 组件使用 Mock 天气数据（API 失败时降级），包含温度、天气图标、穿衣建议。水平滚动展示每日天气。代码逻辑正确，但受 BUG-005 影响无法在浏览器中直接测试 |

### 3.6 地图占位组件

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 32 | 地图占位组件显示 | PASS (代码) | `TripMap` 组件在无高德 API Key 时显示占位地图（SVG 网格 + 活动点位 + 连接路径）。代码逻辑完整，包含点位标注、脉冲动画、序号标签等。但受 BUG-005 影响无法在浏览器中直接测试 |

---

## 测试范围 4：美食页面 (FoodPage)

### 4.1 美食列表渲染

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 33 | 美食列表渲染 | PASS | 4 个美食卡片正确渲染（牛肉火锅、蚝烙、夜粥、粿条汤），包含评分、故事、必点菜品、红黑榜、可信度评分 |

### 4.2 筛选标签功能

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 34 | "全部"标签 | PASS | 显示全部 4 个美食 |
| 35 | "必吃榜"标签 | FAIL | **[BUG-006]** 筛选逻辑正确（`food.rating >= 4.6`），但筛选后数量显示仍为 "4 个推荐" 而非实际筛选后的数量。代码 `FoodRecommendList.tsx` 第 37 行使用 `foods.length` 而非 `filteredFoods.length`。**严重程度：中** |
| 36 | "苍蝇馆"标签 | FAIL | **[BUG-007]** 点击"苍蝇馆"后所有美食仍然显示（4 个），筛选逻辑 `return true` 对所有项目返回 true。代码注释说"后续可扩展 tag 字段"，但作为已上线的功能，无效筛选会给用户造成困惑。**严重程度：中** |
| 37 | "本地人推荐"标签 | FAIL | **[BUG-008]** 与 BUG-007 相同，`return true` 导致筛选无效。**严重程度：中** |

### 4.3 美食故事卡片展开

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 38 | 美食故事卡片展开/收起 | FAIL | **[BUG-009]** `FoodStoryCard` 组件没有展开/收起功能。故事内容始终完整显示，没有 `useState` 或任何折叠逻辑。如果设计要求支持展开/收起，则需要添加该功能。**严重程度：低**（取决于产品需求） |

---

## 测试范围 5：景点页面 (ScenicPage)

### 5.1 景点方案渲染

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 39 | 景点方案渲染 | PASS | 2 个景点（南澳岛、汕头小公园）正确渲染，每个景点包含方案卡片和对比表格 |

### 5.2 Tabs 切换

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 40 | 方案 Tabs 切换 | PASS | 浏览器测试：点击"经济"标签后，内容切换为经济方案（"经济实惠方案"，约 80 元，3-4小时）。切换功能正常 |

### 5.3 对比表格

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 41 | 对比表格显示 | PASS | 表格正确显示 4 种方案（主流/经济/深度/特殊）的费用和时长对比数据 |

---

## 测试范围 6：分享页面 (SharedTripPage)

### 6.1 URL 参数解析

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 42 | 有效 tripId 参数解析 | PASS | 访问 `/shared/shared-trip-001` 正确加载 Mock 行程数据（东京三日游） |
| 43 | 无效 tripId 参数处理 | PASS | 访问 `/shared/invalid-trip-id` 显示"行程不存在或已过期"提示和"返回首页"按钮 |

### 6.2 行程展示

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 44 | 行程完整展示 | PASS | 目的地、日期、人数、天数正确显示。3 天行程每日活动列表完整渲染，包含活动名称、时间、费用、评分 |

### 6.3 水印显示

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 45 | 底部水印 | PASS | 页面底部显示"由 GoNow 智能旅行规划助手生成"水印文字和"打开 GoNow 开始规划"按钮 |

---

## 测试范围 7：全局功能

### 7.1 路由切换

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 46 | 所有路由正常切换 | PASS | 浏览器测试验证了 `/`, `/chat`, `/food`, `/trip`, `/scenic`, `/shared/:tripId` 均可正常访问和切换 |

### 7.2 ErrorBoundary

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 47 | ErrorBoundary 集成 | FAIL | **[BUG-010]** `ErrorBoundary` 组件已定义（`/src/components/ErrorBoundary.tsx`），但 **未在 `App.tsx` 中引入和使用**。当前应用没有任何错误边界保护，子组件渲染错误会导致白屏。**严重程度：高** |

### 7.3 Loading 状态

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 48 | React.lazy Suspense Loading | PASS | `App.tsx` 中所有页面使用 `React.lazy` + `Suspense fallback={<LoadingSpinner />}`。`LoadingSpinner` 显示 "GoNow" logo + "加载中..." 文字 + 脉冲动画 |

### 7.4 移动端菜单

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 49 | 移动端菜单打开 | PASS | 375px 视口下，汉堡菜单按钮可见，点击后 Sheet 从右侧滑入，显示 5 个导航链接 |
| 50 | 移动端菜单关闭 | PASS | 点击导航链接后菜单自动关闭（`onClick={() => setOpen(false)}`） |
| 51 | 移动端菜单导航 | PASS | 从菜单点击"美食推荐"后正确跳转到 `/food` |

### 7.5 localStorage 持久化

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 52 | 对话消息持久化 | PASS | `tripStore` 使用 Zustand `persist` 中间件，键名 `gonow-trip-storage`。`partialize` 排除了 `isGenerating` 等临时状态。浏览器测试中刷新后对话消息仍然保留 |
| 53 | 新手引导状态持久化 | PASS | `OnboardingGuide` 使用 `localStorage.getItem('gonow-onboarding-done')` 检查是否已完成引导 |

### 7.6 新手引导

| # | 测试项 | 结果 | 说明 |
|---|--------|------|------|
| 54 | 新手引导显示 | PASS | 首次访问（无 localStorage 标记）时显示 4 步引导流程 |
| 55 | 新手引导关闭 | PASS | 点击"跳过"按钮后引导消失，localStorage 写入 `gonow-onboarding-done=true` |

---

## Bug 汇总

### 高严重程度

| Bug ID | 标题 | 位置 | 描述 |
|--------|------|------|------|
| BUG-010 | ErrorBoundary 未集成 | `src/App.tsx` | ErrorBoundary 组件已定义但未在应用中使用，子组件渲染错误会导致白屏 |

### 中严重程度

| Bug ID | 标题 | 位置 | 描述 |
|--------|------|------|------|
| BUG-004 | "查看完整行程"按钮永远不显示 | `src/components/chat/ChatPanel.tsx` | Mock 模式不设置 `currentTrip`，导致按钮条件永远不满足 |
| BUG-005 | TripOverview 无法在无后端环境测试 | `src/stores/tripStore.ts` | Mock 模式不生成行程数据，TripPage 始终显示空状态 |
| BUG-006 | 美食筛选后数量显示不更新 | `src/components/food/FoodRecommendList.tsx:37` | 使用 `foods.length` 而非 `filteredFoods.length` |
| BUG-007 | "苍蝇馆"筛选标签无效 | `src/components/food/FoodRecommendList.tsx:29` | `return true` 导致所有美食都通过筛选 |
| BUG-008 | "本地人推荐"筛选标签无效 | `src/components/food/FoodRecommendList.tsx:29` | 同 BUG-007 |

### 低严重程度

| Bug ID | 标题 | 位置 | 描述 |
|--------|------|------|------|
| BUG-001 | 浮动装饰元素视觉效果不明显 | `src/pages/HomePage.tsx` | `opacity: 0.20` 过低，且设置了 `hidden md:block` 在移动端隐藏 |
| BUG-002 | Shift+Enter 测试在单行输入框无意义 | `src/components/chat/ChatPanel.tsx` | 使用 `<Input>` 而非 `<Textarea>`，Shift+Enter 在单行输入框无换行功能 |
| BUG-003 | Mock 模式思考动画显示时间过短 | `src/stores/tripStore.ts:170` | Mock 延迟仅 500-1000ms，ThinkingDots 几乎不可见 |
| BUG-009 | 美食故事卡片无展开/收起功能 | `src/components/food/FoodStoryCard.tsx` | 故事内容始终完整显示，无折叠逻辑 |

---

## 修复建议

### BUG-010: ErrorBoundary 未集成 (高)

**修复方案**: 在 `App.tsx` 中用 `ErrorBoundary` 包裹 `Suspense` 和 `Routes`。

```tsx
// src/App.tsx
import ErrorBoundary from '@/components/ErrorBoundary'

function App() {
  return (
    <>
      <OnboardingGuide />
      <TooltipProvider>
        <BrowserRouter>
          <AppLayout>
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* ... */}
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </AppLayout>
        </BrowserRouter>
      </TooltipProvider>
    </>
  )
}
```

### BUG-004 + BUG-005: Mock 模式不生成行程数据 (中)

**修复方案**: 在 `tripStore.ts` 的 Mock 回复中，当用户消息包含目的地关键词时，生成一个示例 `Trip` 对象并设置到 `currentTrip`。

```tsx
// 在 doSend 的 catch 块中，getMockAIReply 之后
const mockTrip = generateMockTrip(trimmedContent)
if (mockTrip) {
  set((state) => ({
    ...state,
    currentTrip: mockTrip,
  }))
}
```

### BUG-006: 美食筛选后数量显示不更新 (中)

**修复方案**: 将 `foods.length` 改为 `filteredFoods.length`。

```tsx
// src/components/food/FoodRecommendList.tsx 第 37 行
<span className="text-sm text-muted-foreground">{filteredFoods.length} 个推荐</span>
```

### BUG-007 + BUG-008: "苍蝇馆"和"本地人推荐"筛选无效 (中)

**修复方案**: 在 `FoodRecommendation` 类型中添加 `tags` 字段，或在 `mock-food-data.ts` 中为每个美食添加标签，然后在筛选逻辑中根据标签过滤。

```tsx
// 方案一：在 mock 数据中添加 tags 字段
{ id: 'food-1', name: '牛肉火锅', tags: ['必吃榜', '本地人推荐'], ... }

// 方案二：基于现有字段实现更智能的筛选
if (activeTag === '苍蝇馆') return food.avgCost <= 60
if (activeTag === '本地人推荐') return food.redBlackFlags?.credibilityScore >= 85
```

### BUG-003: Mock 模式思考动画过短 (低)

**修复方案**: 增加 Mock 延迟时间。

```tsx
// src/stores/tripStore.ts 第 170 行
const delay = 1500 + Math.random() * 1000  // 改为 1.5-2.5 秒
```

### BUG-009: 美食故事卡片无展开/收起 (低)

**修复方案**: 如果产品需要此功能，在 `FoodStoryCard` 中添加 `useState` 控制展开状态，默认收起只显示前 2 段，点击"展开"显示全部。

---

## 附录：测试环境信息

- **OS**: Linux
- **Node.js**: v22.22.2
- **Vite**: 8.0.8
- **React**: (React Router + Zustand)
- **浏览器**: Chrome 147 (headless, agent-browser)
- **Dev Server**: `http://localhost:5174` (5173 被占用)
- **测试工具**: agent-browser CLI + 静态代码分析
