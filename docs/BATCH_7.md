# Batch 7 — Complete fan experience

Completed locally on 26 October 2026. Public deployment, GitHub publication and submission media remain scheduled for Batches 10–11.

## Viewer changes

- Grouped Quick/Tactical, team and player preferences, with a selection summary showing the current match, interval and effective focus. Technical approach selection sits inside the calculation/evidence disclosure.
- Previous/next interval navigation preserves interval length and stays within revealed play. A latest-five-minutes action repairs invalid selections without requesting AI. Whole-minute and revealed-time errors explain how to recover.
- All three server analysis actions share validity, pending-request and upload-expiry guards. Loading is announced through the busy state. Retry and local-recap actions remain available after a result or error. Existing request version and selection-key checks still reject stale responses.
- Local event recaps are invalidated when the match, interval or replay position changes, preventing an earlier recap from appearing current.
- Uploaded matches hide the substitution example and its introductory text, avoiding accidental replacement by the built-in example. Expiry instructions point to the reload control while local replay/recap remain usable.
- Player follow from Teams & lineups returns to commentary with the selected focus. Onboarding opens the match view before highlighting controls and describes the actual bounded investigator and controlled wording.
- Glossary language updates existing commentary/recap term tooltips. Machine-readable claim and evidence records are excluded from glossary decoration. Glossary dialogs have an accessible name.
- Keyboard skip link, visible focus, larger narrow-screen targets, constrained controls and scrollable dialogs improve access. Reduced-motion CSS suppresses animated styling; browser-directed smooth scrolling may still depend on browser preferences.

## Verification

- All 26 existing test files pass, including HTTP, investigator, upload, future-time and narrative regressions.
- `npm run check:fan` runs a real browser against a temporary local server, using local fallback and controlled network failures, with no model calls. It requires Playwright and Chrome; `TOUCHLINE_PLAYWRIGHT` can select the Playwright module and `TOUCHLINE_BROWSER` a compatible Chromium executable.
- Browser checks cover interval stepping, fractions/future rejection, supporting evidence, glossary, pending actions, stale responses after preference changes, connection failure recovery, local recap freshness, uploaded-match protection, expiry guards and following a lineup player.
- Desktop and 390px browser views inspected; the checked match page has no horizontal overflow. Guide keyboard dismissal returns focus to its opener. No browser page exceptions observed.
- Saved [browser checks](batch-7-browser-check.json), [desktop view](batch-7-desktop.png), [narrow view](batch-7-mobile.png), and [commentary view](batch-7-commentary.png).

## Remaining limits

These are integration and visual checks, not unfamiliar-user research, proof of usefulness or a WCAG conformance audit. There is no new live-model quality claim. Comparative evaluation remains Batch 8, unfamiliar-user review Batch 9. The UI retains the existing incremental script integration; broader architecture refactoring is outside this batch.
