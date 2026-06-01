# Test Gaps — Quick Checklist
**Donnibo / DecaShift — 2026-05-31**

## Critical Gaps (P0 — Must Fix Before Launch)

### GAP-001: Authentication Input Validation
- [ ] Empty field handling (all 5 fields tested)
- [ ] Email format validation ("test", "test@", invalid formats)
- [ ] Password strength rules (length, uppercase, numbers, symbols)
- [ ] Duplicate email detection (error message, prevent create)
- [ ] Wrong password sign-in (error + allow retry)
- [ ] Rate limiting (5 failed attempts = timeout?)

**Test Cases:** TC-01-006, TC-01-007, TC-01-008, TC-01-009, TC-01-010  
**Effort:** 3 hours  
**Status:** ☐ NOT STARTED

---

### GAP-002: Quiz Timer Accuracy & Feedback
- [ ] Correct answer = green highlight (verified visually)
- [ ] Wrong answer = red highlight (verified visually)
- [ ] Explanation panel appears after submit
- [ ] Timer counts accurately (30s = ~30s ±1s)
- [ ] Accuracy badges shown (🔥/✅/⚠️ at correct thresholds)
- [ ] Timeout behavior (>5 min → auto-advance or prompt)

**Test Cases:** TC-03-003, TC-03-004, TC-03-006, TC-03-007, TC-03-008, TC-03-011, TC-03-012, TC-03-014, TC-03-015, TC-03-016  
**Effort:** 4 hours  
**Status:** ☐ NOT STARTED

---

### GAP-003: Visual Responsive Design (Real Device)
- [ ] **375px (iPhone SE):** No horizontal scroll, text readable, buttons >44px
- [ ] **390px (iPhone 14):** Same as 375px
- [ ] **768px (iPad):** Layout adapts (2-column or full-width?), spacing OK
- [ ] **1440px (Desktop):** Hero grid visible, cards aligned, no wasted space
- [ ] **Landscape mode:** Should work or show warning
- [ ] **Color contrast:** Text on all backgrounds WCAG AA (4.5:1 normal, 3:1 large)
- [ ] **Font rendering:** Weights, sizes, kerning look intentional

**Test Cases:** All features, TC-02-018 as baseline  
**Effort:** 8 hours  
**Status:** ☐ NOT STARTED

**Devices needed:**
- [ ] iPhone SE or 6S (375px)
- [ ] iPhone 14 or 13 (390px)
- [ ] iPad or Android tablet (768px+)
- [ ] Android phone 375px (Galaxy A10 or similar)

---

## High-Impact Gaps (P1 — High Risk)

### GAP-004: Daily Quest & Streak Reset Logic
- [ ] Quest bar shows on Home (visible: done/total)
- [ ] 3 objectives clear on completion (e.g., "1 quiz", "2 drill", "GK capsule")
- [ ] Mystery box appears after quest done (animation + sound)
- [ ] Midnight reset triggers (set system time → midnight → quest resets)
- [ ] Streak increments (quiz completion → streak +1)
- [ ] Streak freeze works (freeze on day 5 → skip day 6 → day 7 streak still 5)
- [ ] Longest streak tracked (separate from current)
- [ ] Same-day idempotency (2 quizzes same day → streak +1 not +2)

**Test Cases:** TC-06-003, TC-06-004, TC-06-005, TC-06-006, TC-06-007, TC-06-008, TC-06-009, TC-06-010, TC-06-011, TC-10-002, TC-10-003, TC-10-004, TC-10-005, TC-10-006, TC-10-007, TC-10-008, TC-10-010, TC-10-012  
**Effort:** 10 hours  
**Status:** ☐ NOT STARTED

**Note:** Requires system clock manipulation (OS setting or DevTools Overrides)

---

