# Screen Landmark Lens — polish round 2

Candidate source: `v0.1.8` tag (the published-release claim verifies its exact commit)  
Release: `v0.1.8` (immutable release and live-site evidence recorded in the handoff after publication)

## Review 1 carry-forward map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Claim commands use Vitest `-t` and Playwright `--grep`. | `claims contract`; every command in `.factory/claims.json`. |
| F-1-2 | Claims exercise native fixtures, browser flows, installers, manifests, and release reports instead of only source strings. | `npm test`; all tagged claim commands. |
| F-1-3 | Website-demo copy distinguishes unsaved searches from public offline caches. | `@claim:website-demo-storage`; `@claim:offline-demo`. |
| F-1-4 | Speech-engine wording was narrowed to screen-reader announcements. | `@claim:screen-reader-announcements`. |
| F-1-5 | README describes build targets and a selected-window picker, not unverified platform capture behavior. | `@claim:release-assets`; `@claim:selected-window`. |
| F-1-6 | Package-signature copy names the verified unsigned state without predicting SmartScreen behavior. | `@claim:package-signatures`. |
| F-1-7 | Recognition licenses remain in the checked notice inventory. | `@claim:dependency-licenses`. |
| F-1-8 | Hero provenance remains linked to its retained record. | `@claim:image-provenance`. |
| F-1-9 | Unsupported CI-build wording remains removed. | `npm run test:copy`. |
| F-1-10 | The untestable participant result is now planned field research, never a release/product assertion. | `.factory/brief.json`; `.factory/pilot-evidence.md`; copy audit. |
| F-1-11 | Skip links and interactive controls retain a 44px minimum. | Site/app touch-target regressions; live verifier. |
| F-1-12 | Meaningful site and app text remains at least 16px. | Site/app text-size regressions; live verifier. |
| F-1-13 | The mobile first screen keeps the action and all three facts in 390×844. | `390px first screen includes the complete action and three facts`; screenshot path in test. |
| F-1-14 | The generated copy audit is current and source-hashed. | `npm run test:copy`; `.factory/copy-audit.md`. |
| F-1-15 | The designed 404 has route metadata and shared chrome. | `@claim:unknown-route-404`; `all public routes keep the same product chrome`. |
| F-1-16 | Cross-document navigation and Back focus the new H1. | `route navigation and Back move focus to the destination heading`; live verifier. |
| F-1-17 | Landing eyebrow uses plain control-finding words. | `npm run test:copy`. |
| F-1-18 | The process section uses the concrete heading “How it works.” | `npm run test:copy`. |
| F-1-19 | The three-step heading names the task. | `npm run test:copy`. |
| F-1-20 | The audience sentence uses concrete missing-label language. | `npm run test:copy`. |
| F-1-21 | Guidance-only copy states that Lens gives directions and never clicks. | `@claim:guidance-only`. |
| F-1-22 | The reading step consistently calls results visible labels. | `npm run test:copy`. |
| F-1-23 | The finding step consistently calls the request a visible label. | `npm run test:copy`. |
| F-1-24 | Privacy section heading describes capture handling. | `npm run test:copy`. |
| F-1-25 | Capture copy now states only the tested returned-result boundary. | `@claim:capture-discarded`; `privacy and terminology copy only make tested promises`. |
| F-1-26 | The comparison section uses a concrete heading. | `npm run test:copy`. |
| F-1-27 | The comparison heading names screen-reader differences. | `npm run test:copy`. |
| F-1-28 | Free-feature copy says label-finding, not wayfinding. | `npm run test:copy`; `@claim:no-account-required`. |
| F-1-29 | The installer disclosure names the command-line install result. | `npm run test:copy`. |
| F-1-30 | README opening remains split into short audience and job sentences. | `npm run test:copy`. |
| F-1-31 | README release instructions remain short and plain. | `npm run test:copy`. |
| F-1-32 | README defines OCR and avoids implementation-first copy. | `npm run test:copy`. |

## Review 2 map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Versioned the app, release bootstrap, claims, legal copy, and build identity to `0.1.8`; tagged this source as immutable `v0.1.8`. | `VERIFY_PUBLISHED_RELEASE=1 npm run test:shared -- -t @claim:release-assets`; live `/release.json`; live home release meta. |
| F-1-10 | Reframed the absent participant result as planned field research, with automated pre-pilot evidence clearly separated. | `.factory/brief.json`; `.factory/pilot-evidence.md`. |
| F-2-2 | Every public route now uses the Landmark Lens wordmark and Demo / How it works / Privacy / Download header, plus the same footer content. | `all public routes keep the same product chrome`; live `/`, `/demo/`, `/privacy/`, `/terms/`, and unknown-route check. |
| F-2-3 | Removed “in memory” and immediate-discard assertions. Landing, README, and Privacy now state only that returned recognition results contain labels/directions rather than capture pixels. | `@claim:capture-discarded`; `privacy and terminology copy only make tested promises`. |
| F-2-4 | Removed the unproven no-telemetry/cloud/hidden-capture bundle. Capture selection and guidance claims are stated separately. | `@claim:selected-window`; `@claim:guidance-only`; privacy-copy regression. |
| F-2-5 | Replaced README “wayfinding” with “label-finding”; app chrome uses the same term. | `npm run test:copy`; browser app smoke test. |
| F-2-6 | Replaced the demo walkthrough “Find a target” with “Find a visible label,” including the illustration’s accessible name. | `privacy and terminology copy only make tested promises`; live `/demo/`. |

## Verification set

- `npm test`
- `npm run build`
- `npm run test:web`
- `npm run test:app-web`
- `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check`
- `CARGO_BUILD_JOBS=1 cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings`
- Every exact command in `.factory/claims.json` from a clean clone after `v0.1.8` publication
- `EXPECTED_RELEASE_COMMIT=098c2ea763bff4cb1104901651d5a85493e1821d npm run verify:live`
