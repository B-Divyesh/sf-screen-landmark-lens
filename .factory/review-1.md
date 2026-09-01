# Screen Landmark Lens — first-read review 1

## Verdict: FAIL

The product is clear and tryable, but acceptance requires zero findings. This review records 32 findings. Twelve are blocking because declared claim commands fail, listed claim checks do not confirm observable outcomes, or earlier documented gaps remain unresolved.

Review date: 2026-09-01 UTC

Candidate: `69e2b05274891a9729d58abf9b48fe58995933e6`

Live site: <https://screen-landmark-lens.sociobot.in>

## Cold first read

Fresh contexts were opened at 390×844 and 1440×900 before scrolling.

- What it does, in my words: it reads a visible control that a screen reader cannot identify and gives its direction.
- For whom, in my words: a screen-reader user working in a remote desktop or older application.
- What to select first: **Try it with sample data**.

The three questions are answerable on both layouts, so the first-read clarity gate itself passes. On mobile, the primary action runs from y=793.7 to y=845.7 in an 844px viewport, and the three plain facts begin at y=983.7. That separate layout failure is F-1-13.

## Findings

### Blocking

#### F-1-1 — Eight declared claim commands do not run their tests

- Location: `.factory/claims.json`, entries `local-processing`, `selected-window`, `capture-discarded`, `guidance-only`, `no-account-required`, `unknown-route-404`, `release-assets`, and `checksum-installers`.
- Exact command pattern: `npm run test:shared -- --grep @claim:<id>`.
- Check: each command fails before collection with `CACError: Unknown option --grep` because Vitest 3 uses `-t` or `--testNamePattern`.
- Why this matters: the published claim manifest directs a verifier to commands that cannot confirm the stated behavior.
- Fix: change each shared-suite command to `npm run test:shared -- -t @claim:<id>`, then run every command from a fresh clone.

#### F-1-2 — Several listed claim checks inspect source text instead of observable outcomes

- Location: `shared/static-deploy.test.ts:41-96`.
- Exact examples: `expect(releaseWorkflow).toContain(...)`, `expect(nativeCore).not.toMatch(...)`, and `expect(shellInstaller).toContain("sha256sum")`.
- Check: the checks for release assets, local processing, selected-window capture, capture discard, guidance-only behavior, no-account behavior, and installer checksums only search source strings.
- Why this matters: a matching string does not confirm that a release was produced, a selected window was processed, returned data omitted pixels, or checksum mismatch stopped installation.
- Fix: add outcome checks. Run the packaged app with a controlled window fixture; inspect the returned IPC value; run installers against valid and invalid checksums in a temporary directory; and compare published release manifests with built files.

#### F-1-3 — “The website demo stores nothing.” is an unlisted claim

- Location: `README.md`, Privacy.
- Check: localStorage, sessionStorage, and cookies stay empty, but the registered worker creates Cache Storage named `landmark-lens-v2` with the home, demo, privacy, terms, and hero files.
- Why this matters: the literal sentence conflicts with the documented offline cache. `demo-privacy` checks outgoing requests, while `demo-mode-isolation` checks desktop-app storage. Neither entry checks website demo storage.
- Fix: rewrite it as “The website demo does not save your search or sample changes. Its service worker caches public pages for offline use.” Add a `website-demo-storage` claim that confirms no user-entered value is stored.

#### F-1-4 — “Spoken feedback through the operating system’s Web Speech voice” is an unlisted claim

- Location: `README.md`, What ships.
- Why this matters: `desktop-shortcuts` checks focus and text in an announcer but does not confirm speech output or its operating-system source.
- Fix: add a fixture-backed speech-adapter check that records the spoken utterance and documented engine boundary, or rewrite this as “Screen-reader announcements accompany results.” and test that output.

#### F-1-5 — “Cross-platform window enumeration and capture through `xcap`” is an unlisted claim

