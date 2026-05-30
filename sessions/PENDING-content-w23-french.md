# SESSION (Content) — W23 French, Grades 2–8

**Type:** Content generation (no code) · **Model:** Sonnet 4.6 is fine · **Budget:** fits one ~1M session.
**Part of:** [`tasks/marketing/CONTENT-GEN-3MONTH-PLAN.md`](../tasks/marketing/CONTENT-GEN-3MONTH-PLAN.md) → session **C3**.
**Approval:** pre-approved (see `feedback_approval_workflow`). Execute top to bottom. No questions needed.

---

## Goal
Complete **Week 23 (Jun 01–07, 2026) French** for grades 2–8 so the live "This Week" shelf has all
4 subjects (Math + Science + Hindi already done; this session = **French only**).

**Output:** 35 files (7 grades × 5 days) × 15 questions = **525 questions** + 7 manifest edits.

---

## Step 1 — Read the W22 French arc (so W23 progresses, never random)
```
grep -h '"description"' app/ui/questions/school/grade-{2,3,4,5,6,7,8}/french-w22-mon.json app/ui/questions/school/grade-{2,3,4,5,6,7,8}/french-w22-fri.json
```
Choose each grade's W23 topic as the natural step AFTER its W22 topic. **W22 ended on:**
G2 La famille · G3 La Famille (family members) · G4 Verbes en -ER · G5 La Nourriture et les Repas (food) ·
G6 Family and Descriptions · G7 La routine quotidienne · G8 Passé composé (être).
Suggested W23 next steps (verify against W22 first): G2 Les couleurs et les nombres · G3 Les couleurs ·
G4 Verbes en -IR (2nd group) · G5 La maison (the house) / Les vêtements · G6 La routine quotidienne ·
G7 Le futur proche (aller + infinitive) · G8 Passé composé (avoir — the natural step after être).

## Step 2 — Mirror the exact schema
Copy the structure of any `french-w22-mon.json`. Per file:
- `goalId`: `grade-N-french-w23-DAY` · `weekNum`: 23 · `weekDay`: mon/tue/wed/thu/fri
- `weekStart`: "2026-06-01" · `weekEnd`: "2026-06-07" · `status`: "active"
- `title`: `Grade N French — Mon, Jun 01` (Tue Jun 02, Wed Jun 03, Thu Jun 04, Fri Jun 05)
- `description`: `<topic> — Day X of 5: <subtopic>` (Day 5 = "Synthesis")
- `subject`: "french", `category`: "school", `grade`: N, `level`: match W22 (G2–7 = 1, **G8 = 2**)
- 15 questions, ids `gNf-w23-DAY-001`…`015`, each: `question`, `options`(exactly 4),
  `correctIndex`(0–3), `explanation`, `tags`.
- 5-day arc: Day1 intro → Day2/3 build → Day4 application → Day5 synthesis/mixed.
- Questions in English with French target vocab/phrases; gloss French in English as W22 does.

Files to create (35):
```
app/ui/questions/school/grade-{2,3,4,5,6,7,8}/french-w23-{mon,tue,wed,thu,fri}.json
```

## Step 3 — Wire into manifests
In each `app/ui/questions/manifests/manifest-grade-N.json`, add 5 entries (insert ABOVE the
`french-w22-mon.json` line), matching that grade's french `level` (G2–7 = 1, G8 = 2):
```
{ "file": "school/grade-N/french-w23-mon.json", "category": "school", "grade": N, "subject": "french", "level": L, "weekNum": 23, "weekDay": "mon" },
... tue, wed, thu, fri ...
```
(Edit tool needs the file Read first — read each manifest before editing.)

## Step 4 — Validate (python is NOT installed; use node)
```
node -e "const fs=require('fs'),cp=require('child_process');const files=cp.execSync('find app/ui/questions/school -name \"french-w23-*.json\"').toString().trim().split('\n').concat([2,3,4,5,6,7,8].map(g=>'app/ui/questions/manifests/manifest-grade-'+g+'.json'));let bad=0,ids=new Set();files.forEach(f=>{try{const j=JSON.parse(fs.readFileSync(f,'utf8'));if(f.includes('school/')){if(j.questions.length!==15){console.log('Q!=15',f);bad++;}j.questions.forEach(q=>{if(ids.has(q.id)){console.log('DUP',q.id);bad++;}ids.add(q.id);if(q.options.length!==4||q.correctIndex<0||q.correctIndex>3){console.log('bad',f,q.id);bad++;}});}}catch(e){console.log('FAIL',f,e.message);bad++;}});console.log('ids',ids.size,'problems',bad,bad===0?'VALID':'FIX');"
```
Expect: `ids 525 problems 0 VALID`.

## Step 5 — Commit + push (push immediately per `feedback_git_push`)
```
git add app/ui/questions/school/grade-*/french-w23-*.json app/ui/questions/manifests/manifest-grade-*.json
git commit -m "content: add Grade 2-8 French W23 (35 files, 525q) + manifest wiring"
git push origin main
```
(End commit message with the Co-Authored-By line per repo convention.)

## Step 6 — Update tracking
- `CONTENT-GEN-3MONTH-PLAN.md`: mark **C3 ✅** with the commit hash; W23 now complete (all 4 subjects).
  Promote the first W24 session (D-series / next week) to NEXT.
- Memory `project_weekly_content_status`: W23 now math+science+hindi+french done (full week).
- `sessions/INDEX.md`: replace this row with the next content Priority (W24).

**Stable-handoff note:** content-only session; each commit leaves the app working. If budget runs low
mid-way, commit the grades completed so far (a partial set of whole-grade files is valid) and note which
grades remain.
