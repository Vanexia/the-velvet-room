# Daily guide verification, 26 September 2026

## Scope

Converted the audited personal Metaphor schedule into a date reader and replaced the wide library entry with a compact cover case. Retained the original companion, saved reveals, checklists, notes and bookmarks. Added general reading help and specific preparation/encounter help for the user's current early dungeon.

## Observed checks

Final local test run: 28 passed, 0 failed. `npm run build` completed and `git diff --check` reported no whitespace errors.

- Old-backup migration and new daily-state tests first failed against the old implementation, then passed with the new behaviour.
- Route conversion: 145 dates, 422 instructions. Whole instruction text and order compared to the imported Markdown; calendar boundaries 02 June to 26 October.
- Permanent step-ID test first failed on inserted instructions, then passed with explicit Markdown IDs and duplicate rejection.
- Chrome: cover opens the date reader; a closed date renders no instructions; opening 13 June renders eight steps and leaves its boss details absent.
- Chrome: checking a step survives a reload; revealing boss help exposes that help; moving to 14 June leaves it closed and removes prior-day help from the DOM.
- Chrome: backup dialog opens and closes; no captured warning/error console entries during these interactions.
- Responsive viewport checks: 390px and 768px overrides produced 375px and 753px document widths respectively (scrollbar accounted for), equal to their content widths. No horizontal overflow. Temporary viewport reset afterwards.
- Browser tests used localhost storage, separate from the user's saved progress on GitHub Pages. Existing user tabs were not changed.

## Final polish review

| Before | After | Why |
| --- | --- | --- |
| Wide single-game feature layout | 190px case grid on desktop, 160px on small screens | Makes covers the library's primary navigation and leaves room for additional games |
| Long document exposes future entries while scrolling | One selected, explicitly opened date | Limits accidental spoilers during ordinary reading |
| Positional instruction IDs | Permanent Markdown IDs | Inserted steps cannot shift completed checks onto other tasks |
| Generic early-dungeon instruction | Preparation warning plus separately gated boss tactics | Gives useful help before departure and at the encounter |
| Initial heading received an automatic focus outline | Initial page leaves focus alone; later navigation focuses the reading heading | Avoids a distracting first-load outline while preserving navigation focus |
| Shared help selector also targeted its button | Selector targets only the content panel | Keeps the help button compact and the layout predictable |
| Completed-step text contrast measured 4.34:1 | Darkened it to #606d80 | Keeps checked instructions readable on the light sheet |
| Reference tab had no matching scroll anchor | Focuses its heading and scrolls to the top | Keeps keyboard and reading position predictable |

Applied accessibility and Web Interface Guidelines checks for labels, native controls, keyboard navigation, visible focus, contrast, reduced motion and overflow. Applied the stop-slop copy pass and Emil design engineering polish to feedback, hover and press states. No autoplay or scroll animation. This is not a certification or an exhaustive assistive-technology audit.

## Limits

## Live deployment

Implementation commit `a288808a3b380a6aa20c8754b403b2274ac2cddc` deployed successfully through [GitHub Actions run 36273074511](https://github.com/Vanexia/the-velvet-room/actions/runs/36273074511). Build and deployment jobs both succeeded.

Chrome verification of `https://vanexia.github.io/the-velvet-room/` confirmed the new collection and game-cover link. Navigating to 13 June showed the explicit **Open 13 June** control with zero daily checkboxes rendered. No captured console errors. Live verification only navigated pages; it did not alter the user's checklists or reveal state. A spoiler-free screenshot is saved locally at `work/collection-preview.png` (not published).

## Content limits

This conversion preserves a researched route; it is not an independent full-game playtest or a guarantee of stat/virtue totals. The daily guide contains full future details in source files and downloadable exports. The Google Doc remains the prior backup edition, with no automatic sync. The browser verification above does not prove every game instruction's factual accuracy.
