import { siliconFlow } from '../siliconflow';

export async function getEmbedding(text: string | string[]) {
  const response = await siliconFlow.embeddings({
    model: process.env.NEXT_PUBLIC_DEFAULT_EMBED_MODEL || 'Qwen/Qwen3-Embedding-0.6B',
    input: text
  });
  return response.data;
}

export async function calculateSimilarity(embedding1: number[], embedding2: number[]): Promise<number> {
  if (embedding1.length !== embedding2.length) {
    throw new Error('Embeddings must have the same length');
  }
  
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    norm1 += embedding1[i] * embedding1[i];
    norm2 += embedding2[i] * embedding2[i];
  }
  
  norm1 = Math.sqrt(norm1);
  norm2 = Math.sqrt(norm2);
  
  if (norm1 === 0 || norm2 === 0) {
    return 0;
  }
  
  return dotProduct / (norm1 * norm2);
}
