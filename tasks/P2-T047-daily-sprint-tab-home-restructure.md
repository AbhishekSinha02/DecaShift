# P2-T047 — Daily Sprint tab + home screen restructure

**Priority:** P1 — NEXT SESSION (highest priority)
**Effort:** 1 session (~3–4 hours)
**Status:** 🔲 Pending

---

## Problem

The current home screen tab layout is broken UX:
- Math tab = Greeting + Today's Quest + Flash Drills + Math cards → cluttered, unfocused
- Science tab = Today's Quest (again!) + Science cards → Quest repeats on every tab, makes no sense
- Switching tabs has almost no visual payoff — Quest dominates every view
- Flash Drill labelled generically despite being Math-only
- GK lives as a separate tab, disconnected from daily practice flow
- No concept of "here's what you do today" vs "browse by subject"

---

## Solution — Two distinct tab types

### Type A — Daily Sprint (pinned first tab, always)
Everything the student needs to do TODAY, in one focused view.

**Layout (top → bottom):**
1. **Greeting** — personalized welcome + motivational sub-line (existing `_renderGreeting()`)
2. **Today's Math** card — today's Math practice card for the student's grade
3. **Today's [Subject]** cards — one per subject the student has content for (Science, Hindi, French, etc.), in subject order
4. **Math Flash Drill** — existing flash drill section, renamed label only
5. **Current Affairs & GK Drill** — Today's GK card (moved from standalone GK tab) + Current Affairs card (placeholder/coming-soon state until content exists)
6. **Today's Quest** — gamification widget moved to bottom; visible only on Daily Sprint tab

### Type B — Subject tabs (Math, Science, Hindi, etc.)
Pure subject content. No daily widgets at all.

**Layout:**
- Weekly practice shelves for that subject only
- No greeting, no quest, no flash drill, no GK, no today-cards from other subjects

---

## Tab strip (final order)

```
⚡ Daily Sprint | Math | Science | Hindi | French | … | [Regional]
```

- Daily Sprint is always first, pinned
- Subject tabs follow in existing order (Math first, regional last)
- GK tab removed from tab strip (GK content lives inside Daily Sprint)

---

## Home navigation

| Surface | Action | Result |
|---|---|---|
| Laptop nav rail — 🏠 Home | click | `subjectFilter = 'daily-sprint'`, re-render, scroll to top |
| Mobile — Donnibo logo / brand name in header | tap | same as above |

Add a `_goHome()` function that sets filter + re-renders + scrolls. Wire both surfaces to it.

---

## Specific code changes

### `app-home.js`

1. **Tab generation** — prepend `'daily-sprint'` before subject tabs. Tab label: `⚡ Daily Sprint`. Use a distinct `daily-sprint-tab` CSS class for styling.

2. **`_renderHome()` dispatch** — after tab selection:
   - `if (state.subjectFilter === 'daily-sprint') _renderDailySprint()`
   - `else _renderSubjectView()`

3. **`_renderDailySprint()`** — new function:
   - Calls `_renderGreeting()` (existing)
   - Renders per-subject today-cards in a vertical stack (`_renderTodayCards()`)
   - Calls `_renderFlashDrills()` (existing, label change only)
   - Renders GK + Current Affairs section (`_renderGKSection()`)
   - Renders Today's Quest at bottom (`_renderDailyQuest()`)

4. **`_renderSubjectView()`** — new function (extracted from existing `_renderHome()`):
   - Shows only weekly shelves filtered to `state.subjectFilter`
   - Calls none of: greeting, quest, flash drill, GK, today-cards

5. **`_renderTodayCards()`** — new function:
   - Gets unique subjects from `state.goals` for the user's grade
   - For each subject, finds the "today" card (existing `_getTodayGoal()` logic)
   - Renders a compact today-card per subject, stacked vertically

6. **`_renderFlashDrills()`** — change section label from "Flash Drills" → "Math Flash Drill"

