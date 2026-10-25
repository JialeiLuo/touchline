# Fictional squads and replay lineups

Source of truth: data/squads.json. Run `node tools/sync-squads.cjs` after edits and commit both JSON and JS mirror. All metadata is manually authored and fictional, available at kickoff. No external team/player data is used.

Each team has 11 starters and four bench players, a fictional manager and declared 4-3-3. Players have stable simulator IDs, shirt numbers, usual positions, preferred feet, and starter slots. Coordinates illustrate declared positions and are not tracking observations. Full-match exports include the metadata; adding metadata does not change the seeded event sequence.

squads.js builds state from the event prefix: bookings accumulate, dismissed players leave the current pitch, incoming substitutes occupy the outgoing declared slot, outgoing players remain listed with status. Rewinding reconstructs the earlier state. Starting XI is a kickoff selection with incident badges explicitly labelled as current. The Next lineup change button advances the shared replay clock. Player role mismatch is authored context, not a measured tactical effect.

No injury, prior suspension, manager preference/history, physical attributes or historical form is claimed. For substitutions inside a requested AI interval, relevant authored role, manager and declared-formation context is added as a cited fact. No future substitution context is included. Simulator 0.3 reads identities from these records, uses role-weighted outfield selection and named goalkeeper saves. It still does not infer formations after dismissals or simulate goalkeeper distribution.

`node tests/squads.cjs` checks 60 seeds for kickoff size, metadata identity linkage, substitution/dismissal timing, rewind, exports and JSON mirror consistency.

Explicit tactical_change records now update current_formation and declared slots at their reveal time. Starting XI always uses original metadata positions. This is an authored instruction, not measured tracking.

Main match pitch now shares the same prefix-only squad snapshot: optional numbered declared-position markers for both sides, separate latest-event marker and actor label, and clickable/keyboard-operable player details. These fixed declared slots are not measured or continuously simulated locations. Browser checks confirmed 22 markers at kickoff and restoration after rewind.
