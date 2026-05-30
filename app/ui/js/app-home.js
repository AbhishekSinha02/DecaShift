// app-home.js — Home screen, goals list, weekly sets, subject tabs, archive

// ── Day-card helpers (used by _renderHome + _dayCardHtml) ─────────────────────

const _DAY_ORDER = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4 };
const _DAY_LABEL = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri' };

const SUBJECT_STYLE = {
  mathematics:      { color: '#3b82f6', icon: '📐' },
  science:          { color: '#22c55e', icon: '🔬' },
  physics:          { color: '#a78bfa', icon: '⚡' },
  chemistry:        { color: '#f97316', icon: '🧪' },
  biology:          { color: '#34d399', icon: '🌿' },
  english:          { color: '#60a5fa', icon: '📖' },
  'social-science': { color: '#fb923c', icon: '🌏' },
  hindi:            { color: '#f472b6', icon: '🇮🇳' },
  french:           { color: '#818cf8', icon: '🥖' },
  gk:               { color: '#14b8a6', icon: '🌍' },
};

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

  _renderHeaderMeta();
  _renderCityStrip();
  _renderAvatar();
  _renderGreeting();
  _renderDailyQuest();
  _renderTodayCard();
  _renderRewardNotif();
  _renderPartnerFooter();

  _renderStreakBar();

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
      const allSessions = Storage.loadSessions();
      tabsEl.innerHTML = allTabs.map(s => {
        const isRegTab = hasRegionalTab && s === regionalLang;
        const baseLabel = s === 'all' ? 'All'
          : isRegTab ? (langLabel[s] || _cap(s))
          : (subjectLabels[s] || _cap(s));
        const active = state.subjectFilter === s ? ' active' : '';
        const extraClass = isRegTab ? ' regional-tab' : s === 'gk' ? ' gk-tab' : '';
        const subjColor = (SUBJECT_STYLE[s] || {}).color || '';
        const activeStyle = (active && subjColor)
          ? ` style="background:${subjColor};border-color:${subjColor}"`
          : '';

        // D-010: accuracy badge on tab
        let accTag = '';
        if (s !== 'all' && s !== 'gk') {
          const subjGoalIds = new Set(
            [...weeklyGoals, ...regularGoals].filter(g => g.subject === s).map(g => g.id)
          );
          const subjSessions = allSessions.filter(sess => subjGoalIds.has(sess.goalId));
          if (subjSessions.length >= 2) {
            const avg = Math.round(subjSessions.reduce((a, r) => a + (r.accuracy ?? 0), 0) / subjSessions.length * 100);
            const prev = subjSessions.slice(0, -Math.ceil(subjSessions.length / 2));
            const prevAvg = prev.length
              ? Math.round(prev.reduce((a, r) => a + (r.accuracy ?? 0), 0) / prev.length * 100)
              : null;
            const arrow = prevAvg !== null ? (avg > prevAvg ? '↑' : avg < prevAvg ? '↓' : '') : '';
            accTag = ` <span class="tab-acc">${avg}%${arrow}</span>`;
          }
        }
        return `<button class="subject-tab${active}${extraClass}"${activeStyle} data-subject="${s}" onclick="_setSubjectFilter('${s}')">${baseLabel}${accTag}</button>`;
      }).join('');
    } else {
      tabsEl.style.display = 'none';
    }
  }

  // ── GK tab ───────────────────────────────────────────────────────────────
  if (state.subjectFilter === 'gk') {
    let gkHtml = _buildDrillRow();
    gkHtml += _renderGKNetflixRows();
    list.innerHTML = gkHtml;
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

  // ── No grade set — guide to settings ─────────────────────────────────────
  if (isSchool && !user.grade && weeklyGoals.length === 0 && regularGoals.length === 0) {
    list.innerHTML = `<div class="empty-state">
      <div class="empty-emoji">🎒</div>
      <p class="empty-title">Set your grade to load your curriculum.</p>
      <p class="empty-sub">Takes 10 seconds — your personal question bank will be ready immediately.</p>
      <button class="btn btn-primary btn-sm" style="margin-top:14px" onclick="openSettingsSection('profile')">Go to Settings →</button>
    </div>`;
    return;
  }

  // ── Netflix rows for selected subject ─────────────────────────────────────
  const weeklyFiltered = state.subjectFilter === 'all'
    ? weeklyGoals
    : weeklyGoals.filter(g => g.subject === state.subjectFilter);

  _renderNetflixRows(list, weeklyFiltered, state.subjectFilter, currentWeek);
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

// ── Netflix row renderers ─────────────────────────────────────────────────────

function _renderNetflixRows(list, goals, subject, currentWeek) {
  let html = _buildDrillRow();

  if (subject === 'gk') {
    html += _renderGKNetflixRows();
    list.innerHTML = html;
    return;
  }

  const thisWeek = goals
    .filter(g => g.weekNum === currentWeek)
    .sort((a, b) => _dayOrder(a.weekDay) - _dayOrder(b.weekDay));

  const lastWeek = goals
    .filter(g => g.weekNum === currentWeek - 1)
    .sort((a, b) => _dayOrder(a.weekDay) - _dayOrder(b.weekDay));

  if (thisWeek.length) html += _buildWeekRow('This Week', thisWeek, false);
  if (lastWeek.length) html += _buildWeekRow('Last Week', lastWeek, true);

  const byConcept = {};
  goals.forEach(g => {
    const cid = g.conceptId || 'practice';
    (byConcept[cid] = byConcept[cid] || []).push(g);
  });

  Object.entries(byConcept)
    .sort(([, a], [, b]) =>
      Math.max(...b.map(g => g.weekNum || 0)) - Math.max(...a.map(g => g.weekNum || 0))
    )
    .forEach(([cid, cGoals]) => { html += _buildTopicRow(cid, cGoals); });

  if (!thisWeek.length && !lastWeek.length && !Object.keys(byConcept).length) {
    const subLabel = (SUBJECT_STYLE[subject] || {}).icon
      ? (SUBJECT_STYLE[subject].icon + ' ')
      : '';
    html += `<div class="empty-state">
      <div class="empty-emoji">📅</div>
      <p class="empty-title">${subLabel}${_cap((subject || 'This subject').replace(/-/g,' '))} content loads Monday.</p>
      <p class="empty-sub">Flash Drills and GK are ready now — keep your streak going.</p>
      <button class="btn btn-ghost btn-sm" style="margin-top:12px" onclick="_startDrill('gk')">Try GK Today →</button>
    </div>`;
  }

  list.innerHTML = html;
}

function _buildDrillRow() {
  const drills = [
    { id: 'tables',   icon: '×',  name: 'Tables',   sub: '2–20 timed' },
    { id: 'squares',  icon: '²',  name: 'Squares',  sub: '1–25' },
    { id: 'cubes',    icon: '³',  name: 'Cubes',    sub: '1–15' },
    { id: 'formulas', icon: '∫',  name: 'Formulas', sub: 'Physics · Math' },
    { id: 'gk',       icon: '🌍', name: 'GK Today', sub: '5 questions' },
  ];
  const bests = JSON.parse(localStorage.getItem('ds_drill_bests') || '{}');
  const cards = drills.map(d => {
    const best = bests[d.id];
    const bestLine = best
      ? `<div class="drill-card-best">Best: ${best}</div>`
      : `<div class="drill-card-best" style="color:var(--muted)">Not tried yet</div>`;
    return `<div class="drill-card" onclick="_startDrill('${d.id}')">
      <div class="drill-card-icon">${d.icon}</div>
      <div class="drill-card-name">${d.name}</div>
      <div class="drill-card-sub">${d.sub}</div>
      ${bestLine}
    </div>`;
  }).join('');
  return `<div class="netflix-row">
    <div class="netflix-row-label">⚡ Flash Drills</div>
    <div class="netflix-cards">${cards}</div>
  </div>`;
}

function _buildWeekRow(label, goals, isPast) {
  const weekNum   = goals[0]?.weekNum;
  const weekLabel = weekNum ? `${label} (W${weekNum})` : label;
  return `<div class="netflix-row">
    <div class="netflix-row-label">${weekLabel}
      <span class="netflix-row-count">${goals.length} sets</span>
    </div>
    <div class="netflix-cards">
      ${goals.map(g => _dayCardHtml(g, isPast)).join('')}
    </div>
  </div>`;
}

function _buildTopicRow(conceptId, goals) {
  if (!goals.length) return '';
  const label   = _conceptLabel(conceptId);
  const sorted  = goals.slice().sort((a, b) =>
    (b.weekNum - a.weekNum) || (_dayOrder(a.weekDay) - _dayOrder(b.weekDay))
  );
  const subjectColor = (SUBJECT_STYLE[goals[0]?.subject] || {}).color || '#3b82f6';
  const total   = goals.length;
  const done    = goals.filter(g => {
    const s = Storage.getLastSessionForGoal(g.id);
    return s && new Date(s.sessionEnd).toDateString() !== 'Invalid Date';
  }).length;
  const dots    = Array.from({ length: total }, (_, i) =>
    `<span class="concept-dot${i < done ? ' done' : ''}" style="${i < done ? `background:${subjectColor}` : ''}"></span>`
  ).join('');

  return `<div class="netflix-row">
    <div class="netflix-row-label">
      <span class="concept-label-text">${label}</span>
      <span class="concept-dots">${dots}</span>
      <span class="netflix-row-count">${done} of ${total} done</span>
    </div>
    <div class="netflix-cards">
      ${sorted.map(g => _dayCardHtml(g, false)).join('')}
    </div>
  </div>`;
}

function _conceptLabel(conceptId) {
  if (!conceptId || conceptId === 'practice') return 'Practice';
  const STOP = new Set(['one', 'two', 'three', 'basics', 'intro', 'introduction',
    'variable', 'variables', 'advanced', 'level', 'and', 'the', 'of', 'in']);
  return conceptId.split('-')
    .filter(w => !STOP.has(w))
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function _renderGKNetflixRows() {
  const currentWeek = _getISOWeek(new Date());
  const gkGoals     = state.goals.filter(g => g.subject === 'gk' && g.weekNum);
  const thisWeek    = gkGoals
    .filter(g => g.weekNum === currentWeek)
    .sort((a, b) => _dayOrder(a.weekDay) - _dayOrder(b.weekDay));
  const lastWeek    = gkGoals
    .filter(g => g.weekNum === currentWeek - 1)
    .sort((a, b) => _dayOrder(a.weekDay) - _dayOrder(b.weekDay));
  let html = '';
  if (thisWeek.length) html += _buildWeekRow('This Week GK', thisWeek, false);
  if (lastWeek.length) html += _buildWeekRow('Last Week GK', lastWeek, true);
  if (!html) {
    html = `<div class="empty-state"><div class="empty-emoji">🌍</div>
      <p class="empty-title">GK sets loading…</p>
      <button class="btn btn-primary btn-sm" onclick="_startDrill('gk')">Today's GK Drill →</button></div>`;
  }
  return html;
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
  const subj     = SUBJECT_STYLE[goal.subject] || {};
  const color    = subj.color || 'var(--accent)';
  const icon     = subj.icon  || '';
  const isGated  = typeof _isGatedGoal === 'function' && _isGatedGoal(goal) && state.user?.plan === 'expired';
  return `
    <div class="day-card${done ? ' done' : ''}${isPast ? ' past' : ''}${isGated ? ' gated' : ''}" style="border-left-color:${color}">
      ${isGated ? '<div class="day-card-lock">🔒 Pro</div>' : ''}
      <div class="day-card-meta">${icon ? icon + ' ' : ''}${metaLabel}</div>
      <div class="day-card-title">${_esc(goal.name)}</div>
      <div class="day-card-desc">${_esc(goal.description)}</div>
      <div class="day-card-footer">
        <span class="day-card-count">${count} Q${score ? ' · ' + score : ''}</span>
        <button class="btn${isGated ? ' btn-ghost' : ' btn-primary'} btn-sm" onclick="startGoal('${goal.id}')">${isGated ? '🔒 Unlock' : done ? 'Redo' : last ? 'Continue' : 'Start'}</button>
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

function _weekNav(delta) {}  // retired — Netflix rows replace week nav

function _scrollToSubj(idx) {
  const track = document.getElementById('subj-track-main');
  if (!track) return;
  track.scrollTo({ left: idx * track.offsetWidth, behavior: 'smooth' });
  document.querySelectorAll('.subj-dot').forEach((d, i) => {
    const active = i === idx;
    d.classList.toggle('active', active);
    d.style.background = active ? (d.dataset.color || 'var(--accent)') : 'var(--border)';
  });
}

function _navPractice() {
  state.subjectFilter = localStorage.getItem('ds_last_subject') || 'mathematics';
  _renderHome();
  document.getElementById('home-content')?.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── D-006: Streak bar — rewards not punishes ─────────────────────────────────

function _renderStreakBar() {
  const user     = state.user;
  const streak   = Storage.loadStreak();
  const sessions = Storage.loadSessions().filter(s => s.userId === user?.userId);

  const elFlame = document.getElementById('streak-flame');
  const elCount = document.getElementById('streak-count');
  const elLabel = document.getElementById('streak-label');
  const elBest  = document.getElementById('streak-best');

  if (elBest) elBest.textContent = streak.best;

  // Never show "0 days" — replace with an encouraging comeback state
  const isComeback = streak.current === 0 && sessions.length > 0;
  if (isComeback) {
    if (elFlame) elFlame.textContent = '↩';
    if (elCount) elCount.textContent = 'New';
    if (elLabel) elLabel.textContent = 'run';
  } else {
    if (elFlame) elFlame.textContent = '🔥';
    if (elCount) elCount.textContent = streak.current;
    if (elLabel) elLabel.textContent = 'days';
  }

  // Milestone badge — highest earned, permanent, derived from streak.best
  const elMilestones = document.getElementById('streak-milestones');
  if (elMilestones) {
    let badge = '';
    if (streak.best >= 30)      badge = '<span class="streak-milestone-chip">🏆 30d</span>';
    else if (streak.best >= 14) badge = '<span class="streak-milestone-chip">🌟 14d</span>';
    else if (streak.best >= 7)  badge = '<span class="streak-milestone-chip">⚡ 7d</span>';

    // E-004: banked streak freezes + "saved today" note
    let freezeChip = '';
    if ((streak.freezes || 0) > 0) {
      freezeChip += `<span class="streak-freeze-chip" title="Streak freezes banked — a missed day won't break your streak">🛡 ${streak.freezes}</span>`;
    }
    if (streak.savedByFreeze === new Date().toISOString().slice(0, 10)) {
      freezeChip += `<span class="streak-saved-note">Streak saved</span>`;
    }
    elMilestones.innerHTML = badge + freezeChip;
  }

  // Stats (unchanged logic, just moved here)
  const elSess = document.getElementById('stat-sessions');
  const elAcc  = document.getElementById('stat-accuracy');
  const elTime = document.getElementById('stat-time');
  if (elSess) elSess.textContent = sessions.length;
  if (elAcc) {
    elAcc.textContent = sessions.length
      ? Math.round(sessions.reduce((a, r) => a + (r.accuracy || 0), 0) / sessions.length * 100) + '%'
      : '—';
  }
  if (elTime) {
    const totalSec = sessions.reduce((a, r) => a + (r.totalDurationSeconds || 0), 0);
    elTime.textContent = totalSec < 60 ? totalSec + 's' : Math.round(totalSec / 60) + 'm';
  }
}

// ── D-001: Personalized greeting ─────────────────────────────────────────────

function _renderGreeting() {
  const el = document.getElementById('greeting-wrap');
  if (!el) return;
  const user = state.user;
  if (!user) { el.innerHTML = ''; return; }

  const name        = _getFirstName(user);
  const streak      = Storage.loadStreak();
  const hour        = new Date().getHours();
  const tod         = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const sessions    = Storage.loadSessions().filter(s => s.userId === user.userId);
  const currentWeek = _getISOWeek(new Date());
  const todayDay    = ['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()];

  const todayGoal = state.goals.find(g =>
    g.weekNum === currentWeek && g.weekDay === todayDay && g.subject === state.subjectFilter
  ) || state.goals.find(g =>
    g.weekNum === currentWeek && g.weekDay === todayDay
  );

  const todayLast = todayGoal ? Storage.getLastSessionForGoal(todayGoal.id) : null;
  const todayDone = todayLast &&
    new Date(todayLast.sessionEnd).toDateString() === new Date().toDateString();

  let l1, l2;

  if (!sessions.length) {
    l1 = `Welcome, ${name}! 👋`;
    l2 = `Let's start your very first daily practice session.`;

  } else if (streak.current === 0) {
    l1 = `Welcome back, ${name}.`;
    l2 = streak.best > 0
      ? `Start a new run today — your best was ${streak.best} day${streak.best !== 1 ? 's' : ''}.`
      : `Your practice is ready. Pick up where you left off.`;

  } else if (todayDone) {
    l1 = `Well done today, ${name}! ✅`;
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    const tomDay  = ['sun','mon','tue','wed','thu','fri','sat'][tom.getDay()];
    const tomGoal = state.goals.find(g => g.weekNum === currentWeek && g.weekDay === tomDay);
    l2 = tomGoal
      ? `Come back tomorrow for ${_esc(tomGoal.description?.split('—')[0].trim() || tomGoal.name)}.`
      : `See you tomorrow. Keep the habit going.`;

  } else if (todayGoal) {
    l1 = `${tod}, ${name}. Day ${streak.current} of your daily practice.`;
    const dayNum = (_DAY_ORDER[todayDay] ?? 0) + 1;
    const topic  = todayGoal.description
      ? todayGoal.description.split('—')[0].trim()
      : todayGoal.name;
    l2 = `Today: ${_esc(topic)} — Day ${dayNum} of 5 this week.`;

  } else {
    l1 = `${tod}, ${name}.`;
    l2 = [0, 6].includes(new Date().getDay())
      ? `It's the weekend. Flash Drills and GK are ready.`
      : `New content loads every Monday. Flash Drills are ready now.`;
  }

  el.innerHTML = `<div class="greeting-wrap">
    <p class="greeting-l1">${l1}</p>
    <p class="greeting-l2">${l2}</p>
  </div>`;
}

// ── Today's Mission card ──────────────────────────────────────────────────────

function _renderTodayCard() {
  const el = document.getElementById('today-card-wrap');
  if (!el) return;

  const user = state.user;
  if (!user || user.category !== 'school') { el.innerHTML = ''; return; }

  const currentWeek = _getISOWeek(new Date());
  const today       = new Date();
  const todayDay    = ['sun','mon','tue','wed','thu','fri','sat'][today.getDay()];
  const dayNum      = (_DAY_ORDER[todayDay] ?? 0) + 1; // 1-5

  const todayGoal = state.goals.find(g =>
    g.weekNum === currentWeek && g.weekDay === todayDay && g.subject === state.subjectFilter
  ) || state.goals.find(g =>
    g.weekNum === currentWeek && g.weekDay === todayDay
  );

  if (!todayGoal) { el.innerHTML = ''; return; }

  const style    = SUBJECT_STYLE[todayGoal.subject] || { color: '#3b82f6', icon: '📚' };
  const color    = style.color;
  const qCount   = state.questions.filter(q => q.goalId === todayGoal.id).length;
  const last     = Storage.getLastSessionForGoal(todayGoal.id);
  const done     = last && new Date(last.sessionEnd).toDateString() === today.toDateString();
  const accPct   = last ? Math.round(last.accuracy * 100) : null;
  const grade    = user.grade ? 'Grade ' + user.grade + ' · ' : '';
  const subName  = _cap(todayGoal.subject.replace(/-/g, ' '));
  const topic    = todayGoal.description
    ? todayGoal.description.split('—')[0].split('·')[0].trim()
    : todayGoal.name;

  const accBar = accPct !== null ? (() => {
    const filled = Math.round(accPct / 10);
    return `<div class="today-hero-acc">
      <span class="today-acc-bar">${'█'.repeat(filled)}${'░'.repeat(10 - filled)}</span>
      <span class="today-acc-label">${accPct}% accuracy</span>
    </div>`;
  })() : '';

  const ctaLabel  = done ? 'Practice Again →' : last ? 'Continue →' : 'Start Today\'s Practice →';
  const doneBadge = done ? '<span class="today-done-badge">✅ Done</span>' : '';
  const doneNote  = done
    ? `<p class="today-done-note">You're done for today, ${_getFirstName(user)}! Come back tomorrow to keep the streak going.</p>`
    : '';

  const heroCard = `
    <div class="today-hero-card${done ? ' today-done' : ''}" style="border-left-color:${color}">
      <div class="today-hero-top">
        <span class="today-hero-meta">${style.icon} ${grade}${subName}</span>
        <span class="today-hero-day">Day ${dayNum}/5 ${doneBadge}</span>
      </div>
      <div class="today-hero-topic">${_esc(topic)}</div>
      ${doneNote}
      ${done ? '' : accBar}
      <button class="btn ${done ? 'btn-ghost' : 'btn-primary'} today-hero-cta" onclick="startGoal('${todayGoal.id}')">
        ${ctaLabel}
      </button>
    </div>`;

  const gkGoal = state.subjectFilter !== 'gk' ? state.goals.find(g =>
    g.subject === 'gk' && g.weekNum === currentWeek && g.weekDay === todayDay
  ) : null;

  const gkCard = gkGoal ? (() => {
    const gkCount = state.questions.filter(q => q.goalId === gkGoal.id).length;
    const gkLast  = Storage.getLastSessionForGoal(gkGoal.id);
    return `<div class="today-gk-strip">
      <span class="today-gk-label">🌍 GK Today</span>
      <span class="today-gk-topic">${_esc(gkGoal.description.split('—')[0].trim())}</span>
      <span class="today-gk-count">${gkCount}Q</span>
      <button class="btn btn-ghost btn-sm" onclick="startGoal('${gkGoal.id}')">
        ${gkLast ? 'Redo' : 'Start →'}
      </button>
    </div>`;
  })() : '';

  el.innerHTML = heroCard + gkCard;
}

// ── E-003: Daily Quest + Continue hero ───────────────────────────────────────

// The set-objective target: today's scheduled set (school), else any week-day
// set, else any regular goal. Drives the "Continue / Start today's set" CTA.
function _questSetGoal() {
  const currentWeek = _getISOWeek(new Date());
  const todayDay    = ['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()];
  return state.goals.find(g => g.weekNum === currentWeek && g.weekDay === todayDay && g.subject === state.subjectFilter)
      || state.goals.find(g => g.weekNum === currentWeek && g.weekDay === todayDay)
      || state.goals.find(g => !g.weekNum && !(g.subject && g.subject.startsWith('regional-')))
      || null;
}

function _renderDailyQuest() {
  const el = document.getElementById('daily-quest-wrap');
  if (!el) return;
  if (!state.user) { el.innerHTML = ''; return; }

  const q = DailyQuest.getState();

  // Does the today-hero card below already show today's set? (school + scheduled
  // goal). If so, defer the set CTA to it instead of duplicating the button here.
  const _cw = _getISOWeek(new Date());
  const _td = ['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()];
  const todayHeroGoal = (state.user.category === 'school')
    ? (state.goals.find(g => g.weekNum === _cw && g.weekDay === _td && g.subject === state.subjectFilter)
       || state.goals.find(g => g.weekNum === _cw && g.weekDay === _td))
    : null;

  // The single next action (Continue hero): first incomplete objective.
  let ctaLabel = '', ctaAction = '', deferToHero = false;
  if (!q.set) {
    if (todayHeroGoal) {
      // set CTA lives in the today-hero card below — don't duplicate it
      deferToHero = true;
    } else {
      const g = _questSetGoal();
      if (g) {
        const resumed = !!Storage.getLastSessionForGoal(g.id);
        const topic   = (g.description ? g.description.split('—')[0].split('·')[0].trim() : g.name);
        ctaLabel  = (resumed ? '📖 Continue: ' : '📖 Start: ') + _esc(topic) + ' →';
        ctaAction = `startGoal('${g.id}')`;
      } else {
        ctaLabel  = '📖 Start practice →';
        ctaAction = `_navPractice()`;
      }
    }
  } else if (!q.drill) {
    ctaLabel  = '⚡ Do a Flash Drill →';
    ctaAction = `_startDrill('tables')`;
  } else if (!q.gk) {
    ctaLabel  = "🌍 Today's GK →";
    ctaAction = `_setSubjectFilter('gk');_renderHome()`;
  }

  const chip = (done, icon, label) =>
    `<span class="quest-chip${done ? ' done' : ''}"><span class="quest-chip-mark">${done ? '✓' : '○'}</span>${icon} ${label}</span>`;

  if (q.complete) {
    el.innerHTML = `
      <div class="daily-quest daily-quest-complete">
        <div class="quest-complete-row">
          <span class="quest-complete-icon">🎉</span>
          <div>
            <div class="quest-complete-title">Day complete!</div>
            <div class="quest-complete-sub">Quest done — see you tomorrow to keep it going.</div>
          </div>
        </div>
        <div class="quest-chips">
          ${chip(true, '📖', 'Set')}${chip(true, '⚡', 'Drill')}${chip(true, '🌍', 'GK')}
        </div>
      </div>`;
    // E-004 ritual fires from here (added in the next commit).
    if (typeof _maybeShowQuestRitual === 'function') _maybeShowQuestRitual(q);
    return;
  }

  el.innerHTML = `
    <div class="daily-quest">
      <div class="quest-head">
        <span class="quest-title">Today's Quest</span>
        <span class="quest-progress">${q.done}/${q.total}</span>
      </div>
      <div class="quest-chips">
        ${chip(q.set, '📖', 'Set')}${chip(q.drill, '⚡', 'Drill')}${chip(q.gk, '🌍', 'GK')}
      </div>
      ${deferToHero
        ? `<p class="quest-hint">Start with today's set below ↓</p>`
        : `<button class="btn btn-primary quest-cta" onclick="${ctaAction}">${ctaLabel}</button>`}
    </div>`;
}

// ── E-004: Daily completion ritual (fires once when the quest completes) ──────
function _maybeShowQuestRitual(q) {
  if (!q.complete || DailyQuest.ritualShownToday()) return;
  DailyQuest.markRitualShown();
  _showQuestRitual();
}

function _showQuestRitual() {
  const streak = Storage.loadStreak();
  const name   = _getFirstName(state.user);
  const days   = streak.current;

  const overlay = document.createElement('div');
  overlay.className = 'quest-ritual-overlay';
  overlay.innerHTML = `
    <div class="quest-ritual-card" role="dialog" aria-label="Day complete">
      <div class="quest-ritual-burst">🎉</div>
      <div class="quest-ritual-title">Day Complete!</div>
      <div class="quest-ritual-streak"><span class="qr-flame">🔥</span> ${days} day${days === 1 ? '' : 's'}</div>
      <p class="quest-ritual-msg">Brilliant, ${_esc(name)} — you finished today's full quest: set, drill, and GK. See you tomorrow to keep it going.</p>
      <button class="btn btn-primary quest-ritual-dismiss">Done for today ✓</button>
    </div>`;

  const close = () => overlay.remove();
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  overlay.querySelector('.quest-ritual-dismiss').addEventListener('click', close);
  document.body.appendChild(overlay);
  if (typeof Feedback !== 'undefined') { Feedback.confetti({ count: 90 }); Feedback.hit('complete'); }  // E-008
}

// ── E-005: level-up celebration (shared by quiz + drill finalize) ────────────
function _showLevelUp(level) {
  const overlay = document.createElement('div');
  overlay.className = 'quest-ritual-overlay levelup-overlay';
  overlay.innerHTML = `
    <div class="quest-ritual-card levelup-card" role="dialog" aria-label="Level up">
      <div class="levelup-ring">
        <span class="levelup-arrow">⬆</span>
        <span class="levelup-num">${level}</span>
      </div>
      <div class="quest-ritual-title">Level ${level}!</div>
      <p class="quest-ritual-msg">You're growing. Every question moves you up — keep climbing, ${_esc(_getFirstName(state.user))}.</p>
      <button class="btn btn-primary quest-ritual-dismiss">Keep going →</button>
    </div>`;
  const close = () => overlay.remove();
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  overlay.querySelector('.quest-ritual-dismiss').addEventListener('click', close);
  document.body.appendChild(overlay);
  if (typeof Feedback !== 'undefined') { Feedback.confetti({ count: 80 }); Feedback.hit('levelup'); }  // E-008
}

// ── E-006: evolution reveal (crossing an avatar stage — the rare big moment) ──
function _showEvolution(level) {
  const stage = Avatar.stageInfo(level);
  const overlay = document.createElement('div');
  overlay.className = 'quest-ritual-overlay evolve-overlay';
  overlay.innerHTML = `
    <div class="quest-ritual-card evolve-card" role="dialog" aria-label="Donnibo evolved">
      <div class="evolve-label">✨ Donnibo evolved ✨</div>
      <div class="evolve-avatar">
        <img src="${Avatar.fileFor(level)}" alt="${stage.name}" onerror="this.style.display='none'">
      </div>
      <div class="quest-ritual-title">${stage.name}</div>
      <p class="quest-ritual-msg">Your Donnibo grew into its <strong>${stage.name}</strong> form. This is you, ${_esc(_getFirstName(state.user))} — getting stronger every day.</p>
      <button class="btn btn-primary quest-ritual-dismiss">Amazing →</button>
    </div>`;
  const close = () => overlay.remove();
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  overlay.querySelector('.quest-ritual-dismiss').addEventListener('click', close);
  document.body.appendChild(overlay);
  if (typeof Feedback !== 'undefined') {  // E-008 — the grandest moment
    Feedback.confetti({ count: 110, colors: ['#7c3aed', '#22d3ee', '#a78bfa', '#f59e0b'] });
    Feedback.hit('reward');
  }
}

// ── E-010: mystery reward box ────────────────────────────────────────────────
// Detect a streak (7/14/30/100) or level (×5) milestone, once each, and queue a box
// to appear after any level-up/evolution overlay is dismissed.
function _maybeOpenMysteryBox(opts) {
  if (typeof Collectibles === 'undefined') return;
  let stored = {};
  try { stored = JSON.parse(localStorage.getItem('donnibo_box_state') || '{}'); } catch (_) {}

  let ctx = null;
  const sm = opts.streak ? opts.streak.current : 0;
  if ([7, 14, 30, 100].includes(sm) && (stored.streak || 0) < sm) {
    ctx = { type: 'streak', milestone: sm };
    stored.streak = sm;
  }
  if (!ctx && opts.xpResult && opts.xpResult.leveledUp) {
    const lm = Math.floor(opts.xpResult.toLevel / 5) * 5;
    if (lm >= 5 && (stored.level || 0) < lm) {
      ctx = { type: 'level', milestone: lm };
      stored.level = lm;
    }
  }
  if (!ctx) return;

  localStorage.setItem('donnibo_box_state', JSON.stringify(stored));
  const reward = Collectibles.rollReward(ctx);

  // wait until any celebration overlay/modal is gone (level-up/evolution/ritual via
  // .quest-ritual-overlay, and the D-006 streak-milestone / reward-card .modal-overlay)
  const tryShow = () => {
    const blocking = document.querySelector('.quest-ritual-overlay')
      || document.querySelector('.modal-overlay:not(.hidden)');
    if (blocking) { setTimeout(tryShow, 600); return; }
    _showMysteryBox(reward, ctx);
  };
  setTimeout(tryShow, 1000);
}

function _showMysteryBox(reward, ctx) {
  const label = ctx.type === 'streak' ? `${ctx.milestone}-day streak` : `Level ${ctx.milestone}`;
  const overlay = document.createElement('div');
  overlay.className = 'quest-ritual-overlay mystery-overlay';
  overlay.innerHTML = `
    <div class="quest-ritual-card mystery-card" role="dialog" aria-label="Mystery box">
      <div class="mystery-eyebrow">🎁 Reward unlocked · ${label}</div>
      <div class="mystery-box">🎁</div>
      <div class="quest-ritual-title">Mystery Box</div>
      <p class="quest-ritual-msg">You earned a reward box. Tap to open it!</p>
      <button class="btn btn-primary quest-ritual-dismiss" id="mystery-open">Open it ✨</button>
    </div>`;
  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  overlay.querySelector('#mystery-open').addEventListener('click', () => {
    let icon = '', title = '', msg = '';
    if (reward.kind === 'sticker') {
      Collectibles.grant(reward.id);
      icon  = `<img src="${reward.file}" alt="${_esc(reward.name)}">`;
      title = _esc(reward.name);
      msg   = `A new <strong>${reward.rarity}</strong> sticker for your album!`;
    } else if (reward.kind === 'xp') {
      if (typeof XP !== 'undefined') XP.addXP(reward.amount, 'box');
      icon = '⚡'; title = `+${reward.amount} XP`; msg = 'Straight into your level progress.';
    } else {
      const n = (typeof Storage !== 'undefined') ? Storage.grantFreeze() : 1;
      icon = '🛡'; title = 'Streak Freeze'; msg = `Banked — a missed day won't break your streak. (${n}/2)`;
    }
    const card = overlay.querySelector('.mystery-card');
    card.innerHTML = `
      <div class="mystery-reveal${reward.kind === 'sticker' ? ' is-sticker' : ''}">${icon}</div>
      <div class="quest-ritual-title">${title}</div>
      <p class="quest-ritual-msg">${msg}</p>
      <button class="btn btn-primary quest-ritual-dismiss" id="mystery-claim">Claim ✓</button>`;
    card.querySelector('#mystery-claim').addEventListener('click', () => {
      close();
      if (state.currentScreen === 'home' && typeof _renderHome === 'function') _renderHome();
    });
    if (typeof Feedback !== 'undefined') { Feedback.confetti({ count: 90 }); Feedback.hit('reward'); }
  });
}

