# Screen Landmark Lens — verification 5 handoff

## Current verification result: PASS

Independent verification of candidate `3141e356975dfbea151bd239708adfe2d520f0e6` at <https://screen-landmark-lens.sociobot.in> passed on 2026-09-02 UTC.

- All 26 exact commands declared in `.factory/claims.json` passed after installing the documented Tauri Linux prerequisites from the release workflow.
- `npm test` passed (15 shared + 7 Rust tests); `npm run test:web` passed (46); `npm run test:app-web` passed (28); `npm run build`, Rust format, and warnings-denied Clippy passed.
- Live release identity is `v0.1.6` / `3141e356975dfbea151bd239708adfe2d520f0e6`; the fresh local site HTML and JS byte-match deployment. The Linux DEB checksum matches `SHA256SUMS`.
- Live demo/privacy/offline/keyboard/mobile/accessibility checks passed with no serious or critical axe findings and no page or console errors. No analytics, cookies, third-party demo requests, or cloud OCR requests were observed.
- No release-blocking defects were found. Full evidence is in `.factory/verification-5.md`.

The initial bare worker image did not contain `glib-2.0`; the README and release workflow explicitly require the Tauri Linux system packages. After applying that documented prerequisite set, the real local-model claim and complete native suite passed.

---

# Screen Landmark Lens — repair 4 handoff

## Result

Release `v0.1.6` repairs the candidate/release identity failure in independent verification 4. The tag, immutable GitHub Release, desktop packages, per-platform source reports, `latest.json`, `SHA256SUMS`, download links, deployed site metadata, and `/release.json` are bound to the same commit: `git rev-parse v0.1.6`.

The researched scope and midnight wayfinding-garden visual system are unchanged. Existing application, demo, accessibility, privacy, offline, and keyboard behavior remains covered.

## Root cause and repair

- Reproduced the exact mismatch: candidate `9085ecdbaa62d0dd90008017b0c2495387f19787` versus published source `10e7782b03b146831a952f7b2dca8ae238674616`. Evidence is in `.factory/evidence/repair-4-release-identity.md`.
- Replaced the tag-only assertion with a candidate-bound release claim. A clean checkout now uses its own `HEAD` as the expected published source.
- Bumped every package and visible release reference to `0.1.6`.
- Added one source report per build matrix target. Manifest assembly rejects any report whose tag or commit differs.
- Added the same full commit to the manifest root, release record, checksum record, and each platform download record.
- Added a generated `/release.json` and matching landing-page metadata. The release cache moved to `v2`, so old `v0.1.5` links cannot survive this deploy.
- The landing page accepts only immutable release metadata whose tag and commit match its own build. Mismatched or unavailable metadata falls back without a console error.
- Enabled immutable releases for this repository. The workflow uploads one complete draft, publishes it once, and verifies that GitHub locked it.
- Added `file` and `APPIMAGE_EXTRACT_AND_RUN=1` to the Linux packaging path. This makes local AppImage packaging work in the verifier container without FUSE.

## Local verification

Run from a clean checkout after installing the Linux packages listed in `.github/workflows/release.yml`:

```sh
npm ci
npm test
npm run test:web
npm run test:app-web
npm run build
cargo fmt --manifest-path src-tauri/Cargo.toml -- --check
CARGO_BUILD_JOBS=1 cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings
npm audit --omit=dev
APPIMAGE_EXTRACT_AND_RUN=1 npm run tauri -- build --bundles appimage,deb
```

Results on 2026-09-02 UTC:

- Clean `npm ci`: 77 packages installed; zero vulnerabilities.
- `npm test`: 15/15 TypeScript/shared tests and 7/7 Rust tests passed. The bundled-model claim completed without a service.
- `npm run test:web`: 45 passed; one intentional desktop skip covers the mobile-only geometry assertion.
- `npm run test:app-web`: 28/28 passed.
- `npm run build`: produced `dist/app` and `dist/site`. Site JS is 2.01 KB gzip and CSS is 3.71 KB gzip; app JS is 3.39 KB gzip and CSS is 2.78 KB gzip.
- Rust format and Clippy with warnings denied: passed.
- Production dependency audit: zero vulnerabilities.
- Local AppImage: 89,852,408 bytes; SHA-256 `2c63f7692ecf48032e6c05521c18fbec019208a97971dcd2f3e881d8ca7b290b`.
- Local DEB: 14,829,858 bytes; SHA-256 `f72664ba29e6ccaec3e3696d68a4bad162dd2c3b08ee35e4fc4798e59da5afeb`.

Browser coverage includes desktop and 390×844 mobile layouts, keyboard focus and Back navigation, both color schemes, reduced motion, demo isolation/reset, offline reload and network-first updates, privacy request logs, designed 404 handling, release fallback/cache behavior, and axe WCAG A/AA checks.

## Release and deployment evidence

- Release: <https://github.com/B-Divyesh/sf-screen-landmark-lens/releases/tag/v0.1.6>
- Workflow: `.github/workflows/release.yml`; all four platform builders must report the same source before manifest publication.
- Published assets: macOS arm64/x64 DMGs, Windows MSI/NSIS, Linux AppImage/DEB/RPM, `SHA256SUMS`, `latest.json`, four signature reports, four source reports, and the Windows installer verification report.
- Repository setting: immutable releases enabled. The release API reports `immutable: true` for `v0.1.6`.
- Static target: Azure Static Web App `sf-screen-landmark-lens`, production environment, from `dist/site`.
- Live URL: <https://screen-landmark-lens.sociobot.in>.
- Exact identity check: `VERIFY_PUBLISHED_RELEASE=1 npm run test:shared -- -t @claim:release-assets` passes from the tagged checkout and checks GitHub, checksums, live metadata, and live download URLs together.
- Full live check: `npm run verify:live -- https://screen-landmark-lens.sociobot.in` plus `/opt/fleet/lib/verify-url.sh` passes with zero console errors or serious/critical axe findings.

## Known external follow-up

The worker has no human participant or interactive desktop session. A blind or low-vision pilot remains the honest follow-up for the brief’s human success measure; it is not presented as a shipped claim.

The `v0.1.6` packages are unsigned. Future publisher signing needs owner-provided Apple and Windows certificates. No updater is shipped, so there is no updater manifest.
