# Screen Landmark Lens

Screen Landmark Lens is a local desktop wayfinding aid for blind and low-vision workers using remote desktops, legacy applications, and other software that exposes no useful accessibility metadata. Pick one visible window, capture it, hear its labels, find text, and get a plain directional cue such as “bottom right.”

Lens does not upload captures, control the pointer, click controls, or replace a screen reader. OCR output is explicitly uncertain and is not medical or professional advice.

Live site: <https://screen-landmark-lens.sociobot.in>

## What ships

- Tauri 2 desktop app for macOS, Windows, and Linux
- Cross-platform window enumeration and capture through `xcap`
- Bundled `ocrs` detection and recognition models for offline OCR
- Keyboard-first label reading (`Alt+Shift+L`), text finding (`Alt+Shift+F`), and likely-button descriptions (`Alt+Shift+B`)
- Spoken feedback through the operating system’s Web Speech voice
- Free core wayfinding plus an optional $19 one-time Lens Plus license for saved target phrases and voice-speed preferences
- Static download site, privacy and terms pages, service worker, and checksum-verifying installers

## Install

Download the detected platform build from the [latest release](https://github.com/B-Divyesh/sf-screen-landmark-lens/releases/latest), or use:

```sh
curl -fsSL https://screen-landmark-lens.sociobot.in/install.sh | sh
```

```powershell
irm https://screen-landmark-lens.sociobot.in/install.ps1 | iex
```

Version 0.1 builds are unsigned. On macOS, right-click the installed app and choose **Open** the first time. Windows may show a SmartScreen notice. Screen-capture permission is requested by the operating system when needed.

## Develop

Requirements: Node.js 22+, stable Rust, and the [Tauri 2 system dependencies](https://v2.tauri.app/start/prerequisites/). On Debian/Ubuntu, the release workflow lists the complete package set, including WebKitGTK, PipeWire, GBM, and Clang.

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

The factory’s static deploy uses the exact command `npm run build:site` and publishes `dist/site` (whose root contains `index.html`). Native binaries are built only in GitHub Actions when a `v*` tag is pushed or the release workflow is dispatched.

## Privacy and licensing

Captured pixels exist in memory only during OCR and are dropped when analysis returns. Preferences, saved phrases, and the optional token use local storage. License verification calls only `https://api.sociobot.in`; it runs at most once per day and never blocks free functionality.

The `ocrs` code and model project are MIT/Apache-2.0 licensed. The generated hero is original to this project; its prompt and review record are in `assets/src/`. See [.factory/design.md](.factory/design.md) for the visual system and [.factory/handoff.md](.factory/handoff.md) for verification and release notes.

## License

MIT. See [LICENSE](LICENSE).
