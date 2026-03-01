import { siliconFlow } from '../siliconflow';

export async function analyzeImage(
  imageUrl: string,
  prompt: string,
  model: string = process.env.NEXT_PUBLIC_DEFAULT_IMAGE_MODEL || 'Qwen/Qwen3-VL-32B-Instruct',
  options?: {
    max_tokens?: number;
    temperature?: number;
  }
) {
  const response = await siliconFlow.chatCompletion({
    model,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt,
          },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl,
            },
          },
        ],
      },
    ],
    max_tokens: options?.max_tokens || 800,
    temperature: options?.temperature || 0.3,
  });

  return response.choices[0].message.content;
}

export async function analyzeRecyclingItem(imageUrl: string) {
  return analyzeImage(
    imageUrl,
    '请详细分析图片中的物品，按照以下格式提供信息：\n\n【物品识别】\n- 物品名称：[具体名称]\n- 物品材质：[主要材质]\n- 物品特征：[外观、状态等特征]\n\n【垃圾分类】\n- 分类类型：[可回收物/厨余垃圾/有害垃圾/其他垃圾]\n- 分类依据：[简要说明分类理由]\n- 分类颜色：[蓝色/绿色/红色/灰色]\n\n【回收建议】\n- 预处理方法：[回收前需要的处理步骤]\n- 投放方式：[如何正确投放]\n- 注意事项：[特殊处理要求]\n\n【环保分析】\n- 回收意义：[回收该物品的环保价值]\n- 环境影响：[不回收的环境危害]\n- 回收效益：[回收后的资源利用]\n\n【回收地点】\n- 常见回收点：[当地可能的回收场所]\n- 回收时间：[建议的回收时间]\n\n请提供详细、准确的信息，确保物品识别准确，分类正确，并给出实用的回收建议。'
  );
}

export async function evaluateMarketItem(imageUrl: string, description: string) {
  return analyzeImage(
    imageUrl,
    `请评估这张图片中的物品价值，物品描述为：${description}。请提供：1. 物品的大致价值范围 2. 物品的新旧程度评估 3. 合理的定价建议 4. 物品的环保价值分析。请基于市场行情和物品状况提供专业、客观的评估。`
  );
}
