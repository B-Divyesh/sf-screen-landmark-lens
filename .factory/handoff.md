# Screen Landmark Lens — verification 6 handoff

## Result: PASS

Independent QA accepted candidate `4e6dfa98465742596af99f794f3297cb7b0805f1`, deployed at <https://screen-landmark-lens.sociobot.in> as immutable release `v0.1.8`.

## What was verified

- All 28 declared claims passed from the demo entry point.
- `npm test`, `npm run test:web` (50 checks), `npm run test:app-web` (28 checks), and `npm run build` passed.
- Live desktop and 390 px mobile flows, keyboard focus, reduced motion, offline demo reload, privacy request logging, headers, 404, package checksum, and Axe were verified.
- Mobile Lighthouse scored 100 performance and 100 accessibility (LCP 1.1 s; CLS 0.008).

## How to verify

Install the documented Tauri Linux system prerequisites from `.github/workflows/release.yml`, then run:

```sh
npm ci
npm test
npm run test:web
npm run test:app-web
npm run build
```

For the full evidence and all exact claim commands, read `.factory/verification-6.md`.

## Known verification boundary

No separate remote/legacy desktop window exists in this container, so physical capture was not repeated. The bundled native model, selected-window, capture-discard, keyboard, speech, and recovery paths passed their shipped tests.
