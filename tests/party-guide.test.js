import { test } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import { mountApp } from "../src/app.js";
import { createState, STORAGE_KEY } from "../src/state.js";
import { selectPartyGuide, renderPartyGuide } from "../src/party-guide.js";
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

function withReserves() {
  const data = structuredClone(demo);
  data.partyGuide.phases[1] = {
    from: "day-july-18", title: "Five available allies", summary: "Choose four for combat",
    members: [member("Protagonist", "Mage"), member("Frontline ally", "Warrior"), member("Guard ally", "Knight"), member("New ally", "Support")],
    reserves: [member("Reserve ally", "Thief")],
    notes: [], sources: [],
  };
  return data;
}

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

test("four active members and a reserve render as distinct recommendations", () => {
  const w = setup(18, withReserves());
  try {
    const panel = w.document.querySelector(".party-panel");
    assert.match(panel.textContent, /Active party · 4 members/);
    assert.deepEqual([...panel.querySelectorAll(":scope > .party-roster .party-member h3")].map(node => node.textContent), ["Protagonist", "Frontline ally", "Guard ally", "New ally"]);
    const reserves = panel.querySelector(".party-reserves");
    assert.ok(reserves);
    assert.match(reserves.textContent, /Reserve options/);
    assert.deepEqual([...reserves.querySelectorAll(".party-member h3")].map(node => node.textContent), ["Reserve ally"]);
    assert.equal(reserves.querySelector("details").open, false);
    assert.match(reserves.querySelector("dd").textContent, /A learned skill/);
  } finally { w.close(); }
});

test("reserves follow the selected date and do not alter earlier party markup", () => {
  const data = withReserves();
  const day = data.days.find(entry => entry.id === "day-july-16");
  assert.equal(renderPartyGuide(selectPartyGuide(data, day.id), day), renderPartyGuide(selectPartyGuide(demo, day.id), day));
  const before = setup(17, data), after = setup(18, data);
  try {
    assert.equal(before.document.querySelector(".party-reserves"), null);
    assert.doesNotMatch(before.document.getElementById("app").innerHTML, /Reserve ally|New ally|Five available allies/);
    assert.match(after.document.querySelector(".party-reserves")?.textContent ?? "", /Reserve ally/);
  } finally { before.close(); after.close(); }
});

test("an outing can replace or clear the phase reserves", () => {
  const data = withReserves();
  data.partyGuide.outings["day-july-19"] = { reserves: [member("Outing reserve", "Healer")] };
  const replacement = setup(19, data);
  data.partyGuide.outings["day-july-19"].reserves = [];
  const cleared = setup(19, data);
  try {
    const reserves = replacement.document.querySelector(".party-reserves");
    assert.match(reserves?.textContent ?? "", /Outing reserve/);
    assert.doesNotMatch(reserves.textContent, /Reserve ally/);
    assert.equal(cleared.document.querySelector(".party-reserves"), null);
    assert.doesNotMatch(cleared.document.querySelector(".party-panel").textContent, /Reserve ally|Outing reserve|Active party/);
  } finally { replacement.close(); cleared.close(); }
});

test("promoting a reserve for an outing never lists them as both active and reserve", () => {
  const data = withReserves();
  data.partyGuide.phases[1].reserves.push(member("Another reserve", "Healer"));
  data.partyGuide.outings["day-july-19"] = { members: [member("Reserve ally", "Thief")] };
  const w = setup(19, data);
  try {
    const panel = w.document.querySelector(".party-panel");
    assert.equal(panel.querySelectorAll(".party-member").length, 2);
    assert.equal(panel.querySelector(":scope > h3").textContent, "Active party · 1 member");
    assert.deepEqual([...panel.querySelectorAll(".party-reserves .party-member h3")].map(node => node.textContent), ["Another reserve"]);
    assert.equal(data.partyGuide.phases[1].reserves.length, 2, "Selecting an outing must not mutate its phase");
  } finally { w.close(); }
});

test("reserve advice escapes text and attribute content", () => {
  const data = withReserves();
  data.partyGuide.phases[1].reserves[0] = {
    name: 'Reserve " onfocus="alert(1)', archetype: "<script>bad()</script>", role: "<img src=x onerror=bad()>",
    inherit: "<button>unsafe</button>", requires: "<iframe>unsafe</iframe>", fallback: "<svg onload=bad()>", train: "<input autofocus>",
  };
  const w = setup(18, data);
  try {
    const reserves = w.document.querySelector(".party-reserves");
    assert.ok(reserves);
    assert.equal(reserves.querySelectorAll("script, img, button, iframe, svg, input, [onfocus]").length, 0);
    assert.equal(reserves.querySelector("summary").getAttribute("aria-label"), 'Skills and alternatives for Reserve " onfocus="alert(1)');
    assert.match(reserves.textContent, /<script>bad\(\)<\/script>/);
    assert.match(reserves.textContent, /<input autofocus>/);
  } finally { w.close(); }
});

test("calendar navigation reveals reserves without moving the viewport or losing checks", () => {
  const w = setup(17, withReserves());
  try {
    w.scrollTo(0, 460);
    w.document.querySelector('.date-cell[href="#game/demo/day-july-18"]').click();
    w.dispatchEvent(new w.Event("hashchange"));
    assert.match(w.document.querySelector(".party-reserves")?.textContent ?? "", /Reserve ally/);
    assert.equal(w.scrollY, 460);
    assert.equal(w.document.activeElement.getAttribute("aria-current"), "date");
    assert.deepEqual(JSON.parse(w.localStorage.getItem(STORAGE_KEY)).games.demo.checked, ["july-15-step-01"]);
    assert.equal(w.document.querySelectorAll("[data-check]").length, 1);
  } finally { w.close(); }
});
