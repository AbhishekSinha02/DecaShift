# ENH-001 — Wrong Answer Review Flow

**Priority:** High (closes the core learning loop)
**Effort:** Medium (~1 session)
**Audience:** All grades
**Depends on:** BUG-017 (implementation spec is in BUG-017)

## Why

The app currently has: Practice → Feedback (during quiz) → Result → Home.
The feedback (explanation) disappears the moment you press "Next →". The result screen shows which questions you got wrong but gives you no way to understand WHY.

Khan Academy's #1 differentiator for studying students is the "review what you got wrong" loop. Without this, Donnibo is a quiz app, not a learning system.

## What to build

### In the result table:
- Wrong answer rows (✗) get `cursor: pointer` and a subtle "tap to review" indicator (small `▾` chevron)
- Tapping expands an inline detail row with:
  - The full question text (not truncated)
  - All 4 answer options (correct highlighted green, selected wrong highlighted red)
  - The explanation text

### Bonus: "Review all wrong answers" button
At the bottom of the result table if there are ≥ 1 wrong answer:
```
[📖 Review 3 wrong answers]
```
This scrolls through wrong answers one by one in a modal, similar to the quiz flow but read-only.

## Implementation notes

See BUG-017 for the data-layer fix (store `explanation` and `correctOptionText` in session responses).

The "review all wrong answers" modal reuses `.quiz-wrap` structure but with all buttons disabled.

## Acceptance

1. Tapping a ✗ row expands inline explanation.
2. Tapping again collapses.
3. ✓ rows don't expand (nothing to review).
4. Expanded explanation survives scrolling (not auto-collapsed).
5. "Review all wrong answers" button appears when ≥ 1 wrong.
