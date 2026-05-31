# Feature: Quiz Engine (Practice Sets)

## Overview
The core learning loop. Users answer a timed set of 15 multiple-choice questions, get instant correctness feedback with explanations, and see a detailed result summary. Every session is saved to localStorage and synced to Google Drive. This is the primary XP and streak driver.

---

## User Flows

### Flow 1: Starting a Practice Set

**Entry point:** User taps a day card on the Home screen.

1. **Plan gate check** — if the set is Wed/Thu/Fri (Sets 3–5) and user's plan is `expired`:
   - Paywall screen is shown instead of quiz (see Feature 14)
   - Flow ends here

2. **Quiz screen loads** with:
   - **Challenge banner** (top of screen):
     - First attempt ever: "First time here. No pressure — just see where you start."
     - Returning: "Last time: 7/15. Can you beat it today?"
     - Personal best (≥90%): "Personal best: 14/15. Can you match it today?"
     - Friend challenge: "⚔ [Name] challenged you — beat 12/15!" (if arrived via challenge link)
   - **Progress text**: "Question 1 of 15"
   - **Progress bar**: fills as questions are answered
   - **Timer**: counts up from 0:00 (if timer is enabled in settings)
   - **Question text**: large, personalised if it contains `{{userName}}`
   - **4 answer option cards**: full-width tappable blocks

3. **Lucky Question** — one random question in the set is secretly marked as the Lucky Question (earns 2× XP on a correct answer). User is not told which one until after answering.

---

### Flow 2: Answering a Question

1. **User taps an answer card**
   - Card gets a selected highlight state
   - "Submit Answer" button becomes active

2. **User taps "Submit Answer"**
   - Timer stops; question end time is recorded
   - **Correct answer**: card turns green; ✓ icon appears; explanation panel slides down
   - **Wrong answer**: user's card turns red; correct card turns green; explanation shows
   - Lucky Question reveal: if this was the Lucky Question, a "🍀 Lucky Question! 2× XP" badge flashes
   - "Next Question" button appears

3. **User taps "Next Question"**
   - Next question loads; timer resets and restarts
   - Progress bar and counter update

4. **After last question** → Result screen renders automatically

---

### Flow 3: Result Screen

**Entry point:** User answers the last question and taps "Next Question".

1. **Result screen shows**:
   - **Score**: "12 / 15"
   - **Accuracy badge**: 🔥 Excellent (≥90%) / ✅ Good (≥70%) / ⚠ Needs Work (<70%)
   - **XP earned**: shown as a pill ("+ 145 XP")
   - **Level-up animation**: if user crossed a level threshold during this session, a celebration overlay fires
   - **Time breakdown table**: one row per question — Q#, time taken, correct/wrong indicator
   - **Mastery tier update**: goal's mastery tier recalculates (Learning → Developing → Solid → Mastered)
   - **Daily Quest progress**: if this session completes the "Practice Set" objective, quest bar updates

2. **Action buttons**:
   - **"Share Result"** → opens Share Card flow (see Feature 12)
   - **"Challenge a Friend"** → opens Friend Challenge flow (see Feature 13)
   - **"Retry"** → same set restarts from question 1 (new session ID, same questions)
   - **"Back to Home"** → navigates to Home screen

---

### Flow 4: Timer Behaviour

- Timer is **on by default**; user can disable it in Settings → Learning
- Timer counts up from 0:00, displayed as `MM:SS`
- Per-question start/end times are stored as ISO strings in the session response object
- **Session-level timer** also runs from first question to result screen

---

## Session Data Saved (per quiz)

```json
{
  "sessionId": "uuid",
  "userId": "user_abc123",
  "goalId": "grade-5-math-w23-mon",
  "sessionStart": "2026-05-31T09:00:00Z",
  "sessionEnd": "2026-05-31T09:12:00Z",
  "totalDurationSeconds": 720,
  "responses": [
    {
      "questionId": "q001",
      "selectedIndex": 2,
      "correctIndex": 2,
      "isCorrect": true,
      "startTime": "...",
      "endTime": "...",
      "durationSeconds": 28
    }
  ],
  "score": 12,
  "total": 15,
  "accuracy": 0.8
}
```

Session is saved to `localStorage` under `decashift_sessions` and silently synced to Google Drive (Apps Script endpoint) in the background.

---

## XP Awarded per Quiz

| Action | XP |
|---|---|
| Correct answer | +10 |
| Wrong attempt (effort) | +2 |
| Set complete | +25 |
| Perfect score (100%) | +20 bonus |
| Lucky Question correct | ×2 on that question's XP |

---

## Plan Gating

| Set | Days | Free | Pro |
|---|---|---|---|
| Sets 1–2 | Mon, Tue | ✅ | ✅ |
| Sets 3–5 | Wed–Fri | ❌ Paywall | ✅ |
| Exam set | Fri (special) | ❌ | ✅ |

---

## Screens Involved
- `screens/screen-quiz.html`
- `screens/screen-result.html`
- `app/ui/js/app-quiz.js` — quiz engine, result renderer
- `app/ui/js/xp.js` — XP award on result
- `app/ui/js/mastery.js` — mastery tier update
- `app/ui/js/daily-quest.js` — quest objective mark
- `app/ui/js/storage.js` — session save + sync
