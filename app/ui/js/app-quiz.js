// app-quiz.js — Quiz engine, timer, result screen, session save

// ── Quiz Entry ────────────────────────────────────────────────────────────────

const _GATED_DAYS = new Set(['wed', 'thu', 'fri']); // sets 3–5

function _isGatedGoal(goal) {
  return goal?.weekNum && _GATED_DAYS.has(goal?.weekDay);
}

// E-013: route an opened ?ch= challenge into its set (or degrade gracefully).
function _maybeStartPendingChallenge() {
  if (state.activeChallenge || !state.user) return;
  const ch = (typeof Challenge !== 'undefined') ? Challenge.pending() : null;
  if (!ch) return;
  Challenge.clear();  // consume — a refresh shouldn't replay it
  const goal = state.goals.find(g => g.id === ch.goalId);
  if (!goal || goal.id === 'daily-gk') return;  // unknown/locked/GK → just load home normally
  state.activeChallenge = ch;
  startGoal(ch.goalId);
}

async function startGoal(goalId) {
  const goal = state.goals.find(g => g.id === goalId);
  if (_isGatedGoal(goal) && state.user?.plan === 'expired') {
    await _showScreen('paywall');
    _setupPaywall();
    return;
  }

  state.selectedGoal      = goal;
  state.filteredQuestions = state.questions.filter(q => q.goalId === goalId);
  state.currentIndex      = 0;
  state.responses         = [];
  // E-012: one random question per set is the Lucky Question (2× XP)
  state.luckyIndex        = state.filteredQuestions.length ? Math.floor(Math.random() * state.filteredQuestions.length) : -1;
  state.sessionId         = crypto.randomUUID();
  state.sessionStart      = new Date().toISOString();

  await _showScreen('quiz');

  // D-005: Challenge banner — beat your last score
  const _lastSess   = Storage.getLastSessionForGoal(goalId);
  const _bannerEl   = document.getElementById('quiz-challenge-banner');
  if (_bannerEl) {
    if (!_lastSess) {
      _bannerEl.innerHTML = `<strong>First time here.</strong> No pressure — just see where you start.`;
    } else {
      const pct = Math.round((_lastSess.score / _lastSess.total) * 100);
      if (pct >= 90) {
        _bannerEl.innerHTML = `<strong>Personal best: ${_lastSess.score}/${_lastSess.total} (${pct}%).</strong> Can you match it today?`;
      } else {
        _bannerEl.innerHTML = `<strong>Last time: ${_lastSess.score}/${_lastSess.total}.</strong> Can you beat it today?`;
      }
    }
    _bannerEl.classList.add('visible');
  }

  // E-013: a friend challenge overrides the beat-your-last-score banner
  if (_bannerEl && state.activeChallenge && state.activeChallenge.goalId === goalId) {
    const ch = state.activeChallenge;
    _bannerEl.innerHTML = `<strong>⚔ ${_esc(ch.name)} challenged you</strong> — beat ${ch.score}/${ch.total}!`;
    _bannerEl.classList.add('visible');
  }

  _renderQuestion();
}

function _renderQuestion() {
  const q     = state.filteredQuestions[state.currentIndex];
  const total = state.filteredQuestions.length;

  state.questionStart       = new Date().toISOString();
  state.selectedAnswerIndex = null;

  document.getElementById('quiz-progress-text').textContent = `Question ${state.currentIndex + 1} of ${total}`;
  document.getElementById('quiz-progress-fill').style.width = `${(state.currentIndex / total) * 100}%`;

  const _firstName   = _getFirstName(state.user);
  const _personalise = str => str.replace(/\{\{userName\}\}/g, _firstName);

  document.getElementById('question-text').textContent = _personalise(q.question);

  // E-012: reveal the Lucky Question tag (anticipation before answering)
  const luckyTag = document.getElementById('lucky-tag');
  if (luckyTag) luckyTag.classList.toggle('hidden', state.currentIndex !== state.luckyIndex);

  document.getElementById('answer-list').innerHTML = q.options.map((opt, i) => `
    <div class="answer-card" data-idx="${i}" onclick="_selectAnswer(${i})">
      <span class="answer-label">${String.fromCharCode(65 + i)}</span>
      <span class="answer-text">${_esc(_personalise(opt))}</span>
    </div>`).join('');

  document.getElementById('explanation-box').classList.add('hidden');
  document.getElementById('submit-btn').disabled = true;
  document.getElementById('submit-btn').classList.remove('hidden');
  document.getElementById('next-btn').classList.add('hidden');

  const timerBadge = document.getElementById('timer-display');
  const timerBtn   = document.getElementById('timer-toggle-btn');
  if (timerBadge) timerBadge.classList.toggle('hidden', !state.timerEnabled);
  if (timerBtn) {
    timerBtn.textContent = state.timerEnabled ? '⏱ Tracking time' : '⏱ Timer off';
    timerBtn.classList.toggle('active', state.timerEnabled);
  }

  _startTimer();
}

function _selectAnswer(index) {
  state.selectedAnswerIndex = index;
  if (typeof Feedback !== 'undefined') Feedback.play('tap');  // E-008
  document.querySelectorAll('.answer-card').forEach(c => c.classList.remove('selected'));
  document.querySelector(`.answer-card[data-idx="${index}"]`).classList.add('selected');
  document.getElementById('submit-btn').disabled = false;
}

function submitAnswer() {
  if (state.selectedAnswerIndex === null) return;
  _stopTimer();

  document.getElementById('quiz-challenge-banner')?.classList.remove('visible');

  const q  = state.filteredQuestions[state.currentIndex];
  const s  = state.selectedAnswerIndex;
  const ok = s === q.correctIndex;
  const isLucky = state.currentIndex === state.luckyIndex;  // E-012

  if (typeof Feedback !== 'undefined') {
    if (ok && isLucky) { Feedback.hit('reward'); Feedback.confetti({ count: 50 }); }  // E-012 crit
    else Feedback.hit(ok ? 'correct' : 'wrong');  // E-008
  }

  state.responses.push({
    questionId: q.id, selectedIndex: s, correctIndex: q.correctIndex,
    isCorrect: ok, lucky: isLucky,
    explanation: q.explanation || null,
    correctOptionText: q.options[q.correctIndex] || null,
    startTime: state.questionStart, endTime: new Date().toISOString(),
    durationSeconds: state.timerSeconds
  });

  const _CORRECT_LINES = ['Sharp.', 'Exactly right.', 'Nailed it.', 'Well done.', 'Correct!', 'Right on.'];
  const _WRONG_PREFIX  = `<em>This one trips a lot of students — here's exactly why:</em><br><br>`;

  document.querySelectorAll('.answer-card').forEach(card => {
    const i = parseInt(card.dataset.idx, 10);
    if (i === q.correctIndex) {
      card.classList.add('correct');
      if (ok) card.classList.add('correct-bounce');
    } else if (i === s && !ok) {
      card.classList.add('incorrect');
    }
    card.onclick = null;
  });

  const flash = document.getElementById('feedback-flash');
  if (flash) {
    if (ok) {
      flash.textContent = isLucky
        ? '✨ Lucky! Double XP on this one.'
        : _CORRECT_LINES[state.currentIndex % _CORRECT_LINES.length];
      flash.className   = isLucky ? 'feedback-flash flash-correct flash-lucky' : 'feedback-flash flash-correct';
      setTimeout(() => flash.classList.add('flash-fade'), 1400);
    } else {
      flash.innerHTML = '';
      flash.className = 'feedback-flash hidden';
    }
  }

  if (q.explanation) {
    const box  = document.getElementById('explanation-box');
    const _fn2 = _getFirstName(state.user);
    const text = q.explanation.replace(/\{\{userName\}\}/g, _fn2);
    box.innerHTML  = ok ? _esc(text) : _WRONG_PREFIX + _esc(text);
    box.className  = ok ? 'explanation-box explanation-correct' : 'explanation-box explanation-wrong';
  } else if (!ok) {
    const box = document.getElementById('explanation-box');
    box.innerHTML = _WRONG_PREFIX + 'The correct answer is highlighted above.';
    box.className = 'explanation-box explanation-wrong';
  }

  document.getElementById('submit-btn').classList.add('hidden');
  document.getElementById('next-btn').classList.remove('hidden');
}

function nextQuestion() {
  state.currentIndex++;
  state.currentIndex >= state.filteredQuestions.length ? _showResult() : _renderQuestion();
}

// ── Timer ─────────────────────────────────────────────────────────────────────

function toggleTimer() {
  state.timerEnabled = !state.timerEnabled;
  localStorage.setItem('decashift_timer', state.timerEnabled ? 'on' : 'off');
  const timerBadge = document.getElementById('timer-display');
  const timerBtn   = document.getElementById('timer-toggle-btn');
  if (timerBadge) timerBadge.classList.toggle('hidden', !state.timerEnabled);
  if (timerBtn) {
    timerBtn.textContent = state.timerEnabled ? '⏱ Tracking time' : '⏱ Timer off';
    timerBtn.classList.toggle('active', state.timerEnabled);
  }
}

function _startTimer() {
  clearInterval(state.timerInterval);
  state.timerSeconds = 0;
  _updateTimerDisplay();
  state.timerInterval = setInterval(() => { state.timerSeconds++; _updateTimerDisplay(); }, 1000);
}

function _stopTimer() { clearInterval(state.timerInterval); state.timerInterval = null; }

function _updateTimerDisplay() {
  const el = document.getElementById('timer-display');
  if (el) el.textContent = String(Math.floor(state.timerSeconds / 60)).padStart(2, '0') + ':' + String(state.timerSeconds % 60).padStart(2, '0');
}

// ── D-002: Personalized win message ──────────────────────────────────────────

function _buildWinMessage(correct, total, pct, goal, prevSessions) {
  const topic = goal.conceptId
    ? _conceptLabel(goal.conceptId)
    : (goal.description ? goal.description.split('—')[0].split('·')[0].trim() : goal.name);

  // First ever session on this goal
  if (!prevSessions.length) {
    if (pct >= 70) return `<strong>Strong start.</strong> ${correct}/${total} on your first ${_esc(topic)} session. Come back tomorrow — your next attempt will be better.`;
    if (pct >= 50) return `<strong>First session done.</strong> ${correct}/${total} on ${_esc(topic)}. Every expert started exactly here.`;
    return `<strong>First time here.</strong> ${correct}/${total} on ${_esc(topic)}. This is the starting point — most students double their score by session 3.`;
  }

  const prevBest  = Math.max(...prevSessions.map(s => s.score));
  const lastScore = prevSessions[prevSessions.length - 1]?.score ?? 0;
  const lastPct   = Math.round(((prevSessions[prevSessions.length - 1]?.accuracy ?? 0) * 100));
  const n         = prevSessions.length + 1;

  // New personal best
  if (correct > prevBest) {
    return `<strong>New personal best!</strong> ${correct}/${total} — the highest you've ever scored on ${_esc(topic)}.`;
  }
  // Consistent excellence
  if (pct >= 90 && lastPct >= 80) {
    return `<strong>${pct}% accuracy.</strong> You know ${_esc(topic)} cold. ${n} session${n !== 1 ? 's' : ''} and you're consistently at the top.`;
  }
  // Improved from last
  if (correct > lastScore) {
    return `<strong>Better than last time.</strong> ${correct}/${total} today vs ${lastScore}/${total} before — up ${pct - lastPct}% on ${_esc(topic)}.`;
  }
  // Solid but room to grow
  if (pct >= 60) {
    return `<strong>${correct}/${total} — solid.</strong> Your best on ${_esc(topic)} is ${prevBest}/${total}. You've done this ${n} time${n !== 1 ? 's' : ''}. Keep pushing.`;
  }
  // Struggling — encourage without lying
  return `<strong>${correct}/${total} today.</strong> ${_esc(topic)} is a tough one — but ${n} session${n !== 1 ? 's' : ''} in, you're building the foundation. Consistency is what moves the needle.`;
}

