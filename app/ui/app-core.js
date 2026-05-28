// app-core.js — Bootstrap, state, theme, manifest, question loading, shared utilities

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

// ── Theme ─────────────────────────────────────────────────────────────────────

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
  if (localStorage.getItem('decashift_theme')) return;
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

// ── Shared Utilities ──────────────────────────────────────────────────────────

function _showError(id, msg) { const el = document.getElementById(id); if (el) el.textContent = msg; }
function _clearErrors()       { document.querySelectorAll('.field-error').forEach(el => el.textContent = ''); }
function _validEmail(v)        { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function _esc(str)             { return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function _getFirstName(user)   { if (!user) return 'there'; if (user.name) return user.name.split(' ')[0]; if (user.email) return user.email.split('@')[0]; return 'there'; }

// ── Welcome / Onboarding ──────────────────────────────────────────────────────

function _maybeShowWelcome() {
  if (!localStorage.getItem('decashift_onboarded')) {
    document.getElementById('welcome-modal').classList.remove('hidden');
  }
}

function dismissWelcome() {
  localStorage.setItem('decashift_onboarded', 'true');
  document.getElementById('welcome-modal').classList.add('hidden');
}

// ── Bootstrap Event + Dev Fill ────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', init);

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
