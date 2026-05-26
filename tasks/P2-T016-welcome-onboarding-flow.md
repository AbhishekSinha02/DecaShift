# Feature: Welcome Onboarding Flow

**Priority:** P2 | **Type:** UX | **Complexity:** M | **Status:** Pending

## Goal
Guide new users from sign-up to their first completed quiz session with a brief
welcome screen, clear instructions, and an empty-state experience that doesn't
feel abandoned.

## Problem
Current onboarding state:
1. User signs up → lands on Home screen with goals list
2. If grade is set, goals appear immediately — no explanation of how to use the app
3. If category/grade is missing → empty home with "Complete your profile" prompt
4. No first-quiz celebration / reward after the first session
5. New users with zero streak feel no motivation to return

## Solution: 3-Step Onboarding

### Step 1 — Welcome Modal (first login only)
Shown once, dismissed with "Let's go!" button.
```
Welcome to DecaShift!
Here's how it works:
✅ Pick a goal → answer 10 questions → see your score
🔥 Practice daily to build your streak
📈 Track your accuracy improving over time
[Let's Go!]
```
- Persisted via `localStorage.setItem('decashift_onboarded', 'true')`
- Only shown when `!localStorage.getItem('decashift_onboarded')`

### Step 2 — Guided Profile Setup
If category/grade is missing, show an inline prompt (not just the link):
- Mini step-by-step wizard inside the home view: "Tell us about yourself → Pick your grade → You're ready!"
- Inlined form, not a separate modal

### Step 3 — First Session Celebration
After the first completed quiz session:
- Show a "You just completed your first session! 🎉" banner on the result screen
- Display the user's streak (now day 1) with emphasis
- Prompt to share (optional)

## Empty State Improvement
Current: "No goals found for your profile."
Target: Show a visual placeholder with:
- Icon (e.g., magnifying glass or book)
- "No questions available for Grade X yet"
- "Check back soon — we're adding more content every week"

## Acceptance Criteria
- [ ] Welcome modal shown once for new users (persisted in localStorage)
- [ ] Welcome modal not shown on subsequent logins
- [ ] Profile setup guided inline if category/grade is missing
- [ ] First-session celebration banner on result screen for first-time quiz
- [ ] Empty state has friendly icon + message instead of plain text

## Files to Touch
- `app/ui/index.html` — onboarding modal markup
- `app/ui/app.js` — modal show/hide logic, first-session detection
- `app/ui/styles.css` — modal and empty-state styles

## Confidence Score Impact
Improves Parameter 5 (User Onboarding): 5/10 → ~8/10
