import { ecoKnowledgeBase } from '../../data/eco-knowledge';
import { getEmbedding, calculateSimilarity } from './embedding';

interface KnowledgeWithScore {
  item: typeof ecoKnowledgeBase[0];
  score: number;
}

export async function searchKnowledge(query: string, topK: number = 3): Promise<KnowledgeWithScore[]> {
  try {
    // 获取查询的嵌入
    const queryEmbeddingResponse = await getEmbedding(query);
    const queryEmbedding = queryEmbeddingResponse[0].embedding;
    
    // 为知识库中的每个条目计算相似度
    const knowledgeWithScores: KnowledgeWithScore[] = [];
    
    // 批量获取知识库条目的嵌入
    const knowledgeTexts = ecoKnowledgeBase.map(item => item.content);
    const knowledgeEmbeddingsResponse = await getEmbedding(knowledgeTexts);
    
    for (let i = 0; i < ecoKnowledgeBase.length; i++) {
      const item = ecoKnowledgeBase[i];
      const embedding = knowledgeEmbeddingsResponse[i].embedding;
      const score = await calculateSimilarity(queryEmbedding, embedding);
      
      knowledgeWithScores.push({ item, score });
    }
    
    // 按相似度排序并返回前topK个结果
    knowledgeWithScores.sort((a, b) => b.score - a.score);
    return knowledgeWithScores.slice(0, topK);
  } catch (error) {
    console.error('Error searching knowledge:', error);
    // 如果嵌入模型调用失败，返回空数组
    return [];
  }
}

export async function enhanceAIResponse(question: string): Promise<string> {
  // 搜索相关知识
  const relevantKnowledge = await searchKnowledge(question);
  
  // 构建增强提示
  let enhancedPrompt = '';
  
  if (relevantKnowledge.length > 0) {
    enhancedPrompt = '以下是相关的环保知识，可以作为回答的参考：\n\n';
    
    relevantKnowledge.forEach(({ item, score }) => {
      if (score > 0.5) { // 只使用相似度较高的知识
        enhancedPrompt += `【${item.title}】\n${item.content}\n\n`;
      }
    });
    
    enhancedPrompt += '请基于上述知识，回答用户的问题：\n';
  }
  
  return enhancedPrompt;
}
