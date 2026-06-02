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

  // Show Back button in the pinned footer
  document.getElementById('settings-footer-back')?.classList.remove('hidden');

  // Scroll content back to top
  document.querySelector('.settings-modal-content')?.scrollTo({ top: 0 });

  if (name === 'profile')    _initProfileSection();
  if (name === 'appearance') _renderThemeSelector();
  if (name === 'learning')   _initLearningSection();
  if (name === 'security')   _initSecuritySection();
  if (name === 'plan')       _initPlanSection();
  if (name === 'progress')   _initProgressSection();
}

function backToSettingsMenu() {
  document.querySelectorAll('.settings-sub').forEach(s => s.classList.add('hidden'));
  const menu = document.getElementById('settings-menu');
  if (menu) menu.classList.remove('hidden');

  // Hide Back button; Close is always visible
  document.getElementById('settings-footer-back')?.classList.add('hidden');

  // Scroll content back to top
  document.querySelector('.settings-modal-content')?.scrollTo({ top: 0 });
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
  await _loadCurriculum(user);
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
  await _loadCurriculum(user);
  closeSettings();
  _renderHome();
}

// ── Security Sub-screen ───────────────────────────────────────────────────────

function _initSecuritySection() {
  // FEAT-002: login key is the User ID (loginId), not email. Fall back to legacy
  // email only for pre-migration accounts that never had a loginId.
  const idEl = document.getElementById('settings-loginid-display');
  if (idEl && state.user) idEl.textContent = state.user.loginId || state.user.email || '—';
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
  const loginId     = user.loginId || user.email;   // login key (FEAT-002), legacy email fallback
  const account     = loginId ? Storage.findAccount(loginId) : null;
  const currentHash = await Storage.hashPassword(current);
  if (!account || currentHash !== account.passwordHash) {
    if (errEl) errEl.textContent = 'Current password is incorrect.';
    return;
  }

  const newHash = await Storage.hashPassword(newPw);
  Storage.saveAccount(loginId, newHash, user.userId, user);
  // Propagate the new hash to Drive with the FULL account record (same shape as
  // signup) so cross-device sign-in uses the new password and the profile is not
  // clobbered by a partial write.
  Storage.syncAccountToDrive({
    loginId, passwordHash: newHash, userId: user.userId,
    name: user.name, category: user.category, grade: user.grade,
    course: user.course, role: user.role, company: user.company,
    registeredAt: user.registeredAt, streak: Storage.loadStreak()
  }).catch(() => {});
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

// ── D-016: My Progress Sub-screen ────────────────────────────────────────────

function _initProgressSection() {
  const wrap = document.getElementById('progress-content');
  if (!wrap || !state.user) return;

  const allSessions = Storage.loadSessions();
  const streak      = Storage.loadStreak();
  const name        = _getFirstName(state.user);
  const grade       = state.user.grade ? 'Grade ' + state.user.grade : '';

  const weekNum = (() => {
    const d = new Date(); const day = d.getDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day);
    const y = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - y) / 86400000) + 1) / 7);
  })();
  const weekStart = (() => {
    const now = new Date();
    const day = now.getDay(); const ms = 864e5;
    const mon = new Date(now - ((day === 0 ? 6 : day - 1) * ms + now % ms));
    mon.setHours(0,0,0,0); return mon;
  })();
  const weekEnd = new Date(weekStart.getTime() + 7 * 864e5);
  const prevStart = new Date(weekStart.getTime() - 7 * 864e5);

  const thisSessions = allSessions.filter(s => {
    const d = new Date(s.sessionStart); return d >= weekStart && d < weekEnd;
  });
  const prevSessions = allSessions.filter(s => {
    const d = new Date(s.sessionStart); return d >= prevStart && d < weekStart;
  });

  const subjects = [...new Set(state.goals.filter(g => g.subject && g.subject !== 'gk').map(g => g.subject))];
  const days = thisSessions.map(s => new Date(s.sessionEnd).toDateString());
  const practicedDays = new Set(days).size;

  const subjectRows = subjects.map(sub => {
    const subGoalIds = new Set(state.goals.filter(g => g.subject === sub).map(g => g.id));
    const thisSub = thisSessions.filter(s => subGoalIds.has(s.goalId));
    const prevSub = prevSessions.filter(s => subGoalIds.has(s.goalId));
    if (!thisSub.length && !prevSub.length) return '';
    const thisAcc = thisSub.length ? Math.round(thisSub.reduce((a, r) => a + (r.accuracy ?? 0), 0) / thisSub.length * 100) : null;
    const prevAcc = prevSub.length ? Math.round(prevSub.reduce((a, r) => a + (r.accuracy ?? 0), 0) / prevSub.length * 100) : null;
    const style   = (typeof SUBJECT_STYLE !== 'undefined' && SUBJECT_STYLE[sub]) || { icon: '📚' };
    const label   = sub.charAt(0).toUpperCase() + sub.slice(1).replace(/-/g, ' ');
    const arrow   = (thisAcc !== null && prevAcc !== null) ? (thisAcc > prevAcc ? ` ↑${thisAcc - prevAcc}%` : thisAcc < prevAcc ? ` ↓${prevAcc - thisAcc}%` : ' →') : '';
    const accStr  = thisAcc !== null ? `${thisAcc}%${arrow}` : '—';
    const prevStr = prevAcc !== null ? `${prevAcc}%` : 'No data';
    return `<div class="progress-subject-row">
      <span class="progress-subject-name">${style.icon} ${label}</span>
      <span class="progress-subject-this">${accStr}</span>
      <span class="progress-subject-prev">${prevStr} last week</span>
    </div>`;
  }).filter(Boolean).join('');

  const conceptsDone = [...new Set(thisSessions.map(s => {
    const g = state.goals.find(g => g.id === s.goalId);
    return g?.conceptId || g?.name || '';
  }))].filter(Boolean).join(', ');

  wrap.innerHTML = `
    <div class="progress-week-card">
      <div class="progress-week-header">Week ${weekNum} · ${practicedDays} of 7 days practiced</div>
      ${subjectRows || '<p class="text-muted" style="font-size:13px">No sessions this week yet.</p>'}
    </div>
    ${conceptsDone ? `<p class="progress-concepts">Concepts this week: <strong>${_esc(conceptsDone)}</strong></p>` : ''}
    <div class="progress-streak-line">🔥 ${streak.current} day run &nbsp;·&nbsp; Best: ${streak.best} days</div>
    <button class="btn btn-share btn-full" style="margin-top:16px" onclick="_shareWeekProgress(${weekNum})">
      Share Week ${weekNum} Report →
    </button>`;
}

