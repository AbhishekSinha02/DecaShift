# TC-11 — Collectibles & Mystery Box

**Feature:** Collectibles & Mystery Box  
**Reference:** `features/11-collectibles-mystery-box.md`  
**Tester:** ___________  **Date:** ___________

---

## Test Cases

### TC-11-001 — Mystery box triggers after all 3 Daily Quest objectives complete
| Field | Detail |
|---|---|
| **Preconditions** | 2 of 3 quest objectives done |
| **Steps** | 1. Complete the third objective 2. Return to Home |
| **Expected Result** | Reward notification card slides up from bottom of Home screen |
| **Pass Criteria** | Reward card visible after quest completion |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-11-002 — Reward card shows reward type
| Field | Detail |
|---|---|
| **Preconditions** | Mystery box reward triggered |
| **Steps** | 1. Observe reward notification card |
| **Expected Result** | Card shows either: sticker name + image, "+X XP" amount, or "❄ Streak Freeze" |
| **Pass Criteria** | Reward type clearly identified on card |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-11-003 — Tapping "Claim" applies reward and dismisses card
| Field | Detail |
|---|---|
| **Preconditions** | Reward notification card visible |
| **Steps** | 1. Tap "Claim" button |
| **Expected Result** | Card dismisses; reward is applied (XP updated, or sticker added, or freeze count +1) |
| **Pass Criteria** | Card gone; reward reflected in app state |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-11-004 — Sticker reward appears as new item in collectibles
| Field | Detail |
|---|---|
| **Preconditions** | Mystery box rolled a sticker ("Chill Donnibo"); user claimed it |
| **Steps** | 1. Navigate to sticker album (Settings → Collectibles or Journey) |
| **Expected Result** | "Chill Donnibo" sticker shows in album with "NEW" ribbon |
| **Pass Criteria** | Sticker present with NEW ribbon |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-11-005 — Owned stickers appear in full color; unowned in greyscale
| Field | Detail |
|---|---|
| **Preconditions** | User owns 3 of 7 stickers |
| **Steps** | 1. Open sticker album |
| **Expected Result** | 3 owned stickers: full color with name and rarity badge; 4 unowned: greyscale silhouette with "???" |
| **Pass Criteria** | Visual distinction between owned/unowned |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-11-006 — NEW ribbon clears after viewing album
| Field | Detail |
|---|---|
| **Preconditions** | Sticker album has 2 NEW stickers |
| **Steps** | 1. Open sticker album 2. Close sticker album 3. Reopen sticker album |
| **Expected Result** | NEW ribbons gone on second open |
| **Pass Criteria** | markAllSeen() called on album open; ribbons cleared |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-11-007 — No duplicate stickers granted
| Field | Detail |
|---|---|
| **Preconditions** | User owns all common stickers |
| **Steps** | 1. Trigger multiple mystery boxes (complete quest multiple days) |
| **Expected Result** | No sticker appears more than once in the album; duplicate rolls grant XP instead |
| **Pass Criteria** | Album never shows duplicates |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-11-008 — Freeze reward increments freeze count
| Field | Detail |
|---|---|
| **Preconditions** | User has 0 freezes; mystery box rolls a freeze |
| **Steps** | 1. Claim freeze reward 2. Open Journey screen |
| **Expected Result** | Freeze count shows 1 |
| **Pass Criteria** | Freeze count incremented |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-11-009 — XP reward from box is added to total
| Field | Detail |
|---|---|
| **Preconditions** | User has 300 XP; box rewards +50 XP |
| **Steps** | 1. Claim XP reward 2. Open Journey screen |
| **Expected Result** | XP total shows 350 |
| **Pass Criteria** | XP correctly incremented |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-11-010 — Collectibles state persists across page reload
| Field | Detail |
|---|---|
| **Preconditions** | User owns 4 stickers |
| **Steps** | 1. Hard refresh page 2. Open sticker album |
| **Expected Result** | 4 stickers still owned; ownership not reset |
| **Pass Criteria** | Collectibles persisted in localStorage |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |

---

### TC-11-011 — Rarity badge shown on each sticker
| Field | Detail |
|---|---|
| **Preconditions** | Sticker album open with at least one Common, Rare, and Epic sticker owned |
| **Steps** | 1. View each sticker in album |
| **Expected Result** | Rarity badge visible: "Common" / "Rare" / "Epic" |
| **Pass Criteria** | Correct rarity for each sticker per pool definition |
| **Status** | ☐ Pass ☐ Fail ☐ Skip |
| **Notes** | |
