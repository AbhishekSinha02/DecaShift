# P2-T046 — Full-State Cross-Device Sync: journey + preferences + appearance (+ offline password reset)

> ## ✅ STATUS 2026-06-04 — core shipped (build `20260604a`), needs live test
> **Done & pushed:** `snapshotAll`/`restoreAll` + `syncStateToDrive`/`fetchStateFromDrive`/
> `syncStateSoon` (storage.js) · re-sync on session-end/streak/freeze + sign-out flush ·
> restore-on-signin (re-applies theme/timer before home) · `getJourney` read-half in Code.gs ·
> Settings → My Progress **Export backup / Restore from file** · flag `FEATURES.fullSync=true`.
> Snapshot/restore round-trip verified in Node. Offline-password-reset **support runbook**
> written (`docs/support-password-reset.md`); in-app change-password already exists + syncs.
>
> **⚠️ REMAINING before this can be ticked off:**
> 1. **Manual Apps Script redeploy** of `Code.gs` (edit existing deployment → New version to keep
>    the URL stable) — the **`getJourney` read path is dead until this is done**; `saveJourney`
>    write path already deployed (v3), so writes work now.
> 2. **Smoke test (plan step 7):** signup → earn XP/sticker/streak → sign out → sign in on a
>    second browser profile → progress restored. Verify `DONNIBO_BUILD=20260604a` live first.
> 3. **(Deferred sub-item)** `mustChangePassword` forced-change screen — self-service change in
>    Settings works today, so not launch-blocking. Per-key merge / two-device merge also deferred
>    (see Low-priority polish below).

> **Priority:** ★ HIGHEST (Launch Critical) — **NEXT SESSION (user-set 2026-06-04).** Sync the
> COMPLETE user journey, preferences, and appearance/theme prefs to Drive. Phase 1 (FEAT-005
> per-user folder) is tested and live, so this is now the binding gap: today the journey is
> write-only/lost on device switch.
> **Size:** M · **Risk:** Low-Medium (feature-flagged, no schema break) · **Infra:** none new.
> **Supersedes:** the email-based plan in [P2-T017](P2-T017-profile-page-password-reset.md).
> **Builds on:** [P1-T012](completed/P1-T012-drive-account-persistence-cross-device-login.md) (account-only Drive login, done)
> and **FEAT-005 items 1–2 (SHIPPED + tested 2026-06-04)** — per-user folder `users/{userId}/` is live, and the
> server already exposes a **`saveJourney` action** that writes `users/{userId}/journey.json`. **Server write-half
> exists; this task builds the client snapshot/restore + the read-half.** See [[project_deploy_architecture]],
> [[feat005_per_user_folder_progress]].
> **Dependency CLEARED:** [P2-T047 identity](marketing/P2-T047-identity-strategy-userid-email-mobile.md) is
> **resolved** — account key = **User ID** (`state.user.userId`; FEAT-002 shipped). Sync against `userId`.

---

## Problem

All user data lives in `localStorage`, siloed per device × browser. The existing Drive
sync (`storage.js`) carries only the **account record + a stale streak**, written **once at
signup**. So a user who switches phones signs in and finds their account but a reset-looking
child: **XP, level, avatar evolution, stickers/mystery box, mastery, drill PBs, quiz history,
daily-quest progress are all lost.** That is the exact "see yourself grow" data whose loss
kills retention and word of mouth — the only growth channel for the 5K goal.

## Goal

When a user signs in on any device with email + password, **their full progress is restored**.
Ongoing progress re-syncs automatically. Zero new infrastructure — reuse the existing Google
Apps Script → Drive endpoint (`APPS_SCRIPT_URL` in `storage.js`).

## Current data inventory (everything that must travel)

| Key | Module | Synced today? |
|---|---|---|
| `decashift_user`, `decashift_user_id`, `decashift_accounts` | storage.js | ✅ (account, at signup only) |
| `decashift_streak` | storage.js | ⚠️ stale (signup snapshot) |
| `decashift_sessions` | storage.js | ⚠️ push-only, never restored |
| `ds_xp` | xp.js | ❌ |
| `ds_avatar` | app-core/app-home | ❌ |
| `ds_collectibles`, `ds_stickers`, `donnibo_box_state`, `donnibo_album_done` | collectibles/home/journey | ❌ |
| `ds_mastery` | mastery.js | ❌ |
| `ds_drill_records`, `ds_drill_bests` | app-drill/home | ❌ |
| `ds_quest_ritual`, daily-quest flags (`_flagsKey`) | daily-quest.js | ❌ |
| `ds_gk_done_*` | app-gk.js | ❌ |
| `ds_reward_card*` | app-home.js | ❌ |
| `ds_grade`, `ds_subject`, `ds_last_subject`, `decashift_theme`, `decashift_timer`, `decashift_onboarded` | various | ❌ (grade also in profile) |

