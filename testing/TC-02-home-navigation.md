# TC-02 — Home Screen & Navigation

**Feature:** Home Screen & Navigation  
**Reference:** `features/02-home-navigation.md`  
**Tester:** ___________  **Date:** ___________

---

## Test Cases

### TC-02-001 — Home screen renders all core sections after login
| Field | Detail |
|---|---|
| **Preconditions** | User logged in as Grade 5 school student |
| **Steps** | 1. Log in and arrive at Home screen |
| **Expected Result** | Visible: greeting with first name, user chip, streak count in header, Daily Quest bar, Flash Drills shelf, Subject tabs, "This Week" content shelf |
| **Pass Criteria** | All sections present; no blank sections or JS errors |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-02-002 — Greeting shows correct first name
| Field | Detail |
|---|---|
| **Preconditions** | User "Arjun Sharma" logged in |
| **Steps** | 1. View Home screen |
| **Expected Result** | Greeting reads "Hello, Arjun" (first name only, not full name) |
| **Pass Criteria** | Only first name displayed |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-02-003 — Math subject tab is pre-selected on first render (school user)
| Field | Detail |
|---|---|
| **Preconditions** | School user logging in for first time |
| **Steps** | 1. Arrive at Home screen |
| **Expected Result** | Math tab is highlighted/active; Math day cards visible in the shelf |
| **Pass Criteria** | Math is default active tab |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-02-004 — Tapping a subject tab filters content correctly
| Field | Detail |
|---|---|
| **Preconditions** | Home screen loaded |
| **Steps** | 1. Tap "Science" tab |
| **Expected Result** | Tab becomes active; shelf re-renders showing only Science day cards; Math cards hidden |
| **Pass Criteria** | Only selected subject cards shown |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | Repeat for Hindi, French, GK |

---

### TC-02-005 — Subject tabs are horizontally scrollable
| Field | Detail |
|---|---|
| **Preconditions** | Home screen on a 375px-wide mobile viewport |
| **Steps** | 1. Swipe/scroll the subject tab row horizontally |
| **Expected Result** | Tabs scroll smoothly; all subjects reachable |
| **Pass Criteria** | No tabs cut off; scroll works on touch and mouse |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-02-006 — Day cards display correct day labels and set numbers
| Field | Detail |
|---|---|
| **Preconditions** | Home screen, Math tab active |
| **Steps** | 1. View "This Week" shelf |
| **Expected Result** | 5 cards: Mon (Set 1), Tue (Set 2), Wed (Set 3), Thu (Set 4), Fri (Set 5); each shows subject icon and color |
| **Pass Criteria** | Correct day/set mapping; correct subject colors |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-02-007 — Wed/Thu/Fri cards show lock icon for free/expired plan users
| Field | Detail |
|---|---|
| **Preconditions** | User with `plan: 'expired'` or `plan: 'free'` |
| **Steps** | 1. View Home shelf |
| **Expected Result** | Mon and Tue cards have no lock; Wed, Thu, Fri cards show 🔒 lock icon |
| **Pass Criteria** | Lock icons on exactly days 3–5 |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-02-008 — Pro user sees no lock icons
| Field | Detail |
|---|---|
| **Preconditions** | User with `plan: 'pro'` |
| **Steps** | 1. View Home shelf |
| **Expected Result** | No lock icons on any day card |
| **Pass Criteria** | All 5 cards unlocked |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-02-009 — Completed day card shows completion badge
| Field | Detail |
|---|---|
| **Preconditions** | User has completed a session for Monday Math today |
| **Steps** | 1. View Home, Math tab |
| **Expected Result** | Monday card shows a ✅ or "Done" badge |
| **Pass Criteria** | Completion badge visible on completed card only |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-02-010 — Netflix shelf arrows appear and scroll on desktop
| Field | Detail |
|---|---|
| **Preconditions** | Desktop browser (> 1024px); shelf has overflowing content |
| **Steps** | 1. View shelf 2. Click right arrow ▶ 3. Click left arrow ◀ |
| **Expected Result** | Right arrow scrolls shelf forward ~85% of viewport; left arrow scrolls back; arrows appear/disappear at edges |
| **Pass Criteria** | Smooth scroll; arrows toggle visibility at start/end edges |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-02-011 — Mouse wheel scrolls horizontal shelf on desktop
| Field | Detail |
|---|---|
| **Preconditions** | Desktop browser; cursor over a subject shelf |
| **Steps** | 1. Hover over shelf 2. Scroll mouse wheel down |
| **Expected Result** | Shelf scrolls horizontally (not the page) |
| **Pass Criteria** | Horizontal scroll; page does not scroll vertically while shelf has scroll room |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | At shelf edge, page should resume vertical scroll |

---

### TC-02-012 — "Last Week" section expands and shows last week's cards
| Field | Detail |
|---|---|
| **Preconditions** | Home screen loaded |
| **Steps** | 1. Scroll down to "Last Week" section header 2. Tap to expand |
| **Expected Result** | Last week's day cards appear; week date range header shows previous week dates |
| **Pass Criteria** | Cards visible; correct date range label |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-02-013 — Drawer nav opens on hamburger tap (mobile)
| Field | Detail |
|---|---|
| **Preconditions** | Mobile viewport; Home screen |
| **Steps** | 1. Tap hamburger / menu icon |
| **Expected Result** | Drawer slides in from left; shows: Home, My Journey, Settings, Sign Out |
| **Pass Criteria** | Drawer visible with all 4 items |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-02-014 — Tapping outside drawer closes it
| Field | Detail |
|---|---|
| **Preconditions** | Drawer is open |
| **Steps** | 1. Tap anywhere outside the drawer |
| **Expected Result** | Drawer slides closed; Home screen visible |
| **Pass Criteria** | Drawer hidden; no navigation change |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-02-015 — User menu dropdown opens on chip tap (desktop)
| Field | Detail |
|---|---|
| **Preconditions** | Desktop; user logged in |
| **Steps** | 1. Click user name chip (top-right) |
| **Expected Result** | Dropdown menu appears with: My Journey, Settings, Sign Out |
| **Pass Criteria** | Dropdown visible with correct options |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-02-016 — User menu closes on outside click
| Field | Detail |
|---|---|
| **Preconditions** | User menu dropdown is open |
| **Steps** | 1. Click anywhere outside the dropdown |
| **Expected Result** | Dropdown closes |
| **Pass Criteria** | Menu hidden |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-02-017 — Week date range label is accurate
| Field | Detail |
|---|---|
| **Preconditions** | Home screen; known current date |
| **Steps** | 1. View "This Week" section heading |
| **Expected Result** | Date range shows the correct Mon–Fri dates for the current ISO week (e.g., "26 - 30 May, 2026") |
| **Pass Criteria** | Date range matches the actual current week |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-02-018 — Home renders correctly on 375px mobile viewport
| Field | Detail |
|---|---|
| **Preconditions** | Chrome DevTools set to 375px width (iPhone SE) |
| **Steps** | 1. Load Home screen |
| **Expected Result** | No horizontal overflow; all elements visible; text not cut off |
| **Pass Criteria** | Zero horizontal scroll on page level; no clipped content |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |
