import { siliconFlow } from '../siliconflow';

export async function generateText(
  prompt: string,
  model: string = process.env.NEXT_PUBLIC_DEFAULT_CHAT_MODEL || 'Pro/zai-org/GLM-5',
  options?: {
    max_tokens?: number;
    temperature?: number;
  }
) {
  const response = await siliconFlow.textCompletion({
    model,
    prompt,
    max_tokens: options?.max_tokens || 1000,
    temperature: options?.temperature || 0.7,
  });

  return response.choices[0].text;
}

export async function generateEcoReport(carbonData: {
  total: number;
  breakdown: {
    transport: number;
    energy: number;
    consumption: number;
  };
  history?: Array<{
    date: string;
    value: number;
  }>;
}) {
  const historyText = carbonData.history
    ? carbonData.history.map(item => `${item.date}: ${item.value} kg`).join(', ') 
    : '无历史数据';

  return generateText(
    `请基于以下碳排放数据生成一份详细的环保分析报告：

年度碳排放量：${carbonData.total} kg CO₂e
交通出行：${carbonData.breakdown.transport} kg
家庭能源：${carbonData.breakdown.energy} kg
生活消费：${carbonData.breakdown.consumption} kg

历史数据：${historyText}

报告应包括：
1. 总体碳排放水平评估
2. 各领域碳排放分析
3. 与行业平均水平的对比
4. 主要减排潜力领域
5. 具体的减排建议和目标
6. 减排对环境的积极影响

请以专业、客观的语气撰写报告，提供数据支持的分析和可操作的建议。`,
    process.env.NEXT_PUBLIC_DEFAULT_CHAT_MODEL || 'Pro/zai-org/GLM-5',
    { max_tokens: 1500, temperature: 0.6 }
  );
}

export async function generateGreenProductDescription(product: {
  name: string;
  category: string;
  features: string[];
  price: number;
}) {
  return generateText(
    `请为以下环保产品生成一份吸引人的产品描述：

产品名称：${product.name}
产品类别：${product.category}
产品特点：${product.features.join(', ')}
价格：${product.price}元

描述应包括：
1. 产品的环保特性和优势
2. 产品的功能和使用场景
3. 产品对环境的积极影响
4. 与传统产品的对比
5. 适合的目标用户群体

请使用生动、简洁的语言，突出产品的环保价值和实用性，吸引潜在消费者。`,
    process.env.NEXT_PUBLIC_DEFAULT_CHAT_MODEL || 'Pro/zai-org/GLM-5',
    { max_tokens: 800, temperature: 0.8 }
  );
}
