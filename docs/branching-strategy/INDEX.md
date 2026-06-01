# Branching Strategy Documentation — Complete Index
**Created:** 2026-06-01  
**Updated:** 2026-06-01 (Context 86% utilization)  
**Next Session Focus:** Phase 0 Bug Fixes (UX/UI stabilization)

---

## 📚 What's in This Folder

| Document | Purpose | Read When |
|---|---|---|
| **INDEX.md** (this file) | Navigation and overview | Starting new session |
| **BRANCH-STRATEGY.md** | How to work with git branches | Before starting work |
| **RELEASE-TAGGING-STRATEGY.md** | How to create restore points with tags | After completing each phase |

---

## 🎯 Current State Summary

### Branches
```
main (v4.3)
  ├─ Status: 🔵 Active development
  ├─ Current commit: aa61850
  ├─ Purpose: Bug fixes + features + content
  └─ Work here 100% of the time

v5.0-dev
  ├─ Status: 🔒 Frozen backup
  ├─ Current commit: 6c35c60
  ├─ Purpose: Emergency restore only
  └─ Do NOT touch unless main is unfixable
```

### Tags (Restore Points)
```
✅ v4.3-stable (2026-06-01 snapshot)
✅ v4.3.0 (baseline)
⏳ v4.3.1 (scheduled: Monday 2026-06-02 EOD — after P0 bugs)
⏳ v4.3.2 (scheduled: Wednesday 2026-06-04 EOD — after P1 bugs)
⏳ v4.3.3 (scheduled: Friday 2026-06-12 EOD — after E-014 + W24)
⏳ v4.3-final (scheduled: Friday 2026-06-19 EOD — launch ready)
```

---

## 📋 How to Use This Documentation

### For Bug Fixing (Next Session)

1. **Before starting:**
   - Read: `BRANCH-STRATEGY.md` (5 min)
   - Command: `git checkout main && git pull origin main`

2. **During work:**
   - Work on main only
   - Commit frequently
   - Push to origin/main

3. **At end of phase:**
   - Read: `RELEASE-TAGGING-STRATEGY.md`
   - Create tag: `git tag -a v4.3.1 -m "..."`
   - Push tag: `git push origin v4.3.1`

### Quick Reference Commands

```bash
# See current state
git branch -vv
git tag -l

# Work on main
git checkout main
git pull origin main
# ... make changes ...
git add .
git commit -m "fix: BUG-001"
git push origin main

# Create restore point (at end of phase)
git tag -a v4.3.1 -m "v4.3.1 — P0 bugs fixed"
git push origin v4.3.1

# Emergency restore (if main breaks)
git reset --hard v4.3.1
git push -f origin main
```

---

## 🚨 Important Rules

### ✅ DO
1. Work on **main** 100% of the time
2. Test from **main** 100% of the time
3. Push to **main** after every commit
4. Create tags at end of each phase
5. Keep **v5.0-dev frozen** as backup

### ❌ DON'T
1. Branch-hop for testing
2. Touch v5.0-dev
3. Work on multiple branches
4. Forget to push tags
5. Delete tags once pushed

---

## 📅 Phase 0 Timeline (Next Session)

### Monday 2026-06-02 (6 hours)
**Phase 0: Critical Bugs (BUG-001 through BUG-006)**
- [ ] Fix BUG-001 & BUG-013: Drill key mismatch (30 min)
- [ ] Fix BUG-002: Quiz persistence (45 min)
- [ ] Fix BUG-003: Quest real-time (1h)
- [ ] Fix BUG-004: Avatar animation (1.5h)
- [ ] Fix BUG-005: Streak freeze (1h)
- [ ] Fix BUG-006: Mystery box (1h)
- [ ] Create tag: `v4.3.1` (EOD)

### Wednesday 2026-06-04 (5 hours)
**Phase 1: High-Priority Bugs (BUG-007 through BUG-010)**
- [ ] Fix BUG-007 through BUG-010 (5h total)
- [ ] Regression testing (1h)
- [ ] Create tag: `v4.3.2` (EOD)

### Friday 2026-06-05 (6 hours)
**Final QA + E-014 Start**
- [ ] Full regression test (3h)
- [ ] Real device testing (2h)
- [ ] Go/No-Go decision (1h)

---

## 📍 Next Session Handoff

**File:** `sessions/SESSION-HANDOFF-2026-06-01.md` (created separately)

Contains:
- What was completed in this session
- What's ready for next session
- Exact first step to take
- All context needed

---

## Related Documentation

| Document | Location | Purpose |
|---|---|---|
| UX Audit Results | `test-review/UX-AUDIT-SESSION-2026-06-01.md` | 18 bugs found, root causes, fixes |
| Bugs Log | `test-review/BUGS-LOG-2026.md` | Bug tracking + solutions |
| Phase 0 Plan | `sessions/PHASE-0-UX-AUDIT-AND-BUG-FIXES.md` | Weekly execution plan |
| Username Feature | `features/P2-T047-USERNAME-SELECTION.md` | Identity strategy design |
| Session Index | `sessions/INDEX.md` | All sessions + priority queue |

