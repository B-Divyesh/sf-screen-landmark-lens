# Independent product verification 2 — FAIL

- Date: 2026-08-30 UTC
- Candidate: `8ca4382462f457e330f43b6b08452012089f66e5`
- Live URL: <https://screen-landmark-lens.sociobot.in>
- Artifact: Tauri 2 desktop app plus static download site
- Result: **FAIL — do not accept or release this candidate**

The static site is the candidate and the declared claim commands pass. The product still fails acceptance because the site downloads an older desktop build, the claims inventory omits many visitor-facing promises, the desktop demo banner is shown during real mode, and a keyboard-only light-theme state has a serious axe contrast violation.

## Release-blocking findings

### Critical — the live download is not the candidate desktop app

The live detected-platform button resolves through the GitHub Releases API to release `v0.1.0`. Its tag resolves to commit `62489f637cd27a3c1224b33d868f9a1087a92ffe`; the candidate is `8ca4382462f457e330f43b6b08452012089f66e5`. The desktop repair begins at `b6e1ac0`, after the tag. The diff from `v0.1.0` to the candidate includes `app/`, `src-tauri/src/lib.rs`, the sample project, voice-speed changes, uncertainty changes, and recovery behavior.

Fresh package evidence:

- Published Linux DEB: 14,836,576 bytes, SHA-256 `c26f1378bd756ba207b3e5584f1411c3f858b885a914ba2256a3ca1153b84de6`.
- Candidate DEB built locally: 14,829,876 bytes, SHA-256 `b2f5dab88f7d3a3b9aba9ee0e7915dbb94904e09146eae2082f956d4aa59dd9d`.
- A fresh launch of the published DEB has no **Load sample project** action. `test-results/release/published-desktop.png` records the first screen.
- A fresh launch of the candidate build does show that action. `test-results/current-native/first-screen.png` records it.

The shipped product therefore fails the desktop demo contract and does not deliver the candidate fixes, even though the website itself is current.

### High — visitor-facing claims are missing from `.factory/claims.json`

All eight listed claim commands pass, but the manifest does not inventory or test many claims on the live landing page, legal pages, and README. Examples include:

- “No image uploads” and “OCR never leaves it.”
- Only the explicitly selected window is captured.
- Captures are discarded immediately after recognition.
- No telemetry, cloud vision, remote control, or autonomous clicking.
- Window capture and OCR work offline.
- No account is required.
- The three advertised keyboard shortcuts work.
- The app asks before capture.
- Cross-platform installers and checksum verification work.

The attached claims contract says every visitor-facing claim must have exactly one observable demo-based test and that any unlisted claim fails review. The current privacy claim covers only the website sample demo, not native capture/OCR behavior.

### High — the desktop app labels real mode as a no-save demo

On a fresh app load without `?demo=1`, `#demo-banner` has the `hidden` attribute but remains visibly rendered because `.demo-banner { display:flex }` overrides the user-agent hidden rule. It says **“Demo — sample data, nothing is saved”** while the app is in real mode and can enumerate/capture windows and write the real preference key.

Fresh browser and native evidence:

- Real URL `/`: `hidden=""`, `isVisible() === true`.
- After **Start for real**: URL `/`, `hidden=""`, still visible.
- `test-results/current-native/first-screen.png` shows the banner beside a real-mode window count.
- Changing voice speed in the demo wrote `demo:lens:speech-rate=1.4`; **Start for real** left that value stored and left the UI at the demo value. This contradicts `.factory/demo.md`, which says leaving demo discards demo data.

This is a privacy/state communication defect for a blind or low-vision user: the visual banner cannot be relied on to identify the active storage/capture mode.

### High — serious axe failure in a keyboard-only light-theme state

In the desktop UI at 390 px with `prefers-color-scheme: light`, Tab makes the skip link visible. Axe then reports serious `color-contrast`: foreground `#101827` on background `#9b6500`, contrast 3.6:1 for 16 px bold text; 4.5:1 is required. The project-authored axe smoke test misses the defect because it does not focus the normally off-screen skip link or explicitly test both themes.

## Other findings

### Medium

- The live FAQ still says internet is needed to buy or verify an optional Plus license and that a cached license continues offline. Purchase and license code were removed, while the same page says purchasing is unavailable. The sentence is false, unlisted in claims, and absent from `.factory/copy-audit.md`.
- Every cold landing visit automatically requests `https://api.github.com/repos/B-Divyesh/sf-screen-landmark-lens/releases/latest`. The installer contract requires a one-hour local cache, but `resolveDownloads()` has none. The privacy policy says GitHub receives request data “when you download a release,” which omits this automatic pre-download request.
- An unknown URL such as `/not-a-real-page-qa` returns HTTP 200 with the home page, not the designed 404. `/404.html` itself is valid, but the deployed navigation fallback prevents the response override from handling unknown documents.
- Several real interactive targets remain below 44 px: the landing privacy-policy link is 371×19 desktop and 293×38 mobile; the desktop app wordmark is 173×28 and its Privacy/Terms links are 58×19 and 47×19.
- No five-task pilot evidence demonstrates the brief’s success measure of at least four independently found controls. The automated sample demonstrates one requested target.

