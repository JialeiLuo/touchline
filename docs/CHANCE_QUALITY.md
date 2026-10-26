# Chance quality — supplied and illustrative pre-shot values

Batch 4 adds optional shot-level values to input version 1 and `chance_quality` to evidence packet schema **12**. It does not train an xG model or obtain professional provider data. Existing v1 packages without values remain supported.

## Input contract

Declare at most 20 `xg_sources` at package level:

```json
{
  "xg_sources": [{
    "id": "example-v1",
    "label": "Authored illustration",
    "stage": "pre_shot",
    "kind": "illustrative",
    "version": "1",
    "method": "Fixed fictional values for a controlled scenario; not calibrated."
  }]
}
```

`kind` is `illustrative` or `supplied`. `supplied` means the uploader supplied the values and provenance, not that Touchline verified a provider or calibration. Source IDs are unique and stable within the package; labels/methods/versions are required. Post-shot sources are rejected. The entire match package must remain explicitly synthetic.

On a shot event, optionally add:

```json
"xg": {"value": 0.2, "source_id": "example-v1", "available_at": 1500}
```

The value must be a finite number in [0,1]. Source ID must exist. `available_at` is optional (default: shot time), must be at or after the shot and at most 5400. Touchline never infers a missing shot value from coordinates, outcome, later goals or the source description. An xG field on a non-shot is rejected.

A goal may reference its shot with `shot_id`. Built-in/exported goals now do this. It must link to exactly one preceding goal-outcome shot with the same team, player and timestamp. A shot can be linked once; every goal-outcome shot must have a goal. Legacy goals without a link retain unique team/player/time matching; ambiguous matches are rejected. Goals never contribute additional xG.

## Built-in illustration and provenance

The simulator already selected shot outcomes using:

`0.04 + 0.22 * clamp((attacking_progress - 35) / 65, 0, 1)`.

It now records that probability on the shot **before sampling its outcome**. There are no new random draws. The existing core simulator version stays 0.3; replay schema is 0.5 and source `touchline-illustrative-v1` separately versions the added metadata. Fixed event digests from Batch 3 confirm that seeds 0, 7 and 19 retain identical events after removing the new xG/link fields.

This formula uses endpoint progress only. It is not fitted to historical shots and does not account for body part, goalkeeper/defender positions, pressure or many other factors. It is an illustration of the product workflow, not calibrated professional xG or an independently validated football-quality measure.

For terminology, [Hudl's xG definition](https://support.hudl.com/s/article/expected-goals?language=en_US&topic=Statsbomb_Global_Football_Data_Glossary) describes probability estimates from historical shot information. That reference supplies the conceptual distinction; no Hudl model or data is used here.

## Aggregation and time boundaries

`server/chance-quality.cjs` aggregates only revealed shots in the selected interval. It links revealed goals to those shots, reports shot coverage, source-specific sums, goals and available shot rows. Values available after the selected interval end are excluded even if replay has advanced farther. Ordinary intervals include endpoints; before/after windows exclude their end, for both shot and value availability.

A team receives a comparable `xg_total` and `xg_per_shot` only when **all** its shots have available values from **one** source ID. Missing/partial data is not imputed. Different source IDs produce separate groups, never a blended total. `known_xg_sum` is a covered subset only when one source is involved; it is not a full partial-coverage total. No-shot intervals are labelled `no_shots`, distinct from unavailable values and genuinely supplied zeroes. The sum can exceed one; individual values cannot.

Team states: `complete`, `partial`, `unavailable`, `mixed_sources`, `no_shots`. Per-source subtotals are explicitly labelled with covered shot counts. Cross-team volume-versus-value stories require complete coverage from the same source. A lower-total story is suppressed when totals round to the same displayed two-decimal value. Matching IDs establish declared comparability, not independently verified measurement quality.

## Viewer and stories

Explain an interval, then open **Explore the play behind this explanation**. The chance-quality section includes:

- Coverage, source, supplied total and linked goals by team.
- Separate charts per source: time on the horizontal axis, value 0–1 vertically, different team shapes/colours, white outlines for linked goals.
- A shot table with values, event links and source method. Text values are rounded to two decimals; calculations retain the supplied precision. The table displays up to 100 rows per source; the full packet retains all rows. Overlapping markers may coincide.
- Explicit unavailable/partial/mixed coverage states and source subtotals.

Chance-value stories distinguish shots, summed pre-shot values and goals. A controlled counterexample covers more shots but a lower supplied chance total. Essential goals/dismissals and viewer focus keep their existing priority rules; a chance story need not be selected in every interval. The current model ranks supported story IDs; autonomous investigation remains Batch 5.

The field is also included in Batch 3's equal-window football comparisons. Values remain descriptive: they do not establish deserved results, finishing ability, future scores or causal substitution/formation/card effects.

## Verification

`tests/chance-quality.cjs` covers numeric/source/stage validation, invalid field placement, goal linkage and ambiguous legacy links, missing/zero/partial/mixed states, delayed availability, exact and half-open boundaries, goal-prefix visibility, outcome-independent values, story references, rounded ties and three-seed import parity/event stability. Existing input-parity tests include `chance_quality` and the enriched football tools.

Run `node tools/check-chance-quality.cjs` for the saved 60-seed aggregation/linkage and 24 frozen-scenario regression report in `docs/batch-4-chance-evaluation.json`. Original Batch 2 and Batch 3 reports remain unchanged. The frozen scenario builder removes unused source metadata so its authored inputs remain stable. No live provider calls, calibration study or fan-usefulness comparison is implied by passing these checks.
