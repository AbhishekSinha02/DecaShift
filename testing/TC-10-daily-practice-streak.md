# TC-10 — Daily Practice Streak

**Feature:** Daily Practice Streak  
**Reference:** `features/10-daily-practice-streak.md`  
**Tester:** ___________  **Date:** ___________

---

## Test Cases

### TC-10-001 — Streak count displayed in header
| Field | Detail |
|---|---|
| **Preconditions** | User logged in; has a 5-day streak |
| **Steps** | 1. View app header |
| **Expected Result** | Flame icon 🔥 with "5" visible in header meta row |
| **Pass Criteria** | Streak count visible in header |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-10-002 — Streak increments by 1 after practicing on consecutive day
| Field | Detail |
|---|---|
| **Preconditions** | User practiced yesterday (streak = 4); no practice yet today |
| **Steps** | 1. Complete any quiz or drill today 2. View streak in header |
| **Expected Result** | Streak shows 5 |
| **Pass Criteria** | Streak +1 after practice |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-10-003 — First-ever practice starts streak at 1
| Field | Detail |
|---|---|
| **Preconditions** | New user; no practice history |
| **Steps** | 1. Complete any quiz |
| **Expected Result** | Streak shows 1 |
| **Pass Criteria** | Streak starts at 1, not 0 |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-10-004 — Streak resets to 1 after missing a day (no freeze)
| Field | Detail |
|---|---|
| **Preconditions** | User has streak = 7; last practice was 2 days ago; no freezes available |
| **Steps** | 1. Practice today 2. Check streak |
| **Expected Result** | Streak resets to 1 (not 8) |
| **Pass Criteria** | Streak = 1 after gap |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | Simulate by setting `lastPracticeDate` to 2 days ago in localStorage |

---

### TC-10-005 — Streak preserved by freeze when exactly 1 day missed
| Field | Detail |
|---|---|
| **Preconditions** | User streak = 7; last practice 2 days ago; `freezes = 1` in localStorage |
| **Steps** | 1. Practice today 2. Check streak |
| **Expected Result** | Streak preserved (still 7 or 8, not reset); freeze count reduced to 0 |
| **Pass Criteria** | Streak intact; freeze consumed |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-10-006 — Freeze not used for 2+ day gaps
| Field | Detail |
|---|---|
| **Preconditions** | User streak = 7; last practice 3 days ago; `freezes = 2` |
| **Steps** | 1. Practice today 2. Check streak |
| **Expected Result** | Streak resets to 1; freezes remain at 2 (not consumed — 2-day gap beyond freeze scope) |
| **Pass Criteria** | Streak reset; freezes untouched |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-10-007 — Freeze count visible on Journey screen
| Field | Detail |
|---|---|
| **Preconditions** | User has 2 freezes |
| **Steps** | 1. Open Journey screen |
| **Expected Result** | "❄ 2 freezes" (or similar) visible in streak section |
| **Pass Criteria** | Freeze count displayed |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-10-008 — Maximum 2 freezes can be held
| Field | Detail |
|---|---|
| **Preconditions** | User already has 2 freezes; mystery box rolls a freeze |
| **Steps** | 1. Trigger mystery box 2. It attempts to give a freeze reward |
| **Expected Result** | Freeze reward is not granted (already at max 2); XP is awarded instead |
| **Pass Criteria** | Freeze count stays at 2; XP granted instead |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-10-009 — Streak data persists across page reload
| Field | Detail |
|---|---|
| **Preconditions** | User has streak = 10 |
| **Steps** | 1. Hard refresh page 2. Check header streak count |
| **Expected Result** | Streak still shows 10 |
| **Pass Criteria** | Streak value persisted in localStorage |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-10-010 — Streak bar on Home screen reflects current streak
| Field | Detail |
|---|---|
| **Preconditions** | User has a 14-day streak |
| **Steps** | 1. View Home screen streak bar |
| **Expected Result** | Streak bar shows "🔥 14 days" or equivalent |
| **Pass Criteria** | Streak count on bar matches header |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-10-011 — Longest streak tracked separately from current streak
| Field | Detail |
|---|---|
| **Preconditions** | User had longest streak of 21; current streak is 5 after a reset |
| **Steps** | 1. Open Journey screen |
| **Expected Result** | Longest streak shows 21; current streak shows 5 |
| **Pass Criteria** | Both values tracked and displayed independently |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-10-012 — Multiple sessions in one day do not double-count streak
| Field | Detail |
|---|---|
| **Preconditions** | User already practiced today (streak = 5) |
| **Steps** | 1. Complete a second quiz on the same day |
| **Expected Result** | Streak stays at 5; no double-increment |
| **Pass Criteria** | Streak not incremented twice in one day |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |
