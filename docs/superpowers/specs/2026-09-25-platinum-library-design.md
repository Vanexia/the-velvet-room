# Platinum Library design

Date: 25 September 2026

## Purpose and agreed direction

Build a personal game and platinum companion for the user's GitHub. The home page uses game cover images to open individual companions. Start with Metaphor: ReFantazio and support additional games through a shared layout.

The user selected a complete companion with manually revealed spoilers. Advice does not unlock according to an in-game date or a reported story milestone. Prepare each game's content before adding it to the library, so the user can continue playing without requesting another page update.

One device is enough for the first version. Progress, notes and revealed sections stay in the current browser. No account or synchronisation service is needed.

## Library and navigation

- Show supported games as cover-image links with their titles and Playing, Planning or Completed status.
- Metaphor is the first supported game. Do not populate the library with games whose companion content has not been prepared.
- Each game uses the same page structure, navigation and progress controls.
- Provide a clear route back to the library and a backup control available from both views.
- Use only standard cover artwork in the library. Avoid screenshots of later events, unlocks or bosses.

## Game page

The first part is a short, readable "Things to know" area. It contains spoiler-free habits, platinum planning and warnings that remain useful throughout the game. Important missables receive a general warning here even when their exact instructions are hidden below. This helps the user decide when to reveal more detail.

The rest contains small, clearly separated sections for missables, collectibles, cleanup and subsequent-playthrough requirements. Every section is available from the start. The user chooses which details to open.

Each hidden section shows:

1. A neutral heading that does not reveal the protected information.
2. A short, spoiler-free explanation of why the section matters or when to consult it.
3. A content warning such as "Contains location and character names."
4. An explicit "Reveal details" button.

After revealing, show the section's authored instructions, relevant checklist items and source links. Keep sections small enough that reading one warning does not reveal an unrelated later event. Opening a page, scrolling, hovering, expanding navigation or marking another item complete must never reveal protected content.

The site is a platinum companion with practical precautions and reference material. It does not impose a day-by-day itinerary or require the user to enter their progress to access advice.

## Persistent reveals and progress

- Save each reveal immediately under a stable game ID and section ID.
- Remember revealed sections after navigation, page reloads and browser restarts.
- Provide "Hide again" on each revealed section and "Hide all spoilers" for the current game.
- Hiding spoilers affects visibility only. It preserves completed checklist items and notes.
- Opening a section does not mark its tasks complete. Completion is a separate checkbox action.
- Save game status, checklist completion and plain-text notes independently from visibility.
- New spoiler sections added in a later content update start hidden. Existing section IDs retain their state; substantially more revealing material gets a new ID.
- Export and import a versioned JSON backup containing all saved state, including reveals. Validate an import before applying it, and explain that importing replaces the current saved state. Offer a backup before replacement.
- Explain that saved data belongs to this browser and site address. Clearing site data or changing browsers can remove access to it; an exported backup allows restoration.
- If saving is unavailable or fails, keep the page usable and display an honest, persistent notice that changes are not being saved, with access to export.

## Spoiler boundaries

Protected text and images must not appear in the rendered document until explicitly revealed. Do not merely blur them or paint over them. Keep them out of screen-reader text, tooltips, image descriptions, page titles and link previews while hidden.

Hidden section headings must not contain story events, secret trophy names, boss names, unrevealed party members or future location names. State the kind of spoiler without stating the spoiler itself. Avoid background artwork that reveals later content.

The first version does not need a search feature. If search is added later, it must exclude unrevealed text.

Source links to complete guides must warn that the destination may contain spoilers. Do not automatically embed those pages or their previews.

This protects normal browsing of the companion. Because the site is static and its code may be public, it does not attempt to conceal game content from someone deliberately inspecting source files.

## Content preparation and sources

Use PSNProfiles for trophy and platinum guides, as requested. The Metaphor reference is https://psnprofiles.com/guide/20665-metaphor-refantazio-trophy-guide. Other sources may verify non-guide facts or provide official artwork. The earlier permission to inspect one Google Sheet does not make other guide sites acceptable sources.

Write original, concise guidance rather than copying guide prose. Record source URLs and verification dates alongside the content. Resolve conflicting facts before presenting firm requirements.

Prepare the Metaphor companion for the whole platinum journey before treating it as ready. Map the trophy requirements internally to visible advice, protected instructions or an explanation that they are earned naturally. Check every missable and subsequent-playthrough requirement for coverage. Keep this internal audit separate from the spoiler-free page headings.

Do not describe a partially researched page as complete. A complete companion means researched advice and checklist coverage throughout the game, not a reproduction of a source guide or every possible route through the game.

## Reusable implementation

Use a static HTML, CSS and JavaScript site suitable for GitHub Pages. Keep the application layout, reveal and storage behaviour separate from game content. Each game supplies its own metadata, safe advice, protected sections, checklist items and sources through the same content structure.

Adding a game requires researching and adding its content once. It should not require rebuilding the interface. The first version does not promise automatic guide generation or an in-app editor.

Keep responsibilities separate: game catalogue, companion content, state and backup handling, and interface rendering. Use relative asset paths so deployment under a GitHub repository path works.

Use a dedicated repository for the hub. Preserve the existing Dark Cloud 2 photography journal and profile-site repository. Prepare and verify the site locally before publishing it to GitHub Pages; obtain approval for the concrete publication when required by the user's outward-facing action rule.

## Visual and accessibility direction

Use a restrained, clean game library with strong cover artwork, generous spacing and clear text hierarchy. Choose a dark neutral background, warm text and one restrained accent. Avoid decorative gradients and dashboard clutter.

Make the game page comfortable for reading on desktop and a phone. Reveal controls must work with keyboard input and expose their expanded state to assistive technology. Preserve focus after reveal and hide actions. Use readable contrast, visible focus indicators and reduced-motion support. Animation is optional and only supports interaction feedback.

## Acceptance checks

- The library opens Metaphor through its cover and supports a second game's data without duplicating page logic.
- A fresh browser sees safe advice and neutral section descriptions only.
- Revealing one section does not reveal any other section.
- Reveals, checklist entries, notes and game status survive reloads.
- "Hide again" and "Hide all spoilers" preserve notes and completed items.
- Hidden details do not appear in the document, accessibility text or native page search.
- A backup restores reveals and progress; malformed or unsupported backups leave existing state intact.
- Storage failure produces a visible warning and allows an export.
- A source audit covers the whole Metaphor platinum companion and verifies the top-level missable warnings.
- Keyboard navigation, small-screen layout and deployment under a repository subpath work.

## Scope exclusions

No account, cloud sync, automatic progress detection, date-based content gates, generated-on-demand advice, notifications, social features or automatic trophy-service integration in the first version.
