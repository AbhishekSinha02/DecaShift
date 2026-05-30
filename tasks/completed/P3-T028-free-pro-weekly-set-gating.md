# Feature: Free vs Pro Weekly Set Access Gating

**Priority:** P3 | **Type:** Subscription / UX | **Complexity:** S | **Status:** Pending

## Goal
Free users get 2 sets per week. Sets 3–5 are Pro-only. Locked sets are shown cleanly —
not disabled/greyed-out clutter — with a tasteful lock indicator that motivates
upgrade without blocking the screen.

## Why This Order
This is the first subscription-facing change to ship. It:
- Requires no payment system (stub `user.plan = 'free'` in localStorage)
- Touches only the home screen goal-card render — safe, contained
- Proves the gating pattern before P3-T029 (weekly test) and P3-T026 (topic filter) reuse it
- Can go live immediately; Stripe is wired in later via P5-T004

## Weekly Set Structure (Per Grade / Subject)
```
Set 1 — Easy      → Free ✅
Set 2 — Easy      → Free ✅
Set 3 — Medium    → Pro 🔒
Set 4 — Medium    → Pro 🔒
Set 5 — Hard      → Pro 🔒
Weekly Exam       → Pro 🔒  (added in P3-T029)
```

## UX Rules
- Free sets (1–2): normal goal cards, fully clickable
- Locked sets (3–5): card renders but has a `🔒 Pro` badge top-right, click opens upgrade prompt
- No visual degradation of the card (no opacity, no strikethrough, no greying out)
- Locked card CTA: single line inside card — "Unlock all 5 sets with Pro →"
- Sets are ordered by difficulty automatically (easy → medium → hard), never randomised

## Free Tier UX — What Not To Do
❌ Don't grey out or disable locked cards (cluttered, feels broken)
❌ Don't show a modal on every locked click (annoying)
❌ Don't hide locked sets entirely (user must see what they're missing)
✅ Show locked cards in the list, with a clean lock badge + one-line CTA
✅ One upgrade prompt screen (not modal) on first click of any locked set

## State / Data
- `user.plan` field: `'free'` | `'pro'` (default: `'free'`)
- Locked-set detection: check `goal.weekNum && goal.difficultyRank > 2`
  - `difficultyRank` is a new field on weekly goal objects: 1=easy, 2=easy, 3=medium, 4=medium, 5=hard
  - OR derive from goal's questions average difficulty (simpler — no schema change)
- Add `difficultyRank` to weekly goal manifest entries

## Incremental Ship Plan
1. Add `user.plan = 'free'` to new signup + existing users on next login
2. Add `difficultyRank` to weekly manifest entries (or compute from question `difficulty` field)
3. In `_renderHome()`: if `user.plan === 'free'` and goal is weekly and rank > 2 → render lock badge
4. Lock click → show upgrade screen (reuse P5-T005 upgrade prompt UI when it exists; stub for now)
5. Later: P5-T004 wires `user.plan` to real Stripe subscription status

## Acceptance Criteria
- [ ] Sets 1–2 fully accessible to free users
- [ ] Sets 3–5 show `🔒 Pro` badge, click opens upgrade prompt
- [ ] No greyed-out / disabled visual state on locked cards
- [ ] `user.plan` field added to user profile schema
- [ ] `difficultyRank` added to weekly goal manifest entries
- [ ] Existing free users unaffected (still see Sets 1–2)
- [ ] Test: grade 5 this week — Sets 1–2 open, Sets 3–5 locked

## Files to Touch
- `app/ui/app.js` — `_renderHome()` goal card render, locked-set detection
- `app/ui/styles.css` — `.goal-card-locked` badge style (minimal addition)
- `app/google-apps-script/Code.gs` — add `plan: 'free'` to new user creation
- `questions/` manifest files — add `difficultyRank` to weekly entries

## Dependencies
- P3-T017 (weekly sets — done, this gates them)
- P2-T013 (subscription strategy — defines free/pro tiers)
- P5-T004 (feature gate — wires real plan check; this task stubs it first)
- **Unblocks:** P3-T026 (topic filter gate reuses same plan-check pattern)
- **Unblocks:** P3-T029 (weekly exam — needs rank 1–5 + plan check already in place)
