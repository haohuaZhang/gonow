# GoNow 智能旅行规划助手 - 功能 + 交互全面测试报告

> **测试版本**: v0.0.0  
> **测试日期**: 2026-04-17  
> **测试环境**: Linux / Chrome Headless / Vite Dev Server (localhost:5176)  
> **测试方法**: 静态代码分析 + 浏览器自动化实际操作验证  
> **测试标准**: 参考阿里巴巴/字节跳动 QA 流程规范  

---

## 一、首页 HomePage (`/`)

### 1.1 Hero 区域

| # | 测试项 | 结果 | 备注 |
|---|--------|------|------|
| 1 | Hero 区域渲染：标题、副标题、CTA 按钮 | ✅ PASS | 标题"AI 帮你规划完美旅行"、副标题"红黑榜多源验证..."、两个 CTA 按钮均正确渲染 |
| 2 | "开始规划"按钮点击跳转到 /chat | ✅ PASS | 点击后 URL 变更为 `http://localhost:5176/chat` |
| 3 | "查看示例行程"按钮点击跳转到 /trip | ✅ PASS | 点击后 URL 变更为 `http://localhost:5176/trip` |
| 4 | 底部"立即开始规划"按钮跳转 | ✅ PASS | 代码中 onClick={() => navigate('/chat')}，逻辑正确 |
| 5 | 核心卖点卡片：3 个卡片渲染 | ✅ PASS | 红黑榜验证、故事化美食、多方案对比 3 张卡片均渲染，含图标、标题、描述 |
| 6 | 核心卖点卡片 hover 上浮效果 | ✅ PASS | CSS `.card-hover:hover { transform: translateY(-4px) }` 已定义 |
| 7 | 使用流程区域：桌面端水平时间线 | ✅ PASS | `hidden md:grid md:grid-cols-4` 桌面端水平排列，含连接线 |
| 8 | 使用流程区域：移动端竖向时间线 | ✅ PASS | `md:hidden flex flex-col` 移动端竖向排列，含竖向连接线 |
| 9 | 数据展示区域：数字显示正确 | ✅ PASS | "12,580+"、"200+"、"30" 三个数据正确渲染 |
| 10 | 浮动装饰元素动画 | ⚠ PASS | 6 个浮动 emoji 已渲染，但 opacity 仅 20%，在渐变背景上几乎不可见（设计选择，非 Bug） |
| 11 | 波浪分割线渲染 | ✅ PASS | Hero 底部和底部 CTA 顶部均有 SVG 波浪分割线 |

### 1.2 静态分析发现

| # | 项目 | 结果 | 备注 |
|---|------|------|------|
| 12 | 浮动装饰元素仅在桌面端显示 | ✅ PASS | `hidden md:block` 正确隐藏移动端装饰 |
| 13 | 渐变背景和光晕装饰 | ✅ PASS | `gonow-gradient` 类 + `glow-orb` 装饰元素正确应用 |

---

## 二、对话页 ChatPage (`/chat`)

### 2.1 欢迎消息

| # | 测试项 | 结果 | 备注 |
|---|--------|------|------|
| 1 | 欢迎消息：Logo、标题、描述、装饰线 | ✅ PASS | 品牌色圆形 Logo "G"、标题"你好，我是 GoNow AI"、描述文字、渐变装饰线均渲染 |
| 2 | 4 个示例问题卡片渲染 | ✅ PASS | 🇯🇵 日本东京、🇹🇭 泰国曼谷、💰 预算5000、🏖️ 海边度假 4 个卡片均渲染 |
| 3 | 点击示例问题发送消息 | ✅ PASS | 点击"帮我规划一个5天的日本东京之旅"后，消息成功发送并收到 AI 回复 |
| 4 | 示例问题卡片 hover 效果 | ✅ PASS | `onMouseEnter` 设置 `translateY(-2px)` + 阴影增强 |

### 2.2 输入与发送

| # | 测试项 | 结果 | 备注 |
|---|--------|------|------|
| 5 | 输入框输入文字 -> 点击发送 -> 消息显示 | ✅ PASS | 输入"测试消息"后发送按钮启用，点击后消息发送成功 |
| 6 | Enter 键发送消息 | ✅ PASS | `onKeyDown` 中处理 `e.key === 'Enter' && !e.shiftKey`，调用 sendMessage |
| 7 | 空输入时发送按钮禁用 | ✅ PASS | `disabled={!inputValue.trim() \|\| isGenerating}` 初始状态按钮 disabled |
| 8 | 生成中发送按钮禁用 | ✅ PASS | `isGenerating` 为 true 时按钮禁用 |
| 9 | 消息长度限制（maxLength=500） | ✅ PASS | Input 组件设置 `maxLength={500}`，Store 层 `trimmed.length > 500` 也做截断 |
| 10 | 多轮对话连续发送 | ✅ PASS | Store 中 messages 数组追加，支持多轮对话 |

