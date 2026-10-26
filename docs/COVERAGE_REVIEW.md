# Touchline coverage review — 26 October 2026

This is an implementation audit and prioritisation document, not a predicted judging score. “Implemented” means a bounded prototype path exists, not production readiness. “Partial” means only part of the proposed outcome is supported. The README, user guide and this report were reconciled against the 0.5 source and existing evaluation records. No fan study or new model benchmark was performed for this review.

Official rubric: [section 6](https://github.com/microsoft/insidethegamehackathon/blob/main/OFFICIAL%20RULES.md#6-judges--criteria). Stage one screens viability/theme/technology fit. Stage two has five equally weighted categories. Row labels below are concise paraphrases; assessment and priorities are our own.

## Every judging prompt

| Criterion / judging prompt | Current implementation and evidence | Gap / next useful improvement |
|---|---|---|
| Technology: creative, optimised synthetic data | Seeded 90-minute generation; squad-linked actors, role weights, possession groups, tactical/control seeds, authored contrasting histories; provenance and distribution audit. See DATA_PROVENANCE.md, full-match.js, tools/audit-matches.cjs. | Not empirically calibrated. Compare distributions against stated target ranges and add held-out challenge scenarios rather than more arbitrary fields. |
| Technology: development practices | 19 test files; 288 deterministic combinations; history variants; schema validation, availability boundaries, fallback/cache/allowance tests; clean public download checked. See PRODUCT_EVALUATION.md and tests/. | No CI workflow in the current tracked source; no independent code review or production load/accessibility audit. Add CI and adversarial uploaded-package cases. |
| Technology: Microsoft platform use | Live gpt-5-mini ranking in Microsoft Foundry; private Node backend; HTTPS Azure App Service Free F1. See ARCHITECTURE.md, PUBLIC_DEMO.md and server/provider.cjs. | Foundry is used narrowly as inference hosting. Agent orchestration, tracing and an integrated quality/cost comparison would deepen the demonstration. Extra services are not valuable without a purpose. |
| Technology: structure/documentation/maintenance | Separate simulator, validation, evidence, history investigation, ranking, story rendering and interface files; user guide, schema, provenance and testing instructions. | Accumulated UI wrappers remain technical debt; some older design prose was stale. Consolidate modules and keep authoritative current-status documents distinct from historical notes. |
| Agentic: creative patterns | Context retrieval, comparison and constrained ranking form a reliable workflow with explicit evidence ownership. | Tool execution is fixed. Add model-selected bounded evidence questions, a stopping rule and a revisiting loop. A workflow is not autonomous simply because stages are named. |
| Agentic: orchestration/MCP/collaboration | Single service with deterministic tools and a ranker. | No agent-selected tools, MCP orchestration or purposeful multi-agent collaboration. Not mandatory to add all of them; demonstrate one useful evidence-seeking loop and compare it against the fixed pipeline. |
| Agentic: novelty / meaningful improvement | Integrates interval selection, supplied role history, source inspection, focus and glossary in a fan workflow. | Combination value is plausible, not established novelty. Need equal-information baselines and independent usefulness evaluation; adding an LLM or history fields alone does not prove innovation. |
| Impact: importance of problem | Concrete missed-interval and cross-language football vocabulary journeys; prepared example gives a testable use case. | No fan interviews or observed task-success evidence. Ask unfamiliar fans to explain the interval after using the tool versus a standard recap. |
| Impact: deployment potential | Working public deployment; private key handling, input validation, throttling, cache, call ledger and local fallback. | Free single-process host, temporary uploads, no accounts/durable store, no provider adapter or availability guarantee. Production readiness is partial; verify judges can still exercise the Foundry path rather than only an exhausted-allowance fallback. |
| Impact: end-user/developer/business value | Fan catch-up and player follow; documented package/API; potential companion/broadcast integration. | No measured time saved, comprehension gain, repeat use or broadcaster/developer integration trial. These are hypotheses rather than proven impact. |
| UX: intuitive experience | One commentary workspace, prepared example, interval shortcuts, lineup follow, six-language glossary, evidence disclosures, stale/future guards; narrow viewport checked. | Some underlying Quick guide steps retain phase-fixture language. Independent onboarding and accessibility testing are absent. Prioritise comprehension over extra controls. |
| UX: video communicates value | Current 108-second narrated walkthrough shows interval context, evidence, focus, glossary, uploads and Azure/Foundry. See video-timeline.json and narration-script.json. | It spreads time over many features. Lead with one before/after user answer; show a compact evaluation/architecture frame and acknowledge the bounded ranker. See VIDEO_REVISION_PLAN.md. |
| UX: frontend/backend balance | Replay, statistics, lineups and popups in browser; validation, evidence, retrieval, source-owned wording and private inference in backend. | Stronger user tests and clearer runtime diagnostics would demonstrate the balance better than listing modules. |
| Category: selected category fit | Best Use of Microsoft Foundry Project is a defensible target because inference actually runs through Foundry; Azure hosting is also real. | Depth is limited. Show why model selection improves relevant story ordering against a deterministic baseline. This is not a Best Multi-Agent System entry. No prize/category outcome is guaranteed. |

Evidence links: [architecture](ARCHITECTURE.md), [product evaluation](PRODUCT_EVALUATION.md), [context evaluation](CONTEXT_EVALUATION.md), [frozen scope](FINAL_SCOPE.md), [input contract](MATCH_PACKAGE.md).

## Challenge pipeline and supporting capabilities

| Challenge element | Touchline today | Boundary |
|---|---|---|
| Ingest | Validated synthetic JSON packages and built-in seeded replay | Completed packages replay as a stream; no live external push feed. |
| Interpret | Event statistics, possession progression, matched windows, role-history denominators | No inferred off-ball tactics, calibrated xG or causal effects. |
| Explain | Supported contextual stories and source expansion | Finite catalogue; model ranks IDs, not unrestricted prose. |
| Render beside a match | Public browser dashboard with pitch, bars and commentary | No actual broadcast synchronization/overlay integration. |
| Personalise | Quick/Tactical, team/player focus, selected-language glossary | Not persistent fan profiles, full translated commentary or rivalry-aware recommendations. |
| Player identity | Stable synthetic IDs, actor links, rosters and detail dialogs | No visual identification, measured speed or distance. |
| Passing / speed | Passing counts/completion and progression proxies | No calibrated pass difficulty, ball speed or shot-speed measurements. |
| Automatic event detection | None | No video perception. These suggested feature families are not automatically all submission requirements. |
| Synthetic-data innovation | Provenance, controllable histories and reproducible scenarios | More records do not automatically mean richer analysis or realistic data. |
| Global-language experience | English-first UI plus six curated glossary languages | Full multilingual storytelling remains absent by deliberate current scope. |

## Complete brainstorm reconciliation

The original IDs are retained from IDEAS.md. The status here supersedes earlier appended progress notes. “Website voice” is distinct from the synthetic narration in our demo video.

### User-originated ideas

| ID | Idea | Current coverage | Status / remaining work |
|---|---|---|---|
| U01 | Substitution contribution | Entry, usual/assigned role, supplied history, matched involvement and concurrent changes | Partial; no causal impact estimate or comprehensive chance-quality analysis. |
| U02 | Goalkeeper repeats a recent error | Named keepers and saves only | Missing comparable historical error/opportunity records and retrieval. |
| U03 | Red-card impact | Dismissal stories, personnel state and essential-incident coverage | Partial; no dedicated exposure-normalised man-down causal analysis. |
| U04 | Yellow-card effect / caution | Booking story; older controlled flank fixture | Partial; full-match commentary cannot establish changed risk-taking or opponent targeting. |
| U05 | Recruitment / senior management | None | Deferred; multi-match squad, transfer and availability evidence needed. |
| U06 | What might happen next | Evidence-owned what-to-watch questions; full-time takeaway | Partial; not forecasting or a persistent hypothesis monitor. |
| U07 | Longer-term consequences | None | Deferred; fixtures, competition state and availability needed. |
| U08 | Manager system versus squad fit | Fictional manager/declared formation labels | Partial context only; no history or suitability inference. |
| U09 | Translated player names / football terms | Small curated dictionary and selected name aliases | Implemented narrowly; broader entities/pronunciation/search absent. |
| U10 | English UI with other-language explanations | Six glossary languages with translated definitions | Implemented for glossary, not commentary translation. |
| U11 | Upset / unusual match | Match events and score only | Missing explicit pre-match baseline, standings and surprise analysis. |
| U12 | Player style / recent discipline | Current-match actions/cards | Missing historical exposure-aware style records and comparison. |
| U13 | Position familiarity | Available recent role-minute retrieval and denominator | Implemented narrowly at substitution; not full career/role modelling. |
| U14 | Rare/new formation | Authored half-time shape change and retained-shape control | Partial; change is shown, historical rarity is not measured. |
| U15 | Unfamiliar starting XI | Starting/current rosters | Missing prior lineups and minutes together. |
| U16 | Explain result versus fan expectation | Interval/full-match supported recap | Missing captured prior expectation and explicit baseline comparison. |
| U17 | Bench, injuries, prior results/opponents, manager history | Bench, manager label and narrow player role history | Partial; injuries, team form and manager history absent. |
| U18 | Useful beyond asking a generic chatbot | Automatic package context, replay state, source navigation, glossary and focus | Plausible workflow advantage; no equal-input ChatGPT comparison or fan study. |
| U19 | Hands-on guide | Reopenable Quick guide and prepared example | Implemented, with some stale legacy step copy to fix. |
| U20 | Select arbitrary missed minutes | Whole-minute From/To, shortcuts, local recap and selected-interval commentary | Implemented within revealed time; not arbitrary open-ended questions. |
| U21 | Squads, starting XI, roles, manager | Starting/current XI, bench, player details and follow action | Implemented with declared positions, not tracking. |
| U22 | Explain input in onboarding | Package panel, example/download/validation explanation; new written user guide | Partial; finish consistent coverage in all in-app guide steps. |
| U23 | CSV and other formats | Canonical JSON v1 only | Missing explicit CSV adapter; do not pretend arbitrary files can be interpreted safely. |
| U24 | Support/lean/neutral preferences | Both sides/either team, player focus; facts remain fixed | Partial; no lean strength, rivalry graph or saved profile. |
| U25 | Edition-specific official rules | Official links, checked local dissent excerpt, retrieval label | Partial; applicable edition/competition not pinned across a rule catalogue. |
| U26 | Shot-level and cumulative xG | Illustrative shot outcome probabilities in simulator only | Missing xG field/model provenance, aggregation, display and evaluation. |
| U27 | Penalty-taker / keeper history | None | Missing attempts, directions/perspective, outcomes, samples and shootout distinction. |
| U28 | Richer model / creative agents | Deterministic history investigation and model story ranking | Partial foundation; agent-selected evidence and hypothesis revisiting absent. |
| U29 | README as a detailed user instruction | Viewer-first README plus USER_GUIDE.md added in this review | Implemented in documentation; validate with an unfamiliar user. |
| U30 | Demonstrate judging value in video | Feature walkthrough exists; criterion/time map and revised-cut plan added | Partial; current published video has not been replaced by the proposed cut. |
| U31 | Memorable human/touchline moments, confrontations and unusual incidents | Extensible supplied annotations, delayed reports and corrections; fictional disagreement example | Partial; no video detection, emotion/motive inference or automatic enumeration of every possible incident. |
| U32 | Standard match statistics and comparison bars | Event-derived side-by-side totals, bars and higher-value highlighting | Implemented for supported metrics; xG and advanced tracking metrics absent. |
| U33 | A full match rather than just a short experiment | Seeded 90-minute match and replay-aware statistics/lineups | Implemented for two 45-minute halves; no added-time periods, extra time or shootouts. |

### Assistant-proposed ideas

| ID | Idea | Current coverage | Status / remaining work |
|---|---|---|---|
| A01 | Interval catch-up | Selected observed interval, stories, recap and sources | Implemented. |
| A02 | Patterns behind play | Complete possessions, progression and matched event windows | Partial; off-ball patterns and intent absent. |
| A03 | Possession versus threat | Possession duration, successful progression and shots | Partial; no calibrated chance quality. |
| A04 | Repeated matchup/targeting | Older coarse flank fixture | Partial diagnostic only; not full-match matchup tracking. |
| A05 | Pressing/build-up/escapes | Recorded sequence endpoints | Missing pressure evidence and role-aware escape patterns. |
| A06 | Space/overloads/off-ball work | Declared slots | Missing tracking/snapshots; cannot infer movement from the schematic pitch. |
| A07 | Fatigue/protecting a lead | Score/event context | Missing physical evidence and competing behavioural explanations. |
| A08 | Set-piece routines | Corner/event counts | Missing linked routine and outcome analysis. |
| A09 | Creation versus finishing/keeping | Shots/goals/saves | Partial; chance-quality and goalkeeper opportunity model absent. |
| A10 | Similar-opponent comparisons | None | Missing similarity definition, history and adjustment. |
| A11 | Revisit hypotheses | Static next-to-watch question | Missing stateful evidence tests and later updates. |
| A12 | Evidence and alternatives | Source IDs, scopes, concurrent changes, missing-data rules | Implemented narrowly; no comprehensive semantic fact verification. |
| A13 | Depth/frequency based on significance | Paragraph budgets, essential incidents and quiet overview | Partial; no autonomous live alert policy or learned salience. |
| A14 | Depth/team/player personalisation | Quick/Tactical plus both/either team and player | Implemented; no durable preferences or bias distortion. |
| A15 | Spoken commentary/pronunciation | Narrated demo video only | Website voice remains missing. |
| A16 | Regional aliases/search/saved words | Curated glossary aliases | Partial; no vocabulary collection, bilingual search or full entity dictionary. |
| A17 | Broadcaster/editor output | Structured story/evidence objects internally | Missing editor approval/export/synchronized overlay workflow. |
| A18 | Alternative simulated continuations | Seeded match generator | Missing counterfactual experiment design; a new seed is not causal evidence. |
| A19 | Partnerships / continuity | Current rosters | Missing shared-minute and prior-XI records. |
| A20 | Workload / rotation | None beyond narrow history minutes | Missing rest, travel and workload context; no fatigue diagnosis. |
| A21 | Uncertainty/conflicting evidence | Explicit scopes, correction availability, missing history and fallback | Partial; no formal calibrated uncertainty or general contradiction resolver. |
| A22 | Explain missing inputs | Missing-history behaviour, coverage disclosures and limits | Implemented narrowly; opportunity for clearer story-specific “what would help” prompts. |
| A23 | Configurable/persistent uploads | Documented fixed resource bounds | Missing user-managed clear/replace policy, configuration and durable storage. |
| A24 | More user journeys | Catch-up, player/team follow, glossary and incident explanation; full-time takeaway | Partial; no substantial pre-match briefing, live adaptive alerts or expectation-led result review. |

Additional conversational coverage: standard side-by-side statistics and highlighting are implemented; full fictional match replay is implemented; human/memorable moments use supplied extensible annotations, not visual detection. EVENT_CATALOGUE.md covers broader families, including interruptions, reviews, weather, medical events and competition implications; those catalogue entries are not blanket implemented features. Core goal/VAR reversals, added time/extra time and shootouts remain unsupported.

## How the current video demonstrates the criteria

| Current video time | Evidence shown | Criterion it supports / what it does not show |
|---|---|---|
| 0–8 | Missed-ten-minutes problem | Impact and audience; no measured benefit. |
| 8–38 | Synthetic replay, stats, squads and role distinction | Technical implementation and UI; no validation/CI evidence. |
| 38–62 | Interval/focus selection and Ellis context | Personalisation and context value; Foundry selects stories, not tools. |
| 62–72 | Sources and comparisons | Explainability and backend evidence ownership. |
| 72–85 | Quick mode/focus and glossary | UX and accessible vocabulary; no full translated commentary. |
| 85–100 | Package input, corrections and rule reference | Input contract and knowledge-time handling; not a comprehensive referee engine. |
| 100–108 | Azure/Foundry and local fallback | Category fit; no architecture/evaluation results frame. |

The video should make value and evidence visible rather than recite criterion names. Its main gap is time spent on feature breadth while the actual AI contribution and evaluation remain brief. The revised-cut proposal is a plan, not a change already uploaded to YouTube.

## Prioritised next steps

| Priority | Work | Visible benefit / criterion | Acceptance evidence |
|---|---|---|---|
| 1 | Viewer-first documentation, consistent in-app onboarding and 3–5 unfamiliar-user tasks | Faster first useful explanation; UX/impact | Users complete catch-up, identify one non-obvious contextual fact and locate a source without assistance. Record failures as well as successes. |
| 2 | Evaluate and deepen one bounded investigation loop | More useful analysis instead of extra totals; agentic/technical | Planner chooses among as-of history, progression and comparison tools; stops when answered; missing/contradictory evidence handled; source-bound output; capped calls/cost. |
| 3 | Equal-information comparison: deterministic priority, Foundry ranker, proposed investigator | Establish whether AI adds value | Same inputs and tasks; blinded relevance/usefulness, unsupported-claim rate, latency, tokens and cost. Keep a quiet and negative-control case. |
| 4 | Add supplied/illustrative shot xG with provenance, then chance-quality stories | Distinguish low-value shots from dangerous chances | Shot outcome schema avoids double counting; probabilities labelled supplied/illustrative versus calibrated; team/interval cumulative totals reconcile. Do not train an ad-hoc model and call it validated. |
| 5 | Compact criterion-aware video and CI | Make working value and reproducibility assessable | Actual UI example, genuine architecture and small-sample evaluation disclosure; <120 seconds; CI runs reproducible tests. |
| Later | Explicit CSV adapter; pinned rule editions; broader historical context | Adoption and useful story breadth | Each extension has a schema, missing-data behaviour and independent checks before being advertised. |

Do not expand all brainstorm items before submission. The most valuable technical next step is a narrow investigation that answers a fan question better, with a demonstrated baseline comparison. More synthetic biographies, services or agents are not a substitute for that evidence.
