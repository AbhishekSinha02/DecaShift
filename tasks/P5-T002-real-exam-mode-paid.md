# Feature: Real Exam Mode (Paid Tier)

**Priority:** P5 | **Type:** Functional | **Complexity:** M | **Status:** Pending

## Goal
Simulate a real exam experience — countdown timer, no feedback mid-exam, single submission at the end. Makes paid users feel they're getting serious exam preparation.

## Exam Mode vs Practice Mode

| Feature | Practice | Exam |
|---|---|---|
| Timer | Per question (up) | Total countdown (down) |
| Feedback after each Q | Yes | No |
| Can review/change answers | No | Yes (before submit) |
| Result detail | Full breakdown | Score + time only |
| Stored as | `mode: 'practice'` | `mode: 'exam'` |

## Acceptance Criteria
- [ ] "Start Exam" button on goal card (only visible to Pro users)
- [ ] Free users see "Start Exam" but get upgrade prompt on click
- [ ] Exam has a configurable total time limit (e.g., 10 questions × 60s = 10 min)
- [ ] Countdown timer shown prominently — turns red in last 20% of time
- [ ] All questions shown sequentially — answers selectable but no feedback shown
- [ ] "Review & Submit" screen shows all questions with selected answers before final submission
- [ ] Auto-submit if time runs out
- [ ] Result shown after submit — no per-question explanation revealed
- [ ] Exam sessions tagged `mode: 'exam'` in storage

## Dependencies
- P5-T001 (Stripe + plan check)
- P1-T008 (category/level filtering)

## Files to Touch
- `app/ui/app.js` — `startExam()`, exam state machine
- `app/ui/index.html` — exam mode UI (countdown, review screen)
- `app/ui/styles.css` — countdown urgency styles (red pulse)
