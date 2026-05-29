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
| ~~1~~ | ~~[PENDING-css-split-phase1.md](PENDING-css-split-phase1.md)~~ | ~~Refactor~~ | ~~Split styles.css → base/auth/app~~ | ~~P1-T019~~ | ~~done~~ |
| ~~1~~ | ~~[PENDING-index-html-modularisation.md](PENDING-index-html-modularisation.md)~~ | ~~Refactor~~ | ~~Break index.html (861L) → screens/ folder + ~35L shell~~ | ~~P1-T020~~ | ~~done~~ |
| ~~1~~ | ~~[PENDING-landing-page-enhancements.md](PENDING-landing-page-enhancements.md)~~ | ~~Code/Design~~ | ~~Fixed nav · copy rewrite · hamburger · city ticker · stats count-up · FAQ · scroll-reveal · question teaser~~ | ~~P2-T015 Ph2~~ | ~~done~~ |
| 2 | [PENDING-css-lazy-load-phase2.md](PENDING-css-lazy-load-phase2.md) | Perf | Lazy-load styles-app.css after login | P2-T035 | Phase 1 done + styles-app.css > 2,000 lines |
| ~~1~~ | ~~[PENDING-manifest-sharding.md](PENDING-manifest-sharding.md)~~ | ~~Code~~ | ~~Split 58KB manifest into per-grade shards~~ | ~~P1-T018~~ | ~~done~~ |
| ~~1~~ | ~~[PENDING-ui-overhaul-phase1.md](PENDING-ui-overhaul-phase1.md)~~ | ~~Code/Design~~ | ~~App shell + fixed header + bottom nav + avatar ring + grade chip~~ | ~~P1-T014, P1-T017~~ | ~~—~~ |
| ~~2~~ | ~~[PENDING-ui-overhaul-phase2.md](PENDING-ui-overhaul-phase2.md)~~ | ~~Code/Design~~ | ~~Visual design system~~ | ~~P1-T015, P1-T016~~ | ~~Phase 1 done~~ |
| ~~3~~ | ~~[PENDING-pwa-install-prompt.md](PENDING-pwa-install-prompt.md)~~ | ~~Code~~ | ~~PWA install prompt~~ | ~~P2-T033~~ | ~~—~~ |
| ~~done~~ | ~~[PENDING-city-partners-reward-card.md](PENDING-city-partners-reward-card.md)~~ | ~~Code~~ | ~~City partner footer + Reward Cards~~ | ~~P3-T032~~ | ~~done~~ |
| ~~4~~ | ~~[PENDING-content-grade9-12-set2.md](PENDING-content-grade9-12-set2.md)~~ | ~~Content~~ | ~~Grade 9–12 Set 2~~ | ~~P2-T034~~ | ~~already done in e5ff053/8fde936/3ccdf1c/1f3bdd9~~ |

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
| 2026-05-29 | —          | P2-T032 — Daily GK capsule: GK tab, reflective mode, Today in India fact card | `21f22e7` |
| 2026-05-29 | —          | P2-T030 — Settings restructure: 5-tile menu + sub-screens + BUG-009 grade fix | `4d97889` |
| 2026-05-29 | —          | P1-T014/T016/T017 — UI Phase 1: fixed header, sticky streak bar, sticky tabs, bottom nav, city strip, avatar ring, Today's Mission card, button elevation | `329711d` |
| 2026-05-29 | —          | P1-T015/T016 — UI Phase 2: Inter font, card depth, subject colors, answer animations, streak milestones, empty state | `deedc1d` |
| 2026-05-29 | —          | P2-T033 — PWA install: Android banner after 3rd session, iOS guide modal, Settings install tabs (Android/Windows/iOS) | `4ca1eae` |
| 2026-05-29 | —          | P3-T032 — City partner footer (Pune 3 partners) + Reward Card (7-day/30-day/50q milestones, gold card, share to WhatsApp) | `385066a` |
| 2026-05-28 | 13:30 run  | P2-T034 — Grade 9–12 W23-W24 Set 2: all 12 files already generated (commits understated scope to W21-W22) | verified |
| 2026-05-29 | —          | P1-T018 — Manifest sharding: 58KB→749B index + 15 grade shards; grade-change callsites fixed in auth+settings | `78c35cf` |
| 2026-05-29 | —          | P1-T019 — CSS split: styles.css(2081L) → base(166L)/auth(336L)/app(1589L); styles-legacy.css as rollback | `7b5b6b2` |
| 2026-05-29 | —          | P1-T020 — index.html modularisation: 861L → 31L shell; 8 screen files in screens/; all modals JS-rendered | `10f62e8` |
| 2026-05-29 | —          | P2-T015 Ph1 — Landing page full redesign: 7-section structure, CSS phone mockup, feature rows, pricing, testimonials | `f833a62` |
| 2026-05-29 | —          | P2-T015 Ph2 — Fixed nav, hero copy, gradient, hamburger, city ticker, count-up, FAQ, scroll-reveal, question teaser | `e14da29` |

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
