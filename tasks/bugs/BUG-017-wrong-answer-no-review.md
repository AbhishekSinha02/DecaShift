# BUG-017 — Result table ✗ rows are tappable-looking but do nothing

**Severity:** High (core learning loop broken)
**Found by:** UX Audit 2026-06-03 (Result screen)
**File:** `app/ui/js/app-quiz.js` lines 453-461

## What's wrong

The result table renders question rows with ✓/✗:

```js
return `<tr>
  <td>${i + 1}</td>
  <td class="q-text">${_esc(q.question.length > 60 ? q.question.slice(0,'60') + '…' : q.question)}</td>
  <td class="${r.isCorrect ? 'correct' : 'incorrect'}">${r.isCorrect ? '✓' : '✗'}</td>
  <td class="time-cell">${r.durationSeconds}s</td>
</tr>`;
```

Rows with ✗ appear clickable (they're table rows, finger naturally taps them), but there is no `onclick` handler. The explanation shown during the quiz is never re-shown after the session ends.

**User quote (11-year-old):** *"I got 3 wrong. I can see the X marks. But clicking them does nothing. How do I know WHY I was wrong?"*

**User quote (Grade 11):** *"The explanations are the most useful part of this app. But they disappear the moment I tap Next. I can never re-read them."*

This breaks the fundamental learning loop: **practice → feedback → understand → improve**. Without the review step, the app is a quiz, not a learning system.

## Fix

### Step 1 — Store explanations in session responses

In `submitAnswer()` (app-quiz.js line 134), add `explanation` to the response:

```js
state.responses.push({
  questionId: q.id, selectedIndex: s, correctIndex: q.correctIndex,
  isCorrect: ok, lucky: isLucky,
  explanation: q.explanation || null,        // ADD THIS
  correctOptionText: q.options[q.correctIndex],  // ADD THIS
  startTime: state.questionStart, endTime: new Date().toISOString(),
  durationSeconds: state.timerSeconds
});
```

### Step 2 — Make ✗ rows expandable in the result table

In `_showResult()`, change the row generation to add an expandable detail row on click for wrong answers:

```js
// For wrong answers, make the row clickable to show explanation
const clickable = !r.isCorrect ? ` class="result-row-expandable" onclick="_toggleResultRow(${i})"` : '';
return `<tr${clickable}>
  <td>${i + 1}</td>
  <td class="q-text">${_esc(q.question.length > 60 ? q.question.slice(0, 60) + '…' : q.question)}</td>
  <td class="${r.isCorrect ? 'correct' : 'incorrect'}">${r.isCorrect ? '✓' : '✗'}</td>
  <td class="time-cell">${r.durationSeconds}s</td>
</tr>
${!r.isCorrect ? `<tr class="result-row-detail hidden" id="result-row-detail-${i}">
  <td colspan="4" class="result-row-explanation">
    <strong>Correct:</strong> ${_esc(r.correctOptionText || '')}<br>
    ${r.explanation ? _esc(r.explanation) : 'Review the concept and try again.'}
  </td>
</tr>` : ''}`;
```

Add `_toggleResultRow(i)`:
```js
function _toggleResultRow(i) {
  const row = document.getElementById('result-row-detail-' + i);
  if (row) row.classList.toggle('hidden');
}
```

Add CSS for `.result-row-expandable { cursor: pointer; }` and `.result-row-detail td { ... }`.

## Acceptance

- Tapping a ✗ row in the result table expands an inline explanation showing the correct answer and the explanation text.
- Tapping again collapses it.
- ✓ rows do nothing on tap (they're already correct — no need to expand).
- The explanation shown matches what was shown during the quiz.
