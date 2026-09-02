# Screen Landmark Lens — polish round 3

Final candidate: `v0.1.10` from the immutable-release workflow. The full source, demo, privacy, offline, release, accessibility, and copy checks are recorded in `.factory/handoff.md`.

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained runnable `-t`/`--grep` claim commands. | `claims contract`; every command in `.factory/claims.json`. |
| F-1-2 | Retained native fixtures, browser outcomes, installer execution, and published manifest checks. | `npm test`; tagged claim sweep. |
| F-1-3 | Kept website-demo storage wording scoped to unsaved searches; documented public offline cache separately. | `@claim:website-demo-storage`, `@claim:offline-demo`. |
| F-1-4 | Kept the tested screen-reader-announcement wording. | `@claim:screen-reader-announcements`. |
| F-1-5 | Kept only supported build-target and selected-window wording. | `@claim:release-assets`, `@claim:selected-window`. |
| F-1-6 | Kept the tested unsigned-package statement without SmartScreen prediction. | `@claim:package-signatures`. |
| F-1-7 | Kept the locked license inventory. | `@claim:dependency-licenses`. |
| F-1-8 | Kept the linked, hash-bound hero provenance record. | `@claim:image-provenance`. |
| F-1-9 | Kept unsupported CI-build promises removed. | `npm run test:copy`. |
| F-1-10 | Removed the participant-pilot release metric. The brief now uses a sandbox-verifiable five-label keyboard measure. | `@claim:sample-keyboard-five-labels`; `.factory/pilot-evidence.md`. |
| F-1-11 | Kept all site and app targets at 44 px or higher. | Touch-target browser regressions; live `verify:live`. |
| F-1-12 | Kept meaningful site and app text at 16 px or higher. | Text-size browser regressions; live `verify:live`. |
| F-1-13 | Kept the full action and three tested facts above 844 px. | Mobile browser regression and `.factory/evidence/live/screenshot-mobile.png`. |
| F-1-14 | Regenerated the audited, source-hashed copy inventory. | `npm run test:copy`; `.factory/copy-audit.md`. |
| F-1-15 | Kept the metadata-complete shared-chrome 404. | `@claim:unknown-route-404`; live unknown-route check. |
| F-1-16 | Kept cross-document and Back heading focus. | Route focus browser regression; live demo exit. |
| F-1-17 | Kept the concrete control-finding eyebrow. | `npm run test:copy`. |
| F-1-18 | Kept the concrete “How it works” section name. | `npm run test:copy`. |
| F-1-19 | Kept the three-step task heading. | `npm run test:copy`. |
| F-1-20 | Kept concrete missing-label audience wording. | `npm run test:copy`. |
| F-1-21 | Kept “Lens gives directions. It never clicks.” | `@claim:guidance-only`. |
| F-1-22 | Kept “Read visible labels.” | `npm run test:copy`. |
| F-1-23 | Kept “Find a visible label.” | `npm run test:copy`. |
| F-1-24 | Kept capture-handling section wording. | `@claim:capture-discarded`. |
| F-1-25 | Kept only the tested returned-result capture boundary. | `@claim:capture-discarded`. |
| F-1-26 | Kept the concrete comparison heading. | `npm run test:copy`. |
| F-1-27 | Kept the screen-reader comparison heading. | `npm run test:copy`. |
| F-1-28 | Kept label-finding terminology in free-feature copy. | `@claim:no-account-required`. |
| F-1-29 | Kept the action-named installer disclosure. | `npm run test:copy`. |
| F-1-30 | Kept the short README opening. | `npm run test:copy`. |
| F-1-31 | Kept short, plain release instructions. | `npm run test:copy`. |
| F-1-32 | Defined optical character recognition once and used plain text-recognition copy first. | `npm run test:copy`; landing terminology regression. |
| F-2-1 | Published a new immutable candidate release from the final checkout. | `@claim:release-assets`; live `/release.json`; release `v0.1.10`. |
| F-2-2 | Kept shared wordmark, four-link header, and versioned footer on every public route. | Public-route chrome regression; live `/`, `/demo/`, `/privacy/`, `/terms/`, and 404. |
| F-2-3 | Removed broad in-memory/immediate-discard privacy wording. | `@claim:capture-discarded`. |
| F-2-4 | Kept privacy guarantees separate and outcome-tested. | `@claim:selected-window`, `@claim:guidance-only`, copy regression. |
| F-2-5 | Kept label-finding terminology. | `npm run test:copy`; app smoke. |
| F-2-6 | Kept “Find a visible label” in the walkthrough. | Demo terminology regression; live `/demo/`. |
| F-3-1 | Candidate site, release, manifest, checksums, and source are one immutable identity. | `VERIFY_PUBLISHED_RELEASE=1 npm run test:shared -- -t @claim:release-assets`; live `/release.json`. |
| F-3-2 | Replaced “Captures stay on this device” with the tested returned-result boundary. | `@claim:capture-discarded`; live first-screen fact. |
| F-3-3 | Replaced the desktop-install offline promise with the tested website-sample offline fact. | `@claim:offline-demo`; live first-screen fact. |
| F-3-4 | Replaced unproven desktop/popup assurances with “This website sample uses bundled data only.” | `@claim:demo-bundled-data`; live `/demo/?demo=1`. |
| F-3-5 | Replaced “exactly where” with a coarse-direction example. | Landing terminology regression; live home lead. |
| F-3-6 | Replaced unexplained OCR/metadata wording with “Text recognition,” one OCR definition, and “When an app has no labels.” | `npm run test:copy`; live home. |

Live evidence is under `.factory/evidence/live/`, including mobile and desktop screenshots, offline-reload evidence, route axe results, and the final cold-route report.
