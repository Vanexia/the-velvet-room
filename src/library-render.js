import { escapeHtml as e } from "./html.js";
const statusLabels = {
  playing: "Playing",
  planning: "Planning",
  completed: "Completed",
};
export function renderCollection(games, state) {
  return `<div class="collection-heading"><div><p class="eyebrow">The Velvet Room · Personal collection</p><h1>Your <em>collection.</em></h1></div><div class="collection-mark" aria-hidden="true"><span>V</span></div></div><div class="collection-rule"><span>Your games</span><span>${games.length} ${games.length === 1 ? "guide" : "guides"} in the collection</span></div>${Object.entries(
    statusLabels,
  )
    .map(([status, label]) => {
      const group = games.filter((g) => state.games[g.id].status === status);
      if (!group.length) return "";
      return `<section class="shelf" aria-label="${label}"><h2 class="shelf-label"><span class="status-dot ${status}"></span>${label}</h2><div class="case-grid">${group
        .map((g) => {
          const p = state.games[g.id],
            day = g.days?.find((d) => d.id === p.dayBookmark);
          const href = `#game/${g.id}${day ? "/" + day.id : !g.days && p.bookmark ? "/" + p.bookmark : ""}`;
          return `<article class="game-case"><a class="case-cover" href="${e(href)}" aria-label="Open ${e(g.title)} guide"><span class="case-platform">${e(g.platform)}<span aria-hidden="true">◇</span></span><img src="${e(g.cover)}" alt="${e(g.title)} cover artwork" width="200" height="300" fetchpriority="high"><span class="case-hover">Open guide <span aria-hidden="true">↗</span></span></a><div class="case-caption"><h3><a href="${e(href)}">${e(g.title)}</a></h3><p>${g.days ? "Day-by-day platinum guide" : "Platinum companion"}</p><a class="case-resume" href="${e(href)}">${day ? `Continue · ${e(day.label)}` : "Open guide"}<span aria-hidden="true">→</span></a></div></article>`;
        })
        .join("")}</div></section>`;
    })
    .join(
      "",
    )}<div class="collection-bottom"><p><span aria-hidden="true">◇</span> Open a game to continue your guide.</p><button class="text-button" data-action="backup">Back up your progress ↗</button></div>`;
}
