# Feature: Daily Streak Tracking

**Priority:** P3 | **Type:** Technical | **Complexity:** S | **Status:** Pending

## Goal
Track how many consecutive days a user has practiced. Streaks are the #1 habit-formation mechanism — make users feel the cost of breaking the chain.

## Acceptance Criteria
- [ ] Streak increments when user answers at least 1 question in a calendar day
- [ ] Streak resets to 0 if a day is missed (no activity in a 24h calendar window)
- [ ] Streak count visible on home screen prominently (not buried in profile)
- [ ] "Streak at risk" warning shown after 6pm if user hasn't practiced that day
- [ ] Longest streak also stored and shown ("Personal best: 14 days")
- [ ] Streak data survives sign-out / re-login
- [ ] Timezone-aware: use user's local midnight as day boundary

## Technical Notes
- Store `{ currentStreak, longestStreak, lastActiveDate }` in user profile
- Check streak on `init()`: compare `lastActiveDate` to today's date
- "At risk" warning: check time + today's activity in `init()`
- Use `Intl.DateTimeFormat` for timezone-correct date comparison

## Dependencies
- P1-T004 (session persistence — streak must survive across sessions)

## Files to Touch
- `app/ui/storage.js` — `updateStreak()`, `loadStreak()`
- `app/ui/app.js` — streak check in `init()`
- `app/ui/index.html` — streak display on home screen
