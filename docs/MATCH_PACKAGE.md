# Match-package input v1 and v2

Version 1 is a constrained upload contract, not an adapter for arbitrary football-provider exports. Use data/example-match-package.json as the complete runnable example. All supported inputs must be explicitly synthetic. Real reports researched for the event catalogue are not imported as synthetic records.

## Version 2: added-time clock (R1)

New generated matches use `package_version: "2"`. All v1 identity, evidence and resource rules continue, with these time changes:

```json
"clock": {"version": "1", "periods": [
  {"period": 1, "start": 0, "regulation_seconds": 2700, "end": 2880},
  {"period": 2, "start": 2880, "regulation_seconds": 2700, "end": 5820}
]}
```

`t` is chronological playing-timeline seconds, excluding the half-time wall-clock break. Each event requires `period: 1` or `2`. Each period begins at its kickoff and ends at its whistle; the half-time marker belongs to period 1. Starts/ends are whole seconds; each half permits 0–900 added seconds as a prototype limit. An extended half requires exactly one `added_time` event at `start + 2700`, with whole-minute `minimum_seconds` not exceeding actual added time. The actual whistle can be later than the announced minimum. The final event must match period 2's declared end. History/report/value availability is bounded by that actual final time rather than 5400.

Example: `t: 2820, period: 1` displays `45+2:00`; `t: 3000, period: 2` displays `47:00` with the clock above. They are different moments. Shift every affected second-half timestamp/availability field consistently when migrating a producer. The API still accepts numeric timeline seconds; only browser inputs use football-clock strings. A full-time report requires the revealed whistle, not a nominal minute threshold.

Version 1 remains supported unchanged and is exported unchanged when loaded. Its original 5400-second limit remains intentional. The saved `data/example-match-package.json` is a legacy compatibility example; the server's generated example and built-in downloads now use v2. See [R1 verification and limits](R1.md). The remaining v1-specific descriptions below apply to legacy inputs.

## Use
Start `node --env-file=.env server.cjs` with Node 22+ (or omit --env-file for template fallback). Open http://127.0.0.1:8767/. At Match data, choose a JSON file or Load example package. Download current package exports the package format. The older Download data action also exports a clean package when one is loaded. Generate replay returns to the built-in generator. Switching tabs does not change the match clock.

Package upload is sent to the local backend, not Azure. Accepted packages remain in server memory for one hour, at most eight packages at a time; restart clears them. A successful replacement removes your previous package, while an invalid replacement leaves it intact. Remove upload and use built-in match deletes the selected server copy; Reload expired package re-registers the retained local data. The returned opaque ID selects the validated package for subsequent evidence/commentary requests. Only the selected facts go to Azure when the AI button is used. There is no public account/authentication or durable database yet. The 2 MB JSON upload limit is separate from the 4 KB commentary-request limit.

## Required fields
- package_version: "1", synthetic: true.
- match: id and title.
- provenance: method; optional generator version and assumptions.
- squads.teams.northbridge and squads.teams.southport: each team.id must match its key; these fixed IDs are internal home/away slots in v1; names and manager names may differ. Each roster has exactly 11 starters, at most 25 players, globally unique player IDs and distinct shirt numbers 1–99. Starting players need assigned positions and schematic slots x/y in 0–100; all players need usual_position.
- events: 2–12000 records ordered by elapsed match seconds t, beginning with kickoff at 0 and ending with full_time at 5400. Every event is synthetic and has a unique ID. Current core types are those supported by the built-in simulator; unrecognised incidents belong in annotations. Actor/team identities, active-player eligibility, pass recipients, coordinates, action outcomes, substitution eligibility and goal/shot correspondence are checked. Core events are available at event time in v1. Extra time, shootouts, abandonment and delayed core-decision revisions are not supported yet.

This is validation of selected software invariants, not verification that a football match is realistic, rules-compliant in every respect or truthfully labelled synthetic. Optional version-1 historical role records are processed only when available by the relevant substitution time. Broader injury, manager and disciplinary histories are not supported.

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

## Analysis and coordinate contract (Batch 1)
New exports include `analysis_contract`:
```json
{"time_unit":"seconds","coordinates":"metres_105x68","direction":{"northbridge":"increasing_x","southport":"decreasing_x"}}
```
Time `t` is elapsed match seconds (not minute numbers or wall-clock timestamps), from 0 to 5400. Ordinary interval reports include both endpoints `[from,to]`; adjacent such reports can share their boundary event. Equal-window before/after comparisons instead use half-open windows `[start,end)` as labelled in the interface. Core events become known immediately; delayed incident reports use annotation availability separately.

Event x/y are action endpoints on one absolute 105×68 metre pitch; supply both coordinates or neither. Player lineup slots are schematic percentages (0–100), measured from each team's own goal; they are not tracking. Direction is fixed across both halves in v1; rotate provider coordinates before import if they change ends. Opposite directions may be explicitly reversed. Legacy v1 packages without analysis_contract retain the original defaults, visibly labelled as assumed. Unsupported contract values are rejected rather than silently converted.

Pass/carry duration is seconds, required for possession-time accounting. Player IDs are globally unique, persistent through substitutions and history; team IDs are the two fixed internal slots. Possession IDs must identify one team only and cannot be reused after their closing possession_end. Each core event ID is unique. Event validation errors identify the array index and event ID.

Sequence analysis is enabled from supplied possession IDs, x/y endpoints and closing records, equally for built-in and uploaded matches. Missing prerequisites produce “Unavailable”, not a zero entry count. Only complete groups wholly inside the selected interval are counted. A capability is an input-coverage statement, not a guarantee of professional-quality data or tactical causality.

Package management endpoints: GET /api/packages/{opaque-id} returns creation/expiry timestamps; DELETE removes that known package. No package-list endpoint exists. POST /api/packages accepts X-Replace-Package containing your previous opaque ID, and returns expires_at. Validation happens before replacement, including at capacity. IDs confer access to their temporary package: keep them private. There is no user-account isolation or durable storage in this prototype.

## Optional pre-shot values (Batch 4)

Version 1 accepts `xg_sources` and shot `xg` objects; goals may supply `shot_id` for a unique preceding goal-outcome shot. See the [complete source, availability, range and linkage contract](CHANCE_QUALITY.md). Legacy packages without shot values remain supported. The updated runnable example includes clearly labelled simulator illustrations; no professional calibration is claimed.
