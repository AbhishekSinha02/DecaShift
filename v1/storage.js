// storage.js — v1 snapshot (v1.1) — localStorage namespaced to avoid collision with later versions

const Storage = (() => {
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxrMOKGCQ3WyZ1SkHOUSUyb8xYy6iYCYSzjLH3r2rVkoQii6UrNYRuPaA0shSukRkj0SA/exec';

  const V = 'v1';
  const KEYS = {
    USER:     `decashift_${V}_user`,
    USER_ID:  `decashift_${V}_user_id`,
    SESSIONS: `decashift_${V}_sessions`
  };

  function getOrCreateUserId() {
    let id = localStorage.getItem(KEYS.USER_ID);
    if (!id) {
      id = 'user_' + crypto.randomUUID().replace(/-/g, '').substring(0, 12);
      localStorage.setItem(KEYS.USER_ID, id);
    }
    return id;
  }

  function saveUser(user) { localStorage.setItem(KEYS.USER, JSON.stringify(user)); }
  function loadUser() { const r = localStorage.getItem(KEYS.USER); return r ? JSON.parse(r) : null; }

  async function syncUserToRemote(user) {
    if (!APPS_SCRIPT_URL) return { success: false, reason: 'no_endpoint' };
    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'saveUser', payload: user })
      });
      return await res.json();
    } catch (err) {
      return { success: false, reason: 'fetch_failed' };
    }
  }

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

  function loadSessions() { const r = localStorage.getItem(KEYS.SESSIONS); return r ? JSON.parse(r) : []; }
  function getLastSessionForGoal(goalId) { const a = loadSessions().filter(s => s.goalId === goalId); return a.length ? a[a.length - 1] : null; }
  function clearSessionsForGoal(goalId) { localStorage.setItem(KEYS.SESSIONS, JSON.stringify(loadSessions().filter(s => s.goalId !== goalId))); }

  function exportAsJSON(sessions) { _dl(new Blob([JSON.stringify(sessions, null, 2)], { type: 'application/json' }), `decashift-v1-${Date.now()}.json`); }
  function exportAsCSV(sessions) {
    const h = ['sessionId','userId','goalId','score','total','accuracy'];
    const rows = sessions.map(s => h.map(k => `"${String(s[k]??'').replace(/"/g,'""')}"`).join(','));
    _dl(new Blob([[h.join(','),...rows].join('\n')], { type: 'text/csv' }), `decashift-v1-${Date.now()}.csv`);
  }
  function _dl(blob, name) { const a = Object.assign(document.createElement('a'),{href:URL.createObjectURL(blob),download:name}); a.click(); }

  return { getOrCreateUserId, saveUser, loadUser, syncUserToRemote, saveSession, loadSessions, getLastSessionForGoal, clearSessionsForGoal, exportAsJSON, exportAsCSV };
})();
