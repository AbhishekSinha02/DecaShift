# Feature: Avatar Evolution (Donnibo)

## Overview
The user's visual identity in the app. A mascot character ("Donnibo") that physically evolves as the user gains levels. Six stages from Spark to full Donnibo. The avatar appears in the header chip, the Journey screen, share cards, and the collectibles album. Parents see it change — it's a visible growth signal.

---

## User Flows

### Flow 1: Seeing Your Avatar

**Entry point:** Any authenticated screen.

1. **Header chip** (top-right): small circular avatar thumbnail — shows current stage SVG or letter fallback
2. **Home screen**: avatar thumbnail visible in greeting area
3. **Journey screen**: full-size avatar with level ring around it, stage name below

---

### Flow 2: Avatar Evolves (Level-Up)

**Entry point:** User earns enough XP to cross a level threshold that also crosses a stage boundary (Level 3, 6, 10, 15, or 21).

1. Level-up celebration fires (see Feature 07, Flow 2)
2. **If the new level is a stage boundary**:
   - Avatar image on screen transitions to the new stage SVG
   - Announcement: "You're now a Fighter!" (or whichever stage name)
   - New stage name appears below avatar on Journey screen
3. Header chip updates immediately to show new avatar

---

### Flow 3: Viewing Avatar in Journey

**Entry point:** User opens "My Journey."

1. Full-size avatar is displayed (400×400 SVG rendered into an `<img>`)
2. **Level progress ring** circles the avatar, filling based on `xpIntoLevel / xpForNext`
3. **Stage name** shown below: e.g., "Rookie"
4. If SVG fails to load (offline / slow connection): a letter avatar with gradient fallback shows instead — never a broken image

---

## The Six Stages

| Stage | Level Unlock | Stage Name | Character Feel |
|---|---|---|---|
| 1 | Level 1 | Spark | Small, curious, just beginning |
| 2 | Level 3 | Pup | Growing, energetic |
| 3 | Level 6 | Rookie | Confident, learning fast |
| 4 | Level 10 | Fighter | Determined, capable |
| 5 | Level 15 | Champion | Skilled, recognised |
| 6 | Level 21 | Donnibo | Full evolution — the mascot's true form |

---

## SVG Files

Stored in `assets/avatar/`:
- `stage-1-spark.svg`
- `stage-2-pup.svg`
- `stage-3-rookie.svg`
- `stage-4-fighter.svg`
- `stage-5-champion.svg`
- `stage-6-donnibo.svg`

All SVGs have a viewBox but no explicit width/height — the loader injects `width="400" height="400"` when rendering to canvas (for share cards) to ensure cross-browser rasterisation.

---

## Fallback Behaviour

The app never shows a broken image:
- On `<img>` load error: the `onerror` handler removes the `<img>` element
- The letter avatar (first initial + gradient circle) underneath shows through
- This ensures the avatar always looks intentional, even on slow 4G

---

## Avatar in Share Cards

When a user generates a share card (Feature 12), the card includes their current avatar stage:
- SVG is fetched, sized, and drawn onto an HTML5 Canvas
- Results in a 1080×1080 PNG — crisp at WhatsApp thumbnail and full-size
- If avatar fetch fails: a text initial renders as fallback on the canvas

---

## Collectible Expression Variants

Separate from the evolution stages, Donnibo has 7 expression stickers (Feature 11):
- Chill · Thinking · Sleepy · Oops · Victory · On-Fire · Level-Up
- These are earned via the mystery box and sticker album — they are collectibles, not the user's identity avatar

---

## Screens Involved
- `app/ui/js/avatar.js` — STAGES, stageFromLevel(), mount(), fileFor()
- `app/ui/js/app-journey.js` — renders avatar on Journey screen
- `app/ui/js/sharecard.js` — draws avatar to canvas for PNG export
- `app/ui/js/app-home.js` — `_renderAvatar()` updates header chip
- `assets/avatar/` — stage SVG files
