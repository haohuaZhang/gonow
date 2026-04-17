/**
 * /api/chat - AI 对话代理接口
 *
 * 功能：处理用户对话请求，返回 AI 回复、推荐追问和行程数据
 * 优先级：免费 LLM 辩论系统 > Claude API > Mock 模式
 * - 如果配置了 ZHIPU_API_KEY / DEEPSEEK_API_KEY / GEMINI_API_KEY，转发到 /api/debate
 * - 如果配置了 ANTHROPIC_API_KEY，使用 Claude API
 * - 否则降级到 Mock 模式
 */

const { v4: uuidv4 } = require('uuid');

// ============ CORS 响应头 ============

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// ============ 内置 Mock 行程数据（汕头 2 日游） ============

const mockTrip = {
  id: 'trip-001',
  destination: '汕头',
  startDate: '2026-05-01',
  endDate: '2026-05-02',
  travelers: 2,
  budget: 2000,
  status: 'planning',
  days: [
    {
      dayNumber: 1,
      theme: '美食探索之旅',
      date: '2026-05-01',
      totalCost: 195,
      actualCost: 0,
      activities: [
        {
          id: 'a1',
          type: 'food',
          name: '杏花吴记牛肉火锅',
          location: {
            name: '杏花吴记牛肉火锅',
            lat: 23.3535,
            lng: 116.6818,
            address: '汕头市金平区',
          },
          cost: 120,
          rating: 4.8,
          description: '汕头必吃榜火锅店，30年老店，现宰现切',
          redBlackFlags: {
            redFlags: ['排队较长，建议11点前到'],
            blackFlags: [],
            credibilityScore: 85,
          },
          duration: 90,
          startTime: '11:30',
          endTime: '13:00',
        },
        {
          id: 'a2',
          type: 'scenic',
          name: '汕头小公园',
          location: {
            name: '汕头小公园',
            lat: 23.3554,
            lng: 116.6797,
            address: '汕头市金平区',
          },
          cost: 0,
          rating: 4.5,
          description: '百年骑楼建筑群，汕头城市名片',
          redBlackFlags: {
            redFlags: ['节假日人流量大，建议工作日前往'],
            blackFlags: [],
            credibilityScore: 80,
          },
          duration: 120,
          startTime: '14:00',
          endTime: '16:00',
        },
        {
          id: 'a3',
          type: 'food',
          name: '老妈宫粽球',
          location: {
            name: '老妈宫粽球',
            lat: 23.354,
            lng: 116.68,
            address: '汕头市金平区',
          },
          cost: 15,
          rating: 4.6,
          description: '汕头特色小吃，甜咸双拼',
          redBlackFlags: {
            redFlags: ['门店较小，排队可能较长'],
            blackFlags: [],
            credibilityScore: 80,
          },
          duration: 30,
          startTime: '16:00',
          endTime: '16:30',
        },
        {
          id: 'a4',
          type: 'food',
          name: '长平老姿娘夜粥',
          location: {
            name: '长平老姿娘夜粥',
            lat: 23.351,
            lng: 116.685,
            address: '汕头市金平区长平路',
          },
          cost: 60,
          rating: 4.7,
          description: '汕头人深夜食堂，上百种配菜任选',
          redBlackFlags: {
            redFlags: ['营业时间较晚，建议提前确认'],
            blackFlags: [],
            credibilityScore: 80,
          },
          duration: 60,
          startTime: '20:00',
          endTime: '21:00',
        },
      ],
    },
    {
      dayNumber: 2,
      theme: '文化体验之旅',
      date: '2026-05-02',
      totalCost: 220,
      actualCost: 0,
      activities: [
        {
          id: 'b1',
          type: 'scenic',
          name: '南澳岛',
          location: {
            name: '南澳岛',
            lat: 23.425,
            lng: 116.975,
            address: '汕头市南澳县',
          },
          cost: 200,
          rating: 4.6,
          description: '广东最美海岛，蓝天碧海',
          redBlackFlags: {
            redFlags: ['进岛需过桥收费，建议提前查看天气'],
            blackFlags: [],
            credibilityScore: 80,
          },
          duration: 240,
          startTime: '09:00',
          endTime: '13:00',
        },
        {
          id: 'b2',
          type: 'food',
          name: '亚强果汁冰',
          location: {
            name: '亚强果汁冰',
            lat: 23.356,
            lng: 116.682,
            address: '汕头市金平区',
          },
          cost: 20,
          rating: 4.5,
          description: '汕头人从小喝到大的果汁冰',
          redBlackFlags: {
            redFlags: [],
            blackFlags: [],
            credibilityScore: 80,
          },
          duration: 30,
          startTime: '15:00',
          endTime: '15:30',
        },
        {
          id: 'b3',
          type: 'culture',
          name: '潮汕非物质文化遗产展示馆',
          location: {
            name: '潮汕非物质文化遗产展示馆',
            lat: 23.352,
            lng: 116.683,
            address: '汕头市金平区',
          },
          cost: 0,
          rating: 4.3,
          description: '了解潮汕木雕、潮绣、陶瓷等非遗文化',
          redBlackFlags: {
            redFlags: ['周一可能闭馆，建议提前确认开放时间'],
            blackFlags: [],
            credibilityScore: 80,
          },
          duration: 90,
          startTime: '16:00',
          endTime: '17:30',
        },
      ],
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ============ 常见城市名列表（用于 Mock 识别） ============

const KNOWN_CITIES = [
  '北京', '上海', '广州', '深圳', '成都', '杭州', '重庆', '西安',
  '苏州', '南京', '长沙', '武汉', '厦门', '青岛', '大连', '三亚',
  '丽江', '桂林', '昆明', '贵阳', '拉萨', '哈尔滨', '洛阳', '开封',
  '汕头', '潮州', '揭阳', '珠海', '东莞', '佛山', '中山', '惠州',
  '东京', '首尔', '曼谷', '新加坡', '巴黎', '伦敦', '纽约', '罗马',
];

// ============ 辅助函数 ============

/**
 * 生成简单的会话 ID
 * 在 Netlify Functions 环境中可能没有 uuid 依赖，使用备用方案
 */
function generateSessionId() {
  try {
    return uuidv4();
  } catch {
    // 备用方案：使用时间戳 + 随机数
    return 'session-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
  }
}

/**
 * 检测消息中是否包含城市名
 * @param {string} message - 用户消息
 * @returns {string|null} - 匹配到的城市名，未匹配返回 null
 */
function detectCity(message) {
  for (const city of KNOWN_CITIES) {
    if (message.includes(city)) {
      return city;
    }
  }
  return null;
}

/**
 * 检测消息中是否包含日期信息
 * @param {string} message - 用户消息
 * @returns {boolean}
 */
function hasDateInfo(message) {
  // 匹配常见日期格式：X月X日、YYYY-MM-DD、X天、几天等
  const datePatterns = [
    /\d{1,2}月\d{1,2}[日号]/,
    /\d{4}-\d{2}-\d{2}/,
    /\d+[天晚]/,
    /五一|国庆|春节|清明|端午|中秋/,
    /周末|假期/,
  ];
  return datePatterns.some((pattern) => pattern.test(message));
}

/**
 * 检测消息中是否包含人数信息
 * @param {string} message - 用户消息
 * @returns {boolean}
 */
function hasTravelerInfo(message) {
  const travelerPatterns = [
    /\d+[人个位]/,
    /一个人|两个人|三个人|四个人|五个人/,
    /情侣|家庭|朋友|同事|亲子|带娃|带小孩|带老人/,
    /全家|一家/,
  ];
  return travelerPatterns.some((pattern) => pattern.test(message));
}

// ============ Claude API 调用 ============

/**
 * 调用 Claude API 获取 AI 回复
 * @param {string} message - 用户消息
 * @returns {Promise<object>} AI 回复数据
 */
async function callClaudeAPI(message) {
  // 设置 8 秒超时控制，避免超过 Netlify 10 秒限制
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  let response;
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: '你是 GoNow 旅行规划助手，一个友好、专业的 AI 旅行顾问。你的任务是帮助用户规划旅行行程。回复要简洁友好，使用中文。当用户提供了足够的信息（目的地、日期、人数），生成一个旅行行程概要。',
        messages: [{ role: 'user', content: message }],
      }),
      signal: controller.signal,
    });
  } catch (fetchError) {
    clearTimeout(timeoutId);
    if (fetchError.name === 'AbortError') {
      throw new Error('Claude API 请求超时（8秒）');
    }
    throw fetchError;
  }

  clearTimeout(timeoutId);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Claude API 调用失败: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  const reply = data.content?.[0]?.text || '抱歉，我暂时无法回复，请稍后再试。';

  return {
    reply,
    sessionId: generateSessionId(),
    suggestions: [
      '帮我调整一下行程',
      '有没有更省钱的方案？',
      '推荐一些当地特色美食',
    ],
    tripData: null,
  };
}

