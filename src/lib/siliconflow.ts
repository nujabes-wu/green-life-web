const API_KEY = process.env.NEXT_PUBLIC_SILICONFLOW_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1';

export class SiliconFlowClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey || API_KEY;
    this.baseUrl = baseUrl || BASE_URL;
  }

  async chatCompletion(params: {
    model: string;
    messages: Array<{
      role: 'system' | 'user' | 'assistant';
      content: string | Array<{
        type: 'text' | 'image_url';
        text?: string;
        image_url?: {
          url: string;
        };
      }>;
    }>;
    max_tokens?: number;
    temperature?: number;
  }) {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${await response.text()}`);
    }

    return response.json();
  }

  async textCompletion(params: {
    model: string;
    prompt: string;
    max_tokens?: number;
    temperature?: number;
  }) {
    const response = await fetch(`${this.baseUrl}/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${await response.text()}`);
    }

    return response.json();
  }

  async embeddings(params: {
    model: string;
    input: string | string[];
  }) {
    const response = await fetch(`${this.baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${await response.text()}`);
    }

    return response.json();
  }
}

// 创建默认客户端实例
export const siliconFlow = new SiliconFlowClient();
