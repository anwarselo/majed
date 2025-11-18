import OpenAI from "openai";
import { getServerEnv } from "./env";

let cachedClient: OpenAI | null = null;

function getOpenAiClient(): OpenAI | null {
  const env = getServerEnv();
  if (!env.OPENAI_API_KEY) {
    return null;
  }
  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }
  return cachedClient;
}

export async function summarizeText(input: string): Promise<string> {
  const trimmed = input.trim();
  if (!trimmed) {
    console.log("[LLM] Input is empty, skipping summarization");
    return "";
  }

  const env = getServerEnv();
  const client = getOpenAiClient();

  if (!client) {
    console.warn("[LLM] No OpenAI client available (missing API key), returning raw text");
    return trimmed;
  }

  const limited = trimmed.slice(0, 6000);
  console.log(`[LLM] Summarizing text (${limited.length} chars) with model: ${env.LLM_MODEL_NAME}`);
  
  try {
    const response = await client.chat.completions.create({
      model: env.LLM_MODEL_NAME,
      max_completion_tokens: env.LLM_MAX_TOKENS,
      messages: [
        {
          role: "system",
          content:
            "You rewrite business descriptions into short, factual paragraphs suitable for a microsite. Keep headings or bullet points when provided.",
        },
        {
          role: "user",
          content: limited,
        },
      ],
    });

    const result = response.choices[0]?.message?.content?.trim() || trimmed;
    console.log(`[LLM] Summarization complete (${result.length} chars)`);
    return result;
  } catch (error) {
    console.error("[LLM] Summarization failed, returning raw text:", error);
    return trimmed;
  }
}

