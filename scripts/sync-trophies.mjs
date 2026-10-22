// Run after `npm run build` in CI: writes dist/trophies.json.
// Never fails the deploy and never prints the token or PSN responses.
import { writeFile } from "node:fs/promises";
import * as psn from "psn-api";
import { buildTrophyFile } from "./trophy-sync.mjs";

// Title names as PSN lists them. Add a game here when it gains a guide.
const games = [
  { id: "metaphor", titlePattern: /Metaphor:?\s*ReFantazio/i },
  { id: "resident-evil", titlePattern: /^Resident Evil$/i },
];
const npsso = process.env.PSN_NPSSO?.trim();

let file;
if (!npsso) {
  console.log("PSN_NPSSO is not set; publishing without trophy progress.");
  process.exit(0);
}
try {
  file = await buildTrophyFile(psn, npsso, games);
} catch (error) {
  // PSN error messages can echo request details, so report only the type.
  const syncedAt = new Date().toISOString();
  file = {
    version: 1,
    syncedAt,
    games: games.map((g) => ({ version: 1, syncedAt, game: g.id, status: "sync-failed", earned: [] })),
  };
  console.log(`::warning::Trophy sync failed (${error?.name ?? "Error"}).`);
}
if (file.games.some((g) => g.status === "auth-failed"))
  console.log(
    "::warning::PSN rejected the sign-in token. Replace the PSN_NPSSO secret.",
  );
await writeFile("dist/trophies.json", JSON.stringify(file, null, 2));
for (const g of file.games)
  console.log(
    `Trophy sync ${g.game}: ${g.status}${g.status === "ok" ? `, ${g.earned.length} of ${g.total} earned` : ""}.`,
  );
