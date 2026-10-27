# Comparative evaluation method — Batch 8

The comparison asks whether model-selected evidence tools add supported, relevant explanations beyond deterministic priority stories, current model ranking and a one-request prose model. It evaluates this implementation, not model intelligence in isolation.

## Systems and equal evidence access

1. **Rules:** the current deterministic priority-story fallback and composer.
2. **Ranking:** the actual Foundry story-ID selector followed by controlled composition.
3. **One pass:** an evaluation-only, single-request prose generator, using the scoped packet and the existing reference/numeric/comparison acceptance guards. Rejection displays the same rules fallback and retains the rejected prose. It is not an additional viewer mode.
4. **Investigator:** the actual bounded Foundry loop, strict evidence tools, inspected-story checks and controlled composition.

All systems use the same packet hash: match, replay cutoff, interval, team/player focus, available history/reports, calculations and source facts. Ranking sees prepared story candidates, one pass sees the scoped packet, and investigation sees a catalogue followed by retrieved results. These are equal underlying evidence access, not identical prompts or token budgets. Deterministic calculations are already precomputed for every approach. This design tests the current complete approaches, not whether retrieval computes previously unavailable football evidence.

Both model-selection approaches render controlled wording. One-pass prose has more freedom and weaker semantic guarantees; record both attempted and displayed outcomes. Fallback quality is counted as delivered behaviour but never as successful AI reasoning.

## Cases and exposure

The frozen Batch 2 matrix has 12 authored cases, each in Quick and Tactical mode. Three seed-7 challenges cover progression, supplied chance provenance and selected closing-interval scope. The old holdout split has already been inspected; it is a reserved regression split, not blind or independent test data. No claim of statistical generalisation follows.

The offline run covers 27 case/mode pairs. The final paced live panel deliberately selects six pairs: quiet/Quick, conflicting/Tactical, incomplete-window/Quick, corrected-report/Quick, concurrent goal-dismissal/Tactical, and selected closing interval/Tactical. The reduced panel responds to rate-limit failures and budget; it is exploratory and selected after diagnostic runs. One sample per system/pair cannot establish variance or superiority.

## Metrics and review

- **Delivered support checks:** valid source fact IDs, essential incident retention, absence of future event references, exact typed-claim identities/values/scopes, paragraph count and explicit causal-overclaim screening. Typed checks apply only where typed claims exist; a prose output with zero typed claims is not thereby verified.
- **Task coverage:** fixture-specific lexical requirements for missing history, full windows, conflicting/declining/unchanged activity, concurrent changes, correction substance and challenge scope/provenance. Saved passages explain matches. These are fallible relevance proxies; passing is not semantic entailment.
- **Semantic review:** inspect source records and actual prose, identify unsupported meanings and omissions, and report reviewer identity/independence. Builder-agent inspection is not independent human review. A shuffled packet and separate key enable later masked assessment; merely exporting them does not constitute such an assessment.
- **Tool behaviour:** actual calls, rejected attempts, stop reasons, failure recovery and inspected-story delivery. A completed loop is not evidence that its queries were useful.
- **Resources:** serial fresh calls without response caching/retries; rotate system order by case. Latency is component wall time after packet construction and excludes deliberate inter-system pacing, UI/HTTP overhead and packet calculations. Report provider calls, returned input/output/cached tokens and missing-usage calls. Failed attempts remain in totals.
- **Cost:** published Microsoft August 2025 GPT-5-mini Global and Data Zone token rates provide labelled illustrative USD scenarios. They are not verified deployment tariffs or the Azure invoice; hosting, tax, unknown usage and negotiated rates are excluded. Never label a missing usage response as zero billed usage.

## Execution and bounds

`npm run evaluate:comparative` is offline and never calls a provider. A live run requires `--live`, valid existing configuration, at most 170 provider calls and a stop after the configured reported-token threshold (default 1,000,000; an in-flight call can cross that threshold). Every call uses the existing persistent daily/total allowance. Default inter-system pacing is 60 seconds; it is outside the investigator's own 22-second deadline. A 429 stops the run after preserving the outcome. There are no automatic retries. Output checkpoints retain partial runs and source hashes.

Example commands (Node 22+):

```sh
npm run evaluate:comparative -- --split=all --out=docs/batch-8-offline-final.json
node --env-file=.env tools/evaluate-comparative.cjs --live --split=all --cases=dev-quiet:quick,dev-conflicting:tactical,dev-waiting:quick,dev-corrected:quick,holdout-concurrent:tactical,challenge-fulltime:tactical --pace-ms=30000 --max-calls=36 --out=docs/batch-8-live-final.json
node tools/evaluate-comparative.cjs --replay=docs/batch-8-live-final.json --out=docs/batch-8-regraded.json
node tools/review-comparative.cjs docs/batch-8-live-final.json
```

The first saved outputs use the source revision plus uncommitted file hashes recorded in their protocol. After the Batch 8 commit, those hashes identify the evaluated implementation. Saved failure/diagnostic artifacts remain separate from the final panel. Regrading reruns checks on the original evidence/output; it does not regenerate model responses or establish that current prompts would choose the same tools.

## Diagnostic runs and repairs

The initial 76-output development attempt was inadequately paced and mostly rate-limited. It demonstrates fallback delivery and deployment constraints, not comparative model quality. A subsequent partial paced attempt exposed a one-pass evaluator mismatch (empty comparison arrays versus required records) and overlapping quiet summaries. Its affected outcomes are diagnostic, not final-comparison scores.

Repairs preserve correction substance in Quick mode; give rejected investigator finishes the available story/result catalogue for recovery; replace redundant legacy interval summaries with available typed quiet/closing summaries; permit exact structured comparisons in the one-pass schema; and pace/stop live evaluation on rate limits. A chance-provenance challenge was also corrected: its original player-role focus did not justify demanding an xG story. The final challenge isolates goal/shot evidence. This change is an evaluator repair, not a product improvement.

Methodology reference: [OpenAI evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices), particularly task-specific checks, full logging and separation of automated metrics from human judgment. Cost-scenario source: [Microsoft Foundry August 2025 pricing table](https://devblogs.microsoft.com/foundry/whats-new-in-azure-ai-foundry-august-2025/); historical list rates, verified as a published table during this batch.

## Final repair provenance

The unchanged six-pair live snapshot precedes the last composition, finish-schema, inspected-reference and budget-stopping repairs. `batch-8-repair-verification.json` maps each changed source hash from the live snapshot to the final implementation, replays successful recorded investigator decisions, and records a separate waiting-case live check. `batch-8-repair-before-status-schema.json` preserves the earlier targeted waiting/closing checks; its outputs are not replaced. The artifact audit permits only those explicitly mapped source changes. No complete post-repair four-system success rate is claimed.

The finish schema advertises only currently inspected story/result IDs, the mode paragraph count and evidence-status choices allowed by the existing guard. The server completes omitted supporting result links from inspected story metadata; it still rejects unknown references and unavailable stories. Canonical composition may use richer already-inspected narratives to consolidate overlapping choices. Budget-aware finishing is conservative; it does not eliminate every token/call-budget fallback. Targeted results and remaining task-coverage omissions are reported separately in BATCH_8.md.
