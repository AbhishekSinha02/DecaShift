# E-009: Screen Transitions + Skeleton Loaders

**Priority:** P1 (Juice) | **Force:** Juice | **Type:** UI+JS | **Complexity:** M | **Status:** ✅ Done (3af2005 transitions, 5552d86 skeletons)
**Session:** E4 · **Depends on:** none (pairs with E-008) · **Perceived-performance polish**

## Goal
Make navigation *feel* instant and intentional: smooth **screen transitions** between home ↔ quiz ↔
result ↔ journey, and **skeleton loaders** so content never pops in from blank. This is the invisible
craft that makes the app feel faster and more expensive than competitors — the Netflix-grade perceived
performance pass.

## Why
Today screens swap by toggling `.hidden` — an abrupt cut. Content fetched on 4G shows a "Loading…"
string or empty space. Both read as cheap. Transitions and skeletons cost nothing in real speed but
transform the *felt* quality.

## What to build
1. **Transition system**: a small helper that animates screen changes (slide-in for forward navigation,
   slide-out/fade for back), driven through the existing screen-switcher. Forward vs. back direction is
   inferred from a tiny nav stack. CSS transform/opacity only.
2. **Shared-element feel** (lightweight): the answer card → result, or a browse card → quiz, animates
   with a subtle scale/position cue so the user's eye follows the action (no heavy FLIP if too costly;
   a tasteful cross-fade + scale is enough).
3. **Skeleton loaders**: shimmer placeholders matching the real layout for home browse rows, quiz
   question load, and journey stats — shown while data resolves, swapped for content on ready.
4. **Reduced-motion**: all transitions degrade to an instant, clean swap; skeletons stay (they're not motion-harmful).

## Acceptance Criteria
- [ ] Home→quiz→result→home transitions animate with correct forward/back direction
- [ ] No white flash or abrupt cut between screens
- [ ] Browse rows, quiz load, and journey show skeleton shimmer, not blank/"Loading…"
- [ ] `prefers-reduced-motion`: transitions become instant swaps, no parallax/slide
- [ ] 60fps on a mid Android; no layout thrash (transform/opacity only, `will-change` used sparingly)
- [ ] Works at phone/tablet/laptop widths (E-002)

## Technical Notes
- Centralize in the screen-switcher (where `state.currentScreen` is set, `app-core.js`). Add
  `navigateTo(screen, {direction})`; keep a small history array for back-direction inference.
- Skeletons: reuse existing card markup with a `.skeleton` modifier class + a shimmer keyframe; render
  them in `_renderHome` before data, replace on ready. Same for quiz question and journey.
- Avoid animating `height`/`top`/`left`; use `transform: translateX/scale`. Pre-render the incoming
  screen off-canvas, then transform in.

## Files to Touch
- `app/ui/js/app-core.js` — `navigateTo` transition helper + nav history
- `app/ui/js/app-home.js`, `app/ui/js/app-quiz.js` — emit skeletons before data
- `app/ui/css/styles-app.css` (or `styles-base.css`) — transition classes, shimmer keyframes, skeleton styles

## Definition of Done
Moving through the app feels like one continuous, premium surface and nothing ever pops from blank.
Commit transitions and skeletons as two atomic steps; verify reduced-motion in both.