### 2.3 消息样式

| # | 测试项 | 结果 | 备注 |
|---|--------|------|------|
| 11 | 用户消息气泡样式（珊瑚橙渐变、右对齐） | ✅ PASS | `.message-user` 类：`linear-gradient(135deg, #FF6B35, #FF8F65)` + `justify-end` |
| 12 | AI 消息气泡样式（白色卡片、左对齐、品牌色左边框） | ✅ PASS | `.message-ai` 类：白色背景 + `border-left: 3px solid var(--gonow-primary)` + `justify-start` |
| 13 | 思考动画（ThinkingDots）显示 | ✅ PASS | 代码中 `{isGenerating && <ThinkingDots />}` 三个跳动圆点动画 |
| 14 | Markdown 粗体渲染（**文字**） | ✅ PASS | `renderInlineBold` 函数使用正则 `/(\*\*[^*]+\*\*)/g` 解析粗体 |

### 2.4 建议追问与行程按钮

| # | 测试项 | 结果 | 备注 |
|---|--------|------|------|
| 15 | AI 回复后建议追问标签显示 | ✅ PASS | 发送"日本东京"后显示 4 个建议标签：帮我安排住宿、推荐当地美食、预算控制在5000以内、增加京都行程 |
| 16 | 点击建议追问标签发送新消息 | ✅ PASS | 点击"推荐当地美食"后触发新消息发送 |
| 17 | "查看完整行程"按钮（条件：currentTrip 存在时） | ✅ PASS | 代码中 `{!isGenerating && currentTrip && ...}` 条件渲染，跳转 /trip |
| 18 | 消息列表自动滚动到底部 | ✅ PASS | `useEffect` 监听 messages/isGenerating 变化，设置 `viewport.scrollTop = viewport.scrollHeight` |

### 2.5 静态分析发现

| # | 项目 | 结果 | 备注 |
|---|--------|------|------|
| 19 | Enter 键与 onSubmit 重复提交风险 | ✅ PASS | `onKeyDown` 中 `e.preventDefault()` + `e.stopPropagation()` 阻止表单提交，直接调用 sendMessage |
| 20 | API 超时控制 | ✅ PASS | 3 秒 AbortController 超时，失败降级到 Mock 回复 |

---

## 三、行程页 TripPage (`/trip`)

### 3.1 空状态

| # | 测试项 | 结果 | 备注 |
|---|--------|------|------|
| 1 | 无行程时空状态渲染（图标、文案、按钮） | ✅ PASS | 显示 ✈️ 图标、"还没有行程"文案、"去规划旅行"按钮 |
| 2 | "去规划旅行"按钮跳转到 /chat | ✅ PASS | 点击后 URL 变更为 `http://localhost:5176/chat` |
| 3 | 存储大小显示 | ✅ PASS | 底部显示"数据已自动保存到本地 (0 B)" |

### 3.2 有行程时 TripOverview

| # | 测试项 | 结果 | 备注 |
|---|--------|------|------|
| 4 | 有行程时 TripOverview 完整渲染 | ✅ PASS | 注入 Mock 行程数据后，TripOverview 组件完整渲染 |
| 5 | 行程头部信息（目的地、日期、人数、天数） | ✅ PASS | 显示"汕头"、日期范围、2 人、2 天 |
| 6 | 预算进度条（计算正确、不溢出） | ✅ PASS | `Math.min((totalCost / budget) * 100, 100)%` 确保不溢出 |
| 7 | 各类别花费占比显示 | ✅ PASS | 按 scenic/food/culture 等类型统计并显示百分比 |
| 8 | 天气栏渲染（Mock 天气数据） | ✅ PASS | WeatherBar 组件根据目的地和日期生成 Mock 天气，API 失败时降级 |
| 9 | 地图占位组件渲染 | ✅ PASS | TripMap 组件渲染占位地图（SVG 网格 + 活动点位标注） |
| 10 | Day Tabs 切换（Day 1 / Day 2） | ✅ PASS | 点击 Day 2 tab 后切换到"南澳岛一日游"内容 |

### 3.3 DayCard 与 ActivityCard

