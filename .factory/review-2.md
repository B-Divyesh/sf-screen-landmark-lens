# Screen Landmark Lens — first-read review 2

## Verdict: FAIL

Review date: 2026-09-02 UTC  
Reviewed branch: `main` at `5de390fb771123d9f3d7a334c2a7330cdd738021`  
Live site: <https://screen-landmark-lens.sociobot.in>

The cold landing page is clear and the sample path works, but acceptance requires zero findings. Two blocking findings remain: the current checkout cannot prove its published-release claim, and the brief's required blind or low-vision pilot result is still absent. Five further findings cover unlisted privacy claims, inconsistent chrome, and copy consistency.

## Cold first read

Fresh browser contexts opened the live home page at 390×844 and 1440×900, before scrolling.

- What it does: It finds a visible control that a screen reader cannot identify, then tells the person its direction.
- For whom: A screen-reader user working in a remote desktop, legacy application, or other software without useful labels.
- What to select first: **Try it with sample data**.

All three answers were available on both first screens. On 390px, the primary action ended at y=409.34 and the three plain facts ended at y=582.34, within the 844px viewport. No first-read clarity blocker was found.

## Findings

### Blocking

#### F-2-1 — The declared published-release claim fails from the reviewed clean checkout

- Location: `.factory/claims.json`, `release-assets`; live `/release.json`; GitHub release `v0.1.6`.
- Exact result: `VERIFY_PUBLISHED_RELEASE=1 npm run test:shared -- -t @claim:release-assets` failed from a clean clone at `5de390fb771123d9f3d7a334c2a7330cdd738021` with `Expected: "5de390fb771123d9f3d7a334c2a7330cdd738021"` and `Received: "3141e356975dfbea151bd239708adfe2d520f0e6"`.
- Why this matters: the landing page offers release packages and the claim says they are tied to this source commit. The deployed `/release.json` and landing meta tag instead identify an earlier commit. A visitor cannot verify that the current README, claims, and shipped packages describe one immutable artifact.
- Concrete fix: publish a new immutable version from the reviewed commit (for example `v0.1.7`), update every visible/versioned manifest and site release identity to that commit, and run the exact candidate-bound claim from that tagged checkout. Do not retarget the immutable `v0.1.6` release.

#### F-1-10 — The brief's required human pilot evidence remains absent

- Location: `.factory/brief.json` success measure and `.factory/pilot-evidence.md`.
- Exact quote: the brief requires: “In five scripted inaccessible-app tasks, a pilot user finds the requested labeled control unaided in at least four tasks.” The pilot record says: “This worker had no human participant.”
- Why this matters: the recorded five-task result is a browser fixture run, not evidence that a blind or low-vision worker can use the real product. The earlier finding is therefore not fixed and must carry forward with its original id.
- Concrete fix: run five representative inaccessible-app tasks with at least one blind or low-vision participant. Record the task definitions, unaided outcomes, consent-safe observations, and at least four successful tasks. Keep the automated fixture as regression coverage, not as substitute pilot evidence.

### Medium

#### F-2-2 — The site header and footer are not consistent across routes

- Location: live `/`, `/demo/`, `/privacy/`, `/terms/`, and the designed 404.
- Exact comparison: home uses the wordmark **“Landmark Lens”** and nav **Demo / How it works / Privacy / Download**. Demo uses **“Landmark Lens”** and **Home / Sample project / Walkthrough**. Privacy, Terms, and 404 use **“Screen Landmark Lens”** and **Demo / Privacy / Terms**. The home/demo footer includes the wordmark; legal/404 footer does not.
- Why this matters: a first-time visitor moves between the sample and legal pages without a stable orientation or stable navigation choices. This fails the required shared header/footer skeleton even though every destination resolves.
- Concrete fix: render one shared header/footer component or shared static fragment on every route. Keep the same wordmark and the same limited navigation (including Demo and Privacy); page-specific anchors can appear in the page body.

#### F-2-3 — “In memory” capture handling is a stronger, unlisted privacy claim

