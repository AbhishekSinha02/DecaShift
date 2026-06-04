> ⚠️ **SUPERSEDED — HISTORICAL ONLY, DO NOT FOLLOW.** Describes an old multi-branch
> model no longer in use. **Current rule: develop on `main` only; `v6.0` is THE single
> cold backup (one and only one); milestone tags on `main` use the `-stable` suffix
> (e.g. `v6.0-stable`) to avoid the branch/tag name clash.**
> Source of truth: CLAUDE.md → "Branching & Deployment Strategy".

# Release Tagging Strategy — Donnibo v4.3
**Created:** 2026-06-01  
**Purpose:** Multiple restore points + untouched backup for maximum safety  
**Status:** Active

---

## Overview

```
┌──────────────────────────────────────────────────┐
│ main (Active Development)                         │
│ ├─ v4.3-stable (2026-06-01 snapshot)             │
│ ├─ v4.3.0 (same, alternate name)                 │
│ ├─ v4.3.1 (after P0 bugs fixed)                  │
│ ├─ v4.3.2 (after P1 bugs fixed)                  │
│ ├─ v4.3.3 (after E-014 + W24 content)            │
│ └─ v4.3-final (launch ready)                     │
│                                                   │
└──────────────────────────────────────────────────┘
                      ↓ (final merge when stable)
┌──────────────────────────────────────────────────┐
│ v5.0-dev (FROZEN UNTOUCHED BACKUP)              │
│ └─ Snapshot: 2026-06-01 15:00 UTC               │
│    (Only touched if main becomes unfixable)     │
└──────────────────────────────────────────────────┘
```

---

## Tagging Schedule

| Tag | Trigger | When | Restore If |
|---|---|---|---|
| **v4.3-stable** | UX audit complete, before bugs | 2026-06-01 | Main totally broken |
| **v4.3.0** | Same as v4.3-stable (alternate) | 2026-06-01 | Reference point |
| **v4.3.1** | P0 bugs fixed + tested (BUG-001 through BUG-006) | 2026-06-02 EOD | P0 fixes break something |
| **v4.3.2** | P1 bugs fixed + tested (BUG-007 through BUG-010) | 2026-06-04 EOD | P1 fixes break something |
| **v4.3.3** | E-014 + W24 content shipped + verified | 2026-06-12 EOD | New features break core |
| **v4.3-final** | All bugs fixed, all content added, ready for launch | 2026-06-19 EOD | Last check before public |
| **v4.3-launch** | Deployed to production, users live | 2026-06-23 | Need to rollback users |

---

## Tag Descriptions

### v4.3-stable (NOW — 2026-06-01)
```
Tag: v4.3-stable
Commit: 6c35c60 (UX audit complete)
What: Complete v4.3 app before Phase 0 bug fixes
When: 2026-06-01 15:00 UTC
Use: Restore if main becomes unfixable during bug fix phase
Status: ✅ Created
```

### v4.3.0 (NOW — 2026-06-01)
```
Tag: v4.3.0
Commit: 6c35c60 (same as v4.3-stable)
What: Release candidate baseline
When: 2026-06-01 15:00 UTC
Use: Reference point for all v4.3.x versions
Status: ✅ Will create
```

### v4.3.1 (Monday EOD — 2026-06-02)
```
Tag: v4.3.1
Commit: (after P0 bugs fixed)
What: Critical bugs fixed (BUG-001 through BUG-006)
When: 2026-06-02 18:00 UTC (Monday EOD)
Use: Restore if new bugs introduced during P1 fixes
Status: ⏳ Pending (create Monday after final test)
```

### v4.3.2 (Wednesday EOD — 2026-06-04)
```
Tag: v4.3.2
Commit: (after P1 bugs fixed)
What: High-priority bugs fixed (BUG-007 through BUG-010)
When: 2026-06-04 18:00 UTC (Wednesday EOD)
Use: Restore if E-014 breaks engagement hooks
Status: ⏳ Pending
```

