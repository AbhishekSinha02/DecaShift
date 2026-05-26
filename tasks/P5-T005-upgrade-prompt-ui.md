# Feature: Upgrade Prompt UI — Plan Comparison Screen

**Priority:** P5 | **Type:** UX | **Complexity:** M | **Status:** Pending

## Goal
When a user taps a locked feature, show a compelling upgrade screen that
explains the value clearly and drives conversion. The screen must feel
motivational, not punishing — "here's what you unlock" not "you can't do this."

## Trigger Points
- Tapping a 🔒 locked feature card on home screen
- Tapping "Exam Mode" when on Free plan
- Tapping "Leaderboard" when on Free or Pro plan
- Persistent soft nudge: "Upgrade" chip in home header for free users

## Screen Design

### Upgrade Modal / Bottom Sheet
```
┌─────────────────────────────────────┐
│  Unlock your full potential          │
│  Compare plans and choose yours      │
│                                      │
│  [Free]     [Pro ★]    [Max ⚡]      │
│  ─────────  ─────────  ──────────    │
│  Practice   + Exams    + Leaderboard │
│  Streaks    + Offline  + AI packs    │
│  Dashboard  + Badges   + Analytics  │
│             ₹199/mo    ₹499/mo       │
│                                      │
│  [ Start Free Trial ]                │
│  [ Maybe Later ]                     │
└─────────────────────────────────────┘
```

## Acceptance Criteria
- [ ] Upgrade screen accessible via locked feature tap AND "Upgrade" in user menu
- [ ] All 3 tiers displayed side-by-side (stacked on mobile)
- [ ] Current user plan highlighted with active state
- [ ] CTA button text changes based on context: "Unlock Exam Mode", "See Leaderboard"
- [ ] "Start Free Trial" CTA triggers Stripe Checkout (from P5-T001)
- [ ] "Maybe Later" dismisses without friction — no confirmation dialog
- [ ] Upgrade screen works on mobile (full-screen bottom sheet at < 640px)
- [ ] Pro plan visually emphasized as "Best Value"

## Emotional Design Notes
- Never say "You don't have access" — say "Unlock this"
- Show what the user is already getting (Free tier wins) before asking for money
- Streak milestone = good moment to show upgrade prompt organically
- After 7-day streak: show "Your consistency is Pro-level. Make it official."

## Dependencies
- P2-T013 (tier definition — must be finalized)
- P5-T004 (gate system — defines when this screen triggers)
- P5-T001 (Stripe — CTA connects to checkout)

## Files to Touch
- `app/ui/index.html` — upgrade modal HTML
- `app/ui/app.js` — `openUpgradePrompt(featureName)`, plan comparison render
- `app/ui/styles.css` — upgrade modal, plan card styles, tier comparison grid
