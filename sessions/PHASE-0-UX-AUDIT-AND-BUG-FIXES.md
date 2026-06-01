# Phase 0: UX Audit & Bug Fixes
**Status:** IN PROGRESS (🎯 Highest Priority)  
**Duration:** 2–3 weeks  
**Owner:** Development Team  
**Blocker For:** W24 Content Sprint, Launch  

---

## Session Overview

This phase prioritizes **user experience stability** over new features. We found 18 bugs (6 critical) through aggressive UX testing. Core engagement loops are broken:

- Quiz completions not showing on home card
- Flash drill scores not persisting
- Daily quest not showing real-time progress
- Avatar level-ups have no celebration
- Streak freeze feature doesn't work
- Mystery box doesn't appear

**Decision:** Fix all bugs BEFORE generating W24 content. Stable, polished app > rich content on broken foundation.

---

## Week 1: P0 Bug Fixes (Critical)

### Monday, June 01 — P0 Bugs (6 critical, 6 hours)

| Bug | Feature | Issue | Fix | ETA | Owner | Status |
|---|---|---|---|---|---|---|
| BUG-001 | Flash Drills | Card shows "Not Tried Yet" after completion | Change localStorage key `ds_drill_bests` → `ds_drill_records` in app-home.js:360 | 30 min | Dev | ☐ |
| BUG-013 | Flash Drills | Personal best not showing | Same fix as BUG-001 | 30 min | Dev | ☐ |
| BUG-002 | Quiz Engine | Session not persisting to home card | Add `_renderHome()` call after session save in app-quiz.js | 45 min | Dev | ☐ |
| BUG-003 | Daily Quest | Progress bar not real-time | Add `_renderHome()` callback in `DailyQuest.completeObjective()` | 1h | Dev | ☐ |
| BUG-004 | Avatar/XP | Level-up animation missing | Create level-up modal trigger in `XP.addXP()` | 1.5h | Dev | ☐ |
| BUG-005 | Streak | Freeze not preventing break | Check freeze status in `updateStreak()` before decrement | 1h | Dev | ☐ |
| BUG-006 | Daily Quest | Mystery box not appearing | Add reward trigger after quest completion | 1h | Dev | ☐ |

**Daily Review:** Test each fix immediately after implementation. If broken, rollback and debug.

---

### Tuesday, June 02–03 — P1 Bug Fixes (5 high, 5 hours)

| Bug | Feature | Issue | Fix | ETA | Owner | Status |
|---|---|---|---|---|---|---|
| BUG-007 | Flash Drills | 30-second timeout not working | Add auto-advance when timer reaches 30s in `_renderDrillQuestion()` | 1h | Dev | ☐ |
| BUG-008 | Share Card | Wrong/blank avatar on card | Verify `ShareCard.render()` gets correct level from `XP.levelFromXP()` | 1.5h | Dev | ☐ |
| BUG-009 | Challenge | Link fails/invalid | Test URL encoding under WhatsApp; fix base64 padding | 1.5h | Dev | ☐ |
| BUG-010 | Settings | Changes not persisted | Add localStorage sync before modal close in `app-settings.js` | 1h | Dev | ☐ |

**Daily Review:** Test on real Android + iOS devices (if available).

---

### Thursday, June 04 — P2 Bug Fixes (4 medium, 4 hours)

| Bug | Feature | Issue | Fix | ETA | Owner | Status |
|---|---|---|---|---|---|---|
| BUG-011 | Home Screen | GK tab shown with no content | Filter out empty subjects in subject tabs | 1h | Dev | ☐ |
| BUG-012 | Offline/Sync | Not syncing after online | Add `window.addEventListener('online', _syncSessions)` | 1h | Dev | ☐ |
| BUG-014 | Quiz Engine | Explanation not showing | Verify question JSON has `explanation` field; render in quiz feedback | 1h | Dev | ☐ |
| BUG-015 | Quiz Timer | Inaccurate on slow network | Document limitation; test on DevTools Slow 3G | 1h | Dev | ☐ |

---

### Friday, June 05 — Regression Testing (6 hours)

- [ ] Re-run TC-01 through TC-16 with all fixes applied
- [ ] Real device testing (if 1–2 devices available): 375px, 390px, 768px, 1440px
- [ ] Manual QA pass: Complete 1 full user journey (signup → quiz → result → home → verify card updated)
- [ ] Check for new bugs introduced by fixes

---

## Week 2: E-014 (Re-engagement) + P3 Polish

