# Daily guide and collection redesign

**Goal:** Turn the approved Metaphor schedule into an interactive, chronological guide and replace the large library entry with a compact game-cover collection.

**Architecture:** Keep the existing static JavaScript app and GitHub Pages deployment. Maintain the audited schedule as Markdown, compile it into structured days, and render only the selected, explicitly opened day. Extend existing version-1 progress with defaulted optional fields so old saves and backups remain valid.

**Approved direction:** The user approved the day-by-day proposal and requested smaller clickable covers and a distinctive design. No additional design approval is needed for routine choices.

**Visual system:** Midnight #0b132c; velvet #182c60; silver #c8d3e7; paper #f3f5fa; muted #a6b5d0; accent #d6bb85. Georgia/Cambria display lettering, Segoe UI reading text, monospace calendar labels. Compact framed covers are the signature. No oversized feature card, fake games, gradient hero, or decorative statistics. A calendar rail and white reading sheet separate library atmosphere from guide readability. The UI UX database's lead-generation/form recommendation was rejected as irrelevant to this personal library.

## Constraints

- Retain old reminder IDs, checklists, reveals, notes and bookmarks.
- Days and boss help use separate explicit reveals; future instructions never enter the rendered DOM before reveal. Calendar metadata contains dates only.
- Reading position changes when opening a day, not when merely browsing dates. Completion is manual, with no automatic next-day reveal.
- Keep full source content out of user-visible research previews. Public source code necessarily includes the complete guide.
- One browser's local storage; existing backup export/import remains available.
- Use the audited schedule, with source attribution and honest verification limits. Do not claim automatic Google Doc synchronisation.
- Plain JavaScript, existing Zod/esbuild/happy-dom; no new runtime dependencies.

## Task 1: Date content and progress

- [x] Add tests in `tests/daily.test.js` for an old backup gaining empty daily fields, new daily reveals/checks surviving reload, and unknown IDs being discarded.
- [x] Run `node --test tests/daily.test.js` and capture the expected missing-behaviour failures.
- [x] Add `content/metaphor-schedule.md`, `scripts/schedule.mjs` and `scripts/compile-schedule.mjs`. Compile all 145 dates into `src/data/metaphor-days.json`; import it in `metaphor.js`. Preserve order and original instruction text, with stable date/step IDs.
- [x] Extend `state.js` with defaulted `openedDays`, `dayBookmark` and `help` fields. Retain version and storage key; validate IDs against loaded content.
- [x] Add current dungeon preparation and separate boss-help content in `src/data/day-help.js`, based on the saved mechanics checks. Do not reveal boss identity in the closed help cue.
- [x] Run migration, source-coverage and round-trip tests.

## Task 2: Reader behaviour

- [x] Add integration tests that a date URL reveals no instructions, opening one date leaves later dates absent, boss help stays separate, hide-all preserves checks, and a saved day resumes after reload.
- [x] Add `src/daily-render.js` and pure HTML helpers in `src/html.js`. Render one selected date, calendar navigation, manual checks, persisted help, day completion count, previous/next controls and context cues.
- [x] Extend `app.js` routing and handlers. Keep the existing companion under a separate reference tab and preserve old deep links.
- [x] Render full safe help on demand. Add an end-of-day review before moving on. Opening a future date is a deliberate action, not an effect of navigation.
- [x] Run all application tests.

## Task 3: Collection and visual design

- [x] Replace library markup with 170–200px cover cases, a quiet continue link and compact captions. Do not invent extra library entries.
- [x] Replace CSS with the approved tokens, a restrained doorway motif, responsive date rail, light reading sheet, visible focus, reduced motion and clear checked/pressed/revealed states.
- [x] Update shared header, metadata, footer and documentation. Preserve backup dialog and storage-failure notices.
- [x] Check actual browser rendering and keyboard interactions through background Chrome; verify narrow layout and no overflow where supported.

## Task 4: Review and publish

- [x] Review accessibility, copy, spoiler boundaries and final interaction polish with the applicable skills.
- [x] Run `npm test` and `npm run build`; inspect the diff and content conversion totals.
- [x] Commit reviewed changes; publish using the existing GitHub Pages workflow under the user's instruction to update their hosted website.
- [x] Verify deployment and live bundle, close agent-created browser tabs, and report the site link with actual verification limits.

## Review risks

The greatest risks are losing existing progress and accidentally rendering hidden text. Tests exercise real save migration and DOM content. The schedule remains a researched route rather than a gameplay-tested guarantee. Google Doc is retained as the earlier backup edition; the repository Markdown is the maintained web source and can produce future exports.
