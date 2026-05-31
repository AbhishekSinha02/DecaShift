# Feature: XP & Leveling System

## Overview
Every meaningful action earns XP. XP accumulates into levels on a gentle curve — early levels come fast to hook new users, later levels stretch to sustain long-term engagement. Level is the spine that drives avatar evolution, Journey screen identity, and reward unlocks. XP only ever increases (no deductions).

---

## User Flows

### Flow 1: Earning XP During a Quiz

**Entry point:** User completes a practice set.

1. User answers questions — each correct answer awards **+10 XP** immediately
2. Each wrong attempt (effort) awards **+2 XP**
3. If the answered question was the **Lucky Question** (1 random per set), correct XP is doubled (**+20 XP**)
4. On completing the set: **+25 XP** (set complete bonus)
5. On perfect score (100%): **+20 XP** extra bonus
6. Result screen shows total XP earned as an animated pill: **"+ 145 XP"**

---

### Flow 2: Level-Up Celebration

**Entry point:** XP crosses a level threshold during any XP-awarding event.

1. The app detects `fromLevel < toLevel` after adding XP
2. A **level-up overlay** fires:
   - Background dims
   - Animated burst with "Level Up! You're now Level [N]"
   - New avatar stage name shown if level crossed a stage boundary (e.g., "You're now a Fighter!")
   - Confetti, sound effect (if enabled), haptic buzz (if supported)
3. Overlay auto-dismisses after ~3 seconds or on tap

---

### Flow 3: Checking Your Level

**Entry point:** User taps "My Journey" from nav.

1. Journey screen shows:
   - **Level number**: "Level 7"
   - **XP ring**: circular progress ring filling toward next level
   - **XP bar text**: "240 / 300 XP to Level 8"
   - **Total XP** earned lifetime

---

## XP Rules (Full Table)

| Action | XP Earned |
|---|---|
| Correct answer in quiz | +10 |
| Wrong attempt (still tried) | +2 |
| Complete a practice set | +25 |
| Perfect score on a set (100%) | +20 bonus |
| Lucky Question correct (2×) | +20 (instead of +10) |
| Complete daily GK | +10 |
| Complete a flash drill | +15 |
| Complete the full Daily Quest | +50 |

---

## Level Curve

Level cost grows linearly: reaching Level N from Level N-1 costs `80 + 20 × (N-1)` XP.

Cumulative XP to reach level L: `(L-1) × (80 + 10 × L)`

| Level | Cumulative XP needed |
|---|---|
| 1 | 0 |
| 2 | 90 |
| 3 | 200 |
| 4 | 330 |
| 5 | 480 |
| 10 | 1,350 |
| 15 | 2,700 |
| 21 | 5,460 |

Early levels are quick (motivation spike). Later levels are aspirational (long-term pull).

---

## Avatar Stage Unlocks by Level

| Level | Stage | Name |
|---|---|---|
| 1 | Stage 1 | Spark |
| 3 | Stage 2 | Pup |
| 6 | Stage 3 | Rookie |
| 10 | Stage 4 | Fighter |
| 15 | Stage 5 | Champion |
| 21 | Stage 6 | Donnibo |

---

## Storage

- Total XP stored under key `donnibo_xp_v1` in localStorage
- Single integer (XP never decreases)
- Key is versioned so future migrations can transform data cleanly

---

## Screens Involved
- `app/ui/js/xp.js` — XP_RULES, levelFromXP(), addXP(), getTotalXP()
- `app/ui/js/app-quiz.js` — awards XP on result
- `app/ui/js/app-drill.js` — awards XP on drill complete
- `app/ui/js/app-gk.js` — awards XP on GK complete
- `app/ui/js/daily-quest.js` — awards +50 XP on quest complete
- `app/ui/js/app-journey.js` — reads XP for Journey screen display
