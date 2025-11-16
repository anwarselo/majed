import { describe, expect, it } from "vitest";
import { renderBusinessHtml } from "@/lib/render";

const mockBusiness = {
  id: "1",
  slug: "demo",
  name: "Demo & Co",
  description: "Desc",
  website: null,
  phone: null,
  address_json: null,
  verified: false,
  created_at: "",
  updated_at: "",
} as const;

describe("renderBusinessHtml", () => {
  it("escapes HTML and includes headings", () => {
    const html = renderBusinessHtml({ business: mockBusiness, aboutText: "<script>x</script>" });
    expect(html).toContain("&lt;script&gt;x&lt;/script&gt;");
    expect(html).toContain("<h1>Demo &amp; Co</h1>");
  });
});

