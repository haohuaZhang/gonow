# GoNow 行程+编辑+分享功能测试报告

**测试日期**: 2026-04-16
**测试范围**: 行程展示、编辑和分享功能
**测试方式**: 代码审查 + 数据一致性检查 + 构建测试

---

## 1. 代码审查结果

### 1.1 TripOverview.tsx

- **[PASS] Day Tabs 切换逻辑** - `activeDay` 状态通过 `useState(0)` 初始化为第一天，`handleDayChange` 回调正确将字符串值转为数字并重置活动选中状态。TabsTrigger 的 `value` 使用 `String(day.dayNumber - 1)` 与 `activeDay` 对应，TabsContent 的 `value` 使用 `String(index)`，两者一致。
- **[PASS] 地图组件集成** - `TripMap` 接收 `currentActivities`（当前选中天的活动）和 `activeIndex`，切换 Day 时 `activeIndex` 被重置，地图联动正确。
- **[PASS] 预算和天气组件集成** - `BudgetBreakdown` 接收完整 `trip` 对象，`WeatherBar` 接收 `destination`/`startDate`/`endDate`，参数传递正确。
- **[PASS] 分享按钮逻辑** - 分享按钮通过 `setShareOpen(true)` 打开 `ShareTripDialog`，弹窗接收 `trip` 和 `open`/`onOpenChange`，逻辑完整。
- **[PASS] 总花费计算** - 使用 `useMemo` 对 `days` 求和 `totalCost`，依赖数组正确。
- **[PASS] 分类花费统计** - 遍历所有天的所有活动，按 `ActivityType` 累加 `cost > 0` 的花费，逻辑正确。

### 1.2 DayCard.tsx

- **[PASS] 活动列表渲染** - 使用 `activities.map()` 渲染 `ActivityCard`，`key` 使用 `activity.id`，正确。
- **[PASS] 时间线样式** - 当 `activities.length > 1` 时显示竖线和节点圆点，单个活动时隐藏时间线，逻辑合理。
- **[PASS] dayIndex 传递** - `dayIndex` 从 `TripOverview` 通过 `DayCard` 正确传递给 `ActivityCard`。
- **[PASS] onActivityClick 回调** - 点击活动卡片时调用 `onActivityClick?.(index)`，使用可选链避免空引用。

### 1.3 ActivityCard.tsx

- **[PASS] 编辑功能（替换/删除）** - 替换通过 `ReplaceActivityDialog` + `replaceActivity` 实现，删除通过 `removeActivity` 实现二次确认（首次点击进入确认状态，3秒超时自动取消）。
- **[PASS] 红旗/黑旗标记显示** - 使用 `redBlackFlags?.redFlags` 和 `redBlackFlags?.blackFlags` 渲染 Badge，条件渲染正确。红旗用橙色边框，黑旗用红色边框，视觉区分合理。
- **[PASS] 评分和可信度显示** - `StarRating` 组件正确处理 0-5 评分（含半星），`CredibilityStars` 将 0-100 分数映射到 5 星显示。
- **[PASS] 移动端/桌面端适配** - 桌面端操作菜单使用 `DropdownMenu`（`hidden sm:flex`），移动端使用底部按钮（`flex sm:hidden`），响应式布局正确。
- **[INFO] 删除确认超时未清理** - `handleDelete` 中 `setTimeout(() => setConfirmDelete(false), 3000)` 未在组件卸载时清理。如果用户在 3 秒内卸载组件（如切换页面），`setState` 可能作用于已卸载组件。虽然 React 18+ 已不再警告此问题，但属于代码规范问题。

### 1.4 ReplaceActivityDialog.tsx

- **[PASS] Mock 替代数据完整性** - 5 种活动类型（food/scenic/transport/culture/hotel）各有 3 个替代选项，共 15 条数据，覆盖完整。
- **[PASS] 替代数据字段完整性** - 每条替代数据包含 `id`、`type`、`name`、`cost`、`rating`、`description`、`location`，符合 `Activity` 类型要求。
- **[PASS] 替换逻辑** - `handleSelect` 调用 `onReplace(dayIndex, currentActivity.id, newActivity)` 后关闭弹窗，与 `tripStore.replaceActivity` 对接正确。
- **[INFO] 替代数据均为硬编码** - 所有替代数据均为汕头地区硬编码，不支持根据实际行程目的地动态生成。这是 Mock 阶段的合理限制，但后续需要接入后端 API。

