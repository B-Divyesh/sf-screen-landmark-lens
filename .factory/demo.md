# Demo contract

- Website URL: `/demo/`.
- Desktop entry: select **Load sample project** on the first screen, or open the app with `?demo=1` during browser verification.
- Sample: a bundled `Sample Legacy App — Quarterly report` with `Quarterly report`, `Status: Ready to submit`, `Print`, `Save`, and `Cancel` labels. `Save` resolves to bottom right.
- Website reset: **Reset demo** restores the sample search to `Save`. **Start for real** returns to the landing page.
- Desktop reset: **Reset demo** reloads the bundled labels. **Start for real** discards the in-memory sample, clears the demo preference, restores the real preference, and returns to window selection.
- Storage: the website demo has no storage. The desktop demo uses only `demo:lens:speech-rate`; it never reads or writes `lens:speech-rate` while the demo banner is displayed. Leaving demo removes `demo:lens:speech-rate`.
- Offline: the service worker precaches the demo shell after the first visit; the claim test verifies an offline reload from a new browser context.
