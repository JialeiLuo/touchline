# Touchline

Touchline helps a football viewer catch up and question a commentary: what changed, what supports that reading, and what the supplied evidence cannot show. All included matches, clubs, players and histories are fictional.

**Public release: 0.6.0.** [Try Touchline](https://touchline-fan-20261025-b4bpgfdxbyarhyh5.germanywestcentral-01.azurewebsites.net/) · [Watch the final demo](https://youtu.be/juiWMsbUzJk) · [Download the verified release](https://github.com/JialeiLuo/touchline/releases/tag/v0.6.0).

Product source is frozen at `1b26007`; later documentation and video commits do not change the hosted product. Public Foundry/cache/upload checks, CI, restart persistence and the anonymous release download passed. See [release verification](docs/RELEASE_0.6.0.md) and the [hands-on guide](docs/USER_GUIDE.md).

## Try it locally

Install Node.js 22 or later, then run `npm start` and open http://127.0.0.1:8767. No install step or credentials are needed for the local explanation and reports. Select **Try the substitution example**, then **Explain what changed**. Start with Quick; choose Tactical and regenerate for detailed comparisons.

Optional Microsoft Foundry configuration belongs in a private `.env` copied from `.env.example`. Never put credentials in browser code or uploads. See [AI integration](docs/AI_INTEGRATION.md). Run `npm test` for regressions and `npm run evaluate:comparative` for the offline comparison.

## What is included

- Replay, score and statistics restricted to revealed events, with two halves, announced minimum added time and the actual whistle. Half-time is a clear transition without a real waiting period. No extra time or shootouts.
- Quick and Tactical explanations, team/player focus, checked source claims, role-history denominators, concurrent-change limits and an inspectable bounded investigation.
- Optional prose reports: selected spell, match so far and full time after the whistle; expandable paragraph sources and text download.
- Optional **Explain this decision** cards connecting supplied incident facts to short attributed IFAB law excerpts. Missing offence/severity remains unspecified; a quotation does not certify a referee decision.
- Declared formation dots and event locations, glossary languages, lineups, source inspection and synthetic match-package upload/download. Version 1 packages retain their old 90-minute contract; version 2 supports period-aware added time.
- Illustrative pre-shot chance quality, with provenance and missing-data handling. These probabilities are not calibrated professional xG.

Microsoft Foundry selects tools/stories/context; local code calculates evidence, validates references and writes the controlled narrative. Reports use at most one optional context-selection call. The investigator uses one agent with explicit tool/call/time/token limits. Neither component watches video or independently establishes football facts. No comparative superiority or real-fan study is claimed.

## Inspect and reproduce

[Architecture](docs/ARCHITECTURE.md) · [Scope](docs/FINAL_SCOPE.md) · [Testing instructions](TESTING_INSTRUCTIONS.md) · [Provenance](docs/DATA_PROVENANCE.md) · [Evaluation and freeze record](docs/FINAL_CANDIDATE.md) · [Copyright](COPYRIGHT.md).

Build a clean source archive with `python3 tools/build-release.py --verify --node /absolute/path/to/node`. Exports exclude credentials, runtime state and account screenshots. The archive contains a content-hash manifest and build identity. Deployment must report the matching version/revision before it is described as the final public release.
