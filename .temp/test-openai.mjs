import OpenAI from "openai";
import { readFileSync } from "fs";

const envContent = readFileSync(".env.local", "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

console.log("OPENAI_API_KEY:", envVars.OPENAI_API_KEY?.substring(0, 20) + "...");
console.log("LLM_MODEL_NAME:", envVars.LLM_MODEL_NAME);

const client = new OpenAI({ apiKey: envVars.OPENAI_API_KEY });

try {
  console.log("\nTesting OpenAI API with gpt-5-mini...\n");
  
  const response = await client.chat.completions.create({
    model: envVars.LLM_MODEL_NAME || "gpt-5-mini",
    max_completion_tokens: 500,
    messages: [
      {
        role: "system",
        content: "You rewrite business descriptions into short, factual paragraphs suitable for a microsite."
      },
      {
        role: "user",
        content: "Dasso Bamboo is a leading bamboo manufacturer with 30 years of experience. We make sustainable bamboo products for flooring, decking, and furniture."
      }
    ]
  });

  console.log("✅ SUCCESS!");
  console.log("Response:", response.choices[0]?.message?.content);
  
} catch (error) {
  console.error("❌ ERROR:", error.message);
  console.error("Error code:", error.code);
  console.error("Error type:", error.type);
  console.error("\nFull error:", error);
}

