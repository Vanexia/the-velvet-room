export function parseSchedule(markdown) {
  const days = [];
  let current;
  for (const line of markdown.split(/\r?\n/)) {
    const heading = /^### (\d{2}) (June|July|August|September|October)$/.exec(
      line,
    );
    if (heading) {
      const [, number, month] = heading;
      current = {
        id: `day-${month.toLowerCase()}-${number}`,
        label: `${number} ${month}`,
        month,
        number: Number(number),
        steps: [],
      };
      days.push(current);
    } else if (line.startsWith("## ")) current = null;
    else if (current && line.startsWith("- ")) {
      const explicit = /^- <!-- id: ([a-z0-9-]+) --> /.exec(line);
      const original = explicit
        ? line.slice(explicit[0].length)
        : line.slice(2);
      const colon = original.indexOf(":");
      const label =
        colon > -1 && colon < 100 ? original.slice(0, colon) : "To do";
      const text =
        label === "To do" ? original : original.slice(colon + 1).trim();
      const kind = /uses time|departure uses time|dungeon outing/i.test(label)
        ? "time"
        : /optional/i.test(label)
          ? "optional"
          : /check|before moving|preparation/i.test(label)
            ? "check"
            : /free/i.test(label)
              ? "free"
              : /night/i.test(label)
                ? "night"
                : /afternoon/i.test(label)
                  ? "time"
                  : /story/i.test(label)
                    ? "story"
                    : "task";
      current.steps.push({
        id:
          explicit?.[1] ??
          `${current.id.slice(4)}-step-${String(current.steps.length + 1).padStart(2, "0")}`,
        label,
        text,
        kind,
      });
    }
  }
  if (
    new Set(days.map((d) => d.id)).size !== days.length ||
    days.some((d) => !d.steps.length)
  )
    throw Error("Duplicate or empty schedule date.");
  const stepIds = days.flatMap((d) => d.steps.map((s) => s.id));
  if (new Set(stepIds).size !== stepIds.length)
    throw Error("Duplicate instruction ID.");
  return days;
}
