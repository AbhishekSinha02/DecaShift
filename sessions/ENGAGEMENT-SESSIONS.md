# Donnibo — Engagement Sessions (E-track build plan)

> Strategy: `tasks/ENGAGEMENT-STRATEGY.md` — "The Daily Pull" framework.
> Each session is independently shippable; the app works at every commit (Code Stability Rules).
> How to run: say **"start the session"** → run the Priority-1 pending session below, top to bottom.

---

## Session order & status

| # | Session | Theme (force) | Tasks | Size | Status |
|---|---|---|---|---|---|
| **E1** | Responsive Excellence | Substrate | E-001, E-002 | S + L | ✅ Done |
| **E2** | The Daily Pull | Ritual | E-003, E-004 | M + M | ✅ Done |
| **E3** | See Yourself Grow | Identity | E-005, E-006, E-007 | M + L + M | ✅ Done |
| **E4** | Game Juice | Juice | E-008, E-009 | M + M | ✅ Done |

### Wave 2 — depth & virality (specced 2026-05-29)

| # | Session | Theme (force) | Tasks | Size | Status |
|---|---|---|---|---|---|
| **E5** | Variable Reward | Reward | E-012, E-010, E-011 | S + M + L | ✅ Done |
| **E6** | Belonging & Virality | Belonging | E-015, E-013 | M + M | ✅ Done |
| **E7** | Re-engagement | Ritual | E-014 | L | Pending |

> **Wave 1 verified live (Playwright, 2026-05-29)** — the see-yourself-grow loop fires with zero console
> errors. Wave 2 builds on the real modules it shipped: `xp.js`, `feedback.js`, `avatar.js`,
> `storage.js` freezes, the Journey screen, and `design/avatars/expr-*.svg` for the collectible pool.

---

## E1 — Responsive Excellence
**Goal:** Donnibo is world-class on tablet and laptop, not a stretched phone column.
**Do in order — phone parity is a hard gate at every step:**
1. **E-001** Fluid responsive foundation — clamp type/spacing/container tokens. Commit (phone pixel-parity).
2. **E-002** Tablet layer: multi-card browse rows, 2-col header band, 2-up settings. Commit.
3. **E-002** Laptop layer: left nav rail (drawer hidden ≥1024px), 1200px content, hover states, 2×2 quiz. Commit.
**Verify:** screenshots at 375 / 768 / 1024 / 1440px. Phone must be unchanged.
**Ships:** the half of the director's mandate that's currently missing.

## E2 — The Daily Pull
**Goal:** the app engineers the return; the daily loop has a satisfying shape.
1. **E-003** Continue hero (resume exact set+question). Commit.
2. **E-003** Daily Quest card (2–3 objectives, live progress, midnight reset, day-complete state). Commit.
3. **E-004** Streak-freeze accounting in `updateStreak` (earn/bank/consume, no shame on reset). Commit.
4. **E-004** Completion ritual overlay (once/day, fires on quest complete). Commit.
**Verify:** complete the quest → ritual fires once; miss a day with/without a freeze behaves correctly.
**Ships:** the strongest return mechanic the app lacked.

## E3 — See Yourself Grow
**Goal:** XP, levels, an evolving avatar, and a profile that is the kid's identity.
1. **E-005** XP engine (`xp.js`: rules, curve, `levelFromXP`) — award on session-finalize. Commit (no UI).
2. **E-005** Surface XP: header level ring + "+XP" on result + level-up overlay. Commit.
3. **E-006** Avatar `stageFromLevel` + static render in header (fallback to initial). Commit.
4. **E-006** Stage-up "evolved" reveal + lazy SVG + SW cache. Commit. Close P3-T004 + BUG-010.
5. **E-007** Journey screen: hero + stats. Commit.
6. **E-007** Journey: mastery map (D-012 + D-017) + badges grid. Commit.
7. **E-007** Journey: replay animation + share card. Commit. Close D-012, D-017.
**Verify:** earn XP → ring moves → cross level → overlay → cross stage → evolution → Journey reflects all.
**Ships:** the emotional core of the brand — "See yourself grow" made real.

## E4 — Game Juice
**Goal:** sound, haptics, particles, transitions — every screen feels premium.
1. **E-008** `feedback.js` engine + Settings mute toggle (no call sites yet). Commit.
2. **E-008** Wire feedback into quiz/drill/GK + confetti on level-up/evolve/ritual/perfect set. Commit.
3. **E-009** `navigateTo` transition system + nav history. Commit.
4. **E-009** Skeleton loaders for browse/quiz/journey. Commit.
**Verify:** reduced-motion + muted both fully degrade; 60fps on a mid Android.
**Ships:** the production polish that out-classes Netflix/YouTube on feel — right before marketing.

---

# ══════════ WAVE 2 ══════════

## E5 — Variable Reward
**Goal:** the "I never know what I'll get" pull, pointed at learning effort.
1. **E-012** Lucky question / XP crit — one 2× question per set, ✨ tag, crit feedback. Commit (S, atomic).
2. **E-010** `collectibles.js` store + roll logic (silent). Commit.
3. **E-010** Mystery box overlay + milestone triggers (queued after level/evolve). Commit.
4. **E-011** Sticker album grid in Journey (owned vs locked). Commit.
5. **E-011** NEW-ribbon + set-complete polish. Commit.
**Verify:** hit a streak/level milestone → box opens once; earned sticker appears in album; lucky question doubles XP.
**Ships:** the collectible economy — boxes to open, a set to complete.

## E6 — Belonging & Virality
**Goal:** the share *is* the product showing off the child; the challenge *requires* a new session.
1. **E-015** `sharecard.js` canvas renderer (avatar+level+stat) + download. Commit.
2. **E-015** Wire image share into Journey + evolution/milestone overlays (supersede text share). Commit.
3. **E-013** `challenge.js` encode + "Challenge a friend" link on result. Commit.
4. **E-013** Parse `?ch=` on init → route into the set + challenger banner. Commit.
5. **E-013** Head-to-head result compare + rematch CTA. Commit.
**Verify:** share produces a real PNG; a `?ch=` link opens the set and shows who won.
**Ships:** the growth loop — branded image cards + friend challenges, the only marketing channel that scales.

## E7 — Re-engagement
**Goal:** engineer the return from outside the app — honestly, within no-backend limits.
1. **E-014** Minimal `sw.js` + register + `notificationclick`. Commit.
2. **E-014** Settings daily-reminder time/toggle + permission flow. Commit.
3. **E-014** Streak-save nudge (freeze-aware) + Notification Triggers where supported. Commit.
**Verify:** reminder fires on next open / in-tab; streak-at-risk nudges, freeze-covered does not; denied permission degrades to in-app banner.
**Ships:** the nudge — the return trigger, with iOS-closed-push honestly out of scope until paid infra.

---

## After Wave 2
1. Re-score launch confidence — expect Reward/Belonging gains on top of Wave 1.
2. Pull the §6 metrics (D7 return, quest completion, sessions/active-day, streak survival, avg level, **share-card sends**, **challenge opens**).
3. Decide on paid-infra items deferred by constraint: true push server (E-014), real-exam leaderboard (P5-T003).
