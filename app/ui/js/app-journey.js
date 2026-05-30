// app-journey.js — E-007 "My Journey" profile screen
// The kid's identity surface: evolving avatar, level + XP, streak, lifetime stats,
// concept mastery (D-012/D-017), badges, and a growth replay. Renders offline from
// existing session history + xp.js + avatar.js. No remote dependency.

async function openJourney() {
  document.getElementById('user-menu')?.classList.add('hidden');
  if (typeof _closeDrawer === 'function') _closeDrawer();
  await _showScreen('journey');
  _renderJourney();
}

async function closeJourney() {
  await _showScreen('home');
  _renderHome();
}

function _journeyLevel() {
  const total = (typeof XP !== 'undefined') ? XP.getTotalXP() : 0;
  return (typeof XP !== 'undefined')
    ? XP.levelFromXP(total)
    : { level: 1, pct: 0, xpIntoLevel: 0, xpForNext: 100, totalXP: 0 };
}

function _renderJourney() {
  const user = state.user;
  if (!user) return;

  const lv = _journeyLevel();

  // Avatar + stage
  const img = document.getElementById('journey-avatar-img');
  if (img && typeof Avatar !== 'undefined') {
    img.src = Avatar.fileFor(lv.level);
    img.onerror = () => { img.style.display = 'none'; };
  }
  const stageName = (typeof Avatar !== 'undefined') ? Avatar.stageInfo(lv.level).name : '';
  const stageEl = document.getElementById('journey-stage');
  if (stageEl) stageEl.textContent = stageName;
  const lvEl = document.getElementById('journey-level');
  if (lvEl) lvEl.textContent = 'Level ' + lv.level;

  // Level ring
  const circ = 2 * Math.PI * 54;
  const ring = document.getElementById('journey-ring-fill');
  if (ring) {
    ring.style.strokeDasharray  = String(circ);
    ring.style.strokeDashoffset = String(circ * (1 - lv.pct));
  }

  // XP bar
  const xpFill = document.getElementById('journey-xpbar-fill');
  if (xpFill) xpFill.style.width = Math.round(lv.pct * 100) + '%';
  const xpText = document.getElementById('journey-xptext');
  if (xpText) xpText.textContent = `${lv.xpIntoLevel} / ${lv.xpForNext} XP to Level ${lv.level + 1}`;

  // Streak + freezes
  const streak = Storage.loadStreak();
  const streakEl = document.getElementById('journey-streak');
  if (streakEl) {
    streakEl.innerHTML =
      `<span class="journey-streak-pill">🔥 ${streak.current} day${streak.current === 1 ? '' : 's'}</span>` +
      `<span class="journey-streak-pill">Best ${streak.best}</span>` +
      ((streak.freezes || 0) > 0 ? `<span class="journey-streak-pill">🛡 ${streak.freezes}</span>` : '');
  }

  // Lifetime stats
  const sessions = Storage.loadSessions().filter(s => s.userId === user.userId);
  const totalQ   = sessions.reduce((a, s) => a + (s.total || 0), 0);
  const acc      = sessions.length
    ? Math.round(sessions.reduce((a, s) => a + (s.accuracy || 0), 0) / sessions.length * 100) : 0;
  const secs     = sessions.reduce((a, s) => a + (s.totalDurationSeconds || 0), 0);
  const timeStr  = secs < 3600 ? Math.round(secs / 60) + 'm' : (Math.round(secs / 360) / 10) + 'h';

  const tile = (val, label) =>
    `<div class="journey-stat"><div class="journey-stat-val">${val}</div><div class="journey-stat-key">${label}</div></div>`;
  const statsEl = document.getElementById('journey-stats');
  if (statsEl) {
    statsEl.innerHTML =
      tile(totalQ, 'questions') + tile(acc + '%', 'accuracy') +
      tile(sessions.length, 'sessions') + tile(timeStr, 'practiced');
  }

  _renderJourneyMastery(sessions);
  _renderJourneyBadges(sessions, streak, lv.level);
  _renderJourneyAlbum();
  _renderJourneyReplay(lv.level);
}

