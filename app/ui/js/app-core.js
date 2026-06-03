// app-core.js — Bootstrap, state, theme, manifest, question loading, shared utilities

// Build stamp — bump together with the ?v= query strings in index.html. Lets us
// confirm which code is actually live (stale CDN/browser cache vs latest deploy):
// open DevTools console → look for this line, or type DONNIBO_BUILD.
const BUILD = '20260603a';
window.DONNIBO_BUILD = BUILD;
console.log('%cDonnibo build ' + BUILD, 'color:#3b82f6;font-weight:bold');

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
  subjectFilter: 'daily-sprint',
  showArchivedGoals: false,
  showLastWeekSection: false,
  showAllTopics: false,
  lazyMode: false,              // FEAT-003: graded-school users load subjects on demand
  loadedFiles: new Set(),       // question files already fetched this session
  loadedSubjects: new Set()     // subjects whose full shelves are loaded
};

// ── User Menu ─────────────────────────────────────────────────────────────────

function toggleUserMenu() {
  document.getElementById('user-menu').classList.toggle('hidden');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.avatar-ring-wrap') && !e.target.closest('.user-menu')) {
    const m = document.getElementById('user-menu');
    if (m) m.classList.add('hidden');
  }
});

// Desktop: convert vertical wheel to horizontal scroll for shelves/tabs on the
// home screen. Guard: only active on 'home' so landing/auth screens scroll freely.
document.addEventListener('wheel', e => {
  if (state.currentScreen !== 'home') return;
  const sc = e.target.closest && e.target.closest('.netflix-cards, .subject-tabs, .subj-track');
  if (!sc || sc.scrollWidth <= sc.clientWidth) return;
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;   // trackpad already horizontal
  const atStart = sc.scrollLeft <= 0;
  const atEnd   = sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 1;
  if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;  // edge → let page scroll
  sc.scrollLeft += e.deltaY;
  e.preventDefault();
}, { passive: false });

// Netflix-style shelf arrows: click scrolls ~one viewport of cards. Visibility
// (.scrollable/.at-start/.at-end) is maintained by _initShelfArrows in app-home.
document.addEventListener('click', e => {
  const arrow = e.target.closest && e.target.closest('.shelf-arrow');
  if (!arrow) return;
  const cards = arrow.closest('.shelf')?.querySelector('.netflix-cards');
  if (!cards) return;
  const dist = Math.max(200, Math.round(cards.clientWidth * 0.85));
  cards.scrollBy({ left: arrow.classList.contains('shelf-arrow-left') ? -dist : dist, behavior: 'smooth' });
});

window.addEventListener('resize', () => {
  if (typeof _updateShelf === 'function') document.querySelectorAll('.shelf').forEach(_updateShelf);
});

// ── Bootstrap ─────────────────────────────────────────────────────────────────

function _checkTrialStatus(user) {
  const TRIAL_DAYS = 30;
  if (!user) return 'active';
  if (user.plan === 'pro') return 'active';
  if (!user.trialStartDate) return 'active';
  const elapsed = (Date.now() - new Date(user.trialStartDate)) / 86400000;
  return elapsed < TRIAL_DAYS ? 'active' : 'expired';
}

function _trialDaysLeft(user) {
  if (!user?.trialStartDate) return 30;
  const elapsed = (Date.now() - new Date(user.trialStartDate)) / 86400000;
  return Math.max(0, Math.ceil(30 - elapsed));
}

async function init() {
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    _deferredInstallPrompt = e;
  });
  if (typeof Challenge !== 'undefined') Challenge.capture();  // E-013: stash ?ch= before routing
  _loadScreen('landing');
  _loadScreen('home');
  _loadScreen('paywall');
  _initTheme();
  await _loadManifest();
  const user = Storage.loadUser();
  if (user) {
    state.user = user;
    state.user.plan = _checkTrialStatus(user);
    await _loadCurriculum(user);
    if (state.user.plan === 'expired' && !sessionStorage.getItem('ds_paywall_dismissed')) {
      await _showScreen('paywall');
      _setupPaywall();
    } else {
      await _showScreen('home');
      _renderHome();
    }
  } else {
    await _showScreen('landing');
    _setupLanding();
  }
}

