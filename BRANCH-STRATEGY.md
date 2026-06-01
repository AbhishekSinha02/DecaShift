# Git Branch Strategy — Donnibo v4.3 → v5.0
**Created:** 2026-06-01  
**Branching Model:** Main + Feature Branches (Two parallel tracks)

---

## Overview

Two active development branches for **parallel work**:

```
v4.3-stable (tag)
     ↓
main (v4.3 — Bug fixes & stabilization)
     ↓
v5.0-dev (New features & content)
```

---

## Branches

### 🔵 **main** — v4.3 Stable + Bug Fixes
**Purpose:** Production-ready, bug-fixed version  
**Owner:** Dev Team (bug fixes)  
**Current State:** Post-UX audit, 18 bugs found, Phase 0 fix work beginning  
**What goes here:**
- ✅ BUG fixes (P0, P1, P2, P3)
- ✅ Regression testing
- ✅ Performance/optimization
- ❌ New features
- ❌ Large refactors

**Workflow:**
```
1. Create branch from main: git checkout -b bugfix/BUG-001
2. Fix bug (1–2 hours)
3. Test locally (verify + regression)
4. Commit: "fix: BUG-001 drill key mismatch"
5. Push: git push origin bugfix/BUG-001
6. PR to main (QA approves)
7. Merge to main
```

**Merge Strategy:** Squash + merge (keep history clean for bug tracking)

**Release Cadence:** Weekly (Friday EOD), tag as v4.3.1, v4.3.2, etc.

---

### 🟢 **v5.0-dev** — Next Generation Features
**Purpose:** New features, content, engagement improvements  
**Owner:** Feature Teams (E-014, W24 content, etc.)  
**Branching Point:** v4.3-stable (2026-06-01 snapshot)  
**What goes here:**
- ✅ New features (E-014 re-engagement, avatars, etc.)
- ✅ Content generation (W24, W25, etc.)
- ✅ Large refactors (if needed)
- ✅ UI/UX improvements
- ❌ Bug fixes to v4.3 (those go to main)

**Workflow:**
```
1. Create feature branch from v5.0-dev: git checkout -b feature/E-014
2. Implement feature (2–3 hours)
3. Test on v5.0-dev
4. Commit: "feat: E-014 re-engagement daily nudge"
5. Push: git push origin feature/E-014
6. PR to v5.0-dev (review + test)
7. Merge to v5.0-dev
```

**Merge Strategy:** Squash + merge (clean feature history)

**Development Cadence:** Continuous (features as ready)

---

## Timeline & Sync Strategy

```
JUNE 2026 Timeline:

Week 1 (Jun 01–05): Phase 0 Bug Fixes
  main: BUG-001 through BUG-015 fixed + tested
  v5.0-dev: Parallel — ready for E-014 start
  
Week 2 (Jun 08–12): E-014 + W24 Content Start
  main: P1/P2 fixes + regression testing
  v5.0-dev: E-014 implementation + W24 content session 1
  
Week 3 (Jun 15–19): Sync & Merge
  ⚠️ DO NOT merge v5.0-dev back to main yet
  Wait for: (1) all main fixes stable, (2) E-014 complete & tested
  Then: Create release candidate (main @ v4.3.final)
  
Week 4 (Jun 22–26): Launch Preparation
  main: Final QA on v4.3 build
  v5.0-dev: Continue features; branch ready for v5.0 beta
  
JULY 2026: Post-Launch
  main: v4.3 hotfixes only (maintenance mode)
  v5.0-dev: Full feature development
  Eventually: Merge v5.0-dev to main for v5.0 release
```

---

## How to Sync Branches (If Needed)

**Scenario:** Bug fix on main needs to be in v5.0-dev too

```bash
# Option A: Cherry-pick specific commits
git checkout v5.0-dev
git cherry-pick <commit-hash>

# Option B: Merge main into v5.0-dev (includes all history)
git checkout v5.0-dev
git merge main
```

**When to sync:**
- ✅ Critical security fixes (both branches)
- ✅ Critical performance fixes (both branches)
- ❌ Regular bug fixes (main only)
- ❌ New features (v5.0-dev only)

---

## Branch Protection Rules

### main (v4.3)
- ✅ Require PR review (1 approval)
- ✅ Require CI checks pass (if automated tests set up)
- ✅ Dismiss stale PRs after 1 week
- ✅ Require branches up-to-date before merge

### v5.0-dev
- ✅ Require PR review (1 approval)
- ✅ Allow force-push (for interactive rebase cleanups)
- ✅ Require branches up-to-date before merge

---

## Naming Convention

### Feature Branches (from v5.0-dev)
```
feature/E-014-re-engagement-nudge
feature/W24-science-content
feature/avatar-evolution
```

### Bug Branches (from main)
```
bugfix/BUG-001-drill-key-mismatch
bugfix/BUG-005-streak-freeze-logic
hotfix/critical-security-issue
```

### Content Branches (from v5.0-dev)
```
content/W24-science-grades2-8
content/W25-math-professional
```

---

## Commit Message Convention

### Bug Fixes (main)
```
fix: BUG-001 drill card shows "not tried yet"

Root cause: localStorage key mismatch (ds_drill_bests vs ds_drill_records)
Solution: Changed app-home.js:360 to read ds_drill_records
Test: Complete drill, go home, verify card shows score
Closes: BUG-001
```

### Features (v5.0-dev)
```
feat: E-014 daily re-engagement nudge

- Show daily reminder notification if user hasn't practiced
- 2x pushes: 5pm (gentle) and 8pm (stronger CTA)
- A/B test: nudge type 1 vs type 2 (50/50 split)
- Analytics: track nudge view → action conversion

Related: P2-T051
```

### Content (v5.0-dev)
```
content: W24 Science content (Grades 2–8)

Files added: 35 new grade-specific science question files
Questions: 525 MCQs (75/grade) + 40 formulas
Coverage: Physics, Chemistry, Biology (per CBSE curriculum)
Manifest: Updated w24-science-manifest.json

Session: C4-W24-Science
```

---

## Deployment Flow

### v4.3 (main)
```
1. Bug fixed on main
2. QA approves PR
3. Merge to main
4. Tag: v4.3.X (e.g., v4.3.1)
5. Deploy to GitHub Pages (automatic)
6. Live URL: https://abhisheksinha02.github.io/DecaShift/
```

### v5.0 (v5.0-dev) — Post-Launch
```
1. Features ready on v5.0-dev
2. Create release branch: release/v5.0
3. Final QA on release branch
4. Tag: v5.0.0
5. Merge to main (replaces v4.3)
6. Deploy
```

---

## When to Create Child Branches

**From main (v4.3):**
```
bugfix/BUG-XXX (for individual bugs)
hotfix/critical-X (for urgent fixes)
```

**From v5.0-dev:**
```
feature/E-XXX (for engagement features)
content/WXX-subject (for content weeks)
refactor/module-name (for refactors)
```

**Never:** Branch from feature/content branches directly. Always branch from v5.0-dev.

---

## Troubleshooting

### "I accidentally committed to main when I meant v5.0-dev"
```bash
# Check which branch you're on
git branch

# Switch to v5.0-dev
git checkout v5.0-dev

# View recent commits
git log --oneline | head -5

# If commit is on main but needed on v5.0-dev:
git cherry-pick <commit-hash>

# Then remove from main (ask maintainer to force-reset if needed)
```

### "I need to merge main bug fixes into v5.0-dev"
```bash
git checkout v5.0-dev
git merge main --strategy-option=theirs
# This merges main into v5.0-dev, preferring v5.0-dev changes in conflicts
```

### "How do I update my feature branch with latest v5.0-dev?"
```bash
git fetch origin
git checkout feature/E-014
git rebase origin/v5.0-dev
git push -f origin feature/E-014
```

---

## Status Dashboard

| Branch | Last Commit | Purpose | Ready? | Next Action |
|---|---|---|---|---|
| **main** | `6c35c60` (UX audit) | Bug fixes | ⏳ In progress | Start Phase 0 fixes (BUG-001) |
| **v5.0-dev** | `6c35c60` (synced) | New features | ✅ Ready | Can start E-014 anytime |
| **v4.3-stable** (tag) | `6c35c60` | Snapshot | ✅ Locked | Reference point for v5.0-dev |

---

## Quick Reference

```bash
# Clone with all branches
git clone --all https://github.com/AbhishekSinha02/DecaShift.git

# List all branches
git branch -a

# Switch to v5.0-dev
git checkout v5.0-dev

# Create feature branch from v5.0-dev
git checkout -b feature/E-014
git push -u origin feature/E-014

# Create bugfix from main
git checkout main
git checkout -b bugfix/BUG-001
git push -u origin bugfix/BUG-001

# Merge feature back to v5.0-dev (via PR recommended)
git checkout v5.0-dev
git merge feature/E-014

# View branch graph
git log --oneline --graph --all --decorate
```

---

## Key Principles

1. **main = production-ready** (v4.3 bug fixes only)
2. **v5.0-dev = development sandbox** (new features safe zone)
3. **No cross-branch development** (bug to v5.0-dev? Cherry-pick only)
4. **Sync only critical fixes** (security, crashes; not regular bugs)
5. **Clean merge commits** (squash feature PRs, keep history readable)

---

**Created:** 2026-06-01  
**Reviewed by:** Product Lead  
**Status:** Active  
**Next Review:** 2026-06-30 (post-launch assessment)

