// app.js — DecaShift v2

const state = {
  currentScreen: null,
  user: null,
  pendingCategory: null,  // set when user clicks Student / Professional on landing
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
  await _loadData();
  const user = Storage.loadUser();
  if (user) {
    state.user = user;
    _showScreen('home');
    _renderHome();
  } else {
    _showScreen('landing');
    _setupLanding();
  }
}

async function _loadData() {
  try {
    const [gr, qr] = await Promise.all([fetch('goals.json'), fetch('questions.json')]);
    state.goals     = await gr.json();
    state.questions = await qr.json();
  } catch (err) {
    console.error('[DecaShift] Failed to load data:', err);
  }
}

function _showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  state.currentScreen = name;
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN: Landing
// ══════════════════════════════════════════════════════════════════════════════

function _setupLanding() {
  document.getElementById('btn-for-students').onclick     = () => _goToSignup('school');
  document.getElementById('btn-for-professionals').onclick = () => _goToSignup('professional');
  document.getElementById('btn-go-signin').onclick         = () => { _showScreen('signin'); _setupSignin(); };
}

function _goToSignup(category) {
  state.pendingCategory = category;
  _showScreen('signup');
  _setupSignup(category);
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN: Sign Up
// ══════════════════════════════════════════════════════════════════════════════

function _setupSignup(category) {
  // Show / hide category-specific sections
  const schoolFields = document.getElementById('school-fields');
  const proFields    = document.getElementById('pro-fields');
  schoolFields.classList.toggle('hidden', category !== 'school');
  proFields.classList.toggle('hidden',    category !== 'professional');

  // Grade picker → show college course group if 'college' selected
  const gradeEl = document.getElementById('reg-grade');
  if (gradeEl) {
    gradeEl.onchange = () => {
      document.getElementById('college-course-group').classList.toggle('hidden', gradeEl.value !== 'college');
    };
  }

  // Digits-only on mobile
  document.getElementById('reg-mobile').addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
  }, { once: true });

  document.getElementById('signup-form').onsubmit = _handleSignup;
  document.getElementById('btn-to-signin').onclick = () => { _showScreen('signin'); _setupSignin(); };
}

async function _handleSignup(e) {
  e.preventDefault();
  _clearErrors();

  const name     = document.getElementById('reg-name').value.trim();
  const email    = document.getElementById('reg-email').value.trim().toLowerCase();
  const mobile   = document.getElementById('reg-mobile').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm  = document.getElementById('reg-confirm').value;
  const category = state.pendingCategory || 'professional';

  let valid = true;
  if (!name)                           { _showError('err-name',     'Enter your name'); valid = false; }
  if (!email || !_validEmail(email))   { _showError('err-email',    'Enter a valid email'); valid = false; }
  if (!mobile || mobile.length !== 10) { _showError('err-mobile',   'Enter a 10-digit mobile number'); valid = false; }
  if (password.length < 6)             { _showError('err-password', 'Password must be at least 6 characters'); valid = false; }
  if (password !== confirm)            { _showError('err-confirm',  'Passwords do not match'); valid = false; }

  // Category-specific validation
  let grade = null, course = null, role = null, company = null;
  if (category === 'school') {
    grade = document.getElementById('reg-grade').value;
    if (!grade) { _showError('err-grade', 'Select your grade'); valid = false; }
    if (grade === 'college') {
      course = document.getElementById('reg-course').value;
      if (!course) { _showError('err-course', 'Select your course'); valid = false; }
    }
  } else {
    role    = document.getElementById('reg-role').value;
    company = document.getElementById('reg-company').value.trim();
    if (!role) { _showError('err-role', 'Select your role'); valid = false; }
  }

  if (!valid) return;

  // Check email not already registered
  if (Storage.findAccount(email)) {
    _showError('err-email', 'This email is already registered. Sign in instead.');
    return;
  }

  const btn = document.getElementById('signup-btn');
  btn.disabled = true; btn.textContent = 'Creating account…';

  const userId      = Storage.getOrCreateUserId();
  const passwordHash = await Storage.hashPassword(password);

  const user = {
    userId, name, email, mobile: '+91' + mobile,
    category,
    grade:    grade || null,
    course:   course || null,
    role:     role || null,
    company:  company || null,
    registeredAt: new Date().toISOString()
  };

  Storage.saveAccount(email, passwordHash, userId);
  Storage.saveUser(user);
  state.user = user;

  btn.disabled = false; btn.textContent = 'Create Account →';

  _showScreen('home');
  _renderHome();

  // Silent background sync
  Storage.syncUserToRemote(user).catch(() => {});
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN: Sign In
// ══════════════════════════════════════════════════════════════════════════════

function _setupSignin() {
  document.getElementById('signin-form').onsubmit = _handleSignin;
  document.getElementById('btn-to-signup').onclick = () => {
    _showScreen('landing');
    _setupLanding();
  };
}

async function _handleSignin(e) {
  e.preventDefault();
  _clearErrors();

  const email    = document.getElementById('si-email').value.trim().toLowerCase();
  const password = document.getElementById('si-password').value;

  let valid = true;
  if (!email || !_validEmail(email)) { _showError('err-si-email',    'Enter a valid email'); valid = false; }
  if (!password)                      { _showError('err-si-password', 'Enter your password'); valid = false; }
  if (!valid) return;

  const btn = document.getElementById('signin-btn');
  btn.disabled = true; btn.textContent = 'Signing in…';

  const account = Storage.findAccount(email);
  if (!account) {
    _showError('err-si-email', 'No account found. Sign up first.');
    btn.disabled = false; btn.textContent = 'Sign In →';
    return;
  }

  const hash = await Storage.hashPassword(password);
  if (hash !== account.passwordHash) {
    _showError('err-si-password', 'Incorrect password.');
    btn.disabled = false; btn.textContent = 'Sign In →';
    return;
  }

  // Restore user profile
  let user = Storage.loadUser();
  if (!user || user.userId !== account.userId) {
    // Profile not in localStorage — reconstruct minimal profile
    user = { userId: account.userId, email, registeredAt: account.createdAt };
    Storage.saveUser(user);
  }

  btn.disabled = false; btn.textContent = 'Sign In →';

  state.user = user;
  _showScreen('home');
  _renderHome();
}

// ══════════════════════════════════════════════════════════════════════════════
// Sign Out
// ══════════════════════════════════════════════════════════════════════════════

function signOut() {
  Storage.clearSession();
  state.user = null;
  _showScreen('landing');
  _setupLanding();
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN: Home / Goal Select
// ══════════════════════════════════════════════════════════════════════════════

function _renderHome() {
  const user      = state.user;
  const firstName = (user.name || user.email || 'there').split(' ')[0];

  const el = document.getElementById('user-greeting');
  if (el) el.textContent = 'Hello, ' + firstName;

  const chip = document.getElementById('user-chip-name');
  if (chip) chip.textContent = firstName;

  const avatar = document.getElementById('user-avatar');
  if (avatar) avatar.textContent = firstName[0].toUpperCase();

  // Filter goals by category
  const goals = _goalsForUser(user);

  const list = document.getElementById('goals-list');
  if (!list) return;

  if (!goals.length) {
    list.innerHTML = '<p class="text-muted">No goals found for your profile. More content coming soon!</p>';
    return;
  }

  list.innerHTML = goals.map(goal => {
    const count = state.questions.filter(q => q.goalId === goal.id).length;
    const last  = Storage.getLastSessionForGoal(goal.id);
    const score = last ? last.score + '/' + last.total : null;

    return `
      <div class="goal-card">
        <div class="goal-info">
          <h3 class="goal-name">${_esc(goal.name)}</h3>
          <p class="goal-desc">${_esc(goal.description)}</p>
          <div class="goal-meta">
            <span>${count} question${count !== 1 ? 's' : ''}</span>
            ${score ? `<span class="goal-last-score">Last: ${score}</span>` : ''}
          </div>
          <div class="goal-tags">${goal.tags.map(t => `<span class="tag">${_esc(t)}</span>`).join('')}</div>
        </div>
        <div class="goal-actions">
          <button class="btn btn-primary btn-sm" onclick="startGoal('${goal.id}')">${last ? 'Restart' : 'Start'}</button>
          ${last ? `<button class="btn btn-ghost btn-sm" onclick="resetGoal('${goal.id}')">Reset</button>` : ''}
        </div>
      </div>`;
  }).join('');
}

function _goalsForUser(user) {
  const cat = user.category;
  if (!cat) return state.goals;                                                 // no category — show all
  if (cat === 'school') {
    const grade = parseInt(user.grade, 10);
    if (user.grade === 'college') return state.goals.filter(g => g.category === 'college');
    return state.goals.filter(g => g.category === 'school' && g.grade === grade);
  }
  if (cat === 'college') return state.goals.filter(g => g.category === 'college');
  return state.goals.filter(g => g.category === 'professional');
}

function resetGoal(goalId) {
  if (!confirm('Clear all progress for this goal?')) return;
  Storage.clearSessionsForGoal(goalId);
  _renderHome();
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN: Quiz
// ══════════════════════════════════════════════════════════════════════════════

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

  state.questionStart      = new Date().toISOString();
  state.selectedAnswerIndex = null;

  document.getElementById('quiz-progress-text').textContent = `Question ${state.currentIndex + 1} of ${total}`;
  document.getElementById('quiz-progress-fill').style.width = `${(state.currentIndex / total) * 100}%`;
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
    if (i === q.correctIndex)          card.classList.add('correct');
    else if (i === s && !ok)           card.classList.add('incorrect');
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
  state.currentIndex >= state.filteredQuestions.length ? _showResult() : _renderQuestion();
}

function _startTimer() {
  clearInterval(state.timerInterval);
  state.timerSeconds = 0; _updateTimer();
  state.timerInterval = setInterval(() => { state.timerSeconds++; _updateTimer(); }, 1000);
}

function _stopTimer()  { clearInterval(state.timerInterval); state.timerInterval = null; }

function _updateTimer() {
  const el = document.getElementById('timer-display');
  if (el) el.textContent = String(Math.floor(state.timerSeconds / 60)).padStart(2, '0') + ':' + String(state.timerSeconds % 60).padStart(2, '0');
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN: Result
// ══════════════════════════════════════════════════════════════════════════════

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
  _showScreen('result');

  document.getElementById('result-score').textContent = correct + ' / ' + total;
  document.getElementById('result-pct').textContent   = pct + '%';
  document.getElementById('result-badge').textContent = pct >= 80 ? 'Excellent' : pct >= 60 ? 'Good' : 'Needs Work';

  document.getElementById('result-table-body').innerHTML = state.filteredQuestions.map((q, i) => {
    const r = state.responses[i];
    return `<tr>
      <td>${i + 1}</td>
      <td class="q-text">${_esc(q.question.length > 60 ? q.question.slice(0, 60) + '…' : q.question)}</td>
      <td class="${r.isCorrect ? 'correct' : 'incorrect'}">${r.isCorrect ? '✓' : '✗'}</td>
      <td class="time-cell">${r.durationSeconds}s</td>
    </tr>`;
  }).join('');

  document.getElementById('restart-btn').onclick   = () => startGoal(state.selectedGoal.id);
  document.getElementById('back-home-btn').onclick = () => { _showScreen('home'); _renderHome(); };
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function _showError(id, msg) { const el = document.getElementById(id); if (el) el.textContent = msg; }
function _clearErrors()       { document.querySelectorAll('.field-error').forEach(el => el.textContent = ''); }
function _validEmail(v)        { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function _esc(str)             { return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

document.addEventListener('DOMContentLoaded', init);
