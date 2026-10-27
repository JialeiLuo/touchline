# Touchline: pre-release assessment and hands-on guide

27 October 2026. Reviewed local product: `9fbf70f`, with the Batch 9 closure/documentation changes in the commit containing this report. This is a source-and-record audit, not a new live-model benchmark, competitor survey, production certification or independent fan study. Nothing was deployed, uploaded or made public for this review.

## Decision in brief

Batch 9 is complete: the owner rechecked the repairs and accepted the improved experience. The recorded review remains one written feedback response plus owner acceptance, without inventing unfamiliar-user task completion or a larger study.

Touchline has a coherent submission: a returning fan chooses a missed spell, gets a concise explanation, optionally follows a player, and checks the underlying evidence. The strongest parts are the combination of replay-scoped context, supplied role history, controlled comparisons, source inspection and understandable uncertainty. The weakest parts are demonstrated incremental AI value, production availability and breadth of multilingual storytelling.

Proceed toward the release after resolving a small set of consistency and availability checks. Do not expand into tracking, injuries, prediction or multiple agents to fill a checklist. Make the existing useful journey obvious and demonstrable. The current public demo, old video and some release documents describe an earlier version; local implementation is ahead of them.

## 1. Official framework and our assessment

### Source and timing

Official reference: [Microsoft rules, section 6](https://github.com/microsoft/insidethegamehackathon/blob/main/OFFICIAL%20RULES.md#6-judges--criteria), rechecked 27 October. Stage 1 screens viability and theme/technology fit. Stage 2 weights each area below at 20%. Assessments are ours.

[Submission/access requirements and dates](https://github.com/microsoft/insidethegamehackathon/blob/main/OFFICIAL%20RULES.md): public repository; working judge access through 10 November Pacific; English materials or translations; public working-product video under two minutes. Deadline: 27 October 23:59 Pacific, or 28 October 06:59 UK.

### Overall assessment

| Area | Current strength | Main reason | Biggest remaining weakness |
|---|---|---|---|
| Technological Implementation | Strong prototype evidence | Reproducible generation, input contracts, deterministic football tools, typed claims, temporal isolation and failure recovery | Simplified football realism; incremental frontend structure; CI and final-package checks still belong to release |
| Agentic Design & Innovation | Moderate, substantively implemented | A real model selects bounded tools and follow-up queries, then finishes with inspected evidence | No demonstrated quality advantage over rules/ranking; orchestration is custom and single-agent |
| Real-World Impact & Applicability | Plausible, partly evidenced | A focused catch-up workflow addresses a recognizable fan task | No measured retention, comprehension improvement, demand or production economics |
| User Experience & Presentation | Improved, locally accepted | Prepared example, short/deep modes, focus, glossary, sources, recovery and narrow-screen checks | Still many controls/disclosures; old public video does not show the final build |
| Adherence to Hackathon Category | Credible Foundry candidate | Actual Foundry inference and tool calling, Azure-hosted product | Limited use of Foundry-specific orchestration/management; hosting alone is not deep cloud integration |

### Technical execution: every judging prompt mapped

| Review lens | Where Touchline addresses it | Assessment and useful improvement |
|---|---|---|
| Synthetic-data design | `full-match.js`, `data/squads.*`, `data/player-history.js`, scenario fixtures and provenance documentation. Seeded generation ties actors to squads, restricts actions after substitution/dismissal, represents possession groups and uses declared tactical/control cases. Ellis and Duarte have deliberately contrasting history. | Strong for repeatability and testing; moderate for football realism. The random process and authored scenarios are not empirically calibrated. Present the histories as controlled examples, not discoveries about real football. Fix/reconcile the half-time period metadata finding below. |
| Engineering discipline | Input validation, built-in/upload parity, expiry/replacement behavior, as-of evidence filtering, cancellation, stale-response rejection, guarded fallback and tests. Latest recorded suite: 27 test files passed; usability browser record covers desktop and narrow layouts. | Substantial local evidence. Tests do not prove semantic football correctness. Add the final CI workflow and clean-package execution in Batch 10; keep observed failures in evaluation reports. |
| Microsoft technology contribution | `server/provider.cjs`, `server/investigator.cjs`, `server/investigator-tools.cjs`: gpt-5-mini through Microsoft Foundry selects evidence queries and follow-ups; Azure App Service hosts the earlier public release. | Foundry genuinely participates in the computation. Local software owns orchestration and evidence checks; do not imply managed Foundry Agent Service, MCP, Fabric or Agent Framework integrations that are absent. Show one real tool trace and explain the boundary. |
| Structure and maintenance | Separate evidence, history, comparison, chance, investigator, composition and validation modules. Input schema, scope, tests and evaluation artifacts are documented. | Backend responsibilities are relatively clear. Frontend scripts layer wrappers around shared global functions; that raises maintenance risk. A broad rewrite near release is higher risk than targeted fixes. Reconcile stale docs now and keep refactoring as later work. |

### Agentic innovation: every judging prompt mapped

| Review lens | Where Touchline addresses it | Assessment and useful improvement |
|---|---|---|
| Meaningful agent pattern | The investigator sees a bounded catalogue, chooses a read-only evidence tool, reads results, can follow up, and submits an explicit finish. Missing history or an incomplete window can produce insufficient evidence. | More substantive than one prompt that simply asks for commentary. The fixed investigation question and controlled finish are appropriate for this product. Explain that the tools' calculations are deterministic and currently precomputed: model choice controls inspection and story eligibility, not external research. |
| Coordination/orchestration | Validated arguments, inspected-story gating, request/tool/time/token limits, cancellation, correction of rejected calls, compact trace and deterministic recovery. | Good bounded single-agent orchestration. No multi-agent collaboration, MCP integration or persistent cross-interval hypothesis memory. Those are gaps in breadth, not reasons to invent extra agents before release. |
| Improvement over existing approaches | Batch 8 compares rules, ranking, one-pass prose and the investigator on identical source packets per pair. | This is the most important weak point. The saved six-pair live panel does not establish superiority: investigator accepted 3/6 model outputs with 3 local fallbacks, versus ranking 6/6; component medians were about 5.05 seconds and 1.58 seconds respectively. These are historical observations before targeted repairs, not final-build success rates. Subsequent checks were targeted, not a full rerun. Do not label the investigator better, faster or cheaper. A small final-build paired replay, with all outcomes retained and actual human usefulness judgments, would strengthen the case if time permits. |

### Practical impact: every judging prompt mapped

| Review lens | Where Touchline addresses it | Assessment and useful improvement |
|---|---|---|
| Importance of the task | The catch-up workspace answers what changed in minutes the fan missed; player focus prioritizes personal interest; glossary reduces vocabulary friction. | Concrete and easy to explain. Prefer this focused problem to a claim that the product solves all broadcast analysis. The owner's feedback identified real comprehension friction and led to repairs; it is not a demand study. |
| Deployment plausibility | A working Node/web app, Azure deployment runbook, private keys, public-release packaging tools, resource controls, cached results and local fallback. | A deployable prototype exists. Single-process concurrency, memory-only uploads, free-host quotas and shared allowances limit scale. Judge-period availability and fresh hosted requests must be verified after deploying the final version. Production would need load-tested infrastructure, durable operational state, observability and appropriately licensed data. |
| Value for users/businesses/developers | Fans can navigate and inspect a missed interval. Developers can reproduce synthetic cases and integrate the canonical package format. A broadcaster could potentially reuse the structured story/evidence objects. | Fan workflow is implemented; broadcaster/editor/overlay integration and commercial adoption are potential applications. Do not claim customers, savings, conversion or broadcaster readiness without measurements. Show time-to-understanding in the demo rather than a speculative market-size slide. |

### Experience and presentation: every judging prompt mapped

| Review lens | Where Touchline addresses it | Assessment and useful improvement |
|---|---|---|
| Intuitive use | Prepared substitution example, replay controls, minute inputs, Quick/Tactical, team/player selection, glossary and source disclosures. Batch 9 clarified denominators, pending comparisons, action names and future-interval recovery. | Better and accepted by the owner. First-time comprehension has not been independently measured. A new visitor should be able to reach one useful takeaway with the prepared example and one explanation request, without opening technical settings or reading this report. |
| Video communicates value | Existing narrated video and revised-cut plan; final recording remains Batch 11. | The old video is not evidence of the final investigator/UI. Record the final release doing a useful task: missed spell → short takeaway → supporting source → meaningful focus/style change. Include one brief actual tool trace and an honest limitation. Keep most time on the product, not rubric labels. |
| Frontend/backend balance | Interactive replay, roster/pitch, commentary modes and sources are supported by validation, football tools, investigation and composition. | Strong balance for a prototype. Demonstrate one input reaching one visible output and source; do not spend the video listing backend modules. |

### Category strategy

My reading is that the rubric rewards depth of appropriate agent design; it does not require us to implement every named technology or multiple agents.

The Foundry category remains the most defensible target. We can show actual hosted inference, function calling, bounded evidence inspection and recoverable delivery. The distinctive engineering is the controlled investigation around a fan task; not all of it is a unique Foundry service feature.

An enterprise-readiness claim would be weaker: no organization-level controls, durable multi-user service or production validation. A cloud-integration claim would be modest: App Service plus inference is real, but not a broad event-driven Azure architecture. The multi-agent category does not fit this one-agent implementation. More services or agents would not, by themselves, improve the fan outcome.

### Challenge pipeline coverage

This is a product coverage assessment, not an additional scored rubric.

| Stage / theme | What is present | Boundary |
|---|---|---|
| Receive match events | Canonical synthetic package and revealed replay prefix | Completed-match replay, not a connected live provider or video event detector |
| Interpret | Counts, exposure, matched comparisons, complete possessions, supplied history and shot-value aggregation | No off-ball pressure model or causal effect estimator |
| Explain | Connected source-owned narratives with facts, interpretation and limits | Does not freely answer arbitrary football questions |
| Present beside play | Browser pitch, score, statistics and catch-up workspace | No actual television-feed overlay or editor workflow |
| Personalize | Depth, team/player focus and translated glossary | No persistent profile; full commentary stays English |
| Identity, passing and movement | Named synthetic actors, completion and progression | No measured speed, distance or calibrated pass difficulty |
| Languages | English interface/commentary plus English and six other glossary options | Vocabulary assistance is narrower than multilingual storytelling |

## 2. Brainstorm reconciliation

The old `IDEAS.md` and `COVERAGE_REVIEW.md` are historical snapshots. This table supersedes their current-status claims for the reviewed build. Each original ID is accounted for; an implemented path is still bounded by available evidence.

### User ideas U01–U33

| ID | Current state | What remains |
|---|---|---|
| U01 substitution effect | Partial: role history, involvement, fair windows, concurrent changes and caveats | No causal proof that the change improved the team |
| U02 repeated goalkeeper errors | Deferred | Comparable historical errors and opportunities |
| U03 red-card impact | Partial: protected incident coverage, personnel and discipline context | Dedicated man-down performance comparison |
| U04 yellow-card effect | Partial: cards/denominators and narrow diagnostic stories | Evidence of changed behavior or deliberate opponent targeting |
| U05 recruitment/management | Deferred | Multi-match squad, transfer and availability evidence |
| U06 next events | Partial: what-to-watch question | Validated forecasting and persistent monitoring |
| U07 longer-term consequences | Deferred | Standings, fixtures and availability context |
| U08 manager/system fit | Partial: declared manager/shape context | Historical tactics and suitability evidence |
| U09 translated names/terms | Narrow implementation | Broader names, regional variants and search |
| U10 English with other-language help | Implemented for curated glossary | Full translated commentary is absent |
| U11 unusual results/upsets | Deferred analysis | An explicit expectation/strength baseline |
| U12 player style/recent discipline | Partial current-match evidence | Historical rates, roles, opportunities and context |
| U13 position familiarity | Implemented narrowly at substitution | Career-wide role modeling and ability inference |
| U14 rare formations | Partial: declared change/control | Historical rarity and observed in/out-of-possession shapes |
| U15 unfamiliar XI | Starting/current XI present | Historical lineups and shared minutes |
| U16 result versus fan expectations | Recap present | Capture the expectation and compare it explicitly |
| U17 bench/injuries/history | Bench, manager labels and role history present | Injuries, team form, prior opponents and manager history |
| U18 value beyond generic chat | Concrete workflow distinction | No measured advantage over an equal-input chatbot |
| U19 hands-on onboarding | Quick guide, prepared example, revised guidance | Keep the first useful path shorter than the written manual |
| U20 missed-interval selection | Implemented with revealed-time limits | Added-time/extra-time inputs unsupported |
| U21 squads and roles | Implemented for declared starting/current personnel | Tracked movement is absent |
| U22 input explanation | Documented JSON, example, validation, provenance | Further simplify first-time import messaging if needed |
| U23 CSV/other formats | Deferred | Explicit adapters and provider contracts |
| U24 fan preferences | Team/player/depth focus present | Saved profiles, leaning strength and rivalry graph |
| U25 official rules | Narrow attributed reference and incident separation | Comprehensive edition/competition coverage |
| U26 shot quality | Implemented for supplied/illustrative pre-shot values, provenance, aggregation, goal links and visual | No trained/calibrated xG model or verified provider feed |
| U27 penalties/keepers | Deferred | Attempts, direction, outcomes, samples and shootout separation |
| U28 richer investigation | Implemented: one bounded model-selected tool loop | Persistent hypotheses, external retrieval and proven incremental benefit |
| U29 detailed user instructions | Implemented in guide and this report | Keep release instructions synchronized with actual controls |
| U30 judging-focused demonstration | Final script/recording still Batch 11 | Record the frozen release and replace old links |
| U31 unusual human incidents | Supplied reports, availability and corrections supported | No video detection or emotion/motive inference |
| U32 standard statistics/bars | Implemented for supported events; shot-value view separately present | Advanced tracking metrics absent |
| U33 whole match | Two 45-minute halves | Added time, extra time and shootouts absent |

### Additional ideas A01–A24

| IDs | State and next boundary |
|---|---|
| A01 catch-up; A02 patterns | Implemented catch-up; bounded progression/comparison analysis, not general tactical understanding |
| A03 possession versus threat; A09 creation/finishing/keeping | Partial, strengthened by Batch 4 shot values; goalkeeping/finishing ability remains unmodeled |
| A04 matchups; A05 pressing; A06 off-ball space | Matchup diagnostic only; pressure/tracking-based analysis deferred |
| A07 fatigue/lead protection; A08 set pieces | No reliable fatigue inference or routine model |
| A10 similar opponents | Deferred historical similarity and adjustment |
| A11 revisit hypotheses | Static viewing prompts only; no persistent update loop |
| A12 evidence/alternatives; A21 uncertainty; A22 missing inputs | Implemented narrowly through inspected sources, missing states, conflicting signals, correction handling and limits; no universal semantic verifier or calibrated confidence |
| A13 depth/frequency; A14 preferences | Depth and focus implemented; no autonomous editorial alert policy or durable profiles |
| A15 voice; A16 language utilities | No in-app speech; curated translations only, no saved vocabulary/bilingual search |
| A17 broadcast/editor workflow | Structured objects exist internally; editor approval/export/overlay timing absent |
| A18 alternative continuations | Generator exists; no validated counterfactual experiments |
| A19 continuity; A20 workload | Current squad and narrow history only; no shared-minute/rest/fatigue model |
| A23 upload lifecycle | Replacement, removal, expiry and reload implemented; limits remain fixed and storage temporary |
| A24 more journeys | Catch-up, focus, glossary, reports and full-time recap present; broad pre-match and adaptive live journeys deferred |

The highest-value brainstorm items for this release are U01/U13/U18/U20/U26/U28 and A12/A14/A21: contextual catch-up with inspectable evidence. Completing every brainstorming idea would create a much larger, less coherent product.

## 3. Improvements before and after the freeze

### Release-essential checks/fixes

| Priority | Action | Acceptance evidence |
|---|---|---|
| 1 | Reconcile scope, architecture, README, testing instructions, submission description and brainstorm status with the reviewed code | No current document says investigation or shot-value support is absent; no public claim implies tracking, calibrated xG, causal attribution or a fan study. Historical reports remain clearly dated. |
| 2 | Tie every public artifact to one release | Exact source revision or manifest, clean release archive, same hosted build, testing guide, screenshots and final video. A package version alone is insufficient because multiple revisions currently share 0.5.0. |
| 3 | Finish final CI, package and hosted checks | Tests run from clean source; fresh hosted investigator request, cache, fallback, upload, focus/style, glossary, source links and mobile checks all verified. Private files remain excluded. |
| 4 | Check judge-period access and budgets | Free access, no required account/payment, usable inference allowance and fallback, actual proxy/concurrency behavior and persistent usage state verified. Existing limits protect credit but can also restrict judging; resolve this operational tension explicitly. |
| 5 | Resolve the half-time period convention | Generator marks the half-time event at 2700 seconds as period 2 because period derives from time. Choose/document the intended boundary convention and test the half-time marker versus second-half kickoff. Current code does distinguish the events, but the period label is ambiguous. Keep event identities/provenance changes explicit if repaired. |
| 6 | First-use acceptance | Fresh page → prepared example → one short understandable takeaway → optional source. No need to choose a model approach, upload data or understand denominators before the first result. Recheck after any onboarding change. |

These are bounded completion tasks. They do not authorize public release during this audit. The owner has asked to inspect the final plan first.

### Useful small improvements, subject to remaining time

1. **Make Quick the recommended first read.** The current prepared example selects Tactical. A default concise example or a clear “start with Quick” cue would better serve newcomers. Preserve Tactical as an explicit deeper option. Do not switch styles silently after the user chooses.
2. **Keep the answer above the mechanism.** Make takeaway → reason → one essential limitation the default reading order. Trace, numerical denominators, provenance and technical preparation stay available below. Further copy tightening is preferable to adding another panel.
3. **Explain how to complete a pending comparison.** The interval end, not only replay position, must include enough post-entry play. A specific suggested later interval would be useful, provided it never reveals future events or auto-runs a paid request. The current latest/replay-end recovery solves invalid time, not every incomplete-analysis case.
4. **Show the practical value of AI.** Retain one real investigation where a follow-up changes the available explanation. For a quantitative claim, run final-build paired comparisons and report latency, failures and human relevance separately. A tool trace proves execution, not benefit.
5. **Simplify pitch language.** “Team shape” or “Formation” is clearer to a casual fan than “declared team positions.” Keep a short “not live tracking” cue and an event-location legend. A later toggle could separate team shape from event action more clearly.
6. **A very short in-app orientation.** “Try an example → read the takeaway → open sources if curious.” Keep advanced controls closed. A long guide should be optional support, never a prerequisite.

### Defer rather than rush

Continuous player animation, live provider ingestion, a full added-time clock/schema, extra time/shootouts, injury/manager/recruitment databases, predictions, persistent hypotheses, full multilingual narration, voice, broadcaster tooling, multiple agents and a broad frontend rewrite. Each needs evidence and acceptance checks beyond a cosmetic addition.

## 4. Selling points and innovation

### The main pitch

**Touchline helps you return to the match story: choose the minutes you missed, see what changed, and check the evidence behind the explanation.**

This is a defensible product promise. The implementation adds supplied context to event summaries, but only where the record supports it.

| Specialty | Concrete demonstration | Why it could stand out | Claim boundary |
|---|---|---|---|
| An explanation attached to the exact missed spell | Replay minute 66; select 55–66; inspect a claim and its sources | The fan does not assemble a prompt or manually paste statistics/history | No claim that other submissions lack this workflow |
| Context beyond totals | Follow Ellis, inspect his assigned right-wing role and the supplied 20 of 305 past minutes; contrast Duarte's history | Shows a specific question about a substitution rather than generic score narration | Familiarity is not ability and neither proves the substitution helped |
| Evidence-directed AI with visible bounds | Expand an actual investigation: selected tools, results, follow-up and finish | Judges can inspect what the model did and what it was allowed to use | One bounded agent; tools are read-only and underlying calculations precomputed |
| Honest treatment of uncertainty | Incomplete interval, conflicting passing/shooting signals, missing history or corrected report | Refusing an attractive but unsupported story is valuable in a sports explanation product | Not a comprehensive truth verifier; semantic errors remain possible |
| Personalized depth without changing facts | Quick versus Tactical, both sides versus a team/player | One record serves a returning casual fan and a detail-seeking viewer | Not learned personalization, full translation or persistent fan memory |
| Accessible vocabulary and coherent navigation | Click a highlighted term, change glossary language, follow a lineup player back to commentary | Reduces friction around football vocabulary and identity | Small curated glossary, English commentary |
| Reproducible evidence package and graceful recovery | Download/reload the synthetic package; reproduce a correction or missing-window case; use the local recap | Reliability and inspectability are part of the product, not only a slide | Memory-only upload lifecycle and prototype hosting limits remain |

### What we can honestly call innovative

The innovation is the combination and application: a fan-oriented replay workflow, time-aware contextual tools, model-directed evidence inspection and source-owned delivery. It is a product/engineering contribution rather than a new foundation model, tracking algorithm or causal football theory. It may be distinctive; we have not surveyed competing submissions or established world-first novelty.

The simplest strong demo is one complete explanation with a source and a useful mode/focus change. The strongest technical proof is a real, compact investigation trace. The strongest credibility proof is retaining failures and showing what the record cannot establish. Use all three without turning the product into an engineering dashboard.

Avoid claims such as “understands every tactical decision,” “proves the manager improved the team,” “accurate real-time tracking,” “professional xG,” “multilingual commentator,” “production-ready,” or “outperforms ChatGPT.” None is established by the current evidence.

## 5. Detailed hands-on user guide

### Your first useful result

1. Open the local review at **http://127.0.0.1:8769/** on this computer. Refresh. The final public link will be checked in Batch 10; the existing hosted demo is older.
2. Select **Try the substitution example**. This loads the fictional built-in match, moves the replay to about minute 66, sets the interval to **55–66**, selects **Ellis**, and currently chooses **Tactical detail**. It prepares the example; it does not automatically request online commentary.
3. For your first read, choose **Quick catch-up**. Keep the prepared interval and player focus.
4. Select **Explain what changed**. Playback pauses during the request. Wait for the result before changing your choices.
5. Read the headline and first takeaway. Ask: what happened, what evidence helps explain it, and what remains uncertain? The exact selected stories can vary. The current 55–66 example includes enough time for the narrow five-minute post-entry window; 55–65 may not.
6. If you want the numbers, choose **Tactical detail**, then select **Explain what changed** again. Changing the selector alone does not rewrite the existing result. A notice identifies output from earlier choices.

Success means you can explain the main point in your own words. You should not need to open a trace or understand JSON to use the product.

### Move around the match

- **Play** advances through synthetic events; **Pause** stops it. Replay speed controls how quickly events advance, not a calibrated real-time broadcast clock.
- **Next event** advances one record. **Next key moment** jumps to a selected important event such as a goal, card, substitution, formation change or half/full-time.
- Drag the **slider below the pitch** to move backward or forward. Score, statistics, lineup and available reports follow that replay state.
- **Teams & lineups** opens squad details; return to the match view to continue the replay/catch-up journey.
- Rewinding can hide a later substitution or correction. This is intentional: Touchline should not use future evidence in an earlier replay state.

### Choose the spell you missed

1. Look at the current replay minute.
2. Set **From minute** and **To minute** using whole numbers. The start must precede the end; both must fit the revealed match.
3. Use recent-interval buttons for the last five/ten minutes or since half-time. Previous/next interval moves the selected range when revealed time permits.
4. At replay minute 66, **55–80** is unavailable because minute 80 has not happened in this replay. Select **End at current replay minute (66)** to keep the start at 55 and change the end to 66. **Use latest 5 minutes** instead chooses approximately 61–66.
5. To examine 70–80, move the replay beyond minute 80 first, then select 70–80. Do not expect Touchline to reveal future play simply because a complete source package exists.
6. Select **Explain what changed** once your interval/focus/style are ready.

A valid interval can still be insufficient for a comparison. For example, a player entering at 60:40 needs the selected end to include 65:40 for the current five-minute after-entry comparison. Whole-minute 65 cuts that short; 66 includes it, if the replay has revealed it. This is different from a network failure or missing history.

### Quick, Tactical, team and player

| Control | Use it for | What it does not mean |
|---|---|---|
| Quick catch-up | The main takeaway with fewer figures | Different underlying facts |
| Tactical detail | More counts, role history, fair-window context and limits | Complete tactical understanding from tracking |
| Both sides / a team | Prioritize the match or your selected side | Hide a major opposing incident or alter numbers |
| Player focus | Follow a named squad member's supported involvement/context | Infer unseen movement or guarantee a flattering story |

Player focus takes priority when both team and player are selected. Important goals/dismissals remain protected. To compare Quick and Tactical fairly, keep the same interval and focus, regenerate each, and look for a difference in explanation depth rather than a different match result.

### Understand the role-history numbers

In Ellis's supplied fictional history, **305** is his total recorded minutes across five earlier match records. **20** is the part of that total played at right wing. It is not 305 minutes in this match, not a score out of 305, and not a claim about his entire career. Duarte's contrasting sample records 305 of 305 minutes in that role.

Those records can establish what the supplied history contains. They cannot establish that Ellis is bad at right wing, Duarte will play better, or either substitution caused an improvement. Current-match evidence and other concurrent changes must be considered separately. Quick omits these history figures; Tactical retains and explains them.

### Check a statement's source

1. Under the takeaway, open **Why this explanation?**.
2. Read the source statements first. They explain the calculated observations in words.
3. Open **Underlying records** if you want event times, history references or report details. Some calculated sources include records outside the chosen interval, such as an explicitly scoped before-entry window.
4. **Recorded facts** describe the supplied record. **Reading of the play** is an interpretation. **What we cannot conclude** identifies an important limit or alternative.
5. Use **Explore the play behind this explanation** for more detailed sequences, history and comparisons. **Coverage & limitations** describes broader input/method boundaries.
6. **How this was prepared**, **Evidence investigation** and checked-claim records are optional deeper inspection. They explain the mechanism and tool outcomes; you do not need them for the first read.

An event/history ID enables traceability; it is not independent confirmation that the synthetic source represents real football. Checked structured claims validate supported fields and bindings, not every possible interpretation in natural language.

### Follow a player from the pitch or lineup

1. Open **Teams & lineups**, or click a numbered player marker on the pitch.
2. Open the player's details. Distinguish usual position, assigned role, bench status and current personnel.
3. Choose **Follow this player in commentary**. Touchline returns to the commentary workspace with that focus selected.
4. Confirm the interval and select **Explain what changed**. The follow action prepares your choice; it does not make every displayed earlier explanation current.
5. Select **No individual player** to return to broader team/match commentary.

The numbered pitch markers are declared formation slots. Green and blue distinguish the teams; the white marker shows the latest event location. Players do not move continuously with the ball. Turn off **Show declared team positions** for an event-only view.

### Learn a term in another language

1. Under **Glossary language**, keep English or choose Chinese, Spanish, French, German, Portuguese or Japanese.
2. Click a highlighted/underlined supported football term or player name.
3. Read its curated definition/translation in the popup; close it or press Escape.
4. Change language and open the term again to compare.

The choice changes glossary definitions and tooltips. The interface and main commentary remain English. The glossary is curated and limited, not an automatic translation service for every word.

### Use the simpler event recap or recover from an error

- **Show event recap** or **Show the events in this interval** gives the recorded events for your selected spell without online model selection.
- **Explain my current selection** requests commentary for the interval, style and focus now selected. Use it after changing those choices.
- A **Local explanation** label means deterministic local delivery was used; it should not be counted as successful online model reasoning. Replay and supported calculations remain useful.
- If the connection fails, retry deliberately or use the event recap. Do not keep clicking while a request is pending.
- If your selection changes during a request, the old response is discarded. Generate for the current selection.
- A quiet spell can legitimately have little to explain. Missing reports do not imply that Touchline has exhaustive real-world incident knowledge.

### Load another synthetic match

1. Open **Match data & demo settings**.
2. Start with **Load example package** or download the current/example package to learn the format.
3. Upload a JSON file following Touchline's v1 contract. It needs a synthetic flag, metadata/provenance, both squads, linked actors and chronological events for a completed 90-minute match. Optional history, reports and shot values need their documented schemas.
4. Read validation errors and fix the named field/event. Invalid input should preserve the currently valid match.
5. Advance the newly loaded replay and choose your interval again. The built-in substitution example is hidden while an upload is active so it cannot unexpectedly replace your data.
6. Remove the upload to return to the built-in experience. If its server copy expires, use the reload control; the local replay/recap can remain available meanwhile.

Current prototype bounds: 2 MB, 12,000 core events, 200 reports and 1,000 history records; up to eight in-memory uploaded packages, one-hour expiry. Restart clears server-held uploads. Uploads go to the backend; selected online commentary evidence goes to Foundry. This is not a private offline file viewer. CSV, video and arbitrary provider files are unsupported.

### Inspect reports/corrections and shot quality

For reports, load the example package and move through minutes 32, 33 and 34. Distinguish when an incident happened from when its report became available and was corrected. An annotation is a report, not an automatic official ruling; the linked rule reference is separate explanatory material.

For shot values, choose a revealed interval with shots and open **Explore the play behind this explanation**. The chance-quality view shows shot coverage, source group, available values, time plot and shot/goal links. Green circles and blue squares distinguish teams; an outlined marker indicates a linked goal. Open **Shot values, links and source method** for rows and provenance. Different sources remain separate; missing values are not zero. Built-in values are illustrative simulator probabilities, not calibrated professional xG.

At full time, set a closing interval or 0–90 as appropriate. A closing-spell summary is not automatically a whole-match account. The full-time takeaway replaces a next-play viewing prompt.

## 6. Half-time, added time and the pitch

### What is implemented now

| Question | Verified behavior | Consequence |
|---|---|---|
| Two halves? | Yes: first and second half cover 0–2700 and 2700–5400 match seconds; there is a half-time event and second-half kickoff | The generator distinguishes halves |
| A real half-time break? | No separate 15-minute wall-clock interval or long pause | Replay advances to the next event at its selected playback cadence; the clock does not add 15 minutes |
| Half-time tactics? | Odd seeds include an authored declared shape change at the second-half boundary; even seeds retain shape as a control | This is authored synthetic context, not tactical inference |
| Added/stoppage time? | No 45+ or 90+ periods; full time is exactly 5400 seconds | No claim to model realistic stoppage allocation |
| Ordinary stoppages? | Fouls, restarts and other events can use time within the halves | Ordinary dead-ball time is different from added time after a half |
| Extra time/shootout? | Unsupported | Canonical input is a completed 90-minute match |
| Half-time metadata? | Half-time, second kickoff and authored tactical change share 2700; the current generic period formula labels all as period 2 | The marker's period convention should be made explicit or repaired before freeze |
| End changes at half-time? | The spatial contract uses declared attack direction; the renderer is a schematic, not an end-switching tracking feed | Do not present it as a physically complete broadcast simulation |

For real football, [IFAB Law 7](https://www.theifab.com/laws/latest/the-duration-of-the-match/) separates the two 45-minute periods, a half-time interval of at most 15 minutes (set by competition rules), and allowance for time lost in each half. Touchline simplifies those timing rules rather than fully implementing them.

A half-time pause banner/continue action could improve orientation, but making users wait 15 minutes would harm a replay demo. Added time would require period-aware timestamps, clock labels, input validation, comparisons, availability logic and tests; changing the final limit from 5400 to a larger number is insufficient. Defer that schema expansion for this submission and disclose the simplified timeline.

### Formation or real-time player positions?

For the current inputs, **formation plus the recorded event location is the better default**. It provides useful orientation without pretending to observe all players. Genuine tracking would be valuable for pressing, spacing, runs and overloads, but event endpoints cannot establish the other 21 players' simultaneous positions.

Fabricating fluid movement from those endpoints would look richer while weakening the evidence story. If simulated movement is added later, label it simulated and never use it as independent support for tactical conclusions. If actual tracking becomes available, add a separate clearly named live-position mode with timestamp/coverage/quality indicators. Keep a formation view for newcomers because a stable schematic is easier to read than 22 moving dots.

A future three-view design could offer **Formation**, **Event action** and **Tracked positions**. Only the first two have a basis in today's product. Before release, clearer labels and a concise legend have more value than decorative animation.

## 7. Release recommendation

Close Batch 9 with owner acceptance. Before publication, reconcile the current product documents, resolve the half-time boundary convention, freeze one identifiable candidate and run the Batch 10 packaging/hosted/access checks. Prefer a concise first-use journey and truthful technical demonstration over broad new features. Batch 11 should record that exact release and align the video, README and Microsoft project page.

### Evidence inspected

- `full-match.js`, `match-package.js`, `pitch-ui.js`, `viewer-ui.js`, `product-ui.js`, `fan-ui.js`, `usability-ui.js`, `app.js`, `chance-quality-ui.js`.
- [Investigator design](BOUNDED_INVESTIGATOR.md), [chance-quality contract](CHANCE_QUALITY.md), [input contract](MATCH_PACKAGE.md), [data provenance](DATA_PROVENANCE.md).
- [Batch 8 results](BATCH_8.md), [comparative method](COMPARATIVE_EVALUATION.md), [Batch 9 feedback and repairs](BATCH_9_RESULTS.md), [browser check record](batch-9-browser-check.json).
- Historical [idea inventory](IDEAS.md), [earlier coverage review](COVERAGE_REVIEW.md), scope, README, submission/testing materials and deployment runbook.

No live model requests or public infrastructure changes were needed for this assessment. Earlier test/model results are cited as recorded evidence; this audit did not rerun the full suite or establish post-release availability.
