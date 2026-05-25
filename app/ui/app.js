// app.js — DecaShift main application logic

const state = {
  currentScreen: 'registration',
  user: null,
  goals: [],
  questions: [],
  selectedGoal: null,
  filteredQuestions: [],
  currentIndex: 0,
  responses: [],
  sessionId: null,
  sessionStart: null,
  questionStart: null,
  selectedAnswerIndex: null,
  timerInterval: null,
  timerSeconds: 0
};

// ── Bootstrap ─────────────────────────────────────────────────────────────────

async function init() {
  const savedUser = Storage.loadUser();
  if (savedUser) {
    state.user = savedUser;
    await _loadData();
    _showScreen('home');
    _renderHome();
  } else {
    _showScreen('registration');
    _setupRegistrationForm();
  }
}

async function _loadData() {
  try {
    const [gr, qr] = await Promise.all([fetch('goals.json'), fetch('questions.json')]);
    state.goals     = await gr.json();
    state.questions = await qr.json();
  } catch (err) {
    console.error('[DecaShift] Failed to load data files:', err);
  }
}

// ── Screen routing ────────────────────────────────────────────────────────────

function _showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  state.currentScreen = name;
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 0 — Registration
// ══════════════════════════════════════════════════════════════════════════════

function _setupRegistrationForm() {
  document.getElementById('registration-form').addEventListener('submit', _handleRegSubmit);

  // Only allow digits in mobile field
  document.getElementById('reg-mobile').addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
  });
}

async function _handleRegSubmit(e) {
  e.preventDefault();

  const name    = document.getElementById('reg-name').value.trim();
  const email   = document.getElementById('reg-email').value.trim();
  const mobile  = document.getElementById('reg-mobile').value.trim();
  const role    = document.getElementById('reg-role').value;
  const company = document.getElementById('reg-company').value.trim();

  _clearErrors();
  let valid = true;

  if (!name)                         { _showError('err-name',   'Name is required'); valid = false; }
  if (!email || !_validEmail(email)) { _showError('err-email',  'Enter a valid email address'); valid = false; }
  if (!mobile || mobile.length !== 10){ _showError('err-mobile', 'Enter a 10-digit mobile number'); valid = false; }
  if (!role)                         { _showError('err-role',   'Please select your role'); valid = false; }

  if (!valid) return;

  const user = {
    userId:       Storage.getOrCreateUserId(),
    name,
    email,
    mobile:       '+91' + mobile,
    role,
    company:      company || '',
    registeredAt: new Date().toISOString()
  };

  _setRegLoading(true);
  Storage.saveUser(user);
  state.user = user;

  const syncResult = await Storage.syncUserToRemote(user);
  _setSyncNote(syncResult);

  _setRegLoading(false);

  await _loadData();
  _showScreen('home');
  _renderHome();
}

function _setRegLoading(on) {
  const btn    = document.getElementById('reg-submit');
  btn.disabled = on;
  btn.querySelector('.btn-text').classList.toggle('hidden', on);
  btn.querySelector('.btn-loader').classList.toggle('hidden', !on);
}

