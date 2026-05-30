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
| **E4** | Game Juice | Juice | E-008, E-009 | M + M | Pending |

> Wave 2 (E-010–E-015: mystery rewards, sticker album, XP crits, friend challenge, notifications,
> shareable achievement cards) gets specced after E4 ships and we have live engagement data.

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

## After E4
1. Re-score launch confidence (currently 83/100) — expect Identity/Engagement gains.
2. Pull the §6 metrics (D7 return, quest completion, sessions/active-day, streak survival, avg level).
3. Spec Wave 2 (E-010–E-015) against what the data says is working.
