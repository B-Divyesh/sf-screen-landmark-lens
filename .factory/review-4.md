# Find visible controls — strict review 4

## Verdict: FAIL

One blocking finding remains. The live site identifies the download as source
`b23a4a567c1631eb895b4bbd332aea3d3a6ef50a`, but the immutable release and its
packages identify source `70fc3237ee66760ec51c7726acd8f624a5570563`. The exact
published-release claim cannot pass against either checkout.

- Review date: 2026-09-05 UTC
- Implementation reviewed: `70fc3237ee66760ec51c7726acd8f624a5570563`
- Live evidence-only stamp: `b23a4a567c1631eb895b4bbd332aea3d3a6ef50a`
- Documentation head before this report: `95d562a9403055948336d04ccdba22be78133a8e`
- Release: immutable `v0.1.11`
- Live URL: <https://screen-landmark-lens.sociobot.in>
- Findings: 1
- Untested claims: 0

Commits `b23a4a5` and `95d562a` change only reports and evidence after
`70fc323`; they do not change product runtime code. The implementation SHA is
therefore `70fc323`, as required by the work order's report-only-commit rule.

## First screen before scrolling

Fresh Chromium contexts opened the live page at 1440×900 and 390×844.

- Job: find a visible control that a screen reader cannot identify, then give
  its direction.
- Audience: blind or low-vision workers using remote desktops, older apps, or
  other software without useful screen-reader labels.
- First action: **Try it with sample data**.

The headline names the job. The next sentence names the situation and result.
The primary action and all three facts fit before y=602 on the 844 px phone
viewport. They fit before y=814 on desktop. Both views had one H1, one main
landmark, `lang=en`, and no console or page errors.

## Finding

### F-4-1 — Blocking — the public release source does not identify the downloaded packages

The live page's **Release source** and `/release.json` say `b23a4a5`. The
immutable GitHub release target, `latest.json`, all platform source reports,
and package checksums say `70fc323`.

The exact declared command was run from both possible clean checkouts:

- From `b23a4a5`, it failed because the GitHub release target was `70fc323`.
- From `70fc323`, it failed because the live page and `/release.json` were
  stamped `b23a4a5`.

Command:

```sh
VERIFY_PUBLISHED_RELEASE=1 npm run test:shared -- -t @claim:release-assets
```

This is not a demand to rebuild unchanged packages for a report-only commit.
The repair is to make the live release identity name the actual implementation
source, `70fc323`, and then run the command from that clean tagged checkout.

The previous verification and handoff say 29 claims passed. The manifest has
28 entries. This review ran all 28 and found 27 passes plus this failure.

## One-click sample and data isolation

The direct `/?demo=1` entry redirected to `/demo/?demo=1` in one navigation.
The first populated view showed the quarterly report, ready status, Print,
Save, Cancel, and the result `Found OCR text “Save”, bottom right.`

- Searching for Cancel returned bottom right.
- **Reset demo** restored the Save query and result.
- The persistent banner said `Demo — sample data, nothing is saved.`
- **Start for real** returned to `/`.
- Local storage, session storage, and cookies stayed empty.
- All requests in the direct sample flow stayed on the product origin.
- No popup, native bridge, console error, or change to real data appeared.
- After one online visit and worker control, the demo reloaded offline with
  its populated Save result.

## Declared claims

The documented Linux prerequisites were installed before native measurements.
Every manifest command was then run separately from the clean implementation
checkout.

| Claim | Result |
| --- | --- |
| `demo-sample` | PASS |
| `demo-privacy` | PASS |
| `demo-bundled-data` | PASS |
| `website-demo-storage` | PASS |
| `website-privacy` | PASS |
| `offline-demo` | PASS |
| `site-updates` | PASS |
| `desktop-sample` | PASS |
| `demo-mode-isolation` | PASS |
| `free-voice-speed` | PASS |
| `desktop-shortcuts` | PASS |
| `screen-reader-announcements` | PASS |
| `blank-find` | PASS |
| `ocr-uncertainty` | PASS |
| `local-processing` | PASS |
| `selected-window` | PASS |
| `capture-discarded` | PASS |
| `guidance-only` | PASS |
| `no-account-required` | PASS |
| `sample-keyboard-five-labels` | PASS |
| `release-metadata-cache` | PASS |
| `release-metadata-fallback` | PASS |
| `unknown-route-404` | PASS |
| `release-assets` | **FAIL — F-4-1** |
| `package-signatures` | PASS |
| `checksum-installers` | PASS |
| `dependency-licenses` | PASS |
| `image-provenance` | PASS |

There are zero untested claims. The landing, legal pages, README, demo, and
copy audit expose no additional unlisted product promise in this review.

## Installed desktop artifact

The published Linux AppImage was downloaded in a clean temporary consumer
directory. Its SHA-256 was
`813cf809205a932a2993c1ed4bce4ab1cf62f60571c2d43bd1bdd136eece9578`, matching
`latest.json`.

With isolated XDG config, data, and cache directories, the AppImage opened an
1180×820 native **Screen Landmark Lens** window. The no-window environment
showed a specific capture failure and kept **Load sample project** available.
The installed app loaded five sample labels, showed the persistent demo
banner, and returned `Found OCR text “Cancel”, bottom right.` The process
remained healthy until the verifier closed it.

## Normal, invalid, boundary, and recovery paths

- Normal: Save and Cancel searches, reading labels, likely-button output,
  voice speed, and five keyboard searches passed.
- Invalid: blank search and missing-label checks returned instructions rather
  than silent failure.
- Boundary: selected-window tests chose one requested window and rejected an
  absent id; returned results contained no pixels.
- Recovery: capture-unavailable UI, Reset demo, Start for real, release API
  fallback, offline reload, and unknown-route handling worked.
- Update: the shipped worker uses versioned cache `landmark-lens-v5`, deletes
  old caches, and fetches documents from the network first.

## Accessibility, privacy, routes, and performance

- Live axe WCAG A/AA/2.1 AA checks found no violations on home, demo, privacy,
  terms, or the designed 404 in dark and light modes at 390 px.
- Keyboard suites passed skip-link focus, route and Back focus, shortcuts,
  visible focus, 16 px text, and 44 px targets. Reduced motion was enabled in
  the fresh browser checks.
- Home, demo, privacy, and terms returned 200 with distinct titles, one H1,
  and one main landmark. The unknown route returned the expected designed
  HTTP 404; the browser's failed-resource message for that requested document
  is expected, not a defect.
- All crawled landing links returned 200. Installer, service-worker, robots,
  sitemap, and legal URLs returned successfully.
- Headers included HSTS, `nosniff`, `no-referrer`, restrictive permissions,
  `X-Frame-Options: DENY`, and a CSP limited to self plus the documented GitHub
  API request.
- The sample made no third-party request and set no cookie. The product has no
  backend, account, payment path, analytics, or product API, so tenant,
  restart-persistence, health, and 429 checks do not apply.
- Mobile Lighthouse scored 100 performance, 100 accessibility, 100 best
  practices, and 100 SEO. FCP was 1.0 s, LCP 1.0 s, TBT 0 ms, and CLS 0.008.
- Built site JS was 2.01 KB gzip and CSS was 3.74 KB gzip. App JS was 3.39 KB
  gzip and CSS was 2.78 KB gzip.

## Other quality commands

- `npm ci` — PASS; 0 audit vulnerabilities.
- `npm test` — PASS; 15 shared tests and 7 Rust tests passed.
- `npm run build` — PASS; produced `dist/app` and `dist/site`.
- `npm run test:web` — PASS; 51 passed, 1 intentional geometry skip.
- `npm run test:app-web` — PASS; 28 passed.
- `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check` — PASS.
- `CARGO_BUILD_JOBS=1 cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings` — PASS.
- `EXPECTED_RELEASE_COMMIT=b23a4a5… npm run verify:live` — PASS for live page
  structure and the live stamp, but it does not compare that stamp with the
  immutable package source. The release claim performs that missing check and
  fails as F-4-1.

## Earlier finding disposition

| Earlier records | Current disposition |
| --- | --- |
| Verification 1: missing claims and sample, broken purchase, fabricated confidence, stale worker, paywalled voice speed | Fixed. The manifest, bundled sample, nonnumeric uncertainty, versioned network-first worker, and free voice control all passed. Purchasing is not offered. |
| Verification 1 minor items: 404, framing, target/text size, Rust format, metadata, blank search, copy audit, AVIF type, build command | Fixed. Live route, header, geometry, copy, format, build, and invalid-input checks passed. |
| Verification 2: stale desktop release | Previously fixed, but source identity has regressed as F-4-1. The installed `v0.1.11` app itself contains the current sample behavior. |
| Verification 2: unlisted claims, real-mode demo banner, focused light-theme contrast | Fixed by the current claim inventory, mode-isolation tests, installed flow, and light-theme axe run. |
| Verification 2 minor items: removed license copy, release cache disclosure, 404, target sizes, small copy, light theme, sitemap/chrome | Fixed and rechecked live. |
| Review 1 F-1-1 through F-1-32 | Fixed. Exact commands, outcome tests, scoped copy, accessibility geometry, mobile first screen, route focus, 404, copy audit, licenses, and provenance passed. The old participant metric was replaced with an explicit automated five-label acceptance measure and is not presented as a human result. |
| Review 2 F-2-1 and Review 3 F-3-1 | Recurred as F-4-1. |
| Review 2 F-2-2 through F-2-6 | Fixed. Shared chrome, scoped privacy copy, and label terminology passed. |
| Review 3 F-3-2 through F-3-6 | Fixed. Capture wording, website-offline wording, bundled-demo wording, uncertainty, and plain terminology passed. |
| Verification 4 package mismatch and AppImage gap | Package behavior and checksum were exercised successfully; the current public source identity still fails as F-4-1. |
| Verifications 5 and 6 | Their no-defect runtime checks remain supported, except the later identity regression. |
| Verification 7 | Its 29/29 claim statement is not sustained. There are 28 declared claims, and `release-assets` fails today. |

## Required repair

Change the live release metadata and visible **Release source** to the actual
implementation source `70fc3237ee66760ec51c7726acd8f624a5570563`. Do not
rebuild unchanged packages merely for evidence-only commits. Then run all 28
exact claim commands from a clean `70fc323` checkout and repeat the live
identity check.
