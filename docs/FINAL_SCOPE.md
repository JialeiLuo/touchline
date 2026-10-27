# Touchline 0.5 — frozen hackathon prototype scope

> Historical snapshot: current local capabilities and remaining work are reconciled in [the 27 October pre-release review](PRE_RELEASE_REVIEW.md). In particular, bounded model-selected investigation and supplied/illustrative shot-value analysis are now implemented. This file is not the final release manifest.

## Product promise

A returning football fan selects a revealed match interval and receives a short, inspectable explanation of the recorded story, with optional team/player focus and a translated football glossary. Touchline connects event evidence with supplied context; it does not watch a broadcast or find live match data online.

## Included

- Repeatable fictional 90-minute match replay, score and standard event-derived statistics; declared positions and starting/current lineups with manager and player details.
- One primary interval-commentary workspace. Quick and Tactical wording, team/player focus, evidence expansion, explicit window scopes and a prepared substitution example. Changed selections are flagged; invalid/future intervals are blocked before the main request.
- Optional local event recap, distinct from online story selection. Playback pauses for commentary requests. Full-time commentary offers a replay takeaway.
- Supported story families: goals/dismissals, bookings to follow, declared formation changes, contrasting passing/shooting windows, complete possession progression, substitute contribution, supplied role-history familiarity, focused-player involvement, reported/corrected incidents and interval score/shot overview. Major incidents cannot be dropped by a short paragraph budget.
- Six glossary languages: Chinese, Spanish, French, German, Portuguese and Japanese; English interface. Curated terms, definitions and selected fictional player-name translations.
- Touchline v1 synthetic JSON package input: match metadata, squads, chronological core events, provenance; optional historical role minutes and incident annotations. Availability times and corrections govern what can be shown. Downloadable example/current package.
- Curated official rule excerpt and linked reference with retrieval/version applicability disclosed. This supports explanation, not automated refereeing.
- Private Microsoft Foundry ranking of supported story IDs; locally owned wording and numbers. Persistent single-process call allowances, successful-response cache, throttling and labelled local fallback. Public HTTPS Azure Free F1 demo.

## Explicitly outside this submission

Autonomous tool selection/investigation; free-form football chatbot; internet research or live provider feeds; video/audio perception or spoken commentary; professional tracking, pressure/off-ball inference or causal tactical conclusions; calibrated xG or match predictions; comprehensive manager style, transfer/management, injury, rivalry and penalty-history databases; arbitrary CSV/provider import; multi-instance production service or long-term user accounts/storage.

The supplied role-history investigation is deterministic retrieval and comparison. It must not be presented as an autonomous agent. Ranking a catalogue is bounded AI use, not proof of novelty or superiority to ChatGPT. A future agent could plan additional evidence queries, but that is deferred rather than simulated in the interface.

## Input boundaries

JSON v1, completed 90-minute match, documented two internal team slots with custom display names. Maximum 2 MB, 12,000 core events, 200 annotations and 1,000 history records, subject to shared validation. Up to eight uploaded packages in memory for one hour; restart clears uploads. These are prototype resource limits for free hosting, not football constraints. No personal data is needed; do not upload sensitive information.

## Release acceptance

Reproducible local suite; multi-seed contract matrix; contrasting/missing/late role-history fixtures; bounded fresh live ranking samples with every outcome retained; browser journeys for entry, commentary, time/focus changes, lineup navigation, glossary, file upload and correction visibility; narrow-width layout check; public post-deployment smoke checks. Detailed evidence is in PRODUCT_EVALUATION.md and JSON reports.

External fan usability validation, long-duration availability and an equal-information competing-model baseline have not been completed and are not implied by these checks. Remaining work is submission packaging, not expanding this frozen feature list.

## Documentation reconciliation — 26 October 2026

Public source, narrated video and project-page links have since been published. This freeze describes product capabilities, not a promise that the historical packaging tasks above remain unfinished. See [current coverage review](COVERAGE_REVIEW.md) for the reconciled feature backlog and next-step priorities. Website voice remains outside scope; video narration does not change that.