7. **`_goHome()`** — new function:
   ```js
   function _goHome() {
     _setSubjectFilter('daily-sprint');
     _renderHome();
     document.getElementById('home-wrap')?.scrollTo({ top: 0, behavior: 'smooth' });
   }
   ```

8. **Default tab** — on first load / after sign-in, `state.subjectFilter` defaults to `'daily-sprint'` (currently defaults to first subject = Math).

### `screen-home.html`

- Donnibo logo / brand div gets `onclick="_goHome()"`:
  ```html
  <div class="app-header-brand" onclick="_goHome()" style="cursor:pointer">
  ```
- Laptop rail Home button: change `onclick="_renderHome()"` → `onclick="_goHome()"`

### `styles-app.css`

- `.daily-sprint-tab` — distinct visual style (accent colour pill, not a plain subject tab)
- Today-cards stack in Daily Sprint needs a `daily-today-stack` wrapper with appropriate gap

---

## Completion state sync — Daily Sprint ↔ Subject tabs

When a student completes a today-card from the Daily Sprint tab, that card's state
must immediately reflect in the corresponding subject tab and vice versa.

**Rule:** Completion state is driven by session storage (`Storage.getLastSessionForGoal()`),
not by which tab the card was opened from. Both Daily Sprint and subject tabs read the
same source of truth — no duplication of state.

**Specific behaviour:**
- Student taps Math today-card on Daily Sprint → completes quiz → returns home
- Math today-card on Daily Sprint shows ✅ completed state
- User switches to Math tab → the same card appears there as ✅ completed
- Works in reverse: complete from Math tab → Daily Sprint card also shows completed

**Implementation note:** Today-cards already call `Storage.getLastSessionForGoal(goalId)` to
show last score. Ensure `_renderDailySprint()` and `_renderSubjectView()` both re-read
storage on every render (no cached card state). If a re-render is needed after quiz
return, ensure `_showScreen('home')` triggers `_renderHome()` so both views update.

---

## What is NOT changing

- The weekly shelf rendering logic (unchanged — subject tabs reuse it)
- Flash Drill question logic (only the label changes)
- Today's Quest internals (only moved to bottom of Daily Sprint)
- GK question content (Today's GK card moved, not rewritten)
- Regional language tab position (stays last, after all subjects)

---

## Current Affairs card (Daily Sprint — section 5)

Content does not exist yet. Render a placeholder card:
- Title: "Current Affairs"
- Body: "Coming soon — daily news quizzes for your grade"
- Style: muted/disabled state, no tap action

Wire up properly once W24+ content sessions include current affairs questions.

---

## Acceptance criteria

- [ ] Daily Sprint tab is always first, always selected on fresh load / after sign-in
- [ ] Daily Sprint shows: greeting → per-subject today-cards → Math Flash Drill → GK+Current Affairs → Today's Quest
- [ ] Today's Quest appears ONLY on Daily Sprint tab
- [ ] Math tab shows ONLY Math weekly shelves — no quest, no drills, no greeting
- [ ] Science (and all other subject) tabs show ONLY their weekly shelves
- [ ] GK tab removed from tab strip
- [ ] Donnibo logo tap on mobile → Daily Sprint tab, scroll to top
- [ ] Laptop Home button → Daily Sprint tab, scroll to top
- [ ] Flash Drill section label reads "Math Flash Drill"
- [ ] Completing a today-card on Daily Sprint → card shows ✅ completed on Daily Sprint AND on the subject tab
- [ ] Completing a today-card on a subject tab → card shows ✅ completed on that tab AND on Daily Sprint
- [ ] No regression on quiz launch, streak, XP, avatar from any card

---

## Related

- BUG-023 (hamburger toggle) — resolved, home nav now works on mobile
- P2-T021 (subject tab filter UI) — this task replaces the default-to-Math behaviour
- Session handoff 2026-06-03 — Daily Sprint concept originated here
