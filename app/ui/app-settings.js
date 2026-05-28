// app-settings.js — Settings modal, profile edit, password change

function openSettings() {
  document.getElementById('user-menu').classList.add('hidden');
  const modal = document.getElementById('settings-modal');
  if (!modal) return;
  const user = state.user;

  const nameEl = document.getElementById('settings-name');
  if (nameEl) nameEl.value = user.name || '';

  const isSchool = user.category === 'school';
  const isPro    = user.category === 'professional';
  const schoolEl = document.getElementById('settings-school-fields');
  const proEl    = document.getElementById('settings-pro-fields');
  if (schoolEl) schoolEl.classList.toggle('hidden', !isSchool);
  if (proEl)    proEl.classList.toggle('hidden',    !isPro);

  if (isSchool) {
    const gradeEl  = document.getElementById('settings-grade');
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

  const langEl = document.getElementById('settings-regional-lang');
  if (langEl) langEl.value = user.regionalLanguage || '';

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

  sessionStorage.removeItem('ds_manifest_cache');
  await _loadQuestionsForUser(user);
  _renderHome();

  if (okEl) okEl.textContent = 'Profile saved.';

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
  if (okEl) okEl.textContent = 'Password updated successfully.';
  document.getElementById('settings-current-pw').value = '';
  document.getElementById('settings-new-pw').value     = '';
  document.getElementById('settings-confirm-pw').value = '';
}
