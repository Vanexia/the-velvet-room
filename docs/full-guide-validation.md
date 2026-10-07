# Complete guide source validation

Reviewed 7 October 2026. **Maintenance record: later-game names and mechanics appear in linked evidence.** Read the website one date at a time during a first playthrough.

The review covered all 145 dates and 422 original instructions. The revision has 433 instructions: 134 original instructions changed and 11 distinct errands/checks were added. All original identifiers remain on their original dates, preserving saved progress. Three preparation instructions moved earlier within their existing day.

Five month reviews were followed by separate collection, follower and quest/trophy audits, an independent challenge of the corrections, and a technical integrity check. PSNProfiles was read directly in Chrome; it is the sole trophy authority. Other sources support locations, requirements and route mechanics under the user's permission.

## Coverage

| Month | Original steps | Supported | Correction | Conditional | Editorial | Unresolved |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| june | 88 | 64 | 3 | 15 | 6 | 0 |
| july | 106 | 65 | 7 | 22 | 11 | 1 |
| august | 87 | 39 | 8 | 34 | 5 | 1 |
| september | 84 | 46 | 3 | 16 | 19 | 0 |
| october | 57 | 9 | 8 | 20 | 19 | 1 |

These dispositions describe the baseline, not the outcome of the corrections. [The resolution manifest](full-guide-validation.json) records each original instruction, sources, changed status, new-step provenance, consolidated findings and remaining limits.

The review also covered six tips, 32 reference cards, eight stage introductions, three encounter-help boxes, six primer sections, 17 introductory blocks and three postgame blocks. Cross-checks mapped all 14 follower chains, seven books and 21 reading sessions, 21 recipes with 24 ingredient types, five village shops, 50 intended beetle pickups, eight debates, nine bounty chains and all 44 trophies. The 77 quest-table entries include alternate key branches; they are not 77 mandatory separate completions.

## Corrections

Directions now distinguish quest acceptance, intermediate item exchanges, final hand-ins and time-consuming follower events. The route adds missing ingredient purchases and reserves, identifies random supplies, separates arena certification from the ranked ladder, and places shopping before consumed time slots. Delayed bonds have town-then-travel recovery sequences with the necessary virtue checks. Reference reminders follow the same dates and conditions as the calendar.

The independent challenge corrected a shop district, missing replacement water, two misplaced preparation steps, a late fishing-route mismatch and a butcher's district. Final reconciliation also corrected the necklace's boss/scene reward; the ring's separate key-and-chest route is a different quest.

## Evidence and limits

- [PSNProfiles trophy guide](https://psnprofiles.com/guide/20665-metaphor-refantazio-trophy-guide): freshly read whole guide, including detailed sections. Source conflicts are recorded; its roadmap is not infallible.
- [Recipe quantities and shops](https://www.rpgsite.net/guide/16414-metaphor-refantazio-ingredient-list-acooking-guide), [ingredient and location inventory](https://steamcommunity.com/sharedfiles/filedetails/?id=3346632902), [shop catalogue](https://game8.co/games/Metaphor-ReFantazio/archives/480399): supply checks, with specific recipe and stock contradictions resolved in the private collection report.
- [Independent daily route](https://www.powerpyx.com/metaphor-refantazio-100-walkthrough/) and [separate daily route](https://www.rpgsite.net/guide/16304-metaphor-refantazio-100-walkthrough): event periods and travel, used as route evidence rather than a rule that other dates are impossible.
- [Quest mechanics catalogue](https://www.pushsquare.com/guides/metaphor-refantazio-all-requests-and-how-to-complete-them) and individual quest pages listed in the manifest: item acquisition, recipients and completion conditions.

This is source validation, not an end-to-end played run, a damage model or a minimum-time proof. Actual virtue ranks, stock, earlier actions and combat readiness remain conditions. Early optional beetle spawn triggers are disputed. The exact first Estate drawing event on 04 October was not directly observed; the date is a qualified route inference. The generic route-change warning cannot establish a September23 deadline because the relevant travel change occurs before the tower unlocks. The revision therefore removes that invented deadline without inventing a replacement itinerary. Drawing catalogues disagree on one map landmark; no unsupported exact drawing total is asserted.

## Verification

The existing 30 tests passed. A separate real-content DOM check rendered the corrected June29 hand-in, excluded other dates, exercised calendar selection without a scroll jump, and preserved all 503 old checks, 32 card reveals, three help reveals, 145 visited dates, notes and bookmarks through the production backup parser. New tasks stay unchecked. The production build compiles the canonical Markdown and includes a matching full-source download. Software checks establish content delivery and persistence, not game-fact accuracy. Content commit 587fa424f7525805e798b4bdf72bedac6929e0e0 passed [Pages run 37646086014](https://github.com/Vanexia/the-velvet-room/actions/runs/37646086014). Live readback matched bundle 5a9da9ecd2fb byte-for-byte and the 433-step download after newline normalization. Chrome rendered the current June29 page correctly; the user's original tab was restored.

The older Google Doc remains an unsynchronised backup. Raw research and player notes stay outside the published website. This maintenance document and its curated manifest are not copied into the site's build.