function _shareWeekProgress(weekNum) {
  if (!state.user) return;
  const allSessions  = Storage.loadSessions();
  const name         = _getFirstName(state.user);
  const grade        = state.user.grade ? 'Grade ' + state.user.grade : '';
  const streak       = Storage.loadStreak();

  const weekStart = (() => {
    const now = new Date(); const day = now.getDay(); const ms = 864e5;
    const mon = new Date(now - ((day === 0 ? 6 : day - 1) * ms + now % ms));
    mon.setHours(0,0,0,0); return mon;
  })();
  const weekEnd = new Date(weekStart.getTime() + 7 * 864e5);
  const thisSessions = allSessions.filter(s => {
    const d = new Date(s.sessionStart); return d >= weekStart && d < weekEnd;
  });

  const subjects = [...new Set(state.goals.filter(g => g.subject && g.subject !== 'gk').map(g => g.subject))];
  const subLines = subjects.map(sub => {
    const subGoalIds = new Set(state.goals.filter(g => g.subject === sub).map(g => g.id));
    const thisSub = thisSessions.filter(s => subGoalIds.has(s.goalId));
    if (!thisSub.length) return '';
    const acc = Math.round(thisSub.reduce((a, r) => a + (r.accuracy ?? 0), 0) / thisSub.length * 100);
    const label = (sub.charAt(0).toUpperCase() + sub.slice(1).replace(/-/g, ' ')).padEnd(12);
    return `${label}${acc}% accuracy`;
  }).filter(Boolean).join('\n');

  const days = [...new Set(thisSessions.map(s => new Date(s.sessionEnd).toDateString()))].length;
  const gradeStr = grade ? grade + ' · ' : '';

  const text = `📊 ${name}'s Week ${weekNum} Progress Report\n${gradeStr}Donnibo Daily Practice\n\n${subLines}\n\nDays practiced: ${days} of 7\n🔥 ${streak.current} day run\n\ndonnibo.app`;

  if (navigator.share) {
    navigator.share({ text }).catch(() => {});
  } else {
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
  }
}
