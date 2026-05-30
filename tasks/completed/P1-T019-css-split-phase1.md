# Task: CSS Split Phase 1 — Maintainability Split (P1-T019)

**Priority:** P1 | **Type:** Refactor / Infrastructure | **Complexity:** S | **Status:** Pending
**Created:** 2026-05-29

> styles.css is 2,081 lines and growing ~80 lines per feature session.
> Split now, before it becomes a 3,500-line file that takes 2 minutes to navigate.
> Zero performance change. Pure developer experience improvement.

---

## Why Now

- Currently at **2,081 lines**. The restructuring threshold is 2,500. At current growth rate
  (~80 lines/session), that's ~5 sessions away.
- Split takes 30 minutes. Waiting costs nothing now. Waiting later means more edits to
  wrong files, more grep-to-find-the-rule time, more merge conflicts.
- Phase 2 (lazy-load) is more valuable when styles-app.css is its own file — it can only
  be lazy-loaded once it's separate. Phase 1 is a prerequisite for Phase 2.

---

## Current State

```
styles.css   2,081 lines / 67KB
```

**Section map (exact line numbers):**

| Lines | Section | Target file |
|---|---|---|
| 1–167 | CSS vars, reset, screen routing, buttons, forms, cards, typography | `styles-base.css` |
| 168–485 | Landing screen, Sign Up screen, Sign In screen | `styles-auth.css` |
| 486–2081 | Home, Quiz, Result, Drill, GK, Settings, all modals, Phase UI | `styles-app.css` |

---

## Target State

```
app/ui/
  styles-base.css    ~167 lines  — shared by everything, always loaded
  styles-auth.css    ~318 lines  — auth screens (landing, signup, signin)
  styles-app.css    ~1,596 lines  — app screens + all components + modals
  (styles.css deleted)
```

**index.html `<head>` after:**
```html
<link rel="stylesheet" href="styles-base.css">
<link rel="stylesheet" href="styles-auth.css">
<link rel="stylesheet" href="styles-app.css">
```

Browser fetches all 3 in parallel — no performance regression.

---

## Rule Going Forward

**New CSS for auth screens (landing, signup, signin) → `styles-auth.css`**
**New CSS for any app screen or component → `styles-app.css`**
**New CSS vars, resets, shared primitives → `styles-base.css`**

When adding a new modal or screen component, open the correct file immediately.
Never add to a file that doesn't match the section.

---

## Acceptance Criteria

- [ ] `styles.css` deleted (or renamed to `styles-legacy.css` temporarily)
- [ ] `styles-base.css`, `styles-auth.css`, `styles-app.css` created
- [ ] All 3 linked in index.html in correct order (base first)
- [ ] App loads correctly: landing, signup, signin, home, quiz, drill all styled
- [ ] No visual regressions: buttons, cards, modals, tabs, nav all intact
- [ ] Committed and pushed
