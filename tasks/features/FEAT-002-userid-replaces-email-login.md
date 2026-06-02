# FEAT-002 — User ID replaces Email as login key

**Priority:** 🔴 P1  
**Estimate:** 0.5 session  
**Status:** Open  

---

## What changes

Replace the `Email Address` field in signup and sign-in with a **User ID** (free-form unique login key).

### Why
- Students (Grade 2–12) don't have email addresses
- Email creates friction at the very top of the funnel — kills the GTM zero-friction strategy
- User ID is a handle the user owns and remembers (e.g. `rahul`, `starlearner2025`)
- Email + phone collected **later**, only when the user upgrades to a paid plan (parent handles payment)

### What stays unchanged
- Full Name field — unchanged, still required
- Password + Confirm Password — unchanged
- Grade / Role / all other fields — unchanged
- All auth logic (localStorage, Drive sync, session management) — unchanged
- Mobile field — **removed** from signup (no friction during trial)

---

## Scope (current session — label change only)

This session does the label/field rename. The uniqueness enforcement and Drive-based collision check is deferred to the cross-device sync task (P2-T046).

### Signup screen (`screen-signup.html`)

| Before | After |
|---|---|
| `Email Address *` | `User ID *` |
| `type="email"` input | `type="text"` input |
| placeholder `you@example.com` | placeholder `e.g. rahul, star2025` |
| hint: none | hint: `This is your login ID — pick something you'll remember.` |
| Mobile Number (optional) | **Removed entirely** |

### Sign-in screen (`screen-signin.html`)

| Before | After |
|---|---|
| `Email Address` label | `User ID` label |
| `type="email"` input | `type="text"` input |
| placeholder `you@example.com` | placeholder `Your User ID` |

### Validation change (`app-auth.js`)

| Before | After |
|---|---|
| `_validEmail(email)` check | min 3 chars, no spaces (trim + length check) |
| `email` variable used as login key | `userId` (rename field variable) |
| `syncAccountToDrive({ email, ... })` | `syncAccountToDrive({ loginId, ... })` |

### User object stored in localStorage

```js
// Before
{ userId, name, email, mobile, ... }

// After  
{ userId, name, loginId, ... }   // loginId = the user-chosen ID, mobile removed
```

---

## Deferred (NOT this session)

- Uniqueness collision check against Drive (needs P2-T046 infrastructure)
- Password reset / recovery flow
- Parent email + payment email collection (triggered at paywall, not signup)
- Email as optional field post-signup in Settings

---

## Acceptance

1. Signup form: no Email field, no Mobile field — just Full Name + User ID + Password + Grade
2. Sign-in form: "User ID" label with plain text input
3. A user can sign up as `rahul` and sign in as `rahul` with their password
4. Full Name is still displayed correctly in profile/header throughout the app
5. No console errors; localStorage user object has `loginId` field
