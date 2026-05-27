# Feature: Subscription Plan Tamper Protection

**Priority:** P2 | **Type:** Security | **Complexity:** M | **Status:** Pending

## Problem
DecaShift is a static site. Every subscription gate check happens in the browser.
A user can open DevTools → Application → localStorage → change `plan: "free"` to
`plan: "pro"` → refresh → full Pro access for free. This breaks the entire
subscription model before it generates a single rupee.

## Threat Model (Realistic for This App)

| Actor | Action | Risk |
|---|---|---|
| Tech-savvy student / parent | Opens DevTools, edits localStorage | **High likelihood**, easy to do |
| User copies Pro question URLs from network tab | Accesses files directly | Medium — GitHub raw URLs are public |
| User pastes JS override in browser console | Patches plan-check function | Low — needs coding knowledge |
| Professional attacker reverse-engineers HMAC secret | Forges signed tokens | Very low — disproportionate effort for a kids app |

**Goal:** Block the first two cases completely. Make the third case require enough
effort that it's not worth it. Accept that a determined developer can always work
around client-side code — design for the 99% casual-tamper case.

## Why localStorage Alone Is Never the Gate

`localStorage` is the user's own storage. The app has no authority over it.
Any value stored there — `plan`, `userId`, `sessionId` — can be changed in 10 seconds.

**Rule: localStorage is a cache only. The server (Apps Script) is the source of truth.**

## Solution: Signed Plan Token + Server-Side Content Gate

### Layer 1 — Signed Plan Token (Prevents localStorage editing)

Apps Script generates a short-lived signed token on login and on daily refresh:

```
payload  = base64url({ userId, plan, iat, exp })          // exp = now + 24h
signature = HMAC-SHA256(payload, SCRIPT_SECRET)           // SCRIPT_SECRET in Script Properties
token     = payload + "." + signature
```

- Client stores `decashift_token` (the full signed token) — NOT `user.plan` directly
- To check plan: decode the payload (base64 — readable client-side for display)
- To verify the plan hasn't been tampered: send token to Apps Script `?action=verifyToken`
  — Apps Script re-computes HMAC and compares; returns `{ valid: true, plan: 'pro' }`
- If user edits the payload in localStorage → HMAC no longer matches → server returns invalid → treated as `'free'`

Token verification is called:
- On every quiz `startGoal()` for a locked set or exam
- On `init()` if token is > 12h old (silent background refresh)
- Never on every page render (would be too slow / quota-heavy)

### Layer 2 — Pro Content Proxied Through Apps Script (Prevents direct URL access)

For sets 3–5 and the Weekly Exam, question files are **not fetched directly from GitHub raw**.
Instead they go through Apps Script:

```
?action=getQuestions&goalId=grade5-math-w21-set3&token=<signed-token>
```

Apps Script:
1. Verifies token HMAC + expiry
2. Checks `userId` in the token matches the user in Drive
3. If valid Pro → fetches from GitHub raw internally and returns the JSON
4. If invalid / free → returns `{ error: "plan_required" }`

Free sets (1–2) continue to load directly from GitHub raw — no slowdown for free users.

### Layer 3 — Plan Stored in Drive, Not Just localStorage

`users/{userId}.json` in Drive always contains the authoritative `plan` field.
When a user logs in, Apps Script reads this and issues the token.
Manually editing localStorage doesn't change the Drive record.

```json
{
  "userId": "user_xyz",
  "plan": "free",
  "planExpiry": null,
  "planSource": "stripe" | "manual" | "free"
}
```

## What This Does NOT Protect Against
- A developer who reads the app source, intercepts Apps Script responses in the network
  tab, and replays them: accepted risk — disproportionate effort for this audience.
- Sharing login credentials: separate concern (not tampering).
- Someone who finds the SCRIPT_SECRET via a public commit: mitigated by ensuring
  SCRIPT_SECRET is only ever in Apps Script Properties, never in the codebase.

## SCRIPT_SECRET Management
- Stored in Apps Script → Project Settings → Script Properties as `PLAN_SECRET`
- Never committed to git
- Rotate if compromised (all existing tokens invalidate — users re-login)
- Length: 32+ random bytes (use `crypto.randomUUID()` twice concatenated)

## Implementation Checklist

### Apps Script (Code.gs)
- [ ] `issueToken(userId, plan)` — generates signed token
- [ ] `verifyToken(token)` — verifies HMAC, checks expiry, returns `{ valid, plan }`
- [ ] `getQuestions(goalId, token)` — verifies token then proxies question file
- [ ] `PLAN_SECRET` added to Script Properties (manual step, documented)

### Client (app.js / storage.js)
- [ ] `_getPlan()` — decodes token payload (no server call); used for UI rendering
- [ ] `_verifyPlan()` — async; calls `verifyToken` action; called before starting Pro content
- [ ] `startGoal()` for Pro goals: calls `_verifyPlan()` first; shows upgrade screen on fail
- [ ] Token refresh: if token age > 12h, silently re-issue in background on `init()`
- [ ] Remove any direct `user.plan` read from localStorage as gate source

### Security Regression Tests (Manual)
- [ ] Edit `decashift_token` payload in localStorage → quiz start → should fail verification → fallback to free
- [ ] Delete `decashift_token` from localStorage → should re-fetch from Drive on next init
- [ ] Access Pro question URL directly in browser → Apps Script returns 403 / plan_required
- [ ] Change `plan` in `users/{id}.json` in Drive to `'free'` → token expires → user loses Pro access next day
- [ ] Expired token (manually set `exp` to past) → `verifyToken` returns invalid → treated as free

## Files to Touch
- `app/google-apps-script/Code.gs` — `issueToken`, `verifyToken`, `getQuestions` proxy
- `app/ui/storage.js` — token storage, `_getPlan()`, `_verifyPlan()`
- `app/ui/app.js` — replace `user.plan` reads with `_getPlan()`, add `_verifyPlan()` call in `startGoal()`

## Dependencies
- P3-T028 (weekly set gating — defines where the plan check happens in UI)
- P2-T013 (subscription strategy — defines free vs pro tiers)
- **Must ship before P5-T001 (Stripe)** — no point wiring payments if the gate is bypassable
- Informs P3-T029 (weekly exam) and P3-T026 (topic filter) — both reuse `_verifyPlan()`
