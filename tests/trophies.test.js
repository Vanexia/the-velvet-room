import { test } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import { buildTrophyFile, trophySlug } from "../scripts/trophy-sync.mjs";
import { cardTrophySlug, parseTrophies } from "../src/trophies.js";
import { metaphor } from "../src/data/metaphor.js";
import { renderGame } from "../src/render.js";
import { renderCollection } from "../src/library-render.js";
import { createState } from "../src/state.js";
import { mountApp } from "../src/app.js";

const games = [{ id: "metaphor", titlePattern: /Metaphor:?\s*ReFantazio/i }];
function fakeApi({ failAuth = false } = {}) {
  return {
    async exchangeNpssoForAccessCode(npsso) {
      if (failAuth) throw Error(`bad token ${npsso}`);
      return "code";
    },
    async exchangeAccessCodeForAuthTokens() {
      return { accessToken: "token" };
    },
    async getUserTitles() {
      return {
        trophyTitles: [
          { trophyTitleName: "Other Game", npCommunicationId: "NPWR1", npServiceName: "trophy2", trophyTitlePlatform: "PS5" },
          { trophyTitleName: "Metaphor: ReFantazio", npCommunicationId: "NPWR4", npServiceName: "trophy", trophyTitlePlatform: "PS4" },
          { trophyTitleName: "Metaphor: ReFantazio", npCommunicationId: "NPWR5", npServiceName: "trophy2", trophyTitlePlatform: "PS5" },
        ],
      };
    },
    async getTitleTrophies(_auth, id, _group, options) {
      assert.equal(id, "NPWR5");
      assert.equal(options.npServiceName, "trophy2");
      return {
        trophies: [
          { trophyId: 0, trophyName: "At Your Own Risk", trophyType: "bronze" },
          { trophyId: 1, trophyName: "Hey, Listen!", trophyType: "bronze" },
          { trophyId: 2, trophyName: "UNEARNED_SECRET_NAME", trophyType: "gold" },
        ],
      };
    },
    async getUserTrophiesEarnedForTitle() {
      return {
        trophies: [
          { trophyId: 0, earned: true, earnedDateTime: "2026-10-21T19:00:00Z" },
          { trophyId: 1, earned: true, earnedDateTime: "2026-10-20T19:00:00Z" },
          { trophyId: 2, earned: false },
        ],
      };
    },
  };
}

test("trophy names and guide anchors produce the same slug", () => {
  assert.equal(trophySlug("Hey, Listen!"), "hey-listen");
  assert.equal(trophySlug("I'm a Member of S.T.A.R.S."), "im-a-member-of-stars");
  assert.equal(trophySlug("Platinum Splattin' 'Em!"), "platinum-splattin-em");
  assert.equal(trophySlug("Teamwork Makes the Dream Work"), "teamwork-makes-the-dream-work");
  assert.equal(cardTrophySlug({ source: "https://x.test/guide#46-at-your-own-risk" }), "at-your-own-risk");
});

test("the sync lists only earned trophies from the PS5 title", async () => {
  const [file] = (await buildTrophyFile(fakeApi(), "npsso", games, new Date("2026-10-22T00:00:00Z"))).games;
  assert.equal(file.status, "ok");
  assert.equal(file.total, 3);
  assert.deepEqual(file.earned.map((t) => t.slug), ["hey-listen", "at-your-own-risk"]);
  assert.doesNotMatch(JSON.stringify(file), /UNEARNED_SECRET_NAME/);
});

test("a rejected sign-in token is reported without echoing it", async () => {
  const file = await buildTrophyFile(fakeApi({ failAuth: true }), "SECRET_NPSSO", games);
  assert.equal(file.games[0].status, "auth-failed");
  assert.doesNotMatch(JSON.stringify(file), /SECRET_NPSSO/);
});

