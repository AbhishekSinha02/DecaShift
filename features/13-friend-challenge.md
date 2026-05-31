# Feature: Friend Challenge

## Overview
After completing a set, a user can challenge a friend by sharing a URL. The URL encodes the challenger's score, name, and the set they played — entirely in the query string. No backend required. The friend opens the link, plays the same set, and sees a head-to-head comparison. Every challenge link is also a potential new user acquisition.

---

## User Flows

### Flow 1: Sending a Challenge

**Entry point:** User completes a quiz → Result screen → taps "Challenge a Friend."

1. `Challenge.encode({ goalId, score, total, name })` generates a compact base64url payload
2. A challenge URL is constructed: `https://app-url/?ch=<payload>`
3. **Share dialog**:
   - If `navigator.share` is available: native share sheet opens with the URL + text like "I scored 12/15 on Grade 5 Math. Can you beat me? [link]"
   - If not: URL is copied to clipboard + toast: "Link copied! Paste it anywhere."
4. The sender's result screen remains; they can share to any app (WhatsApp, SMS, Instagram DM, etc.)

---

### Flow 2: Receiving a Challenge (New User)

**Entry point:** Friend opens the challenge URL on their device for the first time.

1. App loads with `?ch=<payload>` in the URL
2. `Challenge.capture()` runs on init:
   - Parses and validates the payload
   - Stores it in `sessionStorage` under `donnibo_pending_challenge`
   - Strips `?ch=` from the URL (so a page refresh doesn't re-trigger it)
3. If no account exists → **Landing screen** → user signs up (or signs in)
4. After authentication → Home renders → pending challenge is detected
5. App immediately launches the quiz for that specific set

---

### Flow 3: Receiving a Challenge (Existing User)

**Entry point:** Logged-in user opens the challenge URL.

1. App loads; `Challenge.capture()` stashes the payload
2. Home renders → `Challenge.pending()` is detected
3. App calls `_maybeStartPendingChallenge()`:
   - Finds the goal matching `ch.goalId`
   - If goal exists and is not gated: `startGoal(goalId)` launches quiz immediately
   - If goal is unknown or gated (Pro-only set): loads Home normally, challenge is cleared
4. Quiz screen loads with a **special challenge banner** (replacing the normal "beat your last score" banner):
   - "⚔ [Friend's Name] challenged you — beat 12/15!"

---

### Flow 4: Completing the Challenged Set

1. User plays the set normally (same quiz engine, Feature 03)
2. On result screen:
   - If user **beat** the challenger: "You beat [Name]! 🎉 You scored 14/15 vs their 12/15"
   - If user **matched**: "You matched [Name]! Both scored 12/15"
   - If user **didn't beat**: "Close! [Name] scored 12/15. You got 10/15 — try again?"
3. "Challenge back" button appears → generates a return challenge link
4. State is cleared: `Challenge.clear()` removes the pending challenge from sessionStorage

---

## URL Payload Format

```
?ch=<base64url-encoded JSON>
```

Encoded object:
```json
{ "g": "grade-5-math-w23-mon", "s": 12, "t": 15, "n": "Arjun" }
```

Fields:
| Key | Meaning | Max length |
|---|---|---|
| `g` | goalId | — |
| `s` | challenger's score | integer |
| `t` | total questions | integer |
| `n` | challenger's first name | 24 chars |

Base64url encoding: URL-safe alphabet (`+→-`, `/→_`), no padding — safe in any share channel.

---

## Why URL-Only (No Backend)

- Zero infra cost
- Works for new users (who don't have accounts yet)
- Immediate virality: a WhatsApp message IS the product
- Privacy: no user data stored on a server just to pass a score
- Degrades gracefully: unknown goalId → loads Home, challenge silently dropped

---

## Acquisition Hook

The challenge flow is the lowest-cost acquisition channel:
- User A plays → challenges User B
- User B opens link → sees the app for the first time → must sign up to play
- Every challenge is a warm referral from a trusted friend

---

## Screens Involved
- `app/ui/js/challenge.js` — encode(), decode(), capture(), pending(), clear()
- `app/ui/js/app-quiz.js` — challenge banner, `_maybeStartPendingChallenge()`
- `app/ui/js/app-home.js` — detects pending challenge on render
- `app/ui/js/sharecard.js` — optional: share card for the challenge result
