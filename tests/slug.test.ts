import { describe, expect, it } from "vitest";
import { generateSlug } from "@/lib/slug";

describe("generateSlug", () => {
  it("creates lowercase slugs with suffix", () => {
    const slug = generateSlug("Acme Repairs", () => 0.5);
    expect(slug).toMatch(/^acme-repairs-[a-z0-9]{4}$/);
  });

  it("falls back to business prefix when name empty", () => {
    const slug = generateSlug("", () => 0.1);
    expect(slug.startsWith("business-")).toBe(true);
  });
});