### v4.3.3 (Thursday EOD — 2026-06-12)
```
Tag: v4.3.3
Commit: (after E-014 + W24 content)
What: Re-engagement feature + content added
When: 2026-06-12 18:00 UTC
Use: Restore if content causes issues
Status: ⏳ Pending
```

### v4.3-final (Friday — 2026-06-19)
```
Tag: v4.3-final
Commit: (all work complete, all QA passed)
What: Launch-ready version
When: 2026-06-19 18:00 UTC (Friday after final QA)
Use: Tag before first deploy to users
Status: ⏳ Pending
```

### v4.3-launch (Deploy day — TBD)
```
Tag: v4.3-launch
Commit: (same as v4.3-final, deployed)
What: Version deployed to production
When: Deployment day (likely 2026-06-23)
Use: Quick rollback if users report critical issues
Status: ⏳ Pending
```

---

## How to Create Tags

### Create Tag Now (v4.3.0)
```bash
git tag -a v4.3.0 -m "v4.3.0 baseline — UX audit complete, before bug fixes start"
git push origin v4.3.0
```

### Create Tag at End of Each Phase

**Monday EOD (after P0 bugs):**
```bash
git tag -a v4.3.1 -m "v4.3.1 — P0 bugs fixed (BUG-001 through BUG-006)"
git push origin v4.3.1
```

**Wednesday EOD (after P1 bugs):**
```bash
git tag -a v4.3.2 -m "v4.3.2 — P1 bugs fixed (BUG-007 through BUG-010)"
git push origin v4.3.2
```

**Thursday EOD (after features):**
```bash
git tag -a v4.3.3 -m "v4.3.3 — E-014 shipped + W24 content added"
git push origin v4.3.3
```

**Friday EOD (launch ready):**
```bash
git tag -a v4.3-final -m "v4.3-final — All bugs fixed, all content added, launch ready"
git push origin v4.3-final
```

---

## How to Restore from Tag

### Scenario: P1 Fixes Break Something, Need to Restore to v4.3.1

```bash
# 1. See what's in the tag
git show v4.3.1

# 2. Check what commits are between v4.3.1 and current
git log --oneline v4.3.1..main

# 3. If we need to rollback main to v4.3.1:
git checkout main
git reset --hard v4.3.1
git push -f origin main

# 4. Fix what broke in v4.3.1, then create new tag
git tag -a v4.3.1-hotfix -m "v4.3.1 hotfix — restored and patched"
git push origin v4.3.1-hotfix
```

### Scenario: Need to Get Back to Any Stable Point

```bash
# List all tags
git tag -l

# See what's in a tag
git show v4.3-stable

# Checkout a tag (detached HEAD — read-only)
git checkout v4.3-stable

# Create a new branch from a tag (if you need to modify it)
git checkout -b recovery-v4.3-1 v4.3.1

# See all commits in a tag
git log v4.3.1 | head -20
```

---

## v5.0-dev — Untouched Backup

```
Branch: v5.0-dev
Commit: 6c35c60 (same as current main)
Status: FROZEN — Do not touch
Purpose: True backup if main becomes unfixable
Restore: ONLY if main is completely broken and no other option

How to restore from v5.0-dev to main:
  git checkout main
  git reset --hard v5.0-dev
  git push -f origin main
```

---

## Tagging Rules

✅ **DO:**
1. Create tag after QA passes (not before)
2. Use semantic versioning: `v4.3.0`, `v4.3.1`, etc.
3. Write clear tag messages (what changed, why)
4. Push tags to remote: `git push origin v4.3.1`
5. Tag every major milestone
6. Document tag in this file

❌ **DON'T:**
1. Create tags during active development
2. Delete tags once pushed (immutable history)
3. Tag the same commit twice with different names (except v4.3-stable vs v4.3.0)
4. Forget to push tags (only local is useless)

---

## Tag Naming Convention

```
v4.3.X = Release versions (X = minor version, incrementing)
v4.3-stable = Snapshot reference point
v4.3-final = Launch-ready version
v4.3-launch = Deployed to production
v4.3.X-hotfix = Emergency patches
```

