import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { execFileSync } from "node:child_process";

const releaseCommit = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();

test("landing page has a clear, working download path", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await expect(page).toHaveTitle(/Screen Landmark Lens/);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("#platform-download")).toBeVisible();
  await expect(page.locator("#platform-download")).toHaveAttribute("href", /releases\/download\/v0\.1\.8\//);
  await expect(page.locator("#release-note")).toContainText("Version 0.1.8");
  await expect(page.locator('meta[name="release-commit"]')).toHaveAttribute("content", releaseCommit);
  await expect(page.locator("#release-source")).toContainText(releaseCommit);
  expect(await page.request.get("/release.json").then((response) => response.json())).toEqual({ version: "0.1.8", tag: "v0.1.8", commit: releaseCommit });
  await expect(page.locator("img[alt]")).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("@claim:release-metadata-cache release metadata is cached locally for one hour", async ({ browser }) => {
  let requests = 0;
  const context = await browser.newContext();
  await context.addInitScript(() => {
    if (sessionStorage.getItem("release-cache-seeded")) return;
    localStorage.setItem("lens:release-metadata:v2", JSON.stringify({
      expiresAt: 0,
      release: { tag_name: "v0.0.0", target_commitish: "old", immutable: false, assets: [] },
    }));
    sessionStorage.setItem("release-cache-seeded", "true");
  });
  await context.route("https://api.github.com/repos/**/releases/latest", (route) => {
    requests += 1;
    return route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ tag_name: "v0.1.8", target_commitish: releaseCommit, immutable: true, assets: [
        { name: "Screen-Landmark-Lens_0.1.8_windows.msi", browser_download_url: "https://github.com/B-Divyesh/sf-screen-landmark-lens/releases/download/v0.1.8/app.msi" },
        { name: "Screen-Landmark-Lens_0.1.8_linux.AppImage", browser_download_url: "https://github.com/B-Divyesh/sf-screen-landmark-lens/releases/download/v0.1.8/app.AppImage" },
        { name: "Screen-Landmark-Lens_0.1.8_macos-arm64.dmg", browser_download_url: "https://github.com/B-Divyesh/sf-screen-landmark-lens/releases/download/v0.1.8/arm.dmg" },
        { name: "Screen-Landmark-Lens_0.1.8_macos-x64.dmg", browser_download_url: "https://github.com/B-Divyesh/sf-screen-landmark-lens/releases/download/v0.1.8/x64.dmg" },
      ] }),
    });
  });
  const page = await context.newPage();
  try {
    await page.goto("http://127.0.0.1:4173/");
    await expect(page.locator("#release-note")).toContainText("Version 0.1.8");
    await page.reload();
    await expect(page.locator("#release-note")).toContainText("Version 0.1.8");
    expect(requests).toBe(1);
    const cached = await page.evaluate(() => JSON.parse(localStorage.getItem("lens:release-metadata:v2") || "null"));
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
  await page.addInitScript(() => localStorage.removeItem("lens:release-metadata:v2"));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.route("https://api.github.com/repos/**/releases/latest", (route) => {
    githubRequests += 1;
    return route.fulfill({ status: 403, contentType: "application/json", body: '{"message":"rate limit"}' });
  });
  await page.goto("/");
  await expect(page.locator("#release-note")).toContainText("Version 0.1.8");
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

test("@claim:website-privacy site sets no cookies and loads no third-party scripts", async ({ page }) => {
  await page.goto("/");
  expect(await page.evaluate(() => document.cookie)).toBe("");
  const scripts = await page.locator("script[src]").evaluateAll((elements) => elements.map((element) => new URL((element as HTMLScriptElement).src).origin));
  expect(scripts.every((origin) => origin === "http://127.0.0.1:4173")).toBe(true);
  await expect(page.locator('script[src*="analytics"], script[src*="tracker"]')).toHaveCount(0);
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
  expect(source).toContain('const CACHE = "landmark-lens-v4"');
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

test("@claim:website-demo-storage demo does not persist searches or sample changes", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("/?demo=1");
  await expect(page).toHaveURL(/\/demo\/\?demo=1$/);
  await page.locator("#demo-find-input").fill("Cancel");
  await page.locator("#demo-find-form").press("Enter");
  await page.reload();
  await expect(page.locator("#demo-find-input")).toHaveValue("Save");
  const stored = await page.evaluate(() => ({
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage).filter((key) => key !== "lens:focus-route-heading"),
    cookies: document.cookie,
  }));
  expect(stored).toEqual({ local: [], session: [], cookies: "" });
  await context.close();
});

test("@claim:unknown-route-404 unknown documents return the complete designed 404", async ({ page }) => {
  const response = await page.goto("/missing-review-route");
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle("Page not found — Screen Landmark Lens");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /not found/i);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /social-card\.webp$/);
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute("href", "/apple-touch-icon.png");
  await expect(page.locator("header nav a")).toHaveCount(4);
  await expect(page.locator("footer")).toContainText("Built by Param Factory");
});

