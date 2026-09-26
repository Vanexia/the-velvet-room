import { renderCollection } from "./library-render.js";
export const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const e = escapeHtml;
const statusLabels = {
  playing: "Playing",
  planning: "Planning",
  completed: "Completed",
};
const check = (item, p) =>
  `<label class="check-row"><input type="checkbox" data-check="${e(item.id)}" aria-label="${e(item.label || item.text)}" ${p.checked.includes(item.id) ? "checked" : ""}><span>${e(item.text)}</span></label>`;

export function renderLibrary(games, state) {
  return renderCollection(games, state);
}
function renderCard(card, p) {
  const open = p.revealed.includes(card.id);
  return `<article class="advice-card ${open ? "is-revealed" : ""}" id="card-${e(card.id)}"><div class="card-heading"><div><p class="card-kind">${e(card.kind ?? "Watch for this")}</p><h3>${e(card.title)}</h3></div><span class="disclosure-state">${open ? "Revealed" : "Details hidden"}</span></div><p class="card-summary">${e(card.summary)}</p><div class="reveal-cue"><span class="cue-mark" aria-hidden="true">↳</span><p><strong>When to reveal</strong><br>${e(card.cue)}</p></div><div class="reveal-controls"><button class="button ${open ? "subtle" : "reveal-button"}" id="toggle-${e(card.id)}" data-reveal="${e(card.id)}" aria-expanded="${open}" aria-controls="detail-${e(card.id)}">${open ? "Hide again" : "Reveal details"} <span aria-hidden="true">${open ? "−" : "+"}</span></button><span class="spoiler-label">${e(card.warning)}</span></div><div id="detail-${e(card.id)}" ${open ? "" : "hidden"}>${open ? `<div class="revealed-content">${card.paragraphs.map((p) => `<p>${e(p)}</p>`).join("")}${card.table ? `<div class="table-scroll"><table><thead><tr>${card.table.head.map((h) => `<th scope="col">${e(h)}</th>`).join("")}</tr></thead><tbody>${card.table.rows.map((r) => `<tr>${r.map((c) => `<td>${e(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : ""}<div class="card-checks">${card.checks.map((i) => check(i, p)).join("")}</div><a class="source-link" href="${e(card.source)}" target="_blank" rel="noopener noreferrer">PSNProfiles source ↗ <span>(full guide contains spoilers)</span></a></div>` : ""}</div></article>`;
}

export function renderGame(game, p) {
  return `<a href="#library" class="back-link">← Your library</a><header class="game-header"><img src="${e(game.cover)}" width="130" height="195" alt="${e(game.title)} cover artwork"><div class="game-heading"><p class="eyebrow">Platinum companion</p><h1>${e(game.title)}</h1><p class="quiet">${e(game.subtitle)}</p><div class="game-meta"><label class="status-select">On your shelf <select aria-label="Game status" data-status name="shelf-status">${Object.entries(
    statusLabels,
  )
    .map(
      ([v, t]) =>
        `<option value="${v}" ${p.status === v ? "selected" : ""}>${t}</option>`,
    )
    .join(
      "",
    )}</select></label><span class="reminder-count">${p.checked.length} reminders checked</span></div></div></header><div class="companion-layout"><aside class="journey-rail"><p class="eyebrow">Reading order</p><nav aria-label="Reading order"><a href="#game/${e(game.id)}/before">Before you start</a>${game.stages.map((s) => `<a class="${p.bookmark === s.id ? "bookmarked" : ""}" href="#game/${e(game.id)}/${e(s.id)}">${e(s.label)}${p.bookmark === s.id ? '<span aria-label="Bookmarked">◆</span>' : ""}</a>`).join("")}<a href="#game/${e(game.id)}/notes">Your notes</a></nav><button class="text-button" data-action="hide-all">Hide all spoilers</button><p class="rail-note">Open only the details you need. Your reveals stay open between visits.</p></aside><div class="reading-column"><section id="before" class="before-section"><p class="eyebrow">Read now · No story spoilers</p><h2>Before you start</h2><p class="section-intro">A few habits to keep the platinum within reach. Detailed reminders follow in play order.</p><div class="safe-tips">${game.tips.map((t) => `<article class="safe-tip"><h3>${e(t.title)}</h3><p>${e(t.body)}</p>${check({ id: t.id, text: "Noted", label: "Noted: " + t.title }, p)}</article>`).join("")}</div><div class="reading-note"><strong>A date is a cue, not permission to read everything.</strong><p>Check each card’s “When to reveal” instruction. Opening one card never reveals another. These checkboxes track your reminders, not your PlayStation trophies.</p></div></section>${game.stages.map((s, i) => `<section class="journey-stage" id="${e(s.id)}"><header class="stage-heading"><div class="stage-index" aria-hidden="true">${String(i + 1).padStart(2, "0")}</div><div><p class="eyebrow">${e(s.when)}</p><h2>${e(s.label)}</h2></div><button class="bookmark-button ${p.bookmark === s.id ? "active" : ""}" data-bookmark="${e(s.id)}" aria-pressed="${p.bookmark === s.id}" aria-label="Bookmark ${e(s.label)}">${p.bookmark === s.id ? "◆ Saved place" : "◇ Save place"}</button></header><p class="stage-intro">${e(s.intro)}</p>${s.cards.map((c) => renderCard(c, p)).join("")}</section>`).join("")}<section class="notes-section" id="notes"><p class="eyebrow">For your next session</p><h2>Your notes</h2><label for="game-notes">Where you stopped, what you want to do next, or anything worth remembering.</label><textarea id="game-notes" data-notes name="notes" autocomplete="off" maxlength="5000" rows="6" placeholder="Leave a note for next time…">${e(p.notes)}</textarea><p class="quiet notes-status" aria-live="polite">Saved in this browser. Maximum 5,000 characters.</p></section><section class="sources-section"><h2>About this companion</h2><p>Original reminders based on the ${e(game.sourceCredit ?? "the PSNProfiles trophy guide")}.${game.verifiedOn ? " Checked " + e(game.verifiedOn) + "." : ""} This is a planning companion; the game’s quest log remains your deadline reference.</p><p>Source links open the full guide, which contains unhidden story and character details.</p><a href="${e(game.guideUrl)}" target="_blank" rel="noopener noreferrer" class="text-link">Open PSNProfiles guide (spoilers) ↗</a></section></div></div>`;
}
