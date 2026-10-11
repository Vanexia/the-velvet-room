# Remaining Route Audit Implementation Plan

**Goal:** Repair the July 23 Imagination blocker and validate every remaining dated instruction against the original schedule, owned Google Doc and independent sources.

**Architecture:** Keep the existing static daily reader and stable checkbox IDs. Edit the canonical Markdown only after evidence review, then regenerate the JSON. Private research stays outside the site repository. No changes to dates before July 23.

**Tech Stack:** Markdown, JavaScript, existing calendar compiler and Node tests.

**Spec:** User request in this chat on 11 October 2026: audit July 23 onward, preserve completed dates, prioritise accuracy and use all available agents.

## Constraints

- Keep first-playthrough spoilers out of chat and other dates out of the selected-day view.
- Original Google Sheet and Google Doc are comparison sources, not proof of accuracy.
- PSNProfiles governs trophy requirements; independently checked walkthroughs may support daily logistics.
- Do not treat projected virtue ranks, random ingredients or optional training as completed actions.
- Give explicit prerequisites and feasible recovery slots; check that recoveries do not collide.
- Preserve existing checklist IDs, saved progress and layout.

## Work

- [x] Diagnose July 23 from the user's rank-2 Imagination and active 15-Archetype task; establish a time-free option and a viable alternative.
- [x] Read the current original Sheet and owned Doc; save private snapshots and compare to existing copies.
- [x] Audit all July 23–30 steps, with August, September and October delegated in parallel.
- [x] Cross-review virtue gates, follower sequences, recipe supplies, missable quests/collections and recovery-slot collisions across months.
- [x] Integrate supported corrections into content/metaphor-schedule.md; amend party advice only if schedule changes alter availability.
- [x] Record each reviewed step and its evidence/status in a private coverage ledger; report remaining uncertainties honestly.
- [x] Verify dates before July 23 are identical, old IDs retained, generated data consistent, tests/build pass and selected-day rendering still works.

Release procedure: publish through the existing GitHub Pages workflow, then compare deployed assets and the schedule with the tested build before claiming it is live. Store the run, commit and readback result in the private release record.

The user has already requested execution and delegation; proceed without a separate plan-approval round.
