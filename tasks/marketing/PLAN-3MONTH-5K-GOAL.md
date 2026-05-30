# 3-Month Execution Plan — 5,000 Users by August 2026

**Baseline version:** v3.0 (tagged 2026-05-27)
**Goal:** 5,000 users onboarded by end of August 2026
**Strategy:** Flood the market at ₹79/month. Solopreneur. Near-zero infra cost.

---

## Revisit Schedule

| Checkpoint | Date | What to measure | Pass condition |
|---|---|---|---|
| **2-week pulse** | 2026-06-10 | First users signed up? F1 content shipped? Landing page live? | App has content, pricing visible, 10+ real users |
| **Month 1 review** | 2026-06-27 | User count, score delta, F1 resolved? | 500 users, score ≥ 76/100, F1 closed |
| **Month 2 review** | 2026-07-27 | User count, Concept Builder live?, Avatar Stage 0–2 live? | 2,000 users, score ≥ 81/100, shareable moment exists |
| **Month 3 review** | 2026-08-27 | User count, Pro app live?, Journey Replay shareable? | 5,000 users, score ≥ 86/100, Pro app forked |

**At each review:** re-score all 10 confidence parameters, check failure risk table,
adjust task priorities if user count is behind target.

---

## Baseline State (v3.0 — 2026-05-27)

- **Confidence score:** 70/100
- **Critical failures open:** F1 (content exhausts), F2 (differentiation — partially mitigated)
- **Content:** Grades 3+5 complete (80 files × 15q each). Grades 2,4,6,7,8 on old flat files.
- **Live features:** Auth, quiz engine, weekly sets, streaks, subject tabs (Math default), profile edit, grade change, regional language
- **Not live:** Avatar, Concept Builder, topic filter, subscription gate, offline mode, Pro app

---

## Month 1 — June 2026
### "Make it work. Make it worth sharing."
**Target: 500 users**

| Priority | Task | Type | Size | Done |
|---|---|---|---|---|
| 🔴 1 | **CONTENT SPRINT** — 50+ q/grade for Grades 2–8 Math + Science | Content | — | ☐ |
| 🔴 2 | **P2-T022** — Remove regional lang from signup | Code | S | ☐ |
| 🔴 3 | **P2-T013** — Update subscription to ₹79/month Pro | Strategy | S | ☐ |
| 🔴 4 | **P2-T023** — Cross-page UI consistency + auto kid theme | Code | M | ☐ |
| 🔴 5 | **P2-T016** — Welcome onboarding modal | Code | M | ☐ |
| 🟠 6 | **P2-T015** — Landing page: ₹79 front and centre, honest trial | Code | M | ☐ |
| 🟠 7 | **P2-T019** — Subscription pre-launch readiness check | Strategy | M | ☐ |
| 🟠 8 | **P3-T028** — Free vs Pro weekly set gating | Code | S | ☐ |
| 🟠 9 | **P2-T026** — Tamper protection (HMAC, Drive source of truth) | Code | M | ☐ |

**Month 1 hard skip:** Avatar, Concept Builder, admin portal, Stripe, automated tests.

---

## Month 2 — July 2026
### "Make it teach. Make it sticky."
**Target: 2,000 users**

| Priority | Task | Type | Size | Done |
|---|---|---|---|---|
| 🔴 1 | **P3-T027** — Tag quality + canonical backfill (Grade 3+5) | Content | S | ☐ |
| 🔴 2 | **P2-T027** — Concept Builder phase 1: atom + foundation weeks | Code | L | ☐ |
| 🔴 3 | **P3-T004** — Avatar Stage 0–2 (fearful → showing up → rhythm) | Design+Code | L | ☐ |
| 🔴 4 | **P3-T030** — Offline-first IndexedDB prefetch | Code | M | ☐ |
| 🟠 5 | **P3-T029** — Weekly progressive exam (Pro) | Code | M | ☐ |
| 🟠 6 | **P3-T008** — Service Worker offline safety net | Code | M | ☐ |
| 🟠 7 | **CONTENT SPRINT** — Grades 4, 6, 7 Math + Science | Content | — | ☐ |
| 🟠 8 | **P2-T014** — Branding: progression arc logo, favicon, OG image | Design | M | ☐ |

**Month 2 hard skip:** Admin portal, international languages, Stripe, P6 tasks.

---

## Month 3 — August 2026
### "Flood the market. Fork the engine."
**Target: 5,000 users**

| Priority | Task | Type | Size | Done |
|---|---|---|---|---|
| 🔴 1 | **P3-T004** — Journey Replay animation (the shareable moment) | Code | L | ☐ |
| 🔴 2 | **P3-T004** — Avatar Stage 3–5 + subject badges | Code | L | ☐ |
| 🔴 3 | **CONTENT SPRINT** — Grades 8–10 + Professional tracks (DevOps, Python, System Design) | Content | — | ☐ |
| 🔴 4 | **P4-T008** — Fork to DecaShift Pro (Professional app) | Code | L | ☐ |
| 🟠 5 | **P2-T015** (Pro version) — Professional landing page | Code | M | ☐ |
| 🟠 6 | **P3-T026** — Topic tag filter (Pro subscribers) | Code | M | ☐ |
| 🟠 7 | **P2-T025** — Backup + disaster recovery | Code | M | ☐ |
| 🟠 8 | **P5-T004** — Feature gate → wire to Razorpay | Code | S | ☐ |

**Month 3 hard skip:** Competitive exam app (Month 4+), admin portal, i18n, P6 tasks.

---

## Do Not Touch — Next 3 Months

| Task | Defer reason |
|---|---|
| P4-T006 Admin portal | Needed at 5K+ users, not to reach there |
| P5-T001 Stripe | Use Razorpay after first 100 paying users |
| P2-T018 Automated tests | After product stabilises |
| P6 all tasks | Post-revenue |
| P3-T020 International languages | Month 4+ |
| P4-T005 Multi-language UI | Month 4+ |
| P2-T024 Session audit | Background, not user-facing |
| P4-T003 GTM strategy | This document IS the strategy |

---

## Projected Score at Each Checkpoint

| Checkpoint | Projected score | Key unlocks |
|---|---|---|
| v3.0 baseline | 70/100 | — |
| Month 1 (v3.1 target) | ~76/100 | F1 closed, landing page, kid theme, pricing live |
| Month 2 (v3.2 target) | ~81/100 | Concept Builder, Avatar 0–2, offline mode, branding |
| Month 3 (v3.3 target) | ~86/100 | Journey Replay, Avatar complete, Pro app live |

---

## The Decision Filter (apply to every task every session)

1. Does this move toward 5K users by August 2026?
2. Does it fix content depth (F1 — only Critical failure)?
3. Does it create a shareable moment (something a parent sends to another parent)?
4. Does it work on a ₹8,000 Android phone on 4G?

**If yes to any → build it.**
**If no to all → it's not Month 1, 2, or 3 work.**

---

## Acquisition Channels (zero budget)

| Channel | When to activate |
|---|---|
| WhatsApp parent groups | Month 1 — as soon as content depth is fixed |
| Reddit r/india, r/UPSC, r/JEE | Month 1 (Students) + Month 3 (Pro + Exam) |
| Twitter/X ed-tech | Month 2 — once Avatar is shareable |
| LinkedIn | Month 3 — Professional app launch |
| School teachers | Month 2 — once Concept Builder is live |

---

*Plan created: 2026-05-27 | Baseline: v3.0 | Next review: 2026-06-10 (2-week pulse)*
