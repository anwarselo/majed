import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const schemaPath = join(process.cwd(), "supabase", "schema.sql");
const schema = readFileSync(schemaPath, "utf8");

describe("Supabase schema", () => {
  it("includes all required tables", () => {
    expect(schema).toContain("create table if not exists businesses");
    expect(schema).toContain("create table if not exists assets");
    expect(schema).toContain("create table if not exists public_pages");
    expect(schema).toContain("create table if not exists index_events");
  });
});

