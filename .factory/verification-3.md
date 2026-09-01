# Screen Landmark Lens — independent verification 3

## Result: PASS

- Candidate commit: `22ce3ecf3d43a1e9368519ff1f286de81fd8cf1e`
- Live URL: <https://screen-landmark-lens.sociobot.in>
- Verification date: 2026-09-01 UTC
- Product changes at this candidate: documentation only. The rebuilt site files matched the live deployment byte-for-byte for `index.html`, `main-DHT0aZHw.js`, and `main-nP19WrVC.css`.

## First-read check

On a fresh live visit, the first screen says, “Find the control your screen reader can’t.” It identifies the audience and situation in the next sentence: people using remote desktops or legacy applications whose visible labels need local reading and directional guidance. The first primary action is **Try it with sample data**. The screen also states the three relevant facts: no image uploads, no account for core tools, and no autonomous clicking. This meets the plain-language and one-click demo requirements.

## Claim checks

`.factory/claims.json` was present with 20 entries. From a clean `npm ci`, each listed command was run through its documented demo entry point. All completed successfully. The final Playwright result file recorded `status: passed` with no failed tests.

The checked claims covered the sample flows, demo isolation, offline reload and site update behaviour, local OCR boundaries, selected-window scope, capture-result boundaries, guidance-only behaviour, no-account use, release metadata cache and fallback, designed 404 handling, release manifests, and installer checksums.

## Local checks

The Linux desktop build prerequisites from the repository release workflow were installed in the disposable verification container before native checks.

| Check | Result |
| --- | --- |
| `npm test` | PASS — TypeScript check; 14 shared assertions; 4 native Rust tests |
| `npm run test:web` | PASS — 34 desktop and 390px browser checks |
| `npm run test:app-web` | PASS — 18 desktop and 390px app-interface checks |
| `npm run build` | PASS — `dist/app` and deployable `dist/site` created |
| `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check` | PASS |
| `CARGO_BUILD_JOBS=1 cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings` | PASS |
| `npm run tauri build -- --bundles deb` | PASS — `Screen Landmark Lens_0.1.4_amd64.deb`, 14,830,016 bytes |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities |

The production web bundle is 1.82 KB gzip JavaScript and 3.66 KB gzip CSS. The app bundle is 3.39 KB gzip JavaScript and 2.78 KB gzip CSS, within the stated budgets.

The locally built DEB identifies as package `screen-landmark-lens`, version `0.1.4`, architecture `amd64`.

## Product-flow, accessibility, and privacy checks

- Live demo normal path: entering **Save** returns “Found OCR text ‘Save’, bottom right.”
- Live demo recovery paths: an empty query instructs the person to enter a label; an unmatched query names the available sample labels.
- Fresh keyboard check: the first Tab focuses the visible **Skip to main content** link.
- Browser suites include desktop and 390px checks, keyboard shortcuts, focus handling, light treatment, reduced-motion rules, and axe checks. All passed; axe reported no serious or critical findings on `/`, `/demo/`, `/privacy/`, and `/terms/`.
- Independent live demo request log contained only `https://screen-landmark-lens.sociobot.in`; it had no console or page errors.
- `verify-url.sh` returned HTTP 200 with `lang=en`, one `h1`, a `main` landmark, image alt text, and zero console errors.
- Live response headers include HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, a restrictive permissions policy, `X-Frame-Options: DENY`, and CSP limited to self plus `https://api.github.com` for release metadata. HTML is revalidated after 30 seconds; hashed assets are immutable for one year; `sw.js` is no-cache.
- `/privacy/`, `/terms/`, `/demo/`, installers, `robots.txt`, `sitemap.xml`, and designed 404 all returned the expected response. An unknown path returned HTTP 404 rather than the landing page.

## Deployment and release checks

- The live landing, demo, privacy, and terms routes returned HTTP 200. All internal links on those routes returned HTTP 200.
- Current published release: `v0.1.4`, source `18bf38159a42c7023ecff3caf88e47d29f5a4c71`. This is expected because the candidate only updates verification documentation.
- The release includes Linux, Windows, and macOS assets, `SHA256SUMS`, and `latest.json`.
- A fresh download of `Screen-Landmark-Lens_0.1.4_linux.deb` passed the published SHA-256 check and identified as `screen-landmark-lens` 0.1.4, `amd64`.
- No product server-side endpoint is present, so request-allowance checking does not apply.

## Defects

No release-blocking, high, medium, or low severity defects found.

## Scope note

The container has no interactive desktop session for a physical selected-window capture. Native model loading, selected-window command boundaries, capture-result boundaries, and the full browser-safe desktop sample were verified by the passing native, shared, and Playwright checks; the signed-in-user pilot success measure remains a real-world follow-up rather than a release claim.
