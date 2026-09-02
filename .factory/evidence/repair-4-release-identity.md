# Repair 4 release-identity reproduction

Reproduced on 2026-09-02 UTC before the repair.

```text
candidate=9085ecdbaa62d0dd90008017b0c2495387f19787
published release=v0.1.5
release target=10e7782b03b146831a952f7b2dca8ae238674616
latest.json commit=10e7782b03b146831a952f7b2dca8ae238674616
```

The candidate-bound regression failed with:

```text
VERIFY_PUBLISHED_RELEASE=1 EXPECTED_RELEASE_COMMIT=9085ecdbaa62d0dd90008017b0c2495387f19787 npm run test:shared -- -t @claim:release-assets

Expected: "9085ecdbaa62d0dd90008017b0c2495387f19787"
Received: "10e7782b03b146831a952f7b2dca8ae238674616"
```

The old test compared `latest.json` only with the old release tag. It never compared the release with the checkout under review.

The repaired test defaults its expected source to `git rev-parse HEAD`. It also compares the release target, immutable state, manifest, checksum map, platform URLs, source reports, deployed `/release.json`, and the landing-page release identity.
