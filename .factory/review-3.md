# Screen Landmark Lens — adversarial first-read review 3

## Verdict: FAIL

Review date: 2026-09-02 UTC  
Reviewed checkout: `dcff28998f0f8325862b082944ca9eb6596411fb`  
Live site: <https://screen-landmark-lens.sociobot.in>

Two blocking findings remain. The current checkout cannot prove that the release offered on the live site was built from this checkout, and the required blind or low-vision participant pilot has still not happened. The live landing and sample are otherwise clear and usable on the checked phone and desktop layouts.

## Cold first read

Fresh browser contexts opened `/` before scrolling at 390×844 and 1440×900.

- What it does: finds a visible control that a screen reader cannot identify and gives a direction.
- For whom: a screen-reader user using a remote desktop, an older application, or another app without useful labels.
- What to do first: select **Try it with sample data**.

All three answers are present on both first screens. On 390 px, the primary action and all three facts finish at y=582.34, inside the 844 px viewport. This gate passes.

## Findings

### Blocking

#### F-3-1 — The current checkout fails the declared published-release claim

- Location: `.factory/claims.json` `release-assets`; `shared/static-deploy.test.ts:145`; live `/release.json`; GitHub release `v0.1.8`.
- Exact command and result: `VERIFY_PUBLISHED_RELEASE=1 npm run test:shared -- -t @claim:release-assets` was run in a clean clone at `dcff28998f0f8325862b082944ca9eb6596411fb`. It failed with `Expected: "dcff28998f0f8325862b082944ca9eb6596411fb"` and `Received: "4e6dfa98465742596af99f794f3297cb7b0805f1"`.
- Live confirmation: `/release.json` and the immutable GitHub release both name `4e6dfa98465742596af99f794f3297cb7b0805f1`, while `git rev-parse HEAD` is `dcff28998f0f8325862b082944ca9eb6596411fb`.
- Why this fails a first visit: the download link, release identity, README, and claims do not identify one reviewed artifact. A desktop-app visitor cannot verify which source the offered packages represent.
- Concrete fix: publish a new immutable version from this reviewed checkout (or review the exact tagged checkout instead), update the site release identity, and rerun the exact command from that tagged clean clone. Do not retarget `v0.1.8`.

#### F-1-10 — The required human pilot evidence is still absent

- Location: `.factory/brief.json` success measure and `.factory/pilot-evidence.md`.
- Exact quote: the brief requires a blind or low-vision participant to complete at least four of five scripted tasks. The evidence says, **“This worker had no human participant.”**
- Why this remains blocking: the five successful rows are a browser fixture. They do not establish that the stated user can use the installed product on inaccessible job software. This is the earlier finding with the same id and is not fixed.
- Concrete fix: run five representative installed-app tasks with a consenting blind or low-vision participant. Record consent-safe task definitions, unaided outcomes, and observations; show at least four successes. Keep the automated fixture as regression coverage only.

### Medium

#### F-3-2 — “Captures stay on this device” is a broader, unlisted privacy claim

- Location: landing first-screen fact: **“Captures stay on this device.”** README: **“Lens does not upload captures.”**
- Check: `local-processing` proves that bundled recognition models analyze an in-memory fixture without a service. `capture-discarded` only proves that the returned serialized result has no pixel field. Neither test observes a real native capture's network traffic or temporary/app-data writes.
- Why this misleads: the visitor is asked to trust a capture-handling guarantee that the listed tests do not prove.
- Concrete fix: add a `native-capture-stays-local` claim with a controlled native capture, request logging, and configured app-data/temp inspection; or narrow the fact to **“Recognition results do not include capture pixels.”**

#### F-3-3 — “Works offline after install” has no desktop-install claim

- Location: landing first-screen fact: **“Works offline after install.”**
- Check: `offline-demo` reloads the website sample after a first visit. `local-processing` loads models from a fixture. Neither installs or starts the released desktop package with networking disabled.
- Why this misleads: the wording is about the downloadable desktop app, while the available outcome test is about the website demo.
- Concrete fix: add an `installed-desktop-offline` claim that starts a packaged app with network disabled, loads the bundled sample, and finds Save; or say **“Try the website sample offline after its first visit.”**

#### F-3-4 — Demo isolation copy makes unlisted desktop-safety promises

- Location: live `/demo/` banner and lead: **“This sample mirrors a legacy form and never opens another window.”** and **“then leaves the real desktop untouched.”**
- Check: `demo-sample` proves the Save direction and `website-demo-storage` proves the search does not persist. Neither asserts that the browser demo opens no new window or that it cannot affect a desktop.
- Why this matters: those are precisely the safety guarantees that make a first-time visitor comfortable trying the sample.
- Concrete fix: add a browser claim that asserts no popup/new-page event and no desktop/native bridge access during the demo, or replace both lines with **“This website sample uses bundled data only.”** and test that wording through the existing sandbox flow.

#### F-3-5 — The hero promises an exact result despite stated OCR uncertainty

- Location: landing lead: **“Lens reads its visible labels locally, then tells you exactly where to look—or point.”**
- Check: the product’s own FAQ says OCR **“may miss or misread”** text, and its sample offers only a coarse direction such as **“bottom right.”** There is no claim for an exact location guarantee.
- Why this matters: “exactly” contradicts the nearby uncertainty disclosure and can make a user over-trust an estimate.
- Concrete fix: **“Lens reads visible labels locally, then gives a direction such as ‘bottom right.’”**

### Minor

#### F-3-6 — Landing copy uses unexplained OCR and metadata jargon

