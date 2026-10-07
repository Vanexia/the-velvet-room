# Route direction checks

**Maintenance record. Contains details beyond a first-time player's current date. Read the website one day at a time.**

Checked 7 October 2026 after the player reported an incorrect 29 June hand-in. This pass covers the reported error, related generic help, and quest pickup/hand-in/navigation directions from 29 June through 12 July. The matching 15 July hand-in was also clarified. It is not a new audit of all 145 dates, a verification of every bond slot or virtue total, or a full-game playtest.

## Cause

The original Goonan sheet's 29 June row did not give a location for Promising Returns. Our first personal revision added the hand-in without a street. Our subsequent beginner expansion (`work/metaphor-audit/beginner-edition/expand.mjs` in the parent workspace) introduced the unsupported Sunlumeo Street direction. The website inherited it. The player completed the quest at the inn and reported the mistake.

Two general instructions repeated the faulty assumption that every hand-in goes back to the original requester and every bounty contact is inside a Recruitment Centre. Both the Markdown introduction and the website's help now distinguish the named hand-in recipient from the requester, and direct bounties to a Recruiter Dispatcher.

## Evidence and changes

| Step IDs | Checked fact and correction | Supporting sources |
| --- | --- | --- |
| `june-29-step-02`, `june-29-step-03` | Promising Returns is completed through Fabienne behind the counter at the Hushed Honeybee Inn, Sunshade Row, Grand Trad. The subsequent Maria rank 2 outing is a separate activity requiring Tolerance 2; its conversation starts with Fabienne. | [Quest steps, Game8](https://game8.co/games/Metaphor-ReFantazio/archives/478536), [quest steps, Neoseeker](https://www.neoseeker.com/metaphor-refantazio/guides/Promising_Returns), [Maria bond, NGB](https://nightlygamingbinge.com/metaphor-refantazio-maria-bond-guide/), plus the player's direct hand-in report |
| `june-29-step-01`, `july-01-step-01`, `july-05-step-01`, `july-07-step-01` | Martira's Recruiter Dispatcher is outdoors in Thoroughfare Square. Name the quest as well as its target; bounty menu labels can differ from quest-log titles. Do not send the player searching for a Martira Recruitment Centre building. | [June 29 pickup, GameFAQs](https://gamefaqs.gamespot.com/xbox-series-x/409958-metaphor-refantazio/faqs/81526/the-imps-den-and-the-mausoleum), [bounty report, NGB](https://nightlygamingbinge.com/metaphor-refantazio-new-king-of-the-imps-bounty-guide/), [second bounty, Game8](https://game8.co/games/Metaphor-ReFantazio/archives/478534) |
| `june-29-step-01`, `july-06-step-04`, `july-07-step-01` | Hatching a Plan is accepted from and returned to the Gloomy Youth in Thoroughfare Square. The Practical Pigeon Parcel is in Komero's Key Items shop category. | [Quest steps, Game8](https://game8.co/games/Metaphor-ReFantazio/archives/478540), [quest steps, NGB](https://nightlygamingbinge.com/metaphor-refantazio-hatching-a-plan-quest-guide/) |
| `june-29-step-04`, `july-01-step-04` | Name the Spirited Youth at the cliff-jumping activity on the northwestern side of Thoroughfare Square. This direction check does not establish guaranteed jump success at a particular Courage rank. | [Martira area guide, NGB](https://nightlygamingbinge.com/metaphor-refantazio-martira-old-castle-town-walkthrough/) |
| `july-01-step-03` | Retain the original rank 3 date, with its dependence on rank 2 completed on 29 June made explicit. GameWith lists a two-day gap after rank 2, supporting this timing. Check the actual rank-up icon before using time. | [Maria requirements, GameWith](https://gamewith.jp/metaphor/466163), Japanese table under rank conditions |
| `july-01-step-02`, `july-11-step-03`, `july-12-step-01` | Name the Resentful Noble on Sunlumeo Street south of the igniter shop, and the Nervous Soldier at Catacombs Entrance. Accept the noble's quest after the scheduled bounty report, then the soldier's before entering. The soldier can receive the Mortaskulls before the dungeon outing ends; make the following day's repeat visit conditional. | [A Haunted Heirloom, Neoseeker](https://www.neoseeker.com/metaphor-refantazio/guides/A_Haunted_Heirloom), [noble landmark, Gamer Guides](https://www.gamerguides.com/metaphor-refantazio/guide/side-quests/grand-trad/a-haunted-heirloom), [Skullduggery, Gamer Guides](https://www.gamerguides.com/metaphor-refantazio/guide/side-quests/grand-trad/skullduggery), [Skullduggery hand-in, NGB](https://nightlygamingbinge.com/metaphor-refantazio-skullduggery-quest-guide/) |
| `july-06-step-04` | Providing a Spark completes in the automatic Komero event, which starts Neuras' bond and unlocks Gunner. Clarify the event before the separate village purchases; do not invent a village quest NPC. | [Travel sequence, GameFAQs](https://gamefaqs.gamespot.com/ps4/410855-metaphor-refantazio/faqs/82036/7-5-idlesday-to-7-9-metalsday-step-by-step), [quest steps, Neoseeker](https://www.neoseeker.com/metaphor-refantazio/guides/Providing_a_Spark) |
| `july-09-step-01`, `july-15-step-01` | Name the Classy Woman inside Visca Alba Tavern, near the guest-room doorway, for both the request and its bread hand-in. | [Quest steps, NGB](https://nightlygamingbinge.com/the-queen-of-cuisine-heart-metaphor-refantazio-guide/), [doorway and hand-in, Neoseeker](https://www.neoseeker.com/metaphor-refantazio/guides/The_Queen_of_Cuisine_Heart) |

Some pages were checked through indexed text when direct retrieval was blocked. Multiple websites repeating a claim is corroboration, not evidence of independent gameplay testing. No trophy requirements were changed; PSNProfiles remains the trophy authority.

## Limits and conflicts

- Sources differ on the earliest availability and prerequisite wording for A Haunted Heirloom. The route already reports The New King of the Imps before collecting it. This pass retains that supported order and does not generalise its trigger to any first bounty.
- Some English follower tables claim later Maria prerequisites. The independent [GameWith requirement table](https://gamewith.jp/metaphor/466163) instead specifies two days between ranks 2, 3, 4 and 5, supporting the source route's early sequence. Retained those dates, added the prior-rank check, and did not import the conflicting hard-date/drawing claims. No dated gameplay footage or end-to-end save was verified; this check does not certify every scheduled bond date.
- Existing tests establish that all dates, step text, ordering and saved IDs survive the website conversion. They cannot detect invented directions such as the original Sunlumeo Street error. Keep source checks separate from software verification.

## Maintenance rule

When expanding an instruction, source the added NPC, district, building, interaction and time cost. Record the evidence against its permanent step ID. If a source omits a detail, do not infer it from a different quest or city. Distinguish pickup, item collection, hand-in and bond activity before assigning time slots. Keep conflicting claims visible in this record until resolved.

## Website verification

Local verification on 7 October 2026: 30 tests passed, production build completed, and `git diff --check` passed. A comparison against the previous published data confirmed the same 145 dates and 422 instruction IDs in the same order; 15 instructions changed. A rendered June 29 check confirmed the Fabienne/Sunshade Row directions, the separate bond step, retention of an existing hand-in checkbox, and absence of later dates' instructions. These checks validate delivery and saved-progress compatibility, not the game facts themselves.
