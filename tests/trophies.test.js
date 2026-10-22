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

const game = { id: "metaphor", titlePattern: /Metaphor:?\s*ReFantazio/i };
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
  assert.equal(trophySlug("Teamwork Makes the Dream Work"), "teamwork-makes-the-dream-work");
  assert.equal(cardTrophySlug({ source: "https://x.test/guide#46-at-your-own-risk" }), "at-your-own-risk");
});

test("the sync lists only earned trophies from the PS5 title", async () => {
  const file = await buildTrophyFile(fakeApi(), "npsso", game, new Date("2026-10-22T00:00:00Z"));
  assert.equal(file.status, "ok");
  assert.equal(file.total, 3);
  assert.deepEqual(file.earned.map((t) => t.slug), ["hey-listen", "at-your-own-risk"]);
  assert.doesNotMatch(JSON.stringify(file), /UNEARNED_SECRET_NAME/);
});

test("a rejected sign-in token is reported without echoing it", async () => {
  const file = await buildTrophyFile(fakeApi({ failAuth: true }), "SECRET_NPSSO", game);
  assert.equal(file.status, "auth-failed");
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
