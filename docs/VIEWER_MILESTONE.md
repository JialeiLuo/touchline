# Viewer milestone — 25 October 2026

Completed locally; not a production or submission-readiness claim.

## What changed for a viewer

- Player focus, with squad-grouped choices and a Follow this player in commentary action from the lineup/player dialog.
- Team focus changes priority; player focus takes precedence when both are selected. Goal and dismissal coverage is retained within the selected story budget.
- Quick uses concise story wording; Tactical uses full figures, roles and more story slots. Both draw on the same event calculations.
- What to watch next gives a viewing question. Bench and departed-player status affect its wording; it is not a forecast.
- Supported story candidates now include goals, dismissals, substitutions, corrected/reported incidents, passing/shot contrasts, progression and focused-player involvement.
- Main screen keeps replay, glossary, statistics, catch-up and commentary. Upload/generation/provenance sit under Match data & demo settings; raw evidence inspection is optional.
- Match-so-far and interval commentary have distinct labels. The seven-step guide explains input data, format, evidence, preferences and local/cloud behavior.

## How it works

Events → deterministic match/player/sequence calculations → supported scoped story candidates → Foundry ranks candidate IDs → local focus/major-event rules → server-owned wording, figures and source links.

This is bounded story selection. It avoids free rewriting for supported candidates, but is not an autonomous investigator and cannot produce arbitrary tactical explanations. When no candidates exist, the earlier constrained prose route remains, with known semantic limitations. Local fallback is explicitly labeled.

## Verification

- 14 automated test files pass, including focused-player counts, recipient involvement, unknown player rejection, unavailable future interval, bench absence, uploaded naming, Quick/Tactical distinction and viewing questions.
- Local integration script `tools/check-viewer-milestone.cjs` checks evidence, upload and invalid inputs. `--live` makes two model calls.
- Recorded live samples: Quick 2.09 seconds; Tactical 1.10 seconds. Both used Foundry; same Morgan interval, different detail. See viewer-milestone-check.json.
- Browser checked simplified layout, player selector, Tactical result, lineup-to-commentary follow action and the input-data guide step.
- Individual response speed and a small set of passing samples do not establish broad reliability or usefulness.

## Outstanding for the project

1. Stronger contextual reasoning: history, availability, manager tendencies and revisable hypotheses remain incomplete. No xG model or penalty-history analysis yet.
2. Agent-directed evidence retrieval and comparison with simpler baselines remain outstanding. Current ranker should not be advertised as a multi-agent system.
3. Fan usefulness testing and more varied failure/correction cases; synthetic realism calibration.
4. Code consolidation and reproducible clean-machine setup; public GitHub with private configuration excluded.
5. Public hosting, inference caching/abuse protection, credit monitoring and judging availability.
6. Final demo video, pitch, testing instructions, category selection and registration eligibility confirmation.

Next substantial milestone should focus on one coherent contextual investigation and evaluation, rather than another isolated selector or display tweak.

## Subsequent contextual milestone
Role-history substitution investigation is now implemented in a narrow form; see the latest WORKFLOW.md entry and MATCH_PACKAGE.md optional history contract. Current tests: 15 files. Broader contextual reasoning and agent-directed retrieval remain outstanding.

## Evaluation and source preparation update
Current suite: 16 files pass. Controlled context evaluation and a fresh-copy-verified source archive are prepared. See CONTEXT_EVALUATION.md, TESTING.md and DEPLOYMENT.md. Public hosting, inference usage controls, repository publication, license decision and final submission remain outstanding.
