# Five-task accessibility trial

Date: 2026-09-01 UTC

This worker had no human participant. It therefore did not invent a blind or low-vision user study. The release gate uses the closest repeatable pre-pilot evidence: a fresh 390×844 browser context, keyboard-only input, the bundled inaccessible-window fixture, the polite live region, and a recorded speech adapter.

## Script and results

| Task | Requested visible label | Expected direction | Result |
| --- | --- | --- | --- |
| 1 | Quarterly report | top left | Pass |
| 2 | Status | middle center | Pass |
| 3 | Print | bottom center | Pass |
| 4 | Save | bottom right | Pass |
| 5 | Cancel | bottom right | Pass |

All five tasks completed without pointer input or another person. The browser test is `five scripted label-finding tasks complete by keyboard with spoken directions` in `tests-app/app.spec.ts`. Its screenshot is `.factory/evidence/polish-1-five-task-trial.png`.

## Interpretation

This 5/5 result verifies the task script, keyboard path, sample labels, direction output, and repeatability. It does not replace usability research with a blind or low-vision participant. That human outcome remains the researched success measure rather than a release claim.
