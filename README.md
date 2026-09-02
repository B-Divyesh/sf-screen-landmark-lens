# Screen Landmark Lens

Screen Landmark Lens is a desktop aid for blind and low-vision workers. It finds controls in software that gives screen readers no useful labels.

Pick one visible window. Lens reads its visible labels and gives a direction such as “bottom right.”

Lens does not upload captures, control the pointer, click controls, or replace a screen reader. Optical character recognition (OCR) output is marked as uncertain.

Live site: <https://screen-landmark-lens.sociobot.in>

## What ships

- Tauri 2 desktop app for macOS, Windows, and Linux
- Release builds for macOS, Windows, and Linux
- Window picker that limits each capture to one selection
- Includes the text-recognition models for offline OCR
- Keyboard-first label reading (`Alt+Shift+L`), text finding (`Alt+Shift+F`), and likely-button descriptions (`Alt+Shift+B`)
- Screen-reader announcements accompany every result
- Bundled sample project: find Save, Print, Cancel, and a status label before capturing a real window
- Free wayfinding and voice-speed preference controls; no account or purchase is required in this build
- Static download site, privacy and terms pages, and a versioned service worker

## Install

Download the detected platform build from the [latest release](https://github.com/B-Divyesh/sf-screen-landmark-lens/releases/latest), or use:

```sh
curl -fsSL https://screen-landmark-lens.sociobot.in/install.sh | sh
```

```powershell
irm https://screen-landmark-lens.sociobot.in/install.ps1 | iex
```

Version 0.1.6 packages have no publisher signature. On macOS, right-click the installed app and choose **Open** the first time.

The operating system asks for screen-capture permission when needed.

## Develop

Requirements: Node.js 22+, stable Rust, and the [Tauri 2 system dependencies](https://v2.tauri.app/start/prerequisites/). On Debian/Ubuntu, the release workflow lists the complete package set, including WebKitGTK, PipeWire, GBM, Clang, and `file`.

```sh
npm ci
npm run dev          # desktop frontend in a browser
npm run dev:site     # landing site
npm run tauri dev    # complete native app
npm test
npm run test:web
npm run build        # dist/app and deployable dist/site
npm run tauri build  # native bundle for the current host
```

In a container without FUSE, run `APPIMAGE_EXTRACT_AND_RUN=1 npm run tauri -- build --bundles appimage,deb`.

The static deploy runs `npm run build:site` and publishes `dist/site`. Native packages are built in GitHub Actions from a `v*` tag.

The workflow confirms that the tag, packages, checksums, download links, and live site name one source commit. Published GitHub releases are immutable.

## Demo and checks

Open [`?demo=1`](https://screen-landmark-lens.sociobot.in/?demo=1) for an isolated, one-click sample. The desktop app also has **Load sample project** on its first screen.

The sample data is bundled and uses no real capture. **Start for real** discards sample changes. See [.factory/demo.md](.factory/demo.md) and [.factory/claims.json](.factory/claims.json) for exact checks.

The service worker uses versioned caches and serves navigation requests from the network whenever online, so deployed fixes replace an older shell. Run the complete local suite with:

```sh
npm ci
npm test
npm run test:web
npm run test:app-web
npm run build
cargo fmt --manifest-path src-tauri/Cargo.toml -- --check
CARGO_BUILD_JOBS=1 cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings
```

## Privacy

Captured pixels exist in memory only during OCR. The app drops them when analysis returns. Voice speed is stored locally.

Desktop demo mode uses a separate `demo:lens:speech-rate` key. **Start for real** clears that key and restores the regular preference.

The website demo does not save your search or sample changes. Its service worker caches public pages for offline use. All shipped label-finding features are free and need no account or purchase.

The landing page asks `api.github.com` for current release metadata at most once per hour in a browser. If metadata is unavailable, its download buttons keep a direct link to the Release page. The website privacy policy describes this request.

Dependency licenses are recorded in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Read the [image provenance record](.factory/design.md) for the shipped hero source and prompt.

See [.factory/handoff.md](.factory/handoff.md) for verification and release notes.

## License

MIT. See [LICENSE](LICENSE).
