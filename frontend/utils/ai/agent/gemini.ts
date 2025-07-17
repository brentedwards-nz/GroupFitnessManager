import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BaseMessage, AIMessage } from "@langchain/core/messages";
import { AIContent } from "./agent";

type FlashConfig = {};

export const Flash = async (conversation: AIContent[]) => {
  try {
    const apiKey: string = process.env.GOOGLE_API_KEY || "";
    console.log(`APIKEY: ${apiKey}`);

    console.log(`LLM Construction...`);
    const llm = new ChatGoogleGenerativeAI({
      apiKey: apiKey,
      model: "gemini-1.5-flash",
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
      .filter((item) => item.type !== "error") // Filter out items where type is "error"
      .map((item) => {
        if (item.type === "user") {
          // Import HumanMessage if not already imported
          const { HumanMessage } = require("@langchain/core/messages");
          return new HumanMessage(item.content);
        } else if (item.type === "ai") {
          // Import AIMessage if not already imported
          return new AIMessage(item.content);
        }
        // Optionally handle other types or throw
        throw new Error(`Unknown message type: ${item.type}`);
      });

    const result = await agent.invoke({
      messages: chatMessages,
    });

    console.log(`Invoke agent done`);
    const serializedMessages = result.messages.map((msg: BaseMessage) => {
      // Determine message type and extract relevant data
      if (msg.getType() === "human") {
        return {
          role: "user",
          content: msg.content,
          // Add other plain properties you need from HumanMessage
        };
      } else if (msg.getType() === "ai") {
        return {
          role: "ai",
          content: msg.content,
          // Add other plain properties you need from AIMessage, e.g., tool_calls if applicable
          tool_calls: (msg as AIMessage).tool_calls, // Cast to AIMessage to access tool_calls if they exist
          response_metadata: (msg as AIMessage).response_metadata, // Example: for token usage
        };
      }
      // Handle other message types if necessary
      return { role: "unknown", content: "Could not serialize message" };
    });

    return {
      messages: serializedMessages,
    };
  } catch (err: any) {
    throw new Error(`Failed to invoke BasicAgent: ${err.message || err}`);
  }
};