const _AVATAR_GRADIENTS = [
  ['#6366f1','#8b5cf6'], ['#3b82f6','#06b6d4'], ['#10b981','#34d399'],
  ['#f59e0b','#f97316'], ['#ef4444','#ec4899'], ['#8b5cf6','#d946ef'],
  ['#14b8a6','#3b82f6'], ['#f97316','#eab308'],
];

function _renderAvatar() {
  const show = localStorage.getItem('ds_avatar') !== 'false';
  const wrap = document.getElementById('avatar-ring-wrap');
  if (!wrap) return;
  wrap.style.opacity = show ? '1' : '0.4';

  const user   = state.user;
  const letter = user ? _getFirstName(user)[0].toUpperCase() : '?';
  const n      = user?.name ? (user.name.charCodeAt(0) + (user.name.charCodeAt(1) || 0)) : 0;
  const [c1, c2] = _AVATAR_GRADIENTS[n % _AVATAR_GRADIENTS.length];

  // E-005: avatar ring shows LEVEL progress (streak lives in the streak bar)
  const lv   = (typeof XP !== 'undefined') ? XP.levelFromXP(XP.getTotalXP()) : { level: 1, pct: 0 };

  const el = document.getElementById('user-avatar');
  if (el) {
    el.textContent = letter;                                   // fallback under the SVG
    el.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
    if (typeof Avatar !== 'undefined') Avatar.mount(el, lv.level);  // E-006 stage SVG
  }

  const circ = 2 * Math.PI * 22;
  const fill = document.getElementById('avatar-ring-fill');
  if (fill) {
    fill.style.strokeDashoffset = String(circ * (1 - lv.pct));
    fill.style.stroke = '#3b82f6';
  }
  const badge = document.getElementById('level-badge');
  if (badge) badge.textContent = lv.level;
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

// ── City Partner Footer ───────────────────────────────────────────────────────

let _cityPartnersCache = null;

async function _loadCityPartners() {
  if (_cityPartnersCache) return _cityPartnersCache;
  const urls = [
    _rawUrl('config/city-partners.json'),
    '../../config/city-partners.json',
    'config/city-partners.json',
  ];
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (r.ok) { _cityPartnersCache = await r.json(); return _cityPartnersCache; }
    } catch (_) {}
  }
  return {};
}