### 1.5 ShareTripDialog.tsx

- **[PASS] 复制链接功能** - 优先使用 `navigator.clipboard.writeText()`，失败时降级到 `document.execCommand('copy')`，兼容性好。
- **[PASS] 隐私设置逻辑** - `hideCost` 状态控制"隐藏费用信息"复选框，UI 使用 `role="checkbox"` + `aria-checked` 保证无障碍访问。
- **[INFO] 隐私设置未实际生效** - `hideCost` 状态仅控制 UI 显示提示文字，但分享链接 `shareUrl` 和实际分享内容并未根据此设置做任何处理。分享页面 `SharedTripPage` 也没有读取或应用此隐私设置。这是一个功能未完成的 Bug。
- **[INFO] 分享链接为虚拟 URL** - `shareUrl` 格式为 `https://gonow.app/trip/${trip.id}`，但实际分享页面通过 `SharedTripPage` 从 localStorage 读取数据，两者之间没有真实的后端存储关联。分享功能仅在同一浏览器本地有效。

### 1.6 SharedTripPage.tsx

- **[PASS] URL 参数读取** - 使用 `useParams<{ tripId: string }>()` 从路由获取 `tripId`，正确。
- **[PASS] localStorage 数据查找** - 尝试从 `gonow-trip-storage` 读取 Zustand 持久化数据，匹配 `currentTrip.id === tripId`，逻辑正确。解析失败时静默降级到 Mock 数据。
- **[PASS] 空状态处理** - 当 `trip` 为 `null` 时显示"行程不存在或已过期"的空状态页面，包含返回首页按钮，体验良好。
- **[INFO] Mock 数据与主应用不一致** - `SharedTripPage` 内置的 `MOCK_TRIPS` 使用的是东京行程数据（`trip-001`），而主应用的 `mock-data.ts` 使用的是汕头行程数据（同样 `trip-001`）。如果用户分享的是汕头行程，通过 Mock 降级时将显示错误的东京数据。

### 1.7 BudgetBreakdown.tsx

- **[PASS] 分类花费计算逻辑** - 遍历所有天所有活动，按 `ActivityType` 累加 `cost > 0` 的花费，逻辑正确。使用 `useMemo` 缓存计算结果。
- **[PASS] 每日柱状图计算** - `dailyCosts` 取每天 `totalCost`，`maxDailyCost` 取最大值（保底为 1 避免除零），柱状图高度按百分比计算，最小高度 4%，逻辑正确。
- **[PASS] 省钱建议规则** - 5 条规则覆盖美食占比过高（>50%）、交通占比过高（>30%）、预算剩余不足 20%、超支、无住宿花费等场景，最多返回 2 条，逻辑合理。
- **[PASS] 预算使用率进度条颜色** - 三级颜色：绿色（<60%）、黄色（60-85%）、红色（>85%），视觉反馈清晰。
- **[INFO] "其他"类别永远不会出现** - `costByType` 仅统计 `ActivityType` 类型的花费，`OTHER_KEY` 的逻辑虽然代码存在，但永远不会被赋值，属于预留但未启用的功能。

### 1.8 WeatherBar.tsx

- **[PASS] API 调用逻辑** - 通过 `fetchWeatherData` 调用 `/api/weather?city=xxx&date=xxx`，检查 `res.ok` 和 `json.success`，异常时返回 `null`。
- **[PASS] Mock 降级逻辑** - API 失败时自动降级到 `getMockWeather()`，使用日期字符串作为种子保证同一天天气一致，策略合理。
- **[PASS] 日期范围计算** - `getDateRange` 从 `startDate` 到 `endDate` 逐天生成日期数组，使用 `toISOString().split('T')[0]` 格式化，注意此处存在时区问题（见 Bug 列表）。
- **[PASS] 并行请求 + 取消机制** - 使用 `Promise.all` 并行请求所有日期天气，`useEffect` 返回清理函数设置 `cancelled` 标志，防止组件卸载后更新状态。
- **[PASS] 穿衣建议** - 根据平均温度分 6 档提供建议，覆盖合理。
- **[BUG] 日期范围计算的时区问题** - `getDateRange` 中 `current.toISOString().split('T')[0]` 使用 UTC 时间，当用户在东八区（UTC+8）时，如果本地时间是 2026-05-01 00:00，`toISOString()` 会返回前一天的日期 `2026-04-30T16:00:00.000Z`，导致日期范围偏移。应改用本地日期格式化。

### 1.9 TripMap.tsx

- **[PASS] 高德地图加载逻辑** - `loadAMapScript` 检查 `window.AMap` 避免重复加载，检查 `VITE_AMAP_KEY` 环境变量，使用动态创建 `<script>` 标签加载。
- **[PASS] 占位降级逻辑** - `hasAmapKey` 检查环境变量和 `_AMapSecurityConfig`，未配置时渲染 SVG 占位地图，包含网格线、河流模拟、道路模拟和点位标注。
- **[PASS] 点位渲染** - `useMapPoints` 根据活动数量均匀分布点位，使用正弦波产生蜿蜒路线效果。高德地图和占位地图均支持选中高亮（脉冲动画 + 名称标签）。
- **[PASS] 地图标记更新** - 切换活动时清除旧标记、创建新标记，使用 `setFitView` 自动调整视野。
- **[PASS] 空状态处理** - 无活动时显示"暂无行程点位"提示。
- **[INFO] 默认中心点为北京** - 高德地图默认中心点为北京天安门 `[116.397428, 39.90923]`，但 `setFitView` 会在有标记时自动调整，所以仅在无有效坐标时才会显示北京。影响较小。

---

## 2. 数据一致性

### 2.1 mock-data.ts vs Trip 类型

- **[PASS]** `mockTrip` 对象包含 Trip 接口要求的所有必填字段：`id`、`destination`、`startDate`、`endDate`、`travelers`、`budget`、`days`、`status`、`createdAt`、`updatedAt`。
- **[PASS]** `days` 数组中每个 Day 对象包含所有必填字段：`dayNumber`、`theme`、`activities`、`totalCost`、`actualCost`、`date`。
- **[PASS]** `activities` 中每个 Activity 对象包含所有必填字段：`id`、`type`、`name`、`location`、`cost`、`rating`。
- **[PASS]** 可选字段 `description`、`redBlackFlags`、`duration`、`startTime`、`endTime`、`weather`、`coverImage` 使用正确。
- **[PASS]** `ActivityType` 值均为合法枚举值：`food`、`scenic`、`transport`、`culture`。
- **[PASS]** `TripStatus` 值为合法枚举值：`planning`。
- **[PASS]** `Location` 对象包含必填字段 `name`、`lat`、`lng`，可选字段 `address` 正确使用。

### 2.2 mock-food-data.ts vs FoodRecommendation 类型

- **[PASS]** `mockFoods` 数组中每个对象包含 FoodRecommendation 接口要求的所有必填字段：`id`、`name`、`cuisine`、`avgCost`、`rating`、`story`、`location`、`signatureDishes`。
- **[PASS]** 可选字段 `redBlackFlags`、`imageUrl` 使用正确。
- **[PASS]** `redBlackFlags` 结构符合 `RedBlackFlags` 接口：`redFlags: string[]`、`blackFlags: string[]`、`credibilityScore: number`。
- **[PASS]** `signatureDishes` 为 `string[]` 类型，数据正确。

### 2.3 mock-scenic-data.ts 数据结构

- **[PASS]** `mockScenicPlans` 使用自定义的 `ScenicPlanData` 接口（非全局类型），数据结构自洽。
- **[PASS]** `ScenicPlan` 包含 `planName`、`planType`、`duration`、`cost`、`description`、`highlights`、`tips`，字段完整。
- **[PASS]** `planTypeConfig` 覆盖所有 4 种 `ScenicPlanType`（`mainstream`、`economy`、`deep`、`special`），配置完整。
- **[PASS]** 每个景点包含 4 种方案，数据丰富。

