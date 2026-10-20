import { test } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import { metaphor } from "../src/data/metaphor.js";
import { selectPartyGuide, renderPartyGuide } from "../src/party-guide.js";
import { renderDaily } from "../src/daily-render.js";
import { createState } from "../src/state.js";

test("every supported date has sourced party preparation with usable alternatives", () => {
  assert.ok(metaphor.partyGuide, "Register the researched party guide on Metaphor");
  const ids = metaphor.days.map(day => day.id);
  const first = ids.indexOf("day-july-16");
  const phases = metaphor.partyGuide.phases.map(phase => ids.indexOf(phase.from));
  assert.equal(phases[0], first);
  assert.ok(phases.every((value, i) => value >= first && (i === 0 || value > phases[i - 1])));
  for (const id of Object.keys(metaphor.partyGuide.outings)) assert.ok(ids.indexOf(id) >= first, id);
  for (const [index, day] of metaphor.days.entries()) {
    const guide = selectPartyGuide(metaphor, day.id);
    if (index < first) { assert.equal(guide, null, day.id); continue; }
    assert.ok(guide, day.id);
    if (guide.limitedParty) assert.ok([1, 2].includes(guide.members.length), day.id);
    else assert.equal(guide.members.length, 4, day.id);
    assert.equal(new Set(guide.members.map(member => member.name)).size, guide.members.length, day.id);
    assert.equal(guide.members[0].name, "Protagonist", day.id);
    for (const member of guide.members) {
      for (const key of ["name", "archetype", "role", "inherit", "requires", "fallback", "train"]) {
        assert.equal(typeof member[key], "string", `${day.id} ${member.name} ${key}`);
        assert.ok(member[key].trim().length, `${day.id} ${member.name} ${key}`);
      }
    }
    assert.ok(guide.sources.length >= 2, day.id);
    for (const source of guide.sources) assert.equal(new URL(source.url).protocol, "https:", day.id);
  }
});

test("selected-date party HTML respects character and class introduction boundaries", () => {
  assert.ok(metaphor.partyGuide);
  const ids = metaphor.days.map(day => day.id);
  const boundaries = [
    ["day-august-14", /Junah|Masked Dancer|Persona Master|Mask’s|Mask's|Mask of/iu],
    ["day-august-21", /Eupha|Summoner|Eagle Lion|Noctiluca/iu],
    ["day-september-13", /Basilio|Berserker|Destroyer/iu],
    ["day-september-26", /\bPrince\b|Royal (?:Warrior|Knight|Thief|Summoner|Berserker|Masked Dancer)|Hero[’']s Cry/iu],
  ];
  for (const day of metaphor.days) {
    const help = Object.keys(metaphor.partyGuide.outings).map((d) => `party-${d}`);
    const html = renderPartyGuide(selectPartyGuide(metaphor, day.id), day, { help });
    for (const [start, names] of boundaries) {
      if (ids.indexOf(day.id) < ids.indexOf(start)) assert.doesNotMatch(html, names, day.id);
    }
  }
});

test("earlier dates retain their exact reader and party advice never changes itinerary markup", () => {
  const without = { ...metaphor, partyGuide: undefined };
  const state = createState([metaphor]).games.metaphor;
  const first = metaphor.days.findIndex(day => day.id === "day-july-16");
  const w = new Window();
  try {
    for (const [index, day] of metaphor.days.entries()) {
      const actual = renderDaily(metaphor, state, day.id);
      const original = renderDaily(without, state, day.id);
      if (index < first) assert.equal(actual, original, day.id);
      const a = w.document.createElement("div"), b = w.document.createElement("div");
      a.innerHTML = actual; b.innerHTML = original;
      assert.equal(a.querySelector(".day-sheet").outerHTML, b.querySelector(".day-sheet").outerHTML, day.id);
    }
  } finally { w.close(); }
});
