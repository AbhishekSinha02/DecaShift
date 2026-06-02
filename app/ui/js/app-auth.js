// app-auth.js — Landing, Sign Up, Sign In, Sign Out

// ── Landing ───────────────────────────────────────────────────────────────────

function _setupLanding() {
  const school = () => _goToSignup('school');
  const pro    = () => _goToSignup('professional');
  const signin = async () => { await _showScreen('signin'); _setupSignin(); };

  ['btn-for-students', 'btn-for-students-2', 'btn-for-students-3', 'btn-for-students-4', 'btn-for-students-5', 'btn-for-students-6']
    .forEach(id => { const el = document.getElementById(id); if (el) el.onclick = school; });
  ['btn-for-professionals', 'btn-for-professionals-hero', 'btn-for-professionals-2']
    .forEach(id => { const el = document.getElementById(id); if (el) el.onclick = pro; });

  const signinBtn = document.getElementById('btn-go-signin');
  if (signinBtn) signinBtn.onclick = signin;

  document.querySelectorAll('.lp-navlink').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const nav     = document.querySelector('.lp-nav');
  const landing = document.getElementById('screen-landing');
  if (nav && landing) {
    landing.addEventListener('scroll', () => {
      nav.style.boxShadow = landing.scrollTop > 10 ? '0 2px 20px rgba(0,0,0,.08)' : 'none';
    }, { passive: true });
  }

  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(
      '.lp-section, .lp-feature, .lp-feature-alt, .lp-testimonials, .lp-faq, .lp-stats'
    ).forEach(el => { el.classList.add('lp-reveal'); revealObs.observe(el); });
  }

  const statsEl = document.querySelector('.lp-stats');
  if (statsEl && 'IntersectionObserver' in window) {
    let ran = false;
    new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || ran) return;
      ran = true;
      document.querySelectorAll('[data-target]').forEach(el => {
        const target = +el.dataset.target;
        const suffix = el.dataset.suffix || '';
        let cur = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          cur = Math.min(cur + step, target);
          el.textContent = (cur >= 1000 ? (cur / 1000).toFixed(1) + 'K' : cur) + suffix;
          if (cur >= target) clearInterval(timer);
        }, 28);
      });
    }, { threshold: 0.5 }).observe(statsEl);
  }

  // Phone feature showcase — screen content fades, phone frame stays fixed
  const featScreens = document.querySelectorAll('.lp-fs');
  const featCaps    = document.querySelectorAll('.lp-feat-cap');
  const dots        = document.querySelectorAll('.lp-dot');
  let   current     = 0;
  let   autoTimer;

  if (featScreens.length && dots.length) {
    function goToSlide(n) {
      current = ((n % 4) + 4) % 4;
      featScreens.forEach((s, i) => s.classList.toggle('lp-fs-active',       i === current));
      featCaps.forEach(   (c, i) => c.classList.toggle('lp-feat-cap-active',  i === current));
      dots.forEach(       (d, i) => d.classList.toggle('lp-dot-active',       i === current));
    }
    function nextSlide() { goToSlide(current + 1); }
    autoTimer = setInterval(nextSlide, 4000);

    dots.forEach(d => d.addEventListener('click', () => {
      clearInterval(autoTimer);
      goToSlide(+d.dataset.slide);
      autoTimer = setInterval(nextSlide, 4000);
    }));

    const phoneEl = document.getElementById('lp-feat-phone');
    if (phoneEl) {
      let tx = 0;
      phoneEl.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
      phoneEl.addEventListener('touchend',   e => {
        const dx = e.changedTouches[0].clientX - tx;
        if (Math.abs(dx) > 40) {
          clearInterval(autoTimer);
          goToSlide(dx < 0 ? current + 1 : current - 1);
          autoTimer = setInterval(nextSlide, 4000);
        }
      }, { passive: true });
    }
  }

  const ham = document.getElementById('lp-hamburger');
  const mob = document.getElementById('lp-mobile-menu');
  if (ham && mob) {
    ham.onclick = () => { ham.classList.toggle('open'); mob.classList.toggle('hidden'); };
    const mobSignin = document.getElementById('lp-mob-signin');
    const mobStart  = document.getElementById('lp-mob-start');
    if (mobSignin) mobSignin.onclick = signin;
    if (mobStart)  mobStart.onclick  = school;
    mob.querySelectorAll('.lp-mobile-navlink').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        ham.classList.remove('open'); mob.classList.add('hidden');
        const t = document.querySelector(link.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }
}