> Build the key list by auditing live code at session start (grep `localStorage.(get|set)Item`),
> don't trust this table blindly — modules may have changed.

## Plan (atomic, commit after each step — app must work throughout)

1. **`Storage.snapshotAll()`** — return `{ version, savedAt, userId, keys: {…} }` bundling every
   user key above. Pure read, no behaviour change. Commit.
2. **`Storage.restoreAll(blob)`** — write each key back; skip unknown keys; never throw on a
   missing key. **v1 = last-write-wins: newest `savedAt` snapshot wins, whole-blob.** Keep it
   dead simple. (Per-key max-merge + sessions-union is explicitly DEFERRED — see Low-priority
   polish below. User call 2026-06-04: ship simple, don't hyper-engineer.) Commit.
3. **Apps Script: write-half already exists** — the deployed v3 `Code.gs` has a **`saveJourney`**
   action writing `users/{userId}/journey.json`. **Only the READ-half is missing:** add a
   **`getJourney`** doGet action (return `users/{userId}/journey.json` or `{found:false}`), mirror
   of `getAccount`. ⚠️ Apps Script is manual-deploy (see [[project_deploy_architecture]] for the new
   URL + the gitlink/Pages gotcha). Commit the client `syncStateToDrive()` (→ `saveJourney`) /
   `fetchStateFromDrive()` (→ `getJourney`) wrappers behind a feature flag (`FEATURES.fullSync`). Commit.
4. **Restore on sign-in** — after existing account fetch in `_handleSignin`, call
   `fetchStateFromDrive(userId)` → `restoreAll()` → re-render home. Commit.
5. **Re-sync on key events** — debounced `syncStateToDrive()` on: session end, level-up,
   streak update, plan change, sticker/box award. (Replace the signup-only push.) Commit.
6. **Manual Backup/Restore fallback** in Settings — "Export backup" (download full snapshot
   JSON) + "Restore from file" (import → `restoreAll`). Works even if Apps Script is down.
   Commit.
7. **Flip `FEATURES.fullSync` on**, smoke-test signup→progress→signout→signin on a second
   browser profile. Commit.

## Offline password reset (replaces email flow)

- **Change-password UI** in Settings/Profile: verify current password → set new
  `passwordHash` locally → `syncAccountToDrive()` so the new hash reaches Drive. Commit.
- **Support runbook** (`docs/support-password-reset.md`): user requests reset → support sets a
  **known default password hash** on that user's Drive account record (manual Sheet/Drive edit
  or a tiny admin Apps Script action) → user signs in with the default → app **forces** the
  change-password screen on first login when a `mustChangePassword` flag is set.
- Add `mustChangePassword` boolean to the account record; signin checks it and routes to the
  forced change screen before home.

## Acceptance

- New browser profile → sign in → XP, level, avatar stage, streak, stickers, mastery, drill PBs,
  quiz history all match the original device.
- Earning XP/sticker on device A appears on device B after next sign-in.
- Support can reset a password offline; user logs in with default and is forced to change it.
- Apps Script unreachable → app still works (local-first); manual backup/restore still functions.
- Feature is flag-guarded; flag off = today's behaviour exactly.

## ⬇ Low-priority polish (DEFER — do NOT do in the first build; user call 2026-06-04 "we have a mountain to move")

> The core v1 (snapshot on key events → restore whole blob, last-write-wins, on sign-in) is enough
> to make "see yourself grow" durable across devices/incognito. The items below are refinements only
> — park them here so the thought isn't lost, but they are explicitly NOT launch-blocking.

- **Two-device merge** — if the same user earns progress on two devices, do per-key smart merge:
  `ds_xp`/streak/drill-bests → take **max**; sessions → **union** by `sessionId`; prefs → newest wins.
  (v1 last-write-wins can let a stale device overwrite higher progress — acceptable for launch since
  almost everyone uses one device.)
- **Offline-restore robustness** — restore needs Drive reachable at sign-in; harden the offline path
  (retry/queue, "syncing…" state). v1 is already local-first so the app never blocks; this is polish.

## Out of scope (later / scale-hardening)

- Move state blob from Drive to R2/Upstash (near 5K users).
- Per-user salted / slow password hashing (separate security task).
