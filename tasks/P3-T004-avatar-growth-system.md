# Feature: Avatar Growth System — See Yourself Grow

**Priority:** P3 → elevated to near-P2 | **Type:** Core Identity / Engagement | **Complexity:** L | **Status:** Pending

> This is not a cosmetic feature. It is the emotional core of the product.
> Every other engagement mechanic (streaks, badges, weekly tests) feeds this.
> A child who sees themselves growing will never stop opening the app.

---

## The Concept

The avatar is not a mascot. It is the user.

It starts fearful — wide eyes, hunched back, pencil gripped too tight. Over weeks of
consistent practice, posture straightens, expression opens, props accumulate, a glow
grows behind them. By Stage 5 the character radiates a quiet confidence that is
unmistakably earned, not gifted.

Changes are **minute and deliberate** — never announced with a pop-up. The child opens
the app one morning and notices something is different. That moment of recognition is
the product's highest value event.

---

## The Six Stages

```
Stage 0 — "The First Day"          (Day 0)
  Posture:    Slightly hunched, weight on one foot
  Expression: Wide eyes, uncertain — "I don't know if I can do this"
  Props:      One pencil, held stiffly
  Clothing:   Casual, slightly rumpled
  Glow:       None
  Title:      [First name]

Stage 1 — "Showing Up"             (Streak 7)
  Posture:    Marginally more centred — barely noticeable
  Expression: Eyes less wide, mouth neutral — not scared, not yet smiling
  Props:      Pencil held naturally; a small badge appears on the bag strap
  Clothing:   Same clothes, but slightly neater
  Glow:       None — too early
  Title:      Explorer

Stage 2 — "Finding the Rhythm"     (Streak 21)
  Posture:    Upright now, shoulders level
  Expression: Small, private smile — "I think I'm getting it"
  Props:      Book open in one hand; two subject badges on the bag
  Clothing:   Shirt tucked. One subject pin on collar
  Glow:       Faint warmth behind the figure — barely there
  Title:      Learner

Stage 3 — "The Turning Point"      (Streak 45)
  Posture:    Tall, weight evenly balanced, head level
  Expression: Real smile, eyes forward not down
  Props:      Stack of two books under one arm; subject badges on chest
  Clothing:   Clean, intentional — looks like someone who means to be here
  Glow:       Visible but soft — like afternoon light
  Title:      Scholar

Stage 4 — "Confident"              (Streak 90)
  Posture:    Open stance, relaxed but strong
  Expression: Calm, certain — "I've got this"
  Props:      Books in bag, one notebook open, subject badges ringing the chest
  Clothing:   Neat, a subtle insignia on the sleeve
  Glow:       Clear and warm — unmistakably present
  Title:      Achiever

Stage 5 — "The Shift"              (Streak 180)
  Posture:    Fully open — the character takes up their space
  Expression: The rarest expression in illustration: earned calm. Not triumphant. Arrived.
  Props:      Everything accumulated; the bag is light because knowledge is internal now
  Clothing:   All subject badges in place, slight radiance in the uniform
  Glow:       Full — rings the figure like a scholar's aura
  Title:      DecaShifter
```

**The highest title a student can earn is the product's own name.**
That is intentional brand building embedded in the core mechanic.

---

## The Journey Replay

**Every stage the user has lived through is remembered.**

From the profile screen: a single button — **"▶ Watch your journey"**

A 6–10 second animation plays inline — no modal, no new screen. The avatar on the
profile card morphs through every stage the child has reached, holding each for
~1.5 seconds, with a smooth SVG transition between them. A timeline bar beneath
shows the date each stage was reached.

```
[Stage 0]  →  [Stage 1]  →  [Stage 2]  →  [Stage 3]   →  [Today]
  Day 1        Day 8         Day 22         Day 47       Day 63 ▸
```

The replay is not about the destination. It is about making the journey *visible*.
A child who replays this once will replay it again. A parent who sees it will share it.

**Also triggered automatically:**
- On every 30-day login anniversary — soft banner: "You've been learning 30 days.
  Watch what changed." → replay plays
- On every stage transition — next time the user opens the app after earning a new
  stage, the avatar gently shimmers into the new state. No pop-up. No confetti.
  The change just settles in, like something real.

---

## SVG Layer Architecture

One base SVG. Six states. CSS transitions between them. No separate image files.

```svg
<svg class="avatar" data-stage="2" data-skin="warm" data-hair="style-b">

  <!-- Layer 1: Background glow — opacity + radius tied to stage -->
  <ellipse class="avatar-glow" />

  <!-- Layer 2: Body / posture — 6 keyframe poses via CSS class swap -->
  <g class="avatar-body" />

  <!-- Layer 3: Face / expression — eyes + mouth, 6 states -->
  <g class="avatar-face" />

  <!-- Layer 4: Clothing — base + stage-dependent neatness layers -->
  <g class="avatar-clothing" />

  <!-- Layer 5: Props — pencil → book → books → notebook (additive) -->
  <g class="avatar-props" />

  <!-- Layer 6: Subject badges — each badge is a hidden <g>, shown when earned -->
  <g class="avatar-badges">
    <g class="badge-math"    data-earned="false" />
    <g class="badge-science" data-earned="false" />
    <g class="badge-hindi"   data-earned="false" />
    <g class="badge-french"  data-earned="false" />
  </g>

</svg>
```

