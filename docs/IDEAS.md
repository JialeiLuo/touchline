# Touchline idea register

Living project backlog. Update this file when the user proposes an idea or development reveals a useful new one. This is a record, not a promise to implement every item. Keep user suggestions, proposed extensions and implementation status distinct. No real football conclusions have been validated.

Status: prototype = narrow demonstration exists; proposed = not implemented; foundation = partial supporting infrastructure exists.

## Product goal
An English-first AI football co-commentator that follows match events, connects them to relevant history, answers follow-ups and explains evidence. Selected-language glossary aids help fans discuss football across languages. Replay cards are rule/template based; selected-interval AI commentary is connected through Microsoft Foundry.

## User-originated ideas

| ID | Idea | Evidence needed / treatment | Status |
|---|---|---|---|
| U01 | Explain whether substitutions contributed to a change | Incoming player actions, roles, before/after opportunities, other changes; distinguish contribution from causal attribution | foundation: substitution event and caveat only |
| U02 | Recall whether a goalkeeper made similar errors recently | Consistent incident definitions, comparable opportunities, historical records; avoid judging by raw incident counts | proposed |
| U03 | Assess red-card impact | Score/time, personnel, territorial/chance changes and opponent response | proposed |
| U04 | Assess yellow-card impact and possible caution | Comparable defensive opportunities, challenge choices and opponent targeting; do not presume caution | prototype: flank-count signal only |
| U05 | Assess recruitment/senior-management contribution to squad weaknesses | Squad depth, transfers, finances, availability and multiple matches; frame alternatives, not blame from one match | proposed, later scope |
| U06 | Discuss what might happen next in the match | Conditional scenarios; probabilities need a tested forecasting method | foundation: what-to-watch template only |
| U07 | Discuss longer-term consequences and future performance | Fixtures, standings, strength, availability and uncertainty | proposed |
| U08 | Assess manager's preferred tactics/formation versus current squad fit | Tactical history across clubs, role requirements, player attributes, observed execution; contextual hypotheses | proposed |
| U09 | Bilingual player names and professional football terms | Stable IDs, aliases, contextual translations, regional variants | prototype: small curated glossary |
| U10 | English main interface plus selected-language explanations | English content; glossary translation and definition in selected language; optional English explanation | prototype: six glossary languages |
| U11 | Analyse unusual matches/upsets more deeply | Explicit pre-match expectation, table/strength context, match performance; result surprise differs from performance surprise | proposed |
| U12 | Player personal style / discipline over recent matches | Cards, fouls, duel types and exposure (minutes/opportunities), role, opponents, refereeing; cards alone cannot establish aggression | proposed |
| U13 | Position familiarity / playing out of position | Historical positions, actual roles, minutes and role-specific actions; nominal position is not the entire role | proposed |
| U14 | Detect a new/rare formation | Formation history, in/out-of-possession shape, sample size and manager context; event-only inputs insufficient for precise shape inference | proposed |
| U15 | Detect an unfamiliar starting XI or squad | Starting XI history, combinations, minutes together, injuries/rotation; novelty does not imply poor performance | proposed |
| U16 | Explain an unexpected result relative to the fan's prior expectation | Capture the stated reason/baseline and compare evidence; do not invent expectations | proposed |
| U17 | Include bench, injuries/return dates, past opponents/results and manager context as needed | Timestamped fictional context initially; only use fields relevant to an output | foundation: fictional substitution and one history record |
| U18 | Make the product useful beyond asking ChatGPT | Automatic current-match context, evidence navigation, continuous updates and minimal viewing interruption | overarching evaluation requirement |

## Assistant-proposed ideas

| ID | Idea | Evidence / implementation notes | Status |
|---|---|---|---|
| A01 | Catch-up: what changed while I was away? | User interval, events and prior comparison windows | prototype: fixed recap only |
| A02 | Explain patterns behind recent play | Linked sequences, rolling comparisons, minimum evidence | prototype: flank pattern only |
| A03 | Distinguish possession from threat | Possession duration, progression, territory and chances | proposed |
| A04 | Player matchups and repeated targeting | Repeated encounters, outcomes and chance creation | prototype: coarse flank proxy only |
| A05 | Pressing, build-up problems and escape routes | Pressured actions, recoveries, passing sequences | proposed |
| A06 | Space, overloads and off-ball contributions | Tracking or snapshots; do not infer detailed movement from sparse ball events | proposed |
| A07 | Fatigue and protecting a lead | Physical evidence for fatigue; score-state and behavioural alternatives | proposed |
| A08 | Set-piece routines and recurring threats | Comparable deliveries, contacts and outcomes | proposed |
| A09 | Separate chance creation, finishing and goalkeeping | Appropriate shot/chance evidence; uncertainty for small samples | proposed |
| A10 | Compare previous games against similar playing styles | Similarity definition, opposition/context adjustments | proposed |
| A11 | Maintain and revisit hypotheses | State expected observable signs; strengthen/weaken as events arrive | foundation: static what-to-watch text |
| A12 | Show evidence and alternative explanations | Event IDs and numerical evidence; distinguish fact, interpretation, forecast | prototype |
| A13 | Adjust commentary depth and frequency to significance | Evidence thresholds, cooldown, avoid inventing stories in quiet periods | foundation: minimum-phase threshold and control fixture |
| A14 | Simple/detailed experience and favourite-team/player focus | Same facts, different presentation/selection; no fan-bias distortion | prototype: simple/detailed only |
| A15 | Optional voice commentary and pronunciation | Audio timing, interruption controls and name pronunciation | proposed, later scope |
| A16 | Regional name aliases, bilingual search and saved vocabulary | Entity resolution and curated dictionaries; acknowledge variants | proposed |
| A17 | Editorial review / broadcaster output | Approve/edit/dismiss and timed machine-readable cards | proposed alternative audience, not current primary scope |
| A18 | Simulation-based alternative continuations | Explicit assumptions; simulator outcome is not real-world causal proof | proposed, later scope |
| A19 | Lineup continuity and partnerships | Shared minutes, recurring pairings, comparable opponents; not just XI overlap | proposed |
| A20 | Workload, recovery and rotation context | Recent minutes, rest days, travel if relevant; avoid diagnosing fatigue without evidence | proposed |
| A21 | Commentary uncertainty and conflicting evidence | Show missing/contradictory information, abstain when unsupported | foundation: current caveats |

## Near-term implementation order
1. Maintain clean event/evidence contracts and generated replay.
2. Build player-context records: discipline rates, role history, lineup novelty with denominators and timestamps.
3. Connect an AI explanation layer to evidence packets, with unsupported-claim checks and fallback.
4. Add one contextual scenario and test usefulness with fans.
5. Expand only when evidence, time and evaluation justify it.

## Data/reliability principles
- Synthetic provenance and generator version/seed are explicit.
- Keep future information and hidden simulation settings out of commentary evidence.
- Compare rates/opportunities, not only counts; disclose sample sizes and missing data.
- Observation, interpretation and forecast must be distinguishable.
- An unusual card count, position or formation is a prompt for investigation, not a diagnosis.
- Maintain negative controls, alternative explanations and reproducible checks.

## Onboarding addition
- U19: Optional hands-on guide for first-time users. Implemented as a user-invoked six-step Quick guide covering replay, interpretation, follow-ups, glossary, reproducible generation and prototype limits. Replay pauses when opened; users can close or reopen it at any time.

- U20: User-selectable catch-up interval (from/to match minutes). Prototype now produces an event-grounded interval summary and source list, restricted to the revealed replay prefix. Not an LLM narrative or complete match report yet.

Catch-up update: whole-minute selectors and recent-interval shortcuts implemented. Narrative templates now prioritise goals, chances, personnel and discipline with expandable event references. Explicit tactical-change input is supported by the narrative builder, but not generated or inferred yet. Language-model narration remains outstanding.

## Teams and lineups addition
- U21: Teams & lineups view — implemented: both starting XIs, declared formation, fictional managers, shirt numbers, usual/assigned positions, preferred foot, bench and player detail dialog.
- Current personnel and card badges use only revealed replay events. Substitutions inherit the outgoing declared slot; this does not establish actual tactical positioning. Starting XI remains inspectable separately.
- Source: data/squads.json, generated browser mirror data/squads.js. Full-match downloads include squad metadata and provenance. Injury/suspension history and manager history remain outstanding.

Squad commentary update: interval substitution facts now include authored usual/assigned role and declared manager/formation context. Limited numeric/duration/headline rejection is implemented; full semantic/causal claim verification remains outstanding. No historical style or formation suitability is inferred.

Simulator 0.2: squad-linked, role-weighted action selection, no self-passes, actual keeper identities for saves, illustrative location-dependent shot outcomes and versioned random provenance. Role-aware generation is a foundation, not tactical inference or real-football calibration. Audit distributions are recorded in simulator-audit.json.

Tactical scenario foundation: simulator 0.3 includes an explicit half-time 4-3-3 → 4-2-3-1 instruction for odd seeds and retained-shape controls for even seeds. Current lineups update declared slots; catch-up and AI evidence include a time-filtered equal-window comparison of shots/completed passes. This is authored tactical context, not inferred positioning, tactical suitability, historical novelty or causal validation.

Pitch display correction: removed the hard-coded Reed marker left over from the short booking fixture. Full-match pitch now optionally shows both teams' replay-aware declared slots and shirt numbers, with player detail actions. The latest event has a separate white marker and dynamic actor/event label. This is not tracking or simulated off-ball movement.

