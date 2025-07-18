import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage, AIMessage, HumanMessage } from "@langchain/core/messages";
import { AIContent } from "./agent";

class AIChatGPTError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIChatGPTError";
    Object.setPrototypeOf(this, AIChatGPTError.prototype);
  }
}

type turboConfig = {};

export const Turbo = async (conversation: AIContent[]) => {
  try {
    const apiKey: string = process.env.OPENAI_API_KEY || ""; // Changed to OPENAI_API_KEY
    console.log(`APIKEY: ${apiKey}`);

    console.log(`LLM Construction...`);
    const llm = new ChatOpenAI({
      apiKey: apiKey,
      model: "gpt-3.5-turbo", // Changed model to a ChatGPT model
      temperature: 0.7,
    });
    console.log(`LLM Construction done`);

    console.log(`Agent Construction...`);
    const agent = await createReactAgent({
      llm,
      tools: [],
      prompt: "You are a helpful assistant.",
    });
    console.log(`Agent Construction done`);

    console.log(`Invoke agent...`);

    const chatMessages: BaseMessage[] = conversation
      .filter((item) => item.type !== "error")
      .map((item) => {
        if (item.type === "user") {
          return new HumanMessage(item.content);
        } else if (item.type === "ai") {
          return new AIMessage(item.content);
        }
        throw new Error(`Unknown message type: ${item.type}`);
      });

    const result = await agent.invoke({
      messages: chatMessages,
    });

    console.log(`Invoke agent done`);
    const serializedMessages = result.messages.map((msg: BaseMessage) => {
      if (msg.getType() === "human") {
        return {
          role: "user",
          content: msg.content,
        };
      } else if (msg.getType() === "ai") {
        return {
          role: "ai",
          content: msg.content,
          tool_calls: (msg as AIMessage).tool_calls,
          response_metadata: (msg as AIMessage).response_metadata,
        };
      }
      return { role: "unknown", content: "Could not serialize message" };
    });

    return {
      messages: serializedMessages,
    };
  } catch (err: any) {
    console.log("**************************");
    console.log("Turbo Error:");
    console.log(JSON.stringify(err, null, 2));
    throw new Error(`Failed to invoke Turbo: ${err.message || err}`);
  }
};
