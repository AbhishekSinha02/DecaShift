# P3-T016 — Goal Archive: Mark as Done

**Priority:** P3 — Engagement & Retention  
**Complexity:** S (< 1 day, 2 files: app.js + styles.css)  
**Status:** Pending

---

## Problem

Users who complete a goal set (e.g., Grade 6 Science) have no way to remove it from their home screen. The list grows cluttered with goals they have no intention of revisiting. This creates friction and makes the home screen feel like a todo list rather than a focused practice space.

---

## Goal

Let users soft-archive individual goal cards. Archived goals are hidden from the home screen by default but remain recoverable. No session history or streak data is deleted.

---

## Approach: Soft Archive in User Profile

Store an array of archived goal IDs directly inside the existing `decashift_user` localStorage object:

```js
user.archivedGoals = ['grade-6-science', 'grade-6-hindi']
```

No new localStorage keys. No new files. Just a field on the existing user profile.

---

## UI Changes

### Goal card — overflow menu

Add a `⋮` button (top-right of each goal card). On click, show a small inline dropdown with two options:

- **Mark as done** — archives the goal, card disappears with a fade-out animation
- **Reset progress** — existing "reset goal" action (move here from wherever it currently lives)

On mobile: tap `⋮` to toggle. On desktop: the menu can also appear on card hover.

### "Show archived (N)" toggle

Below the goal list (or below subject tabs), render a small muted link:

```
Show completed (3)  ↓
```

Clicking it expands a section showing archived goal cards, each with an **Unarchive** option in their `⋮` menu. Collapsible — collapses back on second click.

---

## Data Flow

**Archive a goal:**
```js
function _archiveGoal(goalId) {
  const user = state.user;
  user.archivedGoals = [...(user.archivedGoals || []), goalId];
  Storage.saveUser(user);
  state.user = user;
  _renderHome();  // re-renders with goal filtered out
}
```

**Unarchive a goal:**
```js
function _unarchiveGoal(goalId) {
  const user = state.user;
  user.archivedGoals = (user.archivedGoals || []).filter(id => id !== goalId);
  Storage.saveUser(user);
  state.user = user;
  _renderHome();
}
```

**Filter in `_renderHome`:**
```js
const archived = new Set(state.user?.archivedGoals || []);
const activeGoals  = goals.filter(g => !archived.has(g.id));
const archivedGoals = goals.filter(g => archived.has(g.id));
// render activeGoals normally
// render archivedGoals in a collapsible section below
```

---

## CSS Additions

```css
.goal-card-menu-btn { /* ⋮ button — top-right of card */ }
.goal-card-dropdown { /* small popover with menu items */ }
.archived-goals-toggle { /* "Show completed (N)" link */ }
.archived-goals-section { /* collapsible container */ }
.goal-card.archived { opacity: 0.6; }  /* muted style for archived cards */
```

---

## Out of Scope

- No server-side sync of archive state (Drive sync already handles user profile; `archivedGoals` will sync with the next Drive save)
- No bulk archive (archive one at a time)
- No permanent delete (soft archive only)

---

## Acceptance Criteria

- [ ] `⋮` button visible on each goal card
- [ ] "Mark as done" hides the card immediately (fade-out)
- [ ] Archived count appears in toggle link
- [ ] "Show completed" expands archived goals section
- [ ] "Unarchive" restores card to main list
- [ ] Archive state persists across page refresh (localStorage)
- [ ] Works correctly with subject tab filter (archived goals hidden within each tab too)
- [ ] No session data or streak data lost

---

## Dependencies

- Depends on P1-T006 (categories — done) and P1-T007 (auto-save — done)
- Compatible with subject tab filter (P2-T021 — done)
