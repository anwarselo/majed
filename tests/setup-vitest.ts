import "@testing-library/jest-dom/vitest";

process.env.BASE_URL = process.env.BASE_URL || "https://example.com";
process.env.SUPABASE_URL = process.env.SUPABASE_URL || "https://example.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "service-role-key";
process.env.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "anon-key";
process.env.SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || "business-assets";

