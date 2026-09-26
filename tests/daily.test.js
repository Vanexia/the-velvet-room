import { test } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import { game } from "./fixture.js";
import {
  createState,
  parseBackup,
  serializeBackup,
  updateGame,
  STORAGE_KEY,
} from "../src/state.js";
import { mountApp } from "../src/app.js";

const daily = {
  ...game,
  days: [
    {
      id: "day-june-12",
      label: "12 June",
      month: "June",
      number: 12,
      steps: [
        {
          id: "june-12-step-01",
          text: "CURRENT_DAY_SECRET",
          label: "Free errand",
          kind: "free",
        },
      ],
    },
    {
      id: "day-june-13",
      label: "13 June",
      month: "June",
      number: 13,
      steps: [
        {
          id: "june-13-step-01",
          text: "FUTURE_DAY_SECRET",
          label: "Afternoon",
          kind: "time",
        },
      ],
    },
  ],
  dayHelp: {
    "day-june-12": [
      {
        id: "june-12-boss",
        title: "At the boss",
        cue: "Open once you have reached the boss.",
        paragraphs: ["BOSS_SECRET"],
      },
    ],
  },
};

function setup(hash = "#game/demo/day-june-12", saved) {
  const w = new Window({ url: `http://localhost:4173/${hash}` });
  w.document.body.innerHTML =
    '<div id="storage-warning" hidden></div><main id="app"></main><div id="toast"></div><dialog id="backup-dialog"><div id="backup-content"></div></dialog>';
  if (saved) w.localStorage.setItem(STORAGE_KEY, saved);
  mountApp(w, [daily]);
  return w;
}
test("reference navigation focuses the reference heading and keeps daily content absent", () => {
  const w = setup();
  w.location.hash = "#game/demo/reference";
  w.dispatchEvent(new w.Event("hashchange"));
  assert.equal(w.document.activeElement.tagName, "H1");
  assert.doesNotMatch(
    w.document.getElementById("app").innerHTML,
    /CURRENT_DAY_SECRET|FUTURE_DAY_SECRET/,
  );
  w.close();
});
test("old progress migrates without losing existing checks, reveals, notes or bookmark", () => {
  const old = {
    version: 1,
    games: {
      demo: {
        status: "playing",
        revealed: ["detail-a"],
        checked: ["item-a"],
        notes: "Keep this",
        bookmark: "stage-one",
      },
    },
  };
  const p = parseBackup(JSON.stringify(old), [daily]).games.demo;
  assert.deepEqual(p.openedDays, []);
  assert.deepEqual(p.help, []);
  assert.equal(p.dayBookmark, "");
  assert.equal(p.notes, "Keep this");
  assert.deepEqual(p.checked, ["item-a"]);
  assert.deepEqual(p.revealed, ["detail-a"]);
  assert.equal(p.bookmark, "stage-one");
});
test("daily progress round trips and rejects unknown reveal IDs", () => {
  const s = updateGame(createState([daily]), "demo", {
    openedDays: ["day-june-12", "unknown-day"],
    help: ["june-12-boss", "unknown-help"],
    checked: ["june-12-step-01", "unknown-check"],
    dayBookmark: "day-june-12",
  });
  const p = parseBackup(serializeBackup(s), [daily]).games.demo;
  assert.deepEqual(p.openedDays, ["day-june-12"]);
  assert.deepEqual(p.help, ["june-12-boss"]);
  assert.deepEqual(p.checked, ["june-12-step-01"]);
  assert.equal(p.dayBookmark, "day-june-12");
});
test("a date deep link shows that day's instructions immediately but not another day's or boss help", () => {
  const w = setup();
  const html = w.document.getElementById("app").innerHTML;
  assert.match(html, /CURRENT_DAY_SECRET/);
  assert.equal(Boolean(w.document.querySelector("[data-open-day]")), false);
  assert.equal(Boolean(w.document.querySelector("[data-hide-day]")), false);
  for (const secret of ["FUTURE_DAY_SECRET", "BOSS_SECRET"])
    assert.equal(html.includes(secret), false);
  w.close();
});
test("selecting dates saves the last read day and hiding extra help preserves the visible route and checks", () => {
  const w = setup(),
    d = w.document;
  assert.match(d.getElementById("app").textContent, /CURRENT_DAY_SECRET/);
  assert.doesNotMatch(
    d.getElementById("app").innerHTML,
    /BOSS_SECRET|FUTURE_DAY_SECRET/,
  );
  d.querySelector('[data-help="june-12-boss"]').click();
  assert.match(d.getElementById("app").textContent, /BOSS_SECRET/);
  const check = d.querySelector('[data-check="june-12-step-01"]');
  check.checked = true;
  check.dispatchEvent(new w.Event("change", { bubbles: true }));
  const saved = w.localStorage.getItem(STORAGE_KEY);
  const restored = setup("#game/demo", saved);
  assert.match(
    restored.document.getElementById("app").textContent,
    /CURRENT_DAY_SECRET/,
  );
  assert.equal(
    restored.document.querySelector('[data-check="june-12-step-01"]').checked,
    true,
  );
  restored.close();
  w.location.hash = "#game/demo/day-june-13";
  w.dispatchEvent(new w.Event("hashchange"));
  assert.match(d.getElementById("app").innerHTML, /FUTURE_DAY_SECRET/);
  assert.doesNotMatch(
    d.getElementById("app").innerHTML,
    /CURRENT_DAY_SECRET|BOSS_SECRET/,
  );
  d.querySelector('[data-action="hide-all"]').click();
  const p = JSON.parse(w.localStorage.getItem(STORAGE_KEY)).games.demo;
  assert.deepEqual(p.openedDays, ["day-june-12", "day-june-13"]);
  assert.equal(p.dayBookmark, "day-june-13");
  assert.deepEqual(p.help, []);
  assert.deepEqual(p.checked, ["june-12-step-01"]);
  assert.match(d.getElementById("app").innerHTML, /FUTURE_DAY_SECRET/);
  w.close();
});
