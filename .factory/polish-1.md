# Screen Landmark Lens — polish round 1

Candidate version: 0.1.5  
Review source: `.factory/review-1.md` at `f3bb467abcff2408e85ad356c989f44e3bf6b6c4`

Every review item is mapped below. “Live” is completed after the tagged release and static deployment.

| Finding | Change made | Evidence | Live |
| --- | --- | --- | --- |
| F-1-1 | Replaced all eight invalid Vitest `--grep` commands with `-t`; added a manifest regression for every command and unique tag. | `claims contract > gives every unique claim one runnable tagged test`; every command in `.factory/claims.json` | Pending deployment |
| F-1-2 | Replaced source-string claims with native fixture execution, serialized result checks, installer execution, CI signature reports, and published-release checks. | `@claim:local-processing`, `selected-window`, `capture-discarded`, `checksum-installers`, `release-assets`, `package-signatures` | Pending deployment |
| F-1-3 | Rewrote website storage wording to distinguish user data from public service-worker caches; added a storage outcome claim. | `@claim:website-demo-storage`, `@claim:offline-demo` | Pending `/demo/` check |
| F-1-4 | Replaced the Web Speech implementation claim with screen-reader announcement wording and a recorded adapter check. | `@claim:screen-reader-announcements` | Pending `/demo/` check |
| F-1-5 | Narrowed README copy to release build targets and a one-selection window picker. | `@claim:release-assets`, `@claim:selected-window` | Pending release check |
| F-1-6 | Removed the SmartScreen prediction; changed copy to the tested “no publisher signature” statement. CI now records Linux, macOS, and Windows signature outcomes. | `@claim:package-signatures` | Pending release check |
| F-1-7 | Added `THIRD_PARTY_NOTICES.md` and compared locked OCR dependencies with Cargo metadata. | `@claim:dependency-licenses` | Pending README link check |
| F-1-8 | Linked a provenance record and bound the retained source image to its prompt/model record with SHA-256. | `@claim:image-provenance` | Pending footer check |
| F-1-9 | Removed the unsupported CI-build promise. The release workflow remains the documented package path. | Copy audit; README search contains no removed sentence | Pending README source check |
| F-1-10 | Added a repeatable five-task keyboard/speech-output trial with 5/5 results. The record explicitly avoids presenting automation as a human study. | `five scripted label-finding tasks complete by keyboard with spoken directions`; `.factory/evidence/polish-1-five-task-trial.png`; `.factory/pilot-evidence.md` | Pending demo cold check |
| F-1-11 | Set site and app skip links to a measured minimum height of 44px. | `visible content text is at least 16px and every interactive target is at least 44px`; app target regression | Pending keyboard check |
| F-1-12 | Raised step numbers, keycaps, command text, and app keycaps to 16px. | Site and app 16px regressions | Pending computed-style check |
| F-1-13 | Put hero copy before art on phones, tightened the first screen, and changed facts to privacy, offline use, and price. | `390px first screen includes the complete action and three facts`; `.factory/evidence/polish-1-mobile-first-screen.png` | Pending 390×844 check |
| F-1-14 | Added a generated landing/README copy inventory, hashes, word counts, terminology, banned-word checks, and stale-file failure. | `npm run test:copy`; `.factory/copy-audit.md` | Pending copy check |
| F-1-15 | Rebuilt 404 with description, canonical, OG/Twitter, touch icon, shared header/footer, version, factory credit, source, and `noindex`. | `@claim:unknown-route-404` | Pending unknown-path check |
| F-1-16 | Added cross-document and Back/Forward heading focus with a session marker and `pageshow` handling. | `route navigation and Back move focus to the destination heading` | Pending navigation check |
| F-1-17 | Replaced the eyebrow with “Find controls your screen reader misses.” | Copy audit | Pending home check |
| F-1-18 | Replaced the slogan with “How it works.” | Copy audit | Pending home check |
| F-1-19 | Replaced the metaphor with “Find a visible label in three steps.” | Copy audit | Pending home check |
| F-1-20 | Rewrote the audience sentence in concrete words about missing labels. | Copy audit | Pending home check |
| F-1-21 | Replaced “Your action” with “Lens gives directions. It never clicks.” | Copy audit; `@claim:guidance-only` | Pending home check |
| F-1-22 | Renamed the step “Read visible labels.” | Copy audit | Pending home check |
| F-1-23 | Renamed the step “Find a visible label.” | Copy audit | Pending home check |
| F-1-24 | Replaced the slogan with “How Lens handles captures.” | Copy audit | Pending home check |
| F-1-25 | Replaced the metaphor with “Captures are discarded after local text recognition.” | Copy audit; `@claim:capture-discarded` | Pending home check |
| F-1-26 | Replaced the mood label with “Compare ways to find controls.” | Copy audit | Pending home check |
| F-1-27 | Replaced the negative heading with “How Lens differs from a screen reader.” | Copy audit | Pending home check |
| F-1-28 | Replaced wayfinding jargon with “Use every label-finding tool for free.” | Copy audit; `@claim:no-account-required` | Pending home check |
| F-1-29 | Renamed the disclosure “Show command-line install options.” | Copy audit | Pending home check |
| F-1-30 | Split the README opening into short audience and job sentences. | `npm run test:copy` | Pending README source check |
| F-1-31 | Split the release-workflow sentence and used plain “packages.” | `npm run test:copy` | Pending README source check |
| F-1-32 | Defined OCR once and rewrote implementation bullets in task language. | `npm run test:copy` | Pending README source check |

## Local acceptance evidence

- `npm test`: 14 Vitest checks and 7 Rust checks passed, including the copy and claims contracts.
- `npm run test:web`: 45 passed, 1 intentional desktop skip for the mobile-only geometry case.
- `npm run test:app-web`: 28 passed.
- `npm run build`: deployable `dist/site` and `dist/app` produced; site JS 1.91KB gzip and CSS 3.71KB gzip.
- `cargo fmt --check`: passed after formatting.
- `cargo clippy --all-targets -- -D warnings`: passed.
- `npm audit --omit=dev`: zero vulnerabilities.
