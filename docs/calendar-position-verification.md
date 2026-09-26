# Calendar position and platform labels, 26 September 2026

| Before | After | Reason |
| --- | --- | --- |
| PS5 / PS4 strip above the artwork and platform text in guide headers | Cover artwork and guide titles without platform labels | User requested simpler presentation |
| Calendar navigation called `scrollTo(0, 0)` | Date and month selection restore the current viewport and focus the selected control | Keeps the calendar in place while reading |

Navigation to the library and reference still starts at their headings. Modified clicks retain ordinary browser behaviour. Existing checklist data and reading bookmarks keep their format and IDs.

## Verification

Two new regression tests failed before implementation: date selection reset 460px to 0px, and month selection reset 380px to 0px. Both pass after the fix, including keyboard focus and subsequent library navigation.

```text
ℹ tests 30
ℹ pass 30
ℹ fail 0
Built static site in dist/
```

Chrome verification used direct background mouse clicks on visible calendar dates. On desktop and at a 390px phone viewport, switching between 12 and 13 June kept `scrollY` at `168.8000030517578` before and after. The new date's heading appeared. Locator clicks initially complicated the measurement because browser automation scrolled the target into position before clicking; direct clicks isolated the application's behaviour. A trial CSS scroll-anchoring change did not affect that automation movement and was removed.

The collection DOM contained no platform text or platform strip. Temporary viewport overrides were reset. Checks used localhost progress rather than the user's live checklist.
