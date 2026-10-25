# Football event and context catalogue — research draft, 25 October 2026

Purpose: design a broad, extensible input vocabulary before adding more one-off scenes. This is an original product taxonomy informed by the primary sources below, not an exhaustive universal football standard. Items listed here are NOT automatically supported by Touchline. No real-match records have been imported into the synthetic simulator.

## Research basis
- StatsBomb Open Data documentation index: https://github.com/hudl/open-data/tree/master/doc ; official metric definitions: https://stats-portal.statsbomb.com/glossary . Used to distinguish action records, outcomes, qualifiers and counting definitions. Provider definitions must be versioned rather than assumed interchangeable.
- IFAB Law 12: https://theifab.com/laws/latest/fouls-and-misconduct/ . Used to recognise that disciplinary events can involve substitutes and officials, and that misconduct is broader than an on-ball foul. This catalogue is not an implementation of the Laws.
- Chelsea's 2022 League Cup final report: https://www.chelseafc.com/en/news/article/carabao-cup-final-report--chelsea-liverpool . The report contains disallowed finishes, a confrontation, injury-related personnel changes, an extra-time goalkeeper change and a shootout. Its evaluative language is a club viewpoint, not neutral event truth.
- Chelsea's 2024 final report: https://www.chelseafc.com/en/news/article/carabao-cup-final-report-chelsea-0-1-aet-liverpool . Illustrates linked shots/blocks, woodwork, intervention and extra-time context. Distinguish the described actions from the author's assessment of control/chance quality.
- Premier League statement on Bournemouth–Luton: https://www.premierleague.com/en/news/3830154 . Demonstrates medical interruption, abandonment and a later replay decision as separate records known at different times. Use this as a schema lesson, not entertainment or a synthetic diagnosis.

Scope of review: targeted event documentation plus a small, diverse sample of reports/statements. Not a systematic review of all matches, not a frequency estimate and not proof of complete event coverage.

## Four layers
1. Action: an observable or explicitly annotated occurrence.
2. Decision/state update: the official outcome or a revised decision linked to the action.
3. Context: facts available before/at a time, e.g. usual role, availability or prior appearances.
4. Derived interpretation: calculated patterns or hypotheses, with source references and uncertainty.

Do not encode 'momentum changed because the manager was angry' as an observed event. A gesture annotation and a later change in measured activity are distinct records; neither proves the other caused it.

## Coverage map

| Family | Candidate occurrences / qualifiers | Typical input / treatment |
|---|---|---|
| Match lifecycle | kickoff, period start/end, interval, added-time announcement, extra time, shootout start/end, suspension, resumption, abandonment, postponement, full time | Period-aware clock and match status. Shootout goals separate from match score. |
| Possession and progression | pass/receipt, carry, dribble attempted/won/lost, turnover, miscontrol, ball recovery, switch, through ball, cross, cutback, long ball, pressured action | Structured actions with participant IDs, outcomes, locations and possession links; pass qualities generally qualifiers, not extra counted passes. |
| Defending and contests | tackle, interception, clearance, block, aerial/ground duel, challenge, loose-ball contest, recovery, last-line intervention | Distinguish attempt/outcome; never infer aggression solely from cards. |
| Finishing | shot, goal, own goal, miss, blocked/saved effort, woodwork, rebound, headed attempt, penalty attempt, disallowed finish | Outcome and links prevent double counts. A disallowed finish is not an official goal. |
| Goalkeeping | save, catch, punch, parry, spill, smother, sweep, distribution, penalty save, failed claim, handling-related decision | Evidence-defined actions; 'error' needs attribution and comparable context, not hindsight blame. |
| Restarts | corner, throw-in, goal kick, direct/indirect free kick, dropped ball, penalty awarded/taken/retaken, restart delay, encroachment | Link award, execution and decision; do not count the award and delivery as two corners under one chosen definition. |
| Refereeing and review | foul/advantage, offside, review opened, on-field review, decision confirmed/reversed, goal/penalty cancellation, mistaken-identity correction | Initial state, pending state and authoritative final state; emit corrections instead of silently rewriting history. |
| Discipline and conduct | caution, second caution, direct dismissal, dissent, delay, simulation allegation/ruling, confrontation, off-ball contact, bench/official sanction, refusal to leave | Separate observed behaviour, reported allegation and official sanction; dismissed bench staff do not reduce on-field player counts. |
| Personnel and availability | XI/bench announcement, late withdrawal, substitution, injury stoppage, treatment, temporary exit/re-entry, concussion-related change, goalkeeper replacement, equipment issue, captaincy change | Role-aware state; medical condition or return date only from an explicit attributable record. |
| Tactical instructions | declared formation, role swap, shape change, instructed pressing/line-height change, set-piece assignment, positional switch, formation after dismissal | Manager/annotator declaration differs from measured execution. Spatial claims need appropriate tracking or annotations. |
| Human and memorable moments | celebration, tribute, sporting gesture, touchline reaction, gesture towards crowd, equipment/bottle incident, manager interaction, player disagreement, unusual interruption | Source annotation with neutral wording and optional clip/time pointer. Do not invent emotion, motive or jokes around medical emergencies. |
| Environment and operations | weather interruption, visibility issue, pitch condition, lighting/technology fault, object on field, spectator intrusion, crowd-related delay, ball/equipment replacement, official injury | Verified observations and match-status updates. Unknown causes stay unknown. |
| Competition implications | qualification/relegation condition met, aggregate lead, tie-break condition, milestone confirmed, record claim, table update | Derived from competition rules and timestamped external state; cannot infer from isolated match events. |
| Reporting and correction | incident first reported, later confirmation, correction, withdrawal, duplicate merge, attribution change, translation correction, missing-feed interval | Knowledge-time and provenance layer; preserve superseded versions and avoid treating missing records as proof of no incident. |