// ── D-003: Accuracy trend (this week vs last week) ────────────────────────────

function _weekBounds(offsetWeeks = 0) {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const msPerDay = 864e5;
  const monday = new Date(now - ((day === 0 ? 6 : day - 1) * msPerDay + now % msPerDay));
  monday.setHours(0, 0, 0, 0);
  const start = new Date(monday - offsetWeeks * 7 * msPerDay);
  const end   = new Date(start.getTime() + 7 * msPerDay);
  return { start, end };
}

function _avgAccuracy(sessions) {
  if (!sessions.length) return null;
  return Math.round(sessions.reduce((s, r) => s + (r.accuracy ?? 0), 0) / sessions.length * 100);
}

function _buildTrendBlock(goalId, currentSessionId) {
  const all = Storage.loadSessions().filter(s => s.goalId === goalId);
  const thisW = _weekBounds(0);
  const lastW = _weekBounds(1);

  const thisSessions = all.filter(s => {
    const d = new Date(s.sessionStart);
    return d >= thisW.start && d < thisW.end;
  });
  const lastSessions = all.filter(s => {
    const d = new Date(s.sessionStart);
    return d >= lastW.start && d < lastW.end;
  });

  const thisPct = _avgAccuracy(thisSessions);
  const lastPct = _avgAccuracy(lastSessions);

  if (thisPct === null) return '';

  const bar = pct => {
    const filled = Math.round(pct / 10);
    return '█'.repeat(filled) + '░'.repeat(10 - filled);
  };

  if (lastPct === null) {
    return `<div class="trend-block">
      <div class="trend-row"><span class="trend-label">This week</span><span class="trend-bar">${bar(thisPct)}</span><span class="trend-pct">${thisPct}%</span></div>
      <div class="trend-note">First week — come back next week to see your improvement.</div>
    </div>`;
  }

  const delta = thisPct - lastPct;
  const arrow = delta > 0 ? `↑ ${delta}% improvement` : delta < 0 ? `↓ ${Math.abs(delta)}% from last week` : '→ Same as last week';
  const arrowClass = delta > 0 ? 'trend-up' : delta < 0 ? 'trend-down' : 'trend-flat';

  return `<div class="trend-block">
    <div class="trend-row"><span class="trend-label">This week</span><span class="trend-bar">${bar(thisPct)}</span><span class="trend-pct">${thisPct}%</span></div>
    <div class="trend-row"><span class="trend-label">Last week</span><span class="trend-bar">${bar(lastPct)}</span><span class="trend-pct">${lastPct}%</span></div>
    <div class="trend-delta ${arrowClass}">${arrow}</div>
  </div>`;
}

// ── D-004: WhatsApp share card ────────────────────────────────────────────────

function _buildShareText(correct, total, pct, goal, streak) {
  const name  = _getFirstName(state.user);
  const grade = state.user?.grade ? 'Grade ' + state.user.grade : '';
  const topic = goal.conceptId
    ? _conceptLabel(goal.conceptId)
    : (goal.description ? goal.description.split('—')[0].split('·')[0].trim() : goal.name);

  const streakLine = streak.current >= 2
    ? `${streak.current} days of daily practice on Donnibo`
    : 'Daily practice on Donnibo';

  const gradeLine = grade ? `${grade} · ${topic}` : topic;

  return `🏆 ${name}'s Daily Practice\n${gradeLine}\nScore: ${correct}/${total} · Accuracy: ${pct}%\n\n${streakLine}\ndonnibo.app`;
}