// ============ Mock 对话逻辑 ============

/**
 * 处理第一次对话（无 sessionId）
 * @returns {object} 欢迎回复数据
 */
function handleFirstChat() {
  return {
    reply:
      '你好！我是 GoNow 旅行助手 🌍\n\n' +
      '我可以帮你规划完美的旅行行程，包括景点推荐、美食探店、住宿安排等。\n\n' +
      '告诉我你想去哪里，我来为你量身定制行程吧！',
    sessionId: generateSessionId(),
    suggestions: [
      '我想去汕头玩 2 天，帮我规划一下',
      '五一假期想去成都，3个人，预算3000',
      '推荐一个适合情侣的周末短途旅行',
    ],
    tripData: null,
  };
}

/**
 * 处理包含城市名的对话
 * @param {string} city - 识别到的城市名
 * @param {string} sessionId - 会话 ID
 * @returns {object} 确认回复数据
 */
function handleCityDetected(city, sessionId) {
  return {
    reply:
      `好的！${city}是个很棒的选择！${getCityDescription(city)}\n\n` +
      '为了给你规划最合适的行程，我还需要了解一些信息：\n\n' +
      '1. 你计划什么时候去？（具体日期或大概时间）\n' +
      '2. 一共几个人出行？\n' +
      '3. 有没有预算范围？\n\n' +
      '你可以一次性告诉我，也可以慢慢聊～',
    sessionId,
    suggestions: [
      `${city}2天1夜，2个人，预算2000`,
      `五一去${city}，3个人，喜欢美食`,
      `${city}有什么必去的地方？`,
    ],
    tripData: null,
  };
}