---

## Decision Points to Remember

1. **One branch, not many:** main only (with v5.0-dev frozen backup)
2. **Test from main:** Don't switch branches for testing
3. **Tag at milestones:** v4.3.1, v4.3.2, v4.3.3, v4.3-final
4. **Frozen backup:** v5.0-dev is insurance policy, not development branch
5. **Focus:** All work → bug fixes (Phase 0) → then features

---

## Git Command Cheat Sheet

```bash
# === DAILY WORK ===
git checkout main
git pull origin main
# ... edit code ...
git add .
git commit -m "fix: BUG-001"
git push origin main

# === AT END OF PHASE (Monday/Wednesday/Friday) ===
git tag -a v4.3.1 -m "v4.3.1 — P0 bugs fixed (BUG-001 through BUG-006)"
git push origin v4.3.1

# === EMERGENCY RESTORE ===
git reset --hard v4.3.1
git push -f origin main

# === VIEW STATE ===
git branch -vv
git tag -l
git log --oneline -5
```

---

## Success Criteria for Next Session

| Milestone | Target | Date | Status |
|---|---|---|---|
| **P0 Bugs Fixed** | BUG-001 through BUG-006 | Mon 2026-06-02 | ⏳ |
| **P0 Tagged** | v4.3.1 created + pushed | Mon EOD | ⏳ |
| **P1 Bugs Fixed** | BUG-007 through BUG-010 | Wed 2026-06-04 | ⏳ |
| **P1 Tagged** | v4.3.2 created + pushed | Wed EOD | ⏳ |
| **Full QA** | Regression test + real device | Fri 2026-06-05 | ⏳ |
| **App Stable** | All bugs fixed, no regressions | Fri EOD | ⏳ |

---

## Files Created This Session (2026-06-01)

### Strategy Docs
- ✅ `BRANCH-STRATEGY.md` (root, also in docs/)
- ✅ `RELEASE-TAGGING-STRATEGY.md` (root, also in docs/)
- ✅ `docs/branching-strategy/INDEX.md` (this file)
- ✅ `docs/branching-strategy/BRANCH-STRATEGY.md` (copy)
- ✅ `docs/branching-strategy/RELEASE-TAGGING-STRATEGY.md` (copy)

### Test Review Docs
- ✅ `test-review/REVIEW-2026-05-31.md` (gap analysis)
- ✅ `test-review/GAPS-CHECKLIST.md` (quick reference)
- ✅ `test-review/GAPS-BY-CATEGORY.md` (detailed breakdown)
- ✅ `test-review/EXECUTIVE-SUMMARY.md` (1-pager)
- ✅ `test-review/UX-AUDIT-SESSION-2026-06-01.md` (18 bugs found)
- ✅ `test-review/BUGS-LOG-2026.md` (tracking + solutions)
- ✅ `test-review/UX-AUDIT-SUMMARY-REPORT.md` (full report)

### Session/Feature Docs
- ✅ `sessions/PHASE-0-UX-AUDIT-AND-BUG-FIXES.md` (execution plan)
- ✅ `features/P2-T047-USERNAME-SELECTION.md` (identity strategy)
- ✅ `sessions/SESSION-HANDOFF-2026-06-01.md` (next session brief)

### Git/Repo Docs
- ✅ `BRANCH-STRATEGY.md` (git strategy)
- ✅ `RELEASE-TAGGING-STRATEGY.md` (tagging strategy)

### Commits
- ✅ `be5023e` — test gap analysis review
- ✅ `6c35c60` — UX audit findings (18 bugs)
- ✅ `e76d8a5` — branch strategy
- ✅ `aa61850` — release tagging strategy

### Tags
- ✅ `v4.3-stable` (snapshot)
- ✅ `v4.3.0` (baseline)

---

## What Changed This Session

**Before:**
- App had 195 test cases, 75 automated, 122 manual unexecuted
- 18 UX/UI bugs unknown
- No clear branching strategy
- One branch (main) with unclear direction

**After:**
- ✅ All 18 bugs discovered, documented, with root causes and fixes
- ✅ Clear branching strategy (main only, v5.0-dev backup)
- ✅ Tagging restore points (v4.3.0 → v4.3.1 → v4.3.2 → v4.3-final)
- ✅ Phase 0 execution plan (Monday–Friday timeline)
- ✅ Complete documentation (7 strategy docs, 7 test review docs, 3 session docs)
- ✅ Ready for next session (bug fixing)

---

## Next Session Entry Point

**File to read:** `sessions/SESSION-HANDOFF-2026-06-01.md`

Contains:
- Summary of this session (what was done)
- Current app state (stable/broken? 18 bugs found)
- Exact task for next session (Fix BUG-001)
- First command to run (git checkout main)
- All context needed (no reading 10 files required)

---

**Last Updated:** 2026-06-01 (context 86% utilization)  
**Next Session:** Phase 0 Bug Fixes (start Monday 2026-06-02)  
**Ready:** ✅ YES

