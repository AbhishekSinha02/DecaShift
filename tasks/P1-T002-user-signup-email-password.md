# Feature: User Sign-Up with Email + Password

**Priority:** P1 | **Type:** Technical | **Complexity:** M | **Status:** Pending

## Goal
Allow new users to create an account with email and password so identity is persistent across devices, not just localStorage.

## Context
Current registration stores identity only in localStorage — clearing the browser loses everything. A real auth layer ties identity to an account.

## Acceptance Criteria
- [ ] Sign-up form: name, email, password, confirm password, role, mobile
- [ ] Password: min 8 chars, 1 number, 1 special char — validated client-side with live feedback
- [ ] Duplicate email shows a clear error message
- [ ] On success: user is logged in and taken to home screen
- [ ] Password stored as hash (never plaintext) — use Firebase Auth or similar
- [ ] Works on mobile (375px) without horizontal scroll

## Technical Notes
- Use **Firebase Authentication** (free tier, no backend needed, frontend SDK)
- `firebase/auth` — `createUserWithEmailAndPassword()`
- Store extended profile (role, mobile, category) in Firestore or as a Drive record
- Keep localStorage as cache layer on top of Firebase

## Dependencies
- P1-T004 (session persistence) — must decide auth provider first

## Files to Touch
- `app/ui/index.html` — add sign-up screen section
- `app/ui/app.js` — `handleSignUp()` function
- `app/ui/storage.js` — `createUser()` wrapping Firebase call
- New: `app/ui/auth.js` — Firebase init + auth helpers
