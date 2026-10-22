import { mountApp } from "./app.js";
import { games } from "./data/index.js";
const app = mountApp(window, games);
// Published by the scheduled PSN sync; the site works without it.
fetch("./trophies.json", { cache: "no-store" })
  .then((r) => (r.ok ? r.json() : null))
  .then((data) => {
    // One file lists every synced game; older files held a single game.
    for (const entry of Array.isArray(data?.games) ? data.games : [data])
      if (entry) app.setTrophies(entry);
  })
  .catch(() => {});
