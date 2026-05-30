# Feature: Student Peer Collaboration

**Priority:** P6 | **Type:** Functional | **Complexity:** L | **Status:** Pending

## Goal
Students can challenge a friend to beat their score on a goal, or study together in a shared session. Peer engagement dramatically increases retention.

## Phase 1 — Challenge Links
- After completing a session, user gets a shareable link: "Beat my score of 8/10 in Azure AKS"
- Link opens the app, shows the challenge, lets the recipient take the same goal
- Result shows: "You scored 9/10 — you beat [Name]'s 8/10!"

## Phase 2 — Study Groups (future)
- Create a group, invite by link
- Group leaderboard within members only

## Acceptance Criteria (Phase 1)
- [ ] "Challenge a Friend" button on result screen
- [ ] Generates a short URL: `app-url?challenge=BASE64_ENCODED_SESSION_SUMMARY`
- [ ] Challenge decoded on load — shows challenger's score as the target
- [ ] Challenge result compares both scores and declares winner
- [ ] Share via Web Share API (native share sheet on mobile) with fallback copy-to-clipboard
- [ ] Challenge links work without the recipient being logged in (guest play)

## Technical Notes
- Challenge payload: `{ name, goalId, score, total, accuracy }` — base64 encoded in URL param
- No server needed — all data in the URL
- Web Share API: `navigator.share({ title, text, url })` — fallback: `navigator.clipboard.writeText(url)`

## Dependencies
- P2-T006 (guest mode must allow challenge play)
- P5-T002 (exam mode challenges could be a paid feature later)

## Files to Touch
- `app/ui/app.js` — `generateChallengeLink()`, challenge mode detection on init
- `app/ui/index.html` — challenge result screen, share button
