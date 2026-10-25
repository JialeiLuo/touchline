# Current workflow checkpoint — 25 October 2026

Viewer/personalisation milestone completed locally. See [VIEWER_MILESTONE.md](VIEWER_MILESTONE.md) for features, checks and remaining project work. Current tests: 16 files pass. Public deployment/submission and autonomous evidence retrieval remain outstanding.

---

# Workflow checkpoint — 25 October 2026

Current position: working local end-to-end prototype; reliability and audience personalisation in progress. Not submission-ready.

| Stage | State | Evidence / next work |
|---|---|---|
| Fan use case and concept | Defined provisionally | Catch-up, contextual explanations and multilingual glossary; usefulness not user-validated. |
| Synthetic input | Working foundation | Seeded full match v0.3, squads, roles, provenance, controlled shape-change scenario. Uploadable package v1 now works; needs realism calibration and richer histories. |
| Interpretation | Partial | Stats, personnel changes, declared formations and equal-window comparisons. No inferred tracking or causal analysis. |
| AI explanation | Connected | Foundry GPT-5-mini; fact citations, lexical numeric/timing guards and fallback. Full semantic evaluation outstanding. |
| Screen experience | Working locally | Replay, both teams' declared positions, lineups, stats and interval catch-up. Needs UX refinement. |
| Personalisation | In progress | Six glossary languages; Quick catch-up and Tactical detail use different server instructions on identical facts. Favourite team/player and automatic cadence not implemented. |
| Evaluation | Partial | Reproducibility, actor eligibility, chronology, controls and mocked/live integration checks. No fan study, independent realism benchmark or robust semantic evaluation. |
| Reproducible packaging | Partial | Local source, tests, prompt files, provenance and setup notes. README contains labelled historical notes; Git repository/published source still outstanding. |
| Public demo and submission | Outstanding | Hosting, controlled public inference access/costs, public GitHub, short demo video, final project-page materials and registration eligibility confirmation. |

## Next order
1. Extend package v1 with structured, verified comparisons and evaluate both commentary modes on fixed goal, substitution, quiet-play and tactical intervals; record supported claims, failures and latency.
2. Improve missing-evidence behaviour and presentation from those results; test with a fan.
3. Freeze a coherent demo scope and prepare reproducible GitHub source and run instructions.
4. Deploy the demo with usage controls, prepare video and submission materials.

Source IDs and passing tests are evidence of implementation properties, not proof of correct football interpretation. Authored formation changes are not observations inferred from video. Stay within student credit; do not upgrade billing.

Update: match-package upload, memory-backed validated sessions, delayed/corrected annotations and a curated official-rule quote are implemented. See MATCH_PACKAGE.md. Core review/reversal state changes, provider adapters, additional history and general rule coverage remain outstanding.

## Structured comparison increment — 25 October
Implemented server/comparisons.cjs: equal half-open five-minute windows around interval substitutions and declared tactical changes, both teams, shots and completed passes, explicit insufficient-window state. Evidence packet v5 includes typed observations and supporting IDs. Azure output schema requests matching structured comparison records; server rejects missing records for cited comparison facts and mismatched teams, metrics, before/after values or direction. These checks validate the structured records, not agreement of every prose phrase or causal interpretation. All 11 test files pass locally. New provider schema has not yet been verified with a live Azure response. Next: evaluate fixed examples and prose/structured consistency before adding agent tool selection.

## Live commentary evaluation — 25 October
Added tools/evaluate-commentary.cjs and docs/COMMENTARY_EVALUATION.md. Four fixed goal/substitution/quiet/tactical cases are run serially with API token usage, latency, raw output and validation failures saved. Initial and prompt-only runs each accepted only the quiet case. Schema now restricts comparison objects to actual evidence records and calculated facts include absolute count differences. All 11 test files pass, including schema regression checks. Remaining issue: prose/citation/record alignment; prefer deterministic comparison rendering rather than trusting model-written numerical prose. See saved runs for current results; a few samples do not establish reliability.

## Visible calculated comparison panel
Added comparisons-ui.js and Show before & after · no AI call. Both teams' shots/completed passes render directly from server-calculated observations, with before/after/delta, window boundaries, source IDs, missing-window guidance and no-trigger state. The panel also appears above AI results and in evidence inspection. Browser checked seed 7 at 40–48 (wait until 50) and 40–50 (Northbridge shots 2→0, completed passes 18→22; Southport 0→0 and 17→16). Screenshot: calculated-comparisons.jpg. AI prose remains subject to the previously recorded failures; separating this panel does not solve prose verification.

## Possession sequence analysis — 25 October
Added server/sequences.cjs and tests/sequences.cjs. Built-in full matches now group complete possession sequences, exclude boundary-crossing/unfinished sequences, identify completed attacking-third endpoints, shot sequences and losses before completed entry. UI shows How attacks developed with example times, involved actors and source IDs. Provider receives these facts and fallback prioritises them. This is deterministic evidence preparation, not an agent choosing tools. Uploaded packages are deliberately excluded until their attack-direction convention is explicit. Seed 7 at 40–50: Northbridge 11 complete sequences, 3 entries, 1 shot sequence; Southport 12, 0, 0. Total interval shots differ because a boundary-crossing sequence is excluded. Browser verified expandable examples; screenshot attack-sequences.jpg. All 12 test files pass. One new live Azure call fell back; sequence-commentary-live.json preserves it. Human-like AI storytelling remains unfinished.

