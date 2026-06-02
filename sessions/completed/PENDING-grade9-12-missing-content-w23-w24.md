# Content Generation — Grade 9-12 Missing Subjects W23/W24
**Priority:** ★ HIGHEST (blocks grade 9-12 students from having full weekly content)
**Type:** Content generation session
**Effort:** ~2 hours
**Trigger:** Say "start the session" → read INDEX → this is Priority 1

---

## What's Missing

Grade 9-12 use the **weekly set model** (one file per subject per week, no weekDay).
W23 is the current live week (Jun 2–8, 2026). W24 = Jun 9–15.

| Grade | Subject | W23 | W24 |
|-------|---------|-----|-----|
| 9     | English | ❌ MISSING | ❌ MISSING |
| 9     | Social Science | ❌ MISSING | ❌ MISSING |
| 10    | English | ❌ MISSING | ❌ MISSING |
| 10    | Social Science | ❌ MISSING | ❌ MISSING |
| 11    | Chemistry | ❌ MISSING | ❌ MISSING |
| 11    | Physics | ❌ MISSING | ❌ MISSING |
| 12    | Chemistry | ❌ MISSING | ❌ MISSING |
| 12    | Physics | ❌ MISSING | ❌ MISSING |

**Total: 16 files needed** (8 subjects × 2 weeks)

Math is fine (W23+W24 exist). Science is fine for grade 9/10.

---

## File Format (EXACT — do not deviate)

Use the NEW schema (grade 9-12 weekly model). Reference: `app/ui/questions/school/grade-9/mathematics/w23-set1.json`

```json
{
  "goalId": "grade9-english",
  "title": "Grade 9 English — [Topic]",
  "description": "[Topic description]",
  "category": "school",
  "grade": 9,
  "subject": "english",
  "level": 1,
  "weekNum": 23,
  "weekDay": null,
  "questions": [
    {
      "id": "q_english_9_[topic]_001",
      "goalId": "grade9-english",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "...",
      "difficulty": "easy|medium|hard",
      "tags": ["topic", "subtopic"]
    }
  ]
}
```

**Key rules:**
- `goalId` pattern: `grade{N}-{subject}` (no week suffix — the app adds it)
- `weekDay: null` always for grade 9-12
- 15 questions per file minimum (aim for 20)
- Mix of easy (40%) / medium (40%) / hard (20%)
- Questions must NOT repeat from W21/W22 of same subject

---

## File Paths (create exactly these)

```
app/ui/questions/school/grade-9/english/w23-set1.json
app/ui/questions/school/grade-9/english/w24-set1.json
app/ui/questions/school/grade-9/social-science/w23-set1.json
app/ui/questions/school/grade-9/social-science/w24-set1.json

app/ui/questions/school/grade-10/english/w23-set1.json
app/ui/questions/school/grade-10/english/w24-set1.json
app/ui/questions/school/grade-10/social-science/w23-set1.json
app/ui/questions/school/grade-10/social-science/w24-set1.json

app/ui/questions/school/grade-11/chemistry/w23-set1.json
app/ui/questions/school/grade-11/chemistry/w24-set1.json
app/ui/questions/school/grade-11/physics/w23-set1.json
app/ui/questions/school/grade-11/physics/w24-set1.json

app/ui/questions/school/grade-12/chemistry/w23-set1.json
app/ui/questions/school/grade-12/chemistry/w24-set1.json
app/ui/questions/school/grade-12/physics/w23-set1.json
app/ui/questions/school/grade-12/physics/w24-set1.json
```

---

## Curriculum Topics (use these, don't invent)

### Grade 9 English (CBSE)
- W23: Beehive Unit 5 — "The Snake and the Mirror" + Grammar: Reported Speech
- W24: Beehive Unit 6 — "My Childhood" + Grammar: Passive Voice basics

### Grade 9 Social Science (CBSE)
- W23: History Ch.3 — Nazism and the Rise of Hitler
- W24: Geography Ch.3 — Drainage (rivers, river systems)

### Grade 10 English (CBSE)
- W23: First Flight Unit 5 — "The Hundred Dresses" + Writing: Formal Letter
- W24: First Flight Unit 6 — "The Making of a Scientist" + Grammar: Clauses

### Grade 10 Social Science (CBSE)
- W23: History Ch.3 — Nationalism in India (Non-Cooperation Movement)
- W24: Geography Ch.3 — Water Resources

### Grade 11 Chemistry (CBSE)
- W23: Ch.5 — States of Matter (gases, kinetic theory, gas laws)
- W24: Ch.6 — Chemical Thermodynamics (enthalpy, entropy basics)

### Grade 11 Physics (CBSE)
- W23: Ch.5 — Laws of Motion (Newton's laws, friction, applications)
- W24: Ch.6 — Work, Energy and Power

### Grade 12 Chemistry (CBSE)
- W23: Ch.4 — Chemical Kinetics (rate of reaction, order, Arrhenius)
- W24: Ch.5 — Surface Chemistry (adsorption, colloids, emulsions)

### Grade 12 Physics (CBSE)
- W23: Ch.4 — Moving Charges and Magnetism (Biot-Savart, Ampere's law)
- W24: Ch.5 — Magnetism and Matter (bar magnet, earth's magnetism)

---

## After Creating Files — Update Manifests

Add entries to each grade's manifest. Example for grade-9:

```json
// In manifest-grade-9.json, add:
{ "file": "school/grade-9/english/w23-set1.json",        "category": "school", "grade": 9, "subject": "english",        "level": 1, "weekNum": 23 },
{ "file": "school/grade-9/english/w24-set1.json",        "category": "school", "grade": 9, "subject": "english",        "level": 1, "weekNum": 24 },
{ "file": "school/grade-9/social-science/w23-set1.json", "category": "school", "grade": 9, "subject": "social-science", "level": 1, "weekNum": 23 },
{ "file": "school/grade-9/social-science/w24-set1.json", "category": "school", "grade": 9, "subject": "social-science", "level": 1, "weekNum": 24 }
```

Same pattern for grades 10, 11, 12.

---

## Commit After Each Grade (not all at once)

```
git add app/ui/questions/school/grade-9/ app/ui/questions/manifests/manifest-grade-9.json
git commit -m "content: grade 9 English + Social-Sci W23/W24 (missing subjects)"
git push origin main
```

Repeat for each grade. Do NOT batch all 4 grades into one commit.

---

## Verification After Each Grade

Open app locally, log in as grade-9 student → confirm new subject tabs/cards appear for W23/W24.
If you cannot test locally, at minimum verify the JSON is valid (paste into jsonlint.com or run `node -e "require('./path/to/file.json')"`)
