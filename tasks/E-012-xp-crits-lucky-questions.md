# E-012: XP Crits & Lucky Questions

**Priority:** P1 (Reward) | **Force:** Reward | **Type:** JS+UI | **Complexity:** S | **Status:** Pending
**Session:** E5 · **Depends on:** E-005 (XP), E-008 (feedback) · Cheapest variable-reward win

## Goal
Add surprise to the per-question grind: one random question per set is a **Lucky Question** worth
**2× XP**. A small, cheap mechanic that makes every set unpredictable — you might be one tap from a
big XP pop.

## Why
Fixed XP per question is predictable; predictability kills the variable-reward pull. A lucky-question
crit costs almost nothing to build and makes the moment-to-moment loop spicier.

## What to build
1. **Pick the lucky question**: when a set starts, mark one random index in `state.filteredQuestions`
   as lucky (`state.luckyIndex`). Show a subtle ✨ "2× XP" tag on that question when it loads (before
   answering — anticipation).
2. **Crit payout**: answering the lucky question correctly awards **2× the correct-answer XP** and fires
   a distinct celebration — `Feedback.hit('reward')` + a small confetti pop + a "✨ Lucky! +20 XP" flash.
3. **Honest odds**: exactly one lucky question per set (not random per-question rolls) so it's fair and
   always present — kids learn to hunt for it.
4. Feed the crit into the session XP so the result "+XP" total already includes it.

## Acceptance Criteria
- [ ] Each set has exactly one lucky question, marked with a ✨/2× tag on load
- [ ] Correct on the lucky question awards double correct-XP and a distinct celebration
- [ ] Wrong on the lucky question = normal attempt XP (no penalty, no crit)
- [ ] The result-screen "+XP" total includes the crit bonus (no separate accounting drift)
- [ ] Drills excluded (or get their own simple variant) — keep scope to quiz sets first
- [ ] Reduced-motion / muted: crit still awards XP, just no confetti/sound

## Technical Notes
- Set `state.luckyIndex = Math.floor(Math.random() * n)` in the set-start path (`selectGoal`/`startGoal`
  → wherever `state.filteredQuestions` is finalized).
- In `_renderQuestion`, if `state.currentIndex === state.luckyIndex`, render the ✨ tag.
- XP: today `XP.awardSession` sums `correct:10` per right answer. Add a per-response `lucky` flag in
  `state.responses`, and have `awardSession` add an extra `XP_RULES.correct` for any lucky+correct
  response (keep the rule in `xp.js`). Update `submitAnswer` to set the flag and fire the crit feedback.

## Files to Touch
- `app/ui/js/app-quiz.js` — pick lucky index on start, ✨ tag in `_renderQuestion`, crit in `submitAnswer`
- `app/ui/js/xp.js` — `awardSession` honors the lucky flag (rule stays here)
- `app/ui/css/styles-app.css` — lucky tag + crit flash

## Definition of Done
Sets now have a hidden jackpot question; landing it feels great. One small commit — engine flag + tag +
crit feedback together (it's S and atomic).
