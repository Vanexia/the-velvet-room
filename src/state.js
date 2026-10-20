import * as z from "zod/mini";

export const STORAGE_KEY = "the-velvet-room.progress.v1";
const id = z.string().check(z.regex(/^[a-z0-9][a-z0-9-]{0,79}$/));
const ids = (max) => z.array(id).check(z.maxLength(max));
const idOrEmpty = z.union([id, z.literal("")]);
const progressSchema = z.strictObject({
  status: z.enum(["playing", "planning", "completed"]),
  revealed: ids(2000),
  checked: ids(4000),
  notes: z.string().check(z.maxLength(5000)),
  bookmark: idOrEmpty,
  // Retain the old field name for backups; it now records visited dates.
  openedDays: z._default(ids(400), []),
  dayBookmark: z._default(idOrEmpty, ""),
  help: z._default(ids(2000), []),
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
          openedDays: [],
          dayBookmark: "",
          help: [],
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
    const days = game.days ?? [];
    const dayIds = new Set(days.map((d) => d.id));
    const helpIds = new Set([
      ...Object.values(game.dayHelp ?? {})
        .flat()
        .map((h) => h.id),
      ...Object.keys(game.partyGuide?.outings ?? {}).map((d) => `party-${d}`),
    ]);
    const revealIds = new Set(cards.map((c) => c.id));
    const checkIds = new Set([
      ...game.tips.map((t) => t.id),
      ...cards.flatMap((c) => c.checks.map((t) => t.id)),
      ...days.flatMap((d) => d.steps.map((s) => s.id)),
    ]);
    next.games[game.id] = {
      ...saved,
      revealed: [...new Set(saved.revealed)].filter((i) => revealIds.has(i)),
      checked: [...new Set(saved.checked)].filter((i) => checkIds.has(i)),
      openedDays: [...new Set(saved.openedDays)].filter((i) => dayIds.has(i)),
      help: [...new Set(saved.help)].filter((i) => helpIds.has(i)),
      dayBookmark: dayIds.has(saved.dayBookmark) ? saved.dayBookmark : "",
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
    // Adopt progress another tab saved, so this tab's next write keeps it.
    sync(text) {
      if (blocked || !text) return false;
      try {
        state = parseBackup(text, games);
        return true;
      } catch {
        return false;
      }
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
