# Feature: Stripe Integration — Paid Plan Foundation

**Priority:** P5 | **Type:** Technical | **Complexity:** L | **Status:** Pending

## Goal
Set up Stripe Checkout so users can upgrade to a paid plan. No backend server — use Stripe's client-only Checkout with a serverless function (Netlify/Vercel/Cloud Run) or Stripe Payment Links for MVP.

## Paid Plan Benefits
- Real Exam Mode (timed, no feedback mid-exam, graded at end)
- Leaderboard access
- Priority question sets + new content first

## Pricing (to define)
- Monthly: ₹199/month or $2.99/month
- Annual: ₹1499/year or $19.99/year

## Acceptance Criteria
- [ ] "Upgrade" button on home screen for free users
- [ ] Clicking Upgrade opens Stripe Checkout (redirect or embedded)
- [ ] On payment success: user plan updated to `pro` in their profile
- [ ] Pro badge visible on profile and user chip in header
- [ ] Free features remain fully available to pro users
- [ ] Plan status checked on init — no UI flicker
- [ ] Subscription management: "Manage Billing" link → Stripe Customer Portal

## MVP Approach (No Backend)
Use **Stripe Payment Links** — a hosted checkout page with no server required.
- Create a Payment Link in Stripe Dashboard
- On success redirect back to app with `?upgrade=success` query param
- App reads param and sets `user.plan = 'pro'` (honor system for MVP)

## Full Approach (Phase 2)
- Netlify Function or Apps Script webhook to verify payment and update user plan in Drive
- Stripe `customer.subscription.created` webhook → set `user.plan = 'pro'`

## Dependencies
- P1-T002 (user auth must exist)
- P5-T002 (exam mode must exist to give paid users something)

## Files to Touch
- `app/ui/index.html` — upgrade button, pro badge
- `app/ui/app.js` — plan check on init, upgrade redirect
- `app/ui/storage.js` — `user.plan` field
- New: `app/ui/upgrade.html` — upgrade screen with plan comparison