- Location: landing privacy section: “Captures live only in memory long enough for local OCR. They are discarded immediately after recognition.”
- Why this matters: `capture-discarded` only asserts that the serialized analysis result lacks pixel fields. It does not observe temporary files, databases, cache entries, or process memory during a real capture. `demo-privacy` only covers the website sample. The visitor-facing storage guarantee has no matching claims entry or observable test.
- Concrete fix: either narrow the copy to the tested result boundary, or add a `capture-memory-only` claim. Its native integration test should process a controlled capture, inspect the configured app-data/temp directories and returned IPC data, and assert no image bytes persist after completion.

#### F-2-4 — The landing's no-telemetry/no-cloud/no-hidden-capture statement is not covered as written

- Location: landing privacy section: “Lens has no telemetry, cloud vision service, remote control, or hidden full-screen capture.”
- Why this matters: `guidance-only` observes the browser-safe sample finding Cancel and makes no external request. It does not exercise the native capture path or establish the four stated guarantees. `selected-window` verifies a controlled selection, but not the absence of a hidden full-screen capture in the shipped app.
- Concrete fix: split this into tested claims such as `native-no-network`, `selected-window-only`, and `no-remote-control`, each with a native controlled-window test and request/process instrumentation; or remove the broader sentence.

### Minor

#### F-2-5 — README reintroduces unexplained “wayfinding” jargon

- Location: `README.md`, What ships: “Free wayfinding and voice-speed preference controls; no account or purchase is required in this build”.
- Why this matters: “wayfinding” was removed from landing copy in the prior repair because it does not name the task. It is not the established user term in the README terminology table, which uses “label” and “direction.”
- Concrete fix: “Free label-finding and voice-speed controls; no account or purchase is required in this build.”

#### F-2-6 — The demo changes the requested item from “label” to “target”

- Location: live `/demo/` walkthrough heading: **“Find a target”**. The landing and README call the same requested visible item a **label**.
- Why this matters: a screen-reader user gets two names for the same action while learning the tool. The plain-language terminology contract says one concept uses one term.
- Concrete fix: change the heading to **“Find a visible label”**.

## Copy audit

The complete current-source inventories, including headings, controls, questions, and sentence word counts, are in `.factory/copy-audit.md` (source hashes: `site/index.html=bf0317cd80a9f904cca3ad0d3edaff6cde360fbe9d0bbebbbfc9018ce9dc4537`; `README.md=96f5eb2fc38cd36974a16ac5a4ead004ca2a94688c262b14d137a9a0e614d716`). I reran `npm run test:copy`; it passed.

### Landing prose sentences

| Sentence | Words |
| --- | ---: |
| Choose one remote desktop or legacy-app window. | 7 |
| Lens reads its visible labels locally, then tells you exactly where to look—or point. | 15 |
| Screen Landmark Lens locates one visible label in a selected window. | 11 |
| One window. | 2 |
| Explicit scope every time. | 4 |
| On your device. | 3 |
| OCR runs there. | 3 |
| Lens gives directions. | 3 |
| It never clicks. | 3 |
| Find a visible label in three steps. | 7 |
| Use it when remote desktops, canvas interfaces, or older software do not provide labels to your screen reader. | 18 |
| Lens lists visible windows. | 4 |
| You explicitly pick the one it may capture. | 8 |
| Bundled OCR runs offline and announces visible labels in reading order. | 11 |
| Type “Save” and hear “bottom right.” | 6 |
| Likely buttons are clearly marked as estimates. | 7 |
| Captures live only in memory long enough for local OCR. | 10 |
| They are discarded immediately after recognition. | 6 |
| Lens has no telemetry, cloud vision service, remote control, or hidden full-screen capture. | 13 |
| May have nothing to announce. | 5 |
| Reads rendered pixels locally. | 4 |
| Requires another person and sharing context. | 6 |
| Window capture, OCR, label reading, text finding, directional cues, and voice-speed controls are free. | 14 |
| The app asks before it captures one visible window. | 9 |
| Purchasing is not available in this build. | 7 |
| All shipped label-finding features work without an account. | 8 |
| Version 0.1.6 packages have no publisher signature. | 7 |
| On macOS, right-click the app and choose Open. | 8 |
| Can Lens click a button for me? | 7 |
| No. | 1 |
| It gives a directional cue and keeps you in control. | 10 |
| It does not move the pointer, press keys, or operate the target app. | 13 |
| Does OCR always get the label right? | 7 |
| No. | 1 |
| Lens identifies every result as OCR text instead of showing an invented percentage. | 13 |
| It may miss or misread small, stylized, moving, or low-contrast text. | 11 |
| Enlarge the window or increase contrast and capture again. | 9 |
| Does it work without internet? | 5 |
| Yes. | 1 |
| After installation, window capture and OCR run locally. | 8 |
| Use the website only to download a release or read its documentation. | 12 |
| Find visible controls in software that does not label them. | 10 |

