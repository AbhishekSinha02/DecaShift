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
  showArchivedGoals: false,
  showLastWeekSection: false
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

const THEMES = [
  { id: 'dawnbreak', name: 'Dawnbreak', tag: 'Grade 2–8', bg: '#1a1040', accent: '#fbbf24' },
  { id: 'sunrise',   name: 'Sunrise',   tag: 'Light',     bg: '#fffbf0', accent: '#f59e0b' },
  { id: 'ocean',     name: 'Ocean',     tag: 'Grade 9–12',bg: '#0f172a', accent: '#38bdf8' },
  { id: 'dark',      name: 'Dark',      tag: 'Default',   bg: '#0f1117', accent: '#3b82f6' },
  { id: 'light',     name: 'Light',     tag: 'Classic',   bg: '#f8fafc', accent: '#3b82f6' },
];

function _initTheme() {
  const theme = localStorage.getItem('decashift_theme') || 'dark';
  document.documentElement.dataset.theme = theme;
}

function _setTheme(name) {
  document.documentElement.dataset.theme = name;
  localStorage.setItem('decashift_theme', name);
  _renderThemeSelector();
}

function _autoApplyTheme(grade) {
  if (localStorage.getItem('decashift_theme')) return; // respect existing choice
  const g    = parseInt(grade, 10);
  const auto = (g >= 2 && g <= 8) ? 'dawnbreak'
             : (g >= 9)           ? 'ocean'
             :                      'dark';
  _setTheme(auto);
}

function _renderThemeSelector() {
  const container = document.getElementById('theme-tiles');
  if (!container) return;
  const current = document.documentElement.dataset.theme || 'dark';
  container.innerHTML = THEMES.map(t => `
    <div class="theme-tile${t.id === current ? ' active' : ''}"
         onclick="_setTheme('${t.id}')" title="${t.name}">
      <div class="theme-tile-swatch"
           style="background:${t.bg};border-color:${t.accent}"></div>
      <span class="theme-tile-name">${t.name}</span>
      <span class="theme-tile-tag">${t.tag}</span>
    </div>`).join('');

  const avatarBtn = document.getElementById('avatar-toggle-btn');
  if (avatarBtn) {
    const on = localStorage.getItem('ds_avatar') !== 'false';
    avatarBtn.textContent = on ? 'ON' : 'OFF';
    avatarBtn.classList.toggle('on', on);
  }
}

