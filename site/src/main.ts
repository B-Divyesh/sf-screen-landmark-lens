import "./style.css";

const redirectingToDemo = location.pathname === "/" && new URLSearchParams(location.search).get("demo") === "1";
if (redirectingToDemo) {
  sessionStorage.setItem("lens:focus-route-heading", "1");
  location.replace("/demo/?demo=1");
}

type ReleaseAsset = { name: string; browser_download_url: string };
type Release = { tag_name: string; assets: ReleaseAsset[] };
const releaseApi = "https://api.github.com/repos/B-Divyesh/sf-screen-landmark-lens/releases/latest";
const releaseCacheKey = "lens:release-metadata:v1";
const releaseCacheLifetimeMs = 60 * 60 * 1000;

type CachedRelease = { expiresAt: number; release: Release };

function publishedRelease(): Release | null {
  const source = document.querySelector<HTMLScriptElement>("#release-bootstrap")?.textContent;
  if (!source) return null;
  try {
    const release = JSON.parse(source) as Release;
    return release.tag_name && Array.isArray(release.assets) ? release : null;
  } catch {
    return null;
  }
}

function cacheRelease(release: Release) {
  try {
    localStorage.setItem(releaseCacheKey, JSON.stringify({ expiresAt: Date.now() + releaseCacheLifetimeMs, release } satisfies CachedRelease));
  } catch {
    // A privacy-restricted browser can still use the resolved download link.
  }
}

function platformKey(): { key: string; label: string } {
  const platform = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform || navigator.platform || navigator.userAgent;
  if (/win/i.test(platform)) return { key: "windows", label: "Download for Windows" };
  if (/mac/i.test(platform)) {
    const arm = /arm|aarch64/i.test(navigator.userAgent);
    return { key: arm ? "macos-arm64" : "macos-x64", label: "Download for macOS" };
  }
  if (/linux/i.test(platform)) return { key: "linux", label: "Download for Linux" };
  return { key: "linux", label: "View all downloads" };
}

async function resolveDownloads() {
  const { key, label } = platformKey();
  const buttons = [document.querySelector<HTMLAnchorElement>("#platform-download"), document.querySelector<HTMLAnchorElement>("#platform-download-2")];
  buttons.forEach((button) => { if (button) button.textContent = label; });
  const releaseNote = document.querySelector<HTMLElement>("#release-note")!;
  const suffixes: Record<string, string> = { windows: "_windows.msi", "macos-arm64": "_macos-arm64.dmg", "macos-x64": "_macos-x64.dmg", linux: "_linux.AppImage" };
  const applyRelease = (release: Release) => {
    const download = release.assets.find((asset) => asset.name.endsWith(suffixes[key]));
    if (!download) throw new Error("Platform asset is not published");
    buttons.forEach((button) => { if (button) button.href = download.browser_download_url; });
    releaseNote.textContent = `Version ${release.tag_name.replace(/^v/, "")} · Free core tools · SHA-256 checked`;
  };

  let cached: CachedRelease | null = null;
  try {
    cached = JSON.parse(localStorage.getItem(releaseCacheKey) || "null") as CachedRelease | null;
    if (cached && cached.expiresAt > Date.now() && cached.release?.tag_name && Array.isArray(cached.release.assets)) {
      applyRelease(cached.release);
      return;
    }
  } catch {
    // Storage may be unavailable; the release API still has a safe fallback.
  }

  const published = publishedRelease();
  // A first visit gets the release that was published with this site. This
  // avoids turning a GitHub rate-limit response into a browser console error.
  // Once its hour-long cache expires, the API below refreshes the metadata.
  if (!cached && published) {
    applyRelease(published);
    cacheRelease(published);
    return;
  }

  try {
    const response = await fetch(releaseApi);
    if (!response.ok) throw new Error("No release");
    const release = await response.json() as Release;
    applyRelease(release);
    cacheRelease(release);
  } catch {
    if (published) {
      applyRelease(published);
      cacheRelease(published);
      return;
    }
    releaseNote.textContent = "Downloads are being published. Open the release page.";
  }
}

if ("serviceWorker" in navigator && (location.protocol === "https:" || /^(localhost|127\.0\.0\.1)$/.test(location.hostname))) navigator.serviceWorker.register("/sw.js").catch(() => undefined);

const sampleLandmarks: Record<string, string> = {
  print: "Found OCR text “Print”, bottom center. Review the label if it sounds unexpected.",
  save: "Found OCR text “Save”, bottom right. Review the label if it sounds unexpected.",
  cancel: "Found OCR text “Cancel”, bottom right. Review the label if it sounds unexpected.",
  "status: ready to submit": "Found OCR text “Status: Ready to submit”, middle center. Review the label if it sounds unexpected.",
};

function setupDemo() {
  const form = document.querySelector<HTMLFormElement>("#demo-find-form");
  const input = document.querySelector<HTMLInputElement>("#demo-find-input");
  const result = document.querySelector<HTMLElement>("#demo-find-result");
  if (!form || !input || !result) return;
  const find = () => {
    const query = input.value.trim().toLocaleLowerCase();
    if (!query) {
      result.textContent = "Enter a label to find, then choose Find sample label.";
      input.focus();
      return;
    }
    const match = Object.entries(sampleLandmarks).find(([label]) => label.includes(query));
    result.textContent = match ? match[1] : `“${input.value.trim()}” was not found in the sample. Try Save, Print, Cancel, or Status.`;
  };
  form.addEventListener("submit", (event) => { event.preventDefault(); find(); });
  document.querySelectorAll<HTMLButtonElement>("[data-sample-label]").forEach((button) => button.addEventListener("click", () => {
    input.value = button.dataset.sampleLabel || "";
    find();
  }));
  document.querySelector<HTMLButtonElement>("#reset-demo")?.addEventListener("click", () => {
    input.value = "Save";
    result.textContent = sampleLandmarks.save;
  });
}

if (document.body.hasAttribute("data-demo-page")) setupDemo();
else if (!redirectingToDemo) void resolveDownloads();
