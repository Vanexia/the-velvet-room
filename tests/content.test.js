import { test } from "node:test";
import assert from "node:assert/strict";
import { games } from "../src/data/index.js";
test("content IDs cannot collide and restore the wrong disclosure", () => {
  for (const g of games) {
    const ids = [
      g.id,
      ...g.tips.map((t) => t.id),
      ...g.stages.flatMap((s) => [
        s.id,
        ...s.cards.flatMap((c) => [c.id, ...c.checks.map((t) => t.id)]),
      ]),
    ];
    assert.equal(ids.length, new Set(ids).size);
    for (const s of g.stages)
      for (const c of s.cards) {
        assert.ok(c.cue && c.warning && c.paragraphs.length);
        assert.match(c.source, /^https:\/\/psnprofiles\.com\/guide\/.+#/);
      }
  }
});
test("safe metadata does not expose protected identities or future place names", () => {
  const hiddenNames =
    /Brilehaven|Altabury|Charadrius|Redscale|Junah|Eupha|Basilio|Rella|Tyrant|Prince Archetype|Elegy|Maria|Akademeia|Trial of the Dragon/;
  for (const g of games)
    for (const s of g.stages) {
      assert.doesNotMatch(s.label + " " + s.when + " " + s.intro, hiddenNames);
      for (const c of s.cards)
        assert.doesNotMatch(
          [c.title, c.summary, c.cue, c.warning].join(" "),
          hiddenNames,
        );
    }
});
