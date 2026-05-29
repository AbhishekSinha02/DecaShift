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
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    _deferredInstallPrompt = e;
  });
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

async function _fetchJSON(urls) {
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (r.ok) return r.json();
    } catch (_) {}
  }
  return null;
}

async function _loadManifest() {
  const cached = sessionStorage.getItem('ds_manifest_cache');
  if (cached) { state.manifest = JSON.parse(cached); return; }

  const index = await _fetchJSON([
    _rawUrl('app/ui/questions/manifests/manifest.json'),
    'questions/manifests/manifest.json'
  ]);
  if (!index) { console.error('[DecaShift] Failed to load manifest'); state.manifest = []; return; }

  // Legacy fallback: old array format
  if (Array.isArray(index)) {
    state.manifest = index;
    sessionStorage.setItem('ds_manifest_cache', JSON.stringify(index));
    return;
  }

  // v2 shard mode: fetch only the shards this user needs
  const user      = Storage.loadUser();
  const shardKeys = _getShardsForUser(user, index.shards);
  const arrays    = await Promise.all(
    shardKeys.map(k => _fetchJSON([
      _rawUrl('app/ui/questions/manifests/' + index.shards[k]),
      'questions/manifests/' + index.shards[k]
    ]))
  );
  state.manifest = arrays.flat().filter(Boolean);
  sessionStorage.setItem('ds_manifest_cache', JSON.stringify(state.manifest));
}

function _getShardsForUser(user, shards) {
  const keys = ['flash'];
  if (!user) return keys;
  const cat = user.category;
  if (cat === 'school') {
    const g = user.grade === 'college' ? 'college' : 'school-' + user.grade;
    if (shards[g])                                        keys.push(g);
    if (shards['regional'] && user.regionalLanguage)      keys.push('regional');
  } else if (cat === 'college') {
    if (shards['college'])                                keys.push('college');
  } else {
    if (shards['professional'])                           keys.push('professional');
  }
  return keys;
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

// ── PWA Install Prompt ────────────────────────────────────────────────────────

let _deferredInstallPrompt = null;

function _detectPlatform() {
  const ua = navigator.userAgent;
  return {
    isIOS:        /iPad|iPhone|iPod/.test(ua) && !window.MSStream,
    isAndroid:    /Android/.test(ua),
    isWindows:    /Windows/.test(ua),
    isStandalone: window.matchMedia('(display-mode: standalone)').matches
                  || window.navigator.standalone === true,
  };
}

function _shouldShowInstallPrompt() {
  const { isStandalone } = _detectPlatform();
  if (isStandalone) return false;
  const dismissed = localStorage.getItem('ds_install_dismissed');
  if (dismissed) {
    const daysSince = (Date.now() - Number(dismissed)) / 86400000;
    if (daysSince < 7) return false;
  }
  return Storage.loadSessions().length >= 3;
}

function _showInstallBanner() {
  document.getElementById('install-banner')?.classList.remove('hidden');
}

function _hideInstallBanner() {
  document.getElementById('install-banner')?.classList.add('hidden');
}

function _showIOSGuide() {
  if (localStorage.getItem('ds_ios_guide_shown')) return;
  document.getElementById('ios-install-modal')?.classList.remove('hidden');
}

function dismissIOSGuide() {
  localStorage.setItem('ds_ios_guide_shown', 'true');
  document.getElementById('ios-install-modal')?.classList.add('hidden');
}

function _onInstallAccepted() {
  _hideInstallBanner();
  if (!_deferredInstallPrompt) return;
  _deferredInstallPrompt.prompt();
  _deferredInstallPrompt.userChoice.then(choice => {
    if (choice.outcome === 'accepted') {
      const banner = document.getElementById('install-banner');
      if (banner) {
        banner.innerHTML = '<div class="install-banner-inner"><span style="font-size:20px">✅</span><span style="font-size:13px;color:var(--text);margin-left:10px">Donnibo is on your home screen! Open it anytime.</span></div>';
        banner.classList.remove('hidden');
        setTimeout(() => banner.classList.add('hidden'), 4000);
      }
    }
    _deferredInstallPrompt = null;
  });
}

function _onInstallDismissed() {
  localStorage.setItem('ds_install_dismissed', String(Date.now()));
  _hideInstallBanner();
}

function checkAndShowInstallPrompt() {
  if (!_shouldShowInstallPrompt()) return;
  const { isIOS } = _detectPlatform();
  if (isIOS) {
    setTimeout(_showIOSGuide, 1200);
  } else if (_deferredInstallPrompt) {
    setTimeout(_showInstallBanner, 1200);
  }
}

function _triggerInstallFromSettings() {
  const { isIOS, isStandalone } = _detectPlatform();
  if (isStandalone) {
    alert('Donnibo is already installed as an app on this device!');
    return;
  }
  if (isIOS) {
    closeSettings();
    document.getElementById('ios-install-modal')?.classList.remove('hidden');
  } else if (_deferredInstallPrompt) {
    closeSettings();
    _onInstallAccepted();
  }
}

function _showInstallGuide(platform, btn) {
  document.querySelectorAll('.install-guide').forEach(g => g.classList.add('hidden'));
  document.querySelectorAll('.install-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('install-guide-' + platform)?.classList.remove('hidden');
  if (btn) btn.classList.add('active');
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
