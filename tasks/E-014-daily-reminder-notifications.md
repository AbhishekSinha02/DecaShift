# E-014: Daily Reminder + Streak-Save Nudge

**Priority:** P1 (Ritual) | **Force:** Ritual | **Type:** JS+SW | **Complexity:** L | **Status:** Pending
**Session:** E7 · **Depends on:** E-004 (streak/freeze) · **Honest constraint: no push server**

## Goal
Re-engage without infra: let the kid (or parent) set a **daily reminder time**, and use the browser
**Notification API** to nudge them — especially a **streak-save nudge** when a streak is about to break.
The return trigger we currently lack.

## Why
Retention depends on the user *remembering* to come back. Every habit app's secret is the nudge. We
can't run a push server (zero-infra constraint), but we can do meaningful local notifications.

## Honest scope (what's actually possible with no backend)
- ✅ **Permission + reminder time** stored locally; in-app banner if it's past reminder time and they
  haven't practiced today.
- ✅ **Notification on next open / while a tab is open** ("Your 5-day streak is waiting 🔥").
- ✅ **Notification Triggers API** (`showTrigger`) as progressive enhancement where supported (Chrome
  Android) for true scheduled local notifications — feature-detected, no hard dependency.
- ❌ True push when the app is fully closed on all platforms — needs a push server (out of scope; note
  it as a future paid-infra item). **Do not promise iOS background push.**

## What to build
1. **Register a minimal service worker** (none exists today) — `sw.js` with a `notificationclick`
   handler that focuses/opens the app. Keep it tiny; this also lays groundwork for future offline work.
2. **Settings → reminder**: a "Daily reminder" row (time picker + on/off) under a new or existing
   Settings section. Request `Notification.requestPermission()` on enable.
3. **Streak-save nudge**: compute from `Storage.loadStreak()` — if `lastDate` is yesterday (streak at
   risk) and no freeze will auto-cover, surface a stronger nudge ("Practice now to keep your 5-day
   streak 🔥"). Reuse E-004's freeze awareness so we don't nag when a freeze has them covered.
4. **Where supported**, schedule via Notification Triggers; otherwise fire on next app open / in-tab
   timer. Never double-fire (store `lastNudgeDate`).

## Acceptance Criteria
- [ ] A minimal `sw.js` registers and handles `notificationclick` (focuses the app)
- [ ] Settings exposes daily-reminder time + on/off; enabling requests permission gracefully
- [ ] Permission denied/blocked → in-app reminder banner fallback, no errors, no nagging
- [ ] Streak-at-risk produces a stronger, freeze-aware nudge; covered-by-freeze does NOT nag
- [ ] No notification fires twice for the same day (`lastNudgeDate` guard)
- [ ] Notification Triggers used only when feature-detected; absence degrades cleanly
- [ ] No push server, no new infra cost

## Technical Notes
- New `notify.js`: `enable(time)`, `disable()`, `maybeNudge()` (called on init + on visibility change),
  permission handling, Triggers feature-detection.
- Register SW in `init()` (`app-core.js`) guarded by `'serviceWorker' in navigator`.
- Pull streak risk from `storage.js` (extend with a `streakAtRisk()` helper using `lastDate`/`freezes`).
- Keep copy kind (consistent with D-006 / E-004 — encourage, never guilt).

## Files to Touch
- New: `app/ui/sw.js`, `app/ui/js/notify.js`
- `app/ui/js/app-core.js` — SW register + `Notify.maybeNudge()` on init/visibility
- `app/ui/js/storage.js` — `streakAtRisk()` helper
- `app/ui/screens/screen-settings.html`, `app/ui/js/app-settings.js` — reminder time + toggle
- `app/ui/css/styles-app.css` — reminder row + in-app nudge banner

## Definition of Done
A kid (or parent) can set a reminder, and a streak about to break produces a kind, freeze-aware nudge —
within the limits of no-backend web notifications, documented honestly. Commit the SW + permission first,
then the settings UI, then the streak-save logic.
