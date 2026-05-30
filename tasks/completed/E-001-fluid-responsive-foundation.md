# E-001: Fluid Responsive Foundation

**Priority:** P0 (Substrate) | **Force:** Responsive Excellence | **Type:** UI/CSS | **Complexity:** S | **Status:** ✅ Done (commit 29326d0)
**Session:** E1 · **Depends on:** none · **Unblocks:** E-002 and every later layout

## Goal
Replace the fixed mobile-first scale with a **fluid token system** so type, spacing, and
container widths breathe across phone → tablet → laptop. Today every layout is capped at
`max-width: 720px`; this task makes the *scale* responsive without yet changing *layout*
(E-002 does layout). Cheap, invisible-on-mobile, unblocks everything.

## Why
The CSS has 20+ `max-width` breakpoints and zero desktop expansion. A clamp-based token
layer fixes the root cause (a phone scale stretched everywhere) instead of patching per-component.

## What to build
1. **Fluid type scale** in `:root` using `clamp()`:
   - `--fs-display`, `--fs-h1`, `--fs-h2`, `--fs-body`, `--fs-sm`, `--fs-xs`
   - e.g. `--fs-h1: clamp(1.4rem, 1.1rem + 1.4vw, 2.2rem);`
2. **Fluid spacing scale**: `--sp-1`…`--sp-8` (some clamp-based for section gaps).
3. **Container tokens**: `--container-reading: 720px` (text columns stay readable),
   `--container-wide: 1200px` (home/browse can go wider — used by E-002).
4. **Breakpoint custom properties / documented values**: `--bp-tablet: 768px`, `--bp-laptop: 1024px`.
5. Migrate the most-used hardcoded `font-size`/`padding` in `styles-base.css` and the home/quiz
   sections of `styles-app.css` to tokens. Do **not** chase every value — convert the high-traffic
   ones (headers, cards, body copy, buttons) and leave the rest for E-002's pass.

## Acceptance Criteria
- [ ] Phone (375px) renders **pixel-identical or better** vs. current — this is a refactor, not a redesign
- [ ] On a 1366px laptop, body text and headings scale up (no longer tiny phone type)
- [ ] No horizontal scroll at 320 / 375 / 768 / 1024 / 1440px
- [ ] `prefers-reduced-motion` and existing dark/light handling untouched
- [ ] Tokens documented in a comment block at top of `styles-base.css`

## Technical Notes
- Pure CSS. No JS. No new files.
- Use `clamp(min, preferred, max)` — `min`/`max` lock the phone and laptop ends; `vw` term scales between.
- Keep reading-width columns (quiz question, explanations) on `--container-reading`; only browse/home
  surfaces use `--container-wide` later.

## Files to Touch
- `app/ui/css/styles-base.css` — add token block, migrate base type/spacing
- `app/ui/css/styles-app.css` — migrate high-traffic home/quiz values to tokens

## Definition of Done
App looks the same on a phone, visibly more comfortable on a laptop, and E-002 now has a
token system to build real multi-column layouts on. Commit message confirms phone parity.
