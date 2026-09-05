# Find visible controls — independent verification 8

## Verdict: FAIL

The product claims and user paths passed, but one low-severity documentation
finding remains. Acceptance requires zero findings.

- Verification date: 2026-09-05 UTC
- Live URL: <https://screen-landmark-lens.sociobot.in>
- Implementation reviewed: `70fc3237ee66760ec51c7726acd8f624a5570563`
- Static release-identity repair: `0e71ae33b14a6bff14df23e31db07a7f35aecb88`
- Documentation checkout reviewed: `37c01d366c9390ada01fc3df1218c6db23acb3e8`
- Release: immutable `v0.1.11`
- Findings: **1 low**
- Untested claims: **0**

The later commits between the implementation and documentation checkout change
release-identity validation, tests, reports, and evidence. The live static files
match the clean documentation checkout byte for byte. The published desktop
packages, `latest.json`, source reports, live metadata, and `/release.json` all
name implementation `70fc3237…`.

## First screen before scrolling

Fresh Chromium contexts opened the live page at 1440×900 and 390×844.

- Job: find a visible control that a screen reader cannot identify, then hear
  its direction.
- Audience: blind or low-vision workers using remote desktops, legacy apps, or
  other software without useful screen-reader labels.
- First action: **Try it with sample data**.

The action and all three plain facts fit in the 390×844 first screen. The phone
and desktop pages each had one H1, one main landmark, `lang=en`, and no console
or page errors.

## Finding

### F-8-1 — Low — the clean Linux bundle needs one undocumented package

The README says the release workflow lists the complete Debian/Ubuntu package
set. After installing that set and the linked Tauri prerequisites, this exact
documented command failed:

```sh
APPIMAGE_EXTRACT_AND_RUN=1 CARGO_BUILD_JOBS=1 npm run tauri -- build --bundles appimage,deb
```

Tauri reported:

```text
xdg-open binary not found /usr/bin/xdg-open
```

`xdg-open` comes from Debian/Ubuntu package `xdg-utils`, which is absent from
the workflow package list and the linked Tauri Debian command. After installing
`xdg-utils`, the same command passed and produced both the AppImage and DEB.

This does not affect the published packages or installed-app behavior. It does
make the stated clean build setup incomplete. Add `xdg-utils` to the workflow's
Linux dependency command or name it in the README.

Evidence: `.factory/evidence/verification-8-clean-clone/native-bundle.txt`.

## One-click sample and real-data isolation

The direct `/?demo=1` path opened `/demo/?demo=1` with the populated quarterly
report, ready status, Print, Save, Cancel, and a Save result at bottom right.

- The persistent banner said **Demo — sample data, nothing is saved.**
- Searching for Cancel returned bottom right.
- A missing label returned a clear list of valid sample labels.
- **Reset demo** restored the Save query and result.
- **Start for real** returned home and focused the home heading.
- Local storage, session storage, and cookies remained empty.
- The sample made only same-origin requests and opened no extra window or
  native bridge.
- A separate context reloaded the populated demo offline.

Evidence is in `.factory/evidence/verification-8-live/`.

## Declared claims

From a fresh public clone at documentation SHA `37c01d3`, I ran `npm ci` and
then every exact command in `.factory/claims.json`. All 28 passed. The initial
test attempt before installing dependencies in that clone was a verifier setup
error and was discarded; the recorded sweep starts after the documented setup.

| Claim | Result | Evidence |
| --- | --- | --- |
| `demo-sample` | PASS | Fresh website sample found Save at bottom right. |
| `demo-privacy` | PASS | Sample request log contained only the product origin. |
| `demo-bundled-data` | PASS | No popup, native bridge, or outside request. |
| `website-demo-storage` | PASS | Reload restored defaults; no user keys or cookies. |
| `website-privacy` | PASS | No advertising cookies, trackers, or third-party scripts. |
| `offline-demo` | PASS | Dedicated context reloaded the sample offline. |
| `site-updates` | PASS | Worker is versioned and documents use network first. |
| `desktop-sample` | PASS | Bundled desktop sample found Save without capture. |
| `demo-mode-isolation` | PASS | Demo preference stayed separate and cleared on exit. |
| `free-voice-speed` | PASS | Slider worked without a license or account. |
| `desktop-shortcuts` | PASS | All three keyboard shortcuts changed the expected state. |
| `screen-reader-announcements` | PASS | Speech adapter and live region received the result. |
| `blank-find` | PASS | Empty Find returned the recovery instruction. |
| `ocr-uncertainty` | PASS | Output used uncertainty text and no made-up percentage. |
| `local-processing` | PASS | Bundled models processed the fixture without a service. |
| `selected-window` | PASS | Requested window was selected; an absent id was rejected. |
| `capture-discarded` | PASS | Serialized results contained labels but no image bytes. |
| `guidance-only` | PASS | Find changed guidance without controlling another app. |
| `no-account-required` | PASS | All shipped sample tools worked with no account state. |
| `sample-keyboard-five-labels` | PASS | Five requested labels resolved by keyboard. |
| `release-metadata-cache` | PASS | GitHub metadata was requested at most once per hour. |
| `release-metadata-fallback` | PASS | API failure kept a direct Release page link. |
| `unknown-route-404` | PASS | Unknown document returned the designed HTTP 404. |
| `release-assets` | PASS | Release, manifest, checksums, source reports, and live identity agree. |
| `package-signatures` | PASS | All four CI reports state the packages are unsigned. |
| `checksum-installers` | PASS | Valid fixtures installed; changed fixtures were rejected. |
| `dependency-licenses` | PASS | Locked OCR licenses match the notice file. |
| `image-provenance` | PASS | Source hash, model record, and no-text prompt agree. |

