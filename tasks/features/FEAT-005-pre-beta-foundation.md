# FEAT-005: Pre-Beta Foundation — the 5 "must-do-now, brutal-to-retrofit" decisions

**Priority:** 🔴 **P0 — do BEFORE the first beta user signs up.**
**Type:** Architecture / Data Foundation (Code) | **Complexity:** M (1–1.5 sessions) | **Status:** 🟡 In progress — items 1–2 shipped (2026-06-03)

> **PROGRESS (2026-06-03, build `20260603a`):**
> - **Item 1 (per-user folder) — DONE in code.** Folder is keyed by **`userId`** (`users/{userId}/`),
>   **NOT `loginId`** — user decision 2026-06-03 (keeps the already-built `sessions/{userId}/`,
>   stays cross-device-stable by restoring `userId` from the account record at login). **This
>   overrides the `loginId` wording in item 1 below.** Layout now:
>   `users/{userId}/{profile.json, entitlement.json, journey.json, sessions/sess_*.json}`.
> - **Item 2 (entitlement + trial clock) — DONE in code.** Signup writes `schemaVersion:1` +
>   `entitlement{status:'trial', trialStartedAt, plan:'trial', planExpiry}`; sign-in backfills both.
>   Trial clock canonical field stays `user.trialStartDate` (read by `_checkTrialStatus`);
>   `entitlement.trialStartedAt` mirrors it.
> - **`Code.gs` rewritten** to the per-user folder layout + new `saveJourney` action; also fixed a
>   `loginIdHash` vs `emailHash` mismatch that broke cross-device account lookup.
>   ⚠️ **Apps Script must be MANUALLY re-deployed** — not auto-deployed — before the new layout is live.
> - **Still OPEN:** item 3 (city stamp), item 4 (content-ID stability audit), item 5 (brand config),
>   and journey.json population = **P2-T046** (chosen as the next phase). Commits: `d1bce70`, `e4321ba`.

> **Why this exists:** We are shipping the current build to **beta test users** (not GA). The only
> work that must happen *before* that is the work that is **impossible or painful to retrofit onto
> real users later.** Everything else (the paywall UI, payment integration itself, content→R2,
> the multi-city engine, feedback button) is just code and can be added to live users any time —
> **defer all of it.**
>
> **The one-line filter for "is it pre-beta?":** *"If I skip this, will I later have to touch
> existing users' data — or do a find-replace across a 2× bigger, multi-city codebase — to add it?"*
> If **no** → it is NOT on this list; defer it.
>
> Two categories qualify:
> 1. **Data you can't reconstruct** if you didn't capture it from user #1 (points 1–4).
> 2. **A one-way structural door** — cheap now, costly/irreversible later (point 5: never-fork topology).

---

## The 5 Foundation Items

### 1. Lock the per-user folder layout + `schemaVersion` — and write to Drive from user #1
The data structure is the one thing that is brutal to change once real users have data in it.
Decide it once, version it, and make the **server-side per-user folder the source of truth** (not
localStorage-only — localStorage-only beta users can't be migrated, gated, or restored on a device
switch).

Target layout (extends the already-implemented `sessions/{userId}/` — see P3-T010):
```
/users/{loginId}/
  profile.json        { userId, name, loginId, grade, category, city, createdAt, schemaVersion }
  entitlement.json    { status, trialStartedAt, plan, planExpiry }   ← item 2
  journey.json        { xp, avatarStage, streak, badges, mastery }   ← the thing we later gate
  sessions/{sessionId}.json
  feedback/           ← support tickets land here later (no schema needed now)
```
- **`schemaVersion` on every record** (start at `1`). This single field is the cheap insurance
  that makes every future migration possible; it cannot be added retroactively with certainty.
- Use `loginId` as the key everywhere — **never `email`** (FEAT-002; email/mobile do not exist on
  the user object). See CLAUDE.md "Account & Identity Model."

### 2. Stamp every user with an entitlement + trial clock at signup — even with payments OFF
Write `entitlement.json` from user #1 with `status: 'trial'` and `trialStartedAt` (Drive-synced, so
a localStorage clear can't reset it). **Without this timestamp, these same beta users can never be
gated or journey-frozen when the paywall (ENH-011) goes live — we'd be guessing when their trial
began.** The payment *integration* is fully retrofittable; the **trial start moment is not.**
- No paywall, no Razorpay, no plan-selection UI in this task — just persist the fields.

### 3. Stamp every user with `city` / cohort at signup — even though there's ONE config today
City attribution **cannot be reconstructed retroactively.** One field at signup is free now and
impossible later. This is what makes the entire city model (items below + future multi-city) work
without ever re-tagging a human. Default to the single launch city (Lucknow) for all beta users.

### 4. Make journey / mastery history reference **stable, namespaced content IDs**
If progress is stored positionally ("week21, q3"), then later moving content to R2 or adding
city-specific content overlays **silently breaks every beta user's history and mastery.** Pin every
answered-question / mastery record to a stable content ID now, so content can move freely *under*
the references later. Audit every place we persist "what the user has answered / mastered" and
confirm it keys on a durable ID, not a list position.

### 5. Extract ALL brand identity into one config, resolved by hostname — populate exactly ONE city
This is the **one-way door on deployment topology.** The moment we copy the repo for city #2, every
bug fix and weekly feature becomes N-handed forever — the opposite of smooth deployment. Lock the
rule now: **cities are config, not clones; one codebase, one deploy updates every city.**

