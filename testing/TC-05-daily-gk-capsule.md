# TC-05 — Daily GK Capsule

**Feature:** Daily GK Capsule  
**Reference:** `features/05-daily-gk-capsule.md`  
**Tester:** ___________  **Date:** ___________

---

## Test Cases

### TC-05-001 — GK tab visible in subject tabs
| Field | Detail |
|---|---|
| **Preconditions** | Home screen loaded |
| **Steps** | 1. View subject tabs row |
| **Expected Result** | "GK" tab present with 🌍 icon; teal color (#14b8a6) |
| **Pass Criteria** | GK tab exists and is tappable |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-05-002 — GK tab shows the daily GK card
| Field | Detail |
|---|---|
| **Preconditions** | Home screen loaded; GK not yet done today |
| **Steps** | 1. Tap "GK" tab |
| **Expected Result** | GK Daily Card renders: 🌍 icon, "Today's GK" title, today's date, weekly topic name, "5 questions · with explanations", "Start →" button |
| **Pass Criteria** | All card elements visible |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-05-003 — GK topic matches the weekly rotation schedule
| Field | Detail |
|---|---|
| **Preconditions** | Known current date |
| **Steps** | 1. View GK card topic 2. Calculate expected topic from week cycle |
| **Expected Result** | Topic matches expected week cycle (Indian Geography / World Geography / Indian History / Science & Technology / Indian Constitution / Sports & Awards) |
| **Pass Criteria** | Correct topic displayed for this week |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | Manually calculate: `Math.floor(Date.now() / (7 × 86400000)) % 6` |

---

### TC-05-004 — "Start →" button launches the GK quiz
| Field | Detail |
|---|---|
| **Preconditions** | GK Daily Card visible; GK not done today |
| **Steps** | 1. Tap "Start →" |
| **Expected Result** | Quiz screen loads with 5 GK questions; "Question 1 of 5" shown |
| **Pass Criteria** | Quiz screen renders; correct question count |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-05-005 — Explanation shown after every GK answer (correct and wrong)
| Field | Detail |
|---|---|
| **Preconditions** | GK quiz in progress |
| **Steps** | 1. Answer Q1 correctly 2. Observe 3. Answer Q2 wrongly 4. Observe |
| **Expected Result** | Explanation panel appears after BOTH correct and wrong answers |
| **Pass Criteria** | Explanation always shown in GK mode; not only on wrong answers |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | This differentiates GK from regular quiz |

---

### TC-05-006 — GK quiz has exactly 5 questions
| Field | Detail |
|---|---|
| **Preconditions** | GK quiz started |
| **Steps** | 1. Count questions to completion |
| **Expected Result** | Quiz ends after exactly 5 questions; result screen appears |
| **Pass Criteria** | Exactly 5 questions; no more |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-05-007 — GK completion awards +10 XP
| Field | Detail |
|---|---|
| **Preconditions** | GK quiz completed |
| **Steps** | 1. View result screen |
| **Expected Result** | "+10 XP" shown on result |
| **Pass Criteria** | Correct XP amount for GK |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-05-008 — GK completion marks Daily Quest "GK" objective
| Field | Detail |
|---|---|
| **Preconditions** | GK Daily Quest objective not yet done |
| **Steps** | 1. Complete GK quiz 2. Return to Home |
| **Expected Result** | Daily Quest bar shows GK objective as ✅ |
| **Pass Criteria** | GK dot complete |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-05-009 — GK card shows "Done" badge after completion
| Field | Detail |
|---|---|
| **Preconditions** | GK quiz completed today |
| **Steps** | 1. Return to Home → GK tab |
| **Expected Result** | Card shows ✅ Done badge; button reads "Redo" instead of "Start →" |
| **Pass Criteria** | Done badge visible; button label changed |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-05-010 — "Redo" button allows replaying today's GK
| Field | Detail |
|---|---|
| **Preconditions** | GK already completed today; card shows "Redo" button |
| **Steps** | 1. Tap "Redo" |
| **Expected Result** | GK quiz restarts from Q1 |
| **Pass Criteria** | Quiz plays again; done state not affected |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-05-011 — GK "Done" flag resets at midnight
| Field | Detail |
|---|---|
| **Preconditions** | GK completed on Day 1; testing on Day 2 |
| **Steps** | 1. Change system clock to next day (or wait) 2. Reload app 3. View GK tab |
| **Expected Result** | GK card shows "Start →" again; Done badge gone |
| **Pass Criteria** | Daily reset works correctly |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | Test by manually manipulating localStorage date key or advancing clock |

---

### TC-05-012 — "Current Affairs" card shows as coming soon (locked)
| Field | Detail |
|---|---|
| **Preconditions** | GK tab open |
| **Steps** | 1. Scroll down within GK tab content |
| **Expected Result** | "Current Affairs — Monthly pack · Coming soon" card visible; no Start button |
| **Pass Criteria** | Coming soon card present; non-interactive |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |
