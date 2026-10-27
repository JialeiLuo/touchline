# Bounded AI investigator — Batch 5

The local refinement supports one model-directed evidence investigation of the fixed question: **“What changed during this interval, and what evidence helps explain it?”** Viewer team/player focus and Quick/Tactical mode constrain relevance and length. This is one model loop with read-only tools, not multiple agents or open-ended football research.

## Execution

The browser sends `analysis_mode: "investigate"` or `"rank"` to the existing commentary endpoint. The local UI defaults to investigation; omitted API mode defaults to rank for existing integrations. Packet schema is **13**. Match-package input version stays 1.

1. The server builds the validated replay-scoped packet using the Batch 3/4 calculations. These calculations remain deterministic and are currently precomputed.
2. The investigator sees the selected interval, viewer focus, a catalogue of changes/substitutes/capabilities, and basic interval/essential/player stories. It is **not initially given every evidence tool result or every story**.
3. Foundry selects a strict function and arguments. A server allowlist validates both shape and match-scoped identities, executes the read-only query and returns a bounded result, sources, and newly supported story choices.
4. The model can inspect another result in a subsequent request. A contextual substitution story needs both its entry-time history and the matching change comparison. Possession, formation, discipline, chance and incident stories have corresponding query requirements.
5. The model stops using `finish_investigation` with supported or insufficient-evidence status, selected story IDs and required result IDs. The server verifies that the referenced stories were inspected, then assembles source-owned wording with the existing essential-incident/focus rules. Automatic composition can use other already-inspected stories; unqueried history or analysis is excluded.

The current synthesis is evidence-directed story selection and composition, not unconstrained generated prose. This makes the model's evidence choices and follow-ups real while retaining source-owned figures and wording. Richer explanation, repetition control and alternative handling remain Batch 6; comparative value remains Batch 8.

## Read-only tools

| Function | Valid scope | Returns |
|---|---|---|
| `role_history` | A listed substitute's player ID | Role records known at entry, minute share, sources and availability |
| `compare_change` | A listed change event ID | Equal windows, denominators, player exposure and concurrent changes |
| `analyse_possession` | One of the two team slots | Complete groups, progress, exclusions or explicit missing data |
| `inspect_formation` | Team slot | Recorded declarations and assignments |
| `inspect_discipline` | Team slot | On-field/booked-player denominators and core card records |
| `inspect_chances` | Team slot | Supplied/illustrative values, coverage and source groups |
| `inspect_incidents` | Selected interval | Available reports/corrections, treated as untrusted data |
| `finish_investigation` | Returned story/result IDs | Supported or insufficient-evidence completion |

Arguments cannot supply a new clock, window, package, position, URL, arbitrary player, code or tool name. History is fixed to entry-time knowledge. Core event evidence stays within the selected end; incident reports retain the existing replay-time availability rule and may clarify an earlier interval. No browsing, shell, filesystem, external action or account tool is exposed. Source descriptions/annotations never become instructions.

Tool responses compact duplicate source arrays and include at most 100 event references plus a full source count. The full structured packet still contains calculation sources and is inspectable in the viewer. Raw reasoning, encrypted reasoning content, API keys and request headers are never included in the user trace or saved evaluation outputs.

## Bounds and recovery

| Limit | Default ceiling |
|---|---:|
| Model requests per investigation | 4 |
| Tool attempts, including rejected queries and finish | 6 |
| Whole model loop | 22 seconds |
| Output tokens per model request | 1,200 |
| Conservative cumulative token reservation | 60,000 |
| Encoded request size | 36,000 bytes |
| Tool result size | 18,000 bytes |
| Provider response size accepted | 100,000 bytes |

These ceilings are server-owned; the request cannot increase them. Tests may lower them. Before each request the server reserves encoded UTF-8 request bytes + 1,024 framing allowance + the maximum output tokens against the 60,000 ceiling. This is a deliberately conservative **token upper estimate, not an exact tokenizer or billing cap**. API-reported input/output tokens are recorded separately and checked against the request reservation/output limit after each response; unavailable usage is marked unavailable rather than measured zero.

Every actual provider request reserves one persistent demo-allowance unit, including failed requests. The existing concurrency lock spans the whole investigation. Cache keys include the explanation approach; cached successful results reuse the recorded trace without new model requests. Partial/failing investigations use a labelled deterministic fallback and are not cached as live successes.

Malformed/unknown arguments, repeated queries and invalid finish references are returned as bounded errors for a possible correction. They still consume a tool attempt. The final permitted request forces the finish function. Missing evidence is an explicit result state. Time, token, size, provider and allowance failures stop the loop and retain a compact failure trace alongside local stories. Client disconnect cancels an active provider request. No automatic retry loop runs beyond these bounds.

The Responses loop uses `store:false` and replays returned output items, including encrypted reasoning, only for stateless continuation. See [official function-calling guidance](https://developers.openai.com/api/docs/guides/function-calling) and [stateless reasoning guidance](https://developers.openai.com/api/docs/guides/reasoning). Existing Azure endpoint validation is retained.

## Viewer

Choose **Investigate the evidence**, then **Explain what changed**. Expand **Evidence investigation** to inspect actual tool choices, statuses, source references, completion/stop reason, request counts, timing and usage. No simulated plan animation or hidden reasoning is shown. **Select supporting stories** retains the previous one-pass ranker. Changing approach participates in the existing stale-response protection. Offline or unconfigured runs clearly state that no model-selected query ran.

## Verification and limits

- `tests/investigator.cjs`: actual dispatch through scripted model responses, follow-ups, strict arguments, unknown IDs/tools, source gating, incomplete evidence, correction, stateless reasoning replay, allowance/usage, cancellation and budget/provider failures.
- `tests/investigator-http.cjs`: real local HTTP handler with mocked provider; per-request allowance reservation, shared concurrency, trace delivery, cache reuse and approach separation.
- `tools/evaluate-agent.cjs`: all 24 frozen scenario/mode combinations through scripted providers. This is integration/coverage evidence, **not a real-model evaluation or a superiority result**. All outputs are retained in `docs/batch-5-agent-evaluation.json`.
- `tools/check-agent.cjs --live`: one bounded fresh live investigation, explicitly opt-in. The first live CLI run is saved in `docs/batch-5-live-investigation.json` with the source hashes used at that checkpoint.
- `docs/batch-5-browser-investigation.json`: subsequent final browser request through the real HTTP handler/provider, with source hashes and returned evidence. The browser also verified approach-change staleness and no console warnings/errors.

Two successful live synthetic samples establish that the protocol works for that example. They do not establish broad reliability, causal validity, football realism, human usefulness or improvement over a one-pass model. Unknown/unusual cases may hit a limit and use fallback. No additional agents, broad histories or arbitrary-question interface were added.

## Batch 8 refinement

Finish schemas now list the current inspected story/result IDs, mode-specific story count and permitted evidence status. Missing supporting result links are completed from the selected story’s already-inspected metadata; unknown IDs and uninspected stories still fail. The trace records completed references. The loop can request an earlier finish to preserve token headroom; hard limits and local fallback remain. Current packet schema is 14 (the earlier execution description above records the Batch 5 snapshot). See [comparative results, failures and remaining limits](BATCH_8.md); investigator superiority over rules/ranking is not established.
