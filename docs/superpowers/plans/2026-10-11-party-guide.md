# Party recommendations implementation plan

**Goal:** Add researched party recommendations to the selected day from 16 July onward, preserving the user's existing reading layout and progress.

**Architecture:** An optional `partyGuide` on the game contains chronological default phases and dated outing overrides. A small selector and renderer consume only the selected phase/outing. No save-state fields, checklist IDs or itinerary changes are needed.

**Tech stack:** Existing static JavaScript, Node 24, node:test, Happy DOM and CSS. No new dependencies.

**Approved scope:** The user approved the previous proposal: equip, inheritance, training and fallback advice, researched and checked before publication. They like the current visual design and delegate placement. Start on 16 July. Expected guide unlocks are available, but individual character training and equipment are not inferred. Normal difficulty and a mostly-Magic protagonist are the build assumptions.

## Constraints and design

- Preserve all 145 dates and 433 instruction IDs/content. Earlier dates render exactly as before.
- Wide desktop: calendar, existing itinerary, then a 300px party column. Expand the containing width only for supported dates so the itinerary keeps its reading width.
- Smaller screens: party preparation above the itinerary, with compact character summaries and native disclosures for prerequisites/alternatives/training.
- Match the existing Cambria/Segoe UI typography and navy, silver and muted gold palette. Do not add motion or a new visual theme.
- Explain a role and economical inherited skill for each recommended member. State conditions on individual training, bond gates and equipment. Keep training separate from difficult-fight equipment.
- Use specific outing overrides for unusual enemy rules. Delay new names/classes until a safe date after their introduction. Do not use plot or boss names in panel headings.
- Show only the selected date's text and source links in the DOM. Ordinary reading must not reveal later party members, classes or events.
- Sources distinguish verified mechanics from suggested tactics. Two independent reviews for consequential mechanics; unresolved claims become conditional or are omitted.

## Call sites

1. `src/app.js::render` calls `renderDaily(game, progress, section)`; keep signature and all handlers unchanged.
2. `tests/daily.test.js` mounts the reader and exercises date selection, progress, focus and reveals; unchanged callers without `partyGuide` retain their markup.
3. `src/data/metaphor.js` registers guide data alongside existing days and help. No storage migration.
4. `src/party-guide.js` selects one phase and optional current outing, then renders escaped text and HTTPS sources.

## Tasks

- [x] Research July 16–August 12, August 13–September 23 and September 24–October 26 in parallel. Save private source evidence; cross-review the integrated recommendations.
- [x] Write failing mounted-reader tests for start-date boundary, phase changes, outing overrides, safe escaping/links, current-day isolation, retained checks and calendar scroll position.
- [x] Implement the selector/renderer and register the data in the game. Reuse existing HTML escaping and CSS tokens.
- [x] Add responsive party placement and readable disclosures. Earlier dates and other games keep the previous layout.
- [x] Review unlocks, skill ranks, MP costs and party compatibility against the research. Check all scheduled battle days, including solo and restricted arena matches, with fallbacks where individual ranks are unknown.
- [x] Run full tests/build; compare the itinerary to the baseline; verify real-date rendering and spoiler boundaries. Attempt background Chrome visual checks only through the connected plugin.
- [x] Record sources, disputed claims, validation output and limitations in `docs/party-recommendations.md`.

## Release procedure

Commit and push the authorized feature to `main`. Verify the matching GitHub Actions deployment, then compare the live versioned JavaScript, stylesheet and route with the local build. Save the post-deployment evidence in ignored `work/party-release-verification.json` so the release commit does not need a second deployment merely to record its own hash.

## Verification

Run `node --test tests/party-guide.test.js` for the failing and passing feature checks. Then run `npm test` and `npm run build`. Use mounted real-date checks for 15/16 July and each character/class transition. Inspect representative compact and full party sections; if Chrome is unavailable, report the visual verification limitation rather than opening a foreground browser or using the blocked in-app browser.
