# Feature: Subject Tab Filter UI on Home Screen

**Priority:** P2 | **Type:** UI | **Complexity:** S | **Status:** Pending

## Goal
Add a horizontal subject filter tab bar above the goals list on the home screen so users can quickly switch between Math, Science, Hindi, and French without scrolling through all goal cards. As content grows to 4 subjects × 7 grades = 28 cards, flat scrolling becomes unusable.

## UX Behaviour
- Tabs shown only for school users (grade 2–12); hidden for college/professional users
- Default active tab: **All** — shows all subjects
- Clicking a tab filters goal cards to that subject only
- Active tab state persists within the session; resets on sign-out
- Tabs scroll horizontally on narrow screens (overflow-x: auto, no scrollbar)
- New subjects added to manifest automatically appear as tabs

## Tabs (dynamic from goals in state)
- All | Math | Science | Hindi | French
- Tab labels use display-friendly names (capitalised subject names)
- Tab `data-subject` matches the `subject` field in manifest.json

## Implementation
- `index.html` — add `<div id="subject-tabs">` before `#goals-list`
- `app.js` — add `state.subjectFilter = 'all'`; add `_setSubjectFilter(subject)`; filter `state.goals` in `_renderHome()` before rendering cards; rebuild tabs dynamically from unique subjects in `state.goals`
- `styles.css` — pill-style tabs with active state (accent background)

## Acceptance Criteria
- [ ] Subject tabs render above goals list for school users only
- [ ] Clicking Math shows only math goals, Science shows only science goals, etc.
- [ ] All tab shows every goal
- [ ] Tab state is highlighted (active CSS class)
- [ ] On mobile (375px), tabs scroll horizontally without page scroll
- [ ] Adding a new subject file + manifest entry → new tab appears automatically
- [ ] College/professional users see no tabs

## Dependencies
- P3-T014 (content expansion — provides the Science/Hindi/French goals the tabs will filter)
