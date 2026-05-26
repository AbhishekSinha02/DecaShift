# Feature: Localized Curriculum Content

**Priority:** P6 | **Type:** Content | **Complexity:** L | **Status:** Pending

## Goal
Write math, science, and logic questions in Arabic, French, German, and Spanish —
aligned to each country's school curriculum — so students in those markets get
questions that match what they actually study in school.

---

## Why This Is Different From Language Learning (P6-T005)
P6-T005 = English-speaking users learning a foreign language (questions in English, about French)
P6-T006 = French-speaking students doing math/science in French (questions written in French)

These are different products for different users.

---

## Target Curricula (Phase 1)

| Market | Language | Curriculum | Key Subjects |
|---|---|---|---|
| France + Belgium | French | Éducation Nationale | Mathématiques, Sciences |
| Germany + Austria | German | Kultusministerkonferenz | Mathematik, Naturwissenschaft |
| Saudi Arabia + UAE | Arabic | Ministry of Education | الرياضيات (Math), العلوم (Science) |
| Mexico + Colombia | Spanish | SEP (Mexico) / MEN (Colombia) | Matemáticas, Ciencias |

---

## Folder Structure

```
app/ui/questions/
├── school/
│   ├── grade-5/
│   │   ├── math.json              ← English (existing)
│   │   ├── math-fr.json           ← French curriculum
│   │   ├── math-de.json           ← German curriculum
│   │   ├── math-ar.json           ← Arabic curriculum (RTL content)
│   │   └── math-es.json           ← Spanish curriculum
```

### manifest.json Pattern
```json
{ "file": "school/grade-5/math-fr.json", "category": "school", "grade": 5, "subject": "mathematics", "level": 1, "lang": "fr" },
{ "file": "school/grade-5/math-ar.json", "category": "school", "grade": 5, "subject": "mathematics", "level": 1, "lang": "ar" }
```

New `lang` field in manifest — `_filterManifest()` uses it to serve the correct
language variant when `user.lang` is set.

### Example (math-ar.json, Grade 5)
```json
{
  "goalId": "grade-5-math-ar",
  "title": "رياضيات الصف الخامس",
  "category": "school",
  "subject": "mathematics",
  "lang": "ar",
  "grade": 5,
  "questions": [
    {
      "id": "ar-g5-m-001",
      "question": "ما حاصل ضرب ٧ × ٨ ؟",
      "options": ["٥٦", "٤٨", "٦٣", "٤٢"],
      "correctIndex": 0,
      "explanation": "٧ × ٨ = ٥٦"
    }
  ]
}
```

---

## Content Creation Process
Localized curriculum content requires native-language subject experts,
not just translation. A direct translation of English math questions into Arabic
may not align with Arabic-medium school curriculum terminology and question style.

**Recommended process:**
1. Define target grade + subject + curriculum standard
2. Native-language subject expert writes 50 questions in target language
3. Questions reviewed for curriculum alignment
4. JSON file created and added to manifest
5. Tested through full quiz flow (especially RTL for Arabic)

---

## Acceptance Criteria

- [ ] Grade 5-8 math in French (50 questions, aligned to Éducation Nationale)
- [ ] Grade 5-8 math in German (50 questions, aligned to KMK)
- [ ] Grade 5-8 math in Arabic (50 questions, RTL content, Arabic numerals)
- [ ] Grade 5-8 math in Spanish (50 questions, aligned to SEP Mexico)
- [ ] manifest.json entries with `lang` field for all localized files
- [ ] `_filterManifest()` updated to match on `lang` when set in user profile
- [ ] RTL questions render correctly in quiz interface (Arabic)
- [ ] Language-specific question files work through full quiz + result flow

## Dependencies
- P6-T004 (i18n — app UI must be in user's language before localized questions ship)
- P6-T005 (international language learning — establishes content patterns)
- P3-T009 (nested folder structure — done, localized files fit the same pattern)

## Phase 2
- Science, history, geography in localized languages
- Grades 9–12 in each language
- Add `lang` dimension to progress tracking
