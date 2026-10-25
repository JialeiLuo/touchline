> Historical diagnostics. Current bounded-ranking evaluation and product acceptance are in PRODUCT_EVALUATION.md and ranking-evaluation.json. All validated viewer intervals now have at least an overview story; legacy free-prose output is outside the frozen viewer scope.

# Commentary evaluation

This is a small integration diagnostic, not a reliability or football-usefulness benchmark.

## Reproduce

From the Touchline folder, run `node --env-file=.env tools/evaluate-commentary.cjs --live` with Node 22+ and a private Azure configuration. This makes exactly four serial model requests, separated by 22 seconds to reduce pressure on the student deployment. It overwrites `docs/commentary-evaluation.json`. Without `--live`, it prints case inputs and makes no requests. Never commit `.env`.

Fixtures use simulator v0.3, seed 7: a goal interval, substitutions with available comparison windows, a routine-play interval without major recorded incidents, and the halftime declared tactical change. Quick and Tactical modes are both represented. Evidence, returned model text, fallback status, elapsed time and API-reported token use are saved. Keys and endpoint configuration are not saved.

## Initial diagnostic

The first four-call run produced one accepted AI response (quiet interval) and three template fallbacks. The goal response incorrectly reinterpreted a between-team shot count as a before/after comparison. Substitution and tactical responses included fact identifiers in prose, which the conservative numeric guard treated as unsupported numbers. The model also attached an interval-wide save fact to a smaller before-window claim without explicitly established timing. This illustrates why matching source IDs and numbers alone does not prove semantic support.

The original responses remain in `commentary-evaluation-initial.json`. Prompt instructions were clarified to restrict structured comparisons to explicitly supplied comparison objects, keep identifiers out of prose, retain exact internal team identifiers and avoid transferring interval facts into smaller windows. The same cases are rerun without automatic retries or selective replacement.

## What is checked automatically

- Valid response structure and existing fact references.
- Quick-mode length, conservative numbers/timing/headline restrictions.
- Structured comparison identities, metrics, before/after values and directions.
- Complete comparison windows and exclusion of future events in deterministic tests.

## What still needs evaluation

- Whether each prose statement is supported by precisely the cited source and time window.
- Whether the selected story is useful rather than merely correct.
- Appropriate causal caution, player attribution and omissions.
- Repeated samples, additional seeds, uploaded packages, corrections, and adverse conditions.
- Comparison against a template and a simpler one-pass model baseline.
- Fan usability and factual comprehension.

A successful HTTP response is not an accepted commentary. A passing guard is not proof of semantic correctness. A fallback is displayed as a template, not presented as AI success.

## Response-format revision

Prompt-only changes did not resolve all three failures. The next revision constrains the response schema to the exact calculated comparison records (or an empty array when none exist). Calculated evidence now includes the absolute count difference, avoiding rejection of valid subtraction such as 17 to 12 being a difference of 5. Regression checks inspect these schema constraints. Server validation still checks the relationship between each paragraph's citations and comparison records.

A remaining design risk is that a model can place a valid record in the wrong paragraph or write prose that disagrees with its records. A likely next improvement is to render numerical comparison sentences deterministically from selected records, leaving the model to explain relevance and uncertainty. Do not equate schema-constrained records with verified prose.

## Latest observed results

| Case | Accepted AI or fallback | Latency | Validation failure |
|---|---|---|---|
| goal | foundry | 2.04 seconds | None |
| substitution | template | 4.08 seconds | Unsupported structured comparison |
| quiet | foundry | 1.51 seconds | None |
| tactical-change | template | 4.54 seconds | Unsupported numeric claim |

Two of four outputs passed guards in the latest run. This is one sample per case, not a reliability estimate. Manual inspection also found unnecessary self-referential prose in the goal answer; acceptance is not a usefulness score.

Across all three runs: 19117 input tokens and 3777 output tokens. At the previously checked reference rates of $0.25/$2 per million, estimated model cost is $0.01233, excluding other services and account-specific pricing. This is calculated from API usage, not a billing-portal reconciliation.

## Scoped-story route
A bounded selection route now replaces free-prose generation when supported story candidates exist. Evaluate candidate construction separately from model ranking: the model cannot rewrite their wording, figures or scope. One API sample and one browser sample passed live; this does not establish general reliability or usefulness. The older prose route still applies when no candidates exist. See story-selection-live.json and scoped-stories.jpg.
