# Screen Landmark Lens — independent verification 5

## Result: PASS

- Candidate commit: `3141e356975dfbea151bd239708adfe2d520f0e6`
- Live URL: <https://screen-landmark-lens.sociobot.in>
- Verification date: 2026-09-02 UTC

The deployed static site, immutable `v0.1.6` desktop release, and clean-checkout build all identify and reproduce the candidate commit.

## First-read check — PASS

A cold live visit says **“Find the control your screen reader can’t.”** It says that Lens is for people using remote desktops or legacy-app windows whose labels are inaccessible to their screen reader. The visible first action is **Try it with sample data**, which enters the bundled demo in one click. The same screen states the three material facts: captures stay on the device, it works offline after installation, and its shipped tools are free.

## Claims — PASS (26/26 exact commands)

After `npm ci` and the documented Tauri Linux prerequisites from `.github/workflows/release.yml`, every command in `.factory/claims.json` passed exactly as written. The initial bare container did not have `glib-2.0`; that is a documented system prerequisite, not a repository failure. Retesting after that required setup passed the complete `npm test` suite and every individual claim command.

| Claims | Result | Evidence |
| --- | --- | --- |
| `demo-sample`, `demo-privacy`, `website-demo-storage`, `website-privacy`, `offline-demo`, `site-updates`, `release-metadata-cache`, `release-metadata-fallback`, `unknown-route-404` | PASS | Exact `npm run test:web -- --grep @claim:…` commands |
| `desktop-sample`, `demo-mode-isolation`, `free-voice-speed`, `desktop-shortcuts`, `screen-reader-announcements`, `blank-find`, `ocr-uncertainty`, `guidance-only`, `no-account-required` | PASS | Exact `npm run test:app-web -- --grep @claim:…` commands |
| `local-processing`, `selected-window`, `capture-discarded`, `dependency-licenses`, `image-provenance` | PASS | Exact `npm run test:shared -- -t @claim:…` commands; local-model fixture completed in 20.8 s without a service |
| `release-assets`, `package-signatures`, `checksum-installers` | PASS | Exact commands with `VERIFY_PUBLISHED_RELEASE=1`; validates published immutable release, source identity, signatures, and checksum installers |

## Local quality checks — PASS

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 77 packages; audit reported zero vulnerabilities |
| `npm test` | PASS — TypeScript, copy audit, 15/15 shared assertions, and 7/7 Rust tests |
| `npm run test:web` | PASS — 46 Playwright checks across desktop and 390 px mobile |
| `npm run test:app-web` | PASS — 28/28 browser checks |
| `npm run build` | PASS — `dist/app` and deployable `dist/site` produced |
| `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check` | PASS |
| `CARGO_BUILD_JOBS=1 cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings` | PASS |

The production site bundle is 2.01 KB gzip JavaScript and 3.71 KB gzip CSS; the desktop UI bundle is 3.39 KB gzip JavaScript and 2.78 KB gzip CSS. Both are within the stated budgets.

## Live, privacy, accessibility, and release evidence — PASS

- `/release.json`, landing metadata, GitHub release metadata, and the candidate all name `3141e356975dfbea151bd239708adfe2d520f0e6` and `v0.1.6`.
- Fresh local `dist/site/index.html` and `main-CW-GUTwc.js` are byte-identical to the live responses (SHA-256 `e044f794…d702b2` and `f6fc857e…c9eac`).
- The live demo entered from `?demo=1`, displayed its persistent sandbox banner, found **Cancel** at bottom right, reset to **Save**, retained no local/session keys or cookies, and returned focus to the home heading when leaving demo mode.
- Request logging over cold desktop and 390 px mobile visits recorded only the product origin. There were no console/page errors, third-party scripts, analytics, cookies, capture uploads, or cloud OCR calls. The GitHub API fallback is explicitly limited by CSP and covered by its own cache/fallback claims.
- Axe WCAG A/AA had no serious or critical findings on `/`, `/demo/`, `/privacy/`, `/terms/`, and the designed 404 in both light and dark schemes. Reduced-motion desktop/mobile loads were error-free. First keyboard focus showed a 3 px visible outline; the skip link, navigation, Back routing, 16 px text baseline, and 44 px target baseline passed browser checks.
- `/opt/fleet/lib/verify-url.sh` passed: HTTP 200, title, `lang=en`, one H1, main landmark, image alt text, labelled buttons, and zero console errors; measured cold load was 815 ms.
- Headers include HSTS, `nosniff`, `no-referrer`, restrictive Permissions Policy, `X-Frame-Options: DENY`, and a restrictive CSP. HTML uses 30-second revalidation; hashed JS is `max-age=31536000, immutable`; `sw.js` is `no-cache`. Offline reload and network-first update behavior passed their dedicated claims.
- A freshly downloaded `Screen-Landmark-Lens_0.1.6_linux.deb` is 14,831,800 bytes and SHA-256 `7196757010e77744c1e90d54fa3fdd13fd4e226efe3573c55ecd592ea257ee2d`, exactly matching published `SHA256SUMS`.
- This is a static site with no product server-side endpoint or sign-in flow. Rate-limit and Entra tenant checks therefore do not apply.

## Defects by severity

None found.

## Known verification boundary

The container has no interactive desktop session, so a capture of a separately rendered remote/legacy window was not physically repeated. The real bundled OCR-model, selected-window, capture-discard boundary, keyboard, speech, empty-input recovery, and five scripted label-finding paths were exercised by the native and browser suites.
