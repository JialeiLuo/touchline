# Touchline — Your AI Co-commentator

Touchline turns synthetic football events into an inspectable match companion: replay, statistics, lineups, interval catch-up, multilingual glossary, team/player focus and contextual substitution stories.

The current AI route ranks supported story candidates through Microsoft Foundry. Calculations, time scopes, sources and story wording remain server-owned. This is a bounded prototype, not autonomous football reasoning or a live broadcast feed.

## Run locally

Requires Node.js 22 or newer. No dependencies or package installation are needed. Development and clean-copy checks currently use Node 24.

```sh
npm start
```

Or run `node server.cjs`. Open `http://127.0.0.1:8767/`.

Without Azure configuration, commentary uses a clearly labeled local fallback. To enable online ranking, copy `.env.example` to `.env`, enter your deployment configuration privately, then use `npm start`. Never commit `.env`. ChatGPT Plus and Azure credit are separate from this software.

## Explore

1. Advance the replay using the slider or Next key moment.
2. Choose the minutes you missed and a viewing mode/team/player preference.
3. Select Explain what changed. Expand supporting evidence or the passages of play.
4. For the contextual example, use seed 7, advance beyond minute 66, select 55–66 and focus on Ellis. Duarte provides a contrasting role-history case.
5. Match data & demo settings contains the package example, JSON upload, seed controls and provenance.

## Verify

```sh
npm test
npm run evaluate
```

`evaluate` compares five controlled role-history variants with a counts-only baseline. It makes no model calls. Optional live integration scripts are documented in [Testing](docs/TESTING.md).

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Input format and optional role history](docs/MATCH_PACKAGE.md)
- [Data provenance and limits](docs/DATA_PROVENANCE.md)
- [Evaluation results](docs/CONTEXT_EVALUATION.md)
- [Deployment preparation](docs/DEPLOYMENT.md)
- [Current project checklist](docs/VIEWER_MILESTONE.md)

## Current limits

Synthetic event generation is simplified and not calibrated to professional football. No real footage, live feed, xG model, tracking or general manager/injury history is connected. History-based stories use only supplied records. Before/after activity does not establish causation. Small passing evaluations do not establish fan usefulness or production reliability.

Persistent single-process AI-call allowances, request throttling and response caching are implemented. Public Free F1 hosting is verified (see docs/PUBLIC_DEMO.md). Broader evaluation, final submission materials and licensing decisions remain outstanding. Do not treat this source bundle as an already deployed production service.

Public demo: https://touchline-fan-20261025-b4bpgfdxbyarhyh5.germanywestcentral-01.azurewebsites.net/

Release 0.5 consolidates the viewer workflow, adds a prepared example and stale-result/future-time protection, and preserves essential incidents within short summaries. See [frozen scope](docs/FINAL_SCOPE.md) and [product evaluation](docs/PRODUCT_EVALUATION.md). Milestones 1 and 2 are complete subject to the explicitly documented prototype limitations; submission packaging remains.
