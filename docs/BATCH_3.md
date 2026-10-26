# Batch 3 — Stronger football evidence tools

Completed locally on 26 October 2026. No live provider calls or Azure credit used. Publication remains Batch 10.

## Delivered

- Reusable role-history, formation, discipline and enriched comparison tools; [contracts and limitations](FOOTBALL_EVIDENCE_TOOLS.md).
- Substitutions now retain the role at entry rather than a later interval-end assignment. Actual player time on pitch accompanies equal clock windows; unavailable comparisons have null counts.
- Role retrieval includes sources, availability timestamps, minute-share denominators and older-record truncation.
- Both teams receive attempted-pass denominators, shots per clock minute, progression/shot-sequence shares, explicit missing-data states and concurrent changes.
- Possession analysis reports boundary-crossing/unfinished exclusions. Missing spatial data and no complete sequences remain distinct.
- Declared shape before/after, assignments and source IDs; booked players still on pitch, on-field denominators, caution/dismissal events and second-yellow handling.
- Dismissals now trigger the same matched activity comparisons as substitutions and declared formation changes.
- Existing viewer evidence disclosures display the new denominators, exposures and caveats. Packet schema is 11; upload schema stays version 1.

## Verification evidence

- **22 test files pass**, including the new positive/negative/boundary tool suite.
- **24/24 frozen scenario runs pass**; [saved outcomes and structured example](batch-3-evidence-evaluation.json). Original Batch 2 baseline files retained.
- Three-seed built-in/upload parity includes the new tools.
- Local browser at port 8772, Foundry disabled: prepared seed-7 substitution example; generated local Tactical explanation; expanded evidence, checked player exposure, possession exclusions, pass denominators, concurrent changes and declared shape/discipline. No console warnings/errors observed. [Screenshot](batch-3/evidence-panels.jpg).
- JavaScript syntax and diff whitespace checks pass.

## What you can see

Use **Try the substitution example → Explain what changed → Explore the play behind this explanation**. The evidence now reports, for example, completed passes out of attempts, advanced sequences out of complete sequences, each player's seconds on pitch, and the other changes overlapping the comparison. Expand **Declared shape and discipline in the selected interval** for the recorded formations and booked on-field players.

## Limits and next batches

These are deterministic tools and regression results, not evidence that an AI investigator improves usefulness. The current model still ranks source-owned stories. Formations are declarations, progress is based on action endpoints, and cards are core recorded player sanctions. The tools do not infer pressure, off-ball movement, injury risk, chance quality or causal effects. Comparisons use equal match-clock windows and report their denominators; sparse data remains sparse.

Batch 4 (supplied/illustrative xG) is optional. Batch 5 adds the bounded AI investigator; Batch 6 improves explanatory selection/wording. All refinement stays local until the agreed release batch.
