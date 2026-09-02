# Screen Landmark Lens — polish round 1

Candidate version: 0.1.5  
Review source: `.factory/review-1.md` at `f3bb467abcff2408e85ad356c989f44e3bf6b6c4`

Every review item is mapped below. Live checks used a new browser context after the final production deployment on 2026-09-01 UTC.

Retry 1 reran this complete map from commit `9085ecd` on the disk-guard worker. Native claim subprocesses are now asynchronous and share one Cargo target. This removes Vitest worker timeouts and repeated native compilation without weakening any assertion. All 26 claim commands passed independently from clean clone `/tmp/sll-polish-retry.OcJDJu/repo`; the temporary clone and shared target were deleted after evidence capture.

| Finding | Change made | Evidence | Live |
| --- | --- | --- | --- |
| F-1-1 | Replaced all eight invalid Vitest `--grep` commands with `-t`; added a manifest regression for every command and unique tag. Retry 1 also made native subprocesses asynchronous and reused one Cargo target. | `claims contract > gives every unique claim one runnable tagged test`; every command in `.factory/claims.json`; `npm test` without worker errors | PASS — all 26 commands in `.factory/evidence/clean-clone-claims.tsv` |
| F-1-2 | Replaced source-string claims with native fixture execution, serialized result checks, installer execution, CI signature reports, and published-release checks. | `@claim:local-processing`, `selected-window`, `capture-discarded`, `checksum-installers`, `release-assets`, `package-signatures` | PASS — retry clean clone, release run `33567475834`, and downloaded DEB SHA-256 match |
| F-1-3 | Rewrote website storage wording to distinguish user data from public service-worker caches; added a storage outcome claim. | `@claim:website-demo-storage`, `@claim:offline-demo` | PASS — `/demo/?demo=1`; `live/cold-functional.json` and `live/offline-demo.json` |
| F-1-4 | Replaced the Web Speech implementation claim with screen-reader announcement wording and a recorded adapter check. | `@claim:screen-reader-announcements` | PASS — clean-clone claim and live demo result |
| F-1-5 | Narrowed README copy to release build targets and a one-selection window picker. | `@claim:release-assets`, `@claim:selected-window` | PASS — v0.1.5 has all seven required platform packages |
| F-1-6 | Removed the SmartScreen prediction; changed copy to the tested “no publisher signature” statement. CI now records Linux, macOS, and Windows signature outcomes. | `@claim:package-signatures` | PASS — four published CI signature reports |
| F-1-7 | Added `THIRD_PARTY_NOTICES.md` and compared locked OCR dependencies with Cargo metadata. | `@claim:dependency-licenses` | PASS — clean-clone claim |
| F-1-8 | Linked a provenance record and bound the retained source image to its prompt/model record with SHA-256. | `@claim:image-provenance` | PASS — live footer link and clean-clone hash claim |
| F-1-9 | Removed the unsupported CI-build promise. The release workflow remains the documented package path. | Copy audit; README search contains no removed sentence | PASS — published README at source commit `10e7782` |
| F-1-10 | Added a repeatable five-task keyboard/speech-output trial with 5/5 results. The record explicitly avoids presenting automation as a human study. | `five scripted label-finding tasks complete by keyboard with spoken directions`; `.factory/evidence/polish-1-five-task-trial.png`; `.factory/pilot-evidence.md` | EVIDENCED — automated pre-pilot 5/5; a human participant was unavailable and no human result is claimed |
| F-1-11 | Set site and app skip links to a measured minimum height of 44px. | `visible content text is at least 16px and every interactive target is at least 44px`; app target regression | PASS — `live/final-cold-recheck.json` has no small targets |
| F-1-12 | Raised step numbers, keycaps, command text, and app keycaps to 16px. | Site and app 16px regressions | PASS — `live/final-cold-recheck.json` has no small text |
| F-1-13 | Put hero copy before art on phones, tightened the first screen, and changed facts to privacy, offline use, and price. | `390px first screen includes the complete action and three facts`; `.factory/evidence/polish-1-mobile-first-screen.png` | PASS — live facts end at y=582.34 in 390×844 |
| F-1-14 | Added a generated landing/README copy inventory, hashes, word counts, terminology, banned-word checks, and stale-file failure. | `npm run test:copy`; `.factory/copy-audit.md` | PASS — clean-clone `npm test` |
| F-1-15 | Rebuilt 404 with description, canonical, OG/Twitter, touch icon, shared header/footer, version, factory credit, source, and `noindex`. | `@claim:unknown-route-404` | PASS — `/final-cold-404` returns 404 with complete chrome and metadata |
| F-1-16 | Added cross-document and Back/Forward heading focus with a session marker and `pageshow` handling. | `route navigation and Back move focus to the destination heading` | PASS — live demo, home, and Back checks focus the H1 |
| F-1-17 | Replaced the eyebrow with “Find controls your screen reader misses.” | Copy audit | PASS — live copy recheck |
| F-1-18 | Replaced the slogan with “How it works.” | Copy audit | PASS — live copy recheck |
| F-1-19 | Replaced the metaphor with “Find a visible label in three steps.” | Copy audit | PASS — live copy recheck |
| F-1-20 | Rewrote the audience sentence in concrete words about missing labels. | Copy audit | PASS — live copy recheck |
| F-1-21 | Replaced “Your action” with “Lens gives directions. It never clicks.” | Copy audit; `@claim:guidance-only` | PASS — live copy and clean-clone claim |
| F-1-22 | Renamed the step “Read visible labels.” | Copy audit | PASS — live copy recheck |
| F-1-23 | Renamed the step “Find a visible label.” | Copy audit | PASS — live copy recheck |
| F-1-24 | Replaced the slogan with “How Lens handles captures.” | Copy audit | PASS — live copy recheck |
| F-1-25 | Replaced the metaphor with “Captures are discarded after local text recognition.” | Copy audit; `@claim:capture-discarded` | PASS — live copy and native result-boundary claim |
| F-1-26 | Replaced the mood label with “Compare ways to find controls.” | Copy audit | PASS — live copy recheck |
| F-1-27 | Replaced the negative heading with “How Lens differs from a screen reader.” | Copy audit | PASS — live copy recheck |
| F-1-28 | Replaced wayfinding jargon with “Use every label-finding tool for free.” | Copy audit; `@claim:no-account-required` | PASS — live copy and clean-clone claim |
| F-1-29 | Renamed the disclosure “Show command-line install options.” | Copy audit | PASS — exact live control text; old exact label absent |
| F-1-30 | Split the README opening into short audience and job sentences. | `npm run test:copy` | PASS — published README and clean-clone copy audit |
| F-1-31 | Split the release-workflow sentence and used plain “packages.” | `npm run test:copy` | PASS — published README and clean-clone copy audit |
| F-1-32 | Defined OCR once and rewrote implementation bullets in task language. | `npm run test:copy` | PASS — published README and clean-clone copy audit |