async function _goToSignup(category) {
  state.pendingCategory = category;
  await _showScreen('signup');
  _setupSignup(category);
}

// ── Sign Up ───────────────────────────────────────────────────────────────────

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

  document.getElementById('signup-form').onsubmit = _handleSignup;
  document.getElementById('btn-to-signin').onclick = async () => { await _showScreen('signin'); _setupSignin(); };
}

async function _handleSignup(e) {
  e.preventDefault();
  _clearErrors();

  const name     = document.getElementById('reg-name').value.trim();
  const loginId  = document.getElementById('reg-loginid').value.trim().toLowerCase();
  const password = document.getElementById('reg-password').value;
  const confirm  = document.getElementById('reg-confirm').value;
  const category = state.pendingCategory || 'professional';

  let valid = true;
  if (!name)                   { _showError('err-name',    'Enter your name'); valid = false; }
  if (loginId.length < 3)      { _showError('err-loginid', 'User ID must be at least 3 characters'); valid = false; }
  if (/\s/.test(loginId))      { _showError('err-loginid', 'User ID cannot contain spaces'); valid = false; }
  if (password.length < 6)     { _showError('err-password', 'Password must be at least 6 characters'); valid = false; }
  if (password !== confirm)    { _showError('err-confirm',  'Passwords do not match'); valid = false; }

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

  if (Storage.findAccount(loginId)) {
    _showError('err-loginid', 'This User ID is already taken. Try another or sign in.');
    return;
  }

  const btn = document.getElementById('signup-btn');
  btn.disabled = true; btn.textContent = 'Creating account…';

  const userId       = Storage.getOrCreateUserId();
  const passwordHash = await Storage.hashPassword(password);
  const registeredAt = new Date().toISOString();

  const user = {
    userId, name, loginId,
    category,
    grade:            grade            || null,
    course:           course           || null,
    role:             role             || null,
    company:          company          || null,
    regionalLanguage: regionalLanguage || null,
    registeredAt,
    trialStartDate:   registeredAt
  };

  // Persist + verify. Some browsers (private/incognito, "block site data", strict
  // privacy) silently drop or block localStorage writes — signup then LOOKS fine
  // (home renders from in-memory state) but the account is gone at the next
  // sign-in → "no account found". Fail loudly here instead. (BUG-029)
  try {
    Storage.saveAccount(loginId, passwordHash, userId, user);
    Storage.saveUser(user);
  } catch (_) { /* handled by the verify below */ }
  if (!Storage.findAccount(loginId)) {
    _showError('err-loginid', 'Couldn’t save your account on this device. Turn off private/incognito mode or allow site data for this site, then try again.');
    btn.disabled = false; btn.textContent = 'Create Account →';
    return;
  }
  state.user = user;

  sessionStorage.removeItem('ds_manifest_cache');
  await _loadManifest();
  await _loadCurriculum(user);
  _autoApplyTheme(user.grade);

  btn.disabled = false; btn.textContent = 'Create Account →';
  await _showScreen('home');
  _renderHome();
  _maybeShowWelcome();

  Storage.syncUserToRemote(user).catch(() => {});
  Storage.syncAccountToDrive({ loginId, passwordHash, userId, name, category, grade, course, role, company, registeredAt, streak: Storage.loadStreak() }).catch(() => {});
}

// ── Sign In ───────────────────────────────────────────────────────────────────

function _setupSignin() {
  document.getElementById('signin-form').onsubmit = _handleSignin;
  document.getElementById('btn-to-signup').onclick = async () => {
    await _showScreen('landing');
    _setupLanding();
  };
}

