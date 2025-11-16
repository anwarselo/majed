import { getServerEnv } from "./env";

export async function pingIndexNow(url: string): Promise<{ status: number; body: string } | null> {
  const env = getServerEnv();
  if (!env.INDEXNOW_KEY) {
    return null;
  }

  const base = new URL(env.BASE_URL);
  const payload = {
    host: base.host,
    key: env.INDEXNOW_KEY,
    keyLocation: env.INDEXNOW_KEY_PATH
      ? new URL(env.INDEXNOW_KEY_PATH.replace("./public", ""), env.BASE_URL).toString()
      : `${env.BASE_URL}/.well-known/ai/keys/indexnow`,
    urlList: [url],
  };

  const response = await fetch("https://www.bing.com/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  return { status: response.status, body: await response.text() };
}

