# BUG-029 — Sign-in "no account found" on same browser (silent localStorage write failure at signup)

**Severity:** 🔴 High
**Status:** ✅ Mitigated 2026-06-02 (loud failure at signup); root-cause confirmation pending user info
**Found by:** user (couldn't sign in after signup, same device, Chrome regular + incognito)

---

## Symptom
User signs up (lands on home — looks successful), signs out, then sign-in fails
— previously stuck on "Checking account…" (BUG-028, now bounded by a timeout),
now reaching the Drive lookup at all means **`findAccount(loginId)` returns null
at sign-in even on the same browser**.

## Investigation
A full **real-flow** Playwright repro (`test/repro-real-signup-signin.mjs`):
drives the actual signup form → `signOut()` → real sign-in form, same context.
Result: account persists in `decashift_accounts`, `findAccount` returns it,
sign-in lands on home, **Drive never called** (driveHits=0). So the app code is
correct for a browser where localStorage works.

→ For the user, the account is **not in localStorage at sign-in**. The leading
cause: the signup-time `localStorage.setItem` was **silently dropped or blocked**
(private/incognito with site-data blocked, strict privacy/extension, storage
full, or signup and sign-in happening on different origins — http vs https, temp
domain vs github.io). Signup still *looks* fine because home renders from
in-memory `state.user`; the loss only surfaces at the next sign-in.

## Fix (mitigation — makes the failure loud)
`app-auth.js` `_handleSignup`: after `saveAccount`/`saveUser`, **verify**
`Storage.findAccount(loginId)` returns the account. If not (write blocked/dropped),
show: "Couldn't save your account on this device. Turn off private/incognito
mode or allow site data for this site, then try again." and stop — instead of
pretending signup worked and failing at the next sign-in.

## Still to confirm with the user
- Exact message now shown at sign-in (after BUG-028 deploy): "No account found"
  vs "Couldn't reach the server" vs "Incorrect password".
- The URL/domain used for signup vs sign-in (origin mismatch breaks localStorage
  sharing — ties into the pending custom-domain / HTTPS-enforcement tasks).
- Whether a hard refresh (stale cached JS) changes anything.

## Test
`test/signup-storage-blocked.mjs` — stubs `localStorage.setItem` for the accounts
key to a no-op (simulating a silently-blocked write); signup must show the loud
error and NOT navigate to home.
