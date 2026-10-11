import { escapeHtml as e } from "./html.js";

export function selectPartyGuide(game, dayId) {
  if (!game.partyGuide) return null;
  const index = game.days.findIndex((day) => day.id === dayId);
  if (index < 0) return null;
  const phase = game.partyGuide.phases.findLast((entry) => {
    const start = game.days.findIndex((day) => day.id === entry.from);
    return start >= 0 && start <= index;
  });
  if (!phase) return null;
  const outing = game.partyGuide.outings?.[dayId];
  const sources = [...(phase.sources ?? []), ...(outing?.sources ?? [])];
  return {
    ...phase,
    ...outing,
    sources: sources.filter((source, i) => sources.findIndex((s) => s.url === source.url) === i),
    verifiedOn: game.partyGuide.verifiedOn,
  };
}

function memberRow(member) {
  return `<section class="party-member"><div class="party-member-heading"><h3>${e(member.name)}</h3><p class="party-archetype">${e(member.archetype)}</p></div><p class="party-role">${e(member.role)}</p><details class="party-options"><summary aria-label="Skills and alternatives for ${e(member.name)}">Skills & alternatives</summary><dl><dt>Inherit</dt><dd>${e(member.inherit)}</dd><dt>Requirements for this setup</dt><dd>${e(member.requires)}</dd><dt>If unavailable</dt><dd>${e(member.fallback)}</dd><dt>Training advice</dt><dd>${e(member.train)}</dd></dl></details></section>`;
}

function sourceLinks(sources) {
  return sources.filter((source) => {
    try { return new URL(source.url).protocol === "https:"; }
    catch { return false; }
  }).map((source) => `<li><a href="${e(source.url)}" target="_blank" rel="noopener noreferrer">${e(source.label)} ↗</a></li>`).join("");
}

export function renderPartyGuide(guide, day) {
  if (!guide) return "";
  const notes = guide.notes?.length
    ? `<div class="party-preparation"><h3>Keep in mind</h3><ul>${guide.notes.map((note) => `<li>${e(note)}</li>`).join("")}</ul></div>`
    : "";
  const sources = sourceLinks(guide.sources);
  return `<aside class="party-panel" aria-labelledby="party-heading"><header class="party-header"><p class="eyebrow">Party · ${e(day.label)}</p><h2 id="party-heading">${e(guide.title)}</h2><p>${e(guide.summary)}</p></header><p class="party-assumptions">For Normal difficulty and a Magic-focused protagonist. Check the requirements if an upgrade is unavailable.</p><div class="party-roster">${guide.members.map(memberRow).join("")}</div>${notes}${sources ? `<details class="party-sources"><summary>Research & sources</summary><p>Mechanics checked ${e(guide.verifiedOn)}. These are suggested tactics, with alternatives for missing training. Source pages may contain later-game spoilers.</p><ul>${sources}</ul></details>` : ""}</aside>`;
}