test("published trophy data is validated before display", () => {
  assert.equal(parseTrophies({ version: 1, game: "unknown", earned: [] }, [metaphor]), null);
  const parsed = parseTrophies(
    { version: 1, game: "metaphor", status: "ok", total: 50, earned: [{ slug: "x", name: "<img onerror=1>" }, { slug: 5 }] },
    [metaphor],
  );
  assert.equal(parsed.earned.length, 1);
});

test("earned trophies mark their reminder cards and the library count", () => {
  const trophies = parseTrophies(
    { version: 1, game: "metaphor", status: "ok", total: 50, syncedAt: "2026-10-22T00:00:00Z", earned: [{ slug: "at-your-own-risk", name: "At Your Own Risk", earnedAt: "2026-10-21T19:00:00Z" }] },
    [metaphor],
  );
  const state = createState([metaphor]);
  const html = renderGame(metaphor, state.games.metaphor, trophies);
  assert.equal((html.match(/Earned on PSN/g) ?? []).length, 1);
  assert.match(html, /1 of 50 trophies earned on PSN/);
  assert.match(renderCollection([metaphor], state, { metaphor: trophies }), /1 of 50 trophies earned on PSN/);
});

test("an expired token shows a renewal note in the daily reader", () => {
  const w = new Window({ url: "http://localhost:4173/#game/metaphor/day-july-25" });
  try {
    w.document.body.innerHTML =
      '<div id="storage-warning" hidden></div><main id="app"></main><div id="toast"></div><dialog id="backup-dialog"><div id="backup-content"></div></dialog>';
    const app = mountApp(w, [metaphor]);
    app.setTrophies({ version: 1, game: "metaphor", status: "auth-failed", earned: [] });
    assert.match(w.document.getElementById("app").textContent, /needs a new sign-in token/);
  } finally {
    w.close();
  }
});

test("every Resident Evil card links to one of its real trophies", async () => {
  const { residentEvil } = await import("../src/data/resident-evil.js");
  // The 45 trophy names on the PS4/PS3 list, as PSN shows them.
  const names = ["Platinum Splattin' 'Em!", "Like Taking Candy from a Baby", "Not in the Mood to Die", "Take that, Zombies!", "Oh, the Horror", "We're in This Together", "The Survival Horror", "Ghost of a Chance", "Not Just Any Object", "Herbicide", "Written Word is Dead", "An End to a Poor Girl's Misery", "You da Man, Chris", "Grave Digger", "The Key Master", "Giant Snake Got Nothin'", "Where the Magic Happens", "Alpha Team's Finest", "Get Used To It", "First Kills Are Special", "Not Taking Any Chances", "Who's the Hunter Now?", "Bravo, Rebecca", "What a Great Guy", "Delaying the Inevitable", "That Was Nice of You", "Trust Him", "Sorry I Made You Wait", "Sorry About the Wait", "The Nightmare Ends", "I'm a Member of S.T.A.R.S.", "Every Man for Himself", "Every Woman for Herself", "Seeing Red", "Not Waiting to Exhale", "Deep Sixed", "Spider Sense", "Don't Stop Running", "Racing and Pacing", "CQC FTW", "Ink is for Squids", "Break Out the Marshmallows!", "Starsenal", "Passion for Fashion", "Every Nook and Cranny"];
  assert.equal(names.length, 45);
  const slugs = new Set(names.map(trophySlug));
  for (const card of residentEvil.stages.flatMap((s) => s.cards))
    assert.ok(slugs.has(cardTrophySlug(card)), card.id);
});

test("the library renders both games with their own trophy counts", async () => {
  const { games: all } = await import("../src/data/index.js");
  const state = createState(all);
  const re = parseTrophies({ version: 1, game: "resident-evil", status: "ok", total: 45, earned: [] }, all);
  const html = renderCollection(all, state, { "resident-evil": re });
  assert.match(html, /Resident Evil/);
  assert.match(html, /0 of 45 trophies earned on PSN/);
});