---

## Safety Guarantees

| Scenario | Protection | How |
|---|---|---|
| P0 fixes break something | ✅ v4.3.0 | Restore to v4.3.0, re-apply fixes carefully |
| P1 fixes break something | ✅ v4.3.1 | Restore to v4.3.1, debug P1 issues |
| E-014 breaks core | ✅ v4.3.2 | Restore to v4.3.2, disable E-014 |
| Content breaks app | ✅ v4.3.3 | Restore to v4.3.3, trim content |
| Users see broken app | ✅ v4.3-launch | Restore to v4.3-final, deploy again |
| Main is totally broken | ✅ v5.0-dev | Last resort restore from frozen backup |

---

## Current Status

| Tag | Status | Commit | Date |
|---|---|---|---|
| v4.3-stable | ✅ EXISTS | 6c35c60 | 2026-06-01 |
| v5.0-dev | ✅ EXISTS (frozen) | 6c35c60 | 2026-06-01 |
| v4.3.0 | ⏳ TO CREATE | — | 2026-06-01 |
| v4.3.1 | ⏳ PENDING | — | 2026-06-02 |
| v4.3.2 | ⏳ PENDING | — | 2026-06-04 |
| v4.3.3 | ⏳ PENDING | — | 2026-06-12 |
| v4.3-final | ⏳ PENDING | — | 2026-06-19 |
| v4.3-launch | ⏳ PENDING | — | 2026-06-23 |

---

## Quick Reference Commands

```bash
# List all tags
git tag -l

# Create annotated tag (recommended)
git tag -a v4.3.1 -m "v4.3.1 — P0 bugs fixed"

# Push single tag
git push origin v4.3.1

# Push all tags
git push origin --tags

# See tag details
git show v4.3.1

# Delete local tag
git tag -d v4.3.1

# Delete remote tag
git push origin --delete v4.3.1

# List tags with dates
git log --oneline --decorate --all | grep tag

# Checkout a tag
git checkout v4.3.1

# Restore main to tag
git reset --hard v4.3.1
git push -f origin main

# Create branch from tag
git checkout -b recovery v4.3.1
```

---

## Weekly Checklist

### Monday 2026-06-02 (P0 Bugs Complete)
- [ ] All P0 bugs fixed (BUG-001 through BUG-006)
- [ ] Regression test passed
- [ ] App tested on real device
- [ ] Create tag: `git tag -a v4.3.1 -m "v4.3.1 — P0 bugs fixed"`
- [ ] Push tag: `git push origin v4.3.1`
- [ ] Mark in this doc: v4.3.1 ✅ CREATED

### Wednesday 2026-06-04 (P1 Bugs Complete)
- [ ] All P1 bugs fixed (BUG-007 through BUG-010)
- [ ] No regressions from P0
- [ ] Create tag: `git tag -a v4.3.2 -m "v4.3.2 — P1 bugs fixed"`
- [ ] Push tag: `git push origin v4.3.2`

### Friday 2026-06-12 (E-014 + W24 Content)
- [ ] E-014 re-engagement shipped
- [ ] W24 science content added (140 files, 2,100q)
- [ ] All integrated and tested
- [ ] Create tag: `git tag -a v4.3.3 -m "v4.3.3 — E-014 + W24 content"`
- [ ] Push tag: `git push origin v4.3.3`

### Friday 2026-06-19 (Launch Ready)
- [ ] All bugs fixed ✅
- [ ] All features implemented ✅
- [ ] Content complete ✅
- [ ] Full QA passed ✅
- [ ] Create tag: `git tag -a v4.3-final -m "v4.3-final — Launch ready"`
- [ ] Push tag: `git push origin v4.3-final`

---

**Implemented:** 2026-06-01  
**Frozen Backup:** v5.0-dev (untouched)  
**Restore Points:** v4.3.0, v4.3.1, v4.3.2, v4.3.3, v4.3-final  
**Purpose:** Safety + clarity + multiple rollback options

