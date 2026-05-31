# TC-14 — Subscription & Paywall

**Feature:** Subscription & Paywall  
**Reference:** `features/14-subscription-paywall.md`  
**Tester:** ___________  **Date:** ___________

---

## Test Cases

### TC-14-001 — New account is created with trial plan
| Field | Detail |
|---|---|
| **Preconditions** | Fresh sign up |
| **Steps** | 1. Create a new account 2. Check localStorage `decashift_user` |
| **Expected Result** | User object contains `plan: "trial"` and `trialStart` with current date |
| **Pass Criteria** | Trial plan set on sign up |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-14-002 — Trial user sees all 5 day cards with no locks
| Field | Detail |
|---|---|
| **Preconditions** | User with `plan: "trial"` |
| **Steps** | 1. View Home screen, any subject tab |
| **Expected Result** | All 5 day cards (Mon–Fri) show no lock icons |
| **Pass Criteria** | No locks for trial user |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-14-003 — Trial user can start Wed/Thu/Fri sets without paywall
| Field | Detail |
|---|---|
| **Preconditions** | User with `plan: "trial"` |
| **Steps** | 1. Tap Wednesday day card |
| **Expected Result** | Quiz screen loads; no paywall shown |
| **Pass Criteria** | Direct quiz start for trial user |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-14-004 — Expired user sees lock icons on Wed/Thu/Fri cards
| Field | Detail |
|---|---|
| **Preconditions** | Set `plan: "expired"` in localStorage user object |
| **Steps** | 1. View Home screen |
| **Expected Result** | Mon/Tue cards: no lock; Wed/Thu/Fri cards: 🔒 lock icon |
| **Pass Criteria** | Locks on exactly days 3–5 |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-14-005 — Tapping locked card shows paywall screen
| Field | Detail |
|---|---|
| **Preconditions** | User with `plan: "expired"` |
| **Steps** | 1. Tap Wednesday day card |
| **Expected Result** | Paywall screen loads with "Continue Learning with Pro" heading, feature list, ₹79/month price, "Upgrade to Pro" CTA |
| **Pass Criteria** | Paywall renders correctly; quiz not started |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-14-006 — "Maybe later" on paywall returns to Home
| Field | Detail |
|---|---|
| **Preconditions** | Paywall screen visible |
| **Steps** | 1. Tap "Maybe later" link |
| **Expected Result** | User returned to Home screen; no payment initiated |
| **Pass Criteria** | Home screen visible after dismiss |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-14-007 — Mon/Tue sets always accessible for expired users
| Field | Detail |
|---|---|
| **Preconditions** | User with `plan: "expired"` |
| **Steps** | 1. Tap Monday day card 2. Tap Tuesday day card |
| **Expected Result** | Both quizzes start without paywall |
| **Pass Criteria** | Free sets always accessible |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-14-008 — Trial expires automatically after 180 days
| Field | Detail |
|---|---|
| **Preconditions** | Set `trialStart` in localStorage to 181 days ago |
| **Steps** | 1. Reload app 2. Check user plan in localStorage |
| **Expected Result** | `plan` field updated to `"expired"` automatically |
| **Pass Criteria** | Trial → expired transition on init |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | Simulate by setting `trialStart` to a date 181 days in the past |

---

### TC-14-009 — Settings → My Plan shows trial days remaining
| Field | Detail |
|---|---|
| **Preconditions** | User with `plan: "trial"`; trial started 30 days ago |
| **Steps** | 1. Open Settings → My Plan |
| **Expected Result** | "Trial: 150 days left" (or equivalent) shown |
| **Pass Criteria** | Remaining days calculated correctly |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-14-010 — Settings → My Plan shows "Expired" state for expired user
| Field | Detail |
|---|---|
| **Preconditions** | User with `plan: "expired"` |
| **Steps** | 1. Open Settings → My Plan |
| **Expected Result** | "Expired" badge shown; "Upgrade to Pro — ₹79/month" CTA visible |
| **Pass Criteria** | Expired state communicated clearly |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-14-011 — Flash Drills and GK always accessible regardless of plan
| Field | Detail |
|---|---|
| **Preconditions** | User with `plan: "expired"` |
| **Steps** | 1. Tap any flash drill card 2. Start daily GK |
| **Expected Result** | Both start without paywall |
| **Pass Criteria** | Drills and GK never gated |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |
