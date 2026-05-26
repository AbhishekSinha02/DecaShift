# Setup: Manual Test Checklist — All Flows Before Every Push

**Priority:** P2 | **Type:** Developer Experience | **Complexity:** S | **Status:** Pending

## Goal
One file that lists every testable flow. Run through it locally before pushing. Prevents regressions from being caught only after deployment.

## Checklist (implement as TESTING.md)

### Auth Flows
- [ ] Landing page loads — hero, two path cards, stories, stats visible
- [ ] "For Students" → signup form shows school fields (grade picker)
- [ ] "For Professionals" → signup form shows pro fields (role + company)
- [ ] Grade picker = College → course dropdown appears
- [ ] Signup with missing fields → correct error shown per field
- [ ] Signup success → home screen with user's name
- [ ] Home shows ONLY goals matching user's grade (grade 6 → grade 6 only)
- [ ] Sign out → landing screen
- [ ] Sign in with same credentials → home screen restored with correct grade goals
- [ ] Sign in with wrong password → error shown
- [ ] Sign in with unregistered email → "No account found" error

### Quiz Flows
- [ ] Click Start on a goal → quiz screen
- [ ] Question loads with 4 answer options
- [ ] Timer counts up
- [ ] Select answer → Submit button enabled
- [ ] Submit → correct answer highlighted green, wrong red
- [ ] Explanation shown after submit
- [ ] Next question → progress bar advances
- [ ] Last question → result screen
- [ ] Result shows correct score, percentage, badge
- [ ] Per-question time breakdown table visible
- [ ] Restart → quiz restarts from Q1
- [ ] Back to Goals → home screen

### Data Persistence
- [ ] Complete a quiz → goal card shows "Last: X/Y"
- [ ] Sign out → sign in → "Last: X/Y" still shown (loaded from localStorage)
- [ ] Reset goal → "Last" score cleared

### Regression Checks (run after every change)
- [ ] Grade 5 student does NOT see College or Professional goals
- [ ] Professional user does NOT see school goals
- [ ] Adding new question file + manifest entry → appears on home without JS change

## Files to Touch
- New: `TESTING.md` at repo root — copy of this checklist in runnable format
