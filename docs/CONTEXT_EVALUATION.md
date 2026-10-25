# Context versus counts-only evaluation

The controlled evaluation holds match events fixed and varies only supplied historical context:

| Case | Expected behavior | Observed |
|---|---|---|
| Ellis: 20 of 305 minutes in inherited role | Limited recorded role experience | Pass |
| Duarte: 305 of 305 minutes in inherited role | Recorded role experience despite usual-position label | Pass |
| No history | No familiarity conclusion | Pass |
| History available after substitution | Exclude it from entry-time assessment | Pass |
| Records with zero minutes | No usable exposure for familiarity conclusion | Pass |

The separate incomplete-window check waits rather than comparing a partial post-substitution spell. Missing and delayed variants retain the same match statistics as the supplied-history case.

The baseline is deliberately counts-only and correctly abstains on role familiarity. This establishes that the contextual path uses information absent from counts; it does not establish superiority over an LLM supplied with the same history. The investigation and story wording are deterministic, so these are contract/fixture checks, not a benchmark of model reasoning.

Run `npm run evaluate` to reproduce the machine-readable report. Recorded live API/browser checks establish connectivity and output presentation for a small number of examples. Fan usefulness, broader realism, repeated model ranking, and agent-directed tool selection are still untested.
