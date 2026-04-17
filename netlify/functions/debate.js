/**
 * /api/debate - 多 LLM 辩论验证接口
 *
 * 功能：并行调用多个免费 LLM，收集回答后进行辩论验证，综合出最优答案
 * 架构：用户问题 → 并行调用N个LLM → 收集回答 → 辩论验证(第N+1次调用) → 综合答案
 *
 * 支持的 LLM：
 * - 智谱 AI (GLM-4-Flash) - 完全免费
 * - DeepSeek V3 - 完全免费
 * - Google Gemini Flash - 完全免费
 *
 * 降级策略：
 * - 所有 LLM 失败 → 降级到本地 Mock
 * - 只有 1 个成功 → 直接使用该回答
 * - 只有 2 个成功 → 用其中一个验证另一个
 */

const crypto = require('crypto');

// ============ CORS 响应头 ============

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// ============ GoNow 旅行助手 System Prompt ============

const GONOW_SYSTEM_PROMPT = `你是 GoNow 旅行规划助手，一个友好、专业的 AI 旅行顾问。你的任务是帮助用户规划旅行行程。

回复要求：
1. 使用中文回复
2. 回复要简洁友好，信息准确
3. 当用户提供了足够的信息（目的地、日期、人数），生成一个旅行行程概要
4. 推荐景点、美食、住宿时，尽量提供具体名称和实用信息
5. 如果不确定某个信息，请诚实说明`;

// ============ 辩论审核员 System Prompt ============

const DEBATER_SYSTEM_PROMPT = `你是 GoNow 旅行助手的答案审核员。以下是多个 AI 模型对同一旅行问题的回答。

请执行以下任务：
1. 分析每个回答的优缺点
2. 找出最准确、最实用的信息
3. 纠正回答中可能存在的错误（如过时的价格、错误的地址、不存在的景点等）
4. 综合所有回答的优点，形成一个最优答案
5. 如果回答之间存在矛盾，请指出并给出你的判断依据

输出格式要求：
- 先给出综合后的最优答案（直接回答用户问题）
- 然后用分隔线 "---" 分隔
- 最后给出简短的分析说明（哪个模型的信息更准确，是否有矛盾等）

注意：综合答案应该是一个完整、自然、对用户友好的回复，而不是简单的拼接。`;

