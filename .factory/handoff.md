# Screen Landmark Lens — review 1 handoff

## Result: FAIL

The complete first-read review is in `.factory/review-1.md`. No product code was changed.

## What was checked

- Fresh 390×844 and 1440×900 live first-screen checks.
- One-click sample, reset, exit, storage separation, request log, and live offline reload.
- Every command in `.factory/claims.json`, run separately from a fresh clone.
- Landing and README sentence counts, headings, terminology, jargon, slogans, and interactive labels.
- Earlier verification findings and handoff gaps against current live behavior and source.
- Titles, H1 count, metadata, 404 response, deep links, Back behavior, focus, link crawl, headers, responsive layout, touch sizes, text sizes, reduced motion, and product identity.
- Desktop/mobile and dark/light Playwright axe coverage plus the fleet URL verifier.
- Full tests, build, Rust formatting, release identity, and live/build static-file hashes.

## Verification summary

- `npm test`: PASS after installing the documented Linux desktop libraries.
- `npm run test:web`: PASS, 34/34.
- `npm run test:app-web`: PASS, 18/18.
- `npm run build`: PASS; produced `dist/app` and `dist/site`.
- `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check`: PASS.
- Fleet URL verifier: PASS with no console errors.
- Declared claim commands: 12 PASS, 8 FAIL because Vitest rejects `--grep`.
- Live link crawl: 17/17 return 200 after redirects where applicable.
- Unknown live route: correct 404 response.

## Work left

Resolve F-1-1 through F-1-32 in `.factory/review-1.md`. The first priorities are the eight invalid claim commands, observable claim coverage, unlisted claims, the five-task pilot, and the repeated 44px/16px accessibility findings. After changes, rerun every claim command exactly as recorded and repeat the review from fresh browser contexts.