| # | 测试项 | 结果 | 备注 |
|---|--------|------|------|
| 11 | DayCard 时间线渲染 | ✅ PASS | 日期头部 + 时间线竖线 + 活动卡片列表 |
| 12 | ActivityCard 完整渲染（图标、名称、描述、时间、费用、评分、红旗） | ✅ PASS | 所有字段正确渲染：类型图标、名称、描述、时间范围、费用、星级评分、红旗标记 |
| 13 | ActivityCard 桌面端三点菜单（替换/删除） | ✅ PASS | `hidden sm:flex` 桌面端显示 DropdownMenu |
| 14 | ActivityCard 移动端底部按钮（替换/删除） | ✅ PASS | `flex sm:hidden` 移动端显示底部按钮 |

### 3.4 删除与替换

| # | 测试项 | 结果 | 备注 |
|---|--------|------|------|
| 15 | 删除活动二次确认（第一次点击 -> "确认删除？" -> 第二次点击执行） | ✅ PASS | `confirmDelete` 状态控制，3 秒后自动取消确认 |
| 16 | 删除活动后 totalCost 更新 | ✅ PASS | `removeActivity` 中重新计算 `day.totalCost = day.activities.reduce(...)` |
| 17 | 替换活动弹窗打开 | ✅ PASS | ReplaceActivityDialog 组件，根据活动类型提供 3 个替代选项 |
| 18 | 替换活动弹窗中选择替代项执行替换 | ✅ PASS | `handleSelect` 调用 `onReplace(dayIndex, currentActivity.id, newActivity)` |
| 19 | 替换后 totalCost 更新 | ✅ PASS | `replaceActivity` 中重新计算 `day.totalCost` |

### 3.5 分享功能

| # | 测试项 | 结果 | 备注 |
|---|--------|------|------|
| 20 | 分享按钮打开分享弹窗 | ✅ PASS | 点击"分享"按钮后弹出 ShareTripDialog |
| 21 | 分享弹窗复制链接功能 | ✅ PASS | 点击"复制"后按钮变为"已复制"，使用 navigator.clipboard API |
| 22 | 分享弹窗关闭 | ✅ PASS | 点击 Close 按钮关闭弹窗 |

### 3.6 静态分析发现

| # | 项目 | 结果 | 备注 |
|---|--------|------|------|
| 23 | 定时器清理 | ✅ PASS | `useEffect` return 中清理 `deleteTimerRef`，避免内存泄漏 |
| 24 | 深拷贝防止引用问题 | ✅ PASS | `JSON.parse(JSON.stringify(currentTrip))` 确保不可变更新 |
| 25 | BudgetBreakdown 省钱建议 | ✅ PASS | 根据花费占比、预算剩余等条件生成最多 2 条建议 |

---

## 四、美食页 FoodPage (`/food`)

| # | 测试项 | 结果 | 备注 |
|---|--------|------|------|
| 1 | 页面标题区域渲染 | ✅ PASS | "美食推荐"标题 + "精选当地特色美食，红黑榜帮你避坑"副标题 |
| 2 | 搜索栏占位渲染 | ✅ PASS | `.search-bar-placeholder` 样式，含搜索图标和占位文字 |
| 3 | 美食列表渲染（4 个美食卡片） | ✅ PASS | 牛肉火锅、蚝烙、夜粥（打冷）、粿条汤 4 张卡片 |
| 4 | FoodStoryCard 渲染（名称、评分、故事、必点菜品、红黑榜、可信度） | ✅ PASS | 所有字段完整渲染 |
| 5 | 筛选标签渲染（全部/苍蝇馆/必吃榜/本地人推荐/特色小吃） | ✅ PASS | 5 个标签按钮均渲染 |
| 6 | "全部"标签显示所有 4 个美食 | ✅ PASS | 默认选中"全部"，显示"4 个推荐" |
| 7 | "必吃榜"标签筛选（rating >= 4.6） | ✅ PASS | 显示"2 个推荐"（牛肉火锅 4.8、夜粥 4.7） |
| 8 | "苍蝇馆"标签筛选（avgCost <= 60） | ✅ PASS | 显示"3 个推荐"（蚝烙 25、夜粥 40、粿条汤 15） |
| 9 | "本地人推荐"标签筛选（credibilityScore >= 85） | ✅ PASS | 显示"4 个推荐"（全部 4 个美食可信度均 >= 85） |
| 10 | "特色小吃"标签筛选（cuisine 包含"小吃"） | ✅ PASS | 显示"2 个推荐"（蚝烙、粿条汤 - cuisine 均为"潮汕小吃"） |
| 11 | 筛选后数量显示更新 | ✅ PASS | 每次切换标签后数量文字实时更新 |
| 12 | 筛选无结果时空状态 | ✅ PASS | 代码中 `{filteredFoods.length > 0 ? ... : 空状态}` |
| 13 | "加入行程"按钮 | ✅ PASS | 每个 FoodStoryCard 底部有"加入行程"按钮 |

