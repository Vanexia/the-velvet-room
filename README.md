# The Velvet Room

A personal game journal with platinum reminders in play order. Choose a game by its cover, read the safe advice, and reveal individual details when their cues match where you are.

[Open The Velvet Room](https://vanexia.github.io/the-velvet-room/)

The first companion is **Metaphor: ReFantazio**, with advice from the opening hours through New Game Plus. It is a planning companion, not a daily itinerary or a replacement for every step in a trophy guide.

## Using the journal

- Start with **Before you start**, then follow the stages in order.
- Read each card's **When to reveal** cue. Revealing one card never opens another.
- Reveals stay open between visits. **Hide again** or **Hide all spoilers** closes them without losing checklists or notes.
- **Save place** gives the library's **Continue reading** link a destination.
- Checkboxes track reminders, independently of PlayStation trophies.
- **Backups** exports or restores your shelf status, reveals, checklists, notes and reading place.

Progress is saved in this browser at this site address. There is no account, cloud sync or trophy-service connection. Export a backup before clearing site data or changing browsers. Importing replaces the current saved progress only after you confirm it. If storage fails, a persistent notice appears and the current session can still be exported.

## Spoiler boundaries

Unrevealed instructions and checklist text are absent from the rendered document, including its accessibility tree. Navigation and scrolling never reveal them. Neutral headings, dates and explicit reveal cues remain visible.

Full-source links warn that PSNProfiles contains unhidden spoilers. Repository content and compiled scripts include the complete companion; inspecting them can expose spoilers. The site's disclosure controls protect ordinary reading, not deliberate source inspection.

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

This is an unofficial fan project. Code and original companion wording are MIT licensed. Game artwork and game names belong to their respective owners and are not included in that licence. Cover attribution is in [asset credits](public/assets/credits.md).
