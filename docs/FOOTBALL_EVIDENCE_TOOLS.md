# Football evidence tools — Batch 3

Evidence packet schema **11** adds `football_tools` alongside the existing `comparisons`, `sequence_analysis` and `investigations` fields. Match-package input version remains 1. The local Foundry path still ranks stories; autonomous tool selection is Batch 5.

## Tools and interpretation

| Tool | Output and denominator | Unavailable / boundary behaviour |
|---|---|---|
| `roleHistory(data, {player_id, position, asOf, limit=5})` | Most recent available prior-match records, role minutes / all recorded minutes, source and availability times, omitted older record count | Missing or zero-minute history has a null share. No recorded minutes in a role is not proof of no real experience. Unknown players and invalid limits rejected. |
| Substitution investigation | Entry-time assigned role, equal 300-second player windows, completed / attempted passes, actual on-pitch seconds, concurrent event IDs | Before/after counts are null while the complete comparison is unavailable. Later role declarations cannot rewrite the entry role. Dismissals/replacements can shorten exposure despite equal clock windows. |
| `compareFootball(data, events, {boundary, asOf, window=300, trigger_id})` | Both teams: pass completion with attempts, shots per match-clock minute, attacking-third and shot sequences / complete groups, disciplinary states; concurrent goals, dismissals, substitutions and declared shape changes | Requires two complete windows inside 0–5400, revealed through the end. Missing spatial support is unavailable. Supported data with zero complete sequences has a null share, not a zero success rate. |
| `formation(data, events, {from,to,asOf,endExclusive=false})` | Declared shape before/after, all declarations and assignments in the interval, state source IDs | `no_recorded_change` describes the input record, not observed movement. Starting state precedes events at `from`; ending state normally includes `to`. |
| `discipline(data, events, {from,to,asOf,endExclusive=false})` | On-field counts before/after; booked players still on field / on-field denominator; caution and dismissal event counts, state source IDs | Second-yellow dismissal records do not create additional distinct players. Substituted/dismissed booked players leave the on-field booked set. Reports/annotations are not sanctions. |
| `analyseSequences` | Complete possession groups, successful advanced endpoints, shot groups, early losses, source IDs and examples | Reports included, boundary-crossing and unfinished groups separately. A failed advanced action does not count as a successful entry. No off-ball tracking, pressure, support or net distance inferred. |

Window comparisons use `[start,end)` on each side; the selected viewer interval retains the existing inclusive event convention. The right endpoint is explicitly excluded from comparison state, card counts, possession inputs and concurrent changes. A sequence touching a window boundary may be excluded; the tool records exclusions instead of filling missing results with zero.

The sequence denominator is **complete recorded sequences**, not all real possessions; an attacking-third “entry” is a group with a successful endpoint in that zone, not a measured crossing from outside it. Rates are descriptive. Equal clock duration does not guarantee equal possession exposure, player exposure, opponents, score state or tactical conditions. No tool estimates a causal substitution/card/formation effect or chance quality.

## Integration and inspection

`server/football-tools.cjs` supplies the shared deterministic tools. `server/investigation.cjs` reuses role retrieval and player exposure. `server/evidence.cjs` computes formation/discipline for every valid interval and enriched comparisons around substitutions, declared formation changes and dismissals. Both input paths share this implementation.

In the viewer, explain an interval, then expand **Explore the play behind this explanation**. Substitution sections show history sources and exposure; possession sections show excluded groups. Before/after cards show pass attempts, progression denominators, card counts and concurrent changes. The final disclosure shows declared shape and booked on-field players. The detailed calculation disclosure contains the structured source record. **Inspect calculations and raw evidence → Compare before & after** provides the same comparison data without a model request.

## Verification

`tests/football-tools.cjs` uses hand-authored packages with positive, negative and boundary cases for history, substitution exposure, progression, formation and discipline. It covers zero denominators, late and exact-time history availability, five-record cap, incomplete/end-of-match windows, shortened exposure after dismissal, second-yellow accounting, later role reassignment, mirrored directions, excluded sequences and dismissal-trigger readiness. Existing tests retain both directions, future-source, identity and source-validation coverage. Three-seed built-in/upload parity now includes `football_tools`.

Run:

```sh
node --test tests/*.cjs
node tools/check-football-evidence.cjs
```

The second command writes `docs/batch-3-evidence-evaluation.json`: all 24 frozen Batch 2 scenario/mode runs, every check outcome, source hashes/runtime/revision and a structured concurrent-change example. It does not overwrite the original Batch 2 baseline artifacts. Holdout cases here are regression checks, not a blind model test. Semantic usefulness review, tool-choice evaluation and live cost/latency comparisons remain later work.
