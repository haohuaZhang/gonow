# GoNow 项目记忆

> **每次开发前必读，每次开发后必更新**

## 当前状态
- 阶段：Phase 9 - 待完成事项开发（规划中）
- 最后更新：2026-04-17
- 当前任务：制定 Phase 9 开发计划，完成度从 92% 提升到 100%
- 线上地址：https://gonow-travel.netlify.app
- GitHub：https://github.com/haohuaZhang/gonow
- PRD 文档：docs/GoNow-PRD-V3.1-Full.docx
- PRD 版本：V3.1 功能打磨版（含 Phase 9 开发计划）
- 架构版本：V2.0（7 Agent 全激活版）
- 产品完成度：92%（13/15 核心功能完整实现）

## 项目概览
- **产品名称**：GoNow 智能旅行规划助手
- **产品定位**：面向国内旅行者的全功能 AI 智能旅行规划平台
- **核心卖点**：红黑榜多源验证 + 故事化美食推荐 + 景点多方案规划 + 文化体验推荐
- **技术栈**：React 18 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui + React Router v6 + Zustand + 高德 JS API v2.0 + Netlify Functions + Netlify KV + Netlify Identity + PWA (Workbox)

## Agent 团队配置（7 Agent 全激活）
| # | Agent | 当前优先级 | 主要职责 |
|---|-------|-----------|---------|
| ① | 产品经理 | ★★☆ | 需求分析、技术方案、任务拆解 |
| ② | 前端开发 | ★★★ | React 组件、UI、状态管理 |
| ③ | 后端开发 | ★★★ | Netlify Functions、API、数据存储 |
| ④ | 测试工程师 | ★★★ | 功能测试、Bug 修复、回归验证 |
| ⑤ | 内容营销 | ★☆☆ | 产品文案、SEO、社交媒体内容 |
| ⑥ | 增长实验 | ☆☆☆ | 转化漏斗、裂变机制、A/B测试 |
| ⑦ | 日常运营 | ☆☆☆ | 用户反馈、数据周报、FAQ |

> 开发期以 ②③④ 为主力，⑤⑥⑦ 轻量参与（提前规划方案）
> 详见 ARCHITECTURE.md V2.0