async function _renderPartnerFooter() {
  const wrap = document.getElementById('partner-footer-wrap');
  if (!wrap) return;
  const user = state.user;
  const city = (user?.city || '').toLowerCase().trim();
  if (!city) { wrap.innerHTML = ''; return; }
  const all = await _loadCityPartners();
  const partners = all[city];
  if (!partners || !partners.length) { wrap.innerHTML = ''; return; }

  wrap.innerHTML = `
    <div class="partner-footer">
      <div class="partner-footer-title">🤝 Our Partners in ${_esc(_cap(city))}</div>
      <div class="partner-list">
        ${partners.map(p => `
          <div class="partner-row">
            <span class="partner-icon">${p.icon}</span>
            <div class="partner-info">
              <div class="partner-name">${_esc(p.name)}</div>
              <div class="partner-offer">${_esc(p.offer)}</div>
            </div>
          </div>`).join('')}
      </div>
      <div class="partner-footer-cta">
        Want to list your business here?
        <a href="https://wa.me/919876543210?text=Hi%2C%20I%27d%20like%20to%20partner%20with%20Donnibo%20in%20${encodeURIComponent(_cap(city))}" target="_blank" rel="noopener">Become a Partner →</a>
      </div>
    </div>`;
}

// ── Reward Card System ─────────────────────────────────────────────────────────