- Location: `README.md`, What ships.
- Why this matters: `release-assets` checks workflow text, and `selected-window` checks source structure. Neither confirms enumeration and capture on each named platform.
- Fix: add platform release checks that open a controlled window, list it, select it, and confirm a capture-derived result on macOS, Windows, and Linux, or narrow the sentence to supported build targets.

#### F-1-6 — The unsigned-build and SmartScreen statements are unlisted claims

- Location: landing install note and `README.md`: “Version 0.1 builds are unsigned,” “Version 0.1.4 builds are unsigned,” and “Windows may show a SmartScreen notice.”
- Why this matters: these statements affect installation decisions but have no claims entries.
- Fix: add package-signature checks for each release artifact and a documented Windows install check, or replace the conditional SmartScreen sentence with verified platform instructions.

#### F-1-7 — The third-party license statement is an unlisted claim

- Location: `README.md`: “The `ocrs` code and model project are MIT/Apache-2.0 licensed.”
- Why this matters: a user can rely on dependency licensing, but no claim check confirms the packaged dependency and its license files.
- Fix: add a dependency/license inventory check tied to the lockfile and packaged notices.

#### F-1-8 — The original-image provenance statement is an unlisted claim

- Location: landing footer and `README.md`: “Hero imagery was generated originally for this product with Azure AI Foundry.”
- Why this matters: provenance is asserted to visitors but is absent from the claims inventory.
- Fix: add a provenance claim that confirms the retained prompt and generation record match the shipped asset, or present the line as a linked provenance record without an untracked claim.

#### F-1-9 — The documented native CI command is an unlisted claim

- Location: `README.md`: “In a CI environment, `CI=true CARGO_BUILD_JOBS=1 npm run tauri build -- --bundles deb` is supported.”
- Why this matters: this is a reproducibility promise with no dedicated claim entry.
- Fix: add a CI build claim that runs the exact command in the supported Linux image and confirms the package exists.

#### F-1-10 — The brief’s success measure still has no pilot evidence

- Location: `.factory/brief.json` and `.factory/handoff.md`: “In five scripted inaccessible-app tasks, a pilot user finds the requested labeled control unaided in at least four tasks.”
- Check: the handoff still says there is no real-user pilot evidence. Automated sample checks cover one requested label.
- Why this matters: this was an earlier recorded gap and remains the product’s stated real-job success measure.
- Fix: run five representative tasks with a blind or low-vision pilot user, record task definitions and outcomes without sensitive screen content, and confirm at least four unaided completions.

#### F-1-11 — A keyboard target remains below 44px

- Location: live home and demo skip links; `site/src/style.css:7`.
- Check: the focused **Skip to main content** target measures 220×43 CSS px in desktop and mobile contexts.
- Why this matters: the earlier target-size finding is only partly resolved, and this is the first keyboard target.
- Fix: increase its vertical padding or set `min-height: 44px`; add it to the existing touch-target regression.

#### F-1-12 — Required interface text still renders below 16px

- Location: live landing step numbers at 13px, keyboard keycaps at 12px, and command-line install text at 12px; `site/src/style.css`.
- Why this matters: the product targets low-vision users, the design states a 16px content baseline, and an earlier small-text finding remains only partly resolved.
- Fix: render all meaningful labels and commands at 16px or larger. Decorative step numbers may be hidden from assistive technology, but they still need readable visual text if shown.

### High

#### F-1-13 — The 390px first screen omits the three plain facts and clips the primary action

- Location: live landing page at 390×844.
- Exact layout: **Try it with sample data** ends at y=845.7; “No image uploads” starts at y=983.7.
- Why this matters: the required mobile first-screen shape calls for the action and three privacy/offline/price facts before scrolling. The action itself loses its bottom edge. The current three-item trust line covers privacy, account use, and clicking rather than privacy, offline use, and price.
- Fix: place the copy before the hero art on narrow screens, reduce first-screen vertical spacing, and keep the full action plus facts such as “Works offline after install,” “Captures stay on this device,” and “All tools in this build are free” within 844px. Add claim coverage and a viewport-boundary regression.

