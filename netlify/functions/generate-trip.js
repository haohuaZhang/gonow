/**
 * /api/generate-trip - 行程生成接口
 *
 * 功能：根据用户提供的旅行参数生成完整行程
 * 当前使用 Mock 模式，返回预设的汕头行程数据
 */

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
      totalCost: 210,
      actualCost: 0,
      activities: [
        {
          id: 'a1',
          type: 'food',
          name: '杏花吴记牛肉火锅',
          location: { name: '杏花吴记牛肉火锅', lat: 23.3535, lng: 116.6818, address: '汕头市金平区' },
          cost: 120,
          rating: 4.8,
          description: '汕头必吃榜火锅店，30年老店，现宰现切，吊龙和胸口油是必点',
          redBlackFlags: { redFlags: ['排队较长，建议11点前到'], blackFlags: [], credibilityScore: 85 },
          duration: 90,
          startTime: '11:30',
          endTime: '13:00',
        },
        {
          id: 'a2',
          type: 'scenic',
          name: '汕头小公园',
          location: { name: '汕头小公园', lat: 23.3554, lng: 116.6797, address: '汕头市金平区' },
          cost: 0,
          rating: 4.5,
          description: '百年骑楼建筑群，汕头城市名片，全国唯一呈放射状格局的骑楼街道',
          redBlackFlags: { redFlags: [], blackFlags: [], credibilityScore: 90 },
          duration: 120,
          startTime: '14:00',
          endTime: '16:00',
        },
        {
          id: 'a3',
          type: 'food',
          name: '老妈宫粽球',
          location: { name: '老妈宫粽球', lat: 23.354, lng: 116.68, address: '汕头市金平区' },
          cost: 15,
          rating: 4.6,
          description: '汕头特色小吃，甜咸双拼，本地人从小吃到大的味道',
          redBlackFlags: { redFlags: [], blackFlags: [], credibilityScore: 88 },
          duration: 30,
          startTime: '16:00',
          endTime: '16:30',
        },
        {
          id: 'a4',
          type: 'transport',
          name: '打车前往长平路',
          location: { name: '', lat: 0, lng: 0 },
          cost: 15,
          rating: 0,
          description: '从小公园打车到长平路约10分钟',
          redBlackFlags: { redFlags: ['高峰期可能拥堵'], blackFlags: [], credibilityScore: 70 },
          duration: 15,
          startTime: '16:30',
          endTime: '16:45',
        },
        {
          id: 'a5',
          type: 'food',
          name: '长平老姿娘夜粥',
          location: { name: '长平老姿娘夜粥', lat: 23.351, lng: 116.685, address: '汕头市金平区长平路' },
          cost: 60,
          rating: 4.7,
          description: '汕头人深夜食堂，上百种配菜任选，人均30吃到撑',
          redBlackFlags: { redFlags: ['晚上8点后排队'], blackFlags: [], credibilityScore: 82 },
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
      totalCost: 250,
      actualCost: 0,
      activities: [
        {
          id: 'b1',
          type: 'transport',
          name: '打车前往南澳岛',
          location: { name: '南澳岛', lat: 23.425, lng: 116.975, address: '汕头市南澳县' },
          cost: 100,
          rating: 0,
          description: '从市区打车到南澳岛，约1.5小时',
          redBlackFlags: { redFlags: ['建议提前预约'], blackFlags: [], credibilityScore: 72 },
          duration: 90,
          startTime: '07:30',
          endTime: '09:00',
        },
        {
          id: 'b2',
          type: 'scenic',
          name: '南澳岛',
          location: { name: '南澳岛', lat: 23.425, lng: 116.975, address: '汕头市南澳县' },
          cost: 0,
          rating: 4.6,
          description: '广东最美海岛，蓝天碧海，适合拍照打卡',
          redBlackFlags: { redFlags: ['建议自驾或包车', '防晒必备'], blackFlags: [], credibilityScore: 87 },
          duration: 240,
          startTime: '09:00',
          endTime: '13:00',
        },
        {
          id: 'b3',
          type: 'food',
          name: '南澳岛海鲜大排档',
          location: { name: '南澳岛海鲜大排档', lat: 23.428, lng: 116.972, address: '南澳县后宅镇' },
          cost: 150,
          rating: 4.4,
          description: '现捞现做，推荐清蒸石斑鱼和椒盐皮皮虾',
          redBlackFlags: { redFlags: ['旅游区价格偏高'], blackFlags: [], credibilityScore: 75 },
          duration: 60,
          startTime: '12:00',
          endTime: '13:00',
        },
        {
          id: 'b4',
          type: 'culture',
          name: '潮汕非物质文化遗产展示馆',
          location: { name: '潮汕非物质文化遗产展示馆', lat: 23.352, lng: 116.683, address: '汕头市金平区' },
          cost: 0,
          rating: 4.3,
          description: '了解潮汕木雕、潮绣、陶瓷等非遗文化，免费参观',
          redBlackFlags: { redFlags: ['周一闭馆'], blackFlags: [], credibilityScore: 80 },
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
      body: JSON.stringify({ success: false, error: '仅支持 POST 请求' }),
    };
  }

  try {
    // 解析请求体
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: '请求体格式错误，请使用有效的 JSON' }),
      };
    }

    const { destination, startDate, endDate, travelers } = body;

    // 参数校验
    if (!destination || !startDate || !endDate || !travelers) {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: '缺少必填参数：destination, startDate, endDate, travelers',
        }),
      };
    }

    // 日期校验
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: '日期格式错误或结束日期必须晚于开始日期' }),
      };
    }

    // 使用 Mock 数据生成行程（将用户输入的目的地替换到 mock 数据中）
    const tripData = {
      ...mockTrip,
      id: 'trip-' + Date.now(),
      destination,
      startDate,
      endDate,
      travelers,
      budget: body.budget || 2000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 生成警告信息
    const warnings = [];
    const now = new Date();
    if (start <= now) {
      warnings.push('出发日期已过，请确认日期是否正确');
    }

    // 判断是否为旅游旺季
    const month = start.getMonth() + 1;
    if ([1, 2, 5, 7, 8, 10].includes(month)) {
      warnings.push(`${month}月为旅游旺季，建议提前预订酒店和门票`);
    }

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        data: {
          trip: tripData,
          warnings,
        },
      }),
    };
  } catch (error) {
    console.error('[/api/generate-trip] 服务端错误:', error);

    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: '服务器内部错误，请稍后重试' }),
    };
  }
};

module.exports = { handler };
