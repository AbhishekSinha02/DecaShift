# Design: Subscription Tier Definition — Free / Pro / Max

**Priority:** P2 | **Type:** Product Design | **Complexity:** S | **Status:** Pending

## Goal
Define the feature matrix across all subscription tiers BEFORE building any
gating or payment code. This is a product design task — the output is a decision,
not code. Getting this wrong shapes the entire monetization strategy.

## Proposed Tier Structure

### Free (Always Free — No Credit Card)
Core loop must remain completely free. Users should be able to use the app
daily without ever hitting a paywall on the learning experience.

| Feature | Free |
|---|---|
| Daily practice (unlimited questions) | ✅ |
| All grade / subject goals | ✅ |
| Per-question timer (on/off) | ✅ |
| Instant answer feedback + explanation | ✅ |
| Session results summary | ✅ |
| Streak tracking | ✅ |
| Progress dashboard (basic) | ✅ |
| Dark / light mode | ✅ |
| Cross-device login (Drive sync) | ✅ |

### Pro (₹199/month or ₹1499/year)
For serious learners who want depth, analytics, and focus tools.

| Feature | Pro |
|---|---|
| Everything in Free | ✅ |
| Real Exam Mode (timed, no mid-feedback) | ✅ |
| Advanced progress dashboard (accuracy trends, weak topics) | ✅ |
| Offline mode (Service Worker) | ✅ |
| Avatar + profile photo | ✅ |
| Badges + milestone celebrations | ✅ |
| Priority access to new question sets | ✅ |
| Pro badge on profile | ✅ |

### Max (₹499/month or ₹3999/year)
For competitive learners, toppers, and professionals in fast-moving domains.

| Feature | Max |
|---|---|
| Everything in Pro | ✅ |
| Leaderboard access (weekly + all-time) | ✅ |
| Confidence + consistency score per goal | ✅ |
| AI-generated weak-area question packs | ✅ |
| Multi-language UI + translated questions | ✅ |
| Early access to beta features | ✅ |
| Priority support | ✅ |

## Open Questions (Decide Before P5 Work Begins)
1. Should Exam Mode be Pro or Max? (affects upgrade conversion)
2. Should Leaderboard be Pro or Max? (network effects argue for lower tier)
3. Is the monthly price right for India (₹199) vs global ($2.99)?
4. Trial period: 7-day free Pro trial on signup or none?
5. Family/group plan for schools and institutes?

## Output Required
A finalized tier matrix checked into `PRICING.md` before P5-T004 begins.

## Dependencies
- None (design decision only)
- Informs: P5-T004 (feature gate system), P5-T001 (Stripe), P5-T002 (exam mode)

## Files to Touch
- New: `PRICING.md` — finalized tier matrix (decision artifact)
