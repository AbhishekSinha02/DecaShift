# Feature: Confidence + Consistency Score Tracking

**Priority:** P3 | **Type:** Technical | **Complexity:** S | **Status:** Pending

## Goal
Show users a single "Confidence Score" per goal that tells them how much they've grown — not just current accuracy, but trajectory. Makes improvement visible and keeps users coming back.

## How Scores Work

**Confidence Score (0–100):**
- Based on accuracy trend over last 5 sessions for a goal
- Rising trend → score increases; falling trend → score decreases
- First session: raw accuracy × 100

**Consistency Score (0–100):**
- % of days in last 30 days with at least 1 session
- 30/30 days = 100, 15/30 = 50

## Acceptance Criteria
- [ ] Confidence score shown on each goal card on home screen
- [ ] Consistency score shown on the dashboard / profile
- [ ] Score changes are animated when home screen loads (shows delta from last visit)
- [ ] "Your confidence in Azure AKS is rising!" message when score increases >10 points
- [ ] Scores computed locally from session history — no server call
- [ ] Score history stored (last 10 values) to enable trend arrows (↑↓→)

## Technical Notes
- `computeConfidence(sessions, goalId)` — pure function
- `computeConsistency(sessions, days=30)` — pure function
- Store `user.scores: { [goalId]: number[] }` (ring buffer of last 10)

## Dependencies
- P1-T004 (session history)

## Files to Touch
- New: `app/ui/scores.js` — confidence + consistency computation
- `app/ui/app.js` — call on home render
- `app/ui/index.html` — score display on goal cards
