# P2-T015 — Landing Page Improvements

**Priority:** P2 — Core Experience
**Complexity:** M
**Status:** 🔄 Phase 1 Done · Phase 2 Planned

---

## Goal

A landing page that converts a parent or student in under 10 seconds, survives a teacher WhatsApp demo, and feels like a ₹1,000/month product at ₹79/month.

---

## Phase 1 — Done (commit f833a62, 2026-05-29)

Complete redesign from text-only to 7-section structured landing:

| Section | What was built |
|---|---|
| Sticky nav | Logo + nav links + Sign In + Start Free CTA |
| Hero | 2-column: headline/CTAs left, animated CSS phone mockup right |
| Stats bar | 6,000+ questions · 11 grades · 6 subjects · ₹0 |
| How it works | 3-step numbered flow with arrows |
| Feature rows (×3) | Alternating left-right: Flash Drills card · Streak calendar card · Subjects grid card |
| Testimonials | 3 cards with stars, grade, city |
| Pricing | Free vs ₹79 Pro comparison |
| CTA + Footer | Gradient block + footer with WhatsApp support |

**Files created/modified:**
- `app/ui/css/styles-landing.css` — 680 lines, all landing styles, forced light theme
- `app/ui/screens/screen-landing.html` — full landing HTML (dynamically fetched)
- `app/ui/js/app-auth.js` — `_setupLanding()` wires 8 CTAs + nav smooth scroll

---

## Phase 2 — Planned

**Session file:** `sessions/PENDING-landing-page-enhancements.md`
**Queue position:** Priority 1 — run next session

### Issues from Phase 1 user review

| Issue | Severity | Fix |
|---|---|---|
| Nav scrolls with page (not truly fixed) | Bug | `position: fixed` + `padding-top: 64px` on hero |
| Hero subheadline contains tech spec copy | Copy | Rewrite to emotional benefit only |
| No mobile navigation | UX gap | Hamburger toggle + overlay menu |
| Needs more visual hooks | Design | City ticker, count-up stats, scroll-reveal |

### Enhancements (6 atomic steps)

1. **Fixed nav** + hero copy rewrite + hero background gradient blob
2. **Mobile hamburger nav** — 3-line icon → full-screen overlay menu
3. **City social proof ticker** — scrolling "Students in Delhi · Pune · Mumbai…"
4. **Stats count-up animation** — IntersectionObserver triggered
5. **FAQ section** — 6 `<details>` accordion items, parent-targeted
6. **Scroll-reveal animations** + card hover lift + "Today's question" teaser

---

## Design Rules (locked — do not change without user request)

| Rule | Detail |
|---|---|
| Theme | Always forced light — never inherits dark/dawnbreak/ocean |
| Reference | Duolingo / Kahoot — bright, rounded (20px+), playful |
| Nav | `position: fixed` always (section is scroll container, not body) |
| Hero sub | Emotional benefit only — tech specs go in trust pills or FAQ |
| Phone mockup | CSS-only, 256px wide, no image files |
| Primary audience | Split: hero targets student, trust bar + pricing targets parent |

---

## Definition of Done (full)

- [x] 7-section structure live
- [x] CSS phone mockup with float animation
- [x] 3 feature rows with CSS card visuals
- [x] Testimonials with stars + grade/city
- [x] Pricing comparison Free vs ₹79
- [ ] Nav truly fixed on scroll (desktop + mobile)
- [ ] Hamburger menu on mobile
- [ ] Hero subheadline is benefit-only
- [ ] City ticker scrolls continuously
- [ ] Stats count up on scroll
- [ ] FAQ accordion works
- [ ] Scroll-reveal on sections
- [ ] 0 console errors, mobile + desktop verified
