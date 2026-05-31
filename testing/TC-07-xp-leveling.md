# TC-07 — XP & Leveling System

**Feature:** XP & Leveling System  
**Reference:** `features/07-xp-leveling-system.md`  
**Tester:** ___________  **Date:** ___________

---

## Test Cases

### TC-07-001 — Correct answer awards +10 XP
| Field | Detail |
|---|---|
| **Preconditions** | XP total known before quiz; quiz started |
| **Steps** | 1. Note XP total in Journey 2. Answer 1 question correctly 3. Check XP total |
| **Expected Result** | XP total increases by 10 |
| **Pass Criteria** | Exactly +10 XP per correct answer |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | Easiest to verify on result screen XP breakdown |

---

### TC-07-002 — Wrong answer awards +2 XP (effort credit)
| Field | Detail |
|---|---|
| **Preconditions** | Quiz in progress |
| **Steps** | 1. Intentionally answer 1 question wrong 2. Check XP delta |
| **Expected Result** | XP increases by 2 |
| **Pass Criteria** | +2 XP for wrong attempt |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-07-003 — Set completion bonus awards +25 XP
| Field | Detail |
|---|---|
| **Preconditions** | Quiz completed |
| **Steps** | 1. Complete a full 15-question set 2. Check XP breakdown on result |
| **Expected Result** | +25 XP set complete bonus shown separately |
| **Pass Criteria** | +25 included in total XP |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-07-004 — Perfect score (100%) awards additional +20 XP
| Field | Detail |
|---|---|
| **Preconditions** | — |
| **Steps** | 1. Answer all 15 questions correctly 2. View result XP |
| **Expected Result** | Total XP = (15×10) + 25 + 20 = 195 XP; perfect bonus shown |
| **Pass Criteria** | +20 bonus for 100% accuracy |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-07-005 — GK completion awards +10 XP
| Field | Detail |
|---|---|
| **Preconditions** | — |
| **Steps** | 1. Complete Daily GK 2. View result XP |
| **Expected Result** | "+10 XP" on GK result |
| **Pass Criteria** | +10 XP for GK |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-07-006 — Drill completion awards +15 XP
| Field | Detail |
|---|---|
| **Preconditions** | — |
| **Steps** | 1. Complete any flash drill 2. View result XP |
| **Expected Result** | "+15 XP" on drill result |
| **Pass Criteria** | +15 XP for drill |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-07-007 — Quest completion awards +50 XP
| Field | Detail |
|---|---|
| **Preconditions** | 2 of 3 quest objectives done |
| **Steps** | 1. Complete the third objective 2. Check XP total change |
| **Expected Result** | XP increases by 50 (on top of the individual activity's XP) |
| **Pass Criteria** | +50 XP awarded on quest complete |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-07-008 — Level increases when XP threshold is crossed
| Field | Detail |
|---|---|
| **Preconditions** | User at Level 1 with 85+ XP (threshold to Level 2 is 90 XP) |
| **Steps** | 1. Earn enough XP to cross 90 total 2. Observe |
| **Expected Result** | Level increases from 1 to 2; level-up celebration fires |
| **Pass Criteria** | Level increments at correct XP threshold |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | Reference: Level 2 requires 90 cumulative XP |

---

### TC-07-009 — Level-up celebration overlay appears
| Field | Detail |
|---|---|
| **Preconditions** | XP about to cross a level threshold |
| **Steps** | 1. Earn enough XP to level up |
| **Expected Result** | Overlay appears: "Level Up! You're now Level N"; confetti; auto-dismisses after ~3 seconds |
| **Pass Criteria** | Overlay visible; dismisses without user interaction |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-07-010 — Level-up overlay dismisses on tap
| Field | Detail |
|---|---|
| **Preconditions** | Level-up overlay visible |
| **Steps** | 1. Tap anywhere on the overlay |
| **Expected Result** | Overlay dismisses immediately |
| **Pass Criteria** | Overlay closes on tap |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-07-011 — XP total is persistent across page reloads
| Field | Detail |
|---|---|
| **Preconditions** | User has 250 XP |
| **Steps** | 1. Note XP total 2. Hard refresh page 3. Open Journey screen |
| **Expected Result** | XP total still shows 250 |
| **Pass Criteria** | XP persisted in localStorage (`donnibo_xp_v1`) |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-07-012 — XP never decreases
| Field | Detail |
|---|---|
| **Preconditions** | User has 300 XP |
| **Steps** | 1. Complete any session (even a bad score) 2. Check XP |
| **Expected Result** | XP total ≥ 300; never goes below previous value |
| **Pass Criteria** | XP is monotonically increasing |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-07-013 — Journey screen shows correct XP progress text
| Field | Detail |
|---|---|
| **Preconditions** | User at Level 3 with 210 total XP (Level 4 requires 330) |
| **Steps** | 1. Open Journey screen |
| **Expected Result** | Shows "210 XP / 330 XP to Level 4" (or equivalent progress bar text) |
| **Pass Criteria** | Correct XP values and target level shown |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-07-014 — Lucky Question badge appears on correct answer for that question
| Field | Detail |
|---|---|
| **Preconditions** | Quiz in progress; Lucky Question is unknown to tester until answered |
| **Steps** | 1. Answer all questions correctly 2. Watch for Lucky Question reveal |
| **Expected Result** | One question shows "🍀 Lucky Question! 2× XP" badge when answered correctly |
| **Pass Criteria** | Lucky Question badge appears exactly once per set |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |
