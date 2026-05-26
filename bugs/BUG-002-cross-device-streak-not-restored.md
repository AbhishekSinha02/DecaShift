# BUG-002 — Cross-Device Login Does Not Restore Daily Streak

**Priority:** High | **Status:** Fixed in v3.1 | **Affects:** All users logging in on a new device or incognito

## Symptom
A user with a 7-day streak on Device A logs into a fresh browser / Device B.
Their streak resets to 0. Progress feels lost even though sessions are intact.

## Root Cause
`decashift_streak` is stored exclusively in `localStorage` under the key
`decashift_streak`. The Drive sync functions (`syncAccountToDrive`,
`syncUserToRemote`) never include streak data in the payload. On a new device,
localStorage is empty → `Storage.loadStreak()` returns `{ current: 0, best: 0, lastDate: null }`.

## Affected Code
| File | Location | Issue |
|---|---|---|
| `storage.js` | `updateStreak()` | Returns updated streak but never syncs to Drive |
| `app.js` | `_handleSignin` | Does not restore streak after Drive account fetch |
| `app.js` | `_handleSignup` | Does not include streak in `syncAccountToDrive` call |
| `app.js` | `_showResult` | Calls `updateStreak()` but does not resync to Drive |

## Fix
1. Include `streak` field in `syncAccountToDrive()` payload on signup and after every session
2. In `_handleSignin`, after restoring account from Drive, call `Storage.saveStreak(userProfile.streak)` if streak data is present
3. `updateStreak()` called in `_showResult` — follow it with a Drive resync carrying updated streak

## Verification
1. Register on Device A, complete 3 sessions → streak shows 3
2. Open incognito / Device B, sign in → streak must show 3
3. Complete a session on Device B → streak shows 4 on both devices after next sync
