# E-005: XP + Levels Engine + Level-Up Moment

**Priority:** P1 (Identity) | **Force:** Identity | **Type:** JS+UI | **Complexity:** M | **Status:** ✅ Done (f49a725 engine, f2583a1 surfacing)
**Session:** E3 · **Depends on:** none · **Unblocks:** E-006 (avatar), E-007 (journey), Wave-2 rewards

## Goal
Introduce the **currency of growth**: every meaningful action earns **XP**, XP accumulates into
**Levels**, and crossing a level fires a satisfying **level-up moment**. This is the single spine the
avatar evolution, profile, mystery rewards, and leaderboard all spend against — build it once, cleanly.

## Why
Right now effort evaporates into a score and disappears. Kids stay in games because effort *accrues*
into a number that only goes up. XP is the progress-fantasy backbone; without it "see yourself grow"
has nothing to measure.

## What to build
1. **XP rules** (tune later, keep simple + transparent):
   - Correct answer: +10 XP · wrong but attempted: +2 XP (effort still counts) · set completed: +25 XP
   - Flash drill completed: +15 XP · daily GK: +10 XP · daily quest complete: +50 XP bonus
   - Optional accuracy bonus (e.g. +20 for 100% set). No XP loss, ever.
2. **Level curve**: a gentle increasing curve (e.g. `xpForLevel(n) = 100 * n * (n+1) / 2` or similar) so
   early levels come fast (dopamine) and later ones stretch. Expose `levelFromXP(totalXP)` →
   `{ level, xpIntoLevel, xpForNext, pct }`.
3. **Level-up moment**: when a session pushes total XP across a threshold, a celebratory overlay
   ("Level 7! ⬆") with the avatar (E-006) if present. Reuse the result/badge celebration pattern.
4. **XP surfacing**: a thin XP/level bar (reuse the existing `avatar-ring-fill` ring in the header to
   show level progress) + "+XP" tick-ups on the result screen.

## Acceptance Criteria
- [ ] Every correct/attempted answer, set, drill, GK, and quest awards XP per the rules
- [ ] Total XP persists (localStorage now; Drive-sync ready later) and never decreases
- [ ] `levelFromXP` is a pure function with unit-checkable boundaries (0 XP = L1, exact threshold = next level)
- [ ] Crossing a level shows a one-time level-up overlay
- [ ] Header avatar ring reflects progress to next level; result screen shows "+XP" earned
- [ ] No double-counting on reload or cross-tab (award on session-save, not on render)

## Technical Notes
- New `xp.js`: `XP_RULES`, `awardXP(events)`, `levelFromXP(total)`, `getTotalXP()`, `addXP(amount, reason)`.
  Keep curve + rules in one place so balancing is a one-file change.
- Award in the **session-finalize path**, not in renderers: hook `submitAnswer` final/`showResult`
  (`app-quiz.js`), `_startDrill` completion (`app-drill.js`), GK (`app-gk.js`), and quest-complete (E-003).
- Reuse header ring: `#avatar-ring-fill` in `screen-home.html` already exists — drive its
  `stroke-dashoffset` from `levelFromXP().pct`.
- Store under a versioned key (e.g. `donnibo_xp_v1`) to allow future migration.

## Files to Touch
- New: `app/ui/js/xp.js`
- `app/ui/js/app-quiz.js`, `app/ui/js/app-drill.js`, `app/ui/js/app-gk.js` — award XP on completion
- `app/ui/js/app-home.js` — drive level ring + fire level-up overlay
- `app/ui/screens/screen-home.html`, `screen-result.html` — XP bar / "+XP" display, level-up overlay
- `app/ui/css/styles-app.css` — XP bar, level-up overlay, "+XP" tick animation

## Definition of Done
Effort now accrues into a level that only climbs, with a celebration each time it does — and E-006/E-007
have a real number to render. Commit the engine first (no UI), then the surfacing, then the overlay.
