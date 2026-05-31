# TC-12 — Share Cards (Achievement Images)

**Feature:** Share Cards  
**Reference:** `features/12-share-cards.md`  
**Tester:** ___________  **Date:** ___________

---

## Test Cases

### TC-12-001 — "Share Result" button visible on quiz result screen
| Field | Detail |
|---|---|
| **Preconditions** | Quiz completed; result screen shown |
| **Steps** | 1. View result screen |
| **Expected Result** | "Share Result" button visible |
| **Pass Criteria** | Button present |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-12-002 — Tapping "Share Result" triggers card generation
| Field | Detail |
|---|---|
| **Preconditions** | Result screen shown |
| **Steps** | 1. Tap "Share Result" |
| **Expected Result** | Loading indicator briefly shows; then either native share sheet OR PNG download initiates |
| **Pass Criteria** | Share flow triggered without error |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-12-003 — Share card renders at 1080×1080 resolution
| Field | Detail |
|---|---|
| **Preconditions** | Share flow triggered; PNG downloaded |
| **Steps** | 1. Inspect downloaded PNG file dimensions |
| **Expected Result** | Image is exactly 1080×1080 pixels |
| **Pass Criteria** | Dimensions correct |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-12-004 — Card contains user's avatar (current stage)
| Field | Detail |
|---|---|
| **Preconditions** | User at Level 7 (Rookie, Stage 3) |
| **Steps** | 1. Generate a share card 2. Open the PNG |
| **Expected Result** | Donnibo Rookie avatar visible on the card |
| **Pass Criteria** | Avatar image on card matches user's current stage |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-12-005 — Card contains score/headline information
| Field | Detail |
|---|---|
| **Preconditions** | Quiz result: 12/15 on Grade 5 Math |
| **Steps** | 1. Generate share card 2. Inspect PNG |
| **Expected Result** | Card shows score headline: "12/15 on Grade 5 Math!" or equivalent |
| **Pass Criteria** | Score/headline readable on card |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-12-006 — Card contains "Donnibo" wordmark
| Field | Detail |
|---|---|
| **Preconditions** | Any share card generated |
| **Steps** | 1. Open PNG |
| **Expected Result** | "Donnibo" branding visible on card (likely at bottom) |
| **Pass Criteria** | App name on card |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-12-007 — Native share sheet opens on Android Chrome
| Field | Detail |
|---|---|
| **Preconditions** | Android device with Chrome; `navigator.share` available |
| **Steps** | 1. Tap "Share Result" on Android |
| **Expected Result** | Native Android share sheet opens with PNG file attached; text pre-filled |
| **Pass Criteria** | Native share sheet visible with image |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-12-008 — PNG download fallback on desktop
| Field | Detail |
|---|---|
| **Preconditions** | Desktop browser (no `navigator.share`) |
| **Steps** | 1. Tap "Share Result" |
| **Expected Result** | PNG file downloaded automatically; text message shown for manual copy |
| **Pass Criteria** | File downloads; no crash |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-12-009 — Share card renders with letter fallback when SVG unavailable
| Field | Detail |
|---|---|
| **Preconditions** | Avatar SVG blocked (DevTools network block) |
| **Steps** | 1. Block SVG requests 2. Generate share card |
| **Expected Result** | Card renders with letter initial as avatar fallback; no broken image; card still downloadable |
| **Pass Criteria** | Card generated successfully with fallback |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-12-010 — Share card generation works offline (file:// and service worker cache)
| Field | Detail |
|---|---|
| **Preconditions** | App loaded while online; now go offline (DevTools Offline) |
| **Steps** | 1. Go offline 2. Generate share card |
| **Expected Result** | Card renders from cached assets; PNG generated successfully |
| **Pass Criteria** | No network error; card created offline |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |
