# P2-T046 — Full-State Cross-Device Sync (+ offline password reset)

> **Priority:** ★ HIGHEST (Launch Critical). Run in the session immediately after the
> W23 French content commit.
> **Size:** M · **Risk:** Low-Medium (feature-flagged, no schema break) · **Infra:** none new.
> **Supersedes:** the email-based plan in [P2-T017](P2-T017-profile-page-password-reset.md).
> **Builds on:** [P1-T012](completed/P1-T012-drive-account-persistence-cross-device-login.md) (account-only Drive login, done).
> **Depends on:** [P2-T047 identity strategy](marketing/P2-T047-identity-strategy-userid-email-mobile.md) — the durable account KEY (handle/PIN/recovery code vs email/mobile) must be decided first; this task syncs against whatever key that decision picks.

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
   missing key. Merge rules: `streak.current`/`best`, `ds_xp`, drill bests → take **max**;
   sessions → union by `sessionId`; everything else → newer `savedAt` wins. Commit.
3. **Apps Script: `saveState` / `getState`** actions keyed by `userId` (one Drive file per user,
   same pattern as account/session). Deploy. Commit the client `syncStateToDrive()` /
   `fetchStateFromDrive()` wrappers behind a feature flag (`FEATURES.fullSync`). Commit.
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

## Out of scope (later / scale-hardening)

- Move state blob from Drive to R2/Upstash (near 5K users).
- Per-user salted / slow password hashing (separate security task).
- Real-time multi-device conflict resolution beyond timestamp + max-merge.
