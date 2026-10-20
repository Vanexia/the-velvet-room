import {
  STORAGE_KEY,
  createStore,
  parseBackup,
  serializeBackup,
} from "./state.js";
import { renderGame, renderLibrary } from "./render.js";
import { renderDaily, selectDay } from "./daily-render.js";

export function mountApp(win, games) {
  const doc = win.document,
    app = doc.getElementById("app"),
    dialog = doc.getElementById("backup-dialog");
  let storage;
  try {
    storage = win.localStorage;
  } catch {
    storage = null;
  }
  const store = createStore(storage, games);
  let activeGame,
    activeSection = "",
    hasRouted = false,
    pendingBackup = null,
    pendingCalendar = null,
    monthKeyed = false,
    toastTimer;
  const getGame = () => games.find((g) => g.id === activeGame);
  const progress = () => store.state.games[activeGame];
  const isDaily = () =>
    getGame()?.days?.length &&
    (!activeSection || activeSection.startsWith("day-"));
  function notice() {
    const el = doc.getElementById("storage-warning");
    // Rewriting an unchanged alert makes screen readers announce it again.
    if (el.textContent !== store.warning) el.textContent = store.warning;
    el.hidden = !store.warning;
  }
  function toast(message) {
    const el = doc.getElementById("toast");
    el.textContent = message;
    el.classList.add("visible");
    win.clearTimeout(toastTimer);
    toastTimer = win.setTimeout(() => el.classList.remove("visible"), 3200);
  }
  function render(focusId) {
    const old = focusId ? doc.getElementById(focusId) : null;
    const before = old?.getBoundingClientRect().top;
    app.innerHTML = getGame()
      ? isDaily()
        ? renderDaily(getGame(), progress(), activeSection)
        : `${getGame().days ? `<a class="daily-return" href="#game/${getGame().id}">← Back to daily guide</a>` : ""}${renderGame(getGame(), progress())}`
      : renderLibrary(games, store.state);
    doc.title = getGame()
      ? `${getGame().title} · The Velvet Room`
      : "The Velvet Room · Your game journal";
    notice();
    if (focusId) {
      const next = doc.getElementById(focusId);
      next?.focus({ preventScroll: true });
      if (next && before !== undefined)
        win.scrollBy(0, next.getBoundingClientRect().top - before);
    }
  }
  function route() {
    const shouldFocus = hasRouted;
    const calendarPosition =
      pendingCalendar?.hash === win.location.hash ? pendingCalendar : null;
    pendingCalendar = null;
    hasRouted = true;
    const parts = win.location.hash.slice(1).split("/");
    const next =
      parts[0] === "game" && games.some((g) => g.id === parts[1])
        ? parts[1]
        : null;
    const nextSection = parts[2] ?? "";
    const changed = next !== activeGame || nextSection !== activeSection;
    activeGame = next;
    activeSection = nextSection;
    if (isDaily()) {
      const day = selectDay(getGame(), progress(), activeSection);
      if (
        progress().dayBookmark !== day.id ||
        !progress().openedDays.includes(day.id)
      )
        update({
          dayBookmark: day.id,
          openedDays: [...new Set([...progress().openedDays, day.id])],
        });
    }
    if (changed || !app.firstElementChild) render();
    if (isDaily() && calendarPosition) {
      win.scrollTo({
        left: calendarPosition.left,
        top: calendarPosition.top,
        behavior: "instant",
      });
      doc.querySelector(calendarPosition.focus)?.focus({ preventScroll: true });
    } else if (isDaily() && changed && shouldFocus) {
      // On narrow screens the day sheet sits below the calendar and party
      // panel, so bring the focused heading into view rather than the top.
      const heading = doc.getElementById("day-heading");
      heading?.focus({ preventScroll: true });
      if (heading) heading.scrollIntoView({ block: "start", behavior: "instant" });
      else win.scrollTo(0, 0);
    } else if (next && parts[2]) {
      const target = doc.getElementById(parts[2]);
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        target.scrollIntoView({ block: "start", behavior: "instant" });
      } else if (changed && shouldFocus) {
        win.scrollTo(0, 0);
        const heading = app.querySelector("h1");
        heading?.setAttribute("tabindex", "-1");
        heading?.focus({ preventScroll: true });
      }
    } else if (changed && shouldFocus) {
      win.scrollTo(0, 0);
      const h = app.querySelector("h1");
      h?.setAttribute("tabindex", "-1");
      h?.focus({ preventScroll: true });
    }
  }
  function navigateCalendar(hash, focus) {
    pendingCalendar = { hash, focus, left: win.scrollX, top: win.scrollY };
    if (hash === win.location.hash) route();
    else win.location.hash = hash;
  }
  function update(patch) {
    store.update(activeGame, patch);
    notice();
  }
  function backupMarkup() {
    return `<div class="dialog-heading"><div><p class="eyebrow">Your saved progress</p><h2 id="backup-title">Backups</h2></div><button class="icon-button" data-action="close-backup" aria-label="Close backups">×</button></div><p>Reveals, checklists, shelf status, notes and saved places live in this browser. Export a copy before clearing site data or changing devices.</p><button class="button primary" data-action="export">Export backup ↓</button><div class="import-area"><h3>Restore a backup</h3><p>Importing replaces the progress currently saved here. Your revealed sections will match the backup.</p><label class="file-label" for="import-file">Choose a Velvet Room backup (.json)</label><input type="file" id="import-file" accept=".json,application/json"><div id="import-result" role="status" aria-live="polite"></div></div>`;
  }
  function openBackup() {
    pendingBackup = null;
    doc.getElementById("backup-content").innerHTML = backupMarkup();
    dialog.showModal();
  }
  function exportBackup() {
    const blob = new win.Blob([serializeBackup(store.state)], {
        type: "application/json",
      }),
      url = win.URL.createObjectURL(blob);
    const a = doc.createElement("a");
    a.href = url;
    a.download = `the-velvet-room-${new Date().toISOString().slice(0, 10)}.json`;
    doc.body.append(a);
    a.click();
    a.remove();
    win.setTimeout(() => win.URL.revokeObjectURL(url), 1000);
    toast("Backup exported");
  }
  doc.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) {
      const a = event.target.closest("a");
      if (
        a?.classList.contains("date-cell") &&
        isDaily() &&
        event.button === 0 &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        !event.altKey
      ) {
        event.preventDefault();
        navigateCalendar(
          a.getAttribute("href"),
          '.date-cell[aria-current="date"]',
        );
      } else if (a?.classList.contains("skip-link")) {
        event.preventDefault();
        app.focus({ preventScroll: true });
        app.scrollIntoView({ block: "start" });
      } else if (a?.getAttribute("href") === win.location.hash) {
        event.preventDefault();
        route();
      }
      return;
    }
    const reveal = button.dataset.reveal,
      bookmark = button.dataset.bookmark,
      action = button.dataset.action;
    if (button.dataset.help && getGame()) {
      const id = button.dataset.help;
      update({
        help: progress().help.includes(id)
          ? progress().help.filter((h) => h !== id)
          : [...progress().help, id],
      });
      render(`help-${id}`);
    } else if (reveal && getGame()) {
      const ids = progress().revealed;
      const open = ids.includes(reveal);
      update({
        revealed: open ? ids.filter((i) => i !== reveal) : [...ids, reveal],
      });
      render(`toggle-${reveal}`);
      toast(open ? "Details hidden" : "Details revealed and remembered");
    } else if (bookmark && getGame()) {
      update({ bookmark: progress().bookmark === bookmark ? "" : bookmark });
      render();
      doc
        .querySelector(`[data-bookmark="${bookmark}"]`)
        ?.focus({ preventScroll: true });
      toast(
        progress().bookmark ? "Reading place saved" : "Reading place cleared",
      );
    } else if (action === "hide-all" && getGame()) {
      update({ revealed: [], help: [] });
      render();
      doc
        .querySelector('[data-action="hide-all"]')
        ?.focus({ preventScroll: true });
      toast("Extra details hidden. Checklist and notes kept.");
    } else if (action === "backup") openBackup();
    else if (action === "close-backup") dialog.close();
    else if (action === "export") exportBackup();
    else if (action === "cancel-import") {
      pendingBackup = null;
      doc.getElementById("import-result").textContent =
        "Import cancelled. Your progress has not changed.";
      doc.getElementById("import-file").value = "";
    } else if (action === "confirm-import" && pendingBackup) {
      try {
        store.replace(pendingBackup);
        pendingBackup = null;
        render();
        dialog.close();
        // The button that opened the dialog may have been re-rendered away.
        const heading = app.querySelector("h1");
        heading?.setAttribute("tabindex", "-1");
        heading?.focus();
        toast("Backup restored");
      } catch (error) {
        doc.getElementById("import-result").textContent = error.message;
      }
    }
  });
  doc.addEventListener("change", async (event) => {
    const target = event.target;
    if (target.matches("[data-check]") && getGame()) {
      const id = target.dataset.check,
        ids = progress().checked;
      update({
        checked: target.checked
          ? [...new Set([...ids, id])]
          : ids.filter((i) => i !== id),
      });
      const count = doc.querySelector(".reminder-count");
      if (count)
        count.textContent = `${progress().checked.length} reminders checked`;
      target
        .closest(".daily-step")
        ?.classList.toggle("is-checked", target.checked);
      if (isDaily()) {
        const day = selectDay(getGame(), progress(), activeSection),
          done = day.steps.filter((s) =>
            progress().checked.includes(s.id),
          ).length;
        doc.querySelector("[data-day-count]").textContent =
          `${done} of ${day.steps.length} steps checked`;
        doc.querySelector(".day-progress progress").value = done;
        const dateCell = doc.querySelector('.date-cell[aria-current="date"]');
        dateCell?.classList.toggle("complete", done === day.steps.length);
        dateCell?.setAttribute(
          "aria-label",
          `${day.label}, ${done === day.steps.length ? "all steps checked" : "visited"}`,
        );
      }
    } else if (target.matches("[data-month]") && getGame()) {
      // Arrow keys on a closed select fire change on each press; wait for
      // Enter so browsing months does not open each month's first day.
      if (monthKeyed) return;
      navigateCalendar(`#game/${getGame().id}/${target.value}`, "[data-month]");
    } else if (target.matches("[data-status]") && getGame()) {
      update({ status: target.value });
      toast("Shelf updated");
    } else if (target.id === "import-file") {
      pendingBackup = null;
      const file = target.files?.[0],
        result = doc.getElementById("import-result");
      result.textContent = "";
      if (!file) return;
      try {
        if (file.size > 300000)
          throw Error("Choose a backup smaller than 300 KB.");
        const text = await file.text();
        parseBackup(text, games);
        pendingBackup = text;
        result.innerHTML = `<div class="import-confirm"><strong>Backup checked.</strong><p>This will replace your current progress, including which spoilers are revealed. Export a copy first if you want to keep both.</p><div class="dialog-actions"><button class="button subtle" data-action="export">Export current progress</button><button class="button primary" data-action="confirm-import">Replace with backup</button><button class="text-button" data-action="cancel-import">Cancel</button></div></div>`;
      } catch (error) {
        result.textContent = error.message;
      }
    }
  });
  doc.addEventListener("input", (event) => {
    if (event.target.matches("[data-notes]") && getGame()) {
      update({ notes: event.target.value });
      const status = doc.querySelector(".notes-status");
      status.textContent = store.warning
        ? "Not saved in this browser. Export a backup before leaving."
        : "Notes saved in this browser.";
    }
  });
  const monthKeys = ["ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"];
  doc.addEventListener("keydown", (event) => {
    if (!event.target.matches?.("[data-month]") || !getGame()) return;
    if (monthKeys.includes(event.key)) monthKeyed = true;
    else if (event.key === "Enter" && monthKeyed) {
      event.preventDefault();
      monthKeyed = false;
      navigateCalendar(
        `#game/${getGame().id}/${event.target.value}`,
        "[data-month]",
      );
    }
  });
  doc.addEventListener("pointerdown", (event) => {
    if (event.target.matches?.("[data-month]")) monthKeyed = false;
  });
  doc.addEventListener("focusout", (event) => {
    if (!event.target.matches?.("[data-month]") || !monthKeyed) return;
    // Leaving without Enter keeps the month that is actually shown.
    monthKeyed = false;
    const shown = selectDay(getGame(), progress(), activeSection);
    event.target.value =
      getGame().days.find((d) => d.month === shown.month)?.id ??
      event.target.value;
  });
  win.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY || !store.sync(event.newValue)) return;
    // Another tab saved progress; show it here so this tab does not overwrite it.
    const active = doc.activeElement;
    if (active?.matches?.("[data-notes]")) return;
    render();
  });
  win.addEventListener("hashchange", route);
  route();
  notice();
}
