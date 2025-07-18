import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGroq } from "@langchain/groq";
import { BaseMessage, AIMessage, HumanMessage } from "@langchain/core/messages";
import { AIContent } from "./agent";

export const LLama3 = async (conversation: AIContent[]) => {
  try {
    const apiKey: string = process.env.GROQ_API_KEY || "";

    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is not set.");
    }

    const llm = new ChatGroq({
      apiKey: apiKey,
      model: "llama3-8b-8192", // Or "mixtral-8x7b-32768", "llama3-70b-8192", etc.
      temperature: 0.7,
    });

    const agent = await createReactAgent({
      llm,
      tools: [],
      prompt: "You are a helpful assistant.",
    });

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
    throw new Error(`Failed to invoke Groq Agent: ${err.message || err}`);
  }
};