- Location: live landing: **“OCR runs there.”**, **“Bundled OCR runs offline”**, and comparison heading **“When metadata is absent.”**
- Why this matters: a cold visitor is asked to understand implementation terms before the page explains optical character recognition. The README defines OCR, but the landing page does not.
- Concrete fix: write **“Text recognition runs on your device.”** on the first screen; introduce **“optical character recognition (OCR)”** once in the process section; change the table heading to **“When an app has no labels.”**

## Copy audit

`npm run test:copy` passes. The complete line-by-line landing and README sentence, heading, question, and control inventory with word counts is `.factory/copy-audit.md`; it is generated from the exact reviewed sources and records hashes `site/index.html=119a59f38036dceb7ef1e1ff2b087793216fbe1d24600509cb00bf7b81c0aefc` and `README.md=a88989ef04d5ec892838b831632949906094e6901566f9dcc6efb6e15fd84cb7`.

Every inventoried sentence is 22 words or fewer. No listed banned marketing adjective appears. Buttons use result-naming verbs: **Try it with sample data**, **Download the desktop app**, **Read the plain-language privacy policy**, **Download for your computer**, **Try the sample project first**, **Show command-line install options**, **Reset demo**, and **Find sample label**. All headings name their sections. The exceptions found by this review are F-3-5 (an overstatement) and F-3-6 (jargon); their concrete rewrites are above.

## Demo and sandbox

- From the landing page, **Try it with sample data** reached `/demo/?demo=1` in one navigation.
- The first demo view already showed the sample quarterly-report window, `Status: Ready to submit`, Print/Save/Cancel, a filled Save query, and **“Found OCR text ‘Save’, bottom right.”**
- The persistent banner was visible. **Reset demo** restored the Save query and result. **Start for real** returned home and focused the home H1.
- A fresh direct demo context made requests only to `https://screen-landmark-lens.sociobot.in`; it created no cookie, search, or sample-change storage. The landing-to-demo path created the documented release-metadata cache before entering demo; this is not sample data, but the broad privacy wording is covered by F-3-2 through F-3-4.
- A dedicated fresh context loaded the live demo before going offline, then reloaded it offline successfully.

## Claims and clean-clone checks

A clean clone was created at `/tmp/sll-review-3`, followed by `npm ci` and installation of the Linux Tauri prerequisites listed in `.github/workflows/release.yml`. The first bare-container native attempt correctly failed because `glib-2.0` was absent; the documented prerequisites fixed that environment condition.

All 28 exact claim commands were run from that clean clone. Twenty-seven passed, including the website demo/privacy/storage/offline checks, desktop sample/isolation/keyboard/speech checks, local-model capture checks, installer checks, signatures, licenses, and image provenance. `release-assets` failed exactly as F-3-1. A claim suite cannot be accepted while any declared command fails.

`npm test`, `npm run build`, `npm run test:web` (50 tests), and `npm run test:app-web` (28 tests) completed locally; Playwright recorded `status: passed`. The local browser preview generates its release identity from the current checkout, so it does not replace the failing immutable-publication check above.

## Earlier-finding recheck

I read `review-1.md`, `review-2.md`, `polish-1.md`, `polish-2.md`, every verification record, the pilot record, and the prior handoff.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 through F-1-9 | Source and current demo checks remain present; the candidate-bound release assertion regresses as F-3-1. |
| F-1-10 | **Unfixed and carried forward as blocking F-1-10.** |
| F-1-11 through F-1-16 | Fixed in the live 390px check: 44px controls, 16px visible content, first-screen facts, current copy audit, designed 404, and H1 focus on navigation/Back. |
| F-1-17 through F-1-32 | Fixed except that F-3-6 identifies remaining OCR/metadata jargon on the landing. |
| F-2-1 | Regressed as F-3-1 because this review’s required checkout is newer than `v0.1.8`. |
| F-2-2 | Fixed: home, demo, privacy, terms, and designed 404 have the same Landmark Lens wordmark, four-link nav, and versioned footer. |
| F-2-3 and F-2-4 | The previous over-broad privacy copy was removed, but the new broader hero capture promise remains insufficiently tested as F-3-2. |
| F-2-5 and F-2-6 | Fixed: the README uses label-finding and the walkthrough says Find a visible label. |

## Structure, access, links, identity, and leverage

- Live `/`, `/demo/`, `/privacy/`, `/terms/`, and an unknown address were checked at 390px. Each known route had its route title, one H1, main landmark, description, canonical, favicon, Apple touch icon, shared header/footer, and no observed console error. The unknown address returned the designed 404 with HTTP 404.
- The home title follows the required pattern. Route titles are **Demo — Screen Landmark Lens**, **Privacy — Screen Landmark Lens**, and **Terms — Screen Landmark Lens**. The footer links and crawled same-site, GitHub source, issue, provenance, and Linux AppImage links returned 200.
- The sample’s direct request log stayed same-origin. No third-party font/script request was observed. The landing release metadata fallback is the separately disclosed `api.github.com` request.
- The midnight cut-paper garden, brass sight-line, editorial serif/interface pairing, surveying lines, and reduced-motion treatment match `.factory/design.md` and are product-specific rather than a generic SaaS template.
- No missing AI, import/export, or sync feature is evident. The brief’s local-only selected-window boundary makes an AI upload or sync feature contrary to the stated job and privacy constraints. No provider key appears in source.

## What would make this perfect

Publish an immutable desktop release tied to the exact reviewed checkout, complete the real participant pilot, replace the five unlisted/overstated safety promises with tested claims or the proposed plain wording, and remove the remaining OCR/metadata jargon. Then rerun the full clean-clone claim sweep and this entire first-read review.
