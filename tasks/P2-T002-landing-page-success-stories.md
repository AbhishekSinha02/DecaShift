# Feature: Landing Page with Success Stories

**Priority:** P2 | **Type:** Functional + Technical | **Complexity:** M | **Status:** Done ✅ (v2.0 — hero, student/pro paths, 3 success stories, stats bar)

## Goal
First-time visitors land on an emotionally engaging page that shows real transformation stories before they sign up. Build trust and motivation before any commitment.

## Sections to Build
1. **Hero** — Tagline, CTA ("Start Free"), animated stat counters
2. **Social proof strip** — "10,000+ learners", "500+ questions", "used in 20+ schools"
3. **Success stories** — 3–5 cards: photo/avatar, name, role, "Before/After" quote format
4. **How it works** — 3 steps: Pick a goal → Practice daily → Track growth
5. **User categories** — Cards for School Students / College / Professionals
6. **Streak & habit** — Screenshot or animation of the streak UI
7. **CTA footer** — "Join free. No credit card."

## Acceptance Criteria
- [ ] Landing page is separate from the app shell (different screen, not the home screen)
- [ ] Sign-up and Sign-in buttons both visible on landing
- [ ] Logged-in users bypass landing and go directly to home
- [ ] Page is fast — no images over 100KB, lazy-load below the fold
- [ ] Looks great on mobile (375px) and desktop
- [ ] Success story content is editable from a `stories.json` file (no code change to update stories)

## Technical Notes
- Add `screen-landing` section before `screen-registration` in `index.html`
- Stories loaded from `app/ui/stories.json`
- Animate counters with `IntersectionObserver` (pure JS, no library)

## Dependencies
- P1-T002 (sign-up must exist to link CTA)

## Files to Touch
- `app/ui/index.html` — new `screen-landing` section
- `app/ui/app.js` — landing screen logic, bypass for logged-in users
- `app/ui/styles.css` — landing page styles
- New: `app/ui/stories.json`
