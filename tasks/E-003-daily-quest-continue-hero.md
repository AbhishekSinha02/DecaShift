# E-003: Daily Quest + "Continue Your Quest" Hero

**Priority:** P1 (Ritual) | **Force:** Ritual | **Type:** UI+JS | **Complexity:** M | **Status:** Pending
**Session:** E2 · **Depends on:** none (uses existing session history + streak) · **Builds on:** D-007 Today card

## Goal
Engineer the **return**. Give every open one unmistakable next action — a **Daily Quest** ("Today's
mission: 1 set + 1 drill → earn your day") — and a **Continue** hero that drops the kid back into the
exact next question with one tap, Netflix "Continue Watching" style.

## Why
Today's home is a browse grid; the user must *decide* what to do. Decision is friction. Netflix/Duolingo
win by removing it: the single best next action is pre-chosen and one tap away. We have streaks but no
*mission* that gives the day a shape and a finish line.

## What to build
1. **Daily Quest card** (top of home content, above browse rows):
   - A small checklist of 2–3 daily objectives, e.g. `✓ 1 practice set`, `○ 1 flash drill`, `○ today's GK`.
   - Live progress fills as the kid completes them during the day.
   - On all-complete → the card flips to a **"Day complete 🎉"** state (sets up E-004's ritual moment).
   - Objectives reset at local midnight.
2. **Continue hero** (when a set is mid-progress or a next set is obvious):
   - `"Continue: Linear Equations — Set 2, question 4 of 10"` → big primary button resumes exactly there.
   - If nothing in progress, shows `"Start today's quest"` → launches the first incomplete objective.
3. **Quest state** persisted per-day in localStorage (no infra), derived where possible from existing
   session history so it survives reload and is correct cross-tab.

## Acceptance Criteria
- [ ] Home shows a Daily Quest card with 2–3 objectives and live progress
- [ ] Completing a set/drill/GK ticks the matching objective without a manual refresh
- [ ] Continue hero resumes the exact in-progress set+question, or starts the next objective
- [ ] Quest resets at local midnight; yesterday's completion does not leak into today
- [ ] All-complete state shows a "Day complete" card (hands off to E-004)
- [ ] Works offline; no remote call required
- [ ] Phone + tablet + laptop layouts all place the hero above the fold (respects E-002)

## Technical Notes
- New helper `dailyQuest.js` (or a section in `app-home.js`) exposing `getQuestState()`,
  `markObjective(id)`, `isDayComplete()`. Keep pure where possible.
- Reuse: `state.selectedGoal` / `state.currentIndex` for "continue position"; `Storage.loadSessions`
  / streak helpers for what's done today. Hook `markObjective` into `submitAnswer`'s session-end path
  (`app-quiz.js`), `_startDrill` completion (`app-drill.js`), and GK view (`app-gk.js`).
- Render via the existing `#today-card-wrap` / a new `#daily-quest-wrap` slot in `screen-home.html`.

## Files to Touch
- New: `app/ui/js/daily-quest.js` (or extend `app-home.js`)
- `app/ui/screens/screen-home.html` — quest + continue slots
- `app/ui/js/app-home.js` — render quest/continue in `_renderHome`
- `app/ui/js/app-quiz.js`, `app/ui/js/app-drill.js`, `app/ui/js/app-gk.js` — mark objectives on completion
- `app/ui/css/styles-app.css` — quest card + continue hero styles

## Definition of Done
A returning kid opens the app and sees exactly one obvious thing to do, one tap from doing it, with
a finish line for the day. Commit the Continue hero and the Quest card as two atomic steps.
