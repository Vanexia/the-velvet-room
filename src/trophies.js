import { escapeHtml as e } from "./html.js";

// trophies.json is published by the PSN sync; treat it as untrusted input.
export function parseTrophies(raw, games) {
  if (!raw || raw.version !== 1 || !games.some((g) => g.id === raw.game))
    return null;
  const earned = Array.isArray(raw.earned)
    ? raw.earned
        .filter((t) => t && typeof t.slug === "string" && typeof t.name === "string")
        .slice(0, 500)
        .map((t) => ({
          slug: t.slug,
          name: t.name,
          earnedAt: typeof t.earnedAt === "string" ? t.earnedAt : null,
        }))
    : [];
  return {
    game: raw.game,
    status: String(raw.status ?? ""),
    syncedAt: typeof raw.syncedAt === "string" ? raw.syncedAt : null,
    total: Number.isInteger(raw.total) ? raw.total : null,
    earned,
  };
}

// Reminder cards link to a PSNProfiles section such as "#46-at-your-own-risk".
export const cardTrophySlug = (card) =>
  String(card.source ?? "").split("#")[1]?.replace(/^\d+-/, "") ?? "";

export const earnedFor = (trophies, card) =>
  trophies?.earned.find((t) => t.slug === cardTrophySlug(card)) ?? null;

const day = (iso) => {
  const date = iso ? new Date(iso) : null;
  return date && !Number.isNaN(date.valueOf())
    ? date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    : "";
};

export function trophySummary(trophies) {
  if (!trophies) return "";
  if (trophies.status === "auth-failed")
    return `<p class="trophy-sync trophy-sync--warn">PSN sync needs a new sign-in token.</p>`;
  if (trophies.status !== "ok") return "";
  const synced = day(trophies.syncedAt);
  return `<p class="trophy-sync"><span aria-hidden="true">◆</span> ${trophies.earned.length}${trophies.total ? ` of ${trophies.total}` : ""} trophies earned on PSN${synced ? ` <span class="quiet">· synced ${e(synced)}</span>` : ""}</p>`;
}

export function earnedBadge(earned) {
  if (!earned) return "";
  const when = day(earned.earnedAt);
  return `<span class="trophy-earned">Earned on PSN${when ? ` · ${e(when)}` : ""}</span>`;
}
