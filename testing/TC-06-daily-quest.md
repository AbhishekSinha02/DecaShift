# TC-06 — Daily Quest

**Feature:** Daily Quest  
**Reference:** `features/06-daily-quest.md`  
**Tester:** ___________  **Date:** ___________

---

## Test Cases

### TC-06-001 — Daily Quest bar is visible on Home screen
| Field | Detail |
|---|---|
| **Preconditions** | User logged in; Home screen loaded |
| **Steps** | 1. View Home screen |
| **Expected Result** | Daily Quest bar visible near top of page; shows 3 objectives (Practice Set, Flash Drill, GK) with progress counter (e.g., "0 / 3 done") |
| **Pass Criteria** | Quest bar present with all 3 objectives |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-06-002 — All 3 objectives show as incomplete at start of day
| Field | Detail |
|---|---|
| **Preconditions** | New day; no activities completed yet |
| **Steps** | 1. View Daily Quest bar |
| **Expected Result** | All 3 objective dots/icons are in incomplete state (○ or grey) |
| **Pass Criteria** | 0 objectives marked complete |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-06-003 — "Practice Set" objective marks complete after finishing any quiz
| Field | Detail |
|---|---|
| **Preconditions** | Practice Set objective incomplete; no quiz done today |
| **Steps** | 1. Complete any practice set (Mon–Fri) 2. Return to Home |
| **Expected Result** | Practice Set dot shows ✅; counter updates to "1 / 3" |
| **Pass Criteria** | Practice Set objective complete |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-06-004 — "Drill" objective marks complete after finishing any flash drill
| Field | Detail |
|---|---|
| **Preconditions** | Drill objective incomplete |
| **Steps** | 1. Complete any flash drill 2. Return to Home |
| **Expected Result** | Drill dot shows ✅ |
| **Pass Criteria** | Drill objective complete |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-06-005 — "GK" objective marks complete after finishing daily GK
| Field | Detail |
|---|---|
| **Preconditions** | GK objective incomplete |
| **Steps** | 1. Complete Daily GK 2. Return to Home |
| **Expected Result** | GK dot shows ✅ |
| **Pass Criteria** | GK objective complete |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-06-006 — Completing all 3 objectives shows "Quest Complete" state
| Field | Detail |
|---|---|
| **Preconditions** | — |
| **Steps** | 1. Complete a practice set 2. Complete a drill 3. Complete GK 4. Return to Home |
| **Expected Result** | Quest bar shows "Quest Complete! 🎉" or equivalent; all 3 dots ✅; counter shows "3 / 3" |
| **Pass Criteria** | Quest complete state triggered |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-06-007 — Quest completion awards +50 XP
| Field | Detail |
|---|---|
| **Preconditions** | All 3 objectives done; quest just completed |
| **Steps** | 1. Complete the last objective 2. Observe XP notification or check Journey screen |
| **Expected Result** | +50 XP awarded for quest completion |
| **Pass Criteria** | XP total increases by 50 (on top of individual activity XP) |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-06-008 — Mystery Box reward notification appears on quest completion
| Field | Detail |
|---|---|
| **Preconditions** | Quest just completed |
| **Steps** | 1. Complete the third objective 2. Return to Home |
| **Expected Result** | Reward notification card slides up from bottom; shows reward type (sticker, XP, or freeze) |
| **Pass Criteria** | Reward notification visible |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-06-009 — Quest state persists across page reload
| Field | Detail |
|---|---|
| **Preconditions** | Practice Set and GK objectives completed (2/3 done) |
| **Steps** | 1. Note quest state (2/3 done) 2. Hard refresh page |
| **Expected Result** | Quest bar still shows 2 objectives complete after reload |
| **Pass Criteria** | Quest state not lost on refresh |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-06-010 — Quest resets at midnight (new day)
| Field | Detail |
|---|---|
| **Preconditions** | All 3 objectives completed on Day 1 |
| **Steps** | 1. Advance system clock to Day 2 2. Reload app 3. View quest bar |
| **Expected Result** | All 3 objectives reset to incomplete; "0 / 3" counter |
| **Pass Criteria** | Fresh quest on new day |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-06-011 — GK session completed today is detected without explicit mark
| Field | Detail |
|---|---|
| **Preconditions** | GK session saved today in localStorage |
| **Steps** | 1. View quest bar (don't do anything — just derive state) |
| **Expected Result** | GK objective shows as ✅ even without a separate flag (derived from session data) |
| **Pass Criteria** | GK objective auto-detected from session history |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-06-012 — Completing multiple drills in a day only marks Drill objective once
| Field | Detail |
|---|---|
| **Preconditions** | Drill objective already complete today |
| **Steps** | 1. Complete a second drill |
| **Expected Result** | Drill objective stays at ✅; counter stays the same; no double reward |
| **Pass Criteria** | Idempotent — second drill does not re-trigger quest completion |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |
