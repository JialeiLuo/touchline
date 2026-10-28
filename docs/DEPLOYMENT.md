# Deployed Touchline 0.6.0

Public app: https://touchline-fan-20261025-b4bpgfdxbyarhyh5.germanywestcentral-01.azurewebsites.net/
Release archive: https://github.com/JialeiLuo/touchline/releases/tag/v0.6.0
Frozen product revision: `1b26007`. See [release verification](RELEASE_0.6.0.md).

The existing Azure App Service F1 Free plan uses Node 24 LTS and `node server.cjs`, HTTPS only. Credentials remain in private app settings. State persists at `/home/touchline-state`; daily/total call limits are 200/2000 and the POST limit is 30/minute. The ledger survived a restart. Cache is in-memory and resets across process restarts. One online request runs at a time; reports can return local output when busy. Limits are not a hard dollar budget. Subscription spending limit was confirmed On; free hosting has cold starts and quotas.

To reproduce an authorized deployment, use the verified source zip and `tools/deploy-azure.py` with the Azure CLI's matching Python runtime: `python tools/deploy-azure.py --az /absolute/path/to/az --app touchline-fan-20261025 --group rg-selinaljl-3856 --archive ../releases/touchline-0.6.0-source.zip`. Use a private AZURE_CONFIG_DIR when appropriate. The helper refuses a non-F1 plan and keeps keys in a temporary private settings file. Do not commit `.env`, CLI caches, settings dumps or account screenshots.

Verify `/api/status` version and full source_revision, run `tools/check-public.cjs`, and check the core browser journeys after any deployment. Anonymous release-download tests and CI must identify the matching source. BUILD_INFO.json in the archive supplies runtime revision identity; later documentation-only commits do not imply a different deployed product. Do not upgrade hosting or enable paid services without owner authorization.
