# Screen Landmark Lens — independent verification 7

## Result: PASS

- Candidate commit: `b23a4a567c1631eb895b4bbd332aea3d3a6ef50a`
- Published release: immutable `v0.1.11`
- Live URL: <https://screen-landmark-lens.sociobot.in>
- Verification date: 2026-09-02 UTC

The clean checkout, live landing and `/release.json`, and immutable GitHub release all identify the candidate commit.

## First-read check — PASS

A cold visit says: “Find the control your screen reader can’t.” It explains that this is for people using remote desktops or legacy apps whose visible controls lack screen-reader labels. The first action is **Try it with sample data**; it opens the isolated sample in one click. The first screen also presents three plain facts: results exclude capture pixels, the website sample works offline after a first visit, and all tools are free.

## Claims — PASS (29/29 with documented desktop prerequisites)

After `npm ci`, I ran every exact command declared in `.factory/claims.json`. The web and desktop-interface claim commands passed from the demo entry points. On the untouched base image, the three Rust-backed claims (`local-processing`, `selected-window`, and `capture-discarded`) initially could not compile because `pkg-config` could not find `glib-2.0`; this is a documented Tauri host prerequisite, not an application assertion failure. I installed the exact Linux packages listed in `.github/workflows/release.yml`, then reran `npm test`: all 15 shared tests, including those three native claims, and all 7 Rust tests passed. The full browser suites also passed.

The published-release claim commands were executed with `VERIFY_PUBLISHED_RELEASE=1`. The release/tag/commit, checksums, signature reports and installer-fixture checks passed. I additionally downloaded the published Linux AppImage (89,856,504 bytes): SHA-256 `813cf809205a932a2993c1ed4bce4ab1cf62f60571c2d43bd1bdd136eece9578`, exactly matching `latest.json`.

## Local quality checks — PASS

- `npm ci` — 77 packages installed; `npm audit` reported 0 vulnerabilities.
- `npm test` — passed after the documented Linux Tauri dependencies were installed.
- `npm run test:web` — 52 Playwright checks passed, covering desktop and 390 px mobile.
- `npm run test:app-web` — passed (desktop sample, keyboard shortcuts, live announcements, recovery, demo isolation, and five label searches).
- `npm run build` — produced `dist/app` and `dist/site`.
- `APPIMAGE_EXTRACT_AND_RUN=1 npm run tauri -- build` — passed; produced Linux `.deb` and `.rpm` packages locally.
- `CARGO_BUILD_JOBS=1 cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings` — passed.
- `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check` — passed.
- Production bundles: site JS 2.01 KB gzip and CSS 3.74 KB gzip; app JS 3.39 KB gzip and CSS 2.78 KB gzip.

## Live product, privacy, accessibility, and deployment — PASS

- Live `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200 with one `h1`, one `main`, language/title/description/canonical/social metadata, alt text, and no console or page errors. A cold unknown route returned the designed 404 with shared header/footer.
- Live 390×844 first-screen content fit through all three facts. Keyboard route transitions and Back focused the destination heading; the first Tab exposes the visible skip link. All visible text is at least 16 px and interactive targets are at least 44 px.
- The live demo redirected `?demo=1` to `/demo/`, found `Cancel` at bottom right, reset to `Save`, kept no local/session storage or cookies, opened no popup/native bridge, and made only same-origin requests. A fresh context reloaded the demo offline after its first visit.
- Axe WCAG A/AA/2.1AA found no serious or critical violations across `/`, `/demo/`, `/privacy/`, `/terms/`, and 404 in both color schemes. Reduced motion disables animation and transition in the shipped styles.
- Mobile Lighthouse: performance 100, accessibility 100, FCP 1.1 s, LCP 1.1 s, TBT 20 ms, CLS 0.008.
- Headers include HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, restrictive Permissions Policy, `X-Frame-Options: DENY`, and a CSP restricted to self plus the GitHub release API. HTML revalidates in 30 seconds; hashed assets cache for one year immutable; `/sw.js` is no-cache and uses network-first navigations.
- This static website has no product server API, sign-in, billing/unlock, tracking, or analytics. Consequently, product endpoint allowance/429 and Entra tenant checks are not applicable.

Evidence from the cold live recheck, axe run, offline reload, and screenshots is refreshed in `.factory/evidence/live/`.

## Defects by severity

None found.

## Verification boundary

The disposable container cannot present an independently rendered remote or legacy-app window. The shipped native tests did execute local model loading, selected-window isolation, and result-boundary assertions; browser tests exercised the sample UI’s normal, empty, missing-label recovery, and keyboard paths.
