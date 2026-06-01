# Donnibo Bug Log — 2026
**Tracking:** All bugs found during UX audits and testing  
**Last Updated:** 2026-06-01

---

## Active Bugs (Not Yet Fixed)

### 🔴 CRITICAL — Fix Immediately

| ID | Title | Feature | Severity | Status | Fix ETA | Owner |
|---|---|---|---|---|---|---|
| BUG-001 | Drill card shows "Not tried yet" after completion | Flash Drills | CRITICAL | ✅ FIXED 2026-06-02 | — | Dev |
| BUG-002 | Quiz session not persisting to home card | Quiz Engine | CRITICAL | 🔍 NEEDS BROWSER TEST | 2026-06-02 | Dev |
| BUG-003 | Daily quest progress bar not real-time | Daily Quest | CRITICAL | 🔍 NEEDS BROWSER TEST | 2026-06-02 | Dev |
| BUG-004 | Avatar level-up animation missing | Avatar/XP | CRITICAL | 🔍 NEEDS BROWSER TEST | 2026-06-02 | Dev |
| BUG-005 | Streak freeze not preventing streak break | Streak | CRITICAL | 🔍 NEEDS BROWSER TEST | 2026-06-02 | Dev |
| BUG-006 | Mystery box not appearing after quest | Daily Quest | CRITICAL | ✅ FIXED 2026-06-02 | — | Dev |

### 🟡 HIGH PRIORITY — Fix This Week

| ID | Title | Feature | Severity | Status | Fix ETA | Owner |
|---|---|---|---|---|---|---|
| BUG-007 | Flash drill 30s timeout not working | Flash Drills | HIGH | 🟡 PENDING | 2026-06-03 | Dev |
| BUG-008 | Share result card shows wrong/blank avatar | Share Card | HIGH | 🟡 PENDING | 2026-06-03 | Dev |
| BUG-009 | Challenge friend link fails/shows error | Challenge | HIGH | 🟡 PENDING | 2026-06-03 | Dev |
| BUG-010 | Settings changes not persisted | Settings | HIGH | 🟡 PENDING | 2026-06-04 | Dev |
| BUG-013 | Personal best not showing on drill card | Flash Drills | HIGH | ✅ FIXED 2026-06-02 (same fix as BUG-001) | — | Dev |

### 🟢 MEDIUM — Fix Before Content Sprint

| ID | Title | Feature | Severity | Status | Fix ETA | Owner |
|---|---|---|---|---|---|---|
| BUG-011 | Home shows GK tab even with no GK content | Home Screen | MEDIUM | 🟢 PENDING | 2026-06-05 | Dev |
| BUG-012 | Offline quiz not syncing after online | Offline/Sync | MEDIUM | 🟢 PENDING | 2026-06-05 | Dev |
| BUG-014 | Quiz explanation not showing | Quiz Engine | MEDIUM | 🟢 PENDING | 2026-06-05 | Dev |
| BUG-015 | Timer inaccurate on slow network | Quiz Timer | MEDIUM | 🟢 PENDING | 2026-06-05 | Dev |

### 🟣 LOW — Polish/Next Sprint

| ID | Title | Feature | Severity | Status | Fix ETA | Owner |
|---|---|---|---|---|---|---|
| BUG-016 | Accuracy badge threshold unclear | Quiz Results | LOW | 🟣 BACKLOG | — | Dev |
| BUG-017 | Drill card name truncates on mobile | Flash Drills | LOW | 🟣 BACKLOG | — | Dev |
| BUG-018 | Streak modal doesn't dismiss on outside click | Streak | LOW | 🟣 BACKLOG | — | Dev |

---

## Detailed Bug Descriptions

### BUG-001: Drill Card Shows "Not Tried Yet" After Completion
**Severity:** CRITICAL  
**Found:** 2026-06-01 (UX Audit)  
**Reporter:** Claude (11-year-old tester)  

**Description:**  
User completes a flash drill (e.g., Tables Drill, gets 18/20 correct). Result screen shows the score. User goes back to Home. The drill card still shows "Not tried yet" instead of "Best: 18/20". If user reloads the page, the card updates correctly.

**Root Cause:**  
Code bug — two localStorage keys mismatch:
- Drill completion saves to: `localStorage['ds_drill_records']` (app-drill.js:90)
- Home screen reads from: `localStorage['ds_drill_bests']` (app-home.js:360)
- Result: Card never finds the saved record

**Impact:**  
Users feel like their practice is not being saved. Kills the engagement loop immediately. 11-year-old tested this and found it within 5 minutes of completing a drill.

