import { spawn } from "node:child_process";
import { getServerEnv } from "./env";

type OpenAIImageContent = {
  type: "image_url";
  image_url: { url: string };
};

type OpenAITextContent = {
  type: "text";
  text: string;
};

export async function extractTextWithOcr(buffer: Buffer, mimeType?: string): Promise<string | null> {
  const env = getServerEnv();

  if (!env.OCR_ENABLED) {
    return null;
  }

  if (env.OCR_USE_DEEPSEEK) {
    const deepseekText = await extractWithDeepSeek(buffer, mimeType);
    if (deepseekText) {
      return deepseekText;
    }
  }

  return extractWithTesseract(buffer);
}

async function extractWithDeepSeek(buffer: Buffer, mimeType?: string): Promise<string | null> {
  const env = getServerEnv();

  if (!env.DEEPSEEK_OCR_API_KEY || !env.DEEPSEEK_OCR_API_URL) {
    return null;
  }

  const endpoint = new URL("/chat/completions", env.DEEPSEEK_OCR_API_URL).toString();
  const imageMime = mimeType && mimeType.startsWith("image/") ? mimeType : "image/png";
  const dataUrl = `data:${imageMime};base64,${buffer.toString("base64")}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.DEEPSEEK_OCR_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.DEEPSEEK_OCR_MODEL,
      max_tokens: env.DEEPSEEK_OCR_MAX_TOKENS,
      stream: false,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: dataUrl,
              },
            } as OpenAIImageContent,
            {
              type: "text",
              text: "<|grounding|>OCR this image.",
            } as OpenAITextContent,
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek OCR request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string | Array<{ type: string; text?: string }>;
      };
    }>;
  };

  const content = payload.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    const text = content
      .filter((part): part is OpenAITextContent => part.type === "text" && typeof part.text === "string")
      .map((part) => part.text)
      .join("\n")
      .trim();
    return text || null;
  }

  return null;
}

async function extractWithTesseract(buffer: Buffer): Promise<string | null> {
  const env = getServerEnv();

  if (!env.TESSERACT_PATH) {
    return null;
  }

  const process = spawn(env.TESSERACT_PATH, ["stdin", "stdout", "-l", env.TESSERACT_LANG], {
    stdio: ["pipe", "pipe", "pipe"],
  });

  process.stdin.write(buffer);
  process.stdin.end();

  const stdoutPromise = readStream(process.stdout);
  const stderrPromise = readStream(process.stderr);
  const [stdout, _stderr] = await Promise.all([stdoutPromise, stderrPromise]);
  const errorOutput = _stderr.toString("utf8").trim();
  if (errorOutput) {
    console.warn("Tesseract OCR:", errorOutput);
  }

  return stdout.toString("utf8").trim();
}

async function readStream(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

