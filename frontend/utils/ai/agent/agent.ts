// utils/ai/agent/agent.ts
"use server";

import { Flash } from "./gemini";
import { Turbo } from "./chatgpt";
import { LLama3 } from "./groq";

export type LLMType = "Gemini" | "ChatGPT" | "Groq";

export type AIContent = {
  id: number;
  content: string;
  type: "user" | "ai" | "error";
};

export type AIConversation = {
  model: LLMType;
  conversation: AIContent[];
};

class AIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIError";
    Object.setPrototypeOf(this, AIError.prototype);
  }
}

export const agentQuery = async (
  request: AIConversation
): Promise<AIContent> => {
  console.log(JSON.stringify(request, null, 2));

  try {
    switch (request.model) {
      case "Gemini":
        {
          const aiResponse = await Flash(request.conversation);
          const response: any | undefined =
            aiResponse.messages[aiResponse.messages.length - 1];

          if (response) {
            return {
              id: Date.now() + 1,
              content: response.content,
              type: "ai",
            };
          }
        }
        throw new AIError("Undefined Gemini response error");

      case "ChatGPT":
        {
          const aiResponse = await Turbo(request.conversation);
          const response: any | undefined =
            aiResponse.messages[aiResponse.messages.length - 1];

          if (response) {
            return {
              id: Date.now() + 1,
              content: response.content,
              type: "ai",
            };
          }
        }
        throw new AIError("Undefined OpenAI response error");

      case "Groq":
        {
          const aiResponse = await LLama3(request.conversation);
          const response: any | undefined =
            aiResponse.messages[aiResponse.messages.length - 1];

          if (response) {
            return {
              id: Date.now() + 1,
              content: response.content,
              type: "ai",
            };
          }
        }
        throw new AIError("Undefined Groq response error");
    }
  } catch (error: any) {
    if (error instanceof AIError) {
      return {
        id: Date.now() + 1,
        content: error.message,
        type: "error",
      };
    }
    return {
      id: Date.now() + 1,
      content: `An Error occurred: ${error.message}`,
      type: "error",
    };
  }
};
