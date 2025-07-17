// utils/ai/agent/agent.ts

"use server";

import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BaseMessage, AIMessage } from "@langchain/core/messages";
import { Flash } from "./gemini";

export type AIContent = {
  id: number;
  content: string;
  type: "user" | "ai" | "error";
};

export type AIConversation = {
  model: "Gemini" | "ChatGPT";
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
  try {
    switch (request.model) {
      case "Gemini":
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
        throw new AIError("Undefined Gemini response error");

      case "ChatGPT":
        return {
          id: Date.now() + 1,
          content: "ChaatGPT response",
          type: "ai",
        };
    }
  } catch (error) {
    if (error instanceof AIError) {
      return {
        id: Date.now() + 1,
        content: error.message,
        type: "error",
      };
    }
    return {
      id: Date.now() + 1,
      content: "An Error occurred",
      type: "error",
    };
  }
};