## 已完成
- [x] PRD V1.0 初始版本（2026-04-15）
- [x] PRD V2.0 完整版（2026-04-15）
- [x] PRD V3.0 增强版 - 新增美食/景点/文化模块（2026-04-16）
- [x] PRD V3.1 功能打磨版 - 58项功能优化 + 功能实现规范（2026-04-16）
- [x] 多 Agent 协作架构方案 V2.0（2026-04-16）- 7 Agent 全激活版
- [x] 架构审查与修复（2026-04-16）- 修复5个问题
- [x] API 接口契约文档（2026-04-16）- docs/api-contracts.md
- [x] 项目脚手架搭建（2026-04-16）- Vite + React 18 + TypeScript + Tailwind CSS v4 + shadcn/ui
- [x] 基础目录结构创建（2026-04-16）
- [x] 核心类型定义（2026-04-16）- User, Trip, Day, Activity, Expense, ChatMessage 等
- [x] 基础布局组件 AppLayout（2026-04-16）- Header + 主内容区 + Footer + 移动端适配
- [x] 路由配置（2026-04-16）- React Router v6, /, /chat, /trip 路由
- [x] 首页 HomePage（2026-04-16）- 产品介绍 + 功能特性卡片
- [x] shadcn/ui 组件安装（2026-04-16）- 12个组件
- [x] **Zustand 状态管理 tripStore**（2026-04-16）- 对话状态 + 行程状态 + 模拟AI回复
- [x] **AI 对话组件 ChatPanel**（2026-04-16）- 消息气泡 + 欢迎语 + 建议追问 + 思考动画
- [x] **对话页面 ChatPage**（2026-04-16）- /chat 路由
- [x] **后端 API /api/chat**（2026-04-16）- Mock 对话逻辑（4种场景）+ CORS + 错误处理
- [x] **后端 API /api/generate-trip**（2026-04-16）- Mock 行程生成 + 参数校验 + 旺季警告
- [x] **Netlify 配置 netlify.toml**（2026-04-16）- build + functions 配置
- [x] **Activity 类型图标 ActivityIcon**（2026-04-16）- 5种类型 emoji + 颜色
- [x] **Activity 卡片 ActivityCard**（2026-04-16）- 图标 + 名称 + 描述 + 时间 + 费用 + 评分 + 红旗标记
- [x] **Day 行程卡片 DayCard**（2026-04-16）- 日期头 + 活动列表 + 时间线连接
- [x] **行程总览 TripOverview**（2026-04-16）- 概览 + 预算进度条 + Day Tabs + DayCard
- [x] **Mock 数据 mock-data.ts**（2026-04-16）- 汕头2日游完整数据
- [x] **行程页面 TripPage 更新**（2026-04-16）- 引入 TripOverview + Mock 数据展示
- [x] **构建验证通过**（2026-04-16）- npm run build 零错误（395KB JS + 65KB CSS）
- [x] **浏览器测试通过**（2026-04-16）- 首页/对话页/行程页三页面全部渲染正确
- [x] **集成联调完成**（2026-04-16）- tripStore 调用 API + Mock 降级 + 行程跳转
- [x] **Bug修复：crypto.randomUUID**（2026-04-16）- 非 HTTPS 环境下 fallback 到 Date.now()
- [x] **Bug修复：fetch 超时**（2026-04-16）- 添加 AbortController 3秒超时，快速降级到 Mock
- [x] **Vite proxy 配置**（2026-04-16）- /api 代理到 localhost:8888
- [x] **高德地图占位组件 TripMap**（2026-04-16）- CSS/SVG 地图 + 活动点位 + 路线连接 + 选中高亮
- [x] **地图集成到行程页**（2026-04-16）- TripOverview 中添加 TripMap，点击 ActivityCard 高亮点位
- [x] **替换活动弹窗 ReplaceActivityDialog**（2026-04-16）- 5种类型 Mock 替代数据 + Dialog 选择
- [x] **ActivityCard 编辑功能**（2026-04-16）- 桌面端三点菜单 + 移动端底部按钮 + 删除二次确认
- [x] **tripStore 编辑方法**（2026-04-16）- replaceActivity + removeActivity + 级联更新 totalCost
- [x] **localStorage 持久化**（2026-04-16）- Zustand persist 中间件 + 存储工具函数
- [x] **TripPage 存储提示**（2026-04-16）- 显示"数据已自动保存" + 存储大小
- [x] **美食故事卡片 FoodStoryCard**（2026-04-16）- 渐变背景+故事描述+必点菜品+红黑榜+加入行程
- [x] **美食推荐列表 FoodRecommendList**（2026-04-16）- 筛选标签+卡片列表+空状态
- [x] **Mock 美食数据**（2026-04-16）- 4道汕头美食（牛肉火锅/蚝烙/夜粥/粿条汤）故事化描述
- [x] **美食页面 FoodPage**（2026-04-16）- /food 路由
- [x] **景点方案卡片 ScenicPlanCard**（2026-04-16）- 4种方案类型颜色区分+亮点+贴士
- [x] **景点多方案对比 ScenicPlanCompare**（2026-04-16）- Tabs切换+对比表格
- [x] **Mock 景点方案数据**（2026-04-16）- 南澳岛+汕头小公园各4种方案
- [x] **景点方案页面 ScenicPage**（2026-04-16）- /scenic 路由
- [x] **预算分解组件 BudgetBreakdown**（2026-04-16）- 分类花费+进度条+每日柱状图+省钱建议
- [x] **天气组件 WeatherBar**（2026-04-16）- Mock天气+每日卡片+穿衣建议
- [x] **行程总览集成**（2026-04-16）- TripOverview 添加天气栏+预算分解
- [x] **分享弹窗 ShareTripDialog**（2026-04-16）- 复制链接+微信二维码占位+保存图片+隐私设置
- [x] **分享行程页面 SharedTripPage**（2026-04-16）- /shared/:tripId 公开查看
- [x] **TripOverview 分享按钮**（2026-04-16）- 行程头部添加分享入口
- [x] **PWA Manifest**（2026-04-16）- manifest.json + meta 标签 + SVG 图标
- [x] **新手引导 OnboardingGuide**（2026-04-16）- 4步引导+localStorage 记忆+渐变背景
- [x] **首页重设计 HomePage**（2026-04-16）- Hero+卖点+流程+数据+CTA 五大区域
- [x] **全局错误边界 ErrorBoundary**（2026-04-16）- 友好错误页面+重新加载
- [x] **全局加载组件 LoadingSpinner**（2026-04-16）- 脉冲动画
- [x] **代码分割优化**（2026-04-16）- React.lazy 路由级拆分，首屏 JS 198KB（gzip 62KB）
- [x] **Claude API 接入**（2026-04-16）- chat.js 支持 Claude + Mock 自动降级
- [x] **部署准备**（2026-04-16）- netlify.toml + .env.example + .gitignore
- [x] **UI 设计优化**（2026-04-16）- 珊瑚橙品牌色+渐变Hero+品牌色消息气泡+卡片悬浮效果+时间线流程+全局动画
- [x] **全面测试验收 Round 1**（2026-04-16）- 2个测试Agent共89项检查，发现15个Bug
- [x] **Bug 修复 Round 1**（2026-04-16）- 8个Bug全部修复（Claude超时+消息长度+重复提交+时区+定时器+ID冲突+数据缺失+花费不匹配）
- [x] **UI 深度优化**（2026-04-16）- frontend-design 技能驱动：光晕mesh背景+波浪分割线+渐变数字+品牌色标题装饰+Header渐变分割线+Footer重设计+空状态插画+搜索栏占位+预算进度条渐变+页面标题统一
- [x] **全面测试验收 Round 2**（2026-04-16）- 4个测试Agent共226项检查（功能45+UI/UX40+API/状态管理136+交叉5），发现25个Bug
- [x] **Bug 修复 Round 2**（2026-04-16）- 12个Bug修复：ErrorBoundary集成+mock-data totalCost修正+Store空消息校验+timeoutId清理+Mock延时增加+美食筛选修复+ShareTripDialog定时器清理+ReplaceActivityDialog redBlackFlags补全+辅助文字对比度提升+旺季月份补全+存储轮询降频+页面标题统一
- [x] **全面测试验收 Round 3**（2026-04-17）- 4个测试Agent共278项检查（功能95+UI/UX58+API/状态125+性能安全220），通过率92%+
- [x] **Bug 修复 Round 3**（2026-04-17）- 7个Bug修复：分享链接路径修正+generate-trip totalCost修正+transport redBlackFlags补全+平板导航断点修复+OnboardingGuide品牌色重写+mock-data transport补全+generate-trip transport补全
- [x] **Phase 6A 低优修复**（2026-04-17）- DayCard chunk 86KB→2.88KB（React.lazy拆分）+ localStorage容量保护（safeSetItem+isStorageNearFull）+ Hero装饰opacity 0.2→0.4 + weather.js CORS一致性 + chat.js正则去重
- [x] **Phase 6B 行程导出PDF**（2026-04-17）- TripPDFExport组件+PrintStyles打印样式+@media print CSS+TripOverview集成导出按钮
- [x] **Phase 6C 社交分享增强**（2026-04-17）- ShareTripDialog重写（4种分享：复制链接/微信Canvas卡片/微博/QQ）+ share-utils工具函数+隐私设置增强（隐藏费用/红黑榜/仅基本信息）
- [x] **Phase 6D 用户评价系统**（2026-04-17）- reviewStore+StarRating+ReviewCard+ReviewList+WriteReviewDialog+mock-review-data+FoodStoryCard评价入口+ActivityCard评价统计
- [x] **Phase 6E 智能目的地推荐**（2026-04-17）- DestinationPage+DestinationGrid+DestinationCard+DestinationDetail+mock-destination-data（12个目的地）+8种旅行风格筛选+5种排序+5维度评分
- [x] **Phase 6F 全面测试**（2026-04-17）- 3个测试Agent（新功能62项+代码质量+回归42项），通过率100%，修复3个Bug（WriteReviewDialog死代码+ReviewCard定时器清理+PrintStyles死代码）
- [x] **Phase 7A 高德地图接入**（2026-04-17）- TripMap完全重写：JS API v2.0动态加载+安全密钥配置+自定义Marker(emoji+序号)+InfoWindow+Polyline折线+地图控件+ResizeObserver+骨架屏/错误/空状态+组件卸载清理
- [x] **Phase 7B 多LLM辩论系统**（2026-04-17）- debate.js API端点（并行调用智谱GLM-4-Flash/DeepSeek V3/Gemini Flash+10s超时+辩论验证阶段+置信度计算+共识评估+Mock降级）+ chat.js集成（免费LLM>Claude>Mock优先级）+ tripStore集成（debateResult状态+15s超时）+ ChatPanel辩论验证标签（模型数+置信度进度条+共识状态+展开查看各模型回答）
- [ ] **Phase 7C 和风天气接入**（待用户提供API Key）
- [x] **Phase 7C 和风天气接入**（2026-04-17）- API Key 已配置到 .env（WEATHER_API_KEY），weather.js 已有完整调用逻辑（GeoAPI城市搜索+7天预报+Mock降级），无需修改代码
- [x] **Phase 7D API Key 全量配置**（2026-04-17）- .env 配置 5 个 API Key：高德地图(VITE_AMAP_KEY)+和风天气(WEATHER_API_KEY)+智谱(ZHIPU_API_KEY)+DeepSeek(DEEPSEEK_API_KEY)+Gemini(GEMINI_API_KEY)
- [x] **Phase 8A Netlify部署**（2026-04-17）- GitHub推送+Netlify站点创建+环境变量配置+构建修复(uuid→crypto.randomUUID)+部署成功
- [x] **Phase 8B Mock对话智能升级**（2026-04-17）- API路由修复(/.netlify/functions/debate)+前端Mock重写(30城市描述+7地区别名+4场景智能回复+mockTrip数据返回)+detectPeopleInfo正则修复
- [x] **Phase 8C Mock数据真实化**（2026-04-17）- 美食4→12道(汕头+成都+长沙)+景点2→22个(6城市)+评价10→20条+目的地数据优化+DEPLOY.md完整重写，所有环境变量名与代码匹配
- [x] **Phase 8D 文档体系完善**（2026-04-17）- 创建 docs/GoNow-PRD-V3.1-Full.docx（8章节完整PRD）+ prd-audit-report.md（需求对照审计）+ DEPLOY.md重写（含API Key申请指引）+ 所有指导文件同步更新

## 技术决策记录
- 决策1：选择 React + Vite 而非 Next.js（2026-04-15）- 原因：纯 SPA 更简单，部署到 Netlify 免费额度足够
- 决策2：选择高德地图而非 Google Maps（2026-04-15）- 原因：国内地图数据更准确，免费额度充足
- 决策3：选择 Netlify Functions 而非自建后端（2026-04-15）- 原因：免费、免运维、安全存储 API Key
- 决策4：选择 shadcn/ui 而非 Ant Design（2026-04-15）- 原因：更轻量、可定制性强、适合现代设计
- 决策5：采用「一人+多Agent」协作模式（2026-04-16）- 参考 Simon/Reviewly 模式
- 决策6：使用 Zustand 进行状态管理（2026-04-16）- 原因：轻量、API 简洁、TypeScript 友好
- 决策7：Tailwind CSS v4 使用 CSS 配置方式（2026-04-16）- 通过 @tailwindcss/vite 插件集成
- 决策8：shadcn/ui 使用 base-ui 作为底层（2026-04-16）- Sheet 组件无 asChild 属性
- 决策9：后端 API 使用 Mock 模式（2026-04-16）- 开发期不需要真实 LLM API Key，chat.js 内置4种对话场景
- 决策10：并行开发策略（2026-04-16）- 前端对话组件、后端API、行程展示组件三个任务并行开发
- 决策11：API 调用添加 3 秒超时（2026-04-16）- 开发环境 Vite 不代理 Netlify Functions，需要快速降级到 Mock
- 决策12：地图先用 CSS/SVG 占位（2026-04-16）- 后续接入高德 JS API v2.0 替换
- 决策13：Zustand persist 中间件做本地持久化（2026-04-16）- 不持久化 isGenerating 等临时状态

