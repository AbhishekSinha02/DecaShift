# Feature: My Journey (Profile & Progress Screen)

## Overview
The student's identity screen. Shows who they are in the app: evolving avatar, level + XP ring, daily practice streak, lifetime stats, concept mastery tiers per subject, badges, and a growth replay animation. Everything renders offline from local data — no server required.

---

## User Flows

### Flow 1: Opening My Journey

**Entry point:** User taps "My Journey" from the drawer nav, user menu dropdown, or header.

1. Drawer/menu closes
2. Journey screen animates in
3. All sections render from localStorage data

---

### Flow 2: Reading the Journey Screen

The screen has the following sections, top to bottom:

#### 2a. Avatar + Identity
- Full-size Donnibo avatar (current evolution stage)
- **Level ring**: SVG circle filling clockwise to show progress within current level
- **Stage name**: e.g., "Rookie"
- **Level number**: e.g., "Level 7"
- **XP progress text**: "240 / 300 XP to Level 8"

#### 2b. Streak & Freezes
- **Current streak**: "🔥 14 days" (or "— days" if no streak)
- **Streak freeze count**: number of available streak freezes (max 2)
- Visual: a row of flame icons or calendar dots for the last 7 days

#### 2c. Lifetime Stats
- Total sessions completed
- Total questions answered
- Overall accuracy (%)
- Total time spent learning
- Longest streak ever

#### 2d. Concept Mastery (per subject)
- A grid or list of every practice set the user has attempted
- Each set shows its **mastery tier**:
  - ○ Not started
  - 📖 Learning (1+ session, <60% accuracy)
  - 📗 Developing (1+ session, ≥60% accuracy)
  - ⭐ Solid (3+ sessions, ≥70% accuracy)
  - 🏆 Mastered (5+ sessions, ≥85% accuracy)
- Tapping a set shows: best score, average accuracy, total attempts

#### 2e. Badges
- Earned achievement badges (e.g., "First Perfect Score", "7-Day Streak", "Level 10")
- Locked badges shown in greyscale with unlock condition displayed

#### 2f. Growth Replay (Journey Animation)
- A 6–10 second animation that replays the user's full avatar evolution arc
- Shows mini versions of all 6 stages appearing in sequence
- A "See your growth" celebration moment — designed to be emotionally resonant for parents watching

---

### Flow 3: Mastery Tier Calculation (behind the scenes)

The mastery tier updates automatically after every quiz session:

1. After a quiz completes, the result is saved to `decashift_sessions`
2. Journey screen reads all sessions for each `goalId`
3. `Mastery.tierFor(sessions)` calculates the tier:
   - 0 sessions → "Not started"
   - 1+ session, any accuracy → "Learning"
   - 1+ session, ≥60% avg → "Developing"
   - 3+ sessions, ≥70% avg → "Solid"
   - 5+ sessions, ≥85% avg → "Mastered"
4. The tier icon and label update next time Journey is opened

---

### Flow 4: Closing Journey

1. User taps the **back arrow** or "← Home" button
2. Home screen renders; Journey screen hides

---

## Mastery Tier Reference

| Tier | ID | Icon | Sessions Needed | Min Accuracy |
|---|---|---|---|---|
| Not started | `none` | ○ | 0 | — |
| Learning | `learning` | 📖 | 1 | 0% |
| Developing | `developing` | 📗 | 1 | 60% |
| Solid | `solid` | ⭐ | 3 | 70% |
| Mastered | `mastered` | 🏆 | 5 | 85% |

---

## "Your Best" Stat (per set)

For each set where the user has played, the Journey shows:
- **Best session**: highest accuracy run, with score (e.g., "14/15")
- **Average accuracy** across all attempts
- **Total attempts** count

This gives the student a clear "I improved from X to Y" narrative over time.

---

## Data Sources (all local)

| Data | Source |
|---|---|
| Level + XP | `donnibo_xp_v1` (localStorage) via `xp.js` |
| Avatar stage | `avatar.js` — derived from level |
| Streak | `decashift_streak` (localStorage) via `storage.js` |
| Sessions history | `decashift_sessions` (localStorage) |
| Mastery | Computed from sessions by `mastery.js` |
| Badges | Computed from milestone checks |

---

## Screens Involved
- `screens/screen-journey.html`
- `app/ui/js/app-journey.js` — full render logic
- `app/ui/js/xp.js` — level + XP data
- `app/ui/js/avatar.js` — avatar stage
- `app/ui/js/mastery.js` — mastery tier calculation
- `app/ui/js/storage.js` — streak + sessions
