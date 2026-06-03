# ENH-011: Journey-Freeze Paywall + Razorpay Subscription Flow (G2)

**Priority:** 🔴 **P0 — highest. The single binding blocker for paid GTM.**
**Type:** App Enhancement (Product + Code) | **Complexity:** L (1.5–2 sessions) | **Status:** Open — NEXT SESSION

> **Why P0:** This is **G2** in the GTM readiness score — the one thing that, unbuilt, makes the
> entire paid launch a non-event. You cannot collect money without it. It does **not** block
> *starting* acquisition (free 30-day trial, no payment needed day 0) but it **must land inside
> the first 30 days** while the first trials mature. Build it during the trial window.
>
> Strategy source of truth (now closed/defined): `tasks/marketing/completed/P2-T013-subscription-tier-design.md`,
> `tasks/marketing/POSITIONING-AND-GROWTH-ENGINE.md` (journey-is-the-moat), `GTM-READINESS-SCORE.md` (G2).
> The subscription strategy is **embedded below** so this task is self-contained.

---

## The Core Idea: gate the JOURNEY, not the content

At trial end, a free user's **forward growth freezes — it is NEVER deleted.** The avatar stops
evolving (visibly one stage from the next), the streak pauses, new badges/GK lock, and nothing
they do counts toward growth until they upgrade. This weaponizes the existing 9/10 engagement
engine (XP, 6-stage avatar, badges, streaks, Journey) as the conversion lever. Loss aversion on
*identity and progress* >> loss aversion on *content*.

