# TC-13 — Friend Challenge

**Feature:** Friend Challenge  
**Reference:** `features/13-friend-challenge.md`  
**Tester:** ___________  **Date:** ___________

---

## Test Cases

### TC-13-001 — "Challenge a Friend" button visible on result screen
| Field | Detail |
|---|---|
| **Preconditions** | Quiz completed; result screen shown |
| **Steps** | 1. View result screen |
| **Expected Result** | "Challenge a Friend" button visible |
| **Pass Criteria** | Button present on result screen |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-13-002 — Tapping "Challenge a Friend" generates a share URL
| Field | Detail |
|---|---|
| **Preconditions** | Result screen; user scored 12/15 on Monday Math W23 |
| **Steps** | 1. Tap "Challenge a Friend" |
| **Expected Result** | Native share sheet (or clipboard copy) with a URL containing `?ch=` parameter |
| **Pass Criteria** | URL includes `?ch=` base64url payload |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-13-003 — Challenge URL payload contains correct data
| Field | Detail |
|---|---|
| **Preconditions** | Challenge URL generated (score 12/15, name "Arjun", goalId "grade-5-math-w23-mon") |
| **Steps** | 1. Decode the base64url payload from the `?ch=` parameter |
| **Expected Result** | Decoded JSON: `{ g: "grade-5-math-w23-mon", s: 12, t: 15, n: "Arjun" }` |
| **Pass Criteria** | All 4 fields present and correct |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | Decode manually: base64url decode the `ch` param value |

---

### TC-13-004 — Opening challenge URL as new user shows sign-up flow
| Field | Detail |
|---|---|
| **Preconditions** | Challenge URL; browser with no existing account (incognito) |
| **Steps** | 1. Open challenge URL in a fresh browser |
| **Expected Result** | Landing/Sign-Up screen appears; challenge payload stored in sessionStorage |
| **Pass Criteria** | Landing shown; challenge not lost |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-13-005 — After sign up via challenge URL, correct set launches
| Field | Detail |
|---|---|
| **Preconditions** | New user signing up via challenge URL for "grade-5-math-w23-mon" |
| **Steps** | 1. Complete sign-up 2. Observe which screen appears |
| **Expected Result** | The Grade 5 Math Monday set quiz launches immediately |
| **Pass Criteria** | Challenge set loaded; not generic Home browse |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-13-006 — Challenge banner shows challenger's name and score
| Field | Detail |
|---|---|
| **Preconditions** | Logged-in user opened a challenge URL (challenger: "Priya", score: 11/15) |
| **Steps** | 1. Open challenge URL while logged in 2. Wait for quiz to start |
| **Expected Result** | Quiz banner reads "⚔ Priya challenged you — beat 11/15!" |
| **Pass Criteria** | Challenger's name and score in banner |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-13-007 — Challenge URL is stripped from browser address bar after capture
| Field | Detail |
|---|---|
| **Preconditions** | User opened `app.url?ch=<payload>` |
| **Steps** | 1. Open URL 2. Observe address bar after app loads |
| **Expected Result** | `?ch=` parameter removed from URL; address bar shows clean URL |
| **Pass Criteria** | URL cleaned up by history.replaceState |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-13-008 — Page refresh after opening challenge URL does not replay challenge
| Field | Detail |
|---|---|
| **Preconditions** | User has already been routed into the challenge quiz |
| **Steps** | 1. Refresh the page |
| **Expected Result** | Challenge does not re-trigger; user sees Home or quiz normally |
| **Pass Criteria** | Challenge consumed (sessionStorage cleared); no repeat routing |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-13-009 — Invalid challenge payload loads Home gracefully
| Field | Detail |
|---|---|
| **Preconditions** | User opens a URL with `?ch=invalidbase64data` |
| **Steps** | 1. Open URL with corrupted `ch` param |
| **Expected Result** | App loads normally on Home screen; no crash or error |
| **Pass Criteria** | Graceful fallback; no JS exception |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-13-010 — Challenge for a gated set falls back to Home gracefully
| Field | Detail |
|---|---|
| **Preconditions** | Challenge URL points to a gated set (Wed–Fri); receiver has expired plan |
| **Steps** | 1. Open challenge URL 2. Log in |
| **Expected Result** | Home loads normally; challenge cleared silently (not routed to paywall via challenge) |
| **Pass Criteria** | No crash; graceful fallback |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-13-011 — Result screen shows head-to-head comparison when challenge beaten
| Field | Detail |
|---|---|
| **Preconditions** | Challenger scored 10/15; receiver scored 13/15 |
| **Steps** | 1. Complete the challenge set with 13/15 |
| **Expected Result** | Result shows: "You beat [Name]! 🎉 You scored 13/15 vs their 10/15" |
| **Pass Criteria** | Both scores shown; beat message displayed |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |
