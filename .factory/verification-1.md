# Independent product verification 1 — FAIL

- Date: 2026-08-30 UTC
- Candidate: `e3736f27d89789c43bbed3e7de9923db2125956e`
- Live URL: <https://screen-landmark-lens.sociobot.in>
- Artifact: Tauri 2 desktop app plus static download site
- Final result: **FAIL — do not release/accept this candidate**

## Release-blocking findings

### Critical — required claims contract is absent

`.factory/claims.json` does not exist. This was checked before any other repository test. Therefore there are no runnable claim tests and every product claim is unlisted. Examples include “No image uploads,” offline OCR, capture disposal, selected-window-only capture, no telemetry, keyboard shortcuts, and once-daily license checks. The acceptance contract explicitly makes a missing manifest or any failing claim test release-blocking.

### Critical — required one-click sample demo is absent

The cold first screen has no **Try it with sample data** action. `/demo` returns HTTP 200 but is only the normal landing page; it has the same title, H1, and download action and no sample state. The desktop app has no first-run **Load sample project** action. There is no demo banner, Reset demo, Start for real, isolated demo storage namespace, `.factory/demo.md`, shipped sample, or required 3–5 frame screenshot walkthrough. This independently fails the mandatory first-screen gate and prevents claims from being verified through a clean demo entry point.

### High — the advertised purchase path is broken

The live **Buy Lens Plus — $19 once** link points to `https://api.sociobot.in/api/v1/products/screen-landmark-lens/checkout`. A fresh GET returned HTTP 404 with `{"error":"enabled factory product","status":404}`. The site sells this tier and the app gates saved targets and voice-speed controls behind it, but users cannot buy it.

### High — the displayed OCR confidence is not model confidence

`confidence_for` in `src-tauri/src/lib.rs` derives a score only from the proportion of familiar characters and caps normal text at 88%; it does not read OCR confidence. The UI labels this number “OCR quality estimate.” In the real native test, OCR misread `Status: Ready to submit` as `SStatus: Ready to submit` and still displayed 88%. This is misleading uncertainty information in a tool whose user cannot visually verify the result.

### High — service-worker updates can leave users on an old site indefinitely

`site/public/sw.js` uses a fixed `landmark-lens-v1` cache and cache-first responses for `/`. The candidate changed the landing HTML/JS after tag `v0.1.0` without changing the service worker. In a controlled live browser, replacing cached `/` with a stale shell and reloading while online returned the stale shell. No network revalidation occurred. Existing visitors can therefore miss deployed fixes indefinitely.

### High — an accessibility preference is paywalled

The app gates voice-speed control behind Lens Plus. The supplied paid-unlock contract says accessibility features may not be gated. This is especially material for a blind/low-vision audience relying on spoken output.

## Other findings

### Medium

- Unknown paths return the home page with HTTP 200. `/definitely-not-a-real-route` had the home title and H1. There is no designed 404 page or Static Web Apps 404 response override.
- The CSP response header has no `frame-ancestors` directive and there is no `X-Frame-Options`. A cross-origin test page successfully framed the live site and read its H1.
- Several interactive targets are under the required 44×44 CSS px. On the 390 px view, the footer Privacy and Terms links measured 47×15 and 38×15; wordmark links measured 28 px high.
- Supporting text uses 12–14 px in several places despite the product targeting low-vision users and the 16 px web baseline in the acceptance contract.
- `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check` fails on `src-tauri/src/lib.rs`.
- The landing page lacks canonical, Open Graph, Twitter card, and apple-touch metadata. The footer also lacks the required version/build identity.
- The empty Find submission produces `“” was not found in the latest capture…` rather than explaining that a label must be entered.
- `.factory/copy-audit.md` is absent, so the required plain-language audit was not completed.

### Low

- AVIF responses use `application/octet-stream` rather than `image/avif`.
- The exact documented `npm run tauri build -- --bundles deb` command fails in this worker because inherited `CI=1` is rejected by the Tauri CLI. With `CI=true CARGO_BUILD_JOBS=1`, the same release build succeeds. The first retry with default release parallelism was killed by the worker’s memory limit.

