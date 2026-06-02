# BUG-031 — Journey lost its vibrant sections (badges/album/replay hidden behind teasers)

**Severity:** 🟠 Medium (key engagement screen gutted)
**Status:** ✅ Fixed 2026-06-02
**Found by:** user ("my journey was earlier nice and vibrant, it completely changed")

---

## Symptom
The Journey screen used to show the rich sections — badges grid (locked/disabled
for unearned), sticker album, and growth replay (with the starter avatar) — and
they were replaced by three static "coming soon" teaser cards.

## Root cause — a previous "fix" that wasn't
Commit `11cdd68` (**BUG-016 — "Journey empty sections replaced with teaser cards"**)
assumed `#journey-badges`, `#journey-album`, `#journey-replay` were empty
placeholders and:
- added `class="hidden"` to all three, and
- inserted a `#journey-teasers` block of static "coming soon" cards.

But those divs were **already wired up** by earlier commits (E-007 badges grid +
growth replay, E-011 sticker album) — `app-journey.js` populates all of them
(`_renderJourneyBadges`/`_renderJourneyAlbum`/`_renderJourneyReplay`/`_renderJourneyMastery`).
So BUG-016 hid the real, working sections and showed fake teasers in their place.

## Fix
`screen-journey.html`: removed the `#journey-teasers` teaser block and the
`hidden` class from `#journey-badges` / `#journey-album` / `#journey-replay`, so
`app-journey.js` renders them again. No JS change needed (the render logic was
never broken — it was drawing into hidden divs).

Also: screen HTML is fetched at runtime and was NOT covered by the index.html
`?v=` cache-bust, so screen changes could be stuck behind a stale cache. Added
`?v=BUILD` to the `_loadScreen` fetch URLs (app-core.js); build bumped to
`20260602e`.

## Verify
Screenshot `test/screenshots/journey-restored.png`: hero (starter "Spark" avatar),
stats band, Concept Mastery, "Badges 0/9" locked grid, album + replay all render;
no `#journey-teasers`; 0 page errors.

## Cleanup deferred
The now-unused `.journey-coming-soon-grid` / `.journey-teaser*` CSS in
styles-app.css is dead but harmless — sweep it in ENH-010.
