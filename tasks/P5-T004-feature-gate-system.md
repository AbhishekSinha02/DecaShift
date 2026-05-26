# Feature: In-App Feature Gate System

**Priority:** P5 | **Type:** Technical | **Complexity:** S | **Status:** Pending

## Goal
A lightweight, client-side feature gate that checks `user.plan` before showing
or enabling paid features. No backend required for the gate itself — plan is
stored in localStorage and synced to Drive. Stripe handles plan assignment.

## Plan Values
```js
user.plan = 'free'  // default for all new signups
user.plan = 'pro'   // after Pro payment verified
user.plan = 'max'   // after Max payment verified
```

## Gate Implementation
```js
// Single helper — used everywhere a feature is gated
function _canAccess(requiredPlan) {
  const tiers = { free: 0, pro: 1, max: 2 };
  const userTier = tiers[state.user?.plan || 'free'];
  return userTier >= (tiers[requiredPlan] || 0);
}

// Usage examples:
if (_canAccess('pro'))  { /* show exam mode */ }
if (_canAccess('max'))  { /* show leaderboard */ }
```

## Gated Features (per P2-T013 tier matrix)
| Feature | Required Plan |
|---|---|
| Real Exam Mode | pro |
| Advanced progress analytics | pro |
| Offline mode | pro |
| Avatar upload | pro |
| Badges + milestones | pro |
| Leaderboard | max |
| AI weak-area packs | max |
| Multi-language | max |

## Locked UI Pattern
When a user hits a gated feature:
1. Show a lock icon (🔒) overlay on the feature card/button
2. On click: open upgrade prompt (P5-T005)
3. Never hard-block — always explain what they'd unlock

## Acceptance Criteria
- [ ] `user.plan` field added to user object (default: `'free'` on signup)
- [ ] `_canAccess(plan)` helper in `app.js`
- [ ] Gated UI elements show 🔒 for users below required tier
- [ ] Plan survives sign-out / sign-in (stored in Drive account record)
- [ ] `user.plan` updated correctly on Stripe success callback (from P5-T001)
- [ ] No gating on any Free-tier feature — core loop always fully open

## Dependencies
- P2-T013 (tier design must be finalized first)
- P1-T002 (auth — done)
- P5-T001 (Stripe sets `user.plan` after payment)

## Files to Touch
- `app/ui/app.js` — `_canAccess()` helper, gate checks per feature
- `app/ui/storage.js` — `user.plan` persisted in account record
- `app/ui/styles.css` — `.feature-locked` overlay styles
- `app/ui/index.html` — lock overlay on gated feature entry points
