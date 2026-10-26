# Batch 1 — Reliable match input

Completed locally on 26 October 2026. Public deployment, GitHub remote, video and submission are unchanged.

## Delivered
- Built-in and imported copies use the same supported sequence, comparison, interval-statistics and role-history calculation paths.
- Capability labels describe supplied history, incidents and sequence prerequisites; missing sequence data produces an unavailable explanation rather than fabricated zero counts.
- New exports/examples carry seconds, 105×68-metre endpoint coordinates and fixed attacking directions. Existing v1 inputs retain labelled legacy defaults. Schematic lineup coordinates remain percentages. Reversed directions affect both sequence analysis and displayed lineup orientation.
- Validation rejects inconsistent coordinate pairs, unknown identities, mixed-team/reused possession IDs and unsupported contract values. Event errors include array index and event ID. Invalid uploads preserve the current match.
- One-hour expiry timestamps, reload-expired and remove-upload controls. Atomic replacement works at capacity and does not discard the existing package when validation fails. Only known opaque IDs can be inspected/removed; there is no global list or clear-all route.
- Restored the Match data & demo settings panel accidentally removed by the viewer layout. Corrected uploaded replay summary showing “seed undefined”.
- Updated downloadable JSON example and input/user documentation.

## Verification
20 test files pass via `node --test tests/*.cjs`, including the new input-contract suite and extended HTTP tests. Regression coverage includes three built-in/import parity matches (seeds 0, 7, 19), missing coordinates, legacy defaults, mirrored attack directions, capacity, failed/successful replacement, exact expiry, deletion, request-origin protection and no package enumeration. Existing replay-prefix, identity, history-availability and incident-correction checks remain passing.

Browser at local port 8768: loaded example (1206 events), inspected capability/expiry text, rejected invalid synthetic flag without losing current match, removed upload back to built-in, and loaded/replaced the example again. No browser console errors observed. Screenshot: batch-1/upload-controls.jpg. Expiry itself was tested with an injected clock, not by waiting an hour in the browser. Azure was disabled for this verification; no model calls or credit used.

## Boundaries
JSON synthetic completed 90-minute packages only; fixed two team slots, no added time or direction switch mid-match. Eight server packages, 2 MB upload, 200 incident reports and one-hour memory remain deliberate prototype limits. Opaque IDs are capabilities, not accounts. No durable storage. Network failure cannot guarantee server removal; the UI reports failure and retains local state. Capability detection is not football realism validation. Autonomous AI investigation, broader histories, richer commentary and final release/submission remain subsequent batches.
