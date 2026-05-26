# Feature: Landing Page Improvements

**Priority:** P2 | **Type:** Marketing / UX | **Complexity:** M | **Status:** Pending

## Goal
Transform the landing page from a basic informational page into a conversion-optimized
entry point with real stats, a live app screenshot, a clear value proposition headline,
and social proof that motivates sign-up.

## Current Issues
1. **Stats not real** — "10,000+ students", "500+ goals" are placeholder numbers
2. **No screenshot** — visitors can't see what the quiz experience looks like
3. **Value prop unclear in headline** — doesn't tell users what they'll gain
4. **Success stories are generic** — not specific to grade/subject scenarios
5. **No FAQ section** — visitors leave with unanswered questions

## Improvements

### 1. Headline + Sub-headline Rewrite
Current: "Master Any Subject, One Question at a Time"
Target: "10 Questions a Day. Real Progress. For Every Grade."
Sub-headline: "Track accuracy, build streaks, and prove to yourself you're getting better."

### 2. Real-Number Stats (or Remove Them)
Options:
- **Remove counters entirely** until real numbers exist (recommended for honesty)
- Show soft metrics: "40+ goals • 9 grades covered • Works on any device"
- Add a live "questions answered today" counter from Google Apps Script

### 3. App Screenshot / Demo
- Add a PNG screenshot of the quiz screen (dark mode preferred)
- Or embed an animated GIF of a quiz session (3–4 questions)
- Place above the fold on desktop, below CTA on mobile

### 4. Specific Success Stories
Replace generic quotes with grade/goal-specific stories:
- "Grade 10 student, improved Math accuracy from 40% to 75% in 3 weeks"
- "DevOps engineer, passed AKS interview after 2 weeks of daily practice"

### 5. FAQ Section
Add 4–5 common questions:
- "Is it free?" — Yes, core practice is always free
- "What grades are covered?" — Grade 2 through Grade 12 + College + Professional
- "How is it different from other quiz apps?" — Streak + accuracy tracking, not just flashcards

## Acceptance Criteria
- [ ] Headline rewritten with clear value proposition
- [ ] Placeholder stats replaced or removed
- [ ] App screenshot added (at least one image showing the quiz screen)
- [ ] Success stories made specific with grade/goal context
- [ ] FAQ section added with at least 4 questions
- [ ] Page looks correct on mobile (375px width)

## Files to Touch
- `app/ui/index.html` — landing page content sections
- `app/ui/styles.css` — any new section styles
- New: `app/ui/assets/screenshot-quiz.png` — quiz screen screenshot

## Confidence Score Impact
Improves Parameter 4 (Landing Page): 5/10 → ~8/10