## First-read test

Cold desktop and 390×844 mobile captures were taken before interacting with production.

- What it does: finds a control that a screen reader cannot reach by reading labels in one chosen window and giving a direction.
- For whom: a screen-reader user working in a remote desktop or legacy app.
- What to click first: **Download for Linux** on this verifier host.
- Plain-language result: all three are inferable on the first screen.
- Demo result: **FAIL**. No one-click sample-data action appears on the first screen or elsewhere.

On mobile, the illustration appears before the headline. The primary action begins near the bottom of the first 844 px viewport, but remains visible.

## Candidate and deployment identity

The checkout was clean at the requested commit before verification. The production site matches the candidate build byte-for-byte:

| Asset | Local SHA-256 | Live SHA-256 | Result |
|---|---|---|---|
| `dist/site/index.html` | `a383567a3541a2136dd2a4dad7a8e08aeda5577b22e7f23811794c4f54ff3c4b` | same | Pass |
| `index-BQDWIGZy.js` | `e67db9756924d6d8edc6b97788d846474407628dd8584c4fa81fccb605f5b528` | same | Pass |
| `index-DYNGB01r.css` | `e43b8da7446e0d1cd75d90ab836884ae47f5109e3e47933c6472d9751056318e` | same | Pass |

The `v0.1.0` release tag resolves to parent commit `62489f637cd27a3c1224b33d868f9a1087a92ffe`; the candidate changes only site/docs files relative to that tag, not native app source.

## Clean checkout and automated checks

| Check | Result | Evidence |
|---|---|---|
| `npm ci` | Pass | 77 packages installed; audit reported 0 vulnerabilities |
| Every command in `.factory/claims.json` | **Fail** | File missing; zero claim tests available |
| `npm test` before OS prerequisites | Environment fail | Missing `glib-2.0.pc` |
| `npm test` after documented Linux Tauri prerequisites | Pass | TypeScript; 3/3 Vitest; 4/4 Rust unit/model; doc tests |
| `npm run test:web` | Pass | 8/8 across desktop and 390×844 mobile |
| `npm run test:app-web` | Pass | 1/1 browser-safe app state |
| `/opt/fleet/lib/verify-url.sh` | Pass | HTTP 200; title/lang/main/alt checks; zero console errors; load 960 ms |
| Independent mocked full-state app audit | Pass with finding | Find, no-match, likely-button, closed-window recovery; zero serious/critical axe findings; empty query copy defect noted above |
| `cargo clippy --all-targets -- -D warnings` | Pass | No warnings |
| `cargo fmt -- --check` | **Fail** | Formatting diff in `src-tauri/src/lib.rs` |
| `npm run build` | Pass | Produced `dist/app` and `dist/site` |
| Native `.deb` production build | Pass with workaround | `CI=true CARGO_BUILD_JOBS=1 npm run tauri build -- --bundles deb` |
| `npm audit --omit=dev` | Pass | 0 vulnerabilities |

No separate lint script is defined.

## End-to-end desktop workflow

The published Linux `.deb` installed as package version 0.1.0. A real native run under Xvfb/Openbox used a separate `Sample Legacy App` window containing a quarterly report and Save, Cancel, and Print controls.

- Window enumeration found two visible windows.
- The sample window had to be explicitly selected.
- Native capture and bundled OCR completed in 2,080 ms and returned seven labels.
- Find `Save` returned `Found Save, bottom center.`
- A mocked browser harness completed selection and capture using only Tab, ArrowDown, Enter, and a designed 3 px focus outline.
- The same harness confirmed `Found Save, bottom right.`, a useful no-match message, likely-button uncertainty text, and a closed-window recovery instruction.
- The real output exposed the confidence defect above.

The core capture/search path is useful, but it is not available through the required bundled sample/demo and has not completed the brief’s five-task blind/low-vision pilot.

