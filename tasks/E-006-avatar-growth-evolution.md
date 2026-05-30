# E-006: Donnibo Avatar Growth — 6-Stage Evolution

**Priority:** P1 (Identity) | **Force:** Identity | **Type:** UI+JS+asset | **Complexity:** L | **Status:** Pending
**Session:** E3 · **Depends on:** E-005 (level drives stage) · **Implements P3-T004 · Closes BUG-010**

## Goal
Deliver the headline promise — **"See yourself grow."** The Donnibo avatar **visibly evolves through
6 stages** as the kid levels up. The character becomes the kid's identity in the app: the reason the
header is worth looking at, the thing they screenshot, the self they don't want to abandon.

## Why
This is the emotional core of the brand (locked strategic decision: 6-stage growth system, journey
replay, "user sees themselves growing"). It's currently unbuilt (BUG-010 open, avatar shows a "?"
placeholder). Without it, "see yourself grow" is a tagline with no referent.

## What to build
1. **6 avatar stages** as inline/loadable **SVG** (design assets live in `design/`; coordinate with the
   Donnibo SVG set). Stage = function of level from E-005, e.g. L1–4 → stage 1 … L25+ → stage 6.
   Each stage is a clear visual upgrade (size, gear, aura/expression) — readable at 32px in the header.
2. **Avatar everywhere it matters**: header ring (replace the "?" placeholder), level-up overlay,
   result screen, and the Journey profile (E-007).
3. **Stage-up moment**: crossing into a new stage (not every level) triggers a bigger reveal —
   "Donnibo evolved!" — the rare, high-value celebration.
4. **Graceful fallback**: if an SVG asset is missing, show the initial-letter avatar (current behavior),
   never a broken image. Lazy-load stage SVGs so home stays fast on 4G.

## Acceptance Criteria
- [ ] Avatar SVG renders in the header at the correct stage for the user's level
- [ ] Six visually distinct stages, each legible at 32px and crisp at profile size
- [ ] Crossing a stage boundary fires a one-time "evolved" reveal (distinct from E-005 level-up)
- [ ] Missing asset → falls back to initial-letter avatar, no broken image, no console error
- [ ] Stage SVGs lazy-loaded; no measurable home TTI regression on a mid Android/4G
- [ ] Looks correct on phone / tablet / laptop (E-002 sizes)

## Technical Notes
- New `avatar.js`: `stageFromLevel(level)`, `renderAvatar(el, level, size)`. Pull `level` from
  `xp.levelFromXP(getTotalXP())`.
- Replace `#user-avatar` "?" in `screen-home.html` via `renderAvatar` in `_renderHome` (`app-home.js`).
- Keep the existing `avatar-ring-wrap` / `avatar-ring-fill` — avatar sits inside the level ring so
  identity (avatar) and progress (ring) are one glanceable unit.
- Assets: prefer 6 standalone SVG files in `app/ui/assets/avatar/stage-1..6.svg`, fetched on demand and
  cached by the service worker. Inline only the current stage to keep DOM light.
- This **supersedes P3-T004** and **closes BUG-010** — update both when done.

## Files to Touch
- New: `app/ui/js/avatar.js`, `app/ui/assets/avatar/stage-1..6.svg` (+ SW cache entry)
- `app/ui/js/app-home.js` — render avatar at stage in header
- `app/ui/screens/screen-home.html` — avatar mount point (already present)
- `app/ui/css/styles-app.css` — avatar sizing, evolve reveal animation
- `sw.js` / manifest shard — cache avatar assets offline

## Definition of Done
A kid sees a tiny Donnibo in the header that is unmistakably *theirs*, and watching it evolve is a
reason to keep going. Commit the static avatar render first, then the stage-up reveal.
Update `tasks/P3-T004-*` and `bugs/BUG-010-*` to resolved.
