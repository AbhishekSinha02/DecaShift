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
  _renderTodayCard();
  _renderRewardNotif();
  _renderPartnerFooter();

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
        const subjColor = (SUBJECT_STYLE[s] || {}).color || '';
        const activeStyle = (active && subjColor)
          ? ` style="background:${subjColor};border-color:${subjColor}"`
          : '';
        return `<button class="subject-tab${active}${extraClass}"${activeStyle} data-subject="${s}" onclick="_setSubjectFilter('${s}')">${label}</button>`;
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

  if (typeof state.weekOffset !== 'number') state.weekOffset = 0;
  const displayWeekNum = currentWeek + state.weekOffset;
  const _WEEK_LABELS   = ['2 Weeks Ago', 'Last Week', 'This Week'];
  const displayLabel   = _WEEK_LABELS[state.weekOffset + 2] || 'This Week';

  const displayGoals = weeklyFiltered
    .filter(g => g.weekNum === displayWeekNum)
    .sort((a, b) => _dayOrder(a.weekDay) - _dayOrder(b.weekDay));
  const canGoBack    = state.weekOffset > -2 && weeklyFiltered.some(g => g.weekNum === displayWeekNum - 1);
  const canGoForward = state.weekOffset < 0;

  const archivedSet   = new Set(user.archivedGoals || []);
  const activeGoals   = subFiltered.filter(g => !archivedSet.has(g.id));
  const archivedGoals = subFiltered.filter(g =>  archivedSet.has(g.id));

  if (!weeklyFiltered.length && !activeGoals.length && !archivedGoals.length) {
    if (!user.category) {
      list.innerHTML = '<p class="text-muted">Your profile is incomplete. <button class="link-btn" onclick="openEditProfile()">Complete your profile</button> to see your goals.</p>';
    } else {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-emoji">📚</div>
          <p class="empty-title">Content loading…</p>
          <p class="empty-sub">While you wait, try Today's GK or a Flash Drill!</p>
          <button class="btn btn-primary btn-sm" onclick="_startDrill('gk')">Today's GK →</button>
        </div>`;
    }
    return;
  }

  // ── Week nav + horizontal subject snap ──────────────────────────────────
  let html = '';

  if (displayGoals.length || state.weekOffset !== 0) {
    html += `
      <div class="week-nav-row">
        <button class="week-nav-btn" onclick="_weekNav(-1)"${!canGoBack?' disabled':''}>◀</button>
        <span class="week-badge${state.weekOffset===0?' active-week':''}">${displayLabel}</span>
        <button class="week-nav-btn" onclick="_weekNav(1)"${!canGoForward?' disabled':''}>▶</button>
      </div>`;

    if (!displayGoals.length) {
      html += `<p class="text-muted" style="padding:8px 0">No practice sets for ${displayLabel.toLowerCase()}.</p>`;
    } else {
      const bySubj = {};
      displayGoals.forEach(g => { const s = g.subject || 'general'; (bySubj[s] = bySubj[s] || []).push(g); });
      const subjKeys = Object.keys(bySubj);
      const isPast   = state.weekOffset < 0;

      if (subjKeys.length <= 1) {
        html += `<div class="day-cards-grid">${displayGoals.map(g => _dayCardHtml(g, isPast)).join('')}</div>`;
      } else {
        html += `<div class="subj-track" id="subj-track-main">`;
        subjKeys.forEach(s => {
          const st = SUBJECT_STYLE[s] || {};
          const lb = s === 'social-science' ? 'Soc. Sci.' : _cap(s);
          html += `<div class="subj-card"><div class="subj-card-head" style="color:${st.color||'var(--accent)'}"><span>${st.icon||'📚'}</span><span>${lb}</span></div><div class="day-cards-grid">${bySubj[s].map(g => _dayCardHtml(g, isPast)).join('')}</div></div>`;
        });
        html += `</div>`;
        html += `<div class="subj-dots" id="subj-dots">${subjKeys.map((s, i) => {
          const st = SUBJECT_STYLE[s] || {};
          return `<button class="subj-dot${i===0?' active':''}" data-color="${st.color||'var(--accent)'}" style="${i===0?`background:${st.color||'var(--accent)'}`:'background:var(--border)'}" onclick="_scrollToSubj(${i})" title="${s}"></button>`;
        }).join('')}</div>`;
      }
    }
  }

  // ── Regular practice goals ────────────────────────────────────────────────
  if (weeklyFiltered.length) {
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

  // Subject track scroll → update dots
  const subTrack = document.getElementById('subj-track-main');
  if (subTrack) {
    subTrack.addEventListener('scroll', () => {
      const idx = Math.round(subTrack.scrollLeft / subTrack.offsetWidth);
      document.querySelectorAll('.subj-dot').forEach((d, i) => {
        const active = i === idx;
        d.classList.toggle('active', active);
        d.style.background = active ? (d.dataset.color || 'var(--accent)') : 'var(--border)';
      });
    }, { passive: true });
  }
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

function _weekNav(delta) {
  state.weekOffset = Math.max(-2, Math.min(0, (state.weekOffset || 0) + delta));
  _renderHome();
}

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

function _renderTodayCard() {
  const el = document.getElementById('today-card-wrap');
  if (!el) return;

  const user = state.user;
  if (!user || user.category !== 'school') { el.innerHTML = ''; return; }

  const currentWeek = _getISOWeek(new Date());
  const today       = new Date();
  const dayNames    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const todayDay    = ['sun','mon','tue','wed','thu','fri','sat'][today.getDay()];

  const todayGoal = state.goals.find(g =>
    g.weekNum === currentWeek && g.weekDay === todayDay && g.subject === state.subjectFilter
  ) || state.goals.find(g =>
    g.weekNum === currentWeek && g.weekDay === todayDay
  );

  if (!todayGoal) { el.innerHTML = ''; return; }

  const qCount   = state.questions.filter(q => q.goalId === todayGoal.id).length;
  const last     = Storage.getLastSessionForGoal(todayGoal.id);
  const done     = last && last.accuracy >= 0.8;
  const dayLabel = dayNames[today.getDay()];
  const dateStr  = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  el.innerHTML = `
    <div class="today-card${done ? ' today-done' : ''}">
      <div class="today-card-top">
        <span class="today-badge">${_esc(dayLabel)} · ${dateStr}</span>
        ${done ? '<span class="today-done-badge">✅ Done</span>' : ''}
      </div>
      <div class="today-card-title">${_esc(todayGoal.name)}</div>
      <div class="today-card-footer">
        <span class="today-card-count">${qCount} questions</span>
        <button class="btn btn-primary btn-sm" onclick="startGoal('${todayGoal.id}')">
          ${done ? 'Redo' : last ? 'Continue →' : 'Start →'}
        </button>
      </div>
    </div>`;
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

  const el = document.getElementById('user-avatar');
  if (el) {
    el.textContent = letter;
    el.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
  }

  const streak = Storage.loadStreak().current;
  const circ   = 2 * Math.PI * 22;
  const fill   = document.getElementById('avatar-ring-fill');
  if (fill) {
    const progress = Math.min(streak / 7, 1);
    fill.style.strokeDashoffset = String(circ * (1 - progress));
    fill.style.stroke = streak >= 7 ? '#f59e0b' : '#3b82f6';
  }
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