## 已知问题
（暂无）

## 文件结构索引
```
/workspace/gonow/                        # 项目根目录
├── ARCHITECTURE.md                      # 多Agent协作架构方案 V2.0
├── GONOW_MEMORY.md                      # 本文件 - 项目记忆
├── DEPLOY.md                            # 部署指引（含 API Key 申请教程）
├── netlify.toml                         # Netlify 配置
├── index.html                           # HTML 入口
├── vite.config.ts                       # Vite 配置
├── package.json                         # 依赖管理
├── .env.example                         # 环境变量模板
├── docs/
│   ├── GoNow-PRD-V3.1-Full.docx        # 产品需求文档 V3.1（含 Phase 9 开发计划）
│   ├── api-contracts.md                 # API 接口契约文档
│   └── prd-audit-report.md              # PRD 需求实现对照审计报告
├── src/
│   ├── main.tsx                         # 应用入口
│   ├── App.tsx                          # 根组件（路由配置）
│   ├── index.css                        # 全局样式
│   ├── components/
│   │   ├── ui/                          # shadcn/ui 组件（12个）
│   │   ├── layout/AppLayout.tsx         # 应用布局（Header+导航+Footer+移动端）
│   │   ├── chat/ChatPanel.tsx           # AI 对话面板（消息+欢迎语+建议+辩论标签）
│   │   ├── trip/                        # 行程组件
│   │   │   ├── TripOverview.tsx         # 行程总览
│   │   │   ├── DayCard.tsx              # 日程卡片
│   │   │   ├── ActivityCard.tsx         # 活动卡片
│   │   │   ├── ActivityIcon.tsx         # 活动图标
│   │   │   ├── ReplaceActivityDialog.tsx # 替换活动
│   │   │   ├── BudgetBreakdown.tsx      # 预算分解
│   │   │   ├── WeatherBar.tsx           # 天气栏
│   │   │   ├── ShareTripDialog.tsx      # 分享弹窗
│   │   │   ├── TripPDFExport.tsx        # PDF导出
│   │   │   ├── PrintStyles.tsx          # 打印样式
│   │   │   └── ScenicPlanCard.tsx       # 景点方案卡片
│   │   ├── food/                        # 美食组件
│   │   │   ├── FoodStoryCard.tsx        # 美食故事卡片
│   │   │   └── FoodRecommendList.tsx    # 美食列表
│   │   ├── destination/                 # 目的地组件
│   │   │   ├── DestinationGrid.tsx      # 目的地网格
│   │   │   ├── DestinationCard.tsx      # 目的地卡片
│   │   │   └── DestinationDetail.tsx    # 目的地详情
│   │   ├── review/                      # 评价组件
│   │   │   ├── StarRating.tsx           # 星级评分
│   │   │   ├── ReviewCard.tsx           # 评价卡片
│   │   │   ├── ReviewList.tsx           # 评价列表
│   │   │   └── WriteReviewDialog.tsx    # 写评价弹窗
│   │   ├── map/TripMap.tsx              # 高德地图组件
│   │   ├── onboarding/OnboardingGuide.tsx # 新手引导
│   │   ├── ErrorBoundary.tsx            # 错误边界
│   │   └── LoadingSpinner.tsx           # 加载动画
│   ├── pages/                           # 页面组件
│   │   ├── HomePage.tsx                 # 首页
│   │   ├── ChatPage.tsx                 # 对话页
│   │   ├── TripPage.tsx                 # 行程页
│   │   ├── FoodPage.tsx                 # 美食页
│   │   ├── ScenicPage.tsx               # 景点页
│   │   ├── DestinationPage.tsx          # 目的地页
│   │   └── SharedTripPage.tsx           # 分享行程页
│   ├── stores/
│   │   ├── tripStore.ts                 # 行程+对话状态管理
│   │   └── reviewStore.ts               # 评价状态管理
│   ├── lib/
│   │   ├── mock-data.ts                 # 行程 Mock 数据
│   │   ├── mock-food-data.ts            # 美食 Mock 数据（12道）
│   │   ├── mock-scenic-data.ts          # 景点 Mock 数据（22个）
│   │   ├── mock-destination-data.ts     # 目的地 Mock 数据（12个）
│   │   ├── mock-review-data.ts          # 评价 Mock 数据（20条）
│   │   ├── share-utils.ts               # 分享工具函数
│   │   ├── storage.ts                   # 存储工具函数
│   │   └── utils.ts                     # 通用工具函数
│   └── types/index.ts                   # 核心类型定义
├── netlify/functions/
│   ├── chat.js                          # AI 对话 API
│   ├── debate.js                        # 多LLM 辩论 API
│   ├── generate-trip.js                 # 行程生成 API
│   └── weather.js                       # 天气 API
└── public/
    ├── manifest.json                    # PWA 配置
    ├── favicon.svg                      # 网站图标
    └── icon.svg                         # 应用图标
```