## Narrative pipeline separation
Provider now uses a narration projection: exact comparison records remain server/UI-calculated; model sees their qualitative directions and sequence facts. Matching bracketed citation artifacts are removed before validation, unknown citations/numbers remain checked. Final-third headlines no longer trigger the unrelated final-match guard. Explanation now appears first, with analysis and coverage in expandable sections. Four live cases and a targeted live sample were saved. The targeted sample passed format checks but failed manual review (time-window conflation, penalty-area confusion, unsupported threat trend); added narrow regression guards for the latter two. Human-like, semantically reliable commentary is still not achieved. All 12 test files pass; next priority is explicit claim scope and grounded story selection, not broader features.

## Scoped story selection — 25 October
Added server/stories.cjs and tests/stories.cjs. When supported candidates exist, Foundry selects IDs from a bounded catalogue of server-constructed narratives. Wording, figures, scopes and citations are assembled locally; the UI explicitly labels AI-selected stories, not AI-written prose. Candidates cover passing/shot contrasts and complete-possession progression, plus goal coverage. Quick selects at most two, Tactical four; essential goal stories are retained. Unknown/duplicate IDs and incomplete-window stories are rejected. Fallback selects ranked candidates deterministically. The older free-prose route remains for intervals without candidates. This is bounded model selection, not autonomous evidence retrieval or general football reasoning.
API and browser live checks both succeeded around 1.4 seconds for seed 7, 40–50. Browser selected the Northbridge mixed comparison and Southport lack of completed final-third entry. Screenshot scoped-stories.jpg; API result story-selection-live.json. All 13 test files pass. Next: evaluate wider scenarios, add more meaningful grounded mechanisms and viewer-focused selection. Do not claim human-level analysis or novel architecture.

## Team focus and substitution stories
Added viewer_focus (neutral/northbridge/southport), validated on the server. The same facts/statistics generate the same candidates; focus prioritises one matching candidate while retaining goal coverage. This is relevance personalisation, not biased facts. UI team names update with supplied squads. Changing focus clears old commentary until regenerated. Substitution candidates include incoming/outgoing names, usual/inherited declared roles and subsequent shots in the selected interval, with a separate since-substitution scope. Historical style or tactical benefit is not inferred.
Browser live check: Southport focus at seed 7, 40–50 produced a Southport-first explanation in 1.2 seconds. Screenshot team-focus.jpg. Regression checks cover unchanged facts/statistics, invalid focus, goal retention, substitution visibility and no future substitution. All 13 test files pass. Next: player focus and evaluating meaningful differences in Quick/Tactical experience; technical agent retrieval remains outstanding.

## Contextual substitution investigation — 25 October
Completed one connected investigation: optional validated prior role-history records, as-of-entry retrieval, at most five prior matches, role-minute denominators, equal outgoing/incoming action windows and concurrent-change checks. Built-in authored contrasting histories: Ellis 20/305 RW minutes, Duarte 305/305, although both usual-position labels say ST. History is exported in packages and optional on upload; missing/late records do not become invented familiarity. Trace and sources appear under Explore the play behind this explanation. Overlapping basic player/substitution summaries are suppressed when the contextual story is present.
All 15 test files pass, including missing/late history, duplicate historical matches, invalid players, incomplete windows, no future substitutions and deduplication. One live API sample succeeded in 1.92 seconds and browser sample in 1.8 seconds. See investigation-check.json and contextual-investigation.jpg. Tools run deterministically; Azure ranks grounded story candidates. This is not agent-directed retrieval, inferred real tactics or a causal substitution analysis.
Next substantial milestone: compare this contextual workflow against a counts-only baseline across contrasting and missing-evidence scenarios, then prepare deployment/source packaging.

## Evaluation and source packaging milestone — 25 October
Five controlled history variants pass against a deterministic counts-only baseline, holding match events constant. Includes limited/established experience, missing/late/zero-minute history and incomplete-window abstention. This does not establish LLM superiority or fan usefulness. See context-evaluation.json and CONTEXT_EVALUATION.md.
Added package.json run/test/evaluate commands, current README and architecture/testing/deployment/provenance documentation. Static HTTP serving is restricted to application assets; docs, account screenshots, tools, server code and private configuration are blocked. Added HTTP regression checks; all 16 test files pass.
Prepared releases/touchline-0.4.0-source.zip outside the application folder. Export includes reproducible source/tests/fixtures/evaluation history and selected reviewed product screenshots; excludes private .env, account screenshots and old workspace archives. Build script scans for the configured key, records SHA-256 manifest, extracts a fresh temporary copy, runs all tests and verifies startup/template fallback without credentials. First archive omission of server.cjs was detected and fixed before the successful clean-copy run. Docker is unavailable and container execution remains unverified.
No public repository, hosting or billing change made. Public inference budgeting/abuse protection, actual hosting, final video and submission materials remain outstanding.