**User Journey Broken:**
```
User completes drill → See score (18/20) ✅
User goes home → Expects card to show "Best: 18/20" ✅
Actual: Card shows "Not tried yet" ❌
User confusion: "Did my score save or not?" → Motivation dies
```

**Fix:**
Change app-home.js line 360:
```javascript
// OLD:
const bests = JSON.parse(localStorage.getItem('ds_drill_bests') || '{}');

// NEW:
const bests = JSON.parse(localStorage.getItem('ds_drill_records') || '{}');
```

**Test Case:** TC-04-011 (Personal best tracking)  
**Effort:** 30 min  
**PR Link:** (pending)

---

### BUG-002: Quiz Session Not Persisting to Home Card
**Severity:** CRITICAL  
**Found:** 2026-06-01 (UX Audit)  
**Related To:** BUG-001 (same pattern: state not reflected in UI)

**Description:**  
User completes a quiz set (15 questions, gets 12/15 = 80%). Result screen shows the score and "You did great!" feedback. User taps "Back to Home". Home screen shows the set card. **Expected:** Card badge shows "Last: 80%" or "12/15". **Actual:** Card shows "Not started" or the old score (not updated from this session).

**Root Cause:**  
Session saves to `state.sessions` and localStorage, but home card re-render doesn't wait for the save to complete before DOM update.

**Impact:**  
No immediate feedback on home screen. The "celebration" moment is lost. Users don't feel rewarded. Engagement loop broken.

**User Journey Broken:**
```
User finishes 15-question quiz → 12/15 = 80% ✅
Result screen: "Nice work!" ✅
User goes home → Expects card to show "Last: 12/15 (80%)" ✅
Actual: Card shows "Not started" or old score ❌
User frustration: "Is my score saved?" → Does quiz again to verify
```

**Fix:**  
In app-quiz.js, after saving session:
```javascript
await Storage.saveSession(sessionData);
// Wait for save complete, THEN re-render home
setTimeout(_renderHome, 200);
```

**Test Case:** TC-03-019 (Session persistence)  
**Effort:** 45 min  
**PR Link:** (pending)

---

### BUG-003: Daily Quest Progress Bar Not Real-Time
**Severity:** CRITICAL  
**Found:** 2026-06-01 (UX Audit)

**Description:**  
User sees "Daily Quest: 1/3 objectives done". User completes first objective (does a quiz). **Expected:** Progress updates to "2/3" immediately. **Actual:** Bar stays at "1/3". Must reload page to see update.

**Root Cause:**  
`DailyQuest.completeObjective()` updates internal state but doesn't call `_renderHome()` to update the DOM. No reactive update.

**Impact:**  
Users can't see their progress toward quest reward. Kills motivation. "Is it counting?" moment.

**Fix:**  
```javascript
DailyQuest.completeObjective = function(objId) {
  this.state.done += 1;
  Storage.saveDailyQuest(this.state);
  // ADD THIS LINE:
  _renderHome(); // Re-render the quest bar
  
  if (this.state.done === this.state.total) {
    // ALL DONE — show reward
    this.triggerReward();
  }
}
```

**Test Case:** TC-06-002, TC-06-009  
**Effort:** 1 hour  
**PR Link:** (pending)

---

### BUG-004: Avatar Level-Up Animation Missing
**Severity:** CRITICAL  
**Found:** 2026-06-01 (UX Audit)

**Description:**  
User has 95 XP (almost Level 2). User completes quiz, earns 10 XP (now 105 XP, Level 2). **Expected:** Modal appears: "LEVEL UP! 🎉 You're now a Pup 🐕". **Actual:** Nothing happens. User opens Journey screen and sees avatar upgraded, but no celebration.

**Root Cause:**  
XP update saves to state but doesn't trigger celebration modal. No event handler.

**Impact:**  
Users don't feel achievement. Kills the "See Yourself Grow" promise. No dopamine moment.

**Fix:**  
```javascript
XP.addXP = function(points) {
  const oldLevel = this.levelFromXP(this.getTotalXP()).level;
  this.state.total += points;
  Storage.saveXP(this.state);
  const newLevel = this.levelFromXP(this.getTotalXP()).level;
  
  // ADD THIS:
  if (newLevel > oldLevel) {
    this.showLevelUpModal(newLevel);
  }
}
```

**Test Case:** TC-08-001, TC-07-008  
**Effort:** 1.5 hours  
**PR Link:** (pending)

---

### BUG-005: Streak Freeze Not Preventing Streak Break
**Severity:** CRITICAL (revenue-impacting)  
**Found:** 2026-06-01 (UX Audit)