test("all public routes keep the same product chrome", async ({ page }) => {
  const expectedNav = ["Demo", "How it works", "Privacy", "Download"];
  for (const route of ["/", "/demo/", "/privacy/", "/terms/", "/missing-chrome-check"]) {
    await page.goto(route);
    await expect(page.locator("header")).toContainText("Landmark Lens");
    expect(await page.locator("header nav a").allTextContents()).toEqual(expectedNav);
    await expect(page.locator("footer")).toContainText("Landmark Lens");
    await expect(page.locator("footer")).toContainText("Version 0.1.8 · Build polish-2 · Built by Param Factory");
  }
});

test("privacy and terminology copy only make tested promises", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#privacy")).toContainText("Lens returns labels and directions, not capture pixels.");
  await expect(page.locator("#privacy")).toContainText("You choose a window before capture.");
  await expect(page.locator("#privacy")).not.toContainText(/memory|telemetry|cloud vision|hidden full-screen/i);
  await page.goto("/demo/");
  await expect(page.getByRole("heading", { name: "Find a visible label" })).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/Find a target|wayfinding/i);
});

test("route navigation and Back move focus to the destination heading", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Try it with sample data" }).first().click();
  await expect(page).toHaveURL(/\/demo\/\?demo=1$/);
  await expect(page.locator("h1")).toBeFocused();
  await page.getByRole("link", { name: "Start for real" }).click();
  await expect(page).toHaveURL("http://127.0.0.1:4173/");
  await expect(page.locator("h1")).toBeFocused();
  await page.goBack();
  await expect(page.locator("h1")).toBeFocused();
});

test("390px first screen includes the complete action and three facts", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile geometry check");
  await page.goto("/");
  const required = [
    page.getByRole("link", { name: "Try it with sample data" }).first(),
    page.getByText("Captures stay on this device"),
    page.getByText("Works offline after install"),
    page.getByText("All tools in this build are free"),
  ];
  for (const locator of required) {
    const box = await locator.boundingBox();
    expect(box).not.toBeNull();
    expect((box?.y || 0) + (box?.height || 0)).toBeLessThanOrEqual(844);
  }
  await page.screenshot({ path: ".factory/evidence/polish-1-mobile-first-screen.png", fullPage: false });
});

test("visible content text is at least 16px and every interactive target is at least 44px", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const smallText = await page.locator("body *:visible").evaluateAll((elements) => elements
    .filter((element) => element.childElementCount === 0 && (element.textContent || "").trim())
    .map((element) => ({ text: (element.textContent || "").trim(), size: Number.parseFloat(getComputedStyle(element).fontSize) }))
    .filter((item) => item.size < 16));
  expect(smallText).toEqual([]);
  for (const element of await page.locator("a:visible, button:visible, summary:visible").all()) {
    const box = await element.boundingBox();
    expect(Math.max(box?.width || 0, box?.height || 0)).toBeGreaterThanOrEqual(44);
    expect(box?.height || 0).toBeGreaterThanOrEqual(44);
  }
});

for (const path of ["/", "/demo/", "/privacy/", "/terms/"]) {
  test(`${path} has no serious light-theme accessibility violations`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
  });
}