function _setupPaywall() {
  const daysEl = document.getElementById('paywall-days-used');
  if (daysEl && state.user?.trialStartDate) {
    const elapsed = Math.floor((Date.now() - new Date(state.user.trialStartDate)) / 86400000);
    daysEl.textContent = elapsed;
  }
  document.getElementById('paywall-upgrade-btn')?.addEventListener('click', () => {
    const msg = encodeURIComponent('Hi, I want to upgrade to Donnibo Pro (₹79/month)');
    window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
  });
}

async function _dismissPaywall() {
  sessionStorage.setItem('ds_paywall_dismissed', '1');
  await _showScreen('home');
  _renderHome();
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

  const fbBtn = document.getElementById('feedback-toggle-btn');
  if (fbBtn) {
    const on = (typeof Feedback !== 'undefined') ? Feedback.isEnabled() : true;
    fbBtn.textContent = on ? 'ON' : 'OFF';
    fbBtn.classList.toggle('on', on);
  }
}

function _toggleAvatar() {
  const current = localStorage.getItem('ds_avatar') !== 'false';
  localStorage.setItem('ds_avatar', current ? 'false' : 'true');
  _renderThemeSelector();
  _renderHome();
}

function _toggleFeedback() {
  if (typeof Feedback === 'undefined') return;
  const next = !Feedback.isEnabled();
  Feedback.setEnabled(next);
  if (next) Feedback.hit('tap');   // confirm with a tick when turning on
  _renderThemeSelector();
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
  const user      = Storage.loadUser() || state.user;
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

// Merge one fetched question-file's goal + questions into state.
function _ingestFile(file) {
  // Grade 9-12 files have weekNum but no weekDay and use a shared goalId (e.g.
  // "grade9-mathematics") across all weeks. Append the week so each weekly card
  // gets a unique ID and sessions are tracked per-week, not per-subject-ever.
  const goalId = (file.weekNum && !file.weekDay && file.goalId)
    ? file.goalId + '-w' + file.weekNum
    : file.goalId;
  state.goals.push({
    id: goalId, name: file.title || file.name, description: file.description || '',
    category: file.category, grade: file.grade ?? null,
    subject: file.subject, level: file.level, tags: file.tags || [],
    weekNum: file.weekNum || null, weekDay: file.weekDay || null,
    weekStart: file.weekStart || null, weekEnd: file.weekEnd || null
  });
  (file.questions || []).forEach(q => state.questions.push({ ...q, goalId }));
}

// Fetch + merge a set of manifest entries, skipping any file already loaded
// this session (state.loadedFiles dedupes across daily-sprint + lazy loads).
async function _ingestEntries(entries) {
  const fresh = entries.filter(e => !state.loadedFiles.has(e.file));
  if (!fresh.length) return;
  const files = await Promise.all(fresh.map(e => _fetchQuestionFile(e.file)));
  fresh.forEach((e, i) => {
    state.loadedFiles.add(e.file);
    if (files[i]) _ingestFile(files[i]);
  });
}

// Reset state and load just enough for the default view. School (graded) users
// get only today's Daily Sprint files up front — their subject shelves load when
// the tab is opened (FEAT-003). Everyone else loads their full (small) set.
async function _loadCurriculum(user) {
  state.loadedFiles       = new Set();
  state.loadedSubjects    = new Set();
  state._subjectLoads     = {};            // in-flight per-subject load promises
  state._prefetchScheduled = false;
  state.goals             = [];
  state.questions         = [];
  // Always land on Daily Sprint after a fresh load. Without this, a subjectFilter
  // left over in memory from a previous session (e.g. "mathematics") would point
  // the home at a subject whose files aren't loaded yet → blank home, wrong tab.
  state.subjectFilter     = 'daily-sprint';

  const graded = !!(user && user.category === 'school'
    && user.grade != null && user.grade !== 'college');
  state.lazyMode = graded;

  const entries = _filterManifest(state.manifest, user);
  if (graded) {
    const week     = _getISOWeek(new Date());
    const todayDay = ['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()];
    // Today's per-subject cards and today's GK live in currentWeek+todayDay files.
    await _ingestEntries(entries.filter(e => e.weekNum === week && e.weekDay === todayDay));
  } else {
    await _ingestEntries(entries);
  }
}

// FEAT-003: fetch + merge every file for one subject the first time its tab is
// opened. `subject` is the manifest subject key (e.g. "mathematics" or
// "regional-tamil"). No-op once loaded; concurrent calls (tab click + idle
// prefetch) share one in-flight promise so files are never fetched twice.
function _loadSubjectData(subject) {
  if (state.loadedSubjects.has(subject)) return Promise.resolve();
  state._subjectLoads = state._subjectLoads || {};
  if (state._subjectLoads[subject]) return state._subjectLoads[subject];
  const p = (async () => {
    const entries = _filterManifest(state.manifest, state.user).filter(e => e.subject === subject);
    await _ingestEntries(entries);
    state.loadedSubjects.add(subject);
  })().finally(() => { delete state._subjectLoads[subject]; });
  state._subjectLoads[subject] = p;
  return p;
}

// Premium "Netflix" loading: once the home is interactive, quietly hydrate the
// remaining subject shelves during browser idle time so opening a tab is instant
// instead of showing a skeleton. Non-blocking, low priority, runs once per load.
// Mathematics first (the default subject), then the rest, one at a time.
function _prefetchSubjectsIdle() {
  if (!state.lazyMode || !state.user) return;
  if (typeof window !== 'undefined' && window.__dsNoPrefetch) return;  // test seam
  // Respect Data Saver and slow links — keep pure lazy on metered/2G connections
  // (the ₹8,000-phone-on-4G case). Only background-hydrate when the link is fine.
  const conn = navigator.connection;
  if (conn && (conn.saveData || /(^|\b)(slow-)?2g$/.test(conn.effectiveType || ''))) return;

  const subjects = [...new Set(_filterManifest(state.manifest, state.user)
    .filter(e => e.subject && !e.subject.startsWith('regional-') && e.subject !== 'gk')
    .map(e => e.subject))]
    .filter(s => !state.loadedSubjects.has(s))
    .sort((a, b) => a === 'mathematics' ? -1 : b === 'mathematics' ? 1 : 0);

  const schedule = window.requestIdleCallback
    ? cb => window.requestIdleCallback(cb, { timeout: 2000 })
    : cb => setTimeout(cb, 300);

  const next = () => {
    const s = subjects.shift();
    if (!s) return;
    _loadSubjectData(s).finally(() => schedule(next));
  };
  schedule(next);
}

async function _fetchQuestionFile(filename) {
  // sessionStorage cache → instant on reload / re-sign-in within the same tab.
  const cacheKey = 'ds_qf_' + filename.replace(/[^a-z0-9]/gi, '_');
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (_) {}

  const urls = [
    _rawUrl('app/ui/questions/' + filename),
    'questions/' + filename
  ];
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (r.ok) {
        const data = await r.json();
        try { sessionStorage.setItem(cacheKey, JSON.stringify(data)); } catch (_) {/* quota — skip */}
        return data;
      }
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

const _screenHTML = {};

async function _loadScreen(name) {
  if (document.getElementById('screen-' + name)) return;
  if (!_screenHTML[name]) {
    // ?v=BUILD busts stale CDN/raw caches so screen HTML changes ship on deploy.
    const urls = [
      _rawUrl('app/ui/screens/screen-' + name + '.html') + '?v=' + BUILD,
      'screens/screen-' + name + '.html?v=' + BUILD
    ];
    for (const url of urls) {
      try {
        const r = await fetch(url);
        if (r.ok) { _screenHTML[name] = await r.text(); break; }
      } catch (_) {}
    }
  }
  if (_screenHTML[name]) {
    document.body.insertAdjacentHTML('beforeend', _screenHTML[name]);
  }
}

// E-009: tiny nav stack → infer forward/back direction for screen transitions
let _navStack = [];
function _navDirection(name) {
  const idx = _navStack.indexOf(name);
  if (idx >= 0) { _navStack = _navStack.slice(0, idx + 1); return 'back'; }
  _navStack.push(name);
  return 'forward';
}

async function _showScreen(name) {
  await _loadScreen(name);
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active', 'nav-forward', 'nav-back'));
  const el = document.getElementById('screen-' + name);
  if (el) {
    const dir = _navDirection(name);
    el.classList.add('active', dir === 'back' ? 'nav-back' : 'nav-forward');
  }
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
  if (localStorage.getItem('decashift_onboarded')) return;
  if (!document.getElementById('welcome-modal')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div id="welcome-modal" class="modal-overlay hidden" onclick="if(event.target===this)dismissWelcome()">
        <div class="modal-box">
          <img src="assets/icon.svg" class="modal-logo" alt="Donnibo">
          <h2 class="modal-title">Welcome to Donnibo!</h2>
          <p class="modal-sub">Here's how it works:</p>
          <ul class="modal-steps">
            <li><span>✅</span> Pick a goal → answer questions → see your score</li>
            <li><span>🔥</span> Come back daily to build your practice</li>
            <li><span>📈</span> Watch your accuracy grow over time</li>
          </ul>
          <button class="btn btn-primary btn-full" onclick="dismissWelcome()">Let's Go! →</button>
        </div>
      </div>`);
  }
  document.getElementById('welcome-modal').classList.remove('hidden');
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
  if (!document.getElementById('install-banner')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div id="install-banner" class="install-banner hidden">
        <div class="install-banner-inner">
          <div class="install-banner-text">
            <span class="install-banner-icon">📲</span>
            <div>
              <div class="install-banner-title">Add Donnibo to your home screen</div>
              <div class="install-banner-sub">One tap — open instantly, anytime</div>
            </div>
          </div>
          <div class="install-banner-actions">
            <button class="btn btn-primary btn-sm" onclick="_onInstallAccepted()">Install</button>
            <button class="btn btn-ghost btn-sm"   onclick="_onInstallDismissed()">Not now</button>
          </div>
        </div>
      </div>`);
  }
  document.getElementById('install-banner').classList.remove('hidden');
}

function _hideInstallBanner() {
  document.getElementById('install-banner')?.classList.add('hidden');
}

function _ensureIOSModal() {
  if (document.getElementById('ios-install-modal')) return;
  document.body.insertAdjacentHTML('beforeend', `
    <div id="ios-install-modal" class="modal-overlay hidden" onclick="if(event.target===this)dismissIOSGuide()">
      <div class="modal-box ios-guide-box">
        <div class="ios-guide-title">📲 Add to your Home Screen</div>
        <ol class="ios-guide-steps">
          <li>Tap the <strong>Share button</strong> <span class="ios-share-icon">⬆</span><br><span class="ios-guide-hint">Bottom centre of Safari</span></li>
          <li>Scroll down and tap<br><strong>"Add to Home Screen"</strong></li>
          <li>Tap <strong>"Add"</strong> in the top right</li>
        </ol>
        <p class="ios-guide-result">Donnibo will appear as an app on your home screen!</p>
        <button class="btn btn-primary btn-full" onclick="dismissIOSGuide()">Got it</button>
      </div>
    </div>`);
}

function _showIOSGuide() {
  if (localStorage.getItem('ds_ios_guide_shown')) return;
  _ensureIOSModal();
  document.getElementById('ios-install-modal').classList.remove('hidden');
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
    _ensureIOSModal();
    document.getElementById('ios-install-modal').classList.remove('hidden');
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
