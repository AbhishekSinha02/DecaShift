# Session: 2026-05-28 18:30 IST — Flash Drill Implementation (P2-T031)

**Scheduled:** 28 May 2026, 6:30 PM IST
**Type:** Code
**Est. Duration:** 2–2.5 hours
**Trigger:** "start the session"
**Depends on:** 1:30 PM session (question files generated and pushed)

---

## Objective

Implement P2-T031 Flash Drill Mode end-to-end: home screen entry card, full drill screen, instant tap feedback, personal best tracking, share card. Commit and push when done.

---

## Context

- The implementation plan was approved in the morning session (28 May 2026)
- Task file: `tasks/P2-T031-flash-drill-mode-tables-squares-cubes-formulas.md`
- App files: `app/ui/app.js`, `app/ui/index.html`, `app/ui/styles.css`
- Flash drill content (GK bank + formula files) was generated in the 1:30 PM session
- The drill engine uses **inline JS data** for Tables/Squares/Cubes (no fetch, works offline)
- GK bank is fetched once and cached in sessionStorage
- Formula drill has a 4-second flash card before the MCQ

---

## Pre-flight Check (Do First)

```bash
git log --oneline -5
git status
```

Confirm the 1:30 PM question files are committed. If not committed yet, do:
```bash
git add questions/ && git commit -m "content: Grade 9-12 questions from 1:30 PM session" && git push origin main
```

---

## Execute In This Order

### Step 1 — Read the approved plan
Read: `tasks/P2-T031-flash-drill-mode-tables-squares-cubes-formulas.md`
Confirm: 4 steps (HTML, CSS, JS, content). Execute in this order.

---

### Step 2 — HTML (`app/ui/index.html`)

**A) Flash Drill entry card on home screen**
Insert between `<div id="subject-tabs"...>` and `<div id="goals-list"...>`:

```html
<!-- Flash Drills Section -->
<div class="flash-drill-section" id="flash-drill-section">
  <div class="flash-drill-header">
    <span class="flash-drill-title">⚡ Flash Drills</span>
    <span class="flash-drill-sub">Quick 2-min memory sessions</span>
  </div>
  <div class="flash-drill-pills">
    <button class="drill-pill" onclick="_startDrill('tables')">×  Tables</button>
    <button class="drill-pill" onclick="_startDrill('squares')">²  Squares</button>
    <button class="drill-pill" onclick="_startDrill('cubes')">³  Cubes</button>
    <button class="drill-pill" onclick="_startDrill('formulas')">∫  Formulas</button>
    <button class="drill-pill drill-pill-gk" onclick="_startDrill('gk')">🌍 Today's GK</button>
  </div>
</div>
```

**B) New drill screen** (after `</section>` of screen-result):

```html
<!-- ══════════════════════════════════════════════════════════
     SCREEN: Flash Drill
     ══════════════════════════════════════════════════════════ -->
<section id="screen-drill" class="screen">
  <div class="drill-wrap">

    <div class="drill-header">
      <div class="drill-header-left">
        <button class="btn btn-ghost btn-sm" onclick="_exitDrill()">← Back</button>
        <span class="drill-name" id="drill-name">Tables Drill</span>
      </div>
      <div class="drill-timer" id="drill-timer">0:00</div>
    </div>

    <div class="drill-progress-row">
      <div class="drill-progress-track">
        <div class="drill-progress-fill" id="drill-progress-fill"></div>
      </div>
      <span class="drill-progress-text" id="drill-progress-text">1 / 20</span>
    </div>

    <!-- Formula flash card (shown before formula MCQ) -->
    <div class="drill-formula-flash hidden" id="drill-formula-flash">
      <p class="drill-formula-label">Remember this formula:</p>
      <div class="drill-formula-card" id="drill-formula-text"></div>
      <div class="drill-formula-countdown" id="drill-formula-countdown">4</div>
    </div>

    <div class="drill-question-wrap" id="drill-question-wrap">
      <p class="drill-question" id="drill-question">Loading…</p>
      <div class="drill-answer-grid" id="drill-answer-grid"></div>
    </div>

    <div class="drill-pb" id="drill-pb"></div>

    <!-- Result panel (shown after last question) -->
    <div class="drill-result hidden" id="drill-result">
      <div class="drill-result-title" id="drill-result-title">⚡ Drill Complete!</div>
      <div class="drill-result-score" id="drill-result-score"></div>
      <div class="drill-result-pb" id="drill-result-pb"></div>
      <div class="drill-result-stats" id="drill-result-stats"></div>
      <div class="drill-result-missed" id="drill-result-missed"></div>
      <div class="drill-result-actions">
        <button class="btn btn-primary" onclick="_retryDrill()">Try Again</button>
        <button class="btn btn-ghost" onclick="_shareDrillResult()">Share Result</button>
        <button class="btn btn-ghost" onclick="_exitDrill()">Back to Home</button>
      </div>
    </div>

  </div>
</section>
```

