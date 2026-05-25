# Refactor: Auto-Save Responses — Remove Manual CSV/JSON Export

**Priority:** P1 | **Type:** Technical | **Complexity:** S | **Status:** Pending

## Goal
Every answer submission is saved automatically to storage (localStorage + remote). Remove the manual Export JSON / Export CSV buttons from the result screen.

## Context
Asking users to manually export their data creates friction and loses data for users who skip it. Auto-save makes the system feel intelligent and trustworthy.

## Acceptance Criteria
- [ ] Each `submitAnswer()` call saves the response object immediately to localStorage
- [ ] Session record is upserted (not duplicated) on each question answer
- [ ] On session complete, final record is flushed to remote storage
- [ ] Export buttons removed from result screen
- [ ] Result screen shows "Progress saved" confirmation instead
- [ ] No data loss if user closes mid-session (partial sessions recoverable)

## Technical Notes
- Save partial session under `decashift_active_session` key in localStorage after each answer
- On `showResult()`, move from `active_session` to `decashift_sessions` array
- Remote sync is still fire-and-forget (non-blocking)
- Keep `exportAsJSON` / `exportAsCSV` in storage.js for future admin use — just remove the UI buttons

## Dependencies
- None

## Files to Touch
- `app/ui/app.js` — `submitAnswer()`, `showResult()`
- `app/ui/storage.js` — `saveActiveSession()`, `finalizeSession()`
- `app/ui/index.html` — remove export buttons, add "saved" indicator
