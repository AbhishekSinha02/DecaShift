# P3-T018 — Regional Language: Signup Selection + Profile Settings + Question Sets

**Priority:** P3 — Engagement & Retention  
**Complexity:** M (2–3 days)  
**Status:** Done ✅

---

## Goal

Let users opt in to a regional language (Sanskrit, Marathi, Tamil, Telugu, Punjabi, Malayalam) at signup and update it anytime from profile settings. Regional language goals appear as a dedicated section on the home screen, completely parallel to the existing grade-based subject flow — no impact on existing users.

---

## Scope

- Optional regional language selector at the bottom of the signup form
- "Settings" option in the user menu → modal with regional language + change password
- `user.regionalLanguage` stored in localStorage user profile
- `questions/school/regional/{language}/set-1.json` and `set-2.json` for all 6 languages
- Home screen shows "Regional Practice" section only when a language is selected
- Regional goals excluded from subject tab filters (Math/Science/Hindi/French)
- Zero impact on users who don't select a regional language

---

## Data

**User profile addition:**
```json
{ "regionalLanguage": "marathi" }   // or null / ""
```

**Manifest entry format:**
```json
{ "file": "school/regional/marathi/set-1.json", "category": "school", "grade": null, "subject": "regional-marathi", "level": 1 }
```

**`_filterManifest` logic:**
- `subject === 'weekly'` → always include for school users
- `subject.startsWith('regional-')` → include only if `user.regionalLanguage` matches
- Everything else → match by grade (existing behavior, unchanged)

---

## Languages & Content

| Language | Folder | Set 1 | Set 2 |
|---|---|---|---|
| Sanskrit | `regional/sanskrit/` | Basic vocab (10q) | Greetings & phrases (10q) |
| Marathi | `regional/marathi/` | Basic vocab (10q) | Common phrases (10q) |
| Tamil | `regional/tamil/` | Basic vocab (10q) | Common phrases (10q) |
| Telugu | `regional/telugu/` | Basic vocab (10q) | Common phrases (10q) |
| Punjabi | `regional/punjabi/` | Basic vocab (10q) | Common phrases (10q) |
| Malayalam | `regional/malayalam/` | Basic vocab (10q) | Common phrases (10q) |

Total: 12 files, 120 questions

---

## Dependencies

- Builds on P3-T013 (regional lang plan — Pending, superseded by this)
- Parallel to all existing flows — no dependencies on pending P2 tasks