### Medium

#### F-1-14 — The checked-in copy audit is stale and incomplete

- Location: `.factory/copy-audit.md`.
- Exact mismatch: it records “Version 0.1.1 builds are unsigned,” while the source says “Version 0.1 builds are unsigned.” It does not inventory README sentences, headings, questions, or interactive labels.
- Why this matters: maintainers cannot use it to confirm the current copy contract.
- Fix: regenerate the audit from current source, include the landing and README inventories below, and fail a check when audited copy changes.

#### F-1-15 — The designed 404 does not use the complete site metadata or shared chrome

- Location: live `/404.html` and unknown-path response.
- Check: the 404 has no meta description, canonical, Open Graph data, Twitter card, or apple-touch icon. Its header has only the wordmark, and its footer omits the product line, Param Factory credit, version, build, and source link.
- Why this matters: the page looks and announces differently from the rest of the site despite the consistent-header/footer requirement.
- Fix: give the 404 the shared header/footer and complete route metadata while retaining `noindex` and the 404 response.

#### F-1-16 — Route changes do not move focus to the destination heading

- Location: navigation from `/` to `/demo/` and browser Back to `/#how`.
- Check: focus remains on `BODY` after each document navigation. Back restores the `#how` scroll position correctly.
- Why this matters: keyboard and screen-reader users do not receive the required heading focus or explicit route announcement.
- Fix: on document load, focus the H1 when navigation came from another product route, or provide an equivalent announced route-change pattern. Add forward/back focus checks.

### Minor copy findings

Each item below is a separate copy flag and includes a replacement.

#### F-1-17 — “Offline visual wayfinding” is unexplained jargon

- Location: landing eyebrow.
- Why this matters: it does not name a concrete action for a first-time visitor.
- Fix: “Find controls your screen reader misses.”

#### F-1-18 — “A small, dependable loop” is a generic slogan and an untested adjective

- Location: landing How it works eyebrow.
- Why this matters: “dependable” is not established by a claim, and the line does not name the section.
- Fix: “How it works.”

#### F-1-19 — “Three keys from lost to located.” is a metaphor heading

- Location: landing How it works H2.
- Why this matters: it does not identify the three steps when heard out of context.
- Fix: “Find a visible label in three steps.”

#### F-1-20 — The audience sentence uses technical and personified wording

- Location: landing: “Built for the awkward places where accessibility metadata stops: streamed desktops, canvas interfaces, and software old enough to ignore your screen reader.”
- Why this matters: “accessibility metadata” is unexplained, and software does not literally ignore a reader.
- Fix: “Use it when remote desktops, canvas interfaces, or older software do not provide labels to your screen reader.”

#### F-1-21 — “Your action.” carries no usable information

- Location: landing product-principles strip.
- Why this matters: the phrase could apply to any product and depends on the next sentence.
- Fix: “Lens gives directions. It never clicks.”

#### F-1-22 — “Read its landmarks” changes the term for visible labels

- Location: landing step 2 heading.
- Why this matters: “landmark” is the brand metaphor, while the rest of the action uses “label.”
- Fix: “Read visible labels.”

#### F-1-23 — “Ask for the target” changes the term and hides the action

- Location: landing step 3 heading.
- Why this matters: the interface action is Find text, not an open-ended request.
- Fix: “Find a visible label.”

#### F-1-24 — “Private by construction” is a slogan

- Location: landing privacy eyebrow.
- Why this matters: it does not say what data handling the section explains.
- Fix: “How Lens handles captures.”

#### F-1-25 — “The picture disappears. The direction remains.” is a metaphor heading

- Location: landing privacy H2.
- Why this matters: it does not name when or how a capture is removed.
- Fix: “Captures are discarded after local text recognition.”

#### F-1-26 — “A precise role” is a mood label

- Location: landing comparison eyebrow.
- Why this matters: it does not identify the comparison.
- Fix: “Compare ways to find controls.”

#### F-1-27 — “Not another general screen reader.” is a negative, context-dependent heading

