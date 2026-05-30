# P2-T041 — App-Wide Vocabulary: Replace "Streak" with Relatable Word

**Priority:** P2 | **Complexity:** S | **Status:** Pending — word decision required first

## Goal

"Streak" is a gaming word. It creates anxiety (fear of breaking it) more than motivation.
Replace it with a word that feels like personal growth, not a game mechanic.
The word must work for a 9-year-old Grade 4 student AND a parent reading over their shoulder.

## Word Options (decide before implementing)

| Word | "7-day ___" | "Keep your ___ going" | Feel |
|---|---|---|---|
| **Run** | 7-day run ✓ | Keep your run going ✓ | Sporty, movement, clean |
| **Habit** | 7-day habit ✓ | Keep your habit going — odd | Parent-friendly, behavioral |
| **Flow** | 7-day flow ✓ | Keep your flow going ✓ | Creative, smooth, Duolingo-like |
| **Practice run** | 7-day practice run — long | — | Clear but clunky |
| **Days** | 7 days in a row ✓ | Don't break your days — odd | Simple but weak |

**Recommendation: "Run"** — "7-day run", "Keep your run going", "Your best run: 14 days". Short, sporty, universally understood, not anxiety-inducing, works in all grade contexts.

**Decision needed from user before this task runs.**

## Scope of Change

Every occurrence of "streak" across the codebase:

### JS files
- `app/ui/js/app-home.js` — `_checkStreakMilestone()`, `_MILESTONES`, streak display logic
- `app/ui/js/app-quiz.js` — `Storage.updateStreak()` calls, result screen
- `app/ui/js/app-drill.js` — drill streak logic
- `app/ui/js/app-core.js` — `_shareStreak()`, milestone modal text
- `app/ui/js/storage.js` — `updateStreak()`, `loadStreak()`, `saveStreak()` (internal function names can stay, only user-visible strings change)

### HTML files
- `app/ui/screens/screen-home.html` — streak bar text ("🔥 days", "Best: Xd")
- `app/ui/screens/screen-result.html` — result screen streak mention
- `app/ui/screens/screen-landing.html` — all streak mentions

### CSS classes
- No CSS class renames needed — `.streak-*` classes are fine internally
- Only user-visible text strings change

### Milestone messages (app-home.js `_MILESTONES`)
Current:
```js
7:  { emoji: '⚡', title: '7-Day Streak!', sub: "A full week. You've shown up every single day." }
```
New (if "Run"):
```js
7:  { emoji: '⚡', title: '7-Day Run!', sub: "A full week. You showed up every single day." }
```

### Share text
Current: "My 14-day streak on Donnibo!"
New: "14 days in a row on Donnibo! 🔥"

## Implementation Rule
- Internal function names (`updateStreak`, `loadStreak`, localStorage keys `decashift_streak`) stay unchanged — no risk of breaking data
- Only user-visible strings change
- Global find/replace with review — do not change CSS class names or JS function names

## Files
All JS + HTML files in `app/ui/` — text-only changes, no logic changes

## Success Criteria
- [ ] Word decision confirmed by user
- [ ] Zero occurrences of "streak" visible to users in app UI
- [ ] "Streak" still used in internal function/variable names (no breakage)
- [ ] Milestone titles updated
- [ ] Share text updated
- [ ] Landing page updated
