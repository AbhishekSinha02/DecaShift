# ENH-002 — Week Progress Calendar (Mon→Fri dots on home)

**Priority:** High (first 100 users engagement)
**Effort:** Small (~0.5 session)
**Audience:** Grade 2-8 (most impactful), also useful for all grades

## Why

Duolingo's activity calendar is one of its most psychologically effective retention tools. Seeing filled-in days creates a "don't break the chain" effect. Donnibo has the streak number but no visual representation of WHICH days this week have been done.

A Grade 5 student looking at the home screen should immediately see: "I did Mon and Tue, I still need Wed Thu Fri."

## What to build

A small visual strip above the "This Week" shelf row:

```
Mon  Tue  Wed  Thu  Fri
 ●    ●    ○    ○    ○
```

- Filled dot (●) with subject color = set done today or earlier this week
- Empty dot (○) = not yet done
- Today's dot gets a subtle pulse animation
- Dots are tappable — tap jumps directly to that day's set

This can replace or augment the "Day 1 · Mon" meta label on day-cards.

## Implementation notes

**Data available:**
- `thisWeek` goals sorted by `weekDay` (mon/tue/wed/thu/fri)
- `Storage.getLastSessionForGoal(g.id)` for each day

**Render location:**
- Inside `_buildWeekRow` for "This Week", above the shelf
- Only for the current-subject tab (not cross-subject)

**HTML:**
```html
<div class="week-dots">
  <span class="week-dot done" title="Monday — done">●</span>
  <span class="week-dot done" title="Tuesday — done">●</span>
  <span class="week-dot today" title="Wednesday — today">◉</span>
  <span class="week-dot" title="Thursday">○</span>
  <span class="week-dot" title="Friday">○</span>
</div>
```

**CSS:** `.week-dot.today { animation: pulse 1.5s infinite; }`

## Acceptance

1. The "This Week" row header shows Mon→Fri dots.
2. Dots for completed sets are filled with subject color.
3. Today's dot pulses.
4. Tapping a filled dot scrolls to or highlights that day-card.
5. On weekend or if no weekly content: dots not shown.
