# Feature: Regional Language Learning

**Priority:** P3 | **Type:** Content + Feature | **Complexity:** M | **Status:** Pending

## Goal
Let any student (Grade 2–12) or college user opt into one regional language for daily
practice questions — vocabulary, grammar, and reading comprehension — shown alongside
their existing grade/subject goals on the home screen.

**Supported languages (Phase 1):**
Hindi | Marathi | Kannada | Tamil | Telugu | Malayalam

---

## Why This Matters
- Most Indian school students study one regional language compulsorily up to Grade 10
- No existing app combines competitive exam prep + regional language practice in one habit loop
- Adds a high-value differentiator for the Indian market with zero infrastructure cost
- Questions are static JSON — same content engine as everything else

---

## Folder Structure

```
app/ui/questions/
└── language/
    ├── hindi.json
    ├── marathi.json
    ├── kannada.json
    ├── tamil.json
    ├── telugu.json
    └── malayalam.json
```

---

## manifest.json Additions (6 new entries)

```json
{ "file": "language/hindi.json",    "category": "language", "grade": null, "subject": "hindi",    "level": 1 },
{ "file": "language/marathi.json",  "category": "language", "grade": null, "subject": "marathi",  "level": 1 },
{ "file": "language/kannada.json",  "category": "language", "grade": null, "subject": "kannada",  "level": 1 },
{ "file": "language/tamil.json",    "category": "language", "grade": null, "subject": "tamil",    "level": 1 },
{ "file": "language/telugu.json",   "category": "language", "grade": null, "subject": "telugu",   "level": 1 },
{ "file": "language/malayalam.json","category": "language", "grade": null, "subject": "malayalam","level": 1 }
```

---

## Question File Schema

Each file follows the existing question JSON format. Questions should be in English
(the UI language) — testing *knowledge of* the regional language, not testing ability
to read the UI in it.

Example (`hindi.json`):
```json
{
  "goalId": "hindi",
  "title": "Hindi Language Practice",
  "category": "language",
  "subject": "hindi",
  "level": 1,
  "questions": [
    {
      "id": "hi-001",
      "question": "What is the plural form of 'लड़का' (ladka — boy)?",
      "options": ["लड़के", "लड़की", "लड़कियाँ", "लड़को"],
      "correctIndex": 0,
      "explanation": "'लड़के' (ladke) is the plural masculine form. 'लड़की' is the feminine singular."
    }
  ]
}
```

**Question types per language file (20 questions at launch):**
- 6 vocabulary (word meaning / synonym / antonym)
- 5 grammar (plural, gender, tense, sandhi/vibhakti)
- 5 reading comprehension (short passage, 1 question)
- 4 fill in the blank (sentence completion)

---

## User Profile Change

Add `preferredLanguage` field to the user profile object:

```js
// In profile (localStorage + Drive):
{
  preferredLanguage: "hindi" | "marathi" | "kannada" | "tamil" | "telugu" | "malayalam" | null
}
```

- Default: `null` (no language selected — no language goal shown)
- Set during profile setup (new field after grade/category selection) OR from profile edit screen
- Optional — user can skip

---

## Filtering Logic Change (`_filterManifest`)

Language goals are **additive** — shown in addition to the user's grade/category goals, not instead of them.

```js
function _filterManifest(manifest, user) {
  if (!manifest || !manifest.length) return [];
  const cat = user.category;
  if (!cat) return [];

  let entries = [];

  // Existing logic — grade/category filtering
  if (cat === 'school') {
    if (user.grade === 'college') entries = manifest.filter(e => e.category === 'college');
    else {
      const grade = parseInt(user.grade, 10);
      entries = manifest.filter(e => e.category === 'school' && e.grade === grade);
    }
  } else if (cat === 'college') {
    entries = manifest.filter(e => e.category === 'college');
  } else {
    entries = manifest.filter(e => e.category === 'professional');
  }

  // Additive: append language goal if user opted in
  if (user.preferredLanguage) {
    const langEntry = manifest.find(
      e => e.category === 'language' && e.subject === user.preferredLanguage
    );
    if (langEntry) entries = [...entries, langEntry];
  }

  return entries;
}
```

---

## UI Changes

### Profile Setup (new step)
After the grade/category selection step, show a language selector:

```
"Do you study a regional language?"
[ Hindi ]  [ Marathi ]  [ Kannada ]
[ Tamil ]  [ Telugu ]  [ Malayalam ]
[ Skip — I'll add later ]
```

### Profile Edit Screen (P2-T017)
Add "Regional Language" row — shows current selection with a Change button.
Changing language does NOT affect session history — old language sessions are still
in Drive/localStorage under the previous goalId.

### Home Screen
Language goal appears as a separate goal card with a language badge:
```
[ 🔤 Hindi Practice   20 questions   Last: 85% ]
```

---

## Content Plan — Phase 1 (launch with 20 questions each)

| Language | Script | Total Q | Status |
|---|---|---|---|
| Hindi | Devanagari | 20 | Pending |
| Marathi | Devanagari | 20 | Pending |
| Kannada | Kannada script | 20 | Pending |
| Tamil | Tamil script | 20 | Pending |
| Telugu | Telugu script | 20 | Pending |
| Malayalam | Malayalam script | 20 | Pending |

**Total: 120 new questions**

Phase 2 (after engagement signal): expand to 50 questions per language, add Level 2
with harder grammar and longer passages.

---

## Acceptance Criteria

- [ ] `language/` subfolder with 6 JSON files (20 questions each)
- [ ] manifest.json updated with 6 new entries
- [ ] `user.preferredLanguage` saved to profile (localStorage + Drive sync)
- [ ] Language selector shown during profile setup (skippable)
- [ ] `_filterManifest()` appends language goal additively
- [ ] Language goal card appears on home screen when language is set
- [ ] Profile edit screen shows current language with option to change
- [ ] Quiz and result screens work unchanged (no special handling needed)
- [ ] Mobile layout handles 6-button language selector at 375px

---

## Files to Touch

| File | Change |
|---|---|
| `app/ui/questions/language/*.json` | 6 new question files |
| `app/ui/questions/manifest.json` | 6 new entries |
| `app/ui/app.js` | `_filterManifest()` updated, profile setup step |
| `app/ui/index.html` | Language selector step in profile setup modal |
| `app/ui/styles.css` | Language selector button grid, language badge on goal card |

---

## Dependencies
- P1-T013 (multi-file questions — done)
- P3-T009 (nested folder structure — done, language/ fits the same pattern)
- P2-T012 (profile edit — pending, language preference change lives here)

## Phase 2 (future)
- Level 2 files: `language/hindi-l2.json` etc. — no app changes, just manifest + file
- Add manifest entry `"level": 2` and extend level filter logic
- Add Urdu, Punjabi, Bengali, Gujarati, Odia

---

## Priority Note
Ships independently of P2-T012 (profile edit). Language preference can be set at
signup even if the profile edit screen isn't built yet. P2-T012 just adds the
"change language" option after the fact.
