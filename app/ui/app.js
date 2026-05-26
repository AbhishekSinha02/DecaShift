// app.js — DecaShift v3

const CONFIG = {
  owner:         'AbhishekSinha02',
  repo:          'DecaShift',
  contentBranch: 'main',
  rawBase:       'https://raw.githubusercontent.com'
};

function _rawUrl(path) {
  return `${CONFIG.rawBase}/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.contentBranch}/${path}`;
}

const state = {
  currentScreen: null,
  user: null,
  pendingCategory: null,
  manifest: [],
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
  timerSeconds: 0,
  timerEnabled: localStorage.getItem('decashift_timer') !== 'off',
  subjectFilter: 'all',
  showArchivedGoals: false
};

// ── Bootstrap ─────────────────────────────────────────────────────────────────

async function init() {
  _initTheme();
  await _loadManifest();
  const user = Storage.loadUser();
  if (user) {
    state.user = user;
    await _loadQuestionsForUser(user);
    _showScreen('home');
    _renderHome();
  } else {
    _showScreen('landing');
    _setupLanding();
  }
}

function _initTheme() {
  const theme = localStorage.getItem('decashift_theme') || 'dark';
  document.documentElement.dataset.theme = theme;
  _updateThemeBtns(theme);
}

function _updateThemeBtns(theme) {
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    btn.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  });
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('decashift_theme', next);
  _updateThemeBtns(next);
}

// ── Manifest + Question Loading ───────────────────────────────────────────────

async function _loadManifest() {
  const cached = sessionStorage.getItem('ds_manifest_cache');
  if (cached) { state.manifest = JSON.parse(cached); return; }
  const urls = [
    _rawUrl('app/ui/questions/manifest.json'),
    'questions/manifest.json'
  ];
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (r.ok) {
        state.manifest = await r.json();
        sessionStorage.setItem('ds_manifest_cache', JSON.stringify(state.manifest));
        return;
      }
    } catch (_) {}
  }
  console.error('[DecaShift] Failed to load manifest');
  state.manifest = [];
}

async function _loadQuestionsForUser(user) {
  const entries = _filterManifest(state.manifest, user);
  const results = await Promise.all(entries.map(e => _fetchQuestionFile(e.file)));

  state.goals     = [];
  state.questions = [];

  results.filter(Boolean).forEach(file => {
    state.goals.push({
      id: file.goalId, name: file.title || file.name, description: file.description || '',
      category: file.category, grade: file.grade ?? null,
      subject: file.subject, level: file.level, tags: file.tags || []
    });
    (file.questions || []).forEach(q => state.questions.push({ ...q, goalId: file.goalId }));
  });
}

async function _fetchQuestionFile(filename) {
  const urls = [
    _rawUrl('app/ui/questions/' + filename),
    'questions/' + filename
  ];
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (r.ok) return r.json();
    } catch (_) {}
  }
  return null;
}

function _filterManifest(manifest, user) {
  if (!manifest || !manifest.length) return [];
  const cat = user.category;
  if (!cat) return []; // missing category → show nothing, prompt profile completion
  if (cat === 'school') {
    if (user.grade === 'college') return manifest.filter(e => e.category === 'college');
    const grade = parseInt(user.grade, 10);
    return manifest.filter(e => e.category === 'school' && e.grade === grade);
  }
  if (cat === 'college') return manifest.filter(e => e.category === 'college');
  return manifest.filter(e => e.category === 'professional');
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
  document.getElementById('btn-for-students').onclick      = () => _goToSignup('school');
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
  const schoolFields = document.getElementById('school-fields');
  const proFields    = document.getElementById('pro-fields');
  schoolFields.classList.toggle('hidden', category !== 'school');
  proFields.classList.toggle('hidden',    category !== 'professional');

  const gradeEl = document.getElementById('reg-grade');
  if (gradeEl) {
    gradeEl.onchange = () => {
      document.getElementById('college-course-group').classList.toggle('hidden', gradeEl.value !== 'college');
    };
  }

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

  if (Storage.findAccount(email)) {
    _showError('err-email', 'This email is already registered. Sign in instead.');
    return;
  }

  const btn = document.getElementById('signup-btn');
  btn.disabled = true; btn.textContent = 'Creating account…';

  const userId       = Storage.getOrCreateUserId();
  const passwordHash = await Storage.hashPassword(password);
  const registeredAt = new Date().toISOString();

  const user = {
    userId, name, email, mobile: '+91' + mobile,
    category,
    grade:   grade   || null,
    course:  course  || null,
    role:    role    || null,
    company: company || null,
    registeredAt
  };

  Storage.saveAccount(email, passwordHash, userId, user);
  Storage.saveUser(user);
  state.user = user;

  await _loadQuestionsForUser(user);

  btn.disabled = false; btn.textContent = 'Create Account →';
  _showScreen('home');
  _renderHome();
  _maybeShowWelcome();

  Storage.syncUserToRemote(user).catch(() => {});
  Storage.syncAccountToDrive({ email, passwordHash, userId, name, category, grade, course, role, company, registeredAt, streak: Storage.loadStreak() }).catch(() => {});
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

  let account = Storage.findAccount(email);

  if (!account) {
    btn.textContent = 'Checking account…';
    const driveAccount = await Storage.fetchAccountFromDrive(email);
    if (!driveAccount) {
      _showError('err-si-email', 'No account found. Sign up first.');
      btn.disabled = false; btn.textContent = 'Sign In →';
      return;
    }
    Storage.saveAccount(driveAccount.email, driveAccount.passwordHash, driveAccount.userId);
    const { passwordHash: _ph, emailHash: _eh, ...userProfile } = driveAccount;
    Storage.saveUser(userProfile);
    // Restore streak from Drive account if present (BUG-002 fix)
    if (userProfile.streak) Storage.saveStreak(userProfile.streak);
    account = { email: driveAccount.email, passwordHash: driveAccount.passwordHash, userId: driveAccount.userId };
  }

  const hash = await Storage.hashPassword(password);
  if (hash !== account.passwordHash) {
    _showError('err-si-password', 'Incorrect password.');
    btn.disabled = false; btn.textContent = 'Sign In →';
    return;
  }

  let user = Storage.loadUser();
  if (!user || user.userId !== account.userId) {
    const { passwordHash: _ph, ...userProfile } = account;
    user = userProfile;
    Storage.saveUser(user);
  }

  btn.disabled = false; btn.textContent = 'Sign In →';
  state.user = user;
  await _loadQuestionsForUser(user);
  _showScreen('home');
  _renderHome();
  _maybeShowWelcome();
}

// ══════════════════════════════════════════════════════════════════════════════
// Sign Out
// ══════════════════════════════════════════════════════════════════════════════

function signOut() {
  Storage.clearSession();
  state.user      = null;
  state.goals     = [];
  state.questions = [];
  _showScreen('landing');
  _setupLanding();
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN: Home / Goal Select
// ══════════════════════════════════════════════════════════════════════════════

function _renderHome() {
  const user      = state.user;
  const firstName = _getFirstName(user);

  const el = document.getElementById('user-greeting');
  if (el) el.textContent = 'Hello, ' + firstName;

  const chip = document.getElementById('user-chip-name');
  if (chip) chip.textContent = firstName;

  const avatar = document.getElementById('user-avatar');
  if (avatar) avatar.textContent = firstName[0].toUpperCase();

  // Streak
  const streak = Storage.loadStreak();
  const elStreakCount = document.getElementById('streak-count');
  const elStreakBest  = document.getElementById('streak-best');
  if (elStreakCount) elStreakCount.textContent = streak.current;
  if (elStreakBest)  elStreakBest.textContent  = streak.best;

  // Progress stats
  const sessions  = Storage.loadSessions().filter(s => s.userId === user.userId);
  const elSess    = document.getElementById('stat-sessions');
  const elAcc     = document.getElementById('stat-accuracy');
  const elTime    = document.getElementById('stat-time');
  if (elSess) elSess.textContent = sessions.length;
  if (elAcc) {
    elAcc.textContent = sessions.length
      ? Math.round(sessions.reduce((s, r) => s + (r.accuracy || 0), 0) / sessions.length * 100) + '%'
      : '—';
  }
  if (elTime) {
    const totalSec = sessions.reduce((s, r) => s + (r.totalDurationSeconds || 0), 0);
    elTime.textContent = totalSec < 60 ? totalSec + 's' : Math.round(totalSec / 60) + 'm';
  }

  // Sync theme button state
  _updateThemeBtns(document.documentElement.dataset.theme || 'dark');

  const allGoals = state.goals;
  const list     = document.getElementById('goals-list');
  if (!list) return;

  // Subject tabs — only for school users who have multiple subjects
  const tabsEl = document.getElementById('subject-tabs');
  if (tabsEl) {
    const isSchool = state.user && state.user.category === 'school';
    const subjects = isSchool ? [...new Set(allGoals.map(g => g.subject))] : [];
    if (subjects.length > 1) {
      const subjectLabels = {
        'mathematics': 'Math', 'science': 'Science', 'hindi': 'Hindi',
        'french': 'French', 'computer-science': 'CS', 'web-dev': 'Web Dev', 'dsa': 'DSA'
      };
      tabsEl.style.display = 'flex';
      tabsEl.innerHTML = ['all', ...subjects].map(s => {
        const label  = s === 'all' ? 'All' : (subjectLabels[s] || s.charAt(0).toUpperCase() + s.slice(1));
        const active = state.subjectFilter === s ? ' active' : '';
        return `<button class="subject-tab${active}" data-subject="${s}" onclick="_setSubjectFilter('${s}')">${label}</button>`;
      }).join('');
    } else {
      tabsEl.style.display = 'none';
    }
  }

  const filteredGoals = state.subjectFilter === 'all'
    ? allGoals
    : allGoals.filter(g => g.subject === state.subjectFilter);

  const archivedSet  = new Set(user.archivedGoals || []);
  const goals        = filteredGoals.filter(g => !archivedSet.has(g.id));
  const archivedGoals = filteredGoals.filter(g => archivedSet.has(g.id));

  if (!goals.length && !archivedGoals.length) {
    const msg = !user.category
      ? '<p class="text-muted">Your profile is incomplete. <button class="link-btn" onclick="openEditProfile()">Complete your profile</button> to see your goals.</p>'
      : '<p class="text-muted">No goals found for your profile. More content coming soon!</p>';
    list.innerHTML = msg;
    return;
  }

  const _cardHtml = (goal, isArchived) => {
    const count = state.questions.filter(q => q.goalId === goal.id).length;
    const last  = Storage.getLastSessionForGoal(goal.id);
    const score = last ? last.score + '/' + last.total : null;
    const menuItems = isArchived
      ? `<button class="goal-menu-item" onclick="_unarchiveGoal('${goal.id}')">↩ Unarchive</button>`
      : `<button class="goal-menu-item" onclick="_archiveGoal('${goal.id}')">✓ Mark as done</button>
         ${last ? `<button class="goal-menu-item" onclick="resetGoal('${goal.id}')">↺ Reset progress</button>` : ''}`;
    return `
      <div class="goal-card${isArchived ? ' archived' : ''}" id="goal-card-${goal.id}">
        <button class="goal-menu-btn" onclick="_toggleGoalMenu('${goal.id}', event)" title="Options">⋮</button>
        <div class="goal-menu-dropdown" id="goal-menu-${goal.id}">${menuItems}</div>
        <div class="goal-info">
          <h3 class="goal-name">${_esc(goal.name)}</h3>
          <p class="goal-desc">${_esc(goal.description)}</p>
          <div class="goal-meta">
            <span>${count} question${count !== 1 ? 's' : ''}</span>
            ${score ? `<span class="goal-last-score">Last: ${score}</span>` : ''}
          </div>
          <div class="goal-tags">${goal.tags.map(t => `<span class="tag">${_esc(t)}</span>`).join('')}</div>
        </div>
        ${!isArchived ? `<div class="goal-actions">
          <button class="btn btn-primary btn-sm" onclick="startGoal('${goal.id}')">${last ? 'Restart' : 'Start'}</button>
        </div>` : ''}
      </div>`;
  };

  let html = goals.length
    ? goals.map(g => _cardHtml(g, false)).join('')
    : '<p class="text-muted" style="padding:8px 0">All goals marked as done. See completed below.</p>';

  if (archivedGoals.length) {
    const isOpen = state.showArchivedGoals;
    html += `
      <button class="archived-toggle" onclick="_toggleArchivedSection()">
        ${isOpen ? '▲' : '▼'} Completed (${archivedGoals.length})
      </button>
      <div class="archived-section" style="display:${isOpen ? 'flex' : 'none'}">
        ${archivedGoals.map(g => _cardHtml(g, true)).join('')}
      </div>`;
  }

  list.innerHTML = html;
}

function resetGoal(goalId) {
  _closeAllGoalMenus();
  if (!confirm('Clear all progress for this goal?')) return;
  Storage.clearSessionsForGoal(goalId);
  _renderHome();
}

function _archiveGoal(goalId) {
  _closeAllGoalMenus();
  const user = state.user;
  user.archivedGoals = [...new Set([...(user.archivedGoals || []), goalId])];
  Storage.saveUser(user);
  state.user = user;
  const card = document.getElementById('goal-card-' + goalId);
  if (card) {
    card.style.transition = 'opacity 0.28s, transform 0.28s';
    card.style.opacity    = '0';
    card.style.transform  = 'scale(0.97)';
    setTimeout(() => _renderHome(), 300);
  } else {
    _renderHome();
  }
}

function _unarchiveGoal(goalId) {
  _closeAllGoalMenus();
  const user = state.user;
  user.archivedGoals = (user.archivedGoals || []).filter(id => id !== goalId);
  Storage.saveUser(user);
  state.user = user;
  _renderHome();
}

function _toggleGoalMenu(goalId, event) {
  event.stopPropagation();
  const menu = document.getElementById('goal-menu-' + goalId);
  if (!menu) return;
  const wasOpen = menu.classList.contains('open');
  _closeAllGoalMenus();
  if (!wasOpen) menu.classList.add('open');
}

function _closeAllGoalMenus() {
  document.querySelectorAll('.goal-menu-dropdown.open').forEach(m => m.classList.remove('open'));
}

function _toggleArchivedSection() {
  state.showArchivedGoals = !state.showArchivedGoals;
  _renderHome();
}

function _setSubjectFilter(subject) {
  state.subjectFilter = subject;
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

  state.questionStart       = new Date().toISOString();
  state.selectedAnswerIndex = null;

  document.getElementById('quiz-progress-text').textContent = `Question ${state.currentIndex + 1} of ${total}`;
  document.getElementById('quiz-progress-fill').style.width = `${(state.currentIndex / total) * 100}%`;

  const _firstName = _getFirstName(state.user);
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

  // Timer display state
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
    const box = document.getElementById('explanation-box');
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
  const updatedStreak = Storage.updateStreak();
  const banner = document.getElementById('first-session-banner');
  if (banner) banner.classList.toggle('hidden', Storage.loadSessions().length !== 1);

  // Resync account to Drive with updated streak so other devices see it (BUG-002 fix)
  const acct = Storage.findAccount(state.user.email);
  if (acct) {
    Storage.syncAccountToDrive({
      ...state.user, passwordHash: acct.passwordHash, streak: updatedStreak
    }).catch(() => {});
  }

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

  document.getElementById('restart-btn').onclick   = () => startGoal(state.selectedGoal.id);
  document.getElementById('back-home-btn').onclick = () => { _showScreen('home'); _renderHome(); };
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function _showError(id, msg) { const el = document.getElementById(id); if (el) el.textContent = msg; }
function _clearErrors()       { document.querySelectorAll('.field-error').forEach(el => el.textContent = ''); }
function _validEmail(v)        { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function _esc(str)             { return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function _getFirstName(user)   { if (!user) return 'there'; if (user.name) return user.name.split(' ')[0]; if (user.email) return user.email.split('@')[0]; return 'there'; }

// ── Onboarding ────────────────────────────────────────────────────────────────

function _maybeShowWelcome() {
  if (!localStorage.getItem('decashift_onboarded')) {
    document.getElementById('welcome-modal').classList.remove('hidden');
  }
}

function dismissWelcome() {
  localStorage.setItem('decashift_onboarded', 'true');
  document.getElementById('welcome-modal').classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', init);
document.addEventListener('click', _closeAllGoalMenus);

// ── Dev quick-fill (localhost only) — Ctrl+Shift+D pre-fills signup/signin ───

if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') _devFill();
  });
}

function _devFill() {
  const g = id => document.getElementById(id);
  if (state.currentScreen === 'signup') {
    if (g('reg-name'))     g('reg-name').value     = 'Test User';
    if (g('reg-email'))    g('reg-email').value     = 'test@test.com';
    if (g('reg-mobile'))   g('reg-mobile').value    = '9876543210';
    if (g('reg-password')) g('reg-password').value  = 'test123';
    if (g('reg-confirm'))  g('reg-confirm').value   = 'test123';
    if (g('reg-grade'))  { g('reg-grade').value = '6'; g('reg-grade').dispatchEvent(new Event('change')); }
    if (g('reg-role'))     g('reg-role').value      = 'software-engineer';
  }
  if (state.currentScreen === 'signin') {
    if (g('si-email'))    g('si-email').value    = 'test@test.com';
    if (g('si-password')) g('si-password').value = 'test123';
  }
}
