// listModels.ts
import "dotenv/config"; // Make sure your .env is loaded

// IMPORT FROM THE CORE GOOGLE GEMINI SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

async function listGeminiModels() {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.error(
      "GOOGLE_API_KEY is not set in your environment or .env file."
    );
    console.error("Please set it before running this script.");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // The listModels method is directly on the top-level client instance.
    // My previous assumption about it being on `genAI.getGenerativeModel()` was incorrect.
    // It's a method to list *all* available models, not specific to one model instance.
    const { models } = await genAI.listModels(); // THIS IS THE CORRECT CALL
    console.log("Available Gemini Models:");
    for (const model of models) {
      console.log(
        `- Name: ${
          model.name
        }, Supported Methods: ${model.supportedGenerationMethods?.join(", ")}`
      );
    }
  } catch (error: any) {
    console.error("Error listing models:");
    if (error.response) {
      console.error("Status:", error.response.status);
      try {
        console.error("Data:", await error.response.text());
      } catch (readError) {
        console.error("Could not read response body:", readError);
      }
    } else {
      console.error(error);
    }
  }
}

listGeminiModels();
