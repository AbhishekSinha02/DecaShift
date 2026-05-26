# Feature: Subscription Pre-Launch Readiness

**Priority:** P2 | **Type:** Product + Code | **Complexity:** M | **Status:** Pending

## Goal
Gate the subscription soft-lock from deploying until three conditions are met:
content is deep enough to last the trial, the landing page is honest about the trial,
and there is a clear answer to "why DecaShift over free alternatives."

This task clubs failure points F1, F2, and F6.

---

## F1 — Content Must Outlast the Trial

**Problem:** 15-day trial assumes ~150 unique questions (10/session × 15 days).
Current average: ~16 questions per grade file. User exhausts content on day 2.
Soft lock triggers before the trial even ends — user churns, blames the app.

**Gate condition:** Each active grade/subject file must have ≥ 50 questions before
the trial gate (`_isTrialActive()`) is deployed to production.

| File | Current Q | Required | Gap |
|---|---|---|---|
| school/grade-5/math.json | ~20 | 50 | 30 |
| school/grade-8/science.json | ~20 | 50 | 30 |
| school/grade-10/math.json | ~20 | 50 | 30 |
| ... (all 18 files) | ~20 avg | 50 | ~560 total needed |

**This task does not deploy the trial gate until P3-T011 (content expansion) hits 50q/file.**

---

## F2 — Differentiation Story Must Be Defined

**Problem:** "Practice Daily. Grow Fast." is generic. Khan Academy and Google are free
and have more content. There is no clear answer to why someone should use DecaShift.

**DecaShift's actual differentiator (to be confirmed and built on):**
1. **One habit loop across school + language + professional** — no other app combines
   Grade 7 math + Hindi grammar + DevOps prep in a single daily streak
2. **Regional language learning alongside curriculum** (P3-T013) — unique positioning
3. **10 questions, 5 minutes, done** — Duolingo-style brevity, not a 2-hour study app

**Deliverable:** One-paragraph product positioning statement committed to `POSITIONING.md`.
Used on landing page, in onboarding modal, and as the answer when someone asks
"what is DecaShift?"

---

## F6 — Landing Page Must Match the Business Model

**Problem:** The landing page currently implies free forever ("Free forever" stat,
P2-T006 "daily free unlimited practice"). The product now has a 15-day trial.
A user who reads "free forever" and then hits a paywall on day 16 feels deceived.

**Required landing page changes before trial gate deploys:**
- Remove "Free forever" from the stats strip
- Replace with "15-day free trial"
- Add a clear note: "After trial: ₹199/month for unlimited fresh questions"
- Update any "free" language in the onboarding modal

---

## Acceptance Criteria

- [ ] All active question files have ≥ 50 questions (dependency on P3-T011)
- [ ] `POSITIONING.md` written and committed — answers "why DecaShift?"
- [ ] Landing page updated: "15-day free trial" replaces "Free forever"
- [ ] Onboarding modal updated to mention trial period
- [ ] Trial gate code (`_isTrialActive()`) in app.js — not active until above items done
- [ ] `user.plan` defaults to `'free'` at signup

## Dependencies
- P2-T013 (subscription strategy — done, gate logic defined)
- P3-T011 (content expansion — must hit 50q/file before this ships)
- Blocks: P5-T005 (upgrade prompt), P5-T001 (Stripe)
