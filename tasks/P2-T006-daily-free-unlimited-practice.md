# Feature: Daily Free Unlimited Practice Mode

**Priority:** P2 | **Type:** Functional | **Complexity:** S | **Status:** Pending

## Goal
Free users can practice unlimited questions every day. No paywalls, no question limits. Practice mode is the core engagement loop.

## Context
The free tier must be genuinely valuable — not a crippled demo. Paid tier adds real exam simulation and leaderboards, not more practice questions.

## Acceptance Criteria
- [ ] Free users can start any goal and answer unlimited questions with no restrictions
- [ ] Questions cycle/repeat if the bank is exhausted (with a "You've completed this set!" message before cycling)
- [ ] No login required to try the app (guest mode allowed for first 5 questions, then prompt to sign up)
- [ ] No "upgrade to continue" interruptions during practice mode
- [ ] Practice sessions are distinct from "Exam mode" in UI and storage (different badge/label)
- [ ] Daily practice count shown on home screen ("You've answered 12 questions today")

## Technical Notes
- Practice mode question cycling: shuffle questions array, repeat on exhaustion
- Guest mode: allow 5 questions using temporary `guest_` userId in localStorage, then show sign-up prompt (not a wall — a gentle invitation)
- Tag session records with `mode: 'practice' | 'exam'`

## Dependencies
- P1-T004 (session persistence)

## Files to Touch
- `app/ui/app.js` — practice mode cycling logic, guest mode guard
- `app/ui/storage.js` — daily question count tracking
- `app/ui/index.html` — daily count display on home