Do the *indirection layer only* — not the multi-city engine:
- One `city.json` (or `config.js`): app name, page `<title>`, logo / icon paths, theme colors,
  support contact (WhatsApp), rep / coupon. **Zero hardcoded "DecaShift"/"Donnibo"** left in
  `index.html`, `app-*.js`, `manifest.webmanifest`, `sw.js` — every brand string reads from config.
- A `hostname → config` resolver so future domains load the **same build**, different identity.
- Fill in **one** city (Lucknow). The slot for more cities exists but stays empty.
- **Why now, not later:** codebase is ~2,750 lines today. Hunting every hardcoded brand string is a
  one-pass job now and a multi-session, error-prone one once it is 6,000+ lines and live in multiple
  cities.

> **⚠️ Decide-now wrinkle (bakes at install time): the PWA manifest.** `manifest.webmanifest`
> sets the installed home-screen **name + icon**, and that is fixed at the moment a parent installs
> the PWA — it cannot be changed for already-installed users. A single static manifest can't be
> per-city. **Decision required before beta installs happen:** either (a) accept one generic
> installed identity for all beta users, or (b) serve a per-domain / dynamic manifest so each city
> installs under its own name/icon. If beta installs as generic "Donnibo" and city #1 later wants its
> own home-screen identity, those early installs are stuck. **Recommend deciding (a) vs (b) explicitly
> in the session brief.**

---

## Explicitly DEFERRED (NOT pre-beta — retrofittable onto live users)
| Deferred | Why it can wait |
|---|---|
| Paywall screen + Razorpay flow (**ENH-011**) | Pure code/UI; plugs onto the item-1/2 data later with no user migration |
| Subscription-plan UI / pricing screen | Same — needs only the entitlement fields, which item 2 lays down |
| Content → R2 runtime fetch (P3-T030) | A code-path change; item 4's stable IDs make it safe whenever |
| Multi-city engine (live cities, content overlays, per-city pricing, DNS) | Plugs into item 5's slot; don't build until Lucknow converts |
| Feedback / support UI (#6) | Lightweight; the `feedback/` folder slot is enough for now |

---

## Build Plan — Atomic, App-Never-Breaks (per CLAUDE.md Code Stability Rules)
Each step commits green and is browser-testable. Data-shape changes are additive (new fields with
defaults) so existing flows keep working.

1. **`schemaVersion` + entitlement defaults at signup** (`status:'trial'`, `trialStartedAt`,
   `city`) written to profile/entitlement, localStorage + Drive round-trip. No UI change. Commit.
2. **Confirm/repair content-ID stability** for answered/mastery records (item 4) — audit, fix any
   positional keys to durable IDs. Commit.
3. **Per-user folder layout** finalized in the Apps Script path (`users/{loginId}/…`), extending the
   existing `sessions/{userId}/`. Verify a real session lands in the right place. Commit.
4. **Brand-identity config extraction** (item 5): introduce `city.json` + hostname resolver; replace
   every hardcoded brand string; one city populated. Commit.
5. **PWA manifest decision implemented** ((a) or (b) from the wrinkle). Commit + build-stamp/`?v=` bump.

> No feature flag strictly needed (changes are additive data + config), but keep each step
> independently shippable; if context runs out, the last commit is a working beta build.

---

## Acceptance Criteria
- [ ] Every new user record carries `schemaVersion`, `city`, `entitlement.status='trial'`, `trialStartedAt` — Drive-synced, keyed by `loginId` (never `email`)
- [ ] `trialStartedAt` survives a localStorage clear (Drive is source of truth)
- [ ] Per-user folder layout `users/{loginId}/…` finalized and verified with a real session
- [ ] All journey/mastery history references stable, durable content IDs (no positional keys)
- [ ] No hardcoded brand string ("DecaShift"/"Donnibo") in index.html / app-*.js / manifest / sw.js — all from config
- [ ] `hostname → config` resolver works; one city (Lucknow) populated; same build serves any future host
- [ ] PWA manifest per-city decision ((a) or (b)) made and implemented
- [ ] App works at every commit; build stamp + `?v=` bumped on deploy

## Files to Touch
| File | Change |
|---|---|
| `app/ui/js/app-core.js` | signup defaults (`schemaVersion`, `city`, entitlement/trial fields); config-resolve at boot |
| `app/ui/js/storage.js` | persist + Drive-sync new fields; per-user folder paths; content-ID audit |
| `app/ui/js/app-quiz.js`, `app-drill.js` (+ mastery writers) | ensure answered/mastery records key on stable IDs |
| `app/ui/config/city.json` (new) + resolver | brand identity (name/title/logo/colors/contact/coupon) |
| `app/ui/index.html`, `app-*.js`, `manifest.webmanifest`, `sw.js` | replace hardcoded brand strings with config reads |
| Apps Script (`Code.gs`) | `users/{loginId}/` folder layout; write profile/entitlement/journey files |

## Dependencies & Links
- Extends **P3-T010** (per-user session folder — already partly implemented).
- **Unblocks / is the data substrate for ENH-011** (journey-freeze paywall) and **P2-T046** (cross-device sync) — both consume entitlement + per-user folder laid down here.
- Identity model: **FEAT-002** (`loginId`, not email). City model: memory `[[strategy_operating_model]]` (config, never fork). Pricing/trial: `[[strategy_pricing_lucknow_pilot]]`.
- Cache-busting discipline: `[[project_deploy_cache_busting]]`.