### Monday–Tuesday, June 08–09 — E-014 Implementation (4 hours)

**Feature:** Daily reminder + streak-save nudge  
**Goal:** Push notification / email reminder for users who haven't practiced today

- [ ] Design notification copy
- [ ] Implement reminder trigger
- [ ] Test on real devices
- [ ] Deploy

### Wednesday–Thursday, June 10–11 — P3 Polish (3 hours)

- [ ] BUG-016: Accuracy badge clarity (tooltip)
- [ ] BUG-017: Drill card text truncation (CSS)
- [ ] BUG-018: Streak modal dismiss (event handler)

### Friday, June 12 — Final QA + Launch Readiness

- [ ] Cross-breakpoint visual QA
- [ ] Real device testing
- [ ] Performance check (payload < 400 KB, load < 3s on Slow 3G)
- [ ] Accessibility scan (axe-core)
- [ ] Go/No-Go decision for launch

---

## Week 3: Content Sprint (W24 Science)

**Only start if Phase 0 + E-014 are complete and stable.**

- [ ] Generate 140 files / ~2,100 questions for Week 24 (Jun 08–14)
- [ ] Parallel to Week 2 if team has capacity

---

## Testing Strategy (New)

### Before Each Fix
1. **Reproduce the bug** (user perspective, not code inspection)
2. **Document expected behavior** (what user should see)
3. **Record current behavior** (screenshot if possible)

### After Each Fix
1. **Verify fix works** (test on real device if possible, or Playwright)
2. **Check for regressions** (run related test cases)
3. **Document fix** (what changed, why, test evidence)

### After All Fixes
1. **Full regression run** (all 195 test cases? No. At least TC-01, TC-03, TC-04, TC-06, TC-10)
2. **Real device pass** (ideally 2–3 devices: Android phone, iPhone, tablet)
3. **User flow verification** (walk through signup → quiz → home → results)

---

## Success Criteria

| Metric | Target | Current | Status |
|---|---|---|---|
| Critical bugs fixed | 0 | 6 | ☐ |
| High bugs fixed | 0 | 5 | ☐ |
| Test pass rate (P0+P1) | 100% | 0% | ☐ |
| Real device testing | 2+ devices | 0 | ☐ |
| Launch confidence score | 90+/100 | 85/100 | ☐ |
| User journey works end-to-end | ✅ | ❓ | ☐ |

---

## Communication Plan

### Daily (5 min standup)
- "Fixed BUG-001 + BUG-013, testing now"
- Blockers: "BUG-002 requires state refactor, in progress"

### End of Week (Friday)
- Bugs fixed: [list]
- Bugs remaining: [list]
- Go/No-Go for next phase: [decision]

---

## Related Documents

- 📋 [UX Audit Session](../test-review/UX-AUDIT-SESSION-2026-06-01.md) — Full bug details
- 📋 [Bugs Log](../test-review/BUGS-LOG-2026.md) — Tracking + solutions
- 📋 [E-014 Implementation](ENGAGEMENT-SESSIONS.md) — Re-engagement feature
- 📋 [W24 Content Plan](../tasks/marketing/CONTENT-GEN-3MONTH-PLAN.md) — Queue when Phase 0 done

---

## Risk Management

| Risk | Mitigation |
|---|---|
| Fixes break other features | 1. Small atomic commits 2. Regression test after each fix 3. Quick rollback if needed |
| Can't reproduce bug | 1. User journey simulation 2. Real device testing 3. Ask 11-year-old to find bug again |
| Scope creep (new features) | 🚫 FREEZE new features. ONLY bug fixes. E-014 is exception (engagement critical). |
| Not enough time | Prioritize: P0 (required) > E-014 (engagement) > P1 (polish). Ship with P0 done. |

---

## Definition of Done (Per Bug)

- [ ] Bug reproduced and documented
- [ ] Root cause identified and understood
- [ ] Fix implemented and committed
- [ ] Fix tested (real device if possible)
- [ ] No regressions introduced
- [ ] Related test cases pass
- [ ] User can't find the bug anymore

---

**Kickoff Date:** 2026-06-01 (Friday)  
**Target Completion:** 2026-06-12 (Friday)  
**Blocker For:** W24 Content, Launch  
**Owner:** Development Team  
**QA Lead:** UX Test Engineer  

---

**Next Session:** When Phase 0 P0 bugs are fixed (2026-06-02 evening), do a 1-hour regression test.

