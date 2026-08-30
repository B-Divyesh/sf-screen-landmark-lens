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
