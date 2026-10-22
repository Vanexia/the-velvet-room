const guide = "https://psnprofiles.com/guide/2309-resident-evil-trophy-guide";
const item = (id, text) => ({ id, text });
const card = (
  id,
  title,
  summary,
  cue,
  warning,
  paragraphs,
  checks,
  anchor,
  extra = {},
) => ({
  id,
  title,
  summary,
  cue,
  warning,
  paragraphs,
  checks,
  source: `${guide}#${anchor}`,
  ...extra,
});

// Tailored to PriceyL33's list on 22 October 2026: 21 of 45 earned from one
// Jill clear on Easy with the best ending. The PSN sync marks later progress.
export const residentEvil = {
  id: "resident-evil",
  title: "Resident Evil",
  subtitle: "Five more runs through the mansion, each with one job.",
  platform: "PS4 / PS3 (HD Remaster)",
  defaultStatus: "planning",
  cover: "./assets/resident-evil-cover.jpg",
  guideUrl: guide,
  sourceCredit:
    "PSNProfiles trophy guide by DarkHarmonixer and UmbraCthulhu",
  verifiedOn: "22 October 2026",
  tips: [
    {
      id: "re-tip-standing",
      title: "Where you stand",
      body: "On 22 October 2026 you had 21 of 45 trophies from one Jill run on Easy with the best ending. Her story, bosses and rescue trophies are done. What remains is Chris, the harder modes, the challenge runs and three collections. Expect about 20 to 25 more hours over five runs.",
    },
    {
      id: "re-tip-slot",
      title: "Keep one clear save",
      body: "Start every new run from the same clear save and overwrite that slot when you finish. Costumes, modes and rewards build up on one save file. Check that your 2023 Jill clear save is still there before starting.",
    },
    {
      id: "re-tip-chris-easy",
      title: "Keep Chris on Very Easy",
      body: "Clearing both characters on Normal or higher unlocks a mode with a zombie that ends your game if you hit it. Your Jill clear was on Easy. Play Chris on Very Easy, and Jill on Normal or Hard, so it never unlocks until the challenge runs are done.",
    },
    {
      id: "re-tip-timer",
      title: "The clock only stops at the main menu",
      body: "The play timer keeps running in menus and on the pause screen. Save and quit to the main menu when you need a break during the timed run.",
    },
    {
      id: "re-tip-order",
      title: "Follow the runs in order",
      body: "Normal unlocks Real Survivor, and Real Survivor unlocks Invisible Enemy. Each run below also leaves you with the costumes and weapons the next one assumes.",
    },
  ],
  stages: [
    {
      id: "re-stage-chris-knife",
      label: "Run 1 · Chris, knife only",
      when: "Very Easy · best ending",
      intro:
        "Chris's first run covers his story trophies and the knife challenge. Very Easy keeps the knife practical, and both rescues are required.",
      cards: [
        card(
          "re-knife-rules",
          "What counts as using a weapon",
          "The knife challenge fails quietly if you use the wrong thing once.",
          "Before starting the run, in the options menu.",
          "Challenge rules",
          [
            "Use only the knife. No guns, lighter or kerosene, defensive items, or stomping downed zombies. Turn off automatic use of defensive items in the options so a grab never uses one for you.",
            "Allowed: the V-Jolt chemical against the plant boss, the generator against the shark, and anything an ally does for you. Cut the webs in the spider boss's lair with the knife.",
            "Do not use the flamethrower. In the final fight, the rocket launcher you are handed does not count, but only if its first shot hits. A second shot voids the challenge.",
            "With only six slots, leave guns and ammo behind. Save your clear data to the usual slot.",
          ],
          [
            item("re-knife-autouse", "Turned off automatic defensive items"),
            item("re-knife-cqc", "Earned CQC FTW"),
          ],
          "43-cqc-ftw",
          { kind: "Missable route condition" },
        ),
        card(
          "re-rebecca-hunter",
          "A scream in the mansion",
          "One rescue has a short window.",
          "After you open the door that needs the Emblem Key, when you hear a scream.",
          "Rescue location",
          [
            "Leave the room at once and go upstairs to the room where you found the Dog Whistle. Kill the Hunter attacking Rebecca with your knife before time runs out.",
            "Saving her is needed for the best ending, and it also means a boss fight at the very end.",
          ],
          [item("re-rebecca-saved", "Earned That Was Nice of You")],
          "29-that-was-nice-of-you",
          { kind: "Time-sensitive" },
        ),
        card(
          "re-chris-disks",
          "Three disks for a locked cell",
          "Freeing your partner needs three disks used on three readers.",
          "Once the laboratory is open.",
          "Item and room names",
          [
            "Collect the three MO Disks: one in the mansion's first-floor tiger statue room (needs the gold gem), one on the desk in the north-west of the lab's B2 hallway with stairs, and one near the keypad in the B2 projection room.",
            "Use them at the three readers: on the desk across from the fuel refill station, on the desk in the morgue after the vents, and in the south-east corner of the red-lit power room.",
            "Then open the confinement cell. This counts for the rescue and for the best ending.",
          ],
          [item("re-chris-cell", "Earned Sorry I Made You Wait")],
          "31-sorry-i-made-you-wait",
          { kind: "Before moving on" },
        ),
        card(
          "re-chris-ending",
          "The last fight of the best ending",
          "Your rescued ally has to survive it.",
          "When you reach the roof at the end of the run.",
          "Final battle details",
          [
            "Keep Rebecca alive through the final fight. Waiting until about 45 seconds remain on the countdown makes the rocket launcher arrive sooner. Fire it once and make it count.",
            "If she dies, reload. Only after the knife clear is safe may you load that save with other weapons.",
            "Chris's story trophies (the stone and metal object, the plant boss, the second library fight, the crypt encounter and finishing as Chris) pop on their own during this run. Finishing it also completes the trophy for clearing with both characters.",
          ],
          [
            item("re-chris-best", "Earned The Nightmare Ends"),
            item("re-chris-story", "Earned You da Man, Chris"),
            item("re-both", "Earned We're in This Together"),
          ],
          "33-the-nightmare-ends",
        ),
      ],
    },
    {
      id: "re-stage-jill-normal",
      label: "Run 2 · Jill, every room",
      when: "Normal · best ending",
      intro:
        "A slow, thorough run. Collect everything and use the time to learn routes for the timed run later.",
      cards: [
        card(
          "re-maps",
          "Every room has to turn green",
          "The map trophy needs every item and file, not just every room visited.",
          "From the start of the run; check the map after each area.",
          "Map mechanics",
          [
            "Rooms with something left in them stay peach on the map; finished rooms turn green. Clear every room before leaving each area. The hidden wardrobe in the first-floor east wing is not counted.",
            "Take the best ending: one item is inside the confinement cell. Use the lighter for the two puzzles that need it.",
            "If you missed something outside the mansion, pick the stone and metal emblems back up from behind the stairs and choose not to proceed. That lets you return to the residence, the cabin and the underground.",
          ],
          [item("re-maps-done", "Earned Every Nook and Cranny")],
          "48-every-nook-and-cranny",
          { kind: "Missable route condition" },
        ),
        card(
          "re-normal-unlocks",
          "What this clear unlocks",
          "Normal is the gate to the remaining modes.",
          "When the ending credits finish.",
          "Unlocks",
          [
            "Clearing on Normal earns the Normal trophy and unlocks Hard and Real Survivor. It is also Jill's second clear on this save, which completes her costume set. Save the clear data to the usual slot.",
          ],
          [item("re-normal", "Earned Take that, Zombies!")],
          "7-take-that-zombies",
          { kind: "Before moving on" },
        ),
      ],
    },
    {
      id: "re-stage-real-survivor",
      label: "Run 3 · Jill, Real Survivor",
      when: "Locked to Hard · nobody saved",
      intro:
        "The hardest run. Item boxes are separate, enemies are tougher and there are more of them.",
      cards: [
        card(
          "re-survivor-boxes",
          "Pick one item box and live by it",
          "Boxes are not connected, so where you leave things matters.",
          "Before you first store anything.",
          "Mode rules",
          [
            "Use the east wing storeroom box near the courtyard as your base; the light-puzzle gate creates a shortcut between the wings. Keep key items where they save the most walking. The map shows what each box holds.",
            "In this mode the door handle in the east wing stairway does not break.",
            "Run past most enemies. The Hunters that matter are the one from the cutscene and the two or three in the east wing stairway after you return from the residence. The shotgun, magnum or acid rounds handle them.",
            "This run also earns the Hard trophy.",
          ],
          [
            item("re-survivor", "Earned The Survival Horror"),
            item("re-hard", "Earned Oh, the Horror"),
          ],
          "10-the-survival-horror",
        ),
        card(
          "re-jill-alone",
          "Finish without saving anyone",
          "Two choices you made last time now go the other way.",
          "At the crypt encounter, and again in the laboratory.",
          "Ending conditions",
          [
            "When the option appears during the crypt encounter, keep the gun instead of handing it back. That gives you his special magnum, whose six rounds kill almost anything in one shot.",
            "Do not open the confinement cell in the laboratory. The early casualty does not count either way.",
          ],
          [item("re-jill-worst", "Earned Every Woman for Herself")],
          "36-every-woman-for-herself",
          { kind: "Missable route condition" },
        ),
      ],
    },
    {
      id: "re-stage-invisible",
      label: "Run 4 · Chris, Invisible Enemy",
      when: "Very Easy · nobody saved",
      intro:
        "Enemies are only visible in reflections or when they grab you. The worst ending skips the final fight entirely.",
      cards: [
        card(
          "re-invisible",
          "Run from almost everything",
          "Only a few fights are required.",
          "Before starting the mode.",
          "Required fights",
          [
            "Pick Very Easy and carry every defensive item you find. The required fights are the collared dog, the boss that appears after you place the four death masks, the plant boss, the second snake fight, the crypt encounter and the lab's final creature. Avoid the rest.",
            "Watch for drool or reflections to spot dogs, Hunters and Chimeras.",
          ],
          [item("re-invisible-done", "Earned Ghost of a Chance")],
          "11-ghost-of-a-chance",
        ),
        card(
          "re-bravo",
          "Let the snake bite",
          "One trophy needs your partner to rescue you.",
          "At the first snake encounter, in the attic.",
          "Rescue trigger",
          [
            "Let the snake poison Chris. You then play as Rebecca: collect the same serum you fetched for Richard and bring it back to Chris.",
            "This does not count as saving anyone for the ending. If it goes wrong, a second chance comes if Richard has died before the snake room: Rebecca then appears at the plant boss.",
          ],
          [item("re-bravo-done", "Earned Bravo, Rebecca")],
          "26-bravo-rebecca",
          { kind: "Missable pickup" },
        ),
        card(
          "re-chris-alone",
          "Leave everyone behind",
          "The opposite of your first Chris run.",
          "When you hear the scream after the Emblem Key door, and in the laboratory.",
          "Ending conditions",
          [
            "Ignore the scream and let the Hunter win. Leave the confinement cell closed. Saving Richard with the serum is still allowed and gets you a better shotgun later.",
            "This clear is Chris's second on this save, which completes the costume set.",
          ],
          [
            item("re-chris-worst", "Earned Every Man for Himself"),
            item("re-costumes", "Earned Passion for Fashion"),
          ],
          "35-every-man-for-himself",
          { kind: "Missable route condition" },
        ),
      ],
    },
    {
      id: "re-stage-speedrun",
      label: "Run 5 · Jill, under three hours",
      when: "Normal · any ending",
      intro:
        "Use what you learned in the earlier runs. Under three hours earns both timed trophies and both reward weapons.",
      cards: [
        card(
          "re-speed",
          "Plan the route, then run it",
          "Pick up only what the route needs.",
          "Before starting; read the guide's item route first.",
          "Route and boss list",
          [
            "Play on Normal: the reward weapons need Normal or higher. Keep weapons unequipped while moving, which makes Jill run faster.",
            "Required kills: the collared dog, the boss that appears after you place the four death masks, the plant boss, the second snake fight and the lab's final creature. The self-defence gun takes the plant boss straight to its second phase.",
            "Benchmark: if the plant boss is dead within about an hour to an hour and twenty, you are on pace. The return to the mansion, the underground and the lab take about an hour.",
            "Missing three hours but finishing under five still earns the infinite-ammo handgun, which makes a second attempt easier.",
          ],
          [
            item("re-under-five", "Earned Racing and Pacing"),
            item("re-under-three", "Earned Don't Stop Running"),
          ],
          "41-dont-stop-running",
          { kind: "Time-sensitive" },
        ),
        card(
          "re-arsenal",
          "Every weapon, both characters",
          "The weapons trophy spans both routes and both reward weapons.",
          "Check this list during runs 1 to 5.",
          "Weapon list",
          [
            "Each character's starting knife, plus the second knife in the spider boss's room. The shotgun, magnum, self-defence gun and assault shotgun (save Richard).",
            "Jill only: the grenade launcher, loaded at least once with explosive, acid and flame rounds, and the special magnum kept at the crypt encounter (run 3). Chris only: the underground flamethrower (not during the knife run).",
            "The two reward weapons from Normal clears under five and three hours.",
            "Unverified: the guide implies weapons from earlier runs on the same save count. If the trophy has not appeared after the timed run, check which weapon is missing.",
          ],
          [item("re-arsenal-done", "Earned Starsenal")],
          "46-starsenal",
        ),
      ],
    },
    {
      id: "re-stage-cleanup",
      label: "Cleanup",
      when: "Any difficulty · no saves",
      intro:
        "With the infinite rocket launcher, the last trophy is a short run.",
      cards: [
        card(
          "re-no-save",
          "Finish without saving once",
          "Choose any difficulty and never use a typewriter.",
          "After the under-three-hour clear has given you the rocket launcher.",
          "Run rules",
          [
            "Start from your clear save with the infinite rocket launcher, choose Very Easy and finish without saving. About two hours is realistic.",
            "Keep Chris's clears below Normal so the instant-game-over zombie mode stays locked.",
          ],
          [
            item("re-no-save-done", "Earned Ink is for Squids"),
            item("re-platinum", "Earned the platinum"),
          ],
          "44-ink-is-for-squids",
        ),
      ],
    },
  ],
};
