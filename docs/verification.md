# Verification and final polish

Local checks performed on 25 September 2026. The final local run reported 20 tests passed, 0 failed, followed by a successful production build.

## Automated coverage

The Node test suite covers initial rendering, reveal isolation, hidden-text absence, escaped notes, multi-game rendering and state isolation, versioned backup round trips, rejected imports, storage failure, corrupt-save preservation, actual UI events for status/checks/notes/bookmarks, and import confirmation/cancellation. The skip-to-content regression is covered by a test that failed before the fix.

## Chrome checks

Chrome remained minimised and controllable throughout these checks:

- Open the library and Metaphor companion under a repository subpath.
- Reveal an opening card, tick its checklist, reload, and observe both retained.
- Hide and reveal the same card; completion remains while other cards stay hidden.
- Activate a reveal with Enter; keyboard focus stays on the disclosure control.
- Inspect the unrevealed DOM for protected late-game text; it is absent.
- Inspect desktop and narrow phone layouts, including the backup dialog; no horizontal overflow.
- Export through the backup dialog and validate the downloaded JSON with the application parser. The Chrome download-event observer timed out, but the actual file was present in Downloads.

The extension rejected `fileChooser.setFiles` because file URL access was disabled. Browser-driven file selection was therefore not completed. Local interaction tests exercise invalid files, valid files, cancellation and confirmed restoration through the same application event handler. No extension permissions were changed.

## Final design review

| Before                                              | After                                                            | Why                                              |
| --------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------ |
| A few reveal cues named future characters or places | Neutral cues; names only in protected instructions               | The cue itself must be safe to read early        |
| Skip link changed the game hash                     | Focus moves to the current main region                           | Keyboard access must preserve context            |
| Phone body copy below 16 px in key reading areas    | Larger advice text and a 16 px notes field                       | Improve reading and avoid input zoom             |
| Cover hover applied on all devices                  | Image hover only on a fine pointer with hover support            | Avoid sticky touch hover                         |
| Repeated checkboxes called only “Noted”             | Accessible labels include the associated tip                     | Make independent controls understandable         |
| Programmatic heading focus showed a large box       | Interactive controls retain focus rings; reading headings do not | Keep keyboard orientation without visual clutter |
| Backup dialog could pass scrolling through          | Contained overscroll                                             | Keep the underlying reading position stable      |

Controls use short colour/transform feedback and reduced-motion support. Hidden details are omitted rather than blurred. Final polish retained the application state model.

## Published site

[GitHub Actions run 36186675635](https://github.com/Vanexia/the-velvet-room/actions/runs/36186675635) passed its build and deployment jobs for application commit `25c7df4`. The final test result was:

```text
ℹ tests 20
ℹ pass 20
ℹ fail 0
```

The published HTML, CSS, JavaScript and cover image each returned HTTP 200 and matched the SHA-256 of the local build. The live Chrome page displayed the library and opened Metaphor from its cover. Its eight stages and 32 reveal cards started with zero protected details rendered. A safe checkbox was checked, reloaded and then cleared. Skip to content retained the game route and focused its main region. Images loaded and the page had no horizontal overflow at the inspected desktop size.

Test progress was left at zero on the live site. The temporary phone viewport was reset, the original PSNProfiles tab was restored, and the local preview server was stopped after verification. Import through Chrome remains unverified at the file-picker boundary described above; the application import tests passed.
