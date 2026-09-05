# Find visible controls — review 4 handoff

## Result: FAIL

Strict review 4 found one blocking defect and zero untested claims.

The immutable `v0.1.11` release and all packages identify implementation
`70fc3237ee66760ec51c7726acd8f624a5570563`. The live page and `/release.json`
instead identify evidence-only commit
`b23a4a567c1631eb895b4bbd332aea3d3a6ef50a`. The declared `release-assets`
claim therefore fails from either possible checkout.

Current documentation before this report was
`95d562a9403055948336d04ccdba22be78133a8e`.

## What passed

- 27 of 28 exact declared claim commands passed; none was left untested.
- `npm test`, `npm run build`, `npm run test:web`, `npm run test:app-web`,
  Rust format, and strict Clippy passed after documented prerequisites were
  installed.
- Fresh desktop and phone live checks passed first-read, demo, reset, exit,
  storage isolation, privacy requests, offline reload, links, titles, legal
  pages, designed 404, keyboard/focus, reduced motion, and axe checks.
- Mobile Lighthouse scored 100 in performance, accessibility, best practices,
  and SEO.
- The published AppImage checksum matched. It launched with isolated consumer
  storage, loaded the bundled sample, and found Cancel at bottom right.

## Required next step

Make the live release identity name the actual implementation source
`70fc3237ee66760ec51c7726acd8f624a5570563`. A new binary build is not required
for the later evidence-only commits. Then run:

```sh
npm ci
VERIFY_PUBLISHED_RELEASE=1 npm run test:shared -- -t @claim:release-assets
```

Run the other 27 manifest commands as well before declaring PASS. See
[review-4.md](review-4.md) for the full evidence and earlier-finding map.
