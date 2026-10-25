# Public demo deployment runbook

Status: public deployment verified on 25 October 2026. See PUBLIC_DEMO.md and public-demo-check.json.

## Candidate: Azure App Service Free F1

Use one Linux Node 22+ app, one process and one instance. Select **Free F1** explicitly. If unavailable in an allowed subscription region, stop rather than selecting a paid tier. Do not upgrade the student subscription or remove spending protection. Region and F1 availability must be confirmed in the portal; they are not established by local tests.

Microsoft describes Free as shared compute with CPU quotas and no scale-out. It is suitable for testing, with availability limitations that matter for judging: https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans

## Prepare and configure

1. Build the verified source release with `python3 tools/build-release.py --verify --node /path/to/node`. Extract its `touchline` folder. Deploy folder contents, not the parent folder. No dependencies or build step are required.
2. In the Azure portal create a Web App using the existing student subscription, an allowed region, Linux, an available Node 22+ runtime and **Free F1**. Review the price before creating anything. Avoid Application Insights or other optional paid resources.
3. Use startup command `node server.cjs`. Configure `HOST=0.0.0.0`; leave PORT to the hosting runtime.
4. Add private application settings: AZURE_FOUNDRY_BASE_URL, AZURE_FOUNDRY_DEPLOYMENT and AZURE_FOUNDRY_API_KEY from the local private environment. Never include `.env` in a deployment ZIP or paste a key into a public command, document or browser script.
5. Set TOUCHLINE_STATE_DIR=/home/touchline-state, TOUCHLINE_AI_DAILY_LIMIT=200, TOUCHLINE_AI_TOTAL_LIMIT=2000, TOUCHLINE_REQUESTS_PER_MINUTE=30. Confirm this directory survives an actual restart before enabling public model access. App Service storage configuration must be verified for the chosen Linux runtime: https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container?pivots=container-linux#use-persistent-shared-storage
6. Deploy via the portal-supported deployment workflow or Azure CLI ZIP deployment. Azure CLI 2.75.0 was installed in a temporary isolated environment and ZIP deployment succeeded. Docker builds remain unverified.
7. Require HTTPS. Keep one process: do not add clustering, multiple worker processes or replicas. The file ledger is not a distributed lock.

## Implemented controls and limits

- Reserve each online call before sending it, including failed calls. Daily limit resets at UTC midnight; total reservations persist across restarts if the storage persists.
- Cache up to 64 successful responses for one hour, keyed by the entire evidence packet and preferences. Cache hits require no new model call. Cache is memory-only and clears on restart.
- One online request runs at a time. Requests above that return a retry message.
- Thirty POST requests per minute per socket address; at most 1000 active address buckets. Forwarded headers are deliberately not trusted. A reverse proxy may put visitors in a shared bucket; test this on the real host before judging.
- Exhausted allowance or unreadable usage state yields local commentary. Replay, evidence and local calculations continue.
- This is a call allowance, not a dollar cap. Requests vary in token usage. It does not prevent spending by another application using the same Azure deployment. Deleting the ledger resets the allowance; preserve it across deployments.
- Uploaded packages stay in memory for one hour, maximum eight; restarting removes them. Cache and visitor counters also reset. No uploaded files are written to persistent storage.

## Required hosted acceptance checks

- Open public HTTPS from a second device; exercise Quick/Tactical, player focus, upload, glossary and catch-up.
- Make the identical AI request twice; the second response must show cached delivery and the ledger must increase only once.
- Restart and verify total reservation retention. With a temporarily reduced limit verify local fallback, then restore the reviewed settings without deleting usage history.
- Verify cross-origin POST rejection, private asset blocking and throttling behind the real proxy.
- Confirm the student subscription remains protected and has sufficient credit through judging. Alerts are advisory.
- Record the public URL and exact testing steps in submission materials only after these pass.

The Dockerfile remains unverified. Azure Free F1 deployment and hosted checks were verified separately from the local suite. Future availability is subject to Azure quotas and subscription status.

Repeat deployments can use `python3 tools/deploy-azure.py --az /path/to/az --app touchline-fan-20261025 --group rg-selinaljl-3856 --archive ../releases/touchline-0.4.1-source.zip`. It requires CLI sign-in, refuses a non-F1 plan and passes private settings through a temporary file. Keep AZURE_CONFIG_DIR private if using a separate CLI profile.
