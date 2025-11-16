import { spawn } from "node:child_process";
import { getServerEnv } from "./env";

export async function extractTextWithOcr(buffer: Buffer): Promise<string | null> {
  const env = getServerEnv();

  if (!env.OCR_ENABLED) {
    return null;
  }

  if (env.OCR_USE_DEEPSEEK) {
    const deepseekText = await extractWithDeepSeek(buffer);
    if (deepseekText) {
      return deepseekText;
    }
  }

  return extractWithTesseract(buffer);
}

async function extractWithDeepSeek(buffer: Buffer): Promise<string | null> {
  const env = getServerEnv();

  if (!env.DEEPSEEK_OCR_API_KEY || !env.DEEPSEEK_OCR_API_URL) {
    return null;
  }

  const response = await fetch(env.DEEPSEEK_OCR_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.DEEPSEEK_OCR_API_KEY}`,
    },
    body: JSON.stringify({
      document_base64: buffer.toString("base64"),
      compression_ratio: env.DEEPSEEK_OCR_COMPRESSION_RATIO ?? 10,
      batch_size: env.DEEPSEEK_OCR_BATCH_SIZE ?? 8,
      device: env.DEEPSEEK_OCR_DEVICE ?? "cuda:0",
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek OCR request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as { text?: string };
  return payload.text?.trim() || null;
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