function _toggleAvatar() {
  const current = localStorage.getItem('ds_avatar') !== 'false';
  localStorage.setItem('ds_avatar', current ? 'false' : 'true');
  _renderThemeSelector();
  _renderHome();
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
      subject: file.subject, level: file.level, tags: file.tags || [],
      weekNum: file.weekNum || null, weekDay: file.weekDay || null,
      weekStart: file.weekStart || null, weekEnd: file.weekEnd || null
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
  if (!cat) return [];
  if (cat === 'school') {
    if (user.grade === 'college') return manifest.filter(e => e.category === 'college');
    const grade = parseInt(user.grade, 10);
    const lang  = user.regionalLanguage || '';
    return manifest.filter(e => {
      if (e.category !== 'school') return false;
      if (e.subject && e.subject.startsWith('regional-')) {
        return lang && e.subject === 'regional-' + lang;
      }
      return e.grade === grade || e.grade === null;
    });
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

  let grade = null, course = null, role = null, company = null, regionalLanguage = null;
  if (category === 'school') {
    grade = document.getElementById('reg-grade').value;
    if (!grade) { _showError('err-grade', 'Select your grade'); valid = false; }
    if (grade === 'college') {
      course = document.getElementById('reg-course').value;
      if (!course) { _showError('err-course', 'Select your course'); valid = false; }
    }
    const langEl = document.getElementById('reg-regional-lang');
    if (langEl && langEl.value) regionalLanguage = langEl.value;
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
    grade:            grade            || null,
    course:           course           || null,
    role:             role             || null,
    company:          company          || null,
    regionalLanguage: regionalLanguage || null,
    registeredAt
  };

  Storage.saveAccount(email, passwordHash, userId, user);
  Storage.saveUser(user);
  state.user = user;

  await _loadQuestionsForUser(user);
  _autoApplyTheme(user.grade);

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

  const currentWeek  = _getISOWeek(new Date());
  const regularGoals = state.goals.filter(g => !g.weekNum && !(g.subject && g.subject.startsWith('regional-')));
  const weeklyGoals  = state.goals.filter(g => g.weekNum);
  const regionalLang = user.regionalLanguage;
  const regionalGoals = regionalLang
    ? state.goals.filter(g => g.subject === 'regional-' + regionalLang)
    : [];

  const list = document.getElementById('goals-list');
  if (!list) return;

  // ── Subject tabs ─────────────────────────────────────────────────────────
  const tabsEl   = document.getElementById('subject-tabs');
  const isSchool = user.category === 'school';
  if (tabsEl) {
    const rawSubjects = isSchool ? [...new Set([...regularGoals, ...weeklyGoals].map(g => g.subject))] : [];
    const subjects = rawSubjects.slice().sort((a, b) =>
      a === 'mathematics' ? -1 : b === 'mathematics' ? 1 : 0
    );
    const hasRegionalTab = isSchool && regionalGoals.length > 0;
    const subjectLabels = {
      'mathematics': 'Math', 'science': 'Science', 'hindi': 'Hindi',
      'french': 'French', 'computer-science': 'CS', 'web-dev': 'Web Dev', 'dsa': 'DSA',
      'physics': 'Physics', 'chemistry': 'Chemistry', 'biology': 'Biology',
      'english': 'English', 'social-science': 'Soc. Sci.'
    };
    const langLabel = { sanskrit: 'Sanskrit', marathi: 'Marathi', tamil: 'Tamil',
                        telugu: 'Telugu', punjabi: 'Punjabi', malayalam: 'Malayalam' };
    const allTabs = subjects.length > 0
      ? [...subjects, ...(hasRegionalTab ? [regionalLang] : []), 'all']
      : [];
    if (state.subjectFilter === 'all' && subjects.includes('mathematics')) {
      state.subjectFilter = 'mathematics';
    }

    if (allTabs.length > 1) {
      tabsEl.style.display = 'flex';
      tabsEl.innerHTML = allTabs.map(s => {
        const isRegTab = hasRegionalTab && s === regionalLang;
        const label    = s === 'all' ? 'All'
          : isRegTab ? (langLabel[s] || _cap(s))
          : (subjectLabels[s] || _cap(s));
        const active = state.subjectFilter === s ? ' active' : '';
        return `<button class="subject-tab${active}${isRegTab ? ' regional-tab' : ''}" data-subject="${s}" onclick="_setSubjectFilter('${s}')">${label}</button>`;
      }).join('');
    } else {
      tabsEl.style.display = 'none';
    }
  }

  // ── Determine which goals to show for this tab ───────────────────────────
  const isRegionalTab = isSchool && regionalLang && state.subjectFilter === regionalLang;

  if (isRegionalTab) {
    // Regional language tab — show only regional goals
    const cards = regionalGoals.map(g => {
      const count = state.questions.filter(q => q.goalId === g.id).length;
      const last  = Storage.getLastSessionForGoal(g.id);
      const score = last ? last.score + '/' + last.total : null;
      const done  = last && last.accuracy >= 1;
      return `
        <div class="goal-card${done ? ' archived' : ''}" id="goal-card-${g.id}">
          <div class="goal-info">
            <h3 class="goal-name">${_esc(g.name)}${done ? ' ✅' : ''}</h3>
            <p class="goal-desc">${_esc(g.description)}</p>
            <div class="goal-meta">
              <span>${count} question${count !== 1 ? 's' : ''}</span>
              ${score ? `<span class="goal-last-score">Last: ${score}</span>` : ''}
            </div>
          </div>
          <div class="goal-actions">
            <button class="btn btn-primary btn-sm" onclick="startGoal('${g.id}')">${last ? 'Retry' : 'Start'}</button>
          </div>
        </div>`;
    }).join('');
    list.innerHTML = cards || '<p class="text-muted">No content found for this language.</p>';
    return;
  }

  // ── Filter regular + weekly goals for current subject tab ─────────────────
  const subFiltered = state.subjectFilter === 'all'
    ? regularGoals
    : regularGoals.filter(g => g.subject === state.subjectFilter);

  const weeklyFiltered = state.subjectFilter === 'all'
    ? weeklyGoals
    : weeklyGoals.filter(g => g.subject === state.subjectFilter);

  const thisWeekGoals = weeklyFiltered
    .filter(g => g.weekNum === currentWeek)
    .sort((a, b) => _dayOrder(a.weekDay) - _dayOrder(b.weekDay));

  const lastWeekGoals = weeklyFiltered
    .filter(g => g.weekNum === currentWeek - 1)
    .sort((a, b) => _dayOrder(a.weekDay) - _dayOrder(b.weekDay));

  const archivedSet   = new Set(user.archivedGoals || []);
  const activeGoals   = subFiltered.filter(g => !archivedSet.has(g.id));
  const archivedGoals = subFiltered.filter(g =>  archivedSet.has(g.id));

  if (!thisWeekGoals.length && !lastWeekGoals.length && !activeGoals.length && !archivedGoals.length) {
    const msg = !user.category
      ? '<p class="text-muted">Your profile is incomplete. <button class="link-btn" onclick="openEditProfile()">Complete your profile</button> to see your goals.</p>'
      : '<p class="text-muted">No goals found for your profile. More content coming soon!</p>';
    list.innerHTML = msg;
    return;
  }

  // ── This Week day-cards ───────────────────────────────────────────────────
  let html = '';

  if (thisWeekGoals.length) {
    html += `<div class="week-section-header"><span class="week-badge active-week">This Week</span></div>`;
    html += `<div class="day-cards-grid">${thisWeekGoals.map(_dayCardHtml).join('')}</div>`;
  }

  // ── Last Week collapsible ─────────────────────────────────────────────────
  if (lastWeekGoals.length) {
    const isOpen = state.showLastWeekSection;
    html += `
      <button class="archived-toggle" onclick="_toggleLastWeekSection()">
        ${isOpen ? '▲' : '▼'} Last Week (${lastWeekGoals.length})
      </button>
      <div class="day-cards-grid last-week-section" style="display:${isOpen ? 'flex' : 'none'}">
        ${lastWeekGoals.map(g => _dayCardHtml(g, true)).join('')}
      </div>`;
  }

  // ── Regular practice goals ────────────────────────────────────────────────
  if (thisWeekGoals.length || lastWeekGoals.length) {
    html += `<div class="week-section-header practice-header"><span class="week-badge practice-badge">Practice Sets</span></div>`;
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

  html += activeGoals.length
    ? activeGoals.map(g => _cardHtml(g, false)).join('')
    : (subFiltered.length > 0 ? '<p class="text-muted" style="padding:8px 0">All sets marked as done.</p>' : '');

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

// ── Weekly day-card helpers ───────────────────────────────────────────────

const _DAY_ORDER = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4 };
const _DAY_LABEL = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri' };

function _dayOrder(day) { return _DAY_ORDER[day] ?? 99; }

function _cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function _getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function _dayCardHtml(goal, isPast) {
  const count    = state.questions.filter(q => q.goalId === goal.id).length;
  const last     = Storage.getLastSessionForGoal(goal.id);
  const score    = last ? last.score + '/' + last.total : null;
  const done     = last && last.accuracy >= 1;
  const dayNum   = (_DAY_ORDER[goal.weekDay] ?? 0) + 1;
  const dayLabel = _DAY_LABEL[goal.weekDay] || goal.weekDay;
  const metaLabel = goal.weekDay ? `Day ${dayNum} · ${dayLabel}` : `Week ${goal.weekNum}`;
  return `
    <div class="day-card${done ? ' done' : ''}${isPast ? ' past' : ''}">
      <div class="day-card-meta">${metaLabel}</div>
      <div class="day-card-title">${_esc(goal.name)}</div>
      <div class="day-card-desc">${_esc(goal.description)}</div>
      <div class="day-card-footer">
        <span class="day-card-count">${count} Q${score ? ' · ' + score : ''}</span>
        <button class="btn btn-primary btn-sm" onclick="startGoal('${goal.id}')">${done ? 'Redo' : last ? 'Continue' : 'Start'}</button>
      </div>
    </div>`;
}

function _toggleLastWeekSection() {
  state.showLastWeekSection = !state.showLastWeekSection;
  _renderHome();
}

// ── Settings Modal ────────────────────────────────────────────────────────

function openSettings() {
  document.getElementById('user-menu').classList.add('hidden');
  const modal = document.getElementById('settings-modal');
  if (!modal) return;
  const user = state.user;

  // Pre-fill profile fields
  const nameEl = document.getElementById('settings-name');
  if (nameEl) nameEl.value = user.name || '';

  const isSchool = user.category === 'school';
  const isPro    = user.category === 'professional';
  const schoolEl = document.getElementById('settings-school-fields');
  const proEl    = document.getElementById('settings-pro-fields');
  if (schoolEl) schoolEl.classList.toggle('hidden', !isSchool);
  if (proEl)    proEl.classList.toggle('hidden',    !isPro);

  if (isSchool) {
    const gradeEl = document.getElementById('settings-grade');
    if (gradeEl) gradeEl.value = user.grade || '';
    const colGroup = document.getElementById('settings-college-group');
    if (colGroup) colGroup.classList.toggle('hidden', user.grade !== 'college');
    const courseEl = document.getElementById('settings-course');
    if (courseEl) courseEl.value = user.course || '';
  }
  if (isPro) {
    const roleEl    = document.getElementById('settings-role');
    const companyEl = document.getElementById('settings-company');
    if (roleEl)    roleEl.value    = user.role    || '';
    if (companyEl) companyEl.value = user.company || '';
  }

  // Pre-fill regional language
  const langEl = document.getElementById('settings-regional-lang');
  if (langEl) langEl.value = user.regionalLanguage || '';

  // Clear status messages
  ['settings-profile-err', 'settings-profile-ok', 'settings-pw-err', 'settings-pw-ok'].forEach(id => {
    const el = document.getElementById(id); if (el) el.textContent = '';
  });

  _renderThemeSelector();
  modal.classList.remove('hidden');
}

function closeSettings() {
  document.getElementById('settings-modal').classList.add('hidden');
}

async function saveProfileEdit() {
  const errEl = document.getElementById('settings-profile-err');
  const okEl  = document.getElementById('settings-profile-ok');
  if (errEl) errEl.textContent = '';
  if (okEl)  okEl.textContent  = '';

  const user = state.user;
  const nameEl = document.getElementById('settings-name');
  const newName = nameEl ? nameEl.value.trim() : '';
  if (!newName) { if (errEl) errEl.textContent = 'Name cannot be empty.'; return; }

  user.name = newName;

  if (user.category === 'school') {
    const gradeEl = document.getElementById('settings-grade');
    const newGrade = gradeEl ? gradeEl.value : '';
    if (!newGrade) { if (errEl) errEl.textContent = 'Select a grade.'; return; }
    user.grade = newGrade;
    if (newGrade === 'college') {
      const courseEl = document.getElementById('settings-course');
      user.course = courseEl ? courseEl.value : null;
    } else {
      user.course = null;
    }
  } else if (user.category === 'professional') {
    const roleEl    = document.getElementById('settings-role');
    const companyEl = document.getElementById('settings-company');
    user.role    = roleEl    ? roleEl.value.trim()    : user.role;
    user.company = companyEl ? companyEl.value.trim() : user.company;
  }

  Storage.saveUser(user);
  state.user = user;

  // Reload goals for new grade/role (clears manifest session cache so new grade fetches correctly)
  sessionStorage.removeItem('ds_manifest_cache');
  await _loadQuestionsForUser(user);
  _renderHome();

  if (okEl) okEl.textContent = 'Profile saved.';

  // Sync to Drive silently
  Storage.syncUserToRemote(user).catch(() => {});
}

async function saveRegionalLanguage() {
  const langEl = document.getElementById('settings-regional-lang');
  const lang   = langEl ? langEl.value : '';
  const user   = state.user;
  user.regionalLanguage = lang || null;
  Storage.saveUser(user);
  state.user = user;
  sessionStorage.removeItem('ds_manifest_cache');
  await _loadQuestionsForUser(user);
  closeSettings();
  _renderHome();
}

async function saveNewPassword() {
  const current  = document.getElementById('settings-current-pw').value;
  const newPw    = document.getElementById('settings-new-pw').value;
  const confirm  = document.getElementById('settings-confirm-pw').value;
  const errEl    = document.getElementById('settings-pw-err');
  const okEl     = document.getElementById('settings-pw-ok');
  if (errEl) errEl.textContent = '';
  if (okEl)  okEl.textContent  = '';

  if (!current)           { if (errEl) errEl.textContent = 'Enter your current password.'; return; }
  if (newPw.length < 6)   { if (errEl) errEl.textContent = 'New password must be at least 6 characters.'; return; }
  if (newPw !== confirm)  { if (errEl) errEl.textContent = 'Passwords do not match.'; return; }

  const user        = state.user;
  const account     = Storage.findAccount(user.email);
  const currentHash = await Storage.hashPassword(current);
  if (!account || currentHash !== account.passwordHash) {
    if (errEl) errEl.textContent = 'Current password is incorrect.';
    return;
  }

  const newHash = await Storage.hashPassword(newPw);
  Storage.saveAccount(user.email, newHash, user.userId, user);
  if (okEl) okEl.textContent = 'Password updated successfully.';
  document.getElementById('settings-current-pw').value = '';
  document.getElementById('settings-new-pw').value     = '';
  document.getElementById('settings-confirm-pw').value = '';
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
