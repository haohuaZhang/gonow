# GoNow 部署指引

## 方式一：Netlify 部署（推荐）

### 步骤 1：推送到 GitHub
```bash
cd gonow
git remote add origin https://github.com/你的用户名/gonow.git
git branch -M main
git push -u origin main
```

### 步骤 2：在 Netlify 导入
1. 打开 https://app.netlify.com
2. 点击 "Add new site" → "Import an existing project"
3. 连接 GitHub，选择 gonow 仓库
4. 构建设置（自动检测 `netlify.toml`）：
   - Build command: `npx vite build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
5. 点击 "Deploy site"

### 步骤 3：配置环境变量
在 Netlify → Site settings → Environment variables 中添加：

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `VITE_AMAP_KEY` | 高德地图 JS API Key | ✅ 前端地图 |
| `WEATHER_API_KEY` | 和风天气 API Key | ✅ 天气数据 |
| `ZHIPU_API_KEY` | 智谱 AI API Key | ✅ AI 对话（多模型辩论） |
| `DEEPSEEK_API_KEY` | DeepSeek API Key | 推荐 AI 对话 |
| `GEMINI_API_KEY` | Google Gemini API Key | 推荐 AI 对话 |
| `ANTHROPIC_API_KEY` | Claude API Key | 可选 备用 |

> **降级策略**：如果 LLM API Key 都未配置，AI 对话自动降级到本地 Mock 模式（智能识别城市/日期/人数）。

### 步骤 4：自定义域名（可选）
在 Netlify → Domain management → Add custom domain

## API Key 免费申请指引

### 高德地图（免费额度足够）
1. 访问 https://lbs.amap.com
2. 注册/登录
3. 控制台 → 应用管理 → 创建新应用
4. 添加 Key → 选择 "Web端(JS API)" → 获取 `VITE_AMAP_KEY`
5. 在应用详情中获取安全密钥（配置到 `index.html` 的 `window._AMapSecurityConfig`）

### 智谱 AI GLM-4-Flash（完全免费）
1. 访问 https://open.bigmodel.cn
2. 注册/登录
3. 控制台 → API Keys → 创建 API Key
4. 复制 Key

### DeepSeek V3（完全免费）
1. 访问 https://platform.deepseek.com
2. 注册/登录
3. API Keys → Create Key
4. 复制 Key

### Google Gemini Flash（免费 1500次/天）
1. 访问 https://aistudio.google.com/apikey
2. 登录 Google 账号
3. Create API Key
4. 复制 Key

### 和风天气（免费版每天 1000 次）
1. 访问 https://dev.qweather.com
2. 注册/登录
3. 项目管理 → 创建项目 → 添加凭据 → 选择 "API KEY"
4. 复制 Key

## 方式二：本地预览
```bash
cd gonow
npm install
npm run dev
# 访问 http://localhost:5173
```

## 多 LLM 辩论系统说明

GoNow 的 AI 对话使用创新的多模型辩论验证机制：

```
用户问题 → 并行调用3个免费LLM → 收集回答 → 辩论验证 → 综合答案 → 返回
```

- **2+ 个模型成功** → 辩论验证阶段（互相审核，输出综合答案 + 置信度）
- **1 个模型成功** → 直接使用
- **全部失败** → 降级到本地 Mock 模式

AI 回复下方会显示"多模型验证"标签（参与模型数 + 置信度 + 共识状态）。
