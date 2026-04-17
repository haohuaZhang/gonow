/**
 * 和风天气 API Netlify Function
 * 有 API Key 时调用真实 API，无 Key 时返回 Mock 数据
 */

/** 根据目的地和日期生成 Mock 天气数据 */
function getMockWeather(city, date) {
  const month = new Date(date).getMonth() + 1

  // 根据目的地和月份生成合理的基准温度
  let baseTemp
  const dest = city.toLowerCase()

  if (dest.includes('三亚') || dest.includes('海南') || dest.includes('海口')) {
    // 热带地区
    baseTemp = month >= 5 && month <= 9 ? 32 : 25
  } else if (dest.includes('哈尔滨') || dest.includes('长春') || dest.includes('冰雪')) {
    // 东北
    baseTemp = month >= 6 && month <= 8 ? 26 : month >= 12 || month <= 2 ? -10 : 10
  } else if (dest.includes('拉萨') || dest.includes('昆明') || dest.includes('大理')) {
    // 高原
    baseTemp = month >= 5 && month <= 9 ? 22 : 10
  } else if (dest.includes('北京') || dest.includes('天津') || dest.includes('河北')) {
    // 华北
    baseTemp = month >= 6 && month <= 8 ? 30 : month >= 12 || month <= 2 ? -2 : 15
  } else if (dest.includes('广州') || dest.includes('深圳') || dest.includes('汕头') || dest.includes('潮汕')) {
    // 华南
    baseTemp = month >= 5 && month <= 9 ? 30 : 18
  } else if (dest.includes('成都') || dest.includes('重庆') || dest.includes('长沙')) {
    // 西南/华中
    baseTemp = month >= 6 && month <= 8 ? 32 : month >= 12 || month <= 2 ? 8 : 18
  } else {
    // 默认
    baseTemp = month >= 5 && month <= 9 ? 28 : 18
  }

  const tempRange = 5
  const descriptions = ['晴', '多云', '阴', '小雨']
  // 用日期字符串作为简单种子，保证同一天天气一致
  const dateSeed = date.split('-').reduce((a, b) => a + parseInt(b), 0)

  return {
    description: descriptions[dateSeed % descriptions.length],
    temperature: baseTemp + (dateSeed % tempRange) - 2,
    humidity: 60 + (dateSeed % 30),
    wind: '东南风 3-4级',
  }
}

/** 和风天气图标代码转中文描述 */
function iconToDescription(iconCode) {
  const map = {
    '100': '晴', '150': '晴',
    '101': '多云', '151': '多云',
    '102': '少云', '152': '少云',
    '103': '晴间多云', '153': '晴间多云',
    '104': '阴', '154': '阴',
    '300': '阵雨', '301': '强阵雨',
    '302': '雷阵雨', '303': '强雷阵雨',
    '304': '雷阵雨伴有冰雹',
    '305': '小雨', '306': '中雨',
    '307': '大雨', '308': '极端大雨',
    '309': '毛毛雨', '310': '暴雨',
    '311': '大暴雨', '312': '特大暴雨',
    '313': '冻雨', '314': '小到中雨',
    '315': '中到大雨', '316': '大到暴雨',
    '317': '暴雨到大暴雨', '318': '大暴雨到特大暴雨',
    '399': '雨',
    '400': '小雪', '401': '中雪',
    '402': '大雪', '403': '暴雪',
    '404': '雨夹雪', '405': '雨雪天气',
    '406': '阵雪', '407': '小到中雪',
    '408': '中到大雪', '409': '大到暴雪',
    '410': '暴雪到大暴雪', '499': '雪',
    '500': '薄雾', '501': '雾',
    '502': '霾', '503': '扬沙',
    '504': '浮尘', '507': '沙尘暴',
    '508': '强沙尘暴', '509': '浓雾',
    '510': '强浓雾', '511': '中度霾',
    '512': '重度霾', '513': '严重霾',
    '514': '大雾', '515': '特强浓雾',
  }
  return map[iconCode] || '多云'
}

/** 将和风天气 API 返回数据转换为统一格式 */
function transformWeatherData(weatherData, date) {
  if (!weatherData.daily || weatherData.daily.length === 0) {
    return null
  }

  // 查找指定日期的数据
  let dayData
  if (date) {
    dayData = weatherData.daily.find((d) => d.fxDate === date)
  } else {
    // 取今天的数据
    dayData = weatherData.daily[0]
  }

  if (!dayData) return null

  return {
    description: iconToDescription(dayData.iconDay),
    temperature: parseInt(dayData.tempMax, 10),
    humidity: parseInt(dayData.humidity, 10),
    wind: `${dayData.windDirDay} ${dayData.windScaleDay}级`,
    iconCode: dayData.iconDay,
  }
}

/** CORS 响应头 */
const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

const handler = async (event) => {
  // 处理 CORS 预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    }
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: '仅支持 GET' }),
    }
  }

  const { city, date } = event.queryStringParameters || {}

  if (!city) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: '缺少 city 参数' }),
    }
  }

  const apiKey = process.env.WEATHER_API_KEY

  // 无 API Key 时返回 Mock 数据
  if (!apiKey) {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: getMockWeather(city, date || new Date().toISOString().split('T')[0]),
        mock: true,
      }),
    }
  }

  // 调用和风天气 API
  try {
    // 第一步：城市搜索，获取 locationId
    const geoRes = await fetch(
      `https://geoapi.qweather.com/v2/city/lookup?location=${encodeURIComponent(city)}&key=${apiKey}`
    )
    const geoData = await geoRes.json()

    if (geoData.code !== '200' || !geoData.location || geoData.location.length === 0) {
      throw new Error('城市未找到: ' + city)
    }

    const locationId = geoData.location[0].id

    // 第二步：获取天气数据
    let weatherUrl
    if (date) {
      // 查询指定日期的天气（使用历史天气接口或 7 天预报）
      weatherUrl = `https://devapi.qweather.com/v7/weather/7d?location=${locationId}&key=${apiKey}`
    } else {
      // 查询未来 3 天天气
      weatherUrl = `https://devapi.qweather.com/v7/weather/3d?location=${locationId}&key=${apiKey}`
    }

    const weatherRes = await fetch(weatherUrl)
    const weatherData = await weatherRes.json()

    if (weatherData.code !== '200') {
      throw new Error('天气数据获取失败: ' + weatherData.code)
    }

    const transformed = transformWeatherData(weatherData, date)

    if (!transformed) {
      throw new Error('未找到指定日期的天气数据')
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: transformed,
        mock: false,
      }),
    }
  } catch (error) {
    // API 调用失败时降级到 Mock 数据
    console.error('天气 API 调用失败，降级到 Mock:', error.message)

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: getMockWeather(city, date || new Date().toISOString().split('T')[0]),
        mock: true,
        fallback: true,
        error: error.message,
      }),
    }
  }
}

module.exports = { handler }
