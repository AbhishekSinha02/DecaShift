// app-settings.js — Settings: 5-tile menu + sub-screen navigation

// ── Menu Navigation ───────────────────────────────────────────────────────────

async function _ensureSettingsInDOM() {
  if (document.getElementById('settings-modal')) return;
  const urls = [
    _rawUrl('app/ui/screens/screen-settings.html'),
    'screens/screen-settings.html'
  ];
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (r.ok) { document.body.insertAdjacentHTML('beforeend', await r.text()); return; }
    } catch (_) {}
  }
}

async function openSettings() {
  await _ensureSettingsInDOM();
  document.getElementById('user-menu').classList.add('hidden');
  backToSettingsMenu();
  document.getElementById('settings-modal').classList.remove('hidden');
}

function closeSettings() {
  document.getElementById('settings-modal').classList.add('hidden');
}

function openSettingsSection(name) {
  document.querySelectorAll('.settings-sub').forEach(s => s.classList.add('hidden'));
  document.getElementById('settings-menu').classList.add('hidden');
  const sub = document.getElementById('settings-sub-' + name);
  if (!sub) return;
  sub.classList.remove('hidden');

  if (name === 'profile')    _initProfileSection();
  if (name === 'appearance') _renderThemeSelector();
  if (name === 'learning')   _initLearningSection();
  if (name === 'security')   _initSecuritySection();
  if (name === 'plan')       _initPlanSection();
}

function backToSettingsMenu() {
  document.querySelectorAll('.settings-sub').forEach(s => s.classList.add('hidden'));
  const menu = document.getElementById('settings-menu');
  if (menu) menu.classList.remove('hidden');
}

// ── Profile Sub-screen ────────────────────────────────────────────────────────

function _initProfileSection() {
  const user = state.user;
  if (!user) return;

  const nameEl = document.getElementById('settings-name');
  if (nameEl) nameEl.value = user.name || '';

  const isSchool = user.category === 'school';
  const isPro    = user.category === 'professional';
  document.getElementById('settings-school-fields')?.classList.toggle('hidden', !isSchool);
  document.getElementById('settings-pro-fields')?.classList.toggle('hidden', !isPro);

  if (isSchool) {
    const gradeEl = document.getElementById('settings-grade');
    if (gradeEl) {
      gradeEl.value = String(user.grade ?? '');
      document.getElementById('settings-college-group')
        ?.classList.toggle('hidden', gradeEl.value !== 'college');
    }
    const courseEl = document.getElementById('settings-course');
    if (courseEl) courseEl.value = user.course || '';
  }
  if (isPro) {
    const roleEl    = document.getElementById('settings-role');
    const companyEl = document.getElementById('settings-company');
    if (roleEl)    roleEl.value    = user.role    || '';
    if (companyEl) companyEl.value = user.company || '';
  }

  ['settings-profile-err', 'settings-profile-ok'].forEach(id => {
    const el = document.getElementById(id); if (el) el.textContent = '';
  });
}

async function saveProfileEdit() {
  const errEl = document.getElementById('settings-profile-err');
  const okEl  = document.getElementById('settings-profile-ok');
  if (errEl) errEl.textContent = '';
  if (okEl)  okEl.textContent  = '';

  const user    = state.user;
  const nameEl  = document.getElementById('settings-name');
  const newName = nameEl ? nameEl.value.trim() : '';
  if (!newName) { if (errEl) errEl.textContent = 'Name cannot be empty.'; return; }

  user.name = newName;

  if (user.category === 'school') {
    const gradeEl  = document.getElementById('settings-grade');
    const newGrade = gradeEl ? gradeEl.value : '';
    if (!newGrade) { if (errEl) errEl.textContent = 'Select a grade.'; return; }
    user.grade = newGrade;
    user.course = newGrade === 'college'
      ? (document.getElementById('settings-course')?.value || null)
      : null;
  } else if (user.category === 'professional') {
    const roleEl    = document.getElementById('settings-role');
    const companyEl = document.getElementById('settings-company');
    user.role    = roleEl    ? roleEl.value.trim()    : user.role;
    user.company = companyEl ? companyEl.value.trim() : user.company;
  }

  Storage.saveUser(user);
  state.user = user;

  sessionStorage.removeItem('ds_manifest_cache');
  await _loadManifest();
  await _loadQuestionsForUser(user);
  _renderHome();

  if (okEl) okEl.textContent = 'Saved ✓';
  Storage.syncUserToRemote(user).catch(() => {});
}

