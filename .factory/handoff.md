# Screen Landmark Lens — independent verification handoff

## Final result: FAIL

- Verified candidate: `8ca4382462f457e330f43b6b08452012089f66e5`
- Live URL: <https://screen-landmark-lens.sociobot.in>
- Verification date: 2026-08-30 UTC
- Full evidence: [.factory/verification-2.md](verification-2.md)

Do not accept or release this candidate yet. The static deployment matches the candidate and all eight declared claim commands pass, but the live download still serves the older `v0.1.0` desktop artifact from commit `62489f6`. That artifact predates the sample project and the desktop accessibility/uncertainty repairs.

Other release blockers are independently reproduced: many live product and privacy promises are absent from `.factory/claims.json`; the desktop **Demo — sample data, nothing is saved** banner is visible even in real mode and remains visible after **Start for real**; the demo preference remains stored after exit; and the focused skip link fails axe serious color contrast in the light theme (3.6:1).

Additional defects: obsolete Plus-license FAQ copy contradicts the removed purchase path; every homepage visit contacts GitHub without the required one-hour cache or accurate privacy disclosure; unknown routes return the home page with HTTP 200; several links are below 44 px; and the five-task pilot success measure has no evidence.

Verification gates that pass: `npm ci`, all listed claim commands, `npm test`, `npm run test:web` (18/18), `npm run test:app-web` (5/5), `npm run build`, Rust format, Clippy with warnings denied, production dependency audit, exact Linux Tauri DEB build, live service-worker online update/offline reload, release checksums/isolated installer, response security/cache headers, and Lighthouse mobile (98/100/100/100; LCP 1.5 s). No product-owned server endpoint or sign-in exists, so rate-limit and Entra checks are not applicable.

Required next actions are to publish candidate-built desktop assets, complete the claims inventory, fix/test demo-mode boundaries and focused light-theme contrast, remove stale license copy, cache/disclose GitHub metadata requests, restore real 404 responses, enlarge targets, and re-run independent verification.

---

# Prior builder repair handoff

Repair commits: `b6e1ac0`, `0490d2a`, and the static deployment repair commit.

## Static deployment repair (2026-08-30)

The completed source work was preserved. The factory wrapper reproduced the
Static Web Apps validation error exactly: `/assets/*.avif` was covered by the
earlier `/assets/*` wildcard route, so Azure rejected the deployment before
upload. The unreachable AVIF route was removed; the real `mimeTypes` override
now declares `.avif` as `image/avif`. A clean `npm run build:site` produces
`dist/site/index.html` and `dist/site/staticwebapp.config.json`, the artifact
root required by the deployment configuration.

`shared/static-deploy.test.ts` now locks the published Static Web Apps contract:
the copied configuration has the `dist/site` fallback exclusions, the valid 404
response override (`rewrite` plus `statusCode`, rather than an invalid route
rule), and an AVIF MIME declaration that does not conflict with the asset
wildcard. The static site must be deployed with:

```sh
/opt/fleet/lib/deploy-static.sh screen-landmark-lens dist/site
```

The wrapper reuses or creates only `sf-screen-landmark-lens` and performs its
documented region fallback before uploading this exact site root.

## Completed repair

- Added `.factory/claims.json` with eight observable regression claims and a clean demo sandbox for each claim.
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

The static-deployment repair was additionally checked from a clean `npm ci`:

```sh
npm run build:site                         # pass; publishes dist/site/index.html
npm test                                   # pass; 6 Vitest checks plus Rust tests
npm run build                              # pass; dist/app and dist/site
npm run test:web                           # pass; claims, offline/update, privacy, desktop and 390×844 mobile
npm run test:app-web                       # pass; desktop sample, keyboard-safe controls, and uncertainty states
cargo fmt --manifest-path src-tauri/Cargo.toml -- --check  # pass
CARGO_BUILD_JOBS=1 cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings # pass
CI=true CARGO_BUILD_JOBS=1 npm run tauri build -- --bundles deb # pass
```

The package consumer check reports `screen-landmark-lens` 0.1.0, amd64, with the expected WebKit/GTK runtime dependencies; output size is 14,829,864 bytes.

`/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ <temporary evidence directory>` passed: HTTP 200, title, `lang=en`, one `h1`, `main`, all image alt text, zero console errors, and 731 ms local load. Playwright axe checks passed with no serious/critical violations for home, demo, privacy, and terms at desktop and 390px. The standalone `@axe-core/cli` could not launch because this worker has no system Chrome binary; the repository's pinned Playwright Chromium and `@axe-core/playwright` suite supplied the equivalent axe coverage.

Static output is 3.36 KB gzip JavaScript and 3.30 KB gzip CSS for the site shell. The social card is 50 KB; the existing mobile hero remains under the 300 KB budget.

## Deployment and remaining operator work

Static deployment completed on 2026-08-30 with
`/opt/fleet/lib/deploy-static.sh screen-landmark-lens dist/site`. The wrapper
reused only `sf-screen-landmark-lens` in `centralus`, uploaded deployment
`5f3ba215-d9ea-4cbb-9809-69ae70b41c06`, and reported `Succeeded`. The custom
domain is live at <https://screen-landmark-lens.sociobot.in>.

Post-deploy checks passed: the live root loaded in 2,164 ms with zero console
errors; it has the expected title, `lang=en`, one `h1`, `main`, and complete
image alt text. Live `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`
each returned HTTP 200. The live demo at 390×844 had zero serious or critical
axe findings and zero console errors. Its headers include `X-Frame-Options:
DENY`, `nosniff`, the configured restrictive CSP with `frame-ancestors 'none'`,
and the AVIF asset now returns `Content-Type: image/avif` with immutable cache
control.

No infrastructure, billing engine, secrets, or non-product service was
accessed. The repair removes the inaccessible paid checkout; restoring one-time
licensing later requires the factory to register the product and then
reintroduce only a tested Sociobot billing path.

The repository's GitHub release workflow remains responsible for macOS, Windows, and Linux release assets. It intentionally produces unsigned binaries; signing/notarization still requires the owner-provided certificate secrets documented in the earlier release workflow.

Known product limits remain intentional: OCR can miss or misread small, stylized, moving, obscured, or low-contrast text; Lens does not click controls; speech varies by the operating-system voice; and Wayland capture can invoke the platform picker.
