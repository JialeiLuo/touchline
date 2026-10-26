# Controlled evaluation scenarios — batch2-v1

This suite complements the existing multi-seed contract evaluations. It establishes known inputs and expected tool behaviour before extending the investigator. Entirely fictional, deliberately sparse matches are not football realism validation.

## Matrix

Each case runs in Quick and Tactical modes, with neutral team focus and no player focus.

| Split | Case | Expected evidence / desired explanation |
|---|---|---|
| Development | quiet | 0–0, no shots or substitutions; no invented change |
| Development | goal | Southport scores; retain the decisive incident |
| Development | positive | completed passes 1→3, shots 0→2; history available; descriptive, not causal |
| Development | no-change | completed passes 1→1, shots 0→0; negative control |
| Development | conflicting | completed passes 1→3, shots 2→0; distinguish activity measures |
| Development | missing-history | history missing; no ability/familiarity conclusion from absence |
| Development | waiting | replay at 650s, entry at 600s; full after window unavailable |
| Development | corrected | only the correction available at 850s survives at 950s |
| Holdout | concurrent | substitution, opponent goal and dismissal; two concurrent changes |
| Holdout | late-history | history available at 800s excluded from entry-time knowledge at 600s |
| Holdout | before-correction | replay at 800s includes original report, excludes correction at 850s |
| Holdout | decline | completed passes 4→1, shots 2→0; descriptive decline |

The no-change and missing-history cases deliberately share evidence but ask reviewers to inspect different failure modes. All fixtures omit spatial endpoints; sequence analysis must be unavailable, not zero. Existing sequence tests cover supported spatial cases; this small matrix does not replace them. Both teams, real-match distributions, chance quality, adversarial annotations and richer progression patterns need broader evaluation later.

## Reproduce

From the repository root, with Node 22 or newer:

```sh
npm run evaluate:scenarios
npm run evaluate:scenarios:holdout
npm test
```

Default evaluation runs development cases only. `node tools/evaluate-scenarios.cjs --split=all` is also available. Reports overwrite only their corresponding local report file. A failed expectation saves its actual/expected result and exits nonzero. Invalid fixtures or unexpected execution errors fail loudly rather than being silently skipped.

- Fixtures: `evaluation/scenarios.cjs`.
- Harness: `tools/evaluate-scenarios.cjs`.
- Development artifact: `docs/scenario-baseline-development.json`.
- Holdout artifact: `docs/scenario-baseline-holdout.json`.

The baseline reports were captured from the Batch 1 parent revision plus the source hashes recorded in each report. No provider is invoked, even if Azure environment variables exist. Local uploaded-package entries are removed after each packet is built. No timestamp, random package ID or timing noise enters baseline output; unchanged sources/runtime give reproducible artifacts.

## Baselines and checks

Both baselines receive the exact same evidence packet. **All facts** renders every supplied fact without prioritisation or a length budget. **Priority stories** uses the actual current local fallback: deterministic candidate priorities, composition, essential incident retention and mode budgets. Neither is the live model ranker. All facts is an information-coverage reference, not a fair length-controlled usefulness comparator.

Declared expectations are hand-authored counts/statuses rather than snapshots computed from the production tools. Automated checks cover score, shots, histories, comparison readiness/counts, concurrent changes, annotation visibility, unavailable sequence data, valid fact IDs, future event references, decisive-incident coverage and story paragraph count. They do not grade the meaning of arbitrary prose or prove that every relevant observation is selected.

Each row preserves the full outputs, source facts, rubric and pending review dimensions: factual support, relevance, conflicting signals, uncertainty and readability. Score each 0 (absent/incorrect), 1 (partial), 2 (clear/supported), or N/A; attach the passage supporting the score. Do not treat pending rows as passed semantic judgments. Later comparisons should conceal system labels and randomise presentation, use identical packets and matched output/model budgets, and retain failures. One-pass model and bounded-investigator adapters, traces, token usage and latency belong to later batches.

## Holdout protocol

The four holdout cases are fixed separately and excluded from the default development command. Their current offline baselines were run and inspected to establish the starting point; they are **not secret or statistically independent blind test data**. During implementation, tune against development cases and freeze prompt/tool choices before running the reserved split. Log any exposure-driven change; if these cases guide tuning, retire them as confirmatory holdouts and author fresh cases before claiming generalisation. Regression tests execute all fixtures for continued integrity; that is distinct from a blind model evaluation.

## Observed baseline limitations

Quick `dev-conflicting` selects missing-history context and does not describe the conflicting passing/shooting trend. Quick `holdout-concurrent` preserves goal/dismissal coverage but lacks substitution context. Mechanical checks still pass. These findings motivate better evidence selection and subsequent semantic evaluation; they do not justify changing the baseline now or claiming AI improvement.