---

### Step 3 — CSS (`app/ui/styles.css`)

Add after the existing theme selector CSS block. Key styles:

```css
/* ══ FLASH DRILL SECTION (home screen) ══════════════════ */
.flash-drill-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 16px;
  margin-bottom: 16px;
}
.flash-drill-header { display: flex; align-items: baseline; gap: 10px; margin-bottom: 12px; }
.flash-drill-title  { font-size: 15px; font-weight: 700; color: var(--accent); }
.flash-drill-sub    { font-size: 11px; color: var(--muted); }
.flash-drill-pills  { display: flex; flex-wrap: wrap; gap: 8px; }

.drill-pill {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1.5px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.drill-pill:hover     { border-color: var(--accent); color: var(--accent); }
.drill-pill-gk        { border-color: var(--success); color: var(--success); }
.drill-pill-gk:hover  { background: var(--success); color: #fff; }

/* ══ DRILL SCREEN ═══════════════════════════════════════ */
.drill-wrap   { max-width: 540px; margin: 0 auto; padding: 16px 16px 32px; min-height: 100vh; display: flex; flex-direction: column; gap: 16px; }
.drill-header { display: flex; align-items: center; justify-content: space-between; }
.drill-header-left { display: flex; align-items: center; gap: 12px; }
.drill-name   { font-size: 16px; font-weight: 700; color: var(--text); }
.drill-timer  { font-family: var(--font-mono); font-size: 20px; font-weight: 700; color: var(--accent); }

.drill-progress-row  { display: flex; align-items: center; gap: 10px; }
.drill-progress-track { flex: 1; height: 6px; background: var(--surface-2); border-radius: 3px; }
.drill-progress-fill  { height: 6px; background: var(--accent); border-radius: 3px; transition: width 0.2s; }
.drill-progress-text  { font-size: 12px; color: var(--muted); white-space: nowrap; font-family: var(--font-mono); }

.drill-question-wrap { flex: 1; display: flex; flex-direction: column; gap: 20px; justify-content: center; }
.drill-question { font-size: 26px; font-weight: 700; color: var(--text); text-align: center; line-height: 1.3; }

.drill-answer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.drill-answer-tile {
  min-height: 56px;
  padding: 12px 8px;
  border-radius: var(--radius);
  border: 2px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.1s, background 0.1s;
  user-select: none;
}
.drill-answer-tile:hover   { border-color: var(--accent); }
.drill-answer-tile.correct { background: var(--success); border-color: var(--success); color: #fff; }
.drill-answer-tile.wrong   { background: var(--error);   border-color: var(--error);   color: #fff; }
.drill-answer-tile.reveal  { background: var(--success); border-color: var(--success); color: #fff; opacity: 0.6; }

.drill-pb { font-size: 12px; color: var(--muted); text-align: center; min-height: 18px; }

/* ══ FORMULA FLASH CARD ══════════════════════════════════ */
.drill-formula-flash  { text-align: center; padding: 24px 16px; }
.drill-formula-label  { font-size: 12px; color: var(--muted); margin-bottom: 12px; }
.drill-formula-card   { font-size: 22px; font-weight: 800; color: var(--accent); font-family: var(--font-mono); padding: 20px; background: var(--surface); border-radius: var(--radius); border: 2px solid var(--accent); margin-bottom: 16px; }
.drill-formula-countdown { font-size: 32px; font-weight: 800; color: var(--muted); font-family: var(--font-mono); }

/* ══ DRILL RESULT ════════════════════════════════════════ */
.drill-result         { text-align: center; padding: 16px 0; display: flex; flex-direction: column; gap: 16px; }
.drill-result-title   { font-size: 22px; font-weight: 800; color: var(--text); }
.drill-result-score   { font-size: 48px; font-weight: 800; color: var(--accent); font-family: var(--font-mono); }
.drill-result-pb      { font-size: 16px; font-weight: 700; color: var(--success); min-height: 24px; }
.drill-result-stats   { font-size: 13px; color: var(--muted); line-height: 1.8; }
.drill-result-missed  { font-size: 13px; color: var(--error); line-height: 1.8; }
.drill-result-actions { display: flex; flex-direction: column; gap: 10px; }
```

