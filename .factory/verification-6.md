# Screen Landmark Lens — independent verification 6

## Result: PASS

- Candidate commit: `4e6dfa98465742596af99f794f3297cb7b0805f1`
- Published release: `v0.1.8` (immutable)
- Live URL: <https://screen-landmark-lens.sociobot.in>
- Verification date: 2026-09-02 UTC

The live site, `/release.json`, immutable GitHub release metadata, and downloaded Linux package all identify the candidate commit.

## First-read check — PASS

A cold visit plainly says **“Find the control your screen reader can’t.”** It says this is for people using remote desktops or legacy apps whose visible controls lack usable screen-reader labels. The first action is **Try it with sample data**, which opens the sample in one click. The first screen also states the relevant facts: captures stay on the device, it works offline after installation, and all tools in this build are free.

## Claims — PASS (28/28)

After `npm ci`, every exact command in `.factory/claims.json` passed using its demo entry point. The first bare-container native attempt correctly exposed missing Linux Tauri system libraries; the README and release workflow document those prerequisites. After installing that documented set (WebKitGTK/GTK, PipeWire, GBM, Clang, and related development libraries), all three native privacy/capture claim commands and the complete suite passed.

| Claim family | Evidence |
| --- | --- |
| Website demo, privacy, storage, offline/update, release metadata, and 404 claims | Exact `npm run test:web -- --grep @claim:…` commands; full `npm run test:web` passed 50 checks. |
| Desktop sample, isolation, free controls, shortcuts, speech, recovery, OCR uncertainty, and guidance claims | Exact `npm run test:app-web -- --grep @claim:…` commands; full `npm run test:app-web` passed 28 checks. |
| Local processing, selected-window, capture-discarded, licenses, and provenance | Exact `npm run test:shared -- -t @claim:…` commands passed. |
| Published release, signatures, and checksum installer claims | Exact `VERIFY_PUBLISHED_RELEASE=1 npm run test:shared -- -t @claim:…` commands passed. |

## Local quality checks — PASS

- `npm ci` — installed 77 packages; audit reported 0 vulnerabilities.
- `npm test` — passed after documented Linux Tauri prerequisites.
- `npm run test:web` — 50/50 Playwright checks passed, including desktop and 390 px mobile.
- `npm run test:app-web` — 28/28 desktop-interface checks passed.
- `npm run build` — produced `dist/app` and deployable `dist/site`.
- `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check` — passed.
- `CARGO_BUILD_JOBS=1 cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings` — passed.
- Production bundle sizes: site JavaScript 2.01 KB gzip, site CSS 3.71 KB gzip; app JavaScript 3.39 KB gzip, app CSS 2.78 KB gzip.

## Live product, privacy, accessibility, and deployment evidence — PASS

- Live release identity is `v0.1.8` / `4e6dfa98465742596af99f794f3297cb7b0805f1`; GitHub reports the release immutable.
- Downloaded `Screen-Landmark-Lens_0.1.8_linux.AppImage` (85.6 MB) SHA-256 was `1a568a298ae551ddb0f90199963ac5714f2bbaee96ff5a936b380b802ce89df8`, exactly matching its published manifest.
- The live sample demo found **Save** at bottom right; blank search said what to enter; an absent label offered `Save`, `Print`, `Cancel`, and `Status` as recovery choices. It left no cookies, local storage, or session storage and made requests only to the product origin.
- A live offline reload of `/demo/` worked after the initial visit. The service worker is `no-cache`; hashed CSS/JS have one-year immutable caching; HTML uses 30-second revalidation.
- Axe WCAG A/AA/2.1AA found no serious or critical violations on `/`, `/demo/`, `/privacy`, `/terms`, or the designed 404 at 390 px with reduced motion. Home/demo/privacy/terms had no console or page errors. The landing page’s first keyboard focus is the skip link with a visible 3 px focus ring.
- Response headers include HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, restrictive Permissions Policy, `X-Frame-Options: DENY`, and CSP limited to self plus the explicitly used GitHub release API.
- Mobile Lighthouse: performance 100, accessibility 100, FCP 0.9 s, LCP 1.1 s, TBT 80 ms, CLS 0.008.
- This static product has no product server endpoint, sign-in, payment/unlock path, or analytics. Rate-limit and Entra tenant checks are not applicable.

## Defects by severity

None found.

## Verification boundary

The container has no separately rendered remote or legacy-app window, so a physical screen capture was not repeated. Native local-model, selected-window, result-boundary, keyboard, screen-reader announcement, empty-input recovery, and five scripted label-finding paths were executed by the shipped native/browser tests.
