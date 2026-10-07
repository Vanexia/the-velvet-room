# Complete guide validation plan

**Goal:** Source-check the entire maintained Metaphor guide, correct supported errors, and disclose unresolved dependencies without exposing future details in chat.

**Architecture:** Parallel month reviewers produce evidence ledgers and proposed edits; the main agent reconciles and applies changes. Independent cross-cutting reviews check chains that span months. Website tests verify preservation and delivery separately from game-fact research.

**Spec:** The user's 7 October 2026 request to validate the entire guide, with accuracy ahead of speed and multiple agents authorised.

## Constraints and deliverables

- Starting revision: `c270c2617661c707a9895f9b4db9414735e9c2ba`.
- Scope: all 145 dates and 422 dated instructions; introduction and postgame advice in `content/metaphor-schedule.md`; `src/data/metaphor.js`, `src/data/day-help.js`, and `src/guide-help.js`.
- Preserve existing step/card IDs, saved progress, date-isolated display and reveal boundaries. New unrelated actions require new IDs.
- PSNProfiles supplies trophy authority. Other walkthroughs may cross-check activities, conditions and navigation under the user's explicit permission.
- The player is on 29 June. Keep research, later names and findings out of chat previews.
- Audits are source reviews, not gameplay tests. No claim of a guaranteed or optimal route.
- Main agent alone edits maintained content. Reviewers write separate reports under `work/full-guide-audit-2026-10-07/`.

## Coverage and evidence

Each dated step receives a record: `id`, `verdict` (`supported`, `correction`, `conditional`, `unresolved`, or `editorial`), `sources`, and `note`. Review every claim within a step; flag missing evidence instead of treating a read as verification. For source-dependent edits, record the original claim, proposed replacement, evidence, and effect on later days.

## Tasks

- [x] Capture baseline and enumerate every instruction and reference card.
- [x] Review June, July and August in parallel: directions, prerequisites, time costs, availability, item acquisition and hand-ins.
- [x] Review September and October, plus postgame and trophy/reference content, in the next parallel pass.
- [x] Cross-check follower/virtue/task dependencies across the full route.
- [x] Cross-check collection coverage: books, cooking, quests, bounties, sights, destinations, debates and other required trophy actions.
- [x] Reconcile contradictions with independent evidence. Independently challenge consequential proposed changes; distinguish a walkthrough's chosen date from a game-imposed gate.
- [x] Apply sourced corrections and actionable uncertainty/recovery wording, preserving IDs.
- [x] Run a mechanical coverage check: no missing/duplicate ledger rows, every changed factual claim recorded, every required item/action has acquisition and use where relevant.
- [x] Review revised instructions for beginner directions and spoiler timing.
- [x] Run the existing test suite and production build, compare IDs/order to the baseline, and render affected date pages without leaking other dates.
- [x] Publish only after reconciliation and review. Verify the deployed bundle and relevant rendered instructions, and report actual scope and remaining limits.

## Completion standard

All source instructions and reference material have an explicit audit disposition. Confirmed errors are corrected, conflicting claims are investigated, unresolved risks are visibly and usefully qualified, and evidence does not rest on software tests or agreement between copied walkthroughs. Do not mark unsupported claims as verified to reach full coverage. The older Google Doc is an unsynchronised historical backup; this task maintains the website and its downloadable source.

## Verification before publication

All 422 baseline instructions have dispositions; 433 current instructions preserve every old ID. The 30 tests passed, the production build passed, and a real-content DOM check passed. Chrome rendered June 29 with four instructions and the correct hand-in. The user's original Chrome tab was restored. Final bundle: 5a9da9ecd2fb. Source limitations are recorded in docs/full-guide-validation.md.

Published content commit 587fa424f7525805e798b4bdf72bedac6929e0e0. Pages run 37646086014 passed. Live readback on 7 October 2026 matched bundle 5a9da9ecd2fb byte-for-byte and the full downloadable source after newline normalization: 145 dates, 433 steps. Positive and negative correction checks passed. The local preview server was stopped and the user's original Chrome tab restored.
