// AI相关类型定义

// 聊天消息类型
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// 图像内容类型
export interface ImageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}

// 图像分析请求类型
export interface ImageAnalysisRequest {
  imageUrl: string;
  prompt: string;
  model?: string;
  options?: {
    max_tokens?: number;
    temperature?: number;
  };
}

// 回收分析结果类型
export interface RecyclingAnalysisResult {
  itemName: string;
  material: string;
  category: string;
  instructions: string;
  environmentalImpact: string;
  recyclingLocations: string[];
  confidence?: number;
}

// 减排建议类型
export interface ReductionTip {
  category: string;
  description: string;
  impact: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// 环保报告类型
export interface EcoReport {
  overallAssessment: string;
  breakdownAnalysis: {
    transport: string;
    energy: string;
    consumption: string;
  };
  comparison: string;
  potentialAreas: string[];
  recommendations: ReductionTip[];
  environmentalImpact: string;
}

// 二手物品评估类型
export interface MarketItemEvaluation {
  valueRange: string;
  condition: string;
  priceRecommendation: number;
  environmentalValue: string;
  confidence?: number;
}

// 绿色产品推荐类型
export interface GreenProductRecommendation {
  name: string;
  category: string;
  description: string;
  price: number;
  ecoRating: number;
  features: string[];
  whyRecommended: string;
}

// AI环保顾问对话类型
export interface EcoAdvisorConversation {
  id: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}
