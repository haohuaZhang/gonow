# GoNow API 接口契约

> 前后端并行开发的接口约定文档
> 最后更新：2026-04-16

---

## 通用规范

### 响应格式
```typescript
// 成功
{ success: true, data: T }

// 失败
{ success: false, error: { code: string, message: string } }
```

### 错误码
| 错误码 | HTTP 状态码 | 说明 |
|--------|-----------|------|
| INVALID_PARAMS | 400 | 参数缺失或格式错误 |
| UNAUTHORIZED | 401 | 未授权（需要登录） |
| NOT_FOUND | 404 | 资源不存在 |
| RATE_LIMITED | 429 | 请求频率超限 |
| AI_SERVICE_ERROR | 500 | AI 服务调用失败 |
| INTERNAL_ERROR | 500 | 服务器内部错误 |

---

## Phase 1 接口

### POST /api/chat

**用途**：AI 对话代理，理解用户输入并返回回复

**请求体**：
```typescript
{
  message: string          // 用户输入的消息
  sessionId?: string       // 会话 ID（续聊时传入）
  context?: {
    destination?: string   // 已知的目的地
    dates?: string         // 已知的日期范围
    travelers?: number     // 已知的人数
  }
}
```

**响应体**：
```typescript
{
  success: true,
  data: {
    reply: string          // AI 回复文本（支持 Markdown）
    sessionId: string      // 会话 ID
    suggestions?: string[] // 推荐的追问选项
    tripData?: Trip        // 如果 AI 判断可以生成行程，附带行程数据
  }
}
```

**Mock 数据**（前端开发用）：
```typescript
{
  success: true,
  data: {
    reply: "你好！我是 GoNow 旅行助手 🌍 请告诉我你想去哪里旅行？比如：\n- \"周末从北京出发，想去海边放松三天\"\n- \"五一假期带父母去成都，预算人均3000\"",
    sessionId: "mock-session-001",
    suggestions: [
      "周末从北京出发，想去海边放松三天",
      "五一假期带父母去成都，预算人均3000",
      "下个月想去西安，一个人自由行"
    ]
  }
}
```

---

### POST /api/generate-trip

**用途**：根据对话上下文生成完整行程

**请求体**：
```typescript
{
  sessionId: string        // 会话 ID
  destination: string      // 目的地城市
  startDate: string        // 出发日期（YYYY-MM-DD）
  endDate: string          // 返回日期（YYYY-MM-DD）
  travelers: number        // 出行人数
  budget?: {
    total?: number         // 总预算
    level?: string         // 预算级别（economy/comfortable/luxury）
  }
  preferences?: string[]   // 偏好标签（["美食", "文化", "自然", "购物"]）
}
```

**响应体**：
```typescript
{
  success: true,
  data: {
    trip: Trip             // 完整行程数据
    warnings?: string[]    // 警告信息（如"当前为旅游旺季，建议提前预订"）
  }
}
```

---

## Phase 2 接口

### GET /api/weather?city={city}&date={date}

**用途**：获取天气数据

**响应体**：
```typescript
{
  success: true,
  data: {
    city: string
    date: string
    temp: { min: number, max: number }
    weather: string        // "晴" | "多云" | "小雨" 等
    humidity: number
    wind: string
    suggestion: string     // 穿衣/出行建议
  }
}
```

### POST /api/route

**用途**：路线规划

**请求体**：
```typescript
{
  origin: { lng: number, lat: number }
  destination: { lng: number, lat: number }
  mode: "walking" | "driving" | "transit"
  waypoints?: { lng: number, lat: number }[]
}
```

**响应体**：
```typescript
{
  success: true,
  data: {
    distance: number       // 米
    duration: number       // 秒
    steps: RouteStep[]
    polyline: string       // 编码后的路线坐标
  }
}
```

---

## Phase 3 接口

### POST /api/food/search

**用途**：美食搜索（多源采集 + 交叉验证）

**请求体**：
```typescript
{
  city: string
  category?: "苍蝇馆" | "必吃榜" | "本地人推荐" | "特色小吃"
  keyword?: string
  location?: { lng: number, lat: number }
  radius?: number         // 搜索半径（米）
}
```

**响应体**：
```typescript
{
  success: true,
  data: {
    foods: FoodRecommendation[]
    credibility: "★★★★"  // 整体可信度
  }
}
```

### POST /api/scenic/plans

**用途**：景点多方案规划

**请求体**：
```typescript
{
  scenicName: string
  city: string
  date?: string           // 游览日期（用于天气/客流判断）
  travelers?: { adults: number, children: number, seniors: number }
}
```

**响应体**：
```typescript
{
  success: true,
  data: {
    scenicName: string
    plans: ScenicPlan[]   // 多个方案
    bestPhotoSpots?: PhotoSpot[]
    crowdLevel?: "low" | "medium" | "high"
  }
}
```
