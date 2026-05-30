# E-010: Mystery Reward Box on Milestones

**Priority:** P1 (Reward) | **Force:** Reward | **Type:** JS+UI | **Complexity:** M | **Status:** Pending
**Session:** E5 · **Depends on:** E-005 (XP), E-008 (confetti) · **Defines the collectible store E-011 surfaces**

## Goal
Turn milestones into **variable reward**: hitting a streak or level milestone opens a **mystery box**
that reveals one of several rewards (bonus XP, a streak freeze, or a collectible sticker). The "I never
know what I'll get" pull — the single cheapest dopamine mechanic we're missing.

## Why
Right now milestones fire a fixed celebration. Variable, surprising rewards are what keep kids tapping
(the slot-machine principle pointed at *learning effort*). It also creates the collectible economy that
E-011's sticker album displays.

## What to build
1. **Box trigger**: on crossing a **streak milestone** (7/14/30/100) or a **level milestone** (every 5
   levels, say). Guard so each milestone box opens once (store `lastBoxMilestone`).
2. **Reward roll** (weighted): bonus XP (e.g. +50/+100), a **streak freeze** (`storage.js` already
   supports `freezes`, cap 2), or a **collectible sticker** drawn from the sticker pool (see below). No
   "nothing" outcomes — every box gives something.
3. **Open animation**: a tappable closed box → shake → burst (reuse `Feedback.confetti` + a reward
   sound) → reveal card showing the prize. Reuse the celebration-overlay pattern
   (`_showLevelUp`/`_showEvolution` in `app-home.js`).
4. **Collectible store** (the shared bit E-011 needs): `localStorage['donnibo_collectibles']` = array of
   earned sticker IDs. Sticker pool draws from existing assets in `design/avatars/expr-*.svg`
   (idle/thinking/correct/wrong/streak/levelup/sleeping) — copy the chosen ones into
   `app/ui/assets/stickers/`. Define the pool + rarity in a new `collectibles.js`.

## Acceptance Criteria
- [ ] Crossing a streak (7/14/30/100) or level (×5) milestone opens exactly one box, once per milestone
- [ ] Box reveals XP / freeze / sticker by weighted roll; freeze respects the cap-2 rule
- [ ] XP rewards go through `XP.addXP`; freeze through the streak object; stickers into the store
- [ ] Open animation uses `Feedback` (confetti + sound), reduced-motion safe, dismissible
- [ ] Earned stickers persist and are readable by E-011 (`Collectibles.owned()`)
- [ ] No remote dependency; correct across reload (milestone guard prevents re-open)

## Technical Notes
- New `collectibles.js`: `POOL` (id, name, file, rarity), `owned()`, `grant(id)`, `rollReward(context)`.
- Trigger from the same places milestones are detected today: `_checkStreakMilestone`
  (app-quiz/app-drill call it) and the XP level-up path in `_showResult`/`_showDrillResult`.
  Add a `_maybeOpenMysteryBox(streak, xpResult)` that the celebration flow calls after level-up/evolution
  so boxes don't collide with those overlays (queue them — show box after the level/evolve overlay closes).
- Keep the box overlay markup consistent with `.quest-ritual-overlay` styling.

## Files to Touch
- New: `app/ui/js/collectibles.js`, `app/ui/assets/stickers/*.svg` (from `design/avatars/expr-*`)
- `app/ui/js/app-home.js` — box overlay (`_showMysteryBox`) + queue after level/evolve
- `app/ui/js/app-quiz.js`, `app/ui/js/app-drill.js` — call `_maybeOpenMysteryBox` post-celebration
- `app/ui/index.html` — load `collectibles.js`
- `app/ui/css/styles-app.css` — box closed/opening/reveal styles

## Definition of Done
Milestones now feel like opening a present — you don't know if it's XP, a freeze, or a new sticker.
Commit the store + roll logic first (silent), then the box overlay + triggers.
