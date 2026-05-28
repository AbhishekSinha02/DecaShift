# Donnibo — Session Schedule

> **How it works:**
> Open Claude Code in `C:\aiPrj\DecaShift` at the scheduled time.
> Say **"start the session"** — Claude reads this INDEX, finds the right session, executes it.
> No briefing. No context. The session file contains everything.

---

## Trigger Behaviour

When user says **"start the session"**:
1. Read this INDEX
2. **If a Scheduled session matches today's date + approximate time → run that**
3. **If no scheduled session matches → run the top item from the Pending Queue (Priority 1)**
4. If ambiguous (two scheduled sessions today) → ask which one

---

## Scheduled Sessions (Date + Time Locked)

| Date | Time IST | File | Type | Focus | Status |
|---|---|---|---|---|---|
| 2026-05-28 | 13:30 | [2026-05-28-1330-questions-grade9-12.md](2026-05-28-1330-questions-grade9-12.md) | Content | Grade 9–12 questions — 45 files, ~675q | ✅ Done |
| 2026-05-28 | 18:30 | [2026-05-28-1830-flash-drill-implementation.md](2026-05-28-1830-flash-drill-implementation.md) | Code | P2-T031 Flash Drill implementation | ✅ Done |

---

## Pending Queue (Priority Order — No Date Yet)

> **To reprioritize:** Change the number in the `#` column and re-sort the rows.
> **To run:** Say "start the session" when no scheduled session is active — Claude runs Priority 1.
> **To promote to Scheduled:** Move the row to the Scheduled table above and add date + time.
> **To add a new pending session:** Create a `PENDING-*.md` file and add a row here.

| # | File | Type | Focus | Task | Depends On |
|---|---|---|---|---|---|
| 2 | [PENDING-gk-capsule-tab.md](PENDING-gk-capsule-tab.md) | Code | Daily GK capsule + GK subject tab | P2-T032 | P2-T031 done |
| 4 | [PENDING-pwa-install-prompt.md](PENDING-pwa-install-prompt.md) | Code | PWA install prompt + taskbar guide | P2-T033 | — |
| 5 | [PENDING-settings-6-subscreens.md](PENDING-settings-6-subscreens.md) | Code | Settings restructure → 6 sub-screens | P2-T030 remainder | — |
| 6 | [PENDING-city-partners-reward-card.md](PENDING-city-partners-reward-card.md) | Code | City partner footer + Reward Cards | P3-T032 | P3-T031 done |
| 7 | [PENDING-content-grade9-12-set2.md](PENDING-content-grade9-12-set2.md) | Content | Grade 9–12 Set 2 — second round of content | P2-T034 | 1:30 PM session done |

---

## How to Manage This Queue

**Add a session:** Create `sessions/PENDING-{topic}.md` → add row to queue above → commit + push.

**Reprioritize:** Edit the `#` column and re-sort rows. Example — to make GK Capsule go first:
change its `#` to 1, change Restructure to 2. That's it. Commit + push.

**Promote to scheduled:** Move the row from Pending Queue → Scheduled table, add date + time.

**Mark done:** Move from Pending Queue → Completed table, add commit hash.

---

## Completed Sessions

| Date | Time | What Was Done | Commit |
|---|---|---|---|
| 2026-05-28 | 09:00–13:00 | Strategy, 8 tasks, P2-T030 themes, marketing folder, content velocity plan, session system | `a5fc65f` |
| 2026-05-28 | 13:30–16:00 | 45 content files — Grade 9–12 Math/Science/Physics/Chemistry/English/Social Science + GK bank + Formula banks | `e68765b` |
| 2026-05-28 | 18:30–21:00 | P2-T031 Flash Drill Mode — Tables, Squares, Cubes, Formulas, GK (5 drills, timer, PB, share card) | `f59c60e` |
| 2026-05-28 | 21:30      | BUG-006 Fix A — streak + grade sync to Drive after every quiz and drill session | `4bffe4e` |
| 2026-05-29 | —          | P2-T037 — app.js split into 6 modules (240/188/320/179/338/132 lines) | `2243807` |

---

## Session File Format Reference

```markdown
# Session: PENDING — Topic Name

**Priority:** N  (1 = run next, higher = later)
**Type:** Content | Code | Review | Mixed | Strategy
**Est. Duration:** X hours
**Task:** P2-TXXX
**Trigger:** "start the session" (runs when Priority 1 in pending queue)
**Depends on:** what must be done first (or "—" if standalone)

## Objective
One sentence.

## Context
- Bullet 1
- Bullet 2 (max 5)

## Execute In This Order
### Step 1...
### Step 2...

## Success Criteria
- [ ] Checkbox list

## Hand-off to Next Session
What the next session picks up from here.
```
