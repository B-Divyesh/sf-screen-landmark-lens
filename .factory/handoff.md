# Screen Landmark Lens — repair handoff

Repair commits: `b6e1ac0` and `0490d2a` (plus this handoff commit).

## Completed repair

- Added `.factory/claims.json` with seven observable regression claims and a clean demo sandbox for each claim.
- Added `/demo/`, a first-screen **Try it with sample data** action, three original hand-authored walkthrough frames, `.factory/demo.md`, and a desktop **Load sample project** action. The sample has five realistic legacy-window labels and uses only `demo:lens:*` storage.
- Removed the fabricated OCR confidence percentage from Rust and the UI. Results now say that they are OCR text and ask the user to review unexpected wording.
- Moved voice speed into the free preference panel. The unavailable checkout and all paid-license code/copy were removed rather than sending users to a broken purchase path.
- Replaced the fixed cache-first worker with `landmark-lens-v2`, `skipWaiting`, `clients.claim`, and network-first document navigation. Added a regression test.
- Added an actual 404 response override/page, anti-framing headers, canonical/social/apple metadata, a generated derivative social image, build identity in the footer, 44px legal/wordmark targets, and 16px supporting copy.
- Fixed the blank Find recovery message, formatted Rust, added a CI-normalising Tauri wrapper, and removed the obsolete license module.
- Added the copy audit and expanded accessibility coverage to the demo route.

## Verification evidence

Executed in a clean dependency install after installing the documented local Tauri GUI prerequisites:

```sh
npm ci                                      # pass; 0 audit vulnerabilities
npm test                                    # pass: TypeScript, 3 Vitest, 4 Rust tests, doc tests
npm run test:web                            # pass: 18 Playwright checks, desktop and 390×844 mobile
npm run test:app-web                        # pass: 5 browser-safe desktop checks
npm run build                               # pass: dist/app and dist/site
cargo fmt --manifest-path src-tauri/Cargo.toml -- --check  # pass
CARGO_BUILD_JOBS=1 cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings # pass
CI=1 npm run tauri build -- --bundles deb  # pass; wrapper normalised CI=1
dpkg-deb --info src-tauri/target/release/bundle/deb/Screen\ Landmark\ Lens_0.1.0_amd64.deb # pass
```

The package consumer check reports `screen-landmark-lens` 0.1.0, amd64, with the expected WebKit/GTK runtime dependencies; output size is 14,829,864 bytes.

`/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ <temporary evidence directory>` passed: HTTP 200, title, `lang=en`, one `h1`, `main`, all image alt text, zero console errors, and 731 ms local load. Playwright axe checks passed with no serious/critical violations for home, demo, privacy, and terms at desktop and 390px. The standalone `@axe-core/cli` could not launch because this worker has no system Chrome binary; the repository's pinned Playwright Chromium and `@axe-core/playwright` suite supplied the equivalent axe coverage.

Static output is 3.36 KB gzip JavaScript and 3.30 KB gzip CSS for the site shell. The social card is 50 KB; the existing mobile hero remains under the 300 KB budget.

## Deployment and remaining operator work

The repository is ready for the factory's static deployment: `npm run build:site` publishes `dist/site`. No infrastructure, DNS, billing engine, secrets, or non-product service was accessed. The repair removes the inaccessible paid checkout; restoring one-time licensing later requires the factory to register the product and then reintroduce only a tested Sociobot billing path.

The repository's GitHub release workflow remains responsible for macOS, Windows, and Linux release assets. It intentionally produces unsigned binaries; signing/notarization still requires the owner-provided certificate secrets documented in the earlier release workflow.

Known product limits remain intentional: OCR can miss or misread small, stylized, moving, obscured, or low-contrast text; Lens does not click controls; speech varies by the operating-system voice; and Wayland capture can invoke the platform picker.
