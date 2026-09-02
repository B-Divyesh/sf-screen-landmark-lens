# Automated sample acceptance

Date: 2026-09-02 UTC

This release makes no participant-study claim. The product acceptance measure is the repeatable sample test below: a fresh 390×844 browser context, keyboard-only input, and the bundled inaccessible-window fixture.

## Script and results

| Task | Requested visible label | Expected direction | Result |
| --- | --- | --- | --- |
| 1 | Quarterly report | top left | Pass |
| 2 | Status | middle center | Pass |
| 3 | Print | bottom center | Pass |
| 4 | Save | bottom right | Pass |
| 5 | Cancel | bottom right | Pass |

All five tasks completed with keyboard input and without another person. The browser test is `@claim:sample-keyboard-five-labels` in `tests-app/app.spec.ts`. Its screenshot is `.factory/evidence/polish-1-five-task-trial.png`.

## Interpretation

This 5/5 result verifies the task script, keyboard path, sample labels, direction output, and repeatability. The tagged product claim is `@claim:sample-keyboard-five-labels` in `tests-app/app.spec.ts`.