**Two hard rules (founder's guardrail — non-negotiable):**
1. **Freeze, never delete.** Paywall copy is *"Your journey is saved. Continue growing →"* —
   never "trial expired" or anything that reads as loss/deletion.
2. **The journey must survive device + credential changes.** A paying child losing their journey
   on a phone switch breaks the one thing they paid for. → hard-depends on **cross-device sync
   (P2-T046)**; until that ships, paid users must be warned not to clear storage / switch devices,
   and plan state MUST live in Drive (it already can — see Data Model).

---

## Embedded Subscription Strategy (the paywall contains this)

### Tiers
| Tier | Price | Effective /mo | Unlocks | Role |
|---|---|---|---|---|
| **Practice (Monthly)** | ₹399/mo | ₹399 | Full app except live exams | Decoy — makes annual obvious; small link, never the headline |
| **Annual** ⭐ | **₹1,999/yr** | ₹166 | Full app except live exams | **Hero / "Most Popular"** — lead with this |
| **Champion (Annual+)** | ₹3,599/yr | ₹300 | Everything **+ weekly/monthly live exams** | Premium; competes with PW on price |
| **Sibling add-on** | +₹999/yr | — | Adds one more child seat | Highest ARPU/word-of-mouth lever (UP joint families) |

### Trial
- **30 days, full access, no card.** Trial clock from Drive-synced `createdAt` (clearing
  localStorage does not reset it).
- Sales rep may extend to **45 days** via `EXT45` coupon (rep tool, not advertised).

### Coupons + guardrail
| Coupon | Effect | Rule |
|---|---|---|
| `LUCKNOW500` | Founding price **₹1,499/yr locked for life** + "Founding Member" badge | First 500 paid only; then auto-expires |
| `STREAK21` | 20% off annual | Auto-offered at a 21-day practice streak (product-earned) |
| `WIN-[repname]` | ≤25% off, rep-discretionary | Tracked per rep (ref attribution) |
| `EXT45` | Extends trial to 45 days | Rep-issued only |

**Floor-price rule (enforce in code):** after all stacked discounts, **never sell annual below
₹1,199/yr.** Reject any combination that would.

---

## Data Model (user object — localStorage + Drive)

```js
{
  plan: 'trial' | 'monthly' | 'annual' | 'champion',  // default 'trial' at signup
  planExpiry: "2027-06-02T...",   // ISO; for paid plans
  createdAt:  "2026-06-02T...",   // trial clock — Drive-synced, tamper-resistant
  founding:   false,              // true if LUCKNOW500 redeemed (lifetime price lock)
  siblings:   [],                 // linked child profiles (sibling add-on)
  couponsUsed: []                 // redemption ledger (prevent re-use)
}
```
Plan state is written to Drive via the existing `syncAccountToDrive` / Apps Script path
(no new infra). **Drive is the source of truth for `plan`** so a localStorage clear can't grant Pro.

---

## Gate Logic (app.js / app-core.js)

```js
function _planActive(user) {
  if (['monthly','annual','champion'].includes(user.plan)) {
    return new Date(user.planExpiry) > new Date();
  }
  const days = Math.floor((Date.now() - new Date(user.createdAt)) / 86400000); // trial
  return days <= 30;
}

// On session start — before loading questions:
if (!_planActive(state.user)) {
  state.journeyFrozen = true;     // renderers show "ready to grow — continue" frozen state
  const answeredIds = _getAnsweredQuestionIds(state.user.loginId);  // loginId, NOT email
  if (answeredIds.length === 0) { showPaywall(); return; }
  state.questions = state.questions.filter(q => answeredIds.includes(q.id)); // replay only
}

// At every growth-award site (XP, badge, streak, avatar stage, GK streak, sticker, mystery box):
//   if (state.journeyFrozen) return;   // past preserved; forward growth paused
```

**Audit the growth-award call sites** (these must respect `journeyFrozen`): `app-quiz.js`
(XP/score), `app-drill.js` (PB/XP), streak update, badge/sticker award, avatar-stage compute,
GK done-state, mystery box. Grep for where XP/streak/badges are written.

---

## Paywall / Upgrade Screen (the conversion asset)

Lead with the **frozen journey**, not the price:

```
┌─────────────────────────────────────┐
│  Aarav's journey is saved ✓          │
│  🏅 12 badges · 🔥 18-day streak      │
│  Avatar: Stage 4 → ready for Stage 5 │
│  [frozen avatar art, mid-evolution]  │
│  His growth is paused. Continue it →  │
│                                      │
│  ⭐ Annual — ₹1,999/yr (₹166/mo)      │
│     [ Continue Aarav's journey ]     │
│  Champion ₹3,599 · adds live exams   │
│  Add a sibling: +₹999/yr             │
│  Have a coupon? [_______] [Apply]     │
│                                      │
│  [ Keep practicing (growth paused) ] │
└─────────────────────────────────────┘
```
- Show the child's **real** name + real stats (badges, paused streak, avatar one stage from
  evolving). That visible frozen growth IS the trigger.
- Annual is the hero; monthly is a small text link.
- Bottom option = no hard wall (replay allowed, growth stays paused).
- **Never** the words "trial expired" / "deleted" / "lost."

---

## Razorpay Flow

### Phase 1 — Manual (first ~30 sales, the Lucknow pilot) — build this first
1. Paywall "Continue journey" → opens a **Razorpay Payment Link** for the chosen tier
   (Razorpay, not Stripe — UPI + native INR + instant in India).
2. Parent pays via UPI/card → Razorpay sends confirmation to founder.
3. Founder sets `plan` + `planExpiry` (+ `founding`/`siblings` if applicable) in the user's
   **Drive** record (a tiny admin step / Apps Script param).
4. User refreshes / next sync → `_planActive()` true → journey un-freezes, full access restored.
- Coupon entered in the paywall is validated client-side (floor-price guard) and recorded; the
  rep/founder applies the matching Payment Link. Setup ≈ 20 min, no server.

### Phase 2 — Automated (after pilot proves out) — defer
Razorpay **webhook** → existing Google Apps Script `doPost(e)` → find user by `loginId` →
set `plan`/`planExpiry` in Drive. ~30 lines added to the script that already does Drive sync.
Behind the same feature flag. **Do not build Phase 2 until Phase 1 has real sales.**

---

## Build Plan — Atomic, App-Never-Breaks (per CLAUDE.md Code Stability Rules)

Hidden behind a flag the whole time: `const FEATURES = { paywall: localStorage.getItem('ds_paywall') === 'true' };`
Each step commits green and is browser-testable:

1. **Data model + plan read.** Add `plan`/`planExpiry`/`founding`/`siblings`/`couponsUsed`
   defaults at signup; `_planActive()`; Drive round-trip of plan fields. No UI change. Commit.
2. **`journeyFrozen` plumbing.** Set the flag in the session-start gate; add `if (journeyFrozen) return;`
   guards at every growth-award site. Behind flag. Verify growth pauses, past intact. Commit.
3. **Paywall screen (static).** Hidden `#screen-paywall` div + styles; renders child name + real
   stats + frozen avatar. Wire `showPaywall()`. Commit.
4. **Tier selection + Razorpay Payment Links.** Buttons open the correct payment link per tier;
   sibling add-on. Commit.
5. **Coupon redemption + floor guard.** Validate `LUCKNOW500`/`STREAK21`/`WIN-*`/`EXT45`;
   enforce ₹1,199 floor; ledger to `couponsUsed`. Commit.
6. **Manual plan-set verified end-to-end** (set plan in Drive → un-freeze on refresh). Commit.
7. **Flip flag on** (`ds_paywall`), QA full trial→freeze→pay→unfreeze loop, then default-on +
   build stamp bump + `?v=` cache-bust (per CLAUDE.md). Commit + tag.

> Phase 2 webhook is a separate later task — not in this build.

---

## Acceptance Criteria
- [ ] `plan`/`planExpiry`/`founding`/`siblings`/`couponsUsed` on profile; default `trial`; Drive-synced
- [ ] `_planActive()` (30-day trial from Drive `createdAt`; paid via `planExpiry`)
- [ ] `journeyFrozen` freezes ALL growth (XP, streak, badges, avatar stage, GK, stickers, box) — **never deletes**
- [ ] Replay of past questions still allowed when frozen
- [ ] Paywall screen leads with frozen journey + real child stats; annual-led; sibling add-on; coupon field
- [ ] Razorpay Payment Links per tier (Phase 1 manual); plan set in Drive un-freezes on refresh
- [ ] Coupons: `LUCKNOW500` (cap 500), `STREAK21`, `WIN-[rep]`, `EXT45`; **floor ₹1,199/yr enforced**
- [ ] Copy never says "expired/deleted/lost"; always "journey saved · continue"
- [ ] Behind `FEATURES.paywall` until step 7; app works at every commit
- [ ] Build stamp + `?v=` bumped on deploy

## Files to Touch
| File | Change |
|---|---|
| `app/ui/js/app-core.js` | `_planActive()`, `journeyFrozen` gate at session start, plan defaults |
| `app/ui/js/app-quiz.js`, `app-drill.js` | `journeyFrozen` guards at growth-award sites |
| `app/ui/js/app-home.js` / journey/avatar renderers | frozen-state visuals (avatar "ready to evolve") |
| `app/ui/js/app-settings.js` | "My Plan" shows tier/expiry/days-left; coupon entry |
| `app/ui/js/storage.js` | persist + Drive-sync plan fields; coupon ledger |
| `app/ui/screens/` (index/screen html) | `#screen-paywall` markup |
| `app/ui/css/styles-app.css` | paywall + frozen-journey styles |
| Apps Script (Phase 2 only) | webhook `doPost` plan-set — deferred |

## Dependencies
- **Hard-depends on P2-T046 (cross-device journey sync)** for paid-user safety — see [[project_device_migration]].
  Until P2-T046, plan lives in Drive (works) but full journey restore on a new device does not.
- P2-T047 (identity decision) gates P2-T046.
- Supersedes **FEAT-004** (old ₹79 payment) — moved to completed.
- Strategy: completed/P2-T013 (subscription), POSITIONING-AND-GROWTH-ENGINE, LUCKNOW-LAUNCH-STRATEGY.