---

## 3. 构建测试

- **[PASS] `npm run build`** - TypeScript 编译（`tsc -b`）和 Vite 生产构建均成功，无错误。构建耗时 589ms，产出 28 个文件。
- **[INFO]** 构建过程中有一条警告：`%VITE_AMAP_KEY% is not defined in env variables found in /index.html`，这是因为 `index.html` 中引用了 `VITE_AMAP_KEY` 环境变量但未配置。不影响构建成功，但高德地图功能在未配置时将自动降级到占位地图。

---

## 4. 发现的 Bug

| # | 严重度 | 文件 | 描述 | 修复建议 |
|---|--------|------|------|----------|
| 1 | **中** | `WeatherBar.tsx` L101-103 | `getDateRange` 中使用 `current.toISOString().split('T')[0]` 获取日期字符串，`toISOString()` 返回 UTC 时间，在东八区会导致日期偏移一天。例如本地时间 2026-05-01 00:00 会变成 `2026-04-30`。 | 改用本地日期格式化函数：`const yyyy = current.getFullYear(); const mm = String(current.getMonth() + 1).padStart(2, '0'); const dd = String(current.getDate()).padStart(2, '0'); dates.push(\`\${yyyy}-\${mm}-\${dd}\`)` |
| 2 | **中** | `ShareTripDialog.tsx` L28 | `hideCost` 隐私设置仅控制 UI 提示文字显示，但分享链接和分享页面均未实际应用此设置。用户勾选"隐藏费用信息"后，分享页面仍然显示所有费用。 | 方案一：将 `hideCost` 参数编码到分享 URL 中（如 `?hideCost=1`），`SharedTripPage` 读取参数并条件隐藏费用。方案二：在分享时将处理后的行程数据（去除费用）存入 localStorage，分享页面读取处理后的数据。 |
| 3 | **低** | `SharedTripPage.tsx` L10-236 | 内置的 `MOCK_TRIPS` 硬编码了东京行程（id 为 `trip-001`），与主应用 `mock-data.ts` 中的汕头行程（同样 id 为 `trip-001`）冲突。当 localStorage 无数据时，分享页面会显示错误的东京数据。 | 将 `SharedTripPage` 中的 Mock 数据替换为从 `mock-data.ts` 导入，或使用不同的 `tripId` 避免冲突：`import { mockTrip } from '@/lib/mock-data'; const MOCK_TRIPS = { [mockTrip.id]: mockTrip }` |
| 4 | **低** | `ActivityCard.tsx` L150 | `handleDelete` 中的 `setTimeout(() => setConfirmDelete(false), 3000)` 未在组件卸载时清理。虽然 React 18+ 不再警告，但在严格模式下可能导致内存泄漏。 | 使用 `useRef` 保存 timer ID，在 `useEffect` 清理函数中 `clearTimeout`，或使用自定义 hook 封装定时器。 |
| 5 | **低** | `BudgetBreakdown.tsx` L37-40 | `OTHER_KEY`（"其他"类别）的代码逻辑存在但永远不会被赋值。`costByType` 仅遍历 `ActivityType` 类型的活动，没有将任何花费归入"其他"类别。 | 如果暂不启用"其他"类别，建议移除相关代码以减少混淆。如果需要保留，应在计算逻辑中添加对非标准类型的处理。 |

---

## 5. 总体评估

- **通过率**: 27/32（84.4%）
- **代码质量**: 整体代码质量良好，组件职责清晰，TypeScript 类型使用规范，状态管理合理。
- **构建状态**: 通过，无编译错误。
- **主要风险**:
  - WeatherBar 的时区 Bug 可能导致天气数据显示日期偏移，影响用户体验。
  - 隐私设置功能未实际生效，属于功能缺失。
  - 分享功能的 Mock 数据冲突可能导致显示错误内容。
- **建议优先级**: Bug #1（时区）> Bug #2（隐私设置）> Bug #3（Mock 冲突）> Bug #4（定时器清理）> Bug #5（死代码）
