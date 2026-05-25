# Feature: User Category Selection at Onboarding

**Priority:** P1 | **Type:** Functional | **Complexity:** S | **Status:** Pending

## Goal
Capture user category during sign-up so questions, UI tone, and difficulty levels are tailored from day one.

## Categories
- Student — Grade 2 through Grade 12 (sub-select grade)
- College / Course Student
- Working Professional
- Career Switcher

## Acceptance Criteria
- [ ] Category selector shown as visual cards (not a dropdown) during sign-up
- [ ] Selecting "Student (School)" reveals a grade picker (2–12)
- [ ] Category stored on user profile
- [ ] Home screen shows a category-appropriate greeting and question sets
- [ ] Category can be changed in Profile Settings later
- [ ] Each category maps to a default set of goals/question banks shown on home

## Technical Notes
- Add `category` and `grade` (nullable) fields to user profile schema
- `goals.json` entries get a `targetCategories: ["school", "professional"]` array
- Home screen filters goals by `user.category`

## Dependencies
- P1-T002 (sign-up form)

## Files to Touch
- `app/ui/index.html` — category card UI in sign-up flow
- `app/ui/app.js` — category step logic
- `app/ui/goals.json` — add `targetCategories` field
- `app/ui/styles.css` — category card styles
