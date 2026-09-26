# Direct date reader and dark palette, 26 September 2026

The user requested immediate instructions when selecting a date and a darker reading panel. This revision supersedes the whole-day disclosure and light sheet described in `daily-guide-verification.md`.

## Changes

| Before | After | Reason |
| --- | --- | --- |
| Select a date, then open its route | Selecting a date displays its instructions | Removes an unnecessary second click |
| Bright white sheet against the dark site | Muted navy sheet, soft text and subdued dividers | Reduces the abrupt brightness change |
| Reading place saved by the reveal button | Date navigation saves the reading place | Keeps Continue reading useful after removing that button |
| Hide all spoilers also closed dates | Hide extra details closes encounter and reference reveals | Preserves the selected route and checklist |

The existing storage key, checklist IDs and backup format remain intact. The old `openedDays` field now records visited dates. Other dates' instructions remain absent from the rendered page, and encounter help still requires its own reveal.

## Evidence

The updated date-navigation tests failed against the old implementation, then passed after the change. The full route preservation test also exposed Windows CRLF assumptions in its source extraction; normalising line endings fixed the test without changing its content assertions or the route.

Final local output:

```text
Compiled 145 dates and 422 instructions.
ℹ tests 28
ℹ pass 28
ℹ fail 0
Built static site in dist/
```

Background Chrome checks on localhost:

- Direct navigation to 13 June displayed eight instructions with no Open/Hide day controls. Selecting 12 June displayed its 15 instructions immediately.
- A checked step survived reload. Returning to the collection offered Continue · 13 June.
- Hide extra details closed encounter help while keeping the day's instructions and checks.
- Computed sheet background: `rgb(24, 36, 58)`. Body text contrast against it: 11.56:1; checked text: 7.46:1.
- Desktop width and scroll width both measured 2033px. At the 390px phone viewport, both measured 375px after the scrollbar. The calendar and sheet stacked without horizontal overflow. The temporary viewport override was reset.
- No captured warning or error console entries during these interactions.

The browser checks used localhost progress, separate from the user's live saved checklist. They verify this interface change, not the factual accuracy of every route instruction.

## Live deployment

Commit `7495111ad9908872213217094286017e84bf820c` deployed through [GitHub Actions run 36273800190](https://github.com/Vanexia/the-velvet-room/actions/runs/36273800190). Both build and deploy jobs succeeded. Chrome on the live Pages site confirmed 13 June displayed eight steps, no whole-day gate and the navy sheet. Separate encounter help remained closed, with no captured console errors. No live checklist or note edits were made. Date navigation saved 13 June as the reading place.

The live screenshot is stored locally at `work/dark-reader-preview.png`; it is not part of the published site. The agent's verification tab was closed afterwards.
