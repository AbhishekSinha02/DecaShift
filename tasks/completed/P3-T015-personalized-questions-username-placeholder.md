# Feature: Personalized Questions — {{userName}} Placeholder

**Priority:** P3 | **Type:** Engagement | **Complexity:** S | **Status:** Pending

## Goal
Make word problems feel personal by replacing `{{userName}}` in question text with the user's actual first name at render time. A question like "{{userName}} has 12 mangoes and gives 4 away — how many are left?" becomes "Priya has 12 mangoes…" for user Priya and "Bob has 12 mangoes…" for user Bob.

## Why It Matters
Personalization increases emotional engagement and makes the quiz feel like it was written for them. This is especially effective for school students (grades 2–8) where story-based word problems already use character names.

## Implementation
Single change in `app.js` inside `_renderQuestion()`:

```js
// Replace {{userName}} with the user's first name before rendering
const firstName = (state.user.name || state.user.email || 'there').split(' ')[0];
const qText     = q.question.replace(/\{\{userName\}\}/g, firstName);
document.getElementById('question-text').textContent = qText;
```

Also replace in explanation text (shown after submit) and option text (for completeness):
```js
const replaceUser = str => str.replace(/\{\{userName\}\}/g, firstName);
document.getElementById('question-text').textContent = replaceUser(q.question);
// options: replaceUser(opt) in the innerHTML map
```

## Content Rule
- Use `{{userName}}` in 2–4 questions per question file (not every question — variety matters)
- Only in word problems, never in concept/definition questions
- The placeholder must feel natural: "{{userName}} scored 45 out of 60. What is the percentage?"

## Acceptance Criteria
- [ ] `_renderQuestion()` replaces `{{userName}}` with user's first name before displaying
- [ ] Explanation text also replaces `{{userName}}`
- [ ] Option text also replaces `{{userName}}`
- [ ] User with name "Abhishek Sinha" sees "Abhishek" (first name only)
- [ ] User with no name set falls back to "there" or email prefix
- [ ] Questions without `{{userName}}` are unaffected

## Dependencies
- P3-T014 (provides question files containing the `{{userName}}` placeholders)
