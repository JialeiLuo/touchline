# Microsoft Foundry integration

The backend calls an Azure OpenAI v1 Responses endpoint configured through environment variables in `.env.example`. The private local `.env` is excluded from source export. Requests use a server-held API key; no key is sent to visitors.

For supported stories, the model ranks bounded candidate IDs. The server assembles wording, figures, time scopes and citations and applies player/team focus plus major-event coverage. This is not autonomous tool calling or a multi-agent system. A legacy guarded prose route remains when candidates are absent.

Provider failure, invalid selection or absent configuration returns a labeled local fallback. The integration uses a timeout and limits output tokens. Live calls consume Azure credit; Codex subscription usage is separate.

See TESTING.md for optional live checks and DEPLOYMENT.md for launch prerequisites. Public inference usage controls and billing reconciliation remain outstanding.
