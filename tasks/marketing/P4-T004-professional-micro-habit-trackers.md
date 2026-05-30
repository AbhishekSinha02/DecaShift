# P4-T004 — Professional Micro-Habit Trackers (Health, Finance, Wellness, Learning)

**Priority:** P4 — Power Features
**Complexity:** L (3–5 days)
**Status:** Pending

---

## Goal

Transform DecaShift from a quiz app into a **daily life skills OS for professionals**.
Add four lightweight micro-habit tracker modules accessible from the home screen.
Each tracker takes < 60 seconds per day, persists locally, shows weekly trends,
and contributes to a combined streak — giving professionals a reason to open the
app every day even when they don't want to do a quiz.

This is the single strongest differentiator vs. Khan Academy, Duolingo, and all
quiz-only competitors. None of them track life goals alongside learning goals.

---

## Four Modules

### 1. Health Tracker
Daily check-in: Steps (numeric or slider), Water glasses (0–10), Sleep hours (0–12), Workout (yes/no)
- Weekly bar chart: steps trend, hydration trend
- Streak: consecutive days logged
- Goal: user sets personal target per metric (e.g., "8,000 steps/day")

### 2. Finance Tracker
Daily check-in: Did you stick to your daily budget? (yes/no), Amount spent (optional numeric), Savings deposit today (yes/no)
- Weekly summary: days on-budget / 7
- Monthly savings streak
- Goal: user sets monthly budget + savings target

### 3. Wellness Tracker
Daily check-in: Mood (1–5 emoji scale: 😞😕😐🙂😄), Stress level (1–5), Gratitude note (optional free text, 1 sentence)
- Weekly mood chart
- "Your best week" vs. current week comparison
- Export weekly wellness log as JSON

### 4. Learning Tracker (beyond quizzes)
Daily check-in: Study minutes (numeric), Topics/chapters completed (numeric), External resource used (yes/no — e.g., YouTube, book, article)
- Complements quiz sessions — total learning time = quiz time + manual log
- Weekly learning time chart
- Running total: "You've invested X hours in learning this month"

---

## UI Structure

```
Home screen (professional users):
  ┌─────────────────────────────────┐
  │  📊 Daily Check-in              │  ← collapsed card, expands inline
  │  Health · Finance · Wellness    │
  │  Learning · [Log Today →]       │
  └─────────────────────────────────┘
```

- Single "Daily Check-in" card on home screen, collapsed by default
- Tapping expands a 4-tab interface (Health / Finance / Wellness / Learning)
- Quick-entry: each tab fits in one screen, no scrolling
- After logging: card shows today's summary (✅ Health logged · 😊 Mood: Good)
- "View Trends" link → full tracker screen (new screen: `screen-trackers`)

---

## Data Schema

```js
// localStorage key: decashift_trackers
{
  "userId": "...",
  "entries": [
    {
      "date": "2026-05-26",
      "health":   { "steps": 8200, "water": 6, "sleep": 7.5, "workout": true },
      "finance":  { "onBudget": true, "spent": 450, "savedToday": true },
      "wellness": { "mood": 4, "stress": 2, "gratitude": "Had a good morning walk" },
      "learning": { "studyMinutes": 45, "topicsCompleted": 2, "usedExternalResource": true }
    }
  ]
}
```

---

## Acceptance Criteria
- [ ] Daily Check-in card visible on home screen for professional users (hidden for school users)
- [ ] Each of 4 modules: data entry form + save + today's summary shown
- [ ] Streak: consecutive days with at least 1 module logged (separate from quiz streak)
- [ ] Weekly trend view: at minimum a simple text summary ("5/7 days on budget this week")
- [ ] Data persists in localStorage under `decashift_trackers`
- [ ] Drive sync: tracker entries synced alongside session data
- [ ] No tracker data lost when user changes profile (userId-keyed)
- [ ] School users: feature completely hidden — no UI elements visible

---

## Why This Is the Killer Feature

Khan Academy: quizzes and lessons only.
Duolingo: language only.
Notion: general, no habit loop, no streaks.
Habitica: gamified habits but no learning content.
**DecaShift with trackers: daily habit system + professional learning content in one app.**

A DevOps engineer can open DecaShift every morning to: (1) log health/wellness (60s),
(2) answer 5 Azure questions (3 min), (3) see their streak and weekly trends.
No other app does all three. That's the answer to F2.

---

## Dependencies
- P1-T004 (session persistence — done)
- P3-T001 (streak tracking — done, pattern to follow)
- P2-T017 (profile page — pending, tracker data could surface there)
- Builds toward P6-T002 (peer comparison — trackers add shareable data)
