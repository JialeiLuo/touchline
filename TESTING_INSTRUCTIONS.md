# Judge testing instructions

## Public demo — no login or payment

Open https://touchline-fan-20261025-b4bpgfdxbyarhyh5.germanywestcentral-01.azurewebsites.net/ in a desktop or mobile browser. Free hosting may take a little time to start. Refresh if the initial load stalls.

1. Select **Try the substitution example**. The replay moves to minute 66 and selects minutes 55–66, Tactical style and Ellis.
2. Select **Explain what changed**. Expect a role-history story connecting Ellis's declared wing role with the supplied 20/305 prior role minutes. Other supporting stories may differ because the model ranks a catalogue.
3. Expand **Inspect supporting evidence** and **Explore the play behind this explanation**. Check the history records, comparison windows and other changes. No causal effect is claimed.
4. Repeat the same explanation. A cache notice should appear without another model call.
5. Select **Quick catch-up**, then explain again. The same evidence produces shorter wording. Team/player focus changes relevance, not the facts.
6. Change the interval. The old result is flagged; an end beyond the revealed clock disables the main request. **Show event recap** opens a local summary without a model call.
7. Open **Teams & lineups**, select a player and use **Follow this player in commentary**. Starting XI and current personnel share the replay clock.
8. Change **Glossary language**, then click a highlighted term. Definitions use the selected language. Supported languages are Chinese, Spanish, French, German, Portuguese and Japanese.
9. Under **Match data & demo settings**, load the example or upload `data/example-match-package.json`. Move the slider past minutes 33 and 34 to see a reported incident become corrected, with the official-rule excerpt kept separate from incident facts.

Everything is fictional. The public demo has conservative usage controls to preserve student credit. A local-commentary label means Foundry was not used for that response; replay and calculations still work. Uploads expire after one hour or a server restart. Do not upload personal information.

## Reproduce locally

Install Node.js 22 or newer, clone this repository and run:

```sh
npm start
npm test
npm run evaluate
node tools/evaluate-product.cjs
```

Open `http://127.0.0.1:8767/`. No dependencies need installing. Without private Azure configuration, explanations use the labelled local path. For online ranking, copy `.env.example` to `.env` and privately configure your own Foundry deployment. Never commit secrets. No key belonging to the entrant is provided in the repository.

Read docs/MATCH_PACKAGE.md for the JSON schema, docs/DATA_PROVENANCE.md for generation, and docs/PRODUCT_EVALUATION.md for recorded results and limitations. Optional live evaluation scripts consume model credit and are not part of `npm test`.
