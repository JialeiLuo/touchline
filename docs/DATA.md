# Data contract v0.2

All records are fictional, manually authored development fixtures. They do not describe real clubs or people and are not independent validation data. No simulator or language model is connected yet.

## Event fields
- `id`: unique stable event ID within a sequence.
- `t`: elapsed match seconds; nondecreasing.
- `type`: baseline, booking, attack, sub, pass, carry. Baseline is a presentation marker.
- `text`, `text_zh`: authored English and Chinese event descriptions.
- `x`, `y`: optional schematic coordinates on a 105 × 68 metre pitch.
- `flank`: required boolean for an attack, indicating the defender's side.
- `duel`, `shot`: optional observed challenge / shot flags.
- `synthetic`: true.

`prior_events` provides six underlying attacks for the comparison baseline. It is deliberately a compact fixture, not a full pass stream. The baseline window is the preceding 360 seconds; the commentary begins with a baseline marker at 55:00, followed by a booking at 56:00. Both cutoffs include the six fixture attacks.

Post-booking counts use only attacks revealed after the booking. Alert threshold: at least four observed attacks, at least 65 percent on the flank, and a rise of at least 20 percentage points over baseline. This is an illustrative heuristic, not a statistical significance test. It does not establish causality or measured defensive caution.

## Context history
`id`, `player_id`, `available_at` (elapsed seconds in this demo's timeline), English/Chinese text and limitations. Retrieval requires matching player ID and availability no later than the current replay clock. Production data needs absolute timestamps and match IDs.

The deliberately unavailable `future-hidden` record tests filtering. The browser downloads all fixtures for replay: this provides application-level temporal filtering, not secrecy or a security boundary.

## Editing
Edit data/fixtures.json, then run `node tools/sync-fixtures.cjs`. The JS mirror supports opening index.html directly without a fetch server. Commit both files. Run `node tests/engine.cjs`.

Next schema: explicit actor/team IDs on all events, possession chains, substitutions with incoming/outgoing IDs, and independent simulator output validation.

Generated schema v0.3 additionally uses actor_id, team_id, recipient_id, outgoing_id, chain_id, start_x/start_y, outcome and evidence_ids. See GENERATOR.md. data/glossary.js stores curated translations and selected-language definitions.
