/**
 * /.netlify/functions/fetch-trending - 动态季节性旅行推荐接口
 *
 * 功能：根据当前月份/季节，对旅行数据进行智能排序和增强
 * 策略：季节性权重排序 + 当季标签 + 热门理由生成（不调用 LLM，避免超时）
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

// ============ 季节性配置 ============

/** 每个季节推荐的目的地 ID（按优先级排序） */
const SEASONAL_DESTINATIONS = {
  spring: ['chengdu', 'hangzhou', 'suzhou', 'xiamen', 'guilin', 'dali', 'qingdao', 'beijing', 'changsha', 'lijiang', 'chongqing', 'xian', 'sanya'],
  summer: ['sanya', 'guilin', 'qingdao', 'xiamen', 'dali', 'lijiang', 'hangzhou', 'chengdu', 'changsha', 'chongqing', 'beijing', 'xian', 'suzhou'],
  autumn: ['beijing', 'xian', 'chengdu', 'hangzhou', 'suzhou', 'dali', 'guilin', 'lijiang', 'xiamen', 'changsha', 'chongqing', 'qingdao', 'sanya'],
  winter: ['sanya', 'chengdu', 'chongqing', 'changsha', 'xiamen', 'beijing', 'xian', 'dali', 'lijiang', 'guilin', 'hangzhou', 'suzhou', 'qingdao'],
};

/** 每个季节推荐的美食城市 */
const SEASONAL_FOOD_CITIES = {
  spring: ['成都', '长沙', '杭州', '苏州', '汕头', '重庆'],
  summer: ['长沙', '成都', '汕头', '重庆', '青岛'],
  autumn: ['成都', '长沙', '北京', '西安', '重庆'],
  winter: ['成都', '长沙', '汕头', '重庆', '北京'],
};

/** 季节性热门理由模板 */
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

// ============ 辅助函数 ============

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
  const seasonDescs = {
    spring: '春暖花开，万物复苏，适合踏青赏花',
    summer: '夏日炎炎，适合避暑玩水、海滨度假',
    autumn: '秋高气爽，层林尽染，适合赏秋品蟹',
    winter: '冬日暖阳，适合温泉滑雪、南方避寒',
  };
  return {
    dateStr: `${year}年${month}月`,
    season,
    seasonName: seasonNames[season],
    seasonDesc: seasonDescs[season],
    month,
    year,
  };
}

function generateId() {
  try { return crypto.randomUUID(); } catch { return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9); }
}

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

// ============ 内置 Mock 数据（当无法从外部获取时使用） ============

