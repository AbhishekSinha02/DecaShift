# P2-T047 — Identity Strategy: userID / Email / Mobile (the account foundation)

> **Type:** Strategy / product decision (precedes code) · **Priority:** ★ HIGHEST — **gates [P2-T046](../P2-T046-full-state-cross-device-sync.md)**.
> **Decision owner:** user (this is a functional decision per `feedback_approval_workflow`).
> **Why first:** cross-device sync + password reset both need a stable identity KEY. Decide the key
> before building the sync. Related: `strategy_gtm_zero_friction`, [[project_device_migration]].

---

## The problem

DecaShift's audience (India Tier 2/3, parents + kids, ₹8k Android phones) breaks every classic
identity assumption:

- **Most users have no email** — and kids legally can't have one. Email-as-login excludes the core market.
- **Phone numbers churn** — users swap SIMs/numbers often, so mobile is not a durable key either.
- **SMS OTP costs money** — an OTP gateway adds per-message cost that erodes the ₹79 margin and
  breaks the "near-zero infra" model. It also fails offline / on weak signal.
- **No real backend** — auth today is localStorage + a single Google Apps Script → Drive sheet.
- So in practice identity is already **just a user-chosen handle** — but with no collision handling,
  no recovery, and a weak static-salt password. That's the gap to close.

Current code reality (`app-auth.js`, `storage.js`): signup **requires** name + email + 10-digit
mobile + password; account is keyed by a 16-char hash of email. This **contradicts**
`strategy_gtm_zero_friction` ("email optional") and excludes emailless users entirely.

## Goal

Define the **canonical identity model**: what is the durable account key, how users log in on a new
device, and how recovery works — for an emailless, number-churning, partly-underage, near-zero-infra
audience. Output = a decision + a short spec that P2-T046 implements against.

## Options (to evaluate, not mutually exclusive)

| Option | Login key | Pros | Cons |
|---|---|---|---|
| A. **User-chosen handle + PIN/passphrase** | handle (unique) + PIN | Works for everyone incl. kids; zero infra; no OTP cost | Handle collisions; users forget PIN; needs recovery path |
| B. Email optional | email if given, else handle | Matches GTM pivot | Email users get recovery, others don't — uneven |
| C. Mobile + OTP | phone number | Familiar; "verified" | OTP $$, breaks margin + offline; number churn loses account |
| D. **Auto recovery code / backup phrase** | handle + a generated 8–12 char code the user saves | True portability key; works offline; no PII | Users lose the code; needs gentle save-prompt UX |
| E. Account-transfer QR/code (device→device) | one-time code shown on old device | Frictionless migration when both phones present | Useless if old phone is lost/sold |
| F. Parent-managed / family account | parent handle owns child profiles | Solves kids-have-no-contact; one login, many kids | More UX; parent must be reachable |

## Recommended direction (for user approval)

**Primary key = user-chosen handle + PIN**, plus an **auto-generated recovery code (Option D)** shown
once at signup with a "save this to restore on a new phone" prompt — that code is the durable
migration key P2-T046 syncs against. **Email and mobile become optional secondary recovery hints**, not
required fields and not the primary key. Add **Option F (parent-managed profiles)** for under-13s so a
child needs no contact info of their own. Avoid Option C/OTP until revenue justifies the gateway cost.

This keeps zero-friction signup, zero new infra, works offline, includes kids, and gives a real
recovery story — while the offline support-reset (in P2-T046) remains the last-resort fallback.

## Open decisions the user must make

1. Is the primary login **handle + PIN** (recommended) or something else?
2. Make email **and** mobile fully optional in signup now? (Requires editing `app-auth.js` validation.)
3. Adopt the **recovery code** as the portability key? Where/how forcefully to prompt users to save it?
4. Build **parent-managed family accounts** for kids, or defer?
5. Handle uniqueness: global unique handles, or handle + short discriminator (e.g. `ravi#4821`)?

## Hand-off to implementation

Once decided, this feeds:
- **P2-T046** — uses the chosen key for the state blob + the recovery flow (replaces email-hash key).
- **`app-auth.js`** — signup field changes (optional email/mobile, add handle/PIN/recovery code).
- **`docs/support-password-reset.md`** — recovery runbook aligned to the chosen model.

## Out of scope
- Real backend auth / OAuth (not for this stage).
- Paid SMS OTP (revisit post-100-paid if churn data demands it).
