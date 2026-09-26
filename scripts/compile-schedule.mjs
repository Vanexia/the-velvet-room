import { readFile, writeFile } from "node:fs/promises";
import { parseSchedule } from "./schedule.mjs";
const days = parseSchedule(
  await readFile(
    new URL("../content/metaphor-schedule.md", import.meta.url),
    "utf8",
  ),
);
if (days.length !== 145)
  throw Error(
    `Expected the complete 145-day schedule; received ${days.length}.`,
  );
await writeFile(
  new URL("../src/data/metaphor-days.json", import.meta.url),
  JSON.stringify(days, null, 2) + "\n",
);
console.log(
  `Compiled ${days.length} dates and ${days.reduce((n, d) => n + d.steps.length, 0)} instructions.`,
);