Audience modes implemented: separate Quick catch-up and Tactical detail preferences drive different server-owned AI instructions with identical evidence. Quick output has a length guard; citations and limited numeric checks apply to both. Expanded fact/source details reduce UI clutter. Personalisation does not yet include favourite club/player or automatic insight selection.

## Research-led scope update — 25 October 2026
Use docs/EVENT_CATALOGUE.md as the broader event/context map. It draws on structured provider definitions, IFAB misconduct categories and diverse real reports/statements, rather than only conversational examples. Four layers: actions, decisions/corrections, contextual facts and derived interpretations. The catalogue is a plan, not implemented coverage. Next priority remains a validated uploadable match-package contract, followed by linked incidents/reviews/corrections and key-moment selection. Do not add every proposed scene as a hard-coded simulator branch.

Input package v1 implemented: upload/example route, supplied squads, replay/statistics/evidence linkage, delayed incident reports and corrections, optional official-domain rule links and one curated checked IFAB quote. Unknown annotation kinds are preserved without changing score/personnel. Arbitrary provider files, uploaded quotations and core goal/VAR reversals remain unsupported.

## Product and input refinements — 25 October 2026
- U22: Expand the Quick guide to explain built-in demo versus uploading data, required input content, example download, validation errors and offline/cloud behaviour. Proposed.
- U23: Accept accessible input formats such as CSV through explicit adapters into the canonical JSON package; document required columns, units and mapping. Proposed; arbitrary CSV interpretation is not implemented.
- U24: Personalisation by neutral/support A/support B/lean A/lean B, with optional favourite player. Use preferences for relevance, ordering and phrasing; preserve facts, uncertainty and balanced major-event coverage. Proposed. Rival-club relationships are optional later context, not required for the initial experience.
- U25: Pin official-rule references to the applicable edition and competition, with law/subsection, retrieval date and stable source; retrieve relevant checked excerpts rather than sending an entire rulebook per request. Proposed; current single quote uses a latest-page retrieval label.
- A22: Explain missing input explicitly (for example no injury history or tracking), rather than filling gaps from model memory. Proposed extension to existing limitations.
- A23: Make upload limits configurable, provide clear/replace controls and optional local persistence; current 2 MB, 200 annotations, eight packages and one-hour session are prototype bounds, not football or model requirements. Proposed.
- A24: Ideal viewer journeys include pre-match context, live what-changed alerts, interval catch-up, focused player/team follow-up, rules explanation and post-match turning points. Prioritise a coherent evidence-grounded subset for submission. Proposed roadmap.

## Analysis priorities — 25 October 2026
- U26: Shot-level xG, interval/team/player aggregation and cumulative shot-quality displays. Proposed. Store model ID/version and shot features; distinguish illustrative synthetic probabilities from empirically validated xG and provider big-chance labels. Do not equate xG with winning probability or blame.
- U27: Penalty context for taker/keeper: timestamped attempts, goals/saves/misses, direction and perspective, competition, shootout versus in-match distinction and sample size. Proposed; small samples cannot establish reliable directional prediction.
- U28: Prioritise richer analysis and evidence-seeking over adding many synthetic fields. Proposed agent workflow: detect a candidate question, choose bounded as-of data tools, test alternatives, write a supported explanation, check structured claims and revisit when new evidence arrives. Current implementation remains fixed evidence preparation plus a model call, not this agent loop.
- Evaluation proposal: compare deterministic recap, one-pass model and bounded tool-using workflow on the same fixtures; measure supported/unsupported claims, relevant insight selection, correction handling, abstention, latency and token use. No novelty or superiority established yet.

Sequence-analysis foundation: complete possession groups, successful final-third entry proxy, early losses and example passages implemented for built-in matches. This does not infer off-ball support/pressure or tactical intent; next step is selecting and revisiting explanatory stories rather than reciting aggregates.

Team focus implemented: Both sides / either team; facts stay fixed, story priority changes, goal coverage retained. Substitution stories now link usual versus assigned role and subsequent recorded shots. Favourite-player and rivalry relationships remain proposed.

Viewer milestone: player involvement focus, lineup-to-commentary follow, separate concise/full story wording, explicit watch-next questions, dismissal/incident candidates, simplified viewer screen and updated input-data onboarding implemented. These are bounded evidence-derived stories, not general human-like tactical understanding. Broader history, live hypotheses, voice and agent-selected evidence tools remain proposed.

Role-history investigation implemented for supplied records: compare inherited role with last five available prior matches, minutes denominators, outgoing/incoming involvement and concurrent changes. Built-in contrasting fictional histories exercise limited versus established role experience. Manager suitability, injury histories, causality and autonomous retrieval remain outstanding.
