import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const [rawBase = "https://screen-landmark-lens.sociobot.in", evidenceDir = ".factory/evidence/live"] = process.argv.slice(2);
const base = rawBase.replace(/\/$/, "");
const version = JSON.parse(readFileSync("package.json", "utf8")).version;
const expectedReleaseCommit = process.env.EXPECTED_RELEASE_COMMIT || "";
mkdirSync(evidenceDir, { recursive: true });

function check(value, message) {
  if (!value) throw new Error(message);
}

const browser = await chromium.launch();
const report = { base, checkedAt: new Date().toISOString(), routes: {}, mobile: {}, demo: {}, links: {} };

try {
  for (const route of ["/", "/demo/", "/privacy/", "/terms/"]) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(String(error)));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    const response = await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    const facts = await page.evaluate(() => ({
      title: document.title,
      lang: document.documentElement.lang,
      h1: document.querySelectorAll("h1").length,
      main: document.querySelectorAll("main").length,
      description: document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "",
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute("content") || "",
      twitterCard: document.querySelector('meta[name="twitter:card"]')?.getAttribute("content") || "",
      releaseCommit: document.querySelector('meta[name="release-commit"]')?.getAttribute("content") || "",
      missingAlt: [...document.querySelectorAll("img")].filter((image) => !image.hasAttribute("alt")).length,
    }));
    check(response?.status() === 200, `${route} did not return 200`);
    check(facts.lang === "en" && facts.h1 === 1 && facts.main === 1, `${route} has incomplete semantics`);
    check(facts.title && facts.description && facts.canonical && facts.ogImage && facts.twitterCard, `${route} has incomplete metadata`);
    check(facts.missingAlt === 0 && errors.length === 0, `${route} has missing alt text or console errors`);
    report.routes[route] = { status: response.status(), ...facts, errors };
    await context.close();
  }

  const identityResponse = await fetch(`${base}/release.json`, { cache: "no-store" });
  check(identityResponse.ok, "/release.json did not return 200");
  const releaseIdentity = await identityResponse.json();
  check(releaseIdentity.version === version && releaseIdentity.tag === `v${version}`, "Live version and tag do not match package.json");
  check(/^[a-f0-9]{40}$/.test(releaseIdentity.commit), "Live release commit is invalid");
  check(report.routes["/"].releaseCommit === releaseIdentity.commit, "Landing metadata and /release.json disagree");
  if (expectedReleaseCommit) check(releaseIdentity.commit === expectedReleaseCommit, "Live release commit does not match the candidate");
  report.releaseIdentity = releaseIdentity;

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mobile = await mobileContext.newPage();
  await mobile.goto(`${base}/`, { waitUntil: "networkidle" });
  const required = [
    mobile.getByRole("link", { name: "Try it with sample data" }).first(),
    mobile.getByText("Captures stay on this device"),
    mobile.getByText("Works offline after install"),
    mobile.getByText("All tools in this build are free"),
  ];
  const bottoms = [];
  for (const locator of required) {
    const box = await locator.boundingBox();
    check(box && box.y + box.height <= 844, "A required first-screen item falls below 844px");
    bottoms.push(box.y + box.height);
  }
  await mobile.keyboard.press("Tab");
  const geometry = await mobile.locator("body *:visible").evaluateAll((elements) => ({
    smallText: elements.filter((element) => element.childElementCount === 0 && (element.textContent || "").trim() && Number.parseFloat(getComputedStyle(element).fontSize) < 16).map((element) => (element.textContent || "").trim()),
    smallTargets: elements.filter((element) => element.matches("a,button,summary") && element.getBoundingClientRect().height < 44).map((element) => (element.textContent || "").trim()),
  }));
  check(geometry.smallText.length === 0 && geometry.smallTargets.length === 0, "Mobile text or targets miss the product baseline");
  await mobile.screenshot({ path: `${evidenceDir}/screenshot-mobile.png`, fullPage: true });
  report.mobile = { viewport: "390x844", requiredBottoms: bottoms, ...geometry };
  await mobileContext.close();

  const demoContext = await browser.newContext();
  const requests = [];
  const demo = await demoContext.newPage();
  demo.on("request", (request) => requests.push(request.url()));
  await demo.goto(`${base}/?demo=1`, { waitUntil: "networkidle" });
  check(new URL(demo.url()).pathname === "/demo/", "?demo=1 did not enter the demo directly");
  check(await demo.getByText("Demo — sample data, nothing is saved.").isVisible(), "Demo banner is not visible");
  await demo.locator("#demo-find-input").fill("Cancel");
  await demo.locator("#demo-find-form").press("Enter");
  check((await demo.locator("#demo-find-result").textContent())?.includes("bottom right"), "Demo did not find Cancel");
  await demo.getByRole("button", { name: "Reset demo" }).click();
  check(await demo.locator("#demo-find-input").inputValue() === "Save", "Reset demo did not restore Save");
  const stored = await demo.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage).filter((key) => key !== "lens:focus-route-heading"), cookies: document.cookie }));
  check(stored.local.length === 0 && stored.session.length === 0 && stored.cookies === "", "Demo persisted user data");
  check(requests.every((url) => new URL(url).origin === new URL(base).origin), "Demo contacted a third party");
  await demo.getByRole("link", { name: "Start for real" }).click();
  await demo.waitForLoadState("networkidle");
  check(new URL(demo.url()).pathname === "/", "Start for real did not leave demo");
  check(await demo.locator("h1").evaluate((element) => element === document.activeElement), "Route did not focus the home heading");
  report.demo = { directEntry: true, banner: true, reset: true, exit: true, storage: stored, onlySameOriginRequests: true, headingFocused: true };
  await demoContext.close();

  const offlineContext = await browser.newContext();
  const offline = await offlineContext.newPage();
  await offline.goto(`${base}/demo/`, { waitUntil: "networkidle" });
  await offline.evaluate(() => navigator.serviceWorker.ready);
  await offline.reload({ waitUntil: "networkidle" });
  await offlineContext.setOffline(true);
  await offline.reload({ waitUntil: "domcontentloaded" });
  check((await offline.locator("h1").textContent())?.includes("Find a visible control"), "Offline demo reload failed");
  writeFileSync(`${evidenceDir}/offline-demo.json`, JSON.stringify({ checkedAt: report.checkedAt, reloadPassed: true }, null, 2));
  await offlineContext.close();

  const missingContext = await browser.newContext();
  const missing = await missingContext.newPage();
  const missingResponse = await missing.goto(`${base}/polish-retry-cold-404`, { waitUntil: "networkidle" });
  check(missingResponse?.status() === 404, "Unknown route did not return 404");
  check(await missing.title() === "Page not found — Screen Landmark Lens", "404 title is incorrect");
  check(await missing.locator("header nav a").count() === 4 && (await missing.locator("footer").textContent())?.includes("Built by Param Factory"), "404 shared chrome is incomplete");
  report.routes["/polish-retry-cold-404"] = { status: 404, title: await missing.title(), sharedChrome: true };
  await missingContext.close();

  const axe = [];
  for (const colorScheme of ["dark", "light"]) {
    for (const route of ["/", "/demo/", "/privacy/", "/terms/", "/polish-retry-cold-404"]) {
      const context = await browser.newContext({ colorScheme });
      const page = await context.newPage();
      await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      const violations = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""));
      check(violations.length === 0, `${route} has serious/critical axe violations in ${colorScheme} mode`);
      axe.push({ route, colorScheme, violations: [] });
      await context.close();
    }
  }
  writeFileSync(`${evidenceDir}/axe-routes.json`, JSON.stringify({ checkedAt: report.checkedAt, results: axe }, null, 2));

  const linkContext = await browser.newContext();
  const linkPage = await linkContext.newPage();
  await linkPage.goto(`${base}/`, { waitUntil: "networkidle" });
  const internal = await linkPage.locator('a[href^="/"]').evaluateAll((links) => [...new Set(links.map((link) => new URL(link.getAttribute("href"), location.origin).href))]);
  for (const url of internal) {
    const response = await linkContext.request.get(url);
    check(response.status() < 400, `Internal link failed: ${url} (${response.status()})`);
    report.links[url] = response.status();
  }
  await linkPage.setViewportSize({ width: 1440, height: 900 });
  await linkPage.screenshot({ path: `${evidenceDir}/screenshot-desktop.png`, fullPage: true });
  await linkContext.close();

  writeFileSync(`${evidenceDir}/final-cold-recheck.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
