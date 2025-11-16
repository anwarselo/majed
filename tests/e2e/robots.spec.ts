import { test, expect } from "@playwright/test";

test("robots.txt exposes crawler directives", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.ok()).toBeTruthy();
  const body = await response.text();
  expect(body).toContain("OAI-SearchBot");
  expect(body).toContain("Sitemap:");
});

