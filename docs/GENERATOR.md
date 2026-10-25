# Synthetic attacking-phase generator v0.1

This is an original, AI-assisted rule-based generator in generator.js. No code or data has been imported from the previously researched football repositories. No external dependencies or real player data are used.

## Reproduce
Browser: select a seed (uint32) and a profile, then Generate replay. Download data exports the exact event input and provenance.

CLI: `node tools/generate.cjs 7 neutral > generated.json`

Same generator version, seed and profile produce the same JSON. A Mulberry32-style seeded PRNG supplies all random choices. No wall clock or Math.random is used.

## Scope and assumptions
Eight prior attacking phases supply a baseline. Replay begins at 55:00, a booking occurs at 56:00, then twelve Northbridge attacking phases are generated. Ellis replaces Vale after six phases. Opposing possessions between phases are not simulated, and the displayed 1–1 score is fixed. This is a partial attacking-phase replay, not a complete match.

Flank selection probability: .34 in neutral, .78 after booking in shift. These profiles are engineered interventions to exercise the detector. The commentator cannot read the profile but the user can select and inspect it. They are not empirical probabilities or independent evidence that yellow cards cause changes.

Each phase has two to four attempted alternating passes/carries; failure ends the chain. Actions have actor/team IDs, endpoint coordinates and outcomes. Coordinates advance towards goal. The phase summary points back to its action IDs. A challenge flag and shot flag are sampled at phase completion; they are coarse annotations, not spatially resolved duel/shot models. A challenged phase may create a shot, but shot probability is reduced. Goals, saves, all-player motion, opponent chains and tactical causation are not modelled.

History is a separate authored fixture, not inferred from generated matches. Never use profile labels or future events as commentary evidence.

## Detection
At least 4 observed post-booking phases, at least 65% on the flank, and an increase of at least 20 percentage points from the observed baseline. These are illustrative thresholds, not a calibrated hypothesis test. The negative control can produce false positives by chance: lack of a programmed shift is not a guarantee of a quiet realised sequence.

## Checks
`node tests/engine.cjs`
`node tests/generator.cjs`

The generator check covers 100 seeds × 2 profiles, reproducibility, valid inputs, IDs/order, backward evidence references, substitution identity and prefix-only replay analysis. This tests software invariants, not football realism or usefulness.

## Next
Add both teams' possession chains, explicit defensive and shot events, spatial consistency checks and independently generated historical records. Validate aggregate distributions before calling this a realistic full-match simulator.
