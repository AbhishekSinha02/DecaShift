# Content Generation — 3-Month Plan (Jun–Aug 2026)

**Owner task:** extends [P3-T019](P3-T019-content-calendar-weekly-rotation.md) (weekly rotation).
**Goal of the quarter:** weekly content for **all grades (2–8), all subjects**, never letting the
live "This Week" shelf go incomplete. Directly fixes **F1 (content depth)** — the only Critical failure
and the gate before any marketing push (see `strategy_5k_goal`, `strategy_first_100_paid`).

---

## The unit of work = one "content session"

> **1 content session = 1 subject × grades 2–8 × 5 days (mon–fri) = 35 files / 525 questions.**

Why this size: a full week (4 subjects × 35 = 140 files / 2,100q) ≈ 300K output tokens / ~1.5–2M
session usage — too big for one ~1M session, and ~4–5× the 300–500q/session protocol budget
(`project_content_generation`). So **one subject-week per session.** Regional (6 langs × 1 set = 60q)
is small and rides along at the end of a session or as a quick standalone.

## Operating cadence (IMPORTANT — don't bulk-generate the whole quarter at once)

The home screen only shows **This Week + Last Week**. So the efficient rule is **stay ~2 weeks ahead**,
not 13. Generate the *next* incomplete week, then stop. Curriculum can drift; generating August in May
wastes effort. This plan lists the full quarter for visibility, but **run it just-in-time**, ~4 subject-
sessions per week of real time.

## Per-session topic rule (curriculum progression)

Each subject-week must **progress** from the previous week's topic for that grade (never random).
First step of every content session: `grep '"description"'` the same grade's `<subject>-w{PREV}-mon.json`
and `-fri.json` to see where the last week ended, then pick the natural next topic. Mirror the exact
W22 schema (see any `math-w22-mon.json`): `goalId`, `weekNum`, `weekDay`, `weekStart/End`, 15 Q with
`id`/`question`/`options`(4)/`correctIndex`(0–3)/`explanation`/`tags`. Wire every file into
`manifests/manifest-grade-N.json`. Validate with node (python is NOT installed on this machine).

---

## Prioritised Queue

> ✅ = done · 🔜 = next · ⬜ = pending. W23 math + regional already shipped 2026-05-30.

### Priority 1 — Finish the CURRENT week (W23, Jun 01–07) so all 4 subjects are live
| # | Session | Files | Q | Status |
|---|---|---|---|---|
| C1 | W23 Science G2–8 | 35 | 525 | ✅ done (`11ca503`, 2026-05-30) |
| C2 | W23 Hindi G2–8 | 35 | 525 | ✅ done (`20a5d82`, 2026-05-30) |
| C3 | **W23 French G2–8** | 35 | 525 | 🔜 **NEXT** |
| — | W23 Math G2–8 | 35 | 525 | ✅ done (`5ce7d55`) |
| — | W23 Regional set-3 ×6 | 6 | 60 | ✅ done (`08f06e2`) |

### Priority 2 — Build forward, 2 weeks ahead. Repeat the 4-subject + regional block per week.
| Week | Dates | Sessions (each 525q) | Regional |
|---|---|---|---|
| W24 | Jun 08–14 | Math · Science · Hindi · French | set-4 ×6 |
| W25 | Jun 15–21 | Math · Science · Hindi · French | set-5 ×6 |
| W26 | Jun 22–28 | Math · Science · Hindi · French | set-6 ×6 |
| W27 | Jun 29–Jul 05 | Math · Science · Hindi · French | set-7 ×6 |
| W28 | Jul 06–12 | Math · Science · Hindi · French | set-8 ×6 |
| W29 | Jul 13–19 | Math · Science · Hindi · French | set-9 ×6 |
| W30 | Jul 20–26 | Math · Science · Hindi · French | set-10 ×6 |
| W31 | Jul 27–Aug 02 | Math · Science · Hindi · French | set-11 ×6 |
| W32 | Aug 03–09 | Math · Science · Hindi · French | set-12 ×6 |
| W33 | Aug 10–16 | Math · Science · Hindi · French | set-13 ×6 |
| W34 | Aug 17–23 | Math · Science · Hindi · French | set-14 ×6 |
| W35 | Aug 24–30 | Math · Science · Hindi · French | set-15 ×6 |

**Quarter total if fully built:** W23 (3 left) + W24–W35 (12 wks × 4) = **51 subject-sessions** (~26,775 q)
+ 13 regional sets. At ~4 subject-sessions/week of real time this tracks the calendar with ~2 weeks buffer.

### Priority 3 — Optional depth (only if grades 9–12 go weekly)
Grades 9–12 currently have static sets, no weekly files. Add weekly math for G9–12 only if the
upper-grade cohort grows. Defer until G2–8 quarter is on autopilot.

---

## How to run
Say **"start the session"** → reads `sessions/INDEX.md` → runs Priority 1 (`PENDING-content-w23-science.md`).
After each session: mark its row ✅ here with the commit hash, then promote the next row to the INDEX queue.
Keep `project_weekly_content_status` memory in sync.
