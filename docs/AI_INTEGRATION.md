# Microsoft Foundry integration

The backend calls an Azure OpenAI v1 Responses endpoint configured through environment variables in `.env.example`. The private local `.env` is excluded from source export. Requests use a server-held API key; no key is sent to visitors.

For supported stories, the model ranks bounded candidate IDs. The server assembles wording, figures, time scopes and citations and applies player/team focus plus major-event coverage. This is not autonomous tool calling or a multi-agent system. A legacy guarded prose route remains when candidates are absent.

Provider failure, invalid selection or absent configuration returns a labeled local fallback. The integration uses a timeout and limits output tokens. Live calls consume Azure credit; Codex subscription usage is separate.

See TESTING.md for optional live checks and DEPLOYMENT.md for launch prerequisites. Public inference usage controls and billing reconciliation remain outstanding.

## Batch 5 local refinement

The current local investigator path adds real function calling through Microsoft Foundry, validated read-only evidence queries, follow-ups and explicit stopping. The earlier ranker description remains accurate for `analysis_mode: rank` and the older public release. See [investigator design and bounds](BOUNDED_INVESTIGATOR.md) and [verification evidence](BATCH_5.md).
