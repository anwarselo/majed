import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";
import { getServerEnv } from "./env";

let cachedClient: SupabaseClient<Database> | null = null;

export function getServiceSupabase(): SupabaseClient<Database> {
  if (cachedClient) {
    return cachedClient;
  }

  const env = getServerEnv();

  cachedClient = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cachedClient;
}

