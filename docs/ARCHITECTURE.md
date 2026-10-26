# Architecture

Browser → local Node server → validated match package → revealed event prefix → statistics/squads/player involvement → scoped comparisons and possession sequences → optional substitution-history investigation → story candidates → Foundry ranking → local focus/major-event rules → displayed commentary and supporting sources.

- `full-match.js`, `data/squads.*`, `data/player-history.js`: repeatable event simulation and authored context.
- `match-package.js`: shared validation and availability-aware annotation visibility.
- `server/evidence.cjs`: server-owned evidence packets. Browser requests cannot supply commentary facts directly.
- `server/investigation.cjs`: retrieves role records known at entry, compares player windows and checks concurrent changes.
- `server/stories.cjs`: deterministic supported wording/scopes; applies focus, major-event coverage and duplicate suppression.
- `server/provider.cjs`: private Azure connection, bounded response format and labeled fallback. For supported candidates the model chooses IDs; it does not invent prose or choose investigation tools. Every validated match interval now has a supported overview candidate. The older guarded prose adapter remains for legacy direct callers, outside the frozen viewer workflow.
- `app.js`, `viewer-ui.js`, `product-ui.js`, `lineups-ui.js`, `pitch-ui.js`, `comparisons-ui.js`: viewer interface. The product layer consolidates the viewer flow; accumulated implementation wrappers remain as technical debt.

Calculations and template fallback work locally. Azure ranking needs internet. No web-search tool is attached to the model. No frameworks, external runtime libraries or databases are required.

Uploads are temporary process memory: one-hour lifetime, eight packages, 2 MB each. Restarting clears them. The demo is single-process; the usage ledger persists on hosted storage. User authentication and production-scale distributed resource management are not implemented.

## Batch 3 evidence tools

Packet schema 11 adds shared role-history, formation, discipline and enriched comparison tools. See [tool contracts and boundary conventions](FOOTBALL_EVIDENCE_TOOLS.md). The investigator still follows deterministic steps; model-selected calls remain future work.

## Batch 4 chance quality

Packet schema 12 adds `chance_quality`: validated per-shot supplied/illustrative values → replay/availability filtering → per-source coverage and aggregation → optional source-owned stories and a shot chart. See [chance-quality contracts](CHANCE_QUALITY.md). Match-package schema stays version 1 with optional fields.

## Batch 5 model-directed investigation (local refinement)

Packet schema 13 adds `analysis_mode`. The investigator path uses `server/investigator.cjs` and an allowlisted registry in `server/investigator-tools.cjs`: basic context → model-selected query → bounded result → follow-up or finish → inspected-story composition. Precomputed deterministic evidence tools are shared with the ranker. The previous deterministic-only descriptions above describe earlier checkpoints/the ranker path. See [current contracts and budgets](BOUNDED_INVESTIGATOR.md).

## Batch 6 commentary composition

Packet schema 14 adds explicit sequence coverage. `server/narrative.cjs` builds source-owned explanatory candidates; `server/narrative-checks.cjs` validates typed values/scopes against the packet; `server/compose.cjs` applies focus, essential coverage, deduplication, word targets and inspected-only refill. Model-selected IDs still flow through the existing ranker/investigator adapters. See [grounded commentary](GROUNDED_COMMENTARY.md).
