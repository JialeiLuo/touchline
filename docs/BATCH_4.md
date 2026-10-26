# Batch 4 — Chance-quality analysis

Completed locally on 26 October 2026. No Azure credit or live model calls used. Publication remains Batch 10.

## Delivered

- Optional validated per-shot pre-shot values and source/method/version/stage records, equally supported in built-in and uploaded matches.
- Built-in values expose the simulator's existing illustrative scoring probability without changing random draws or match events.
- Explicit one-to-one goal/shot links; legacy unique links supported. Goals are outcomes, not duplicate chance values.
- Per-team and per-source aggregation, coverage, per-shot averages, missing/delayed/zero distinctions and separate mixed-source handling.
- Source-separated shot chart, accessible text/table, inspectable goal links and methods; updated package capability labels and downloadable example.
- Supported chance-value stories and a more-shots/lower-supplied-total counterexample; equal-window football tools also include chance-quality evidence.
- [Full input, calculation and interpretation contract](CHANCE_QUALITY.md).

## Verification

- **23 test files pass**; focused checks rerun after the final story/layout change.
- **60/60 generated matches** pass coverage, goal linkage and aggregation checks; **24/24 frozen scenario runs** pass. [Saved report](batch-4-chance-evaluation.json).
- Three-seed built-in/upload parity. Seed 0/7/19 event digests match Batch 3 after removing the added metadata; no simulation outcome changes.
- Local browser, template mode at port 8774: built-in 0–66 interval chart and linked-goal table; loaded example package, advanced to full time, explained 0–90 and inspected coverage/source labels/chart. The example shows Northbridge 7/7 shots, 0.88 illustrative total, one linked goal; Southport 2/2, 0.31, zero goals. No console warnings/errors observed. [Screenshot](batch-4/chance-quality.jpg).
- Syntax and diff whitespace checks pass. Original baseline reports preserved.

## Limits and next step

This is a supplied/illustrative chance-value workflow, not professional calibrated xG. Uploaded source descriptions are not independently verified. Different sources and incomplete coverage are not turned into one comparable total. Chance values do not prove deserved results, ability or causal effects. No real provider feed or model calibration was added.

The current model still ranks source-owned stories. **Next: Batch 5 — bounded AI investigator**, using the evidence tools completed in Batches 3 and 4.
