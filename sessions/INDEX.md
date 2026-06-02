# Donnibo — Session Schedule

> Completed sessions → `sessions/completed/`
> **Do NOT load completed/ when looking for next task — everything actionable is below.**
> Say **"start the session"** → Claude reads this INDEX → runs Priority 1 from pending queue.

---

## Pending Queue — Code & UX

| # | Priority | File | Focus |
|---|---|---|---|
| 1 | 🔴 P1 | bugs/INDEX.md → BUG-026 | **Sign out → sign in empty home** — fix applied (3906913), verify first |
| 2 | 🔴 P1 | enhancements/INDEX.md → ENH-009 | **Sign-in speed** — show skeleton immediately, lazy-fetch questions |
| 3 | 🔴 P1 | features/INDEX.md → FEAT-003 | **Lazy subject tabs** — only load Daily Sprint on sign-in (pairs with ENH-009) |
| 4 | 🔴 P1 | marketing/GTM-001-landing-rampup.md | **Landing ramp-up** — conversion audit, copy, WhatsApp share, grade picker |
| 5 | 🔴 P1 | features/INDEX.md → FEAT-004 | **Payment ₹79/month** — needs user decision first (processor + trial days) |
| 6 | 🔴 P1 | enhancements/INDEX.md → ENH-001 | Wrong answer review after quiz (~1 session) |
| 6 | 🟠 P2 | enhancements/INDEX.md → ENH-007 | Weekly completion celebration (0.5 session) |
| 7 | 🟠 P2 | enhancements/INDEX.md → ENH-002 | Week progress calendar Mon–Fri dots (0.5 session) |
| 8 | 🟠 P2 | enhancements/INDEX.md → ENH-003 | Quiz pause / exit button (0.5 session) |
| 9 | 🟠 P2 | E-014 (ENGAGEMENT-SESSIONS.md) | Re-engagement nudge — last E-track item (0.5 session) |
| 10 | 🟠 P2 | features/INDEX.md → FEAT-001 | Week architecture Mon–Sun (1 code session, needs user decision first) |
| 11 | 🔵 P3 | PENDING-browser-test-p0-bugs.md | BUG-002/003/004/005 browser verify (30 min) |

---

## 🔁 Recurring — Every Session

| Check | Action |
|---|---|
| **Landing page** | Open `screen-landing.html` — scan every headline, subtext, CTA, FAQ, and testimonial. Flag anything stale, inaccurate, or weaker than the current product. |
| **app.js line count** | If >2,000 lines → raise splitting proposal before starting any new feature |

---

## Pending Queue — Infrastructure

| # | Priority | File | Focus |
|---|---|---|---|
| 1 | 🔴 P1 (blocked) | P2-T047 identity strategy | Decide account key — handle+PIN vs email. **User decision needed. GATES cross-device sync.** |
| 2 | 🟠 P2 (gated) | PENDING-cross-device-full-state-sync.md | Full progress sync across devices. Requires P2-T047 decision. |
| 3 | 🔵 P3 | PENDING-css-lazy-load-phase2.md | Lazy-load styles-app.css after login |
| 4 | 🔵 P3 | PENDING-pwa-install-banner.md | PWA install banner improvements |

---

## Pending Queue — Content

> W21/W22/W23 complete (all subjects). W24 = nothing yet.
> Full 3-month plan: `tasks/marketing/CONTENT-GEN-3MONTH-PLAN.md`
> Run just-in-time (~2 weeks ahead). Say **"start questions generation"** → auto-executes.

| # | Priority | Focus |
|---|---|---|
| C4 | 🔴 P1 | W24 Science — all grades |
| C5 | 🟠 P2 | W24 Math — all grades |
| C6 | 🟠 P2 | W24 Hindi + French — all grades |

---

## Engagement Track (E-track)

| # | Session | Status |
|---|---|---|
| E1–E5 | Responsive + Daily Pull + Avatar + Juice + Variable Reward | ✅ Done |
| E6 | Share cards + friend challenge | ✅ Done |
| **E7** | **Re-engagement nudge (E-014)** | **⬅ NEXT** |

---

## Completed Sessions (22 done)
See `sessions/completed/` for full session files. Summary only here.

| Date | What | Commit |
|---|---|---|
| 2026-06-03 | BUG-025/015 fixed; row polish; FEAT-001; v4.3→v4.4 | `005420f` |
| 2026-06-03 | UX audit Gr.5+11; 7 bugs + 8 enhancements; BUG-014/020/ENH-005 fixed | `302190c` |
| 2026-06-02 | Daily Sprint tab; past practice grouping; BUG-022/023/024 fixed | `17ba8fa` |
| 2026-05-29 | Delight Stack D-001–D-018 + iOS header fix | `f5e29ca` |
| 2026-05-29 | Full UI/landing/nav/trial/settings/modules overhaul (v4.0) | `012c21d` |
| 2026-05-28 | Grade 9–12 questions 45 files ~675q; Flash Drill; BUG-006 | `f59c60e` |
| 2026-05-27 | v3.7 snapshot — Grades 2–8 content complete ~6,000q | `e68765b` |
