# BUG-027 — Settings → Security shows "Email" (blank) and password change is broken

**Severity:** 🔴 High (password change non-functional)
**Status:** ✅ Fixed 2026-06-02
**Found by:** user

---

## Symptom
In Settings → Account & Security:
- The field is labelled **"Email Address"** and shows blank (`—`).
- Since FEAT-002 replaced email with **User ID** as the login key, `state.user.email`
  no longer exists → the display is empty.

## Worse: password change was broken
`saveNewPassword()` looked up and re-saved the account by `user.email`:
```js
const account = Storage.findAccount(user.email);     // user.email === undefined
Storage.saveAccount(user.email, newHash, user.userId, user);
```
`Storage.findAccount(undefined)` runs `undefined.toLowerCase()` → throws, so
changing the password failed for every account created under the User-ID system.

## Root cause
The Security sub-screen was never migrated when FEAT-002 switched the login key
from `email` to `loginId`. See [[project_identity_strategy]].

## Fix
`app/ui/js/app-settings.js` + `app/ui/screens/screen-settings.html`:
- Display the **User ID** (`state.user.loginId`) under a "User ID" label.
- `saveNewPassword()` finds/saves the account by `user.loginId`, not `user.email`.

## Test
`test/settings-password.mjs` — seeds a User-ID account, opens Security, asserts
the User ID shows (not blank), then changes the password and verifies the new
hash is persisted to the account and the old one rejected.