---

### Step 4 — JS (`app/ui/app.js`)

Add all drill logic after the `_toggleAvatar()` function. Full implementation:

**4A — Data Banks (inline, no fetch):**
```js
// ── Flash Drill Data Banks ────────────────────────────────────────────────────

function _buildTablesBank() {
  const qs = [];
  for (let a = 2; a <= 12; a++) {
    for (let b = 2; b <= 12; b++) {
      const answer = a * b;
      const wrongs = new Set();
      while (wrongs.size < 3) {
        const delta = (Math.floor(Math.random() * 4) + 1) * (Math.random() < 0.5 ? 1 : -1) * a;
        const w = answer + delta;
        if (w > 0 && w !== answer) wrongs.add(w);
      }
      const opts = _shuffle([answer, ...[...wrongs]]);
      qs.push({ q: `${a} × ${b} = ?`, options: opts.map(String), correctIndex: opts.indexOf(answer) });
    }
  }
  return qs;
}

function _buildSquaresBank() {
  return Array.from({ length: 25 }, (_, i) => {
    const n = i + 1, answer = n * n;
    const wrongs = new Set();
    while (wrongs.size < 3) {
      const w = answer + (Math.floor(Math.random() * 5) + 1) * (Math.random() < 0.5 ? 2 : -2) * n;
      if (w > 0 && w !== answer) wrongs.add(w);
    }
    const opts = _shuffle([answer, ...[...wrongs]]);
    return { q: `${n}² = ?`, options: opts.map(String), correctIndex: opts.indexOf(answer) };
  });
}

function _buildCubesBank() {
  return Array.from({ length: 15 }, (_, i) => {
    const n = i + 1, answer = n * n * n;
    const wrongs = new Set();
    while (wrongs.size < 3) {
      const w = answer + (Math.floor(Math.random() * 3) + 1) * (Math.random() < 0.5 ? n * n : -(n * n));
      if (w > 0 && w !== answer) wrongs.add(w);
    }
    const opts = _shuffle([answer, ...[...wrongs]]);
    return { q: `${n}³ = ?`, options: opts.map(String), correctIndex: opts.indexOf(answer) };
  });
}

function _shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
```

