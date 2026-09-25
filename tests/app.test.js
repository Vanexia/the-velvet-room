import { test } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import { mountApp } from "../src/app.js";
import {
  STORAGE_KEY,
  createState,
  serializeBackup,
  updateGame,
} from "../src/state.js";
import { game } from "./fixture.js";
function setup() {
  const win = new Window({ url: "http://localhost:4173/#game/demo" });
  win.document.body.innerHTML =
    '<div id="storage-warning" hidden></div><main id="app"></main><div id="toast"></div><dialog id="backup-dialog"><div id="backup-content"></div></dialog>';
  mountApp(win, [game]);
  return win;
}
test("the initial library replaces its loading placeholder", () => {
  const w = new Window({ url: "http://localhost:4173/the-velvet-room/" });
  w.document.body.innerHTML =
    '<div id="storage-warning" hidden></div><main id="app"><p>Opening your library…</p></main><div id="toast"></div><dialog id="backup-dialog"><div id="backup-content"></div></dialog>';
  mountApp(w, [game]);
  assert.match(w.document.getElementById("app").textContent, /Demo Game/);
  assert.equal(
    w.document
      .getElementById("app")
      .textContent.includes("Opening your library"),
    false,
  );
  w.close();
});
test("real reveal/check/hide events preserve completion without exposing another card", () => {
  const w = setup(),
    d = w.document;
  d.querySelector('[data-reveal="detail-a"]').click();
  assert.match(d.getElementById("app").textContent, /SECRET_SENTINEL/);
  assert.equal(
    d.getElementById("app").textContent.includes("SECOND_SECRET"),
    false,
  );
  const input = d.querySelector('[data-check="item-a"]');
  input.checked = true;
  input.dispatchEvent(new w.Event("change", { bubbles: true }));
  d.querySelector('[data-action="hide-all"]').click();
  assert.equal(
    d.getElementById("app").textContent.includes("SECRET_SENTINEL"),
    false,
  );
  const saved = JSON.parse(w.localStorage.getItem(STORAGE_KEY));
  assert.deepEqual(saved.games.demo.revealed, []);
  assert.deepEqual(saved.games.demo.checked, ["item-a"]);
  w.close();
});
test("notes and a bookmark persist through the application events", () => {
  const w = setup(),
    d = w.document;
  const notes = d.querySelector("[data-notes]");
  notes.value = "Next session: check the shop";
  notes.dispatchEvent(new w.Event("input", { bubbles: true }));
  d.querySelector("[data-bookmark]").click();
  const saved = JSON.parse(w.localStorage.getItem(STORAGE_KEY));
  assert.equal(saved.games.demo.notes, "Next session: check the shop");
  assert.equal(saved.games.demo.bookmark, "stage-one");
  assert.match(d.querySelector("[data-bookmark]").textContent, /Saved place/);
  w.close();
});
test("a route to a stage scrolls without revealing it", () => {
  const w = setup(),
    d = w.document;
  w.location.hash = "#game/demo/stage-one";
  w.dispatchEvent(new w.Event("hashchange"));
  assert.equal(
    d.getElementById("app").textContent.includes("SECRET_SENTINEL"),
    false,
  );
  w.close();
});
test("the status selector updates the library grouping", () => {
  const w = setup(),
    d = w.document;
  const select = d.querySelector("[data-status]");
  select.value = "completed";
  select.dispatchEvent(new w.Event("change", { bubbles: true }));
  w.location.hash = "#library";
  w.dispatchEvent(new w.Event("hashchange"));
  assert.ok(d.querySelector('section[aria-label="Completed"]'));
  w.close();
});

test("skip to content retains the current game and focuses its main region", () => {
  const w = setup(),
    d = w.document;
  d.getElementById("app").tabIndex = -1;
  d.body.insertAdjacentHTML(
    "afterbegin",
    '<a class="skip-link" href="#app">Skip to content</a>',
  );
  d.querySelector(".skip-link").click();
  assert.equal(w.location.hash, "#game/demo");
  assert.equal(d.activeElement, d.getElementById("app"));
  w.close();
});

test("the backup UI rejects invalid files and requires confirmation before replacing progress", async () => {
  const w = setup(),
    d = w.document;
  d.body.insertAdjacentHTML(
    "afterbegin",
    '<button data-action="backup">Backups</button>',
  );
  const notes = d.querySelector("[data-notes]");
  notes.value = "Keep my current note";
  notes.dispatchEvent(new w.Event("input", { bubbles: true }));
  d.querySelector('[data-action="backup"]').click();
  const input = d.getElementById("import-file");
  async function choose(text) {
    Object.defineProperty(input, "files", {
      value: [new w.File([text], "backup.json", { type: "application/json" })],
      configurable: true,
    });
    input.dispatchEvent(new w.Event("change", { bubbles: true }));
    await new Promise((resolve) => setImmediate(resolve));
  }
  await choose('{"version":99,"games":{}}');
  assert.match(
    d.getElementById("import-result").textContent,
    /unsupported version/,
  );
  assert.equal(
    JSON.parse(w.localStorage.getItem(STORAGE_KEY)).games.demo.notes,
    "Keep my current note",
  );
  const restored = serializeBackup(
    updateGame(createState([game]), "demo", {
      notes: "Restored note",
      checked: ["save"],
      revealed: ["detail-a"],
    }),
  );
  await choose(restored);
  assert.ok(d.querySelector('[data-action="confirm-import"]'));
  assert.equal(
    JSON.parse(w.localStorage.getItem(STORAGE_KEY)).games.demo.notes,
    "Keep my current note",
  );
  d.querySelector('[data-action="cancel-import"]').click();
  assert.equal(
    JSON.parse(w.localStorage.getItem(STORAGE_KEY)).games.demo.notes,
    "Keep my current note",
  );
  await choose(restored);
  d.querySelector('[data-action="confirm-import"]').click();
  assert.equal(d.getElementById("backup-dialog").open, false);
  assert.equal(d.querySelector("[data-notes]").value, "Restored note");
  assert.equal(d.querySelector('[data-check="save"]').checked, true);
  assert.match(d.getElementById("app").textContent, /SECRET_SENTINEL/);
  assert.equal(
    d.getElementById("app").textContent.includes("SECOND_SECRET"),
    false,
  );
  w.close();
});
