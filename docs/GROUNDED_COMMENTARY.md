# Useful, grounded commentary — Batch 6

The commentary now connects relevant evidence into short explanations, with visible distinctions between **recorded facts**, **a reading of the play**, and **limits or alternatives**. The model still chooses tools and supported story IDs. Wording is composed from controlled, source-owned templates; no unrestricted model-written conclusion was added.

## What changed

- A substitution summary joins the assigned role and available prior role minutes with player exposure, matched team activity and concurrent changes. It does not call a different usual position a benefit/disadvantage or treat a count difference as a substitution effect.
- More completed passing without more attempts, unchanged activity and declining measures remain distinct. Quick mode retains the relevant pattern instead of spending its whole budget on history alone.
- Tactical mode adds pass-attempt denominators, player seconds on pitch, exact counts and record count. Quick mode keeps a shorter factual core and useful interpretation. Missing evidence does not justify padding Tactical with invented detail.
- Possession explanations distinguish successful advanced endpoints from shots, use the complete-group denominator and label exclusions. Supplied chance-value stories retain their provenance and coverage limits.
- Quiet intervals receive a brief factual catch-up with explicit missing possession detail where applicable. An unchanged score/no shots is not presented as proof of control or passive tactics.
- Incident descriptions are presented as reports with their status; a report does not itself establish a sanction. Superseded reports remain excluded by the existing availability/correction logic.
- At full time, future-looking instructions are replaced with a retrospective takeaway. Late-interval activity counts are explicitly scoped rather than promoted to whole-match totals. Late substitutions do not acquire unavailable post-entry evidence.

## Typed claims and source ownership

`server/narrative-checks.cjs` checks the new explanatory paragraphs against the server packet:

| Claim | Checked data |
|---|---|
| History share | Player, assigned role, minutes, role minutes, record count, status and entry-time cutoff |
| Player windows | Both windows, readiness, pass attempts/completions, shots and on-pitch exposure |
| Team change | Trigger/team identity, boundaries, both metrics and direction |
| Concurrent changes | Recorded overlapping IDs/count |
| Interval score | Selected scope, start/end score and shot counts |
| Quiet record | No recorded shot/goal/substitution/card/shape change/report in the selected scope |
| Possession summary | Complete-group counts, entries, shots, early losses and exclusions |
| Chance values | Complete single-source coverage, source identity, shots, total, mean and linked goals |
| Sequence availability | Whether the supported sequence report is available |

Each claim binds to the corresponding fact IDs, which must also appear in its paragraph's evidence references. Unknown/extra fields, altered numbers/identities/boundaries and unsupported source bindings are rejected. Display text must agree with its rendered fact/reading/alternative parts. The viewer exposes these claim records under supporting evidence.

This is **not a semantic verifier for arbitrary prose**. Claim checks verify structured values and scope; template ownership controls wording and interpretation. Existing standalone stories retain source-owned wording/references, and not every legacy paragraph has a typed claim. The model cannot submit its own paragraphs through the investigator finish API.

## Composition, repetition and scope

`server/compose.cjs` preserves essential incidents, applies player/team relevance, keeps selected evidence and then fills unused slots with complementary candidates. Duplicate source coverage and overlapping narrative topics are suppressed. A role synthesis replaces repeated player/context summaries. Additional non-player activity summaries for the same team are suppressed when comparison windows overlap by at least 80%; this is a presentation heuristic, not a statistical independence threshold. Distinct player histories are retained when relevant.

A common causal caveat appears once rather than in every paragraph. Specific missing-window or unequal-exposure limits remain attached to the relevant observation. Zero-only opponent comparisons are not added as filler. Quiet intervals may legitimately produce only one paragraph.

Quick has at most two story paragraphs with a 120-word target; Tactical at most four with a 280-word target. Optional stories that would overflow are omitted rather than cutting source claims mid-sentence. Essential-incident coverage, or an exceptional oversized first source story, can exceed the target; `length_exception` records that explicitly. No decisive incident is silently discarded to meet a word target. These targets count commentary prose, not expanded evidence/trace details or the separate takeaway.

The investigator's available-story filter also applies to refill and synthesis. A new substitution synthesis requires its role-history and change-comparison queries; uninspected context cannot enter merely because it is a high-priority candidate. Interval summaries use the initial verified context. Packet schema is **14**, adding an explicit sequence-coverage fact; input schema stays version 1.

## Verification

- `tests/narrative.cjs`: conflicting and unchanged activity, quiet/missing data, changed claim values/identities/scope/source binding, inspected-only synthesis, duplicate removal/refill, overlapping windows, corrected reports, full-time/late-substitution handling and 80 rendering combinations across eight seeds.
- Existing source, prefix, focus, comparison, provider, cache and investigator-budget checks remain passing.
- `node tools/evaluate-narrative.cjs` saves all 24 frozen scenario/mode outcomes plus 12 full-time cases to `docs/batch-6-narrative-evaluation.json`. It retains the earlier Batch 2 output beside the current output without rewriting the baseline. That historical comparison is not an equal-information model evaluation or a blinded fan study.
- `docs/batch-6-live-commentary.json` records one fresh browser/Azure investigation and its source hashes. The final deterministic composer replays its tool choices to identical paragraphs without another model request; this result is recorded in the evaluation report.

The frozen conflicting case now mentions the passing/attempt contrast in Quick; the negative control explicitly retains unchanged activity; the quiet case remains concise and labels unavailable possession evidence. These are inspectable changes on controlled examples, not a claim that fan usefulness or model superiority has been established. Those evaluations remain Batches 8 and 9.
