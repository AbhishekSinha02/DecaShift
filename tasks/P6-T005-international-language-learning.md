# Feature: International Language Learning

**Priority:** P6 | **Type:** Content + Feature | **Complexity:** M | **Status:** Pending

## Goal
Extend the regional language learning module (P3-T013) to include major international
languages — French, German, Arabic, Spanish, Japanese, Mandarin.

Any user globally can opt into one international language for daily practice alongside
their existing grade/professional goals.

---

## Languages — Phase 1

| Language | Speakers (global) | Key markets |
|---|---|---|
| French | 320M | France, Canada, Africa (55 countries) |
| German | 100M | Germany, Austria, Switzerland |
| Arabic | 420M | Middle East, North Africa |
| Spanish | 500M | Latin America, Spain, USA |
| Japanese | 125M | Japan, Japanese diaspora |
| Mandarin | 1.1B | China, Taiwan, SE Asia |

---

## Folder Structure (extends P3-T013)

```
app/ui/questions/
└── language/
    ├── hindi.json        ← P3-T013 (Indian regional)
    ├── marathi.json
    ├── kannada.json
    ├── tamil.json
    ├── telugu.json
    ├── malayalam.json
    ├── french.json       ← P6-T005 (International)
    ├── german.json
    ├── arabic.json
    ├── spanish.json
    ├── japanese.json
    └── mandarin.json
```

Adding a language = one JSON file + one line in manifest.json. No app changes.

---

## manifest.json Additions

```json
{ "file": "language/french.json",   "category": "language", "grade": null, "subject": "french",   "level": 1 },
{ "file": "language/german.json",   "category": "language", "grade": null, "subject": "german",   "level": 1 },
{ "file": "language/arabic.json",   "category": "language", "grade": null, "subject": "arabic",   "level": 1 },
{ "file": "language/spanish.json",  "category": "language", "grade": null, "subject": "spanish",  "level": 1 },
{ "file": "language/japanese.json", "category": "language", "grade": null, "subject": "japanese", "level": 1 },
{ "file": "language/mandarin.json", "category": "language", "grade": null, "subject": "mandarin", "level": 1 }
```

---

## Question Design (International Languages)
Questions are in English — testing knowledge of the international language.
No app changes needed since P3-T013 already handles the language goal display.

Example (french.json):
```json
{
  "goalId": "french",
  "title": "French Language Practice",
  "category": "language",
  "subject": "french",
  "level": 1,
  "questions": [
    {
      "id": "fr-001",
      "question": "What does 'bonjour' mean?",
      "options": ["Good morning / Hello", "Good night", "Thank you", "Goodbye"],
      "correctIndex": 0,
      "explanation": "'Bonjour' is used for 'Hello' or 'Good morning' in French."
    },
    {
      "id": "fr-002",
      "question": "How do you say 'I am hungry' in French?",
      "options": ["J'ai faim", "J'ai soif", "Je suis fatigue", "J'ai peur"],
      "correctIndex": 0,
      "explanation": "'J'ai faim' literally means 'I have hunger' — the French way to say hungry."
    }
  ]
}
```

**20 questions per language at launch:**
- 6 vocabulary / common phrases
- 5 grammar (verb conjugation, gender, articles)
- 5 reading (short sentence translation)
- 4 cultural knowledge (greetings, numbers, days, months)

---

## UI Change — Language Selector Expansion

Profile setup language selector (from P3-T013) splits into two tabs:

```
[ Indian Languages ]    [ International Languages ]

[Hindi]   [Marathi]     |   [French]  [German]
[Kannada] [Tamil]       |   [Arabic]  [Spanish]
[Telugu]  [Malayalam]   |   [Japanese][Mandarin]

[ Skip ]
```

No filtering logic change needed — `_filterManifest()` already handles
`category === 'language' && subject === user.preferredLanguage`.

---

## Acceptance Criteria

- [ ] 6 international language JSON files (20 questions each = 120 questions)
- [ ] manifest.json updated with 6 new entries
- [ ] Language selector in profile setup shows International tab
- [ ] All 6 languages work through existing quiz + result flow unchanged
- [ ] App UI shown in English (questions are in English about the target language)

## Dependencies
- P3-T013 (regional language learning — done first, same architecture)
- P6-T004 (i18n — when UI is translated, language selector labels translate too)
- No app.js logic changes needed — architecture already supports it

## Phase 2
- Level 2 (harder grammar, longer passages)
- Portuguese, Italian, Korean, Russian
- "Conversational" track vs "Grammar" track (different goalId, same language)
