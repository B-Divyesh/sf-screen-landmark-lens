# Landing copy audit

Audit date: 2026-09-01. This records every visitor-facing sentence and short fact on `site/index.html`, excluding navigation labels, code snippets, and asset alt text. The longest complete sentence is 22 words. No banned plain-words terms appear. All statements that a visitor could rely on map to `.factory/claims.json`.

| Copy | Words | Result |
| --- | ---: | --- |
| Find the control your screen reader can’t. | 7 | Pass |
| Choose one remote desktop or legacy-app window. | 7 | Pass |
| Lens reads its visible labels locally, then tells you exactly where to look—or point. | 14 | Pass |
| No image uploads. | 3 | `local-processing` |
| No account for core tools. | 5 | `no-account-required` |
| No autonomous clicking. | 3 | `guidance-only` |
| Screen Landmark Lens locates one visible label in a selected window. | 11 | `selected-window` |
| One window. | 2 | `selected-window` |
| Explicit scope every time. | 4 | `selected-window` |
| On your device. | 3 | `local-processing` |
| OCR never leaves it. | 4 | `local-processing` |
| Your action. | 2 | `guidance-only` |
| Lens guides; it never clicks. | 5 | `guidance-only` |
| Built for the awkward places where accessibility metadata stops: streamed desktops, canvas interfaces, and software old enough to ignore your screen reader. | 22 | Pass |
| Lens lists visible windows. | 4 | `selected-window` |
| You explicitly pick the one it may capture. | 9 | `selected-window` |
| Bundled OCR runs offline and speaks visible labels in reading order. | 10 | `local-processing` |
| Type “Save” and hear “bottom right.” | 6 | `desktop-sample` |
| Likely buttons are clearly marked as estimates. | 7 | `ocr-uncertainty` |
| Captures live only in memory long enough for local OCR. | 10 | `capture-discarded` |
| They are discarded immediately after recognition. | 6 | `capture-discarded` |
| Lens has no telemetry, cloud vision service, remote control, or hidden full-screen capture. | 13 | `local-processing` / `guidance-only` |
| May have nothing to announce. | 5 | Plain explanation |
| Reads rendered pixels locally. | 4 | `local-processing` |
| Requires another person and sharing context. | 6 | Plain explanation |
| Window capture, OCR, label reading, text finding, directional cues, and voice-speed controls are free. | 13 | `free-voice-speed` |
| The app asks before it captures one visible window. | 10 | `selected-window` |
| Purchasing is not available in this build. | 7 | `no-account-required` |
| All shipped wayfinding features work without an account. | 8 | `no-account-required` |
| Version 0.1.1 builds are unsigned. | 5 | Release note |
| On macOS, right-click the app and choose Open. | 8 | Installation instruction |
| Windows may show a SmartScreen notice. | 6 | Installation instruction |
| No. | 1 | FAQ answer |
| It gives a directional cue and keeps you in control. | 10 | `guidance-only` |
| It does not move the pointer, press keys, or operate the target app. | 13 | `guidance-only` |
| Lens identifies every result as OCR text instead of showing an invented percentage. | 13 | `ocr-uncertainty` |
| It may miss or misread small, stylized, moving, or low-contrast text. | 11 | Product limit |
| Enlarge the window or increase contrast and capture again. | 9 | Recovery instruction |
| Yes. | 1 | FAQ answer |
| After installation, window capture and OCR run locally. | 8 | `local-processing` |
| Use the website only to download a release or read its documentation. | 12 | Plain explanation |
| A local visual landmark finder by Param Factory. | 8 | Product identity |
| Hero imagery was generated originally for this product with Azure AI Foundry. | 11 | Asset provenance |

## Terminology

| Concept | One term |
| --- | --- |
| A chosen application area | window |
| Text identified from pixels | OCR text |
| A text item Lens can describe | label |
| Approximate location | direction |
| Bundled no-risk scenario | sample project |
| Operating-system control | screen reader |
