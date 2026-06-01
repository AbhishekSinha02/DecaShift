# Browser Test — P0 Bugs BUG-002/003/004/005
**Priority:** ★ HIGH (P0 bugs — engagement loops may be broken)
**Type:** Browser testing + fix session
**Effort:** ~2 hours
**Trigger:** After content generation session (Priority 1)

---

## Context

Session 2026-06-02 code analysis showed these bugs LOOK CORRECT in static analysis,
but the UX audit (2026-06-01) flagged them as critical failures. Need browser verification.

**If bugs DO reproduce in browser → fix immediately in same session.**
**If bugs DO NOT reproduce → mark as false positive in BUGS-LOG-2026.md.**

---

## Test Environment Setup

1. Open `app/ui/index.html` in Chrome (or via GitHub Pages)
2. Open DevTools → Console tab (watch for JS errors during each test)
3. Log in as a Grade 5 school student
4. Clear localStorage before each test: DevTools → Application → Storage → Clear site data

---

## BUG-002: Quiz score not updating on home card

**Test steps:**
1. Go to home → note the score shown on any set card (e.g., "Not started")
2. Start that set → complete all questions
3. Reach result screen → note your score (e.g., "12/15")
4. Click "Back to Home"
5. **Expected:** The set card now shows "Last: 12/15"
6. **Actual expected failure:** Card still shows "Not started"

**Root cause if fails:** Check Console for errors during `_showResult()`. Add `console.log(Storage.getLastSessionForGoal(goal.id))` after saveSession to verify localStorage write.

**Fix if fails:** The session data might have a goalId mismatch. Check `state.selectedGoal.id` === the goal.id shown in the card.

---

## BUG-003: Quest progress bar not real-time

**Test steps:**
1. Go to home → note daily quest bar (e.g., "0/3")
2. Complete today's quiz set
3. Click "Back to Home"
4. **Expected:** Quest bar now shows "1/3" with Set chip checked
5. **Actual expected failure:** Bar stays at "0/3"

**Root cause if fails:** `DailyQuest.getState()` reading stale sessions. Add `console.log(DailyQuest.getState())` in `_renderDailyQuest()` to verify.

---

## BUG-004: Avatar level-up animation missing

**Test steps:**
1. Open DevTools Console
2. Manually set XP near a level boundary: `localStorage.setItem('donnibo_xp_v1', '90')` (Level 2 needs 100)
3. Complete a quiz set (should earn ~25+ XP → triggers level 2)
4. On result screen → wait 1-2 seconds
5. **Expected:** Level-up modal appears ("Level 2! ⬆")
6. **Actual expected failure:** Nothing appears

**Root cause if fails:** Check if `xpResult.leveledUp` is true in console. Check if `_showLevelUp` is called. The bug may be that `Avatar.stageFromLevel` causes an error.

---

## BUG-005: Streak freeze not working

**Test steps (requires time manipulation):**
1. Check freeze count: `JSON.parse(localStorage.getItem('donnibo_streak')).freezes`
2. If 0 freezes: grant one via mystery box or `localStorage.setItem('donnibo_streak', JSON.stringify({...JSON.parse(localStorage.getItem('donnibo_streak')), freezes: 1}))`
3. Simulate a missed day: change `lastDate` to 2 days ago in localStorage
4. Complete a quiz (triggers `updateStreak()`)
5. **Expected:** Streak preserved (incremented by 1), freezes goes from 1 to 0, `savedByFreeze` = today
6. **Actual expected failure:** Streak resets or doesn't consume freeze

**Root cause if fails:** The `daysSince === 2` check. If daysSince rounds differently (e.g., to 1 or 3), freeze won't trigger. Fix: change to `daysSince >= 2 && daysSince <= 2` or use date-only comparison.

---

## After Testing

Update `test-review/BUGS-LOG-2026.md`:
- ✅ FIXED (if reproduced and fixed)
- ✅ FALSE POSITIVE (if cannot reproduce)
- 🔴 CONFIRMED, ROOT CAUSE DIFFERENT (if reproduced but cause is different)

Create tag if all P0 bugs resolved: `git tag -a v4.3.1 -m "v4.3.1 — P0 bugs verified/fixed"`
