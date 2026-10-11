import { test } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import { mountApp } from "../src/app.js";
import { createState, STORAGE_KEY } from "../src/state.js";
import { game } from "./fixture.js";

const member = (name, archetype) => ({ name, archetype, role: "Attack and support", inherit: "A learned skill", requires: "A trained prerequisite", fallback: "Keep your studied class", train: "One training goal" });
const demo = {
  ...game,
  days: [15, 16, 17, 18, 19].map(number => ({
    id: `day-july-${number}`, label: `${number} July`, month: "July", number,
    steps: [{ id: `july-${number}-step-01`, label: "Afternoon", text: "Today's activity", kind: "time" }],
  })),
  partyGuide: {
    verifiedOn: "11 October 2026",
    phases: [
      { from: "day-july-16", title: "Regular setup", summary: "CURRENT_PARTY", members: [member("Current ally", "Known class")], notes: ["Current preparation"], sources: [{ label: "Mechanics", url: "https://example.com/current" }] },
      { from: "day-july-19", title: "Later setup", summary: "FUTURE_PARTY", members: [member("Future ally", "Future class")], notes: ["Future preparation"], sources: [{ label: "Future source", url: "https://example.com/future" }] },
    ],
    outings: {
      "day-july-17": { title: "Today's outing", summary: "OUTING_CHANGE", members: [member("Current ally", "Outing class")], notes: ["Outing preparation"], sources: [{ label: "Encounter", url: "https://example.com/encounter" }] },
    },
  },
};

function setup(date = 16, data = demo) {
  const w = new Window({ url: `https://example.test/#game/demo/day-july-${date}` });
  w.document.body.innerHTML = '<div id="storage-warning" hidden></div><main id="app"></main><div id="toast"></div><dialog id="backup-dialog"><div id="backup-content"></div></dialog>';
  const state = createState([data]);
  state.games.demo.checked = ["july-15-step-01"];
  w.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  mountApp(w, [data]);
  return w;
}

test("party recommendations start at the configured date and omit later advice entirely", () => {
  const before = setup(15), current = setup(16);
  try {
    assert.equal(before.document.querySelector(".party-panel"), null);
    assert.match(current.document.querySelector(".party-panel")?.textContent ?? "", /CURRENT_PARTY/);
    assert.doesNotMatch(current.document.getElementById("app").innerHTML, /FUTURE_PARTY|Future ally|Future class|example.com\/future|OUTING_CHANGE/);
  } finally { before.close(); current.close(); }
});

test("an outing replaces the default party only on its own date", () => {
  const outing = setup(17), normal = setup(18), later = setup(19);
  try {
    assert.match(outing.document.querySelector(".party-panel")?.textContent ?? "", /Outing class/);
    assert.doesNotMatch(outing.document.querySelector(".party-panel")?.textContent ?? "", /Known class/);
    assert.match(normal.document.querySelector(".party-panel")?.textContent ?? "", /Known class/);
    assert.match(later.document.querySelector(".party-panel")?.textContent ?? "", /FUTURE_PARTY/);
  } finally { outing.close(); normal.close(); later.close(); }
});

test("party details escape content and omit non-HTTPS source URLs", () => {
  const unsafe = structuredClone(demo);
  unsafe.partyGuide.phases[0].members[0].fallback = '<img src=x onerror="alert(1)">';
  unsafe.partyGuide.phases[0].sources.push({ label: "Unsafe", url: "javascript:alert(1)" });
  const w = setup(16, unsafe);
  try {
    const panel = w.document.querySelector(".party-panel");
    assert.ok(panel);
    assert.match(panel.textContent, /<img src=x onerror="alert\(1\)">/);
    assert.equal(panel.querySelector("img"), null);
    assert.equal(panel.querySelector('[href^="javascript:"]'), null);
    assert.ok(panel.querySelector('a[href="https://example.com/current"]'));
    assert.equal(panel.querySelectorAll("input").length, 0);
  } finally { w.close(); }
});

test("calendar navigation updates party advice without moving the viewport or losing checks", () => {
  const w = setup();
  try {
    w.scrollTo(0, 460);
    w.document.querySelector('.date-cell[href="#game/demo/day-july-17"]').click();
    w.dispatchEvent(new w.Event("hashchange"));
    assert.match(w.document.querySelector(".party-panel")?.textContent ?? "", /OUTING_CHANGE/);
    assert.equal(w.scrollY, 460);
    assert.equal(w.document.activeElement.getAttribute("aria-current"), "date");
    assert.deepEqual(JSON.parse(w.localStorage.getItem(STORAGE_KEY)).games.demo.checked, ["july-15-step-01"]);
    assert.equal(w.document.querySelectorAll("[data-check]").length, 1);
  } finally { w.close(); }
});

test("games without party recommendations keep the daily reader", () => {
  const without = { ...demo, partyGuide: undefined };
  const w = setup(16, without);
  try {
    assert.equal(w.document.querySelector(".party-panel"), null);
    assert.match(w.document.querySelector(".daily-steps").textContent, /Today's activity/);
    assert.equal(w.document.querySelector(".daily-layout--party"), null);
  } finally { w.close(); }
});