async function _handleSignin(e) {
  e.preventDefault();
  _clearErrors();

  const loginId  = document.getElementById('si-loginid').value.trim().toLowerCase();
  const password = document.getElementById('si-password').value;

  let valid = true;
  if (!loginId)  { _showError('err-si-loginid', 'Enter your User ID'); valid = false; }
  if (!password) { _showError('err-si-password', 'Enter your password'); valid = false; }
  if (!valid) return;

  const btn = document.getElementById('signin-btn');
  btn.disabled = true; btn.textContent = 'Signing in…';

  let account = Storage.findAccount(loginId);

  if (!account) {
    btn.textContent = 'Checking account…';
    let driveAccount = null;
    try {
      driveAccount = await Storage.fetchAccountFromDrive(loginId);
    } catch (_) {
      // Timeout / network error — never leave the button stuck (BUG-028).
      _showError('err-si-loginid', 'Couldn’t reach the server. Check your connection and try again.');
      btn.disabled = false; btn.textContent = 'Sign In →';
      return;
    }
    if (!driveAccount) {
      _showError('err-si-loginid', 'No account found. Sign up first.');
      btn.disabled = false; btn.textContent = 'Sign In →';
      return;
    }
    const { passwordHash: _ph, loginIdHash: _lh, ...userProfile } = driveAccount;
    // Persist the full profile into the local account record (not just the
    // credentials) so a later sign-in can rebuild category/grade offline.
    Storage.saveAccount(driveAccount.loginId, driveAccount.passwordHash, driveAccount.userId, userProfile);
    Storage.saveUser(userProfile);
    if (userProfile.streak) Storage.saveStreak(userProfile.streak);
    account = Storage.findAccount(loginId);
  }

  const hash = await Storage.hashPassword(password);
  if (hash !== account.passwordHash) {
    _showError('err-si-password', 'Incorrect password.');
    btn.disabled = false; btn.textContent = 'Sign In →';
    return;
  }

  let user = Storage.loadUser();
  if (!user || user.userId !== account.userId) {
    const { passwordHash: _ph, loginIdHash: _lh, createdAt: _ca, ...userProfile } = account;
    user = userProfile;
    Storage.saveUser(user);
  }

  // Safety net: a legacy/Drive account record may lack the learning profile
  // (category/grade). Without category the manifest can't pick the grade shard,
  // so the home screen renders empty. Recover the full profile from Drive.
  if (!user.category) {
    try {
      const driveAccount = await Storage.fetchAccountFromDrive(loginId);
      if (driveAccount && driveAccount.category) {
        const { passwordHash: _ph, loginIdHash: _lh, ...full } = driveAccount;
        user = full;
        Storage.saveAccount(account.loginId, account.passwordHash, account.userId, full);
        Storage.saveUser(user);
      }
    } catch (_) { /* offline — sign-in is already valid locally, keep going */ }
  }

  // Backfill trialStartDate for accounts that predate the trial system
  if (!user.trialStartDate) {
    user.trialStartDate = user.registeredAt || new Date().toISOString();
    Storage.saveUser(user);
  }

  btn.disabled = false; btn.textContent = 'Sign In →';
  state.user = user;
  sessionStorage.removeItem('ds_manifest_cache');
  await _loadManifest();
  await _loadCurriculum(user);
  await _showScreen('home');
  const hw = document.querySelector('.home-wrap');
  if (hw) hw.scrollTop = 0;
  _renderHome();
  _maybeShowWelcome();
}

// ── Sign Out ──────────────────────────────────────────────────────────────────

async function signOut() {
  // Backfill the account record with the live profile before clearing the user,
  // so the next sign-in can rebuild a complete user (category/grade) offline —
  // even for legacy/Drive accounts whose stored record lacked the profile.
  const u = state.user || Storage.loadUser();
  if (u && u.loginId) {
    const acct = Storage.findAccount(u.loginId);
    if (acct) Storage.saveAccount(acct.loginId, acct.passwordHash, acct.userId, u);
  }
  Storage.clearSession();
  sessionStorage.removeItem('ds_manifest_cache');
  state.user      = null;
  state.manifest  = [];
  state.goals     = [];
  state.questions = [];
  await _showScreen('landing');
  _setupLanding();
}