async function _shareResult(correct, total, pct, goal) {
  const streak = Storage.loadStreak();
  const text   = _buildShareText(correct, total, pct, goal, streak);
  if (navigator.share) {
    try { await navigator.share({ text }); return; } catch (e) { /* fall through */ }
  }
  // Fallback: WhatsApp URL
  window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
}

// ── E-013: friend challenge share ─────────────────────────────────────────────

function _shareChallenge(goalId, score, total) {
  const name = _getFirstName(state.user);
  const link = Challenge.link({ goalId, score, total, name });
  const text = `⚔ ${name} scored ${score}/${total} on Donnibo and challenges YOU to beat it!\n${link}`;
  if (navigator.share) {
    navigator.share({ text }).catch(() => {});
  } else {
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
  }
}

// Head-to-head block when the finished set came from a friend's challenge.
function _renderChallengeResult(myScore, total) {
  const el = document.getElementById('result-challenge');
  if (!el) return;
  const ch = state.activeChallenge;
  if (!ch || ch.goalId !== state.selectedGoal.id) { el.innerHTML = ''; return; }

  const them = ch.score, theirTotal = ch.total || total;
  let verdict, cls;
  if (myScore > them)       { verdict = 'You won! 🎉';                       cls = 'h2h-win'; }
  else if (myScore === them) { verdict = `Dead tie with ${ch.name}! 🤝`;     cls = 'h2h-tie'; }
  else                       { verdict = `So close — ${ch.name} edged it`;   cls = 'h2h-lose'; }

  el.innerHTML = `
    <div class="h2h ${cls}">
      <div class="h2h-verdict">${_esc(verdict)}</div>
      <div class="h2h-rows">
        <div class="h2h-row h2h-you"><span>You</span><strong>${myScore}/${total}</strong></div>
        <div class="h2h-vs">vs</div>
        <div class="h2h-row"><span>${_esc(ch.name)}</span><strong>${them}/${theirTotal}</strong></div>
      </div>
      <button class="btn btn-challenge" id="rematch-btn">⚔ Counter-Challenge</button>
    </div>`;
  const rematch = document.getElementById('rematch-btn');
  if (rematch) rematch.onclick = () => _shareChallenge(ch.goalId, myScore, total);

  if (myScore > them && typeof Feedback !== 'undefined') {
    Feedback.confetti({ count: 70, colors: ['#7c3aed', '#22d3ee', '#f59e0b'] });
  }

  state.activeChallenge = null;  // consume — don't replay on restart/back
}

// ── Result Screen ─────────────────────────────────────────────────────────────

async function _showResult() {
  const correct = state.responses.filter(r => r.isCorrect).length;
  const total   = state.responses.length;
  const pct     = total ? Math.round((correct / total) * 100) : 0;

  const session = {
    sessionId: state.sessionId, userId: state.user.userId, goalId: state.selectedGoal.id,
    sessionStart: state.sessionStart, sessionEnd: new Date().toISOString(),
    totalDurationSeconds: state.responses.reduce((s, r) => s + r.durationSeconds, 0),
    responses: state.responses, score: correct, total, accuracy: total ? correct / total : 0
  };

  Storage.saveSession(session);
  const xpResult = (typeof XP !== 'undefined') ? XP.awardSession(session) : null;  // E-005
  const updatedStreak = Storage.updateStreak();
  _checkStreakMilestone(updatedStreak);
  _checkRewardMilestones(updatedStreak);
  checkAndShowInstallPrompt();

  if (state.selectedGoal.id === 'daily-gk') {
    _markDailyGKDone();
    _loadTodayFact().then(fact => { if (fact) setTimeout(() => _showTodayFactModal(fact), 1200); });
  }
  const banner = document.getElementById('first-session-banner');
  if (banner) banner.classList.toggle('hidden', Storage.loadSessions().length !== 1);

  const acct = Storage.findAccount(state.user.loginId || state.user.email);  // BUG-030: loginId, not removed email
  if (acct) {
    Storage.syncAccountToDrive({
      ...state.user, passwordHash: acct.passwordHash, streak: updatedStreak
    }).catch(() => {});
  }
  Storage.syncUserToRemote(state.user).catch(() => {});

  await _showScreen('result');

  document.getElementById('result-score').textContent = correct + ' / ' + total;
  document.getElementById('result-pct').textContent   = pct + '%';

  const badge = document.getElementById('result-badge');
  if (pct >= 80) {
    badge.textContent = 'Excellent'; badge.className = 'result-badge badge-excellent';
  } else if (pct >= 60) {
    badge.textContent = 'Good'; badge.className = 'result-badge badge-good';
  } else {
    badge.textContent = 'Keep Going 💪'; badge.className = 'result-badge badge-needs-work';
  }

  const winMsgEl = document.getElementById('result-win-message');
  if (winMsgEl) {
    const prevSessions = Storage.loadSessions()
      .filter(s => s.goalId === state.selectedGoal.id && s.sessionId !== session.sessionId);
    winMsgEl.innerHTML = _buildWinMessage(correct, total, pct, state.selectedGoal, prevSessions);
  }

  _renderChallengeResult(correct, total);  // E-013: head-to-head if this was a challenge

  const trendEl = document.getElementById('result-trend');
  if (trendEl) trendEl.innerHTML = _buildTrendBlock(state.selectedGoal.id, session.sessionId);

  document.getElementById('result-table-body').innerHTML = state.filteredQuestions.map((q, i) => {
    const r = state.responses[i];
    const mainRow = r.isCorrect
      ? `<tr>
          <td>${i + 1}</td>
          <td class="q-text">${_esc(q.question.length > 60 ? q.question.slice(0, 60) + '…' : q.question)}</td>
          <td class="correct">✓</td>
          <td class="time-cell">${r.durationSeconds}s</td>
        </tr>`
      : `<tr class="result-row-wrong" onclick="_toggleResultRow(${i})" title="Tap to see explanation">
          <td>${i + 1}</td>
          <td class="q-text">${_esc(q.question.length > 60 ? q.question.slice(0, 60) + '…' : q.question)}</td>
          <td class="incorrect">✗ ›</td>
          <td class="time-cell">${r.durationSeconds}s</td>
        </tr>`;
    const detailRow = !r.isCorrect
      ? `<tr class="result-row-detail hidden" id="result-row-detail-${i}">
          <td colspan="4" class="result-row-explanation">
            <strong>Correct answer:</strong> ${_esc(r.correctOptionText || '')}
            ${r.explanation ? `<br><span class="result-row-expl-text">${_esc(r.explanation)}</span>` : ''}
          </td>
        </tr>`
      : '';
    return mainRow + detailRow;
  }).join('');

  const shareBtn = document.getElementById('result-share-btn');
  if (shareBtn) shareBtn.onclick = () => _shareResult(correct, total, pct, state.selectedGoal);

  // E-013: challenge a friend to beat this set (not for the date-specific daily GK)
  const challengeBtn = document.getElementById('result-challenge-btn');
  if (challengeBtn) {
    const challengeable = typeof Challenge !== 'undefined' && state.selectedGoal.id !== 'daily-gk';
    challengeBtn.style.display = challengeable ? '' : 'none';
    if (challengeable) challengeBtn.onclick = () => _shareChallenge(state.selectedGoal.id, correct, total);
  }

  document.getElementById('restart-btn').onclick = () => {
    if (state.selectedGoal.id === 'daily-gk') _startDailyGK();
    else startGoal(state.selectedGoal.id);
  };
  document.getElementById('back-home-btn').onclick = async () => {
    await _showScreen('home');
    _renderHome();
  };

  // E-008: celebrate a perfect set (level-up/evolution sounds handled below)
  if (typeof Feedback !== 'undefined') {
    if (pct >= 100) { Feedback.confetti({ count: 90 }); Feedback.hit('reward'); }
    else if (pct >= 60) { Feedback.play('complete'); }
  }

  // E-005: +XP on result + level-up celebration
  const xpEl = document.getElementById('result-xp');
  if (xpEl && xpResult && xpResult.gained > 0) {
    const lv = XP.levelFromXP(xpResult.total);
    xpEl.innerHTML = `<span class="result-xp-gain">+${xpResult.gained} XP</span>` +
      `<span class="result-xp-level">Level ${lv.level} · ${lv.xpIntoLevel}/${lv.xpForNext}</span>`;
  } else if (xpEl) {
    xpEl.innerHTML = '';
  }
  if (xpResult && xpResult.leveledUp) {
    const evolved = typeof Avatar !== 'undefined' &&
      Avatar.stageFromLevel(xpResult.toLevel) > Avatar.stageFromLevel(xpResult.fromLevel);
    if (evolved && typeof _showEvolution === 'function') {
      setTimeout(() => _showEvolution(xpResult.toLevel), 700);
    } else if (typeof _showLevelUp === 'function') {
      setTimeout(() => _showLevelUp(xpResult.toLevel), 700);
    }
  }

  // E-010: queue a mystery box for streak/level milestones (after any celebration)
  if (typeof _maybeOpenMysteryBox === 'function') _maybeOpenMysteryBox({ streak: updatedStreak, xpResult });

  _renderNextLevelPrompt(state.selectedGoal);
}

