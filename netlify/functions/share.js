const crypto = require('crypto');

// 简单的内存存储（生产环境应使用 Netlify KV 或数据库）
const sharedTrips = new Map();

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

exports.handler = async (event) => {
  // 处理 CORS 预检
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  try {
    const { httpMethod, path, body } = event;
    const token = path.replace(/^\/\.netlify\/functions\/share\//, '').replace(/^\//, '');

    // GET: 获取分享的行程
    if (httpMethod === 'GET') {
      const trip = sharedTrips.get(token);
      if (!trip) {
        return {
          statusCode: 404,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: '行程不存在或已过期' }),
        };
      }
      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, data: trip }),
      };
    }

    // POST: 创建分享链接
    if (httpMethod === 'POST') {
      const { tripData, privacy } = JSON.parse(body || '{}');

      if (!tripData) {
        return {
          statusCode: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: '缺少行程数据' }),
        };
      }

      // 生成短 token
      const token = crypto.randomBytes(6).toString('hex');

      // 根据隐私设置过滤数据
      let filteredTrip = { ...tripData };
      if (privacy) {
        if (privacy.hideBudget) {
          filteredTrip = {
            ...filteredTrip,
            days: filteredTrip.days?.map(day => ({
              ...day,
              activities: day.activities?.map(a => ({ ...a, cost: undefined }))
            })),
            totalBudget: undefined,
          };
        }
        if (privacy.hideRedBlack) {
          filteredTrip = {
            ...filteredTrip,
            days: filteredTrip.days?.map(day => ({
              ...day,
              activities: day.activities?.map(a => ({ ...a, redBlackFlags: undefined }))
            })),
          };
        }
      }

      sharedTrips.set(token, {
        ...filteredTrip,
        createdAt: new Date().toISOString(),
        views: 0,
      });

      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          shareUrl: `/shared/${token}`,
          token,
        }),
      };
    }

    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