**Description:**  
User has 14-day streak. User buys a "Streak Freeze" (premium feature: ₹29). User doesn't practice next day. User opens app the day after. **Expected:** Streak still shows 14 (freeze protected it). **Actual:** Streak shows 13 or broken.

**Root Cause:**  
`updateStreak()` checks for a missed day and decrements. Freeze state is not consulted.

**Impact:**  
Users lose a premium feature they paid for. Refund request. Trust loss.

**Fix:**  
```javascript
function updateStreak() {
  const streak = Storage.loadStreak();
  const today = new Date().toISOString().slice(0, 10);
  const lastDate = streak.lastDate;
  
  // ADD: Check if freeze is active
  const hasFreeze = streak.freezes && streak.freezes > 0;
  const canMissToday = hasFreeze && today !== lastDate;
  
  if (canMissToday) {
    streak.freezes -= 1;
    Storage.saveStreak(streak);
    return; // Don't break streak
  }
  
  // Original logic continues...
}
```

**Test Case:** TC-10-006, TC-10-007  
**Effort:** 1 hour  
**PR Link:** (pending)

---

### BUG-006: Mystery Box Not Appearing After Quest Completion
**Severity:** CRITICAL  
**Found:** 2026-06-01 (UX Audit)

**Description:**  
User completes Daily Quest (all 3 objectives). **Expected:** "Mystery Box 🎁" modal appears with animation. Reward shows: "You got: Rare Sticker!" or "+50 XP" or "1-Day Freeze". **Actual:** No modal. No animation. User checks Journey screen and the reward IS there, but they never saw the celebration.

**Root Cause:**  
Quest completion handler doesn't call reward trigger. No modal generation.

**Impact:**  
Users don't feel rewarded. Can't identify what they got. Might redo quest thinking it failed.

**Fix:**  
```javascript
DailyQuest.completeAll = function() {
  this.state.complete = true;
  Storage.saveDailyQuest(this.state);
  
  // ADD THIS:
  const reward = this.rollReward();
  this.showRewardModal(reward);
  this.state.reward = reward;
  Storage.saveDailyQuest(this.state);
}

DailyQuest.showRewardModal = function(reward) {
  // Create and show celebration modal with animation
  // Show reward icon + type (sticker, XP, freeze)
}
```

**Test Case:** TC-06-003, TC-11-002  
**Effort:** 1 hour  
**PR Link:** (pending)

---

*[Similar detailed descriptions for BUG-007 through BUG-018 follow the same format...]*

---

## Bug Fix Schedule

### Phase 0: Bug Fixes (This Week)

**Monday, 2026-06-01 — P0 Bugs (6 critical)**
- [ ] BUG-001 & BUG-013: Drill records key fix (30 min)
- [ ] BUG-002: Quiz session card update (45 min)
- [ ] BUG-003: Quest progress real-time (1h)
- [ ] BUG-004: Avatar level-up animation (1.5h)
- [ ] BUG-005: Streak freeze logic (1h)
- [ ] BUG-006: Mystery box reward (1h)
- **Total: 6 hours**

**Tuesday–Wednesday, 2026-06-02/03 — P1 Bugs (5 high-priority)**
- [ ] BUG-007: Drill timeout (1h)
- [ ] BUG-008: Share card avatar (1.5h)
- [ ] BUG-009: Challenge link encoding (1.5h)
- [ ] BUG-010: Settings persistence (1h)
- **Total: 5 hours**

**Thursday, 2026-06-04 — P2 Bugs (4 medium)**
- [ ] BUG-011: GK tab filtering (1h)
- [ ] BUG-012: Offline sync trigger (1h)
- [ ] BUG-014: Quiz explanation display (1h)
- [ ] BUG-015: Timer accuracy (1h)
- **Total: 4 hours**

**Friday, 2026-06-05 — Regression Testing**
- [ ] Re-run TC-01 through TC-16 (4h)
- [ ] Real device testing if available (2h)
- **Total: 6 hours**

---

## Metrics

| Metric | Value |
|---|---|
| **Total Bugs Found** | 18 |
| **Critical (P0)** | 6 |
| **High (P1)** | 5 |
| **Medium (P2)** | 4 |
| **Low (P3)** | 3 |
| **Testing Effort** | 3 hours (UX Audit) |
| **Fix Effort (P0+P1)** | ~11 hours |
| **Regression Testing** | ~6 hours |
| **Total Week Effort** | ~20 hours |

---

**Maintained by:** QA Lead  
**Last Audit:** 2026-06-01  
**Next Audit:** After all P0 fixes complete (2026-06-01 evening)