**4B — Drill State + Core Engine:**
```js
// ── Flash Drill Engine ────────────────────────────────────────────────────────

const drillState = {
  type: null, questions: [], currentIndex: 0,
  startTime: null, responses: [], timerInterval: null,
  formulaTimeout: null
};

const DRILL_META = {
  tables:   { name: 'Tables Drill',   count: 20, label: '× Tables' },
  squares:  { name: 'Squares Drill',  count: 15, label: '² Squares' },
  cubes:    { name: 'Cubes Drill',    count: 10, label: '³ Cubes' },
  formulas: { name: 'Formula Drill',  count: 10, label: '∫ Formulas' },
  gk:       { name: "Today's GK",     count: 5,  label: '🌍 GK' },
};

function _getDrillRecord(type) {
  const all = JSON.parse(localStorage.getItem('ds_drill_records') || '{}');
  return all[type] || { bestTime: null, bestAccuracy: null, sessions: 0 };
}

function _saveDrillRecord(type, secs, accuracy) {
  const all = JSON.parse(localStorage.getItem('ds_drill_records') || '{}');
  const rec = all[type] || { bestTime: null, bestAccuracy: null, sessions: 0 };
  rec.sessions += 1;
  if (rec.bestTime === null || secs < rec.bestTime) rec.bestTime = secs;
  if (rec.bestAccuracy === null || accuracy > rec.bestAccuracy) rec.bestAccuracy = accuracy;
  all[type] = rec;
  localStorage.setItem('ds_drill_records', JSON.stringify(all));
  return rec;
}

async function _startDrill(type) {
  drillState.type = type;
  drillState.currentIndex = 0;
  drillState.responses = [];
  drillState.startTime = Date.now();

  const meta = DRILL_META[type];
  document.getElementById('drill-name').textContent = meta.name;

  let pool;
  if (type === 'tables')   pool = _shuffle(_buildTablesBank()).slice(0, meta.count);
  if (type === 'squares')  pool = _shuffle(_buildSquaresBank()).slice(0, meta.count);
  if (type === 'cubes')    pool = _shuffle(_buildCubesBank()).slice(0, meta.count);
  if (type === 'formulas') pool = await _loadFormulaDrill();
  if (type === 'gk')       pool = await _loadGKDrill();

  drillState.questions = pool || [];
  if (!drillState.questions.length) {
    alert('Content not available yet. Coming soon!'); return;
  }

  _showScreen('drill');
  _startDrillTimer();
  _renderDrillQuestion();
}

function _startDrillTimer() {
  clearInterval(drillState.timerInterval);
  drillState.timerInterval = setInterval(() => {
    const secs = Math.floor((Date.now() - drillState.startTime) / 1000);
    const m = Math.floor(secs / 60), s = secs % 60;
    const el = document.getElementById('drill-timer');
    if (el) el.textContent = `${m}:${String(s).padStart(2, '0')}`;
  }, 500);
}

function _renderDrillQuestion() {
  const q     = drillState.questions[drillState.currentIndex];
  const total = drillState.questions.length;
  const idx   = drillState.currentIndex;

  document.getElementById('drill-progress-text').textContent = `${idx + 1} / ${total}`;
  document.getElementById('drill-progress-fill').style.width = `${(idx / total) * 100}%`;

  // Show personal best if exists
  const rec  = _getDrillRecord(drillState.type);
  const pbEl = document.getElementById('drill-pb');
  if (pbEl) pbEl.textContent = rec.bestTime
    ? `Personal Best: ${Math.floor(rec.bestTime/60)}:${String(rec.bestTime%60).padStart(2,'0')} 🏆`
    : '';

  if (drillState.type === 'formulas' && q.formula) {
    _showFormulaFlash(q);
    return;
  }

  _renderDrillMCQ(q);
}

function _showFormulaFlash(q) {
  const flashEl = document.getElementById('drill-formula-flash');
  const qWrap   = document.getElementById('drill-question-wrap');
  const textEl  = document.getElementById('drill-formula-text');
  const cdEl    = document.getElementById('drill-formula-countdown');

  flashEl.classList.remove('hidden');
  qWrap.classList.add('hidden');
  textEl.textContent = q.formula;

  let secs = 4;
  cdEl.textContent = secs;
  const cd = setInterval(() => {
    secs--;
    cdEl.textContent = secs;
    if (secs <= 0) {
      clearInterval(cd);
      flashEl.classList.add('hidden');
      qWrap.classList.remove('hidden');
      _renderDrillMCQ(q);
    }
  }, 1000);
}

function _renderDrillMCQ(q) {
  document.getElementById('drill-question').textContent = q.q || q.question;
  document.getElementById('drill-answer-grid').innerHTML = q.options.map((opt, i) => `
    <div class="drill-answer-tile" onclick="_selectDrillAnswer(${i})">${_esc(opt)}</div>`).join('');
}

function _selectDrillAnswer(selectedIdx) {
  const q       = drillState.questions[drillState.currentIndex];
  const correct = q.correctIndex;
  const isRight = selectedIdx === correct;
  const tiles   = document.querySelectorAll('.drill-answer-tile');

  // Disable all tiles immediately
  tiles.forEach(t => t.onclick = null);

  // Flash feedback
  if (tiles[selectedIdx]) tiles[selectedIdx].classList.add(isRight ? 'correct' : 'wrong');
  if (!isRight && tiles[correct]) tiles[correct].classList.add('reveal');

  drillState.responses.push({ q: q.q || q.question, correct: isRight, answer: q.options[correct] });

  setTimeout(() => {
    drillState.currentIndex++;
    if (drillState.currentIndex >= drillState.questions.length) {
      _showDrillResult();
    } else {
      _renderDrillQuestion();
    }
  }, isRight ? 350 : 700);
}

function _showDrillResult() {
  clearInterval(drillState.timerInterval);
  const secs     = Math.floor((Date.now() - drillState.startTime) / 1000);
  const total    = drillState.responses.length;
  const correct  = drillState.responses.filter(r => r.correct).length;
  const accuracy = correct / total;
  const m = Math.floor(secs / 60), s = secs % 60;
  const timeStr  = `${m}:${String(s).padStart(2, '0')}`;

  const prevRec  = _getDrillRecord(drillState.type);
  const newRec   = _saveDrillRecord(drillState.type, secs, accuracy);
  const isNewPB  = prevRec.bestTime === null || secs < prevRec.bestTime;

  // Streak
  Storage.updateStreak();

  // Show result panel
  document.getElementById('drill-question-wrap').classList.add('hidden');
  document.getElementById('drill-pb').classList.add('hidden');
  const resultEl = document.getElementById('drill-result');
  resultEl.classList.remove('hidden');

  document.getElementById('drill-result-score').textContent = `${correct} / ${total}`;
  document.getElementById('drill-result-pb').textContent    = isNewPB ? `🏆 New Personal Best! ${timeStr}` : '';
  document.getElementById('drill-result-stats').innerHTML   =
    `Time: ${timeStr} &nbsp;·&nbsp; Accuracy: ${Math.round(accuracy * 100)}% &nbsp;·&nbsp; Avg: ${(secs/total).toFixed(1)}s/Q`;

  const missed = drillState.responses.filter(r => !r.correct);
  document.getElementById('drill-result-missed').innerHTML = missed.length
    ? `Missed: ${missed.slice(0, 5).map(r => `<strong>${r.q}</strong> → ${r.answer}`).join(' · ')}`
    : '🎉 Perfect score!';

  drillState._lastResult = { type: drillState.type, correct, total, secs, timeStr, isNewPB };
}

function _retryDrill() {
  document.getElementById('drill-result').classList.add('hidden');
  document.getElementById('drill-question-wrap').classList.remove('hidden');
  document.getElementById('drill-pb').classList.remove('hidden');
  _startDrill(drillState.type);
}

function _exitDrill() {
  clearInterval(drillState.timerInterval);
  _showScreen('home');
  _renderHome();
}

function _shareDrillResult() {
  const r = drillState._lastResult;
  if (!r) return;
  const meta = DRILL_META[r.type];
  const pb   = r.isNewPB ? ' 🏆 Personal Best!' : '';
  const text = `⚡ ${meta.name} · Donnibo\nScore: ${r.correct}/${r.total} in ${r.timeStr}${pb}\nTry it: donnibo.in`;
  navigator.clipboard.writeText(text).then(() => alert('Copied! Share in WhatsApp 🚀'));
}

async function _loadGKBank() {
  const cached = sessionStorage.getItem('ds_gk_bank');
  if (cached) return JSON.parse(cached);
  const urls = [_rawUrl('app/ui/questions/flash/gk-bank.json'), 'questions/flash/gk-bank.json'];
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (r.ok) { const d = await r.json(); sessionStorage.setItem('ds_gk_bank', JSON.stringify(d)); return d; }
    } catch (_) {}
  }
  return null;
}

async function _loadGKDrill() {
  const bank = await _loadGKBank();
  if (!bank) return [];
  const today     = new Date().toISOString().slice(0, 10);
  const weekIndex = (Math.floor(Date.now() / (7 * 86400000)) % 6) + 1;
  const topic     = bank.topics[`week${weekIndex}`];
  if (!topic) return [];
  const seed   = today.split('-').reduce((a, b) => a + parseInt(b), 0);
  const pool   = [...topic.questions];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = (seed + i) % (i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 5).map(q => ({
    q: q.question,
    options: q.options,
    correctIndex: q.correctIndex
  }));
}

async function _loadFormulaDrill() {
  const grade = state.user?.grade ? parseInt(state.user.grade) : 7;
  const g     = grade >= 9 ? 8 : grade >= 7 ? 7 : grade >= 6 ? 6 : 5;
  const urls  = [
    _rawUrl(`app/ui/questions/flash/formulas-grade${g}.json`),
    `questions/flash/formulas-grade${g}.json`
  ];
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (r.ok) {
        const d = await r.json();
        return _shuffle(d.formulas || []).slice(0, 10).map(f => ({
          q: f.question, formula: f.formula, options: f.options, correctIndex: f.correctIndex
        }));
      }
    } catch (_) {}
  }
  return [];
}
```

