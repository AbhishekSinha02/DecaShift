# Feature: Daily Quest

## Overview
A three-objective daily mission visible at the top of the Home screen. Completing all three objectives earns a Mystery Box reward and XP bonus. Resets at midnight. Designed to create a daily return habit — users come back to complete the quest, not just to browse.

---

## User Flows

### Flow 1: Viewing the Daily Quest

**Entry point:** User arrives at the Home screen (any time of day).

1. The **Daily Quest bar** is visible near the top of the Home screen, below the header
2. It shows three objective dots/icons:
   - 📚 **Practice Set** — complete any weekly content set today
   - ⚡ **Flash Drill** — complete any flash drill today
   - 🌍 **GK** — complete the daily GK capsule today
3. Each objective shows a checkmark ✅ when done, or an empty circle ○ when pending
4. A progress counter shows "2 / 3 done" or "Quest Complete! 🎉"

---

### Flow 2: Completing the Quest Step by Step

**Objective 1: Practice Set**

1. User navigates to any subject tab → taps a day card → completes the quiz
2. On returning to Home (or in real time), the Practice Set dot flips to ✅
3. Detection: checks `localStorage` for any non-GK session with today's date

**Objective 2: Flash Drill**

1. User taps a drill card on the Flash Drills shelf → completes the drill
2. Drill engine calls `DailyQuest.mark('drill')` on completion
3. Drill dot flips to ✅
4. Detection: explicit flag `ds_quest_YYYY-MM-DD` → `{ drill: true }`

**Objective 3: GK**

1. User taps GK tab → completes the Daily GK session
2. GK done flag is set; quest detects it
3. GK dot flips to ✅
4. Detection: checks `ds_gk_done_YYYY-MM-DD` flag OR a GK-type session for today

---

### Flow 3: Quest Completion Reward

1. When all three objectives are done, the quest bar shows "Quest Complete! 🎉"
2. **XP bonus**: +50 XP is awarded for completing the full quest
3. **Mystery Box** drops (see Feature 11): reward notification slides up from bottom of screen
4. A **celebration ritual** fires: confetti burst, sound effect (if sound is on), haptic pulse (if device supports it)

---

## Detection Logic (Accuracy Rules)

The quest derives completion from existing data — no manual tracking needed for two of three objectives:

| Objective | Detection method | Explicit flag needed? |
|---|---|---|
| Practice Set | Any completed non-GK session dated today | No — derived from session history |
| GK | `_isDailyGKDone()` OR a GK-type session today | No — derived |
| Drill | `ds_quest_YYYY-MM-DD.drill === true` | **Yes** — drills don't save dated sessions |

This means the quest is correct even across page reloads, multiple tabs, or app restarts.

---

## Daily Reset

- Quest state is rebuilt fresh each day from current data
- No explicit reset needed — date-keyed flags expire naturally
- Yesterday's completed quest has no effect on today's

---

## Quest & Streak Relationship

- Completing the quest contributes to maintaining the Daily Practice streak
- The streak tracks consecutive days of any practice activity, not strictly quest completion
- Quest completion is a superset of streak-maintenance (quest = all 3; streak = any 1)

---

## XP Summary

| Event | XP |
|---|---|
| Quest: all 3 objectives complete | +50 |
| (Individual objective XP is awarded when each activity completes, not here) | — |

---

## Screens Involved
- `app/ui/js/daily-quest.js` — state derivation, mark(), getState(), render
- `app/ui/js/app-home.js` — `_renderDailyQuest()` renders the bar on Home
- `app/ui/js/xp.js` — questComplete XP award
- `app/ui/js/collectibles.js` — mystery box reward on quest complete
