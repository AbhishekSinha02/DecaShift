# Feature: Profile Edit — Grade / Role Change

**Priority:** P2 | **Type:** UX | **Complexity:** S | **Status:** Pending

## Goal
Let users change their grade or role after signup without losing session history.
A Grade 5 student who advances to Grade 6, or a student who joins college, must
be able to update their profile and immediately see the right goals — no account
re-creation needed.

## Options (decided later)

### Option A — Edit Profile modal in user menu (Recommended for v1)
- "Edit Profile" button in the user menu dropdown
- Modal pre-filled with current grade/role values
- On save: update `user` in localStorage, re-run `_loadQuestionsForUser`, re-render home
- Silent Drive sync in background

### Option B — Progression prompt after high performance
- After 3+ sessions with ≥ 80% accuracy on a goal, show banner:
  *"You're crushing Grade 5! Ready to unlock Grade 6?"*
- One-click upgrade — no modal needed

### Option C — Show grade ± 1 goals simultaneously
- Student sees current grade + one grade above (challenge) + one below (revision)
- No profile change needed at all

## Acceptance Criteria (Option A)
- [ ] "Edit Profile" item visible in user menu
- [ ] Modal shows current grade (for school users) or role (for professional users)
- [ ] Changing grade updates localStorage user object and re-fetches goals
- [ ] Session history from previous grade is preserved — not deleted
- [ ] Profile change syncs to Drive silently in background
- [ ] No page reload required — home re-renders immediately with new goals
- [ ] Mobile: modal is full-screen or bottom-sheet on < 640px

## Data Change
```js
// Only these fields change on profile edit:
user.grade   = newGrade;   // school users
user.role    = newRole;    // professional users
user.course  = newCourse;  // college users
// userId, email, sessions, streak — all preserved
```

## Dependencies
- P1-T002 (auth must exist — done)
- P1-T006 (category selection — done)

## Files to Touch
- `app/ui/index.html` — Edit Profile menu item + modal HTML
- `app/ui/app.js` — `openEditProfile()`, `saveProfileEdit()`, re-load goals
- `app/ui/styles.css` — modal overlay styles (reuse existing card/form styles)
