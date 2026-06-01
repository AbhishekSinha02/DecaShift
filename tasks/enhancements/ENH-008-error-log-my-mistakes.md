# ENH-008 — Error Log ("My Mistakes")

**Priority:** Medium (learning system differentiator)
**Effort:** Medium (~1 session)
**Audience:** Grade 9-12 primarily, also useful for all grades

## Why

The most effective study technique (spaced repetition) is: review what you got wrong, then practice it again. Currently there is no way to see all wrong answers across all sessions.

A Grade 11 student preparing for boards wants: "Show me every Physics question I've ever answered wrong, so I can practice the weak concepts." This is a feature Khan Academy and many flashcard apps provide that Donnibo lacks.

## What to build

### "My Mistakes" section in Journey screen

A new section below the stats band in `screen-journey.html`:

```html
<div id="journey-mistakes"></div>
```

Populated by `_renderMistakesLog()` in `app-journey.js`.

### Data structure

Derive from `Storage.loadSessions()`:

```js
function _buildMistakesLog() {
  const sessions = Storage.loadSessions().filter(s => s.userId === state.user?.userId);
  const mistakes = [];

  sessions.forEach(sess => {
    const goal = state.goals.find(g => g.id === sess.goalId);
    if (!goal) return;
    (sess.responses || []).forEach(r => {
      if (!r.isCorrect) {
        const q = state.questions.find(q => q.id === r.questionId);
        if (q) mistakes.push({
          question:     q.question,
          correctIndex: r.correctIndex,
          options:      q.options,
          explanation:  q.explanation || null,
          goalName:     goal.name,
          subject:      goal.subject,
          date:         sess.sessionEnd,
          sessionId:    sess.sessionId,
        });
      }
    });
  });

  // Deduplicate by questionId (show latest miss)
  const seen = new Set();
  return mistakes
    .filter(m => { const k = m.question; return seen.has(k) ? false : seen.add(k); })
    .sort((a, b) => new Date(b.date) - new Date(a.date))  // most recent first
    .slice(0, 50);  // cap at 50 to avoid overwhelming
}
```

### UI

Display as a collapsed accordion by subject:

```
📐 Mathematics (12 mistakes)
  ▸ [tap to expand] Lines and Angles — you answered B, correct is C
  ▸ ...
🔬 Science (5 mistakes)
  ▸ ...
```

Each entry shows:
- Question (truncated at 80 chars, expandable)
- Your answer → Correct answer
- The explanation
- "Practice again →" CTA (starts the goal that contains this question)

### Filter options

- All subjects
- By subject (subject pill filter)
- "Only this week's mistakes"

## Implementation notes

**No new storage needed** — everything lives in `Storage.loadSessions()` which already includes per-question `isCorrect`, `selectedIndex`, `correctIndex`, and the `questionId` to look up questions.

**Key constraint:** `state.questions` must be loaded to look up question text. If the goal's questions haven't been fetched (manifest-based lazy loading), `state.questions.find(q => q.id === r.questionId)` will return undefined. Handle gracefully.

## Acceptance

1. Journey screen shows a "My Mistakes" section with wrong answers grouped by subject.
2. Each mistake entry shows the question, wrong answer, correct answer, and explanation.
3. Tapping "Practice again →" starts the goal containing that question.
4. Subject filter lets user view mistakes for one subject at a time.
5. If 0 mistakes: show "You haven't made any mistakes yet — or you're just getting started!" with a practice CTA.
6. Capped at 50 most recent unique wrong answers.
