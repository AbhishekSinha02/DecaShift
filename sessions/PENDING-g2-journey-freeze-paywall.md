# NEXT SESSION — G2: Journey-Freeze Paywall + Razorpay (ENH-011)

**Priority:** 🔴 P0 — highest. The single binding blocker for paid GTM.
**Spec:** `tasks/enhancements/ENH-011-journey-freeze-paywall-razorpay.md` (self-contained — read it first).
**Branch:** `main` only (per CLAUDE.md). Commit + push after every atomic step.

---

## Why this session
G2 is the one unbuilt thing that makes the paid launch a non-event — you can't collect money
without it. It does NOT block starting acquisition (free 30-day trial), but it must land inside
the first 30 days while trials mature. This session builds it.

## Pre-step (5 min) — verify live build still healthy
Confirm `DONNIBO_BUILD` ≥ 20260602e in console; a fresh User-ID account still does
signup → quiz → result → drill → Journey → sign out → sign in cleanly. Then start ENH-011.

## What to build (atomic, flag-gated — full plan in ENH-011 "Build Plan")
1. Data model + `_planActive()` (plan/planExpiry/founding/siblings/couponsUsed; Drive-synced)
2. `journeyFrozen` plumbing + guards at every growth-award site (XP/streak/badge/avatar/GK/box)
3. Paywall screen (frozen journey + real child stats, annual-led)
4. Tier buttons → Razorpay Payment Links + sibling add-on
5. Coupon redemption + ₹1,199 floor guard (LUCKNOW500/STREAK21/WIN-*/EXT45)
6. Manual plan-set in Drive un-freezes on refresh — verify end-to-end
7. Flip `ds_paywall` on, QA full loop, default-on + build-stamp/`?v=` bump + tag

All behind `FEATURES.paywall` until step 7. App works at every commit.

## Hard guardrails (founder, non-negotiable)
- **Freeze, never delete.** Copy is "Your journey is saved · continue →", never "trial expired."
- **Plan state lives in Drive** (localStorage clear must not grant Pro).
- **Floor ₹1,199/yr** after all discounts.
- Lookups use `state.user.loginId`, never `.email` (FEAT-002).

## Embedded strategy (so no cross-file hunting)
Tiers: ₹399/mo decoy · **₹1,999/yr hero** · ₹3,599/yr Champion (+live exams) · sibling +₹999/yr.
Trial: 30 days, no card. Razorpay (not Stripe). Phase 1 = manual Payment Link + set plan in Drive;
Phase 2 webhook deferred.

## Dependencies / sequencing
- Hard-depends on **P2-T046 cross-device journey sync** for paid-user safety (gated by P2-T047
  identity decision). Plan-in-Drive works now; full journey restore on new device needs P2-T046.
- Supersedes FEAT-004 (old ₹79 payment — now completed).

## After this session
- GTM blocker G2 cleared → S4 (sales process) 5→8, GTM score ~63→~70.
- Next GTM build: G5 (ref/funnel tracking — can be `?ref=` + Google Sheet) + the viral-loop spec.
- Then: run the Lucknow pilot to resolve G1 (trial→paid %).
