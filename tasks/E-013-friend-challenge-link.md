# E-013: Friend Challenge via Share Link

**Priority:** P1 (Belonging) | **Force:** Belonging | **Type:** JS+UI | **Complexity:** M | **Status:** Pending
**Session:** E6 · **Depends on:** existing share plumbing (D-004) · No backend — all in the URL

## Goal
A viral loop with zero infra: a kid finishes a set, taps **"Challenge a friend,"** and shares a link.
The friend opens it → plays the **same set** → sees **"You: 8/10 vs Aarav: 9/10."** Beating a friend is
the oldest engagement hook there is, and it spreads the app by its nature.

## Why
This is the growth engine the strategy needs (word-of-mouth is the only channel). Unlike a passive
share card, a challenge *requires* the recipient to open the app and play — every challenge is a new
session and a potential new user.

## What to build
1. **Create challenge**: on the result screen, a "⚔ Challenge a friend" button builds a link
   `…/app/ui/index.html?ch=<payload>` where payload encodes `{goalId, score, total, name}` (base64 of a
   compact JSON; no PII beyond first name). Share via `navigator.share` / WhatsApp (reuse D-004 path).
2. **Open challenge**: on init, parse `?ch=`. If present, store it, route the user (after login/landing)
   straight into that `goalId` set with a banner: "Aarav challenged you — beat 9/10!"
3. **Compare result**: when the challenged set finishes, the result shows a head-to-head
   ("You 8/10 · Aarav 9/10 — so close!" / "You won! 10/10 vs 9/10 🎉") and offers a **rematch / counter-
   challenge** button (closing the loop).
4. **Graceful fallbacks**: unknown/locked goalId → friendly message + send them to today's set; malformed
   payload → ignore silently and load normally.

## Acceptance Criteria
- [ ] Result screen offers "Challenge a friend" → produces an openable `?ch=` link
- [ ] Opening a `?ch=` link routes into the exact set with a challenger banner
- [ ] Finishing shows an accurate head-to-head and a rematch/counter-challenge CTA
- [ ] Challenger name shows first-name only; payload carries no email/PII
- [ ] Unknown goalId / bad payload degrade gracefully (no crash, no dead end)
- [ ] Works with the trial gate (a gated set prompts upgrade, doesn't break the challenge)

## Technical Notes
- New `challenge.js`: `encode({goalId,score,total,name})`, `decode(str)`, `pending()` (reads/stores the
  parsed `?ch=`), `clear()`.
- Parse in `init()` (`app-core.js`) before routing; stash in `sessionStorage`. After `_showScreen('home')`,
  if a pending challenge exists, `startGoal(goalId)` and set the banner.
- Result compare in `_showResult` (`app-quiz.js`): if the finished `goalId` matches the pending challenge,
  render the head-to-head block; reuse the share path for the rematch link.
- Keep the link short — base64url of minimal JSON; strip padding.

## Files to Touch
- New: `app/ui/js/challenge.js`
- `app/ui/js/app-core.js` — parse `?ch=` in `init`, route into the set
- `app/ui/js/app-quiz.js` — "Challenge a friend" button + head-to-head + rematch on result
- `app/ui/screens/screen-quiz.html` — challenge banner slot (reuse `#quiz-challenge-banner`?) / result CTA
- `app/ui/css/styles-app.css` — challenge banner + head-to-head styles

## Definition of Done
A kid can challenge a friend in one tap, the friend plays the same set and sees who won, and can fire
back. Commit link create+encode first, then open+route, then the head-to-head compare.
