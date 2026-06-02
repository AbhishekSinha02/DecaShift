// storage.js — DecaShift v3 — localStorage-first, silent remote sync

const Storage = (() => {
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxrMOKGCQ3WyZ1SkHOUSUyb8xYy6iYCYSzjLH3r2rVkoQii6UrNYRuPaA0shSukRkj0SA/exec';

  const KEYS = {
    USER:     'decashift_user',
    USER_ID:  'decashift_user_id',
    SESSIONS: 'decashift_sessions',
    ACCOUNTS: 'decashift_accounts',
    STREAK:   'decashift_streak',
    THEME:    'decashift_theme',
    TIMER:    'decashift_timer'
  };

  // ── User identity ─────────────────────────────────────────────────────────

  function getOrCreateUserId() {
    let id = localStorage.getItem(KEYS.USER_ID);
    if (!id) {
      id = 'user_' + crypto.randomUUID().replace(/-/g, '').substring(0, 12);
      localStorage.setItem(KEYS.USER_ID, id);
    }
    return id;
  }

  function saveUser(user) {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  }

  function loadUser() {
    const raw = localStorage.getItem(KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  }

  function clearSession() {
    localStorage.removeItem(KEYS.USER);
  }

  // ── Auth accounts ─────────────────────────────────────────────────────────

  async function hashPassword(password) {
    const data = new TextEncoder().encode(password + ':decashift-salt');
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function _emailHash(email) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email.toLowerCase().trim()));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
  }

  function saveAccount(loginId, passwordHash, userId, userProfile = {}) {
    const accounts = loadAccounts();
    const idx = accounts.findIndex(a => a.loginId === loginId);
    const record = { loginId, passwordHash, userId, createdAt: new Date().toISOString(), ...userProfile };
    if (idx >= 0) accounts[idx] = record; else accounts.push(record);
    localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(accounts));
  }

  function loadAccounts() {
    const raw = localStorage.getItem(KEYS.ACCOUNTS);
    return raw ? JSON.parse(raw) : [];
  }

  function findAccount(loginId) {
    if (!loginId) return null;   // guard: undefined/null id must not throw (BUG-030)
    return loadAccounts().find(a => a.loginId === loginId.toLowerCase()) || null;
  }

  async function syncAccountToDrive(accountData) {
    if (!APPS_SCRIPT_URL) return;
    const lHash = await _emailHash(accountData.loginId);
    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'saveAccount', payload: { ...accountData, loginIdHash: lHash } })
    }).catch(() => {});
  }

  // Returns the account if Drive says found, null if Drive says not-found, and
  // THROWS on timeout / network error (so callers can tell "no account" apart
  // from "couldn't reach the server"). A bare fetch here used to hang sign-in
  // forever on a slow/unreachable endpoint — see BUG-028.
  async function fetchAccountFromDrive(loginId, timeoutMs = 8000) {
    if (!APPS_SCRIPT_URL) return null;
    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const lHash = await _emailHash(loginId);
      const r = await fetch(APPS_SCRIPT_URL + '?action=getAccount&loginIdHash=' + lHash, { signal: ctrl.signal });
      const data = await r.json();
      return data.found ? data.account : null;
    } finally {
      clearTimeout(timer);
    }
  }

  // ── Remote sync — silent, fire-and-forget ─────────────────────────────────

  function syncUserToRemote(user) {
    if (!APPS_SCRIPT_URL) return Promise.resolve({ success: false });
    return fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'saveUser', payload: user })
    })
    .then(r => r.json())
    .catch(() => ({ success: false }));
  }

  // ── Sessions ──────────────────────────────────────────────────────────────

  function saveSession(session) {
    const sessions = loadSessions();
    sessions.push(session);
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));

    if (APPS_SCRIPT_URL) {
      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'saveSession', payload: session })
      }).catch(() => {});
    }
  }

  function loadSessions() {
    const raw = localStorage.getItem(KEYS.SESSIONS);
    return raw ? JSON.parse(raw) : [];
  }

  function getLastSessionForGoal(goalId) {
    const all = loadSessions().filter(s => s.goalId === goalId);
    return all.length ? all[all.length - 1] : null;
  }

  function clearSessionsForGoal(goalId) {
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(loadSessions().filter(s => s.goalId !== goalId)));
  }

  // ── Streak ────────────────────────────────────────────────────────────────

  function loadStreak() {
    const raw = localStorage.getItem(KEYS.STREAK);
    const stored = raw ? JSON.parse(raw) : {};
    // E-004: freezes/freezeMilestone/savedByFreeze default in for old records
    return Object.assign(
      { current: 0, best: 0, lastDate: null, freezes: 0, freezeMilestone: 0, savedByFreeze: null },
      stored
    );
  }

  function saveStreak(streak) {
    localStorage.setItem(KEYS.STREAK, JSON.stringify(streak));
  }

  // E-004: kind streak — a single missed day is auto-covered by a banked freeze
  // instead of resetting. Freezes are earned at each 7-day milestone (cap 2).
  function updateStreak() {
    const today  = new Date().toISOString().slice(0, 10);
    const streak = loadStreak();
    if (streak.lastDate === today) return streak;

    const last      = streak.lastDate ? Date.parse(streak.lastDate) : null;
    const daysSince = last !== null ? Math.round((Date.parse(today) - last) / 86400000) : null;

    if (last === null || daysSince === 1) {
      // first ever activity, or a consecutive day
      streak.current = last === null ? 1 : streak.current + 1;
      streak.savedByFreeze = null;
    } else if (daysSince === 2 && streak.freezes > 0) {
      // exactly one day missed → spend a freeze, keep the streak alive (kindly)
      streak.freezes  -= 1;
      streak.current  += 1;
      streak.savedByFreeze = today;
    } else {
      // longer gap or no freeze → reset, but never punish (D-006 comeback handles tone)
      streak.current = 1;
      streak.savedByFreeze = null;
    }

    streak.best = Math.max(streak.best, streak.current);
    streak.lastDate = today;

    // earn freezes at each new 7-day milestone, capped at 2
    const milestone = Math.floor(streak.current / 7);
    if (milestone > streak.freezeMilestone) {
      streak.freezes = Math.min(2, streak.freezes + (milestone - streak.freezeMilestone));
      streak.freezeMilestone = milestone;
    }

    saveStreak(streak);
    return streak;
  }

  // E-010: bank a freeze from a mystery box (respects the cap-2)
  function grantFreeze() {
    const s = loadStreak();
    s.freezes = Math.min(2, (s.freezes || 0) + 1);
    saveStreak(s);
    return s.freezes;
  }

  // ── Export ────────────────────────────────────────────────────────────────

  function exportAsJSON(sessions) {
    _dl(new Blob([JSON.stringify(sessions, null, 2)], { type: 'application/json' }), `decashift-${Date.now()}.json`);
  }

  function exportAsCSV(sessions) {
    const h = ['sessionId','userId','goalId','score','total','accuracy'];
    const rows = sessions.map(s => h.map(k => `"${String(s[k]??'').replace(/"/g,'""')}"`).join(','));
    _dl(new Blob([[h.join(','),...rows].join('\n')], { type: 'text/csv' }), `decashift-${Date.now()}.csv`);
  }

  function _dl(blob, name) {
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: name });
    a.click(); URL.revokeObjectURL(a.href);
  }

  return {
    getOrCreateUserId, saveUser, loadUser, clearSession,
    hashPassword, saveAccount, findAccount,
    syncAccountToDrive, fetchAccountFromDrive,
    syncUserToRemote,
    saveSession, loadSessions, getLastSessionForGoal, clearSessionsForGoal,
    loadStreak, saveStreak, updateStreak, grantFreeze,
    exportAsJSON, exportAsCSV
  };
})();
