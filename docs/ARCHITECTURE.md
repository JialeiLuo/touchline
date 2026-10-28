# Touchline 0.6.0 architecture

The browser replays built-in or validated uploaded synthetic events. `match-clock.js` provides the shared period-aware clock. `match-package.js` validates identity, chronology, coordinates, provenance, history, shot linkage and optional structured incident classifications. Core events become visible at their event time; delayed/corrected annotations follow availability time.

The server creates a scoped evidence packet from the revealed input. Read-only investigator tools calculate comparisons and supply story candidates. Microsoft Foundry selects tools and inspected stories under bounded budgets; local code validates the selections and composes Quick/Tactical prose. The ranker is an alternate story-ID selection path. Neither path permits arbitrary model text to become a checked football fact.

`server/reports.cjs` normalizes one of three report scopes, derives score and chronology from events and optionally asks Foundry once to select supporting context. Local writing rules produce the full prose account and source references. Actual full-time events gate final reports. `report-ui.js` keeps short and long responses independent and rejects stale responses.

`data/rules.js` stores short curated IFAB excerpts with edition, retrieval date and official link. `decision-explanations.js` maps only explicit structured incident fields, second-caution reasons and added-time events; missing detail remains missing. The browser renders optional cards as text. Uploaded law quotations are rejected, and correction availability remains governed by shared package logic.

`server/demo-controls.cjs` supplies origin/rate checks, persistent call allowances, one active online request and bounded response caching. Investigator: at most 4 model calls / 6 tools / 22 seconds; reports: at most 1 call / 12 seconds / 800 output tokens / 26,000 conservative reserved-token estimate, with request/response byte limits. Provider failures and exhausted allowances yield labelled local output where supported. Call allowances are not a hard dollar cap; deployment account spending controls still need verification.

`/api/status` exposes version and release ID, plus an optional deployment revision supplied through TOUCHLINE_RELEASE_REVISION. The clean archive adds BUILD_INFO.json and a SHA-256 source manifest. Credentials and runtime state are excluded. CI runs regressions, the offline comparison and a fresh archive verification after publication; local verification does not establish a remote CI result.