### GAP-005: Flash Drills Edge Cases
- [ ] Drill card displays name (e.g., "Tables", "Alphabet")
- [ ] Timer: 30s per question → auto-advance or timeout prompt
- [ ] Wrong answer feedback (red card, no explanation)
- [ ] PB (Personal Best) tracking (localStorage persists)
- [ ] Shuffle: same drill run twice → different question order
- [ ] Session size: exactly 20 questions per session
- [ ] XP award: 20 correct → X XP (check expected value)
- [ ] Quest integration: drill counts toward "2 drill" objective?

**Test Cases:** TC-04-003, TC-04-004, TC-04-005, TC-04-006, TC-04-007, TC-04-008, TC-04-009, TC-04-010, TC-04-011, TC-04-012, TC-04-013, TC-04-014, TC-04-015, TC-04-016, TC-04-017  
**Effort:** 6 hours  
**Status:** ☐ NOT STARTED

---

### GAP-006: Share Card & Challenge Link Mechanics
- [ ] Native share button on result screen (Android: system sheet, iOS: share menu)
- [ ] Share card PNG renders (1080×1080, avatar visible, text readable)
- [ ] Challenge link generated (payload encodes score, goal, answers)
- [ ] Friend opens challenge link (new browser, no account)
- [ ] Signup flow: new friend signs up → challenge auto-loads
- [ ] Head-to-head result: comparison screen shows who scored higher
- [ ] Replay prevention: second click on same challenge → "Already attempted" or expired
- [ ] Invalid payload: corrupted URL → error message not crash

**Test Cases:** TC-12-001, TC-12-004, TC-12-005, TC-12-006, TC-12-007, TC-12-008, TC-12-009, TC-12-010, TC-13-004, TC-13-005, TC-13-006, TC-13-007, TC-13-008, TC-13-009, TC-13-010, TC-13-011  
**Effort:** 8 hours  
**Status:** ☐ NOT STARTED

**Note:** Requires WhatsApp or link-sharing platform for payload verification

---

## Medium Gaps (P2 — Important)

### GAP-007: Settings Form Validation & Profile Edit
- [ ] Profile name edit (change + save + reload → persisted)
- [ ] Grade change (change grade → manifest cache clears → new content loads)
- [ ] Theme toggle (dark/light mode → contrast OK, persisted)
- [ ] Timer toggle (disable timer → quiz runs without timer)
- [ ] Password change (old password verification required)
- [ ] All 7 settings tiles clickable (navigate to correct sub-screen)
- [ ] Lazy load: Settings only load when modal opens (not at app start)

**Test Cases:** TC-15-004, TC-15-005, TC-15-006, TC-15-007, TC-15-008, TC-15-009, TC-15-010, TC-15-011, TC-15-012, TC-15-013, TC-15-014, TC-15-015, TC-15-016  
**Effort:** 4 hours  
**Status:** ☐ NOT STARTED

---

### GAP-008: PWA Install Prompt & iOS Fallback
- [ ] Install banner appears on Android Chrome (first visit)
- [ ] Banner text clear ("Add to home screen" or equiv)
- [ ] Install button works (adds to home screen icon)
- [ ] Dismiss behavior (reappears in 3+ days, not immediately)
- [ ] iOS custom instructions (Safari menu steps clearly described)
- [ ] Standalone mode (after install, app runs without browser chrome)
- [ ] Offline cache (JavaScript, CSS, images load from cache)
- [ ] Manifest accessible (HTTP 200)

**Test Cases:** TC-16-001, TC-16-002, TC-16-003, TC-16-004, TC-16-005, TC-16-006, TC-16-007, TC-16-009, TC-16-010, TC-16-011  
**Effort:** 6 hours  
**Status:** ☐ NOT STARTED

**Devices needed:**
- [ ] Android phone (Chrome)
- [ ] iPhone (Safari)

---

## Summary by Feature