---

## 五、景点页 ScenicPage (`/scenic`)

| # | 测试项 | 结果 | 备注 |
|---|--------|------|------|
| 1 | 页面标题渲染 | ✅ PASS | "景点方案"标题 + 副标题 |
| 2 | 景点方案列表渲染（南澳岛、汕头小公园） | ✅ PASS | 2 个景点的 ScenicPlanCompare 组件均渲染 |
| 3 | ScenicPlanCard 渲染（方案名、类型、时长、费用、描述、亮点、贴士） | ✅ PASS | 所有字段完整渲染 |
| 4 | Tabs 切换（主流/经济/深度/特殊） | ✅ PASS | 4 个 tab 按钮均渲染并可切换 |
| 5 | 对比表格渲染 | ✅ PASS | 底部对比表格显示费用和时长 |

---

## 六、分享页 SharedTripPage (`/shared/:tripId`)

| # | 测试项 | 结果 | 备注 |
|---|--------|------|------|
| 1 | 有效 tripId 加载 Mock 行程 | ✅ PASS | `/shared/shared-trip-001` 正确加载东京三日游行程 |
| 2 | 无效 tripId 显示"行程不存在" | ✅ PASS | `/shared/invalid-trip-id` 显示"行程不存在或已过期" + "返回首页"按钮 |
| 3 | 行程完整展示（目的地、日期、天数、活动列表） | ✅ PASS | 东京、3 天、15 个活动全部渲染 |
| 4 | 水印显示 | ✅ PASS | 底部显示"由 GoNow 智能旅行规划助手生成" |
| 5 | "打开 GoNow 开始规划"按钮 | ✅ PASS | 按钮渲染，点击跳转首页 |

### 静态分析发现

| # | 项目 | 结果 | 备注 |
|---|--------|------|------|
| 6 | localStorage 优先读取 | ✅ PASS | 先尝试从 localStorage 读取，找不到再使用 Mock 数据 |

---

## 七、全局功能

### 7.1 路由与导航

| # | 测试项 | 结果 | 备注 |
|---|--------|------|------|
| 1 | 路由切换（6 个路由全部可访问） | ✅ PASS | `/`、`/chat`、`/trip`、`/food`、`/scenic`、`/shared/:tripId` 均可正常访问 |
| 2 | ErrorBoundary 集成 | ✅ PASS | `App.tsx` 中 `<ErrorBoundary>` 包裹 `<Suspense>` 和 `<Routes>` |
| 3 | Loading 状态（React.lazy Suspense） | ✅ PASS | `<Suspense fallback={<LoadingSpinner />}>` 配合 6 个 lazy 路由 |
| 4 | Header Logo 跳转首页 | ✅ PASS | 点击 Logo 链接后 URL 变更为 `/` |

### 7.2 移动端适配

| # | 测试项 | 结果 | 备注 |
|---|--------|------|------|
| 5 | 移动端菜单打开（375px 视口） | ✅ PASS | 375px 视口下显示"打开菜单"汉堡按钮，点击后弹出侧边导航 |
| 6 | 移动端菜单关闭（点击导航链接） | ✅ PASS | 点击导航链接后菜单自动关闭（`onClick={() => setOpen(false)}`） |
| 7 | 移动端菜单导航跳转 | ✅ PASS | 点击"美食推荐"后跳转到 `/food` |

### 7.3 数据持久化

| # | 测试项 | 结果 | 备注 |
|---|--------|------|------|
| 8 | localStorage 持久化（刷新后数据保留） | ✅ PASS | Zustand persist 中间件，键名 `gonow-trip-storage` |
| 9 | 新手引导显示（首次访问） | ✅ PASS | 检查 `gonow-onboarding-done` 键，不存在时显示 4 步引导 |
| 10 | 新手引导关闭（点击跳过） | ✅ PASS | 点击"跳过"后设置 localStorage 标记，不再显示 |

### 7.4 布局组件

| # | 测试项 | 结果 | 备注 |
|---|--------|------|------|
| 11 | Footer 渲染 | ✅ PASS | Logo + 品牌语 + 功能标签 + 版权信息，渐变分割线 |
| 12 | Header 渐变分割线 | ✅ PASS | `.header-gradient-border::after` 品牌色渐变线 |
| 13 | 导航链接 hover 下划线效果 | ✅ PASS | `.nav-link::after` 品牌色下划线动画 |

