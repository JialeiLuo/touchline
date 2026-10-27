# Batch 8 — Comparative evaluation and repairs

Completed locally on 27 October 2026. Publication remains in Batch 10; final video/submission remain Batch 11.

**Finding: these runs do not establish an advantage for the investigator over the simpler approaches.** Rules often deliver the same useful context immediately; ranking is cheaper and faster than the multi-request loop on this small panel. The investigator makes real evidence choices, but can waste queries or omit useful context. Format/reference acceptance alone does not establish grounded meaning.

## Observed comparison

The [saved four-system live panel](batch-8-live-final.json) has **six paired case/mode inputs, 24 delivered outputs and 31 provider calls**. Every system uses the identical underlying evidence packet per pair. Different representations and request budgets are explicitly documented in [the method](COMPARATIVE_EVALUATION.md).

| System | Accepted model outputs | Delivered local fallbacks | Component median latency | Reported input / output tokens | Provider calls |
|---|---:|---:|---:|---:|---:|
| Rules | N/A | deterministic baseline | 1 ms | 0 / 0 | 0 |
| Current ranking | 6/6 | 0/6 | 1,576 ms | 7,980 / 234 | 6 |
| One-pass prose | 4/6 | 2/6 | 3,570 ms | 22,961 / 2,259 | 6 |
| Investigator | 3/6 | 3/6 | 5,050 ms | 33,623 / 843 | 19 |

These are original observed outcomes **before the last trace-driven repairs**, retained unchanged. Latency excludes packet construction, UI/HTTP overhead and deliberate inter-system pacing. The investigator's three fallbacks were two call-budget stops and one token-budget stop. One-pass fallbacks followed numeric/citation guards. Do not count useful fallback answers as successful AI reasoning.

All 24 delivered outputs pass reference/essential-incident/future-reference checks; all 60 typed claim records across those displayed outputs verify. Accepted one-pass prose has no typed claim coverage; its values/references pass only the legacy limited guards. The fixture-specific relevance proxy passes 6/6 rules, 5/6 ranking, 4/6 one pass and 6/6 investigator **including fallbacks**. These are lexical coverage checks, not semantic correctness or fan usefulness scores.

The main panel's reported tokens imply **$0.02068–$0.02275** under the two historical published list-rate scenarios saved in the report. These are illustrative Global/Data Zone calculations, not verified Azure billing; hosting/tax are excluded. [All attempts and unknown-usage accounting](batch-8-resource-total.json) keep diagnostic runs separate rather than discarding their cost/failures.

## Substantive review and failures

[Builder-agent source inspection](batch-8-semantic-review.json) records passages, source references, diagnostic scores, omissions and evaluator disagreements for all 24 observed outputs. It is not blinded, independent human review, football-expert review or a fan study. [Shuffled review packet](batch-8-review-packet.md) and [separate key](batch-8-review-key.json) enable subsequent masked review; their existence is not evidence that one occurred.

- Quiet play: all final-panel systems avoid inventing a turning point. A prior accepted one-pass diagnostic called an authored restart a correction, demonstrating a semantic error that reference/numeric checks missed.
- Conflicting signals: the inspected window has passes 1→3 and shots 2→0. The investigator repeated an activity story beside a connected role/history explanation. One-pass prose made an unwarranted exclusion of opposing influences; zero opponent passing/shooting counts do not rule out other opposition effects. Some lexical checks also miss legitimate paraphrases of the counts and causal caveat.
- Incomplete window: the live ranker omitted the full-window limitation. The original investigator repeatedly chose too many story IDs; later attempts exposed omitted result links and an invalid supported status despite missing/incomplete results.
- Corrected report: Quick mode previously announced a correction without conveying its substance. The repaired text states that the initial report was corrected and no sanction is established. A repeated no-sanction caveat remains an editorial limitation.
- Concurrent changes: essential goal/dismissal coverage survives. A bounded investigator can spend its calls without obtaining both history and comparison; this can yield less context than the local baseline.
- Closing interval: an original investigation exhausted its conservative reservation before a valid finish; one-pass wording used broader terms such as structured possession/overall progress that require caution beyond the completed-sequence counts.

## Repairs and verification

- Preserve the substance of corrected reports in Quick mode.
- Canonicalise available legacy role/comparison/interval choices to supported connected narratives. Identical saved investigator decisions now produce **two complementary paragraphs instead of three** on the conflicting case, without a new model call. Only already-inspected candidates are eligible.
- Advertise current inspected story/result IDs, mode-specific story count and valid supported/insufficient status in the finish schema. Unknown references and uninspected stories remain rejected.
- Derive missing required result links from the selected story's already-inspected server metadata. This repairs redundant citation omissions without authorising new evidence. Complete the trace with the derived links.
- Prefer paired substitution evidence before optional checks; reserve room for a finish request when the conservative token allowance approaches its limit. Hard request/time/tool/token bounds and safe fallbacks remain in force.
- Repair the evaluation-only prose schema to permit exact structured comparisons; add pacing and stop-on-429 behaviour. Correct a chance-quality challenge that had incorrectly demanded xG despite a player-role focus.

[Final targeted verification](batch-8-repair-verification.json) preserves separate source hashes and the original comparison. The waiting case now completes in two requests with `insufficient_evidence`; its main prose can still omit the specific gaps while the trace retains the inspected insufficient-window status. That task-coverage limitation is retained, not relabelled a full quality pass. [The preceding targeted attempt](batch-8-repair-before-status-schema.json) includes a successful closing-interval investigation in two requests. Other intermediate attempts remain saved, including failures. These small post-repair checks are **not** a rerun of the whole comparative panel and do not establish a revised overall success rate.

- **27/27 existing and new test files pass.** New evaluator tests deliberately introduce invalid references, typed claims, future sources, causal assertions and omitted essential/task content. Investigator regressions cover schema constraints, finish recovery, inspected-link completion and earlier budget-aware stopping.
- [Final offline matrix](batch-8-offline-final.json): **27/27** case/mode checks pass (24 authored cases plus three richer challenges).
- [Artifact integrity audit](batch-8-integrity-check.json): complete pairs, identical packet/source hashes, reproducible grades/cost arithmetic and explicitly recorded post-comparison source changes.
- Reports exclude API keys, endpoint URLs, authorization headers and encrypted reasoning. Synthetic inputs, function arguments, usage and rate-limit metadata are retained for inspection.

## Scope and release implications

The old holdouts are exposed regression cases. The six-pair panel was selected after diagnostic runs; one sample per system/input is exploratory, with no variance estimate or generalisation claim. The initial [76-output diagnostic](batch-8-live-development-before.json) was mostly throttled; its latency and fallbacks are not a model-quality benchmark. A [partial contract diagnostic](batch-8-live-contract-diagnostic.json) used a mismatched one-pass schema and is excluded from final comparison scores.

Keep product claims modest: evidence-directed investigation, bounded tool use and inspectable, controlled commentary are implemented. Better usefulness than rules/ranking is unproven. Missing-detail explanations, editorial repetition, deployment throughput and actual unfamiliar-user comprehension remain practical limits. **Next: Batch 9 — unfamiliar-user usability review and final product fixes.**
