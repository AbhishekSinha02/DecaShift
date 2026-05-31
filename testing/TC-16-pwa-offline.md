# TC-16 — PWA & Offline Support

**Feature:** PWA & Offline Support  
**Reference:** `features/16-pwa-offline.md`  
**Tester:** ___________  **Date:** ___________

---

## Test Cases

### TC-16-001 — App is installable on Android Chrome (beforeinstallprompt fires)
| Field | Detail |
|---|---|
| **Preconditions** | Android device; Chrome browser; app URL visited at least once |
| **Steps** | 1. Open app in Chrome on Android |
| **Expected Result** | "Add to Home Screen" banner appears OR Chrome's install badge in address bar is visible |
| **Pass Criteria** | Install prompt triggered |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | May require 2 visits per Chrome heuristic |

---

### TC-16-002 — Install banner shows correct content
| Field | Detail |
|---|---|
| **Preconditions** | Install banner visible |
| **Steps** | 1. Observe banner |
| **Expected Result** | Donnibo icon, app name, install message, "Install" button, "Not now" dismiss link |
| **Pass Criteria** | All banner elements present |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-16-003 — Tapping "Install" installs app to home screen
| Field | Detail |
|---|---|
| **Preconditions** | Install banner visible |
| **Steps** | 1. Tap "Install" 2. Confirm in native dialog |
| **Expected Result** | App icon added to Android home screen; app opens in standalone mode (no browser bar) |
| **Pass Criteria** | App installed; standalone mode confirmed |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-16-004 — "Not now" dismisses banner and respects 7-day silence
| Field | Detail |
|---|---|
| **Preconditions** | Install banner visible |
| **Steps** | 1. Tap "Not now" 2. Reload app immediately |
| **Expected Result** | Banner does not reappear |
| **Pass Criteria** | Banner suppressed after dismiss |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-16-005 — iOS Safari shows "Add to Home Screen" instruction
| Field | Detail |
|---|---|
| **Preconditions** | iPhone or iPad; Safari browser; app not yet installed |
| **Steps** | 1. Open app in iOS Safari |
| **Expected Result** | Instruction tooltip / card appears showing "Tap Share → Add to Home Screen" |
| **Pass Criteria** | iOS-specific instructions shown |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-16-006 — App opens in standalone mode after install
| Field | Detail |
|---|---|
| **Preconditions** | App installed to home screen |
| **Steps** | 1. Tap Donnibo icon on home screen |
| **Expected Result** | App opens without browser address bar; full-screen app feel |
| **Pass Criteria** | Standalone mode; no browser chrome visible |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-16-007 — App shell loads from cache on second visit (fast load)
| Field | Detail |
|---|---|
| **Preconditions** | App visited at least once; service worker installed |
| **Steps** | 1. Open DevTools → Network → set throttling to "Slow 3G" 2. Reload app |
| **Expected Result** | App shell renders in under 2 seconds (served from service worker cache) |
| **Pass Criteria** | App shell cached; faster than first load |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-16-008 — Quiz session completes offline without data loss
| Field | Detail |
|---|---|
| **Preconditions** | App loaded while online; question set already loaded into memory |
| **Steps** | 1. Start a quiz 2. Go offline (DevTools → Offline) 3. Complete all 15 questions |
| **Expected Result** | Quiz completes normally; result screen shows; session saved to localStorage |
| **Pass Criteria** | No interruption; session persisted locally |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-16-009 — Drive sync fails silently when offline; retries when online
| Field | Detail |
|---|---|
| **Preconditions** | Offline quiz completed (session in localStorage) |
| **Steps** | 1. Note session exists in localStorage 2. Go back online 3. Complete another session |
| **Expected Result** | No error shown during offline save; sync attempt on next online session |
| **Pass Criteria** | Silent fallback; no error message to user |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-16-010 — App loads in offline mode (full offline)
| Field | Detail |
|---|---|
| **Preconditions** | App fully loaded and cached; device goes fully offline |
| **Steps** | 1. Disconnect internet 2. Close app 3. Reopen app |
| **Expected Result** | App shell loads; user can log in; previously cached content accessible |
| **Pass Criteria** | App functional offline for cached content |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-16-011 — Manifest sets correct theme color
| Field | Detail |
|---|---|
| **Preconditions** | App installed on Android |
| **Steps** | 1. Open app from home screen 2. Observe Android status bar |
| **Expected Result** | Status bar shows Donnibo violet (#7c3aed) |
| **Pass Criteria** | Theme color matches manifest |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-16-012 — Service worker registered successfully
| Field | Detail |
|---|---|
| **Preconditions** | App open in Chrome |
| **Steps** | 1. DevTools → Application → Service Workers |
| **Expected Result** | Service worker shows as "activated and running" |
| **Pass Criteria** | SW active |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-16-013 — App payload under 400 KB on first load
| Field | Detail |
|---|---|
| **Preconditions** | Fresh browser (no cache); DevTools → Network |
| **Steps** | 1. Hard reload app (Ctrl+Shift+R) 2. Check "Transferred" column total |
| **Expected Result** | Total transferred < 400 KB |
| **Pass Criteria** | Payload within target |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | Baseline: 340 KB (2026-05-30) |
