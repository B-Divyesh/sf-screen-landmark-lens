import { createHash } from "node:crypto";
import { execFile, execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

type StaticWebAppsConfig = {
  navigationFallback?: { rewrite?: string; exclude?: string[] };
  responseOverrides?: Record<string, { rewrite?: string; statusCode?: number }>;
  routes?: Array<{ route?: string; headers?: Record<string, string> }>;
  mimeTypes?: Record<string, string>;
};

const root = new URL("../", import.meta.url);
const path = (relative: string) => new URL(relative, root);
const config = JSON.parse(readFileSync(path("site/public/staticwebapp.config.json"), "utf8")) as StaticWebAppsConfig;
const productVersion = (JSON.parse(readFileSync(path("package.json"), "utf8")) as { version: string }).version;

const execFileAsync = promisify(execFile);
const sharedCargoTarget = process.env.CARGO_TARGET_DIR || join(tmpdir(), "screen-landmark-lens-cargo-target");

async function runNativeClaim(name: string) {
  const { stdout, stderr } = await execFileAsync("cargo", ["test", "--manifest-path", "src-tauri/Cargo.toml", name, "--", "--exact"], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, CARGO_BUILD_JOBS: "1", CARGO_TARGET_DIR: sharedCargoTarget },
    maxBuffer: 50 * 1024 * 1024,
  });
  return `${stdout}\n${stderr}`;
}

