# Subscription Strategy — Final Pricing Model (Sales-Led, Single-City)

**Priority:** P2 | **Type:** Product Strategy + Feature | **Complexity:** M | **Status:** Finalized (2026-06-02)

> **Supersedes** the earlier ₹199 / 15-day soft-lock draft. This version reflects the
> pivot to a **premium, sales-led, single-city launch (Lucknow)** with a human closing loop
> (interns + local partner) and coupon tooling. See `LUCKNOW-LAUNCH-STRATEGY.md` for the
> go-to-market that wraps this pricing.

---

## Director's Verdict on the Pivot (read first)

The original plan (memory: `strategy_gtm_zero_friction`, `strategy_first_100_paid`) was a
**viral, zero-touch, ₹79–199 flood**. The new plan is a **high-touch, sales-led, ₹399+ premium**
motion. These are *opposite* go-to-market engines — you cannot run both at once.

**The reconciliation that makes the new plan work:**

> **Acquisition stays free and frictionless. Monetization gets high-touch.**
> A parent never sees a price wall at sign-up — they get a 30-day full-access trial.
> The higher price is only encountered at *conversion*, where a human (intern/partner) +
> a coupon does the closing. Low-friction top of funnel, premium-priced, human-closed bottom.

This is the right structure for a tier-2 city with a sales team. **One hard dependency:**
the North Star in CLAUDE.md — *"the bottleneck is content, not code; fix F1 (50+ questions
per grade) before any marketing."* **Do not start the paid Lucknow push until the trial's
30 days are full of fresh daily content for the grades you're selling.** A premium price on
a thin trial kills conversion and word-of-mouth simultaneously.

---

## Why ₹399/month is right — but must NOT be the headline

A tier-2 Lucknow parent anchors on **Physics Wallah** (full *live* courses, ₹2,500–4,500/yr),
not Duolingo. Against that anchor, **₹399/month = ₹4,788/yr** for a *daily-practice* app reads
expensive ("PW gives live classes for less"). The **monthly optic is the danger, not the number.**

**Fix: make monthly a deliberate decoy. Lead with annual.**
₹1,999/yr = **₹166/month effective** — that reframes the entire offer as a smart-parent
no-brainer, and makes the ₹399 monthly exist only to make annual look obvious.

---

## The Tiers (final)

| Tier | Price | Effective /mo | What it is | Role |
|---|---|---|---|---|
| **Practice (Monthly)** | ₹399/mo | ₹399 | Full app, all features **except** live exams | **Decoy** — flexibility for the few who want it; makes annual obvious |
| **Annual** ⭐ | **₹1,999/yr** | ₹166 | Full app, all features except live exams | **Hero / "Most Popular"** — the default recommendation |
| **Champion (Annual+)** | ₹3,599/yr | ₹300 | Everything **+ scheduled weekly/monthly live exams** | **Premium / aspirational** — competes head-on with PW on price |

**Live exams** (the Champion differentiator): scheduled weekly + monthly timed exams that
run at a fixed time for all subscribers simultaneously — a real-exam-pressure event, a
leaderboard moment, and a recurring re-engagement hook. This is the one feature worth a
₹1,600/yr premium and the hardest for a quiz competitor to copy.

### Add-on lever (high-ARPU, built for UP families)
**Sibling add-on: +₹999/yr per additional child.** UP/joint families routinely have 2–3
school-age kids. One paying parent → 2–3 seats is the single biggest ARPU and
word-of-mouth multiplier available. Surface it at checkout: *"Add a sibling for ₹999/yr."*

---

## Trial

- **30 days, full access, no card.** (Not 45 — the habit forms in ~21 days; 30 days lets the
  parent *see* the habit form, then feel the loss at lock. 45 just delays cash and decision.)
- **Sales rep may extend to 45 days** via a coupon for a high-intent-but-hesitant parent —
  gives the rep a closing tool without making 45 the default.
- **At trial end → the journey freezes, it is NEVER deleted** (see "What's Gated" below). The
  child keeps everything they've built, but forward growth pauses until they continue.

---

## Coupons & Sales-Team Tooling

