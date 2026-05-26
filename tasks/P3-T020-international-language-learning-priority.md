# P3-T020 — International Language Learning (Fast-Track from P6)

**Priority:** P3 — Engagement & Retention (elevated from P6-T005)
**Complexity:** M (2–3 days)
**Status:** Pending

---

## Goal

Add international language learning sets (French, German, Spanish, Japanese, Mandarin, Arabic)
as a direct competitor angle to Duolingo — but with DecaShift's daily habit loop + streak tracking.
Follows the exact same architecture as P3-T018 (regional languages): separate folder, optional
selection at signup, shown as dedicated section on home screen.

This is a core differentiator: Duolingo is gamified but lacks quiz-style assessment with
instant correctness feedback and study-session tracking. DecaShift does both.

---

## Scope

### Question Files
- `questions/international/{language}/set-1.json` — Basic vocabulary (10q)
- `questions/international/{language}/set-2.json` — Common phrases (10q)
- Languages: French, German, Spanish, Japanese, Mandarin, Arabic
- Total: 12 files, 120 questions (parallel to regional language architecture)

### Manifest
- `{ "file": "international/french/set-1.json", "category": "any", "grade": null, "subject": "intl-french", "level": 1 }`
- `category: "any"` — available to all user types (school, college, professional)

### `_filterManifest` update
- `subject.startsWith('intl-')` → include only if `user.internationalLanguage` matches

### UI
- Optional international language selector at signup (separate from regional — different dropdown)
- Settings modal: "International Language Practice" section alongside regional
- Home screen: "Language Practice" section shows both regional + international if both set

### User Profile
```json
{ "internationalLanguage": "french" }
```

---

## Languages & Content

| Language | Folder | Set 1 | Set 2 |
|---|---|---|---|
| French | `international/french/` | Basic vocab (10q) | Common phrases (10q) |
| German | `international/german/` | Basic vocab (10q) | Common phrases (10q) |
| Spanish | `international/spanish/` | Basic vocab (10q) | Common phrases (10q) |
| Japanese | `international/japanese/` | Basic vocab (10q) | Common phrases (10q) |
| Mandarin | `international/mandarin/` | Basic vocab (10q) | Common phrases (10q) |
| Arabic | `international/arabic/` | Basic vocab (10q) | Common phrases (10q) |

---

## Differentiator vs. Duolingo

| | Duolingo | DecaShift |
|---|---|---|
| Format | Gamified lessons | Quiz-style MCQ with instant feedback |
| Assessment | Lesson completion | Accuracy % + per-session score |
| Session tracking | XP / gems | Time, accuracy, streak per goal |
| Content | Structured courses | Parallel sets, weekly challenges |
| Professional context | None | Alongside DevOps/MLOps content |

---

## Dependencies
- P3-T018 (regional language architecture — done, reuse exact same pattern)
- Supersedes P6-T005 in priority
