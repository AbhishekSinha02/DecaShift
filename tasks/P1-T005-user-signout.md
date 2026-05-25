# Feature: User Sign-Out

**Priority:** P1 | **Type:** Technical | **Complexity:** S | **Status:** Pending

## Goal
User can sign out cleanly. Local state is cleared and they are returned to the sign-in screen.

## Acceptance Criteria
- [ ] Sign-out button visible in the home screen header (user chip / avatar)
- [ ] On click: confirmation dialog ("Sign out? Your progress is saved.")
- [ ] Clears localStorage cache (not the remote data)
- [ ] Firebase `signOut()` called
- [ ] Redirects to sign-in screen
- [ ] Re-opening the app shows sign-in screen (session fully cleared)

## Technical Notes
- Firebase Auth: `signOut()`
- Only clear in-session cache from localStorage — do NOT delete `decashift_sessions` (user data must survive sign-out)
- Clear: `decashift_user`, `decashift_quiz_progress`

## Dependencies
- P1-T003 (sign-in)
- P1-T004 (session persistence)

## Files to Touch
- `app/ui/index.html` — sign-out button in header
- `app/ui/app.js` — `handleSignOut()`
- `app/ui/auth.js` — `signOut()` wrapper
