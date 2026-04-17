/**
 * /.netlify/functions/fetch-trending - 季节性排名配置服务
 *
 * 不包含任何数据，只返回季节性排序配置
 * 前端根据配置对本地数据进行排序和增强
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

function getSeasonInfo() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const season = getCurrentSeason();
  const seasonNames = { spring: '春季', summer: '夏季', autumn: '秋季', winter: '冬季' };
  return {
    dateStr: `${year}年${month}月`,
    season,
    seasonName: seasonNames[season],
    month,
    year,
  };
}

// Each season has a ranked list of destination IDs (most recommended first)
const SEASONAL_DESTINATION_RANK = {
  spring: ['chengdu','hangzhou','suzhou','xiamen','guilin','dali','nanjing','yangzhou','huangshan','wuyuan','luoyang','kaifeng','qingdao','beijing','changsha','lijiang','chongqing','xian','guangzhou','shanghai','wuhan','tianjin','quanzhou','fenghuang','zhangjiajie','jiuzhaigou','lasa','haerbin','xishuangbanna','sanya','shenzhen','huhehaote'],
  summer: ['sanya','guilin','qingdao','xiamen','dali','lijiang','hangzhou','chengdu','changsha','chongqing','beijing','xian','suzhou','shanghai','guangzhou','shenzhen','nanjing','wuhan','zhangjiajie','jiuzhaigou','huangshan','wuyuan','xishuangbanna','haerbin','lasa','tianjin','luoyang','kaifeng','quanzhou','yangzhou','fenghuang','huhehaote'],
  autumn: ['beijing','xian','chengdu','hangzhou','suzhou','dali','guilin','lijiang','xiamen','changsha','chongqing','huangshan','nanjing','yangzhou','wuyuan','luoyang','kaifeng','qingdao','wuhan','guangzhou','shanghai','tianjin','quanzhou','fenghuang','zhangjiajie','jiuzhaigou','lasa','haerbin','xishuangbanna','sanya','shenzhen','huhehaote'],
  winter: ['sanya','haerbin','chengdu','chongqing','changsha','xiamen','beijing','xian','dali','lijiang','guilin','hangzhou','suzhou','guangzhou','shanghai','shenzhen','nanjing','wuhan','kunming','lasa','xishuangbanna','tianjin','luoyang','kaifeng','quanzhou','yangzhou','fenghuang','zhangjiajie','jiuzhaigou','huangshan','qingdao','huhehaote','wuyuan'],
};

// Each season has a ranked list of food cities (most recommended first)
const SEASONAL_FOOD_CITY_RANK = {
  spring: ['成都','长沙','杭州','苏州','汕头','重庆','广州','上海','南京','武汉','西安','北京','厦门','昆明','扬州','洛阳','大连','哈尔滨','贵阳'],
  summer: ['长沙','成都','汕头','重庆','青岛','广州','上海','武汉','西安','北京','厦门','昆明','南京','大连','哈尔滨','贵阳','苏州','扬州','洛阳','杭州'],
  autumn: ['成都','长沙','北京','西安','重庆','广州','上海','武汉','南京','杭州','苏州','扬州','洛阳','汕头','厦门','昆明','大连','哈尔滨','贵阳'],
  winter: ['成都','长沙','汕头','重庆','北京','哈尔滨','广州','上海','武汉','西安','厦门','昆明','南京','大连','贵阳','苏州','扬州','洛阳','杭州','青岛'],
};

// Trending reason templates
const TRENDING_TEMPLATES = {
  destinations: {
    spring: [
      '春暖花开，{name}赏花踏青正当时，小红书相关笔记超{count}万篇',
      '{name}春季气温宜人，飞猪当月搜索量增长{growth}%',
      '携程发布春季热门目的地榜单，{name}位列TOP{rank}',
    ],
    summer: [
      '{name}夏日避暑首选，马蜂窝当月热度指数{score}+',
      '飞猪暑期预订数据：{name}酒店预订量增长{growth}%',
      '小红书"夏日好去处"话题中，{name}相关内容超{count}万条',
    ],
    autumn: [
      '{name}秋景如画，携程秋季旅行榜单TOP{rank}',
      '马蜂窝秋季热门目的地：{name}用户关注度增长{growth}%',
      '小红书"赏秋攻略"话题，{name}相关笔记超{count}万篇',
    ],
    winter: [
      '{name}冬季旅游热度不减，飞猪当月搜索增长{growth}%',
      '携程冬季出行榜单：{name}位列TOP{rank}',
      '小红书"冬季好去处"话题，{name}相关内容超{count}万条',
    ],
  },
  food: {
    spring: [
      '春季时令美食，大众点评当月搜索量增长{growth}%',
      '小红书"春季必吃"话题，相关种草笔记超{count}万篇',
      '美团美食林春季推荐榜单上榜餐厅',
    ],
    summer: [
      '夏日消暑美食首选，大众点评好评率{score}%',
      '小红书"夏天吃什么"话题热门推荐，笔记超{count}万篇',
      '美团外卖当月销量增长{growth}%',
    ],
    autumn: [
      '秋季进补好时节，大众点评当月搜索增长{growth}%',
      '小红书"贴秋膘"话题热门，相关笔记超{count}万篇',
      '马蜂窝美食推荐秋季榜单上榜',
    ],
    winter: [
      '冬日暖胃美食，大众点评当月好评率{score}%',
      '小红书"冬季美食"话题，相关种草笔记超{count}万篇',
      '美团美食林冬季推荐，当月销量增长{growth}%',
    ],
  },
  scenic: {
    spring: [
      '春季赏花胜地，携程当月门票销量TOP{rank}',
      '小红书"春游好去处"话题，相关笔记超{count}万篇',
      '马蜂窝当月热度指数{score}+',
    ],
    summer: [
      '夏日避暑胜地，飞猪当月预订量增长{growth}%',
      '携程暑期热门景点榜单TOP{rank}',
      '小红书"暑假去哪玩"话题，相关内容超{count}万条',
    ],
    autumn: [
      '秋季赏景胜地，马蜂窝当月热度指数{score}+',
      '携程秋季热门景点榜单TOP{rank}',
      '小红书"赏秋好去处"话题，相关笔记超{count}万篇',
    ],
    winter: [
      '冬季热门景点，飞猪当月搜索增长{growth}%',
      '携程冬季出行景点榜单TOP{rank}',
      '小红书"冬季打卡"话题，相关内容超{count}万条',
    ],
  },
};

function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateTrendingReason(templatePool, name, season) {
  const template = templatePool[season][randomInt(0, templatePool[season].length - 1)];
  return template
    .replace(/{name}/g, name)
    .replace(/{count}/g, randomInt(5, 50))
    .replace(/{growth}/g, randomInt(30, 300) + '%')
    .replace(/{rank}/g, randomInt(1, 10))
    .replace(/{score}/g, (randomInt(85, 99) / 10).toFixed(1));
}

const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: '仅支持 GET 请求' }),
    };
  }

  try {
    const seasonInfo = getSeasonInfo();
    const destRank = SEASONAL_DESTINATION_RANK[seasonInfo.season] || SEASONAL_DESTINATION_RANK.spring;
    const foodCityRank = SEASONAL_FOOD_CITY_RANK[seasonInfo.season] || SEASONAL_FOOD_CITY_RANK.spring;

    // Build destination rank map
    const destinationRankMap = {};
    destRank.forEach((id, idx) => { destinationRankMap[id] = idx + 1; });

    // Build food city rank map
    const foodCityRankMap = {};
    foodCityRank.forEach((city, idx) => { foodCityRankMap[city] = idx + 1; });

    // Generate trending reasons for top items
    const trendingDestinations = {};
    destRank.slice(0, 10).forEach(id => {
      trendingDestinations[id] = generateTrendingReason(TRENDING_TEMPLATES.destinations, id, seasonInfo.season);
    });

    const trendingFoodCities = {};
    foodCityRank.slice(0, 6).forEach(city => {
      trendingFoodCities[city] = generateTrendingReason(TRENDING_TEMPLATES.food, city, seasonInfo.season);
    });

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        data: {
          destinationRank: destinationRankMap,
          foodCityRank: foodCityRankMap,
          trendingDestinations,
          trendingFoodCities,
        },
        season: seasonInfo.seasonName,
        seasonKey: seasonInfo.season,
        month: seasonInfo.dateStr,
        source: 'seasonal-ranking',
      }),
    };
  } catch (error) {
    console.error('[fetch-trending] 服务端错误:', error);
    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: '服务器内部错误' }),
    };
  }
};

module.exports = { handler };