### Low

- The landing page still uses 13 px eyebrow and release-note text despite the 16 px baseline for this low-vision audience.
- `.factory/design.md` promises a full light treatment, but the public site stays dark under a light color preference. The desktop app has both treatments.
- `sitemap.xml` omits the required `/demo/` route. Legal/demo routes also omit some of the full per-route social metadata and the shared footer build/provenance content.

## First-read and one-click demo gate

**Pass.** On a cold desktop load, the first screen says:

- What it does: reads visible labels in one selected remote-desktop or legacy-app window and gives a direction.
- For whom: a person whose screen reader cannot expose the control.
- First action: **Try it with sample data**.

The action opens `/demo/` in one keyboard-operated click. The page immediately shows a realistic quarterly-report form, “Save, bottom right,” the persistent demo banner, **Reset demo**, and **Start for real**. On 390×844, the headline, audience/situation sentence, and full sample action remain in the first viewport; the action ends at 841.5 px. Evidence: `test-results/live-first-read-desktop.png`, `test-results/live-first-read-mobile.png`, and `test-results/live-demo-one-click.png`.

## Claims gate

`.factory/claims.json` exists. Every command was run separately before broader QA from the clean candidate checkout.

| Claim | Command | Result |
| --- | --- | --- |
| `demo-sample` | `npm run test:web -- --grep @claim:demo-sample` | Pass, 2/2 |
| `demo-privacy` | `npm run test:web -- --grep @claim:demo-privacy` | Pass, 2/2 |
| `offline-demo` | `npm run test:web -- --grep @claim:offline-demo` | Pass, 2/2 |
| `site-updates` | `npm run test:web -- --grep @claim:site-updates` | Pass, 2/2 |
| `desktop-sample` | `npm run test:app-web -- --grep @claim:desktop-sample` | Pass, 1/1 against source preview; fails in the published desktop artifact |
| `free-voice-speed` | `npm run test:app-web -- --grep @claim:free-voice-speed` | Pass, 1/1 against source preview; published artifact predates it |
| `blank-find` | `npm run test:app-web -- --grep @claim:blank-find` | Pass, 1/1 against source preview; published artifact predates it |
| `ocr-uncertainty` | `npm run test:app-web -- --grep @claim:ocr-uncertainty` | Pass, 1/1 against source preview; published artifact predates it |

The listed commands total 12 configured test executions. The release still fails because the installed artifact does not satisfy the desktop claims and because many claims are unlisted.

## Clean build and automated checks

| Check | Result | Evidence |
| --- | --- | --- |
| `npm ci` | Pass | 77 packages; 0 audit vulnerabilities |
| `npm test` | Pass after installing documented Linux Tauri prerequisites | TypeScript; 6/6 Vitest; 4/4 Rust; doc tests |
| `npm run test:web` | Pass | 18/18 desktop and 390 px tests |
| `npm run test:app-web` | Pass | 5/5 browser-safe desktop tests |
| `npm run build` | Pass | Produced `dist/app` and `dist/site` |
| `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check` | Pass | No diff |
| `CARGO_BUILD_JOBS=1 cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings` | Pass | No warnings |
| `npm audit --omit=dev` | Pass | 0 vulnerabilities |
| `CI=true CARGO_BUILD_JOBS=1 npm run tauri build -- --bundles deb` | Pass on isolated retry | Candidate DEB produced; an earlier concurrent attempt was killed by the 4 GiB worker during final LTO linking |
| `/opt/fleet/lib/verify-url.sh <live URL>` | Pass | HTTP 200, 1,157 ms, title/lang/H1/main/alt, zero console errors |

No separate lint script exists. TypeScript and Clippy are the available static checks.

## Functional exercise

### Live sample

The live sample passed normal, partial/case-insensitive, invalid, and recovery cases on desktop and 390 px:

- Initial and `sAv` search: `Save`, bottom right.
- Blank/whitespace: “Enter a label to find, then choose Find sample label,” with focus returned to the input.
- Unknown `Approve`: useful not-found response listing valid examples.
- Clicking sample `Cancel`: `Cancel`, bottom right.
- **Reset demo** restores `Save` and the initial result.

### Candidate desktop source/build