const _REWARD_MILESTONES = {
  '7day':    { label: '7-Day Practice',       emoji: '🎫', partners: 'all' },
  '30day':   { label: 'Habit Champion Gold', emoji: '🏆', partners: 'all' },
  '50q':     { label: 'First Steps',         emoji: '⭐', partners: 'stationery' },
};

function _generateRewardCode(userId, milestone) {
  const prefix = { '7day': 'DS-7STR', '30day': 'DS-30GD', '50q': 'DS-FST' };
  const shortId = (userId || 'ANON').slice(-4).toUpperCase();
  const dayCode = Math.floor(Date.now() / 86400000) % 9999;
  return `${prefix[milestone] || 'DS-CARD'}-${shortId}-${dayCode}`;
}

function _issueRewardCard(milestone) {
  const existing = JSON.parse(localStorage.getItem('ds_reward_card') || 'null');
  const milestoneRank = { '50q': 1, '7day': 2, '30day': 3 };
  if (existing && (milestoneRank[existing.milestone] || 0) >= (milestoneRank[milestone] || 0)) return;

  const user    = state.user;
  const code    = _generateRewardCode(user?.userId || '', milestone);
  const issuedAt = new Date().toISOString().slice(0, 10);
  localStorage.setItem('ds_reward_card', JSON.stringify({ milestone, code, issuedAt }));
  _renderRewardNotif();
}

