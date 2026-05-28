# BUG-007 — Grade 12 subject tabs (Math/Physics/Chemistry) not visible

**Status:** Fixed  
**Severity:** High (content invisible to users)  
**Reported:** 2026-05-28  
**Fixed:** 2026-05-28  

## Symptom

On Grade 12, the subject tabs for Math, Physics, and Chemistry were not visible.
Only "All" and "CS" tabs appeared. However, the "All" tab did show content from
Math/Physics/Chemistry files (as weekly day-cards).

Same issue would affect Grade 9, 10, 11 for any subject that only has weekly files.

## Root Cause

`app.js` line 443 built subject tabs only from `regularGoals` (goals with no `weekNum`):

```js
// BEFORE (broken):
const rawSubjects = isSchool ? [...new Set(regularGoals.map(g => g.subject))] : [];
```

All new grade 9–12 question files have `weekNum` set (21, 22, 23, 24), so they are
classified as `weeklyGoals`. Only the old flat `computer-science.json` (no `weekNum`)
was a `regularGoal` — hence only the CS tab appeared.

## Fix

Include both `regularGoals` and `weeklyGoals` when deriving the subject tab list:

```js
// AFTER (fixed):
const rawSubjects = isSchool ? [...new Set([...regularGoals, ...weeklyGoals].map(g => g.subject))] : [];
```

Also added `physics`, `chemistry`, `biology`, `english`, `social-science` to
`subjectLabels` so tabs display clean labels instead of raw `_cap()` output.

## Files Changed

- `app/ui/app.js` — line 443 (subject tab source) and subjectLabels object
