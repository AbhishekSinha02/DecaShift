# E-004: Daily Completion Ritual + Kind Streak-Freeze

**Priority:** P1 (Ritual) | **Force:** Ritual | **Type:** UI+JS | **Complexity:** M | **Status:** Pending
**Session:** E2 · **Depends on:** E-003 (uses `isDayComplete`) · **Relates to:** D-006 streak rewards

## Goal
Close the daily loop with a **celebrated finish** the kid wants to reach — and remove the streak's
punishing edge with a **kind freeze** so a single missed day doesn't erase weeks of effort (the #1
reason streaks die and users churn). Aligns with the standing rule: *failure should feel like a
strategic reset, not an endpoint.*

## Why
A loop without a satisfying *end* doesn't form a habit — the brain craves closure. And loss-aversion
only motivates if the loss feels *fair*. Duolingo's streak freeze is why their streaks survive; ours
currently breaks hard on one miss.

## What to build
1. **Completion ritual** (fires when E-003's quest hits all-complete for the day):
   - A short, full-screen-ish celebration: streak +1 animation, "Day X complete," day's XP earned
     (from E-005 if shipped; otherwise score), and a single warm line of encouragement.
   - One tap to dismiss → returns to a "you're done for today, see you tomorrow" calm home state.
   - Plays **once per day** (store `lastRitualDate`).
2. **Streak freeze (kind)**:
   - Earn freezes by consistency (e.g. 1 freeze per 7-day streak, cap 2 banked).
   - A missed day auto-consumes a freeze instead of resetting; show `"Streak saved — freeze used"` on
     next open (never punishing language).
   - If no freeze available, the streak resets **without shaming** — show a comeback CTA (reuse D-006
     comeback state), not a failure screen.
3. Surface banked freezes subtly in the streak bar (`🛡 1`).

## Acceptance Criteria
- [ ] Finishing the day's quest triggers a one-time celebration with streak + reward
- [ ] Ritual plays at most once per local day
- [ ] Missing a day with a freeze banked: streak preserved, gentle "freeze used" note, freeze decremented
- [ ] Missing a day with no freeze: streak resets with an encouraging comeback CTA, never blame
- [ ] Freezes are earned by streak milestones and capped; count shown in streak bar
- [ ] No remote call; correct across reload and incognito quirks (see BUG-002/006 lessons)

## Technical Notes
- Extend `storage.js` streak logic: `updateStreak()` already exists — add freeze accounting there so
  all callers (`app-quiz.js:325`, `app-drill.js:234`) get consistent behavior. Store `freezes`,
  `lastActiveDate`, `lastRitualDate` in the streak object.
- Ritual UI: reuse the badge/celebration modal pattern; trigger from `_renderHome` when
  `isDayComplete()` is true and `lastRitualDate !== today`.
- Animations: CSS transform/opacity only; respect `prefers-reduced-motion` (skip to static state).

## Files to Touch
- `app/ui/js/storage.js` — freeze accounting in `updateStreak`, expose `getFreezes`
- `app/ui/js/app-home.js` — fire ritual when day completes; render freeze count
- `app/ui/screens/screen-home.html` — ritual overlay markup
- `app/ui/css/styles-app.css` — ritual celebration + freeze chip styles

## Definition of Done
The day ends on a high the kid wants to repeat, and one missed day no longer wipes the streak.
Ship the freeze logic and the ritual as two commits.