// ── D-008: Next-level prompt ──────────────────────────────────────────────────

function _renderNextLevelPrompt(goal) {
  const el = document.getElementById('result-next-level');
  if (!el || !goal.conceptId || goal.conceptId === 'practice') return;

  const allSessions = Storage.loadSessions();
  const conceptGoals = state.goals.filter(g =>
    g.conceptId === goal.conceptId && g.subject === goal.subject
  );
  const conceptGoalIds = new Set(conceptGoals.map(g => g.id));
  const conceptSessions = allSessions.filter(s => conceptGoalIds.has(s.goalId));

  if (conceptSessions.length < 3) return;
  const avgAcc = conceptSessions.reduce((s, r) => s + (r.accuracy ?? 0), 0) / conceptSessions.length;
  if (avgAcc < 0.70) return;

  const allGoals = state.goals.filter(g => g.subject === goal.subject && g.weekNum);
  const maxWeekForConcept = Math.max(...conceptGoals.map(g => g.weekNum || 0));
  const nextConceptGoals = allGoals.filter(g =>
    g.conceptId && g.conceptId !== goal.conceptId && (g.weekNum || 0) > maxWeekForConcept
  );
  if (!nextConceptGoals.length) return;

  const nextGoal  = nextConceptGoals.sort((a, b) => (a.weekNum || 0) - (b.weekNum || 0))[0];
  const topic     = typeof _conceptLabel === 'function' ? _conceptLabel(goal.conceptId) : goal.conceptId;
  const nextTopic = typeof _conceptLabel === 'function' ? _conceptLabel(nextGoal.conceptId) : nextGoal.name;
  const n         = conceptSessions.length;
  const pctDisplay = Math.round(avgAcc * 100);

  el.innerHTML = `<div class="next-level-card">
    <div class="next-level-label">⬆ You're Ready for Next Level</div>
    <p class="next-level-msg">You've done <strong>${_esc(topic)}</strong> ${n} times with <strong>${pctDisplay}% accuracy</strong>. Time to move on.</p>
    <p class="next-level-next">Next up: <strong>${_esc(nextTopic)}</strong></p>
    <div class="next-level-actions">
      <button class="btn btn-primary btn-sm" onclick="startGoal('${nextGoal.id}')">Start ${_esc(nextTopic)} →</button>
      <button class="btn btn-ghost btn-sm" onclick="this.closest('.next-level-card').remove()">Stay here</button>
    </div>
  </div>`;
}

function _toggleResultRow(i) {
  const row = document.getElementById('result-row-detail-' + i);
  if (row) row.classList.toggle('hidden');
}