- Native candidate enumerated two visible windows and required explicit selection.
- Native capture/OCR of a selected window completed and returned 34 OCR labels in 9,692 ms; a low-legibility fixture returned the documented no-label recovery in 1,018 ms.
- Browser-safe native-command fixtures verified three labels, case-insensitive `Save`, blank input, unknown input, likely-button estimates, zero-label recovery, permission recovery, and closed-window recovery.
- `Alt+Shift+F` focused Find; all tested actions worked by keyboard in the browser-safe harness.
- The bundled sample loaded five labels and found `Save`, bottom right.

The source candidate’s core loop is useful. The installed live artifact and demo-state defects prevent acceptance.

## Accessibility and responsive evidence

- Live home/demo/privacy/terms/404: zero serious or critical axe findings at 1440 px and 390 px in tested dark/light preferences.
- Candidate desktop demo: zero serious/critical findings before focusing the light-theme skip link; the focused state produces the serious contrast failure above.
- One H1, `lang=en`, `<main>`, headings, form labels, image alt text, skip link, and polite live regions are present.
- First Tab reaches the skip link. The site focus ring is a visible 3 px `#FFD76A` outline.
- Reduced-motion matched; zero running animations were observed.
- No horizontal overflow was observed at 390 px in landing, demo, legal, or desktop app states.
- No console or page errors occurred during the live desktop/mobile flows.

## Privacy, network, headers, and caching

- Fresh direct `/demo/` flow made six requests, all to the product origin. The `demo-privacy` claim is true.
- A fresh landing visit contacted only the product origin and `api.github.com`; no analytics, CDN font, cloud-image, or tracking request was observed.
- The browser-safe desktop app contacted only its own development origin during all normal/error/demo flows.
- Source inspection confirms OCR models are bundled and pixels stay within `analyze_window`; only derived text/geometry are returned.
- Live headers include HSTS, `nosniff`, `Referrer-Policy: no-referrer`, Permissions Policy, `X-Frame-Options: DENY`, and CSP with `frame-ancestors 'none'`.
- HTML uses `public, must-revalidate, max-age=30`; hashed JS/CSS and AVIF use one-year immutable caching; `sw.js` uses `no-cache`; AVIF is served as `image/avif`.
- Service worker `landmark-lens-v2` controls the demo. A deliberately stale cached demo was replaced while online, then the current demo reloaded offline with its result intact.
- This static product has no product-owned server endpoint, account, or sign-in. Rate-limit and Entra checks are not applicable.

## Performance

Lighthouse mobile on the live root:

- Performance 98
- Accessibility 100
- Best Practices 100
- SEO 100
- FCP 1.4 s; LCP 1.5 s; TBT 160 ms; CLS 0
- Total transfer 55 KiB

Built site assets are 1,563-byte gzip JS and 3,315-byte gzip CSS. The mobile AVIF is 15,820 bytes; the additional preloaded WebP keeps total image transfer at 43,137 bytes. There are no webfonts. All stated budgets pass.

## Deployment and release packaging

The live static deployment matches the candidate build byte-for-byte:

| File | SHA-256 local/live |
| --- | --- |
| `index.html` | `708bb46dbce2d62d8a6e602f5911efd6aa24faf3f0dda7906903ce926f5d0e15` |
| `demo/index.html` | `730a38fbd7b2a811efddad22daa16155e7de7c12f5604c10340e138b462e5da5` |
| `main-VZgXF7VO.js` | `b44d18cee64bbba2eda6f354f64d0a4bd01eecc2e00600750fbd401b5f2f3215` |
| `main-Cd9eLFRH.css` | `fe5a9210f43f906ee062af5dd21b66803f381c3d5576f23a4f7c44f4e144504b` |

Release `v0.1.0` contains macOS arm64/x64 DMGs, Windows MSI/EXE, Linux AppImage/DEB/RPM, `SHA256SUMS`, and `latest.json`. The published DEB matches `SHA256SUMS`. The live `install.sh` installed the AppImage into an isolated `XDG_BIN_HOME`; SHA-256 `7ffe941834d08b0da14a77d74fa0131561981e1c45ac8b22a405540f914ddfc4` matched `latest.json`. Packaging integrity passes, but those assets are stale relative to this candidate.

## Required remediation

1. Publish new desktop assets built from the accepted candidate and update the release/version so the live download is demonstrably that commit.
2. Add demo-based claims for every live product/privacy/offline/keyboard/installer statement, or remove the statements.
3. Make `[hidden]` win for the desktop demo banner; clear/reset demo state on exit and test both real-to-demo and demo-to-real boundaries.
4. Fix and test the focused skip-link contrast in the desktop light theme.
5. Remove the obsolete Plus-license FAQ copy and include every landing/FAQ sentence in the copy audit.
6. Cache GitHub release metadata for one hour and disclose that the landing page contacts GitHub before a download.
7. Make unknown routes return the designed 404 status and enlarge remaining interactive targets to 44 px.
8. Add `/demo/` to the sitemap and record the five-task user success test when available.

