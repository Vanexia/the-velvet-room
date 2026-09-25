# The Velvet Room implementation plan

> For agentic workers: execute inline with executing-plans. The user has approved the design, its chronological refinement, the name The Velvet Room, and GitHub Pages publication. No extra planning approval is needed.

**Goal:** Publish a reusable game library with a researched Metaphor companion, explicit reveal cues, remembered disclosures and local progress.

**Architecture:** A static site with hash navigation and data-driven game pages. Pure state functions validate browser saves and imported backups; rendering includes protected text only after a deliberate reveal. A small build bundles Zod and application modules into static assets for GitHub Pages.

**Tech stack:** HTML, CSS, JavaScript modules, Zod 4.6.5, esbuild 0.28.2, Node 24 tests and Happy DOM 20.14.5 for interaction tests.

**Spec:** ../specs/2026-09-25-platinum-library-design.md

## Global constraints

- GitHub Pages hosting, a dedicated repository, relative asset paths.
- PSNProfiles only for trophy guides. Original prose with anchored attribution.
- Spoiler-free headings and cues, chronological stages, independent reveals.
- No hidden protected text in the rendered document.
- Single-browser storage, explicit save-failure notice, validated backups.
- No account, backend, cloud sync or progress-dependent content generation.
- User-approved name: The Velvet Room. Repository slug: the-velvet-room.
- Run browser interactions through connected Chrome, preserving minimisation and user tabs.

## Visual direction

A quiet game-room catalogue: graphite green-black (#141a19), raised surfaces (#1e2725), pale ivory (#f0eee5), sage (#b4c6b1), muted gold (#d4b878), and readable grey (#adb8b3). Georgia display type gives titles a bookish character; Segoe UI handles reading and controls; monospace dates support the chronology. Use no gradients. The signature is a chronological reading rail with discreet gold corner marks, like an annotated game journal. The library exposes the Metaphor cover immediately, with compact status and a continue action. The companion uses a narrow sticky stage rail beside a readable column, stacked on mobile. Avoid a marketing hero or empty placeholder game cards.

The design-system reference suggested horizontal scrolling and handwritten fonts. Reject those for this reading task: vertical play order and familiar text are easier to follow and more accessible.

## Task 1: Saved state, validation and spoiler rendering

Files: package.json, .gitignore, src/state.js, src/render.js, tests/state.test.js, tests/render.test.js.

Interfaces:
- `createState(games)` returns `{version:1,games:{[id]:{status,revealed,checked,notes,bookmark}}}`.
- `updateGame(state, gameId, patch)` returns new state without altering unrelated games.
- `parseBackup(text, games)` validates version, size, field types and IDs before returning a replacement state; throws on invalid input.
- `serializeBackup(state)` produces a versioned export.
- `createStore(storage, games)` exposes state, warning and update/replace methods, preserving in-memory changes on failed saves.
- `renderGame(game, progress)` and `renderLibrary(games, state)` return escaped HTML. Protected sections are omitted until their IDs appear in revealed.

- [x] Write tests before implementation and run `node --test tests/state.test.js tests/render.test.js`; expect failure due to missing modules.
- [x] Check cross-game isolation, hidden text absence, independent reveals and re-hiding without loss of completion.

```js
assert.equal(renderGame(game, fresh.games.demo).includes('SECRET_SENTINEL'), false);
const revealed = updateGame(fresh, 'demo', {revealed: ['detail-a']});
assert.equal(renderGame(game, revealed.games.demo).includes('SECRET_SENTINEL'), true);
assert.throws(() => parseBackup('{"version":99,"games":{}}', [game]));
```

- [x] Implement schemas, state transformations, storage error reporting and escaped rendering.
- [x] Run the same tests; require all passing before committing.

## Task 2: Complete content and source audit

Files: src/data/metaphor.js, src/data/index.js, docs/content-audit.md, public/assets/metaphor-cover.jpg, public/assets/credits.md.

Interfaces: game metadata plus ordered `stages`, each with `id`, `label`, `when`, `intro`, `cards`; cards have safe `title`, `cue`, `warning`, `summary`, protected `paragraphs`, `checks`, and a PSNProfiles `source` anchor. Safe top-level tips use `id`, `title`, `body`.

- [x] Read the PSNProfiles roadmap and relevant trophy sections via the existing Chrome tab.
- [x] Record trophy coverage, resolve inconsistent dates conservatively and make every missable's advance warning earlier than its deadline.
- [x] Write original guidance from opening habits through the final-area condition, NG+ preparation and cleanup. Keep future names out of safe metadata.
- [x] Obtain official promotional cover artwork, inspect it and record its origin.
- [x] Add data checks for duplicate IDs, missing reveal cues, source anchors and chronological order.

## Task 3: Interface and working interactions

Files: public/index.html, public/styles.css, public/assets/room-mark.svg, src/app.js, tests/app.test.js, scripts/build.mjs, scripts/serve.mjs.

- [x] Write interaction tests in Happy DOM for reveal, reload persistence, checkbox isolation, notes escaping, invalid backup handling and hide-all.
- [x] Run `npm test` to observe absent event handling fail.
- [x] Implement library/game hash routes, status, per-card reveals and checkboxes, stage bookmark, notes, backup download/import confirmation and clear error/success messages.
- [x] Build with `npm run build`; serve with `npm start` at port 4173.
- [x] Verify interactions, keyboard focus and responsive layout through Chrome. No automatic hidden text disclosure when changing stages.
- [x] Apply the emil-design-eng polish review last; retain state logic unless a discovered defect requires a fix.

## Task 4: Publish and verify

Files: .github/workflows/pages.yml, README.md, LICENSE.

- [x] Add a Pages workflow with Node 24, `npm ci`, `npm test`, `npm run build`, upload-pages-artifact and deploy-pages. Scope deployment permissions to Pages and OIDC.
- [x] Record adding-game instructions, local run commands, backup behaviour, source attribution and independent fan-project status.
- [x] Run tests, build and `git diff --check`. Commit the reviewed implementation.
- [x] Create Vanexia/the-velvet-room as a public repository after confirming the slug is unused; push the implementation and enable Pages workflow hosting.
- [x] Inspect the deployment result and fetch the published HTML, CSS and JavaScript. Exercise the deployed UI through Chrome when the background tab is available.
- [x] Preserve the user's guide tab. Close only agent-created research/verification tabs when no longer needed. Deliver the live site and repository links.
