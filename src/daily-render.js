import { escapeHtml as e } from "./html.js";
import { guideHelp } from "./guide-help.js";

const dayHref = (g, d) => `#game/${g.id}/${d.id}`;
export function selectDay(game, progress, section) {
  return (
    game.days.find((d) => d.id === section) ??
    game.days.find((d) => d.id === progress.dayBookmark) ??
    game.days[0]
  );
}
function calendar(game, p, day) {
  const months = [...new Set(game.days.map((d) => d.month))];
  const days = game.days.filter((d) => d.month === day.month);
  return `<aside class="calendar-rail"><div class="rail-heading"><span class="eyebrow">In-game calendar</span><span class="calendar-symbol" aria-hidden="true">◷</span></div><label class="month-label" for="guide-month">Month</label><select id="guide-month" data-month aria-label="Calendar month">${months.map((m) => `<option value="${e(game.days.find((d) => d.month === m).id)}" ${m === day.month ? "selected" : ""}>${e(m)}</option>`).join("")}</select><nav class="date-grid" aria-label="${e(day.month)} dates">${days
    .map((d) => {
      const complete = d.steps.every((s) => p.checked.includes(s.id));
      return `<a href="${dayHref(game, d)}" class="date-cell ${complete ? "complete" : p.openedDays.includes(d.id) ? "opened" : ""}" ${d.id === day.id ? 'aria-current="date"' : ""} aria-label="${e(d.label)}${complete ? ", all steps checked" : p.openedDays.includes(d.id) ? ", visited" : ""}">${String(d.number).padStart(2, "0")}</a>`;
    })
    .join(
      "",
    )}</nav><div class="calendar-key"><span><i class="opened-dot"></i> Visited</span><span><i class="complete-dot"></i> Checked</span></div><p class="rail-note">Choose your current in-game date. Only that day's instructions appear.</p>${p.dayBookmark ? `<a class="resume-link" href="#game/${e(game.id)}/${e(p.dayBookmark)}">↳ Your saved day</a>` : ""}<div class="rail-tools"><a href="#game/${e(game.id)}/reference">Tips & platinum reminders <span aria-hidden="true">↗</span></a><a href="#game/${e(game.id)}/notes">Your notes <span aria-hidden="true">↗</span></a><button class="text-button" data-action="hide-all">Hide extra details</button></div></aside>`;
}
function helpBox(help, p) {
  const open = p.help.includes(help.id);
  return `<section class="day-help ${open ? "is-open" : ""}"><div><h3>${e(help.title)}</h3><p>${e(help.cue)}</p></div><button class="button small" id="help-${e(help.id)}" data-help="${e(help.id)}" aria-expanded="${open}" aria-controls="help-content-${e(help.id)}">${open ? "Hide help −" : "Reveal help +"}</button><div id="help-content-${e(help.id)}" ${open ? "" : "hidden"}>${open ? help.paragraphs.map((t) => `<p>${e(t)}</p>`).join("") + (help.source ? `<a class="source-link" href="${e(help.source)}" target="_blank" rel="noopener noreferrer">Source discussion (may contain spoilers) ↗</a>` : "") : ""}</div></section>`;
}
function instructions(day, p) {
  return `<ol class="daily-steps">${day.steps
    .map((s, i) => {
      const done = p.checked.includes(s.id);
      const details = s.items?.length
        ? `<ul class="step-details">${s.items.map((item) => `<li>${e(item)}</li>`).join("")}</ul>`
        : "";
      return `<li class="daily-step kind-${e(s.kind)} ${done ? "is-checked" : ""}"><div class="step-side"><span class="step-number" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span><input id="${e(s.id)}" type="checkbox" data-check="${e(s.id)}" aria-label="Complete step ${i + 1}: ${e(s.label)}" ${done ? "checked" : ""}></div><div class="step-copy"><label class="step-label" for="${e(s.id)}">${e(s.label)}</label><p>${e(s.text)}</p>${details}</div></li>`;
    })
    .join("")}</ol>`;
}
export function renderDaily(game, p, section) {
  const day = selectDay(game, p, section),
    index = game.days.indexOf(day);
  const count = day.steps.filter((s) => p.checked.includes(s.id)).length;
  const prev = game.days[index - 1],
    next = game.days[index + 1];
  return `<a class="back-link" href="#library">← The collection</a><header class="reader-game"><img src="${e(game.cover)}" width="56" height="84" alt="${e(game.title)} cover"><div><p class="eyebrow">Daily platinum guide</p><h1>${e(game.title)}</h1></div><a class="reference-link" href="#game/${e(game.id)}/reference">Tips & reminders ↗</a></header><div class="reader-tabs"><a aria-current="page" href="#game/${e(game.id)}">Day by day</a><a href="#game/${e(game.id)}/reference">Reference & notes</a><span>Your reading place saves automatically</span></div><details class="guide-primer"><summary>How to follow this guide</summary><div>${guideHelp.map(([title, text]) => `<section><h3>${e(title)}</h3><p>${e(text)}</p></section>`).join("")}</div></details><div class="daily-layout">${calendar(game, p, day)}<article class="day-sheet" aria-labelledby="day-heading"><header class="day-heading"><div><p class="eyebrow">Your itinerary</p><h2 id="day-heading" tabindex="-1"><span>${String(day.number).padStart(2, "0")}</span> ${e(day.month)}</h2></div></header><div class="day-progress"><span data-day-count>${count} of ${day.steps.length} steps checked</span><progress value="${count}" max="${day.steps.length}" aria-label="Steps checked on ${e(day.label)}"></progress></div><div class="day-guidance"><strong>Work from top to bottom.</strong> Finish free errands before an activity marked “uses time”. Check the game's date and quest log if your progress differs.</div>${(
    game.dayHelp?.[day.id] ?? []
  )
    .filter((h) => !h.id.endsWith("-boss"))
    .map((h) => helpBox(h, p))
    .join("")}${instructions(day, p)}${(game.dayHelp?.[day.id] ?? [])
    .filter((h) => h.id.endsWith("-boss"))
    .map((h) => helpBox(h, p))
    .join(
      "",
    )}<div class="end-day"><span aria-hidden="true">✓</span><div><h3>Before you move on</h3><p>Review unfinished steps and any rank or quest checks above. Your checkboxes record your progress; they do not change the game's calendar.</p></div></div><nav class="day-pagination" aria-label="Previous and next date">${prev ? `<a href="${dayHref(game, prev)}"><span>Previous day</span>← ${e(prev.label)}</a>` : "<span></span>"}${next ? `<a href="${dayHref(game, next)}"><span>Next day</span>${e(next.label)} →</a>` : `<a href="#game/${e(game.id)}/reference"><span>Continue in the reference</span>Platinum reminders →</a>`}</nav></article></div><details class="guide-about"><summary>About this route & sources</summary><p>Based on Goonan's daily schedule, expanded and cross-checked for a first playthrough. PSNProfiles remains the trophy reference. The route includes conditional checks; it is not a guarantee of your current ranks, resources or battle readiness.</p><p>The website is the maintained reading edition. The earlier Google Doc remains a backup and does not automatically sync. These links contain future-game details:</p><a href="https://docs.google.com/spreadsheets/d/12GQgDqTKej90EGcpk2fiUKaW8R2wmxW77yb2Msueq-M/edit" target="_blank" rel="noopener noreferrer">Original schedule by Goonan ↗</a><a href="${e(game.guideUrl)}" target="_blank" rel="noopener noreferrer">PSNProfiles trophy guide ↗</a><a href="./metaphor-schedule.md" download>Download full route (spoilers)</a></details>`;
}
