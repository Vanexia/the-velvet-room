// Builds the public trophies.json from PSN. Only earned trophies are listed,
// so the file cannot reveal the name of a trophy the player has not reached.

export const trophySlug = (name) =>
  String(name ?? "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const titleMatches = (title, pattern) =>
  pattern.test(title.trophyTitleName ?? "");

// Prefer the PS5 version when the player owns both.
function pickTitle(titles, pattern) {
  const matches = titles.filter((t) => titleMatches(t, pattern));
  return (
    matches.find((t) => /PS5/i.test(t.trophyTitlePlatform ?? "")) ?? matches[0]
  );
}

async function allUserTitles(api, auth) {
  const titles = [];
  let offset = 0;
  for (let page = 0; page < 20; page++) {
    const res = await api.getUserTitles(auth, "me", { limit: 800, offset });
    titles.push(...(res.trophyTitles ?? []));
    if (res.nextOffset === undefined || res.nextOffset <= offset) break;
    offset = res.nextOffset;
  }
  return titles;
}

export async function buildTrophyFile(api, npsso, game, now = new Date()) {
  const base = { version: 1, game: game.id, syncedAt: now.toISOString() };
  let auth;
  try {
    const code = await api.exchangeNpssoForAccessCode(npsso);
    auth = await api.exchangeAccessCodeForAuthTokens(code);
  } catch {
    return { ...base, status: "auth-failed", earned: [] };
  }
  const titles = await allUserTitles(api, auth);
  const title = pickTitle(titles, game.titlePattern);
  if (!title) return { ...base, status: "title-not-found", earned: [] };
  const options = { npServiceName: title.npServiceName };
  const [defs, mine] = await Promise.all([
    api.getTitleTrophies(auth, title.npCommunicationId, "all", options),
    api.getUserTrophiesEarnedForTitle(
      auth,
      "me",
      title.npCommunicationId,
      "all",
      options,
    ),
  ]);
  const byId = new Map(defs.trophies.map((t) => [t.trophyId, t]));
  const earned = mine.trophies
    .filter((t) => t.earned && byId.has(t.trophyId))
    .map((t) => {
      const def = byId.get(t.trophyId);
      return {
        slug: trophySlug(def.trophyName),
        name: def.trophyName,
        type: def.trophyType,
        earnedAt: t.earnedDateTime ?? null,
      };
    })
    .sort((a, b) => String(a.earnedAt).localeCompare(String(b.earnedAt)));
  return {
    ...base,
    status: "ok",
    platform: title.trophyTitlePlatform,
    total: defs.trophies.length,
    earned,
  };
}
