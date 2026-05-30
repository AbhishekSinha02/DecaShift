# P3-T017 — Weekly Question Sets (Date-Gated)

**Priority:** P3 — Engagement & Retention  
**Complexity:** M (2–3 days, 3–4 files: app.js, styles.css, new weekly/ folder, manifest)  
**Status:** Pending

---

## Problem

All question sets are always available at once. There is no reason for a student to come back on a specific day — everything is already accessible. A weekly set that unlocks on Monday and runs through Sunday creates a reason to return each week and builds a "what's new this week?" habit.

---

## Goal

Publish one set of 5 questions per week, per subject (or mixed). The current week's set is prominently featured on the home screen. Past weeks remain accessible but are visually marked as completed. Future weeks are hidden until their start date.

---

## Folder Structure

```
questions/
  weekly/
    2026-W22.json     ← May 25–31 (current week)
    2026-W23.json     ← Jun 1–7
    2026-W24.json     ← Jun 8–14
    ...
```

Each file uses ISO week number (`YYYY-Www`) as the filename and goalId.

---

## JSON Schema

```json
{
  "goalId": "weekly-2026-W22",
  "weekStart": "2026-05-25",
  "weekEnd":   "2026-05-31",
  "title":     "Weekly Challenge — May 26–29",
  "description": "This week: Maths + Science mix for all grades",
  "category":  "school",
  "grade":     null,
  "subject":   "weekly",
  "level":     1,
  "questions": [...]
}
```

`grade: null` means the set is shown to all school users regardless of grade. Questions inside should be labelled by grade level in the explanation so students understand which level they are.

---

## Home Screen UI

Add a **"This Week"** section above the subject tabs:

```
┌─────────────────────────────────────────────────────┐
│  🗓 Weekly Challenge — May 26–29                      │
│  5 questions · Mixed grades · Unlocks every Monday   │
│                                              [Start] │
└─────────────────────────────────────────────────────┘
```

- Only shows the **current** week's card (determined by `new Date()` vs `weekStart`/`weekEnd`)
- If the week hasn't started yet: card is hidden
- If the week has passed: it moves to a "Past Weeks" collapsible (same pattern as archived goals)
- Badge: "NEW" for first 2 days of the week

---

## Data Flow

**Detecting current week:**
```js
function _getCurrentISOWeek() {
  const now = new Date();
  // Returns { year, week } using ISO 8601 week numbering
}

function _isWeekActive(weekStart, weekEnd) {
  const today = new Date().toISOString().slice(0, 10);
  return today >= weekStart && today <= weekEnd;
}
```

**Loading in manifest:**
Add weekly files to manifest with `"subject": "weekly"`. The `_loadQuestionsForUser` function already loads all manifest entries — weekly files load automatically. No JS changes needed for loading.

**Filtering in `_renderHome`:**
- Separate weekly goals from regular goals
- Render weekly card in its own section above subject tabs
- Skip weekly goals from the regular subject-filtered list

---

## Content Plan

| Week | Dates | Theme |
|---|---|---|
| W22 | May 25–31 | Gr 3–4 Math + Science mix |
| W23 | Jun 1–7 | Gr 4–5 Hindi + French mix |
| W24 | Jun 8–14 | Gr 5–6 Science + Math mix |
| W25 | Jun 15–21 | Gr 3–6 General Knowledge |
| W26 | Jun 22–28 | Gr 3–4 Hindi + Science |

Each week: 5 questions, mixed subjects/grades, one fun/general knowledge question at the end.

---

## Acceptance Criteria

- [ ] Weekly folder exists with at least 4 weeks of content pre-loaded
- [ ] Home screen shows "This Week" card only during the active date range
- [ ] Card is hidden before `weekStart` and after `weekEnd`
- [ ] Past weeks visible under "Past Weeks" collapsible (like archived goals)
- [ ] "NEW" badge visible for first 2 days of each week
- [ ] Weekly sets excluded from Math/Science/Hindi/French subject tab filters
- [ ] Works for all school grades (grade: null = show to all)
- [ ] Past week sessions count toward streak and accuracy stats

---

## Dependencies

- Depends on P2-T021 (subject tabs — done): weekly section sits above the tabs
- Depends on P1-T013 (manifest-driven — done): weekly files auto-load via manifest
- P3-T001 (streak — done): weekly sessions should count toward streak
