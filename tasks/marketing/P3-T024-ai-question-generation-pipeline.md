# Feature: AI Question Generation Pipeline

**Priority:** P3 | **Type:** Content / Tooling | **Complexity:** M | **Status:** Pending

## Goal
Build a repeatable, quality-controlled workflow for generating new questions using AI,
so a non-developer (teacher, content manager) can add 20 curriculum-aligned questions
to any grade/subject in under 30 minutes, without writing JSON by hand.

## Problem
Currently: questions are generated manually or by a developer prompting Claude ad-hoc.
Result: inconsistent format, varying quality, slow velocity, no review step, and the
content manager (who knows the curriculum) is locked out because they can't edit JSON.

## Pipeline Design

```
Topic brief
  → AI prompt template (grade/subject/difficulty/count)
    → Raw AI output (JSON)
      → Format validator (checks schema, required fields)
        → Quality checker (rubric from P3-T023)
          → Human review (flag issues inline)
            → Approve → commit to questions/ folder
            → Reject → loop back with note
```

### Step 1 — Topic Brief (Input)
A simple form or markdown template:
```
Subject: Math
Grade: 5
Topic: Fractions — addition with unlike denominators
Difficulty: medium
Count: 10
Week target: W23-2026
```

### Step 2 — AI Prompt Template
A reusable prompt template that enforces:
- Exact JSON schema (matches `questions.json` spec)
- Grade-appropriate language
- One unambiguous correct answer
- Plausible distractors
- Explanation that teaches (not just reveals answer)

### Step 3 — Format Validator (script)
`tools/validate-questions.js` (Node) or a browser-based tool at `app/ui/admin.html`:
- Checks all required fields present
- Validates correctIndex is 0–3
- Checks options array length === 4
- Reports missing explanation
- Detects duplicate question IDs

### Step 4 — Quality Checker
Semi-automated pass using rubric from P3-T023:
- Readability score vs. grade level
- Distractor plausibility check (flag if distractors are obvious)
- Flag duplicate stems within the same file

### Step 5 — Review UI (Admin Panel)
In the admin portal (P4-T006), a "Question Review" view:
- Shows AI-generated questions one by one
- Reviewer can Approve / Edit inline / Reject with note
- Approved questions auto-append to the correct week file

### Step 6 — Commit
- Approved questions are saved to the correct `questions/` folder path
- PR or direct commit depending on who has repo access (teacher: PR, admin: direct)

## Reuse Strategy
- Questions that score <50% correct rate across users are flagged for recycle
- Recycled questions can be regenerated with harder distractors or different context
- "Question pool" concept: same concept, multiple phrasings in rotation

## Acceptance Criteria
- [ ] Prompt template documented (can be pasted into Claude / GPT and get valid JSON)
- [ ] `tools/validate-questions.js` validates schema and reports errors
- [ ] Review UI in admin panel shows questions with Approve/Edit/Reject actions
- [ ] One full cycle (brief → generate → validate → review → commit) documented end-to-end
- [ ] Time-to-add-20-questions < 30 minutes for a non-developer

## Files to Touch
- New: `tools/validate-questions.js`
- New: `tools/prompt-template.md` (the AI prompt to copy-paste)
- `app/ui/admin.html` / `admin.js` — add Question Review panel

## Dependencies
- P3-T023 (content growth strategy — defines the quality rubric used here)
- P2-T020 (content operations / admin panel — admin review UI lives there)
- P4-T006 (admin portal — Question Review panel is part of the admin app)