## Privacy, network, and headers

During fresh live desktop and mobile flows, browser requests were limited to the product origin plus the expected GitHub Releases API lookup. There were no analytics, tracking, CDN font, or cloud-image requests. Native source inspection shows captured pixels remain inside `analyze_window`; only derived text and geometry are returned. With no stored license, the browser-safe app flow made only same-origin development requests.

The live document returns HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, Permissions Policy, and a restrictive CSP. Hashed JS/CSS responses have `Cache-Control: public, max-age=31536000, immutable`; `sw.js` has `no-cache`; HTML has `max-age=30`. The missing anti-framing protection is noted above.

The product license verification endpoint was exercised with an invalid token. It returned structured `{valid:false, reason:"invalid"}` responses. In a rapid single-client check, 30 requests succeeded and request 31 returned HTTP 429 with `Retry-After: 4`; observed allowance: 30 requests per active window. The product has no other server-side endpoint and no sign-in.

## Accessibility and responsive checks

- Live desktop, live 390×844 mobile, legal pages, and mocked app full-result state: no serious/critical axe findings.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 0.9 s, TBT 30 ms, CLS 0, interactive 1.0 s.
- One `<h1>`, `lang=en`, `<main>`, landmarks, image alt text, ordered headings, and skip link are present.
- Keyboard traversal reaches the skip link first and all tested controls. Focus is visibly rendered as a 3 px outline.
- Both light and dark schemes had zero serious/critical axe findings.
- Reduced-motion media query matched and no active animations remained.
- At 390 px and after simulated 200% root text sizing, no horizontal overflow was detected.
- Touch-target and small-text failures remain as listed above.

## Performance and packaging

- Site JS: 3.51 KB raw / 1.66 KB gzip.
- Site CSS: 9.44 KB raw / 2.81 KB gzip.
- App JS: 8.97 KB raw / 3.65 KB gzip.
- App CSS: 8.70 KB raw / 2.81 KB gzip.
- Mobile hero AVIF: 15,820 bytes. The first mobile visit also fetched the preloaded 27,104-byte WebP before using AVIF, still comfortably within budget.
- Release `v0.1.0` contains macOS arm64/x64 DMGs, Windows MSI/EXE, Linux AppImage/DEB/RPM, `SHA256SUMS`, and `latest.json`.
- Downloaded Linux `.deb` SHA-256: `c26f1378bd756ba207b3e5584f1411c3f858b885a914ba2256a3ca1153b84de6`; it matches `SHA256SUMS`.
- The live shell installer installed the AppImage into an isolated `XDG_BIN_HOME`; SHA-256 `7ffe941834d08b0da14a77d74fa0131561981e1c45ac8b22a405540f914ddfc4` matched `latest.json` and the file was executable.
- Fresh offline reload worked after service-worker control, but update behavior failed as described above.

## Required remediation before re-verification

1. Add `.factory/claims.json` and one observable demo-based test for every claim; remove any claim that cannot be tested.
2. Ship the desktop sample project and one-click demo contract, document it in `.factory/demo.md`, and add the landing walkthrough.
3. Register/fix the production checkout and test purchase-return, restore, invalid, revoked, and offline-cached-license paths.
4. Replace the fabricated percentage with defensible OCR confidence or honest nonnumeric uncertainty.
5. Move voice-speed control into the free accessibility feature set.
6. Version and update the service-worker cache so online clients receive new shell releases.
7. Add a real 404, anti-framing policy, required social/canonical metadata, 44 px targets, and readable supporting text.
8. Add `.factory/copy-audit.md`, format Rust, and make the documented native build command tolerant of the worker CI environment.

## Scope limits

macOS and Windows binaries were confirmed present but were not executable in this Linux worker. Automated screen-reader speech output itself was not available; semantics, live regions, keyboard behavior, and focus were inspected instead. No infrastructure, unrelated service, database, secret, or non-product resource was accessed.
