import { test, expect } from "@playwright/test";

test("home page renders upload form", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /publish your business/i })).toBeVisible();
  await expect(page.getByPlaceholder("Acme Repairs")).toBeVisible();
});

