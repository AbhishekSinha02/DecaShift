# BUG-030 — Quiz/Drill result screen never renders for User-ID accounts (email leftover)

**Severity:** 🔴 High (every quiz/drill completion broken for real User-ID users)
**Status:** ✅ Fixed 2026-06-02
**Found by:** Claude (while tracing the old-credentials RCA)

---

## Symptom
A User-ID account (the only kind FEAT-002 creates) finishes a quiz or a drill →
progress saves, but the **result screen never appears**.

## Root cause
Two leftover references to `state.user.email`, removed by FEAT-002 (email → User
ID). New user objects have **no `email`** field, so `state.user.email` is
`undefined`, and `Storage.findAccount(undefined)` ran `undefined.toLowerCase()` →
**throws TypeError** (whenever ≥1 account exists, i.e. always for a signed-in user;
an empty accounts array short-circuits `.find`, which is why it never threw in
seeded tests).

The throw lands BEFORE the result UI renders:
- `app-quiz.js` `_showResult()` — line ~421, before `await _showScreen('result')`
  (~429). Session/XP/streak save first; then the throw → no result screen.
- `app-drill.js` — line ~255, before the `drill-result` element is shown (~264+).
  Same: throw → no drill result.

## Why tests missed it
`functional-test.mjs` seeded its user **with** `email:'kid@test.com'` AND no
accounts array, so `findAccount` got a string / empty list and never threw.

## Fix
- `storage.js` `findAccount`: `if (!loginId) return null;` — guard so a null/undefined
  id can never throw (fixes the whole class at the source).
- `app-quiz.js` + `app-drill.js`: `Storage.findAccount(state.user.loginId || state.user.email)`
  — use the real login key (legacy email fallback), so the Drive streak-sync also
  works again.
- `functional-test.mjs`: seed a real User-ID user (loginId, no email) + a matching
  account, so the quiz-completion step now actually exercises this path.

(Display-only `state.user.email` uses with `|| name`/`|| loginId` fallbacks —
app-home.js footer, app-settings.js — are safe and were left as-is.)

## Test
`test/regression-userid-result-screen.mjs` — User-ID user (no email) + non-empty
accounts → complete a full quiz → assert the result screen renders with the score
and zero page errors. Reproduces the exact throw condition.