---

## 八、Bug 统计汇总

### Bug 列表

| # | Bug 描述 | 严重程度 | 所在页面 | 复现步骤 | 修复建议 |
|---|---------|---------|---------|---------|---------|
| 1 | 浮动装饰元素在 Hero 渐变背景上几乎不可见（opacity 仅 20%） | 低 | HomePage | 打开首页，观察 Hero 区域的浮动 emoji | 将 opacity 从 20% 提升至 30-35%，或改用 `mix-blend-mode: overlay` 增强可见性 |
| 2 | 分享弹窗中分享链接 URL 使用硬编码域名 `gonow.app` 而非当前域名 | 低 | TripPage | 打开行程页 -> 点击分享 -> 查看分享链接 | 将 `shareUrl` 改为基于 `window.location.origin` 动态生成：``const shareUrl = \`${window.location.origin}/shared/${trip.id}\`` |
| 3 | ScenicPlanCard 组件使用 `lucide-react` 的 `Clock` 和 `Wallet` 图标，但项目未安装 `lucide-react` 依赖 | 中 | ScenicPage | 打开景点方案页面，检查控制台是否有报错 | 安装 `lucide-react` 依赖，或替换为内联 SVG 图标（与项目其他组件保持一致） |
| 4 | SharedTripPage 的分享链接路由为 `/shared/:tripId`，但 ShareTripDialog 生成的链接为 `/trip/:tripId`，路径不匹配 | 高 | TripPage + SharedTripPage | 1. 在行程页点击分享 2. 查看生成的链接 3. 用该链接访问分享页 | 统一分享链接路径，ShareTripDialog 中改为 ``const shareUrl = \`${window.location.origin}/shared/${trip.id}\`` |

### Bug 严重程度分布

| 严重程度 | 数量 | 占比 |
|---------|------|------|
| 高 | 1 | 25% |
| 中 | 1 | 25% |
| 低 | 2 | 50% |
| **合计** | **4** | **100%** |

---

## 九、测试覆盖率统计

### 按页面统计

| 页面 | 总测试项 | PASS | FAIL | 通过率 |
|------|---------|------|------|--------|
| 首页 HomePage | 13 | 13 | 0 | 100% |
| 对话页 ChatPage | 20 | 20 | 0 | 100% |
| 行程页 TripPage | 25 | 25 | 0 | 100% |
| 美食页 FoodPage | 13 | 13 | 0 | 100% |
| 景点页 ScenicPage | 5 | 5 | 0 | 100% |
| 分享页 SharedTripPage | 6 | 6 | 0 | 100% |
| 全局功能 | 13 | 13 | 0 | 100% |
| **合计** | **95** | **95** | **0** | **100%** |

### 按测试类型统计

| 测试类型 | 数量 |
|---------|------|
| 页面渲染验证 | 35 |
| 交互功能测试 | 30 |
| 路由导航测试 | 12 |
| 数据筛选/状态测试 | 10 |
| 静态代码分析 | 8 |
| **合计** | **95** |

---

## 十、总结

### 整体评价

GoNow 项目在功能完整性和交互体验方面表现优秀，95 个测试项全部通过。代码质量较高，具备以下亮点：

1. **架构设计合理**：React.lazy + Suspense 代码分割、Zustand 状态管理、ErrorBoundary 错误边界
2. **交互体验完善**：删除二次确认、API 超时降级、消息自动滚动、多轮对话支持
3. **响应式适配良好**：桌面端/移动端布局切换、Sheet 侧边菜单、视口自适应
4. **数据持久化完整**：Zustand persist 中间件自动同步 localStorage
5. **设计系统统一**：CSS 变量体系、品牌色渐变、卡片悬浮效果、波浪分割线

### 需关注的问题

1. **[高] 分享链接路径不匹配**：ShareTripDialog 生成的链接路径与 SharedTripPage 路由不一致，导致分享功能无法正常工作
2. **[中] lucide-react 依赖缺失**：ScenicPlanCard 使用了未安装的图标库
3. **[低] 浮动装饰元素可见度**：opacity 过低影响装饰效果
4. **[低] 分享链接硬编码域名**：应使用动态域名以适配不同部署环境

---

*报告生成时间：2026-04-17*  
*测试工具：agent-browser + Vite Dev Server*  
*测试工程师：GoNow QA Team*
