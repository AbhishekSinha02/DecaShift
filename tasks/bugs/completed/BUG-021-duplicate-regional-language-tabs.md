# BUG-021 — Duplicate regional language tabs (e.g., "Regional-Tamil" + "Tamil")

**Severity:** Medium (confusing UX; one tab is broken/empty)
**Found by:** User report 2026-06-03
**Status:** ✅ FIXED — commit pending
**File:** `app/ui/js/app-home.js` line 97

## What's wrong

Two tabs appear for a student with a regional language set (e.g., Tamil):
1. `"Regional-Tamil"` — produced by `rawSubjects` including the `regional-tamil` subject key from `weeklyGoals`
2. `"Tamil"` — produced by the dedicated regional tab logic that appends `regionalLang` to `allTabs`

## Root cause

```js
// Line 84 — weeklyGoals is NOT filtered for regional subjects
const weeklyGoals = state.goals.filter(g => g.weekNum);

// Line 97 — both regularGoals AND weeklyGoals are used as source
const rawSubjects = isSchool
  ? [...new Set([...regularGoals, ...weeklyGoals].map(g => g.subject))]
  : [];
```

`regularGoals` (line 83) correctly excludes `regional-*` subjects, but `weeklyGoals` does not. Any weekly content file with `subject: "regional-tamil"` leaks `"regional-tamil"` into `rawSubjects`, generating a stray tab labeled "Regional-Tamil" (via `_cap()`).

Separately, line 111 appends `regionalLang` ("tamil") as a proper regional tab → two tabs for the same content.

## Fix applied

```js
// Filter regional subjects out of rawSubjects source
const rawSubjects = isSchool ? [...new Set([...regularGoals, ...weeklyGoals]
  .filter(g => !(g.subject && g.subject.startsWith('regional-')))
  .map(g => g.subject))] : [];
```

This mirrors the same `regional-` exclusion already applied to `regularGoals`.

## Acceptance

- Student with regional language set sees exactly **one** regional tab (e.g., "Tamil").
- No "Regional-Tamil" / "Regional-Marathi" / etc. ghost tabs appear.
- Applies to all regional languages: Tamil, Telugu, Marathi, Punjabi, Malayalam, Sanskrit.
