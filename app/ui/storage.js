// storage.js — DecaShift v2 — localStorage-first, silent remote sync

const Storage = (() => {
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxrMOKGCQ3WyZ1SkHOUSUyb8xYy6iYCYSzjLH3r2rVkoQii6UrNYRuPaA0shSukRkj0SA/exec';

  const KEYS = {
    USER:     'decashift_user',
    USER_ID:  'decashift_user_id',
    SESSIONS: 'decashift_sessions',
    ACCOUNTS: 'decashift_accounts'
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

  // ── Auth accounts (email + passwordHash stored locally) ───────────────────

  async function hashPassword(password) {
    const data = new TextEncoder().encode(password + ':decashift-salt');
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function saveAccount(email, passwordHash, userId) {
    const accounts = loadAccounts();
    const idx = accounts.findIndex(a => a.email === email);
    const record = { email, passwordHash, userId, createdAt: new Date().toISOString() };
    if (idx >= 0) accounts[idx] = record; else accounts.push(record);
    localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(accounts));
  }

  function loadAccounts() {
    const raw = localStorage.getItem(KEYS.ACCOUNTS);
    return raw ? JSON.parse(raw) : [];
  }

  function findAccount(email) {
    return loadAccounts().find(a => a.email === email.toLowerCase()) || null;
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
    syncUserToRemote,
    saveSession, loadSessions, getLastSessionForGoal, clearSessionsForGoal,
    exportAsJSON, exportAsCSV
  };
})();
