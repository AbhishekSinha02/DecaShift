# Donnibo — Session Schedule

> Completed sessions: `sessions/completed/`
> How to run: say **"start the session"** → Claude reads this INDEX → runs Priority 1 from pending queue.

---

## Scheduled Sessions
*(none active)*

---

## Pending Queue

| # | File | Type | Focus | Task |
|---|---|---|---|---|
| ~~1~~ | ~~PENDING-grade9-12-missing-content-w23-w24.md~~ | ✅ DONE (2026-06-02, commit b081bb1) | 16 files × 20q = 320 questions added for grades 9-12 English/Soc-Sci/Chem/Physics W23+W24 | Content |
| ~~1~~ | ~~PENDING-home-ux-card-grouping-and-drills.md~~ | ✅ DONE (2026-06-03, commit 180820d) | Topic grouping (max 5 rows, >5 → difficulty split) + drills hidden on non-math tabs | Home UX |
| ~~1b~~ | ~~PENDING-collapsible-rows.md~~ | ✅ DONE (2026-06-03, commit 180820d) | Collapsible row headers with chevron; Last Week + topic rows collapsed by default | Home UX |
| ~~2~~ | ~~PENDING-drill-tab-strategy.md~~ | ✅ DONE (2026-06-02) | GK drill moved to GK & Current Affairs row; Math Flash Drill = 4 math cards only | Drill UX |
| ~~P2-T047~~ | ~~Daily Sprint tab + home restructure~~ | ✅ DONE (2026-06-02, commits `1b49e28`–`c45a487`) | Daily Sprint pinned tab, Today's Practice shelf, GK section, quest at bottom, settings modal pinned footer | Home UX |
| 1 | [PENDING-browser-test-p0-bugs.md](PENDING-browser-test-p0-bugs.md) | Testing | BUG-002/003/004/005 — static analysis suggests all false positives. Do quick browser verify and mark closed. | BUG-002 thru 005 |
| 2 | [P2-T047 identity strategy](../tasks/marketing/P2-T047-identity-strategy-userid-email-mobile.md) | Strategy | Decide the durable account KEY (handle+PIN+recovery code vs email/mobile). **Needs user decision. GATES P2-T046.** | Identity |
| 5 | [PENDING-cross-device-full-state-sync.md](PENDING-cross-device-full-state-sync.md) | Code | Full progress sync across devices (XP/avatar/streak/stickers/mastery/sessions). Implements against P2-T047's chosen key. | P2-T046 |
| 6 | [PENDING-css-lazy-load-phase2.md](PENDING-css-lazy-load-phase2.md) | Perf | Lazy-load styles-app.css after login | P2-T035 |
| 7 | [PENDING-pwa-install-banner.md](PENDING-pwa-install-banner.md) | Code | PWA install banner improvements | P2-T044 |

> W23 French content (C3) shipped `522ff2e` — W23 now complete (all 4 subjects). Next content session = C4 (W24 Science).

> **Content track:** full 3-month queue (all grades, all subjects, Jun–Aug) in
> [`tasks/marketing/CONTENT-GEN-3MONTH-PLAN.md`](../tasks/marketing/CONTENT-GEN-3MONTH-PLAN.md).
> Run just-in-time (~2 weeks ahead), one subject-week (525q) per session.

---

## Engagement Track (E-track) — "Beat Netflix/YouTube"

> Strategy: [`tasks/ENGAGEMENT-STRATEGY.md`](../tasks/ENGAGEMENT-STRATEGY.md) ·
> Build plan: [`ENGAGEMENT-SESSIONS.md`](ENGAGEMENT-SESSIONS.md)

| # | Session | Theme | Tasks | Status |
|---|---|---|---|---|
| E1 | Responsive Excellence | tablet/laptop layout | E-001, E-002 | ✅ Done (29326d0, 78c7a5c, 4b82de1) |
| E2 | The Daily Pull | daily quest + ritual + streak-freeze | E-003, E-004 | ✅ Done (eada092, 46ab9dc, 6b81573) |
| E3 | See Yourself Grow | XP + levels + avatar + journey | E-005, E-006, E-007 | ✅ Done (7 commits, f49a725→9c0c052) |
| E4 | Game Juice | sound + haptics + confetti + transitions | E-008, E-009 | ✅ Done (e8945f2→5552d86) |
| E5 | Variable Reward | XP crits + mystery box + sticker album | E-012, E-010, E-011 | ✅ Done |
| E6 | Belonging & Virality | image share cards + friend challenge | E-015, E-013 | Pending |
| E7 | Re-engagement | daily reminder + streak-save nudge | E-014 | Pending |

**Wave 1 complete (E1–E4) + live-verified.** Wave 2 (E5–E7) specced. Next: run E5, or browser-QA Wave 1 deeper first.

---

## Completed Sessions (22 done)
See `sessions/completed/` for all session files.

| Date | What | Commit |
|---|---|---|
| 2026-06-03 | UX audit (Gr.5 + Gr.11) — 7 bugs + 8 enhancements filed; BUG-014/020/ENH-005 fixed; Home UX: topic grouping + collapsible rows + drills math-only | `302190c` |
| 2026-06-03 | BUG-025 concept labels in past practice; chevron left; row spacing; BUG-015 support number; FEAT-001 task; v4.3→v4.4 | `e20e3b7` |
| 2026-06-02 | Daily Sprint tab + settings modal; past practice conceptId grouping open by default; BUG-022/023/024 fixed | `17ba8fa` |
| 2026-05-28 | Grade 9–12 questions — 45 files ~675q | `e68765b` |
| 2026-05-28 | P2-T031 Flash Drill — 5 drills, timer, PB, share | `f59c60e` |
| 2026-05-28 | BUG-006 streak + grade sync fix | `4bffe4e` |
| 2026-05-29 | P2-T037 app.js → 6 modules | `2243807` |
| 2026-05-29 | P2-T032 Daily GK capsule + GK tab | `21f22e7` |
| 2026-05-29 | P2-T030 Settings 5-tile + BUG-009 grade fix | `4d97889` |
| 2026-05-29 | P1-T014/016/017 UI Phase 1 | `329711d` |
| 2026-05-29 | P1-T015/016 UI Phase 2 | `deedc1d` |
| 2026-05-29 | P2-T033 PWA install | `4ca1eae` |
| 2026-05-29 | P3-T032 City partner footer + Reward Cards | `385066a` |
| 2026-05-29 | P1-T018 Manifest sharding 58KB→749B | `78c35cf` |
| 2026-05-29 | P1-T019 CSS split base/auth/app | `7b5b6b2` |
| 2026-05-29 | P1-T020 HTML modularisation → screens/ | `10f62e8` |
| 2026-05-29 | P2-T015 Ph1+Ph2+Ph3 Landing full rebuild | `c40d310` |
| 2026-05-29 | P2-T041/T043 Nav overhaul: drawer + week nav + subject snap | `d4545fc` |
| 2026-05-29 | P2-T038 Trial gating: paywall + My Plan + sets 3–5 gate | `ab4b42d` |
| 2026-05-29 | P2-T045 Netflix home browse | `012c21d` |
| 2026-05-29 | Donnibo brand + mobile bug fixes | `7559088` |
| 2026-05-29 | Delight Stack D-001–D-018 (15 code tasks) + iOS header fix | `f5e29ca` |
