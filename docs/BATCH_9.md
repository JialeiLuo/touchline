# Batch 9 — Usability review and final product fixes

27 October 2026. **Status: complete locally, accepted by the owner on 27 October 2026 after rechecking the revised experience.** One written review response and the original explanation were received on 27 October. First-time status and task assistance were not specified. [The results](BATCH_9_RESULTS.md) distinguish reported observations from builder checks and remaining participation gaps.

## Verified builder findings and repairs

| Priority | Finding | Repair and verification |
|---|---|---|
| High | An insufficient-evidence result could show only basic events, with its reason hidden in the technical trace. | A visible Evidence is limited notice explains the actual inspected missing/window/possession statuses. It never invents an unqueried history gap. Local fallbacks receive a plain Local explanation notice. |
| Medium | The introduction followed navigation, multiple instructions and setup controls. | The original introduction now precedes navigation/setup; duplicate getting-started text is removed. Existing nodes are moved so match/team view visibility still works. |
| Medium | Source disclosures led with fact IDs and long reference strings. | Why this explanation? opens readable source statements first, then underlying event times/descriptions, history/report references and the fact ID. Missing individual descriptions are explicitly labelled rather than fabricated. |
| Medium | The facts in structured commentary had no explicit visible label beside the reading/limit labels. | Recorded facts is now labelled alongside Reading of the play and Limit or alternative. |
| Low | An English interface opened Chinese glossary definitions by default. | English reuses the existing English definitions by default; the six curated translation options remain available. The interface/commentary stay English. |

These are builder/code/browser findings, not participant observations. They do not establish that the product is intuitive or useful to unfamiliar fans.

## Verification completed

- 27 test files pass, including existing input, history, investigator, narrative and HTTP protections.
- `npm run check:usability` passes the main viewer journey and new source/limited-evidence checks using a temporary local server, local fallback and a controlled limited-evidence response. It makes no model calls. Requires Playwright and Chrome; the same `TOUCHLINE_PLAYWRIGHT` and `TOUCHLINE_BROWSER` overrides as the fan journey check apply.
- Checks include first-visit order, English default, interval validation/navigation, fact/source disclosures, glossary access, stale responses, connection failure/local recovery, upload expiry, lineup follow-through, keyboard focus and 320px/390px layouts.
- [Browser record and frontend hashes](batch-9-browser-check.json). [First visit](batch-9-first-visit.png), [limited evidence at narrow width](batch-9-limited-evidence.png), [desktop commentary](batch-9-commentary.png), [narrow page](batch-9-mobile.png).
- The limited-evidence screenshot is a controlled browser response over a valid waiting-window fixture, not a new live-model quality sample. All saved screenshots are builder verification, not participant sessions.

## Working folder

The project inside the user-specified Hackathon folder is now a real local checkout, replacing the previous shortcut to a Desktop checkout. Git history, current changes and local configuration were copied and verified; the original Desktop copy was preserved. Continue work in this workspace. A participant task sheet is also placed at the workspace top level for direct access.

## Participant session

The current local review server runs at http://127.0.0.1:8769 on this computer. Refresh before testing. It uses the existing configured online analysis only when the participant requests an explanation; fallback and local recap remain available. The older public demo is not the reviewed build. No public deployment occurs in this batch.

Use [the task and response sheet](BATCH_9_PARTICIPANT_TASKS.md). Let an unfamiliar participant try catching up, finding a source, distinguishing interpretation, following a player, comparing modes, recovering from a future interval and using the glossary. Record their actual actions/answers and whether they needed help; do not coach before the attempt.

[Reported results and repairs](BATCH_9_RESULTS.md) are now recorded. The main repairs are a direct substitution takeaway, explained past-minute denominators, more distinct Quick/Tactical outputs, one-click future-interval recovery and clearer recap/update actions. Technical metadata remains available in collapsed disclosures. The owner accepted the repaired experience and closed Batch 9. Independent first-time source-finding and unaided comprehension were not measured; retain that limitation rather than infer task passes.

## Remaining limits

This is not a WCAG conformance audit, football-expert review, independent semantic evaluation or proof of usefulness. Some comparison event descriptions are absent from the client evidence packet; their IDs and calculated statements remain inspectable. Player/team focus and mode choices still require actual comprehension feedback. The small comparative runs in Batch 8 did not establish investigator superiority. One participant would be formative evidence, not a representative usability study.
