# Feature: Subscription Strategy — 15-Day Trial + Soft Lock

**Priority:** P2 | **Type:** Product Strategy + Feature | **Complexity:** S | **Status:** Pending

## Strategy (Finalized)

Simple time-based gate. No feature matrix. No Free/Pro/Max complexity.

```
Day 1–15   Full app, all questions, everything free
Day 16+    Soft lock — only previously answered questions available
           Upgrade to Pro → full access restored immediately
```

### Why Soft Lock Over Hard Lock
A hard wall ("your trial ended") creates friction and resentment.
Soft lock lets the user feel the loss naturally:
> "Why am I seeing the same questions again?"

That moment of frustration is the upgrade trigger — no pushy popup needed.

### Why Time-Based Over Feature-Based
- No need to define which features are Free vs Pro
- The entire app is the product — restricting features degrades the core loop
- Content freshness (new questions every session) IS the value — gate that

---

## Data Model

```js
// user object (stored in localStorage + Drive):
{
  plan: 'free' | 'pro',        // new field; default 'free' at signup
  createdAt: "2026-05-26T..."  // already exists — tamper-resistant via Drive
}
```

`createdAt` is synced to Drive at signup — clearing localStorage does not reset the trial clock.

---

## Gate Logic (app.js)

```js
function _isTrialActive(user) {
  if (user.plan === 'pro') return true;
  const days = Math.floor((Date.now() - new Date(user.createdAt)) / 86400000);
  return days <= 15;
}

// On session start — before loading questions:
if (!_isTrialActive(state.user)) {
  const answeredIds = _getAnsweredQuestionIds(state.user.id);
  if (answeredIds.length === 0) {
    showUpgradeScreen(); return;
  }
  // Soft lock: only previously answered questions
  state.questions = state.questions.filter(q => answeredIds.includes(q.id));
}
```

---

## Pro Plan — What It Unlocks

Single clear unlock: **fresh questions every session, forever.**

Future Pro extras (Phase 2, after first 50 paying users):
- Regional language practice (P3-T013)
- Session analytics beyond 30 days
- Real exam mode (P5-T002)

---

## Pricing

| Plan | Price | Billing |
|---|---|---|
| Free | ₹0 | 15-day trial |
| Pro | ₹199/month | Monthly |
| Pro | ₹999/year | Annual (save 58%) |

Comparable: Duolingo Plus ₹533/month. ₹199 is impulse-buy territory for professionals,
affordable for college students.

---

## Payment Flow — Phase 1: Manual (First 10–20 Sales)

1. Trial expires → user sees upgrade prompt with Stripe Payment Link
2. User pays → Stripe sends confirmation email to you
3. Open their Drive file → set `plan: "pro"` manually
4. User refreshes → full access restored

**Setup: 15 minutes. No webhook, no server.**
This is the right approach for friends & family first sales.

---

## Payment Flow — Phase 2: Automated (After 20+ Paying Users)

Stripe webhook → Google Apps Script Web App → update user's Drive file.

```
Stripe → POST webhook → Apps Script doPost(e) → find user by email → set plan: 'pro'
```

Apps Script already handles Drive sync. Adding a webhook handler is ~30 lines.

---

## Upgrade Prompt UI

Minimal — not a full pricing page:

```
┌─────────────────────────────────┐
│  Your 15-day trial has ended    │
│                                 │
│  You've answered 47 questions.  │
│  Keep your streak alive.        │
│                                 │
│  Pro — ₹199/month               │
│  [ Upgrade Now ]                │
│                                 │
│  [ Practice with past questions ]│
└─────────────────────────────────┘
```

The bottom option lets them stay without paying — no hard wall — but the experience
naturally degrades as they see repeat questions.

---

## Acceptance Criteria

- [ ] `user.plan` field added to profile, defaults to `'free'` at signup
- [ ] `_isTrialActive(user)` in app.js
- [ ] Soft lock applied at session start when trial expired + plan is 'free'
- [ ] Upgrade prompt screen shown at trial expiry (P5-T005)
- [ ] Stripe Payment Link configured (manual plan upgrade for first sales)
- [ ] `plan: 'pro'` settable manually in Drive file
- [ ] Trial uses Drive-stored `createdAt` — localStorage clear doesn't reset clock

---

## Files to Touch

| File | Change |
|---|---|
| `app/ui/app.js` | `_isTrialActive()`, soft lock at session start, `user.plan` default |
| `app/ui/index.html` | Upgrade prompt screen (hidden div) |
| `app/ui/styles.css` | Upgrade prompt styles |

---

## Dependencies
- P1-T012 (Drive account persistence — done; `createdAt` already in Drive)
- Unblocks: P5-T004, P5-T005, P5-T001 (Stripe Phase 2)
