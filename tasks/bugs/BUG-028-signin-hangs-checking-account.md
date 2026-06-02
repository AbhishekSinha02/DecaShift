# BUG-028 — Sign-in stuck forever on "Checking account…"

**Severity:** 🔴 Critical (blocks sign-in)
**Status:** ✅ Fixed 2026-06-02
**Found by:** user

---

## Symptom
First-time signup works, but a later sign-in hangs indefinitely with the button
stuck on **"Checking account…"**. No error, no recovery.

## Root cause
Sign-in only reaches "Checking account…" when `Storage.findAccount(loginId)`
returns null — i.e. the account is NOT in this browser's localStorage
(different device/browser, cleared storage, or a cross-device login). It then
calls `Storage.fetchAccountFromDrive(loginId)`, which did a bare
`await fetch(APPS_SCRIPT_URL …)` **with no timeout**. If the Apps Script
endpoint is slow/unreachable/stalls, the await never settles → the button is
stuck on "Checking account…" forever, with `btn.disabled = true`.

(Same-browser signup → sign-out → sign-in is fine: `findAccount` returns the
local account and Drive is never called — verified by repro Path A.)

A second, blocking Drive call existed in the "category safety net"
(`if (!user.category)`) with the same no-timeout flaw.

## Fix
`storage.js` — `fetchAccountFromDrive(loginId, timeoutMs = 8000)`:
- Wrap the fetch in an `AbortController` that aborts after `timeoutMs`.
- Return the account if the server says found, `null` if it says not-found, and
  **throw** on timeout/network error (distinct from a definitive not-found).

`app-auth.js` — `_handleSignin`:
- The "Checking account…" call now try/catches: on throw, show
  "Couldn't reach the server. Check your connection and try again." and re-enable
  the button (never stuck).
- The category-safety-net Drive call is wrapped in try/catch and swallowed
  (sign-in is already valid locally; an offline profile-refresh failure must not
  block login).

## Test
`test/regression-signin-timeout.mjs` — Path A: local account sign-in lands on
home without touching Drive. Path B: no local account + a hanging Drive endpoint
→ the button recovers (re-enabled, network error shown) within the timeout
instead of hanging forever.
