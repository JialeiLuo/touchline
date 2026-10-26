# Batch 2 — Evaluation scenarios and baselines

Completed locally on 26 October 2026. No live model calls or Azure credit used.

## Delivered and verified

- [Scenario matrix and protocol](EVALUATION_SCENARIOS.md): eight development and four reserved holdout scenarios with explicit expected values and a semantic-review rubric.
- Authored, validated synthetic packages isolate meaningful change, quiet play, unchanged activity, conflicting metrics, missing/late history, incomplete windows, incident corrections and concurrent decisive incidents.
- Both Quick and Tactical modes: 16 development and 8 holdout runs; all mechanical checks pass.
- Saved all-facts and current deterministic priority-story outputs, their common facts, fixture hashes, source hashes, runtime, revision, expected values and check results. No cherry-picked successful runs.
- Harness regression checks verify determinism, scenario identity, holdout membership and failure on an intentionally incorrect expectation.
- Full existing regression suite: 21 test files pass.

## Baseline findings

The priority-story baseline preserves the tested goals/dismissals and valid references, and respects the paragraph budget. However, Quick output in `dev-conflicting` contains only missing-history context and omits the more-passes/fewer-shots trend. In `holdout-concurrent`, Quick output retains the goal and dismissal but omits substitution/history context. These are observed coverage limitations, not failed source-reference checks. The all-facts baseline exposes more evidence but is verbose and is not a budget-matched competitor.

## Completion and next work

Batch 2 establishes reproducible inputs, expectations and offline baseline artifacts before model/investigator improvements. Semantic-review fields remain explicitly pending; no fan study, blind review, model superiority, autonomous tool choice, latency or cost benefit has been established. Those are later evaluation tasks. The next implementation batch is Batch 3, stronger football evidence tools. Batch 4 remains optional. Implement and verify refinement locally, then publish in Batch 10 and finalise video/submission in Batch 11.

The application UI is unchanged by this batch. Public demo and submission remain the earlier release.
