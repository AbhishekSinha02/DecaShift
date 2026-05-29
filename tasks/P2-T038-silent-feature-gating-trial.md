# P2-T038 — Silent Feature Gating + Configurable Trial Period

**Priority:** P2 | **Complexity:** M | **Status:** Pending

## Goal

Replace the explicit "Free vs Pro" pricing model with a seamless trial experience.
No pricing on the landing page. No "free" labels inside the app.
Features work fully for a configurable trial period, then silently disable (not grey out, not lock with padlocks — just unavailable with a gentle "your trial has ended" nudge on next session start).

## Why This Way

Explicit free tiers create a ceiling in the user's mind on day 1.
A trial that expires after genuine use creates loss aversion — the user has already built the habit, already sees the value, and the ask comes at peak motivation.
"Freemium" is for scale. "Trial + subscription" is for premium feel.

## What Changes

### Landing page
- Remove ALL mentions of "free", "₹0", "Free forever", "Free plan"
- Remove the pricing section entirely from the landing page
- Replace CTA with "Start your trial →" or "Get started →"
- Trust copy: "No credit card needed · Cancel anytime" is fine — implies paid but no friction

### Signup page
- After signup success, show: "Your 30-day full access starts now."
- No plan choice at signup. Full features from day 1.

### Inside the app
- Trial period: default 30 days, configurable in admin portal (15 / 30 / 60 / 90 days)
- On trial expiry: next session start shows a single-screen paywall (not a modal over content)
- Paywall shows: "Your trial ended. Continue with Pro at ₹79/month." + CTA + "Learn more"
- Features that are gated: Sets 3–5, exam mode, formula drills
- Free core that always works: Sets 1–2, flash drills (tables/squares/cubes), daily GK

### Settings → Payment Plans (new sub-screen)
- Shows current plan: "Trial · X days remaining" or "Pro · Active"
- Upgrade CTA if on trial/expired
- Cancel option if on Pro

### Admin portal (future — P4-T006)
- `trial_period_days` config: 15 | 30 | 60 | 90
- `trial_start_date` per user (stored in Drive)
- `feature_gates` JSON: which features unlock at which plan level

## Implementation Approach

### Phase 1 (this task)
1. Remove free/pricing from landing page
2. Update signup success screen copy
3. Add `trialStartDate` field to user object on signup (Drive + localStorage)
4. Add trial expiry check in `init()` — if expired, set `state.user.plan = 'expired'`
5. Add paywall screen (new `screens/screen-paywall.html`)
6. Gate Sets 3–5, exam mode, formula drills behind `state.user.plan !== 'expired'`

### Phase 2 (P4-T006 admin portal)
- Admin UI to configure trial period globally
- Per-user override

## Files
- `app/ui/screens/screen-landing.html` — remove pricing section
- `app/ui/screens/screen-paywall.html` — new
- `app/ui/js/app-core.js` — trial check in init()
- `app/ui/js/app-auth.js` — trialStartDate on signup
- `app/ui/js/app-settings.js` — Payment Plans sub-screen
- `app/ui/css/styles-app.css` — paywall styles

## Success Criteria
- [ ] No "free" or "₹0" visible anywhere on landing page
- [ ] Signup flow says "trial" not "free account"
- [ ] Trial check runs on init(), sets plan state
- [ ] On expiry: paywall screen shown, not a modal over broken UI
- [ ] Settings shows trial days remaining
- [ ] Core features (Sets 1–2, tables drill, GK) work after trial expiry
