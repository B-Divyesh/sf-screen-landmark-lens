import "./style.css";
import { acceptLicenseFromUrl, verifyLicense } from "../../shared/license";

type Download = { url: string; sha256: string };
type Manifest = { version: string; platforms: Record<string, Download> };
const manifestUrl = "https://github.com/B-Divyesh/sf-screen-landmark-lens/releases/latest/download/latest.json";

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
  try {
    const response = await fetch(manifestUrl);
    if (!response.ok) throw new Error("No release manifest");
    const manifest = await response.json() as Manifest;
    const download = manifest.platforms[key];
    if (download?.url) buttons.forEach((button) => { if (button) button.href = download.url; });
    document.querySelector("#release-note")!.textContent = `Version ${manifest.version} · Free core tools · signed checksum`;
  } catch {
    document.querySelector("#release-note")!.textContent = "Latest release · macOS, Windows, Linux";
  }
}

if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("/sw.js").catch(() => undefined);
if (acceptLicenseFromUrl()) verifyLicense(true).then((state) => {
  const message = state?.valid ? "Purchase complete. Paste your license into the desktop app to restore Lens Plus." : "Your license was saved. Open the desktop app to verify it.";
  const banner = document.createElement("p");
  banner.className = "license-banner";
  banner.role = "status";
  banner.textContent = message;
  document.body.prepend(banner);
});
void resolveDownloads();
