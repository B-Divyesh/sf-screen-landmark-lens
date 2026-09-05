# Find visible controls — repair 5 handoff

## Result: PASS

Screen Landmark Lens is a local desktop aid for blind and low-vision workers
using remote desktops, legacy apps, or other software that does not expose
useful screen-reader labels. It reads labels from one selected visible window
and gives a direction. It does not control the target app.

On a fresh phone and desktop visit, the job, audience, and first action are
clear before scrolling:

- Job: find a visible control that a screen reader cannot identify, then hear
  its direction.
- Audience: blind or low-vision workers using remote or older unlabeled
  software.
- First action: **Try it with sample data**.

The sample opens directly at `/?demo=1`, shows the populated quarterly-report
window, a persistent `Demo — sample data, nothing is saved.` banner, and a
Save result. Reset restores Save. Start for real returns home and focuses the
home heading. No sample search, cookie, or real-data change persists.

## Release identity repair

- Immutable desktop implementation: `v0.1.11` at
  `70fc3237ee66760ec51c7726acd8f624a5570563`.
- Static-site repair source: `0e71ae33b14a6bff14df23e31db07a7f35aecb88`.
- The deployed `/release.json` and landing meta tag now identify the immutable
  implementation SHA, not an evidence-only commit.
- `release-identity.json` is the durable source for the package version, tag,
  and implementation SHA. Vite validates it against the local tag when that
  tag is available and uses it in shallow checkouts, so a later documentation
  commit cannot stamp itself into the public release identity.
- The browser and published-release claim both test that observable identity
  against the release manifest, release target, checksums, source reports, and
  live site.

## Verification

From a fresh shallow clone at `0e71ae3`, after documented Tauri Linux
dependencies and `npm ci`:

- All 28 exact claim commands passed. The complete list is in
  `.factory/evidence/clean-clone-claims.tsv`.
- `npm test` passed: 16 shared tests and 7 Rust tests.
- `npm run test:web` passed: 52 checks across desktop and 390 px mobile.
- `npm run test:app-web` passed: 28 checks.
- `npm run build` produced `dist/app` and `dist/site`.
- `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check` passed.
- `CARGO_BUILD_JOBS=1 cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings` passed.
- `VERIFY_PUBLISHED_RELEASE=1 npm run test:shared -- -t @claim:release-assets`
  passed against the immutable release and live site.

Production was deployed through the existing `sf-screen-landmark-lens` Static
Web App. The configured app, custom domain, headers, and one-site static
deployment were retained. A fresh HTTPS check found `/`, `/demo/`, `/privacy/`,
and `/terms/` healthy with no console errors; the designed unknown route
returned HTTP 404. The live verifier covered desktop and phone first screens,
sample reset/exit, no sample storage, same-origin requests, offline reload,
route focus, links, reduced motion, and Axe WCAG A/AA/2.1 AA checks. The
worker URL verifier result is in `.factory/evidence/repair-5-verify-url/`.

The published Linux AppImage was downloaded into isolated XDG config, data,
and cache directories. Its SHA-256 matched `latest.json`
(`813cf809205a932a2993c1ed4bce4ab1cf62f60571c2d43bd1bdd136eece9578`). It
launched under Xvfb, loaded the built-in sample project, and showed the demo
banner and five populated labels. The consumer screenshot is
`.factory/evidence/repair-5-consumer-sample.png`.

## Earlier findings

Review 4's only open finding, F-4-1, is fixed by the live identity and
published-release checks above. The earlier claim coverage, demo isolation,
copy, 404, shared chrome, target-size, light-theme contrast, offline update,
privacy boundary, package signature, installer checksum, provenance, and
release-package findings remain covered by the passing claim and browser
checks. The brief's current success measure is the automated five-label
acceptance check; this release does not claim a human participant study.

## Known limits and next steps

The disposable worker has no independently rendered remote or legacy desktop
to capture. Native selected-window, local-model, capture-result boundary, and
recovery tests passed; a real blind or low-vision participant study remains
useful future research but is not claimed as a release result. There is no
product backend, account, billing offer, or paid unlock in this build, so
tenant, restart, health, 429, and billing-registration checks do not apply.