/**
 * 处理包含完整信息的对话（城市 + 日期 + 人数）
 * @param {string} city - 识别到的城市名
 * @param {string} sessionId - 会话 ID
 * @returns {object} 行程生成回复数据
 */
function handleCompleteInfo(city, sessionId) {
  // 使用内置的 Mock 行程数据
  const tripData = { ...mockTrip, destination: city };

  return {
    reply:
      `太好了！我已经为你收集到足够的信息，正在为你生成${city}的专属行程...\n\n` +
      '✅ 行程已生成！你可以查看详细的每日安排，包括：\n\n' +
      '• 精选景点和活动推荐\n' +
      '• 当地特色美食探店\n' +
      '• 红黑榜避坑指南\n' +
      '• 费用预算参考\n\n' +
      '如果需要调整，随时告诉我！',
    sessionId,
    suggestions: [
      '帮我调整一下第二天的行程',
      '有没有更省钱的方案？',
      '推荐一些当地特色美食',
    ],
    tripData,
  };
}

/**
 * 处理其他情况的对话
 * @param {string} sessionId - 会话 ID
 * @returns {object} 引导回复数据
 */
function handleDefaultChat(sessionId) {
  return {
    reply:
      '我理解你的意思！不过为了给你更好的推荐，你可以试试这样告诉我：\n\n' +
      '• "我想去 [城市] 玩 [几天]"\n' +
      '• "[城市] [几月] 去，[几] 个人"\n' +
      '• "帮我规划一个 [城市] 的 [天数] 日游"\n\n' +
      '当然，你也可以直接问我任何旅行相关的问题！',
    sessionId,
    suggestions: [
      '我想去汕头玩 2 天，帮我规划一下',
      '五一假期有什么推荐的目的地？',
      '两个人去成都大概要花多少钱？',
    ],
    tripData: null,
  };
}

