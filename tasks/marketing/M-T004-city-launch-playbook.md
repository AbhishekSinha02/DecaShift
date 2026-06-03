# M-T004: City Launch Playbook — Enter Any City in 14 Days

**Priority:** M2 | **Type:** Operations / Replication | **Status:** Pending

> This is the replication manual. Pune works → copy the playbook to Nagpur.
> Nagpur works → copy to Indore. Every city is a self-contained experiment.
> A city that fails tells you what to fix before you enter the next one.
> A city that works tells you exactly what to replicate.

---

## The Core Principle

**City-level rollout = bounded risk.**
A failed city launch costs: 1 domain (₹700) + 2 weeks of a local intern's time.
That's it. No sunk cost. No brand damage (the failure is local and invisible to other cities).

When a city works: you have a proven playbook. Drop it into the next city unchanged.
When a city doesn't: you have specific feedback on what broke. Fix that one thing and retry.

---

## The 14-Day City Launch Timeline

### Pre-Launch (Days 1–3)

**Day 1 — Setup**
- [ ] Buy city domain: `[city]kids.in` from Namecheap/GoDaddy (~₹700)
- [ ] Add domain to Cloudflare Pages project (Custom domains → Add domain)
- [ ] Add city to `CITY_DOMAINS` dict in app.js (1 line)
- [ ] Add city to `city-partners.json` with empty array (placeholder for partners)
- [ ] Deploy and verify: visit `[city]kids.in` → app loads, city shows in hero text

**Day 2 — Find Your Rep**
- [ ] Post on Internshala / local WhatsApp groups / LinkedIn: "Looking for a marketing intern (₹5/signup incentive, performance-based) for an EdTech app. [City]-based preferred."
- [ ] Target profile: MBA student, BBA student, or anyone who wants sales experience
- [ ] Interview (15 minutes via call): Do they know school parent circles? Do they have WhatsApp connections in [City]? Are they self-motivated?
- [ ] Hire 1–2 reps. More than 2 creates coordination overhead.

**Day 3 — Onboard the Rep**
- [ ] Share M-T001 onboarding kit (WhatsApp the Google Doc link)
- [ ] Assign their ref code: `[city]-[firstname]` (e.g., `nagpur-priya`)
- [ ] Confirm they can access `[city]kids.in?ref=[their-code]` and it loads correctly
- [ ] Walk them through the app (15-minute WhatsApp call — they use it, you explain)
- [ ] Set Week 1 target: 20 signups
- [ ] Confirm Monday reporting protocol

---

### Launch Week (Days 4–10)

**Day 4–5 — First Parent Group Push**
Rep sends Template 1/2 (from M-T003) to their first 3–5 parent WhatsApp groups.
**Your job:** Be available on WhatsApp to answer any questions that come in via the developer WhatsApp number on the landing page.

**Day 6–7 — Teacher Outreach Begins**
Rep approaches 3–5 teachers in person (school gate, staffroom).
Rep asks for a 5-minute demo slot in a class or during a free period.
**Your job:** If a teacher wants a call with the developer, take it. One teacher call = 35 students.

**Day 8–9 — Coaching Center Visits**
Rep visits 3–5 coaching centers with the partner pitch (Template 5 from M-T003).
Goal: 1–2 confirmed partners listed in `city-partners.json` by end of week.
**Your job:** Add confirmed partners to the JSON and push within 24 hours. Speed here = rep feels taken seriously.

**Day 10 — Week 1 Review**
Rep sends Monday report (M-T001 format).
You review: signups via `getRepStats()` (M-T002).
Pay: UPI transfer for verified signups × ₹5.
Decision: Is the rep performing? (Target: 20 signups). If yes → continue. If no → diagnose why.

---

### Growth Week (Days 11–14)

**Day 11–12 — Double Down on What Worked**
Look at rep's report. What channels brought signups?
- Parent groups → send rep to more groups
- Teacher → rep gets more teacher meetings
- Coaching center → rep approaches more centers

