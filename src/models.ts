import "dotenv/config";
import { OpenAIClient } from "@anvia/openai";

// validate api key
const apiKey = process.env.LLM_API_KEY;

if (!apiKey) {
  throw new Error("LLM_API_KEY is empty in .env");
}

const client = new OpenAIClient({
  apiKey: apiKey,
  baseUrl: process.env.LLM_API_BASE_URL,
});

// Model
export const model = client.completionModel({
  modelId: "openai/gpt-5.6-luna",
  api: "chat",
});

export function getModel(modelId: string) {
  return client.completionModel({
    modelId,
    api: "chat",
  });
}
