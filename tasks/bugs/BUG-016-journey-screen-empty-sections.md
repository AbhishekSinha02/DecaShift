# BUG-016 — Journey screen has 4 empty sections visible to users

**Severity:** High
**Found by:** UX Audit 2026-06-03 (My Journey)
**File:** `app/ui/screens/screen-journey.html` lines 32-35

## What's wrong

```html
<div id="journey-mastery"></div>   <!-- completely empty -->
<div id="journey-badges"></div>    <!-- completely empty -->
<div id="journey-album"></div>     <!-- completely empty -->
<div id="journey-replay"></div>    <!-- completely empty -->
```

When a user opens "My Journey" they see:
1. Avatar + level ring ✓
2. Level / XP bar ✓
3. Stats band ✓
4. ...then nothing. Just empty space.

The four most engaging sections — Mastery map, Badges, Sticker Album, Journey Replay — are placeholder divs that render blank. The sticker album and collectibles modules exist in code (`collectibles.js`) but are not wired to Journey screen. The badges and mastery divs are not populated anywhere in `app-journey.js`.

**User impact:** "My Journey" feels abandoned. A student who opens it expecting progress tracking sees a level number and a blank lower half. This is a trust-destroying moment for both students and parents watching over their shoulder.

## Options

### Option A — Quick hide (immediate fix, 10 min)
Remove/hide the empty divs until they're implemented. Don't show sections that have no content.

```html
<!-- Remove these lines until implemented: -->
<!-- <div id="journey-mastery"></div> -->
<!-- <div id="journey-badges"></div>  -->
<!-- <div id="journey-album"></div>   -->
<!-- <div id="journey-replay"></div>  -->
```

### Option B — Stub with "Coming soon" (better, 15 min)
Replace empty divs with teaser cards:
```html
<div class="journey-coming-soon">
  <div class="jcs-icon">🏅</div>
  <div class="jcs-title">Badges coming soon</div>
  <div class="jcs-sub">Earn badges for streaks, accuracy, and consistency.</div>
</div>
```

### Option C — Wire sticker album (proper fix, 1 session)
`collectibles.js` already has `getAll()` and grant logic. Wire it to `#journey-album` to show the student's current sticker collection.

## Acceptance

Opening "My Journey" either shows populated content OR gracefully hides empty sections. No blank white space.

## Related

- P3-T004 (avatar growth system) — partially done
- P3-T005 (gamification badges) — not started
- Collectibles module — exists, not wired to Journey
