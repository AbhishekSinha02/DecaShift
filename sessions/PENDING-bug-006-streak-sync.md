# Session: PENDING — BUG-006 Fix A: Sync Streak After Every Session

**Priority:** 1
**Type:** Code / Bug Fix
**Est. Duration:** 30 minutes
**Task:** BUG-006 Option A
**Trigger:** "start the session" (Priority 1 in pending queue)
**Depends on:** — (standalone, can run any time)

---

## Objective

Sync streak count + grade to Google Drive at the end of every quiz session and drill session. Closes the most visible symptom of BUG-006 (streak shows different numbers across devices/incognito).

---

## Context

- BUG-006: streak diverges between regular browser, incognito, and other devices
- Root cause: streak saves to localStorage after every session but Drive only syncs at certain moments
- Fix: add one Drive sync call after every session end (quiz result screen + drill result)
- Also: ensure grade is always in the Drive profile so subject filter is consistent
- Full bug report: `bugs/BUG-006-incognito-device-data-divergence.md`

---

## Execute In This Order

### Step 1 — Check current sync points
Read `app/ui/storage.js` — find `syncUserToRemote()` and `updateStreak()`.
Read `app/ui/app.js` — find where result screen is shown (`showResult()`) and where streak updates.

### Step 2 — Add streak sync after quiz session ends
In `app/ui/app.js`, at the point where the result screen renders and streak is updated:
```
After Storage.updateStreak() call:
  → Also call Storage.syncUserToRemote(state.user)
  → This pushes the updated streak to Drive immediately
```

### Step 3 — Add streak sync after drill session ends
Same pattern: after `_showDrillResult()` calls `Storage.updateStreak()`:
```
  → Also call Storage.syncUserToRemote(state.user)
```

### Step 4 — Ensure grade is always included in Drive sync
Check `syncUserToRemote()` in storage.js — confirm `user.grade` is included in the payload written to Drive. If it's being dropped, add it.

### Step 5 — Ensure profile save triggers Drive sync
In `saveProfileEdit()` in app.js — confirm Drive sync is called after grade change. It should already be there but verify.

### Step 6 — Test
1. Sign in on regular browser → do a quiz → streak updates to N
2. Open incognito → sign in → streak should show N (or N-1 at worst, not days-old data)
3. Change grade in settings → open incognito → sign in → should see same grade

### Step 7 — Commit
```bash
git add app/ui/app.js app/ui/storage.js
git commit -m "fix(BUG-006): sync streak to Drive after every quiz and drill session

Streak previously only synced to Drive at certain moments (signup, profile save).
Now synced after every session end -- quiz result and drill result.
Closes the most visible symptom of cross-device streak divergence.
Grade confirmed included in Drive payload for consistent question set across devices."
git push origin main
```

### Step 8 — Update bug status
In `bugs/INDEX.md`: change BUG-006 status to ✅ Fix A applied.

---

## Success Criteria
- [ ] Streak syncs to Drive after every quiz session
- [ ] Streak syncs to Drive after every drill session
- [ ] Grade confirmed in Drive payload
- [ ] Incognito test shows streak within 1 of regular browser
- [ ] Committed and pushed

## Long-Term Note
Option B (Upstash Redis migration) is the full fix — planned post 1,000 users.
This Fix A closes the visible symptom for the launch window.