// E-011: sticker album — owned in colour, unowned as locked silhouettes
function _renderJourneyAlbum() {
  const el = document.getElementById('journey-album');
  if (!el || typeof Collectibles === 'undefined') return;

  const owned  = new Set(Collectibles.owned());
  const unseen = new Set(Collectibles.unseen());   // earned since last album view
  const pool   = Collectibles.POOL.slice().sort((a, b) =>
    Collectibles.RARITY_ORDER[a.rarity] - Collectibles.RARITY_ORDER[b.rarity]);

  const complete = owned.size === pool.length;
  el.innerHTML =
    `<div class="journey-section-title">Sticker Album <span class="journey-section-count">${owned.size}/${pool.length}</span>${complete ? '<span class="album-complete-tag">Complete! 🎉</span>' : ''}</div>` +
    `<div class="album-grid">` + pool.map(p => {
      const has = owned.has(p.id);
      return `<div class="album-cell rarity-${p.rarity}${has ? '' : ' locked'}" title="${_esc(has ? p.name : 'Locked — ' + p.earn)}">
        ${unseen.has(p.id) ? '<span class="album-new">NEW</span>' : ''}
        ${has ? `<img src="${Collectibles.fileFor(p.id)}" alt="${_esc(p.name)}">` : '<span class="album-lock">🔒</span>'}
        <span class="album-name">${has ? _esc(p.name) : '???'}</span>
        <span class="album-rarity">${p.rarity}</span>
      </div>`;
    }).join('') + `</div>`;

  // Celebrate first time the album is completed
  if (complete && localStorage.getItem('donnibo_album_done') !== 'true') {
    localStorage.setItem('donnibo_album_done', 'true');
    if (typeof Feedback !== 'undefined') { Feedback.confetti({ count: 100 }); Feedback.hit('reward'); }
  }

  // Mark all as seen now that they've been displayed (clears NEW on next view)
  if (unseen.size) Collectibles.markAllSeen();
}

// 6–10s growth replay: walks the avatar through every stage reached so far.
function _renderJourneyReplay(level) {
  const el = document.getElementById('journey-replay');
  if (!el || typeof Avatar === 'undefined') return;
  const curStage = Avatar.stageFromLevel(level);
  const reached  = Avatar.STAGES.slice(0, curStage + 1);
  el.innerHTML = `
    <div class="journey-section-title">Growth Replay</div>
    <div class="replay-stage">
      <img id="replay-img" src="${Avatar.fileFor(level)}" alt="">
      <div class="replay-name" id="replay-name">${Avatar.stageInfo(level).name}</div>
    </div>
    <div class="replay-track">
      ${reached.map((s, i) => `<span class="replay-dot${i === curStage ? ' active' : ''}" title="${s.name}"></span>`).join('')}
    </div>
    <button class="btn btn-ghost btn-sm replay-btn" onclick="_playJourneyReplay(${level})">▶ Replay my growth</button>`;
}

function _playJourneyReplay(level) {
  if (typeof Avatar === 'undefined') return;
  const curStage = Avatar.stageFromLevel(level);
  const img    = document.getElementById('replay-img');
  const nameEl = document.getElementById('replay-name');
  const dots   = Array.from(document.querySelectorAll('.replay-dot'));
  if (!img) return;

  // Reduced motion → jump straight to the final stage, no animation
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    img.src = Avatar.fileFor(level);
    if (nameEl) nameEl.textContent = Avatar.stageInfo(level).name;
    return;
  }

  let i = 0;
  const step = () => {
    if (i > curStage) return;
    const st = Avatar.STAGES[i];
    img.src = 'assets/avatar/' + st.file;
    img.classList.remove('replay-pop'); void img.offsetWidth; img.classList.add('replay-pop');
    if (nameEl) nameEl.textContent = st.name;
    dots.forEach((d, di) => d.classList.toggle('active', di === i));
    i++;
    if (i <= curStage) setTimeout(step, 1100);
  };
  step();
}