function _setSyncNote(result) {
  const el = document.getElementById('sync-status');
  if (!el) return;
  if (result.reason === 'no_endpoint') {
    el.textContent = 'Saved locally. Connect Google Drive to sync remotely.';
    el.className = 'sync-note';
  } else if (result.success) {
    el.textContent = 'Synced to Google Drive successfully.';
    el.className = 'sync-note success';
  } else {
    el.textContent = 'Saved locally (remote sync unavailable).';
    el.className = 'sync-note';
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 1 — Home / Goal Select
// ══════════════════════════════════════════════════════════════════════════════

function _renderHome() {
  const firstName = state.user.name.split(' ')[0];

  const greeting = document.getElementById('user-greeting');
  if (greeting) greeting.textContent = firstName + '\'s Goals';

  const chip = document.getElementById('user-chip-name');
  if (chip) chip.textContent = firstName;

  const avatar = document.getElementById('user-avatar');
  if (avatar) avatar.textContent = firstName[0].toUpperCase();

  const list = document.getElementById('goals-list');
  if (!list) return;

  if (!state.goals.length) {
    list.innerHTML = '<p class="text-muted">No goals loaded. Check goals.json.</p>';
    return;
  }

  list.innerHTML = state.goals.map(goal => {
    const count       = state.questions.filter(q => q.goalId === goal.id).length;
    const lastSession = Storage.getLastSessionForGoal(goal.id);
    const lastScore   = lastSession ? lastSession.score + '/' + lastSession.total : null;

    return `
      <div class="goal-card">
        <div class="goal-info">
          <h3 class="goal-name">${_esc(goal.name)}</h3>
          <p class="goal-desc">${_esc(goal.description)}</p>
          <div class="goal-meta">
            <span>${count} question${count !== 1 ? 's' : ''}</span>
            ${lastScore ? `<span class="goal-last-score">Last: ${lastScore}</span>` : ''}
          </div>
          <div class="goal-tags">
            ${goal.tags.map(t => `<span class="tag">${_esc(t)}</span>`).join('')}
          </div>
        </div>
        <div class="goal-actions">
          <button class="btn btn-primary btn-sm" onclick="startGoal('${goal.id}')">
            ${lastSession ? 'Restart' : 'Start'}
          </button>
          ${lastSession ? `<button class="btn btn-ghost btn-sm" onclick="resetGoal('${goal.id}')">Reset</button>` : ''}
        </div>
      </div>`;
  }).join('');
}

function resetGoal(goalId) {
  if (!confirm('Clear all progress for this goal?')) return;
  Storage.clearSessionsForGoal(goalId);
  _renderHome();
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 2 — Quiz
// ══════════════════════════════════════════════════════════════════════════════

function startGoal(goalId) {
  state.selectedGoal       = state.goals.find(g => g.id === goalId);
  state.filteredQuestions  = state.questions.filter(q => q.goalId === goalId);
  state.currentIndex       = 0;
  state.responses          = [];
  state.sessionId          = crypto.randomUUID();
  state.sessionStart       = new Date().toISOString();

  _showScreen('quiz');
  _renderQuestion();
}

function _renderQuestion() {
  const q     = state.filteredQuestions[state.currentIndex];
  const total = state.filteredQuestions.length;
  const idx   = state.currentIndex;

  state.questionStart      = new Date().toISOString();
  state.selectedAnswerIndex = null;

  document.getElementById('quiz-progress-text').textContent =
    `Question ${idx + 1} of ${total}`;
  document.getElementById('quiz-progress-fill').style.width =
    `${(idx / total) * 100}%`;

  document.getElementById('question-text').textContent = q.question;

  document.getElementById('answer-list').innerHTML = q.options.map((opt, i) => `
    <div class="answer-card" data-idx="${i}" onclick="_selectAnswer(${i})">
      <span class="answer-label">${String.fromCharCode(65 + i)}</span>
      <span class="answer-text">${_esc(opt)}</span>
    </div>`).join('');

  document.getElementById('explanation-box').classList.add('hidden');
  document.getElementById('submit-btn').disabled = true;
  document.getElementById('submit-btn').classList.remove('hidden');
  document.getElementById('next-btn').classList.add('hidden');

  _startTimer();
}

function _selectAnswer(index) {
  state.selectedAnswerIndex = index;
  document.querySelectorAll('.answer-card').forEach(c => c.classList.remove('selected'));
  document.querySelector(`.answer-card[data-idx="${index}"]`).classList.add('selected');
  document.getElementById('submit-btn').disabled = false;
}

function submitAnswer() {
  if (state.selectedAnswerIndex === null) return;

  _stopTimer();

  const q         = state.filteredQuestions[state.currentIndex];
  const selected  = state.selectedAnswerIndex;
  const isCorrect = selected === q.correctIndex;

  state.responses.push({
    questionId:      q.id,
    selectedIndex:   selected,
    correctIndex:    q.correctIndex,
    isCorrect,
    startTime:       state.questionStart,
    endTime:         new Date().toISOString(),
    durationSeconds: state.timerSeconds
  });

  // Apply correct / incorrect classes
  document.querySelectorAll('.answer-card').forEach(card => {
    const i = parseInt(card.dataset.idx, 10);
    if (i === q.correctIndex)             card.classList.add('correct');
    else if (i === selected && !isCorrect) card.classList.add('incorrect');
    card.onclick = null;
  });

  if (q.explanation) {
    const box = document.getElementById('explanation-box');
    box.textContent = q.explanation;
    box.classList.remove('hidden');
  }

  document.getElementById('submit-btn').classList.add('hidden');
  document.getElementById('next-btn').classList.remove('hidden');
}

function nextQuestion() {
  state.currentIndex++;
  if (state.currentIndex >= state.filteredQuestions.length) {
    _showResult();
  } else {
    _renderQuestion();
  }
}

// Timer
function _startTimer() {
  clearInterval(state.timerInterval);
  state.timerSeconds = 0;
  _updateTimer();
  state.timerInterval = setInterval(() => { state.timerSeconds++; _updateTimer(); }, 1000);
}

function _stopTimer() {
  clearInterval(state.timerInterval);
  state.timerInterval = null;
}

function _updateTimer() {
  const mm = String(Math.floor(state.timerSeconds / 60)).padStart(2, '0');
  const ss = String(state.timerSeconds % 60).padStart(2, '0');
  const el = document.getElementById('timer-display');
  if (el) el.textContent = mm + ':' + ss;
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 3 — Result
// ══════════════════════════════════════════════════════════════════════════════

function _showResult() {
  const correct = state.responses.filter(r => r.isCorrect).length;
  const total   = state.responses.length;
  const pct     = total ? Math.round((correct / total) * 100) : 0;

  const session = {
    sessionId:            state.sessionId,
    userId:               state.user.userId,
    goalId:               state.selectedGoal.id,
    sessionStart:         state.sessionStart,
    sessionEnd:           new Date().toISOString(),
    totalDurationSeconds: state.responses.reduce((s, r) => s + r.durationSeconds, 0),
    responses:            state.responses,
    score:                correct,
    total,
    accuracy:             total ? correct / total : 0
  };

  Storage.saveSession(session);
  _showScreen('result');

  document.getElementById('result-score').textContent = correct + ' / ' + total;
  document.getElementById('result-pct').textContent   = pct + '%';
  document.getElementById('result-badge').textContent =
    pct >= 80 ? 'Excellent' : pct >= 60 ? 'Good' : 'Needs Work';

  document.getElementById('result-table-body').innerHTML =
    state.filteredQuestions.map((q, i) => {
      const r = state.responses[i];
      return `<tr>
        <td>${i + 1}</td>
        <td class="q-text">${_esc(q.question.length > 60 ? q.question.slice(0, 60) + '…' : q.question)}</td>
        <td class="${r.isCorrect ? 'correct' : 'incorrect'}">${r.isCorrect ? '✓' : '✗'}</td>
        <td class="time-cell">${r.durationSeconds}s</td>
      </tr>`;
    }).join('');

  // Wire export buttons with current session data
  document.getElementById('export-json-btn').onclick =
    () => Storage.exportAsJSON(Storage.loadSessions());
  document.getElementById('export-csv-btn').onclick =
    () => Storage.exportAsCSV(Storage.loadSessions());
  document.getElementById('restart-btn').onclick =
    () => startGoal(state.selectedGoal.id);
  document.getElementById('back-home-btn').onclick = () => {
    _showScreen('home');
    _renderHome();
  };
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function _showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function _clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => (el.textContent = ''));
}

function _validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function _esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Start ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
