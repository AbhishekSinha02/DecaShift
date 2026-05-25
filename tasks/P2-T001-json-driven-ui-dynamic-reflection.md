# Feature: JSON-Driven UI — Live Reflection of Data Changes

**Priority:** P2 | **Type:** Technical | **Complexity:** S | **Status:** Pending

## Goal
Any change to `goals.json` or `questions.json` (title, category, new entry) is reflected immediately in the UI the next time a user loads the app — zero code changes required.

## Context
Currently this is mostly true, but category/level fields don't exist yet and some UI elements are hardcoded. This task makes the data → UI pipeline complete and robust.

## Acceptance Criteria
- [ ] Adding a new goal to `goals.json` shows it on the home screen automatically
- [ ] Adding a new question to `questions.json` with matching `goalId` includes it in that goal's quiz
- [ ] Changing a goal's `name` or `description` in JSON updates the card text on reload
- [ ] Removing a goal from JSON removes its card (no stale UI)
- [ ] Category/level fields in JSON control which users see which content
- [ ] No hardcoded goal IDs or question counts anywhere in `app.js`

## Technical Notes
- All rendering functions must read purely from `state.goals` and `state.questions` — no hardcoded references
- Add a `version` field to `goals.json` — if version changes, force a re-fetch (bust cache)
- Fetch with `cache: 'no-cache'` during development, `cache: 'default'` in production

## Dependencies
- P1-T008 (category/level fields must exist in JSON first)

## Files to Touch
- `app/ui/app.js` — audit all render functions for hardcoded values
- `app/ui/goals.json` — add `version` field
