// Run after `npm run build` in CI: writes dist/trophies.json.
// Never fails the deploy and never prints the token or PSN responses.
import { writeFile } from "node:fs/promises";
import * as psn from "psn-api";
import { buildTrophyFile } from "./trophy-sync.mjs";

const game = { id: "metaphor", titlePattern: /Metaphor:?\s*ReFantazio/i };
const npsso = process.env.PSN_NPSSO?.trim();

let file;
if (!npsso) {
  console.log("PSN_NPSSO is not set; publishing without trophy progress.");
  process.exit(0);
}
try {
  file = await buildTrophyFile(psn, npsso, game);
} catch (error) {
  // PSN error messages can echo request details, so report only the type.
  file = {
    version: 1,
    game: game.id,
    syncedAt: new Date().toISOString(),
    status: "sync-failed",
    earned: [],
  };
  console.log(`::warning::Trophy sync failed (${error?.name ?? "Error"}).`);
}
if (file.status === "auth-failed")
  console.log(
    "::warning::PSN rejected the sign-in token. Replace the PSN_NPSSO secret.",
  );
await writeFile("dist/trophies.json", JSON.stringify(file, null, 2));
console.log(
  `Trophy sync: ${file.status}${file.status === "ok" ? `, ${file.earned.length} of ${file.total} earned` : ""}.`,
);
