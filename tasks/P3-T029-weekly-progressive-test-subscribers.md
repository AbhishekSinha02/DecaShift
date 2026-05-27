# Feature: Weekly Progressive Test for Subscribers

**Priority:** P3 | **Type:** Subscription / Engagement | **Complexity:** M | **Status:** Pending

## Goal
Each week, subscribers get a structured engagement arc: 2 easy sets to build confidence,
2 medium sets to extend, 1 hard set as a challenge, then a cumulative Weekly Exam that
tests everything covered. Free users see the exam card locked — not hidden — so they
know it exists and feel the pull to upgrade.

## Why This Matters
A free user doing 2 sets/week has no narrative. A subscriber has a story each week:
warm up → build → challenge → test yourself. This arc drives daily return visits and
makes the weekly exam feel earned. It's the single most powerful engagement mechanic
after streaks.

## Weekly Arc Structure
```
Mon — Set 1 (Easy)        ✅ Free
Tue — Set 2 (Easy)        ✅ Free
Wed — Set 3 (Medium)      🔒 Pro
Thu — Set 4 (Medium)      🔒 Pro
Fri — Set 5 (Hard)        🔒 Pro
─────────────────────────────────
     Weekly Exam          🔒 Pro  ← new, this task
```

## Weekly Exam Design

### Composition
- 10–15 questions drawn from the week's 5 sets (2–3 per set)
- Difficulty mix: 30% easy, 40% medium, 30% hard
- No repeated questions from the same session (if user already did a set that week)
- Questions sampled at exam-load time from the week's question files — no separate exam file needed

### Exam Mode UX
- Exam mode: no mid-answer feedback (correct/wrong shown only at the end)
- Timer always on (cannot be turned off during exam)
- Result screen shows: score, accuracy per difficulty band, time per question
- "Retake Exam" allowed unlimited times — score for the week is the best attempt

### Home Screen Card
- Appears below the 5 practice sets as "📝 Week W21 Exam"
- Shows lock badge for free users with "Upgrade to take the Weekly Exam"
- After completion: shows best score badge on the card
- Card is only visible in the current week and the previous week (2-week window)

### Unlock Condition
- Subscriber can take the exam at any time (doesn't require completing all 5 sets first)
- Recommended flow shown as a progress bar: `Sets 1–5 → Exam` with check marks

## Difficulty Ramp Rule (for Admin Configuration)
The 2-2-1 ramp is the default. Admin can adjust via P4-T007:
- Ratio: easy:medium:hard = 2:2:1 (default)
- Exam mix: 30/40/30 (default)
- These are per-subject; Math may be 2:2:1 while Hindi stays 3:2:0

## Acceptance Criteria
- [ ] Weekly exam card appears below 5 sets on home screen
- [ ] Free users: exam card shows lock badge + upgrade CTA (not hidden)
- [ ] Exam mode: no mid-question feedback
- [ ] Exam result shows accuracy per difficulty band
- [ ] Exam questions sampled from that week's files (no separate exam file required)
- [ ] "Best score" badge persists on the exam card after completion
- [ ] Retake allowed; only best score is shown
- [ ] 2-week window: current week + last week exams visible

## Files to Touch
- `app/ui/app.js` — exam goal type detection, `startGoal()` exam mode flag, result screen exam variant
- `app/ui/styles.css` — exam card badge, progress arc `Sets 1–5 → Exam`
- `app/google-apps-script/Code.gs` — save exam sessions with `sessionType: 'exam'` flag
- No new question files needed — exam draws from existing week files

## Dependencies
- P3-T028 (weekly set gating — must ship first; provides plan-check + difficultyRank)
- P3-T017 (weekly sets — done; exam samples from these)
- P2-T013 (subscription strategy — exam is a Pro benefit)
- P4-T007 (admin pattern config — admin adjusts difficulty ramp and exam mix)