describe("static deployment artifact", () => {
  it("uses a response override for the real 404 without a homepage fallback", () => {
    expect(config.navigationFallback).toBeUndefined();
    expect(config.responseOverrides?.["404"]).toEqual({ rewrite: "/404.html", statusCode: 404 });
  });

  it("declares AVIF with a MIME override instead of an unreachable asset route", () => {
    expect(config.mimeTypes?.[".avif"]).toBe("image/avif");
    expect((config.routes ?? []).find((route) => route.route === "/assets/*.avif")).toBeUndefined();
  });

  it("@claim:local-processing runs the bundled recognition models without a service", async () => {
    expect(await runNativeClaim("tests::claim_local_processing_loads_bundled_models_without_a_service"))
      .toContain("test tests::claim_local_processing_loads_bundled_models_without_a_service ... ok");
  }, 600_000);

  it("@claim:selected-window uses the requested fixture window and rejects a missing id", async () => {
    expect(await runNativeClaim("tests::claim_selected_window_uses_only_the_requested_id"))
      .toContain("test tests::claim_selected_window_uses_only_the_requested_id ... ok");
  }, 600_000);

  it("@claim:capture-discarded serializes OCR results without captured pixels", async () => {
    expect(await runNativeClaim("tests::claim_capture_discarded_serializes_landmarks_without_pixels"))
      .toContain("test tests::claim_capture_discarded_serializes_landmarks_without_pixels ... ok");
  }, 600_000);

  it("@claim:checksum-installers install verified fixtures and reject tampered fixtures", async () => {
    const fixture = mkdtempSync(join(tmpdir(), "lens-installer-"));
    const asset = join(fixture, "Screen-Landmark-Lens_fixture_linux.AppImage");
    const install = join(fixture, "installed");
    writeFileSync(asset, "verified desktop fixture\n");
    const checksum = createHash("sha256").update(readFileSync(asset)).digest("hex");
    const manifest = join(fixture, "latest.json");
    writeFileSync(manifest, JSON.stringify({ platforms: { linux: { url: `file://${asset}`, sha256: checksum } } }));
    const script = path("site/public/install.sh");
    const env = { ...process.env, SLL_MANIFEST_URL: `file://${manifest}`, SLL_PLATFORM_KEY: "linux", SLL_INSTALL_DIR: install };
    const output = execFileSync("sh", [script.pathname], { env, encoding: "utf8" });
    expect(output).toContain("Installed verified AppImage");
    expect(readFileSync(join(install, "screen-landmark-lens.AppImage"), "utf8")).toBe("verified desktop fixture\n");

    writeFileSync(asset, "tampered fixture\n");
    const rejectedInstall = join(fixture, "rejected");
    expect(() => execFileSync("sh", [script.pathname], { env: { ...env, SLL_INSTALL_DIR: rejectedInstall }, stdio: "pipe" })).toThrow();
    expect(existsSync(join(rejectedInstall, "screen-landmark-lens.AppImage"))).toBe(false);
    if (process.env.VERIFY_PUBLISHED_RELEASE === "1") {
      const releaseResponse = await fetch("https://api.github.com/repos/B-Divyesh/sf-screen-landmark-lens/releases/latest", { headers: { "User-Agent": "screen-landmark-lens-claim-test" } });
      const release = await releaseResponse.json() as { assets: Array<{ name: string; browser_download_url: string }> };
      const reportAsset = release.assets.find((item) => item.name === "windows-installer-verification.json");
      expect(reportAsset).toBeTruthy();
      const report = await fetch(reportAsset!.browser_download_url).then((response) => response.json());
      expect(report).toEqual({ platform: "windows", validAccepted: true, tamperedRejected: true });
    }
  });

  it("@claim:dependency-licenses matches locked recognition dependencies to their notices", () => {
    const metadata = JSON.parse(execFileSync("cargo", ["metadata", "--manifest-path", "src-tauri/Cargo.toml", "--format-version", "1"], { cwd: root, encoding: "utf8", maxBuffer: 50 * 1024 * 1024 }));
    const notices = readFileSync(path("THIRD_PARTY_NOTICES.md"), "utf8");
    for (const name of ["ocrs", "rten"]) {
      const dependency = metadata.packages.find((item: { name: string }) => item.name === name);
      expect(dependency).toBeTruthy();
      expect(notices).toContain(`| \`${dependency.name}\` | ${dependency.version} | ${dependency.license} |`);
    }
  });

  it("@claim:image-provenance binds the shipped hero source to its retained generation record", () => {
    const image = readFileSync(path("assets/src/wayfinding-garden.png"));
    const record = JSON.parse(readFileSync(path("assets/src/wayfinding-garden.png.json"), "utf8"));
    const prompt = JSON.parse(readFileSync(path("assets/src/wayfinding-garden.prompt.json"), "utf8"));
    expect(record.sha256).toBe(createHash("sha256").update(image).digest("hex"));
    expect(record.model || record.deployment).toBeTruthy();
    expect(prompt.prompt).toMatch(/no text|Avoid: text/i);
  });

  it("@claim:release-assets matches the published manifest, checksums, and exact source commit", async () => {
    if (process.env.VERIFY_PUBLISHED_RELEASE !== "1") return;
    const expectedSource = process.env.EXPECTED_RELEASE_COMMIT
      || execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
    const releaseResponse = await fetch("https://api.github.com/repos/B-Divyesh/sf-screen-landmark-lens/releases/latest", { headers: { "User-Agent": "screen-landmark-lens-claim-test" } });
    expect(releaseResponse.ok).toBe(true);
    const release = await releaseResponse.json() as { tag_name: string; target_commitish: string; immutable: boolean; assets: Array<{ name: string; browser_download_url: string }> };
    expect(release.tag_name).toBe(`v${productVersion}`);
    expect(release.target_commitish).toBe(expectedSource);
    expect(release.immutable).toBe(true);
    const names = release.assets.map((asset) => asset.name);
    for (const suffix of ["macos-arm64.dmg", "macos-x64.dmg", "windows.msi", "windows-setup.exe", "linux.AppImage", "linux.deb", "linux.rpm", "SHA256SUMS", "latest.json"]) {
      expect(names.some((name) => name.endsWith(suffix))).toBe(true);
    }
    const manifestAsset = release.assets.find((asset) => asset.name === "latest.json")!;
    const manifestResponse = await fetch(manifestAsset.browser_download_url);
    expect(manifestResponse.ok).toBe(true);
    const manifest = await manifestResponse.json() as { version: string; tag: string; commit: string; platforms: Record<string, { sha256: string; url: string; publisherSigned: boolean; commit: string }> };
    expect(manifest.version).toBe(productVersion);
    expect(manifest.tag).toBe(release.tag_name);
    expect(manifest.commit).toBe(expectedSource);
    expect(Object.keys(manifest.platforms).sort()).toEqual(["linux", "macos-arm64", "macos-x64", "windows"]);
    for (const value of Object.values(manifest.platforms)) {
      expect(value.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(value.url).toContain(`/releases/download/v${productVersion}/`);
      expect(value.publisherSigned).toBe(false);
      expect(value.commit).toBe(expectedSource);
    }
  }, 60_000);

  it("@claim:package-signatures uses CI-produced signature reports for every signed platform", async () => {
    if (process.env.VERIFY_PUBLISHED_RELEASE !== "1") return;
    const releaseResponse = await fetch("https://api.github.com/repos/B-Divyesh/sf-screen-landmark-lens/releases/latest", { headers: { "User-Agent": "screen-landmark-lens-claim-test" } });
    expect(releaseResponse.ok).toBe(true);
    const release = await releaseResponse.json() as { tag_name: string; assets: Array<{ name: string; browser_download_url: string }> };
    expect(release.tag_name).toBe(`v${productVersion}`);
    for (const platform of ["linux", "macos-arm64", "macos-x64", "windows"]) {
      const reportAsset = release.assets.find((asset) => asset.name === `${platform}.signature.json`);
      expect(reportAsset, `missing ${platform} signature report`).toBeTruthy();
      const reportResponse = await fetch(reportAsset!.browser_download_url);
      expect(reportResponse.ok).toBe(true);
      expect(await reportResponse.json()).toEqual({ platform, publisherSigned: false });
    }
  }, 60_000);
});
