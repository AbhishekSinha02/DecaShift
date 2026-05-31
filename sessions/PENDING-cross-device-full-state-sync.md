# SESSION (Code) — Full-State Cross-Device Sync + Offline Password Reset

**Type:** Code · **Priority:** ★ HIGHEST (run immediately after the W23 French content commit).
**Task spec:** [`tasks/P2-T046-full-state-cross-device-sync.md`](../tasks/P2-T046-full-state-cross-device-sync.md)
**Approval:** functional decisions already approved (see below). Execute the spec's atomic steps
top to bottom; commit + push after each (per `feedback_git_push`, `feedback_approval_workflow`).

---

## Why this is highest priority
Switching phones today wipes the child's visible progress (XP, level, avatar, streak, stickers,
mastery, history) — only the account survives. That is a direct churn + word-of-mouth killer for
the 5K-by-Aug-2026 goal. Fix achievable with **zero new infra** (reuse existing Apps Script → Drive).

## Approved functional decisions (do not re-ask)
1. Reuse the existing Google Apps Script → Drive backend. No R2/Upstash this session.
2. Sync the **full** local state (all `ds_*` / `decashift_*` keys), not just the account.
3. Re-sync on key events (session end, level-up, streak/plan change, awards), not only signup.
4. Merge rule on restore: streak/XP/drill-bests → **max**; sessions → union by id; else newest wins.
5. **Forgot password = offline support process** (no email): support sets a default password on
   the Drive record + `mustChangePassword` flag → user logs in with default → app forces change.
6. Ship behind `FEATURES.fullSync`; flag off must equal today's behaviour.

## Pre-flight (start of session)
- Audit live code: `grep -rn "localStorage.\(get\|set\)Item" app/ui/js` → rebuild the exact key list
  (the spec's table is a guide, not gospel).
- Confirm `APPS_SCRIPT_URL` is reachable; note its current actions (saveUser/saveAccount/saveSession).
- Check `app-home.js`/`styles-app.css` line counts vs standing restructuring thresholds; note only.

## Steps
Follow [`tasks/P2-T046`](../tasks/P2-T046-full-state-cross-device-sync.md) steps 1–7 + the
password-reset section. Each step = one working commit. App must stay browser-testable throughout.

## Done when
- 2nd browser profile sign-in restores full progress (acceptance list in the task spec).
- Offline password-reset path works end to end (default password → forced change → re-sync).
- `docs/support-password-reset.md` runbook written.
- Memory `project_device_migration` updated to "shipped" with the commit hash.
- `sessions/INDEX.md` row removed; session file archived to `sessions/completed/`.
