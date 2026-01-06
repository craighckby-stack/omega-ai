// Mock SDK for when z-ai-web-dev-sdk is not available

export interface LLMResponse {
  text?: string;
  reasoning?: string;
  confidence?: number;
}

export interface CompletionResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

export class MockZAI {
  static async create(): Promise<MockZAI> {
    return new MockZAI();
  }

  private async callLLM(prompt: string): Promise<LLMResponse> {
    // Simple mock implementation
    return {
      text: "This is a simulated response. The AI SDK is not configured.",
      reasoning: "Mock reasoning: SDK not installed",
      confidence: 0.5
    };
  }

  get chat() {
    return {
      completions: {
        create: async (params: any) => {
          const prompt = params.messages?.[params.messages.length - 1]?.content || '';

          const response = await this.callLLM(prompt);

          return {
            choices: [
              {
                message: {
                  role: 'assistant',
                  content: response.text || ''
                }
              }
            ]
          } as any;
        }
      }
    };
  }
}

export default MockZAI;