---

### Step 5 — Verify and Test

Open `app/ui/index.html` in a browser. Check:
- Flash Drill section visible on home screen (after logging in)
- Each pill opens the drill screen
- Timer runs, answers flash green/red, auto-advances
- Result screen shows score + share button
- Back button returns to home

---

### Step 6 — Commit and Push

```bash
git add app/ui/app.js app/ui/index.html app/ui/styles.css
git commit -m "feat(P2-T031): flash drill mode -- tables, squares, cubes, formulas, GK

- Flash Drill section on home screen with 5 drill type pills
- Full drill screen: timer, progress bar, large question, 2x2 answer grid
- Tap = instant green/red flash (350ms correct, 700ms wrong), auto-advance
- Tables: 2x-12x all combinations; Squares: 1-25; Cubes: 1-15 (inline JS, offline)
- Formula drill: 4-second flash card before MCQ question
- GK drill: date-seeded 5 questions from weekly topic bank
- Personal best tracked per drill type in localStorage (ds_drill_records)
- Share card copies plain text to clipboard for WhatsApp
- Streak updated on every drill completion"
git push origin main
```

### Step 7 — Update session INDEX

Mark this session ✅ Done in `sessions/INDEX.md`.

---

## Success Criteria

- [ ] Flash Drill section visible on home screen for logged-in users
- [ ] All 5 drill types open correctly (Tables, Squares, Cubes, Formulas, GK)
- [ ] Timer runs continuously, never pauses
- [ ] Tap answer → immediate feedback → auto-next (no submit button)
- [ ] Personal best shown during and after drill
- [ ] Share button copies correct text to clipboard
- [ ] Drill completion updates streak
- [ ] Works at 375px mobile width
- [ ] Committed and pushed

---

## Hand-off to Next Session

```
6:30 PM session complete. Flash Drill Mode is live.
Next session (plan when ready):
- P2-T032 Daily GK Capsule (reflective mode + GK tab)
- OR P2-T033 PWA Install Prompt
- OR begin P2-T036 Curriculum Calendar Config
```
