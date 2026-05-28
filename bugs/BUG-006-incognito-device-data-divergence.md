# BUG-006 — Data Divergence: Incognito / Cross-Device Sync

**Reported:** 2026-05-28
**Severity:** High
**Status:** Open
**Affects:** All users who use more than one browser, device, or incognito mode

---

## What the User Sees

1. **Streak shows different number** in regular browser vs incognito vs another device
2. **Different questions appear** depending on which browser/device opens the app
3. **Login behaves differently** — incognito always requires sign-in and shows older data

All three symptoms are caused by the same root problem.

---

## Root Cause (No Code)

The app has two data stores that are supposed to agree but often don't:

| Store | What it holds | When it updates | Scope |
|---|---|---|---|
| localStorage (device) | Streak, sessions, settings, subject filter | After every action — instant | This browser only |
| Google Drive (cloud) | Account, profile, grade, some session data | At specific sync moments only | Any device after sign-in |

**Incognito and other devices always read from Drive.** Regular browser reads from localStorage first. When Drive is behind localStorage, incognito shows stale data.

Drive falls behind because:
- Streak is written to localStorage after every session but Drive sync only happens at specific moments
- Drive sync can fail silently (OAuth expiry, network timeout) with no visible error
- Subject filter, archived goals, and some settings never reach Drive at all

---

## Specific Failure Modes

### BUG-006a — Streak Diverges

**Steps to reproduce:**
1. Do 3 quiz sessions in regular Chrome → streak = 5
2. Open incognito → sign in
3. Incognito shows streak = 2 (or whatever Drive last synced)

**Why:** Streak is saved to localStorage after every session. Drive only receives streak during certain sync calls. If those sync calls didn't fire (silent fail) the last few days, Drive has an old number.

---

### BUG-006b — Questions Differ Between Devices

**Steps to reproduce:**
1. Open app on Device A → use the Math tab → do a quiz
2. Open app on Device B (or incognito) → sign in → see different subject tab active or different questions

**Why 1 — Subject filter not synced:** The active subject tab (Math / Science / GK / All) is only in temporary session memory. It resets every fresh open. Device B always starts on the default tab.

**Why 2 — Grade divergence:** If the user changed grade in Settings and the Drive sync failed at that moment, Device A has grade = 7 (local) and Drive has grade = 5 (old). Device B fetches grade = 5 from Drive and shows Grade 5 questions.

---

### BUG-006c — Login Behaviour Inconsistent

**Steps to reproduce:**
1. Open regular browser → auto-logged in (reads from localStorage)
2. Open incognito → not logged in → must enter credentials
3. After incognito sign-in → sees older streak, possibly different grade

**Why:** localStorage auto-login only works when localStorage has data. Incognito starts fresh every time. This is expected browser behaviour but the data shown after Drive-restore should match what the user had last — it doesn't because Drive is stale.

---

## Impact

| Who is affected | Severity |
|---|---|
| User checks progress on a different device | High — sees wrong streak, loses trust |
| Parent checks child's progress from their own phone | High — key use case, completely broken |
| User opens incognito to "see how it looks" | Medium — discouraging first impression |
| Local rep demos the app to a parent | High — demo shows wrong/empty data |

---

## What a Fix Looks Like (Options)

### Option A — Sync streak to Drive after every session (Minimal fix)
After every quiz session completes, push the streak count to Drive.
Currently this only happens at certain moments. Making it happen every time
would close the gap for the most visible symptom (streak number).

**Effort:** S — add one Drive sync call to the result screen handler.
**Fixes:** BUG-006a fully. BUG-006b partially. BUG-006c partially.

### Option B — Replace Drive sync with Upstash Redis (Structural fix)
Instead of Google Drive (OAuth-gated, user-visible permission request),
use Upstash Redis (server-side key-value, no user OAuth needed).
Every write goes to Redis. Every read-on-login fetches from Redis.
localStorage becomes a cache, not the source of truth.

**Effort:** L — replaces the entire sync architecture.
**Fixes:** All three. Also fixes F4 (OAuth drop-off). True cross-device sync.

### Option C — Accept localStorage-only, make incognito a known limitation
Remove the Drive sync promise. localStorage is the only store. Clearly state
in the app: "Your data is saved on this device. Sign in from another device
will start fresh." Add an export/import feature for manual cross-device transfer.

**Effort:** S — remove sync calls, add a user-visible notice.
**Fixes:** Removes user confusion by setting correct expectations. Does not fix cross-device.

---

## Recommended Approach

**Now (before marketing launch): Option A** — sync streak after every session.
Quick, targeted, closes the most visible symptom. Takes 30 minutes.

**Post 1,000 users: Option B** — migrate to Upstash Redis.
The real fix. Upstash free tier handles ~10K commands/day. At 1,000 users
doing 3 sessions/day = 3,000 commands/day — well within free tier.
Infrastructure cost: ₹0 until scale demands paid tier.

Option C is not recommended — cross-device sync is table stakes for any product
that parents share between themselves and their child.

---

## Session to Fix This

### Option A session (30 minutes, can be added to any pending session)
- Add Drive streak sync call at the end of the result screen
- Add Drive grade sync call when grade changes in Settings
- Add Drive subject-filter sync (or persist subject filter in Drive profile)
- Test: complete session → open incognito → sign in → streak should match

### Option B session (full dedicated session, schedule when ready)
- Research Upstash Redis free tier setup
- Replace Drive write calls with Redis SET calls
- Replace Drive read calls with Redis GET calls
- Remove Google OAuth requirement entirely
- Test: full cross-device round trip

---

## Files Involved (for when fix is implemented)

- `app/ui/storage.js` — `syncUserToRemote()`, `saveStreak()`, `updateStreak()`
- `app/ui/app.js` — result screen handler (where streak update fires), settings save handler
- `Code.gs` (Apps Script) — Drive write handler (if staying with Drive for Option A)
