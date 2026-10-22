import { mountApp } from "./app.js";
import { games } from "./data/index.js";
const app = mountApp(window, games);
// Published by the scheduled PSN sync; the site works without it.
fetch("./trophies.json", { cache: "no-store" })
  .then((r) => (r.ok ? r.json() : null))
  .then((data) => data && app.setTrophies(data))
  .catch(() => {});
