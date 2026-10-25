# Milestone 2 product and evaluation pass

## Automated evaluation

`node tools/evaluate-product.cjs` evaluates 288 deterministic combinations: 12 seeds × four intervals × two commentary styles × three team focuses. Every combination must return supported nonempty stories within its paragraph budget; retain all supplied goals/dismissals; resolve source IDs; exclude later event sources; and represent available team focus when no mandatory incident occupies the response. Full rows are in product-evaluation.json. This is a contract evaluation, not a model reasoning or fan-usefulness score.

`node tools/evaluate-context.cjs` separately holds match events fixed while changing role history: limited, experienced, absent, late and zero-minute. Counts-only correctly cannot answer role familiarity. This establishes the contribution of supplied context, not superiority to an LLM given the same input.

`npm test` runs 19 test files. New product regression checks retain crowded essential incidents and classify rate-limit, service, HTTP, timeout and empty-response fallback paths. Existing coverage includes simulation, eligibility, chronology, comparisons, packages/corrections, focus, sources and public boundaries.

## Fresh live ranking samples

`node --env-file=.env tools/evaluate-ranking.cjs --live` makes eight explicit model calls, four seed-7 intervals sampled twice, with no application cache or retries. Every outcome, timing, tokens and fallback status is retained in ranking-evaluation.json. All eight samples were accepted in this run; observed latencies ranged from 0.896 to 3.839 seconds. This small fixed sample does not establish a population reliability rate. Earlier failed prose and deployment samples remain documented rather than being erased.

These samples were collected before two cosmetic catalogue fixes (a repeated period and singular 'shot') the full-time takeaway change and expanded overview evidence wording. Candidate/source checks were rerun after those edits. The model only ranks IDs; acceptance establishes valid selection, not fan usefulness.

## Editorial usefulness inspection — by the coding assistant

This is self-review, not an independent or blinded review, and no fans participated. The review asks whether a story answers the selected interval, adds information beyond raw totals where available, uses an appropriate evidence window, avoids unmeasured tactical/causal claims and gives a relevant follow-up.

| Situation | Useful content observed | Limit / decision |
|---|---|---|
| Quiet opening two minutes | Complete possessions stayed short of the attacking third; score and shots establish the quiet context. | Low information is expected. Do not invent a tactical drama; overview is modestly useful. |
| 40–50 minute tactical spell | Declared shape change, more completed passes but fewer attempts, plus progression context. | Describes the tension rather than attributing it to formation. Fixed duplicate punctuation. |
| 55–66 minute player focus | Ellis's supplied 20/305 role minutes connect the inherited wing role to prior experience, with a matched involvement window. | Useful context absent from current match totals; does not establish ability or substitution success. |
| Goal interval | Scorer, changed score and attempts stay prominent. | Mostly recap value; added complexity would be unsupported. Fixed singular 'shot'. |
| Full-match recap | Essential incidents stay included even in Quick output. | 'Watch next' is inappropriate at full time; changed to a replay takeaway. |

The catalogue still limits the range of questions Touchline can answer. Role history is a narrow authored sample; possession endpoints are not player tracking; shot counts are not xG. These limits remain in the scope freeze and evidence disclosures.

## Browser journeys

Checked through the browser against the local 0.5 code, then smoke-checked after public deployment:

- Kickoff: main request disabled with an explanation until a valid interval exists; prepared example requires no manual clock setup.
- Prepared example → Tactical player commentary → supporting sources; local event recap is a separate disclosure.
- Interval change flags the old result; future interval disables the main request. Playback pauses for request consistency; changed selections cannot silently take a stale response. This was exercised by editing the start minute during a pending request, which discarded the response.
- Teams & lineups → Ellis details → Follow this player returns to the commentary workspace; 22 current player markers at the tested time.
- Actual JSON file chooser upload accepted the supplied match; invalid JSON package was rejected without replacing the loaded match.
- Incident visible as reported after minute 33, then corrected after minute 34, with the prior report superseded and official rule wording separated from the reported facts.
- 390-pixel viewport: page scroll width equalled viewport width; main controls remained usable. No exhaustive device/browser accessibility audit is claimed.
- The recap disclosure initially failed to open in a browser journey; its handler was fixed and the visible report was rechecked.

Browser screenshots and the public release acceptance result accompany the release. Public hosting retains the milestone 1 protections. No fan study, independent second physical device or production-scale load test was performed.
