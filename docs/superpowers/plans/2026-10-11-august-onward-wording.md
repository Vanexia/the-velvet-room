# August-onward wording review

**Goal:** Make every instruction from 1 August onward distinguish today's action, a prerequisite check, an optional activity and an ongoing goal.

**Scope:** The user's clarity request in this chat, 11 October 2026. Preserve the established itinerary, actual deadlines, saved checklist IDs and spoiler boundaries. Do not rewrite earlier dated instructions.

**Implementation:** Review August, September and October independently. Record proposals and complete step coverage privately, then reconcile their changes in `content/metaphor-schedule.md`. Review the selected-day party advice in `src/data/party-guide.json`. Clarify the shared reader and training labels without changing navigation, storage or layout. Regenerate `src/data/metaphor-days.json` with the existing compiler.

- [x] Review all 235 instructions across 86 dates; distinguish actions from reference material and split dense conditional paragraphs.
- [x] Review party advice for implied same-day training deadlines. Preserve pre-August party content when editing shared phases.
- [x] Make free checks appear before activities that spend time. Preserve step IDs when correcting order.
- [x] Independently review the integrated copy and any explicit default added to a previously unnamed spare activity slot.
- [x] Compare the complete pre-August schedule and all IDs with the baseline. Check selected-date rendering, spoiler isolation and checked-state retention; run the existing tests and build.

Publish through the existing Pages workflow and compare live assets with the tested build before reporting publication. Save the release proof privately.