- Location: landing comparison H2.
- Why this matters: a heading list does not reveal what is being compared.
- Fix: “How Lens differs from a screen reader.”

#### F-1-28 — “Free local wayfinding.” uses the product’s internal metaphor

- Location: landing download H2.
- Why this matters: “wayfinding” is less concrete than the actions listed below it.
- Fix: “Use every label-finding tool for free.”

#### F-1-29 — “Command-line install options” does not name the result of activation

- Location: landing disclosure control.
- Why this matters: the control changes state but does not use an action verb.
- Fix: “Show command-line install options.”

#### F-1-30 — The README opening sentence has 28 words

- Location: `README.md`, first paragraph.
- Exact quote: “Screen Landmark Lens is a local desktop wayfinding aid for blind and low-vision workers using remote desktops, legacy applications, and other software that exposes no useful accessibility metadata.”
- Why this matters: it exceeds the 22-word cap and combines audience, product category, situations, and implementation context.
- Fix: “Screen Landmark Lens is a desktop aid for blind and low-vision workers. It finds controls in software that gives screen readers no useful labels.”

#### F-1-31 — The README release-workflow sentence has 23 words

- Location: `README.md`, Develop.
- Exact quote: “The workflow verifies that tag points to its checkout and records that exact commit in `latest.json` beside the platform assets and `SHA256SUMS`.”
- Why this matters: it exceeds the 22-word cap and combines two checks.
- Fix: “The workflow confirms that the tag points to its checkout. It records that commit in `latest.json` beside the packages and `SHA256SUMS`.”

#### F-1-32 — The README introduces technical names without plain definitions

- Location: `README.md`, opening and What ships: “OCR output,” “window enumeration,” “`ocrs` detection and recognition models,” and “Web Speech voice.”
- Why this matters: a new user must infer four implementation terms before learning their practical result.
- Fix: introduce “optical character recognition (OCR)” once; rewrite the bullets as “Lists and captures windows across supported systems,” “Includes the text-recognition models,” and “Reads results aloud through the computer’s speech voice.” Keep library names in a separate implementation note.

## One-click demo and sandbox checks

- Confirmed that the first landing action opens `/demo/` in one click.
- Confirmed that the first demo viewport shows the banner, a realistic quarterly-report window, its status, and visible controls.
- Confirmed that finding **Cancel** reports “Found OCR text ‘Cancel’, bottom right.”
- Confirmed that **Reset demo** restores the query and result for **Save**.
- Confirmed that **Start for real** returns to `/`.
- Confirmed that an unrelated localStorage sentinel remained unchanged and that the demo created no localStorage, sessionStorage, or cookie entry. The service worker did create its documented public-asset cache.
- Confirmed that all six direct demo requests stayed on `https://screen-landmark-lens.sociobot.in`.
- Confirmed that the live demo reloaded offline after service-worker control and retained the sample result.
- Confirmed that the desktop browser-safe check uses `demo:lens:speech-rate`, removes it on exit, and restores `lens:speech-rate`.

## Claims execution

Every command below was run separately after `npm ci` in a fresh clone at `/tmp/sll-review-1.wqNlOa/repo`.

