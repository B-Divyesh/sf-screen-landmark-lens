# Screen Landmark Lens — polish 1 handoff

## Result

### Independent verification 4 — FAIL (2026-09-02 UTC)

Candidate `9085ecdbaa62d0dd90008017b0c2495387f19787` passes all 26 declared claims, the complete local test suite, build, live accessibility/privacy checks, and a local Linux DEB build. It is **not releasable**: the live Download links still serve `v0.1.5` desktop packages whose `latest.json` source commit is `10e7782b03b146831a952f7b2dca8ae238674616`, not the candidate. See `.factory/verification-4.md` for exact evidence and the required release action.

Release candidate 0.1.5 repairs all 32 findings from `.factory/review-1.md`. The full finding map is in `.factory/polish-1.md`.

The existing midnight paper-garden identity remains intact. The repair changes copy, evidence, responsive order, focus behavior, route completeness, and release verification without changing the Tauri desktop-app artifact class.

Retry 1 also fixed the native-claim runner itself. Cargo subprocesses now run asynchronously, and `npm test` plus every individual native claim share one target directory. This prevents the prior Vitest heartbeat timeout and repeated multi-gigabyte compilation on the disk-guard image.

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
- Added `npm run verify:live` for repeatable cold route, metadata, mobile, demo, storage, focus, offline, link, and axe checks.

## Verification

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

Post-release clean-clone verification used `/tmp/sll-final-clean.7LXTDH/repo`. Its `HEAD` and local `v0.1.5` tag both resolved to `10e7782b03b146831a952f7b2dca8ae238674616`.

- Every `.factory/claims.json` command: 26/26 passed individually. The command/result ledger is `.factory/evidence/clean-clone-claims.tsv`.
- Full clean-clone `npm test`: 14/14 Vitest and 7/7 Rust tests passed.
- Full clean-clone `npm run test:web`: 45 passed; one expected desktop skip covers the mobile-only geometry case.
- Full clean-clone `npm run test:app-web`: 28/28 passed.
- Full clean-clone `npm run build`: `dist/app` and `dist/site` produced.
- Full clean-clone `npm audit --omit=dev`: zero vulnerabilities.

Retry 1 clean-clone verification used `/tmp/sll-polish-retry.OcJDJu/repo` at repair commit `9085ecd`.

- All 26 claim commands passed independently; `.factory/evidence/clean-clone-claims.tsv` records every command.
- `npm test`: 14/14 Vitest and 7/7 Rust tests passed with no worker timeout.
- `npm run test:web`: 45 passed and one expected desktop skip for the mobile-only geometry check.
- `npm run test:app-web`: 28/28 passed.
- `npm run build`: both deployable outputs produced; `npm audit --omit=dev` found zero vulnerabilities.
- One shared Cargo target served the full run. The first clean-clone native claim took 34 seconds; the next two took 3 and 2 seconds. The temporary clone and target were removed afterward.

## Evidence

- Mobile first screen: `.factory/evidence/polish-1-mobile-first-screen.png`
- Five-task trial: `.factory/evidence/polish-1-five-task-trial.png`
- Copy inventory: `.factory/copy-audit.md`
- Demo contract: `.factory/demo.md`
- Finding map: `.factory/polish-1.md`
- Accessibility trial interpretation: `.factory/pilot-evidence.md`
- Clean-clone claim ledger: `.factory/evidence/clean-clone-claims.tsv`
- Retry clean-clone summary: `.factory/evidence/clean-clone-retry-summary.json`
- Live browser, axe, offline, routing, and release checks: `.factory/evidence/live/`

## Deployment and release

- Static build command: `npm ci && npm test && npm run build:site`
- Static output: `dist/site`
- Desktop release tag: `v0.1.5`
- Release source: `10e7782b03b146831a952f7b2dca8ae238674616`
- Release workflow: <https://github.com/B-Divyesh/sf-screen-landmark-lens/actions/runs/33567475834> — all four platform builds and manifest job passed.
- Live URL: <https://screen-landmark-lens.sociobot.in>
- Release URL: <https://github.com/B-Divyesh/sf-screen-landmark-lens/releases/tag/v0.1.5>
- Deployment target: Azure Static Web App `sf-screen-landmark-lens`, production environment, from `dist/site`.
- Retry deployment ID: `2e45e0d0-5da5-4ed0-8881-29e577c8a769`, deployed from the verified `9085ecd` workspace.
- Published assets: macOS arm64/x64 DMGs, Windows MSI/NSIS, Linux AppImage/DEB/RPM, `latest.json`, `SHA256SUMS`, four signature reports, and the Windows installer verification report.
- Independent download check: the 14,831,824-byte Linux DEB matched `SHA256SUMS`, SHA-256 `3d1eee1f222cf8f0edfdbeb74ef20d8d12f3394a4fe2008cca3f8ad17ea2a347`.
- Factory `verify-url.sh`: HTTP 200, 948ms network-idle load, no console errors, one H1, `lang=en`, main landmark, no missing alt text, and no unlabeled buttons.
- Axe WCAG A/AA/2.1 AA: zero violations on home, demo, privacy, terms, and the styled 404.
- Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 978ms; CLS 0.0078.
- Cold 390×844 check: both actions and all three facts end by y=582.34; no visible text below 16px; no target below 44px.
- Cold demo check: `/?demo=1` redirects to `/demo/?demo=1`; banner, Reset demo, Start for real, sample result, isolated storage, and offline reload all passed.
- Cold routing check: demo, home, and Back focus the destination H1; legal routes return 200; the styled unknown route returns 404.
- Cold release check: the Linux button points to the v0.1.5 AppImage; every internal link returned 200; ordinary routes logged no console errors.
- Retry Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 996ms, TBT 6ms, CLS 0.0078.
- Retry package check: the 14,831,824-byte v0.1.5 Linux DEB matched published SHA-256 `3d1eee1f222cf8f0edfdbeb74ef20d8d12f3394a4fe2008cca3f8ad17ea2a347`.

The live screenshots and machine-readable reports are under `.factory/evidence/live/`.

## Honest constraint

The injected worker context states that no human is available. `.factory/pilot-evidence.md` therefore records a 5/5 keyboard and speech-adapter pre-pilot instead of fabricating blind-user research. A real blind or low-vision participant remains the external research step for the brief’s human success measure; it is not presented as a shipped product claim.

## Operator signing action

Version 0.1.5 has no publisher signatures. Future signed releases need the owner’s Apple and Windows certificates. The workflow would require `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` only after signing steps are deliberately added.
