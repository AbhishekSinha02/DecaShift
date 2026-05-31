# TC-01 — Authentication & Onboarding

**Feature:** Authentication & Onboarding  
**Reference:** `features/01-authentication-onboarding.md`  
**Tester:** ___________  **Date:** ___________

---

## Test Cases

### TC-01-001 — Landing page loads correctly for first-time visitor
| Field | Detail |
|---|---|
| **Preconditions** | localStorage is empty (fresh browser / incognito); app URL opened |
| **Steps** | 1. Open app URL in browser |
| **Expected Result** | Landing screen renders; fixed top nav visible; hero section with phone mockup visible; "For Students" and "For Professionals" CTAs visible; "Sign In" button in nav |
| **Pass Criteria** | All above elements present; no console errors |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-01-002 — "For Students" CTA navigates to Sign Up with school category
| Field | Detail |
|---|---|
| **Preconditions** | Landing screen loaded |
| **Steps** | 1. Click/tap "For Students" button |
| **Expected Result** | Sign Up screen appears; grade selector is visible; category is pre-set to "school" |
| **Pass Criteria** | Grade dropdown visible; no professional-only fields shown |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-01-003 — "For Professionals" CTA navigates to Sign Up without grade selector
| Field | Detail |
|---|---|
| **Preconditions** | Landing screen loaded |
| **Steps** | 1. Click/tap "For Professionals" button |
| **Expected Result** | Sign Up screen appears; no grade selector shown; category pre-set to "professional" |
| **Pass Criteria** | Grade field absent from form |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-01-004 — Successful school student sign up
| Field | Detail |
|---|---|
| **Preconditions** | Sign Up screen open (school category) |
| **Steps** | 1. Enter full name "Arjun Sharma" 2. Enter email "arjun@test.com" 3. Enter password "Test@1234" 4. Select Grade 5 5. Tap "Create Account" |
| **Expected Result** | Account created; user navigated to Home screen; greeting shows "Hello, Arjun"; avatar at Stage 1 (Spark) |
| **Pass Criteria** | Home screen renders with correct first name; no error messages |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-01-005 — Successful professional sign up
| Field | Detail |
|---|---|
| **Preconditions** | Sign Up screen open (professional category) |
| **Steps** | 1. Enter name, email, password 2. Tap "Create Account" |
| **Expected Result** | Home screen renders with professional content sets (DSA, Python, etc.); no grade-specific content shown |
| **Pass Criteria** | Professional content visible on Home |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-01-006 — Sign up with duplicate email
| Field | Detail |
|---|---|
| **Preconditions** | Account with "test@test.com" already exists in localStorage |
| **Steps** | 1. Open Sign Up 2. Enter the same email "test@test.com" 3. Enter any password 4. Tap "Create Account" |
| **Expected Result** | Error message shown: "An account with this email already exists" or similar; user stays on Sign Up screen |
| **Pass Criteria** | No new account created; error displayed |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-01-007 — Sign up with empty required fields
| Field | Detail |
|---|---|
| **Preconditions** | Sign Up screen open |
| **Steps** | 1. Leave name field empty 2. Tap "Create Account" |
| **Expected Result** | Validation error shown; form not submitted |
| **Pass Criteria** | Error displayed on empty field; no account created |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | Test each required field individually |

---

### TC-01-008 — Successful sign in with correct credentials
| Field | Detail |
|---|---|
| **Preconditions** | Account exists for "arjun@test.com" with password "Test@1234" |
| **Steps** | 1. Open landing → tap "Sign In" 2. Enter email "arjun@test.com" 3. Enter password "Test@1234" 4. Tap "Sign In" |
| **Expected Result** | User navigated to Home screen; correct name displayed in greeting |
| **Pass Criteria** | Home renders; user session active |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-01-009 — Sign in with wrong password
| Field | Detail |
|---|---|
| **Preconditions** | Account exists for "arjun@test.com" |
| **Steps** | 1. Enter correct email 2. Enter wrong password "WrongPass" 3. Tap "Sign In" |
| **Expected Result** | Error message displayed: "Email or password is incorrect"; user stays on Sign In screen |
| **Pass Criteria** | No login; clear error message |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-01-010 — Sign in with non-existent email
| Field | Detail |
|---|---|
| **Preconditions** | Clean localStorage or email not registered |
| **Steps** | 1. Enter "unknown@test.com" as email 2. Enter any password 3. Tap "Sign In" |
| **Expected Result** | Error message shown; no login |
| **Pass Criteria** | Error displayed; landing/signin screen stays |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-01-011 — Auto-login when session exists in localStorage
| Field | Detail |
|---|---|
| **Preconditions** | User previously logged in; `decashift_user` key exists in localStorage |
| **Steps** | 1. Close and reopen app (or refresh page) |
| **Expected Result** | Landing screen is skipped; Home screen loads directly |
| **Pass Criteria** | Home renders without requiring sign in |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-01-012 — Sign out clears session and returns to landing
| Field | Detail |
|---|---|
| **Preconditions** | User is logged in on Home screen |
| **Steps** | 1. Tap user chip (top-right) 2. Tap "Sign Out" |
| **Expected Result** | Landing screen appears; `decashift_user` key removed from localStorage; question history in localStorage retained |
| **Pass Criteria** | Landing shown; no auto-login on refresh |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-01-013 — Phone feature showcase auto-rotates on landing
| Field | Detail |
|---|---|
| **Preconditions** | Landing screen loaded |
| **Steps** | 1. Wait 4 seconds; observe phone mockup |
| **Expected Result** | Feature slide changes to next slide automatically; dot indicator updates |
| **Pass Criteria** | 4 slides cycle; dots reflect active slide |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-01-014 — Stats counter animates when scrolled into view
| Field | Detail |
|---|---|
| **Preconditions** | Landing screen loaded; stats section below the fold |
| **Steps** | 1. Scroll down to the stats section |
| **Expected Result** | Number counters animate from 0 to their target values; run once only |
| **Pass Criteria** | Animation fires on first scroll-into-view; does not replay on scroll-out/in again |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-01-015 — "Sign In" nav link on landing smooth-scrolls or navigates
| Field | Detail |
|---|---|
| **Preconditions** | Landing screen loaded |
| **Steps** | 1. Click "Sign In" in the top nav |
| **Expected Result** | Sign In screen is shown |
| **Pass Criteria** | Sign In form visible |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |
