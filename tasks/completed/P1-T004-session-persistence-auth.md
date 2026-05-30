# Feature: Session Persistence After Sign-In

**Priority:** P1 | **Type:** Technical | **Complexity:** M | **Status:** Pending

## Goal
User stays logged in across browser sessions and page refreshes. Quiz progress within a session is never lost even if the page reloads mid-quiz.

## Acceptance Criteria
- [ ] Refreshing the page does not log the user out
- [ ] Closing and reopening the browser within 7 days keeps the user logged in
- [ ] Mid-quiz state (current question index, responses so far) survives page reload
- [ ] On auth restore, user lands on home screen — not registration screen
- [ ] Session token is stored securely (Firebase handles this via IndexedDB)

## Technical Notes
- Firebase Auth persistence: `browserLocalPersistence` (default) for "remember me", `browserSessionPersistence` otherwise
- Save in-progress quiz state to localStorage under `decashift_quiz_progress` — restore on init if `currentScreen` was `quiz`
- `onAuthStateChanged` is the single source of truth — wrap all init logic inside it

## Dependencies
- P1-T002 (sign-up)
- P1-T003 (sign-in)

## Files to Touch
- `app/ui/auth.js` — persistence config
- `app/ui/app.js` — `init()` wraps inside `onAuthStateChanged`
- `app/ui/storage.js` — `saveQuizProgress()`, `loadQuizProgress()`
