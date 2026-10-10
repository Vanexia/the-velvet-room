# The Velvet Room

A compact game collection with daily guides and platinum reminders. Choose a game by its cover, select your in-game date, and open only the instructions you need.

[Open The Velvet Room](https://vanexia.github.io/the-velvet-room/)

The first guide is **Metaphor: ReFantazio**: 145 dates and 422 ordered instructions adapted from the audited personal schedule. The existing chronological platinum reminders remain under **Reference & notes**. Preparation and separate boss help are available for the early dungeon scheduled on 13 June.

## Following the daily guide

- Pick your current in-game month and date. Its instructions appear immediately and your reading place saves automatically.
- Follow the steps in order and check them as you finish. Free errands come before activities that use time.
- Preparation and encounter help have separate remembered reveals. Opening a day does not open its boss help.
- **Next day** shows the next date's instructions without marking anything complete. Other dates' instructions are absent from the page.
- **Hide extra details** closes encounter help and reference reveals while preserving the visible day, checklists, notes and reading place.
- The calendar follows the game's 30-day months. Checkpoints are checks on your actual save, not guarantees that the schedule has raised a rank.

The website is now the maintained reading edition. The earlier personal Google Doc remains a backup; it does not automatically synchronise with website changes. Downloading the full Markdown route exposes all dates and future details.

## Using the journal

- Start with **Before you start**, then follow the stages in order.
- Read each card's **When to reveal** cue. Revealing one card never opens another.
- Reveals stay open between visits. **Hide again** or **Hide all spoilers** closes them without losing checklists or notes.
- **Save place** gives the library's **Continue reading** link a destination.
- Checkboxes track reminders, independently of PlayStation trophies.
- **Backups** exports or restores your shelf status, reveals, checklists, notes and reading place.

Progress is saved in this browser at this site address. There is no account, cloud sync or trophy-service connection. Export a backup before clearing site data or changing browsers. Importing replaces the current saved progress only after you confirm it. If storage fails, a persistent notice appears and the current session can still be exported.

## Spoiler boundaries

Only the selected day's instructions appear in the daily reader, including its accessibility tree. Selecting a date shows its instructions immediately; scrolling cannot expose another date. Encounter help and reference cards keep their separate reveal controls, and their protected text is absent until revealed. Neutral headings, dates and explicit reveal cues remain visible.

Full-source links warn that PSNProfiles contains unhidden spoilers. Repository content and compiled scripts include the complete companion; inspecting them can expose spoilers. The site's disclosure controls protect ordinary reading, not deliberate source inspection.

## Maintaining the route

`content/metaphor-schedule.md` is the source for the daily route. `npm test` and `npm run build` compile it to `src/data/metaphor-days.json`; edit the Markdown rather than that generated file. The build also provides a downloadable Markdown edition. `src/data/day-help.js` contains separately gated explanations and combat help.

Keep each instruction's `<!-- id: ... -->` marker when editing or moving it. New instructions need new IDs; never reuse one for an unrelated task. The compiler rejects duplicate dates or IDs, and requires all 145 dates. Tests check full instruction preservation, order, old backup migration and spoiler isolation. Mark materially more revealing new help with a new ID so it starts hidden.

For shopping lists, recipe ingredients or ordered directions inside one instruction, add detail bullets indented by two spaces (`  - Detail`). They render as a list beneath that instruction and share its existing checkbox. Details are plain text, escaped for display, and only appear when their date is selected.

Verify added NPC names, locations, quest triggers and time costs against sources, and record the evidence against the affected step IDs in [route direction checks](docs/route-direction-checks.md). Distinguish the original requester, the hand-in recipient and any separate bond event. A date used by another walkthrough is not by itself proof of an unlock date. Record conflicting evidence or missing information instead of filling gaps from memory. The automated checks verify the website and content conversion; they do not establish that the gameplay directions are correct.

Existing version-1 backups are accepted and gain empty daily-progress fields. The storage key and all existing reference IDs are retained. No browser data is deleted during migration.

## Local development

Use Node.js 24 or newer.

```sh
npm ci
npm test
npm run build
npm start
```

Open `http://127.0.0.1:4173/the-velvet-room/`. Run the build again after changing source files. `dist/` is the complete static deployment; no server is needed in production. The GitHub Actions workflow tests, builds and publishes that directory to Pages on pushes to `main`.

## Adding a game

1. Research the complete companion using PSNProfiles for trophy guidance. Write original reminders and record sources, verification date and any uncertainty.
2. Add a module under `src/data/` using `metaphor.js` as the content structure: metadata, `sourceCredit`, `verifiedOn`, safe `tips`, and ordered `stages` containing small `cards`.
3. Give each card a neutral title, advance warning, recognisable reveal cue, spoiler category, protected paragraphs, checks and a source anchor. Put late advice at the bottom. Review cues separately from revealed content.
4. Add a standard cover to `public/assets/`, record its rights and origin in `credits.md`, and add the game to `src/data/index.js`.
5. Use stable IDs unique within the game. Never reuse an old ID for unrelated content. A materially more revealing addition needs a new card ID so it starts hidden for existing readers.
6. Extend the content audit and run the tests and build. Test the new companion while every card is hidden, then verify its reveals in order.

The interface is shared between games. Each game needs its content prepared once; playing further into it requires no code or content update. Imported backups discard unknown game and content IDs, so old backups cannot reveal newly added cards.

## Sources and rights

Trophy advice is based on the [PSNProfiles guide](https://psnprofiles.com/guide/20665-metaphor-refantazio-trophy-guide), which contains spoilers, by MakoSOLIDER, RaveNScythE18, The_Kopite and zekunlu. See the spoiler-labelled [content audit](docs/content-audit.md) for coverage and source discrepancies.

The daily route derives from [Goonan's Minimalist Schedule](https://docs.google.com/spreadsheets/d/12GQgDqTKej90EGcpk2fiUKaW8R2wmxW77yb2Msueq-M/edit), expanded and corrected in the user's authorised document audit. That audit allowed other walkthroughs for activity cross-checks. Original attribution and source references remain in the full Markdown. No end-to-end gameplay test or fresh whole-guide PSNProfiles verification is claimed for this conversion.

This is an unofficial fan project. Code and original companion wording are MIT licensed. Game artwork and game names belong to their respective owners and are not included in that licence. Cover attribution is in [asset credits](public/assets/credits.md).
