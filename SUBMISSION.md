# Touchline — Your AI Co-commentator

**Pitch:** Return to the football story, not just the score. Touchline turns a selected interval of synthetic match events into evidence-backed commentary, with player context, team focus and translated football vocabulary.

**Working demo:** https://touchline-fan-20261025-b4bpgfdxbyarhyh5.germanywestcentral-01.azurewebsites.net/

**Demo video (1:48, English narration and captions):** https://youtu.be/9JvQMpAhdpA

**Source:** https://github.com/JialeiLuo/touchline

**Suggested category:** Best Use of Microsoft Foundry Project. Touchline uses Foundry for bounded story ranking; it is not a multi-agent system.

## The problem and experience

A fan who misses ten minutes needs to know what changed and what to follow, rather than read a list of possession and shot totals. Fans watching across languages also need help connecting football terms and player names with the vocabulary they know.

Touchline replays a fictional 90-minute match. Choose a revealed interval, Quick or Tactical commentary, and optional team/player focus. The explanation connects supplied role history, matched before/after windows and recorded attacking progression. Expand each story to inspect its sources. A six-language glossary explains highlighted vocabulary while the main interface stays English.

The prepared substitution example follows Ellis, whose usual position is striker but whose declared substitute role is right wing. The supplied history records only 20 of 305 previous minutes there; Duarte supplies a contrasting experienced-role case. This makes the context behind a substitution inspectable without claiming the substitution caused later events.

## Microsoft technology and pipeline

Microsoft Foundry hosts the gpt-5-mini deployment. A private Node server validates the selected match prefix, calculates evidence, builds scoped story candidates and asks Foundry to rank their IDs. The server applies player/team focus and mandatory goal/dismissal coverage, then renders source-owned wording. Azure App Service Free F1 hosts the public HTTPS demo. Keys remain server-side.

Ingest → calculate and retrieve supplied context → rank supported stories → render commentary and evidence → personalize style, team/player focus and glossary language. Calls are cached and bounded; local commentary remains available if online selection fails or the allowance is exhausted.

## Evidence and limitations

19 test files pass; a 288-combination deterministic matrix checks source resolution, time boundaries, focus and essential-event coverage. Five controlled historical-context variants hold match events fixed. Eight fresh live ranking samples were accepted in the recorded run. These checks do not establish fan usefulness or population reliability; the usefulness review is assistant editorial inspection.

The simulator, authored names/history, seeds, schema and limits are documented. No real match footage or live feed is used. This prototype does not infer off-ball tactics, causal effects, xG, injuries, manager ability or transfer quality. Investigation tools run deterministically; Foundry selects supported stories, rather than autonomously choosing tools or writing unrestricted claims.

See TESTING_INSTRUCTIONS.md, docs/FINAL_SCOPE.md and docs/PRODUCT_EVALUATION.md. Demo video details are maintained in submission/VIDEO.md.
