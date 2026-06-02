// app-drill.js — Flash Drill engine, data banks, GK/formula loaders

// ── Shared shuffle (used by drill banks) ──────────────────────────────────────

function _shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Data Banks ────────────────────────────────────────────────────────────────

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

// ── Drill State + Meta ────────────────────────────────────────────────────────

const drillState = {
  type: null, questions: [], currentIndex: 0,
  startTime: null, responses: [], timerInterval: null,
  _lastResult: null
};

const DRILL_META = {
  tables:   { name: 'Tables Drill',   count: 20, label: '× Tables' },
  squares:  { name: 'Squares Drill',  count: 15, label: '² Squares' },
  cubes:    { name: 'Cubes Drill',    count: 10, label: '³ Cubes' },
  formulas: { name: 'Formula Drill',  count: 10, label: '∫ Formulas' },
  gk:       { name: "Today's GK",     count: 5,  label: '🌍 GK' },
};

// ── Personal Best ─────────────────────────────────────────────────────────────

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

// ── Drill Entry ───────────────────────────────────────────────────────────────

async function _startDrill(type) {
  drillState.type         = type;
  drillState.currentIndex = 0;
  drillState.responses    = [];
  drillState.startTime    = Date.now();

  // Load screen FIRST — DOM elements don't exist until the screen HTML is injected
  await _showScreen('drill');

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

  document.getElementById('drill-result').classList.add('hidden');
  document.getElementById('drill-question-wrap').classList.remove('hidden');
  document.getElementById('drill-pb').classList.remove('hidden');
  document.getElementById('drill-progress-fill').style.width = '0%';
  document.getElementById('drill-timer').textContent = '0:00';

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

// ── Question Render ───────────────────────────────────────────────────────────

function _renderDrillQuestion() {
  const q     = drillState.questions[drillState.currentIndex];
  const total = drillState.questions.length;
  const idx   = drillState.currentIndex;

  document.getElementById('drill-progress-text').textContent = `${idx + 1} / ${total}`;
  document.getElementById('drill-progress-fill').style.width = `${(idx / total) * 100}%`;

  const rec  = _getDrillRecord(drillState.type);
  const pbEl = document.getElementById('drill-pb');
  if (pbEl) pbEl.textContent = rec.bestTime
    ? `PB: ${Math.floor(rec.bestTime / 60)}:${String(rec.bestTime % 60).padStart(2, '0')} 🎯`
    : 'First attempt — set your benchmark!';

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
  document.getElementById('drill-answer-grid').innerHTML = q.options.map((opt, i) =>
    `<div class="drill-answer-tile" onclick="_selectDrillAnswer(${i})">${_esc(String(opt))}</div>`
  ).join('');
}

// ── Answer Selection ──────────────────────────────────────────────────────────

function _selectDrillAnswer(selectedIdx) {
  const q       = drillState.questions[drillState.currentIndex];
  const correct = q.correctIndex;
  const isRight = selectedIdx === correct;
  const tiles   = document.querySelectorAll('.drill-answer-tile');

  tiles.forEach(t => t.onclick = null);

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

// ── Result ────────────────────────────────────────────────────────────────────

function _showDrillResult() {
  clearInterval(drillState.timerInterval);
  const secs     = Math.floor((Date.now() - drillState.startTime) / 1000);
  const total    = drillState.responses.length;
  const correct  = drillState.responses.filter(r => r.correct).length;
  const accuracy = correct / total;
  const m = Math.floor(secs / 60), s = secs % 60;
  const timeStr  = `${m}:${String(s).padStart(2, '0')}`;

  const prevRec = _getDrillRecord(drillState.type);
  _saveDrillRecord(drillState.type, secs, accuracy);
  const isNewPB = prevRec.bestTime === null || secs < prevRec.bestTime;

  if (typeof DailyQuest !== 'undefined') DailyQuest.mark('drill');  // E-003 quest objective
  if (typeof Feedback !== 'undefined') {  // E-008
    if (isNewPB) { Feedback.confetti({ count: 80 }); Feedback.hit('reward'); }
    else Feedback.play('complete');
  }
  const drillXP = (typeof XP !== 'undefined') ? XP.awardDrill(correct) : null;  // E-005
  if (drillXP && drillXP.leveledUp) {
    const evolved = typeof Avatar !== 'undefined' &&
      Avatar.stageFromLevel(drillXP.toLevel) > Avatar.stageFromLevel(drillXP.fromLevel);
    if (evolved && typeof _showEvolution === 'function') {
      setTimeout(() => _showEvolution(drillXP.toLevel), 700);
    } else if (typeof _showLevelUp === 'function') {
      setTimeout(() => _showLevelUp(drillXP.toLevel), 700);
    }
  }
  const drillStreak = Storage.updateStreak();
  _checkStreakMilestone(drillStreak);
  _checkRewardMilestones(drillStreak);
  if (typeof _maybeOpenMysteryBox === 'function') _maybeOpenMysteryBox({ streak: drillStreak, xpResult: drillXP });  // E-010
  checkAndShowInstallPrompt();
  if (state.user) {
    const drillAcct = Storage.findAccount(state.user.loginId || state.user.email);  // BUG-030: loginId, not removed email
    if (drillAcct) {
      Storage.syncAccountToDrive({
        ...state.user, passwordHash: drillAcct.passwordHash, streak: drillStreak
      }).catch(() => {});
    }
    Storage.syncUserToRemote(state.user).catch(() => {});
  }

  document.getElementById('drill-question-wrap').classList.add('hidden');
  document.getElementById('drill-pb').classList.add('hidden');
  document.getElementById('drill-progress-fill').style.width = '100%';
  const resultEl = document.getElementById('drill-result');
  resultEl.classList.remove('hidden');

  document.getElementById('drill-result-score').textContent = `${correct} / ${total}`;

  const pbMsgEl = document.getElementById('drill-result-pb');
  if (isNewPB) {
    pbMsgEl.textContent  = `🏆 New Personal Best! ${timeStr}`;
    pbMsgEl.className    = 'drill-result-pb drill-pb-new';
  } else if (prevRec.bestTime !== null) {
    const diff = secs - prevRec.bestTime;
    const bestStr = `${Math.floor(prevRec.bestTime / 60)}:${String(prevRec.bestTime % 60).padStart(2,'0')}`;
    if (diff <= 5) {
      pbMsgEl.textContent = `So close — ${diff}s off your best of ${bestStr}. Try again.`;
      pbMsgEl.className   = 'drill-result-pb drill-pb-close';
    } else {
      pbMsgEl.textContent = `Your best: ${bestStr}. You did ${timeStr} today.`;
      pbMsgEl.className   = 'drill-result-pb';
    }
  } else {
    pbMsgEl.textContent = '';
    pbMsgEl.className   = 'drill-result-pb';
  }

  document.getElementById('drill-result-stats').innerHTML    =
    `Time: ${timeStr} &nbsp;·&nbsp; Accuracy: ${Math.round(accuracy * 100)}% &nbsp;·&nbsp; Avg: ${(secs / total).toFixed(1)}s/Q`;

  const missed = drillState.responses.filter(r => !r.correct);
  document.getElementById('drill-result-missed').innerHTML = missed.length
    ? `Missed: ${missed.slice(0, 5).map(r => `<strong>${_esc(r.q)}</strong> → ${_esc(String(r.answer))}`).join(' · ')}`
    : '🎉 Perfect score!';

  drillState._lastResult = { type: drillState.type, correct, total, secs, timeStr, isNewPB };
}

function _retryDrill() {
  document.getElementById('drill-result').classList.add('hidden');
  document.getElementById('drill-question-wrap').classList.remove('hidden');
  document.getElementById('drill-pb').classList.remove('hidden');
  _startDrill(drillState.type);
}

async function _exitDrill() {
  clearInterval(drillState.timerInterval);
  await _showScreen('home');
  _renderHome();
}

function _shareDrillResult() {
  const r = drillState._lastResult;
  if (!r) return;
  const meta = DRILL_META[r.type];
  const pb   = r.isNewPB ? ' 🏆 Personal Best!' : '';
  const text = `⚡ ${meta.name} · Donnibo\nScore: ${r.correct}/${r.total} in ${r.timeStr}${pb}\nTry it: donnibo.in`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => alert('Copied! Share in WhatsApp 🚀'));
  } else {
    alert(text);
  }
}

// ── Content Loaders ───────────────────────────────────────────────────────────

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
  const seed = today.split('-').reduce((a, b) => a + parseInt(b), 0);
  const pool = [...topic.questions];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = (seed + i) % (i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 5).map(q => ({ q: q.question, options: q.options, correctIndex: q.correctIndex }));
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
