# Testing

`npm test` runs 19 test files. Checks cover repeatable simulation, eligible players, chronology, statistics, prefix visibility, comparisons, annotations, history availability, story IDs, preference invariance, player involvement, failure fallback and HTTP asset restrictions.

`npm run evaluate` makes no API calls. It writes `docs/context-evaluation.json` and verifies five authored context variants plus incomplete-window abstention against a deterministic counts-only baseline.

Start the local server before these optional scripts:

- `node tools/check-viewer-milestone.cjs`: local evidence/upload validation. Add `--live` for two model calls.
- `node tools/check-investigation.cjs`: local investigation checks. Add `--live` for one model call.
- `node --env-file=.env tools/evaluate-commentary.cjs --live`: four model calls on fixed goal/substitution/quiet/tactical cases. This diagnostic overwrites commentary-evaluation.json; preserve runs before comparison.

Live scripts consume the configured Azure allowance. They do not verify the billing balance. Tests using fake provider responses do not measure real model behavior.

The archive build script can extract a fresh copy into a temporary directory, run the entire suite without `.env`, start its server and verify the labeled fallback. It tests packaging and local operation, not cloud deployment. Docker is described but was not built because Docker was unavailable in the development environment.

Source IDs, accepted schemas and passing tests do not prove football realism, causal correctness or viewer usefulness. Those need additional evaluation.

Public-demo controls are tested with temporary ledgers and a mocked provider. HTTP integration verifies one fresh call, a cache hit without a second call, and local fallback on exhaustion. These checks do not establish cloud hosting availability.

Milestone 2: run `node tools/evaluate-product.cjs` for the 288-case contract matrix. `node --env-file=.env tools/evaluate-ranking.cjs --live` makes eight paid-from-credit model calls with no retries/cache; run it deliberately. See PRODUCT_EVALUATION.md for results and self-review limits.
