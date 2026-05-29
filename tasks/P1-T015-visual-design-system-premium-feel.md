# Feature: Visual Design System — Premium Feel at ₹79

**Priority:** P1 | **Type:** Visual Design | **Complexity:** L | **Status:** Pending

> "I want to make my user feel rich experience with small price."
> The product must look like it costs 10× what it does.
> This is not optional polish — it is the primary marketing asset.

---

## The Problem

Current state: functional, mediocore college-project UI. Symptoms:
- All cards look the same (flat border, same radius, same padding)
- Typography is one weight, one size — no hierarchy
- Colors are generic (accent blue, dark background) — no personality
- Stats are plain numbers — no visual encoding of progress
- Buttons are rectangles — no character, no delight
- No micro-interactions — tapping feels dead
- Empty states are just text — no warmth
- The streak counter is a number — it should feel like an achievement

A student using this app should feel like they're using something better than what their school
provides. A parent paying ₹79/month should never feel buyer's remorse.

---

## Design Principles to Apply

### 1. Visual Hierarchy — 3 Clear Levels
Every screen must have exactly three text levels:
- **Display** (24–32px, Syne 800) — the one thing the user must notice
- **Body** (14–15px, Inter 400/500) — readable content
- **Caption** (11–12px, Inter 400) — metadata, labels, secondary info

Never use Syne at small sizes (below 16px) — it's a display font, not a body font.
Add Inter to the font stack for body text.

### 2. Color = Emotion
- 🔥 **Streak / urgency** → amber/orange gradient (`#f59e0b → #ef4444`)
- ✅ **Correct / success / done** → green (`#22c55e`)
- 📖 **Learning / content** → accent blue (`#3b82f6`)
- ⭐ **Achievement / milestone** → gold (`#fbbf24`)
- 🌐 **GK / world** → teal (`#14b8a6`)
- Neutral text → `#f1f5f9` (text) / `#94a3b8` (muted)

### 3. Cards — Depth and Character
Every card must feel dimensional:
- Base: `background: var(--surface)`
- Hover/active: subtle lift (`transform: translateY(-2px)`)
- Important cards: gradient left border or gradient top bar (3px)
- Completed state: green left border + slightly transparent
- Locked/past state: reduced opacity + grayscale filter

### 4. Micro-interactions (every tap must respond)
- Answer card tap: instant background flash (100ms), then settle to selected state
- Correct answer: green pulse animation
- Wrong answer: red shake animation (3 oscillations, 300ms)
- Streak increment: counter animates +1 with bounce
- Tab switch: content fades in (100ms)
- Button press: `transform: scale(0.97)` while held

### 5. Progress is Visual, Not Numerical
- Streak: circular progress ring around avatar (fills as days go)
- Accuracy: thin horizontal bar under stat number, colored by score
- Session completion: animated progress bar fill + completion burst
- Weekly goal: ring fills Monday → Friday

---

## Specific Components to Redesign

### Streak Counter
```
Before: "🔥 12  day streak"

After:  [Avatar with circular progress ring, 12/7 filled arc]
         "12-day streak 🔥"  [animated +1 on increment]
         "Best: 18 days"  [in muted, smaller]
```

### Day Card (This Week)
```
Before: Plain card with title, description, button

After:  Card with:
        - Left border: gradient (blue → accent if unstarted, green if done)
        - Top-left "Day 1" chip — colored pill
        - Title: bold, 16px
        - Progress: "5 / 10 Q" as a mini bar, not text
        - CTA button: full-width at bottom, rounded pill shape
        - Done state: green left border, checkmark overlay top-right
```

### Goal Card (Practice Sets)
```
Before: White/dark card with title, count, button

After:  Card with:
        - Subject color accent (Math = blue, Science = green, etc.)
        - Subject icon (📐 Math, 🔬 Science, 📜 History)
        - "Last score: 7/10" as a colored bar not text
        - "Restart" vs "Start" visually distinct (ghost vs primary)
```

### Stats Row
```
Before: 3 numbers in a row (Sessions / Avg Accuracy / Practiced)

After:  3 colored mini-cards:
        [📊 Sessions: 47] [🎯 Accuracy: 76%] [⏱ Practiced: 4h 20m]
        Each with a thin colored bottom border (blue / green / amber)
```

### Answer Cards (Quiz)
```
Before: Border div with label + text

After:  Cards with:
        - A/B/C/D pill label — colored circle left side
        - Text: Inter 15px, generous padding
        - Selected: accent border + light background tint
        - Correct: green background fade-in + ✓ icon appears
        - Wrong: red background + X icon, correct one highlights green
        - Transition: 150ms ease, not instant
```

### Buttons
```
Before: Rectangular, single color

After:
  Primary: gradient (`var(--accent) → slightly darker`), border-radius: 12px,
           box-shadow: 0 4px 12px rgba(accent, 0.3), subtle shine overlay
  Ghost:   border only, no background, text = accent color
  Danger:  red gradient for destructive actions
  All:     min-height 44px (WCAG touch target)
```

---

## Typography Scale to Implement

```css
/* Add to :root */
--font-body: 'Inter', 'Nunito', sans-serif;

/* Scale */
.text-display  { font-size: 28px; font-weight: 800; font-family: var(--font-head); }
.text-heading  { font-size: 20px; font-weight: 700; font-family: var(--font-head); }
.text-title    { font-size: 16px; font-weight: 700; font-family: var(--font-head); }
.text-body     { font-size: 14px; font-weight: 400; font-family: var(--font-body); }
.text-body-med { font-size: 14px; font-weight: 500; font-family: var(--font-body); }
.text-caption  { font-size: 12px; font-weight: 400; font-family: var(--font-body); color: var(--muted); }
.text-label    { font-size: 11px; font-weight: 600; font-family: var(--font-body);
                 text-transform: uppercase; letter-spacing: 0.6px; color: var(--muted); }
```

---

## Files to Touch

- `app/ui/styles.css` — full component redesign
- `app/ui/index.html` — add class names, restructure card markup where needed
- `app/ui/app-home.js` — update `_cardHtml()`, `_dayCardHtml()` with new markup
- `app/ui/app-quiz.js` — update answer card render with animation classes

---

## Acceptance Criteria

- [ ] Inter font loaded and applied to all body text
- [ ] Day cards have subject color accent + left border
- [ ] Stats rendered as colored mini-cards, not plain numbers
- [ ] Streak counter shows animated increment (not jump)
- [ ] Answer cards: correct = green fade, wrong = red shake
- [ ] All primary buttons have gradient + shadow
- [ ] Touch targets ≥ 44px everywhere
- [ ] Typography hierarchy visible: display → heading → body → caption clearly different
- [ ] Dawnbreak theme (kid grades) feels warm and energetic, not corporate
- [ ] Dark theme feels premium, not generic (depth, not flatness)
