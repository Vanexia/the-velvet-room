import { test } from "node:test";
import assert from "node:assert/strict";
import { renderGame, renderLibrary } from "../src/render.js";
import { createState, updateGame } from "../src/state.js";
import { game } from "./fixture.js";
test("fresh HTML contains safe cues but no protected text, including attributes", () => {
  const html = renderGame(game, createState([game]).games.demo);
  assert.match(html, /Once you can explore/);
  for (const s of ["SECRET_SENTINEL", "SECOND_SECRET", "Secret item collected"])
    assert.equal(html.includes(s), false);
});
test("revealing one card exposes only that card", () => {
  const s = updateGame(createState([game]), "demo", { revealed: ["detail-a"] });
  const html = renderGame(game, s.games.demo);
  assert.match(html, /SECRET_SENTINEL/);
  assert.equal(html.includes("SECOND_SECRET"), false);
});
test("user notes are text, never executable markup", () => {
  const s = updateGame(createState([game]), "demo", {
    notes: "</textarea><img src=x onerror=alert(1)>",
  });
  assert.equal(renderGame(game, s.games.demo).includes("<img src=x"), false);
});
test("a second game uses the same library renderer", () => {
  const g2 = { ...game, id: "another", title: "Another Game" };
  const html = renderLibrary([game, g2], createState([game, g2]));
  assert.match(html, /#game\/another/);
  assert.match(html, /Another Game/);
});
