# SESSION (Content) — W23 Hindi, Grades 2–8

**Type:** Content generation (no code) · **Model:** Sonnet 4.6 is fine · **Budget:** fits one ~1M session.
**Part of:** [`tasks/marketing/CONTENT-GEN-3MONTH-PLAN.md`](../tasks/marketing/CONTENT-GEN-3MONTH-PLAN.md) → session **C2**.
**Approval:** pre-approved (see `feedback_approval_workflow`). Execute top to bottom. No questions needed.

---

## Goal
Complete **Week 23 (Jun 01–07, 2026) Hindi** for grades 2–8 so the live "This Week" shelf has Hindi
alongside Math + Science (already done) + regional. This session = **Hindi only**.

**Output:** 35 files (7 grades × 5 days) × 15 questions = **525 questions** + 7 manifest edits.

---

## Step 1 — Read the W22 Hindi arc (so W23 progresses, never random)
```
grep -h '"description"' app/ui/questions/school/grade-{2,3,4,5,6,7,8}/hindi-w22-mon.json app/ui/questions/school/grade-{2,3,4,5,6,7,8}/hindi-w22-fri.json
```
Choose each grade's W23 topic as the natural curriculum step AFTER its W22 topic. **W22 ended on:**
G2 रंग और आकार · G3 स्वर/व्यंजन → सरल वाक्य व क्रिया · G4 विशेषण · G5 संज्ञा/सर्वनाम → मुहावरे ·
G6 क्रिया → क्रिया व काल · G7 मुहावरे और लोकोक्तियाँ · G8 समास.
Suggested W23 next steps (verify against W22 first): G2 गिनती व तुकांत शब्द · G3 वचन (singular/plural) ·
G4 क्रिया (verbs) · G5 विशेषण (adjectives) · G6 संज्ञा व लिंग (nouns & gender) · G7 वाक्य-शुद्धि / पर्यायवाची व विलोम ·
G8 संधि (sandhi — the natural grammar step after समास).

## Step 2 — Mirror the exact schema
Copy the structure of any `hindi-w22-mon.json`. Per file:
- `goalId`: `grade-N-hindi-w23-DAY` · `weekNum`: 23 · `weekDay`: mon/tue/wed/thu/fri
- `weekStart`: "2026-06-01" · `weekEnd`: "2026-06-07" · `status`: "active"
- `title`: `Grade N Hindi — Mon, Jun 01` (Tue Jun 02, Wed Jun 03, Thu Jun 04, Fri Jun 05)
- `description`: `<टॉपिक> — Day X of 5: <subtopic>` (Day 5 = "समग्र / संश्लेषण")
- `subject`: "hindi", `category`: "school", `grade`: N, `level`: match W22 (G2–7 = 1, **G8 = 2**)
- 15 questions, ids `gNh-w23-DAY-001`…`015`, each: `question`, `options`(exactly 4),
  `correctIndex`(0–3), `explanation`, `tags`.
- 5-day arc: Day1 intro → Day2/3 build → Day4 application → Day5 synthesis/mixed.
- Keep questions in Hindi (Devanagari), age-appropriate; gloss key terms in English where helpful (as W22 does).

Files to create (35):
```
app/ui/questions/school/grade-{2,3,4,5,6,7,8}/hindi-w23-{mon,tue,wed,thu,fri}.json
```

## Step 3 — Wire into manifests
In each `app/ui/questions/manifests/manifest-grade-N.json`, add 5 entries (insert ABOVE the
`hindi-w22-mon.json` line), matching that grade's hindi `level` (G2–7 = 1, G8 = 2):
```
{ "file": "school/grade-N/hindi-w23-mon.json", "category": "school", "grade": N, "subject": "hindi", "level": L, "weekNum": 23, "weekDay": "mon" },
... tue, wed, thu, fri ...
```
(Edit tool needs the file Read first — read each manifest before editing.)

## Step 4 — Validate (python is NOT installed; use node)
```
node -e "const fs=require('fs'),cp=require('child_process');const files=cp.execSync('find app/ui/questions/school -name \"hindi-w23-*.json\"').toString().trim().split('\n').concat([2,3,4,5,6,7,8].map(g=>'app/ui/questions/manifests/manifest-grade-'+g+'.json'));let bad=0,ids=new Set();files.forEach(f=>{try{const j=JSON.parse(fs.readFileSync(f,'utf8'));if(f.includes('school/')){if(j.questions.length!==15){console.log('Q!=15',f);bad++;}j.questions.forEach(q=>{if(ids.has(q.id)){console.log('DUP',q.id);bad++;}ids.add(q.id);if(q.options.length!==4||q.correctIndex<0||q.correctIndex>3){console.log('bad',f,q.id);bad++;}});}}catch(e){console.log('FAIL',f,e.message);bad++;}});console.log('ids',ids.size,'problems',bad,bad===0?'VALID':'FIX');"
```
Expect: `ids 525 problems 0 VALID`.

## Step 5 — Commit + push (push immediately per `feedback_git_push`)
```
git add app/ui/questions/school/grade-*/hindi-w23-*.json app/ui/questions/manifests/manifest-grade-*.json
git commit -m "content: add Grade 2-8 Hindi W23 (35 files, 525q) + manifest wiring"
git push origin main
```
(End commit message with the Co-Authored-By line per repo convention.)

## Step 6 — Update tracking
- `CONTENT-GEN-3MONTH-PLAN.md`: mark **C2 ✅** with the commit hash; promote **C3 (W23 French)** to NEXT.
- Memory `project_weekly_content_status`: W23 now math+science+hindi done; french pending.
- `sessions/INDEX.md`: replace this row with W23 French as the next content Priority.

**Stable-handoff note:** content-only session; each commit leaves the app working. If budget runs low
mid-way, commit the grades completed so far (a partial set of whole-grade files is valid) and note which
grades remain.