These are families and illustrative subtypes, not a requirement to make a separate top-level event for every word. A flexible annotation family can preserve an unforeseen incident without inventing a bespoke event type.

## Context catalogue (separate from match events)
- Player: usual positions, actual role history, recent minutes, disciplinary opportunities/rates, injuries/availability, comparable incidents, name aliases and pronunciation.
- Squad: bench coverage, starting-XI continuity, partnerships/shared minutes, available roles, rotation and missing regular starters.
- Manager: dated formation/role preferences, historical systems, explicit statements and recent changes; distinguish reputation from observed deployment.
- Team: recent results/opponents, opponent-adjusted performance, fixture/rest context, competition standing and documented pre-match expectations.
- Season/club: transfers and squad construction, financial/management records if relevant and sourced. Recruitment blame cannot follow from one match.

## Derived story catalogue
Counterattack, overload, repeated targeting, press escape, build-up difficulty, chance-creation change, territorial/control change, set-piece threat, substitution contribution, disciplinary exposure, role unfamiliarity, rare lineup/shape, upset relative to an explicit baseline, comeback, game-state adjustment, milestone and conditional next-to-watch hypothesis. Each needs a stated method and sufficient inputs; these are not generic facts to fabricate from a sparse feed.

## Current implementation coverage
- Existing full-match events: kickoff, period end, pass/carry, foul/card, shot/goal/save, corner/restart, substitution, possession-end and authored tactical change.
- Existing context: small fictional squads, declared roles/managers/formations, narrow fixture history, six-language glossary.
- Existing calculations: prefix statistics, substitution involvement and limited equal-window comparisons.
- NOT implemented: general upload format; broad incident annotations; injury/manager histories; review/retraction processing; extra time/shootout; medical/abandonment lifecycle; real video detection; comprehensive story selection or semantic verification.

## Common record design to implement next
Stable IDs; match ID; period and period clock plus ordering; happened_at; available_at; participants with entity roles (player/manager/official/other); source/provenance; synthetic flag; status (reported/confirmed/corrected/withdrawn); related_event_ids; supersedes; optional location and optional evidence pointer. No location is required for a touchline reaction. A confidence score is optional only when its meaning and source are defined, never an invented probability.

Actions and annotations must not mutate score/lineup merely because their text mentions a goal or red card. Only validated state-changing decisions do that. Preserve corrections, source disagreement and unknown/unmapped kinds. Post-match reports become available at publication/annotation time; retrospectively using them during a replay without an explicit retrospective mode would leak information.

## Implementation order
1. Define and validate the uploadable match-package contract: events, squads, optional annotations/context, provenance and knowledge timestamps. Include an unknown-annotation route.
2. Connect upload/example packages to the existing replay and backend instead of adding more hard-coded generator scenes.
3. Implement a linked-record vertical slice: incident -> report -> confirmed decision/correction -> updated recap, with no premature score/personnel changes.
4. Add a key-moments timeline, configurable story selection and grounding from selected records. Serious interruptions take precedence over light memorable moments.
5. Evaluate original synthetic cases inspired by the coverage gaps: ordinary quiet play; injury and substitution; confrontation plus delayed sanction; provisional goal reversed; formation change with conflicting metrics; non-impactful memorable incident. Include missing/conflicting data and future-information controls.
6. Add richer player/manager/availability context through the same contract; expand supported families only when processing and checks exist.

Real sources inform design. They are not relabelled as synthetic training or demo data. Full raw reports, footage and licensed datasets are not copied into the project by this research pass.