## API 接口记录
| 接口 | 方法 | 用途 | 状态 |
|------|------|------|------|
| /.netlify/functions/chat | POST | AI 对话（Claude+辩论+Mock三级降级） | ✅ 已实现 |
| /.netlify/functions/debate | POST | 多LLM辩论验证（智谱+DeepSeek+Gemini） | ✅ 已实现 |
| /.netlify/functions/generate-trip | POST | 生成完整行程 | ✅ 已实现 |
| /.netlify/functions/weather | GET | 天气数据（和风天气+Mock降级） | ✅ 已实现 |
| /api/food/search | POST | 美食搜索 | ❌ 待开发（Phase 9B） |
| /api/scenic/plans | POST | 景点多方案规划 | ❌ 待开发（Phase 9B） |
| /api/geocode | GET | 地理编码 | ❌ 待开发（前端用高德JS API替代） |
| /api/route | POST | 路线规划 | ❌ 待开发（前端用Polyline替代） |
| /api/share/:token | GET | 分享链接查看 | ❌ 待开发（Phase 9C） |

## 数据模型
- **User**: id, email, nickname, avatar, preferences(UserPreferences), createdAt
- **UserPreferences**: travelStyle, dietaryRestrictions, allergies, budgetLevel, transportPreference
- **Trip**: id, destination, startDate, endDate, travelers, budget, days(Day[]), weather, status, coverImage, description
- **Day**: dayNumber, theme, activities(Activity[]), totalCost, actualCost, weather, date, notes
- **Activity**: id, type(ActivityType), name, location(Location), cost, rating, redBlackFlags, description, duration, startTime, endTime
- **Expense**: id, tripId, dayNumber, category(ExpenseCategory), amount, description
- **ChatMessage**: id, role(MessageRole), content, tripId, timestamp, isGenerating
- **ChatSession**: id, title, messages(ChatMessage[]), tripId
- **FoodRecommendation**: id, name, cuisine, avgCost, rating, story, redBlackFlags, location, signatureDishes

