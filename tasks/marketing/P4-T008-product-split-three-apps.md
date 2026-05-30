# Strategy: Product Split — Three Focused Apps on One Platform

**Priority:** P4 | **Type:** Product Strategy | **Complexity:** L | **Status:** Pending

> Direct mitigation for F3 (audience too broad — marketing to everyone = reaching nobody).
> Same core platform. Three distinct products. Three clear audiences.

---

## The Problem This Solves

A Grade 3 student doing Math and a DevOps engineer doing interview prep cannot be
addressed by the same landing page, the same ad, the same onboarding, or the same
pricing message. Trying to serve both from one product means serving neither well.

The fix is not to remove features. It is to **present the same engine to three
different audiences as three distinct products**, each with its own brand, landing
page, question bank, and positioning.

---

## The Three Products

### Product 1 — DecaShift Students
**Current app. Existing domain. Keep as-is.**
- Audience: School students Grade 2–12, parents buying for children
- Content: Curriculum-aligned subjects — Math, Science, Hindi, French, English
- Hook: "See yourself grow." — avatar system, weekly arc, concept builder
- Tone: Warm, encouraging, kid-friendly
- Pricing: ₹199/month Pro — parents pay
- Differentiator: Concept Builder (atom → synthesis), avatar growth, kid-safe

### Product 2 — DecaShift Pro *(working name)*
**New app. New domain. Replicated codebase.**
- Audience: Working professionals — upskilling, interview prep, certification
- Content: DevOps, MLOps, Azure, AWS, Python, System Design, Data Science, Product Management
- Hook: "Stay sharp. Stay hireable." — or similar professional framing
- Tone: Clean, professional, dark UI by default, DM Mono heavy
- Pricing: ₹299–₹499/month or per-track one-time
- Differentiator: Topic depth per role (not breadth), weekly interview question drops,
  streak = consistency signal on resume ("practiced every day for 90 days")
- No avatar growth system — replace with skill confidence chart per topic

### Product 3 — DecaShift Exam *(working name)*
**New app. New domain. Replicated codebase.**
- Audience: Competitive exam aspirants — UPSC, JEE, NEET, CAT, GATE, SSC, Banking
- Content: Syllabus-exact question banks per exam, previous year questions, mock tests
- Hook: "One question at a time. One rank at a time."
- Tone: Serious, focused, high-stakes — no playfulness
- Pricing: Per-exam track or ₹399/month
- Differentiator: Syllabus-mapped concept tree (P2-T027 architecture applied to UPSC/JEE
  syllabus), timed exam mode (P5-T002 style), previous year question tagging
- Exam mode is the core, not a Pro feature — it is the product

---

## What Is Shared (The Platform)

All three apps run on the same engine. The split is positioning and content, not code.

| Component | Shared? | Notes |
|---|---|---|
| Quiz engine (app.js core) | ✅ Yes | Same state machine, same screen flow |
| Concept Builder engine (P2-T027) | ✅ Yes | Same atom→synthesis logic, different catalogues |
| Auth + Drive sync (storage.js) | ✅ Yes | Same Apps Script pattern |
| Streak + habit loop | ✅ Yes | Same streak logic |
| Weekly set architecture | ✅ Yes | Same manifest-driven loading |
| Offline prefetch (P3-T030) | ✅ Yes | Same IndexedDB strategy |
| Subscription gate (P2-T026) | ✅ Yes | Same HMAC token pattern |
| Avatar growth system | ⚠️ Partial | Students: full 6-stage avatar. Professionals: skill confidence chart. Exam: optional |
| Branding / UI theme | ❌ No | Each app has its own palette, tone, logo |
| Question bank | ❌ No | Completely separate per product |
| Landing page | ❌ No | Separate copy, social proof, pricing |
| Pricing | ❌ No | Different tiers per audience |

---

## Replication Strategy

When Product 1 (Students) reaches a stable, tested state — all P2 tasks done,
F1 (content depth) resolved, first paying users — fork the codebase for Product 2.

**What changes in a fork:**
1. `CLAUDE.md` — update audience, tone, content schema
2. `styles.css` — new theme variables (palette, font weights)
3. `index.html` — new brand name, tagline, landing copy
4. `goals.json` + question bank — entirely new content
5. `manifest.webmanifest` — new app name, icons
6. Apps Script — new Drive folder, new deployment URL

**What does NOT change:**
- app.js logic (quiz engine, screens, concept builder)
- storage.js (auth, sync, export)
- The question JSON schema (same format, different content)
- The task architecture (same task structure, different priorities per product)

**Estimated fork-to-launch time for Product 2:** 1–2 sessions (code is proven;
only content, branding, and landing need work).

---

## Competitive Exam App — Additional Notes (Product 3)

Competitive exams have specific requirements that need extra tasks when that product starts:

- **Syllabus mapping**: UPSC GS1/GS2/GS3/GS4, JEE Physics/Chemistry/Math, NEET Bio/Physics/Chemistry — each has an official syllabus that maps directly to the concept catalogue (P2-T027)
- **Previous year questions (PYQs)**: The most valuable content for exam aspirants. Tag each question with `pyq: true` and `year: 2023` — aspirants specifically search for these
- **Timed mock test**: Full-length mock exams (2-3 hours, 100+ questions) — different from the 10-question weekly session
- **Negative marking**: UPSC/JEE have negative marking — need `negativeMarkingRatio` on exam config
- **Rank predictor**: After mock test, show estimated rank based on score vs historical distribution — high-value feature for this segment

---

## Acceptance Criteria (for this strategic task)
- [ ] Product 1 (Students) reaches launch-ready (all P2 tasks, F1 resolved) — gate before fork
- [ ] Product 2 (Professionals) fork created with new branding + professional question bank
- [ ] Product 3 (Competitive Exams) fork created with syllabus-mapped content
- [ ] Shared core engine documented in CLAUDE.md as "platform" — forks reference it
- [ ] Each product has its own `CLAUDE.md` with audience-specific instructions
- [ ] Domain strategy decided (subdomains vs separate domains)

## Dependencies
- Product 1 must be stable before forking (all P1 + P2 done)
- P2-T027 (Concept Builder) — the engine that makes all three apps uniquely valuable
- P2-T026 (Tamper protection) — must be in place before any product charges money
- P3-T023 (Content strategy) — professional and exam content strategies are separate documents
- P4-T003 (Go-to-market strategy) — which product launches first, to which segment
