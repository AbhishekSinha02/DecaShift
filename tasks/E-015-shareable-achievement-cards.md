# E-015: Shareable Achievement Image Cards

**Priority:** P1 (Belonging) | **Force:** Belonging | **Type:** JS+Canvas | **Complexity:** M | **Status:** ✅ Done (2026-05-30)
**Session:** E6 · **Depends on:** E-005/E-006/E-007 (level/avatar/journey) · Upgrades text shares to images

## Goal
Turn every milestone into a **shareable image** — a rendered card a parent forwards in a WhatsApp group.
Today's shares (D-004, D-016, E-007) are text; an image of the Donnibo avatar + level + stats is far
more viral and is the literal marketing asset the strategy calls for.

## Why
"My child reached Level 10 on Donnibo" as plain text is forgettable; as a polished branded card with the
evolving mongoose, it's the thing that gets screenshotted and spread. Word-of-mouth is the only growth
channel — this is its ammunition.

## What to build
1. **Canvas card renderer** (`sharecard.js`): draws a branded card to an offscreen `<canvas>` — Donnibo
   stage avatar (from `Avatar.fileFor`), the achievement headline (Level N / badge / streak), key stat,
   the "See yourself grow · Donnibo" wordmark, and subject/brand colours. Handles the SVG→canvas draw
   (load avatar SVG into an Image, draw it).
2. **Three card types**, one renderer parametrised:
   - **Level/Evolution** ("Aarav reached Level 10 — Champion!")
   - **Journey** (avatar + level + streak + accuracy — replaces E-007's text share)
   - **Badge/Milestone** ("7-day streak unlocked 🔥")
3. **Export**: `navigator.share({ files: [pngBlob] })` where supported (`navigator.canShare`), else a
   PNG download + WhatsApp text fallback (reuse D-004 path).
4. **Hook points**: the evolution overlay (E-006), the Journey share button (E-007), and the milestone/
   badge celebrations — each gets a "Share card" action that renders + shares.

## Acceptance Criteria
- [ ] A canvas renders a branded card with the correct stage avatar, headline, and stat
- [ ] Three parametrised variants (level/evolution, journey, badge) from one renderer
- [ ] Share uses `navigator.canShare({files})` when available; PNG download + text fallback otherwise
- [ ] Journey share button now produces an image (supersedes the E-007 text-only share)
- [ ] Avatar SVG draws correctly into the canvas (no blank/broken avatar); graceful if it fails to load
- [ ] Card legible at WhatsApp thumbnail size; brand colours + wordmark present
- [ ] No external libs (pure canvas), GitHub-Pages safe, works offline

## Technical Notes
- New `sharecard.js`: `render({type, level, stat, headline}) → Promise<Blob>`, `share(blob, text)`.
- Drawing an SVG to canvas: `const img = new Image(); img.src = Avatar.fileFor(level);` then
  `ctx.drawImage` on load — wrap in a Promise; fall back to a coloured circle + letter if it errors.
- Replace `_shareJourney` (text) in `app-journey.js` with the image path; keep text as the fallback body.
- Fixed card size (e.g. 1080×1080 for crisp WhatsApp) scaled down for preview.

## Files to Touch
- New: `app/ui/js/sharecard.js`
- `app/ui/js/app-journey.js` — Journey share → image card
- `app/ui/js/app-home.js` — "Share card" on evolution / milestone overlays
- `app/ui/index.html` — load `sharecard.js`
- `app/ui/css/styles-app.css` — share-preview / button styling

## Definition of Done
Every milestone can be shared as a polished branded image with the Donnibo avatar — the asset that
spreads the app. Commit the renderer first (with a download), then wire share + the celebration hooks.