Stage change: swap `data-stage` attribute → CSS transitions animate each layer.
Replay: JS cycles `data-stage` from 0 → current with `setTimeout(1500ms)` delays.

---

## Subject Badge System

Badges accumulate silently on the avatar as the student completes subject milestones.
They are centimetre-sized in the illustration — details, not trophies.

| Subject | Badge | Placement |
|---|---|---|
| Mathematics | ∑ pin | Collar |
| Science | Tiny flask | Bag strap |
| Hindi | Script motif | Notebook cover |
| French | Fleur emblem | Pen clip |
| English | Open book | Sleeve patch |
| GK | Globe | Bag front pocket |

A student with all six badges looks visibly different from one with only two.
Parents can count them.

---

## Personalisation (Set Once, Never Regresses)

These choices are made at signup and stay fixed — only the growth layers evolve:

- **Skin tone:** 5 options (CSS variable `--avatar-skin`)
- **Hair style:** 4 options (which SVG `<g>` is visible)
- **Gender expression:** 2 options (slight clothing + hair variation, same growth arc)

No face uploads. No photo storage. All SVG, all local.

---

## Ghost Preview (Next Stage Tease)

Below the avatar on the profile screen, a blurred silhouette of the next stage:

```
[Current avatar — clear]

    ░░ 12 streak days until your next shift ░░
    [Next stage — blurred/ghosted outline]
```

The ghost is just the `data-stage + 1` SVG at 15% opacity with a blur filter.
No extra assets. Pure CSS. Extremely effective.

---

## Where the Avatar Appears

| Location | Size | Notes |
|---|---|---|
| Profile screen | 240×300px | Full figure, main view. Journey Replay button here. |
| Home screen chip | 48×48px | Cropped to face/head region of the SVG |
| Quiz screen header | 36×36px | Subtle presence — reminds them who is doing this |
| Result screen | 80×80px | Full figure, slightly animated on high score |
| Streak milestone | 160×200px | Featured prominently on 7/30/90 day streak cards |

---

## Acceptance Criteria

### Stage System
- [ ] Six stage states defined in SVG with all layer variants
- [ ] Stage derived from streak count in `_getAvatarStage(streakDays)`
- [ ] Stage transitions are CSS animated, not instant swaps
- [ ] Stage does not regress if streak is broken (it represents peak, not current)
- [ ] Title ("Explorer" → "DecaShifter") updates with stage

### Journey Replay
- [ ] "▶ Watch your journey" button visible on profile screen
- [ ] Replay animates through all historically reached stages in order
- [ ] Timeline bar shows dates beneath the avatar during replay
- [ ] Replay auto-triggers on 30-day anniversary with soft banner
- [ ] Stage transition shimmer plays on next open after earning new stage
- [ ] Replay is smooth on low-end mobile (no dropped frames — CSS only)

### Personalisation
- [ ] Skin tone selector at signup (5 options)
- [ ] Hair style selector at signup (4 options)
- [ ] Gender expression option at signup
- [ ] Selections persisted in user profile, synced to Drive

### Subject Badges
- [ ] Badges appear on avatar when subject milestone reached (N questions correct)
- [ ] Badge milestone thresholds defined per subject
- [ ] All 6 badges can coexist visually without clutter

### Ghost Preview
- [ ] Blurred next stage shown below current avatar on profile
- [ ] "N streak days until your next shift" count is accurate
- [ ] Ghost hidden at Stage 5 (no next stage)

### Performance
- [ ] Full avatar SVG < 20KB gzipped
- [ ] Replay animation runs at 60fps on a mid-range Android
- [ ] No network calls — entirely local SVG + CSS

---

## Stage History Storage

```js
// Stored in user profile (lightweight — just integers + dates)
user.stageHistory = [
  { stage: 0, date: "2026-03-01" },
  { stage: 1, date: "2026-03-08" },
  { stage: 2, date: "2026-03-22" }
]
user.avatarStage   = 2          // current (highest reached)
user.avatarSkin    = "warm"     // personalisation
user.avatarHair    = "style-b"
user.avatarGender  = "neutral"
```

---

## Files to Touch
- New: `app/ui/assets/avatar.svg` — the full layered SVG
- New: `app/ui/assets/avatar.css` — stage transitions, badge reveal, glow, replay animation
- `app/ui/app.js` — `_getAvatarStage()`, `_renderAvatar()`, `_playJourneyReplay()`,
  badge milestone checks, 30-day anniversary trigger
- `app/ui/index.html` — avatar placement on profile, home chip, quiz header, result screen
- `app/ui/styles.css` — avatar sizing per screen, ghost preview styles

## Dependencies
- P3-T001 (streak tracking — done; avatar stage is derived from streak days)
- P3-T005 (gamification badges — subject badges live on the avatar, not a separate system)
- P2-T014 (branding — avatar is the brand; logo silhouette is derived from Stage 0 → Stage 5)
- P3-T012 (colorful student theme — avatar glow palette adapts to active theme)
