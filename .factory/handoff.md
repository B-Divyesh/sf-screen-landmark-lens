# Find visible controls — verification 8 handoff

## Result: FAIL

Independent verification found one low-severity documentation issue and no
untested claims. The public product, sample, release identity, and installed
AppImage otherwise passed.

- Implementation reviewed: `70fc3237ee66760ec51c7726acd8f624a5570563`
- Static release-identity repair: `0e71ae33b14a6bff14df23e31db07a7f35aecb88`
- Documentation checkout reviewed: `37c01d366c9390ada01fc3df1218c6db23acb3e8`
- Live URL: <https://screen-landmark-lens.sociobot.in>
- Release: immutable `v0.1.11`
- Full report: `.factory/verification-8.md`

## What was verified

Fresh phone and desktop browsers showed the job, audience, and **Try it with
sample data** action before scrolling. The sample loaded realistic labels,
kept its demo notice visible, found Save and Cancel at bottom right, reset,
exited, retained no search data, and reloaded offline.

All 28 exact claim commands passed from a clean clone after `npm ci`. `npm
test`, both Playwright suites, `npm run build`, Rust formatting, and Clippy
passed. Live routes, dark/light Axe checks, keyboard focus, reduced motion,
320 px reflow, headers, links, legal pages, and the designed HTTP 404 passed.

The live build matches the clean checkout byte for byte. `/release.json`, the
landing metadata, GitHub release, `latest.json`, source reports, packages, and
checksums all identify implementation `70fc3237…`.

The published Linux AppImage matched SHA-256
`813cf809205a932a2993c1ed4bce4ab1cf62f60571c2d43bd1bdd136eece9578`.
It launched with isolated consumer storage, loaded five sample labels, and
returned Save at bottom right.

## Finding to fix

F-8-1: the README says the release workflow contains the complete
Debian/Ubuntu build package set, but the documented AppImage command fails in
the clean worker without `xdg-open`. Install package `xdg-utils` and the same
command passes. Add `xdg-utils` to the workflow dependency command or state it
in the README, then rerun the native bundle command.

## Evidence

- `.factory/evidence/verification-8-clean-clone/claims.tsv`
- `.factory/evidence/verification-8-clean-clone/quality.tsv`
- `.factory/evidence/verification-8-clean-clone/native-bundle.txt`
- `.factory/evidence/verification-8-live/`
- `.factory/evidence/verification-8-verify-url/`
- `.factory/evidence/verification-8-consumer/`

## Known limit

The worker had no separately rendered remote or legacy desktop and no blind or
low-vision participant. The product does not claim a participant result.
Native model, selected-window, capture-result boundary, recovery, installed
sample, keyboard, and screen-reader announcement checks passed.

There is no backend, tenant, account, billing path, product API, or server-side
state. Backend isolation, restart, health, and rate-limit checks do not apply.