// ── Learning Sub-screen ───────────────────────────────────────────────────────

function _initLearningSection() {
  const langEl = document.getElementById('settings-regional-lang');
  if (langEl && state.user) langEl.value = state.user.regionalLanguage || '';
}

async function saveRegionalLanguage() {
  const langEl = document.getElementById('settings-regional-lang');
  const lang   = langEl ? langEl.value : '';
  const user   = state.user;
  user.regionalLanguage = lang || null;
  Storage.saveUser(user);
  state.user = user;
  sessionStorage.removeItem('ds_manifest_cache');
  await _loadManifest();
  await _loadQuestionsForUser(user);
  closeSettings();
  _renderHome();
}

// ── Security Sub-screen ───────────────────────────────────────────────────────

function _initSecuritySection() {
  const emailEl = document.getElementById('settings-email-display');
  if (emailEl && state.user) emailEl.textContent = state.user.email || '—';
  ['settings-pw-err', 'settings-pw-ok'].forEach(id => {
    const el = document.getElementById(id); if (el) el.textContent = '';
  });
  ['settings-current-pw', 'settings-new-pw', 'settings-confirm-pw'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
}

async function saveNewPassword() {
  const current = document.getElementById('settings-current-pw').value;
  const newPw   = document.getElementById('settings-new-pw').value;
  const confirm = document.getElementById('settings-confirm-pw').value;
  const errEl   = document.getElementById('settings-pw-err');
  const okEl    = document.getElementById('settings-pw-ok');
  if (errEl) errEl.textContent = '';
  if (okEl)  okEl.textContent  = '';

  if (!current)          { if (errEl) errEl.textContent = 'Enter your current password.'; return; }
  if (newPw.length < 6)  { if (errEl) errEl.textContent = 'New password must be at least 6 characters.'; return; }
  if (newPw !== confirm) { if (errEl) errEl.textContent = 'Passwords do not match.'; return; }

  const user        = state.user;
  const account     = Storage.findAccount(user.email);
  const currentHash = await Storage.hashPassword(current);
  if (!account || currentHash !== account.passwordHash) {
    if (errEl) errEl.textContent = 'Current password is incorrect.';
    return;
  }

  const newHash = await Storage.hashPassword(newPw);
  Storage.saveAccount(user.email, newHash, user.userId, user);
  if (okEl) okEl.textContent = 'Password updated ✓';
  ['settings-current-pw', 'settings-new-pw', 'settings-confirm-pw'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
}

// ── My Plan Sub-screen ────────────────────────────────────────────────────────

function _initPlanSection() {
  const wrap = document.getElementById('plan-status-content');
  if (!wrap) return;
  const user    = state.user;
  const plan    = user?.plan || _checkTrialStatus(user);
  const daysLeft = typeof _trialDaysLeft === 'function' ? _trialDaysLeft(user) : 0;

  if (plan === 'pro') {
    wrap.innerHTML = `
      <div class="plan-status-card plan-active">
        <div class="plan-status-badge">✓ Pro</div>
        <p class="plan-status-msg">You have full access to all features.</p>
      </div>`;
    return;
  }

  if (plan === 'expired') {
    wrap.innerHTML = `
      <div class="plan-status-card plan-expired">
        <div class="plan-status-badge plan-expired-badge">Trial Ended</div>
        <p class="plan-status-msg">Your 30-day trial has ended. Sets 3–5 are locked.</p>
        <div class="plan-price-row">₹79<span>/month</span></div>
        <button class="btn btn-primary" onclick="_upgradeViaWhatsApp()">Upgrade to Pro →</button>
      </div>`;
    return;
  }

  wrap.innerHTML = `
    <div class="plan-status-card plan-trial">
      <div class="plan-status-badge plan-trial-badge">Trial · ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left</div>
      <p class="plan-status-msg">Full access to all features during your trial.</p>
      <div class="plan-trial-bar-wrap">
        <div class="plan-trial-bar" style="width:${Math.round((1 - daysLeft / 30) * 100)}%"></div>
      </div>
      <p class="plan-trial-note">${30 - daysLeft} of 30 trial days used</p>
      <div class="plan-price-row">₹79<span>/month</span> after trial</div>
      <button class="btn btn-primary" onclick="_upgradeViaWhatsApp()">Upgrade early →</button>
    </div>`;
}

function _upgradeViaWhatsApp() {
  const msg = encodeURIComponent('Hi, I want to upgrade to Donnibo Pro (₹79/month)');
  window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
}
