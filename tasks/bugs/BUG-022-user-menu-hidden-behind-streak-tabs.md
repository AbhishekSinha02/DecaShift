# BUG-022 — Avatar dropdown menu hidden behind streak bar and subject tabs on mobile

**Severity:** High (feature unusable on mobile — menu invisible behind sticky bars)
**Found by:** User report 2026-06-03
**Status:** ✅ FIXED — commit pending
**File:** `app/ui/css/styles-auth.css` line 61

## What's wrong

The `.user-menu` dropdown (avatar tap → Journey / Settings / Sign Out) has `z-index: 100`.
After pulling the streak bar and subject tabs out of `.home-wrap` as flex siblings:
- `.streak-bar` has `z-index: 185`
- `.subject-tabs` has `z-index: 190`

The dropdown renders below (visually behind) both bars, making it invisible on mobile.

## Root cause

`z-index` stacking was set when the menu only competed with content inside `.home-wrap`.
After the layout restructure (streak/tabs as flex siblings of the header), their z-indices
(185, 190) are higher than the menu (100).

**Also found:** The click-outside listener was checking `.user-chip` (a class that does not
exist in the DOM) instead of `.avatar-ring-wrap`. This caused the menu to close immediately
on every avatar tap — the toggle never actually worked.

## Fix applied

1. `styles-auth.css`: raised `.user-menu { z-index: 100 }` → `z-index: 400`
2. `app-core.js`: updated click-outside listener to exclude `.avatar-ring-wrap` (was `.user-chip`)

## Acceptance

- Tapping avatar on mobile shows the dropdown on top of the streak bar and subject tabs.
- Tapping outside the dropdown closes it.
- Tapping the avatar again while menu is open closes it (toggle works).