## Local acceptance evidence

- `npm test`: 14 Vitest checks and 7 Rust checks passed, including the copy and claims contracts.
- `npm run test:web`: 45 passed, 1 intentional desktop skip for the mobile-only geometry case.
- `npm run test:app-web`: 28 passed.
- `npm run build`: deployable `dist/site` and `dist/app` produced; site JS 1.91KB gzip and CSS 3.71KB gzip.
- `cargo fmt --check`: passed after formatting.
- `cargo clippy --all-targets -- -D warnings`: passed.
- `npm audit --omit=dev`: zero vulnerabilities.

## Release and live acceptance evidence

- Release source: `10e7782b03b146831a952f7b2dca8ae238674616` at tag `v0.1.5`.
- GitHub Actions run `33567475834`: Linux, Windows, both macOS architectures, and manifest publication passed.
- Post-release clean clone: all 26 declared claim commands passed individually; see `.factory/evidence/clean-clone-claims.tsv`.
- Downloaded Linux DEB: 14,831,824 bytes; SHA-256 `3d1eee1f222cf8f0edfdbeb74ef20d8d12f3394a4fe2008cca3f8ad17ea2a347`; published checksum matched.
- Production deployment: `sf-screen-landmark-lens`, <https://screen-landmark-lens.sociobot.in>.
- `verify-url.sh`: HTTP 200, no console errors, correct title/lang/H1/main/alt/button names.
- Axe: zero WCAG A/AA/2.1 AA violations on home, demo, privacy, terms, and 404.
- Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 978ms; CLS 0.0078.
- Cold 390×844 browser: all first-screen facts ended by y=582.34; no text below 16px or interactive target below 44px.
- Cold demo: one-click redirect, persistent banner, sample result, reset, exit, isolated storage, focus changes, and offline reload passed.
- Link crawl: every site and external link returned 200, including the v0.1.5 Linux download.