| Claim | Result | Evidence |
| --- | --- | --- |
| `demo-sample` | PASS | Playwright confirmed Save at bottom right and three walkthrough frames. |
| `demo-privacy` | PASS | Playwright confirmed only the local test origin. |
| `offline-demo` | PASS | A separate browser context reloaded the demo offline. |
| `site-updates` | PASS | The worker check confirmed versioned, network-first navigations. |
| `desktop-sample` | PASS | The sample loaded and found Save. |
| `demo-mode-isolation` | PASS | Demo preference storage stayed separate and was cleared on exit. |
| `free-voice-speed` | PASS | The enabled control changed to 1.4× without an account. |
| `desktop-shortcuts` | PASS | All three documented shortcuts changed observable UI state. |
| `blank-find` | PASS | Empty Find returned the recovery instruction. |
| `ocr-uncertainty` | PASS | Sample results used nonnumeric uncertainty text. |
| `local-processing` | FAIL | Vitest rejected `--grep`; no claim test ran. |
| `selected-window` | FAIL | Vitest rejected `--grep`; no claim test ran. |
| `capture-discarded` | FAIL | Vitest rejected `--grep`; no claim test ran. |
| `guidance-only` | FAIL | Vitest rejected `--grep`; no claim test ran. |
| `no-account-required` | FAIL | Vitest rejected `--grep`; no claim test ran. |
| `release-metadata-cache` | PASS | One refresh request was cached for one hour. |
| `release-metadata-fallback` | PASS | Missing metadata retained the release-page link without console errors. |
| `unknown-route-404` | FAIL | Vitest rejected `--grep`; no claim test ran. |
| `release-assets` | FAIL | Vitest rejected `--grep`; no claim test ran. |
| `checksum-installers` | FAIL | Vitest rejected `--grep`; no claim test ran. |

## Copy audit

Word counting treats hyphenated compounds as one word. The landing has 44 complete sentences, averages 7.7 words, and has no sentence over 22 words. The README has 43 prose sentences, averages 12.7 words, and has two sentences over 22 words.

### Landing-page sentences

| ID | Sentence | Words |
| --- | --- | ---: |
| L1 | Find the control your screen reader can’t. | 7 |
| L2 | Choose one remote desktop or legacy-app window. | 7 |
| L3 | Lens reads its visible labels locally, then tells you exactly where to look—or point. | 15 |
| L4 | Screen Landmark Lens locates one visible label in a selected window. | 11 |
| L5 | One window. | 2 |
| L6 | Explicit scope every time. | 4 |
| L7 | On your device. | 3 |
| L8 | OCR never leaves it. | 4 |
| L9 | Your action. | 2 |
| L10 | Lens guides; it never clicks. | 5 |
| L11 | Built for the awkward places where accessibility metadata stops: streamed desktops, canvas interfaces, and software old enough to ignore your screen reader. | 22 |
| L12 | Lens lists visible windows. | 4 |
| L13 | You explicitly pick the one it may capture. | 8 |
| L14 | Bundled OCR runs offline and speaks visible labels in reading order. | 11 |
| L15 | Type “Save” and hear “bottom right.” | 6 |
| L16 | Likely buttons are clearly marked as estimates. | 7 |
| L17 | Captures live only in memory long enough for local OCR. | 10 |
| L18 | They are discarded immediately after recognition. | 6 |
| L19 | Lens has no telemetry, cloud vision service, remote control, or hidden full-screen capture. | 13 |
| L20 | May have nothing to announce. | 5 |
| L21 | Reads rendered pixels locally. | 4 |
| L22 | Requires another person and sharing context. | 6 |
| L23 | Window capture, OCR, label reading, text finding, directional cues, and voice-speed controls are free. | 14 |
| L24 | The app asks before it captures one visible window. | 9 |
| L25 | Purchasing is not available in this build. | 7 |
| L26 | All shipped wayfinding features work without an account. | 8 |
| L27 | Version 0.1 builds are unsigned. | 6 |
| L28 | On macOS, right-click the app and choose Open. | 8 |
| L29 | Windows may show a SmartScreen notice. | 6 |
| L30 | Can Lens click a button for me? | 7 |
| L31 | No. | 1 |
| L32 | It gives a directional cue and keeps you in control. | 10 |
| L33 | It does not move the pointer, press keys, or operate the target app. | 13 |
| L34 | Does OCR always get the label right? | 7 |
| L35 | No. | 1 |
| L36 | Lens identifies every result as OCR text instead of showing an invented percentage. | 13 |
| L37 | It may miss or misread small, stylized, moving, or low-contrast text. | 11 |
| L38 | Enlarge the window or increase contrast and capture again. | 9 |
| L39 | Does it work without internet? | 5 |
| L40 | Yes. | 1 |
| L41 | After installation, window capture and OCR run locally. | 8 |
| L42 | Use the website only to download a release or read its documentation. | 12 |
| L43 | A local visual landmark finder by Param Factory. | 8 |
| L44 | Hero imagery was generated originally for this product with Azure AI Foundry. | 12 |

