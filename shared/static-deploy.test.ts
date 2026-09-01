import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type StaticWebAppsConfig = {
  navigationFallback?: { rewrite?: string; exclude?: string[] };
  responseOverrides?: Record<string, { rewrite?: string; statusCode?: number }>;
  routes?: Array<{ route?: string; headers?: Record<string, string> }>;
  mimeTypes?: Record<string, string>;
};

const config = JSON.parse(
  readFileSync(new URL("../site/public/staticwebapp.config.json", import.meta.url), "utf8"),
) as StaticWebAppsConfig;
const releaseWorkflow = readFileSync(new URL("../.github/workflows/release.yml", import.meta.url), "utf8");
const releaseManifest = readFileSync(new URL("../scripts/make-release-manifest.mjs", import.meta.url), "utf8");
const nativeCore = readFileSync(new URL("../src-tauri/src/lib.rs", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../app/src/main.ts", import.meta.url), "utf8");
const tauriConfig = readFileSync(new URL("../src-tauri/tauri.conf.json", import.meta.url), "utf8");
const shellInstaller = readFileSync(new URL("../site/public/install.sh", import.meta.url), "utf8");
const powershellInstaller = readFileSync(new URL("../site/public/install.ps1", import.meta.url), "utf8");
const landingPage = readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
const tauriLauncher = readFileSync(new URL("../scripts/tauri.mjs", import.meta.url), "utf8");

describe("static deployment artifact", () => {
  it("@claim:unknown-route-404 does not rewrite unknown documents to the homepage", () => {
    expect(config.navigationFallback).toBeUndefined();
    expect(config.responseOverrides?.["404"]).toEqual({ rewrite: "/404.html", statusCode: 404 });
  });

  it("uses a response override for the real 404 without an invalid route rule", () => {
    expect(config.responseOverrides?.["404"]).toEqual({ rewrite: "/404.html", statusCode: 404 });
  });

  it("declares AVIF with a MIME override instead of an unreachable asset route", () => {
    const routes = config.routes ?? [];

    expect(config.mimeTypes?.[".avif"]).toBe("image/avif");
    expect(routes.find((route) => route.route === "/assets/*.avif")).toBeUndefined();
  });

  it("@claim:release-assets builds tagged cross-platform assets and records their source commit", () => {
    expect(releaseWorkflow).toContain('tags: ["v*"]');
    expect(releaseWorkflow).toContain("Verify the tag points at the release source");
    expect(releaseWorkflow).toContain("Screen-Landmark-Lens_${version}_linux.AppImage");
    expect(releaseWorkflow).toContain("SHA256SUMS");
    expect(releaseManifest).toContain("const commit = process.env.GITHUB_SHA");
    expect(releaseManifest).toContain("JSON.stringify({ version, commit, platforms })");
  });

  it("runs the Windows tauri.cmd shim through a shell so the Windows release job can build", () => {
    expect(tauriLauncher).toContain('const executable = process.platform === "win32" ? "tauri.cmd" : "tauri"');
    expect(tauriLauncher).toContain("shell: process.platform === \"win32\"");
  });

  it("@claim:local-processing keeps the native OCR core free of HTTP clients and sends only landmark data to the UI", () => {
    expect(nativeCore).toContain("Model::load_file");
    expect(nativeCore).not.toMatch(/reqwest|ureq|hyper|std::net|https?:\/\//i);
    expect(nativeCore).toContain("landmarks,");
    expect(nativeCore).not.toContain("capture:");
    expect(tauriConfig).toContain("connect-src 'self'");
    expect(tauriConfig).not.toContain("connect-src 'self' https://");
  });

  it("@claim:selected-window capture requires one selected window id", () => {
    expect(appSource).toContain("if (!select.value) return;");
    expect(appSource).toContain('invoke<Analysis>("analyze_window", { windowId: Number(select.value) })');
    expect(nativeCore).toContain("window_id: u32");
    expect(nativeCore).toContain("candidate.id().ok() == Some(window_id)");
  });

  it("@claim:capture-discarded returns OCR landmarks without serializing a captured image", () => {
    expect(nativeCore).toContain("let capture = window.capture_image()");
    expect(nativeCore).toContain("let rgb = image::DynamicImage::ImageRgba8(capture).into_rgb8()");
    expect(nativeCore).toContain("Ok(Analysis {");
    expect(nativeCore).toContain("landmarks,");
    expect(nativeCore).not.toMatch(/captured_image|image_bytes|screenshot/);
  });

  it("@claim:guidance-only has no native pointer, keyboard-control, or remote-control command", () => {
    expect(nativeCore).toContain("tauri::generate_handler![list_windows, analyze_window]");
    expect(nativeCore).not.toMatch(/mouse|pointer|keybd|keyboard|remote_control/i);
  });

  it("@claim:no-account-required includes no sign-in, checkout, or license path in the free build", () => {
    expect(landingPage).toContain("without an account");
    expect(landingPage).not.toMatch(/sign in|checkout|license|api\.sociobot/i);
  });

  it("@claim:checksum-installers verify SHA-256 before placing an installer on the computer", () => {
    expect(shellInstaller).toContain("Checksum mismatch. Nothing was installed.");
    expect(shellInstaller).toContain("sha256sum");
    expect(powershellInstaller).toContain("Get-FileHash");
    expect(powershellInstaller).toContain("Checksum mismatch. Nothing was installed.");
  });
});
