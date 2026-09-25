import { z } from "zod";

export const STORAGE_KEY = "the-velvet-room.progress.v1";
const id = z.string().regex(/^[a-z0-9][a-z0-9-]{0,79}$/);
const progressSchema = z.strictObject({
  status: z.enum(["playing", "planning", "completed"]),
  revealed: z.array(id).max(2000),
  checked: z.array(id).max(4000),
  notes: z.string().max(5000),
  bookmark: id.or(z.literal("")),
});
const backupSchema = z.strictObject({
  version: z.literal(1),
  games: z.record(id, progressSchema),
});

export function createState(games) {
  return {
    version: 1,
    games: Object.fromEntries(
      games.map((g) => [
        g.id,
        {
          status: g.defaultStatus ?? "planning",
          revealed: [],
          checked: [],
          notes: "",
          bookmark: "",
        },
      ]),
    ),
  };
}

export function updateGame(state, gameId, patch) {
  if (!Object.hasOwn(state.games, gameId)) throw Error("Unknown game.");
  const progress = progressSchema.parse({ ...state.games[gameId], ...patch });
  return { ...state, games: { ...state.games, [gameId]: progress } };
}

export function parseBackup(text, games) {
  if (typeof text !== "string" || text.length > 300000)
    throw Error("Choose a Velvet Room backup smaller than 300 KB.");
  let raw;
  try {
    raw = JSON.parse(text);
  } catch {
    throw Error("This file is not valid JSON. Your progress has not changed.");
  }
  const parsed = backupSchema.safeParse(raw);
  if (!parsed.success)
    throw Error(
      "This backup is invalid or uses an unsupported version. Your progress has not changed.",
    );
  const next = createState(games);
  for (const game of games) {
    const saved = parsed.data.games[game.id];
    if (!saved) continue;
    const cards = game.stages.flatMap((s) => s.cards);
    const revealIds = new Set(cards.map((c) => c.id));
    const checkIds = new Set([
      ...game.tips.map((t) => t.id),
      ...cards.flatMap((c) => c.checks.map((t) => t.id)),
    ]);
    next.games[game.id] = {
      ...saved,
      revealed: [...new Set(saved.revealed)].filter((i) => revealIds.has(i)),
      checked: [...new Set(saved.checked)].filter((i) => checkIds.has(i)),
      bookmark: game.stages.some((s) => s.id === saved.bookmark)
        ? saved.bookmark
        : "",
    };
  }
  return next;
}

export function serializeBackup(state) {
  return JSON.stringify(backupSchema.parse(state), null, 2);
}

export function createStore(storage, games) {
  let state = createState(games),
    warning = "",
    blocked = false;
  try {
    const saved = storage?.getItem(STORAGE_KEY);
    if (saved) {
      try {
        state = parseBackup(saved, games);
      } catch {
        blocked = true;
        warning =
          "Saved progress could not be read. Changes are not being saved over that file. Export your current progress, then import a valid backup to restore saving.";
      }
    }
    if (!storage)
      warning =
        "Browser storage is unavailable. Changes are not being saved. Export a backup before leaving.";
  } catch {
    warning =
      "Browser storage is unavailable. Changes are not being saved. Export a backup before leaving.";
  }
  function persist() {
    if (blocked) return;
    try {
      if (!storage) throw Error("Storage unavailable");
      storage.setItem(STORAGE_KEY, serializeBackup(state));
      warning = "";
    } catch {
      warning =
        "Changes are not being saved in this browser. Your current progress is still available to export. Export a backup before leaving.";
    }
  }
  return {
    get state() {
      return state;
    },
    get warning() {
      return warning;
    },
    update(gameId, patch) {
      state = updateGame(state, gameId, patch);
      persist();
      return state;
    },
    replace(text) {
      const next = parseBackup(text, games);
      state = next;
      blocked = false;
      persist();
      return state;
    },
  };
}
