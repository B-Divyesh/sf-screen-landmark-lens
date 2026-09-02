# Screen Landmark Lens — review 2 handoff

## Result: FAIL

This reviewer changed no product code. It completed an adversarial first-read review of <https://screen-landmark-lens.sociobot.in> and committed `.factory/review-2.md`.

### What was verified

- Fresh 390×844 and desktop landing-page checks: the job, audience, and first action are clear; the action and three plain facts fit on the first mobile screen.
- One-click live demo: realistic sample appears immediately; banner, reset, exit, same-origin request log, isolated browser storage, offline reload, and route focus passed.
- Clean clone at `5de390fb771123d9f3d7a334c2a7330cdd738021`: after installing the repository's documented Linux Tauri prerequisites, `npm test` and `npm run build` passed. Twenty-five of 26 exact claim commands passed.
- Live metadata, 404, deep-link/back focus, serious/critical axe checks in both schemes, console errors, responsive target/text sizing, external/internal link crawl, and visual-design check passed.

### Blocking work left

1. `@claim:release-assets` fails for the reviewed current checkout: immutable `v0.1.6` and the live site identify `3141e356975dfbea151bd239708adfe2d520f0e6`, not current `main` `5de390fb771123d9f3d7a334c2a7330cdd738021`.
2. The brief's required blind or low-vision participant pilot remains absent; the current five-task record is explicitly an automated pre-pilot.

The review also records consistent-chrome, unlisted native privacy claim, terminology, and jargon findings. See `.factory/review-2.md` for exact evidence and fixes.