| Feature | Automated | Manual | Priority | Status |
|---|---|---|---|---|
| **Auth (TC-01)** | 6/15 (40%) | **9/15** | 🔴 P0 | ☐ PENDING |
| **Home (TC-02)** | 8/18 (44%) | 10/18 | 🟡 P1 | ☐ PENDING |
| **Quiz (TC-03)** | 10/21 (48%) | **11/21** | 🔴 P0 | ☐ PENDING |
| **Drills (TC-04)** | 5/17 (29%) | **12/17** | 🟡 P1 | ☐ PENDING |
| **GK (TC-05)** | 2/12 (17%) | 10/12 | 🟡 P1 | ☐ PENDING |
| **Quest (TC-06)** | 3/12 (25%) | **9/12** | 🔴 P1 | ☐ PENDING |
| **XP (TC-07)** | 9/14 (64%) | 5/14 | 🟢 OK | ✅ MOSTLY COVERED |
| **Avatar (TC-08)** | 4/10 (40%) | 6/10 | 🟡 P1 | ☐ PENDING |
| **Journey (TC-09)** | 6/14 (43%) | 8/14 | 🟡 P1 | ☐ PENDING |
| **Streak (TC-10)** | 5/12 (42%) | **7/12** | 🔴 P1 | ☐ PENDING |
| **Collectibles (TC-11)** | 5/11 (45%) | 6/11 | 🟡 P1 | ☐ PENDING |
| **Share (TC-12)** | 2/10 (20%) | **8/10** | 🔴 P1 | ☐ PENDING |
| **Challenge (TC-13)** | 3/11 (27%) | **8/11** | 🔴 P1 | ☐ PENDING |
| **Paywall (TC-14)** | 4/11 (36%) | 7/11 | 🟡 P1 | ☐ PENDING |
| **Settings (TC-15)** | 5/17 (29%) | **12/17** | 🟡 P2 | ☐ PENDING |
| **PWA (TC-16)** | 8/13 (62%) | 5/13 | 🟡 P2 | ☐ PENDING |
| **TOTAL** | **75/195 (38%)** | **122/195 (62%)** | — | ☐ **0% COMPLETE** |

---

## Execution Plan Quick View

### Week 1 (Jun 02–04)
- [ ] GAP-001: Auth validation (3h)
- [ ] GAP-002: Quiz timer + feedback (4h)
- [ ] GAP-003: Visual RegressionRealDevice (8h)
- **Total: 15 hours**

### Week 2 (Jun 05–07)
- [ ] GAP-004: Quest/Streak logic (10h)
- [ ] GAP-005: Flash drills (6h)
- [ ] GAP-006: Share/Challenge (8h)
- **Total: 24 hours**

### Week 3 (Jun 08–10)
- [ ] GAP-007: Settings (4h)
- [ ] GAP-008: PWA install (6h)
- [ ] Accessibility scan (2h)
- **Total: 12 hours**

**Grand Total: 51 hours (~1.3 person-weeks)**

---

## Testing Best Practices

### For Real Device Testing
1. **Setup:**
   - Open app to `https://abhisheksinha02.github.io/DecaShift/`
   - Clear localStorage (DevTools → Application → Storage → Clear)
   - Sign up fresh account (or use test account)

2. **Documentation:**
   - Screenshot each test result (PASS/FAIL)
   - Note device + browser + network condition
   - Copy console errors if any (F12 → Console)

3. **Systematic Approach:**
   - Test one TC per session (avoid context switch)
   - Mark status immediately (don't batch)
   - File bug if FAIL (don't assume it's the test)

### For Timer & Streak Testing
- Use browser DevTools to override system time (Chrome: DevTools → Console → `new Date('2026-06-01').toString()`)
- Or: Edit localStorage directly (`ds_user → trialStart` for trial expiry tests)

### For Performance Testing
- Use DevTools Throttling: Slow 3G + 4× CPU slowdown
- Measure FCP (First Contentful Paint), LCP (Largest Contentful Paint)
- Watch for frame drops (60 fps = 16.67 ms per frame)

---

## How to Use This Checklist

1. **Before Release:** Run through all P0 + P1 gaps (41 hours)
2. **During QA Cycle:** Check off each TC as you execute
3. **After Execution:** Update status column (✅ PASS / ❌ FAIL / — SKIP)
4. **Trending:** Copy this checklist each month to track progress

---

**Last Updated:** 2026-05-31  
**Next Review:** 2026-06-07