The command-by-command record is
`.factory/evidence/verification-8-clean-clone/claims.tsv`. No landing, legal,
README, or demo promise was found outside the claims contract.

## Clean-checkout quality checks

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 77 packages; zero audit vulnerabilities. |
| `npm test` | PASS — 16 shared checks and 7 Rust tests. |
| `npm run test:web` | PASS — 51 checks; one intended desktop skip for a phone-only geometry check. |
| `npm run test:app-web` | PASS — 28 checks. |
| `npm run build` | PASS — produced `dist/app` and `dist/site`. |
| `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check` | PASS. |
| `CARGO_BUILD_JOBS=1 cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings` | PASS. |
| Native AppImage and DEB bundle | PASS after installing the undocumented `xdg-utils`; see F-8-1. |

The site bundle contains 2.01 KB gzip JavaScript and 3.74 KB gzip CSS. The app
bundle contains 3.39 KB gzip JavaScript and 2.78 KB gzip CSS. The most recent
unchanged-runtime Lighthouse record is 100 performance, 100 accessibility, 100
best practices, and 100 SEO, with 996 ms LCP and 0.008 CLS.

## Live accessibility, routes, privacy, and recovery

- `/opt/fleet/lib/verify-url.sh` passed in 604 ms with the correct title,
  language, H1, main landmark, alt text, button names, and zero console errors.
- Home, demo, privacy, and terms returned 200 with distinct titles and complete
  metadata. The deliberate unknown route returned the designed HTTP 404.
- Dark and light Axe WCAG A/AA/2.1 AA runs found no serious or critical issues
  on all five routes.
- At 320 px there was no horizontal overflow and no target below 44 px.
- Keyboard focus started on the 45 px skip link with a 3 px visible outline.
- With reduced motion on phone and desktop, animation and transition duration
  were zero and scroll behavior was automatic.
- Public links resolved. The 404 page's own skip link correctly stayed on its
  expected 404 document.
- Security headers include HSTS, `nosniff`, `no-referrer`, restrictive
  permissions, frame blocking, and a CSP limited to self plus GitHub's release
  API.

## Installed desktop artifact

The published Linux AppImage was downloaded into a new consumer directory. It
was 89,856,504 bytes and its SHA-256 was
`813cf809205a932a2993c1ed4bce4ab1cf62f60571c2d43bd1bdd136eece9578`,
matching `latest.json`.

With isolated XDG config, data, and cache directories, it opened an 1180×820
native window. **Load sample project** showed the persistent demo notice and
five realistic labels. A typed Save search returned bottom right. Screenshots
and the checksum are in `.factory/evidence/verification-8-consumer/`.

## Earlier finding disposition

| Earlier record | Current disposition |
| --- | --- |
| Verification 1: missing claims/demo, broken purchase, false OCR confidence, stale worker, paid voice speed | Fixed. All related claim commands and live paths passed; purchasing is not offered. |
| Verification 1 minor items: 404, framing, small targets/text, Rust format, metadata, blank Find, copy audit, AVIF type, build wrapper | Fixed except the separate clean Linux package omission in F-8-1. |
| Verification 2: stale desktop release, unlisted claims, real-mode demo banner, light-theme focus | Fixed by immutable `v0.1.11`, 28 passing claims, isolation checks, and light-theme Axe/focus checks. |
| Review 1 F-1-1 through F-1-9 | Fixed by runnable outcome tests, package checks, license inventory, and provenance checks. |
| Review 1 F-1-10 | The brief now states an automated five-label acceptance measure. It passed 5/5 and is not described as a participant study. |
| Review 1 F-1-11 through F-1-16 | Fixed by current target/text geometry, phone first screen, copy audit, designed 404, and route-focus checks. |
| Review 1 F-1-17 through F-1-32 | Fixed by the passing source-hashed plain-words audit and live copy review. |
| Review 2 F-2-1 and Review 3 F-3-1 | Fixed. Release target, packages, manifests, checksums, live metadata, and `/release.json` identify `70fc3237…`. |
| Review 2 F-2-2 through F-2-6 | Fixed by shared route chrome, narrowed privacy statements, and consistent label-finding words. |
| Review 3 F-3-2 through F-3-6 | Fixed by tested capture/offline/demo statements, uncertainty wording, and plain terms. |
| Review 4 F-4-1 | Fixed. The exact published-release claim now passes from the clean documentation checkout. |
| Verification 4 local AppImage packaging gap | The FUSE workaround works, but the clean setup still needs undocumented `xdg-utils`; carried forward as F-8-1. |
| Verifications 5–7 | Their runtime results remain supported. The old 29/29 count is corrected to 28/28. |

## Scope limits

This static product has no backend, tenant, account, billing path, product API,
or server-side state. Tenant isolation, restart persistence, health, 429, and
Retry-After checks do not apply.

The worker has no separately rendered remote or legacy desktop and no blind or
low-vision participant. Native model, selected-window, capture-result boundary,
recovery, installed sample, keyboard, and announcement checks passed. No field
study result is claimed.

## Final result

**FAIL — 1 low-severity finding, 0 untested claims.**
