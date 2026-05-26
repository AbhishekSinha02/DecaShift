# Feature: Branding, Logo & App Identity

**Priority:** P2 | **Type:** Design | **Complexity:** M | **Status:** Pending

## Goal
Give DecaShift a clear visual identity that communicates learning and growth to
new visitors — a logo, favicon, and potentially a more descriptive tagline or
sub-brand that makes the app immediately understandable.

## Problem
Current state:
- App name "DecaShift" is abstract — new users cannot tell it's a learning/quiz app
- Logo is a plain "DS" text box in a rounded rectangle — no visual distinctiveness
- No favicon — browser tab shows a blank icon
- No PWA app icon — home screen installs have no branding

## Options

### Option A — Add tagline + improve logo (minimal effort)
- Keep "DecaShift" name
- Replace "DS" with a simple icon (e.g., lightning bolt + book, or upward arrow)
- Add subtitle on landing page: "DecaShift — Daily Quizzes for Sharp Minds"
- Add favicon as a small version of the new icon

### Option B — Visual rebrand with SVG logo (medium effort)
- Commission or design an SVG logo file (brain/rocket/arrow motif)
- Use as favicon, PWA icon (192×192, 512×512), and `<meta og:image>`
- Update `manifest.webmanifest` to add icons array

### Option C — App rename + full rebrand (large effort)
- Rename to something more explicit: "QuickBrain", "SnapQuiz", "LevelUp"
- Update all HTML titles, meta tags, social preview image
- Risk: breaks existing bookmarks, backlinks

## Recommendation
**Option B** — Keep the "DecaShift" brand (already known to early users) but
create a real SVG logo that signals learning/growth. A favicon and PWA icon are
the minimum bar for feeling like a real product.

## Acceptance Criteria
- [ ] New logo SVG added to `app/ui/assets/logo.svg`
- [ ] Favicon added: `app/ui/favicon.ico` (32×32) and `favicon-192.png`
- [ ] `manifest.webmanifest` updated with `icons` array (192, 512 sizes)
- [ ] Landing page `<title>` and `<meta name="description">` updated
- [ ] Logo visible in both dark and light mode

## Files to Touch
- `app/ui/index.html` — update title, meta, img src for logo
- `app/ui/styles.css` — adjust logo sizing/spacing
- `app/ui/manifest.webmanifest` — icons array
- New: `app/ui/assets/logo.svg`, `favicon.ico`, `favicon-192.png`

## Confidence Score Impact
Improves Parameter 3 (Visual Identity & Branding): 3/10 → ~7/10
