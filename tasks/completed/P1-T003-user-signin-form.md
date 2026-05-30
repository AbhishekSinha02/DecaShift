# Feature: User Sign-In Form

**Priority:** P1 | **Type:** Technical | **Complexity:** S | **Status:** Pending

## Goal
Let returning users log in with email + password and restore their progress from the server.

## Acceptance Criteria
- [ ] Sign-in screen with email + password fields
- [ ] "Forgot password" link triggers password reset email
- [ ] Wrong credentials shows a friendly error (not a raw Firebase error code)
- [ ] On success: loads user profile + sessions from remote, navigates to home
- [ ] "Remember me" checkbox — persists session across browser restarts
- [ ] Link to sign-up screen for new users
- [ ] Loading state on submit button while auth resolves

## Technical Notes
- Firebase Auth: `signInWithEmailAndPassword()`
- On auth state change (`onAuthStateChanged`), auto-restore session silently
- Merge any existing localStorage sessions with remote sessions on first login

## Dependencies
- P1-T002 (sign-up must exist first)
- P1-T004 (session persistence)

## Files to Touch
- `app/ui/index.html` — sign-in screen section
- `app/ui/app.js` — `handleSignIn()`, `handleAuthStateChange()`
- `app/ui/auth.js` — Firebase sign-in wrapper
