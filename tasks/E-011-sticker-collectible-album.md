# E-011: Sticker / Collectible Album

**Priority:** P1 (Reward) | **Force:** Reward | **Type:** UI+JS | **Complexity:** L | **Status:** ✅ Done (album + NEW ribbon)
**Session:** E5 · **Depends on:** E-010 (collectibles store) · **Lives in:** the Journey screen (E-007)

## Goal
Give the collectibles a home: a **sticker album** in My Journey where kids see what they've collected
and — crucially — the **empty slots** for what they haven't. Collect-the-set is one of the strongest
completion drivers in kids' products (Panini, Pokémon, Prodigy). The gaps are the engine.

## Why
A reward you can't display isn't a trophy. The album turns one-off box rewards into an ongoing
collection goal, and the locked silhouettes create the "I need that one" pull that brings kids back.

## What to build
1. **Album section** in `screen-journey.html` (new `#journey-album` slot, rendered by `app-journey.js`):
   a grid of all stickers in `Collectibles.POOL` — owned ones in full colour, unowned as greyed
   silhouettes with a lock, grouped or sorted by rarity.
2. **Collection progress**: header count (`Stickers 4/12`) + a subtle rarity legend (common/rare/epic).
3. **Sticker detail**: tapping an owned sticker shows its name + how it's earned; tapping a locked one
   shows a hint ("Earned from a 14-day streak box").
4. **New-sticker flag**: a sticker earned since last album view shows a "NEW" ribbon until seen
   (`donnibo_stickers_seen`).
5. Optional polish: a "set complete" celebration (Feedback.confetti) when the last sticker of a rarity
   tier is collected.

## Acceptance Criteria
- [ ] Journey shows an album grid of the full pool; owned = colour, unowned = locked silhouette
- [ ] Collection count + rarity grouping correct from `Collectibles.owned()`
- [ ] Tapping owned → name + source; tapping locked → earn hint
- [ ] Newly earned stickers show a NEW ribbon until the album is opened, then clear
- [ ] Renders offline; responsive (phone 2–3 col, tablet/laptop more) using E-001/E-002 tokens
- [ ] No duplicate source-of-truth: pool + ownership come only from `collectibles.js`

## Technical Notes
- Pure render off `Collectibles` (built in E-010). Add `_renderJourneyAlbum()` in `app-journey.js`,
  called from `_renderJourney()` after badges.
- Reuse the `.badges-grid` / `.badge-cell.locked` CSS language for visual consistency, or a sibling
  `.album-grid`.
- `Collectibles` should expose `bySeen()` / `markAllSeen()` for the NEW-ribbon logic.

## Files to Touch
- `app/ui/screens/screen-journey.html` — `#journey-album` slot
- `app/ui/js/app-journey.js` — `_renderJourneyAlbum`, NEW-ribbon handling
- `app/ui/js/collectibles.js` — `bySeen`, `markAllSeen`, rarity metadata (extend E-010)
- `app/ui/css/styles-app.css` — album grid, locked silhouette, NEW ribbon, rarity tints

## Definition of Done
The kid opens Journey and sees a collection they're proud of and a set they want to complete. Commit
the album grid first, then the NEW-ribbon + set-complete polish.
