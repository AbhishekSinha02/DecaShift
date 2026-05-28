# BUG-009 — Grade Not Pre-Populated in Settings Profile

**Severity:** Medium
**Status:** ✅ Fixed — 2026-05-29 (fixed as part of P2-T030 settings restructure)

## Symptom

Opening Settings → Profile shows the grade selector defaulting to "Grade 2" (the first `<option>`)
instead of the user's actual grade. User has to re-select their grade every time they open settings,
and if they accidentally save without changing, their grade gets reset to Grade 2.

## Root Cause

`openSettings()` pre-fills the grade select with `gradeEl.value = user.grade || ''`.
The settings grade select had NO `<option value="">…` placeholder, so when `user.grade`
was stored as a number (e.g., `7`) instead of a string (`"7"`), or when the assign ran
before the select was fully rendered, the browser fell back to the first option (Grade 2).

Additionally, `openSettings()` ran all pre-fill logic at once before the modal was visible,
making it harder to reason about field initialization state.

## Fix

In the settings restructure (P2-T030), the profile section is now a separate sub-screen with
its own `_initProfileSection()` function that runs fresh every time the user navigates to it:

```js
function _initProfileSection() {
  const gradeEl = document.getElementById('settings-grade');
  if (gradeEl) gradeEl.value = String(user.grade ?? '');
  // ...
}
```

A `<option value="">Select grade…</option>` placeholder was also added so the select
shows blank when no valid grade is stored, rather than silently defaulting to Grade 2.

## Commit

`[P2-T030 settings restructure commit]` — 2026-05-29
