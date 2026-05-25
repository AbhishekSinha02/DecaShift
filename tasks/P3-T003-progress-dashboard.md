# Feature: User Progress Dashboard

**Priority:** P3 | **Type:** Functional + Technical | **Complexity:** M | **Status:** Pending

## Goal
Give users a clear, motivating picture of their growth over time — accuracy trends, goals completed, time invested. Make progress visible so users feel momentum.

## Sections
1. **Summary bar** — Total questions answered, total time, goals completed
2. **Accuracy trend** — Simple sparkline per goal (last 7 sessions)
3. **Goal-by-goal breakdown** — Best score, last score, attempts
4. **Time of day heatmap** — When the user typically practices (encourages habit formation)
5. **Confidence score** — Derived from accuracy trend direction (rising = confident)

## Acceptance Criteria
- [ ] Dashboard accessible from home screen (dedicated screen or slide-in panel)
- [ ] All charts drawn with pure Canvas API or SVG — no charting library
- [ ] Data computed entirely from `decashift_sessions` localStorage array
- [ ] Empty state: "Complete your first session to see your progress" 
- [ ] Mobile-friendly: stats stack vertically, sparklines fit in card width
- [ ] "You're improving" message when last 3 sessions trend upward in accuracy

## Technical Notes
- Sparkline: 60px tall SVG `<polyline>` — fully custom, ~30 lines of JS
- Confidence score: `(latest_accuracy - avg_of_prev_5) / avg_of_prev_5` — positive = improving
- Heatmap: 24-bucket array of session start hours from all sessions

## Dependencies
- P1-T004 (needs session history)
- P3-T001 (streak data feeds into dashboard)

## Files to Touch
- `app/ui/index.html` — dashboard screen section
- `app/ui/app.js` — dashboard render functions, sparkline, heatmap
- `app/ui/styles.css` — dashboard layout
