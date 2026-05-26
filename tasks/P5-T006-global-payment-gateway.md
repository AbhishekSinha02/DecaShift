# Feature: Global Payment Gateway

**Priority:** P5 | **Type:** Monetization | **Complexity:** M | **Status:** Pending

## Goal
Accept payments from users in any country — India, Middle East, Europe, Americas —
in their local currency and via their preferred payment method.

---

## Phase 1 (India launch — already in P2-T013)
- Stripe with INR pricing (₹199/month, ₹999/year)
- Razorpay as Indian alternative (better UPI/bank transfer support)
- Manual plan upgrade for first 10–20 sales

---

## Phase 2 (International launch — this task)

### Payment Providers by Region

| Region | Provider | Local Methods |
|---|---|---|
| India | Razorpay + Stripe | UPI, NetBanking, Cards, Wallets |
| Middle East | Stripe + HyperPay | Cards, KNET (Kuwait), Mada (Saudi) |
| Europe | Stripe | Cards, SEPA Direct Debit, iDEAL (Netherlands) |
| Latin America | Stripe + dLocal | Cards, PIX (Brazil), OXXO (Mexico) |
| SE Asia | Stripe + 2C2P | Cards, GrabPay, PromptPay |
| Global fallback | PayPal | Cards, PayPal balance |

**Recommendation:** Start with Stripe only (supports 40+ countries natively).
Add Razorpay for India (better UPI experience). Add others after first 50 international users.

### Multi-Currency Pricing

```js
const PRICING = {
  IN: { currency: 'INR', monthly: 199,   annual: 999   },
  US: { currency: 'USD', monthly: 2.99,  annual: 14.99 },
  GB: { currency: 'GBP', monthly: 2.49,  annual: 12.99 },
  AE: { currency: 'AED', monthly: 10.99, annual: 54.99 },
  DE: { currency: 'EUR', monthly: 2.99,  annual: 14.99 },
  FR: { currency: 'EUR', monthly: 2.99,  annual: 14.99 },
  BR: { currency: 'BRL', monthly: 14.99, annual: 74.99 },
  // fallback
  default: { currency: 'USD', monthly: 2.99, annual: 14.99 }
};
```

Currency detection: `Intl.DateTimeFormat().resolvedOptions().timeZone` → country code
→ lookup in PRICING table → show correct currency on upgrade screen.

### Backend Requirement (Apps Script webhook expansion)
The existing Apps Script webhook (P2-T013 Phase 2) handles Stripe events.
For Razorpay, add a second webhook handler in the same script:

```js
function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  if (body.source === 'stripe')   handleStripeWebhook(body);
  if (body.source === 'razorpay') handleRazorpayWebhook(body);
}
```

---

## Acceptance Criteria

- [ ] Stripe Payment Link works for USD/EUR/GBP (international cards)
- [ ] Razorpay payment link for INR (UPI + cards, India)
- [ ] Currency auto-detected from user's timezone
- [ ] Upgrade screen shows local currency pricing
- [ ] Apps Script webhook handles both Stripe and Razorpay confirmation events
- [ ] `user.plan = 'pro'` set automatically on payment confirmation
- [ ] Receipt email sent by Stripe/Razorpay automatically

## Dependencies
- P2-T013 (subscription strategy + trial gate — must be live first)
- P5-T001 (Stripe integration — Phase 1, this extends it)
- P6-T004 (i18n — upgrade screen shows in user's language)

## Files to Touch
- `app/ui/app.js` — currency detection, pricing lookup
- `app/ui/index.html` — upgrade screen shows dynamic currency
- `apps-script/Code.gs` — multi-provider webhook handler
