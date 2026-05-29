# P2-T042 — Mobile Layout Fix: Content Overflow + Framework Stability

**Priority:** P2 | **Complexity:** S | **Status:** Pending

## Problem

On mobile, content shifts/slides to the left — indicating horizontal overflow.
One or more elements are wider than the viewport, causing `overflow-x: scroll` on the body/landing section.

## Root Causes (likely)

1. **Hero grid not collapsing** — `grid-template-columns: 1fr 1fr` persists on some breakpoint, making the left column overflow
2. **Feature-alt sections** — `.lp-feature-alt .lp-feature-visual` has `padding-right: 64px; margin-left: auto` which pushes content right
3. **Absolute-positioned badges** — `.lp-badge-streak` and `.lp-badge-score` have `right: -20px` / `left: -20px` which bleeds outside parent
4. **City ticker** — now removed (Step 3), but the remaining proof-bar might still cause overflow
5. **Stats bar** — `padding: 28px 32px` with wide `flex` items may overflow at 375px

## App shell (authenticated screens)

The home screen, quiz screen, and drill screen must also be audited:
- `#screen-home`, `#screen-quiz`, `#screen-drill` — check for anything with fixed pixel widths > 375px
- Bottom nav must not cause horizontal overflow

## Fixes

### Landing page
```css
#screen-landing { overflow-x: hidden; }
.lp-hero { overflow: hidden; } /* clips badge overflow */

/* Mobile: badges stay within phone container */
@media (max-width: 768px) {
  .lp-phone-badge { position: static; margin-top: 8px; } /* or clamp to phone width */
  .lp-badge-streak, .lp-badge-score { display: none; } /* simplest fix */
}
```

### App shell
```css
body, html { overflow-x: hidden; }
.screen { overflow-x: hidden; }
```

### Audit method
In browser devtools: Elements → `document.querySelectorAll('*')` → check offsetWidth > window.innerWidth for each element to find the culprit.

## Files
- `app/ui/css/styles-landing.css`
- `app/ui/css/styles-app.css`
- `app/ui/css/styles-base.css` (body/html rule)

## Success Criteria
- [ ] No horizontal scroll on landing page at 375px
- [ ] No horizontal scroll on home/quiz/drill/result screens at 375px
- [ ] All elements visible and readable at 375px
- [ ] Floating badges (streak/accuracy) don't cause overflow
