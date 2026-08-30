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

test("@claim:demo-sample sample demo finds an included control", async ({ page }) => {
  await page.goto("/demo/");
  await expect(page).toHaveTitle("Demo — Screen Landmark Lens");
  await expect(page.getByText("Demo — sample data, nothing is saved.")).toBeVisible();
  await page.locator("#demo-find-input").fill("Save");
  await page.locator("#demo-find-form").press("Enter");
  await expect(page.locator("#demo-find-result")).toContainText("Found OCR text “Save”, bottom right");
  await expect(page.locator(".walkthrough-frames img")).toHaveCount(3);
});

test("@claim:demo-privacy demo makes no third-party requests", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/demo/");
  await page.locator("#demo-find-form").press("Enter");
  expect(requests.every((url) => new URL(url).origin === "http://127.0.0.1:4173")).toBe(true);
});

test("@claim:offline-demo demo reloads offline after its first visit", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("/demo/");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator("#demo-title")).toContainText("Find a visible control");
  await context.close();
});

test("@claim:site-updates navigations use a versioned, network-first worker", async ({ page }) => {
  await page.goto("/");
  const worker = await page.request.get("/sw.js");
  const source = await worker.text();
  expect(source).toContain('const CACHE = "landmark-lens-v2"');
  expect(source).toContain('if (event.request.mode === "navigate")');
  expect(source.indexOf("fetch(event.request)")).toBeLessThan(source.indexOf("caches.match(event.request).then((cached) => cached || fetch"));
});

for (const path of ["/", "/privacy/", "/terms/"]) {
  test(`${path} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
  });
}
