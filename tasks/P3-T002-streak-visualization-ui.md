# Feature: Streak Visualization UI

**Priority:** P3 | **Type:** Functional | **Complexity:** S | **Status:** Pending

## Goal
Make the streak feel alive and emotionally rewarding. A number alone is not enough — users need to *feel* their progress.

## Acceptance Criteria
- [ ] Streak displayed as a flame icon + number on home screen header
- [ ] 7-day calendar strip shows filled/empty dots for each day this week
- [ ] Milestone celebrations: 3-day, 7-day, 30-day, 100-day streaks trigger a full-screen animation (confetti or pulse — pure CSS/JS, no library)
- [ ] "Streak restored" message if user had 0 streak yesterday but returns today
- [ ] Streak number animates (count-up) on home screen load
- [ ] Color intensity of flame increases at milestones (7d = orange, 30d = red, 100d = gold)

## Technical Notes
- 7-day strip: array of last 7 dates, compare to `lastActiveDate` history (store last 7 active dates)
- Milestone check on `init()` after streak update
- Count-up animation: pure JS `requestAnimationFrame` loop
- Confetti: 20–30 CSS-animated `<div>` particles, removed after 3 seconds

## Dependencies
- P3-T001 (streak tracking must exist)

## Files to Touch
- `app/ui/index.html` — streak display + 7-day strip
- `app/ui/styles.css` — flame styles, calendar strip, milestone animation
- `app/ui/app.js` — milestone detection, count-up animation
