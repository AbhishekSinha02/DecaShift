# E-002: Tablet & Laptop Shell + Multi-Column Home

**Priority:** P0 (Substrate) | **Force:** Responsive Excellence | **Type:** UI/CSS+JS | **Complexity:** L | **Status:** Pending
**Session:** E1 · **Depends on:** E-001 · **Closes half the "laptop/tablet/mobile" mandate**

## Goal
Make Donnibo genuinely **world-class on tablet and laptop**, not a stretched phone column.
Introduce responsive layout above 768px: a wider browse grid, a persistent side rail on laptop,
multi-column Netflix rows, and comfortable reading widths — while the phone experience is untouched.

## Why
Every value caps at `max-width: 720px`; on a 1440px laptop the app is a thin centre strip with
dead space. School/teacher demos — the highest-converting channel — happen on laptops and tablets.

## What to build

### Tablet (≥768px)
- Home browse rows show **2–3 cards per row** instead of 1 (CSS grid `auto-fill, minmax`).
- Streak bar + greeting sit in a **2-column header band** (stats right, greeting left).
- Settings tiles go 2-up; quiz keeps a centered reading column (`--container-reading`).

### Laptop (≥1024px)
- Introduce a **persistent left nav rail** (icons + labels: Home, Practice, Drills, GK, Journey, Settings)
  that replaces the hamburger drawer at this breakpoint. Drawer stays for phone/tablet.
- Home content uses `--container-wide` (max 1200px), browse rows 3–4 cards.
- Add **hover states** (lift/shadow on cards, cursor affordances) — only meaningful with a mouse;
  gate behind `@media (hover: hover)`.
- Quiz answer cards: 2×2 grid on laptop, single column on phone.

### Cross-cutting
- Verify drills, GK, paywall, result, profile (E-007) all reflow — no fixed-width orphans.
- The fixed app shell + sliding content nav principle (see product design memory) holds at every size.

## Acceptance Criteria
- [ ] 375px phone: **identical** to pre-task (regression-protected)
- [ ] 768px tablet: home shows multi-card rows, no dead side gutters, no horizontal scroll
- [ ] 1024px+ laptop: left nav rail visible, drawer hidden, content max 1200px centered
- [ ] Hover lift on cards only with a real pointer (`@media (hover: hover)`)
- [ ] Quiz answers 2×2 on laptop, reading column stays ≤720px for question text
- [ ] All screens checked at 375 / 768 / 1024 / 1440px — screenshots in commit
- [ ] 60fps scroll on a mid Android (grid uses transforms/opacity only)

## Technical Notes
- CSS grid + `@media (min-width: …)` using E-001 breakpoint tokens. **Additive** min-width queries —
  do not touch existing max-width rules, layer on top.
- Nav rail: render once in `screen-home.html` (or a shared partial), toggle visibility by breakpoint
  via CSS; reuse existing `_navPractice`, `_startDrill`, `openSettings`, `_setSubjectFilter` handlers
  from `app-home.js` / `app-drill.js` so no logic is duplicated.
- Keep the hamburger/drawer markup; just `display:none` it at ≥1024px and show the rail.

## Files to Touch
- `app/ui/css/styles-app.css` — tablet/laptop min-width layers, grid rows, nav rail, hover
- `app/ui/screens/screen-home.html` — add nav-rail markup (hidden on phone)
- `app/ui/js/app-home.js` — only if rail needs an active-state highlight on `_renderHome`
- Spot-check: `screen-quiz.html`, `screen-settings.html`, `screen-result.html`, `screen-drill.html`

## Definition of Done
Open on a laptop and it looks designed *for* a laptop; open on a tablet and rows fill the width;
open on a phone and nothing changed. Commit per breakpoint milestone (tablet first, then laptop)
so the app is shippable mid-task.