/**
 * 获取城市描述（Mock 数据）
 * @param {string} city - 城市名
 * @returns {string} 城市描述
 */
function getCityDescription(city) {
  const descriptions = {
    汕头: '潮汕美食之都，牛肉火锅、卤鹅、肠粉...吃货的天堂！',
    成都: '天府之国，火锅、熊猫、宽窄巷子，巴适得很！',
    广州: '花城广州，早茶文化、粤式美食、珠江夜景！',
    厦门: '海上花园，鼓浪屿、沙茶面、文艺小清新的好去处！',
    西安: '十三朝古都，兵马俑、回民街、大唐不夜城！',
    杭州: '人间天堂，西湖美景、龙井茶香、丝绸之府！',
    重庆: '山城重庆，火锅之都、洪崖洞、穿楼轻轨！',
    长沙: '星城长沙，臭豆腐、茶颜悦色、橘子洲头！',
  };
  return descriptions[city] || '让我为你查查有什么好玩的！';
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

  // 仅允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: '仅支持 POST 请求',
      }),
    };
  }

  try {
    // 解析请求体
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (parseError) {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: '请求体格式错误，请使用有效的 JSON',
        }),
      };
    }

    const { message, sessionId } = body;

    // 参数校验：message 为必填
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: '缺少必填参数：message（消息内容不能为空）',
        }),
      };
    }

    // 对话逻辑分发：优先使用辩论系统，其次 Claude API，最后 Mock
    let result;

    // 检查是否配置了免费 LLM API Key（辩论系统）
    const hasDebateLLM = process.env.ZHIPU_API_KEY
      || process.env.DEEPSEEK_API_KEY
      || process.env.GEMINI_API_KEY;

    if (hasDebateLLM) {
      // 有免费 LLM Key，转发到 /api/debate 端点
      try {
        const debateResponse = await fetch('/.netlify/functions/debate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, sessionId, context: body.context }),
        });

        if (!debateResponse.ok) {
          throw new Error(`Debate API 请求失败: ${debateResponse.status}`);
        }

        const debateData = await debateResponse.json();
        if (debateData.success && debateData.data) {
          result = debateData.data;
        } else {
          throw new Error('Debate API 返回数据格式异常');
        }
      } catch (debateError) {
        console.error('[/api/chat] 辩论系统调用失败，尝试 Claude API:', debateError.message);
        // 辩论系统失败，尝试 Claude API
        if (process.env.ANTHROPIC_API_KEY) {
          try {
            result = await callClaudeAPI(message);
          } catch (claudeError) {
            console.error('[/api/chat] Claude API 也失败，降级到 Mock:', claudeError.message);
            result = handleDefaultChat(sessionId || generateSessionId());
          }
        } else {
          result = handleDefaultChat(sessionId || generateSessionId());
        }
      }
    } else if (process.env.ANTHROPIC_API_KEY) {
      try {
        // 使用 Claude API 处理对话
        result = await callClaudeAPI(message);
      } catch (claudeError) {
        // Claude API 调用失败，打印错误日志并降级到 Mock 模式
        console.error('[/api/chat] Claude API 调用失败，降级到 Mock 模式:', claudeError.message);
        result = handleDefaultChat(sessionId || generateSessionId());
      }
    } else {
      // 无 API Key，使用 Mock 模式
      if (!sessionId) {
        // 场景 1：第一次对话（无 sessionId）
        result = handleFirstChat();
      } else {
        // 场景 2-4：已有会话
        const city = detectCity(message);
        const hasDate = hasDateInfo(message);
        const hasTravelers = hasTravelerInfo(message);

        if (city && hasDate && hasTravelers) {
          // 场景 3：包含完整信息（城市 + 日期 + 人数）
          result = handleCompleteInfo(city, sessionId);
        } else if (city) {
          // 场景 2：包含城市名
          result = handleCityDetected(city, sessionId);
        } else {
          // 场景 4：其他情况
          result = handleDefaultChat(sessionId);
        }
      }
    }

    // 返回统一格式的响应
    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        data: result,
      }),
    };
  } catch (error) {
    // 服务器内部错误处理
    console.error('[/api/chat] 服务端错误:', error);

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
