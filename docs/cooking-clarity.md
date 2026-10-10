# Cooking directions from 13 July

10 October 2026. The reader was on 13 July, step 2, and requested clearer cooking instructions from that date onward. This pass changes 49 existing instructions. It does not change the first 41 dates, any date or instruction ID, or the scheduled main activities.

## Reading changes

| Before | After | Why |
| --- | --- | --- |
| Shopping, recipe quantities and fallback advice in one paragraph | Plain-text detail lists beneath the existing step | Each shop, recipe or decision can be read separately |
| Supplies for several recipes presented together | Inventory targets, with reserved ingredients and conditional extras named | Avoid buying a full list twice or using another recipe's supplies |
| A skipped recipe mentioned without a clear next action | Keep the scheduled bond or reading activity; note the uncooked dish | Random ingredients should not displace the calendar's main activity |
| Later recovery instructions relied on an earlier reminder | Delayed hand-in repeated on its actual date | The reader sees one date at a time |
| Existing single-checkbox steps | Same checkbox IDs; details are not extra tasks | Preserve saved progress and completion counts |

The list style uses the reader's existing text colours and checked-step styling, with wrapping, an 8px gap between items and the existing mobile text size. Semantic `ul`/`li` markup and escaped text require no new interaction or animation.

## Content checks

Three reviewers checked July, August and September/October separately, then cross-reviewed the integrated content. The changes include:

- 13 July clearly starts with Benevolent Bread, its three ingredients, when to cook it and the serving to save. The Speed Cooking prerequisite applies to all cooking that must precede another activity.
- Shopping quantities mean total inventory, including ingredients already held. Later shopping includes extra ribs or fish when an earlier recipe remains unfinished.
- Missing random bugs do not block the planned journey, reading or bond.
- The delayed cake branch now cooks first, hands in on 28 September and uses the reward fish on a later journey. The hand-in is present on 28 September itself.
- Fishing and cleaning for bait remain activities that use time. Speed Cooking is one dish per available afternoon/night period, not unlimited cooking.

### Recipe and ingredient evidence

The recipe tables were checked against [RPG Site's ingredients and cooking reference](https://www.rpgsite.net/guide/16414-metaphor-refantazio-ingredient-list-acooking-guide), [GameFAQs' recipes and food ingredients](https://gamefaqs.gamespot.com/xbox-series-x/409958-metaphor-refantazio/faqs/81526/recipes-and-food-ingredients), and individual recipe records from Gamer Guides and Game8.

Three disagreements were resolved in favour of the corroborated quantities already used by this route: **Steadfast Stew needs 1 Briny Salt**, **Almighty Golden Stew needs 1 Limp Goldfish**, and **Indestructible Honey Cake needs 2 White Peach Turnips**. The latter also agrees with [Altema's recipe table](https://altema.jp/metaphor/ryori). Do not substitute the conflicting counts from isolated guide tables.

Carry-forward checks cover July's beans/spice/meat/milk, July 29's conditional salt and milk, August's ribs/tuna/goldfish, September's flour and five honey jars, and the final recipe's three reserved shrooms. These are route assumptions, not a claim about the reader's current inventory; the copy tells them to check what they hold.

Specific supporting records:

- [Benevolent Bread recipe](https://www.gamerguides.com/metaphor-refantazio/database/key-items/recipes/benevolent-bread-recipe) and [the early cuisine request](https://www.siliconera.com/how-to-complete-the-queen-of-cuisine-heart-quest-in-metaphor-refantazio/).
- [Fishing prompt and reward table](https://gamefaqs.gamespot.com/xbox-series-x/409958-metaphor-refantazio/faqs/81526/fishing), cross-checked against [Game8's fishing reference](https://game8.co/games/Metaphor-ReFantazio/archives/479422).
- [Runner activities and cleaning rewards](https://gamefaqs.gamespot.com/ps5/410470-metaphor-refantazio/faqs/81508/gauntlet-runner-activities).
- [Late cuisine request and reward](https://earth.gamerguides.com/metaphor-refantazio/guide/side-quests/grand-trad/the-queen-of-cuisine-soul).

[PSNProfiles](https://psnprofiles.com/guide/20665-metaphor-refantazio-trophy-guide) remains the trophy authority. This pass uses the previously captured 7 October audit evidence for the 21 recipes, final recipe unlock and Speed Cooking; it does not claim a fresh direct read of PSNProfiles or an independently played route. Postflight fishing stays conditional on confirming that the fishing point is available.

## Verification observed in this session

The two new parser/reader tests first failed for missing list support, then passed with the implementation. Full-suite and build output:

```text
Compiled 145 dates and 433 instructions.
ℹ tests 32
ℹ pass 32
ℹ fail 0
Built static site in dist/
```

A separate mounted-app check using the real guide data produced:

```text
41 dates before 13 July unchanged; 145 dates and 433 stable instruction IDs preserved; 49 instructions rewritten.
Seven real dates rendered with ordered detail lists, one checkbox per existing step, and existing plus new checks persisted across navigation.
```

That check covers 13 July, 1 and 21 August, 13/27/28 September and 18 October. The new reader test also checks literal HTML escaping and that another day's ingredient text is absent. Existing calendar scroll/focus and backup tests pass. An independent technical review found no parser, rendering, state or CSS regression.

Chrome was not exposed by the connected browser controls. Browser screenshot/layout verification is therefore unverified; the rendered DOM and application events above were exercised in Happy DOM. The in-app browser was not used because of the user's Windows stability restriction. Deployment and live-asset verification follow the release commit.
