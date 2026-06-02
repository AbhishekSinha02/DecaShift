# BUG-022 — Navigation drawer and avatar dropdown hidden behind streak bar / header on mobile

**Severity:** High (drawer and avatar menu unusable on mobile)
**Found by:** User report 2026-06-03
**Status:** ✅ FULLY RESOLVED — commits 43567e9 → accb4bf

## What was wrong

After pulling streak bar and subject tabs out of `.home-wrap` as flex siblings of the header,
two menus broke on mobile:

1. **Avatar dropdown** (`.user-menu`, z-index: 100) appeared behind streak bar (185) and subject tabs (190).
2. **Navigation drawer** (`.app-drawer`, z-index: 300) appeared behind the header and streak bar despite having a higher z-index number.

## Root causes

**Avatar dropdown:** z-index 100 < streak bar 185 < subject tabs 190. Simple fix: raise to 400.

**Drawer (harder):** `.app-drawer` was inside `.home-wrap` which has `overflow-y: auto; overflow-x: hidden`. On mobile WebKit, a double-overflow container can interfere with `position:fixed` stacking even when the z-index should theoretically win. Additionally, leftover `z-index: 185/190` on streak-bar and subject-tabs (carried over from when they were `position:sticky`) created unnecessary stacking contexts.

**Also found:** click-outside listener for avatar menu checked `.user-chip` (class doesn't exist) instead of `.avatar-ring-wrap` — menu closed immediately on every tap, making it unusable even before the z-index issue.

## Complete fix (applied across 4 commits)

1. `styles-auth.css`: `.user-menu { z-index: 100 }` → `z-index: 400`
2. `app-core.js`: click-outside listener `.user-chip` → `.avatar-ring-wrap`
3. `styles-app.css`: removed `z-index: 185` from `.streak-bar` and `z-index: 190` from `.subject-tabs` (no longer needed — they're plain flex items, not sticky)
4. `screen-home.html`: moved `.app-drawer` out of `.home-wrap` to be a direct child of `#screen-home`
5. `styles-app.css`: `.app-drawer { z-index: 300 }` → `z-index: 9999`

## Acceptance ✅

- Navigation drawer opens above header, streak bar, and subject tabs on mobile.
- Avatar dropdown appears above streak bar and subject tabs.
- Both menus close correctly on tap-outside.
- Avatar toggle (tap to open, tap to close) works.
