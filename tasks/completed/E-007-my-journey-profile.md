# E-007: "My Journey" Profile Screen

**Priority:** P1 (Identity) | **Force:** Identity | **Type:** UI+JS | **Complexity:** M | **Status:** ✅ Done (5156fab, 3a8cb6e, 9c0c052)
**Session:** E3 · **Depends on:** E-005 (XP/level), E-006 (avatar) · **Absorbs:** D-012, D-017, P3-T003 dashboard

## Goal
Give the kid a home for their identity — a **"My Journey"** screen showing the evolving avatar, level
and XP-to-next, streak, badges earned vs. locked, concept mastery tiers, and a **journey replay** of
their growth arc. This is the screen they show their parent and screenshot for friends.

## Why
Identity needs a surface. XP and avatar (E-005/E-006) are spread thin across header/result; Journey
concentrates them into one proud, shareable self-portrait — the payoff that makes the daily grind feel
like it's building toward something visible.

## What to build
1. **Hero**: large avatar at current stage (E-006) inside the level ring, level + XP progress bar,
   streak with banked freezes (E-004).
2. **Stats band**: total questions, avg accuracy, sessions, time practiced (data already tracked).
3. **Mastery map**: per-concept tiers — folds in **D-012** ("Your best: 9/10 · 3 sessions") and
   **D-017** (tier badges: Learning / Developing / Solid / Mastered). Reuse that logic here.
4. **Badges grid**: earned badges bright, unearned as greyed silhouettes (curiosity driver). If the
   badge system isn't built yet, render streak/level milestones as the first badges.
5. **Journey replay**: a 6–10s inline animation walking the avatar through the stages it has reached
   (locked strategic decision). Keep it CSS/JS, skippable, reduced-motion safe.
6. **Share**: one-tap "share my journey" card (reuse D-004/D-016 share-card plumbing).

## Acceptance Criteria
- [ ] Reachable from header avatar tap and the nav (drawer on phone, rail on laptop)
- [ ] Shows avatar at correct stage, level, XP-to-next, streak + freezes
- [ ] Stats band populated from real session history
- [ ] Per-concept "your best" + mastery tier shown (D-012 + D-017 satisfied here)
- [ ] Badges grid with locked silhouettes
- [ ] Journey replay plays, is skippable, respects reduced-motion
- [ ] "Share my journey" produces a card; responsive on phone/tablet/laptop
- [ ] No remote dependency; renders offline

## Technical Notes
- New screen `screens/screen-journey.html` + render logic in `app-home.js` or a new `app-journey.js`.
- Reuse: `xp.levelFromXP`, `avatar.renderAvatar`, `Storage.loadSessions`, streak helpers, existing
  share-card builder from the Delight Stack.
- Mastery tier logic from D-017 should live in one shared helper so home rows (D-009/D-017) and Journey
  agree. If duplicating, extract to `mastery.js`.
- Register the screen in the screen-switcher used by `state.currentScreen`.

## Files to Touch
- New: `app/ui/screens/screen-journey.html`, optionally `app/ui/js/app-journey.js`
- `app/ui/js/app-core.js` — screen routing for `'journey'`
- `app/ui/js/app-home.js` — entry points (avatar tap, nav)
- `app/ui/css/styles-app.css` — journey layout, mastery map, replay animation

## Definition of Done
The kid has one screen that says "this is how far I've come" — proud, shareable, and accurate. Closes
D-012, D-017, and the intent of P3-T003. Commit hero+stats first, then mastery+badges, then replay+share.