### README prose sentences

| Sentence | Words |
| --- | ---: |
| Screen Landmark Lens is a desktop aid for blind and low-vision workers. | 12 |
| It finds controls in software that gives screen readers no useful labels. | 12 |
| Pick one visible window. | 4 |
| Lens reads its visible labels and gives a direction such as “bottom right.” | 13 |
| Lens does not upload captures, control the pointer, click controls, or replace a screen reader. | 15 |
| Optical character recognition (OCR) output is marked as uncertain. | 9 |
| Download the detected platform build from the latest release, or use: | 11 |
| Version 0.1.6 packages have no publisher signature. | 7 |
| On macOS, right-click the installed app and choose Open the first time. | 12 |
| The operating system asks for screen-capture permission when needed. | 9 |
| On Debian/Ubuntu, the release workflow lists the complete package set, including WebKitGTK, PipeWire, GBM, Clang, and file. | 18 |
| In a container without FUSE, run `APPIMAGE_EXTRACT_AND_RUN=1 npm run tauri -- build --bundles appimage,deb`. | 18 |
| The static deploy runs `npm run build:site` and publishes `dist/site`. | 12 |
| Native packages are built in GitHub Actions from a `v*` tag. | 11 |
| The workflow confirms that the tag, packages, checksums, download links, and live site name one source commit. | 17 |
| Published GitHub releases are immutable. | 5 |
| Open `?demo=1` for an isolated, one-click sample. | 8 |
| The desktop app also has Load sample project on its first screen. | 12 |
| The sample data is bundled and uses no real capture. | 10 |
| Start for real discards sample changes. | 6 |
| The service worker uses versioned caches and serves navigation requests from the network whenever online, so deployed fixes replace an older shell. | 22 |
| Captured pixels exist in memory only during OCR. | 8 |
| The app drops them when analysis returns. | 7 |
| Voice speed is stored locally. | 5 |
| Desktop demo mode uses a separate `demo:lens:speech-rate` key. | 10 |
| Start for real clears that key and restores the regular preference. | 11 |
| The website demo does not save your search or sample changes. | 11 |
| Its service worker caches public pages for offline use. | 9 |
| All shipped label-finding features are free and need no account or purchase. | 12 |
| The landing page asks `api.github.com` for current release metadata at most once per hour in a browser. | 19 |
| If metadata is unavailable, its download buttons keep a direct link to the Release page. | 15 |
| The website privacy policy describes this request. | 7 |
| Dependency licenses are recorded in THIRD_PARTY_NOTICES.md. | 8 |
| Read the image provenance record for the shipped hero source and prompt. | 12 |
| See `.factory/handoff.md` for verification and release notes. | 7 |
| MIT. | 1 |
| See LICENSE. | 2 |

All listed prose is at or below 22 words. The headings are concrete except the F-2-6 demo heading, and buttons name outcomes or actions. F-2-5 is the remaining landing/README jargon flag.

## Demo and sandbox checks

- Clicking **Try it with sample data** from the live landing page entered `/demo/` in one navigation.
- The first demo screen already showed the sample quarterly-report window, its **Status: Ready to submit**, Print/Save/Cancel controls, a filled **Save** query, and the result **“Found OCR text ‘Save’, bottom right.”**
- The persistent banner read **“Demo — sample data, nothing is saved.”** Reset restored `Save`; Start for real returned to `/` and moved focus to the home H1.
- A fresh demo context created no localStorage, sessionStorage, or cookies. Its requests were all same-origin. A separate fresh context reloaded `/demo/` offline after service-worker control.
- No real desktop data is available to the static web demo. The browser-safe desktop sample isolation claim passed; F-2-3 and F-2-4 identify the remaining untested native guarantees in landing privacy copy.

