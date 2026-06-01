# ENH-003 — Quiz Pause / Exit Button

**Priority:** High (prevents session loss, especially for younger students)
**Effort:** Medium (~0.5 session)
**Audience:** All grades

## Why

Currently, once a quiz starts, the only way to leave is:
1. Answer all questions → reach result screen
2. Use browser back → breaks session, no progress saved
3. Close the app → session is lost

For a Grade 5 student whose parent calls them for dinner mid-quiz, or a Grade 11 student interrupted between classes, losing partial quiz progress is frustrating. After one bad experience, students learn to only start quizzes when they're sure they can finish — which is a conversion killer for habit formation.

## What to build

### A small exit button on the quiz header

```html
<div class="quiz-header">
  <button class="quiz-exit-btn" onclick="_quizExit()" aria-label="Exit quiz">✕</button>
  <span class="quiz-progress-text" id="quiz-progress-text">Question 1 of 10</span>
  ...
</div>
```

### `_quizExit()` function

Shows a small bottom sheet / confirm dialog:

```
┌─────────────────────────────────────┐
│ Leave this practice set?            │
│                                     │
│ You've answered 3 of 10 questions.  │
│ Progress won't be saved.            │
│                                     │
│ [Continue Practice]  [Leave]        │
└─────────────────────────────────────┘
```

- "Continue Practice" dismisses and resumes.
- "Leave" calls `_stopTimer()` then `_showScreen('home')` + `_renderHome()`.
- No partial session is saved (avoids polluting accuracy stats).

### Keyboard shortcut
`Escape` key on desktop → triggers `_quizExit()`.

## Implementation notes

**File:** `app/ui/js/app-quiz.js` + `app/ui/screens/screen-quiz.html`

The confirm dialog can be a simple `<div class="quiz-exit-sheet">` appended to body, similar to the existing modal pattern.

No "save partial progress" is needed yet — full sessions only. This is the YAGNI-compliant version.

## Acceptance

1. A small ✕ button appears in the quiz header (left or right, not conflicting with progress text).
2. Tapping it shows a confirm bottom sheet.
3. "Leave" exits to home without saving the session.
4. "Continue" returns to the quiz at the same question.
5. `Escape` key triggers the exit dialog on desktop.
