# NEXT SESSION — Test & feedback-fix, then multi-city deploy planning

**Set by user 2026-06-03.** Order is fixed: **(1) test + fix first, (2) multi-city deploy second.**

---

## Phase 1 — Test the current build & fix feedback (DO THIS FIRST)

Build to verify: **`20260603a`** (check `DONNIBO_BUILD` in console; if it says `20260602e` it's stale
cache — hard-refresh / bump again. See [[project_deploy_cache_busting]]).

### 1a. Redeploy Code.gs (manual, one-time) — REQUIRED for FEAT-005 to actually work
`app/google-apps-script/Code.gs` was rewritten to the per-user folder layout but is **NOT auto-deployed.**
Paste it into the Apps Script project → **new deployment** → confirm the Web App URL is unchanged
(matches `APPS_SCRIPT_URL` in `storage.js`). Until this is done, sync still writes the OLD flat
`users/user_X.json`.

### 1b. Verify FEAT-005 items 1–2 end-to-end
- Sign up a throwaway user → Drive shows **`users/{userId}/profile.json` + `entitlement.json`**.
- Complete a quiz → session lands in **`users/{userId}/sessions/sess_*.json`**.
- Confirm `schemaVersion:1` + `entitlement{status:'trial',trialStartedAt,...}` on the profile.
- Sign in an OLDER account → backfill adds the same fields (additive, no overwrite).
- Confirm the `loginIdHash` account fix: `accounts/acc_{hash}.json` (NOT `acc_undefined.json`) and
  cross-device sign-in finds the account.

### 1c. Regression sweep (graded-school path only — see [[project_scope_graded_school_only]])
Signup → home (lazy daily-sprint) → subject tab open → quiz → result → Journey/streak/XP. Fix whatever
testing surfaces. Graded school is the ONLY in-scope audience now; ignore college/professional.

### 1d. Then — backup + tag
Only AFTER testing passes: **merge `main → v5.0-dev`** (user rule: snapshot the backup branch only once
features are tested — [[feedback_branching_strategy]]) and tag if a milestone.

---

## Phase 2 — Multi-city custom-domain deployment (Cloudflare Pages + R2)

Full plan: **`tasks/INFRA-001-multicity-cloudflare-r2-deploy.md`**. Key points:
- **Cities = config, not clones.** Do **FEAT-005 item 5 (brand config + hostname resolver) FIRST** —
  the Varanasi/Nagpur folder-copy POC is NOT the deployment model.
- **Content stays public** (moat = journey). No signed URLs for launch.
- **Cloudflare** chosen over Azure/AWS: R2 = no egress, scales to zero, simplest for solo + INR.
- Order: FEAT-005 item 5 → PWA manifest decision → app on Cloudflare Pages → `/content` on R2 →
  add city #2 by config only (the real test of "no forking").
- **Don't touch DNS/Pages config** until parity is confirmed (standing rule).

---

## Still-open backlog (not this session unless time permits)
- FEAT-005 items 3 (city stamp), 4 (content-ID audit) — item 3 is a 1-liner, do alongside item 5.
- **P2-T046** journey.json full-state sync (the chosen "phase 2" of the per-user work; `saveJourney`
  already wired server-side). [[feat005_per_user_folder_progress]]
- **ENH-011** journey-freeze paywall + Razorpay — still THE GTM blocker; not deprioritized, just
  sequenced after the user's test + multi-city focus.
