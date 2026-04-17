/**
 * /.netlify/functions/fetch-trending - 动态季节性旅行推荐接口
 *
 * 功能：调用 LLM 生成基于当前月份/季节的热门旅行推荐数据
 * 数据来源模拟：小红书、飞猪、携程、马蜂窝等平台趋势分析
 *
 * 支持的 LLM（降级策略：依次尝试，失败切换下一个）：
 * - 智谱 AI (GLM-4-Flash)
 * - DeepSeek V3
 * - Google Gemini Flash
 *
 * 缓存策略：模块级内存缓存，按月刷新，TTL 24 小时
 *
 * 接口：
 * GET /.netlify/functions/fetch-trending?type=destinations|food|scenic|all
 */

const crypto = require('crypto');

// ============ CORS 响应头 ============

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

// ============ 内存缓存 ============

const cache = { destinations: null, food: null, scenic: null, timestamp: 0 };
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 小时

// ============ LLM 配置 ============

const TRENDING_SYSTEM_PROMPT = `你是一位资深旅行趋势分析师，擅长从各大旅行平台（小红书、飞猪、携程、马蜂窝、去哪儿等）挖掘当季热门旅行数据。你需要根据当前月份和季节，推荐最值得去的旅行目的地、美食和景点。所有推荐必须基于真实的热门趋势，并给出具体的热门理由。`;

const LLM_CONFIGS = {
  zhipu: {
    name: 'glm-4-flash',
    label: '智谱 GLM-4-Flash',
    apiKeyEnv: 'ZHIPU_API_KEY',
    apiUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    buildRequest: (apiKey, message) => ({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: [
          { role: 'system', content: TRENDING_SYSTEM_PROMPT },
          { role: 'user', content: message },
        ],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    }),
    parseResponse: (data) => data.choices?.[0]?.message?.content || '',
  },
  deepseek: {
    name: 'deepseek-chat',
    label: 'DeepSeek V3',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
    apiUrl: 'https://api.deepseek.com/v1/chat/completions',
    buildRequest: (apiKey, message) => ({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: TRENDING_SYSTEM_PROMPT },
          { role: 'user', content: message },
        ],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    }),
    parseResponse: (data) => data.choices?.[0]?.message?.content || '',
  },
  gemini: {
    name: 'gemini-2.0-flash',
    label: 'Google Gemini Flash',
    apiKeyEnv: 'GEMINI_API_KEY',
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    buildRequest: (apiKey, message) => ({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `${TRENDING_SYSTEM_PROMPT}\n\n${message}` }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
        },
      }),
    }),
    parseResponse: (data) => {
      try {
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } catch {
        return '';
      }
    },
  },
};

// ============ 辅助函数 ============

/**
 * 获取当前月份标识 (YYYY-MM)
 */
function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * 获取当前季节信息
 */
function getSeasonInfo() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const dateStr = `${year}年${month}月`;

  let season = '';
  let seasonDesc = '';
  if (month >= 3 && month <= 5) {
    season = '春季';
    seasonDesc = '春暖花开，万物复苏，适合踏青赏花';
  } else if (month >= 6 && month <= 8) {
    season = '夏季';
    seasonDesc = '夏日炎炎，适合避暑玩水、海滨度假';
  } else if (month >= 9 && month <= 11) {
    season = '秋季';
    seasonDesc = '秋高气爽，层林尽染，适合赏秋品蟹';
  } else {
    season = '冬季';
    seasonDesc = '冬日暖阳，适合温泉滑雪、南方避寒';
  }

  return { dateStr, season, seasonDesc, month, year };
}

/**
 * 生成 UUID
 */
function generateId() {
  try {
    return crypto.randomUUID();
  } catch {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
  }
}

/**
 * 获取已配置的 LLM 列表
 */
function getAvailableLLMs() {
  const available = [];
  for (const [key, config] of Object.entries(LLM_CONFIGS)) {
    const apiKey = process.env[config.apiKeyEnv];
    if (apiKey && apiKey.trim() !== '' && apiKey !== `your_${key}_api_key`) {
      available.push({ key, ...config, apiKey });
    }
  }
  return available;
}

/**
 * 调用单个 LLM（带超时控制）
 */