| Coupon | Effect | Who/When | Guardrail |
|---|---|---|---|
| `LUCKNOW500` | **Founding price ₹1,499/yr, locked for life** + "Founding Member" badge | First **500 paid** users only, auto-expires | Hard cap at 500; creates urgency + pioneer pride (word-of-mouth gold) |
| `STREAK21` | 20% off annual | Auto-offered to users who hit a **21-day practice streak** | Product-*earned* discount — rewards the exact behavior that proves value |
| `WIN-[repname]` | Up to **25% off**, rep-discretionary | Each intern/partner gets a named code to close on the spot | Tracked per rep (ties to M-T002); max 25% |
| `EXT45` | Extends trial to 45 days | Rep tool for hesitant parents | Not advertised; rep-issued only |

**Floor-price rule (non-negotiable):** after *all* stacked discounts, never sell annual below
**₹1,199/yr**. Infra is near-zero (static site + R2 + Upstash), so margin is healthy even at
the floor — but the floor protects price perception and prevents rep race-to-the-bottom.

---

## Conversion Math — One City, New Price (sanity check)

Sales-led + human-closed + coupon → trial→paid converts **far higher** than self-serve:

```
Month 1 Lucknow:   ~300 free trials  (2 interns + 1 partner, see LUCKNOW-LAUNCH-STRATEGY)
Trial → paid:      18–22% (human-closed at trial end, vs ~3–5% self-serve)
                   ≈ 60 paid users in 6–8 weeks
Blended ARPU:      ~₹1,700/yr (mix of annual + some Champion + sibling add-ons)
                   ≈ ₹1,02,000 ARR from a single pilot city
```

60 paid in one tier-2 city pilot **proves the unit economics** before replicating. The metric
that matters is **trial→paid %**, not signups — that's the number that tells you whether the
premium price holds.

---

## Data Model

```js
// user object (localStorage + Drive):
{
  plan: 'trial' | 'monthly' | 'annual' | 'champion',  // default 'trial' at signup
  planExpiry: "2027-06-02T...",   // for paid plans
  createdAt: "2026-06-02T...",    // trial clock — synced to Drive, tamper-resistant
  founding: false,                // true if LUCKNOW500 redeemed (lifetime price lock)
  siblings: []                    // linked child profiles for the add-on
}
```

`createdAt` is Drive-synced — clearing localStorage does not reset the trial clock.

---

## What's Gated — the Journey, not the Content (the real conversion lever)

The strongest thing to put at stake is **not fresh questions — it's the child's journey.**
Loss aversion on *identity and progress* beats loss aversion on *content* every time. This
**weaponizes the engagement engine you already built** (XP, 6-stage avatar evolution, badges,
streaks, GK/current-affairs, My Journey) as the monetization lever.

**On non-conversion, forward growth FREEZES — visibly — but nothing is deleted:**
- The avatar is *ready to evolve to the next stage* → frozen, one tap away.
- The practice streak is **paused**, sitting there, not advancing.
- New badges locked; GK / current-affairs stops counting toward the journey.
- They can still answer past questions, but **nothing they do counts toward growth anymore.**