### Landing headings and interactive labels

| Copy | Words | Check |
| --- | ---: | --- |
| Offline visual wayfinding | 3 | F-1-17 |
| A small, dependable loop | 4 | F-1-18 |
| Three keys from lost to located. | 6 | F-1-19 |
| Choose one window | 3 | Clear |
| Read its landmarks | 3 | F-1-22 |
| Ask for the target | 4 | F-1-23 |
| Private by construction | 3 | F-1-24 |
| The picture disappears. | 3 | F-1-25 |
| The direction remains. | 3 | F-1-25 |
| A precise role | 3 | F-1-26 |
| Not another general screen reader. | 5 | F-1-27 |
| Install the desktop app | 4 | Clear |
| Free local wayfinding. | 3 | F-1-28 |
| Before you install | 3 | Clear |
| Product limits and recovery steps. | 5 | Clear |
| Try it with sample data | 5 | Result-naming action |
| Download for Linux | 3 | Result-naming action |
| Read the plain-language privacy policy | 5 | Result-naming action |
| Try the sample project first | 5 | Result-naming action |
| Command-line install options | 3 | F-1-29 |

### README sentences and headings

| ID | Copy | Words | Check |
| --- | --- | ---: | --- |
| R1 | Screen Landmark Lens | 3 | Heading; clear |
| R2 | Screen Landmark Lens is a local desktop wayfinding aid for blind and low-vision workers using remote desktops, legacy applications, and other software that exposes no useful accessibility metadata. | 28 | F-1-30 |
| R3 | Pick one visible window, capture it, hear its labels, find text, and get a plain directional cue such as “bottom right.” | 21 | Clear |
| R4 | Lens does not upload captures, control the pointer, click controls, or replace a screen reader. | 15 | Clear |
| R5 | OCR output is explicitly uncertain and is not medical or professional advice. | 12 | F-1-32 |
| R6 | Live site: https://screen-landmark-lens.sociobot.in | 6 | Clear |
| R7 | What ships | 2 | Heading; clear |
| R8 | Tauri 2 desktop app for macOS, Windows, and Linux | 9 | Technical inventory |
| R9 | Cross-platform window enumeration and capture through xcap | 7 | F-1-5, F-1-32 |
| R10 | Bundled ocrs detection and recognition models for offline OCR | 9 | F-1-32 |
| R11 | Keyboard-first label reading (Alt+Shift+L), text finding (Alt+Shift+F), and likely-button descriptions (Alt+Shift+B) | 17 | Clear |
| R12 | Spoken feedback through the operating system’s Web Speech voice | 9 | F-1-4, F-1-32 |
| R13 | Bundled sample project: find Save, Print, Cancel, and a status label before capturing a real window | 16 | Clear |
| R14 | Free wayfinding and voice-speed preference controls; no account or purchase is required in this build | 15 | Listed claims |
| R15 | Static download site, privacy and terms pages, versioned service worker, and checksum-verifying installers | 13 | Technical inventory |
| R16 | Install | 1 | Heading; clear |
| R17 | Download the detected platform build from the latest release, or use: | 11 | Clear |
| R18 | Version 0.1.4 builds are unsigned. | 7 | F-1-6 |
| R19 | On macOS, right-click the installed app and choose Open the first time. | 12 | Clear instruction |
| R20 | Windows may show a SmartScreen notice. | 6 | F-1-6 |
| R21 | Screen-capture permission is requested by the operating system when needed. | 10 | Listed selected-window claim |
| R22 | Develop | 1 | Heading; clear |
| R23 | Requirements: Node.js 22+, stable Rust, and the Tauri 2 system dependencies. | 12 | Technical context |
| R24 | On Debian/Ubuntu, the release workflow lists the complete package set, including WebKitGTK, PipeWire, GBM, and Clang. | 17 | Technical context |
| R25 | The factory’s static deploy uses the exact command `npm run build:site` and publishes `dist/site` (whose root contains `index.html`). | 21 | Technical context |
| R26 | Native binaries are built only in GitHub Actions from a `v*` tag. | 12 | Listed release-assets claim |
| R27 | The workflow verifies that tag points to its checkout and records that exact commit in `latest.json` beside the platform assets and `SHA256SUMS`. | 23 | F-1-31 |
| R28 | In a CI environment, `CI=true CARGO_BUILD_JOBS=1 npm run tauri build -- --bundles deb` is supported. | 18 | F-1-9 |
| R29 | Demo and checks | 3 | Heading; clear |
| R30 | Open `/demo/` for an isolated, one-click sample. | 7 | Clear |
| R31 | The desktop app also has Load sample project on its first screen. | 12 | Listed desktop-sample claim |
| R32 | The sample data is bundled, uses no real capture, and is discarded with Start for real. | 16 | Listed demo claim |
| R33 | See `.factory/demo.md` and `.factory/claims.json` for exact claim coverage. | 12 | F-1-14 |
| R34 | The service worker uses versioned caches and serves navigation requests from the network whenever online, so deployed fixes replace an older shell. | 22 | Listed site-updates claim |
| R35 | Run the complete local suite with: | 6 | Clear instruction |
| R36 | Privacy | 1 | Heading; clear |
| R37 | Captured pixels exist in memory only during OCR and are dropped when analysis returns. | 14 | Listed capture-discarded claim |
| R38 | Voice speed is stored locally. | 5 | Listed demo-isolation check |
| R39 | In demo mode, it uses a separate `demo:lens:speech-rate` key; Start for real clears that key and restores the regular preference. | 22 | Listed demo-isolation claim |
| R40 | The website demo stores nothing. | 5 | F-1-3 |
| R41 | All shipped wayfinding features are free and need no account or purchase. | 12 | Listed no-account claim |
| R42 | The landing page asks api.github.com for current release metadata at most once per hour in a browser. | 19 | Listed metadata-cache claim |
| R43 | If metadata is unavailable, its download buttons keep a direct link to the Release page. | 15 | Listed metadata-fallback claim |
| R44 | The website privacy policy describes this request. | 7 | Confirmed in `/privacy/` |
| R45 | The ocrs code and model project are MIT/Apache-2.0 licensed. | 11 | F-1-7 |
| R46 | The generated hero is original to this project; its prompt and review record are in `assets/src/`. | 17 | F-1-8 |
| R47 | See `.factory/design.md` for the visual system and `.factory/handoff.md` for verification and release notes. | 17 | Clear instruction |
| R48 | License | 1 | Heading; clear |
| R49 | MIT. | 1 | Clear |
| R50 | See LICENSE. | 2 | Clear instruction |