function _checkRewardMilestones(streak) {
  if (streak.current === 7)  _issueRewardCard('7day');
  if (streak.current === 30) _issueRewardCard('30day');

  const sessions = Storage.loadSessions().filter(s => s.userId === state.user?.userId);
  const totalQ = sessions.reduce((n, s) => n + (s.total || 0), 0);
  if (totalQ >= 50) _issueRewardCard('50q');
}

function _renderRewardNotif() {
  const wrap = document.getElementById('reward-notif-wrap');
  if (!wrap) return;
  const card = JSON.parse(localStorage.getItem('ds_reward_card') || 'null');
  if (!card) { wrap.innerHTML = ''; return; }
  const m = _REWARD_MILESTONES[card.milestone] || {};
  wrap.innerHTML = `
    <div class="reward-notif-banner" id="reward-notif-banner">
      <span class="reward-notif-emoji">${m.emoji || '🎫'}</span>
      <div class="reward-notif-text">
        <div class="reward-notif-title">You Earned a Reward Card!</div>
        <div class="reward-notif-sub">${_esc(m.label || card.milestone)}</div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="_openRewardCard()">View My Card</button>
      <button class="reward-notif-close" onclick="document.getElementById('reward-notif-wrap').innerHTML=''">✕</button>
    </div>`;
}