**Two hard rules (the founder's explicit guardrail):**
1. **Never delete the journey — only freeze it.** The lock copy is *"Your journey is saved.
   Continue growing →"*, never *"trial expired."* You hold the past safe and sell the
   *continuation*. The pain is the frozen avatar, not a punishment.
2. **The journey must survive device + credential changes.** *"Re-login with different
   credentials = killing the journey."* If a paying child loses their journey on a phone switch,
   you've broken the one thing they paid for. → **Cross-device journey sync (P2-T046) is now
   launch-critical, not a P2 nicety** — it is load-bearing for this entire monetization thesis.

> Why this is the moat: content is a commodity (cloned in a week); a year of tracked, celebrated
> growth is per-child, compounding, uncopyable. The switching cost IS the journey. See
> `POSITIONING-AND-GROWTH-ENGINE.md`.

---

## Gate Logic (app.js)

```js
function _planActive(user) {
  if (['monthly','annual','champion'].includes(user.plan)) {
    return new Date(user.planExpiry) > new Date();
  }
  // trial
  const days = Math.floor((Date.now() - new Date(user.createdAt)) / 86400000);
  return days <= 30;
}

// On session start — before loading questions:
if (!_planActive(state.user)) {
  // FREEZE the journey, don't delete it: no XP/badge/streak/avatar advance, GK locked.
  state.journeyFrozen = true;   // renderers show "ready to grow — continue" frozen state
  const answeredIds = _getAnsweredQuestionIds(state.user.loginId);  // loginId, NOT email
  if (answeredIds.length === 0) { showUpgradeScreen(); return; }
  // They may still replay past questions, but nothing counts toward growth while frozen
  state.questions = state.questions.filter(q => answeredIds.includes(q.id));
}
// Anywhere growth is awarded (XP, badges, streak, avatar stage, GK streak):
//   if (state.journeyFrozen) return;  // past is preserved; forward growth paused
```

> ⚠️ Account lookups use `state.user.loginId` (FEAT-002), **never** `state.user.email`.
> See CLAUDE.md "Account & Identity Model."

---

## Payment Flow

**Phase 1 — Manual (first ~30 sales, the Lucknow pilot):**
1. Rep closes parent → parent pays via **UPI / Razorpay Payment Link** (Razorpay > Stripe for
   India: UPI, native INR, instant).
2. Razorpay confirmation → you set `plan` + `planExpiry` in their Drive file manually.
3. Parent refreshes → full access. (Setup: ~20 min, no server.)

**Phase 2 — Automated (after pilot proves out):**
Razorpay webhook → Google Apps Script `doPost(e)` → find user by `loginId` → set plan.
Apps Script already handles Drive sync (~30 lines added).

---

## Upgrade Prompt UI (at soft lock)

```
┌─────────────────────────────────────┐
│  Aarav's journey is saved ✓          │
│                                      │
│  🏅 12 badges · 🔥 18-day streak      │
│  Avatar: Stage 4 → ready for Stage 5 │
│  [frozen avatar art, mid-evolution]  │
│                                      │
│  His growth is paused. Continue it →  │
│                                      │
│  ⭐ Annual — ₹1,999/yr (₹166/mo)      │
│     [ Continue Aarav's journey ]     │
│                                      │
│  Champion ₹3,599 · adds live exams   │
│  Add a sibling: +₹999/yr             │
│                                      │
│  [ Keep practicing (growth paused) ] │
└─────────────────────────────────────┘
```

Lead with the **frozen journey**, not the price — show the badges, the paused streak, the
avatar *one stage from evolving.* That visible frozen growth is the conversion trigger. Then
lead with **annual**; monthly is a small link. Bottom option = no hard wall (they can still
practice), but growth stays paused — the loss is felt, not enforced. **Never** the words
"trial expired" or anything that reads as deletion.

---

## Acceptance Criteria

- [ ] `plan` (`trial|monthly|annual|champion`) + `planExpiry` + `founding` + `siblings` on profile
- [ ] `_planActive(user)` in app.js; soft lock at session start when inactive
- [ ] 30-day trial clock from Drive `createdAt`
- [ ] Upgrade screen leads with annual, shows child name + real stats, sibling add-on
- [ ] Coupon redemption: `LUCKNOW500` (cap 500), `STREAK21`, `WIN-[rep]`, `EXT45`
- [ ] Floor-price guard: reject any stacked discount below ₹1,199/yr
- [ ] Razorpay Payment Links configured; manual plan set in Drive for Phase 1
- [ ] Live-exam scheduling stub for Champion (can ship after first paid users)

---

## Files to Touch

| File | Change |
|---|---|
| `app/ui/app.js` | `_planActive()`, soft lock, plan defaults, coupon redemption, floor guard |
| `app/ui/index.html` | Upgrade prompt screen + pricing/coupon UI (hidden div) |
| `app/ui/styles.css` | Upgrade prompt + tier-card styles |
| Drive / Apps Script | Phase-2 Razorpay webhook (deferred until pilot proves out) |

## Dependencies
- Content depth (F1) **must** be ready for the grades sold — gates the whole launch
- Unblocks: live-exam feature, Razorpay webhook automation
- Pairs with: `LUCKNOW-LAUNCH-STRATEGY.md`, M-T002 (rep/coupon tracking)
