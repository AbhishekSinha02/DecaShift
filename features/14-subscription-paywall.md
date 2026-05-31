# Feature: Subscription & Paywall

## Overview
Three-tier access model: Free (Sets 1–2), Trial (180-day full access), and Pro (₹79/month, full access). New accounts get a 180-day free trial automatically — no credit card, no friction. Sets 3–5 (Wed–Fri) and the Exam set are gated. When a trial expires, a paywall screen is shown on any gated content attempt.

---

## User Flows

### Flow 1: New User Trial

**Entry point:** User creates a new account (Sign Up).

1. Account is created with `plan: 'trial'` and `trialStart: <ISO date>`
2. User gets **full access** to all content for 180 days — no restrictions
3. No credit card required; no email verification
4. Home screen shows all 5 weekly sets with no lock icons

---

### Flow 2: Hitting the Paywall (Trial Expired)

**Entry point:** Trial has expired (>180 days since `trialStart`). User taps a Wed/Thu/Fri set card.

1. `_isGatedGoal(goal)` returns `true` (it's Set 3–5)
2. `state.user.plan === 'expired'` is detected
3. **Paywall screen loads** instead of the quiz
4. Paywall screen shows:
   - Heading: "Continue Learning with Pro"
   - Feature list: what's included in Pro (Sets 3–5, Exam sets, etc.)
   - Price: **₹79/month**
   - **"Upgrade to Pro"** CTA button
   - **"Maybe later"** link → returns to Home

---

### Flow 3: Upgrading to Pro

**Entry point:** User taps "Upgrade to Pro" on the paywall screen.

1. User is directed to the payment flow (currently: redirects to external payment link / Razorpay page)
2. After successful payment, the payment system calls the Apps Script endpoint
3. Apps Script updates the user's plan in Google Drive to `plan: 'pro'`
4. Next time the user opens the app, their profile is synced → `plan: 'pro'` is loaded
5. All gated content unlocks; lock icons disappear from day cards

---

### Flow 4: Checking Plan in Settings

**Entry point:** Settings → My Plan.

1. Shows current plan: "Free Trial" / "Pro" / "Expired"
2. For Trial: shows days remaining (e.g., "Trial: 142 days left")
3. For Pro: shows renewal date
4. For Expired: shows "Upgrade to Pro" button
5. Links to billing management (external)

---

## Plan Tiers

| Plan | Sets Available | Price | Duration |
|---|---|---|---|
| Free | Sets 1–2 (Mon–Tue) only | Free | Forever |
| Trial | All sets (1–5 + Exam) | Free | 180 days from signup |
| Pro | All sets (1–5 + Exam) | ₹79/month | Monthly renewal |

---

## Gated Content Rules

| Content Type | Free | Trial | Pro |
|---|---|---|---|
| Monday set (Set 1) | ✅ | ✅ | ✅ |
| Tuesday set (Set 2) | ✅ | ✅ | ✅ |
| Wednesday set (Set 3) | ❌ Paywall | ✅ | ✅ |
| Thursday set (Set 4) | ❌ Paywall | ✅ | ✅ |
| Friday set (Set 5) | ❌ Paywall | ✅ | ✅ |
| Exam set | ❌ Paywall | ✅ | ✅ |
| Flash Drills | ✅ | ✅ | ✅ |
| Daily GK | ✅ | ✅ | ✅ |

---

## Gating Implementation

Sets are gated by the `weekDay` field on the goal:
- `_GATED_DAYS = new Set(['wed', 'thu', 'fri'])`
- `_isGatedGoal(goal)` returns `true` if `goal.weekNum` exists AND `goal.weekDay` is in `_GATED_DAYS`
- Check runs at the start of `startGoal()` — before any quiz screen is loaded

---

## Lock Icons on Home

When plan is `expired` or `free`:
- Day cards for Wed/Thu/Fri show a 🔒 lock icon
- Tapping a locked card still routes through `startGoal()` → paywall check fires
- Mon/Tue cards are always unlocked (no lock icon)

---

## Trial vs Expired Detection

```js
// Pseudo-logic in app:
const daysSinceTrialStart = (Date.now() - new Date(user.trialStart)) / 86400000;
if (user.plan === 'trial' && daysSinceTrialStart > 180) {
  user.plan = 'expired';
  Storage.saveUser(user);
}
```

This check runs on app init. Trial → Expired transition happens automatically client-side.

---

## Pricing Philosophy

₹79/month = ~$0.95 USD. This is deliberately the lowest sustainable price in the Indian EdTech market. Solopreneur cost structure (static site + Cloudflare R2 + Upstash) means margins competitors with payroll cannot match.

---

## Screens Involved
- `screens/screen-paywall.html`
- `app/ui/js/app-quiz.js` — `_isGatedGoal()`, paywall redirect in `startGoal()`
- `app/ui/js/app-settings.js` — `_initPlanSection()` in Settings
- `app/ui/js/storage.js` — plan field in user profile
- `app/ui/js/app-home.js` — lock icons on day cards
