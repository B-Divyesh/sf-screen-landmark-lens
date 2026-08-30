# Screen Landmark Lens v0.1.0 — handoff

## Independent verification — FAIL (2026-08-30)

Candidate `e3736f27d89789c43bbed3e7de9923db2125956e` at <https://screen-landmark-lens.sociobot.in> is **not accepted**. Full evidence is in `.factory/verification-1.md`.

Release blockers:

- `.factory/claims.json` is missing, so the mandatory claim suite cannot run and product claims are unlisted.
- There is no one-click sample demo, bundled sample project, demo state/banner/reset, `.factory/demo.md`, or screenshot walkthrough. `/demo` is only the landing page.
- The advertised $19 checkout returns HTTP 404 (`enabled factory product`).
- The app presents a character-shape heuristic as an “OCR quality estimate”; a real OCR misread still showed 88%.
- The fixed-name, cache-first service worker can keep serving an old landing shell indefinitely after deployment.
- Voice speed, an accessibility preference, is paywalled.

Additional failures include no real 404, missing anti-framing policy and social/canonical metadata, undersized touch targets and supporting text, a failing `cargo fmt --check`, and a blank-search error that quotes an empty string.

Positive evidence: the live site matches the candidate build byte-for-byte; `npm run build`, all declared browser suites, TypeScript, Vitest, Rust tests, and Clippy passed after documented Linux prerequisites were installed. The published Linux `.deb` checksum matched and a real native window-selection → OCR → Find flow worked. Lighthouse mobile scored 100 in Performance, Accessibility, Best Practices, and SEO. The license verifier enforced 30 requests before HTTP 429 with `Retry-After: 4`. These passes do not override the release-blocking contract failures.

## What was built

- A Tauri 2 desktop app that lists real visible windows, requires an explicit selection, captures only that window through `xcap`, and runs bundled `ocrs` models entirely on-device.
- The complete keyboard-first loop: capture/read, spoken label list, text search with directional cues, and conservative likely-button descriptions. Captures stay in memory and are dropped after OCR.
- Actionable no-window, permission, closed-window, no-label, browser-preview, loading, offline-license, and revoked-license states.
- Free core accessibility features plus a $19 one-time Lens Plus unlock for saved target phrases and speech speed. Checkout and daily-cached verification use only the Sociobot API; purchase returns offer a copyable token for desktop restore.
- Responsive static product site, OS-aware release downloads, checksum-verifying shell/PowerShell installers, `/privacy`, `/terms`, offline service worker, and immutable asset-cache policy.
- Original surreal editorial hero and app icon. Provenance, prompt, review, palette, typography, spacing, and motion policy are recorded in `.factory/design.md` and `assets/src/`.
- Tag-driven GitHub Actions builds for macOS arm64/x64, Windows, and Linux. The final job publishes `SHA256SUMS` and a machine-readable `latest.json` after verifying every release asset.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run test:web
npm run test:app-web
npm run tauri build -- --bundles deb
```

Factory static build command: `npm run build:site`. Deploy directory: `dist/site` (with `index.html` at its root).

Local verification on Ubuntu 24.04:

- `npm test`: passed TypeScript checking, 3 TypeScript unit tests, 4 Rust unit/model tests, and Rust doc tests.
- `npm run test:web`: 8/8 Playwright tests passed at desktop and 390×844 mobile widths; axe found no serious/critical issues on home, privacy, or terms.
- `npm run test:app-web`: passed; axe found no serious/critical issues in the desktop app's browser-safe error state; no console errors.
- `npm run build`: passed. Landing output is 3.36 KB JS / 9.44 KB CSS uncompressed (1.58 KB / 2.81 KB gzip). App output is 8.97 KB JS / 8.70 KB CSS uncompressed.
- Original responsive hero variants are 16–68 KB, well below the 300 KB budget.
- `npm run tauri build -- --bundles deb`: passed and produced a local `.deb` before the generated Cargo target was cleaned.
- Lighthouse 12.8.2 mobile against the final production build: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.1 s, CLS 0, TBT 0 ms, and no console errors.
- `npm audit --omit=dev`: 0 vulnerabilities. No runtime CDN, analytics, third-party font, or tracking request exists.

## Release verification

- Release tag: `v0.1.0`.
- Workflow: `.github/workflows/release.yml`.
- Release: https://github.com/B-Divyesh/sf-screen-landmark-lens/releases/tag/v0.1.0
- GitHub Actions run `33158629302` passed all four builds plus the manifest job. Published assets: macOS arm64/x64 `.dmg`, Windows `.msi`/`.exe`, Linux `.AppImage`/`.deb`/`.rpm`, `SHA256SUMS`, and `latest.json`.
- Post-release verification downloaded `Screen-Landmark-Lens_0.1.0_linux.deb`; expected and actual SHA-256 both matched `c26f1378bd756ba207b3e5584f1411c3f858b885a914ba2256a3ca1153b84de6`. `latest.json` was fetched from `/releases/latest/download/latest.json` and validated for all four platform keys.

## Known limits

- The bundled recognition alphabet is Latin-centric. Small, stylized, moving, obscured, and low-contrast labels can be missed; the UI describes confidence as an OCR quality estimate and gives a recovery step.
- “Likely button” is intentionally a conservative wording heuristic, not accessibility metadata or visual control classification.
- Screen capture could not be exercised against a real GUI window in the headless factory container; the native capture code compiled and packaged, while model integrity and the downstream direction logic are directly tested. A pilot screen-reader user should still run the five scripted target tasks from the brief.
- Speech uses the operating system Web Speech voice, so voice availability and pronunciation vary by host.
- Wayland capture depends on the desktop portal/PipeWire implementation and may show a system picker in addition to the in-app selection.
- GitHub's release-download host does not expose browser CORS headers, so the landing page resolves its platform button through GitHub's CORS-enabled Releases API. The checksum-verifying installers consume the required release-hosted `latest.json` directly.

## Needs operator action

- Register the production product slug `screen-landmark-lens` in the Sociobot billing engine and set its return URL to `https://screen-landmark-lens.sociobot.in/` before accepting real purchases. No product ID is hardcoded.
- The v0.1.0 workflow intentionally produces unsigned binaries. To add trusted signing/notarization, configure `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, and `APPLE_TEAM_ID`; for Windows, provide `WINDOWS_CERT_PFX` and its password and add the organization-specific Authenticode import/sign step. No signing secrets are currently consumed by this unsigned workflow.
- Submit the five-task pilot with a blind or low-vision worker; target success is at least 4/5 controls found unaided.
