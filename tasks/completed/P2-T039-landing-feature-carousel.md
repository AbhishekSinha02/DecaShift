# P2-T039 — Landing Page Feature Carousel (Hero Right Side)

**Priority:** P2 | **Complexity:** M | **Status:** Pending

## Goal

Replace the static CSS phone mockup in the hero right column with a 4–5 slide auto-advancing feature carousel. Each slide showcases one core product feature as a polished CSS card visual with a headline and sub. Navigation dots below. Auto-advances every 4s. User can click dots or swipe to navigate.

## Why

The static phone mockup shows one state of one screen. A carousel shows the full product breadth in 20 seconds of auto-play — Flash Drills, Practice, Progress, Week Sets. Each slide is a different design language (drill grid, quiz card, accuracy chart, weekly layout), creating the impression of a deep, complete product.

## Slide Definitions (4 slides)

### Slide 1 — Flash Drills
**Headline:** "Drill in 2 minutes flat."
**Sub:** Tables, squares, cubes, formulas — speed mode.
**Visual:** The drill grid card (dark blue gradient, 2×2 grid of math facts, one highlighted correct)

### Slide 2 — Daily Practice
**Headline:** "10 questions. Instant feedback."
**Sub:** Every subject, every grade, every day.
**Visual:** The quiz card (question text, 4 options, one highlighted green with explanation showing)

### Slide 3 — Progress Tracking
**Headline:** "Watch accuracy climb week by week."
**Sub:** Every session logged, every improvement visible.
**Visual:** A mini bar chart (7 bars, heights increasing left to right) with accuracy % label

### Slide 4 — Weekly Sets
**Headline:** "Fresh questions every Monday."
**Sub:** CBSE-aligned, curriculum-mapped, never repeated.
**Visual:** Week card layout (Mon–Sun pills, current day highlighted, subject chips below)

## CSS Implementation

```
.lp-carousel          — outer wrapper, overflow: hidden, position: relative
.lp-carousel-track    — flex row, transition: transform .5s ease
.lp-slide             — flex-shrink:0, width:100%, content varies per slide
.lp-carousel-dots     — dot row, position: absolute bottom
.lp-dot               — circle, active = filled blue
```

Auto-advance timer: `setInterval(nextSlide, 4000)` in `_setupLanding()`.
Touch/swipe support: touchstart/touchend listeners for mobile drag.

## Slide Visuals (CSS-only, no images)

Each slide has a `.lp-slide-card` with its own gradient background and CSS-rendered mini UI.
Slide 1 reuses `.lp-card-blue` drill grid styles already in styles-landing.css.
Slide 2 reuses the quiz mockup elements from the old phone mockup.
Slide 3: new — mini bar chart using flexbox bars with `height` driven by inline style.
Slide 4: new — week pill row + subject chips.

## Hero Layout Change

Right column changes from:
```
.lp-hero-right → .lp-phone (phone frame with mockup)
```
To:
```
.lp-hero-right → .lp-carousel (feature carousel, same column width)
```
Phone mockup CSS can be kept (used elsewhere?) or removed.

## Files
- `app/ui/screens/screen-landing.html` — replace hero right column
- `app/ui/css/styles-landing.css` — add carousel styles, keep or remove phone styles
- `app/ui/js/app-auth.js` — add carousel init in _setupLanding()

## Success Criteria
- [ ] 4 slides auto-advance every 4 seconds
- [ ] Navigation dots show current slide
- [ ] Mobile swipe left/right changes slide
- [ ] No jank on transition
- [ ] Each slide visually distinct (different color palette)
- [ ] Carousel fills the same space as the old phone mockup
