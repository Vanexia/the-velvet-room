import { test } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import { game } from "./fixture.js";
import { metaphor } from "../src/data/metaphor.js";
import { renderDaily } from "../src/daily-render.js";
import { createState, createStore, STORAGE_KEY } from "../src/state.js";
import { mountApp } from "../src/app.js";

const day = (id, label, month, number, text) => ({
  id,
  label,
  month,
  number,
  steps: [{ id: `${id.slice(4)}-step-01`, text, label: "Afternoon", kind: "time" }],
});
const daily = {
  ...game,
  days: [
    day("day-june-12", "12 June", "June", 12, "JUNE_TEXT"),
    day("day-july-01", "1 July", "July", 1, "JULY_TEXT"),
  ],
};
function setup(hash = "#game/demo/day-june-12") {
  const w = new Window({ url: `http://localhost:4173/${hash}` });
  w.document.body.innerHTML =
    '<div id="storage-warning" hidden></div><main id="app"></main><div id="toast"></div><dialog id="backup-dialog"><div id="backup-content"></div></dialog>';
  mountApp(w, [daily]);
  return w;
}

test("whole daily pages respect character and class introduction boundaries, with all help open", () => {
  const ids = metaphor.days.map((d) => d.id);
  const help = [
    ...Object.values(metaphor.dayHelp ?? {}).flat().map((h) => h.id),
    ...Object.keys(metaphor.partyGuide.outings).map((d) => `party-${d}`),
  ];
  const boundaries = [
    ["day-august-14", /Junah|Masked Dancer|Persona Master/iu],
    ["day-august-21", /Eupha|Summoner|Eagle Lion|Noctiluca/iu],
    ["day-september-13", /Basilio|Berserker|Destroyer/iu],
    ["day-september-26", /Royal (?:Warrior|Knight|Thief|Summoner|Berserker|Masked Dancer)|Hero[’']s Cry/iu],
  ];
  const progress = { ...createState([metaphor]).games.metaphor, help };
  for (const d of metaphor.days) {
    const html = renderDaily(metaphor, progress, d.id);
    for (const [start, names] of boundaries)
      if (ids.indexOf(d.id) < ids.indexOf(start))
        assert.doesNotMatch(html, names, `${d.id} before ${start}`);
  }
});

test("a store adopts progress another tab saved instead of overwriting it", () => {
  const w = new Window();
  try {
    const a = createStore(w.localStorage, [daily]),
      b = createStore(w.localStorage, [daily]);
    a.update("demo", { notes: "tab A note", checked: ["june-12-step-01"] });
    assert.equal(b.sync(w.localStorage.getItem(STORAGE_KEY)), true);
    b.update("demo", { checked: [...b.state.games.demo.checked, "july-01-step-01"] });
    const saved = JSON.parse(w.localStorage.getItem(STORAGE_KEY)).games.demo;
    assert.equal(saved.notes, "tab A note");
    assert.deepEqual(saved.checked, ["june-12-step-01", "july-01-step-01"]);
  } finally {
    w.close();
  }
});

test("browsing months with arrow keys waits for Enter before opening a date", () => {
  const w = setup(),
    d = w.document;
  try {
    const month = () => d.querySelector("[data-month]");
    month().dispatchEvent(new w.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    month().value = "day-july-01";
    month().dispatchEvent(new w.Event("change", { bubbles: true }));
    w.dispatchEvent(new w.Event("hashchange"));
    assert.match(d.getElementById("day-heading").textContent, /June/);
    assert.doesNotMatch(d.getElementById("app").innerHTML, /JULY_TEXT/);
    month().dispatchEvent(new w.KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    w.dispatchEvent(new w.Event("hashchange"));
    assert.match(d.getElementById("day-heading").textContent, /July/);
  } finally {
    w.close();
  }
});

test("cancelling the backup picker removes a stale confirmation", async () => {
  const w = setup("#library"),
    d = w.document;
  try {
    d.querySelector('[data-action="backup"]').click();
    const result = d.getElementById("import-result");
    result.innerHTML = '<button data-action="confirm-import">Replace with backup</button>';
    const input = d.getElementById("import-file");
    input.dispatchEvent(new w.Event("change", { bubbles: true }));
    await new Promise((r) => setTimeout(r));
    assert.equal(d.querySelector('[data-action="confirm-import"]'), null);
  } finally {
    w.close();
  }
});

test("content links that are not https are rendered inert", async () => {
  const { safeUrl } = await import("../src/html.js");
  assert.equal(safeUrl("https://psnprofiles.com/x"), "https://psnprofiles.com/x");
  assert.equal(safeUrl("javascript:alert(1)"), "#");
  assert.equal(safeUrl(undefined), "#");
});

test("outing encounter notes are absent until revealed and their reveal survives a backup", async () => {
  const { parseBackup, serializeBackup } = await import("../src/state.js");
  const closed = createState([metaphor]).games.metaphor;
  assert.doesNotMatch(renderDaily(metaphor, closed, "day-july-25"), /Glechom|Cabio|Salva/u);
  assert.match(renderDaily(metaphor, closed, "day-july-25"), /Reveal notes/u);
  const state = createState([metaphor]);
  state.games.metaphor.help = ["party-day-july-25"];
  const restored = parseBackup(serializeBackup(state), [metaphor]).games.metaphor;
  assert.deepEqual(restored.help, ["party-day-july-25"]);
  assert.match(renderDaily(metaphor, restored, "day-july-25"), /Glechom/u);
});
