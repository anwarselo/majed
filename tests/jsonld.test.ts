import { describe, expect, it } from "vitest";
import { jsonLdForBusiness } from "@/lib/jsonld";

const business = {
  id: "1",
  slug: "acme",
  name: "Acme",
  description: "desc",
  website: "https://acme.test",
  phone: null,
  address_json: null,
  verified: false,
  created_at: "",
  updated_at: "",
};

describe("jsonLdForBusiness", () => {
  it("returns schema object with canonical URL", () => {
    const jsonld = jsonLdForBusiness(business, "https://example.com");
    expect(jsonld.url).toBe("https://example.com/b/acme");
    expect(jsonld["@context"]).toBe("https://schema.org");
  });
});

