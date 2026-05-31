# TC-03 — Quiz Engine (Practice Sets)

**Feature:** Quiz Engine  
**Reference:** `features/03-quiz-engine.md`  
**Tester:** ___________  **Date:** ___________

---

## Test Cases

### TC-03-001 — Starting a quiz navigates to quiz screen
| Field | Detail |
|---|---|
| **Preconditions** | Home screen; user has free/trial plan; Math Monday card visible |
| **Steps** | 1. Tap Monday Math day card |
| **Expected Result** | Quiz screen loads; "Question 1 of 15" visible; progress bar at 0%; challenge banner visible |
| **Pass Criteria** | Quiz screen rendered with first question |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-03-002 — Challenge banner shows correct message on first attempt
| Field | Detail |
|---|---|
| **Preconditions** | No prior session exists for this set |
| **Steps** | 1. Start any set for the first time |
| **Expected Result** | Banner reads "First time here. No pressure — just see where you start." |
| **Pass Criteria** | Exact or equivalent first-time message shown |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-03-003 — Challenge banner shows last score on return attempt
| Field | Detail |
|---|---|
| **Preconditions** | A prior session exists with score 8/15 for this set |
| **Steps** | 1. Start the same set again |
| **Expected Result** | Banner reads "Last time: 8/15. Can you beat it today?" |
| **Pass Criteria** | Previous score referenced in banner |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-03-004 — Challenge banner shows personal best message (≥90% score)
| Field | Detail |
|---|---|
| **Preconditions** | Prior session exists with score 14/15 (93%) |
| **Steps** | 1. Start the same set |
| **Expected Result** | Banner reads "Personal best: 14/15 (93%). Can you match it today?" |
| **Pass Criteria** | PB message with score and percentage |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-03-005 — Selecting an answer enables Submit button
| Field | Detail |
|---|---|
| **Preconditions** | Quiz screen on Question 1; no answer selected |
| **Steps** | 1. Observe Submit button state 2. Tap one answer card |
| **Expected Result** | Submit button was disabled/grey before tap; becomes active after tap; selected card gets highlight |
| **Pass Criteria** | Button enabled only after selection |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-03-006 — Correct answer shows green feedback and explanation
| Field | Detail |
|---|---|
| **Preconditions** | Quiz screen; correct answer known |
| **Steps** | 1. Select the correct answer 2. Tap "Submit Answer" |
| **Expected Result** | Selected card turns green; ✓ icon appears; explanation panel appears below options; "Next Question" button visible |
| **Pass Criteria** | Green highlight on correct card; explanation shown |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-03-007 — Wrong answer shows red on selected, green on correct
| Field | Detail |
|---|---|
| **Preconditions** | Quiz screen; correct answer known |
| **Steps** | 1. Select a wrong answer 2. Tap "Submit Answer" |
| **Expected Result** | Selected (wrong) card turns red; correct card turns green; explanation shown |
| **Pass Criteria** | Red on wrong, green on correct; both simultaneously visible |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-03-008 — Cannot change answer after submission
| Field | Detail |
|---|---|
| **Preconditions** | Answer has been submitted; feedback visible |
| **Steps** | 1. Try tapping a different answer card |
| **Expected Result** | No change; selection locked; feedback remains |
| **Pass Criteria** | Answer cards non-interactive after submission |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-03-009 — Progress bar and counter update on each question
| Field | Detail |
|---|---|
| **Preconditions** | Quiz in progress |
| **Steps** | 1. Answer Q1, tap Next 2. Observe progress bar and text |
| **Expected Result** | "Question 2 of 15"; progress bar at ~7% (1/15) |
| **Pass Criteria** | Counter increments; bar width matches proportion |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-03-010 — Timer counts up when enabled
| Field | Detail |
|---|---|
| **Preconditions** | Timer enabled in settings; quiz started |
| **Steps** | 1. Observe timer on quiz screen for 5 seconds |
| **Expected Result** | Timer shows MM:SS format and increments every second |
| **Pass Criteria** | Timer visible; increments correctly |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-03-011 — Timer stops on answer submission
| Field | Detail |
|---|---|
| **Preconditions** | Timer enabled; quiz in progress |
| **Steps** | 1. Note timer value 2. Select answer 3. Tap Submit 4. Observe timer |
| **Expected Result** | Timer freezes at the moment of submission |
| **Pass Criteria** | Timer value does not change after Submit is tapped |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-03-012 — Timer hidden when disabled in settings
| Field | Detail |
|---|---|
| **Preconditions** | Timer set to "Off" in Settings → Learning |
| **Steps** | 1. Start a quiz |
| **Expected Result** | No timer visible on quiz screen |
| **Pass Criteria** | Timer element absent or hidden |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-03-013 — Result screen shows after last question
| Field | Detail |
|---|---|
| **Preconditions** | Quiz in progress at question 15 of 15 |
| **Steps** | 1. Answer Q15 2. Tap "Next Question" |
| **Expected Result** | Result screen loads automatically with score, accuracy badge, XP earned |
| **Pass Criteria** | Result screen rendered; no more quiz questions |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-03-014 — Result screen score is accurate
| Field | Detail |
|---|---|
| **Preconditions** | User answered 10 correct out of 15 |
| **Steps** | 1. Complete the quiz with 10 correct |
| **Expected Result** | Result shows "10 / 15"; accuracy badge shows "✅ Good (67%)" |
| **Pass Criteria** | Score and percentage correct |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-03-015 — "Excellent" accuracy badge appears for ≥90% score
| Field | Detail |
|---|---|
| **Preconditions** | — |
| **Steps** | 1. Answer 14 or 15 out of 15 correctly |
| **Expected Result** | Accuracy badge shows "🔥 Excellent" |
| **Pass Criteria** | Correct badge for ≥90% accuracy |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-03-016 — "Needs Work" badge for below 70% accuracy
| Field | Detail |
|---|---|
| **Preconditions** | — |
| **Steps** | 1. Answer fewer than 11 of 15 correctly |
| **Expected Result** | Accuracy badge shows "⚠ Needs Work" |
| **Pass Criteria** | Correct badge for <70% |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-03-017 — XP is awarded and shown on result screen
| Field | Detail |
|---|---|
| **Preconditions** | Quiz completed |
| **Steps** | 1. View result screen |
| **Expected Result** | XP pill visible (e.g., "+ 145 XP"); total includes per-answer XP + set complete bonus |
| **Pass Criteria** | XP pill present with non-zero value |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-03-018 — "Back to Home" returns to Home screen
| Field | Detail |
|---|---|
| **Preconditions** | Result screen shown |
| **Steps** | 1. Tap "Back to Home" |
| **Expected Result** | Home screen renders; completed set card shows done badge |
| **Pass Criteria** | Home visible; card badge updated |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-03-019 — Session is persisted to localStorage after quiz
| Field | Detail |
|---|---|
| **Preconditions** | Quiz completed |
| **Steps** | 1. Open browser DevTools → Application → localStorage 2. Inspect `decashift_sessions` key |
| **Expected Result** | New session object present with correct goalId, score, total, accuracy, timestamps |
| **Pass Criteria** | Session data saved correctly |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-03-020 — Gated set redirects expired user to paywall
| Field | Detail |
|---|---|
| **Preconditions** | User with `plan: 'expired'`; Wednesday set card tapped |
| **Steps** | 1. Tap Wed/Thu/Fri day card |
| **Expected Result** | Paywall screen shown instead of quiz |
| **Pass Criteria** | Paywall renders; quiz screen not shown |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-03-021 — "Retry" on result restarts same set with fresh session
| Field | Detail |
|---|---|
| **Preconditions** | Result screen shown |
| **Steps** | 1. Tap "Retry" |
| **Expected Result** | Quiz starts from Question 1; new sessionId; responses cleared |
| **Pass Criteria** | Fresh quiz session; previous result not carried over |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |
