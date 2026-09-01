import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("landing page has a clear, working download path", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await expect(page).toHaveTitle(/Screen Landmark Lens/);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("#platform-download")).toBeVisible();
  await expect(page.locator("#platform-download")).toHaveAttribute("href", /github\.com\/B-Divyesh/);
  await expect(page.locator("#release-note")).toContainText("Version 0.1.4");
  await expect(page.locator("img[alt]")).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("@claim:release-metadata-cache release metadata is cached locally for one hour", async ({ browser }) => {
  let requests = 0;
  const context = await browser.newContext();
  await context.addInitScript(() => {
    if (sessionStorage.getItem("release-cache-seeded")) return;
    localStorage.setItem("lens:release-metadata:v1", JSON.stringify({
      expiresAt: 0,
      release: { tag_name: "v0.0.0", assets: [] },
    }));
    sessionStorage.setItem("release-cache-seeded", "true");
  });
  await context.route("https://api.github.com/repos/**/releases/latest", (route) => {
    requests += 1;
    return route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ tag_name: "v0.1.1", assets: [
        { name: "Screen-Landmark-Lens_0.1.1_windows.msi", browser_download_url: "https://github.com/B-Divyesh/sf-screen-landmark-lens/releases/download/v0.1.1/app.msi" },
        { name: "Screen-Landmark-Lens_0.1.1_linux.AppImage", browser_download_url: "https://github.com/B-Divyesh/sf-screen-landmark-lens/releases/download/v0.1.1/app.AppImage" },
        { name: "Screen-Landmark-Lens_0.1.1_macos-arm64.dmg", browser_download_url: "https://github.com/B-Divyesh/sf-screen-landmark-lens/releases/download/v0.1.1/arm.dmg" },
        { name: "Screen-Landmark-Lens_0.1.1_macos-x64.dmg", browser_download_url: "https://github.com/B-Divyesh/sf-screen-landmark-lens/releases/download/v0.1.1/x64.dmg" },
      ] }),
    });
  });
  const page = await context.newPage();
  try {
    await page.goto("http://127.0.0.1:4173/");
    await expect(page.locator("#release-note")).toContainText("Version 0.1.1");
    await page.reload();
    await expect(page.locator("#release-note")).toContainText("Version 0.1.1");
    expect(requests).toBe(1);
    const cached = await page.evaluate(() => JSON.parse(localStorage.getItem("lens:release-metadata:v1") || "null"));
    expect(cached.expiresAt - Date.now()).toBeGreaterThan(59 * 60 * 1000);
  } finally {
    await context.close();
  }
});

test("@claim:release-metadata-fallback unavailable metadata leaves a calm release-page link", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.route("http://127.0.0.1:4173/", async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace(/<script type="application\/json" id="release-bootstrap">[\s\S]*?<\/script>\s*/, "");
    await route.fulfill({ response, body });
  });
  await page.route("https://api.github.com/repos/**/releases/latest", (route) => route.fulfill({ contentType: "application/json", body: "{}" }));
  await page.goto("/");
  await expect(page.locator("#release-note")).toHaveText("Downloads are being published. Open the release page.");
  await expect(page.locator("#platform-download")).toHaveAttribute("href", /releases\/latest$/);
  expect(errors).toEqual([]);
});

test("a fresh visit avoids GitHub HTTP 403 console errors with the published release metadata", async ({ page }) => {
  const errors: string[] = [];
  let githubRequests = 0;
  await page.addInitScript(() => localStorage.removeItem("lens:release-metadata:v1"));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.route("https://api.github.com/repos/**/releases/latest", (route) => {
    githubRequests += 1;
    return route.fulfill({ status: 403, contentType: "application/json", body: '{"message":"rate limit"}' });
  });
  await page.goto("/");
  await expect(page.locator("#release-note")).toContainText("Version 0.1.4");
  expect(githubRequests).toBe(0);
  expect(errors).toEqual([]);
});

test("website privacy link meets the 44px touch-target baseline", async ({ page }) => {
  await page.route("https://api.github.com/repos/**/releases/latest", (route) => route.fulfill({ contentType: "application/json", body: "{}" }));
  await page.goto("/");
  const box = await page.getByRole("link", { name: /Read the plain-language privacy policy/ }).boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
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

for (const path of ["/", "/demo/", "/privacy/", "/terms/"]) {
  test(`${path} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
  });
}

for (const path of ["/", "/demo/", "/privacy/", "/terms/"]) {
  test(`${path} has no serious light-theme accessibility violations`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
  });
}
