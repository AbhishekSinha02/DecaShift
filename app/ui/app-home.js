// app-home.js — Home screen, goals list, weekly sets, subject tabs, archive

// ── Day-card helpers (used by _renderHome + _dayCardHtml) ─────────────────────

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

// ── Home Screen ───────────────────────────────────────────────────────────────

function _renderHome() {
  const user      = state.user;
  const firstName = _getFirstName(user);

  const el = document.getElementById('user-greeting');
  if (el) el.textContent = 'Hello, ' + firstName;

  const chip = document.getElementById('user-chip-name');
  if (chip) chip.textContent = firstName;

  const avatar = document.getElementById('user-avatar');
  if (avatar) avatar.textContent = firstName[0].toUpperCase();

  _renderHeaderMeta();
  _renderCityStrip();

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
      'english': 'English', 'social-science': 'Soc. Sci.', 'gk': '🌍 GK'
    };
    const langLabel = { sanskrit: 'Sanskrit', marathi: 'Marathi', tamil: 'Tamil',
                        telugu: 'Telugu', punjabi: 'Punjabi', malayalam: 'Malayalam' };
    const allTabs = subjects.length > 0
      ? [...subjects, ...(isSchool ? ['gk'] : []), ...(hasRegionalTab ? [regionalLang] : []), 'all']
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
        const extraClass = isRegTab ? ' regional-tab' : s === 'gk' ? ' gk-tab' : '';
        return `<button class="subject-tab${active}${extraClass}" data-subject="${s}" onclick="_setSubjectFilter('${s}')">${label}</button>`;
      }).join('');
    } else {
      tabsEl.style.display = 'none';
    }
  }

  // ── GK tab ───────────────────────────────────────────────────────────────
  if (state.subjectFilter === 'gk') {
    _renderGKTab(list);
    return;
  }

  // ── Regional language tab ─────────────────────────────────────────────────
  const isRegionalTab = isSchool && regionalLang && state.subjectFilter === regionalLang;

  if (isRegionalTab) {
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

  const bnavMe = document.getElementById('bnav-me-label');
  if (bnavMe) bnavMe.textContent = _getFirstName(state.user);
}

// ── Goal actions ──────────────────────────────────────────────────────────────

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

// ── Day card ──────────────────────────────────────────────────────────────────

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

function _setSubjectFilter(subject) {
  state.subjectFilter = subject;
  _renderHome();
}

function _navPractice() {
  state.subjectFilter = localStorage.getItem('ds_last_subject') || 'mathematics';
  _renderHome();
  document.getElementById('home-content')?.scrollTo({ top: 0, behavior: 'smooth' });
}

function _renderCityStrip() {
  const strip = document.getElementById('city-strip');
  const text  = document.getElementById('city-strip-text');
  const user  = state.user;
  if (!strip || !text || !user) return;
  const city = user.city || '';
  if (!city) { strip.classList.add('hidden'); return; }
  strip.classList.remove('hidden');
  text.textContent = city + ' · Students practicing daily';
}

function _renderHeaderMeta() {
  const el   = document.getElementById('app-header-meta');
  const user = state.user;
  if (!el || !user) return;
  const grade = user.grade
    ? (isNaN(Number(user.grade)) ? user.grade : 'Grade ' + user.grade)
    : '';
  const city = user.city || '';
  el.innerHTML =
    (grade ? `<span class="header-grade-chip">${_esc(grade)}</span>` : '') +
    (city  ? `<span class="header-city-chip">📍 ${_esc(city)}</span>` : '');
}

// Close goal menus on any outside click
document.addEventListener('click', _closeAllGoalMenus);
