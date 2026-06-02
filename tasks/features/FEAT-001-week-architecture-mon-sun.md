---
id: FEAT-001
status: PENDING
priority: High
title: Week Architecture — Mon–Sun, Saturday Exam Day, Sunday Catch-up
supersedes: BUG-019 (weekend empty state — no longer relevant once weekends have content)
---

## Summary

Redefine the app week as **Monday → Sunday** (not Mon–Fri).

| Day | Role |
|---|---|
| Mon – Fri | Daily subject content (existing 5-set structure) |
| Saturday | **Exam Day** — weekly cumulative test covering all 5 days |
| Sunday | **Catch-up Day** — surface any incomplete sets from Mon–Sat |

---

## Saturday — Exam Day

### What the user sees
- A single "Weekly Exam" card on the home screen (per subject)
- The card shows the week's topic range (e.g. "Fractions · Algebra · Patterns · Measurement · Word Problems")
- Completing it awards bonus XP and a weekly badge

### Content model
Two approaches (decide before building):

**Option A — Dedicated exam JSON files** (preferred for content control)
- New files: `grade-5/math-w23-sat.json` with `weekDay: 'sat'`, `examType: 'weekly'`
- 10–15 questions sampled across the 5 concepts from Mon–Fri
- Written by content team, same format as daily files

**Option B — Dynamic sampling** (zero content work, lower quality)
- At runtime, pick 2–3 random questions from each Mon–Fri set for the week
- No new files needed; lower control over question quality and difficulty curve

**Recommendation:** Option A. The exam is a premium differentiator — random sampling produces low-quality tests.

### Home screen changes
- `_buildWeekRow` / `_renderNetflixRows`: treat `weekDay === 'sat'` as an exam card, not a daily card
- Exam card gets a distinct visual: gold border, "📝 Exam" badge, locked until Friday is done (optional gate)
- `_weekRangeStr`: change Mon–Fri display to **Mon–Sun**

---

## Sunday — Catch-up Day

### What the user sees
- Section header: "Catch Up — This Week"
- Cards for every Mon–Sat set the user did NOT complete (no session found for that goalId)
- If all sets are done: celebratory empty state ("Perfect week! 🏆 New content loads Monday.")

### Implementation
- **No new content files needed** — purely derived from existing Mon–Sat goals + session history
- In `_renderNetflixRows`, when `todayDay === 'sun'`:
  - Collect all goals for `weekNum === currentWeek` and `weekDay` in `['mon','tue','wed','thu','fri','sat']`
  - Filter to goals where `Storage.getLastSessionForGoal(g.id)` is null/undefined
  - Render as a flat shelf labelled "Catch Up"
- If none incomplete → show perfect week message

---

## Greeting / hero copy changes

| Day | Greeting line 2 |
|---|---|
| Saturday | `"It's Exam Day. Test yourself on this week's topics."` |
| Sunday | `"It's Catch-up Day. Finish what you started this week."` |
| Sunday (all done) | `"Perfect week! New content loads tomorrow."` |

Replace the current `[0, 6].includes(new Date().getDay())` weekend branch in `_renderGreeting` and `_buildDailyQuestCard`.

---

## Files to touch

| File | Change |
|---|---|
| `app/ui/js/app-home.js` | `_renderNetflixRows`, `_renderGreeting`, `_buildDailyQuestCard`, `_weekRangeStr`, `_questSetGoal` |
| `app/ui/js/app-core.js` | Ensure `weekDay: 'sat'` and `weekDay: 'sun'` are loaded correctly (currently `_DAY_ORDER` only has mon–fri) |
| Content files | New `*-sat.json` exam files per grade/subject (separate content session) |

### `_DAY_ORDER` fix needed
```js
// Current — sun and sat both missing or fallback to 0
const _DAY_ORDER = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4 };

// Required
const _DAY_ORDER = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 };
```

---

## Acceptance

- Saturday: exam card appears, labelled "Weekly Exam", shows topic summary
- Saturday: `_weekRangeStr` shows Mon 2 Jun – Sun 8 Jun (not Mon–Fri)
- Sunday: incomplete Mon–Sat sets shown under "Catch Up"
- Sunday (all done): perfect week empty state shown
- Mon–Fri: no change to existing behaviour
- BUG-019 (weekend empty-state copy) is moot — weekends are never empty

---

## Effort estimate

| Part | Est. |
|---|---|
| Code changes (home + core) | 1 session |
| Saturday exam content files (per grade per subject) | 1 content session per grade |
