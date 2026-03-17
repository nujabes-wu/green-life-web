import { siliconFlow } from '../siliconflow';
import { enhanceAIResponse } from './knowledge';

export async function getChatResponse(
  messages: Array<{
    role: string;
    content: string;
  }>,
  model: string = process.env.NEXT_PUBLIC_DEFAULT_CHAT_MODEL || 'Pro/zai-org/GLM-5',
  options?: {
    max_tokens?: number;
    temperature?: number;
  }
) {
  // 类型转换，确保role是有效的值
  const validatedMessages = messages.map(msg => ({
    ...msg,
    role: msg.role as 'system' | 'user' | 'assistant'
  }));

  const response = await siliconFlow.chatCompletion({
    model,
    messages: validatedMessages,
    max_tokens: options?.max_tokens || 1000,
    temperature: options?.temperature || 0.7,
  });

  let content = response.choices[0].message.content;
  
  // 去除**和###等符号
  content = content.replace(/\*\*/g, '');
  content = content.replace(/###/g, '');
  
  return content;
}

export async function getEcoAdvice(question: string) {
  // 获取增强提示
  const enhancedPrompt = await enhanceAIResponse(question);
  
  // 构建系统提示
  const systemPrompt = '你是一个专业的环保顾问，拥有丰富的环保知识和实践经验。请以友好、专业的语气回答用户关于环保的问题，提供准确、实用的建议。';
  
  // 构建完整的消息数组
  const messages = [
    {
      role: 'system',
      content: systemPrompt + (enhancedPrompt ? '\n\n' + enhancedPrompt : ''),
    },
    {
      role: 'user',
      content: question,
    },
  ];
  
  return getChatResponse(messages);
}

export async function generateReductionTips(carbonData: {
  total: number;
  breakdown: {
    transport: number;
    energy: number;
    consumption: number;
  };
}) {
  return getChatResponse([
    {
      role: 'system',
      content: '你是一个专业的环保顾问，专注于碳排放分析和减排策略。请基于用户的碳排放数据，提供详细、个性化的减排建议。',
    },
    {
      role: 'user',
      content: `我的年度碳排放量为${carbonData.total} kg CO₂e，其中交通出行${carbonData.breakdown.transport} kg，家庭能源${carbonData.breakdown.energy} kg，生活消费${carbonData.breakdown.consumption} kg。请提供具体的减排建议，包括每个领域的改进措施、预期效果和实施难度。`,
    },
  ]);
}
