import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("desktop interface exposes its keyboard-first empty/error state", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await expect(page).toHaveTitle("Screen Landmark Lens");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("#window-select")).toContainText("Window access unavailable");
  await expect(page.locator("#result-empty")).toContainText("Install and open the desktop app");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
  expect(errors).toEqual([]);
});
