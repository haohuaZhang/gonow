# GoNow 部署指引

## 方式一：Netlify 部署（推荐）

### 步骤 1：推送到 GitHub
```bash
cd /workspace/gonow
git remote add origin https://github.com/你的用户名/gonow.git
git branch -M main
git push -u origin main
```

### 步骤 2：在 Netlify 导入
1. 打开 https://app.netlify.com
2. 点击 "Add new site" → "Import an existing project"
3. 连接 GitHub，选择 gonow 仓库
4. 构建设置：
   - Build command: `npm run build`（自动检测）
   - Publish directory: `dist`（自动检测）
5. 点击 "Deploy site"

### 步骤 3：配置环境变量
在 Netlify → Site settings → Environment variables 中添加：

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| VITE_AMAP_KEY | 高德地图 JS API Key | https://lbs.amap.com 注册 → 应用管理 → 创建新应用 |
| AMAP_WEB_KEY | 高德 Web Service Key | 同上，Key 类型选 "Web服务" |
| ANTHROPIC_API_KEY | Claude API Key | https://console.anthropic.com 获取 |
| WEATHER_API_KEY | 和风天气 API Key | https://dev.qweather.com 注册 → 项目管理 → 创建项目 |

### 步骤 4：自定义域名（可选）
在 Netlify → Domain management → Add custom domain

## 方式二：本地预览
```bash
cd /workspace/gonow
npm install
npm run dev
# 访问 http://localhost:5173
```

## API Key 免费申请指引

### 高德地图（免费额度足够）
1. 访问 https://lbs.amap.com
2. 注册/登录
3. 控制台 → 应用管理 → 创建新应用
4. 添加 Key → 选择 "Web端(JS API)" → 获取 VITE_AMAP_KEY
5. 再添加一个 Key → 选择 "Web服务" → 获取 AMAP_WEB_KEY

### Claude API（Anthropic）
1. 访问 https://console.anthropic.com
2. 注册/登录
3. API Keys → Create Key
4. 复制 Key（只显示一次）

### 和风天气（免费版每天 1000 次）
1. 访问 https://dev.qweather.com
2. 注册/登录
3. 项目管理 → 创建项目
4. 获取 Key
