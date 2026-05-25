# Feature: Gamification — Badges and Milestones

**Priority:** P3 | **Type:** Functional | **Complexity:** M | **Status:** Pending

## Goal
Reward users for real behavior — not just score, but consistency, improvement, and exploration. Badges should feel earned, not given away.

## Badge Categories

### Streak Badges
- Spark — 3-day streak
- On Fire — 7-day streak
- Unstoppable — 30-day streak
- Legend — 100-day streak

### Accuracy Badges
- Sharp — First 100% score on any goal
- Consistent — 5 sessions with >80% accuracy
- Perfectionist — 3 consecutive 100% sessions

### Exploration Badges
- Explorer — Tried 3 different goals
- Completionist — Finished all questions in a goal

### Growth Badges
- Level Up — Improved accuracy by 20% from first to latest session on any goal
- Comeback — Returned after 3+ days off and completed a session

## Acceptance Criteria
- [ ] Badge earned → full-screen moment (animation + badge reveal) on result screen
- [ ] All earned badges visible on profile screen in a grid
- [ ] Unearned badges shown as greyed-out silhouettes (curiosity driver)
- [ ] Badge criteria computed from session history — no server needed
- [ ] Each badge has a name, icon (inline SVG), and short description
- [ ] Badge first-earn is stored so the animation only plays once

## Technical Notes
- `evaluateBadges(sessions)` — pure function, returns newly earned badge IDs
- Run after every session save
- Store `user.badges: string[]` (array of earned badge IDs)

## Dependencies
- P1-T004 (needs session history)
- P3-T001 (needs streak data)

## Files to Touch
- New: `app/ui/badges.js` — badge definitions + evaluation logic
- `app/ui/app.js` — call `evaluateBadges()` in `showResult()`
- `app/ui/index.html` — profile badges grid, badge reveal modal
- `app/ui/styles.css` — badge grid, reveal animation
