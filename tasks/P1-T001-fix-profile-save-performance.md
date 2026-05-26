# Fix: Profile Save Performance (Slow Saving Feedback)

**Priority:** P1 | **Type:** Technical | **Complexity:** S | **Status:** Done ✅ (v1.1)

## Goal
Make the registration "Saving profile…" state feel instant — save to localStorage first, then sync to Drive in the background without blocking the UI transition.

## Problem
Current flow awaits `syncUserToRemote()` before navigating away. Google Apps Script cold starts take 2–5 seconds, making the button feel frozen.

## Acceptance Criteria
- [ ] Form submit navigates to home screen in under 300ms
- [ ] Drive sync happens in background (fire-and-forget)
- [ ] A small non-blocking toast shows "Synced to Drive" or "Saved locally" after sync resolves
- [ ] No spinner blocking the submit button beyond 300ms
- [ ] Works on slow 3G (simulate in DevTools)

## Technical Notes
- Save to localStorage → immediately navigate
- Call `syncUserToRemote()` with `.then()` after navigation, not `await` before it
- Add a lightweight toast component (pure CSS + JS, no library)

## Dependencies
- None (standalone fix)

## Files to Touch
- `app/ui/app.js` — `_handleRegSubmit()` function
- `app/ui/styles.css` — add toast styles
