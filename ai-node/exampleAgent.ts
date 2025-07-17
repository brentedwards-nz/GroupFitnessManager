// utils/ai/basicagent/basicAgent.ts

import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const content: string = "What is the weath erlike in Auckland";

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("GOOGLE_API_KEY is not set in your environment or .env file.");
} else {
  const llm = new ChatGoogleGenerativeAI({
    apiKey: apiKey,
    model: "gemini-1.5-flash",
    temperature: 0.7,
    // Add other configuration as needed, e.g., maxOutputTokens
  });
  console.log(`Basic Agent Called: Got llm: ${llm}`);

  const agent = await createReactAgent({
    llm,
    tools: [],
    prompt: "You are a helpful assistant.",
  });
  console.log(`Basic Agent Called: Got agent: ${agent}`);

  console.log(`Basic Agent Called: Calling invoke...`);
  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: content,
      },
    ],
  });
  console.log(
    `Basic Agent Called: Got result: ${JSON.stringify(result, null, 2)}`
  );
}
