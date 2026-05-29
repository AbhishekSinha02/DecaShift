# Session: PENDING — Silent Feature Gating + Trial Period

**Priority:** 3
**Type:** Code
**Est. Duration:** 3 hours
**Tasks:** P2-T038
**Trigger:** "start the session"
**Depends on:** Landing Phase 3 done, Navigation Overhaul done

---

## Objective

Implement trial-based access model with configurable period.
No explicit "free/paid" labels anywhere. Features just work, then silently gate after trial.

---

## Steps

### Step 1: Add trialStartDate to user on signup (20 min)
In `_handleSignup()`: `user.trialStartDate = new Date().toISOString();`
Save to Drive + localStorage.

### Step 2: Trial check in init() (30 min)
```js
function _checkTrialStatus(user) {
  const TRIAL_DAYS = 30; // configurable later via admin
  if (!user.trialStartDate) return 'active';
  const elapsed = (Date.now() - new Date(user.trialStartDate)) / 86400000;
  return elapsed < TRIAL_DAYS ? 'active' : 'expired';
}
```
Set `state.user.plan = _checkTrialStatus(user)` in `init()`.

### Step 3: Paywall screen (60 min)
New `screens/screen-paywall.html` — full screen, not a modal.
Shows after init() if plan === 'expired'.
Content: headline + "Your trial has ended" + ₹79/month CTA + "Continue with limited access" link.

### Step 4: Settings → Payment Plans sub-screen (30 min)
New tile in settings: "📋 My Plan".
Sub-screen shows: "Trial · X days remaining" or "Expired · Renew from ₹79/month".

### Step 5: Gate Sets 3–5 and exam mode (40 min)
In question loading logic: if plan === 'expired', filter to sets 1–2 only.
In exam mode entry: if plan === 'expired', show paywall instead.

### ✅ Commit after each step
