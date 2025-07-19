import { DynamicTool } from "@langchain/core/tools";

export type LLMType = "Gemini" | "ChatGPT" | "Groq";

export type AIContent = {
  id: number;
  content: string;
  type: "user" | "ai" | "error";
};

export type AITool = {
  name: string;
  prompt: string;
  tools: DynamicTool;
};

export type AIConversation = {
  model: LLMType;
  prompt: string;
  tools: AITool[];
  conversation: AIContent[];
};

export type AIRequest = {
  prompt: string;
  tools: AITool[];
  conversation: AIContent[];
};

export class AIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIError";
    Object.setPrototypeOf(this, AIError.prototype);
  }
}
