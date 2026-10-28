> Historical local freeze record. The candidate is now publicly released; see [RELEASE_0.6.0.md](RELEASE_0.6.0.md) for current access, deployment, CI and video verification.

# Touchline 0.6.0 — local final candidate

R1–R6 are complete as a local improvement pass. All work is in the owner's Documents/ChatGPT/Hackathon folder. Batch 9 remains accepted by the owner. Public access, deployment and submission have not been changed by this pass.

## What changed

| Area | Finished behavior | Evidence |
|---|---|---|
| R1 clock | Two explicit periods, half-time transition, announced minimum added time, actual whistle, period-safe input/import and full-time gating | R1.md; r1-clock-browser-check.json; clock regressions |
| R2 reports | Optional selected spell, match-so-far and full-time prose, paragraph sources, text export, separate one-call budget, local recovery | R2.md; tests/reports.cjs; r2-report-browser-check.json |
| R3 decisions | Optional four-part explanations for explicit challenge classifications, generic incidents, dissent, second caution and added time; attributed IFAB excerpts; supplied classifications validated; corrected annotation accounts respect availability | tests/decisions.cjs; package correction tests; final-browser-check.json |
| R4 first use | Prepared example starts Quick; formation label states its purpose; reports, sources and decisions stay optional/collapsed; guide and hands-on instructions updated | final-browser-check.json; desktop/mobile captures; USER_GUIDE.md |
| R5 quality | Offline comparisons, narrative/product/chance checks; bounded live attempts and failures retained; observed caveat omission repaired and recomposed without a new model call; long reports reviewed for quiet play, missing history, reported/corrected accounts and added-time finish | final-*-evaluation.json; final-live-comparison.json; final-repair-replay.json; final-report-review.json |
| R6 freeze preparation | Version 0.6.0; release identity endpoint; reconciled current docs; CI workflow; source-only export with exact hashes/build identity; fresh-copy test/startup/commentary/report verification | tools/build-release.py; ../releases/touchline-0.6.0-verification.json |

## Checks and practical limits

- All **32 regression test files** pass. Source whitespace checks pass.
- Product checks: **288/288**; chance-quality integrity: **60 generated + 24 frozen cases**; narrative checks: **24 scenario/mode + 12 full-time cases**. These verify contracts and selected fixture behavior, not football realism or fan usefulness.
- Desktop and 390px browser journeys pass with no script errors or page overflow: prepared Quick, keyboard decision disclosure, report generation, sources/download, stale-result suppression, network recovery, package expiry and added-time replay/import.
- Offline four-system harness runs rules only by default: **27 outputs, 17 passing every lexical diagnostic**. Ten outputs miss at least one history/incomplete-window phrasing criterion, often because concise Quick omits detail or wording falls outside the regex. All failures remain visible. This is not a 27/27 semantic-quality claim.
- Final live comparison planned 8 outputs and retained **7** before a provider rate limit. It made **7 provider calls**, with **19,994 input / 1,070 output tokens reported**, and one call without usage. Ranking succeeded in both cases. Both one-pass prose attempts were rejected for unsupported numeric claims and fell back locally. The conflicting-signal investigator omitted explicit history-inspection and causal caveats; the added-time investigator encountered a rate limit. No retries or extra live run were hidden.
- That observed caveat omission was repaired in source-owned raw substitution/comparison wording. Replaying the same recorded story selection now passes its diagnostics; the original live attempt remains unchanged. This is a deterministic repair check, **not a fresh successful live investigation**. Live data hashes describe the attempt; final source/archive hashes identify the repaired candidate.
- The reported live list-price scenario is about $0.00714–$0.00785 for calls with usage, using explicitly historical 2025 prices. It excludes the unreported call, hosting/taxes and actual deployment billing. Timings and per-call details are retained in the comparison file; no speed or cost superiority is claimed.
- Builder review of four long-form cases found the late winner, correct chronology, corrected account and missing-history statement appropriately included. Quiet reports no longer repeat a separate zero-shot balance paragraph. This is builder review; independent comprehension/usefulness was not measured in this pass, and the owner has not separately accepted these final long reports.
- IFAB references are a compact 2026/27 catalogue checked against official pages on 27 October 2026. Latest-page links may change edition. Generic input remains generic; quotations do not verify contact, motives or referee correctness. Version 0.4 generator challenge classifications are authored synthetic metadata.
- Local live-provider success cannot guarantee public Azure availability. Application call allowances are not an Azure dollar cap. Public access, persistent allowance storage, credentials/model access, concurrency and hosting-budget settings still need hosted verification.

## Candidate identity and publication contents

The local commit containing this record is the source revision to freeze. The source archive adds `BUILD_INFO.json` with that revision and release ID `touchline-0.6.0-final`, plus `SOURCE_MANIFEST.json` with every exported file's SHA-256. The adjacent verification file records the archive digest and fresh-copy checks. Runtime `/api/status` reads the archive build identity or an explicit deployment revision. Verify both version and revision after deployment.

The source archive excludes `.env`, runtime ledgers, caches, account screenshots, untracked old photos, prior video/audio and private working-folder archives. Reproducible fixtures, source, tests, all final attempts/failures, current documentation and selected safe screenshots are included. Historical review/evaluation documents are labelled as historical, not erased. A source manifest verifies bytes; it is not an open-source licence. Existing copyright terms remain unchanged.

## Remaining work: release and submission only

1. **Batch 10:** publish the accepted archive/revision together; verify GitHub visibility and clean download, remote CI, public `/api/status`, prepared Quick/Tactical, reports, decision cards, uploaded packages, final added-time report, fallback and recovery. Check server-owned model access, persistent ledger/concurrency, call allowance and account spending controls. Public source, download, docs and hosted revision must agree. No feature additions.
2. **Batch 11:** record this exact hosted release, produce the English narrated demonstration under two minutes, publish the final video, and align repository/Microsoft project-page links. Verify anonymous judge access and completion. Present any actual legal-acceptance step to the owner.

No public release or upload is implied by local completion. Remote CI has been prepared but has not run against a published revision. The old demo/video must not be described as this candidate until replaced and verified.
