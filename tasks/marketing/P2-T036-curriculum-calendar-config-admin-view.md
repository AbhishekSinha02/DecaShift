# Feature: Curriculum Calendar Config + Admin Topic View

**Priority:** P2 | **Type:** Content Operations / Admin | **Complexity:** M | **Status:** Pending

> "A separate admin section that decides which topic will go next week throughout the year."
> — User, 2026-05-28
>
> This task builds exactly that. A JSON config that maps every week of the year
> to a specific topic per grade and subject. And a read-only admin view that shows
> the full annual plan at a glance — what's covered, what's missing, what's next.
>
> This is P3-T021 (curriculum progression) + P4-T007 (admin pattern config) merged
> and elevated to P2 because the generation script (P2-T035) needs it to know
> what to generate next.

---

## The Core Idea

Right now, content is generated randomly — whoever is free generates whatever topic
comes to mind. The result is uneven coverage, random difficulty jumps, and no
visible "what comes next" for the user or the developer.

The fix: **a single JSON file that is the source of truth for the entire year.**

```json
{
  "grade9": {
    "mathematics": {
      "w21": "number-systems",
      "w22": "polynomials",
      "w23": "coordinate-geometry",
      "w24": "linear-equations",
      "w25": "triangles",
      ...
      "w52": "statistics"
    },
    "science": {
      "w21": "motion",
      "w22": "force-laws-of-motion",
      ...
    }
  }
}
```

The generation script reads this file and knows exactly what to produce.
The admin view renders this as a calendar so you can see the full year at a glance.

---

## The Config File

File: `config/curriculum-calendar.json`

### Structure

```json
{
  "grade{N}": {
    "{subject}": {
      "w{weekNum}": "{topic-slug}"
    }
  }
}
```

### Coverage Targets

Each grade/subject needs 32 distinct topics mapped (weeks 21–52 = 32 weeks).
Topics cycle if there aren't enough unique ones for a full year.
Difficulty progression: easy topics in early weeks, harder in later weeks.

### Starter Calendar (Grade 9 Math — to be completed for all grades/subjects)

```json
"grade9": {
  "mathematics": {
    "w21": "number-systems",       "w22": "polynomials",
    "w23": "coordinate-geometry",  "w24": "linear-equations",
    "w25": "euclids-geometry",     "w26": "lines-and-angles",
    "w27": "triangles",            "w28": "quadrilaterals",
    "w29": "areas-parallelograms", "w30": "circles",
    "w31": "constructions",        "w32": "herons-formula",
    "w33": "surface-area-volume",  "w34": "statistics",
    "w35": "probability",          "w36": "number-systems-review",
    "w37": "polynomials-review",   "w38": "algebra-combined",
    ...
  }
}
```

---

## The Admin View (Developer-Facing, Not Student-Facing)

A standalone HTML page: `admin/curriculum.html`

**What it shows:**

```
Grade 9 — Mathematics
─────────────────────────────────────────────────────
Week 21  Number Systems          ✅ 15q generated
Week 22  Polynomials             ✅ 15q generated
Week 23  Coordinate Geometry     ⚠️  0q — NOT GENERATED
Week 24  Linear Equations        ⚠️  0q — NOT GENERATED
Week 25  Triangles               —  (future)
...
Week 52  Statistics              —  (future)
─────────────────────────────────────────────────────
Coverage: 2/32 weeks (6%)   Next to generate: w23 — Coordinate Geometry
[Copy generation command]
```

**"Copy generation command"** button copies to clipboard:
```
node scripts/generate-questions.js --grade 9 --subject math --topic coordinate-geometry --count 15 --week w23 --set set1
```

One click → command is ready to paste in terminal. No thinking required.

**Status logic:**
- ✅ Generated: question file exists for this week + subject + grade
- ⚠️ Missing: week is current or past, file doesn't exist → priority action
- — Future: week hasn't arrived yet, no urgency

---

## How the Generation Script + Calendar Work Together

```
1. Open admin/curriculum.html
2. See: "Grade 10 Science w23 missing — Force"
3. Click [Copy generation command]
4. Paste in terminal → runs generate-questions.js
5. Refresh admin page → status changes to ✅
```

The entire content operation workflow is now:
- 2-minute setup (open admin page)
- 30-second per topic (click, paste, run)
- Scalable to any grade, any subject, any week

---

## Connection to P2-T035 (Generation Script)

The generation script reads `config/curriculum-calendar.json` to auto-determine
the topic if `--topic` is omitted:

```bash
# Topic determined automatically from calendar config:
node generate-questions.js --grade 9 --subject math --week w23
# → looks up: curriculum-calendar.json → grade9.mathematics.w23 → "coordinate-geometry"
# → generates questions for that topic automatically
```

---

## Acceptance Criteria

### Config File
- [ ] `config/curriculum-calendar.json` created
- [ ] Grade 9, 10 fully mapped (all subjects, weeks 21–52)
- [ ] Grade 11, 12 mapped for Math + Science (weeks 21–52)
- [ ] Grade 2–8 mapped for Math + Science (existing content mapped to correct week numbers)
- [ ] Topic slugs match what the generation script expects

### Admin View
- [ ] `admin/curriculum.html` renders correctly in browser (no app login required)
- [ ] Shows all grades as tabs or accordion sections
- [ ] Each week row shows: week number, topic name, question count (✅/⚠️/—)
- [ ] Status is determined by checking if the question file exists
- [ ] "Copy generation command" copies correct CLI command to clipboard
- [ ] "Next to generate" highlighted per grade/subject (oldest missing week)
- [ ] Mobile-friendly (can use on phone while generating on desktop)

### Script Integration
- [ ] Generation script accepts calendar config lookup when `--topic` is omitted
- [ ] Script reads `config/curriculum-calendar.json` automatically

## Files to Touch

- `config/curriculum-calendar.json` — new file (major content work — all grades/subjects)
- `admin/curriculum.html` — new standalone admin page
- `admin/curriculum.css` — styles for admin page (separate from app styles)
- `scripts/generate-questions.js` — extend to read calendar config (from P2-T035)

## Dependencies

- P2-T035 (generation script — admin page and script are tightly coupled)

## Why P2 (Not P3 or P4)

The curriculum calendar is what transforms content generation from "random when I have time"
to "systematic and predictable." Without it, P2-T034 (Grade 9-12 sprint) and P2-T035
(generation script) are one-time fixes. With it, content generation becomes a process
that runs itself — every week, for every grade, with a clear picture of what's missing.

This is the "admin section that decides what goes next week throughout the year."
It was always the right answer. Now it's the right priority.
