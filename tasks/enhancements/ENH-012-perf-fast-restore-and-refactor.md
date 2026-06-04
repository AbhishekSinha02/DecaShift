# ENH-012 — Performance pass: fast sign-in/restore + code refactor & growth audit

> **Priority:** 🔴 P1 — **NEXT SESSION (user-set 2026-06-04).** Focus = performance +
> code refactoring. Headline problem: **cross-device restore on sign-in takes ~8–10 s** —
> make it feel instant. Plus: track how the code/line-count is growing and refactor the bulk files.
> **Size:** M · **Risk:** Low–Med (behaviour-preserving; test-guarded). Pairs with [ENH-010].

---

## Part A — Make sign-in / cross-device restore fast (the 8–10 s problem)

**Symptom:** after entering credentials, the user waits ~8–10 s before the home screen appears
(observed 2026-06-04 on the P2-T046 restore path).

**Likely root causes (verify by measuring first — add `console.time` around each await):**
1. **Two sequential Apps Script round-trips** in `_handleSignin` (app-auth.js): `fetchAccountFromDrive`
   (only when account not local) **then** `fetchStateFromDrive` (getJourney). Each pays Apps Script
   **cold-start latency** (~2–5 s) + network. Sequential = additive.
2. **`getJourney` → `_userFolder` cold-cache scan** (Code.gs): on a cache miss it iterates **every**
   `users/*` folder to find the one ending in `_userId`. With many test folders that's slow. (Warm
   Script-Properties cache makes it O(1), but the first hit per user scans.)
3. **Restore is `await`ed before the home renders** — the UI is fully blocked on the network for the
   whole 8–10 s instead of showing anything.

**Fix strategy (biggest perceived win first):**
- **A1 — Non-blocking restore (perceived-instant).** Show home immediately with whatever is local,
  then `fetchStateFromDrive` in the **background**; on arrival `restoreAll` + re-render home + re-apply
  theme. Returning user on their own device = instant (local already correct). Fresh device = home
  appears at once with a subtle "syncing your progress…" chip, then fills in. Removes the 8–10 s wall.
- **A2 — Parallelize** the account fetch and journey fetch where both are needed (don't chain two
  cold round-trips). `Promise.all` where order allows.
- **A3 — Trim Apps Script work.** Keep `getJourney`'s folder lookup O(1): ensure the Script-Properties
  cache is populated at signup (warm it on `saveUser`), so the read path never scans. Consider an
  index file (`accounts/acc_{hash}.json` could store the journey folderId) to skip the folder lookup
  entirely on read.
- **A4 — Tighten timeouts** for the restore call (it's background now, so a shorter timeout + retry is
  fine) and make a cold-start spinner state honest.
- **Measure before & after** — log the per-step timings; target: home visible **< 1 s**, journey
  reconciled **< 4 s** on a fresh device.

**Acceptance:** returning-device sign-in shows home in < 1 s; fresh-device sign-in shows home
immediately and fills restored progress within a few seconds with a visible "syncing" state; no
regression to P2-T046 correctness (progress still fully restores); flag/behaviour preserved.

## Part B — Code refactor + growth audit

The user wants visibility into how the codebase is growing and the bulk files split.

**Line-count baseline (2026-06-04, build `20260604g`):**

| File | Lines | |
|---|---|---|
| `app/ui/js/app-home.js` | **1674** | 🔴 way over 400 — top refactor target |
| `app/ui/js/app-core.js` | 751 | 🟠 over 400 |
| `app/ui/js/app-quiz.js` | 576 | 🟠 over 400 |
| `app/ui/js/app-settings.js` | 417 | 🟠 just over |
| `app/ui/js/app-auth.js` | 399 | at threshold |
| `app/ui/js/app-drill.js` | 378 | ok |
| `app/ui/js/storage.js` | 351 | ok |
| (others) | < 270 | ok |
| **JS total** | **5822** | |
| `app/ui/css/styles-app.css` | **2897** | 🔴 over 2500 — split |
| `app/ui/css/styles-landing.css` | 637 | ok |
| **CSS total** | **3919** | |

**Work:**
- **B1 — Refactor the bulk files** (this is [ENH-010]): split `app-home.js` (1674) into focused
  modules (e.g. home-render / home-shelves / home-rewards) and `styles-app.css` (2897) into themed
  partials. **Zero behaviour change, test-guarded** — run the `test/` harness before & after.
- **B2 — Growth tracking.** Record the baseline table above; print line counts at the start of each
  code session (the standing file-size check already exists — formalise it as a one-line report so
  the trend is visible over time). Flag any JS > 400 / CSS > 2500 as it crosses.

**Acceptance:** `app-home.js` and `styles-app.css` each split below threshold; no functional/visual
change (test harness + manual smoke); a line-count snapshot recorded for trend tracking.

## Notes
- Out of scope (scale-hardening, later): moving state off Apps Script/Drive to R2/Upstash — that's the
  real long-term latency fix but not for this pass. Keep Apps Script; just stop blocking on it.
- Keep changes additive and behaviour-preserving (see [[feedback_additive_not_rearchitect]]).
