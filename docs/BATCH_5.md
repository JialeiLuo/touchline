# Batch 5 — Bounded AI investigator

Completed locally on 26 October 2026. Public GitHub, deployment, video and submission remain unchanged; release is Batch 10.

## Delivered

- A real Foundry function-calling loop: model-selected read-only tools, follow-up requests and explicit supported/insufficient-evidence finish.
- Strict argument/identity checks and inspected-story/result gating. No unqueried role-history/context story can enter investigator composition.
- Hard request/tool/time/size/output ceilings, conservative token reservation, per-provider-call persistent allowance accounting and usage records.
- Bounded malformed-query recovery, cancellation, missing-data states and labelled local fallback with retained stop trace.
- Viewer approach choice, actual query trace, sources, stop reasons and usage details. Ranker remains available; approach changes preserve stale-response safeguards.
- [Full contracts, limits and reproduction](BOUNDED_INVESTIGATOR.md).

## Verification

- **25 test files pass**, including dedicated investigator and HTTP-control suites.
- **24/24 frozen scenario/mode runs pass with scripted providers**. [All outputs](batch-5-agent-evaluation.json). These verify integration and evidence contracts, not real-model semantic quality.
- First live CLI sample: role history → change comparison → finish; **3 requests, 5,999 ms**, 8,463 input / 131 output tokens. [Saved checkpoint](batch-5-live-investigation.json).
- Final live browser sample, seed 7, minutes 55–66, Ellis, Tactical: model independently chose role history → change comparison → finish; **3 requests, 5,186 ms**, 8,463 input / 131 output tokens. Displayed Ellis's supplied 20/305 role minutes and the scoped activity comparison. [Actual HTTP result/evidence](batch-5-browser-investigation.json).
- Total across the two live samples: **6 provider calls, 16,926 reported input tokens and 262 output tokens**. Existing Azure credit was used; no monetary cost estimate is claimed.
- Browser: expanded actual query trace and sources; switched approach and verified the previous result was marked stale. No console warnings/errors observed. [Screenshot](batch-5/investigator-trace.jpg).
- Syntax and diff whitespace checks pass. Original baseline artifacts retained.

## What you can see

Use **Try the substitution example**, leave **Explanation approach → Investigate the evidence**, then select **Explain what changed**. Expand **Evidence investigation** to inspect the model-selected queries and their source references. The explanation remains tied to inspected, source-owned wording and figures. Missing configuration or exhausted allowances show local fallback and a truthful trace.

## Remaining limits

One fixed investigation question and one model; evidence calculations are precomputed locally and read selectively. Final wording remains source-owned story composition. The token reservation is a conservative byte-based upper estimate with separate measured usage, not exact input tokenisation or a billing cap. Limits can end a run early; partial investigations fall back. A couple of live synthetic examples do not prove usefulness or superiority.

**Next: Batch 6 — useful, grounded commentary**, including better synthesis, alternatives, quiet intervals, repetition and full-time conclusions. Comparative model evaluation and human usability work remain Batches 8 and 9.
