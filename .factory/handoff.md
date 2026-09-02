# Screen Landmark Lens — polish 3 handoff

## Result: PASS

Release candidate: immutable `v0.1.11`. The candidate release is built from the final committed checkout; its GitHub release metadata, `latest.json`, `SHA256SUMS`, live `/release.json`, and landing release metadata must all report the same tag and commit.

## What changed

- Removed the untestable participant-pilot release measure. The brief now uses a five-label keyboard sample acceptance claim.
- Replaced broad capture and installed-app offline promises with tested result-boundary and website-sample offline wording.
- Added `demo-bundled-data` and `sample-keyboard-five-labels` claims. The direct demo now has a persistent isolated-data banner, reset, and start-for-real path.
- Rewrote the remaining jargon and overstatement: text recognition is named before OCR, metadata wording is gone, and the direction is presented as an example rather than an exact promise.
- Versioned the service-worker cache and all release identity, package, footer, legal, and README copy to 0.1.11.

## Verification

- `npm ci`
- `npm test`
- `npm run build`
- `npm run test:web`
- `npm run test:app-web`
- `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check`
- `CARGO_BUILD_JOBS=1 cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings`
- Every exact command in `.factory/claims.json` from a clean clone, including `VERIFY_PUBLISHED_RELEASE=1` for release-bound claims.
- `EXPECTED_RELEASE_COMMIT=<immutable v0.1.11 commit> npm run verify:live`

The live verifier checks a cold 390×844 first screen, demo direct entry/reset/exit/storage/requests/offline reload, shared chrome, focus, metadata, links, designed 404, and axe WCAG A/AA/2.1AA results. Its artifacts are in `.factory/evidence/live/`.

## Run and deploy

```sh
npm ci
npm test
npm run test:web
npm run test:app-web
npm run build
```

The desktop release workflow runs on the `v0.1.11` tag. The static site is built with `RELEASE_TAG=v0.1.11 RELEASE_COMMIT=<tag commit> npm run build:site` and deployed from `dist/site` to `sf-screen-landmark-lens` production.

## Known gaps

None. This release makes no human-participant result claim; future field research is outside the sandbox-verifiable release contract.