async function callLLM(llm, message, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    const url = llm.key === 'gemini'
      ? `${llm.apiUrl}?key=${llm.apiKey}`
      : llm.apiUrl;

    const request = llm.buildRequest(llm.apiKey, message);

    response = await fetch(url, {
      ...request,
      signal: controller.signal,
    });
  } catch (fetchError) {
    clearTimeout(timeoutId);
    if (fetchError.name === 'AbortError') {
      throw new Error(`${llm.label} 请求超时（${timeoutMs / 1000}秒）`);
    }
    throw fetchError;
  }

  clearTimeout(timeoutId);

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '未知错误');
    throw new Error(`${llm.label} API 调用失败: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  const answer = llm.parseResponse(data);

  if (!answer || answer.trim() === '') {
    throw new Error(`${llm.label} 返回了空回答`);
  }

  return answer.trim();
}

/**
 * 从 LLM 回复中提取 JSON（兼容 markdown 代码块包裹的情况）
 */
function extractJSON(text) {
  // 尝试直接解析
  try {
    return JSON.parse(text);
  } catch {
    // 忽略，继续尝试其他方式
  }

  // 尝试从 markdown 代码块中提取
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {
      // 忽略
    }
  }

  // 尝试找到第一个 [ 或 { 到最后一个 ] 或 } 之间的内容
  const bracketStart = text.indexOf('[') !== -1 ? text.indexOf('[') : text.indexOf('{');
  const bracketEnd = text.lastIndexOf(']') !== -1 ? text.lastIndexOf(']') : text.lastIndexOf('}');
  if (bracketStart !== -1 && bracketEnd > bracketStart) {
    try {
      return JSON.parse(text.substring(bracketStart, bracketEnd + 1));
    } catch {
      // 忽略
    }
  }

  return null;
}

// ============ Prompt 构建 ============

const GRADIENT_COLORS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  'linear-gradient(135deg, #f5576c 0%, #ff6a00 100%)',
  'linear-gradient(135deg, #0250c5 0%, #d43f8d 100%)',
  'linear-gradient(135deg, #09203f 0%, #537895 100%)',
  'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
];

function buildDestinationsPrompt(seasonInfo) {
  return `当前时间：${seasonInfo.dateStr}，当前季节：${seasonInfo.season}（${seasonInfo.seasonDesc}）。

请根据小红书、飞猪、携程、马蜂窝等平台的热门数据，推荐当前月份最值得去的 6 个国内旅行目的地。

要求：
1. 每个目的地必须包含完整的字段信息
2. tags 从以下选项中选择 2-3 个：food, culture, nature, family, adventure, romantic, budget, luxury
3. bestSeason 格式如 "3-5月"
4. avgBudget 为人均每天预算（元），范围 100-2000
5. avgDays 为建议游玩天数，范围 2-10
6. 各项评分范围 3.0-5.0，保留一位小数
7. highlights 包含 3-5 个亮点描述
8. trendingReason 必须引用具体平台的热门趋势（如"小红书热搜TOP10"、"飞猪当月预订量增长200%"等）
9. coverImage 使用以下渐变色之一：${GRADIENT_COLORS.join('\n')}

请严格返回以下 JSON 格式的数组，不要添加任何其他文字说明：
[
  {
    "id": "自动生成唯一ID",
    "name": "目的地名称",
    "province": "所在省份",
    "coverImage": "从上面选择一个渐变色",
    "description": "50字以内的目的地简介",
    "tags": ["food", "culture"],
    "bestSeason": "3-5月",
    "avgBudget": 500,
    "avgDays": 4,
    "rating": 4.7,
    "highlights": ["亮点1", "亮点2", "亮点3"],
    "foodScore": 4.5,
    "scenicScore": 4.3,
    "cultureScore": 4.0,
    "transportScore": 3.8,
    "costScore": 4.2,
    "trendingReason": "小红书热搜#xxx，飞猪当月预订量增长xxx%"
  }
]`;
}

function buildFoodPrompt(seasonInfo) {
  return `当前时间：${seasonInfo.dateStr}，当前季节：${seasonInfo.season}（${seasonInfo.seasonDesc}）。

请根据小红书、大众点评、美团、携程美食林等平台的热门数据，推荐当前月份最值得打卡的 6 家国内餐厅/美食。

要求：
1. 每个美食推荐必须包含完整的字段信息
2. cuisine 为菜系类型（如川菜、粤菜、日料、西餐等）
3. avgCost 为人均消费（元），范围 20-500
4. rating 范围 3.5-5.0，保留一位小数
5. story 为 80-150 字的推荐理由（故事化描述，包含为什么这个季节特别推荐）
6. signatureDishes 包含 3-5 个招牌菜
7. mustOrder 包含 3-5 个必点菜，recommendation 范围 1-5
8. tips 包含 2-4 条实用小贴士
9. trendingReason 必须引用具体平台的热门趋势
10. tags 从以下选项中选择 2-3 个：苍蝇馆, 必吃榜, 网红店, 老字号, 米其林, 黑珍珠, 排队王, 隐藏菜单, 本地人推荐, 打卡圣地
11. city 为餐厅所在城市

请严格返回以下 JSON 格式的数组，不要添加任何其他文字说明：
[
  {
    "id": "自动生成唯一ID",
    "name": "餐厅名称",
    "cuisine": "菜系类型",
    "avgCost": 80,
    "rating": 4.8,
    "story": "推荐理由故事化描述...",
    "city": "所在城市",
    "signatureDishes": ["招牌菜1", "招牌菜2", "招牌菜3"],
    "mustOrder": [
      { "name": "必点菜名", "recommendation": 5 },
      { "name": "必点菜名", "recommendation": 4 }
    ],
    "tips": ["实用小贴士1", "实用小贴士2"],
    "trendingReason": "小红书种草笔记超10万篇，大众点评必吃榜上榜...",
    "tags": ["苍蝇馆", "必吃榜"]
  }
]`;
}

function buildScenicPrompt(seasonInfo) {
  return `当前时间：${seasonInfo.dateStr}，当前季节：${seasonInfo.season}（${seasonInfo.seasonDesc}）。

请根据小红书、携程、马蜂窝、飞猪等平台的热门数据，推荐当前月份最值得游览的 4 个国内热门景点，并为每个景点提供多种游玩方案。

要求：
1. 每个景点必须包含完整的字段信息
2. plans 数组包含 2-3 种不同的游玩方案
3. plan.type 从以下选项中选择：主流, 深度, 经济, 豪华, 亲子, 情侣
4. plan.duration 格式如 "2-3小时"、"半天"、"一天"
5. plan.cost 格式如 "约¥200"、"免费"、"¥50-100"
6. plan.description 为 50-100 字的方案描述
7. plan.highlights 包含 2-4 个方案亮点
8. plan.tips 包含 2-3 条实用小贴士
9. trendingReason 必须引用具体平台的热门趋势

请严格返回以下 JSON 格式的数组，不要添加任何其他文字说明：
[
  {
    "id": "自动生成唯一ID",
    "name": "景点名称",
    "city": "所在城市",
    "province": "所在省份",
    "plans": [
      {
        "type": "主流",
        "duration": "4-5小时",
        "cost": "约¥200",
        "description": "方案描述...",
        "highlights": ["亮点1", "亮点2"],
        "tips": ["小贴士1", "小贴士2"]
      },
      {
        "type": "深度",
        "duration": "一整天",
        "cost": "约¥350",
        "description": "深度游方案描述...",
        "highlights": ["亮点1", "亮点2", "亮点3"],
        "tips": ["小贴士1", "小贴士2"]
      }
    ],
    "trendingReason": "小红书热搜景点，携程当月门票销量TOP5..."
  }
]`;
}

// ============ 数据获取与解析 ============

/**
 * 通过 LLM 获取指定类型的推荐数据
 */
async function fetchTrendingData(type, seasonInfo, availableLLMs) {
  let prompt;
  switch (type) {
    case 'destinations':
      prompt = buildDestinationsPrompt(seasonInfo);
      break;
    case 'food':
      prompt = buildFoodPrompt(seasonInfo);
      break;
    case 'scenic':
      prompt = buildScenicPrompt(seasonInfo);
      break;
    default:
      throw new Error(`未知的推荐类型: ${type}`);
  }

  // 依次尝试每个 LLM，失败则切换下一个
  for (let i = 0; i < availableLLMs.length; i++) {
    const llm = availableLLMs[i];
    console.log(`[fetch-trending] 尝试使用 ${llm.label} 获取 ${type} 数据 (${i + 1}/${availableLLMs.length})...`);

    try {
      const rawText = await callLLM(llm, prompt, 30000);
      const parsed = extractJSON(rawText);

      if (!parsed) {
        console.error(`[fetch-trending] ${llm.label} 返回的数据无法解析为 JSON`);
        continue;
      }

      if (!Array.isArray(parsed) || parsed.length === 0) {
        console.error(`[fetch-trending] ${llm.label} 返回的数据不是有效的数组`);
        continue;
      }

      // 为每条数据补充 id（如果 LLM 没有生成有效 id）
      const enriched = parsed.map((item) => ({
        ...item,
        id: item.id && item.id.startsWith('id-') ? item.id : generateId(),
      }));

      console.log(`[fetch-trending] ${llm.label} 成功返回 ${enriched.length} 条 ${type} 数据`);
      return enriched;
    } catch (err) {
      console.error(`[fetch-trending] ${llm.label} 获取 ${type} 数据失败:`, err.message);
      continue;
    }
  }

  return null;
}

/**
 * 从缓存获取数据，或调用 LLM 获取新数据
 */
async function getTrendingData(type, seasonInfo, availableLLMs) {
  const currentMonth = getCurrentMonth();
  const now = Date.now();

  // 检查缓存是否有效（未过期且月份匹配）
  if (
    cache[type] !== null &&
    cache.timestamp > 0 &&
    (now - cache.timestamp) < CACHE_TTL &&
    cache.month === currentMonth
  ) {
    console.log(`[fetch-trending] 使用缓存的 ${type} 数据`);
    return cache[type];
  }

  // 缓存无效，调用 LLM 获取新数据
  console.log(`[fetch-trending] 缓存无效或已过期，调用 LLM 获取 ${type} 数据...`);
  const data = await fetchTrendingData(type, seasonInfo, availableLLMs);

  if (data) {
    cache[type] = data;
    cache.timestamp = now;
    cache.month = currentMonth;
  }

  return data;
}

// ============ Netlify Function 主入口 ============

const handler = async (event) => {
  // 处理 CORS 预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  // 仅允许 GET 请求
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: '仅支持 GET 请求',
      }),
    };
  }

  try {
    // 解析查询参数
    const type = (event.queryStringParameters?.type || 'all').toLowerCase();
    const validTypes = ['destinations', 'food', 'scenic', 'all'];
    if (!validTypes.includes(type)) {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: `无效的 type 参数，可选值: ${validTypes.join(', ')}`,
        }),
      };
    }

    // 获取已配置的 LLM 列表
    const availableLLMs = getAvailableLLMs();
    console.log(`[fetch-trending] 可用 LLM 数量: ${availableLLMs.length}, 模型: ${availableLLMs.map((l) => l.label).join(', ')}`);

    if (availableLLMs.length === 0) {
      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'No LLM available',
        }),
      };
    }

    const seasonInfo = getSeasonInfo();
    const typesToFetch = type === 'all'
      ? ['destinations', 'food', 'scenic']
      : [type];

    // 并行获取所有需要的数据
    const results = await Promise.all(
      typesToFetch.map(async (t) => {
        const data = await getTrendingData(t, seasonInfo, availableLLMs);
        return { type: t, data };
      })
    );

    // 构建返回数据
    const responseData = {};
    let hasError = false;

    for (const result of results) {
      if (result.data) {
        responseData[result.type] = result.data;
      } else {
        hasError = true;
        responseData[result.type] = null;
      }
    }

    // 如果所有类型都获取失败
    if (Object.values(responseData).every((v) => v === null)) {
      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: '所有 LLM 调用均失败，无法获取推荐数据',
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        data: responseData,
        season: seasonInfo.season,
        month: seasonInfo.dateStr,
        cached: cache.timestamp > 0 && (Date.now() - cache.timestamp) < CACHE_TTL,
      }),
    };
  } catch (error) {
    console.error('[fetch-trending] 服务端错误:', error);

    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: '服务器内部错误，请稍后重试',
      }),
    };
  }
};

module.exports = { handler };
