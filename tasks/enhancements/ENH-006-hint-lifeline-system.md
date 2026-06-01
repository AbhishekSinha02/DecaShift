# ENH-006 — Hint Lifeline System (spend XP to eliminate 2 wrong options)

**Priority:** Medium (high engagement value for Grade 2-8)
**Effort:** Medium (~0.5 session)
**Audience:** Grade 2-8 primarily

## Why

Every Indian child has watched KBC (Kaun Banega Crorepati) and knows the lifeline system. "50-50" (eliminating 2 wrong answers) is universally understood.

When a student is stuck, they have two options today:
1. Guess randomly
2. Give up

A hint lifeline adds a third option that teaches: "Use your XP (a resource you earned) to get a clue." This teaches resource management alongside the subject content.

## What to build

### In quiz header: a hint button

```html
<button class="hint-btn" id="hint-btn" onclick="_useHint()" title="Use hint (-10 XP)">
  💡 Hint
  <span class="hint-xp-cost">-10 XP</span>
</button>
```

Visible only before `submitAnswer()` is called. Hidden after.

### `_useHint()` function

```js
function _useHint() {
  if (state.hintUsed || state.selectedAnswerIndex !== null) return;
  const q = state.filteredQuestions[state.currentIndex];
  
  // Deduct XP (with a minimum — never go below 0)
  if (typeof XP !== 'undefined') XP.addXP(-10, 'hint');
  
  // Mark as hint-used (XP penalty on this question even if correct)
  state.hintUsed = true;
  
  // Find 2 random wrong options to eliminate
  const wrongIndices = [0,1,2,3].filter(i => i !== q.correctIndex);
  const toEliminate = wrongIndices.sort(() => Math.random() - 0.5).slice(0, 2);
  
  toEliminate.forEach(i => {
    const card = document.querySelector(`.answer-card[data-idx="${i}"]`);
    if (card) card.classList.add('hint-eliminated');
  });
  
  document.getElementById('hint-btn').disabled = true;
  if (typeof Feedback !== 'undefined') Feedback.play('tap');
}
```

**Add `state.hintUsed = false` reset in `_renderQuestion()`.**

### CSS for eliminated options

```css
.answer-card.hint-eliminated {
  opacity: 0.3;
  pointer-events: none;
  text-decoration: line-through;
  transition: opacity 0.3s ease;
}
```

### XP integration

- Hint costs 10 XP (deducted immediately)
- If correct AFTER using hint: award normal XP minus 5 (net -5 XP)
- If wrong after hint: just the -10 XP
- Lucky question + hint: still gives 2× XP (minus hint cost) — lucky is lucky

### Daily limit

3 hints per day (stored in `localStorage` as `ds_hints_today_{date}`). This prevents full XP drain and creates the scarcity that makes lifelines feel special.

## Acceptance

1. A "💡 Hint -10 XP" button appears on each question before submitting.
2. Tapping it eliminates 2 wrong answer cards (visually grayed out, click-disabled).
3. 10 XP is deducted immediately.
4. The button is disabled after use (one hint per question).
5. Limit: 3 hints per day — button shows "(0 left)" when exhausted.
6. Hints are NOT available on Lucky Questions (would trivialize them).
