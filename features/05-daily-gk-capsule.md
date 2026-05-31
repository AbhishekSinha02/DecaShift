# Feature: Daily GK Capsule

## Overview
A daily 5-question General Knowledge session with full explanations after each answer. Topic rotates weekly across 6 themes (Indian Geography, World Geography, Indian History, Science & Technology, Indian Constitution, Sports & Awards). Once completed, the GK card shows a "Done" badge for the rest of the day. Counts toward the Daily Quest.

---

## User Flows

### Flow 1: Finding the GK Capsule

**Entry point:** Home screen → Subject tabs → tap the **GK** tab.

1. User taps the GK tab in the subject row
2. Content area shows the **GK Daily Card**:
   - 🌍 icon + "Today's GK" heading
   - Today's date (e.g., "Sunday, 31 May")
   - Topic for this week (e.g., "Topic: Indian Geography")
   - "5 questions · with explanations"
   - **"Start →"** button (or "Redo" if already completed today)
   - A second card: "Current Affairs — Monthly pack · Coming soon" (teaser, locked)

3. **If already done today**: card shows ✅ Done badge, button reads "Redo"

---

### Flow 2: Playing the Daily GK Session

1. **User taps "Start →"**
   - Quiz screen loads in GK mode
   - 5 questions from this week's GK topic are loaded

2. **Each question follows the standard quiz flow**:
   - Question text is displayed
   - 4 answer options shown as cards
   - User taps an option → taps "Submit Answer"
   - Feedback: correct (green) or wrong (red) + **full explanation** always shown
   - "Next Question" button appears

3. **GK mode always shows explanations**, regardless of whether the answer was correct or wrong. This is the "reflective" learning mode — users learn the fact even if they got it right.

---

### Flow 3: GK Result

1. **Result screen shows**:
   - Score out of 5
   - Accuracy badge
   - XP earned (+10 XP for completing GK)
   - Daily Quest "GK" objective marked complete

2. **Today's fact card** (optional, coming soon):
   - "Today in India" — one curated interesting fact about today's date in history

3. **Action buttons**:
   - "Redo" → replays same session
   - "Back to Home" → Home screen

---

## Topic Rotation Schedule

Topic changes every week, cycling through 6 themes:

| Week Cycle | Topic |
|---|---|
| Week 1 | Indian Geography |
| Week 2 | World Geography |
| Week 3 | Indian History |
| Week 4 | Science & Technology |
| Week 5 | Indian Constitution |
| Week 6 | Sports & Awards |

The week index is calculated from `Math.floor(Date.now() / (7 × 86400000)) % 6`, ensuring all users globally see the same topic at the same time.

---

## Daily Reset Logic

- Completion is tracked with a date-keyed localStorage flag: `ds_gk_done_YYYY-MM-DD`
- At midnight the key no longer matches today → card resets to "Start →" state
- No server required — purely client-side date comparison

---

## GK vs Practice Set Distinction

| Aspect | Practice Set | Daily GK |
|---|---|---|
| Questions | 15 | 5 |
| Explanations | After wrong answers | Always (reflective mode) |
| Subject | Curriculum (Math/Science/etc.) | General Knowledge |
| Timer | Optional (user setting) | Optional |
| XP | +25 set complete | +10 GK complete |
| Quest objective | "Practice Set" ✓ | "GK" ✓ |
| Plan gate | Sets 3–5 require Pro | Always free |

---

## Screens Involved
- `app/ui/js/app-gk.js` — GK card renderer, done-flag logic, topic rotation
- `app/ui/js/daily-quest.js` — GK objective detection
- `app/ui/js/xp.js` — XP award on completion
- Standard quiz screen reused for the 5-question session
