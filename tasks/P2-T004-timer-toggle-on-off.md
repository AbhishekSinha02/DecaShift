# Feature: Timer On/Off Toggle

**Priority:** P2 | **Type:** Functional | **Complexity:** S | **Status:** Pending

## Goal
Users can disable the per-question timer for a relaxed, pressure-free practice mode. Timer preference persists across sessions.

## Acceptance Criteria
- [ ] Timer toggle in quiz header (icon button, not a buried setting)
- [ ] When OFF: timer badge hidden, no duration recorded (or recorded as 0)
- [ ] When ON: existing timer behavior unchanged
- [ ] Preference saved to user profile (localStorage + remote)
- [ ] Toggle change takes effect immediately (even mid-quiz)
- [ ] Timer-off sessions are tagged in storage so analytics can separate timed vs untimed

## Technical Notes
- Store `user.timerEnabled` (boolean, default `true`)
- `startTimer()` checks `state.user.timerEnabled` before starting interval
- Session record: add `timedMode: boolean` field

## Dependencies
- None

## Files to Touch
- `app/ui/index.html` — timer toggle button in quiz header
- `app/ui/app.js` — `startTimer()` guard, toggle handler
- `app/ui/styles.css` — toggle button style
