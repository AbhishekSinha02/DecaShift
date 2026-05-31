# TC-15 — Settings

**Feature:** Settings  
**Reference:** `features/15-settings.md`  
**Tester:** ___________  **Date:** ___________

---

## Test Cases

### TC-15-001 — Settings opens from user menu
| Field | Detail |
|---|---|
| **Preconditions** | User logged in; Home screen |
| **Steps** | 1. Tap user chip 2. Tap "Settings" |
| **Expected Result** | Settings modal appears as full-screen overlay; 5–6 tile menu visible |
| **Pass Criteria** | Settings modal rendered |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-15-002 — Settings opens from drawer nav
| Field | Detail |
|---|---|
| **Preconditions** | Drawer open |
| **Steps** | 1. Tap "Settings" in drawer |
| **Expected Result** | Settings modal opens |
| **Pass Criteria** | Settings accessible from drawer |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-15-003 — Settings lazy-loads HTML on first open
| Field | Detail |
|---|---|
| **Preconditions** | Settings has not been opened this session; DevTools Network tab open |
| **Steps** | 1. Open Settings for the first time 2. Check Network requests |
| **Expected Result** | `screen-settings.html` fetch request visible in Network tab |
| **Pass Criteria** | Settings HTML fetched on demand (not in initial page load) |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-15-004 — Settings menu shows all expected tiles
| Field | Detail |
|---|---|
| **Preconditions** | Settings modal open |
| **Steps** | 1. View tiles in settings menu |
| **Expected Result** | Tiles present: Profile, Appearance, Learning, Security, My Plan |
| **Pass Criteria** | All 5 tiles visible |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-15-005 — Profile sub-screen shows current user data
| Field | Detail |
|---|---|
| **Preconditions** | User "Arjun Sharma", Grade 5 |
| **Steps** | 1. Tap "Profile" tile |
| **Expected Result** | Name field pre-filled with "Arjun Sharma"; grade selector shows "Grade 5" |
| **Pass Criteria** | Current profile data displayed |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-15-006 — Profile name can be updated and saved
| Field | Detail |
|---|---|
| **Preconditions** | Profile sub-screen open |
| **Steps** | 1. Change name to "Arjun K" 2. Tap "Save Changes" |
| **Expected Result** | Success feedback shown; Home greeting updates to "Hello, Arjun K" |
| **Pass Criteria** | Name updated in localStorage; greeting reflects new name |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-15-007 — Grade selector updates grade for school user
| Field | Detail |
|---|---|
| **Preconditions** | School user, currently Grade 5 |
| **Steps** | 1. Open Profile 2. Change grade to Grade 7 3. Save 4. Return to Home |
| **Expected Result** | Home shows Grade 7 content |
| **Pass Criteria** | Grade change persisted; home content updates |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-15-008 — Grade selector not shown for professional user
| Field | Detail |
|---|---|
| **Preconditions** | Professional category user |
| **Steps** | 1. Open Settings → Profile |
| **Expected Result** | No grade selector visible |
| **Pass Criteria** | Grade field absent for professional |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-15-009 — Appearance sub-screen shows theme options
| Field | Detail |
|---|---|
| **Preconditions** | Settings open |
| **Steps** | 1. Tap "Appearance" tile |
| **Expected Result** | Theme options visible: Dark, Light, System |
| **Pass Criteria** | 3 theme options present |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-15-010 — Light theme applies immediately on selection
| Field | Detail |
|---|---|
| **Preconditions** | App in Dark theme |
| **Steps** | 1. Open Appearance 2. Select "Light" theme |
| **Expected Result** | App background changes to light immediately; no page reload needed |
| **Pass Criteria** | Theme applies in real time |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-15-011 — Theme persists across page reload
| Field | Detail |
|---|---|
| **Preconditions** | Light theme selected |
| **Steps** | 1. Hard refresh page |
| **Expected Result** | App reopens in Light theme |
| **Pass Criteria** | Theme saved to localStorage |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-15-012 — Learning sub-screen shows timer toggle
| Field | Detail |
|---|---|
| **Preconditions** | Settings open |
| **Steps** | 1. Tap "Learning" tile |
| **Expected Result** | Timer toggle (On/Off) visible |
| **Pass Criteria** | Toggle present |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-15-013 — Timer toggle Off hides timer in quiz
| Field | Detail |
|---|---|
| **Preconditions** | Timer currently On |
| **Steps** | 1. Settings → Learning → Toggle timer Off 2. Close Settings 3. Start a quiz |
| **Expected Result** | Timer not visible on quiz screen |
| **Pass Criteria** | Timer hidden when disabled |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-15-014 — Security sub-screen allows password change
| Field | Detail |
|---|---|
| **Preconditions** | Account with current password "Test@1234" |
| **Steps** | 1. Open Settings → Security 2. Enter current password "Test@1234" 3. Enter new password "New@5678" 4. Confirm new password "New@5678" 5. Tap "Update Password" |
| **Expected Result** | Success message; new password works on next sign-in |
| **Pass Criteria** | Password updated; old password no longer works |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-15-015 — Password change fails with wrong current password
| Field | Detail |
|---|---|
| **Preconditions** | Settings → Security open |
| **Steps** | 1. Enter wrong current password 2. Tap "Update Password" |
| **Expected Result** | Error: "Current password is incorrect"; password not changed |
| **Pass Criteria** | Error shown; no change to stored password |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-15-016 — Back arrow returns from sub-screen to settings menu
| Field | Detail |
|---|---|
| **Preconditions** | In Profile sub-screen |
| **Steps** | 1. Tap back arrow |
| **Expected Result** | Settings menu shows; Profile sub-screen hidden |
| **Pass Criteria** | Navigation back to menu works |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-15-017 — Settings close button closes the modal
| Field | Detail |
|---|---|
| **Preconditions** | Settings modal open (any sub-screen or menu) |
| **Steps** | 1. Tap ✕ close button |
| **Expected Result** | Settings modal hides; user returned to previous screen |
| **Pass Criteria** | Modal fully hidden |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |
