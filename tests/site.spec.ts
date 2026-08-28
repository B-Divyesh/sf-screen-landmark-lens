import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("landing page has a clear, working download path", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.route("https://api.github.com/repos/**/releases/latest", (route) => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({ tag_name: "v0.1.0", assets: [{ name: "Screen-Landmark-Lens_0.1.0_linux.AppImage", browser_download_url: "https://github.com/B-Divyesh/sf-screen-landmark-lens/releases/download/v0.1.0/app.AppImage" }] })
  }));
  await page.goto("/");
  await expect(page).toHaveTitle(/Screen Landmark Lens/);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("#platform-download")).toBeVisible();
  await expect(page.locator("#platform-download")).toHaveAttribute("href", /github\.com\/B-Divyesh/);
  await expect(page.locator("img[alt]")).toHaveCount(1);
  expect(errors).toEqual([]);
});

for (const path of ["/", "/privacy/", "/terms/"]) {
  test(`${path} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
  });
}
