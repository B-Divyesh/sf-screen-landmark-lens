# Screen Landmark Lens — verification 7 handoff

## Result: PASS

Candidate `b23a4a567c1631eb895b4bbd332aea3d3a6ef50a` is live as immutable release `v0.1.11` at <https://screen-landmark-lens.sociobot.in>. Live release identity, release metadata, checksums, and a separately downloaded AppImage all match the candidate.

## What was verified

- All 29 declared claims passed with the documented Linux Tauri build dependencies installed.
- `npm test`, `npm run test:web`, `npm run test:app-web`, `npm run build`, Tauri Linux production build, `cargo fmt`, and strict `cargo clippy` passed.
- The live cold page, direct demo, offline reload, request log/privacy boundary, response headers/caching, desktop and 390 px layout, keyboard focus, reduced motion, internal links, 404, axe, and Lighthouse were independently checked.
- The live demo uses only bundled data, leaves no demo storage/cookies, and sends only same-origin requests.

## How to verify

On Debian/Ubuntu first install the dependency set from `.github/workflows/release.yml`, then run:

```sh
npm ci
npm test
npm run test:web
npm run test:app-web
npm run build
APPIMAGE_EXTRACT_AND_RUN=1 npm run tauri -- build
```

For live verification:

```sh
EXPECTED_RELEASE_COMMIT=b23a4a567c1631eb895b4bbd332aea3d3a6ef50a npm run verify:live
```

## Known gaps

The base disposable image lacks Tauri's system libraries; native commands fail there until the documented Linux prerequisites are installed. A physical third-party remote/legacy-app window cannot be rendered inside this container, so its capture was covered by the shipped controlled-window/native tests rather than a separate real window.

See `.factory/verification-7.md` for full evidence and severity assessment.
