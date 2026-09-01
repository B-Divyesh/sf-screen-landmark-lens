# Screen Landmark Lens — polish 1 handoff

## Result

Release candidate 0.1.5 repairs all 32 findings from `.factory/review-1.md`. The full finding map is in `.factory/polish-1.md`.

The existing midnight paper-garden identity remains intact. The repair changes copy, evidence, responsive order, focus behavior, route completeness, and release verification without changing the Tauri desktop-app artifact class.

## What changed

- Added the one-click `/?demo=1` entry, persistent sample banner, reset, exit, and separate desktop demo preference.
- Rewrote the first screen and every flagged phrase in concrete label-finding language.
- Kept the complete primary action and privacy/offline/price facts inside 390×844.
- Enforced 16px meaningful text and 44px targets in the site and desktop interface.
- Added real route heading focus, Back/Forward handling, a complete shared-chrome 404, and full legal/footer links.
- Expanded `.factory/claims.json` to 26 observable claims with one runnable tagged test each.
- Replaced source-only native checks with controlled native outcomes and serialized result-boundary checks.
- Executed valid/tampered shell installer fixtures; the release workflow produces the matching Windows outcome report.
- Added CI-produced publisher-signature reports, release-asset/commit checks, dependency notices, and hashed image provenance.
- Added a generated copy audit that fails when the landing page or README changes.
- Added a five-task keyboard/speech-output trial. The evidence honestly states that the worker had no human participant.

## Verification before release

Run from `/work/repo` after installing the Linux Tauri prerequisites listed in the release workflow:

```sh
npm ci
npm test
npm run test:web
npm run test:app-web
npm run build
cargo fmt --manifest-path src-tauri/Cargo.toml -- --check
CARGO_BUILD_JOBS=1 cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings
npm audit --omit=dev
```

Results on 2026-09-01 UTC:

- `npm test`: pass; 14/14 Vitest and 7/7 Rust tests.
- `npm run test:web`: pass; 45 passed and one expected desktop skip for a mobile-only geometry test.
- `npm run test:app-web`: pass; 28/28.
- `npm run build`: pass; `dist/app` and `dist/site` produced.
- Site bundle: 1.91KB gzip JavaScript and 3.71KB gzip CSS.
- App bundle: 3.39KB gzip JavaScript and 2.78KB gzip CSS.
- Rust format and Clippy: pass.
- Production dependency audit: zero vulnerabilities.
- Native DEB build: pass; `screen-landmark-lens` 0.1.5 amd64, 14,829,860 bytes, SHA-256 `d07706234d339c53cfc67c1275e07025aa3ce15baaab8153b7265e18e0e10b1f`.

Every command in `.factory/claims.json` must be rerun from a clean clone after release publication. The three published-release claims intentionally validate `v0.1.5` and its CI reports.

## Evidence

- Mobile first screen: `.factory/evidence/polish-1-mobile-first-screen.png`
- Five-task trial: `.factory/evidence/polish-1-five-task-trial.png`
- Copy inventory: `.factory/copy-audit.md`
- Demo contract: `.factory/demo.md`
- Finding map: `.factory/polish-1.md`
- Accessibility trial interpretation: `.factory/pilot-evidence.md`

## Deployment and release

- Static build command: `npm ci && npm test && npm run build:site`
- Static output: `dist/site`
- Desktop release tag: `v0.1.5`
- Live URL: <https://screen-landmark-lens.sociobot.in>
- Release URL: <https://github.com/B-Divyesh/sf-screen-landmark-lens/releases/tag/v0.1.5>

Deployment, release asset checks, clean-clone claim results, live URL verification, Lighthouse scores, and cold live recheck are recorded here after publication.

## Honest constraint

The injected worker context states that no human is available. `.factory/pilot-evidence.md` therefore records a 5/5 keyboard and speech-adapter pre-pilot instead of fabricating blind-user research. A real blind or low-vision participant remains the external research step for the brief’s human success measure; it is not presented as a shipped product claim.

## Operator signing action

Version 0.1.5 has no publisher signatures. Future signed releases need the owner’s Apple and Windows certificates. The workflow would require `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` only after signing steps are deliberately added.