No banned plain-words terms appear in the landing or README. F-1-22 and F-1-23 record the inconsistent use of control, label, landmark, and target for the requested visible item.

## Structure, accessibility, and privacy results

- Confirmed titles, `lang=en`, one H1, one main landmark, descriptions, canonicals, Open Graph data, Twitter cards, favicon, and 180×180 apple-touch icon on `/`, `/demo/`, `/privacy/`, and `/terms/`.
- Confirmed that the social image is 1200×630 and product-specific.
- Confirmed that an unknown route returns HTTP 404 with the designed page.
- Confirmed that all 17 unique links crawled from the main routes and 404 return HTTP 200 after redirects where applicable.
- Confirmed that browser Back restores `/#how` and approximately the same scroll position.
- Confirmed no console errors and no horizontal overflow at 390px across the checked routes.
- Confirmed no serious or critical axe results on the main routes at desktop/mobile sizes; the repository suite also confirms dark and light themes.
- Confirmed a visible first-focus skip link and reduced-motion CSS in both site and app.
- Confirmed no third-party font or script requests. The landing uses same-origin assets and may use the disclosed GitHub metadata request after its local cache expires.
- Confirmed built site JavaScript is 3.99KB raw and 1.82KB gzip.
- Confirmed the midnight paper-garden art, brass sight-line, serif/sans pairing, clipped surfaces, palette, and restrained motion form a distinct identity rather than a generic software template.