// D-012 "your best" + D-017 tier badges, per concept (topic)
function _renderJourneyMastery(sessions) {
  const el = document.getElementById('journey-mastery');
  if (!el || typeof Mastery === 'undefined') return;
  if (!sessions.length) { el.innerHTML = ''; return; }

  const byGoal = {};
  sessions.forEach(s => { (byGoal[s.goalId] = byGoal[s.goalId] || []).push(s); });

  const rows = Object.keys(byGoal).map(gid => {
    const gs   = byGoal[gid];
    const tier = Mastery.tierFor(gs);
    const st   = Mastery.statsFor(gs);
    const goal = state.goals.find(g => g.id === gid);
    const name = goal
      ? (goal.description ? goal.description.split('—')[0].split('·')[0].trim() : goal.name)
      : gid;
    const bestStr = st.best ? `${st.best.score}/${st.best.total}` : '—';
    return { tier, name, bestStr, count: st.count, rank: Mastery.rank(tier.id) };
  }).sort((a, b) => a.rank - b.rank).slice(0, 10);

  el.innerHTML = `<div class="journey-section-title">Concept Mastery</div>` +
    `<div class="mastery-list">` + rows.map(r => `
      <div class="mastery-row">
        <span class="mastery-name">${_esc(r.name)}</span>
        <span class="mastery-best">best ${r.bestStr} · ${r.count}×</span>
        <span class="mastery-tier mastery-${r.tier.id}">${r.tier.icon} ${r.tier.label}</span>
      </div>`).join('') + `</div>`;
}

function _journeyBadges(sessions, streak, level) {
  const perfect = sessions.filter(s => (s.accuracy || 0) >= 1).length;
  const hi80    = sessions.filter(s => (s.accuracy || 0) >= 0.8).length;
  return [
    { icon: '⚡', label: '7-day streak',  earned: streak.best >= 7 },
    { icon: '🌟', label: '14-day streak', earned: streak.best >= 14 },
    { icon: '🏆', label: '30-day streak', earned: streak.best >= 30 },
    { icon: '🎯', label: 'First 100%',    earned: perfect >= 1 },
    { icon: '✅', label: '5× over 80%',   earned: hi80 >= 5 },
    { icon: '🔼', label: 'Reach Level 5', earned: level >= 5 },
    { icon: '🚀', label: 'Reach Level 10',earned: level >= 10 },
    { icon: '📚', label: '10 sessions',   earned: sessions.length >= 10 },
    { icon: '💎', label: '50 sessions',   earned: sessions.length >= 50 },
  ];
}

function _renderJourneyBadges(sessions, streak, level) {
  const el = document.getElementById('journey-badges');
  if (!el) return;
  const badges = _journeyBadges(sessions, streak, level);
  const earnedCount = badges.filter(b => b.earned).length;
  el.innerHTML =
    `<div class="journey-section-title">Badges <span class="journey-section-count">${earnedCount}/${badges.length}</span></div>` +
    `<div class="badges-grid">` + badges.map(b => `
      <div class="badge-cell${b.earned ? '' : ' locked'}">
        <span class="badge-icon">${b.icon}</span>
        <span class="badge-label">${_esc(b.label)}</span>
      </div>`).join('') + `</div>`;
}

async function _shareJourney() {
  const lv     = _journeyLevel();
  const stage  = (typeof Avatar !== 'undefined') ? Avatar.stageInfo(lv.level).name : '';
  const streak = Storage.loadStreak();
  const user   = state.user;
  const name   = _getFirstName(user);
  const sessions = Storage.loadSessions().filter(s => s.userId === user?.userId);
  const totalQ = sessions.reduce((a, s) => a + (s.total || 0), 0);
  const acc    = sessions.length
    ? Math.round(sessions.reduce((a, s) => a + (s.accuracy || 0), 0) / sessions.length * 100) : 0;

  const text =
    `🌱 ${name}'s Donnibo journey\n` +
    `Level ${lv.level} · ${stage}\n` +
    `🔥 ${streak.current}-day streak (best ${streak.best})\n` +
    `${totalQ} questions · ${acc}% accuracy\n\n` +
    `See yourself grow — donnibo.app`;

  // E-015: share a branded image card; text is the fallback body.
  if (typeof ShareCard !== 'undefined') {
    try {
      const blob = await ShareCard.render({
        level: lv.level,
        headline: `${name}'s Journey`,
        sub: `Level ${lv.level} · ${stage}`,
        stat: `${streak.current}d streak · ${acc}%`,
        accent: '#7c3aed',
        fallbackChar: (name[0] || 'D').toUpperCase(),
      });
      await ShareCard.share(blob, text);
      return;
    } catch (e) { /* fall through to text share */ }
  }
  if (navigator.share) { navigator.share({ text }).catch(() => {}); }
  else window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
}