**Day 13 — First Partner Reward Moment**
Any student who hit 7-day streak during launch week gets a Reward Card.
Rep follows up with that student's parent: "Your child earned a reward card — show it at [Partner Name] for [discount]."
This is the word-of-mouth trigger. Rep should know when students earn cards (you can check Drive data and inform rep).

**Day 14 — City Assessment**
Run `getRepStats()`. Review:
- Total signups: target was 50 by end of Week 2
- Sessions completed: how many actually used the app (not just signed up)?
- Drop-off: signed up but never completed a session → what's causing it?
- Rep performance: are they on track? Need support?

---

## City Decision Framework (End of Week 2)

| Signups | Sessions completed | Decision |
|---|---|---|
| 50+ | 60%+ completed session | ✅ City working — scale rep, add more cities |
| 50+ | <40% completed session | ⚠️ Acquisition ok but product issue — investigate drop-off |
| <30 | Any | 🔴 Rep or channel problem — diagnose before scaling |

**The only cities worth scaling:** Cities where >50% of signups complete at least 1 session.
Signups without usage = vanity metric. Sessions = real engagement.

---

## The Replication Trigger

When City A hits **100 verified engaged users** (completed 3+ sessions):
1. Start City B — repeat Day 1–3 setup
2. Use City A rep as a reference ("Our Pune rep got 100 users in 3 weeks — here's how")
3. What worked in City A: document it and hand it to City B rep

---

## What Can Go Wrong and How to Fix It

| Problem | Likely Cause | Fix |
|---|---|---|
| Rep sends messages but no signups | Wrong audience (too broad) | Focus on Grade 5–8 parent groups only |
| Signups but no sessions | App sign-up friction | Check the Google Drive OAuth drop-off — measure and report |
| Rep disappears after Week 1 | Incentive wasn't paid fast enough | Pay on the same day you see the verified signup. Never delay. |
| Teacher interested but students don't sign up | No class-level push | Ask teacher to share link in class WhatsApp group directly |
| Partner says yes but students don't redeem | Reward Card is unknown | Rep should personally tell streak earners they have a reward card |

---

## City Expansion Priority (UPDATED 2026-06-02 — Lucknow is the pilot)

> **Decision:** **Lucknow launches FIRST** as the single-city pilot. See
> `LUCKNOW-LAUNCH-STRATEGY.md` for the full plan. Rationale: UP Board is underserved by
> CBSE-skewed incumbents (BYJU'S/PW/Vedantu), Hindi-medium support is a real local moat,
> student density + exam culture is high, and a founder ground-connection beats a larger
> cold market. The order below applies *after* the Lucknow gate passes.

| Priority | City | Why |
|---|---|---|
| **1 (PILOT)** | **Lucknow** | UP board exam culture, underserved by CBSE-first incumbents, Hindi-medium wedge, massive student density. Domain: **lucknowkids.in** |
| 2 | Pune | Maharashtra's largest coaching market. Domain: punekids.in |
| 3 | Nagpur | Vidarbha coaching hub. Domain: nagpurkids.in |
| 4 | Indore | MP coaching culture, Kota-adjacent mindset. Domain: indorekids.in |
| 5 | Surat | Gujarat tier-2, high parent education focus. Domain: suratkids.in |
| 6 | Jaipur | Kota feeder city — families with exam-prep mindset. Domain: jaipurkids.in |

Replicate to city #2 only after Lucknow clears its Week-6 decision gate
(trial→paid ≥18%, session-completion >60%). A city where you know 1 teacher is worth more
than the "best" city on this list.

---

## Costs Per City Launch

| Item | Cost |
|---|---|
| City domain (.in) | ₹700/year |
| Rep incentive (100 signups × ₹5) | ₹500 |
| Rep bonus (if 100 signups hit) | ₹500 |
| Your time (setup + 2 calls) | 3–4 hours |
| **Total per city, Month 1** | **₹1,700 + 4 hours** |

Break-even (at the finalized pricing — see P2-T013): **1 annual conversion** at ₹1,999/yr
covers the per-city cost above. One paying family pays back the city launch.
