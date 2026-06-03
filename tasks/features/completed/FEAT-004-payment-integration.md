# FEAT-004 — Payment integration (₹79/month Pro plan)

> ✅ **SUPERSEDED / CLOSED 2026-06-02.** Pricing decision changed from ₹79/month flood to a
> premium sales-led model (₹399/mo decoy · ₹1,999/yr hero · ₹3,599/yr Champion). Payment +
> paywall is now **ENH-011 (Journey-Freeze Paywall + Razorpay, G2)** — the build task. This file
> is kept for history only. See `tasks/enhancements/ENH-011-journey-freeze-paywall-razorpay.md`.

**Priority:** ~~🔴 P1~~ → superseded by ENH-011
**Estimate:** 1–2 sessions  
**Status:** ✅ Superseded (replaced by ENH-011)  

---

## Context

GTM strategy: ₹79/month Pro plan. First 100 paid users threshold before trial mechanics.  
Identity strategy: student signs up free (User ID only). **Email + phone collected at payment time (parent handles).**  
Per `strategy_gtm_zero_friction.md`: zero friction during trial. Paywall only when trial expires or user chooses to upgrade.

---

## Open decisions (user must decide before this session starts)

| Decision | Options |
|---|---|
| **Payment processor** | Razorpay (₹ native, standard for India) · Stripe (global, slightly higher fees) · Manual WhatsApp flow (no code, works at 100 users) |
| **Trial length** | 30 days (current code) · 180 days (GTM zero-friction recommendation) |
| **Payment trigger** | Trial expiry only · OR also show "Upgrade" option in Settings during trial |
| **Plan storage** | HMAC token in Drive (P2-T026 plan, most secure) · `plan: 'pro'` in user localStorage (simplest, easy to spoof) · Signed token from Apps Script |
| **Parent email/phone** | Collected at payment only · Or optional in Settings before payment |

---

## Recommended approach (for 100 paid users)

**Phase 1 — Manual WhatsApp (0 code, launch immediately)**
- Paywall screen has: "₹79/month · Tap to pay →" → opens WhatsApp to `wa.me/917415827596?text=Hi+I+want+to+upgrade+to+Pro`
- Manual: operator confirms payment, sets `plan: 'pro'` via a simple admin URL or Drive edit
- No Razorpay integration needed until 100+ paid users
- Risk: manual effort per user. Acceptable at 100 users/month scale.

**Phase 2 — Razorpay payment link (minimal code)**
- Razorpay payment link (no SDK needed — just a URL)
- User pays → Razorpay sends webhook to Apps Script → Apps Script writes `plan: pro` to user's Drive row → next app open syncs plan
- ~0.5 session to wire up

**Phase 3 — Full Razorpay SDK integration (later)**
- In-app payment flow
- Subscription management
- Auto-renewal

---

## What the paywall screen needs (already partially built)

- [ ] "Your trial has expired" copy (current) → keep but soften: "Your 180-day trial is complete"
- [ ] Price: ₹79/month displayed clearly
- [ ] What you get: Full access to all grades, all subjects, all weeks
- [ ] CTA: "Pay ₹79 →" (Phase 1: WhatsApp link; Phase 2+: Razorpay)
- [ ] "Need help? WhatsApp →" link always visible
- [ ] Parent email + phone collection form (for payment receipt)
- [ ] "Continue free for now" → dismiss paywall, show limited content

---

## Trial length fix (must do regardless of payment decision)

Current code: `const TRIAL_DAYS = 30` in `app-core.js`.  
GTM strategy says 180 days (6 months) for first wave.  
**Change to 180 before first user signs up.**

```js
// app-core.js line ~87:
const TRIAL_DAYS = 180;   // was 30
```

---

## Files involved

| File | Change |
|---|---|
| `app-core.js` | `TRIAL_DAYS = 180` |
| `app/ui/screens/screen-paywall.html` | Update copy, add parent email/phone fields |
| `app-core.js _setupPaywall()` | Wire CTA to Razorpay link or WhatsApp |
| `storage.js` | `syncPlanToDrive()` — write plan after payment confirmed |
| `app-core.js _checkTrialStatus()` | Handle `plan: 'pro'` from Drive sync |

---

## Acceptance

1. Trial days = 180 (not 30)
2. When trial expires, paywall screen shows with price + payment CTA
3. Phase 1: CTA opens WhatsApp to support number with pre-filled message
4. User can dismiss paywall and continue with limited access
5. Parent email + phone collected at paywall (not during signup)