## Claims execution

I cloned the public repository into `/tmp/sll-review-2.tgMkG0/repo`, ran `npm ci`, installed the documented Linux Tauri prerequisite set from `.github/workflows/release.yml`, and ran every exact command in `.factory/claims.json` separately. The initial native run without those documented system libraries failed on missing `glib-2.0`; after the documented setup, native claims ran successfully.

| Claim | Result |
| --- | --- |
| demo-sample | PASS |
| demo-privacy | PASS |
| website-demo-storage | PASS |
| website-privacy | PASS |
| offline-demo | PASS |
| site-updates | PASS |
| desktop-sample | PASS |
| demo-mode-isolation | PASS |
| free-voice-speed | PASS |
| desktop-shortcuts | PASS |
| screen-reader-announcements | PASS |
| blank-find | PASS |
| ocr-uncertainty | PASS |
| local-processing | PASS |
| selected-window | PASS |
| capture-discarded | PASS |
| guidance-only | PASS |
| no-account-required | PASS |
| release-metadata-cache | PASS |
| release-metadata-fallback | PASS |
| unknown-route-404 | PASS |
| release-assets | **FAIL** — F-2-1 |
| package-signatures | PASS |
| checksum-installers | PASS |
| dependency-licenses | PASS |
| image-provenance | PASS |

`npm test` passed (15 TypeScript/shared and 7 Rust tests) after documented prerequisites. `npm run build` passed and produced both `dist/app` and `dist/site`.

## Earlier-review regression check

I read `review-1.md`, `polish-1.md`, and the current handoff, then checked the live site and source.

| Earlier finding | Current check |
| --- | --- |
| F-1-1 through F-1-9 | Fixed in source and exercised by the current claim sweep, except the candidate-bound published-release claim is newly failing as F-2-1. |
| F-1-10 | **Unfixed; carried forward as blocking F-1-10.** |
| F-1-11 and F-1-12 | Fixed: the live 390px check found no text below 16px and no interactive target below 44px. |
| F-1-13 | Fixed: action and three plain facts are in the 390×844 first screen. |
| F-1-14 | Fixed: the generated audit is current and `npm run test:copy` passed. |
| F-1-15 | Fixed: unknown URL returned the designed 404 with complete metadata and shared legal chrome. |
| F-1-16 | Fixed: demo exit and Back/forward route handling focused the destination H1. |
| F-1-17 through F-1-32 | Fixed on the landing and README except the new terminology/jargon regressions recorded as F-2-5 and F-2-6. |

## Structure, accessibility, links, and visual identity

- `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200 with route titles, one H1, one main landmark, descriptions, canonical URLs, OG/Twitter image metadata, language, favicon, and apple touch icon. The unknown address returned the designed HTTP 404 with title **Page not found — Screen Landmark Lens**.
- Browser Back restored the prior route and the route script focused the destination H1. There were no page errors or console errors on the checked routes.
- Axe WCAG 2 A/AA/2.1 AA checks found no serious or critical violations in dark and light schemes across home, demo, privacy, terms, and 404.
- Crawled internal and external navigation links returned 200, including the Linux AppImage. The skip link on the deliberately unknown 404 retains that document's expected 404 status.
- The cut-paper midnight-garden illustration, surveying-line details, warm paper panels, serif/interface type pairing, and non-generic mobile composition are distinct and match `.factory/design.md`. No generic SaaS-template finding was found.
- F-2-2 remains because metadata and accessibility do not replace a consistent header/footer.

## Missed leverage

No missing AI, import/export, or sync feature was found. The brief is deliberately a local, selected-window direction tool; adding AI or synchronization would not make the immediate screen-control task clearer or safer. No provider key appears in the product source.

## What would make this perfect

Publish a fresh immutable release bound to the reviewed source, obtain real participant evidence for the five-task success measure, replace route-specific chrome with one shared header/footer, and either prove or narrow the two landing privacy guarantees. Then remove the remaining `wayfinding`/`target` terminology drift and rerun this complete review.
