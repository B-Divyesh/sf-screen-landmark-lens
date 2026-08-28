import "./style.css";
import { acceptLicenseFromUrl, LICENSE_KEY, verifyLicense } from "../../shared/license";

type ReleaseAsset = { name: string; browser_download_url: string };
type Release = { tag_name: string; assets: ReleaseAsset[] };
const releaseApi = "https://api.github.com/repos/B-Divyesh/sf-screen-landmark-lens/releases/latest";

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
    const response = await fetch(releaseApi);
    if (!response.ok) throw new Error("No release");
    const release = await response.json() as Release;
    const suffixes: Record<string, string> = { windows: "_windows.msi", "macos-arm64": "_macos-arm64.dmg", "macos-x64": "_macos-x64.dmg", linux: "_linux.AppImage" };
    const download = release.assets.find((asset) => asset.name.endsWith(suffixes[key]));
    if (download) buttons.forEach((button) => { if (button) button.href = download.browser_download_url; });
    document.querySelector("#release-note")!.textContent = `Version ${release.tag_name.replace(/^v/, "")} · Free core tools · signed checksum`;
  } catch {
    document.querySelector("#release-note")!.textContent = "Latest release · macOS, Windows, Linux";
  }
}

if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("/sw.js").catch(() => undefined);
if (acceptLicenseFromUrl()) verifyLicense(true).then((state) => {
  const message = state?.valid ? "Purchase complete. Copy your license, then restore it in the desktop app." : "Your license was saved. Copy it into the desktop app to verify it.";
  const banner = document.createElement("div");
  banner.className = "license-banner";
  banner.role = "status";
  const copy = document.createElement("button");
  copy.type = "button";
  copy.textContent = "Copy license for desktop app";
  copy.addEventListener("click", async () => {
    const token = localStorage.getItem(LICENSE_KEY) || "";
    await navigator.clipboard.writeText(token);
    copy.textContent = "License copied";
  });
  banner.append(message, copy);
  document.body.prepend(banner);
});
void resolveDownloads();
