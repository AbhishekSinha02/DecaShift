# FEAT-003 — Lazy loading: only load Daily Sprint tab on sign-in

**Priority:** 🔴 P1  
**Estimate:** 0.5 session  
**Status:** Open  

---

## Problem

`_loadQuestionsForUser()` currently fetches ALL question files for the user's grade at sign-in time — regardless of which tab the user will look at. For Grade 7, this could be 30–50 question JSON files (Math W21+W22+W23, Science W21+W22+W23, English...). Most users open the app, do Daily Sprint, close. They never visit the Math tab during that session.

This wastes bandwidth + time on every sign-in.

---

## What to load eagerly (Daily Sprint only)

The Daily Sprint tab needs:
- Today's question sets for all subjects (the "today card" sets — about 4–6 files)
- Flash drill data
- GK data

Everything else (full weekly shelves for Math, Science, Hindi, etc.) can load on-demand.

---

## Architecture change

### Current flow
```
signIn → _loadManifest() → _loadQuestionsForUser(user)
                             └── fetches ALL 40+ question files
                             └── state.goals = all goals
                             └── _renderHome() → render everything
```

### New flow
```
signIn → _loadManifest() → _loadDailySprintData(user)
                             └── fetches only today's files (~6 files)
                             └── state.goals = daily sprint goals only
                             └── _renderHome() → render Daily Sprint tab

user clicks "Math" tab → _loadSubjectData('mathematics')
                          └── fetches Math question files
                          └── merges into state.goals
                          └── re-render Math tab content
```

### Key changes

**`app-core.js`:** Add `_loadDailySprintData(user)` — filters manifest to today's week/day only

**`app-home.js`:** `_setSubjectFilter(subject)` — if that subject's data isn't loaded yet, call `_loadSubjectData(subject)` first, show a mini-skeleton, then render

**`state` object:** Add `state.loadedSubjects = Set<string>` to track which subjects have been fetched

```js
// In _setSubjectFilter:
async function _setSubjectFilter(subject) {
  state.subjectFilter = subject;
  if (subject !== 'daily-sprint' && !state.loadedSubjects.has(subject)) {
    await _loadSubjectData(subject);
  }
  _renderHome();
}
```

### Session storage cache

Question files are already fetched per-file. Once a subject is loaded in a session, `sessionStorage` caches each file. Tab switches within the same session are instant.

---

## What doesn't change

- `state.goals` API — same structure, just fewer entries at sign-in time
- `_renderHome()` — unchanged, works with partial `state.goals`
- All other screens — quiz, result, drill — unchanged

---

## Acceptance

1. Sign-in fetches ≤8 question files (today's daily sprint only)
2. Clicking Math tab fetches Math files and renders Math content
3. Repeated Math tab clicks: instant (sessionStorage cache)
4. No regression on mobile (already only sees daily sprint tab by default)
