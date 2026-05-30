# E-008: Feedback Engine — Sound + Haptics + Confetti

**Priority:** P1 (Juice) | **Force:** Juice | **Type:** JS+UI | **Complexity:** M | **Status:** ✅ Done (e8945f2 engine, 1c3d611 wiring)
**Session:** E4 · **Depends on:** none (applied across all prior work) · **The "beat Netflix polish" layer**

## Goal
Build one reusable **feedback engine** that adds *game juice* to every key moment — a crisp sound, a
short haptic, and a particle burst on the big ones. This is the horizontal layer that makes the whole
app feel premium in a single pass, right before any marketing push.

## Why
Feedback today is visual-only. The difference between "a quiz" and "a game kids don't put down" is the
multi-sensory hit of a correct answer. Done once, centrally, it lifts every screen — quiz, drill, GK,
level-up, streak, evolution.

## What to build
1. **Sound system** (`feedback.js`):
   - Tiny, lazy-loaded cues: `correct`, `wrong` (soft, never harsh), `tap`, `levelup`, `streak`,
     `reward`, `complete`. Use the Web Audio API with short synthesized tones or a few small assets.
   - **Mute toggle** in Settings (default on for kids, but one tap to silence — respect classrooms).
     Persist preference. Honour the OS/page being muted.
2. **Haptics**: `navigator.vibrate` patterns for correct/wrong/levelup/evolve (guarded — many devices
   ignore it; never assume support). Tie to the same mute/settings switch (a "feedback" master + sub-toggles).
3. **Confetti / particle engine**: a single reusable `<canvas>` burst (`burst(x, y, opts)`) used by
   level-up (E-005), evolution (E-006), perfect set, completion ritual (E-004). Auto-cleans, capped
   particle count for low-end devices, killed on reduced-motion.
4. **Public API**: `Feedback.play('correct')`, `Feedback.haptic('levelup')`, `Feedback.confetti(opts)`,
   `Feedback.setEnabled(bool)`.

## Acceptance Criteria
- [ ] Correct/wrong answers play a sound + haptic via the central engine (wire into `submitAnswer`)
- [ ] Level-up, evolution, streak milestone, perfect set, and completion ritual trigger confetti
- [ ] One Settings toggle mutes all feedback; preference persists; default sensible for kids
- [ ] `prefers-reduced-motion` disables confetti automatically; sound still optional
- [ ] No audio autoplay-policy errors (lazy-init AudioContext on first user gesture)
- [ ] Confetti holds 60fps on a mid Android (particle cap, transform/opacity, single canvas)
- [ ] Zero impact when disabled (no canvas, no audio context created)

## Technical Notes
- New `feedback.js` — the only file that touches Audio/vibrate/canvas, so the rest of the app calls a
  clean API. Lazy-create `AudioContext` on first gesture to satisfy autoplay policies.
- Wire-in points: `submitAnswer` (`app-quiz.js`), `_startDrill` correct/PB (`app-drill.js`),
  E-005 level-up, E-006 evolution, E-004 ritual, GK.
- Settings: add a "Sound & buzz" row to `screen-settings.html` + handler in `app-settings.js`.
- Keep audio assets tiny or fully synthesized to honour the 4G / low-cost-phone constraint.

## Files to Touch
- New: `app/ui/js/feedback.js` (+ optional small audio assets in `app/ui/assets/sfx/`)
- `app/ui/js/app-quiz.js`, `app/ui/js/app-drill.js`, `app/ui/js/app-gk.js`, `app/ui/js/app-home.js` — call sites
- `app/ui/screens/screen-settings.html`, `app/ui/js/app-settings.js` — feedback toggle
- `app/ui/css/styles-app.css` — confetti canvas layer (fixed, pointer-events:none)

## Definition of Done
Every tap and every win *feels* good, and a teacher can silence it in one tap. Ship the engine + mute
first, then wire call sites screen by screen so the app is shippable throughout.
