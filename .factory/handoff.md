# Screen Landmark Lens — polish 2 handoff

## Result

Repair candidate for the immutable `v0.1.8` release. The desktop app remains a Tauri 2 application with a static Vite download site.

## What changed

- Kept the one-click `?demo=1` sample isolated, with its persistent banner, reset, exit, offline shell, and separate desktop preference key.
- Reframed the unrun participant study as planned field research. The shipped five-task run is explicitly automated pre-pilot coverage, not a human-product assertion.
- Replaced capture-memory, telemetry, cloud, and hidden-capture promises with the verified boundary: recognition returns labels and directions, not capture pixels; the person chooses a window first.
- Made header/footer wording and navigation consistent on home, demo, privacy, terms, and 404. Replaced `wayfinding` and `target` terminology with `label-finding` and `visible label`.
- Added regressions for shared chrome, privacy-copy scope, and demo terminology. Updated release identity to the new immutable version.

## Verification completed locally

- `npm ci`
- `npm test` — 15 TypeScript/shared tests and 7 Rust tests passed after the documented Linux Tauri prerequisites.
- `npm run build` — built `dist/app` and `dist/site`; site JavaScript is 4.46 KB gzip and CSS is 3.71 KB gzip.
- `npm run test:web` — 50 site/browser checks passed.
- `npm run test:app-web` — 28 desktop-browser checks passed.
- `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check`
- `CARGO_BUILD_JOBS=1 cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings`

## Release and deployment evidence

`v0.1.8` is the source-bound release candidate. After publication, run every command in `.factory/claims.json` from a fresh clone, including the two `VERIFY_PUBLISHED_RELEASE=1` commands, then deploy `dist/site` with `RELEASE_COMMIT` set to the tagged source commit. The live evidence is the home-page release meta tag and `/release.json`, which must name that same commit.

## Known gaps and next steps

There is no claimed human participant result. The planned next research step is a consent-safe, five-task session with a blind or low-vision participant using the installed desktop app. No product functionality, security, accessibility, or release-identity finding is intentionally left unresolved.