## Clean build and broader checks

The documented Linux desktop packages were installed before the native check.

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 77 packages, 0 audit findings |
| `npm test` | PASS; TypeScript, 14 Vitest checks, 4 Rust checks |
| `npm run test:web` | PASS; 34/34 |
| `npm run test:app-web` | PASS; 18/18 |
| `npm run build` | PASS; `dist/app` and `dist/site` produced |
| `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check` | PASS |
| `/opt/fleet/lib/verify-url.sh <url> <evidence-dir>` | PASS; HTTP 200, title/lang/H1/main/alt, zero console errors |
| Live/build byte comparison | PASS for landing HTML, demo HTML, JS, and CSS |

## Earlier finding recheck

Every earlier verification and the current handoff were read. No earlier `review-*.md` or `polish-*.md` file exists.

| Earlier finding | Current confirmation |
| --- | --- |
| Claims contract absent / claims missing | Not fully resolved: 20 entries exist, but eight commands fail and unlisted claims remain. See F-1-1 through F-1-9. |
| One-click demo absent | Resolved on live site and desktop source. |
| Broken purchase path | Resolved by removing purchasing and stating that it is unavailable. |
| Invented OCR confidence | Resolved; results use nonnumeric uncertainty language. |
| Service-worker updates may stay stale | Resolved; versioned network-first navigation check passes. |
| Voice speed was paid | Resolved; the control is enabled without an account. |
| Unknown paths returned home | Resolved; unknown paths return the designed 404 with status 404. |
| Missing framing policy | Resolved in live response headers. |
| Interactive targets below 44px | Not fully resolved; the focused skip link is 43px high. See F-1-11. |
| Supporting text below 16px | Not fully resolved; 12–13px meaningful text remains. See F-1-12. |
| Rust formatting failed | Resolved; the formatting check passes. |
| Landing metadata/footer incomplete | Resolved on main routes; the 404 has a separate completeness issue in F-1-15. |
| Empty Find had no recovery instruction | Resolved in website and desktop samples. |
| Copy audit absent | Partly resolved; the file exists but is stale and incomplete. See F-1-14. |
| AVIF MIME type wrong | Resolved in deployment configuration and live response. |
| Documented native build command rejected CI value | Previously confirmed resolved; launcher logic remains present. |
| Published desktop release was stale | Resolved; v0.1.4 points to `18bf381`, and product code after that tag is unchanged. |
| Demo banner appeared in real mode and retained demo preference | Resolved by `[hidden]` styling and the passing isolation check. |
| Focused light-theme skip link had low contrast | Resolved by current styles and the passing focused axe check. |
| Obsolete Plus FAQ remained | Resolved; it is absent. |
| Release metadata fetched on every cold visit | Resolved with one-hour storage and a static first-visit bootstrap. |
| Demo omitted from sitemap / legal metadata incomplete | Resolved for demo, privacy, and terms. |
| No five-task pilot evidence | Not resolved. See F-1-10. |

## Missed leverage

No additional AI, import/export, or sync feature is an obvious fit for the brief. Sending screen captures to a model would conflict with the explicit local-processing and no-cloud-image non-goals. The most valuable next evidence is the existing five-task pilot, not a new network feature.

## What would make this perfect

Confirm all 20 claim commands run as written and produce outcome evidence; remove or test every unlisted claim; complete the five-task pilot; place the mobile action and three facts fully above the fold; restore the 16px and 44px baselines; complete the 404 chrome/metadata and route focus behavior; and apply every copy rewrite above. A new review should then rerun this full checklist from a fresh clone and fresh browser contexts.
