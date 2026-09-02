import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("desktop interface exposes its keyboard-first empty/error state", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await expect(page).toHaveTitle(/Screen Landmark Lens/);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("#window-select")).toContainText("Window access unavailable");
  await expect(page.locator("#result-empty")).toContainText("Install and open the desktop app");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
  expect(errors).toEqual([]);
});

test("@claim:free-voice-speed voice speed is available without a license", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#speech-rate")).toBeEnabled();
  await page.locator("#speech-rate").fill("1.4");
  await expect(page.locator("#speech-rate-output")).toHaveText("1.4×");
});

test("@claim:desktop-sample the bundled sample finds Save without native capture", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/?demo=1");
  await expect(page.locator("#demo-banner")).toBeVisible();
  await expect(page.locator("#landmark-list")).toContainText("Save");
  await page.locator("#find-input").fill("Save");
  await page.locator("#find-form").press("Enter");
  await expect(page.locator("#find-result")).toContainText("bottom right");
  await expect(page.locator("body")).not.toContainText("OCR quality estimate");
  expect(errors).toEqual([]);
});

test("@claim:blank-find an empty search gives a recovery instruction", async ({ page }) => {
  await page.goto("/?demo=1");
  await page.locator("#find-input").fill("");
  await page.locator("#find-form").press("Enter");
  await expect(page.locator("#find-result")).toHaveText("Enter a label to find, then choose Find.");
});

test("@claim:ocr-uncertainty OCR results never show a fabricated percentage", async ({ page }) => {
  await page.goto("/?demo=1");
  await expect(page.locator("#landmark-list")).toContainText("OCR text; review if it sounds unexpected");
  await expect(page.locator("#landmark-list")).not.toContainText("quality estimate");
});

test("@claim:demo-mode-isolation demo mode never labels or configures real mode", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("lens:speech-rate", "1.2"));
  await page.goto("/");
  await expect(page.locator("#demo-banner")).toHaveAttribute("hidden", "");
  await expect(page.locator("#demo-banner")).not.toBeVisible();
  await expect(page.locator("#speech-rate")).toHaveValue("1.2");

  await page.locator("#load-sample").click();
  await expect(page).toHaveURL(/\?demo=1/);
  await expect(page.locator("#demo-banner")).toBeVisible();
  await page.locator("#speech-rate").fill("1.4");
  expect(await page.evaluate(() => localStorage.getItem("demo:lens:speech-rate"))).toBe("1.4");

  await page.locator("#start-real").click();
  await expect(page).toHaveURL("/");
  await expect(page.locator("#demo-banner")).toHaveAttribute("hidden", "");
  await expect(page.locator("#demo-banner")).not.toBeVisible();
  await expect(page.locator("#speech-rate")).toHaveValue("1.2");
  expect(await page.evaluate(() => localStorage.getItem("demo:lens:speech-rate"))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem("lens:speech-rate"))).toBe("1.2");
});

test("@claim:desktop-shortcuts keyboard shortcuts run the three sample actions", async ({ page }) => {
  await page.goto("/?demo=1");
  await page.keyboard.press("Alt+Shift+F");
  await expect(page.locator("#find-input")).toBeFocused();
  await page.locator("#find-input").fill("Save");
  await page.keyboard.press("Enter");
  await expect(page.locator("#find-result")).toContainText("bottom right");
  await page.keyboard.press("Alt+Shift+B");
  await expect(page.locator("#find-result")).toContainText("likely buttons");
  await page.keyboard.press("Alt+Shift+L");
  await expect(page.locator("#announcer")).toContainText("visible labels");
});

test("light-theme skip link remains high contrast when keyboard focused", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
});

test("desktop legal and home links meet the 44px touch-target baseline", async ({ page }) => {
  await page.goto("/");
  for (const locator of [page.locator(".wordmark"), page.locator("footer a").first()]) {
    const box = await locator.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
});

test("@claim:screen-reader-announcements sends result text to the speech and live-region adapters", async ({ page }) => {
  await page.addInitScript(() => {
    const spoken: string[] = [];
    Object.defineProperty(window, "__spoken", { value: spoken });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: class { text: string; rate = 1; constructor(text: string) { this.text = text; } },
    });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: { cancel() {}, speak(utterance: { text: string }) { spoken.push(utterance.text); } },
    });
  });
  await page.goto("/?demo=1");
  await page.locator("#find-input").fill("Save");
  await page.locator("#find-form").press("Enter");
  await expect(page.locator("#announcer")).toContainText("Save");
  const spoken = await page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken);
  expect(spoken.some((message) => message.includes("Save") && message.includes("bottom right"))).toBe(true);
});

test("@claim:guidance-only finding a label changes guidance without invoking control actions", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/?demo=1");
  const initialUrl = page.url();
  await page.locator("#find-input").fill("Cancel");
  await page.locator("#find-form").press("Enter");
  await expect(page.locator("#find-result")).toContainText("bottom right");
  expect(page.url()).toBe(initialUrl);
  expect(requests.every((url) => new URL(url).origin === "http://127.0.0.1:5173")).toBe(true);
});

test("@claim:no-account-required completes every sample tool with empty account state", async ({ page }) => {
  await page.goto("/?demo=1");
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => /account|license|auth/i.test(key)))).toEqual([]);
  await page.keyboard.press("Alt+Shift+L");
  await expect(page.locator("#announcer")).toContainText("visible labels");
  await page.keyboard.press("Alt+Shift+B");
  await expect(page.locator("#find-result")).toContainText("likely buttons");
  await page.locator("#find-input").fill("Print");
  await page.locator("#find-form").press("Enter");
  await expect(page.locator("#find-result")).toContainText("bottom center");
  await page.locator("#speech-rate").fill("1.3");
  await expect(page.locator("#speech-rate-output")).toHaveText("1.3×");
  await expect(page.locator("body")).not.toContainText(/sign in|buy|checkout/i);
});

test("@claim:sample-keyboard-five-labels five scripted label-finding tasks complete by keyboard with spoken directions", async ({ page }) => {
  await page.goto("/?demo=1");
  const tasks = [
    ["Quarterly report", "top left"],
    ["Status", "middle center"],
    ["Print", "bottom center"],
    ["Save", "bottom right"],
    ["Cancel", "bottom right"],
  ];
  for (const [query, direction] of tasks) {
    await page.keyboard.press("Alt+Shift+F");
    await page.keyboard.press("Control+A");
    await page.keyboard.type(query);
    await page.keyboard.press("Enter");
    await expect(page.locator("#find-result")).toContainText(direction);
  }
  await page.screenshot({ path: ".factory/evidence/polish-1-five-task-trial.png", fullPage: true });
});

test("desktop app content uses 16px text and 44px interaction targets", async ({ page }) => {
  await page.goto("/?demo=1");
  await page.keyboard.press("Tab");
  const smallText = await page.locator("body *:visible").evaluateAll((elements) => elements
    .filter((element) => element.childElementCount === 0 && (element.textContent || "").trim())
    .map((element) => ({ text: (element.textContent || "").trim(), size: Number.parseFloat(getComputedStyle(element).fontSize) }))
    .filter((item) => item.size < 16));
  expect(smallText).toEqual([]);
  for (const element of await page.locator("a:visible, button:visible, select:visible, input:visible").all()) {
    const box = await element.boundingBox();
    expect(box?.height || 0).toBeGreaterThanOrEqual(44);
  }
});
