# Feature: Mobile-Friendly + Tab-Friendly Responsive Redesign

**Priority:** P2 | **Type:** Technical | **Complexity:** M | **Status:** Pending

## Goal
Every screen feels native on mobile (375px+), tablet (768px+), and desktop. Touch targets are large, text is readable, and keyboard/tab navigation works end-to-end.

## Acceptance Criteria
- [ ] All tap targets are minimum 44×44px (Apple HIG standard)
- [ ] No horizontal scroll on any screen at 375px width
- [ ] Quiz answer cards are full-width on mobile, 2-column grid on tablet
- [ ] Home screen goal cards stack vertically on mobile, 2-col on tablet
- [ ] Font sizes: min 14px body, 16px inputs (prevents iOS auto-zoom on focus)
- [ ] All interactive elements reachable by Tab key in logical order
- [ ] Selected answer card visible via keyboard focus outline
- [ ] Submit and Next buttons accessible via Enter key
- [ ] Bottom navigation bar on mobile for Home / Profile / Streaks
- [ ] Tested on iOS Safari and Android Chrome (use BrowserStack or real device)

## Technical Notes
- Use CSS Grid with `auto-fit` / `minmax` for goal cards
- Bottom nav: fixed position, only visible on mobile (`max-width: 640px`)
- `tabindex` audit across all interactive elements
- Add `@media (hover: none)` for touch-specific hover removal

## Dependencies
- None (CSS-only changes, can be done in parallel with other tasks)

## Files to Touch
- `app/ui/styles.css` — responsive breakpoints, touch targets, bottom nav
- `app/ui/index.html` — bottom navigation HTML
- `app/ui/app.js` — bottom nav active state management
