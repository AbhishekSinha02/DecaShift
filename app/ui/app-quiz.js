// app-quiz.js — Quiz engine, timer, result screen, session save

// ── Quiz Entry ────────────────────────────────────────────────────────────────

function startGoal(goalId) {
  state.selectedGoal      = state.goals.find(g => g.id === goalId);
  state.filteredQuestions = state.questions.filter(q => q.goalId === goalId);
  state.currentIndex      = 0;
  state.responses         = [];
  state.sessionId         = crypto.randomUUID();
  state.sessionStart      = new Date().toISOString();

  _showScreen('quiz');
  _renderQuestion();
}

function _renderQuestion() {
  const q     = state.filteredQuestions[state.currentIndex];
  const total = state.filteredQuestions.length;

  state.questionStart       = new Date().toISOString();
  state.selectedAnswerIndex = null;

  document.getElementById('quiz-progress-text').textContent = `Question ${state.currentIndex + 1} of ${total}`;
  document.getElementById('quiz-progress-fill').style.width = `${(state.currentIndex / total) * 100}%`;

  const _firstName   = _getFirstName(state.user);
  const _personalise = str => str.replace(/\{\{userName\}\}/g, _firstName);

  document.getElementById('question-text').textContent = _personalise(q.question);

  document.getElementById('answer-list').innerHTML = q.options.map((opt, i) => `
    <div class="answer-card" data-idx="${i}" onclick="_selectAnswer(${i})">
      <span class="answer-label">${String.fromCharCode(65 + i)}</span>
      <span class="answer-text">${_esc(_personalise(opt))}</span>
    </div>`).join('');

  document.getElementById('explanation-box').classList.add('hidden');
  document.getElementById('submit-btn').disabled = true;
  document.getElementById('submit-btn').classList.remove('hidden');
  document.getElementById('next-btn').classList.add('hidden');

  const timerBadge = document.getElementById('timer-display');
  const timerBtn   = document.getElementById('timer-toggle-btn');
  if (timerBadge) timerBadge.classList.toggle('hidden', !state.timerEnabled);
  if (timerBtn) {
    timerBtn.textContent = state.timerEnabled ? 'Timer ON' : 'Timer OFF';
    timerBtn.classList.toggle('active', state.timerEnabled);
  }

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

  const q  = state.filteredQuestions[state.currentIndex];
  const s  = state.selectedAnswerIndex;
  const ok = s === q.correctIndex;

  state.responses.push({
    questionId: q.id, selectedIndex: s, correctIndex: q.correctIndex,
    isCorrect: ok, startTime: state.questionStart, endTime: new Date().toISOString(),
    durationSeconds: state.timerSeconds
  });

  document.querySelectorAll('.answer-card').forEach(card => {
    const i = parseInt(card.dataset.idx, 10);
    if (i === q.correctIndex)   card.classList.add('correct');
    else if (i === s && !ok)    card.classList.add('incorrect');
    card.onclick = null;
  });

  if (q.explanation) {
    const box  = document.getElementById('explanation-box');
    const _fn2 = _getFirstName(state.user);
    box.textContent = q.explanation.replace(/\{\{userName\}\}/g, _fn2);
    box.classList.remove('hidden');
  }

  document.getElementById('submit-btn').classList.add('hidden');
  document.getElementById('next-btn').classList.remove('hidden');
}

function nextQuestion() {
  state.currentIndex++;
  state.currentIndex >= state.filteredQuestions.length ? _showResult() : _renderQuestion();
}

// ── Timer ─────────────────────────────────────────────────────────────────────

function toggleTimer() {
  state.timerEnabled = !state.timerEnabled;
  localStorage.setItem('decashift_timer', state.timerEnabled ? 'on' : 'off');
  const timerBadge = document.getElementById('timer-display');
  const timerBtn   = document.getElementById('timer-toggle-btn');
  if (timerBadge) timerBadge.classList.toggle('hidden', !state.timerEnabled);
  if (timerBtn) {
    timerBtn.textContent = state.timerEnabled ? 'Timer ON' : 'Timer OFF';
    timerBtn.classList.toggle('active', state.timerEnabled);
  }
}

function _startTimer() {
  clearInterval(state.timerInterval);
  state.timerSeconds = 0;
  _updateTimerDisplay();
  state.timerInterval = setInterval(() => { state.timerSeconds++; _updateTimerDisplay(); }, 1000);
}

function _stopTimer() { clearInterval(state.timerInterval); state.timerInterval = null; }

function _updateTimerDisplay() {
  const el = document.getElementById('timer-display');
  if (el) el.textContent = String(Math.floor(state.timerSeconds / 60)).padStart(2, '0') + ':' + String(state.timerSeconds % 60).padStart(2, '0');
}

// ── Result Screen ─────────────────────────────────────────────────────────────

function _showResult() {
  const correct = state.responses.filter(r => r.isCorrect).length;
  const total   = state.responses.length;
  const pct     = total ? Math.round((correct / total) * 100) : 0;

  const session = {
    sessionId: state.sessionId, userId: state.user.userId, goalId: state.selectedGoal.id,
    sessionStart: state.sessionStart, sessionEnd: new Date().toISOString(),
    totalDurationSeconds: state.responses.reduce((s, r) => s + r.durationSeconds, 0),
    responses: state.responses, score: correct, total, accuracy: total ? correct / total : 0
  };

  Storage.saveSession(session);
  const updatedStreak = Storage.updateStreak();

  if (state.selectedGoal.id === 'daily-gk') {
    _markDailyGKDone();
    _loadTodayFact().then(fact => { if (fact) setTimeout(() => _showTodayFactModal(fact), 1200); });
  }
  const banner = document.getElementById('first-session-banner');
  if (banner) banner.classList.toggle('hidden', Storage.loadSessions().length !== 1);

  const acct = Storage.findAccount(state.user.email);
  if (acct) {
    Storage.syncAccountToDrive({
      ...state.user, passwordHash: acct.passwordHash, streak: updatedStreak
    }).catch(() => {});
  }
  Storage.syncUserToRemote(state.user).catch(() => {});

  _showScreen('result');

  document.getElementById('result-score').textContent = correct + ' / ' + total;
  document.getElementById('result-pct').textContent   = pct + '%';

  const badge = document.getElementById('result-badge');
  if (pct >= 80) {
    badge.textContent = 'Excellent'; badge.className = 'result-badge badge-excellent';
  } else if (pct >= 60) {
    badge.textContent = 'Good'; badge.className = 'result-badge badge-good';
  } else {
    badge.textContent = 'Needs Work'; badge.className = 'result-badge badge-needs-work';
  }

  document.getElementById('result-table-body').innerHTML = state.filteredQuestions.map((q, i) => {
    const r = state.responses[i];
    return `<tr>
      <td>${i + 1}</td>
      <td class="q-text">${_esc(q.question.length > 60 ? q.question.slice(0, 60) + '…' : q.question)}</td>
      <td class="${r.isCorrect ? 'correct' : 'incorrect'}">${r.isCorrect ? '✓' : '✗'}</td>
      <td class="time-cell">${r.durationSeconds}s</td>
    </tr>`;
  }).join('');

  document.getElementById('restart-btn').onclick = () => {
    if (state.selectedGoal.id === 'daily-gk') _startDailyGK();
    else startGoal(state.selectedGoal.id);
  };
  document.getElementById('back-home-btn').onclick = () => {
    if (state.selectedGoal.id === 'daily-gk') state.subjectFilter = 'gk';
    _showScreen('home');
    _renderHome();
  };
}
