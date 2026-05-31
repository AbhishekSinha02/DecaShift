# Feature: Daily Practice Streak

## Overview
Tracks consecutive days of any practice activity. A flame icon + count is shown in the header. Streaks create daily return habit. Streak Freeze protects against breaking a streak on missed days (max 2 freezes stored at a time). Streaks are visible on Home, the header, and the Journey screen.

---

## User Flows

### Flow 1: Building a Streak

**Entry point:** User completes any practice session (quiz, drill, or GK).

1. Session is saved to localStorage
2. Streak engine checks: did the user practice yesterday?
   - **Yes**: streak increments by 1 (e.g., 5 → 6)
   - **No, but today is the first practice**: streak starts at 1
   - **No, missed yesterday**: streak resets to 1 (unless a freeze is used — see Flow 3)
3. **Header updates**: flame 🔥 + new count
4. **Home streak bar** re-renders to show the updated value

---

### Flow 2: Viewing Streak Information

**Entry point:** Home screen, header, or Journey screen.

1. **Header row** shows: 🔥 14 (current streak count)
2. **Journey screen** shows:
   - Current streak with flame icon
   - Longest streak ever
   - Number of streak freezes remaining (e.g., "❄ 2 freezes")
   - Last 7 days mini-calendar (dots: filled = practiced, empty = missed, blue = frozen)

---

### Flow 3: Using a Streak Freeze

**Scenario:** User missed yesterday's practice but has a freeze available.

1. Streak engine detects a gap of exactly 1 day
2. If `streakFreezes > 0`:
   - One freeze is consumed (`streakFreezes -= 1`)
   - The missed day is marked as "frozen" in the streak record
   - Streak count is **preserved** (not reset)
   - User sees: "❄ Streak saved by a freeze!"
3. If no freezes available:
   - Streak resets to 1
   - (Future: re-engagement nudge will prompt user to buy a freeze — Feature E-014)

---

### Flow 4: Earning More Streak Freezes

Streak freezes are earned through the Mystery Box reward system (Feature 11):
- Mystery Box can drop a freeze as a reward
- Maximum of 2 freezes can be held at any time
- If the box rolls a freeze and user already has 2: XP is awarded instead (no wasted reward)

---

### Flow 5: Streak on the Home Screen

1. The **Streak Bar** renders as a horizontal row at the bottom of the Home screen (or near the header)
2. Shows: 🔥 N days (where N = current streak)
3. If streak is 0 (no practice yet today): shows "Start your streak today"
4. If daily quest is complete: streak bar has a gold/highlight state

---

## Streak Reset Rules

| Scenario | Result |
|---|---|
| Practiced today | Streak maintained |
| Practiced yesterday + today | Streak +1 |
| Missed yesterday, freeze available | Streak preserved, freeze used |
| Missed yesterday, no freeze | Streak resets to 1 |
| Missed 2+ days | Streak resets to 1 (freezes only cover 1-day gaps) |

---

## Storage Schema

Stored in localStorage under `decashift_streak`:

```json
{
  "current": 14,
  "longest": 21,
  "lastPracticeDate": "2026-05-31",
  "freezes": 1,
  "frozenDates": ["2026-05-28"]
}
```

---

## Streak Word Note

The word "streak" is used in all internal function names (`updateStreak`, `loadStreak`, etc.). In the user-facing UI, the phrase is **"Daily Practice"** — e.g., "14 days of daily practice" — not the word "streak." This was a deliberate product decision.

---

## Screens Involved
- `app/ui/js/storage.js` — `loadStreak()`, `saveStreak()`, streak calculation
- `app/ui/js/app-home.js` — `_renderStreakBar()`
- `app/ui/js/app-core.js` — header meta row with streak count
- `app/ui/js/app-journey.js` — streak section on Journey screen
- `app/ui/js/collectibles.js` — freeze reward from mystery box
