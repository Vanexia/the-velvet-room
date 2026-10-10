# Cooking instructions from 13 July

**Goal:** Make shopping and cooking instructions readable without changing any date before 13 July or the scheduled main activities.

**Architecture:** Keep the canonical Markdown and stable step IDs. Add optional indented bullet details to individual steps; compile them to an optional `items` array and render escaped HTML lists. Existing steps without details retain their rendering and saved checkboxes.

**Tech stack:** Node 24, existing static renderer, node:test and happy-dom.

**Scope:** User is on 13 July, step 2. Rewrite cooking and ingredient directions from that date onward. Leave earlier source bytes and generated days unchanged. Preserve shopping quantities unless corroborated evidence justifies a correction; keep random supplies conditional. No spoiler gates, calendar behavior or storage changes.

## Call sites and compatibility

1. `scripts/compile-schedule.mjs` calls `parseSchedule` to generate the calendar data. Steps without indented details remain unchanged.
2. `tests/schedule.test.js` calls `parseSchedule`; extend its coverage to prevent dropped/misassigned details.
3. `src/daily-render.js` consumes the compiled steps. Render optional details only on the selected date, with the existing HTML escape helper.
4. `src/app.js` and `src/state.js` use step IDs/counts, not the optional detail text. Keep all IDs and step counts unchanged.

## Work

- [x] Add failing compiler and mounted-reader tests for ordered details, plain-text escaping, future-date isolation and checkbox preservation.
- [x] Add minimal optional list parsing/rendering and matching typography. Run the focused tests.
- [x] Integrate three independent cooking reviews (July, August, September/October); keep shopping, cooking, missing ingredients and main activities separate inside each existing step.
- [x] Check ingredient quantities and carry-forward totals, retaining evidence and source disagreements in [the maintenance record](../../cooking-clarity.md).
- [x] Compare all dates/IDs against HEAD, prove pre-13-July data unchanged, run full tests/build, and inspect rendered 13 July plus representative later dates. DOM checks passed; Chrome visual verification is unavailable.

Release procedure: publish the requested guide update through the existing GitHub Pages workflow, then verify the deployed build and report that result in the task. Keep local research/private player notes out of the repository.

## Validation commands

`node --test tests/schedule.test.js tests/daily.test.js`, then `npm test` and `npm run build`. Browser checks use background Chrome only if connected; report any visual-check limitation rather than activating a window.
