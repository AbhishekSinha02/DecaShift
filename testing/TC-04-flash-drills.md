# TC-04 — Flash Drills

**Feature:** Flash Drills  
**Reference:** `features/04-flash-drills.md`  
**Tester:** ___________  **Date:** ___________

---

## Test Cases

### TC-04-001 — Flash Drills shelf visible on Home screen
| Field | Detail |
|---|---|
| **Preconditions** | User logged in; Home screen loaded |
| **Steps** | 1. View Home screen |
| **Expected Result** | Flash Drills horizontal shelf visible; at least 5 drill cards shown (Tables, Squares, Cubes, Formulas, GK Speed) |
| **Pass Criteria** | Shelf present with drill cards |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-04-002 — Drill card shows name and description
| Field | Detail |
|---|---|
| **Preconditions** | Home screen with Flash Drills shelf visible |
| **Steps** | 1. Observe each drill card |
| **Expected Result** | Each card shows drill name (e.g., "Tables") and a short description (e.g., "2×2 to 12×12") |
| **Pass Criteria** | Name and description visible on each card |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-04-003 — Drill card shows personal best if previously played
| Field | Detail |
|---|---|
| **Preconditions** | User has previously completed the Tables drill with PB of 1m 24s |
| **Steps** | 1. View Tables drill card on Home |
| **Expected Result** | Card shows "PB: 1:24" (or equivalent format) |
| **Pass Criteria** | PB value visible on the card |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-04-004 — Tapping a drill card opens the drill screen
| Field | Detail |
|---|---|
| **Preconditions** | Home screen; Flash Drills shelf visible |
| **Steps** | 1. Tap "Tables" drill card |
| **Expected Result** | Drill screen loads; drill name shown; first question displayed with 4 answer options and a countdown timer |
| **Pass Criteria** | Drill screen rendered with question |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-04-005 — Tables drill generates valid multiplication questions
| Field | Detail |
|---|---|
| **Preconditions** | Tables drill started |
| **Steps** | 1. Observe 5–10 questions |
| **Expected Result** | All questions are of format "A × B = ?" where A and B are between 2 and 12; correct answer is always present among the 4 options |
| **Pass Criteria** | No invalid questions; correct answer always included |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-04-006 — Squares drill generates correct squared values
| Field | Detail |
|---|---|
| **Preconditions** | Squares drill started |
| **Steps** | 1. Observe questions |
| **Expected Result** | Questions are "N² = ?" for N between 1 and 25; correct answer = N² |
| **Pass Criteria** | Math is correct for all visible questions |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-04-007 — Correct answer flashes green and loads next question
| Field | Detail |
|---|---|
| **Preconditions** | Drill in progress |
| **Steps** | 1. Tap the correct answer card |
| **Expected Result** | Card flashes green; next question loads immediately (no "Submit" button needed) |
| **Pass Criteria** | Instant transition to next question; green flash visible |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-04-008 — Wrong answer flashes red, shows correct answer, then moves on
| Field | Detail |
|---|---|
| **Preconditions** | Drill in progress |
| **Steps** | 1. Tap a wrong answer card |
| **Expected Result** | Tapped card flashes red; correct card highlights green briefly; brief pause; next question loads |
| **Pass Criteria** | Both red (wrong) and green (correct) visible; auto-advances |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-04-009 — Timer counts down per question
| Field | Detail |
|---|---|
| **Preconditions** | Drill in progress |
| **Steps** | 1. Start drill 2. Do not answer; observe timer |
| **Expected Result** | Timer bar/circle shrinks toward zero; countdown visible |
| **Pass Criteria** | Timer decrements visually |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-04-010 — Timeout counts as wrong and advances to next question
| Field | Detail |
|---|---|
| **Preconditions** | Drill in progress |
| **Steps** | 1. Let timer reach 0 without tapping any answer |
| **Expected Result** | Question is marked wrong; correct answer highlighted; next question loads |
| **Pass Criteria** | Auto-advance on timeout; counted as incorrect |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-04-011 — Drill result screen shows after 10 questions
| Field | Detail |
|---|---|
| **Preconditions** | Drill in progress |
| **Steps** | 1. Complete all 10 questions |
| **Expected Result** | Result screen shows: score out of 10, total time, XP earned |
| **Pass Criteria** | Result screen rendered after exactly 10 questions |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-04-012 — New PB badge appears when best time is beaten
| Field | Detail |
|---|---|
| **Preconditions** | Existing PB of 2:00; user completes drill in 1:45 |
| **Steps** | 1. Complete drill in under PB time |
| **Expected Result** | Result screen shows "🏅 New PB!" badge |
| **Pass Criteria** | PB badge visible; new time stored |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-04-013 — No PB badge when existing PB not beaten
| Field | Detail |
|---|---|
| **Preconditions** | Existing PB of 1:30; user completes drill in 2:00 |
| **Steps** | 1. Complete drill slower than PB |
| **Expected Result** | No "New PB!" badge; existing PB unchanged |
| **Pass Criteria** | PB not overwritten; badge absent |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-04-014 — Drill XP awarded on completion
| Field | Detail |
|---|---|
| **Preconditions** | Drill completed |
| **Steps** | 1. View result screen |
| **Expected Result** | "+15 XP" pill visible on result |
| **Pass Criteria** | XP value shown; XP added to total (verify in Journey) |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-04-015 — Daily Quest "Drill" objective marked after first drill completion
| Field | Detail |
|---|---|
| **Preconditions** | Daily Quest "Drill" objective not yet done today |
| **Steps** | 1. Complete any drill 2. Return to Home |
| **Expected Result** | Daily Quest bar shows Drill objective as ✅ |
| **Pass Criteria** | Drill dot flipped to complete |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-04-016 — "Play Again" restarts the same drill
| Field | Detail |
|---|---|
| **Preconditions** | Drill result screen shown |
| **Steps** | 1. Tap "Play Again" |
| **Expected Result** | Drill restarts from Q1; questions reshuffled |
| **Pass Criteria** | Fresh drill session; different question order (likely) |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-04-017 — Questions are shuffled between sessions
| Field | Detail |
|---|---|
| **Preconditions** | — |
| **Steps** | 1. Play Tables drill 2. Note question order 3. Play again 4. Compare order |
| **Expected Result** | Question order is different on second play |
| **Pass Criteria** | Shuffle verified (may rarely be same by chance — run 3 times) |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |
