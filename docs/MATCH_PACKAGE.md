# Match-package input v1

Version 1 is a constrained upload contract, not an adapter for arbitrary football-provider exports. Use data/example-match-package.json as the complete runnable example. All supported inputs must be explicitly synthetic. Real reports researched for the event catalogue are not imported as synthetic records.

## Use
Start `node --env-file=.env server.cjs` with Node 22+ (or omit --env-file for template fallback). Open http://127.0.0.1:8767/. At Match data, choose a JSON file or Load example package. Download current package exports the package format. The older Download data action also exports a clean package when one is loaded. Generate replay returns to the built-in generator. Switching tabs does not change the match clock.

Package upload is sent to the local backend, not Azure. Accepted packages remain in server memory for one hour, at most eight packages at a time; restart clears them. The returned opaque ID selects the validated package for subsequent evidence/commentary requests. Only the selected facts go to Azure when the AI button is used. There is no public account/authentication or durable database yet. The 2 MB JSON upload limit is separate from the 4 KB commentary-request limit.

## Required fields
- package_version: "1", synthetic: true.
- match: id and title.
- provenance: method; optional generator version and assumptions.
- squads.teams.northbridge and squads.teams.southport: each team.id must match its key; these fixed IDs are internal home/away slots in v1; names and manager names may differ. Each roster has exactly 11 starters, at most 25 players, globally unique player IDs and distinct shirt numbers 1–99. Starting players need assigned positions and schematic slots x/y in 0–100; all players need usual_position.
- events: 2–12000 records ordered by elapsed match seconds t, beginning with kickoff at 0 and ending with full_time at 5400. Every event is synthetic and has a unique ID. Current core types are those supported by the built-in simulator; unrecognised incidents belong in annotations. Actor/team identities, active-player eligibility, pass recipients, coordinates, action outcomes, substitution eligibility and goal/shot correspondence are checked. Core events are available at event time in v1. Extra time, shootouts, abandonment and delayed core-decision revisions are not supported yet.

This is validation of selected software invariants, not verification that a football match is realistic, rules-compliant in every respect or truthfully labelled synthetic. Historical context records are not processed in v1.

## Optional annotations
Up to 200 records: id, kind (extensible text), happened_at, available_at, description, source, status, synthetic:true. Status is reported, confirmed, corrected or withdrawn. Participants and related_event_ids are optional. Corrections/withdrawals can supersede an earlier available annotation; links must point to a strictly earlier knowledge time. Previous versions remain in the package but the latest available version is shown. Unknown incident kinds are preserved as text without altering score/lineup.

Annotations are revealed only at available_at. The key-moment panel uses the current replay clock. Interval evidence selects incidents by happened_at within the interval, using corrections available by the current replay clock; knowledge learned after the interval but before the current clock is allowed and labelled by the records. Core before/after calculations still stop at the selected interval end. No annotation changes the score or disciplinary state merely by mentioning a goal or card.

Example: an incident happened at 32′, is first reported at 33′, and clarified at 34′. At 32′ no report is available; at 33′ only the first report is visible; after 34′ the clarification supersedes it. Rewinding restores the earlier knowledge state.

## Rule references and quotations
Annotations may include rule_refs with title, version and an HTTPS URL on a supported official IFAB/Premier League/UEFA/FIFA domain. Host validation establishes the destination, not the correctness of text, version or incident interpretation. The server does not fetch these URLs.

Uploaded quote fields are rejected. A curated catalogue_id can point to a checked local record in data/rules.js. Initially this contains one short quotation from the official IFAB Law 12 player-caution list, checked 25 October 2026. The page is a latest-version URL, not an immutable season snapshot: season applicability still needs checking. The quote is displayed separately from incident facts and is not used to automatically decide an offence. Broader rule coverage and pinned season snapshots remain future work.

## Endpoints
- GET /api/package-example: original synthetic demonstration package.
- POST /api/packages: validate/store a package; returns package_id and expiry duration.
- POST /api/evidence or /api/commentary: package_id, index, from/to seconds, viewer_mode (quick/tactical). A seed is used only for the built-in generator when no package_id is supplied.

## Verification
Run `node tests/packages.cjs`. It checks 60 generated packages, uploaded roster use, chronology/identity rejection, annotation/correction availability, server-owned evidence and rule-link/quotation restrictions. Existing squad, catch-up, backend, tactical and personalisation checks still apply. Browser testing includes the actual file chooser upload, incident appearance/clarification and corrected uploaded evidence. The example incident is fictional and does not assert an official sanction.

## Optional role history (schema 1)

`history: {"schema_version":"1","records":[...]}` is optional. Each record contains `id`, a known `player_id`, `match_id`, `happened_at` (negative seconds relative to this match's kickoff), `available_at` (same relative clock), `position`, `minutes`, `source` and `synthetic:true`. At most 1,000 records; one position record per player per previous match; minutes 0–130. This small contract does not support several role stints within one historical match.

The substitution investigation retrieves at most five most recent prior records available by the substitution time. It reports recorded minutes in the inherited role and total recorded minutes; this is not a skill rating, causal effect estimate or full career history. Missing records remain unknown. Records supplied later are excluded even when the replay has advanced. A five-minute outgoing/incoming activity comparison is shown only after the complete window is revealed. Other substitutions, goals, dismissals and authored tactical changes in that span are listed as competing changes.

Built-in history is an authored fictional fixture in `data/player-history.js`: Ellis has 20 of 305 minutes in RW; Duarte has 305 of 305. These contrasting assumptions are included in downloaded packages. They were not sampled from real football and do not establish realistic population rates.
