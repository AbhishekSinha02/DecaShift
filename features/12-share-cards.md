# Feature: Share Cards (Achievement Images)

## Overview
Turns a milestone into a branded 1080×1080 PNG image a parent can forward in a WhatsApp group. The card shows the user's current Donnibo avatar, a headline, a key stat, and the app wordmark. Rendered entirely via HTML5 Canvas — no server, no external service. Works offline. Pure client-side PNG export.

---

## User Flows

### Flow 1: Sharing a Quiz Result

**Entry point:** User completes a quiz → Result screen → taps "Share Result."

1. `ShareCard.render({ type: 'score', ... })` is called with:
   - Current level (for avatar stage)
   - Headline: e.g., "12/15 on Grade 5 Math!"
   - Sub-text: e.g., "80% accuracy · Week 23, Tuesday"
   - Stat: score percentage
   - Accent colour: subject colour (blue for Math, green for Science, etc.)

2. **Canvas renders** (1080×1080 px):
   - Dark gradient background
   - Donnibo avatar (current stage SVG, fetched and drawn)
   - Headline text (large, bold)
   - Stat pill (e.g., "80%")
   - App wordmark "Donnibo" at bottom
   - User's first name (personalised)

3. **Share dialog**:
   - If `navigator.share` is available (Android / iOS): native share sheet opens with the PNG file + default text
   - If not (desktop): PNG is downloaded to the device as `donnibo-result.png` and text is shown for manual copy

---

### Flow 2: Sharing a Level-Up or Evolution

**Entry point:** Level-up celebration overlay → "Share your growth" button.

1. `ShareCard.render({ type: 'level', ... })` is called with:
   - New level number
   - New avatar stage name (e.g., "Fighter")
   - Headline: "I just evolved to Fighter on Donnibo!"
   - Accent: Donnibo violet (#7c3aed)

2. Canvas renders same layout with evolution-themed messaging

3. Share dialog as above

---

### Flow 3: Sharing a Journey Milestone

**Entry point:** Journey screen → "Share My Growth" button.

1. `ShareCard.render({ type: 'journey', ... })` called with lifetime stats
2. Card shows: avatar + total sessions + longest streak + level
3. Headline: "See yourself grow." (app tagline)
4. Share dialog opens

---

## Card Design Specifications

| Property | Value |
|---|---|
| Canvas size | 1080 × 1080 px (crisp at WhatsApp thumbnail) |
| Background | Dark gradient |
| Primary brand colour | Donnibo violet (#7c3aed) |
| Accent colour | Cyan (#22d3ee) or subject colour |
| Avatar position | Centre-top |
| Font | System fonts (canvas) |
| Wordmark | "Donnibo" — bottom centre |

---

## Avatar Rendering on Canvas

The stage SVGs have `viewBox` but no explicit `width`/`height`:
- On HTTPS: SVG is fetched, `width="400" height="400"` is injected, loaded via blob URL — ensures Firefox rasterises correctly
- On `file://` (local dev): SVG loaded directly into `<img>` — Chromium handles this fine
- On any failure: letter initial rendered as text fallback — canvas never breaks

---

## Why PNG, Not Screenshot

- Canvas export is cross-platform, same quality on every device
- No permission required (unlike screenshot APIs)
- Offline-capable (all assets are local)
- 1080×1080 ensures the card looks sharp whether shared full-size or as a WhatsApp thumbnail

---

## The Marketing Hook

Every share card is a viral acquisition channel:
- Parent shares in WhatsApp group → "My child got 80% on Grade 5 Math"
- Other parents see the card → "What app is this?" → install
- The avatar creates intrigue ("What stage is your child at?")

---

## Screens Involved
- `app/ui/js/sharecard.js` — ShareCard.render(), ShareCard.share(), canvas drawing helpers
- `app/ui/js/avatar.js` — Avatar.fileFor() for SVG path
- `app/ui/js/app-quiz.js` — "Share Result" button on result screen
- `app/ui/js/app-journey.js` — "Share My Growth" button
