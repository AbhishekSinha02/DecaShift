// app-gk.js — Daily GK Capsule: reflective mode with explanations + Today in India fact card

// ── Helpers ───────────────────────────────────────────────────────────────────

function _gkTodayKey() {
  const d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

function _isDailyGKDone() {
  return localStorage.getItem('ds_gk_done_' + _gkTodayKey()) === 'true';
}

function _markDailyGKDone() {
  localStorage.setItem('ds_gk_done_' + _gkTodayKey(), 'true');
}

function _gkTopicForToday() {
  const weekIndex = (Math.floor(Date.now() / (7 * 86400000)) % 6) + 1;
  const names = {
    1: 'Indian Geography', 2: 'World Geography', 3: 'Indian History',
    4: 'Science & Technology', 5: 'Indian Constitution', 6: 'Sports & Awards'
  };
  return { weekKey: 'week' + weekIndex, name: names[weekIndex] || 'General Knowledge' };
}

// ── GK Tab Renderer ───────────────────────────────────────────────────────────

function _renderGKTab(listEl) {
  const done      = _isDailyGKDone();
  const { name }  = _gkTopicForToday();
  const today     = new Date();
  const dateStr   = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  listEl.innerHTML = `
    <div class="gk-daily-card${done ? ' gk-done' : ''}">
      <div class="gk-card-top">
        <span class="gk-card-icon">🌍</span>
        <div class="gk-card-meta">
          <div class="gk-card-title">Today's GK</div>
          <div class="gk-card-date">${dateStr}</div>
        </div>
        ${done ? '<span class="gk-done-badge">✅ Done</span>' : ''}
      </div>
      <div class="gk-card-topic">Topic: <strong>${_esc(name)}</strong></div>
      <div class="gk-card-footer">
        <span class="gk-card-count">5 questions · with explanations</span>
        <button class="btn ${done ? 'btn-ghost' : 'btn-primary'} btn-sm"
                onclick="_startDailyGK()">${done ? 'Redo' : 'Start →'}</button>
      </div>
    </div>

    <div class="gk-affairs-card gk-coming-soon">
      <div class="gk-card-top">
        <span class="gk-card-icon">📰</span>
        <div class="gk-card-meta">
          <div class="gk-card-title">Current Affairs</div>
          <div class="gk-card-date">Monthly pack · Coming soon</div>
        </div>
        <span class="gk-coming-badge">Soon</span>
      </div>
      <div class="gk-card-topic">June 2026 · 30 questions</div>
    </div>`;
}

// ── Daily GK Session ──────────────────────────────────────────────────────────

async function _startDailyGK() {
  let bank = null;
  const cached = sessionStorage.getItem('ds_gk_bank');
  if (cached) {
    bank = JSON.parse(cached);
  } else {
    const urls = [_rawUrl('app/ui/questions/flash/gk-bank.json'), 'questions/flash/gk-bank.json'];
    for (const url of urls) {
      try {
        const r = await fetch(url);
        if (r.ok) { bank = await r.json(); sessionStorage.setItem('ds_gk_bank', JSON.stringify(bank)); break; }
      } catch (_) {}
    }
  }

  if (!bank) { alert('GK content not available. Please check your connection.'); return; }

  const { weekKey, name: topicName } = _gkTopicForToday();
  const topic = bank.topics[weekKey];
  if (!topic || !topic.questions || !topic.questions.length) {
    alert('GK topic not available yet. Coming soon!'); return;
  }

  // Deterministic daily selection — same 5 questions for all users on the same day
  const today = _gkTodayKey();
  const seed  = today.split('-').reduce((a, b) => a + parseInt(b), 0);
  const pool  = [...topic.questions];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = (seed + i) % (i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const questions = pool.slice(0, 5).map((q, idx) => ({
    id:           'gk_daily_' + idx,
    goalId:       'daily-gk',
    question:     q.question,
    options:      q.options,
    correctIndex: q.correctIndex,
    explanation:  q.explanation || null
  }));

  state.selectedGoal      = { id: 'daily-gk', name: 'Today\'s GK — ' + topicName };
  state.filteredQuestions = questions;
  state.currentIndex      = 0;
  state.responses         = [];
  state.sessionId         = crypto.randomUUID();
  state.sessionStart      = new Date().toISOString();

  await _showScreen('quiz');
  _renderQuestion();
}

// ── Today in India ────────────────────────────────────────────────────────────

async function _loadTodayFact() {
  const today = new Date();
  const key   = String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
  const urls  = [
    _rawUrl('app/ui/questions/gk/today-in-india.json'),
    'questions/gk/today-in-india.json'
  ];
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (r.ok) {
        const facts = await r.json();
        return facts.find(f => f.date === key) || null;
      }
    } catch (_) {}
  }
  return null;
}

function _showTodayFactModal(fact) {
  if (!document.getElementById('gk-fact-modal')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div id="gk-fact-modal" class="modal-overlay hidden" onclick="if(event.target===this)dismissGKFact()">
        <div class="modal-box gk-fact-box">
          <div class="gk-fact-flag">🇮🇳</div>
          <div class="gk-fact-label" id="gk-fact-category">India</div>
          <p class="gk-fact-text" id="gk-fact-text"></p>
          <div class="gk-fact-actions">
            <button class="btn btn-primary" onclick="_shareGKFact()">Share this fact</button>
            <button class="btn btn-ghost"   onclick="dismissGKFact()">Continue →</button>
          </div>
        </div>
      </div>`);
  }
  document.getElementById('gk-fact-text').textContent     = fact.fact;
  document.getElementById('gk-fact-category').textContent = fact.category || 'India';
  document.getElementById('gk-fact-modal').classList.remove('hidden');
}

async function dismissGKFact() {
  const overlay = document.getElementById('gk-fact-modal');
  if (overlay) overlay.classList.add('hidden');
  state.subjectFilter = 'daily-sprint';
  await _showScreen('home');
  _renderHome();
}

function _shareGKFact() {
  const textEl = document.getElementById('gk-fact-text');
  if (!textEl) return;
  const text = `🇮🇳 Today in India · Donnibo\n\n${textEl.textContent}\n\nLearn more: donnibo.in`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => alert('Copied! Share with a friend 🚀'));
  } else {
    alert(text);
  }
}
