# How to use Touchline

This guide describes the 0.5 fan-facing prototype. [Open Touchline](https://touchline-fan-20261025-b4bpgfdxbyarhyh5.germanywestcentral-01.azurewebsites.net/) or [watch the 1:48 demonstration](https://youtu.be/9JvQMpAhdpA). Everything in the example match is fictional.

## Start without supplying data

Select **Try the substitution example** near the top of the page. It prepares a complete example: minute 66, catch-up 55–66, Tactical detail and Ellis. Select **Explain what changed**. Expect commentary about his assigned right-wing role, supplied recent experience and recorded match activity. The model may prioritize additional stories differently.

Expand **Inspect supporting evidence** below each story. The facts list links by stable record IDs. Expand **Explore the play behind this explanation** for role context, complete possession sequences and matched comparisons. The history example uses 20 minutes in the inherited role out of 305 total supplied minutes; it is not a real football statistic or player rating.

## Watch or rewind the replay

Use Play, Next event, Next key moment or the pitch slider. The score, statistics, current lineup and incident visibility follow the replay clock. Rewinding restores the earlier observed state. The pitch shows declared lineup slots with shirt numbers; dots are not live tracking.

Under **Match data & demo settings**, Full synthetic match is the main 90-minute demonstration. The shorter scenario/control/generated phase fixtures are diagnostic examples around a booking, not alternative complete matches. A seed makes pseudorandom generation reproducible. Changing a seed or profile does not guarantee that every visible statistic differs at every moment.

## Catch up on a chosen interval

1. Reveal the match through the end minute you want to examine.
2. Choose From and To minutes. The controls step in whole minutes. Recent-interval shortcuts help select the last observed spell.
3. Choose **Quick catch-up** for a shorter story, or **Tactical detail** for more figures, roles and supporting stories.
4. Optionally select either team and a player. Player focus takes priority when both are set; goals and dismissals remain protected.
5. Select **Explain what changed**. Playback pauses while the request is prepared.

The explanation concerns the selected interval. A role comparison may use its explicitly labelled window around an entry; historical records are filtered by their own availability rule. The separate match-so-far summary concerns the whole revealed replay, not just your interval.

If you change the interval, preferences or replay position, the previous explanation is marked as belonging to the old selection. Request another explanation to update it. A future end minute is blocked; a pending response is discarded if the selection changes.

**Show event recap** produces a local event summary. It is useful when you want the sequence of recorded events without online selection. Commentary adds selected context when that context is present; it cannot infer arbitrary tactics from sparse events.

## Follow a team or player

Use the focus controls in the commentary workspace, or open **Teams & lineups**, select a player and choose **Follow this player in commentary**. The detail dialog distinguishes usual position from the currently assigned role. Starting XI and current personnel can differ after substitutions or dismissals.

Team focus changes which supported stories are most relevant. It does not alter numbers, suppress major opposing incidents or manufacture a favourable interpretation. Rivalries and persistent favourite-club profiles are not implemented.

## Learn vocabulary across languages

Choose Chinese, Spanish, French, German, Portuguese or Japanese under **Glossary language**. Click a highlighted term or supported player name. The popup gives a curated translation and explanation in that language, with English help where provided. The main interface and commentary remain English. The dictionary is limited; unfamiliar terms are not automatically translated.

## Bring your own synthetic match

1. Open **Match data & demo settings**.
2. Download the example/current package, or inspect [data/example-match-package.json](../data/example-match-package.json).
3. Edit a copy while preserving the documented schema, then use the JSON upload control. **Load example package** is the easier first test.
4. Wait for validation. Rejected input does not replace the currently loaded valid match.
5. Advance the replay and request commentary in the same way as for a built-in match.

JSON means a structured text file containing named fields and lists. It is the interchange format; it is not a model or a database. The supported package is more specific than “any JSON.”

| Package content | Required? | Why it matters |
|---|---|---|
| Version, synthetic flag, match identity and provenance | Yes | Establish the supported format and origin. |
| Both squads, starters, player IDs, declared positions and slots | Yes | Resolve actors, validate personnel and show lineups. |
| Chronological core events from kickoff to full time | Yes | Reconstruct the 90-minute replay and calculate evidence. |
| Timestamped prior role-minute records | No | Enable the narrow substitution-familiarity story. |
| Incident reports, availability times and corrections | No | Explain what was reported and when it became known. |
| Official rule-reference metadata | No | Link to supported official destinations; a URL alone does not verify an interpretation. |

See [MATCH_PACKAGE.md](MATCH_PACKAGE.md) for exact field names, units and supported types. Current internal team slots are northbridge/southport; display names can be customized. The contract requires completed 90-minute synthetic packages. It does not support arbitrary CSV/provider exports, partial live ingestion, added-time periods, extra time or shootouts.

Limits: 2 MB; 12,000 core events; 200 annotations; 1,000 history records. Eight uploaded packages may be held in server memory for one hour. Restarting means stopping and starting the backend process; doing that clears uploaded packages. These limits protect the small free demo and are not football requirements.

Uploading sends the package to the Touchline backend. Online commentary sends selected evidence to Microsoft Foundry. A hosted upload is not “only on your laptop.” No durable account storage is offered. Do not upload personal or sensitive data.

## Examine reports and rules

Load the example package. Move through minutes 32, 33 and 34: the incident happens first, becomes reported later, then receives a clarification. A correction supersedes the earlier available account. No annotation changes the official score or lineup just by mentioning a goal or card.

The curated IFAB reference explains a rule separately from the incident facts. It is one checked excerpt, with a retrieval label, not a comprehensive edition-pinned referee engine. Unknown incident kinds can be preserved as supplied text; the system does not detect a confrontation or touchline gesture from video.

## Understand status messages

| Message or situation | Meaning / action |
|---|---|
| Explain button disabled at kickoff | Reveal a valid interval, or use the prepared example. |
| AI-selected stories | Foundry ranked supported story IDs; local logic owns wording and figures. |
| Template fallback | Online selection was unavailable or a usage allowance was reached; the local supported path was used. |
| Reused/cached explanation | The same request reused an existing result without another model call. |
| Old explanation / changed selection | Request an updated explanation for your new selection. |
| No incident available | No report is available in this package at that knowledge time; it does not prove nothing happened. |
| Missing history | Role familiarity is unknown; a usual-position label alone is insufficient. |
| Slow initial load | Free hosting can need time to start; refresh if the initial load stalls. |

## What this is useful for today

Try an interval catch-up, a focused player story, source inspection, glossary learning and a structured-package replay. A pre-match briefing, open-ended football questions, autonomous evidence investigation, real match lookup, injury/manager analysis, calibrated xG, predictions and spoken live commentary remain outside the prototype.

## Loading your match reliably
Open **Match data & demo settings**, then **Match data**. Use **Load example package** first, or choose a synthetic Touchline JSON file up to 2 MB. **Download current package** gives the complete editable format, including the explicit time/coordinate contract. CSV and video are not accepted yet.

The panel shows which sequence analysis, role history and incident data are supplied. Missing data is different from a measured zero. Uploading the built-in match preserves its supported calculations. Validation errors point to problematic events; rejected uploads keep your current match. An accepted replacement removes the old server copy. The expiry time is shown; after expiry local replay still works, and **Reload expired package** restores server analysis. **Remove upload and use built-in match** deletes the selected server copy. Restarting the server also clears its temporary uploads. Never put credentials or personal information in match packages.

## Local refinement: richer supporting evidence

After explaining an interval, expand **Explore the play behind this explanation**. Substitution evidence shows each player’s seconds on pitch and the history known at entry. Before/after comparisons show passes completed out of attempts, advanced sequences out of complete recorded sequences, and concurrent changes. Missing progression data is labelled unavailable. The shape/discipline disclosure shows declared formations and booked players still on the field. These additions are currently local; the public demo updates in the final release batch.

## Local refinement: chance quality

Explain a revealed interval and expand **Explore the play behind this explanation**. The chance-quality section shows shot coverage, source, supplied totals and linked goals. Charts separate sources; expand the shot-values disclosure to inspect each value, goal link and method. Built-in values illustrate the simulator and are not calibrated professional xG. Missing/delayed values are not zero; incomplete or mixed-source inputs do not receive a combined total. See [details and limits](CHANCE_QUALITY.md). This refinement is local until Batch 10.