async function _openRewardCard() {
  if (!document.getElementById('reward-card-screen')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div id="reward-card-screen" class="modal-overlay hidden" onclick="if(event.target===this)_closeRewardCard()">
        <div class="reward-card-box">
          <div class="reward-card-header">
            <div class="reward-card-badge">🎫 DONNIBO REWARD CARD</div>
            <div class="reward-card-milestone" id="rc-milestone">7-Day Practice</div>
          </div>
          <div class="reward-card-student">
            <div class="reward-card-name" id="rc-name">Student Name</div>
            <div class="reward-card-meta" id="rc-meta">Grade 5 · Pune</div>
          </div>
          <div class="reward-card-partners-section">
            <div class="reward-card-valid-label">Valid at:</div>
            <div class="reward-card-partners" id="rc-partners"></div>
          </div>
          <div class="reward-card-code-section">
            <div class="reward-card-code" id="rc-code">DS-7STR-XXXX-0000</div>
            <div class="reward-card-validity" id="rc-validity"></div>
          </div>
          <p class="reward-card-hint">Show this screen at the shop. Partner will verify your code.</p>
          <div class="reward-card-actions">
            <button class="btn btn-primary" onclick="_shareRewardCard()">Share Card 📤</button>
            <button class="btn btn-ghost"   onclick="_closeRewardCard()">Close</button>
          </div>
        </div>
      </div>`);
  }
  const screen = document.getElementById('reward-card-screen');
  if (!screen) return;
  const card = JSON.parse(localStorage.getItem('ds_reward_card') || 'null');
  if (!card) return;
  const user = state.user;
  const m    = _REWARD_MILESTONES[card.milestone] || {};

  document.getElementById('rc-milestone').textContent = m.label || card.milestone;
  document.getElementById('rc-name').textContent      = user?.name || 'Student';
  const grade = user?.grade ? 'Grade ' + user.grade : '';
  const city  = user?.city  ? _cap(user.city) : '';
  document.getElementById('rc-meta').textContent = [grade, city].filter(Boolean).join(' · ');
  document.getElementById('rc-code').textContent = card.code;

  const issued  = new Date(card.issuedAt);
  const expires = new Date(issued.getTime() + 7 * 86400000);
  const fmt = d => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  document.getElementById('rc-validity').textContent = `Valid: ${fmt(issued)} – ${fmt(expires)}`;

  const citySlug = (user?.city || '').toLowerCase().trim();
  const all = await _loadCityPartners();
  const partners = (all[citySlug] || []).filter(p =>
    m.partners === 'all' || p.category.toLowerCase().includes(m.partners)
  );
  document.getElementById('rc-partners').innerHTML = partners.length
    ? partners.map(p => `
        <div class="reward-partner-row">
          <span class="reward-partner-icon">${p.icon}</span>
          <div class="reward-partner-info">
            <div class="reward-partner-name">${_esc(p.name)}</div>
            <div class="reward-partner-offer">${_esc(p.offer)}</div>
          </div>
        </div>`).join('')
    : '<p style="font-size:12px;color:var(--muted)">Valid at all Donnibo partner stores in your city.</p>';

  screen.classList.remove('hidden');
}

function _closeRewardCard() {
  document.getElementById('reward-card-screen')?.classList.add('hidden');
}

async function _shareRewardCard() {
  const card = JSON.parse(localStorage.getItem('ds_reward_card') || 'null');
  if (!card) return;
  const user = state.user;
  const m    = _REWARD_MILESTONES[card.milestone] || {};
  const grade = user?.grade ? 'Grade ' + user.grade : '';
  const city  = user?.city  ? _cap(user.city) : '';
  const citySlug = (user?.city || '').toLowerCase().trim();
  const all = await _loadCityPartners();
  const partners = (all[citySlug] || []).map(p => p.name).join(', ');
  const expires = new Date(new Date(card.issuedAt).getTime() + 7 * 86400000);
  const expFmt  = expires.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const text = [
    `🎫 My Donnibo Reward Card`,
    `${m.label || card.milestone} — ${user?.name || 'Student'}${grade ? ' (' + grade + (city ? ', ' + city : '') + ')' : ''}`,
    partners ? `Valid at: ${partners}` : '',
    `Code: ${card.code} · Valid until ${expFmt}`,
    ``,
    `Try Donnibo: https://donnibo.app`,
  ].filter(l => l !== undefined).join('\n');

  if (navigator.share) {
    navigator.share({ text }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(text)
      .then(() => alert('Copied! Share in WhatsApp 📲'))
      .catch(() => alert(text));
  }
}

// ── Streak milestone ─────────────────────────────────────────────────────────

const _MILESTONES = {
  3:  { emoji: '🔥', title: '3-Day Practice!', sub: 'Three days straight. The habit is forming.' },
  7:  { emoji: '⚡', title: '7-Day Practice!',  sub: "A full week. You've shown up every single day." },
  14: { emoji: '🌟', title: '14-Day Practice!', sub: 'Two weeks of consistency. Most people quit by now.' },
  30: { emoji: '🏆', title: '30-Day Practice!', sub: "A month. You're in the top 1% of learners." },
};

function _checkStreakMilestone(streak) {
  const m = _MILESTONES[streak.current];
  if (!m || streak.lastDate !== new Date().toISOString().slice(0, 10)) return;
  setTimeout(() => {
    if (!document.getElementById('streak-milestone-modal')) {
      document.body.insertAdjacentHTML('beforeend', `
        <div id="streak-milestone-modal" class="modal-overlay hidden" onclick="if(event.target===this)dismissMilestone()">
          <div class="modal-box streak-milestone-box">
            <div class="milestone-emoji" id="milestone-emoji">🔥</div>
            <h2 class="milestone-title" id="milestone-title">7-Day Streak!</h2>
            <p class="milestone-sub" id="milestone-sub">You've shown up 7 days in a row. That's discipline.</p>
            <div class="milestone-actions">
              <button class="btn btn-primary" onclick="_shareStreak()">Share 🚀</button>
              <button class="btn btn-ghost" onclick="dismissMilestone()">Keep Going →</button>
            </div>
          </div>
        </div>`);
    }
    document.getElementById('milestone-emoji').textContent = m.emoji;
    document.getElementById('milestone-title').textContent = m.title;
    document.getElementById('milestone-sub').textContent   = m.sub;
    document.getElementById('streak-milestone-modal').classList.remove('hidden');
  }, 1400);
}

function dismissMilestone() {
  const modal = document.getElementById('streak-milestone-modal');
  if (modal) modal.classList.add('hidden');
}

function _shareStreak() {
  const streak = Storage.loadStreak();
  const text   = `🔥 ${streak.current} days of daily practice on Donnibo! Consistency makes the difference. Try it: https://donnibo.app`;
  if (navigator.share) {
    navigator.share({ text }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(text).then(() => alert('Copied to clipboard!')).catch(() => {});
  }
}

// ── Navigation Drawer ─────────────────────────────────────────────────────────

function _openDrawer() {
  const drawer = document.getElementById('app-drawer');
  if (!drawer) return;
  drawer.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Update drawer user footer
  const footer = document.getElementById('drawer-footer');
  if (footer && state.user) {
    footer.textContent = state.user.name || state.user.email || '';
  }
}

function _closeDrawer() {
  document.getElementById('app-drawer')?.classList.remove('open');
  document.body.style.overflow = '';
}

// Close goal menus on any outside click
document.addEventListener('click', _closeAllGoalMenus);
