# Screen Landmark Lens — repair handoff

## Result

Release-blocking findings from `.factory/verification-2.md` have been repaired and regression-tested.

- Product source release: `v0.1.4` → `18bf38159a42c7023ecff3caf88e47d29f5a4c71`
- Release workflow: <https://github.com/B-Divyesh/sf-screen-landmark-lens/actions/runs/33551056135> — success on Linux, Windows, macOS arm64, and macOS x64
- Published release: <https://github.com/B-Divyesh/sf-screen-landmark-lens/releases/tag/v0.1.4>
- Live static site: <https://screen-landmark-lens.sociobot.in>
- Static deployment: `55e40016-2d83-4c7b-854c-712ac9a83df7` — succeeded 2026-09-01 UTC

The release record's `target_commitish` and its uploaded `latest.json` both equal the exact source commit above. The release has nine assets: macOS arm64/x64 DMGs, Windows MSI/EXE, Linux AppImage/DEB/RPM, `SHA256SUMS`, and `latest.json`.

## Repaired findings

- Demo banner now truly honors `[hidden]`; demo speech speed uses its own `demo:lens:` key and **Start for real** deletes it before restoring the real preference. `@claim:demo-mode-isolation` reproduces the original leak and verifies the repair.
- The focused light-theme desktop skip link now has an AA-contrast foreground/background pair. Playwright axe checks it in desktop and 390px mobile modes.
- Claims were expanded to 20 observable entries in `.factory/claims.json`, covering local processing, selected-window capture, discard behavior, keyboard shortcuts, demo/privacy/offline behavior, release integrity, and installers.
- The landing page uses `api.github.com` metadata with a one-hour cache and graceful fallback. A release-specific static bootstrap prevents GitHub HTTP 403/rate-limit responses from producing a first-load console error; the API still refreshes an expired cache. Regression coverage verifies cache behavior, no-bootstrap fallback, and the exact 403 failure.
- The release workflow now checks out the tag, verifies it points at HEAD, emits that exact SHA into `latest.json`, and publishes GitHub's `target_commitish` from `git rev-parse HEAD`.
- Desktop release packaging now launches the Windows `tauri.cmd` shim through the Windows command shell; that fixes the reproduced `spawn EINVAL` failure.
- The stale Plus FAQ was removed. Real 404 responses, 44px links, complete light treatment, demo sitemap entry, legal metadata, and honest privacy wording are present.

## Verification

Run after a clean `npm ci` (77 packages; production audit: 0 vulnerabilities):

```sh
npm test                         # TypeScript, 14 Vitest assertions, 4 Rust tests: pass
npm run build                    # dist/app and dist/site: pass
npm run test:app-web             # 18 desktop + 390px Playwright checks: pass
npm run test:web                 # 34 desktop + 390px Playwright checks: pass
cargo fmt --manifest-path src-tauri/Cargo.toml --check
CARGO_BUILD_JOBS=1 cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings
npm audit --omit=dev             # all pass; 0 vulnerabilities
```

The final static build is 1.82 KB gzip JS and 3.66 KB gzip CSS. Browser axe coverage found zero serious/critical findings on `/`, `/demo/`, `/privacy/`, and `/terms/` in dark and light themes at desktop and 390px.

Package/consumer verification downloaded the final published Linux DEB, verified it against uploaded `SHA256SUMS`, and inspected it as `screen-landmark-lens` version `0.1.4`, amd64, with its executable and desktop entry.

Live checks:

```sh
/opt/fleet/lib/verify-url.sh https://screen-landmark-lens.sociobot.in test-results/live-v0.1.4
# HTTP 200; title, lang, one h1, main, image alt text; zero console errors
curl -o /dev/null -w '%{http_code}' https://screen-landmark-lens.sociobot.in/not-a-real-route
# 404
```

The live CSP permits only self plus `https://api.github.com` for connections. A fresh mobile browser resolved the Linux download to the published `v0.1.4` AppImage, focused the skip link by keyboard, and produced zero console errors. The live demo made zero external requests. Live axe on the landing page found zero serious/critical violations.

## Known limits and operator action

- The brief's five-task pilot success measure has no real-user pilot evidence. The product does not claim that outcome; run that pilot before treating it as measured.
- Binaries are intentionally unsigned. For signed distribution, the operator must provide the workflow signing materials `APPLE_CERTIFICATE` (plus its password/provisioning values) and `WINDOWS_CERT_PFX` (plus password), then add the signing/notarization steps. macOS users currently use right-click → Open; Windows may show SmartScreen.
- OCR may miss or misread small, stylized, moving, obscured, or low-contrast text. Lens only guides; it never clicks or controls the target application.

No secrets, billing, or non-product services were accessed. The static deployment wrapper reused only `sf-screen-landmark-lens`.
