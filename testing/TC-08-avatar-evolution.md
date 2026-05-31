# TC-08 — Avatar Evolution (Donnibo)

**Feature:** Avatar Evolution  
**Reference:** `features/08-avatar-evolution.md`  
**Tester:** ___________  **Date:** ___________

---

## Test Cases

### TC-08-001 — New user starts with Stage 1 (Spark) avatar
| Field | Detail |
|---|---|
| **Preconditions** | Newly created account; 0 XP |
| **Steps** | 1. Open Journey screen |
| **Expected Result** | Avatar shows Stage 1 image (spark.svg); stage name "Spark" displayed |
| **Pass Criteria** | Stage 1 SVG visible; correct name |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-08-002 — Avatar updates to Stage 2 (Pup) at Level 3
| Field | Detail |
|---|---|
| **Preconditions** | User at Level 2 with XP close to Level 3 threshold (200 XP needed) |
| **Steps** | 1. Earn XP to reach Level 3 2. Open Journey screen |
| **Expected Result** | Avatar image changes to Stage 2 (pup.svg); stage name shows "Pup" |
| **Pass Criteria** | Correct SVG and stage name at Level 3 |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-08-003 — Avatar shows correct stage for each level boundary
| Field | Detail |
|---|---|
| **Preconditions** | — |
| **Steps** | 1. Artificially set XP to reach each boundary level (3, 6, 10, 15, 21) 2. Check avatar on Journey |
| **Expected Result** | Stage 2 at L3, Stage 3 at L6, Stage 4 at L10, Stage 5 at L15, Stage 6 at L21 |
| **Pass Criteria** | All 6 stage transitions correct |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | Set `donnibo_xp_v1` in localStorage directly for testing |

---

### TC-08-004 — Avatar visible in header chip
| Field | Detail |
|---|---|
| **Preconditions** | User logged in |
| **Steps** | 1. View header (top-right) |
| **Expected Result** | Small circular avatar thumbnail shows current stage SVG (or letter fallback) |
| **Pass Criteria** | Avatar chip visible and not broken |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-08-005 — Letter fallback shows when SVG fails to load
| Field | Detail |
|---|---|
| **Preconditions** | Avatar SVG files removed or network blocked |
| **Steps** | 1. Block SVG file requests in DevTools (Network → Block) 2. Open Journey screen |
| **Expected Result** | Letter avatar (first initial + gradient circle) shows instead; no broken image icon |
| **Pass Criteria** | Graceful fallback; no error indicators |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-08-006 — Level ring fills correctly on Journey screen
| Field | Detail |
|---|---|
| **Preconditions** | User at exactly 50% progress within their current level |
| **Steps** | 1. Open Journey screen 2. Observe the ring around avatar |
| **Expected Result** | Level ring is approximately 50% filled (half-way around) |
| **Pass Criteria** | Ring fill proportional to xpIntoLevel / xpForNext |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-08-007 — Avatar stage name shown on Journey screen
| Field | Detail |
|---|---|
| **Preconditions** | User at Level 7 (Stage 3 — Rookie) |
| **Steps** | 1. Open Journey screen |
| **Expected Result** | Stage name "Rookie" displayed below or near the avatar |
| **Pass Criteria** | Correct stage name for current level |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-08-008 — Evolution announcement on level-up celebration
| Field | Detail |
|---|---|
| **Preconditions** | User about to cross a stage boundary level (e.g., Level 2 → 3) |
| **Steps** | 1. Earn XP to trigger Level 3 |
| **Expected Result** | Level-up overlay shows stage name: "You're now a Pup!" (or equivalent evolution message) |
| **Pass Criteria** | Stage name mentioned in celebration |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-08-009 — Avatar header chip updates after level-up
| Field | Detail |
|---|---|
| **Preconditions** | Level-up just occurred (stage boundary crossed) |
| **Steps** | 1. Observe header chip after level-up celebration |
| **Expected Result** | Header chip shows the new stage SVG |
| **Pass Criteria** | Chip updates without requiring page refresh |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-08-010 — Same stage between level boundaries (no regression)
| Field | Detail |
|---|---|
| **Preconditions** | User at Level 4 (Pup, Stage 2) |
| **Steps** | 1. Earn XP to reach Level 5 (still Stage 2 — boundary is L6) |
| **Expected Result** | Avatar remains Stage 2 (Pup); no stage change |
| **Pass Criteria** | Stage only changes at boundary levels |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |
