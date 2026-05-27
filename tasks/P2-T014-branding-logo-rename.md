# Feature: Branding — Visual Identity, Logo & App Hook

**Priority:** P2 | **Type:** Design | **Complexity:** M | **Status:** Pending

---

## The Brand Direction

DecaShift's brand identity is not an animal. It is not an abstract lettermark.
It is a human figure, growing.

The logo is the journey. A progression of five silhouettes — left to right —
each slightly taller, slightly more open, slightly more certain than the one before.
No text required. Anyone who sees it understands immediately what this product does.

---

## Brand Story

**"Deca"** = 10 — ten stages, ten transformations, ten weeks to a different student.
**"Shift"** = the visible change — the posture, the expression, the confidence.

The name stops being abstract the moment you see the logo. That is the test of
a good brand: the visual makes the words make sense.

---

## Tagline

**Primary:**
> *"See yourself grow."*

Three words. Works for a seven-year-old ("my character gets cooler") and for a parent
reading the App Store listing ("my child will build confidence"). It is the product
promise, the feature description, and the emotional aspiration in one line.

**Secondary (marketing / landing page):**
> *"From nervous to unstoppable — one streak at a time."*

This line is for parents. It names the fear they recognise in their child and the
destination they want for them, without false promise. "One streak at a time" is honest.

**Tertiary (for parents sharing a screenshot of their child's avatar):**
> *"This is what 30 days looks like."*

---

## Logo Concept

### The Progression Arc
Five silhouettes in a horizontal row. Each is the same figure — same child —
at a different stage of their growth journey.

```
  ░      ▒▒     ▓▓▓    ████   █████
  │      │▒     │▓▓    │███   │████  ← glow widens
  ┘      ┘▒     ┘▓▓    ┘███   ┘████
 small   ▲      ▲      ▲      ▲
hunched  upright  open  tall  arrived
```

- Left figure: slightly hunched, small, arms close
- Right figure: full height, open posture, subtle glow behind
- The five figures are the same width — the difference is entirely in posture and light
- Drawn in a single continuous line style (one weight, clean strokes)

### The Mark (compact version)
For favicon, PWA icon, app chip: the leftmost and rightmost silhouette only —
small hunched figure → tall confident figure. An arrow of human growth.
Inside a soft rounded square. Works at 16px and 512px.

### Colour Usage on Logo
- Monochrome version: works in white on dark, charcoal on light
- Full version: right figure has the warm amber glow (`#d97706`) — accent is earned, not applied to all

---

## Typography

| Use | Font | Weight |
|---|---|---|
| Wordmark "DecaShift" | Syne | 700 Bold |
| Tagline | Syne | 400 Regular |
| Stats / scores / timer | DM Mono | 400 |
| Body text | System sans (Inter / -apple-system) | 400 |

The wordmark sits below the progression arc, not beside it.
The arc stands alone. The name supports it.

---

## Colour System (Refined from Brand Direction)

```css
:root {
  /* Brand core */
  --brand-dark:    #0f1117;   /* app background, authority */
  --brand-surface: #1a1d27;   /* card surfaces */
  --brand-accent:  #3b82f6;   /* interactive, progress */
  --brand-earned:  #d97706;   /* amber — the glow colour; only used on earned states */
  --brand-growth:  #22c55e;   /* correct answers, streaks, milestones */

  /* Avatar stage glow sequence */
  --glow-0: none;
  --glow-1: none;
  --glow-2: rgba(217,119,6, 0.12);   /* barely there */
  --glow-3: rgba(217,119,6, 0.30);   /* visible */
  --glow-4: rgba(217,119,6, 0.55);   /* clear */
  --glow-5: rgba(217,119,6, 0.85);   /* arrived */
}
```

The amber glow colour (`--brand-earned`) only ever appears when something is earned.
It never decorates. This makes every instance of amber feel meaningful.

---

## Where the Brand Lives

| Surface | Brand element |
|---|---|
| Browser tab favicon | Compact mark (two silhouettes, rounded square) |
| PWA home screen icon | Same mark, 192×192 and 512×512 |
| Landing page hero | Full five-silhouette progression arc + tagline |
| App header | Wordmark "DecaShift" only (no icon, gives header space) |
| Result screen (high score) | Compact mark animates briefly on achievement |
| Social share / OG image | Progression arc + "See yourself grow." on dark background |
| Loading screen | Stage 0 silhouette → Stage 5 silhouette crossfade loop |

---

## The Avatar IS the Brand

The character in P3-T004 (Avatar Growth System) is not a separate product feature.
It **is** the brand made interactive. The logo is the static version of what the avatar
does dynamically. They are the same visual idea at different fidelities:

```
Logo           →   Avatar on screen   →   Journey Replay
Static arc     →   Current stage      →   Arc animated in 8 seconds
```

This means: once the avatar SVG is designed (P3-T004), the logo is derived from it —
not designed separately. Stage 0 and Stage 5 of the avatar silhouette, extracted and
placed side by side with the three intermediate stages = the logo.

Design the avatar first. The logo follows.

---

## What to Commission / Build

1. **Avatar SVG** (P3-T004 first) — the five-stage character illustration
2. **Logo SVG** — extracted from avatar stages 0, 1, 2, 3, 5; composed as progression arc
3. **Favicon ICO / PNG** — compact two-silhouette mark at 16, 32, 192, 512px
4. **OG image** — 1200×630px: dark background, full arc, tagline in Syne
5. **manifest.webmanifest** — icons array updated

---

## Brief for Designer / Illustrator

```
Style:      Clean line illustration, single stroke weight, no fills except glow
Character:  Gender-neutral by default, slight lean toward school-age child
Posture arc: 5 poses — hunched → upright → open → tall → arrived
Expression: Minimal — eyes only carry the emotion (closed/narrow → wide/forward)
Props:      Pencil (stage 0) → book (stage 2) → books (stage 4) → nothing needed (stage 5)
Background: None in logo; soft radial glow (amber) only on stage 4–5
File:       SVG, layers named by stage, ready for CSS animation
Size:       Avatar canvas 200×280px; logo canvas 600×120px
```

---

## Acceptance Criteria
- [ ] Avatar SVG designed with all 5 stages as named layer groups (P3-T004 drives this)
- [ ] Logo SVG composed from avatar stage silhouettes
- [ ] Favicon (16×16, 32×32, 192×192, 512×512) generated from compact mark
- [ ] `manifest.webmanifest` updated with icons array
- [ ] OG image created (1200×630px) with tagline
- [ ] Landing page `<title>`: "DecaShift — See yourself grow"
- [ ] Landing page `<meta name="description">` updated with parent-facing hook
- [ ] Logo renders correctly in dark mode, light mode, and student (warm) theme
- [ ] No external image requests — all assets inline SVG or local files

## Files to Touch
- New: `app/ui/assets/logo.svg`
- New: `app/ui/assets/favicon.ico`, `favicon-192.png`, `favicon-512.png`
- New: `app/ui/assets/og-image.png`
- `app/ui/index.html` — title, meta description, og tags, logo img src
- `app/ui/manifest.webmanifest` — icons array
- `app/ui/styles.css` — logo sizing in header

## Dependencies
- **P3-T004 (Avatar Growth System) — design the avatar first; logo is derived from it**
- P2-T023 (cross-page UI consistency — branding anchors land here)
- P3-T012 (student theme — avatar glow palette aligns with warm theme accent)

## Confidence Score Impact
Improves Parameter 3 (Visual Identity): 3/10 → 9/10
The brand is no longer abstract. It is the product's core promise made visible.