const BUILTIN_DESTINATIONS = [
  { id: 'chengdu', name: '成都', province: '四川', coverImage: 'linear-gradient(135deg, #FF6B35, #FFD166)', description: '天府之国，火锅、熊猫、宽窄巷子，巴适得很！', tags: ['food', 'culture', 'family'], bestSeason: '3-6月', avgBudget: 320, avgDays: 4, rating: 4.7, highlights: ['大熊猫繁育研究基地', '宽窄巷子', '锦里古街', '都江堰', '春熙路太古里'], foodScore: 4.9, scenicScore: 4.3, cultureScore: 4.5, transportScore: 4.2, costScore: 4.5 },
  { id: 'hangzhou', name: '杭州', province: '浙江', coverImage: 'linear-gradient(135deg, #43e97b, #38f9d7)', description: '人间天堂，西湖美景、龙井茶香、丝绸之府！', tags: ['nature', 'culture', 'romantic'], bestSeason: '3-5月', avgBudget: 380, avgDays: 3, rating: 4.6, highlights: ['西湖十景', '灵隐寺', '千岛湖', '宋城', '河坊街'], foodScore: 4.5, scenicScore: 4.8, cultureScore: 4.6, transportScore: 4.3, costScore: 3.8 },
  { id: 'dali', name: '大理', province: '云南', coverImage: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', description: '风花雪月，苍山洱海、古城漫步、白族风情！', tags: ['nature', 'romantic', 'budget'], bestSeason: '3-5月', avgBudget: 250, avgDays: 4, rating: 4.5, highlights: ['洱海环湖', '苍山索道', '大理古城', '双廊古镇', '崇圣寺三塔'], foodScore: 4.2, scenicScore: 4.9, cultureScore: 4.3, transportScore: 3.5, costScore: 4.7 },
  { id: 'xian', name: '西安', province: '陕西', coverImage: 'linear-gradient(135deg, #f093fb, #f5576c)', description: '十三朝古都，兵马俑、回民街、大唐不夜城！', tags: ['culture', 'food', 'family'], bestSeason: '3-6月/9-11月', avgBudget: 300, avgDays: 4, rating: 4.6, highlights: ['秦始皇兵马俑', '华清宫', '大雁塔', '回民街', '大唐不夜城'], foodScore: 4.7, scenicScore: 4.5, cultureScore: 4.9, transportScore: 4.0, costScore: 4.3 },
  { id: 'xiamen', name: '厦门', province: '福建', coverImage: 'linear-gradient(135deg, #4facfe, #00f2fe)', description: '海上花园，鼓浪屿、沙茶面、文艺小清新的好去处！', tags: ['romantic', 'food', 'nature'], bestSeason: '3-5月', avgBudget: 350, avgDays: 3, rating: 4.5, highlights: ['鼓浪屿', '南普陀寺', '曾厝垵', '环岛路', '中山路步行街'], foodScore: 4.4, scenicScore: 4.6, cultureScore: 4.2, transportScore: 4.0, costScore: 3.9 },
  { id: 'changsha', name: '长沙', province: '湖南', coverImage: 'linear-gradient(135deg, #fa709a, #fee140)', description: '星城长沙，臭豆腐、茶颜悦色、橘子洲头！', tags: ['food', 'culture', 'budget'], bestSeason: '3-5月/9-11月', avgBudget: 280, avgDays: 3, rating: 4.4, highlights: ['橘子洲头', '岳麓山', '太平老街', '湖南省博物馆', '坡子街'], foodScore: 4.8, scenicScore: 4.2, cultureScore: 4.3, transportScore: 4.1, costScore: 4.6 },
  { id: 'chongqing', name: '重庆', province: '重庆', coverImage: 'linear-gradient(135deg, #f5576c, #ff6a00)', description: '山城重庆，火锅之都、洪崖洞、穿楼轻轨！', tags: ['food', 'adventure', 'culture'], bestSeason: '3-5月/9-11月', avgBudget: 280, avgDays: 4, rating: 4.6, highlights: ['洪崖洞', '磁器口古镇', '长江索道', '解放碑', '李子坝轻轨站'], foodScore: 4.9, scenicScore: 4.4, cultureScore: 4.2, transportScore: 3.8, costScore: 4.7 },
  { id: 'lijiang', name: '丽江', province: '云南', coverImage: 'linear-gradient(135deg, #fccb90, #d57eeb)', description: '艳遇之城，古城韵味、玉龙雪山、纳西风情！', tags: ['romantic', 'nature', 'culture'], bestSeason: '3-5月', avgBudget: 350, avgDays: 4, rating: 4.4, highlights: ['丽江古城', '玉龙雪山', '束河古镇', '泸沽湖', '蓝月谷'], foodScore: 4.0, scenicScore: 4.8, cultureScore: 4.5, transportScore: 3.2, costScore: 3.8 },
  { id: 'guilin', name: '桂林', province: '广西', coverImage: 'linear-gradient(135deg, #667eea, #764ba2)', description: '山水甲天下，漓江竹筏、阳朔西街、龙脊梯田！', tags: ['nature', 'adventure', 'family'], bestSeason: '4-10月', avgBudget: 300, avgDays: 4, rating: 4.5, highlights: ['漓江竹筏', '阳朔西街', '龙脊梯田', '象鼻山', '两江四湖'], foodScore: 4.1, scenicScore: 4.9, cultureScore: 3.8, transportScore: 3.5, costScore: 4.4 },
  { id: 'qingdao', name: '青岛', province: '山东', coverImage: 'linear-gradient(135deg, #0250c5, #d43f8d)', description: '帆船之都，红瓦绿树、碧海蓝天、啤酒飘香！', tags: ['nature', 'family', 'food'], bestSeason: '6-9月', avgBudget: 320, avgDays: 3, rating: 4.4, highlights: ['八大关', '栈桥', '崂山', '金沙滩', '啤酒博物馆'], foodScore: 4.3, scenicScore: 4.5, cultureScore: 4.0, transportScore: 4.0, costScore: 4.2 },
  { id: 'suzhou', name: '苏州', province: '江苏', coverImage: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)', description: '上有天堂下有苏杭，园林之城、昆曲评弹、江南水乡！', tags: ['culture', 'romantic', 'luxury'], bestSeason: '3-5月', avgBudget: 400, avgDays: 3, rating: 4.5, highlights: ['拙政园', '虎丘', '平江路', '周庄古镇', '留园'], foodScore: 4.4, scenicScore: 4.6, cultureScore: 4.8, transportScore: 4.2, costScore: 3.5 },
  { id: 'beijing', name: '北京', province: '北京', coverImage: 'linear-gradient(135deg, #ee9ca7, #ffdde1)', description: '首都北京，故宫长城、胡同文化、烤鸭飘香！', tags: ['culture', 'family', 'luxury'], bestSeason: '3-5月/9-11月', avgBudget: 500, avgDays: 5, rating: 4.7, highlights: ['故宫博物院', '长城', '颐和园', '天坛', '南锣鼓巷'], foodScore: 4.5, scenicScore: 4.7, cultureScore: 4.9, transportScore: 4.5, costScore: 3.2 },
  { id: 'sanya', name: '三亚', province: '海南', coverImage: 'linear-gradient(135deg, #0EA5E9, #22D3EE)', description: '东方夏威夷，碧海蓝天白沙滩。热带风情浓郁！', tags: ['nature', 'romantic', 'family'], bestSeason: '10月-次年3月', avgBudget: 450, avgDays: 4, rating: 4.5, highlights: ['亚龙湾', '天涯海角', '蜈支洲岛', '南山文化旅游区', '呀诺达雨林'], foodScore: 4.3, scenicScore: 4.9, cultureScore: 3.5, transportScore: 3.8, costScore: 3.2 },
];

const BUILTIN_FOODS = [
  { id: 'f1', name: '牛肉火锅', cuisine: '潮汕菜', avgCost: 80, rating: 4.8, story: '潮汕牛肉火锅讲究"鲜"字，凌晨4点宰牛，2小时内上桌，从屠宰到入口不超过6小时。吊龙、胸口油、匙柄、五花趾，每个部位涮的时间都不同，搭配沙茶酱，一口入魂。', city: '汕头', signatureDishes: ['吊龙', '胸口油', '匙柄', '湿炒牛河'], mustOrder: [{ name: '吊龙', recommendation: 5 }, { name: '胸口油', recommendation: 4 }, { name: '匙柄', recommendation: 4 }, { name: '湿炒牛河', recommendation: 3 }], tips: ['建议11点前到，避免排队', '吊龙涮8秒即可', '搭配本地沙茶酱'], tags: ['苍蝇馆', '必吃榜'] },
  { id: 'f2', name: '蚝烙', cuisine: '潮汕小吃', avgCost: 25, rating: 4.6, story: '汕头街头最经典的小吃之一，外酥里嫩，蚝肉饱满鲜甜，蘸上鱼露辣椒，一口下去满是海洋的味道。老城区的蚝烙摊子往往一开就是几十年。', city: '汕头', signatureDishes: ['蚝烙', '鱼露辣椒'], mustOrder: [{ name: '蚝烙', recommendation: 5 }], tips: ['趁热吃最香', '一定要蘸鱼露', '下午茶时间排队较少'], tags: ['特色小吃', '本地人推荐'] },
  { id: 'f3', name: '串串香', cuisine: '川菜', avgCost: 60, rating: 4.5, story: '成都人的深夜食堂，竹签串起百味人生。从冷锅串串到热锅串串，从牛油锅到清油锅，每家店都有自己的独门秘方。', city: '成都', signatureDishes: ['麻辣牛肉', '毛肚', '鹌鹑蛋', '土豆片'], mustOrder: [{ name: '麻辣牛肉', recommendation: 5 }, { name: '毛肚', recommendation: 5 }, { name: '鹌鹑蛋', recommendation: 4 }], tips: ['微辣入门', '荤素搭配', '最后加份炒饭'], tags: ['苍蝇馆', '本地人推荐'] },
  { id: 'f4', name: '担担面', cuisine: '川菜', avgCost: 15, rating: 4.7, story: '一碗担担面，半部成都史。芽菜肉末的咸香，花椒的麻，辣椒的红，面条的筋道，这就是成都人的早餐标配。', city: '成都', signatureDishes: ['担担面', '红油抄手'], mustOrder: [{ name: '担担面', recommendation: 5 }], tips: ['趁热拌匀吃', '可以加份肥肠', '老店味道更正宗'], tags: ['老字号', '必吃榜'] },
  { id: 'f5', name: '臭豆腐', cuisine: '湘菜', avgCost: 15, rating: 4.4, story: '闻着臭吃着香，长沙街头最具代表性的小吃。黑色豆腐外酥里嫩，浇上辣椒蒜蓉酱汁，配上酸萝卜，越吃越上头。', city: '长沙', signatureDishes: ['黑色臭豆腐', '辣椒酱汁', '酸萝卜'], mustOrder: [{ name: '黑色臭豆腐', recommendation: 5 }], tips: ['火宫殿的最有名', '一定要浇酱汁', '配酸萝卜解腻'], tags: ['特色小吃', '打卡圣地'] },
  { id: 'f6', name: '茶颜悦色', cuisine: '新茶饮', avgCost: 18, rating: 4.6, story: '长沙本土茶饮品牌，以"中茶西做"为理念，将中国传统茶文化与现代饮品结合。幽兰拿铁、声声乌龙，每款都是爆款。', city: '长沙', signatureDishes: ['幽兰拿铁', '声声乌龙', '桂花弄'], mustOrder: [{ name: '幽兰拿铁', recommendation: 5 }, { name: '声声乌龙', recommendation: 4 }], tips: ['可以无限续杯', '小程序提前点单', '新品上市要尝鲜'], tags: ['网红店', '打卡圣地'] },
  { id: 'f7', name: '小龙虾', cuisine: '鄂菜', avgCost: 120, rating: 4.5, story: '夏夜标配，从武汉到全国，小龙虾已经成为中国夜宵文化的代名词。麻辣、蒜蓉、十三香，每种口味都是一种江湖。', city: '长沙', signatureDishes: ['麻辣小龙虾', '蒜蓉小龙虾', '十三香小龙虾'], mustOrder: [{ name: '麻辣小龙虾', recommendation: 5 }, { name: '蒜蓉小龙虾', recommendation: 4 }], tips: ['5-9月最肥美', '配冰啤酒绝了', '戴手套吃更方便'], tags: ['必吃榜', '排队王'] },
  { id: 'f8', name: '龙抄手', cuisine: '川菜', avgCost: 25, rating: 4.5, story: '成都名小吃，皮薄馅嫩，汤鲜味美。从红油到清汤，从鸡汁到海味，龙抄手的品种之多令人叹为观止。', city: '成都', signatureDishes: ['红油抄手', '鸡汁抄手', '海味抄手'], mustOrder: [{ name: '红油抄手', recommendation: 5 }, { name: '鸡汁抄手', recommendation: 4 }], tips: ['春熙路总店最正宗', '红油版更过瘾', '可以搭配钟水饺'], tags: ['老字号', '必吃榜'] },
  { id: 'f9', name: '冒菜', cuisine: '川菜', avgCost: 35, rating: 4.4, story: '一个人的火锅，成都人的快餐之王。自选食材，现煮现吃，红油翻滚中，每一口都是成都的味道。', city: '成都', signatureDishes: ['牛肉冒菜', '毛肚冒菜', '土豆粉'], mustOrder: [{ name: '牛肉冒菜', recommendation: 5 }, { name: '毛肚冒菜', recommendation: 4 }], tips: ['荤素搭配最划算', '加份粉条', '微辣就够了'], tags: ['苍蝇馆', '本地人推荐'] },
  { id: 'f10', name: '糖油粑粑', cuisine: '湘菜', avgCost: 5, rating: 4.3, story: '长沙最便宜的幸福感，一块钱两个，外焦里糯，甜而不腻。老街巷口的糖油粑粑摊子，是长沙人童年的味道。', city: '长沙', signatureDishes: ['糖油粑粑'], mustOrder: [{ name: '糖油粑粑', recommendation: 5 }], tips: ['趁热吃', '老巷子里更好吃', '一块钱两个超值'], tags: ['特色小吃', '本地人推荐'] },
  { id: 'f11', name: '夜粥（打冷）', cuisine: '潮汕菜', avgCost: 50, rating: 4.5, story: '潮汕人的深夜食堂，一锅白粥配上百种打冷小菜。卤味、鱼饭、生腌、熟食，琳琅满目，这就是潮汕版的"深夜食堂"。', city: '汕头', signatureDishes: ['卤鹅', '生腌蟹', '鱼饭', '麻叶'], mustOrder: [{ name: '卤鹅', recommendation: 5 }, { name: '生腌蟹', recommendation: 4 }], tips: ['晚上10点后最热闹', '先点卤味', '配白粥解腻'], tags: ['苍蝇馆', '本地人推荐'] },
  { id: 'f12', name: '老妈宫粽球', cuisine: '潮汕小吃', avgCost: 10, rating: 4.4, story: '汕头百年老字号，粽球馅料丰富，甜咸双拼，糯米软糯，肉香四溢。一口咬下去，是满满的潮汕味道。', city: '汕头', signatureDishes: ['双拼粽球', '甜粽球'], mustOrder: [{ name: '双拼粽球', recommendation: 5 }], tips: ['早上来吃最新鲜', '甜咸双拼最经典', '配工夫茶更地道'], tags: ['老字号', '特色小吃'] },
];

const BUILTIN_SCENIC = [
  {
    id: 's1', name: '南澳岛', city: '汕头', province: '广东',
    plans: [
      { type: '主流', duration: '4-5小时', cost: '约¥200', description: '经典南澳岛一日游路线，覆盖主要景点，适合第一次来的游客。', highlights: ['南澳大桥观景', '青澳湾沙滩漫步', '总兵府参观', '风电场观景台拍照', '海鲜大排档午餐'], tips: ['建议自驾或包车', '防晒必备', '带上泳衣可以下水', '周末人多建议早出发'] },
      { type: '经济', duration: '3-4小时', cost: '约¥80', description: '经济实惠的南澳岛游览方案，公交可达，适合预算有限的游客。', highlights: ['公交车上岛', '青澳湾免费沙滩', '渔民码头看日落', '小镇漫步'], tips: ['坐161路/162路公交', '自带食物和水', '日落时分最美'] },
      { type: '深度', duration: '一整天', cost: '约¥350', description: '深度游览南澳岛，包含小众景点和海上活动体验。', highlights: ['青澳湾日出', '后花园湾玻璃海', '渔排体验', '宋井风景区', '金银岛探险'], tips: ['住一晚体验更佳', '提前预约渔排体验', '带好防晒和驱蚊'] },
    ],
  },
  {
    id: 's2', name: '西湖', city: '杭州', province: '浙江',
    plans: [
      { type: '主流', duration: '4-5小时', cost: '免费', description: '西湖经典环湖路线，涵盖断桥残雪、三潭印月等十大景点。', highlights: ['断桥残雪', '白堤漫步', '三潭印月（船票）', '雷峰塔', '花港观鱼'], tips: ['建议骑行环湖', '周末人多有心理准备', '日落时分最美'] },
      { type: '深度', duration: '一整天', cost: '约¥150', description: '深度游览西湖及周边文化景点，体验杭州人文之美。', highlights: ['灵隐寺飞来峰', '龙井茶园', '苏堤春晓', '岳王庙', '西泠印社'], tips: ['灵隐寺需提前预约', '龙井村可以品茶', '穿舒适步行鞋'] },
    ],
  },
  {
    id: 's3', name: '兵马俑', city: '西安', province: '陕西',
    plans: [
      { type: '主流', duration: '3-4小时', cost: '约¥180', description: '秦始皇兵马俑博物馆经典参观路线，一号坑、二号坑、三号坑全覆盖。', highlights: ['一号坑（最大）', '二号坑（精品）', '三号坑（指挥部）', '铜车马展厅', '兵马俑复制品购买'], tips: ['建议请讲解员', '早上开门就进', '带好充电宝'] },
      { type: '深度', duration: '一整天', cost: '约¥300', description: '兵马俑+华清宫+骊山深度一日游，感受秦唐文化。', highlights: ['兵马俑博物馆', '华清宫温泉', '长恨歌演出', '骊山烽火台', '秦始皇陵'], tips: ['长恨歌需提前买票', '华清宫和兵马俑可买联票', '穿舒适鞋子'] },
    ],
  },
  {
    id: 's4', name: '洱海', city: '大理', province: '云南',
    plans: [
      { type: '主流', duration: '半天', cost: '约¥150', description: '洱海东线经典骑行路线，双廊古镇+小普陀+挖色。', highlights: ['双廊古镇', '小普陀', '挖色码头', '环海东路骑行', '南诏风情岛'], tips: ['租电动车最方便', '注意防晒', '早上光线最好'] },
      { type: '深度', duration: '一整天', cost: '约¥280', description: '洱海全景深度游，包含西线海舌公园和喜洲古镇。', highlights: ['海舌公园', '喜洲古镇', '周城扎染体验', '双廊日落', '才村码头'], tips: ['顺时针环湖', '喜洲粑粑必吃', '扎染体验需预约'] },
    ],
  },
];

// ============ 数据增强逻辑 ============

function enhanceDestinations(seasonInfo) {
  const seasonOrder = SEASONAL_DESTINATIONS[seasonInfo.season] || SEASONAL_DESTINATIONS.spring;
  const idMap = {};
  seasonOrder.forEach((id, idx) => { idMap[id] = idx; });

  return BUILTIN_DESTINATIONS
    .map((dest) => ({
      ...dest,
      trendingReason: generateTrendingReason(TRENDING_TEMPLATES.destinations, dest.name, seasonInfo.season),
      trendingRank: (idMap[dest.id] ?? 99) + 1,
      isSeasonal: (idMap[dest.id] ?? 99) < 6,
    }))
    .sort((a, b) => (a.trendingRank) - (b.trendingRank));
}

function enhanceFoods(seasonInfo) {
  const seasonCities = SEASONAL_FOOD_CITIES[seasonInfo.season] || SEASONAL_FOOD_CITIES.spring;
  const cityRank = {};
  seasonCities.forEach((city, idx) => { cityRank[city] = idx; });

  const cityLocations = {
    '汕头': { name: '汕头市', lat: 23.3535, lng: 116.6818, address: '广东省汕头市' },
    '成都': { name: '成都市', lat: 30.5728, lng: 104.0668, address: '四川省成都市' },
    '长沙': { name: '长沙市', lat: 28.2282, lng: 112.9388, address: '湖南省长沙市' },
    '重庆': { name: '重庆市', lat: 29.4316, lng: 106.9123, address: '重庆市' },
  };

  return BUILTIN_FOODS
    .map((food) => ({
      ...food,
      location: cityLocations[food.city] || { name: food.city, lat: 0, lng: 0, address: food.city },
      trendingReason: generateTrendingReason(TRENDING_TEMPLATES.food, food.name, seasonInfo.season),
      trendingRank: (cityRank[food.city] ?? 99) + 1,
      isSeasonal: (cityRank[food.city] ?? 99) < 4,
    }))
    .sort((a, b) => (a.trendingRank) - (b.trendingRank));
}

function enhanceScenic(seasonInfo) {
  const planTypeMap = { '主流': 'mainstream', '经济': 'economy', '深度': 'deep', '特殊': 'special' };

  return BUILTIN_SCENIC.map((scenic) => ({
    ...scenic,
    scenicName: scenic.name,
    plans: (scenic.plans || []).map((plan) => ({
      ...plan,
      planType: planTypeMap[plan.type] || plan.type,
    })),
    trendingReason: generateTrendingReason(TRENDING_TEMPLATES.scenic, scenic.name, seasonInfo.season),
  }));
}

// ============ Netlify Function 主入口 ============

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
    const type = (event.queryStringParameters?.type || 'all').toLowerCase();
    const validTypes = ['destinations', 'food', 'scenic', 'all'];
    if (!validTypes.includes(type)) {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: `无效的 type 参数，可选值: ${validTypes.join(', ')}` }),
      };
    }

    const seasonInfo = getSeasonInfo();
    const responseData = {};

    if (type === 'all' || type === 'destinations') {
      responseData.destinations = enhanceDestinations(seasonInfo);
    }
    if (type === 'all' || type === 'food') {
      responseData.food = enhanceFoods(seasonInfo);
    }
    if (type === 'all' || type === 'scenic') {
      responseData.scenic = enhanceScenic(seasonInfo);
    }

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        data: responseData,
        season: seasonInfo.seasonName,
        seasonKey: seasonInfo.season,
        month: seasonInfo.dateStr,
        source: 'seasonal-enhancement',
        cached: false,
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
