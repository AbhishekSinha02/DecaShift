# P2-T040 — Landing Page Hero: Above-Fold Converts Without Scroll

**Priority:** P2 | **Complexity:** S | **Status:** Pending

## Goal

On a 1440×900 laptop, the hero section fills the full viewport.
User sees: nav + headline + sub + CTAs + trust pills + feature carousel — all without scrolling.
The decision to sign up should be made entirely from the above-fold view.
No horizontal scrollbar on any viewport. Scrollbar visually hidden.

## What Changes

### Hero height
```css
.lp-hero {
  min-height: calc(100vh - 64px); /* 64px = nav height */
  /* Remove padding-top: 136px → becomes padding-top: 64px + flex centering */
}
```
Hero uses `align-items: center` on the grid — both columns vertically centered in the remaining viewport.

### Remove "How it works" section
The 3-step section is generic and adds no conversion value when the feature carousel already shows the product. Remove it entirely. The carousel communicates "how it works" visually and is more engaging.

The anchor `#lp-how` in the nav can point to the first feature row instead.

### Remove stats bar from below-hero position
Stats are important trust signals but they push the fold down. Move them INTO the hero left column — place after trust pills as a compact inline stat row:
```
6K+ questions  ·  11 grades  ·  6 subjects
```
Small font, muted color — trust signal without taking space.

### Hide scrollbar visually
```css
#screen-landing::-webkit-scrollbar { display: none; }
#screen-landing { scrollbar-width: none; }
```
Content still scrollable, but the scrollbar itself is hidden. Clean.

### Prevent horizontal overflow (fix mobile content shift)
```css
#screen-landing { overflow-x: hidden; }
```
This is the root cause of content shifting left on mobile — an element wider than viewport causing horizontal scroll.

## Files
- `app/ui/css/styles-landing.css` — hero height, scrollbar hide, overflow-x fix
- `app/ui/screens/screen-landing.html` — remove "How it works" section, inline stats

## Success Criteria
- [ ] 1440×900 laptop: no scroll needed to see headline + CTA + carousel
- [ ] No horizontal scrollbar on any viewport
- [ ] No vertical scrollbar visible (but page still scrolls)
- [ ] Sections below (feature rows, testimonials, FAQ) still discoverable by scrolling
- [ ] "How it works" section removed