## 下一步计划 - Phase 9（待完成事项开发）

### Phase 9A: PWA 完整支持
- [ ] 9.1 安装 vite-plugin-pwa，配置 Service Worker（precache + runtime cache）
- [ ] 9.2 生成 PWA 图标文件（icon-192.png + icon-512.png）

### Phase 9B: 搜索与筛选
- [ ] 9.3 美食页搜索功能（基于 Mock 数据前端模糊搜索）
- [ ] 9.4 景点页筛选功能（按城市/类型/预算筛选）

### Phase 9C: 后端补全
- [ ] 9.5 分享行程后端存储（/api/share + Netlify KV）
- [ ] 9.6 高德地图安全密钥环境变量化

### Phase 9D: 质量保障
- [ ] 9.7 自定义 Hooks 抽取（useChat/useWeather/useMap）
- [ ] 9.8 单元测试框架搭建（Vitest）
- [ ] 9.9 E2E 测试框架搭建（Playwright）
- [ ] 9.10 Lighthouse 性能优化（目标 > 80）

### Phase 9E: 正式发布
- [ ] 9.11 全面回归测试
- [ ] 9.12 正式发布 V1.0

### 里程碑
| 里程碑 | 任务 | 目标 |
|--------|------|------|
| M1: PWA 完整支持 | 9.1 + 9.2 | 可安装+离线访问 |
| M2: 搜索与筛选 | 9.3 + 9.4 | 美食搜索+景点筛选 |
| M3: 后端补全 | 9.5 + 9.6 | 跨设备分享+安全加固 |
| M4: 质量保障 | 9.7-9.10 | 测试覆盖+性能优化 |
| M5: 正式发布 | 9.11 + 9.12 | 完成度100% |
