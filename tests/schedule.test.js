import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseSchedule } from "../scripts/schedule.mjs";
test("calendar compiler preserves action order, time warnings and whole text", () => {
  const days = parseSchedule(
    "## June\n### 12 June\n- Free errand · Sunshade Row: Talk to the informant. Buy the report.\n- Afternoon · uses time: Sit on the bench.\n### 13 June\n- Checkpoint: Check Wisdom 2.\n## Appendix\n- Not a daily step",
  );
  assert.equal(days.length, 2);
  assert.equal(days[0].steps[0].text, "Talk to the informant. Buy the report.");
  assert.equal(days[0].steps[0].kind, "free");
  assert.equal(days[0].steps[1].kind, "time");
  assert.equal(days[1].steps.length, 1);
  assert.equal(days[1].steps[0].id, "june-13-step-01");
});
test("explicit step IDs survive inserted tasks and are not reused", () => {
  const days = parseSchedule(
    "## June\n### 12 June\n- <!-- id: june-12-new --> Free errand: New task.\n- <!-- id: june-12-step-01 --> Free errand: Original task.",
  );
  assert.equal(days[0].steps[1].id, "june-12-step-01");
  assert.equal(days[0].steps[1].label, "Free errand");
  assert.throws(() =>
    parseSchedule(
      "### 12 June\n- <!-- id: duplicate --> A: First.\n- <!-- id: duplicate --> B: Second.",
    ),
  );
});
test("the complete route covers June 2 to October 26 without dropped instructions", () => {
  const md = readFileSync(
    new URL("../content/metaphor-schedule.md", import.meta.url),
    "utf8",
  ).replace(/\r\n/g, "\n");
  const days = parseSchedule(md);
  assert.equal(days.length, 145);
  assert.equal(days[0].label, "02 June");
  assert.equal(days.at(-1).label, "26 October");
  const june12 = days.find((d) => d.id === "day-june-12");
  assert.equal(june12.steps.length, 15);
  assert.ok(
    june12.steps.some(
      (s) => s.text.includes("Ardea") && s.text.includes("OUTSIDE"),
    ),
  );
  for (const d of days) {
    const original = md.split(`### ${d.label}\n`)[1]?.split(/\n##/)[0] ?? "";
    assert.equal(
      d.steps.length,
      original.split("\n").filter((l) => l.startsWith("- ")).length,
    );
    for (const s of d.steps) assert.ok(original.includes(s.text));
  }
});