// ============ LLM 配置 ============

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
          { role: 'system', content: GONOW_SYSTEM_PROMPT },
          { role: 'user', content: message },
        ],
        max_tokens: 1024,
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
          { role: 'system', content: GONOW_SYSTEM_PROMPT },
          { role: 'user', content: message },
        ],
        max_tokens: 1024,
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
            parts: [{ text: `${GONOW_SYSTEM_PROMPT}\n\n用户问题：${message}` }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 1024,
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
 * 生成简单的会话 ID
 */
function generateSessionId() {
  try {
    return crypto.randomUUID();
  } catch {
    return 'session-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
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
 * @param {object} llm - LLM 配置
 * @param {string} message - 用户消息
 * @param {number} timeoutMs - 超时时间（毫秒）
 * @returns {Promise<{model: string, label: string, answer: string}>}
 */
async function callLLM(llm, message, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    // Gemini 的 URL 需要拼接 API Key
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

  return {
    model: llm.name,
    label: llm.label,
    answer: answer.trim(),
  };
}

/**
 * 辩论验证阶段：使用主模型综合评判所有回答
 * @param {object} debaterLLM - 担任审核员的 LLM 配置
 * @param {string} userMessage - 用户原始问题
 * @param {Array<{model: string, label: string, answer: string}>} answers - 各模型回答
 * @returns {Promise<{reply: string, confidence: number, consensus: boolean}>}
 */
async function debateAndSynthesize(debaterLLM, userMessage, answers) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  // 构建辩论输入
  const debateInput = `用户原始问题：
${userMessage}

以下是 ${answers.length} 个 AI 模型的回答：

${answers.map((a, i) => `--- 模型 ${i + 1}（${a.label}）的回答 ---\n${a.answer}`).join('\n\n')}

请综合以上回答，给出最优答案。`;

  let response;
  try {
    const url = debaterLLM.key === 'gemini'
      ? `${debaterLLM.apiUrl}?key=${debaterLLM.apiKey}`
      : debaterLLM.apiUrl;

    const request = debaterLLM.buildRequest(debaterLLM.apiKey, debateInput);

    // 覆盖 system prompt 为辩论审核员
    if (debaterLLM.key === 'gemini') {
      const body = JSON.parse(request.body);
      body.contents[0].parts[0].text = `${DEBATER_SYSTEM_PROMPT}\n\n${debateInput}`;
      request.body = JSON.stringify(body);
    } else {
      const body = JSON.parse(request.body);
      body.messages[0].content = DEBATER_SYSTEM_PROMPT;
      body.messages[1].content = debateInput;
      body.max_tokens = 2048;
      request.body = JSON.stringify(body);
    }

    response = await fetch(url, {
      ...request,
      signal: controller.signal,
    });
  } catch (fetchError) {
    clearTimeout(timeoutId);
    if (fetchError.name === 'AbortError') {
      throw new Error('辩论验证阶段请求超时');
    }
    throw fetchError;
  }

  clearTimeout(timeoutId);

  if (!response.ok) {
    throw new Error(`辩论验证 API 调用失败: ${response.status}`);
  }

  const data = await response.json();
  const fullReply = debaterLLM.parseResponse(data);

  if (!fullReply || fullReply.trim() === '') {
    throw new Error('辩论验证返回了空回答');
  }

  // 解析综合答案和分析说明
  let reply = fullReply;
  let analysis = '';

  const separatorIndex = fullReply.indexOf('\n---\n');
  if (separatorIndex !== -1) {
    reply = fullReply.substring(0, separatorIndex).trim();
    analysis = fullReply.substring(separatorIndex + 5).trim();
  }

  // 评估置信度和共识
  const confidence = calculateConfidence(answers, analysis);
  const consensus = evaluateConsensus(answers, analysis);

  return { reply, confidence, consensus, analysis };
}

/**
 * 计算综合置信度
 */
function calculateConfidence(answers, analysis) {
  let confidence = 0.6; // 基础置信度

  // 模型数量越多，置信度越高
  confidence += Math.min(answers.length * 0.1, 0.2);

  // 如果分析中提到"一致"、"相同"等词，提高置信度
  const positiveSignals = ['一致', '相同', '准确', '正确', '可靠', '共识'];
  const negativeSignals = ['矛盾', '冲突', '不准确', '错误', '过时', '不确定'];

  for (const signal of positiveSignals) {
    if (analysis.includes(signal)) confidence += 0.03;
  }
  for (const signal of negativeSignals) {
    if (analysis.includes(signal)) confidence -= 0.05;
  }

  // 限制在 0.3-0.98 之间
  return Math.max(0.3, Math.min(0.98, confidence));
}

/**
 * 评估是否达成共识
 */
function evaluateConsensus(answers, analysis) {
  // 如果分析中提到矛盾或冲突，认为未达成共识
  const conflictSignals = ['矛盾', '冲突', '不一致', '分歧', '差异较大'];
  for (const signal of conflictSignals) {
    if (analysis.includes(signal)) return false;
  }
  return true;
}

/**
 * 生成回答摘要（截取前100字符）
 */
function summarizeAnswer(answer, maxLength = 100) {
  if (answer.length <= maxLength) return answer;
  return answer.substring(0, maxLength) + '...';
}

// ============ Mock 降级逻辑 ============

/**
 * Mock 降级回复（与 chat.js 一致）
 */
function getMockReply(message) {
  const lower = message.toLowerCase();

  if (lower.includes('日本') || lower.includes('东京') || lower.includes('大阪')) {
    return '日本是个很棒的旅行目的地！我为你推荐以下行程安排：\n\n**Day 1 - 东京探索**\n- 上午：浅草寺、雷门\n- 下午：秋叶原、银座购物\n- 晚上：涩谷十字路口、新宿歌舞伎町\n\n**Day 2 - 文化体验**\n- 上午：明治神宫、原宿\n- 下午：上野公园、博物馆\n- 晚上：东京塔夜景\n\n需要我帮你细化每天的行程，或者调整预算吗？';
  }

  if (lower.includes('泰国') || lower.includes('曼谷') || lower.includes('清迈')) {
    return '泰国之旅听起来很棒！这是我的推荐方案：\n\n**Day 1 - 曼谷经典**\n- 大皇宫、玉佛寺\n- 卧佛寺泰式按摩\n- 考山路夜市\n\n**Day 2 - 美食之旅**\n- 水上市场早餐\n- 暹罗商圈购物\n- 唐人街美食探索\n\n需要我帮你安排住宿和交通吗？';
  }

  if (lower.includes('预算') || lower.includes('花费') || lower.includes('费用')) {
    return '关于预算规划，我有以下建议：\n\n1. **住宿**：建议占总预算的 30-40%\n2. **餐饮**：建议占总预算的 20-30%\n3. **交通**：建议占总预算的 15-20%\n4. **景点门票**：建议占总预算的 10-15%\n5. **购物及其他**：预留 10% 弹性空间\n\n你可以告诉我你的总预算和目的地，我来帮你做更详细的分配。';
  }

  return '收到你的旅行需求！让我来帮你规划一下。\n\n为了给你更好的建议，你可以告诉我：\n- 你想去哪里？\n- 计划玩几天？\n- 大概的预算是多少？\n- 有什么特别的偏好？（美食、文化、冒险等）\n\n我会根据你的需求生成一份完整的行程方案。';
}

/**
 * Mock 建议追问
 */
function getMockSuggestions(message) {
  const lower = message.toLowerCase();

  if (lower.includes('日本') || lower.includes('东京')) {
    return ['帮我安排住宿', '推荐当地美食', '预算控制在5000以内', '增加京都行程'];
  }
  if (lower.includes('泰国') || lower.includes('曼谷')) {
    return ['推荐当地美食', '安排交通方案', '增加清迈行程', '预算控制在3000以内'];
  }
  if (lower.includes('预算') || lower.includes('花费')) {
    return ['推荐经济型住宿', '如何省钱', '帮我规划5天行程', '推荐自由行还是跟团'];
  }

  return ['推荐去日本旅行', '推荐去泰国旅行', '帮我规划5天行程', '预算控制在5000以内'];
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

    const { message, sessionId: inputSessionId, context } = body;

    // 参数校验
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

    const sessionId = inputSessionId || generateSessionId();

    // 获取已配置的 LLM 列表
    const availableLLMs = getAvailableLLMs();

    console.log(`[/api/debate] 可用 LLM 数量: ${availableLLMs.length}, 模型: ${availableLLMs.map((l) => l.label).join(', ')}`);

    // 降级策略：没有可用 LLM 时使用 Mock
    if (availableLLMs.length === 0) {
      console.log('[/api/debate] 无可用 LLM，降级到 Mock 模式');
      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          data: {
            reply: getMockReply(message),
            debate: null,
            sessionId,
            suggestions: getMockSuggestions(message),
          },
        }),
      };
    }

    // ============ 阶段 1：并行调用所有 LLM ============
    console.log(`[/api/debate] 阶段1: 并行调用 ${availableLLMs.length} 个 LLM...`);

    const callPromises = availableLLMs.map((llm) =>
      callLLM(llm, message, 10000).catch((err) => {
        console.error(`[/api/debate] ${llm.label} 调用失败:`, err.message);
        return null; // 失败返回 null，不影响其他
      })
    );

    const results = await Promise.allSettled(callPromises);
    const successfulAnswers = results
      .filter((r) => r.status === 'fulfilled' && r.value !== null)
      .map((r) => r.value);

    console.log(`[/api/debate] 成功获取 ${successfulAnswers.length} 个回答`);

    // 降级策略：所有 LLM 都失败
    if (successfulAnswers.length === 0) {
      console.log('[/api/debate] 所有 LLM 调用失败，降级到 Mock 模式');
      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          data: {
            reply: getMockReply(message),
            debate: null,
            sessionId,
            suggestions: getMockSuggestions(message),
          },
        }),
      };
    }

    // ============ 阶段 2：辩论验证 ============
    let finalReply = '';
    let confidence = 0.5;
    let consensus = true;
    let debaterModel = '';

    if (successfulAnswers.length === 1) {
      // 只有 1 个成功 → 直接使用，跳过辩论
      console.log('[/api/debate] 只有 1 个 LLM 成功，跳过辩论阶段');
      finalReply = successfulAnswers[0].answer;
      confidence = 0.5;
      consensus = true;
      debaterModel = successfulAnswers[0].model;
    } else {
      // 2 个或更多成功 → 进行辩论验证
      console.log(`[/api/debate] 阶段2: 辩论验证（${successfulAnswers.length} 个回答）`);

      // 选择第一个成功的 LLM 作为审核员
      const debaterLLM = availableLLMs.find(
        (llm) => llm.name === successfulAnswers[0].model
      );
      debaterModel = successfulAnswers[0].model;

      try {
        const debateResult = await debateAndSynthesize(
          debaterLLM,
          message,
          successfulAnswers
        );
        finalReply = debateResult.reply;
        confidence = debateResult.confidence;
        consensus = debateResult.consensus;
        console.log(`[/api/debate] 辩论完成，置信度: ${confidence}, 共识: ${consensus}`);
      } catch (debateError) {
        // 辩论阶段失败，使用第一个回答
        console.error('[/api/debate] 辩论验证失败，使用第一个回答:', debateError.message);
        finalReply = successfulAnswers[0].answer;
        confidence = 0.4;
        consensus = false;
      }
    }

    // ============ 构建返回结果 ============
    const debateInfo = {
      models: successfulAnswers.map((a) => a.model),
      answers: successfulAnswers.map((a) => summarizeAnswer(a.answer)),
      debater: debaterModel,
      confidence: Math.round(confidence * 100) / 100,
      consensus,
    };

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        data: {
          reply: finalReply,
          debate: debateInfo,
          sessionId,
          suggestions: getMockSuggestions(message),
        },
      }),
    };
  } catch (error) {
    console.error('[/api/debate] 服务端错误:', error);

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
