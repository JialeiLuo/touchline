# Full-match timeline v0.3

Original seeded simulator in full-match.js. No external simulator, real-match data or model call generates these events. Two 45-minute halves; no added time.

## Identity and randomness
Names, managers, roles and feet are manually authored AI-generated placeholders in data/squads.json. Shirt numbers are sequential, not sampled. The simulator reads the starting XI and bench from these records. A Mulberry32-style uint32 pseudorandom generator supplies event choices. Same seed, source metadata and generator version reproduce the same match. Versions change the seeded sequence; current event IDs include v03 to distinguish it. Download provenance documents the algorithm and assumptions.

## Role-aware sampling
Keepers do not participate in the simplified outfield possession chains; they are named actors for saves. Passes cannot target their actor. Build-up selection weights CB/LB/RB/DM three times other roles. Midfield selection weights CM/DM/LW/RW three times others. Advanced selection weights ST/LW/RW four, CM two, others one. These are arbitrary development assumptions, not measured tendencies. All selected players must be active. Incoming substitutes inherit the outgoing declared match role, independently of their usual position.

Goal probability given a generated shot is 0.04 + 0.22 × clamp((attacking progress − 35)/65, 0, 1). This illustrative rule is not xG; it omits angle, pressure, player quality and shot type. Saves are assigned to the opponent's active declared goalkeeper. Dismissed and substituted players leave later active play.

## Statistics
Calculated from revealed events only. Possession uses pass/carry controlled durations, excluding stoppages and without double-counting possession_end totals. On-target shots are goals/saved attempts. Second-yellow dismissals count two yellows and one red.

## Remaining limitations
No calibrated team strengths, tactical movement, realistic all-player positions, goalkeeper distribution, full restart laws, offside, direct red-card model or injury events. Teams alternate simplified possessions. A declared role does not prove actual positioning. A complete timeline is not evidence of football realism.

## Verification
Run tests/full-match.cjs and tests/squads.cjs. Sixty seeds check identities, eligible actors/recipients, keeper saves, no self-passes, timing, score/shot consistency, possession accounting and rewind boundaries. tools/audit-matches.cjs writes docs/simulator-audit.json with distributions for seeds 0–59; it is descriptive, not a comparison with real football.

## Declared tactical-change scenario
Odd seeds contain an authored Northbridge instruction at half-time: 4-3-3 to 4-2-3-1. Morgan takes a DM slot and Mason an AM slot, with explicit schematic assignments for the attacking line. Assignments update the sampling roles; they do not implement a tactical engine or establish a performance benefit. Dismissed players are not brought back into the shape. Even seeds retain 4-3-3; this is an absence-of-change control, not a matched causal experiment.

Lineups use only revealed tactical records. Starting XI keeps original kickoff slots separately from current lineup. The catch-up builder compares 40–45 and 45–50 match-minute windows only after the selected interval reaches 50. Shots and completed passes are descriptive, with source-event references and alternative explanations. Comparison references may include events preceding the requested interval, explicitly labelled by the comparison window. No duration or player movement is inferred from video.

Run tests/tactics.cjs for timing, rewind, role assignments, comparison boundaries and unchanged-shape controls.
