import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createState,
  updateGame,
  parseBackup,
  serializeBackup,
  createStore,
  STORAGE_KEY,
} from "../src/state.js";
import { game } from "./fixture.js";
const games = [game, { ...game, id: "other" }];
test("a reveal remains isolated from other games and completion", () => {
  const before = createState(games);
  const after = updateGame(before, "demo", {
    revealed: ["detail-a"],
    checked: ["item-a"],
  });
  const hidden = updateGame(after, "demo", { revealed: [] });
  assert.deepEqual(hidden.games.demo.checked, ["item-a"]);
  assert.deepEqual(before.games.demo.revealed, []);
  assert.deepEqual(after.games.other.revealed, []);
});
test("a backup round trip restores reveals, notes, completion and bookmark", () => {
  const s = updateGame(createState(games), "demo", {
    revealed: ["detail-a"],
    checked: ["item-a"],
    notes: "My note",
    bookmark: "stage-one",
    status: "completed",
  });
  assert.deepEqual(parseBackup(serializeBackup(s), games), s);
});
test("invalid, oversized and future backups are rejected without changing state", () => {
  const s = createState(games);
  const original = serializeBackup(s);
  for (const input of [
    "bad json",
    '{"version":99,"games":{}}',
    "x".repeat(300001),
    JSON.stringify({
      ...s,
      games: { demo: { ...s.games.demo, revealed: "all" } },
    }),
  ])
    assert.throws(() => parseBackup(input, games));
  assert.equal(serializeBackup(s), original);
});
test("unknown IDs cannot turn new content into revealed content", () => {
  const s = createState(games);
  s.games.demo.revealed = ["future-secret", "detail-a"];
  assert.deepEqual(parseBackup(serializeBackup(s), games).games.demo.revealed, [
    "detail-a",
  ]);
});
test("saved changes survive a new store instance", () => {
  const values = new Map();
  const storage = {
    getItem: (k) => values.get(k) ?? null,
    setItem: (k, v) => values.set(k, v),
  };
  createStore(storage, games).update("demo", {
    revealed: ["detail-a"],
    notes: "kept",
  });
  assert.deepEqual(createStore(storage, games).state.games.demo.revealed, [
    "detail-a",
  ]);
  assert.equal(createStore(storage, games).state.games.demo.notes, "kept");
});
test("failed storage retains exportable changes and exposes a warning", () => {
  const store = createStore(
    {
      getItem: () => null,
      setItem: () => {
        throw Error("Quota");
      },
    },
    games,
  );
  store.update("demo", { notes: "Do not lose me" });
  assert.match(store.warning, /not being saved/i);
  assert.match(serializeBackup(store.state), /Do not lose me/);
});
test("corrupt stored data is not silently overwritten", () => {
  const values = new Map([[STORAGE_KEY, "broken"]]);
  const store = createStore(
    { getItem: (k) => values.get(k), setItem: (k, v) => values.set(k, v) },
    games,
  );
  assert.match(store.warning, /could not be read/i);
  store.update("demo", { notes: "temporary" });
  assert.equal(values.get(STORAGE_KEY), "broken");
});
