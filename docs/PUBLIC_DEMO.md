# Public working demo — milestone 1

Public URL: https://touchline-fan-20261025-b4bpgfdxbyarhyh5.germanywestcentral-01.azurewebsites.net/

Deployed and checked on 25 October 2026. It runs on Azure, independently of the developer's laptop. No viewer account is required.

## Hosting and cost protection

- Azure App Service Free F1, Linux Node 24 LTS, one instance, Germany West Central.
- HTTPS required; no paid Application Insights or Defender add-on selected.
- Existing Azure for Students subscription remains Enabled with spending limit On. No billing upgrade was performed.
- Hosting is Free F1. Foundry inference still consumes student credit; it is not free unlimited inference.
- Default allowances: 200 reserved model calls per UTC day, 2000 total, including failed attempts. Usage persists at `/home/touchline-state/usage.json` across verified restarts. A cache hit makes no new model call.
- Free hosting has cold starts and CPU quotas, and is not a promise of continuous availability. Initial browser navigation timed out once while starting; the page subsequently loaded successfully.

## What was verified

Public HTTPS assets, calculated evidence, real Foundry commentary, repeated cached replies, synthetic JSON upload, cross-origin rejection and private file blocking. The local server was stopped during hosted browser tests and a fresh public page load still worked.

The browser journey covered replay, 55–66 minute catch-up, Tactical commentary focused on Ellis, supporting context, teams and managers, player details and a Spanish glossary explanation. No browser console errors were captured.

A restart preserved the ledger exactly at 1 daily/1 total. A fresh browser AI request and repeat ended at 2/2. A temporary limit of 3, once 3 calls had been reserved, returned local commentary rather than sending another call. Normal 200/2000 limits were restored. A 31-request evidence burst produced 29 successes and two HTTP 429 responses; the status route remained available. Requests behind the Azure proxy may share a socket-address bucket.

A later live check returned the existing safe fallback for an unavailable or invalid model response. This is recorded rather than treated as a successful AI call. The interface and fallback remain usable; model response reliability and story usefulness belong in milestone 2 evaluation.

Evidence: `public-demo-check.json`, `public-hosting-check.json`, `public-demo.jpg`. Remote requests and browser checks ran from the development machine; no second physical device or long-duration availability test was used.

## Try it

1. Open the public URL and move the replay slider to roughly 66 minutes.
2. Set From 55, To 66. Generate catch-up for a local summary.
3. Choose Tactical detail and Ellis in Player focus. Select Explain what changed.
4. Repeat the identical request to see the cache notice. Inspect the supporting evidence.
5. Open Teams & lineups, select a player, or switch glossary language and click a highlighted term.
6. Match data & demo settings contains the example package and upload controls. Uploads are temporary, kept in server memory for up to one hour and removed on restart.

The commentary is a bounded model ranking of supported stories, with source-owned wording. This deployment does not add autonomous investigation or a live football feed.

## Remaining milestones

Milestone 2: complete viewer journeys and usefulness/reliability evaluation; fix confusing behavior and freeze scope.
Milestone 3: public GitHub, under-two-minute video, final pitch/testing/project page, eligibility and category confirmation.

See DEPLOYMENT.md for redeployment and operational limits. Keep private `.env` out of source and deployment archives.
