# TC-09 — My Journey (Profile & Progress Screen)

**Feature:** My Journey  
**Reference:** `features/09-my-journey.md`  
**Tester:** ___________  **Date:** ___________

---

## Test Cases

### TC-09-001 — Journey screen opens from drawer nav
| Field | Detail |
|---|---|
| **Preconditions** | Home screen; drawer closed |
| **Steps** | 1. Open drawer 2. Tap "My Journey" |
| **Expected Result** | Journey screen renders; drawer closes |
| **Pass Criteria** | Journey screen visible |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-09-002 — Journey screen opens from user chip dropdown
| Field | Detail |
|---|---|
| **Preconditions** | User chip dropdown open |
| **Steps** | 1. Tap "My Journey" in dropdown |
| **Expected Result** | Journey screen renders; dropdown closes |
| **Pass Criteria** | Journey screen visible |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-09-003 — Avatar and stage name display correctly
| Field | Detail |
|---|---|
| **Preconditions** | User at Level 5 (Stage 2 — Pup) |
| **Steps** | 1. Open Journey screen |
| **Expected Result** | Avatar image shows Stage 2 SVG; "Pup" stage name visible; "Level 5" shown |
| **Pass Criteria** | Correct avatar, stage name, level number |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-09-004 — XP progress bar and text are accurate
| Field | Detail |
|---|---|
| **Preconditions** | User has 210 total XP (Level 3, needs 330 for Level 4) |
| **Steps** | 1. Open Journey screen 2. Read XP text and observe bar |
| **Expected Result** | XP text references current XP and next level target; bar fill matches ratio |
| **Pass Criteria** | Numbers match localStorage XP value |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-09-005 — Current streak is displayed correctly
| Field | Detail |
|---|---|
| **Preconditions** | User has a 7-day streak |
| **Steps** | 1. Open Journey screen 2. View streak section |
| **Expected Result** | "🔥 7 days" (or "7 daily practice days") displayed |
| **Pass Criteria** | Streak count matches localStorage streak |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-09-006 — Streak freeze count displayed
| Field | Detail |
|---|---|
| **Preconditions** | User has 1 streak freeze remaining |
| **Steps** | 1. Open Journey screen |
| **Expected Result** | "❄ 1 freeze" (or equivalent) visible in streak section |
| **Pass Criteria** | Freeze count matches stored value |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-09-007 — Lifetime stats are populated and accurate
| Field | Detail |
|---|---|
| **Preconditions** | User has completed 5 sessions total (e.g., 75 questions answered) |
| **Steps** | 1. Open Journey screen 2. View stats section |
| **Expected Result** | Total sessions: 5; total questions: 75; accuracy reflects average |
| **Pass Criteria** | Stats match sum of session history in localStorage |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-09-008 — Mastery tier "Not started" for untouched sets
| Field | Detail |
|---|---|
| **Preconditions** | User has never played a specific set (e.g., Monday Science W23) |
| **Steps** | 1. Open Journey screen 2. Find that set in mastery list |
| **Expected Result** | Set shows "○ Not started" tier |
| **Pass Criteria** | Correct "none" tier for 0 sessions |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-09-009 — Mastery tier "Learning" for 1 session below 60% accuracy
| Field | Detail |
|---|---|
| **Preconditions** | User has 1 session on a set with 50% accuracy |
| **Steps** | 1. Open Journey 2. Find that set |
| **Expected Result** | Tier shows "📖 Learning" |
| **Pass Criteria** | Correct tier for 1 session, <60% |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-09-010 — Mastery tier "Solid" for 3+ sessions ≥70% accuracy
| Field | Detail |
|---|---|
| **Preconditions** | User has 3 sessions on a set, each with 75% accuracy |
| **Steps** | 1. Open Journey 2. Find that set |
| **Expected Result** | Tier shows "⭐ Solid" |
| **Pass Criteria** | Correct tier for 3 sessions, avg ≥70% |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-09-011 — Mastery tier "Mastered" for 5+ sessions ≥85% accuracy
| Field | Detail |
|---|---|
| **Preconditions** | User has 5 sessions on a set, each ≥85% accuracy |
| **Steps** | 1. Open Journey 2. Find that set |
| **Expected Result** | Tier shows "🏆 Mastered" |
| **Pass Criteria** | Correct tier for mastery conditions |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-09-012 — Journey renders fully offline (no network)
| Field | Detail |
|---|---|
| **Preconditions** | Network disconnected (DevTools → Offline) |
| **Steps** | 1. Open Journey screen |
| **Expected Result** | All sections render from localStorage; no errors; avatar fallback works |
| **Pass Criteria** | Journey fully usable offline |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-09-013 — Back button returns to Home screen
| Field | Detail |
|---|---|
| **Preconditions** | Journey screen open |
| **Steps** | 1. Tap back arrow or "← Home" button |
| **Expected Result** | Home screen renders; Journey screen hides |
| **Pass Criteria** | Home screen visible after back action |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-09-014 — Journey updates after new quiz session without manual refresh
| Field | Detail |
|---|---|
| **Preconditions** | Journey screen shows 4 total sessions |
| **Steps** | 1. Close Journey 2. Complete a quiz 3. Reopen Journey |
| **Expected Result** | Total sessions now shows 5; mastery tier may have updated |
| **Pass Criteria** | Journey reflects latest session data on next open |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |
